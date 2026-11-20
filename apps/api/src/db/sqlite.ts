import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, renameSync, rmSync } from 'node:fs';
import { dirname } from 'node:path';
import type { ContentRepository, GrammarContent, StudyData } from '@quran-grammar/core';
import {
  ORDER_BY,
  TABLES_PARENT_FIRST,
  contentToRows,
  createSqlRepository,
  createTableStatements,
  type ContentRows,
  type SqlExecutor,
} from '@quran-grammar/core/db';
import type { ContentVersion } from './version';

export { ORDER_BY };

/**
 * Build a fresh SQLite database atomically (temporary file, then rename). The result is a plain
 * SQLite 3 file in rollback-journal (DELETE) mode, vacuumed, so expo-sqlite can open it directly.
 */
export function writeSqlite(
  file: string,
  studies: readonly StudyData[],
  grammar: GrammarContent,
  version: ContentVersion,
) {
  mkdirSync(dirname(file), { recursive: true });
  const temporary = `${file}.tmp-${process.pid}`;
  rmSync(temporary, { force: true });
  const db = new DatabaseSync(temporary);
  try {
    db.exec('pragma foreign_keys = on; pragma journal_mode = delete;');
    for (const statement of createTableStatements('sqlite')) db.exec(statement);
    const rows = contentToRows(studies, grammar);
    db.exec('begin');
    for (const table of TABLES_PARENT_FIRST) {
      const list = rows[table] as Record<string, string | number | null>[];
      if (!list.length) continue;
      const columns = Object.keys(list[0]);
      const insert = db.prepare(
        `insert into ${table} (${columns.join(', ')}) values (${columns.map(() => '?').join(', ')})`,
      );
      for (const row of list) insert.run(...columns.map((column) => row[column]));
    }
    const columns = Object.keys(version);
    db.prepare(
      `insert into content_version (id, ${columns.join(', ')}) values (1, ${columns.map(() => '?').join(', ')})`,
    ).run(...columns.map((column) => version[column as keyof ContentVersion]));
    db.exec('commit');
    const violations = db.prepare('pragma foreign_key_check').all();
    if (violations.length)
      throw new Error(`Foreign key violations: ${JSON.stringify(violations.slice(0, 3))}`);
    const integrity = db.prepare('pragma integrity_check').get() as { integrity_check: string };
    if (integrity.integrity_check !== 'ok')
      throw new Error(`Integrity check failed: ${integrity.integrity_check}`);
    db.exec('analyze');
    db.exec('vacuum');
  } catch (error) {
    db.close();
    rmSync(temporary, { force: true });
    throw error;
  }
  db.close();
  renameSync(temporary, file);
}

export function readSqlite(file: string): { rows: ContentRows; version: ContentVersion } {
  const db = new DatabaseSync(file, { readOnly: true });
  try {
    const rows = Object.fromEntries(
      (Object.keys(ORDER_BY) as (keyof ContentRows)[]).map((table) => [
        table,
        db.prepare(`select * from ${table} order by ${ORDER_BY[table]}`).all(),
      ]),
    ) as unknown as ContentRows;
    const version = db
      .prepare('select * from content_version where id = 1')
      .get() as unknown as ContentVersion & { id?: number };
    if (!version) throw new Error('content_version row is missing');
    delete version.id;
    return { rows, version };
  } finally {
    db.close();
  }
}

/** SqlExecutor over node:sqlite (the same SQL the mobile app runs through expo-sqlite). */
export function nodeSqliteExecutor(db: DatabaseSync): SqlExecutor {
  return {
    async all(sql, params) {
      return db.prepare(sql).all(...params) as Record<string, unknown>[];
    },
  };
}

/** Read-only repository over a SQLite content file (tests and local checks). */
export function openSqliteRepository(file: string): {
  repository: ContentRepository;
  close: () => void;
} {
  const db = new DatabaseSync(file, { readOnly: true });
  return { repository: createSqlRepository(nodeSqliteExecutor(db), 'sqlite'), close: () => db.close() };
}

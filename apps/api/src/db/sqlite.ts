import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, renameSync, rmSync } from 'node:fs';
import { dirname } from 'node:path';
import type { StudyData } from '@quran-grammar/core';
import { createTableStatements } from './schema';
import { studiesToRows, TABLES_PARENT_FIRST, type ContentRows } from './rows';
import type { ContentVersion } from './version';

/** Read order for every table; reproduces the bundled list order. */
export const ORDER_BY: Record<keyof ContentRows, string> = {
  surahs: 'number',
  ayahs: 'surah, number',
  rules: 'surah, position',
  roots: 'surah, position',
  words: 'surah, ayah, position',
  word_segments: 'word_id, position',
  word_rules: 'word_id, position',
  verb_forms: 'surah, position',
  phrases: 'surah, ayah, position',
  phrase_words: 'phrase_id, position',
};

/** Build a fresh SQLite database atomically (temporary file, then rename). */
export function writeSqlite(file: string, studies: readonly StudyData[], version: ContentVersion) {
  mkdirSync(dirname(file), { recursive: true });
  const temporary = `${file}.tmp-${process.pid}`;
  rmSync(temporary, { force: true });
  const db = new DatabaseSync(temporary);
  try {
    db.exec('pragma foreign_keys = on; pragma journal_mode = delete;');
    for (const statement of createTableStatements('sqlite')) db.exec(statement);
    const rows = studiesToRows(studies);
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

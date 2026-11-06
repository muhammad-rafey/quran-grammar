import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { studies } from '@quran-grammar/core';
import { contentSha256, rowsToStudies, studiesToRows } from './rows';
import { readSqlite, writeSqlite } from './sqlite';
import { buildPostgresSql, literal } from './postgres';
import { contentVersion } from './version';
import { POSTGRES_SCHEMA } from './schema';

test('row conversion is lossless, including list and key order', () => {
  const rows = studiesToRows(studies);
  assert.equal(rows.surahs.length, studies.length);
  assert.equal(
    rows.words.length,
    studies.reduce((total, study) => total + study.words.length, 0),
  );
  assert.equal(JSON.stringify(rowsToStudies(rows)), JSON.stringify(studies));
  const shuffled = Object.fromEntries(
    Object.entries(rows).map(([table, list]) => [table, [...list].reverse()]),
  ) as unknown as typeof rows;
  assert.equal(JSON.stringify(rowsToStudies(shuffled)), JSON.stringify(studies));
});

test('SQLite copy reproduces every lesson exactly and records its checksum', async (context) => {
  const directory = await mkdtemp(join(tmpdir(), 'quran-grammar-db-'));
  context.after(() => rm(directory, { recursive: true, force: true }));
  const file = join(directory, 'content.sqlite');
  const version = contentVersion(studies, 'test-commit', '2026-11-06T00:00:00.000Z');
  writeSqlite(file, studies, version);
  const copy = readSqlite(file);
  assert.equal(JSON.stringify(rowsToStudies(copy.rows)), JSON.stringify(studies));
  assert.equal(copy.version.content_sha256, contentSha256(studies));
  assert.equal(copy.version.source_commit, 'test-commit');
  assert.equal(copy.version.word_count, version.word_count);
  // Rebuilding replaces the previous file instead of appending duplicate rows.
  writeSqlite(file, studies, version);
  assert.equal(readSqlite(file).rows.words.length, version.word_count);
});

test('Postgres load script is one transaction with escaped literals in a private schema', () => {
  assert.equal(literal("it's"), "'it''s'");
  assert.equal(literal(null), 'null');
  assert.equal(literal(7), '7');
  assert.throws(() => literal(1.5));
  assert.throws(() => literal('a\u0000b'));
  const sql = buildPostgresSql(
    studies,
    contentVersion(studies, 'test', '2026-11-06T00:00:00.000Z'),
  );
  assert.match(sql, /^-- Generated/);
  assert.ok(sql.includes('\nbegin;\n') && sql.trimEnd().endsWith('commit;'));
  assert.ok(sql.includes(`create schema if not exists ${POSTGRES_SCHEMA};`));
  assert.ok(sql.includes(`revoke all on schema ${POSTGRES_SCHEMA} from public;`));
  assert.ok(!/\bgrant\b/i.test(sql), 'no grants to API roles');
  assert.ok(!/(^|\n)\s*(drop|delete)\b/i.test(sql), 'content is replaced with truncate only');
  assert.equal((sql.match(/^truncate /gm) ?? []).length, 1);
  const words = studies.reduce((total, study) => total + study.words.length, 0);
  const inserted = [
    ...sql.matchAll(/^insert into quran_grammar\.words \(.*\) values\n([\s\S]*?);$/gm),
  ]
    .map((match) => match[1].split('\n').length)
    .reduce((total, count) => total + count, 0);
  assert.equal(inserted, words);
});

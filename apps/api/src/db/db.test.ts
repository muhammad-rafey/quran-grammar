import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { DatabaseSync } from 'node:sqlite';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test, { after, before } from 'node:test';
import { createBundledRepository, getGrammarContent, studies } from '@quran-grammar/core/content';
import {
  POSTGRES_SCHEMA,
  contentToRows,
  rowsToGrammar,
  rowsToStudies,
  studiesToRows,
} from '@quran-grammar/core/db';
import { readSqlite, writeSqlite, openSqliteRepository } from './sqlite';
import { buildPostgresSql, literal } from './postgres';
import { contentSha256, contentVersion } from './version';
import { checkPostgresContent, createPostgresRepository, type Queryable } from '../postgres-repository';
import { postgresRoleSql } from './role';

const grammar = getGrammarContent();
const bundled = createBundledRepository({ studies, grammar });
let directory: string;
let file: string;
before(async () => {
  directory = await mkdtemp(join(tmpdir(), 'quran-grammar-db-'));
  file = join(directory, 'content.sqlite');
  writeSqlite(file, studies, grammar, contentVersion(studies, grammar, 'test-commit', '2026-11-06T00:00:00.000Z'));
});
after(() => rm(directory, { recursive: true, force: true }));

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

test('SQLite copy reproduces every lesson, topic and question exactly and records its checksum', () => {
  const version = contentVersion(studies, grammar, 'test-commit', '2026-11-06T00:00:00.000Z');
  const copy = readSqlite(file);
  assert.equal(JSON.stringify(rowsToStudies(copy.rows)), JSON.stringify(studies));
  assert.equal(JSON.stringify(rowsToGrammar(copy.rows)), JSON.stringify(grammar));
  assert.equal(copy.version.content_sha256, contentSha256(studies, grammar));
  assert.equal(copy.version.database_schema_version, 2);
  assert.equal(copy.version.source_commit, 'test-commit');
  assert.equal(copy.version.word_count, version.word_count);
  assert.equal(copy.rows.practice_questions.length, grammar.questions.length);
  // A plain rollback-journal file that expo-sqlite can import as an asset.
  const db = new DatabaseSync(file, { readOnly: true });
  assert.equal((db.prepare('pragma journal_mode').get() as { journal_mode: string }).journal_mode, 'delete');
  db.close();
  // Rebuilding replaces the previous file instead of appending duplicate rows.
  writeSqlite(file, studies, grammar, version);
  assert.equal(readSqlite(file).rows.words.length, version.word_count);
});

test('content checksum changes when topics or questions change', () => {
  const changed = { ...grammar, questions: grammar.questions.slice(1) };
  assert.notEqual(contentSha256(studies, changed), contentSha256(studies, grammar));
});

/** Compare every repository method against the bundled repository. */
async function assertSameAsBundled(label: string, repository: typeof bundled) {
  assert.deepEqual(await repository.listSurahs(), await bundled.listSurahs(), label);
  for (const surah of [1, 4, 36, 114]) {
    const [actual, expected] = [await repository.getStudy(surah), await bundled.getStudy(surah)];
    assert.equal(JSON.stringify(actual), JSON.stringify(expected), `${label} Surah ${surah}`);
  }
  assert.equal(await repository.getStudy(2), null);
  assert.equal(JSON.stringify(await repository.listTopics()), JSON.stringify(await bundled.listTopics()));
  for (const topic of grammar.topics.filter((_, index) => index % 10 === 0)) {
    assert.equal(
      JSON.stringify(await repository.getTopic(topic.id)),
      JSON.stringify(await bundled.getTopic(topic.id)),
      `${label} topic ${topic.id}`,
    );
    assert.equal(
      JSON.stringify(await repository.getPracticeQuestions({ topicId: topic.id })),
      JSON.stringify(await bundled.getPracticeQuestions({ topicId: topic.id })),
      `${label} practice ${topic.id}`,
    );
  }
  assert.equal(
    JSON.stringify(await repository.getPracticeQuestions({ set: 'fatihah' })),
    JSON.stringify(await bundled.getPracticeQuestions({ set: 'fatihah' })),
  );
  assert.equal(await repository.getTopic('does-not-exist'), null);
  assert.deepEqual(await repository.getPracticeQuestions({ topicId: 'does-not-exist' }), []);
}

test('SQLite repository (the mobile SQL) returns exactly what the bundled repository returns', async () => {
  const { repository, close } = openSqliteRepository(file);
  try {
    await assertSameAsBundled('SQLite', repository);
  } finally {
    close();
  }
});

/** Runs the Postgres-dialect SQL against the SQLite copy, the way pg would return rows. */
function fakePostgres(path: string): Queryable & { queries: string[]; close: () => void } {
  const db = new DatabaseSync(path, { readOnly: true });
  const queries: string[] = [];
  return {
    queries,
    close: () => db.close(),
    async query(sql: string, params: unknown[]) {
      queries.push(sql);
      assert.ok(/^select /.test(sql), 'read-only');
      assert.ok(!sql.includes('?'));
      const translated = sql.replaceAll(`${POSTGRES_SCHEMA}.`, '').replace(/\$(\d+)/g, '?');
      const rows = db.prepare(translated).all(...(params as (string | number)[]));
      return { rows: rows as Record<string, unknown>[] };
    },
  };
}

test('Postgres repository maps quran_grammar rows to the same values and caches results', async () => {
  const pool = fakePostgres(file);
  try {
    const version = await checkPostgresContent(pool);
    assert.equal(version.database_schema_version, 2);
    const repository = createPostgresRepository(pool);
    await assertSameAsBundled('Postgres', repository);
    assert.ok(pool.queries.every((sql) => sql.includes(`${POSTGRES_SCHEMA}.`)));
    const before = pool.queries.length;
    await repository.getStudy(4);
    await repository.listTopics();
    await repository.getTopic(grammar.topics[0].id);
    await repository.getTopic('unknown-topic');
    await repository.getStudy(999);
    assert.equal(pool.queries.length, before, 'served from the in-memory cache');
  } finally {
    pool.close();
  }
  const empty = { query: async () => ({ rows: [] }) };
  await assert.rejects(checkPostgresContent(empty), /content_version is empty/);
  const old = { query: async () => ({ rows: [{ database_schema_version: 1 }] }) };
  await assert.rejects(checkPostgresContent(old), /schema version 1/);
});

test('Postgres load script is one transaction with escaped literals in a private schema', () => {
  assert.equal(literal("it's"), "'it''s'");
  assert.equal(literal(null), 'null');
  assert.equal(literal(7), '7');
  assert.throws(() => literal(1.5));
  assert.throws(() => literal('a\u0000b'));
  const sql = buildPostgresSql(
    studies,
    grammar,
    contentVersion(studies, grammar, 'test', '2026-11-06T00:00:00.000Z'),
  );
  assert.match(sql, /^-- Generated/);
  assert.ok(sql.includes('\nbegin;\n') && sql.trimEnd().endsWith('commit;'));
  assert.ok(sql.includes(`create schema if not exists ${POSTGRES_SCHEMA};`));
  assert.ok(sql.includes(`revoke all on schema ${POSTGRES_SCHEMA} from public;`));
  assert.ok(!/\bgrant\b/i.test(sql), 'no grants to API roles');
  assert.ok(!/(^|\n)\s*(drop|delete)\b/i.test(sql), 'content is replaced with truncate only');
  assert.equal((sql.match(/^truncate /gm) ?? []).length, 1);
  assert.match(sql, /^truncate quran_grammar\.practice_options, quran_grammar\.practice_questions/m);
  const count = (table: string) =>
    [...sql.matchAll(new RegExp(`^insert into quran_grammar\\.${table} \\(.*\\) values\\n([\\s\\S]*?);$`, 'gm'))]
      .map((match) => match[1].split('),\n(').length)
      .reduce((total, rows) => total + rows, 0);
  const rows = contentToRows(studies, grammar);
  assert.equal(count('words'), rows.words.length);
  assert.equal(count('grammar_topics'), rows.grammar_topics.length);
  assert.equal(count('practice_questions'), rows.practice_questions.length);
  assert.equal(count('practice_options'), rows.practice_options.length);
});

test('read-only role SQL grants only usage and select on the content schema', () => {
  const sql = postgresRoleSql();
  assert.match(sql, /grant usage on schema quran_grammar to quran_grammar_reader;/);
  assert.match(sql, /grant select on all tables in schema quran_grammar to quran_grammar_reader;/);
  assert.match(sql, /default_transaction_read_only = on/);
  assert.ok(!/\b(insert|update|delete|truncate|all privileges)\b/i.test(sql.replace(/^--.*$/gm, '')));
  assert.ok(!/password '/.test(sql), 'no literal password');
});

/**
 * Content database commands (schema v3: study tables + translations + grammar topics + practice questions).
 * The API reads Postgres when DATABASE_URL is set; the mobile app bundles the SQLite file.
 *
 *   sqlite [file]          build the local SQLite database (default build/db/quran-grammar.sqlite)
 *   mobile [file]          build the app's SQLite asset (default apps/mobile/assets/db/quran-grammar.db)
 *   verify-sqlite [file]   check that a SQLite file reproduces the bundled content exactly
 *   postgres-sql [file]    write the Postgres load script (default build/db/quran-grammar.postgres.sql)
 *   sync-postgres          load Postgres through $QG_PSQL, then verify by reading every table back
 *   verify-postgres        verify Postgres through $QG_PSQL
 *   postgres-role-sql      print the SQL that creates the API's read-only role (run once, as postgres)
 *
 * QG_PSQL is a psql command line, for example `psql "postgresql://…"` or
 * `ssh <server> docker exec -i supabase-db psql -U postgres -d postgres`. Never commit it.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isStudyData, type GrammarContent, type StudyData } from '@quran-grammar/core';
import { getGrammarContent, studies } from '@quran-grammar/core/content';
import { rowsToGrammar, rowsToStudies, studiesToRows, type ContentRows } from '@quran-grammar/core/db';
import { readSqlite, writeSqlite } from './sqlite';
import { buildPostgresSql, readPostgres, runPsql } from './postgres';
import { contentSha256, contentVersion, type ContentVersion } from './version';
import { postgresRoleSql } from './role';

const root = resolve(fileURLToPath(new URL('../../../../', import.meta.url)));
const defaultSqlite = resolve(root, 'build/db/quran-grammar.sqlite');
const defaultSql = resolve(root, 'build/db/quran-grammar.postgres.sql');
const defaultMobile = resolve(root, 'apps/mobile/assets/db/quran-grammar.db');

function sourceCommit(): string {
  try {
    const head = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
    const dirty = execFileSync('git', ['status', '--porcelain', '--untracked-files=no'], {
      cwd: root,
      encoding: 'utf8',
    }).trim();
    return dirty ? `${head}+uncommitted` : head;
  } catch {
    return 'unknown';
  }
}

/** Throws unless the database copy reproduces the bundled StudyData and grammar byte for byte. */
export function verifyCopy(
  label: string,
  copy: { rows: ContentRows; version: ContentVersion },
  expected: readonly StudyData[] = studies,
  expectedGrammar: GrammarContent = getGrammarContent(),
) {
  const rebuilt = rowsToStudies(copy.rows);
  for (const study of rebuilt) {
    const number = study.surah.number;
    // Validate the rebuilt value as untrusted data, exactly as the clients do.
    if (!isStudyData(study as unknown))
      throw new Error(`${label}: Surah ${number} fails validation`);
  }
  if (JSON.stringify(rebuilt) !== JSON.stringify(expected)) {
    const first = expected.find(
      (study, index) => JSON.stringify(study) !== JSON.stringify(rebuilt[index]),
    );
    throw new Error(
      `${label}: content differs from the bundled lessons (first mismatch: Surah ${first?.surah.number ?? '?'})`,
    );
  }
  const catalog = studiesToRows([]).translations;
  const stored = copy.rows.translations.map((row) => ({ ...row, position: Number(row.position), resource_id: Number(row.resource_id) }));
  if (JSON.stringify(stored) !== JSON.stringify(catalog))
    throw new Error(`${label}: translation catalog differs from the bundled build`);
  const grammar = rowsToGrammar(copy.rows);
  if (JSON.stringify(grammar) !== JSON.stringify(expectedGrammar)) {
    const part = (['topics', 'topicExamples', 'questions'] as const).find(
      (key) => JSON.stringify(grammar[key]) !== JSON.stringify(expectedGrammar[key]),
    );
    throw new Error(`${label}: grammar ${part ?? 'content'} differ from the bundled build`);
  }
  const sha = contentSha256(expected, expectedGrammar);
  if (copy.version.content_sha256 !== sha)
    throw new Error(`${label}: content_version checksum ${copy.version.content_sha256} ≠ ${sha}`);
  const words = expected.reduce((total, study) => total + study.words.length, 0);
  if (
    Number(copy.version.word_count) !== words ||
    Number(copy.version.surah_count) !== expected.length
  )
    throw new Error(`${label}: content_version counts do not match`);
  return {
    surahs: expected.length,
    ayahs: expected.reduce((total, study) => total + study.ayahs.length, 0),
    words,
    topics: grammar.topics.length,
    questions: grammar.questions.length,
    sha256: sha,
    sourceCommit: copy.version.source_commit,
    syncedAt: copy.version.synced_at,
  };
}

function psqlCommand(): string {
  const command = process.env.QG_PSQL?.trim();
  if (!command) throw new Error('Set QG_PSQL to a psql command line (see apps/api/src/db/cli.ts).');
  return command;
}

function currentVersion(): ContentVersion {
  return contentVersion(studies, getGrammarContent(), sourceCommit(), new Date().toISOString());
}

const [command = 'help', target] = process.argv.slice(2);
const report = (value: unknown) => console.log(JSON.stringify(value, null, 2));
switch (command) {
  case 'sqlite':
  case 'mobile': {
    const file = resolve(target ?? (command === 'mobile' ? defaultMobile : defaultSqlite));
    writeSqlite(file, studies, getGrammarContent(), currentVersion());
    report({ file, bytes: statSync(file).size, ...verifyCopy('SQLite', readSqlite(file)) });
    break;
  }
  case 'verify-sqlite': {
    const file = resolve(target ?? defaultSqlite);
    report({ file, ...verifyCopy('SQLite', readSqlite(file)) });
    break;
  }
  case 'postgres-sql': {
    const file = resolve(target ?? defaultSql);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, buildPostgresSql(studies, getGrammarContent(), currentVersion()));
    report({ file });
    break;
  }
  case 'sync-postgres': {
    const psql = psqlCommand();
    runPsql(psql, buildPostgresSql(studies, getGrammarContent(), currentVersion()));
    report({ target: 'postgres', ...verifyCopy('Postgres', readPostgres(psql)) });
    break;
  }
  case 'verify-postgres':
    report({ target: 'postgres', ...verifyCopy('Postgres', readPostgres(psqlCommand())) });
    break;
  case 'postgres-role-sql':
    process.stdout.write(postgresRoleSql());
    break;
  default:
    console.log(
      'Usage: cli.ts sqlite [file] | mobile [file] | verify-sqlite [file] | postgres-sql [file] | sync-postgres | verify-postgres | postgres-role-sql',
    );
    process.exitCode = command === 'help' ? 0 : 1;
}

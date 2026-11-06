/**
 * Content database commands. The running app still serves the bundled study data; these
 * databases are synchronised copies that can replace it later.
 *
 *   sqlite [file]          build the local SQLite database (default build/db/quran-grammar.sqlite)
 *   verify-sqlite [file]   check that a SQLite file reproduces the bundled content exactly
 *   postgres-sql [file]    write the Postgres load script (default build/db/quran-grammar.postgres.sql)
 *   sync-postgres          load Postgres through $QG_PSQL, then verify by reading every table back
 *   verify-postgres        verify Postgres through $QG_PSQL
 *
 * QG_PSQL is a psql command line, for example `psql "postgresql://…"` or
 * `ssh <server> docker exec -i supabase-db psql -U postgres -d postgres`. Never commit it.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isStudyData, studies, type StudyData } from '@quran-grammar/core';
import { contentSha256, rowsToStudies, type ContentRows } from './rows';
import { readSqlite, writeSqlite } from './sqlite';
import { buildPostgresSql, readPostgres, runPsql } from './postgres';
import { contentVersion, type ContentVersion } from './version';

const root = resolve(fileURLToPath(new URL('../../../../', import.meta.url)));
const defaultSqlite = resolve(root, 'build/db/quran-grammar.sqlite');
const defaultSql = resolve(root, 'build/db/quran-grammar.postgres.sql');

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

/** Throws unless the database copy reproduces the bundled StudyData byte for byte. */
export function verifyCopy(
  label: string,
  copy: { rows: ContentRows; version: ContentVersion },
  expected: readonly StudyData[] = studies,
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
  const sha = contentSha256(expected);
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

const [command = 'help', target] = process.argv.slice(2);
const report = (value: unknown) => console.log(JSON.stringify(value, null, 2));
switch (command) {
  case 'sqlite': {
    const file = resolve(target ?? defaultSqlite);
    writeSqlite(file, studies, contentVersion(studies, sourceCommit(), new Date().toISOString()));
    report({ file, ...verifyCopy('SQLite', readSqlite(file)) });
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
    writeFileSync(
      file,
      buildPostgresSql(studies, contentVersion(studies, sourceCommit(), new Date().toISOString())),
    );
    report({ file });
    break;
  }
  case 'sync-postgres': {
    const psql = psqlCommand();
    runPsql(
      psql,
      buildPostgresSql(studies, contentVersion(studies, sourceCommit(), new Date().toISOString())),
    );
    report({ target: 'postgres', ...verifyCopy('Postgres', readPostgres(psql)) });
    break;
  }
  case 'verify-postgres':
    report({ target: 'postgres', ...verifyCopy('Postgres', readPostgres(psqlCommand())) });
    break;
  default:
    console.log(
      'Usage: cli.ts sqlite [file] | verify-sqlite [file] | postgres-sql [file] | sync-postgres | verify-postgres',
    );
    process.exitCode = command === 'help' ? 0 : 1;
}

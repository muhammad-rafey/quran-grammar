// Make sure the bundled SQLite content database exists before Metro bundles the app.
//
//   node scripts/ensure-db.mjs           generate assets/db/quran-grammar.db if it is missing, not
//                                        schema v3, or older than the content/database sources
//   node scripts/ensure-db.mjs --force   always regenerate it
//
// The database itself is produced by the repository's `npm run db:mobile` script.
// Afterwards this writes assets/db/quran-grammar.json, the small version manifest the app
// bundles as JavaScript: it compares its content_sha256 with the installed device copy to
// decide whether to import the database asset again.
import { spawnSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  statSync,
  utimesSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';

/** Must match MOBILE_DATABASE_SCHEMA_VERSION in src/data/queries.ts. */
const SCHEMA_VERSION = 3;
const mobile = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const root = resolve(mobile, '../..');
const database = join(mobile, 'assets/db/quran-grammar.db');
const manifest = join(mobile, 'assets/db/quran-grammar.json');

function readVersion(file = database) {
  if (!existsSync(file)) return null;
  try {
    const db = new DatabaseSync(file, { readOnly: true });
    try {
      return db
        .prepare(
          'select database_schema_version, study_schema_version, content_sha256, surah_count, ayah_count, word_count from content_version where id = 1',
        )
        .get();
    } finally {
      db.close();
    }
  } catch {
    return null;
  }
}

/** Newest modification time among the files the database is generated from. */
function newestSource() {
  let newest = 0;
  const visit = (path) => {
    if (!existsSync(path)) return;
    const info = statSync(path);
    if (info.isDirectory()) {
      for (const entry of readdirSync(path)) visit(join(path, entry));
    } else if (/\.(ts|json)$/.test(path) && !/\.test\.ts$/.test(path)) {
      newest = Math.max(newest, info.mtimeMs);
    }
  };
  visit(join(root, 'packages/core/src'));
  visit(join(root, 'apps/api/src/db'));
  return newest;
}

function generate(target) {
  const scripts = (dir) => JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8')).scripts ?? {};
  const args = scripts(root)['db:mobile']
    ? ['run', 'db:mobile', '--', target]
    : scripts(join(root, 'apps/api'))['db:mobile']
      ? ['run', 'db:mobile', '-w', '@quran-grammar/api', '--', target]
      : null;
  if (!args) throw new Error('No "db:mobile" script is available to generate the content database.');
  console.log('Generating the bundled content database (npm run db:mobile)…');
  const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const result = spawnSync(npm, args, { cwd: root, stdio: ['ignore', 'ignore', 'inherit'] });
  if (result.status !== 0) throw new Error('npm run db:mobile failed.');
}

// The database is committed to the repository. Rebuild into a temporary file and replace the
// committed copy only when the content itself changed (its content_sha256), so timestamps or a
// fresh checkout never produce a modified database file.
let version = readVersion();
if (
  process.argv.includes('--force') ||
  version?.database_schema_version !== SCHEMA_VERSION ||
  statSync(database).mtimeMs < newestSource()
) {
  const temporary = `${database}.tmp`;
  mkdirSync(dirname(database), { recursive: true });
  rmSync(temporary, { force: true });
  generate(temporary);
  const rebuilt = readVersion(temporary);
  if (
    version?.database_schema_version === SCHEMA_VERSION &&
    rebuilt?.content_sha256 === version.content_sha256
  ) {
    rmSync(temporary, { force: true });
    const now = new Date();
    utimesSync(database, now, now);
    console.log('Content database unchanged.');
  } else {
    renameSync(temporary, database);
  }
  version = readVersion();
}
if (!version || version.database_schema_version !== SCHEMA_VERSION)
  throw new Error(
    `${database} is missing or is not a schema v${SCHEMA_VERSION} content database.`,
  );

const next = `${JSON.stringify(
  {
    databaseSchemaVersion: version.database_schema_version,
    studySchemaVersion: version.study_schema_version,
    contentSha256: version.content_sha256,
    surahCount: version.surah_count,
    ayahCount: version.ayah_count,
    wordCount: version.word_count,
  },
  null,
  2,
)}\n`;
if (!existsSync(manifest) || readFileSync(manifest, 'utf8') !== next) writeFileSync(manifest, next);
console.log(
  `Content database ready: ${version.surah_count} Surahs, ${version.word_count} words, sha256 ${version.content_sha256.slice(0, 12)}…`,
);

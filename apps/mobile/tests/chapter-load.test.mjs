// Load cost of the longest chapter (Al-Baqarah, 6,116 words) through the app's SQL repository,
// run against the generated content database with node:sqlite. On device every result row is
// converted to a JS object, so the number of rows read is the cost that matters most.
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const databasePath =
  process.env.CONTENT_DB ?? fileURLToPath(new URL('../assets/db/quran-grammar.db', import.meta.url));
const missing = !existsSync(databasePath)
  ? 'assets/db/quran-grammar.db is missing; run `npm run db -w @quran-grammar/mobile`'
  : false;

let tsx = null;
try {
  tsx = { esm: await import('tsx/esm/api'), cjs: await import('tsx/cjs/api') };
} catch {
  // Unavailable.
}
const skip = missing || (!tsx && 'tsx is not installed');
if (tsx && !missing) {
  tsx.esm.register();
  tsx.cjs.register();
}

test('Al-Baqarah loads in few statements, few rows and without temporary sorts', { skip }, async (t) => {
  const db = new DatabaseSync(databasePath, { readOnly: true });
  t.after(() => db.close());
  const statements = [];
  const exec = {
    all: async (sql, params = []) => {
      const rows = db.prepare(sql).all(...params);
      statements.push({ sql, params, rows: rows.length });
      return rows;
    },
  };
  const { loadStudy } = await import('../src/data/queries.ts');

  const started = performance.now();
  const study = await loadStudy(exec, 2);
  const elapsed = performance.now() - started;
  assert.equal(study.words.length, 6116);
  assert.equal(study.ayahs.length, 286);

  const rows = statements.reduce((sum, statement) => sum + statement.rows, 0);
  t.diagnostic(`${statements.length} statements, ${rows} rows, ${elapsed.toFixed(1)} ms`);
  assert.ok(statements.length <= 8, `${statements.length} statements`);
  // One row per word, ayah, verb, root, rule and phrase card; segments, rule ids, translations
  // and phrase word ids are folded into their rows (~41,000 rows unfolded; ~9,800 with the
  // grammar layer's 1,179 Al-Baqarah phrase cards).
  assert.ok(rows < 11000, `${rows} rows`);

  for (const { sql, params } of statements) {
    const plan = db
      .prepare(`explain query plan ${sql}`)
      .all(...params)
      .map((row) => row.detail);
    assert.ok(
      // A sort of a whole result (not the few values inside one group_concat).
      !plan.some((detail) => /TEMP B-TREE FOR ORDER BY/.test(detail)),
      `temporary sort in: ${sql.replace(/\s+/g, ' ')}\n${plan.join('\n')}`,
    );
    assert.ok(
      !plan.some((detail) => /^SCAN (words|word_segments|word_rules|ayah_translations)\b/.test(detail)),
      `full scan in: ${sql.replace(/\s+/g, ' ')}\n${plan.join('\n')}`,
    );
  }
});

test('folded content never contains the group_concat separators', { skip }, () => {
  const db = new DatabaseSync(databasePath, { readOnly: true });
  try {
    const separators = "(instr(%s, char(30)) > 0 or instr(%s, char(31)) > 0)";
    const has = (column) => separators.replaceAll('%s', column);
    const counts = db
      .prepare(
        `select
           (select count(*) from word_segments
             where ${has('arabic')} or ${has('role_urdu')} or ${has('meaning_urdu')}) as segments,
           (select count(*) from word_rules where ${has('rule_id')}) as rules,
           (select count(*) from ayah_translations
             where ${has('translation_id')} or ${has('text')}) as translations`,
      )
      .get();
    assert.deepEqual({ ...counts }, { segments: 0, rules: 0, translations: 0 });
  } finally {
    db.close();
  }
});

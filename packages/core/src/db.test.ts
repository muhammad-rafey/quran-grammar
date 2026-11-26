import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { getGrammarContent, studies } from './content';
import {
  DATABASE_SCHEMA_VERSION,
  ORDER_BY,
  TABLES_CHILD_FIRST,
  TABLES_PARENT_FIRST,
  contentQueries,
  contentToRows,
  createTableStatements,
  grammarToRows,
  rowsToGrammar,
  rowsToStudies,
} from './db/index';

const src = dirname(fileURLToPath(import.meta.url));

/** Runtime (non-type) relative imports reachable from an entry file. */
function runtimeGraph(entry: string, { allowNode = false } = {}): Set<string> {
  const seen = new Set<string>();
  const visit = (file: string) => {
    if (seen.has(file)) return;
    seen.add(file);
    const source = readFileSync(file, 'utf8');
    const pattern = /^\s*(?:import|export)\s+(?!type\b)(?:[^'"]*?\sfrom\s+)?['"]([^'"]+)['"]/gm;
    for (const [, specifier] of source.matchAll(pattern)) {
      if (!specifier.startsWith('.')) {
        if (!allowNode)
          assert.ok(!specifier.startsWith('node:'), `${relative(src, file)} imports ${specifier}`);
        continue;
      }
      const base = resolve(dirname(file), specifier);
      const target = [`${base}.ts`, `${base}/index.ts`, base].find((path) => existsSync(path));
      assert.ok(target, `${relative(src, file)}: cannot resolve ${specifier}`);
      visit(target);
    }
  };
  visit(resolve(src, entry));
  return new Set([...seen].map((file) => relative(src, file)));
}

test('light and db entries never pull lessons, the registry or the topic library into bundles', () => {
  for (const entry of ['index.ts', 'db/index.ts']) {
    const graph = runtimeGraph(entry);
    const heavy = [...graph].filter((file) =>
      /^(data|registry|content|fatihah-practice|bundled-repository)\.ts$|^lessons\/|^grammar\/(topics\/|build\.ts)/.test(
        file,
      ),
    );
    assert.deepEqual(heavy, [], `${entry} reaches ${heavy.join(', ')}`);
  }
  // The heavy entry is Node-only: the registry reads the lesson JSON from disk.
  assert.ok(runtimeGraph('content.ts', { allowNode: true }).has('registry.ts'));
  assert.match(readFileSync(resolve(src, 'registry.ts'), 'utf8'), /from 'node:fs'/);
});

test('schema v3 creates every table in both dialects, children after parents', () => {
  assert.equal(DATABASE_SCHEMA_VERSION, 3);
  for (const dialect of ['sqlite', 'postgres'] as const) {
    const sql = createTableStatements(dialect).join('\n');
    // Translations live in their own tables; ayahs keep no translation, theme or tafsir columns.
    const ayahs = sql.match(/create table if not exists (?:quran_grammar\.)?ayahs \(([\s\S]*?)\n\)/)![1];
    assert.doesNotMatch(ayahs, /translation_urdu|theme_urdu|tafsir_urdu/);
    assert.match(sql, /create table if not exists (quran_grammar\.)?ayah_translations \([\s\S]*?translation_id text not null references/);
    assert.match(sql, /\n  arabic_indopak text,\n/);
    for (const table of TABLES_CHILD_FIRST)
      assert.match(sql, new RegExp(`create table if not exists (quran_grammar\\.)?${table} \\(`));
    assert.match(sql, /practice_questions_topic_idx/);
    assert.match(sql, /word_rules_rule_idx/);
  }
  assert.deepEqual(
    [...TABLES_PARENT_FIRST].reverse(),
    TABLES_CHILD_FIRST.filter((table) => table !== 'content_version'),
  );
  assert.deepEqual(Object.keys(ORDER_BY).sort(), [...TABLES_PARENT_FIRST].sort());
});

test('grammar rows round-trip losslessly, including order', () => {
  const grammar = getGrammarContent();
  const rows = grammarToRows(grammar);
  assert.equal(rows.grammar_topics.length, grammar.topics.length);
  assert.equal(rows.practice_questions.length, grammar.questions.length);
  assert.equal(JSON.stringify(rowsToGrammar(rows)), JSON.stringify(grammar));
  const reversed = Object.fromEntries(
    Object.entries(rows).map(([table, list]) => [table, [...list].reverse()]),
  ) as unknown as typeof rows;
  assert.equal(JSON.stringify(rowsToGrammar(reversed)), JSON.stringify(grammar));
  const all = contentToRows(studies, grammar);
  assert.equal(JSON.stringify(rowsToStudies(all)), JSON.stringify(studies));
  assert.equal(all.translations.length, 6);
  assert.equal(all.ayah_translations.length, 6236 * 6);
  assert.equal(all.words.filter((word) => !word.arabic_indopak).length, 0);
});

test('SQL helpers use dialect placeholders and the private Postgres schema', () => {
  const flat = (value: unknown): string[] =>
    typeof value === 'string' ? [value] : Object.values(value as object).flatMap(flat);
  const sqlite = flat(contentQueries('sqlite'));
  const postgres = flat(contentQueries('postgres'));
  assert.ok(sqlite.every((sql) => !sql.includes('$1') && !sql.includes('quran_grammar.')));
  assert.ok(postgres.every((sql) => !sql.includes('?')));
  assert.ok(postgres.every((sql) => !/\b(from|join)\s+(?!quran_grammar\.)[a-z_]+\s/.test(sql)));
  assert.ok(postgres.filter((sql) => sql.includes('$1')).length >= 10);
  assert.ok([...sqlite, ...postgres].every((sql) => /^select /.test(sql)), 'read-only');
});

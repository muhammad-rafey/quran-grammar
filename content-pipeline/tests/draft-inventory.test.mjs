import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

// These checks use only committed material, so CI needs neither the Corpus
// download nor the ignored source packets or private model-run checkpoints.
const pipeline = fileURLToPath(new URL('../', import.meta.url));
const readJson = async (path) => JSON.parse(await readFile(join(pipeline, path), 'utf8'));
const plan = await readJson('meta/plan.json');
const rules = await readJson('libs/rules.json');
const ruleIds = new Set(rules.rules.map((rule) => rule.id));
const expected = new Map([
  [18, { ayahs: 110, words: 1579 }],
  [23, { ayahs: 118, words: 1050 }],
  [32, { ayahs: 30, words: 372 }],
  [36, { ayahs: 83, words: 725 }],
  [55, { ayahs: 78, words: 351 }],
]);
const inventories = new Map(await Promise.all([...expected.keys()].map(async (surah) => [
  surah, await readJson(`inventory/inventory-${surah}.json`),
])));
const specs = new Map(plan.map((item) => [item.chunk, item]));
const canonicalWords = new Map([...inventories.values()].flatMap((inventory) =>
  inventory.words.map((word) => [word.id, word.arabic])));

const drafts = [];
for (const directory of await readdir(join(pipeline, 'chunks'), { withFileTypes: true })) {
  if (!directory.isDirectory()) continue;
  for (const entry of await readdir(join(pipeline, 'chunks', directory.name), { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.json')) continue;
    const path = `chunks/${directory.name}/${entry.name}`;
    const bytes = await readFile(join(pipeline, path));
    drafts.push({ path, folder: directory.name, filename: entry.name, bytes, data: JSON.parse(bytes) });
  }
}

function object(value, where) {
  assert.ok(value && typeof value === 'object' && !Array.isArray(value), `${where}: expected an object`);
}

function text(value, where) {
  assert.equal(typeof value, 'string', `${where}: expected text`);
  assert.ok(value.trim().length, `${where}: text must not be empty`);
  assert.equal(value, value.trim(), `${where}: unexpected surrounding whitespace`);
  assert.doesNotMatch(value, /[A-Za-z]/, `${where}: teaching text must not contain Latin letters`);
  assert.doesNotMatch(value, /https?:\/\/|www\./i, `${where}: source URLs belong in the audit`);
  // Match the chunk validator's prohibited control set without rejecting
  // legitimate Uthmani marks, citation forms, Urdu punctuation or numerals.
  assert.doesNotMatch(value, /[\u0000-\u001f\u007f\u200b-\u200d\ufeff]/u, `${where}: prohibited control character`);
  assert.match(value, /[ء-يٱ-ۓۺ-ۿ]/u, `${where}: expected Arabic-script text`);
}

function fields(value, required, optional, where) {
  object(value, where);
  for (const name of required) assert.ok(Object.hasOwn(value, name), `${where}: missing ${name}`);
  for (const name of Object.keys(value)) {
    assert.ok(required.includes(name) || optional.includes(name), `${where}: unexpected field ${name}`);
  }
}

test('the tracked plan and canonical inventories cover all five Surahs exactly once', () => {
  assert.equal(plan.length, 127);
  assert.equal(specs.size, plan.length, 'duplicate planned chunk identifiers');
  assert.equal(plan.reduce((total, item) => total + item.ayahs.length, 0), 419);
  assert.equal(plan.reduce((total, item) => total + item.wordIds.length, 0), 4077);
  assert.equal(canonicalWords.size, 4077, 'duplicate or missing canonical occurrence identifiers');
  assert.equal(ruleIds.size, rules.rules.length, 'duplicate rule identifiers');

  for (const spec of plan) {
    assert.ok(expected.has(spec.surah), `unexpected planned Surah ${spec.surah}`);
    assert.match(spec.chunk, new RegExp(`^${spec.surah}-c[0-9]{2}$`));
    assert.equal(spec.words, spec.wordIds.length, `${spec.chunk}: inconsistent planned count`);
    const ayahs = [...new Set(spec.wordIds.map((id) => Number(id.split(':')[1])))];
    assert.deepEqual(ayahs, spec.ayahs, `${spec.chunk}: words must belong to exactly the planned ayahs`);
  }

  for (const [surah, counts] of expected) {
    const inventory = inventories.get(surah);
    assert.equal(inventory.surah, surah);
    assert.equal(inventory.ayahCount, counts.ayahs);
    assert.equal(inventory.wordCount, counts.words);
    assert.equal(inventory.words.length, counts.words);
    const chunks = plan.filter((spec) => spec.surah === surah);
    assert.deepEqual(chunks.flatMap((spec) => spec.ayahs),
      Array.from({ length: counts.ayahs }, (_, index) => index + 1), `${surah}: ayah coverage/order`);
    assert.deepEqual(chunks.flatMap((spec) => spec.wordIds), inventory.words.map((word) => word.id),
      `${surah}: planned word IDs must equal the canonical inventory in reading order`);

    let previousAyah = 0;
    let previousPosition = 0;
    for (const word of inventory.words) {
      const match = /^(\d+):(\d+):(\d+)$/.exec(word.id);
      assert.ok(match, `${surah}: malformed occurrence ID ${word.id}`);
      const [, chapter, verse, position] = match.map(Number);
      assert.equal(chapter, surah);
      if (verse !== previousAyah) {
        assert.equal(verse, previousAyah + 1, `${word.id}: skipped/reordered ayah`);
        previousAyah = verse;
        previousPosition = 0;
      }
      assert.equal(position, previousPosition + 1, `${word.id}: skipped/reordered occurrence`);
      previousPosition = position;
      text(word.arabic, `${word.id} canonical Arabic`);
      assert.doesNotMatch(word.arabic, /\s/u, `${word.id}: a canonical word must be one token`);
    }
    assert.equal(previousAyah, counts.ayahs);
  }
});

test('every available authored draft preserves its complete canonical chunk', async (context) => {
  const seen = new Set();
  for (const draft of drafts) {
    await context.test(draft.path, () => {
      const chunk = draft.data;
      fields(chunk, ['chunk', 'words', 'ayahs'], ['auditNotes'], draft.path);
      const spec = specs.get(chunk.chunk);
      assert.ok(spec, `${draft.path}: unknown chunk ${chunk.chunk}`);
      assert.equal(draft.folder, String(spec.surah), `${draft.path}: wrong Surah folder`);
      assert.equal(draft.filename, `${spec.chunk}.json`, `${draft.path}: wrong chunk filename`);
      assert.ok(!seen.has(spec.chunk), `${draft.path}: duplicate chunk`);
      seen.add(spec.chunk);
      assert.ok(Array.isArray(chunk.words), `${spec.chunk}: words must be a list`);
      assert.ok(Array.isArray(chunk.ayahs), `${spec.chunk}: ayahs must be a list`);
      assert.deepEqual(chunk.words.map((word) => word.id), spec.wordIds, `${spec.chunk}: exact word coverage/order`);
      assert.deepEqual(chunk.ayahs.map((ayah) => ayah.number), spec.ayahs, `${spec.chunk}: exact ayah coverage/order`);

      for (const word of chunk.words) {
        fields(word, ['id', 'meaningUrdu', 'posUrdu', 'lemma', 'morphologyUrdu', 'syntaxUrdu',
          'dictionaryUrdu', 'segments', 'ruleIds'], ['verbNoteUrdu'], word.id);
        for (const name of ['meaningUrdu', 'posUrdu', 'lemma', 'morphologyUrdu', 'syntaxUrdu', 'dictionaryUrdu']) {
          text(word[name], `${word.id} ${name}`);
        }
        if (Object.hasOwn(word, 'verbNoteUrdu')) text(word.verbNoteUrdu, `${word.id} verbNoteUrdu`);
        assert.ok(Array.isArray(word.segments) && word.segments.length, `${word.id}: missing segments`);
        for (const [index, segment] of word.segments.entries()) {
          const where = `${word.id} segment ${index + 1}`;
          fields(segment, ['arabic', 'roleUrdu', 'meaningUrdu'], [], where);
          // An exact Uthmani slice may consist solely of a written suffix mark
          // (for example small waw ۥ at32:18:8). The canonical rejoin below pins
          // every character; requiring a full-size letter would reject it.
          assert.equal(typeof segment.arabic, 'string', `${where}: expected an Arabic slice`);
          assert.ok(segment.arabic.length, `${where}: an Arabic slice must not be empty`);
          assert.doesNotMatch(segment.arabic, /\s/u, `${where}: a slice cannot contain whitespace`);
          for (const name of ['roleUrdu', 'meaningUrdu']) text(segment[name], `${where} ${name}`);
        }
        assert.equal(word.segments.map((segment) => segment.arabic).join(''), canonicalWords.get(word.id),
          `${word.id}: segments must rejoin the exact audited Arabic without normalization`);
        assert.ok(Array.isArray(word.ruleIds) && word.ruleIds.length >= 1 && word.ruleIds.length <= 6,
          `${word.id}: expected one to six rule references`);
        assert.equal(new Set(word.ruleIds).size, word.ruleIds.length, `${word.id}: duplicate rule references`);
        for (const id of word.ruleIds) assert.ok(ruleIds.has(id), `${word.id}: unknown rule ${id}`);
      }

      for (const ayah of chunk.ayahs) {
        const where = `${spec.surah}:${ayah.number}`;
        fields(ayah, ['number', 'translationUrdu', 'themeUrdu', 'tafsirUrdu', 'phrases'], [], where);
        for (const name of ['translationUrdu', 'themeUrdu', 'tafsirUrdu']) text(ayah[name], `${where} ${name}`);
        assert.ok(Array.isArray(ayah.phrases) && ayah.phrases.length, `${where}: missing phrase context`);
        const ayahIds = spec.wordIds.filter((id) => Number(id.split(':')[1]) === ayah.number);
        const covered = new Set();
        for (const [index, phrase] of ayah.phrases.entries()) {
          const phraseWhere = `${where} phrase ${index + 1}`;
          fields(phrase, ['wordIds', 'labelUrdu', 'explanationUrdu'], [], phraseWhere);
          text(phrase.labelUrdu, `${phraseWhere} labelUrdu`);
          text(phrase.explanationUrdu, `${phraseWhere} explanationUrdu`);
          assert.ok(Array.isArray(phrase.wordIds) && phrase.wordIds.length, `${phraseWhere}: empty word list`);
          assert.equal(new Set(phrase.wordIds).size, phrase.wordIds.length, `${phraseWhere}: duplicate words`);
          assert.deepEqual(phrase.wordIds, ayahIds.filter((id) => phrase.wordIds.includes(id)),
            `${phraseWhere}: words must belong to this ayah and follow reading order`);
          phrase.wordIds.forEach((id) => covered.add(id));
        }
        assert.deepEqual(ayahIds.filter((id) => !covered.has(id)), [], `${where}: words missing phrase context`);
      }
      if (Object.hasOwn(chunk, 'auditNotes')) {
        assert.ok(Array.isArray(chunk.auditNotes), `${spec.chunk}: auditNotes must be a list`);
        for (const note of chunk.auditNotes) fields(note, ['ref', 'noteEnglish'], [], `${spec.chunk} audit note`);
      }
    });
  }
});

test('a completed review manifest pins every planned draft to its reviewed bytes', async (context) => {
  let manifest;
  try { manifest = await readJson('reports/chunk-review-manifest.json'); }
  catch (error) {
    if (error.code !== 'ENOENT') throw error;
    context.skip('No completed review manifest yet; partial authorship remains permitted.');
    return;
  }
  if (manifest.complete !== true) {
    context.skip('Review manifest is not yet complete.');
    return;
  }
  assert.equal(manifest.expectedChunks, 127);
  assert.ok(Array.isArray(manifest.chunks));
  assert.equal(manifest.chunks.length, plan.length);
  assert.equal(new Set(manifest.chunks.map((row) => row.chunk)).size, plan.length, 'duplicate manifest rows');
  assert.deepEqual(manifest.chunks.map((row) => row.chunk).sort(), [...specs.keys()].sort(), 'manifest/plan mismatch');
  assert.equal(drafts.length, plan.length, 'complete review requires every planned draft file');
  const byChunk = new Map(drafts.map((draft) => [draft.data.chunk, draft]));
  for (const row of manifest.chunks) {
    assert.equal(row.status, 'ai-reviewed', `${row.chunk}: review is incomplete`);
    assert.match(row.contentSha256, /^[0-9a-f]{64}$/, `${row.chunk}: malformed reviewed content hash`);
    const draft = byChunk.get(row.chunk);
    assert.ok(draft, `${row.chunk}: reviewed draft was deleted`);
    assert.equal(createHash('sha256').update(draft.bytes).digest('hex'), row.contentSha256,
      `${row.chunk}: draft changed since its completed AI review`);
  }
});

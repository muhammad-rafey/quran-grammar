import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { copyFile, lstat, mkdir, mkdtemp, readFile, readdir, rename, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import test from 'node:test';
import { exportReviews, writeReportPair } from '../scripts/export_reviews.mjs';

const execute = promisify(execFile);
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sha = (value) => createHash('sha256').update(value).digest('hex');
const pilot = JSON.parse(await readFile(join(ROOT, 'chunks', '18', '18-c01.json'), 'utf8'));
const PRIVATE = 'PROTECTED_MODEL_NOTE_DO_NOT_EXPORT';

async function fixture(context, count = 1, { mutateDuringValidation = false } = {}) {
  const work = await mkdtemp(join(tmpdir(), 'quran-grammar-review-export-test-'));
  context.after(() => rm(work, { recursive: true, force: true }));
  for (const path of ['guide/authoring-guide.md', 'libs/rules.json', 'scripts/validate_chunk.py', 'workflows/chunks.js']) {
    await mkdir(dirname(join(work, path)), { recursive: true });
    await copyFile(join(ROOT, path), join(work, path));
  }
  for (const directory of ['meta', 'packets/18', 'chunks/18', 'runs/fixtures']) await mkdir(join(work, directory), { recursive: true });
  for (const directory of ['libs/lexemes', 'libs/roots']) {
    await mkdir(join(work, directory), { recursive: true });
    await writeFile(join(work, directory, 'fixture.json'), '{"entries":[]}');
  }
  if (mutateDuringValidation) {
    const validator = join(work, 'scripts', 'validate_chunk.py');
    await writeFile(validator, 'from pathlib import Path as _FixturePath\n' +
      '_FixturePath(__file__).resolve().parents[1].joinpath("libs/roots/fixture.json").write_text(\'{"entries":[],"fixture":"changed during validation"}\')\n' +
      await readFile(validator, 'utf8'));
  }
  // Exact Arabic/Urdu comes from the unchanged tracked pilot. Multiple records
  // repeat that same pilot only as isolated export-transport fixtures.
  const words = Object.fromEntries(pilot.words.map((word) => [word.id, {
    arabic: word.segments.map((segment) => segment.arabic).join(''),
    pos: Object.hasOwn(word, 'verbNoteUrdu') ? 'verb' : 'noun', ayah: Number(word.id.split(':')[1]),
  }]));
  const plan = Array.from({ length: count }, (_, index) => ({
    chunk: `18-c${String(index + 1).padStart(2, '0')}`, surah: 18,
    wordIds: pilot.words.map((word) => word.id), ayahs: pilot.ayahs.map((ayah) => ayah.number),
  }));
  await writeFile(join(work, 'meta', 'words.json'), JSON.stringify(words));
  await writeFile(join(work, 'meta', 'overrides.json'), '{}');
  await writeFile(join(work, 'meta', 'plan.json'), JSON.stringify(plan));
  for (const spec of plan) {
    await writeFile(join(work, 'chunks', '18', `${spec.chunk}.json`), JSON.stringify({ ...pilot, chunk: spec.chunk }));
    await writeFile(join(work, 'packets', '18', `${spec.chunk}.json`), JSON.stringify({
      chunk: spec.chunk, plannedWordIds: spec.wordIds, plannedAyahs: spec.ayahs,
      words: Object.entries(words).map(([id, word]) => ({ id, ...word })), ayahs: spec.ayahs.map((ayah) => ({ ayah })),
    }));
  }
  const runDir = join(work, 'runs', 'fixtures');
  const { stdout } = await execute(process.execPath, [join(ROOT, 'scripts', 'run_chunks.mjs'), '--work', work, '--run-dir', runDir, '--chunks', plan.map((spec) => spec.chunk).join(','), '--dry-run']);
  const hashes = new Map(JSON.parse(stdout).chunks.map((entry) => [entry.chunk, entry.hashes]));
  const checkpoints = new Map();
  for (const spec of plan) {
    const checkpoint = {
      version: 1, chunk: spec.chunk, status: 'ai-reviewed', publication: 'held-for-scholarly-review',
      hashes: hashes.get(spec.chunk), contentHash: sha(await readFile(join(work, 'chunks', '18', `${spec.chunk}.json`))),
      validation: { ok: true, chunk: spec.chunk, errors: [], warnings: [] },
      result: {
        chunk: spec.chunk, status: 'ai-reviewed', scholarlyReview: 'pending', blockingReasons: [], libraryIssues: [],
        authored: { validatorOk: true, words: spec.wordIds.length, ayahs: spec.ayahs.length, notes: `/private/model-records ${PRIVATE}` },
        reviewIssues: 0, reviewCritical: 0, reviewMajor: 0,
        fix1: { applied: 0, rejected: 0, validatorOk: true }, confirms: [{ round: 1, issues: [] }], finalFix: null,
        privateExtra: `/Users/reviewer ${PRIVATE}`,
      },
    };
    checkpoints.set(spec.chunk, checkpoint);
    await writeFile(join(runDir, `${spec.chunk}.json`), JSON.stringify(checkpoint));
  }
  return {
    work, runDir, plan, checkpoints,
    save: async (chunk = plan[0].chunk) => writeFile(join(runDir, `${chunk}.json`), JSON.stringify(checkpoints.get(chunk))),
    options: { work, runDir },
  };
}

test('complete current plan exports deterministic safe summaries and bare gen_audit results', async (context) => {
  const setup = await fixture(context, 2);
  const first = setup.checkpoints.get('18-c01').result;
  first.reviewIssues = 1;
  first.reviewMajor = 1;
  first.fix1.applied = 1;
  first.confirms = [
    { round: 1, issues: [{ ref: '18:1:1', field: 'meaningUrdu', severity: 'minor', problem: `/Users/reviewer ${PRIVATE}`, fix: PRIVATE }] },
    { round: 2, issues: [] },
  ];
  first.finalFix = { validatorOk: true, applied: 1, rejected: [{ ref: '18:1:1', field: 'meaningUrdu', reason: PRIVATE }], notes: PRIVATE };
  await setup.save();
  const manifest = await exportReviews(setup.options);
  assert.equal(manifest.complete, true);
  assert.equal(manifest.expectedChunks, 2);
  assert.equal(manifest.reviewedChunks, 2);
  assert.equal(manifest.scholarlyReview, 'pending');
  assert.equal(manifest.safeSummaryOnly, true);
  const sourcePaths = ['guide/authoring-guide.md', 'workflows/chunks.js', 'scripts/validate_chunk.py',
    'meta/plan.json', 'meta/overrides.json', 'libs/rules.json', 'libs/lexemes/fixture.json', 'libs/roots/fixture.json'].sort();
  assert.deepEqual(Object.keys(manifest.sourceFilesSha256), sourcePaths);
  for (const path of sourcePaths) assert.equal(manifest.sourceFilesSha256[path], sha(await readFile(join(setup.work, path))));
  for (const excluded of ['meta/words.json', 'scripts/export_reviews.mjs', 'reports/chunk-results.json']) {
    assert.equal(Object.hasOwn(manifest.sourceFilesSha256, excluded), false);
  }
  assert.deepEqual(manifest.chunks.map((row) => row.chunk), setup.plan.map((spec) => spec.chunk));
  const manifestFile = join(setup.work, 'reports', 'chunk-review-manifest.json');
  const resultsFile = join(setup.work, 'reports', 'chunk-results.json');
  const bytes = await Promise.all([readFile(manifestFile, 'utf8'), readFile(resultsFile, 'utf8')]);
  const results = JSON.parse(bytes[1]);
  assert.equal(Array.isArray(results), true);
  assert.equal(results[0].reviewIssues, 1);
  assert.equal(results[0].confirms[0].issues.length, 1, 'historical fixed findings remain counted for gen_audit');
  assert.deepEqual(results[0].confirms[0].issues[0], { ref: '18:1:1', field: 'meaningUrdu', severity: 'minor' });
  assert.equal(results[0].confirms.at(-1).issues.length, 0);
  assert.equal(results[0].contentSha256, manifest.chunks[0].contentSha256);
  assert.deepEqual(results[0].finalFix.rejected, [{ ref: '18:1:1', field: 'meaningUrdu' }]);
  for (const text of bytes) {
    assert.equal(text.includes(PRIVATE), false);
    assert.equal(text.includes('/Users/'), false);
    assert.equal(text.includes('/private/'), false);
    assert.equal(text.includes('privateExtra'), false);
  }
  await exportReviews(setup.options);
  assert.deepEqual(await Promise.all([readFile(manifestFile, 'utf8'), readFile(resultsFile, 'utf8')]), bytes);
});

test('tracked guide changes invalidate reviews even when reviewed chunk bytes are unchanged', async (context) => {
  const setup = await fixture(context);
  const file = join(setup.work, 'chunks', '18', '18-c01.json');
  const before = await readFile(file);
  const guide = join(setup.work, 'guide', 'authoring-guide.md');
  await writeFile(guide, `${await readFile(guide, 'utf8')}\nFixture source clarification.\n`);
  await assert.rejects(exportReviews(setup.options), /fingerprints are stale/);
  assert.deepEqual(await readFile(file), before);
  await assert.rejects(readFile(join(setup.work, 'reports', 'chunk-review-manifest.json')));
});

test('tracked library mutations during validation block both report writes even outside chunk inputs', async (context) => {
  const setup = await fixture(context, 1, { mutateDuringValidation: true });
  await assert.rejects(exportReviews(setup.options), /Tracked review sources changed during export/);
  await assert.rejects(readFile(join(setup.work, 'reports', 'chunk-review-manifest.json')));
  await assert.rejects(readFile(join(setup.work, 'reports', 'chunk-results.json')));
});

for (const [name, mutate, expected] of [
  ['blocked checkpoint', (record) => { record.status = 'blocked'; }, /not an AI-reviewed held draft/],
  ['stale hashes', (record) => { record.hashes.guide = '0'.repeat(64); }, /fingerprints are stale/],
  ['wrong author count', (record) => { record.result.authored.words--; }, /author coverage/],
  ['wrong author ayah count', (record) => { record.result.authored.ayahs--; }, /author coverage/],
  ['scholarly status changed', (record) => { record.result.scholarlyReview = 'approved'; }, /pending scholarly status/],
  ['shared-library finding', (record) => { record.result.libraryIssues.push({ problem: PRIVATE }); }, /shared-library findings/],
  ['blocking reason', (record) => { record.result.blockingReasons.push(PRIVATE); }, /blocking or shared-library/],
  ['unclean final confirmation', (record) => { record.result.confirms[0].issues.push({ ref: '18:1:1', field: 'meaningUrdu', severity: 'major' }); }, /final confirmation/],
  ['missing confirmation', (record) => { record.result.confirms = []; }, /no final confirmation/],
  ['failed stored validator', (record) => { record.validation.ok = false; }, /stored mechanical validation/],
  ['failed final fixer', (record) => { record.result.finalFix = { validatorOk: false, applied: 0, rejected: [] }; }, /last fixes/],
]) {
  test(`${name} prevents every report write`, async (context) => {
    const setup = await fixture(context);
    mutate(setup.checkpoints.get('18-c01'));
    await setup.save();
    await assert.rejects(exportReviews(setup.options), expected);
    await assert.rejects(readFile(join(setup.work, 'reports', 'chunk-review-manifest.json')));
    await assert.rejects(readFile(join(setup.work, 'reports', 'chunk-results.json')));
  });
}

test('missing final checkpoint never replaces either existing report', async (context) => {
  const setup = await fixture(context, 2);
  const reports = join(setup.work, 'reports');
  await mkdir(reports);
  await writeFile(join(reports, 'chunk-review-manifest.json'), 'old manifest');
  await writeFile(join(reports, 'chunk-results.json'), 'old results');
  await rm(join(setup.runDir, '18-c02.json'));
  await assert.rejects(exportReviews(setup.options), /checkpoint for 18-c02/);
  assert.equal(await readFile(join(reports, 'chunk-review-manifest.json'), 'utf8'), 'old manifest');
  assert.equal(await readFile(join(reports, 'chunk-results.json'), 'utf8'), 'old results');
});

test('content changes after review and invalid structure with a forged matching hash both block export', async (context) => {
  const setup = await fixture(context);
  const file = join(setup.work, 'chunks', '18', '18-c01.json');
  await writeFile(file, `${await readFile(file, 'utf8')}\n`);
  await assert.rejects(exportReviews(setup.options), /content changed/);
  const invalid = JSON.parse(await readFile(file, 'utf8'));
  invalid.words[0].meaningUrdu = null;
  await writeFile(file, JSON.stringify(invalid));
  setup.checkpoints.get('18-c01').contentHash = sha(await readFile(file));
  await setup.save();
  await assert.rejects(exportReviews(setup.options), /current mechanical chunk validation failed/);
  await assert.rejects(readFile(join(setup.work, 'reports', 'chunk-results.json')));
});

test('active runner lock blocks export before report writes', async (context) => {
  const setup = await fixture(context);
  await writeFile(join(setup.runDir, '.runner.lock'), 'active fixture');
  await assert.rejects(exportReviews(setup.options), /active chunk runner/);
  await assert.rejects(readFile(join(setup.work, 'reports', 'chunk-results.json')));
});

test('second replacement failure restores both original reports and permissions', async (context) => {
  const directory = await mkdtemp(join(tmpdir(), 'quran-grammar-export-rollback-'));
  context.after(() => rm(directory, { recursive: true, force: true }));
  const first = join(directory, 'manifest.json');
  const second = join(directory, 'results.json');
  await writeFile(first, 'old first', { mode: 0o600 });
  await writeFile(second, 'old second', { mode: 0o600 });
  let replacements = 0;
  await assert.rejects(writeReportPair([{ path: first, body: 'new first' }, { path: second, body: 'new second' }], {
    replace: async (from, to) => { if (++replacements === 2) throw new Error('simulated second replacement failure'); await rename(from, to); },
  }), /simulated second replacement failure/);
  assert.equal(await readFile(first, 'utf8'), 'old first');
  assert.equal(await readFile(second, 'utf8'), 'old second');
  assert.equal((await lstat(first)).mode & 0o777, 0o600);
  assert.deepEqual((await readdir(directory)).sort(), ['manifest.json', 'results.json']);
});

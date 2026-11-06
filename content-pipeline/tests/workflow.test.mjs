import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const source = (await readFile(new URL('../workflows/chunks.js', import.meta.url), 'utf8'))
  .replace('export const meta', 'const meta');
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
const execute = new AsyncFunction('args', 'agent', 'parallel', 'log', source);
const clean = () => ({ checkedWords: 30, checkedAyahs: 3, issues: [], libraryIssues: [], summary: 'Checked' });
const issue = { ref: '18:5:1', field: 'syntaxUrdu', severity: 'minor', problem: 'Clarify', fix: 'Correction' };

async function run(overrides = {}, maxConfirmRounds = 3) {
  const calls = [];
  const output = await execute({ chunks: ['18-c02'], maxConfirmRounds }, async (_, options) => {
    const stage = options.label.split(':')[1];
    calls.push(stage);
    if (Object.hasOwn(overrides, stage)) return overrides[stage];
    if (stage.startsWith('author')) return { validatorOk: true, words: 30, ayahs: 3, notes: '' };
    if (stage.startsWith('fix')) return { validatorOk: true, applied: 1, rejected: [], notes: '' };
    return clean();
  }, (jobs) => Promise.all(jobs.map((job) => job())), () => {});
  return { result: output.results[0], calls };
}

test('clean independent reviews plus confirmation stay pending scholarly review', async () => {
  const { result } = await run();
  assert.equal(result.status, 'ai-reviewed');
  assert.equal(result.scholarlyReview, 'pending');
});

test('missing independent review blocks a chunk even if the other review is clean', async () => {
  const { result, calls } = await run({ 'verify-meaning': null });
  assert.equal(result.status, 'blocked');
  assert.ok(!calls.includes('confirm-1'));
});

test('failed author retry never proceeds into review', async () => {
  const { result, calls } = await run({ author: null, 'author-retry': { validatorOk: false } });
  assert.equal(result.status, 'blocked');
  assert.deepEqual(calls, ['author', 'author-retry']);
});

test('minor corrections receive a fresh confirmation', async () => {
  const { result, calls } = await run({ 'confirm-1': { ...clean(), issues: [issue] } });
  assert.equal(result.status, 'ai-reviewed');
  assert.ok(calls.indexOf('confirm-2') > calls.indexOf('fix-2'));
});

test('unresolved final findings block without applying an unconfirmed last edit', async () => {
  const { result, calls } = await run({ 'confirm-1': { ...clean(), issues: [issue] } }, 1);
  assert.equal(result.status, 'blocked');
  assert.ok(!calls.includes('fix-2'));
});

test('missing final confirmation or failed fixer cannot produce reviewed content', async () => {
  assert.equal((await run({ 'confirm-1': null })).result.status, 'blocked');
  assert.equal((await run({ 'verify-grammar': { ...clean(), issues: [issue] }, 'fix-1': null })).result.status, 'blocked');
});

test('shared library findings require adjudication even after clean confirmation', async () => {
  const { result } = await run({ 'verify-grammar': { ...clean(), libraryIssues: [{ kind: 'rule', key: 'test', problem: 'Scope', fix: 'Clarify' }] } });
  assert.equal(result.status, 'blocked');
  assert.ok(result.blockingReasons.some((reason) => reason.includes('library')));
});

test('empty or partial reviews cannot confirm a chunk in the original Workflow runtime', async () => {
  for (const stage of ['verify-grammar', 'verify-meaning', 'confirm-1']) {
    for (const scope of [{ checkedWords: 0, checkedAyahs: 0 }, { checkedWords: 29, checkedAyahs: 3 }, { checkedWords: 30, checkedAyahs: 2 }]) {
      const { result } = await run({ [stage]: { ...clean(), ...scope } });
      assert.equal(result.status, 'blocked', `${stage} must cover the whole chunk`);
    }
  }
});

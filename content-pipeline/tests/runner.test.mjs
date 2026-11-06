import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { chmod, copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { matchesSchema, strictSchema } from '../scripts/run_chunks.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const RUNNER = join(ROOT, 'scripts', 'run_chunks.mjs');
const CHUNK = '18-c01';
const pilot = JSON.parse(await readFile(join(ROOT, 'chunks', '18', `${CHUNK}.json`), 'utf8'));
const spec = {
  chunk: CHUNK, surah: 18, ayahs: pilot.ayahs.map((ayah) => ayah.number), wordIds: pilot.words.map((word) => word.id),
};
// A compact metadata fixture is enough for the real validator: Arabic is taken from
// the unchanged pilot's exact segments, not invented for these transport tests.
const words = Object.fromEntries(pilot.words.map((word) => [word.id, {
  arabic: word.segments.map((segment) => segment.arabic).join(''),
  pos: Object.hasOwn(word, 'verbNoteUrdu') ? 'verb' : 'noun',
  ayah: Number(word.id.split(':')[1]),
}]));

const MOCK = `#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const args = process.argv.slice(2);
const get = (flag) => args[args.indexOf(flag) + 1];
let prompt = '';
process.stdin.on('data', (data) => prompt += data);
process.stdin.on('end', () => {
  const schema = JSON.parse(fs.readFileSync(get('--output-schema')));
  const role = Object.hasOwn(schema.properties, 'checkedWords') ? 'review' : Object.hasOwn(schema.properties, 'words') ? 'author' : 'fixer';
  const content = JSON.parse(fs.readFileSync(process.env.MOCK_PAYLOAD));
  const chunk = prompt.match(/lesson chunk (18-c[0-9]{2})/)[1];
  content.chunk = chunk;
  const target = path.join(get('--cd'), 'chunks', '18', chunk + '.json');
  const mode = process.env.MOCK_MODE || 'success';
  const marker = process.env.MOCK_ACTIVE_DIR ? path.join(process.env.MOCK_ACTIVE_DIR, String(process.pid)) : null;
  if (marker) fs.writeFileSync(marker, 'active');
  fs.appendFileSync(process.env.MOCK_CALLS, JSON.stringify({role, chunk, hadCandidate: fs.existsSync(target), sandbox: get('--sandbox'), args, active: marker ? fs.readdirSync(process.env.MOCK_ACTIVE_DIR).length : 0}) + '\\n');
  if (marker) Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 100);
  if (mode === 'transport') { process.stderr.write('SECRET_MUST_STAY_PRIVATE'); process.exit(7); }
  if (mode === 'missing') process.exit(0);
  if (mode === 'hang') { setInterval(() => {}, 1000); return; }
  if (role === 'author') {
    if (mode === 'invalid-chunk') content.words[0].segments[0].arabic = 'خَطَأ';
    fs.writeFileSync(target, JSON.stringify(content));
    if (mode === 'protected-input') fs.writeFileSync(path.join(get('--cd'), 'libs', 'rules.json'), '{}');
    if (mode === 'race-overrides') fs.writeFileSync(path.join(path.dirname(process.env.MOCK_PAYLOAD), 'meta', 'overrides.json'), JSON.stringify({_fixture: 'Changed while author was running'}));
    if (mode === 'race-relevant-root' || mode === 'race-unused-root') {
      const file = path.join(path.dirname(process.env.MOCK_PAYLOAD), 'libs', 'roots', 'root-fixture.json');
      const library = JSON.parse(fs.readFileSync(file));
      library.entries[mode === 'race-relevant-root' ? 0 : 1].noteUrdu += ' ترمیم';
      fs.writeFileSync(file, JSON.stringify(library));
    }
  }
  if (role === 'review' && mode === 'reviewer-write') fs.appendFileSync(target, ' ');
  let value = role === 'author' ? {validatorOk: true, words: content.words.length, ayahs: content.ayahs.length, notes: 'authored'} : role === 'fixer' ? {validatorOk: true, applied: 1, rejected: [], notes: 'fixed'} : {checkedWords: content.words.length, checkedAyahs: content.ayahs.length, issues: [], libraryIssues: [], summary: 'checked'};
  if (mode === 'bad-schema') delete value.validatorOk;
  if (role === 'review' && mode === 'bad-coverage') value.checkedWords--;
  if (role === 'author' && mode === 'bad-author-coverage') value.ayahs--;
  if (role === 'review' && mode === 'library-issue') value.libraryIssues.push({kind: 'rule', key: 'example', problem: 'unresolved library finding', fix: 'needs adjudication'});
  if (role === 'review' && mode === 'dirty-confirm' && prompt.includes('CONFIRMING REVIEWER')) value.issues.push({ref: '18:1:1', field: 'syntaxUrdu', severity: 'minor', problem: 'still unresolved', fix: 'a correction'});
  fs.writeFileSync(get('--output-last-message'), JSON.stringify(value));
  process.stdout.write(JSON.stringify({type: 'mock.result', secret: 'SECRET_MUST_STAY_PRIVATE'}) + '\\n');
  if (marker) fs.unlinkSync(marker);
});
`;

async function fixture(context) {
  const work = await mkdtemp(join(tmpdir(), 'quran-grammar-runner-test-'));
  context.after(() => rm(work, { recursive: true, force: true }));
  for (const path of ['guide/authoring-guide.md', 'libs/rules.json', 'scripts/validate_chunk.py', 'workflows/chunks.js']) {
    await mkdir(dirname(join(work, path)), { recursive: true });
    await copyFile(join(ROOT, path), join(work, path));
  }
  for (const directory of ['meta', 'packets/18', 'chunks/18']) await mkdir(join(work, directory), { recursive: true });
  await writeFile(join(work, 'meta', 'words.json'), JSON.stringify(words));
  await writeFile(join(work, 'meta', 'overrides.json'), '{}');
  await writeFile(join(work, 'meta', 'plan.json'), JSON.stringify([spec]));
  await writeFile(join(work, 'packets', '18', `${CHUNK}.json`), JSON.stringify({ chunk: CHUNK, plannedWordIds: spec.wordIds, plannedAyahs: spec.ayahs, words: Object.entries(words).map(([id, word]) => ({ id, ...word })), ayahs: spec.ayahs.map((ayah) => ({ ayah })) }));
  await writeFile(join(work, 'payload.json'), JSON.stringify(pilot));
  await writeFile(join(work, 'mock-codex.cjs'), MOCK);
  await chmod(join(work, 'mock-codex.cjs'), 0o700);
  const command = async (mode = 'success', more = [], extraEnvironment = {}) => new Promise((accept, reject) => {
    const child = spawn(process.execPath, [RUNNER, '--work', work, '--chunks', CHUNK, '--agent-bin', join(work, 'mock-codex.cjs'), ...more], {
      env: { ...process.env, MOCK_MODE: mode, MOCK_PAYLOAD: join(work, 'payload.json'), MOCK_CALLS: join(work, 'calls.jsonl'), ...extraEnvironment },
    });
    let stdout = '', stderr = '';
    child.stdout.on('data', (data) => stdout += data);
    child.stderr.on('data', (data) => stderr += data);
    child.on('error', reject);
    child.on('close', (code) => accept({ code, stdout, stderr }));
  });
  return { work, command, checkpoint: async () => JSON.parse(await readFile(join(work, 'runs', 'codex', `${CHUNK}.json`), 'utf8')), calls: async () => (await readFile(join(work, 'calls.jsonl'), 'utf8')).trim().split('\n').map(JSON.parse) };
}

async function rootInputs(work) {
  const libraryFile = join(work, 'libs', 'roots', 'root-fixture.json');
  const entries = [
    { root: 'ك ت ب', meaningUrdu: 'لکھنا', noteUrdu: 'فراہم کردہ فرضی اندراج' },
    { root: 'غ ي ر', meaningUrdu: 'بدلنا', noteUrdu: 'پیکٹ میں شامل نہیں' },
  ];
  await mkdir(dirname(libraryFile), { recursive: true });
  await writeFile(libraryFile, JSON.stringify({ entries }));
  const packetFile = join(work, 'packets', '18', `${CHUNK}.json`);
  const packet = JSON.parse(await readFile(packetFile, 'utf8'));
  packet.roots = { [entries[0].root]: entries[0] };
  await writeFile(packetFile, JSON.stringify(packet));
  return { libraryFile, entries, packetFile, packet };
}

test('strict schemas reject missing or additional nested result fields', () => {
  const schema = strictSchema({ type: 'object', properties: { issues: { type: 'array', items: { type: 'object', properties: { severity: { type: 'string', enum: ['major', 'minor'] } } } } } });
  assert.equal(schema.additionalProperties, false);
  assert.equal(schema.properties.issues.items.additionalProperties, false);
  assert.equal(matchesSchema({ issues: [{ severity: 'minor' }] }, schema), true);
  assert.equal(matchesSchema({ issues: [{}] }, schema), false);
  assert.equal(matchesSchema({ issues: [{ severity: 'critical' }] }, schema), false);
  assert.equal(matchesSchema({ issues: [], surprise: true }, schema), false);
});

test('dry run validates source selection and starts no models or checkpoints', async (context) => {
  const setup = await fixture(context);
  const result = await setup.command('success', ['--dry-run']);
  assert.equal(result.code, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).publication, 'held-for-scholarly-review');
  await assert.rejects(readFile(join(setup.work, 'calls.jsonl')));
  await assert.rejects(setup.checkpoint());
});

test('successful workflow imports a validated draft, preserves private logs and resumes only unchanged content', async (context) => {
  const setup = await fixture(context);
  let result = await setup.command();
  assert.equal(result.code, 0, result.stderr);
  assert.equal(result.stdout.includes('SECRET_MUST_STAY_PRIVATE'), false);
  assert.equal(result.stderr.includes('SECRET_MUST_STAY_PRIVATE'), false);
  const checkpoint = await setup.checkpoint();
  assert.equal(checkpoint.status, 'ai-reviewed');
  assert.equal(checkpoint.publication, 'held-for-scholarly-review');
  assert.equal(checkpoint.validation.ok, true);
  const calls = await setup.calls();
  assert.equal(calls.length, 4);
  assert.deepEqual(calls.map((call) => call.sandbox), ['workspace-write', 'read-only', 'read-only', 'read-only']);
  assert.equal(calls.some((call) => call.args.includes('--model') || call.args.includes('--dangerously-bypass-approvals-and-sandbox')), false);
  result = await setup.command('success', ['--resume']);
  assert.equal(result.code, 0, result.stderr);
  assert.match(result.stdout, /skipped unchanged/);
  assert.equal((await setup.calls()).length, 4);
  await writeFile(join(setup.work, 'chunks', '18', `${CHUNK}.json`), `${JSON.stringify(pilot)}\n`);
  result = await setup.command('success', ['--resume']);
  assert.equal(result.code, 0, result.stderr);
  assert.equal((await setup.calls()).length, 8, 'content hash mismatch forces review');
  await writeFile(join(setup.work, 'libs', 'rules.json'), `${await readFile(join(setup.work, 'libs', 'rules.json'), 'utf8')}\n`);
  result = await setup.command('success', ['--resume']);
  assert.equal(result.code, 0, result.stderr);
  assert.equal((await setup.calls()).length, 12, 'library hash mismatch forces review');
  await writeFile(join(setup.work, 'packets', '18', `${CHUNK}.json`), `${await readFile(join(setup.work, 'packets', '18', `${CHUNK}.json`), 'utf8')}\n`);
  result = await setup.command('success', ['--resume']);
  assert.equal(result.code, 0, result.stderr);
  assert.equal((await setup.calls()).length, 16, 'packet hash mismatch forces review');
});

test('reuse-authored preserves valid authorship and runs three fresh review agents', async (context) => {
  const setup = await fixture(context);
  await writeFile(join(setup.work, 'chunks', '18', `${CHUNK}.json`), JSON.stringify(pilot));
  const result = await setup.command('success', ['--reuse-authored']);
  assert.equal(result.code, 0, result.stderr);
  const calls = await setup.calls();
  assert.equal(calls.length, 3);
  assert.equal(calls.every((call) => call.role === 'review' && call.sandbox === 'read-only'), true);
  const checkpoint = await setup.checkpoint();
  assert.equal(checkpoint.status, 'ai-reviewed');
  assert.match(checkpoint.result.authored.notes, /Existing authored draft SHA [a-f0-9]{64} reused after mechanical validation; no previous content review reused; full fresh independent reviews required/);
  const events = (await readFile(join(setup.work, 'runs', 'codex', 'journal.jsonl'), 'utf8')).trim().split('\n').map(JSON.parse);
  const reused = events.filter((event) => event.type === 'authored-reused');
  assert.equal(reused.length, 1);
  assert.equal(reused[0].contentHash, checkpoint.contentHash);
  assert.equal(events.some((event) => event.type === 'started' && event.phase === 'Author'), false);
});

for (const existing of ['missing', 'invalid']) {
  test(`reuse-authored with ${existing} existing draft falls through to normal author`, async (context) => {
    const setup = await fixture(context);
    if (existing === 'invalid') {
      const invalid = structuredClone(pilot);
      invalid.words[0].meaningUrdu = null;
      await writeFile(join(setup.work, 'chunks', '18', `${CHUNK}.json`), JSON.stringify(invalid));
    }
    const result = await setup.command('success', ['--reuse-authored']);
    assert.equal(result.code, 0, result.stderr);
    const calls = await setup.calls();
    assert.equal(calls.length, 4);
    assert.equal(calls[0].role, 'author');
    assert.equal((await setup.checkpoint()).status, 'ai-reviewed');
  });
}

test('new rule or supplied root input reuses authorship but never previous review approval', async (context) => {
  const setup = await fixture(context);
  const inputs = await rootInputs(setup.work);
  await writeFile(join(setup.work, 'chunks', '18', `${CHUNK}.json`), JSON.stringify(pilot));
  let result = await setup.command('success', ['--reuse-authored']);
  assert.equal(result.code, 0, result.stderr);
  assert.equal((await setup.calls()).length, 3);
  const rulesFile = join(setup.work, 'libs', 'rules.json');
  await writeFile(rulesFile, `${await readFile(rulesFile, 'utf8')}\n`);
  result = await setup.command('success', ['--resume', '--reuse-authored']);
  assert.equal(result.code, 0, result.stderr);
  assert.equal((await setup.calls()).length, 6, 'changed rules require both independent reviews and confirmation again');
  inputs.entries[0].noteUrdu += ' ترمیم';
  await writeFile(inputs.libraryFile, JSON.stringify({ entries: inputs.entries }));
  await writeFile(inputs.packetFile, JSON.stringify(inputs.packet));
  result = await setup.command('success', ['--resume', '--reuse-authored']);
  assert.equal(result.code, 0, result.stderr);
  assert.equal((await setup.calls()).length, 9, 'changed supplied root requires fresh reviews');
  assert.equal((await setup.calls()).every((call) => call.role === 'review'), true);
  result = await setup.command('success', ['--resume', '--reuse-authored']);
  assert.equal(result.code, 0, result.stderr);
  assert.match(result.stdout, /skipped unchanged/);
  assert.equal((await setup.calls()).length, 9, 'exact reviewed checkpoint still follows normal resume rules');
});

for (const [mode, message] of [
  ['transport', /transport failed/],
  ['missing', /Missing or invalid agent result/],
  ['bad-schema', /does not match required schema/],
  ['bad-coverage', /Incomplete review coverage/],
  ['bad-author-coverage', /Incomplete author ayah coverage/],
  ['invalid-chunk', /Local validator failed/],
  ['protected-input', /changed protected inputs/],
  ['race-overrides', /Source inputs changed during review/],
  ['reviewer-write', /reviewer changed chunk/],
  ['library-issue', /did not confirm/],
  ['dirty-confirm', /did not confirm/],
]) {
  test(`${mode} fails closed without importing or claiming review`, async (context) => {
    const setup = await fixture(context);
    const result = await setup.command(mode);
    assert.equal(result.code, 1);
    assert.match(result.stderr, message);
    assert.equal((await setup.checkpoint()).status, 'blocked');
    await assert.rejects(readFile(join(setup.work, 'chunks', '18', `${CHUNK}.json`)));
    assert.equal(result.stdout.includes('SECRET_MUST_STAY_PRIVATE'), false);
    assert.equal(result.stderr.includes('SECRET_MUST_STAY_PRIVATE'), false);
  });
}

test('SIGTERM cancels the child process and leaves a blocked, resumable checkpoint', { timeout: 10000 }, async (context) => {
  const setup = await fixture(context);
  const child = spawn(process.execPath, [RUNNER, '--work', setup.work, '--chunks', CHUNK, '--agent-bin', join(setup.work, 'mock-codex.cjs')], {
    env: { ...process.env, MOCK_MODE: 'hang', MOCK_PAYLOAD: join(setup.work, 'payload.json'), MOCK_CALLS: join(setup.work, 'calls.jsonl') },
  });
  context.after(() => child.kill('SIGKILL'));
  let output = '';
  child.stdout.on('data', (data) => output += data);
  child.stderr.on('data', (data) => output += data);
  const exit = new Promise((accept) => child.on('close', (code) => accept(code)));
  const deadline = Date.now() + 3000;
  while (Date.now() < deadline) {
    try { if ((await setup.calls()).length > 0) break; } catch { /* Waiting for mock to start. */ }
    await new Promise((accept) => setTimeout(accept, 25));
  }
  assert.equal((await setup.calls()).length, 1);
  child.kill('SIGTERM');
  assert.equal(await exit, 1);
  assert.match(output, /cancelled/);
  assert.equal((await setup.checkpoint()).status, 'blocked');
  await assert.rejects(readFile(join(setup.work, 'chunks', '18', `${CHUNK}.json`)));
  const result = await setup.command('success', ['--resume']);
  assert.equal(result.code, 0, result.stderr);
  assert.equal((await setup.checkpoint()).status, 'ai-reviewed');
});

test('overlapping chunks share a single global agent concurrency bound', async (context) => {
  const setup = await fixture(context);
  const second = '18-c02';
  const secondSpec = { ...spec, chunk: second };
  await writeFile(join(setup.work, 'meta', 'plan.json'), JSON.stringify([spec, secondSpec]));
  const packet = JSON.parse(await readFile(join(setup.work, 'packets', '18', `${CHUNK}.json`), 'utf8'));
  await writeFile(join(setup.work, 'packets', '18', `${second}.json`), JSON.stringify({ ...packet, chunk: second }));
  await mkdir(join(setup.work, 'activity'));
  const result = await setup.command('success', ['--chunks', `${CHUNK},${second}`, '--concurrency', '2', '--chunk-concurrency', '2'], { MOCK_ACTIVE_DIR: join(setup.work, 'activity') });
  assert.equal(result.code, 0, result.stderr);
  const calls = await setup.calls();
  assert.equal(calls.length, 8);
  assert.equal(Math.max(...calls.map((call) => call.active)), 2);
  assert.deepEqual(new Set(calls.slice(0, 2).map((call) => call.chunk)), new Set([CHUNK, second]));
});

test('blocked candidates stay private and are reused only with matching hashes', async (context) => {
  const setup = await fixture(context);
  let result = await setup.command('library-issue');
  assert.equal(result.code, 1);
  const checkpoint = await setup.checkpoint();
  assert.equal(checkpoint.result.status, 'blocked');
  assert.ok(checkpoint.candidateHash);
  assert.equal(JSON.parse(await readFile(join(setup.work, 'runs', 'codex', `${CHUNK}.candidate.json`), 'utf8')).chunk, CHUNK);
  result = await setup.command('success', ['--resume']);
  assert.equal(result.code, 0, result.stderr);
  assert.deepEqual((await setup.calls()).filter((call) => call.role === 'author').map((call) => call.hadCandidate), [false, true]);
  await assert.rejects(readFile(join(setup.work, 'runs', 'codex', `${CHUNK}.candidate.json`)));
  assert.equal((await setup.checkpoint()).status, 'ai-reviewed');
});

test('tampered blocked candidate is discarded on resume', async (context) => {
  const setup = await fixture(context);
  assert.equal((await setup.command('library-issue')).code, 1);
  const candidate = join(setup.work, 'runs', 'codex', `${CHUNK}.candidate.json`);
  await writeFile(candidate, `${await readFile(candidate, 'utf8')}\n`);
  const result = await setup.command('success', ['--resume']);
  assert.equal(result.code, 0, result.stderr);
  assert.deepEqual((await setup.calls()).filter((call) => call.role === 'author').map((call) => call.hadCandidate), [false, false]);
});

test('stale library text embedded in a packet blocks before any model starts', async (context) => {
  const setup = await fixture(context);
  await mkdir(join(setup.work, 'libs', 'roots'));
  await writeFile(join(setup.work, 'libs', 'roots', 'root-example.json'), JSON.stringify({ entries: [{ root: 'ك ت ب', meaningUrdu: 'لکھنا' }] }));
  const packetFile = join(setup.work, 'packets', '18', `${CHUNK}.json`);
  const packet = JSON.parse(await readFile(packetFile, 'utf8'));
  packet.roots = { 'ك ت ب': { root: 'ك ت ب', meaningUrdu: 'پرانا متن' } };
  await writeFile(packetFile, JSON.stringify(packet));
  const result = await setup.command('success', ['--dry-run']);
  assert.equal(result.code, 1);
  assert.match(result.stderr, /Stale roots reference/);
  await assert.rejects(setup.calls());
});

test('updated adjudication blocks dry-run and resume until effective packet corrections are rebuilt', async (context) => {
  const setup = await fixture(context);
  const sourceFile = join(setup.work, 'meta', 'words.json');
  const source = JSON.parse(await readFile(sourceFile, 'utf8'));
  const id = pilot.words.find((word) => Object.hasOwn(word, 'verbNoteUrdu')).id;
  const rawKey = 'synthetic|I|ACT';
  const correctedKey = 'synthetic|II|PASS';
  source[id].verb = { form: 'I', mood: null, png: '3MS', passive: false };
  source[id].lexemeKey = rawKey;
  await writeFile(sourceFile, JSON.stringify(source));
  await mkdir(join(setup.work, 'libs', 'lexemes'));
  await writeFile(join(setup.work, 'libs', 'lexemes', 'fixture.json'), JSON.stringify({ entries: [{ key: rawKey }, { key: correctedKey }] }));
  const packetFile = join(setup.work, 'packets', '18', `${CHUNK}.json`);
  const packet = JSON.parse(await readFile(packetFile, 'utf8'));
  Object.assign(packet.words.find((word) => word.id === id), { verb: source[id].verb, lexemeKey: rawKey });
  packet.lexemes = { [rawKey]: { key: rawKey } };
  await writeFile(packetFile, JSON.stringify(packet));
  let result = await setup.command();
  assert.equal(result.code, 0, result.stderr);
  const oldHash = (await setup.checkpoint()).hashes.overrides;
  const correction = { lexemeKey: correctedKey, verbForm: 'II', mood: 'JUS', passive: true, png: '2MP', noteEnglish: 'Synthetic adjudication used only in this isolated transport fixture.' };
  await writeFile(join(setup.work, 'meta', 'overrides.json'), JSON.stringify({ [id]: correction }));
  for (const flag of ['--dry-run', '--resume']) {
    result = await setup.command('success', [flag]);
    assert.equal(result.code, 1);
    assert.match(result.stderr, /Stale occurrence correction/);
    assert.equal((await setup.calls()).length, 4);
  }
  const correctedWord = packet.words.find((word) => word.id === id);
  correctedWord.verb = { form: 'II', mood: 'JUS', png: '2MP', passive: true };
  correctedWord.lexemeKey = correctedKey;
  correctedWord.qacCorrection = correction.noteEnglish + ' Follow this correction, not the raw QAC tag or the generated i‘rab line; record it in auditNotes.';
  packet.lexemes = { [correctedKey]: { key: correctedKey } };
  await writeFile(packetFile, JSON.stringify(packet));
  result = await setup.command('success', ['--resume']);
  assert.equal(result.code, 0, result.stderr);
  assert.notEqual((await setup.checkpoint()).hashes.overrides, oldHash);
  assert.equal((await setup.calls()).length, 8, 'new correction requires fresh reviews');
});

test('scoped library fingerprints ignore unused root edits, but require review for supplied roots and all rules', async (context) => {
  const setup = await fixture(context);
  const inputs = await rootInputs(setup.work);
  let result = await setup.command();
  assert.equal(result.code, 0, result.stderr);
  const originalHash = (await setup.checkpoint()).hashes.libraries;
  inputs.entries[1].noteUrdu += ' ترمیم';
  await writeFile(inputs.libraryFile, JSON.stringify({ entries: inputs.entries }));
  result = await setup.command('success', ['--resume']);
  assert.equal(result.code, 0, result.stderr);
  assert.match(result.stdout, /skipped unchanged/);
  assert.equal((await setup.calls()).length, 4);
  assert.equal((await setup.checkpoint()).hashes.libraries, originalHash);
  inputs.entries[0].noteUrdu += ' ترمیم';
  await writeFile(inputs.libraryFile, JSON.stringify({ entries: inputs.entries }));
  result = await setup.command('success', ['--resume']);
  assert.equal(result.code, 1);
  assert.match(result.stderr, /Stale roots reference/);
  assert.equal((await setup.calls()).length, 4);
  await writeFile(inputs.packetFile, JSON.stringify(inputs.packet));
  result = await setup.command('success', ['--resume']);
  assert.equal(result.code, 0, result.stderr);
  assert.notEqual((await setup.checkpoint()).hashes.libraries, originalHash);
  assert.equal((await setup.calls()).length, 8);
  const rulesFile = join(setup.work, 'libs', 'rules.json');
  await writeFile(rulesFile, `${await readFile(rulesFile, 'utf8')}\n`);
  result = await setup.command('success', ['--resume']);
  assert.equal(result.code, 0, result.stderr);
  assert.equal((await setup.calls()).length, 12, 'every supplied rules byte participates in the fingerprint');
});

for (const mode of ['race-relevant-root', 'race-unused-root']) {
  test(`${mode}: import rechecks precisely the supplied library entries`, async (context) => {
    const setup = await fixture(context);
    await rootInputs(setup.work);
    const result = await setup.command(mode);
    if (mode === 'race-relevant-root') {
      assert.equal(result.code, 1);
      assert.match(result.stderr, /Source inputs changed during review/);
      assert.equal((await setup.checkpoint()).status, 'blocked');
      await assert.rejects(readFile(join(setup.work, 'chunks', '18', `${CHUNK}.json`)));
    } else {
      assert.equal(result.code, 0, result.stderr);
      assert.equal((await setup.checkpoint()).status, 'ai-reviewed');
    }
  });
}

test('isolated workflow validates against the same effective type overrides as its packet', async (context) => {
  const setup = await fixture(context);
  // Synthetic transport classification only; the repository pilot is unchanged.
  const id = spec.wordIds[0];
  const source = structuredClone(words);
  source[id].pos = 'verb';
  await writeFile(join(setup.work, 'meta/words.json'), JSON.stringify(source));
  const note = 'Synthetic transport override; no actual Quran morphology adjudication.';
  await writeFile(join(setup.work, 'meta/overrides.json'), JSON.stringify({ [id]: { pos: 'particle', noteEnglish: note } }));
  const packetFile = join(setup.work, 'packets/18', `${CHUNK}.json`);
  const packet = JSON.parse(await readFile(packetFile, 'utf8'));
  packet.words[0].pos = 'particle';
  packet.words[0].qacCorrection = `${note} Follow this correction, not the raw QAC tag or the generated i‘rab line; record it in auditNotes.`;
  await writeFile(packetFile, JSON.stringify(packet));
  const authored = structuredClone(pilot);
  authored.words[0].posUrdu = 'حرف';
  await writeFile(join(setup.work, 'payload.json'), JSON.stringify(authored));
  const result = await setup.command();
  assert.equal(result.code, 0, result.stderr);
  const checkpoint = await setup.checkpoint();
  assert.equal(checkpoint.status, 'ai-reviewed');
  assert.equal(checkpoint.validation.warnings.some((warning) => warning.startsWith(`word ${id}: posUrdu`)), false);
  assert.deepEqual(JSON.parse(await readFile(join(setup.work, 'meta/words.json'), 'utf8')), source);
});

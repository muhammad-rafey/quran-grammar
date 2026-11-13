#!/usr/bin/env node
/** Export safe, deterministic review summaries only after every planned chunk is current.
 * The private checkpoints/journal remain authoritative raw review records. This
 * command neither grants scholarly approval nor changes runtime availability.
 */
import { execFile } from 'node:child_process';
import { createHash, randomUUID } from 'node:crypto';
import { access, lstat, mkdir, readFile, readdir, rename, rm, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execute = promisify(execFile);
const DEFAULT_WORK = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const RUNNER = fileURLToPath(new URL('./run_chunks.mjs', import.meta.url));
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const exists = (path) => access(path).then(() => true, () => false);
const digest = /^[a-f0-9]{64}$/;
const issueFields = new Set(['id', 'meaningUrdu', 'posUrdu', 'lemma', 'morphologyUrdu', 'syntaxUrdu', 'dictionaryUrdu', 'segments', 'ruleIds', 'verbNoteUrdu', 'translationUrdu', 'themeUrdu', 'tafsirUrdu', 'phrases', 'words', 'ayahs', 'auditNotes', 'labelUrdu', 'explanationUrdu', 'wordIds', 'roleUrdu', 'arabic']);
const canonical = (value) => JSON.stringify(Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b))));
const count = (value) => Number.isSafeInteger(value) && value >= 0;
const empty = (value) => Array.isArray(value) && value.length === 0;
const fail = (chunk, message) => { throw new Error(`${chunk}: ${message}`); };

/** Public tracked dependencies only; CI can check these without ignored packets.
 * Keep this exact allowlist separate from per-chunk private runner fingerprints.
 */
export async function reviewSourceFilesSha256(work) {
  const paths = ['guide/authoring-guide.md', 'workflows/chunks.js', 'scripts/validate_chunk.py',
    'meta/plan.json', 'meta/overrides.json', 'libs/rules.json'];
  if (await exists(join(work, 'edition.json'))) paths.push('edition.json');
  for (const directory of ['libs/lexemes', 'libs/roots']) {
    if (!(await lstat(join(work, directory))).isDirectory()) throw new Error('Review source library directory must be a regular directory');
    for (const entry of await readdir(join(work, directory), { withFileTypes: true })) {
      if (!entry.name.endsWith('.json')) continue;
      if (!entry.isFile()) throw new Error('Review source library entries must be regular files');
      paths.push(`${directory}/${entry.name}`);
    }
  }
  const records = [];
  for (const path of paths.sort()) {
    if (!(await lstat(join(work, path))).isFile()) throw new Error('Review sources must be regular files');
    records.push([path, sha(await readFile(join(work, path)))]);
  }
  return Object.fromEntries(records);
}

async function checkedJson(path, label) {
  let bytes;
  try { bytes = await readFile(path); return { bytes, data: JSON.parse(bytes) }; }
  catch { throw new Error(`Cannot read valid ${label}`); }
}

async function fingerprints(work, runDir, chunks) {
  let output;
  try {
    ({ stdout: output } = await execute(process.execPath, [RUNNER, '--work', work, '--run-dir', runDir, '--chunks', chunks.join(','), '--dry-run'], { maxBuffer: 16 * 1024 * 1024 }));
  } catch {
    throw new Error('Current input fingerprint validation failed; rebuild source packets before exporting reviews');
  }
  let value;
  try { value = JSON.parse(output); } catch { throw new Error('Fingerprint runner returned invalid JSON'); }
  if (value.dryRun !== true || !Array.isArray(value.chunks) || value.chunks.length !== chunks.length) throw new Error('Fingerprint runner returned incomplete coverage');
  const hashes = new Map();
  for (const [index, entry] of value.chunks.entries()) {
    if (entry.chunk !== chunks[index] || !entry.hashes || Object.values(entry.hashes).some((hash) => typeof hash !== 'string' || !digest.test(hash))) throw new Error('Fingerprint runner returned invalid input hashes');
    hashes.set(entry.chunk, entry.hashes);
  }
  return hashes;
}

function publicIssue(issue, spec) {
  if (!issue || !['critical', 'major', 'minor'].includes(issue.severity)) throw new Error('Malformed historical confirmation issue');
  const ayah = typeof issue.ref === 'string' ? issue.ref.match(/^(\d+):(\d+)(?: phrase \d+)?$/) : null;
  const scopedRef = spec.wordIds.includes(issue.ref) || (ayah && Number(ayah[1]) === spec.surah && spec.ayahs.includes(Number(ayah[2])));
  return {
    // Unstructured model prose is intentionally excluded from public reports.
    ref: scopedRef ? issue.ref : 'not-exported',
    field: issueFields.has(issue.field) ? issue.field : 'other',
    severity: issue.severity,
  };
}

function publicRejection(rejection, spec) {
  const safe = publicIssue({ ...rejection, severity: 'minor' }, spec);
  return { ref: safe.ref, field: safe.field };
}

function safeResult(checkpoint, spec) {
  const { chunk } = spec;
  const result = checkpoint.result;
  if (checkpoint.chunk !== chunk || checkpoint.status !== 'ai-reviewed' || checkpoint.publication !== 'held-for-scholarly-review') fail(chunk, 'review checkpoint is not an AI-reviewed held draft');
  if (!result || result.chunk !== chunk || result.status !== 'ai-reviewed' || result.scholarlyReview !== 'pending') fail(chunk, 'review result is missing or does not retain pending scholarly status');
  if (!empty(result.blockingReasons) || !empty(result.libraryIssues)) fail(chunk, 'review still has blocking or shared-library findings');
  const authored = result.authored;
  if (!authored || authored.validatorOk !== true || authored.words !== spec.wordIds.length || authored.ayahs !== spec.ayahs.length) fail(chunk, 'author coverage does not match the current plan');
  if (checkpoint.validation?.ok !== true || !empty(checkpoint.validation.errors) || (checkpoint.validation.chunk !== undefined && checkpoint.validation.chunk !== chunk)) fail(chunk, 'stored mechanical validation did not pass');
  for (const field of ['reviewIssues', 'reviewCritical', 'reviewMajor']) if (!count(result[field])) fail(chunk, 'invalid review issue counts');
  if (result.reviewCritical + result.reviewMajor > result.reviewIssues) fail(chunk, 'inconsistent review issue counts');
  const fixed = result.fix1;
  if (!fixed || fixed.validatorOk !== true || !count(fixed.applied) || !count(fixed.rejected)) fail(chunk, 'initial fixes are not validated');
  if (!Array.isArray(result.confirms) || !result.confirms.length) fail(chunk, 'no final confirmation exists');
  const confirms = result.confirms.map((confirmation, index) => {
    if (!confirmation || confirmation.round !== index + 1 || !Array.isArray(confirmation.issues)) fail(chunk, 'confirmation rounds are malformed');
    return { round: confirmation.round, issues: confirmation.issues.map((issue) => publicIssue(issue, spec)) };
  });
  if (!empty(confirms.at(-1).issues)) fail(chunk, 'final confirmation still has findings');
  let finalFix = null;
  if (result.finalFix !== null) {
    const last = result.finalFix;
    if (!last || last.validatorOk !== true || !count(last.applied) || !Array.isArray(last.rejected)) fail(chunk, 'last fixes are not validated');
    // gen_audit consumes first-round counters and confirmation issue counts. Keep
    // the later count without exporting rejection reasons or model notes.
    finalFix = { validatorOk: true, applied: last.applied, rejected: last.rejected.map((rejection) => publicRejection(rejection, spec)) };
  }
  return {
    chunk, status: 'ai-reviewed', scholarlyReview: 'pending', blockingReasons: [],
    authored: { validatorOk: true, words: authored.words, ayahs: authored.ayahs },
    reviewIssues: result.reviewIssues, reviewCritical: result.reviewCritical, reviewMajor: result.reviewMajor,
    fix1: { applied: fixed.applied, rejected: fixed.rejected, validatorOk: true },
    confirms, finalFix, libraryIssues: [],
  };
}

/** Stage both reports, then replace them; restore earlier replacements on error.
 * replace is injectable only for deterministic offline I/O-failure tests.
 */
export async function writeReportPair(items, { replace = rename } = {}) {
  const staged = [];
  const replaced = [];
  try {
    for (const { path, body } of items) {
      await mkdir(dirname(path), { recursive: true });
      let previous = null;
      let previousMode = 0o644;
      if (await exists(path)) {
        const stat = await lstat(path);
        if (!stat.isFile()) throw new Error('Report target must be a regular file');
        previous = await readFile(path);
        previousMode = stat.mode & 0o777;
      }
      const temporary = join(dirname(path), `.review-export-${randomUUID()}.tmp`);
      staged.push({ path, temporary, previous, previousMode });
      await writeFile(temporary, body, { mode: 0o644 });
    }
    for (const entry of staged) {
      await replace(entry.temporary, entry.path);
      replaced.push(entry);
    }
  } catch (error) {
    const failures = [];
    for (const entry of replaced.reverse()) {
      try {
        if (entry.previous === null) await rm(entry.path, { force: true });
        else {
          const restore = join(dirname(entry.path), `.review-export-restore-${randomUUID()}.tmp`);
          try {
            await writeFile(restore, entry.previous, { mode: entry.previousMode });
            await rename(restore, entry.path);
          } finally { await rm(restore, { force: true }); }
        }
      } catch (restoreError) { failures.push(restoreError); }
    }
    if (failures.length) throw new AggregateError([error, ...failures], 'Report replacement failed and rollback could not finish');
    throw error;
  } finally {
    await Promise.all(staged.map(({ temporary }) => rm(temporary, { force: true })));
  }
}

export async function exportReviews({ work = DEFAULT_WORK, runDir } = {}) {
  work = resolve(work);
  runDir = resolve(runDir ?? join(work, 'runs', 'codex'));
  const relativeRun = relative(join(work, 'runs'), runDir);
  if (isAbsolute(relativeRun) || relativeRun === '..' || relativeRun.startsWith(`..${sep}`)) throw new Error('Review run directory must remain inside the pipeline runs directory');
  if (await exists(join(runDir, '.runner.lock'))) throw new Error('Wait for the active chunk runner to finish before exporting reviews');
  const planRecord = await checkedJson(join(work, 'meta', 'plan.json'), 'chunk plan');
  const plan = planRecord.data;
  if (!Array.isArray(plan) || !plan.length) throw new Error('The chunk plan must be a nonempty list');
  const ids = plan.map((spec) => spec?.chunk);
  if (new Set(ids).size !== plan.length) throw new Error('The chunk plan contains duplicate chunks');
  for (const spec of plan) {
    if (!spec || !/^\d{1,3}-c\d{2,3}$/.test(spec.chunk) || spec.surah !== Number(spec.chunk.split('-')[0]) || !Array.isArray(spec.wordIds) || !spec.wordIds.length || !Array.isArray(spec.ayahs) || !spec.ayahs.length) throw new Error('The chunk plan contains an invalid entry');
  }
  const sourceFilesSha256 = await reviewSourceFilesSha256(work);
  if (sourceFilesSha256['meta/plan.json'] !== sha(planRecord.bytes)) throw new Error('Chunk plan changed during review export');
  const current = await fingerprints(work, runDir, ids);
  const rows = [];
  const results = [];
  const snapshots = [];
  for (const spec of plan) {
    const { chunk } = spec;
    const checkpointFile = join(runDir, `${chunk}.json`);
    const record = await checkedJson(checkpointFile, `review checkpoint for ${chunk}`);
    const checkpoint = record.data;
    const expected = current.get(chunk);
    if (!checkpoint?.hashes || canonical(checkpoint.hashes) !== canonical(expected)) fail(chunk, 'review input fingerprints are stale');
    const contentFile = join(work, 'chunks', String(spec.surah), `${chunk}.json`);
    const content = await checkedJson(contentFile, `authored chunk ${chunk}`);
    const contentHash = sha(content.bytes);
    if (!digest.test(checkpoint.contentHash ?? '') || checkpoint.contentHash !== contentHash) fail(chunk, 'authored content changed since its reviewed checkpoint');
    if (content.data?.chunk !== chunk || JSON.stringify(content.data.words?.map((word) => word.id)) !== JSON.stringify(spec.wordIds) || JSON.stringify(content.data.ayahs?.map((ayah) => ayah.number)) !== JSON.stringify(spec.ayahs)) fail(chunk, 'authored word or ayah coverage does not match the plan');
    const result = safeResult(checkpoint, spec);
    let validation;
    try {
      const { stdout } = await execute('python3', ['-I', join(work, 'scripts', 'validate_chunk.py'), work, chunk], { maxBuffer: 2 * 1024 * 1024 });
      validation = JSON.parse(stdout);
    } catch { fail(chunk, 'current mechanical chunk validation failed'); }
    if (validation.ok !== true || !empty(validation.errors) || validation.chunk !== chunk) fail(chunk, 'current mechanical chunk validation failed');
    results.push({ ...result, contentSha256: contentHash });
    rows.push({
      chunk, status: 'ai-reviewed', scholarlyReview: 'pending', contentSha256: contentHash,
      inputHashes: expected, words: spec.wordIds.length, ayahs: spec.ayahs.length,
      reviewIssues: result.reviewIssues, reviewCritical: result.reviewCritical, reviewMajor: result.reviewMajor,
      confirmationRounds: result.confirms.length,
    });
    snapshots.push({ checkpointFile, checkpointHash: sha(record.bytes), contentFile, contentHash });
  }
  // No report is touched until the entire plan passes, and the same inputs and
  // checkpoint/content snapshots are observed immediately before replacement.
  if (await exists(join(runDir, '.runner.lock'))) throw new Error('Chunk runner became active during review export');
  if (sha(await readFile(join(work, 'meta', 'plan.json'))) !== sha(planRecord.bytes)) throw new Error('Chunk plan changed during review export');
  const latest = await fingerprints(work, runDir, ids);
  for (const id of ids) if (canonical(latest.get(id)) !== canonical(current.get(id))) fail(id, 'inputs changed during review export');
  for (const snapshot of snapshots) {
    if (sha(await readFile(snapshot.checkpointFile)) !== snapshot.checkpointHash || sha(await readFile(snapshot.contentFile)) !== snapshot.contentHash) throw new Error('Review records changed during export');
  }
  if (canonical(await reviewSourceFilesSha256(work)) !== canonical(sourceFilesSha256)) throw new Error('Tracked review sources changed during export');
  const reports = join(work, 'reports');
  if (await exists(reports) && (await lstat(reports)).isSymbolicLink()) throw new Error('Reports directory must not be a symlink');
  const manifest = {
    schemaVersion: 1, complete: true, expectedChunks: plan.length, reviewedChunks: rows.length,
    status: 'ai-reviewed', scholarlyReview: 'pending', publication: 'held-for-scholarly-review',
    safeSummaryOnly: true,
    notice: 'Safe summaries of current private checkpoint results. Model prose and private paths are omitted; raw provenance remains in the private journal. AI review is not scholarly approval.',
    sourceFilesSha256, chunks: rows,
  };
  await writeReportPair([
    { path: join(reports, 'chunk-review-manifest.json'), body: `${JSON.stringify(manifest, null, 2)}\n` },
    { path: join(reports, 'chunk-results.json'), body: `${JSON.stringify(results, null, 2)}\n` },
  ]);
  return manifest;
}

export async function run(argv = process.argv.slice(2)) {
  const options = {};
  for (let index = 0; index < argv.length; index++) {
    const flag = argv[index];
    if (flag === '--help' || flag === '-h') {
      process.stdout.write('Usage: node content-pipeline/scripts/export_reviews.mjs [--work PATH] [--run-dir PATH]\nExports only complete, current AI-review summaries; scholarly approval remains pending.\n');
      return;
    }
    if (!['--work', '--run-dir'].includes(flag) || !argv[index + 1] || argv[index + 1].startsWith('--')) throw new Error('Expected --work PATH or --run-dir PATH');
    options[flag === '--work' ? 'work' : 'runDir'] = argv[++index];
  }
  const manifest = await exportReviews(options);
  process.stdout.write(`Exported ${manifest.reviewedChunks} current chunk review summaries; scholarly review remains pending.\n`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  run().catch((error) => { process.stderr.write(`Review export blocked: ${error.message}\n`); process.exitCode = 1; });
}

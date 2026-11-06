#!/usr/bin/env node
/** Execute the existing Workflow prompts using the locally authenticated Codex CLI.
 * Outputs are authoring drafts only; this script never changes the lesson registry.
 */
import { spawn } from 'node:child_process';
import { createHash, randomUUID } from 'node:crypto';
import { createWriteStream } from 'node:fs';
import { access, chmod, copyFile, lstat, mkdir, mkdtemp, open, readFile, readdir, rename, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT_WORK = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
const sha = (value) => createHash('sha256').update(value).digest('hex');
const json = async (file) => JSON.parse(await readFile(file, 'utf8'));
const exists = async (file) => access(file).then(() => true, () => false);
const inside = (base, file) => {
  const path = relative(base, file);
  return path === '' || (!isAbsolute(path) && path !== '..' && !path.startsWith(`..${sep}`));
};

export function strictSchema(schema) {
  const result = structuredClone(schema);
  if (result.type === 'object') {
    result.additionalProperties = false;
    result.properties = Object.fromEntries(Object.entries(result.properties ?? {}).map(([key, value]) => [key, strictSchema(value)]));
    result.required = Object.keys(result.properties);
  }
  if (result.items) result.items = strictSchema(result.items);
  return result;
}

export function matchesSchema(value, schema) {
  if (schema.enum && !schema.enum.includes(value)) return false;
  if (schema.type === 'object') {
    if (!value || Array.isArray(value) || typeof value !== 'object') return false;
    if ((schema.required ?? []).some((key) => !Object.hasOwn(value, key))) return false;
    if (schema.additionalProperties === false && Object.keys(value).some((key) => !Object.hasOwn(schema.properties ?? {}, key))) return false;
    return Object.entries(value).every(([key, entry]) => !schema.properties?.[key] || matchesSchema(entry, schema.properties[key]));
  }
  if (schema.type === 'array') return Array.isArray(value) && value.every((entry) => matchesSchema(entry, schema.items));
  if (schema.type === 'integer') return Number.isSafeInteger(value);
  return typeof value === schema.type;
}

async function atomicWrite(file, value) {
  await mkdir(dirname(file), { recursive: true });
  const temporary = `${file}.tmp-${randomUUID()}`;
  try {
    await writeFile(temporary, value, { mode: 0o600 });
    await rename(temporary, file);
  } finally {
    await rm(temporary, { force: true });
  }
}

async function treeHashes(directory, prefix = '') {
  const entries = [];
  for (const item of (await readdir(directory, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
    const name = prefix ? `${prefix}/${item.name}` : item.name;
    const path = join(directory, item.name);
    const stat = await lstat(path);
    if (stat.isSymbolicLink()) throw new Error('Symlink in isolated inputs or outputs');
    if (stat.isDirectory()) entries.push(...await treeHashes(path, name));
    else if (stat.isFile()) entries.push([name, sha(await readFile(path))]);
    else throw new Error('Unexpected non-file in isolated workspace');
  }
  return entries;
}

async function readLibraries(work) {
  const entries = { lexemes: new Map(), roots: new Map() };
  for (const [file] of await treeHashes(join(work, 'libs'))) {
    const kind = file.startsWith('lexemes/') ? 'lexemes' : file.startsWith('roots/') ? 'roots' : null;
    if (!kind || !file.endsWith('.json')) continue;
    for (const entry of (await json(join(work, 'libs', file))).entries ?? []) {
      entries[kind].set(kind === 'lexemes' ? entry.key : entry.root, entry);
    }
  }
  return { entries, rules: sha(await readFile(join(work, 'libs', 'rules.json'))) };
}

function chunkLibraryHash(packet, libraries) {
  // Authors receive all rules, but root/paradigm entries only through this packet.
  // Unrelated library edits must not invalidate an otherwise identical review.
  return sha(JSON.stringify({
    version: 2,
    rules: libraries.rules,
    lexemes: Object.keys(packet.lexemes ?? {}).sort().map((key) => [key, libraries.entries.lexemes.get(key)]),
    roots: Object.keys(packet.roots ?? {}).sort().map((key) => [key, libraries.entries.roots.get(key)]),
  }));
}

function bounded(limit) {
  let active = 0;
  const waiting = [];
  return async (operation) => {
    if (active >= limit) await new Promise((resume) => waiting.push(resume));
    else active++;
    try { return await operation(); }
    finally {
      const next = waiting.shift();
      if (next) next();
      else active--;
    }
  };
}

function parseOptions(argv) {
  const options = { work: DEFAULT_WORK, chunks: [], concurrency: 3, chunkConcurrency: 3, maxConfirmRounds: 3, agentBin: 'codex', resume: false, reuseAuthored: false, dryRun: false };
  const valued = { '--work': 'work', '--chunks': 'chunks', '--concurrency': 'concurrency', '--chunk-concurrency': 'chunkConcurrency', '--max-confirm-rounds': 'maxConfirmRounds', '--agent-bin': 'agentBin', '--run-dir': 'runDir' };
  for (let index = 0; index < argv.length; index++) {
    const option = argv[index];
    if (option === '--help' || option === '-h') options.help = true;
    else if (option === '--resume') options.resume = true;
    else if (option === '--reuse-authored') options.reuseAuthored = true;
    else if (option === '--dry-run') options.dryRun = true;
    else if (Object.hasOwn(valued, option)) {
      const value = argv[++index];
      if (!value || value.startsWith('--')) throw new Error(`Missing value for ${option}`);
      options[valued[option]] = option === '--chunks' ? value.split(',').filter(Boolean) : value;
    } else throw new Error(`Unknown option ${option}`);
  }
  for (const key of ['concurrency', 'chunkConcurrency', 'maxConfirmRounds']) {
    options[key] = Number(options[key]);
    if (!Number.isInteger(options[key]) || options[key] < 1 || options[key] > 16) throw new Error(`${key} must be between 1 and 16`);
  }
  options.work = resolve(options.work);
  options.runDir = resolve(options.runDir ?? join(options.work, 'runs', 'codex'));
  if (!inside(join(options.work, 'runs'), options.runDir)) throw new Error('--run-dir must be inside content-pipeline/runs (private, ignored logs)');
  if (options.agentBin.includes(sep)) options.agentBin = resolve(options.agentBin);
  if (options.chunks.length === 0 && !options.help) throw new Error('Specify --chunks with comma-separated chunk IDs');
  if (new Set(options.chunks).size !== options.chunks.length || options.chunks.some((chunk) => !/^(18|23|32|36|55)-c\d{2}$/.test(chunk))) throw new Error('Invalid or duplicate chunk IDs');
  return options;
}

const HELP = `Usage: node content-pipeline/scripts/run_chunks.mjs --chunks 18-c02,18-c03 [options]
  --work PATH                 Pipeline folder (defaults to this repository)
  --concurrency N             Maximum concurrent agents; default 3
  --chunk-concurrency N       Maximum overlapping chunks; default 3
  --max-confirm-rounds N      Confirmation rounds; default 3
  --resume                    Skip only unchanged, validated AI-reviewed chunks
  --reuse-authored            Reuse a mechanically valid existing draft; run all fresh reviews
  --dry-run                   Verify inputs and show selection; never start models
  --run-dir PATH              Private checkpoint/log directory under WORK/runs
  --agent-bin PATH            Codex executable, or a mock for offline tests
Reviewers run read-only; authors/fixers use workspace-write in isolated temporary folders.
Model and reasoning settings come from the user's Codex CLI configuration.
AI review is not scholarly approval. No output is registered or published by this command.
`;

export async function run(argv = process.argv.slice(2)) {
  const options = parseOptions(argv);
  if (options.help) { process.stdout.write(HELP); return; }
  const { work, runDir } = options;
  const plan = await json(join(work, 'meta', 'plan.json'));
  const words = await json(join(work, 'meta', 'words.json'));
  const overrideSource = await readFile(join(work, 'meta', 'overrides.json'));
  const overrides = JSON.parse(overrideSource);
  const overridesHash = sha(overrideSource);
  const workflow = await readFile(join(work, 'workflows', 'chunks.js'), 'utf8');
  const workflowFunction = new AsyncFunction('args', 'agent', 'parallel', 'log', workflow.replace(/^export const meta\s*=/m, 'const meta ='));
  const libraries = await readLibraries(work);
  const libraryEntries = libraries.entries;
  const guideHash = sha(await readFile(join(work, 'guide', 'authoring-guide.md')));
  const validatorHash = sha(await readFile(join(work, 'scripts', 'validate_chunk.py')));
  const inputs = [];
  for (const chunk of options.chunks) {
    const spec = plan.find((item) => item.chunk === chunk);
    if (!spec) throw new Error(`Chunk ${chunk} is missing from plan`);
    const packetFile = join(work, 'packets', String(spec.surah), `${chunk}.json`);
    const packetSource = await readFile(packetFile);
    const packet = JSON.parse(packetSource);
    if (packet.chunk !== chunk || JSON.stringify(packet.plannedWordIds) !== JSON.stringify(spec.wordIds) || JSON.stringify(packet.plannedAyahs) !== JSON.stringify(spec.ayahs)) throw new Error(`Packet/plan mismatch for ${chunk}`);
    if (JSON.stringify(packet.words?.map((word) => word.id)) !== JSON.stringify(spec.wordIds) || JSON.stringify(packet.ayahs?.map((ayah) => ayah.ayah)) !== JSON.stringify(spec.ayahs)) throw new Error(`Incomplete packet scope for ${chunk}`);
    const wordSubset = Object.fromEntries(spec.wordIds.map((id) => {
      if (!words[id]) throw new Error(`Missing source word for ${chunk}`);
      return [id, words[id]];
    }));
    if (packet.words.some((word) => word.arabic !== wordSubset[word.id].arabic)) throw new Error(`Packet/source Arabic mismatch for ${chunk}`);
    for (const word of packet.words) {
      const source = wordSubset[word.id];
      const fix = Object.hasOwn(overrides, word.id) ? overrides[word.id] : null;
      const verb = source.verb ? { ...source.verb } : undefined;
      let lexemeKey = source.lexemeKey;
      let correction;
      if (fix) {
        if (typeof fix !== 'object' || typeof fix.noteEnglish !== 'string') throw new Error(`Invalid occurrence override for ${chunk}`);
        if (Object.hasOwn(fix, 'lexemeKey')) lexemeKey = fix.lexemeKey;
        if (verb) {
          for (const [key, field] of [['passive', 'passive'], ['mood', 'mood'], ['png', 'png'], ['verbForm', 'form']]) {
            if (Object.hasOwn(fix, key)) verb[field] = fix[key];
          }
        }
        correction = `${fix.noteEnglish} Follow this correction, not the raw QAC tag or the generated i‘rab line; record it in auditNotes.`;
      }
      if (JSON.stringify(word.verb) !== JSON.stringify(verb) || word.lexemeKey !== lexemeKey || word.qacCorrection !== correction) throw new Error(`Stale occurrence correction in ${chunk}; rebuild source packets`);
    }
    for (const kind of ['lexemes', 'roots']) {
      for (const [key, entry] of Object.entries(packet[kind] ?? {})) {
        if (JSON.stringify(entry) !== JSON.stringify(libraryEntries[kind].get(key))) throw new Error(`Stale ${kind} reference in ${chunk}; rebuild source packets`);
      }
    }
    if (packet.words.some((word) => (word.lexemeKey && !Object.hasOwn(packet.lexemes ?? {}, word.lexemeKey)) || (word.root && !Object.hasOwn(packet.roots ?? {}, word.root)))) throw new Error(`Missing shared library reference in ${chunk}; rebuild source packets`);
    inputs.push({ chunk, spec, packet, wordSubset, hashes: {
      packet: sha(packetSource), libraries: chunkLibraryHash(packet, libraries),
      guide: guideHash, validator: validatorHash, workflow: sha(workflow),
      plan: sha(JSON.stringify(spec)), words: sha(JSON.stringify(wordSubset)),
      overrides: overridesHash,
    } });
  }
  if (options.dryRun) {
    process.stdout.write(`${JSON.stringify({ dryRun: true, chunks: inputs.map(({ chunk, hashes }) => ({ chunk, hashes })), concurrency: options.concurrency, chunkConcurrency: options.chunkConcurrency, reuseAuthored: options.reuseAuthored, publication: 'held-for-scholarly-review' }, null, 2)}\n`);
    return;
  }

  await mkdir(runDir, { recursive: true, mode: 0o700 });
  await chmod(runDir, 0o700);
  const journalFile = join(runDir, 'journal.jsonl');
  const events = await exists(journalFile) ? (await readFile(journalFile, 'utf8')).split('\n').filter(Boolean).map((line) => JSON.parse(line)) : [];
  const lockFile = join(runDir, '.runner.lock');
  let lock;
  try { lock = await open(lockFile, 'wx', 0o600); }
  catch { throw new Error('Run directory is already locked; do not run overlapping pipelines'); }
  await lock.writeFile(JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString() }));
  let journalQueue = Promise.resolve();
  const journal = (event) => {
    events.push({ time: new Date().toISOString(), ...event });
    journalQueue = journalQueue.then(() => atomicWrite(journalFile, `${events.map((entry) => JSON.stringify(entry)).join('\n')}\n`));
    return journalQueue;
  };
  const children = new Set();
  const controller = new AbortController();
  const terminate = (child, signal) => {
    try {
      if (process.platform !== 'win32') process.kill(-child.pid, signal);
      else child.kill(signal);
    } catch { /* The child or process group already exited. */ }
  };
  const cancel = () => {
    controller.abort();
    for (const child of children) {
      terminate(child, 'SIGTERM');
      const timer = setTimeout(() => terminate(child, 'SIGKILL'), 2000);
      timer.unref();
    }
  };
  process.on('SIGINT', cancel);
  process.on('SIGTERM', cancel);
  const capacity = bounded(options.concurrency);
  const processCommand = (binary, args, cwd, input, stdoutFile, stderrFile) => new Promise((accept, reject) => {
    if (controller.signal.aborted) { reject(new Error('Run cancelled')); return; }
    const stdout = stdoutFile ? createWriteStream(stdoutFile, { mode: 0o600 }) : null;
    const stderr = stderrFile ? createWriteStream(stderrFile, { mode: 0o600 }) : null;
    const child = spawn(binary, args, { cwd, stdio: ['pipe', 'pipe', 'pipe'], detached: process.platform !== 'win32' });
    children.add(child);
    let output = '';
    child.stdout.on('data', (data) => {
      if (stdout) stdout.write(data);
      else if (output.length < 2_000_000) output += data;
    });
    child.stderr.on('data', (data) => { if (stderr) stderr.write(data); });
    child.stdin.on('error', () => {});
    child.stdin.end(input ?? '');
    let failure;
    child.on('error', () => { failure = new Error('Could not start agent or validator executable'); });
    child.on('close', async (code, signal) => {
      children.delete(child);
      await Promise.all([stdout, stderr].filter(Boolean).map((stream) => new Promise((done) => stream.end(done))));
      if (failure) reject(failure);
      else if (controller.signal.aborted || signal) reject(new Error('Run cancelled or subprocess terminated'));
      else accept({ code, output });
    });
  });
  const validate = async (directory, chunk) => {
    const result = await processCommand('python3', ['-I', join(directory, 'scripts', 'validate_chunk.py'), directory, chunk], directory);
    let report;
    try { report = JSON.parse(result.output); } catch { throw new Error(`Validator returned no valid JSON for ${chunk}`); }
    if (result.code !== 0 || report.ok !== true || !Array.isArray(report.errors) || report.errors.length) throw new Error(`Local validator failed for ${chunk}; chunk not imported`);
    return report;
  };
  const results = [];
  try {
    let schedulingFailure;
    const chunkCapacity = bounded(options.chunkConcurrency);
    const settledChunks = await Promise.allSettled(inputs.map((input) => chunkCapacity(async () => {
      if (schedulingFailure) throw new Error('Earlier chunk failed; no further chunks started');
      try {
      if (controller.signal.aborted) throw new Error('Run cancelled');
      const { chunk, spec, hashes } = input;
      const chunkRelative = `chunks/${spec.surah}/${chunk}.json`;
      const target = join(work, chunkRelative);
      const checkpointFile = join(runDir, `${chunk}.json`);
      const candidateFile = join(runDir, `${chunk}.candidate.json`);
      let existing;
      if (options.resume && await exists(checkpointFile)) {
        existing = await json(checkpointFile);
        if (existing.status === 'ai-reviewed' && existing.result?.status === 'ai-reviewed' && JSON.stringify(existing.hashes) === JSON.stringify(hashes) && await exists(target) && existing.contentHash === sha(await readFile(target))) {
          await validate(work, chunk);
          results.push(existing);
          process.stdout.write(`${chunk}: skipped unchanged AI-reviewed draft\n`);
          return existing;
        }
      }
      const isolated = await mkdtemp(join(tmpdir(), 'quran-grammar-chunk-'));
      const originalContentHash = await exists(target) ? sha(await readFile(target)) : null;
      await chmod(isolated, 0o700);
      let checkpoint = { version: 1, chunk, status: 'running', hashes, publication: 'held-for-scholarly-review', startedAt: new Date().toISOString() };
      await atomicWrite(checkpointFile, `${JSON.stringify(checkpoint, null, 2)}\n`);
      try {
        for (const path of ['guide/authoring-guide.md', 'libs/rules.json', 'scripts/validate_chunk.py']) {
          await mkdir(dirname(join(isolated, path)), { recursive: true });
          await copyFile(join(work, path), join(isolated, path));
        }
        await mkdir(join(isolated, 'meta'), { recursive: true });
        await writeFile(join(isolated, 'meta', 'words.json'), JSON.stringify(input.wordSubset));
        await writeFile(join(isolated, 'meta', 'plan.json'), JSON.stringify([spec]));
        await mkdir(join(isolated, 'packets', String(spec.surah)), { recursive: true });
        await mkdir(dirname(join(isolated, chunkRelative)), { recursive: true });
        const packet = { ...input.packet, outputFile: join(isolated, chunkRelative), validateCommand: `python3 -I ${join(isolated, 'scripts', 'validate_chunk.py')} ${isolated} ${chunk}` };
        await writeFile(join(isolated, 'packets', String(spec.surah), `${chunk}.json`), JSON.stringify(packet));
        const resumableCandidate = options.resume && existing?.status === 'blocked' && JSON.stringify(existing.hashes) === JSON.stringify(hashes) && existing.candidateHash && await exists(candidateFile) && existing.candidateHash === sha(await readFile(candidateFile));
        if (resumableCandidate) await copyFile(candidateFile, join(isolated, chunkRelative));
        else if (await exists(target)) await copyFile(target, join(isolated, chunkRelative));
        const baseline = new Map((await treeHashes(isolated)).filter(([name]) => name !== chunkRelative));
        const guard = async (writable, beforeContent) => {
          const actual = new Map(await treeHashes(isolated));
          if (actual.size !== baseline.size + Number(actual.has(chunkRelative)) || [...baseline].some(([name, hash]) => actual.get(name) !== hash)) throw new Error(`Agent changed protected inputs or unexpected files for ${chunk}`);
          if (!writable && actual.get(chunkRelative) !== beforeContent) throw new Error(`Read-only reviewer changed chunk ${chunk}`);
        };
        let mayReuseAuthored = options.reuseAuthored && await exists(join(isolated, chunkRelative));
        const agent = (prompt, settings) => capacity(async () => {
          if (controller.signal.aborted) throw new Error('Run cancelled');
          const agentId = randomUUID();
          const label = settings.label;
          const writable = settings.phase === 'Author' || settings.phase === 'Fix';
          const beforeContent = await exists(join(isolated, chunkRelative)) ? sha(await readFile(join(isolated, chunkRelative))) : undefined;
          const prefix = join(runDir, `${label.replaceAll(':', '-')}-${agentId}`);
          const schema = strictSchema(settings.schema);
          if (settings.phase === 'Author' && mayReuseAuthored) {
            mayReuseAuthored = false;
            let validation;
            try { validation = await validate(isolated, chunk); }
            catch (error) {
              // Invalid drafts go through the normal author. Transport failures
              // and cancellation must not be mistaken for invalid content.
              if (!error.message.startsWith('Local validator failed for ')) throw error;
            }
            if (validation) {
              await guard(false, beforeContent);
              const value = {
                validatorOk: true,
                words: spec.wordIds.length,
                ayahs: spec.ayahs.length,
                notes: `Existing authored draft SHA ${beforeContent} reused after mechanical validation; no previous content review reused; full fresh independent reviews required.`,
              };
              if (!matchesSchema(value, schema)) throw new Error(`Reused authorship metadata does not match required schema for ${label}`);
              await journal({ type: 'authored-reused', label, phase: 'Author', chunk, contentHash: beforeContent, result: value, validation });
              process.stdout.write(`${chunk}: existing authored draft mechanically validated; starting full fresh reviews\n`);
              return value;
            }
          }
          await atomicWrite(`${prefix}.schema.json`, `${JSON.stringify(schema)}\n`);
          await journal({ type: 'started', agentId, label, phase: settings.phase });
          process.stdout.write(`${label}: started (${writable ? 'workspace-write' : 'read-only'})\n`);
          try {
            const outcome = await processCommand(options.agentBin, ['exec', '--skip-git-repo-check', '--ephemeral', '--sandbox', writable ? 'workspace-write' : 'read-only', '--cd', isolated, '--json', '--color', 'never', '--output-schema', `${prefix}.schema.json`, '--output-last-message', `${prefix}.result.json`, '-'], isolated, prompt, `${prefix}.jsonl`, `${prefix}.stderr.log`);
            if (outcome.code !== 0) throw new Error(`Agent transport failed (${label}, exit ${outcome.code}); inspect private logs`);
            await guard(writable, beforeContent);
            let value;
            try { value = await json(`${prefix}.result.json`); } catch { throw new Error(`Missing or invalid agent result for ${label}`); }
            if (!matchesSchema(value, schema)) throw new Error(`Agent result does not match required schema for ${label}`);
            if (Object.hasOwn(value, 'checkedWords') && (value.checkedWords !== spec.wordIds.length || value.checkedAyahs !== spec.ayahs.length)) throw new Error(`Incomplete review coverage for ${label}`);
            if (Object.hasOwn(value, 'words') && value.words !== spec.wordIds.length) throw new Error(`Incomplete author coverage for ${label}`);
            if (Object.hasOwn(value, 'ayahs') && value.ayahs !== spec.ayahs.length) throw new Error(`Incomplete author ayah coverage for ${label}`);
            await journal({ type: 'result', agentId, result: value });
            return value;
          } catch (error) {
            await journal({ type: 'failed', agentId, label, error: error.message });
            throw error;
          }
        });
        const output = await workflowFunction({ work: isolated, chunks: [chunk], maxConfirmRounds: options.maxConfirmRounds }, agent, async (tasks) => {
          // Wait for all launched reviewers, including on failure, before removing their workspace.
          const settled = await Promise.allSettled(tasks.map((task) => task()));
          const failed = settled.find((entry) => entry.status === 'rejected');
          if (failed) throw failed.reason;
          return settled.map((entry) => entry.value);
        }, (message) => process.stdout.write(`${String(message)}\n`));
        const result = output?.results?.[0];
        if (result) checkpoint = { ...checkpoint, result };
        if (!result || result.chunk !== chunk || result.status !== 'ai-reviewed' || result.libraryIssues?.length || result.blockingReasons?.length) throw new Error(`Workflow did not confirm ${chunk}; draft remains blocked`);
        const validation = await validate(isolated, chunk);
        await guard(true);
        const content = await readFile(join(isolated, chunkRelative));
        // Re-read source hashes immediately before import so edits made during a run cannot be stamped reviewed.
        const currentSpec = (await json(join(work, 'meta', 'plan.json'))).find((entry) => entry.chunk === chunk);
        const currentWords = await json(join(work, 'meta', 'words.json'));
        if (sha(await readFile(join(work, 'packets', String(spec.surah), `${chunk}.json`))) !== hashes.packet || chunkLibraryHash(input.packet, await readLibraries(work)) !== hashes.libraries || sha(await readFile(join(work, 'workflows', 'chunks.js'))) !== hashes.workflow || sha(await readFile(join(work, 'guide', 'authoring-guide.md'))) !== hashes.guide || sha(await readFile(join(work, 'scripts', 'validate_chunk.py'))) !== hashes.validator || sha(JSON.stringify(currentSpec ?? null)) !== hashes.plan || sha(JSON.stringify(Object.fromEntries(spec.wordIds.map((id) => [id, currentWords[id]])))) !== hashes.words || sha(await readFile(join(work, 'meta', 'overrides.json'))) !== hashes.overrides) throw new Error(`Source inputs changed during review for ${chunk}; rerun required`);
        const currentContentHash = await exists(target) ? sha(await readFile(target)) : null;
        if (currentContentHash !== originalContentHash) throw new Error(`Chunk ${chunk} changed outside this run; original preserved`);
        if (controller.signal.aborted) throw new Error('Run cancelled');
        await atomicWrite(target, content);
        checkpoint = { ...checkpoint, status: 'ai-reviewed', contentHash: sha(content), result, validation, completedAt: new Date().toISOString() };
        await atomicWrite(checkpointFile, `${JSON.stringify(checkpoint, null, 2)}\n`);
        await rm(candidateFile, { force: true });
        await journal({ type: 'chunk-completed', chunk, status: checkpoint.status, contentHash: checkpoint.contentHash, hashes });
        results.push(checkpoint);
        process.stdout.write(`${chunk}: AI-reviewed draft saved; held for scholarly review\n`);
      } catch (error) {
        checkpoint = { ...checkpoint, status: 'blocked', error: error.message, completedAt: new Date().toISOString() };
        const candidate = join(isolated, chunkRelative);
        if (await exists(candidate) && (await lstat(candidate)).isFile()) {
          const content = await readFile(candidate);
          await atomicWrite(candidateFile, content);
          checkpoint.candidateHash = sha(content);
        }
        await atomicWrite(checkpointFile, `${JSON.stringify(checkpoint, null, 2)}\n`);
        await journal({ type: 'chunk-blocked', chunk, error: error.message });
        throw error;
      } finally {
        await rm(isolated, { recursive: true, force: true });
      }
      } catch (error) {
        schedulingFailure ??= error;
        throw error;
      }
    })));
    results.sort((a, b) => options.chunks.indexOf(a.chunk) - options.chunks.indexOf(b.chunk));
    await atomicWrite(join(runDir, 'results.json'), `${JSON.stringify({ publication: 'held-for-scholarly-review', results }, null, 2)}\n`);
    const failed = settledChunks.find((entry) => entry.status === 'rejected');
    if (failed) throw failed.reason;
  } finally {
    process.removeListener('SIGINT', cancel);
    process.removeListener('SIGTERM', cancel);
    try { await journalQueue; }
    finally {
      await lock.close();
      await rm(lockFile, { force: true });
    }
  }
  return results;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  run().catch((error) => { process.stderr.write(`Chunk runner: ${error.message}\n`); process.exitCode = 1; });
}

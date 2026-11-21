// Runs the app's SQL repository (src/data) against the generated content database with
// node:sqlite, and compares it with the bundled source content when that is importable.
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

// The workspace TypeScript loader (hoisted from the core/api packages) resolves the app's
// extensionless imports and @quran-grammar/core; without it these tests are skipped.
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

async function setup() {
  const db = new DatabaseSync(databasePath, { readOnly: true });
  let queries = 0;
  const exec = {
    all: async (sql, params = []) => {
      queries += 1;
      return db.prepare(sql).all(...params);
    },
  };
  const { createContentRepository } = await import('../src/data/content-store.ts');
  const { readContentVersion, MOBILE_DATABASE_SCHEMA_VERSION } = await import(
    '../src/data/queries.ts'
  );
  const core = await import('@quran-grammar/core');
  let content = null;
  try {
    content = await import('@quran-grammar/core/content');
  } catch {
    // Heavy content entry not available; exact comparisons are skipped.
  }
  return {
    db,
    exec,
    queryCount: () => queries,
    repository: createContentRepository(exec, { studyCacheSize: 1 }),
    readContentVersion,
    schemaVersion: MOBILE_DATABASE_SCHEMA_VERSION,
    core,
    content,
  };
}

test('content database: version, studies, topics and practice', { skip }, async (t) => {
  const env = await setup();
  const { repository, core, content } = env;
  t.after(() => env.db.close());

  const version = await env.readContentVersion(env.exec);
  assert.equal(version.database_schema_version, env.schemaVersion);
  assert.match(version.content_sha256, /^[0-9a-f]{64}$/);

  t.diagnostic(
    content ? 'comparing with @quran-grammar/core/content' : 'content entry unavailable; no exact comparison',
  );
  const bundledRepository = content?.getBundledRepository?.() ?? null;

  const surahs = await repository.listSurahs();
  if (bundledRepository) assert.deepEqual(surahs, await bundledRepository.listSurahs());
  assert.deepEqual(
    surahs.map((surah) => surah.number),
    [...core.availableSurahNumbers],
  );

  await t.test('every chapter rebuilds as valid StudyData in a fixed number of queries', async () => {
    const bundled = content ? new Map(content.studies.map((s) => [s.surah.number, s])) : null;
    for (const { number } of surahs) {
      const before = env.queryCount();
      const study = await repository.getStudy(number);
      assert.ok(env.queryCount() - before <= 10, `Surah ${number} used too many queries`);
      assert.ok(core.isStudyData(study), `Surah ${number} is not valid StudyData`);
      if (bundled) assert.deepEqual(study, bundled.get(number), `Surah ${number} differs`);
    }
    assert.equal(await repository.getStudy(3), null);
    assert.equal(await repository.getStudy(0), null);
  });

  await t.test('An-Nisa loads quickly and is cached', async (tt) => {
    const fresh = (await import('../src/data/content-store.ts')).createContentRepository(env.exec);
    const started = performance.now();
    const study = await fresh.getStudy(4);
    const elapsed = performance.now() - started;
    tt.diagnostic(`An-Nisa (${study.words.length} words) loaded in ${elapsed.toFixed(0)} ms`);
    assert.equal(study.words.length, study.surah.wordCount);
    assert.equal(fresh.peekStudy(4), study);
    const before = env.queryCount();
    assert.equal(await fresh.getStudy(4), study);
    assert.equal(env.queryCount(), before);
  });

  await t.test('topics resolve examples from the stored words', async () => {
    const topics = await repository.listTopics();
    assert.ok(topics.length > 0);
    if (bundledRepository) assert.deepEqual(topics, await bundledRepository.listTopics());
    assert.deepEqual(
      topics.map((topic) => topic.position),
      [...topics.map((topic) => topic.position)].sort((a, b) => a - b),
    );
    const wordQuery = env.db.prepare(
      'select arabic, surah, ayah from words where id = ?',
    );
    const ayahQuery = env.db.prepare(
      'select arabic from words where surah = ? and ayah = ? order by position',
    );
    for (const summary of topics) {
      const topic = await repository.getTopic(summary.id);
      assert.ok(topic, summary.id);
      assert.equal(topic.titleUrdu, summary.titleUrdu);
      if (bundledRepository)
        assert.deepEqual(topic, await bundledRepository.getTopic(summary.id), summary.id);
      assert.ok(topic.examples.every((example) => example.kind === 'annotated'));
      assert.ok(topic.quranicExamples.every((example) => example.kind === 'quranic'));
      for (const example of [...topic.examples, ...topic.quranicExamples]) {
        const word = wordQuery.get(example.wordId);
        assert.equal(example.wordArabic, word.arabic);
        assert.equal(
          example.ayahArabic,
          ayahQuery
            .all(word.surah, word.ayah)
            .map((row) => row.arabic)
            .join(' '),
        );
      }
      const questions = await repository.getPracticeQuestions({ topicId: summary.id });
      assert.equal(questions.length, summary.questionCount, summary.id);
      if (bundledRepository)
        assert.deepEqual(
          questions,
          await bundledRepository.getPracticeQuestions({ topicId: summary.id }),
          summary.id,
        );
      for (const question of questions) {
        assert.equal(question.topicId, summary.id);
        assert.ok(question.options.some((option) => option.id === question.correctOptionId));
      }
    }
    assert.equal(await repository.getTopic('no-such-topic'), null);
    assert.equal(await repository.getTopic('../x'), null);
  });

  await t.test('Al-Fatihah practice set', async () => {
    const questions = await repository.getPracticeQuestions({ set: 'fatihah' });
    assert.ok(questions.length >= 3);
    assert.ok(questions.every((question) => question.kind === 'fatihah'));
    if (bundledRepository)
      assert.deepEqual(questions, await bundledRepository.getPracticeQuestions({ set: 'fatihah' }));
  });
});

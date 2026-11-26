import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { once } from 'node:events';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { Server } from 'node:http';
import { isStudyData, translationIds, type StudyData } from '@quran-grammar/core';
import { getBundledRepository, getGrammarContent } from '@quran-grammar/core/content';
import { createApp } from './app';

const repository = getBundledRepository();

let server: Server;
let base: string;
before(async () => {
  server = createApp({ repository }).listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = server.address();
  assert.ok(address && typeof address !== 'string');
  base = `http://127.0.0.1:${address.port}`;
});
after(async () => {
  if (server)
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
});

test('health and study routes return a complete validated dataset', async () => {
  const health = await fetch(`${base}/api/health`);
  assert.equal(health.status, 200);
  assert.deepEqual(await health.json(), {
    status: 'ok',
    service: 'quran-grammar-api',
    schemaVersion: 1,
    source: 'bundled',
  });
  const list = await (await fetch(`${base}/api/v1/surahs`)).json();
  assert.equal(list.surahs[0].number, 1);
  const response = await fetch(`${base}/api/v1/surahs/1`);
  const payload = await response.json();
  assert.equal(response.status, 200);
  assert.equal(isStudyData(payload), true);
  assert.equal(payload.words.length, 29);
  assert.equal(Object.keys(payload.roots).length, 18);
});

test('word lookup returns the right root, paradigm, and occurrence-specific rules', async () => {
  const response = await fetch(`${base}/api/v1/surahs/1/words/${encodeURIComponent('1:5:4')}`);
  const data = await response.json();
  assert.equal(response.status, 200);
  assert.equal(data.word.root, 'ع و ن');
  assert.equal(data.verbForm.past, 'اِسْتَعَانَ');
  assert.ok(data.root.meaningUrdu.includes('تعاون'));
  assert.ok(data.rules.every((rule: { id: string }) => data.word.ruleIds.includes(rule.id)));
  const pronoun = await (await fetch(`${base}/api/v1/surahs/1/words/1%3A5%3A1`)).json();
  assert.equal(pronoun.root, null);
  assert.equal(pronoun.verbForm, null);
});

test('search uses the same root-aware filtering as both clients', async () => {
  const response = await fetch(
    `${base}/api/v1/search?${new URLSearchParams({ q: 'استفعال', pos: 'verb' })}`,
  );
  const data = await response.json();
  assert.equal(response.status, 200);
  assert.equal(data.total, 1);
  assert.equal(data.words[0].id, '1:5:4');
  const verbs = await (await fetch(`${base}/api/v1/search?pos=verb`)).json();
  assert.equal(verbs.total, 4);
  const empty = await (await fetch(`${base}/api/v1/search?q=does-not-exist`)).json();
  assert.equal(empty.total, 0);
});

test('invalid queries, missing content, and unknown API paths return JSON errors', async () => {
  const cases: Array<[string, number]> = [
    ['/api/v1/surahs/nope', 400],
    ['/api/v1/surahs/115', 404],
    ['/api/v1/surahs/1/words/not-a-location', 400],
    ['/api/v1/surahs/1/words/1%3A8%3A1', 404],
    ['/api/v1/search?pos=invalid', 400],
    ['/api/v1/search?q=first&q=second', 400],
    ['/api/v1/search?pos=verb&pos=noun', 400],
    [`/api/v1/search?q=${'a'.repeat(121)}`, 400],
    ['/api/unknown', 404],
  ];
  for (const [path, status] of cases) {
    const response = await fetch(`${base}${path}`, { headers: { Accept: 'text/html' } });
    assert.equal(response.status, status, path);
    assert.match(response.headers.get('content-type') ?? '', /application\/json/);
    assert.ok((await response.json()).error.code);
  }
});

test('CORS permits local development and native calls but rejects other browser origins', async () => {
  const allowed = await fetch(`${base}/api/health`, {
    headers: { Origin: 'http://localhost:5173' },
  });
  assert.equal(allowed.headers.get('access-control-allow-origin'), 'http://localhost:5173');
  assert.equal(allowed.status, 200);
  const blocked = await fetch(`${base}/api/health`, {
    headers: { Origin: 'https://unconfigured.example' },
  });
  assert.equal(blocked.status, 403);
  assert.equal(blocked.headers.get('access-control-allow-origin'), null);
  assert.equal((await blocked.json()).error.code, 'ORIGIN_NOT_ALLOWED');
  const native = await fetch(`${base}/api/health`);
  assert.equal(native.status, 200);
  const preflight = await fetch(`${base}/api/v1/surahs/1`, {
    method: 'OPTIONS',
    headers: { Origin: 'http://localhost:5173', 'Access-Control-Request-Method': 'GET' },
  });
  assert.equal(preflight.status, 204);
});

test('production SPA fallback excludes API paths and missing static files', async (context) => {
  const webDist = await mkdtemp(join(tmpdir(), 'quran-grammar-web-'));
  await writeFile(join(webDist, 'index.html'), '<!doctype html><title>Study app</title>');
  const staticServer = createApp({
    repository,
    webDist,
    allowedOrigins: ['https://grammar.example'],
  }).listen(
    0,
    '127.0.0.1',
  );
  context.after(async () => {
    await new Promise<void>((resolve, reject) =>
      staticServer.close((error) => (error ? reject(error) : resolve())),
    );
    await rm(webDist, { recursive: true });
  });
  await once(staticServer, 'listening');
  const address = staticServer.address();
  assert.ok(address && typeof address !== 'string');
  const url = `http://127.0.0.1:${address.port}`;
  const page = await fetch(`${url}/study/1`, { headers: { Accept: 'text/html' } });
  assert.equal(page.status, 200);
  assert.match(await page.text(), /Study app/);
  const unknown = await fetch(`${url}/api/v1/unknown`, { headers: { Accept: 'text/html' } });
  assert.equal(unknown.status, 404);
  assert.equal((await unknown.json()).error.code, 'NOT_FOUND');
  assert.equal((await fetch(`${url}/missing.js`)).status, 404);
  const configured = await fetch(`${url}/api/health`, {
    headers: { Origin: 'https://grammar.example' },
  });
  assert.equal(configured.headers.get('access-control-allow-origin'), 'https://grammar.example');
});

test('every chapter and word detail stays within its own lesson', async () => {
  const list = await (await fetch(`${base}/api/v1/surahs`)).json();
  const surahs = list.surahs as Array<{ number: number; ayahCount: number; wordCount: number }>;
  assert.deepEqual(
    surahs.map((surah) => surah.number),
    Array.from({ length: 114 }, (_, index) => index + 1),
  );
  assert.equal(surahs.reduce((total, surah) => total + surah.ayahCount, 0), 6236);
  assert.equal(surahs.reduce((total, surah) => total + surah.wordCount, 0), 77429);
  for (const [number, ayahs, words] of [
    [1, 7, 29],
    [2, 286, 6116],
    [3, 200, 3481],
    [4, 176, 3747],
    [114, 6, 20],
  ])
    assert.deepEqual([surahs[number - 1].ayahCount, surahs[number - 1].wordCount], [ayahs, words]);
  const publishedChapters = new Set([1, 4, 7, 18, 22, 23, 25, 29, 32, 36, 55, 56, ...Array.from({ length: 30 }, (_, index) => 85 + index)]);
  let checked = 0;
  for (const { number, ayahCount, wordCount } of surahs) {
    const response = await fetch(`${base}/api/v1/surahs/${number}`);
    assert.equal(response.status, 200);
    const data = await response.json();
    assert.equal(isStudyData(data), true, `Surah ${number}`);
    assert.equal(data.surah.number, number);
    assert.equal(data.ayahs.length, ayahCount);
    assert.equal(data.words.length, wordCount);
    assert.deepEqual(Object.keys(data.ayahs[0].translations), translationIds, `Surah ${number}`);
    // Every word with a published grammar layer, and every eighth source-only word plus each
    // ayah's last word (the route is the same; 77k sequential requests would take ~10 s).
    const check = async (word: StudyData['words'][number]) => {
      const detail = await (
        await fetch(`${base}/api/v1/surahs/${number}/words/${encodeURIComponent(word.id)}`)
      ).json();
      assert.deepEqual(detail.word, word);
      assert.deepEqual(detail.root, word.root ? data.roots[word.root] : null);
      assert.deepEqual(detail.verbForm, data.verbForms[word.id] ?? null);
      assert.deepEqual(
        detail.rules.map((rule: { id: string }) => rule.id).sort(),
        [...word.ruleIds].sort(),
      );
    };
    const words = (data as StudyData).words.filter(
      (word, index, all) =>
        publishedChapters.has(number) ||
        (number === 2 && word.ayah <= 20) ||
        index % 8 === 0 ||
        all[index + 1]?.ayah !== word.ayah,
    );
    checked += words.length;
    for (let index = 0; index < words.length; index += 16)
      await Promise.all(words.slice(index, index + 16).map(check));
  }
  assert.ok(checked > 16288 + 61141 / 8, `${checked} word details checked`);
});

test('chapter-scoped search never returns another chapter and rejects invalid scope', async () => {
  const data = await (await fetch(`${base}/api/v1/search?surah=114&pos=verb`)).json();
  assert.equal(data.surah, 114);
  assert.ok(data.words.length > 0);
  assert.ok(
    data.words.every(
      (word: { id: string; pos: string }) => word.id.startsWith('114:') && word.pos === 'verb',
    ),
  );
  // A source-only chapter is searchable within its own scope.
  const imran = await (await fetch(`${base}/api/v1/search?surah=3&pos=verb`)).json();
  assert.equal(imran.surah, 3);
  assert.ok(imran.words.length > 0);
  assert.ok(imran.words.every((word: { id: string; pos: string }) => word.id.startsWith('3:') && word.pos === 'verb'));
  for (const [path, status] of [
    ['/api/v1/surahs/17', 200],
    ['/api/v1/surahs/105/words/1%3A1%3A1', 404],
    ['/api/v1/surahs/1/words/105%3A1%3A1', 404],
    ['/api/v1/surahs/115', 404],
    ['/api/v1/surahs/116', 404],
    ['/api/v1/surahs/18/words/36%3A1%3A1', 404],
    ['/api/v1/surahs/0', 400],
    ['/api/v1/search?surah=115', 404],
    ['/api/v1/search?surah=105&surah=106', 400],
    ['/api/v1/search?surah=nope', 400],
  ] as const)
    assert.equal((await fetch(`${base}${path}`)).status, status, path);
});

test('topic list and topic detail match the built grammar content', async () => {
  const grammar = getGrammarContent();
  const response = await fetch(`${base}/api/v1/topics`);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'public, max-age=300');
  const { topics } = await response.json();
  assert.equal(topics.length, grammar.topics.length);
  assert.deepEqual(
    topics.map((topic: { id: string }) => topic.id),
    grammar.topics.map((topic) => topic.id),
  );
  assert.deepEqual(Object.keys(topics[0]), [
    'id',
    'position',
    'titleUrdu',
    'titleEnglish',
    'summaryUrdu',
    'questionCount',
    'occurrenceCount',
  ]);
  const detail = await (await fetch(`${base}/api/v1/topics/${topics[0].id}`)).json();
  assert.ok(detail.quranicExamples.length > 0 && detail.explanationUrdu);
  assert.deepEqual(detail, await repository.getTopic(topics[0].id));
  for (const [path, status, code] of [
    ['/api/v1/topics/does-not-exist', 404, 'TOPIC_NOT_FOUND'],
    ['/api/v1/topics/Not_Valid', 400, 'INVALID_TOPIC'],
    [`/api/v1/topics/${'a'.repeat(65)}`, 400, 'INVALID_TOPIC'],
  ] as const) {
    const failed = await fetch(`${base}${path}`);
    assert.equal(failed.status, status, path);
    assert.equal((await failed.json()).error.code, code);
  }
});

test('practice endpoint serves one topic or the Al-Fatihah set and rejects ambiguous queries', async () => {
  const fatihah = await (await fetch(`${base}/api/v1/practice?set=fatihah`)).json();
  assert.deepEqual(
    fatihah.questions.map((question: { id: string }) => question.id),
    ['fatihah/identify-verb', 'fatihah/identify-imperative', 'fatihah/identify-root'],
  );
  const { topics } = await (await fetch(`${base}/api/v1/topics`)).json();
  const topic = topics[0];
  const response = await fetch(`${base}/api/v1/practice?topic=${topic.id}`);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'public, max-age=300');
  const { questions } = await response.json();
  assert.equal(questions.length, topic.questionCount);
  assert.ok(questions.every((question: { topicId: string }) => question.topicId === topic.id));
  for (const [path, status] of [
    ['/api/v1/practice', 400],
    ['/api/v1/practice?set=other', 400],
    [`/api/v1/practice?set=fatihah&topic=${topic.id}`, 400],
    [`/api/v1/practice?topic=${topic.id}&topic=${topic.id}`, 400],
    ['/api/v1/practice?topic=BAD!', 400],
    ['/api/v1/practice?topic=does-not-exist', 404],
  ] as const) {
    const failed = await fetch(`${base}${path}`);
    assert.equal(failed.status, status, path);
    assert.ok((await failed.json()).error.code);
  }
});

test('large lessons are gzipped for clients that accept it and plain otherwise', async () => {
  const { request } = await import('node:http');
  const { gunzipSync } = await import('node:zlib');
  const get = (path: string, encoding?: string) =>
    new Promise<{ headers: Record<string, string | string[] | undefined>; body: Buffer }>(
      (resolve, reject) => {
        const req = request(`${base}${path}`, {
          headers: encoding ? { 'Accept-Encoding': encoding } : {},
        });
        req.on('response', (response) => {
          const chunks: Buffer[] = [];
          response.on('data', (chunk: Buffer) => chunks.push(chunk));
          response.on('end', () =>
            resolve({ headers: response.headers, body: Buffer.concat(chunks) }),
          );
        });
        req.on('error', reject);
        req.end();
      },
    );
  const expected = await repository.getStudy(2);
  const zipped = await get('/api/v1/surahs/2', 'gzip, deflate, br');
  assert.equal(zipped.headers['content-encoding'], 'gzip');
  assert.match(String(zipped.headers['content-type']), /^application\/json/);
  assert.match(String(zipped.headers.vary), /Accept-Encoding/);
  assert.ok(zipped.body.length < 1_000_000, `gzipped Al-Baqarah is ${zipped.body.length} bytes`);
  assert.deepEqual(JSON.parse(gunzipSync(zipped.body).toString('utf8')), expected);
  const plain = await get('/api/v1/surahs/2');
  assert.equal(plain.headers['content-encoding'], undefined);
  assert.deepEqual(JSON.parse(plain.body.toString('utf8')), expected);
  // Small responses are not worth compressing.
  const health = await get('/api/health', 'gzip');
  assert.equal(health.headers['content-encoding'], undefined);
});

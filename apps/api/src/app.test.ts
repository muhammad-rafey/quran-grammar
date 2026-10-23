import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { once } from 'node:events';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { Server } from 'node:http';
import { isStudyData } from '@quran-grammar/core';
import { createApp } from './app';

let server: Server;
let base: string;
before(async () => {
  server = createApp().listen(0, '127.0.0.1');
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
  assert.equal((await health.json()).status, 'ok');
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
    ['/api/v1/surahs/2', 404],
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
  const staticServer = createApp({ webDist, allowedOrigins: ['https://grammar.example'] }).listen(
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

test('every published chapter and word detail stays within its own lesson', async () => {
  const expected = [
    [1, 7, 29],
    [105, 5, 23],
    [106, 4, 17],
    [107, 7, 25],
    [108, 3, 10],
    [109, 6, 26],
    [110, 3, 19],
    [111, 5, 23],
    [112, 4, 15],
    [113, 5, 23],
    [114, 6, 20],
  ];
  const list = await (await fetch(`${base}/api/v1/surahs`)).json();
  assert.deepEqual(
    list.surahs.map((surah: { number: number }) => surah.number),
    expected.map(([number]) => number),
  );
  for (const [number, ayahs, words] of expected) {
    const response = await fetch(`${base}/api/v1/surahs/${number}`);
    assert.equal(response.status, 200);
    const data = await response.json();
    assert.equal(isStudyData(data), true, `Surah ${number}`);
    assert.equal(data.surah.number, number);
    assert.equal(data.ayahs.length, ayahs);
    assert.equal(data.words.length, words);
    for (const word of data.words) {
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
    }
  }
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
  for (const [path, status] of [
    ['/api/v1/surahs/105/words/1%3A1%3A1', 404],
    ['/api/v1/surahs/1/words/105%3A1%3A1', 404],
    ['/api/v1/surahs/115', 404],
    ['/api/v1/surahs/0', 400],
    ['/api/v1/search?surah=2', 404],
    ['/api/v1/search?surah=105&surah=106', 400],
    ['/api/v1/search?surah=nope', 400],
  ] as const)
    assert.equal((await fetch(`${base}${path}`)).status, status, path);
});

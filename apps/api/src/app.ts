import express, { type ErrorRequestHandler } from 'express';
import cors from 'cors';
import { existsSync } from 'node:fs';
import { extname, resolve } from 'node:path';
import { fatihahStudy, matchesWord, type PartOfSpeechFilter } from '@quran-grammar/core';

export interface AppOptions {
  allowedOrigins?: string[];
  webDist?: string;
}

const defaultOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
const filters = new Set<PartOfSpeechFilter>([
  'all',
  'noun',
  'adjective',
  'verb',
  'particle',
  'pronoun',
]);
const failure = (code: string, message: string) => ({ error: { code, message } });

export function createApp(options: AppOptions = {}) {
  const app = express();
  const origins = new Set(options.allowedOrigins ?? defaultOrigins);
  app.disable('x-powered-by');
  app.set('query parser', 'simple');
  app.use((_req, res, next) => {
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });
  app.use('/api', (req, res, next) => {
    const origin = req.get('Origin');
    if (origin && !origins.has(origin)) {
      res.status(403).json(failure('ORIGIN_NOT_ALLOWED', 'This origin is not allowed.'));
      return;
    }
    next();
  });
  app.use(
    '/api',
    cors({
      origin: (origin, callback) => callback(null, !origin || origins.has(origin)),
      methods: ['GET', 'HEAD', 'OPTIONS'],
      allowedHeaders: ['Content-Type'],
      maxAge: 86400,
    }),
  );

  app.get('/api/health', (_req, res) => {
    res
      .set('Cache-Control', 'no-store')
      .json({ status: 'ok', service: 'quran-grammar-api', schemaVersion: 1 });
  });

  app.get('/api/v1/surahs', (_req, res) => {
    res.set('Cache-Control', 'public, max-age=300').json({ surahs: [fatihahStudy.surah] });
  });

  app.get('/api/v1/surahs/:surahId', (req, res) => {
    if (!/^[1-9][0-9]{0,2}$/.test(req.params.surahId)) {
      res
        .status(400)
        .json(failure('INVALID_SURAH', 'Surah must be a positive numeric identifier.'));
      return;
    }
    if (req.params.surahId !== '1') {
      res
        .status(404)
        .json(failure('SURAH_NOT_FOUND', 'Only Al-Fatihah is available in this edition.'));
      return;
    }
    res.set('Cache-Control', 'public, max-age=300').json(fatihahStudy);
  });

  app.get('/api/v1/surahs/:surahId/words/:id', (req, res) => {
    if (
      !/^[1-9][0-9]{0,2}$/.test(req.params.surahId) ||
      !/^\d{1,3}:\d{1,3}:\d{1,3}$/.test(req.params.id)
    ) {
      res.status(400).json(failure('INVALID_WORD', 'Word identifiers use surah:ayah:position.'));
      return;
    }
    if (req.params.surahId !== '1') {
      res
        .status(404)
        .json(failure('SURAH_NOT_FOUND', 'Only Al-Fatihah is available in this edition.'));
      return;
    }
    const word = fatihahStudy.words.find((entry) => entry.id === req.params.id);
    if (!word) {
      res.status(404).json(failure('WORD_NOT_FOUND', 'This word occurrence is not available.'));
      return;
    }
    res.set('Cache-Control', 'public, max-age=300').json({
      word,
      root: word.root ? fatihahStudy.roots[word.root] : null,
      verbForm: fatihahStudy.verbForms[word.id] ?? null,
      rules: fatihahStudy.rules.filter((rule) => word.ruleIds.includes(rule.id)),
    });
  });

  app.get('/api/v1/search', (req, res) => {
    const query = req.query.q ?? '';
    const pos = req.query.pos ?? 'all';
    if (
      typeof query !== 'string' ||
      query.length > 120 ||
      typeof pos !== 'string' ||
      !filters.has(pos as PartOfSpeechFilter)
    ) {
      res
        .status(400)
        .json(
          failure(
            'INVALID_SEARCH',
            'Use one q string of at most 120 characters and a valid pos filter.',
          ),
        );
      return;
    }
    const words = fatihahStudy.words.filter((word) =>
      matchesWord(word, fatihahStudy, query, pos as PartOfSpeechFilter),
    );
    res.json({ query: query.trim(), pos, total: words.length, words });
  });

  // This precedes the SPA fallback so an unknown API route can never return HTML.
  app.use('/api', (_req, res) =>
    res.status(404).json(failure('NOT_FOUND', 'API route not found.')),
  );

  if (options.webDist) {
    const webDist = resolve(options.webDist);
    const indexPath = resolve(webDist, 'index.html');
    if (!existsSync(indexPath)) throw new Error(`WEB_DIST must contain index.html: ${webDist}`);
    app.use(express.static(webDist, { index: 'index.html', maxAge: 0 }));
    app.use((req, res, next) => {
      if (
        (req.method === 'GET' || req.method === 'HEAD') &&
        !extname(req.path) &&
        req.accepts('html')
      ) {
        res.sendFile(indexPath);
      } else {
        next();
      }
    });
  }
  app.use((_req, res) => res.status(404).json(failure('NOT_FOUND', 'Route not found.')));
  const handleError: ErrorRequestHandler = (error: unknown, _req, res, next) => {
    if (res.headersSent) return next(error);
    if (error instanceof URIError) {
      res.status(400).json(failure('INVALID_URL', 'The request URL is malformed.'));
      return;
    }
    console.error(
      'Unhandled request error:',
      error instanceof Error ? error.message : 'Unknown error',
    );
    res.status(500).json(failure('INTERNAL_ERROR', 'Unable to complete this request.'));
  };
  app.use(handleError);
  return app;
}

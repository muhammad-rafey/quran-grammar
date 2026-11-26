import express, { type ErrorRequestHandler } from 'express';
import cors from 'cors';
import { existsSync } from 'node:fs';
import { extname, resolve } from 'node:path';
import { promisify } from 'node:util';
import { gzip } from 'node:zlib';
import {
  matchesWord,
  type ContentRepository,
  type PartOfSpeechFilter,
  type PracticeQuestionFilter,
} from '@quran-grammar/core';

export type ContentSource = 'postgres' | 'bundled';

export interface AppOptions {
  /** Content source: Postgres (DATABASE_URL) in production, bundled lessons otherwise. */
  repository: ContentRepository;
  /** Reported by /api/health. Defaults to 'bundled'. */
  source?: ContentSource;
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
const topicId = /^[a-z0-9-]{1,64}$/;
const cacheable = 'public, max-age=300';
const gzipAsync = promisify(gzip);
/** JSON bodies from this size are gzipped (Al-Baqarah's lesson is about 4.9 MB uncompressed). */
const compressFromBytes = 16 * 1024;

export function createApp(options: AppOptions) {
  const { repository } = options;
  const source: ContentSource = options.source ?? 'bundled';
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
  // Large lessons travel gzipped when the client accepts it (browsers, Node fetch, React Native).
  app.use('/api', (req, res, next) => {
    res.vary('Accept-Encoding');
    if (req.acceptsEncodings('gzip', 'identity') !== 'gzip') return next();
    const json = res.json.bind(res);
    res.json = (body: unknown) => {
      const text = JSON.stringify(body);
      if (text === undefined || Buffer.byteLength(text) < compressFromBytes) return json(body);
      gzipAsync(text, { level: 6 })
        .then((compressed) => {
          res.type('application/json; charset=utf-8');
          res.set('Content-Encoding', 'gzip');
          res.send(compressed);
        })
        .catch(next);
      return res;
    };
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
      .json({ status: 'ok', service: 'quran-grammar-api', schemaVersion: 1, source });
  });

  app.get('/api/v1/surahs', async (_req, res) => {
    const surahs = await repository.listSurahs();
    res.set('Cache-Control', cacheable).json({ surahs });
  });

  app.get('/api/v1/surahs/:surahId', async (req, res) => {
    if (!/^[1-9][0-9]{0,2}$/.test(req.params.surahId)) {
      res
        .status(400)
        .json(failure('INVALID_SURAH', 'Surah must be a positive numeric identifier.'));
      return;
    }
    const study = await repository.getStudy(Number(req.params.surahId));
    if (!study) {
      res
        .status(404)
        .json(
          failure(
            'SURAH_NOT_FOUND',
            'Study content for this Surah is not available in this edition.',
          ),
        );
      return;
    }
    res.set('Cache-Control', cacheable).json(study);
  });

  app.get('/api/v1/surahs/:surahId/words/:id', async (req, res) => {
    if (
      !/^[1-9][0-9]{0,2}$/.test(req.params.surahId) ||
      !/^\d{1,3}:\d{1,3}:\d{1,3}$/.test(req.params.id)
    ) {
      res.status(400).json(failure('INVALID_WORD', 'Word identifiers use surah:ayah:position.'));
      return;
    }
    const study = await repository.getStudy(Number(req.params.surahId));
    if (!study) {
      res
        .status(404)
        .json(
          failure(
            'SURAH_NOT_FOUND',
            'Study content for this Surah is not available in this edition.',
          ),
        );
      return;
    }
    const word = study.words.find((entry) => entry.id === req.params.id);
    if (!word) {
      res.status(404).json(failure('WORD_NOT_FOUND', 'This word occurrence is not available.'));
      return;
    }
    res.set('Cache-Control', cacheable).json({
      word,
      root: word.root ? study.roots[word.root] : null,
      verbForm: study.verbForms[word.id] ?? null,
      rules: study.rules.filter((rule) => word.ruleIds.includes(rule.id)),
    });
  });

  app.get('/api/v1/search', async (req, res) => {
    const query = req.query.q ?? '';
    const pos = req.query.pos ?? 'all';
    const surahId = req.query.surah ?? '1';
    if (
      typeof query !== 'string' ||
      query.length > 120 ||
      typeof surahId !== 'string' ||
      !/^[1-9][0-9]{0,2}$/.test(surahId) ||
      typeof pos !== 'string' ||
      !filters.has(pos as PartOfSpeechFilter)
    ) {
      res
        .status(400)
        .json(
          failure(
            'INVALID_SEARCH',
            'Use one q string of at most 120 characters, a valid pos filter, and one numeric surah identifier.',
          ),
        );
      return;
    }
    const study = await repository.getStudy(Number(surahId));
    if (!study) {
      res
        .status(404)
        .json(failure('SURAH_NOT_FOUND', 'Study content for this Surah is not available.'));
      return;
    }
    const words = study.words.filter((word) =>
      matchesWord(word, study, query, pos as PartOfSpeechFilter),
    );
    res.json({ query: query.trim(), pos, surah: study.surah.number, total: words.length, words });
  });

  app.get('/api/v1/topics', async (_req, res) => {
    const topics = await repository.listTopics();
    res.set('Cache-Control', cacheable).json({ topics });
  });

  app.get('/api/v1/topics/:topicId', async (req, res) => {
    if (!topicId.test(req.params.topicId)) {
      res
        .status(400)
        .json(failure('INVALID_TOPIC', 'Topic identifiers use lowercase letters, digits and hyphens.'));
      return;
    }
    const topic = await repository.getTopic(req.params.topicId);
    if (!topic) {
      res.status(404).json(failure('TOPIC_NOT_FOUND', 'This grammar topic is not available.'));
      return;
    }
    res.set('Cache-Control', cacheable).json(topic);
  });

  app.get('/api/v1/practice', async (req, res) => {
    const { topic, set } = req.query;
    let filter: PracticeQuestionFilter;
    if (typeof topic === 'string' && set === undefined && topicId.test(topic)) {
      filter = { topicId: topic };
    } else if (set === 'fatihah' && topic === undefined) {
      filter = { set: 'fatihah' };
    } else {
      res
        .status(400)
        .json(
          failure(
            'INVALID_PRACTICE',
            'Use exactly one of topic=<topic id> or set=fatihah.',
          ),
        );
      return;
    }
    if (
      'topicId' in filter &&
      !(await repository.listTopics()).some((entry) => entry.id === filter.topicId)
    ) {
      res.status(404).json(failure('TOPIC_NOT_FOUND', 'This grammar topic is not available.'));
      return;
    }
    const questions = await repository.getPracticeQuestions(filter);
    res.set('Cache-Control', cacheable).json({ questions });
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

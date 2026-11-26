import type { ContentRepository } from '@quran-grammar/core';
import { createApp, type ContentSource } from './app';

const port = Number(process.env.PORT ?? 4000);
const host = process.env.HOST ?? '0.0.0.0';
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be an integer between 1 and 65535.');
}
const allowedOrigins =
  process.env.ALLOWED_ORIGINS === undefined
    ? undefined
    : process.env.ALLOWED_ORIGINS.split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);
for (const origin of allowedOrigins ?? []) {
  const url = new URL(origin);
  if (!['http:', 'https:'].includes(url.protocol) || url.origin !== origin) {
    throw new Error('ALLOWED_ORIGINS must contain comma-separated HTTP(S) origins without paths.');
  }
}
/**
 * DATABASE_URL set: read the Supabase Postgres copy (schema quran_grammar) through a read-only
 * role. If it is unreachable or not a schema-v3 copy, serve the bundled lessons instead (the
 * same content) and report `source: "bundled"` from /api/health.
 */
async function chooseRepository(): Promise<{ repository: ContentRepository; source: ContentSource }> {
  const url = process.env.DATABASE_URL?.trim();
  if (url) {
    const { checkPostgresContent, createPostgresPool, createPostgresRepository } = await import(
      './postgres-repository'
    );
    const pool = createPostgresPool(url);
    try {
      const version = await checkPostgresContent(pool);
      console.log(
        `Content source: postgres (sha256 ${version.content_sha256.slice(0, 12)}, commit ${version.source_commit.slice(0, 12)}, synced ${version.synced_at})`,
      );
      return { repository: createPostgresRepository(pool), source: 'postgres' };
    } catch (error) {
      console.error(
        'Postgres content unavailable; serving bundled content:',
        error instanceof Error ? error.message : 'Unknown error',
      );
      await pool.end().catch(() => undefined);
    }
  }
  const { getBundledRepository } = await import('@quran-grammar/core/content');
  console.log('Content source: bundled');
  return { repository: getBundledRepository(), source: 'bundled' };
}

const { repository, source } = await chooseRepository();
const app = createApp({ repository, source, allowedOrigins, webDist: process.env.WEB_DIST });
const server = app.listen(port, host, () => {
  console.log(`Quran Grammar API listening on http://${host}:${port}`);
});
server.on('error', (error) => {
  console.error('API server failed:', error.message);
  process.exitCode = 1;
});

function stop() {
  server.close((error) => {
    if (error) console.error('Shutdown error:', error.message);
    process.exit(error ? 1 : 0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}
process.once('SIGTERM', stop);
process.once('SIGINT', stop);

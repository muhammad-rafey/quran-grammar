import { createApp } from './app';

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
const app = createApp({ allowedOrigins, webDist: process.env.WEB_DIST });
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

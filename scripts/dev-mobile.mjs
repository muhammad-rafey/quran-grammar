import { spawn, spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { findAndroidSdk } from './android-toolchain.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const mobile = join(root, 'apps/mobile');
const require = createRequire(join(mobile, 'package.json'));
let expo;
let stopping = false;
function stop(signal = 'SIGTERM') {
  if (stopping) return;
  stopping = true;
  expo?.kill(signal);
}
for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => stop(signal));

async function main() {
  const platform = process.argv[2];
  if (!['android', 'ios'].includes(platform))
    throw new Error('Use npm run dev:android or npm run dev:ios.');
  if (platform === 'ios' && process.platform !== 'darwin')
    throw new Error('The iPhone simulator requires macOS and Xcode.');
  const expoCli = require.resolve('expo/bin/cli');
  const sdk = platform === 'android' ? findAndroidSdk() : undefined;
  // The app reads its content from the bundled SQLite database; no API server is needed.
  const ensured = spawnSync(
    process.execPath,
    ['--disable-warning=ExperimentalWarning', join(mobile, 'scripts/ensure-db.mjs')],
    { cwd: mobile, stdio: 'inherit' },
  );
  if (ensured.status !== 0) throw new Error('The bundled content database could not be prepared.');
  const env = { ...process.env, NODE_ENV: 'development' };
  if (sdk) {
    env.ANDROID_HOME = sdk;
    env.ANDROID_SDK_ROOT = sdk;
  }
  console.log(
    `Opening ${platform === 'ios' ? 'the iPhone simulator' : 'the Android emulator'} with Expo Go. Ctrl+C stops Metro.`,
  );
  expo = spawn(
    process.execPath,
    [expoCli, 'start', '--go', `--${platform}`, ...process.argv.slice(3)],
    {
      cwd: mobile,
      env,
      stdio: 'inherit',
    },
  );
  expo.once('error', (error) => {
    console.error(`Expo startup failed: ${error.message}`);
    process.exitCode = 1;
    stop();
  });
  expo.once('exit', (code) => {
    if (!stopping) process.exitCode = code || 0;
    stop();
  });
}
main().catch((error) => {
  console.error(`Development startup failed: ${error.message}`);
  process.exitCode = 1;
  stop();
});

import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { findAndroidSdk } from './android-toolchain.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const mobile = join(root, 'apps/mobile');
const require = createRequire(join(mobile, 'package.json'));
let api;
let expo;
let stopping = false;
function stop(signal = 'SIGTERM') {
  if (stopping) return;
  stopping = true;
  expo?.kill(signal);
  api?.kill(signal);
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
  const port = Number(process.env.PORT || 4000);
  if (!Number.isInteger(port) || port < 1 || port > 65535)
    throw new Error('PORT must be an integer from 1 to 65535.');
  const apiOrigin = `http://127.0.0.1:${port}`;
  async function apiStatus() {
    try {
      const response = await fetch(`${apiOrigin}/api/health`, { signal: AbortSignal.timeout(800) });
      return response.ok && (await response.json()).service === 'quran-grammar-api'
        ? 'ready'
        : 'occupied';
    } catch (error) {
      return error?.cause?.code === 'ECONNREFUSED' ? 'absent' : 'occupied';
    }
  }
  const initialStatus = await apiStatus();
  if (initialStatus === 'occupied')
    throw new Error(
      `Port ${port} is occupied by a different or unresponsive service. Set PORT to another port.`,
    );
  if (initialStatus === 'absent') {
    api = spawn(
      process.execPath,
      ['--watch', '--import', 'tsx', join(root, 'apps/api/src/server.ts')],
      {
        cwd: root,
        stdio: ['ignore', 'inherit', 'inherit'],
        env: { ...process.env, PORT: String(port) },
      },
    );
    api.on('error', (error) => {
      console.error(`API startup failed: ${error.message}`);
      process.exitCode = 1;
      stop();
    });
    api.on('exit', (code) => {
      if (!stopping && code) {
        process.exitCode = code;
        stop();
      }
    });
    let ready = false;
    for (let attempt = 0; attempt < 40 && !stopping; attempt++) {
      if ((await apiStatus()) === 'ready') {
        ready = true;
        break;
      }
      await new Promise((resolveWait) => setTimeout(resolveWait, 250));
    }
    if (!ready) throw new Error(`The Node API did not become ready on port ${port}.`);
  } else console.log(`Using the running Quran Grammar API on port ${port}.`);
  const dotenv = require('@expo/env').parseProjectEnv(mobile, {
    mode: 'development',
    silent: true,
  }).env;
  const configured = process.env.EXPO_PUBLIC_API_URL ?? dotenv.EXPO_PUBLIC_API_URL;
  const apiUrl = configured || (platform === 'android' ? `http://10.0.2.2:${port}` : apiOrigin);
  const env = { ...dotenv, ...process.env, EXPO_PUBLIC_API_URL: apiUrl, NODE_ENV: 'development' };
  if (sdk) {
    env.ANDROID_HOME = sdk;
    env.ANDROID_SDK_ROOT = sdk;
  }
  console.log(
    `Opening ${platform === 'ios' ? 'the iPhone simulator' : 'the Android emulator'} with Expo Go. Ctrl+C stops this command’s Metro/API processes.`,
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

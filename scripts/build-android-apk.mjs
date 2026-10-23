import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { copyFile, mkdir, readFile, rename, stat, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { delimiter, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { findAndroidSdk, findBuildTools, findJavaHome } from './android-toolchain.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const mobile = join(root, 'apps/mobile');
const android = join(mobile, 'android');
const require = createRequire(join(mobile, 'package.json'));
let child;
let interrupted = false;
function run(command, args, options = {}) {
  if (interrupted) return Promise.reject(new Error('Build interrupted.'));
  return new Promise((resolveRun, reject) => {
    child = spawn(command, args, { cwd: root, stdio: 'inherit', ...options });
    child.once('error', reject);
    child.once('exit', (code, signal) => {
      child = undefined;
      if (code === 0 && !interrupted) resolveRun();
      else reject(new Error(`${command} failed (${signal || `exit ${code}`}).`));
    });
  });
}
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, () => {
    interrupted = true;
    child?.kill(signal);
  });
}

async function prebuild(expoCli, env) {
  const packagePath = join(mobile, 'package.json');
  const beforeText = await readFile(packagePath, 'utf8');
  const before = JSON.parse(beforeText);
  try {
    await run(
      process.execPath,
      [
        expoCli,
        'prebuild',
        '--platform',
        'android',
        '--no-install',
        '--skip-dependency-update',
        Object.keys(before.dependencies ?? {}).join(','),
      ],
      { cwd: mobile, env },
    );
  } finally {
    // Prebuild changes Expo's default launch scripts. Restore only this known
    // change; preserve and flag anything else rather than overwriting it.
    const after = JSON.parse(await readFile(packagePath, 'utf8'));
    for (const platform of ['android', 'ios']) {
      if (
        before.scripts?.[platform] === `expo start --${platform}` &&
        after.scripts?.[platform] === `expo run:${platform}`
      )
        after.scripts[platform] = before.scripts[platform];
    }
    if (JSON.stringify(after) !== JSON.stringify(before))
      throw new Error(
        'Prebuild changed package.json beyond its known script updates. Review the changes before continuing; the build did not overwrite them.',
      );
    await writeFile(packagePath, beforeText);
  }
}

async function main() {
  if (process.argv.includes('--help')) {
    console.log(
      'npm run build:android:apk [-- --check | --prepare]\nBuild a local test APK at build/quran-grammar.apk.\n--check validates installed tooling; --prepare also generates missing Android files.\nEXPO_PUBLIC_API_URL optionally selects an HTTP(S) API origin; unset uses the bundled lesson.\nAPK_ABIS defaults to arm64-v8a,x86_64. APK_GRADLE_WORKERS defaults to 4.',
    );
    return;
  }
  if (process.argv.slice(2).some((arg) => !['--check', '--prepare'].includes(arg)))
    throw new Error('Unknown argument. Use --help for supported options.');
  if (Number(process.versions.node.split('.')[0]) !== 24)
    throw new Error('Use Node.js 24, then run npm ci from the project root.');
  let expoCli;
  let expoEnv;
  try {
    expoCli = require.resolve('expo/bin/cli');
    expoEnv = require('@expo/env');
  } catch {
    throw new Error(
      'Workspace dependencies are missing. Run npm ci from the repository root first.',
    );
  }
  // Resolve build tooling from the user's environment before app dotenv values.
  const sdk = findAndroidSdk();
  const { javaHome, version } = findJavaHome();
  const buildTools = findBuildTools(sdk);
  console.log(
    `Android SDK found; Java ${version}; Build-Tools ${buildTools.split(/[\\/]/).at(-1)}.`,
  );
  if (process.argv.includes('--check')) return;

  const dotenv = expoEnv.parseProjectEnv(mobile, { mode: 'production', silent: true }).env;
  const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? dotenv.EXPO_PUBLIC_API_URL ?? '';
  if (apiUrl) {
    const url = new URL(apiUrl);
    if (
      !['https:', 'http:'].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      url.pathname !== '/'
    )
      throw new Error(
        'EXPO_PUBLIC_API_URL must be an HTTP(S) origin without credentials, query parameters or a path.',
      );
    if (url.protocol !== 'https:')
      console.warn(
        'HTTP API configured: Android release builds may block cleartext requests. Use HTTPS for a connected APK; the bundled lesson remains available.',
      );
  }
  console.log(
    apiUrl
      ? 'Bundling with the configured API origin.'
      : 'Bundling the offline Al-Fatihah lesson; no API origin is configured.',
  );
  const abis = process.env.APK_ABIS || 'arm64-v8a,x86_64';
  if (!abis.split(',').every((abi) => ['arm64-v8a', 'armeabi-v7a', 'x86_64', 'x86'].includes(abi)))
    throw new Error('APK_ABIS must be a comma-separated list of Android ABI names.');
  const workers = process.env.APK_GRADLE_WORKERS || '4';
  if (!/^[1-9]\d?$/.test(workers))
    throw new Error('APK_GRADLE_WORKERS must be a number from 1 to 99.');
  const env = {
    ...dotenv,
    ...process.env,
    ANDROID_HOME: sdk,
    ANDROID_SDK_ROOT: sdk,
    ...(javaHome ? { JAVA_HOME: javaHome } : {}),
    PATH: [javaHome && join(javaHome, 'bin'), join(sdk, 'platform-tools'), process.env.PATH]
      .filter(Boolean)
      .join(delimiter),
    NODE_ENV: 'production',
    EXPO_PUBLIC_API_URL: apiUrl,
    EXPO_NO_DOTENV: '1',
    CI: '1',
  };
  if (!existsSync(android)) {
    console.log('Generating the Android project once with Expo Prebuild.');
    await prebuild(expoCli, env);
  } else console.log('Using the existing Android project without regenerating it.');
  const gradleFile = join(android, 'app/build.gradle');
  const wrapper = join(android, process.platform === 'win32' ? 'gradlew.bat' : 'gradlew');
  if (!existsSync(wrapper) || !existsSync(gradleFile))
    throw new Error(
      'The existing Android directory is incomplete. Review it first; this script never replaces an existing native project.',
    );
  const gradle = await readFile(gradleFile, 'utf8');
  if (!/release\s*\{[^{}]*signingConfig\s+signingConfigs\.debug/.test(gradle))
    throw new Error(
      'The release variant does not use Expo’s debug signing key. This command builds local test APKs and will not change an existing signing configuration.',
    );
  if (process.argv.includes('--prepare')) {
    console.log('Android project ready; no APK build was requested.');
    return;
  }

  console.log(
    `Building a bundled, debug-key-signed test APK (${abis}). First builds download Gradle/native dependencies and can take several minutes.`,
  );
  await run(
    wrapper,
    [
      // Environment values are not Gradle source inputs; always refresh the JS
      // bundle so changing the API origin cannot reuse an earlier configuration.
      'app:createBundleReleaseJsAndAssets',
      '--rerun',
      'app:assembleRelease',
      '--no-daemon',
      '--console=plain',
      `--max-workers=${workers}`,
      `-PreactNativeArchitectures=${abis}`,
    ],
    { cwd: android, env, shell: process.platform === 'win32' },
  );
  const builtApk = join(android, 'app/build/outputs/apk/release/app-release.apk');
  if (!existsSync(builtApk))
    throw new Error(
      'Gradle did not produce app-release.apk. Check the native variant configuration.',
    );
  const info = await stat(builtApk);
  if (!info.size) throw new Error('Gradle produced an empty APK.');
  const signer = join(buildTools, process.platform === 'win32' ? 'apksigner.bat' : 'apksigner');
  await run(signer, ['verify', builtApk], { env, shell: process.platform === 'win32' });
  const outputDir = join(root, 'build');
  const output = join(outputDir, 'quran-grammar.apk');
  await mkdir(outputDir, { recursive: true });
  await copyFile(builtApk, `${output}.tmp`);
  await rename(`${output}.tmp`, output);
  const sha256 = createHash('sha256')
    .update(await readFile(output))
    .digest('hex');
  await writeFile(join(outputDir, 'quran-grammar.apk.sha256'), `${sha256}  quran-grammar.apk\n`);
  await writeFile(
    join(outputDir, 'android-build.json'),
    `${JSON.stringify({ builtAt: new Date().toISOString(), artifact: 'quran-grammar.apk', bytes: info.size, sha256, architectures: abis.split(','), signing: 'Expo debug key; local testing only', apiConfigured: Boolean(apiUrl), metroRequired: false }, null, 2)}\n`,
  );
  console.log(
    `\nAPK ready: ${output}\n${(info.size / 1024 / 1024).toFixed(1)} MB · bundled JavaScript · local testing only, not a Play Store release.\nInstall: adb install -r "${output}"`,
  );
}
main().catch((error) => {
  console.error(`\nAPK build failed: ${error.message}`);
  process.exitCode = interrupted ? 130 : 1;
});

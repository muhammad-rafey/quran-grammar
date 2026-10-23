import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

export function findAndroidSdk() {
  const explicit = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT;
  const candidates = explicit
    ? [explicit]
    : [
        join(homedir(), 'Library/Android/sdk'),
        join(homedir(), 'Android/Sdk'),
        process.env.LOCALAPPDATA && join(process.env.LOCALAPPDATA, 'Android/Sdk'),
        '/opt/homebrew/share/android-commandlinetools',
        '/usr/local/share/android-commandlinetools',
      ];
  const sdk = candidates.filter(Boolean).find((path) => existsSync(join(path, 'platform-tools')));
  if (!sdk)
    throw new Error(
      'Android SDK not found. Install Android Studio with SDK Platform 36, Build-Tools 36 and Platform-Tools; set ANDROID_HOME to the SDK folder.',
    );
  return sdk;
}

export function findJavaHome() {
  const macJava =
    process.platform === 'darwin'
      ? spawnSync('/usr/libexec/java_home', ['-v', '17'], { encoding: 'utf8' })
      : null;
  const candidates = process.env.JAVA_HOME
    ? [process.env.JAVA_HOME]
    : [
        macJava?.status === 0 ? macJava.stdout.trim() : undefined,
        '/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home',
        '/usr/local/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home',
        '/usr/lib/jvm/java-17-openjdk-amd64',
        '/usr/lib/jvm/java-17-openjdk-arm64',
        '/Applications/Android Studio.app/Contents/jbr/Contents/Home',
        process.env.ProgramFiles && join(process.env.ProgramFiles, 'Android/Android Studio/jbr'),
      ];
  const javaHome = candidates
    .filter(Boolean)
    .find((path) =>
      existsSync(join(path, 'bin', process.platform === 'win32' ? 'java.exe' : 'java')),
    );
  const command = javaHome
    ? join(javaHome, 'bin', process.platform === 'win32' ? 'java.exe' : 'java')
    : 'java';
  const result = spawnSync(command, ['-version'], { encoding: 'utf8' });
  const version = `${result.stderr ?? ''}${result.stdout ?? ''}`.match(/version\s+"(\d+)/)?.[1];
  if (result.status !== 0 || !version || Number(version) < 17)
    throw new Error(
      'JDK 17 or newer is required. Install OpenJDK 17 and set JAVA_HOME to its home directory.',
    );
  return { javaHome, version };
}

export function findBuildTools(sdk) {
  const directory = join(sdk, 'build-tools');
  const versions = existsSync(directory)
    ? readdirSync(directory).filter((name) => /^\d+\.\d+\.\d+$/.test(name))
    : [];
  const version = versions
    .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))
    .find((name) => Number(name.split('.')[0]) >= 36);
  if (!version)
    throw new Error(
      'Android Build-Tools 36 or newer is missing. Install it in Android Studio → SDK Manager.',
    );
  if (!existsSync(join(sdk, 'platforms/android-36/android.jar')))
    throw new Error(
      'Android SDK Platform 36 is missing. Install it in Android Studio → SDK Manager.',
    );
  return join(directory, version);
}

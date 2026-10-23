# Local Android APK and simulator commands

Use Node.js 24 and run `npm ci` from the repository root first. These commands do not require an Expo account, EAS cloud build or store account.

## Build an installable test APK

Install Android Studio, JDK 17 or newer, Android SDK Platform 36, Android Build-Tools 36 and Android Platform-Tools. Accept the Android SDK licenses through SDK Manager. Set `ANDROID_HOME` and `JAVA_HOME` if they are not detected automatically. The helper checks common Android Studio and Homebrew installation locations without changing system settings.

```sh
npm run build:android:apk
```

The result is `build/quran-grammar.apk`, with a SHA-256 checksum and build metadata beside it. `build/` is ignored by Git and Docker. Install it on a connected Android device or emulator:

```sh
adb install -r build/quran-grammar.apk
```

This is a release-variant APK with bundled JavaScript and assets, signed with Expo's debug key for local testing. It works without Metro or Expo Go. It is not configured or signed for Play Store distribution. Its default ABIs are `arm64-v8a` and `x86_64`, covering modern Android phones and 64-bit emulators. The first native build can take several minutes and download Gradle, Maven artifacts or Android native tools; later builds reuse caches.

The command generates `apps/mobile/android/` with Expo Prebuild only if that directory is absent. It never cleans or replaces an existing native project or changes an existing signing configuration. Native directories stay ignored. After changing app config or config plugins, deliberately regenerate or update the native project with Expo's normal workflow before building again; preserve any native customizations first.

Expo SDK 57 requires Reanimated 4.5.1 with Worklets 0.10.1. The root override keeps Expo Router's transitive Reanimated dependency on that same version: allowing a second Reanimated 4.7.x copy selects an incompatible Worklets requirement and fails native compilation. Preserve this SDK-compatible pair until deliberately upgrading the Expo SDK, and check the dependency tree with `npm ls react-native-reanimated react-native-worklets` after dependency updates.

## API configuration

The build reads Expo's production `.env` files in `apps/mobile/`; an existing shell `EXPO_PUBLIC_API_URL` takes precedence. Use an HTTPS API origin for an APK that connects to a deployed backend. Public client environment values are bundled into the APK and must not contain credentials. If the API origin is unset, the app uses its bundled eleven-Surah edition. If a configured backend is unavailable, the app offers retry and the matching saved lesson.

To explicitly build the offline edition regardless of dotenv configuration, on macOS/Linux:

```sh
EXPO_PUBLIC_API_URL= npm run build:android:apk
```

HTTP origins such as `localhost` are useful with Expo Go during development, but Android release security may block cleartext HTTP in the standalone APK. Use HTTPS for a connected standalone test; no permissive network policy is added automatically.

## Development

```sh
npm run dev:web
npm run dev:android
npm run dev:ios
```

Run the command for the platform you want. Web starts Vite and the API. The mobile commands start Metro in Expo Go mode and launch the selected emulator/simulator, reusing an existing healthy Quran Grammar API or starting one. A different service on the API port causes a clear error rather than being stopped. Ctrl+C closes the Metro/API processes started by that command; reused services remain running.

Without a configured `EXPO_PUBLIC_API_URL`, the Android emulator uses `http://10.0.2.2:4000` and iPhone simulator uses `http://127.0.0.1:4000`. Those addresses refer to the host computer from the respective simulators. Set `PORT` to change the API port. `apps/mobile/.env` or a shell environment value can select another API origin; physical phones need a reachable LAN or HTTPS origin.

Expo Go fits the current module set and gives fast development iteration. It is separate from the standalone test APK. Adding native modules outside Expo Go or testing project-specific native behavior requires a custom development build.

Extra Expo CLI arguments can follow `--`, for example `npm run dev:android -- --port 8091` when another project already uses Metro's default port.

## Optional build controls

```sh
npm run build:android:apk -- --check
npm run build:android:apk -- --prepare
APK_ABIS=arm64-v8a APK_GRADLE_WORKERS=2 npm run build:android:apk
```

`--check` validates installed tooling without generating a native project. `--prepare` also generates missing Android files but does not compile an APK. `APK_ABIS` selects architectures; `APK_GRADLE_WORKERS` limits parallel Gradle workers. If a build fails, no old APK is reported as a new success and the previous successful output remains available.

Workflow references: [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/), [local development builds](https://docs.expo.dev/guides/local-app-development/), and [local release builds and store signing](https://docs.expo.dev/guides/local-app-production/).

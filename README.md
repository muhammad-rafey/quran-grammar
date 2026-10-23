# Quran Grammar · قرآن گرامر

A grammar-focused Quran study app with Urdu explanations, starting with all seven ayahs of Al-Fatihah. The interface opens in English; Settings can switch buttons, navigation, headings and counts to Urdu. Quranic Arabic and Urdu learning content stay unchanged. One shared study model and Node API support a React web app and native Android/iOS apps.

## Project

| Directory       | Responsibility                                                                                |
| --------------- | --------------------------------------------------------------------------------------------- |
| `apps/web`      | React + Vite; responsive reader and mobile word-detail sheet                                  |
| `apps/mobile`   | Expo SDK 57 / React Native; Android and iOS study screens                                     |
| `apps/api`      | Express / Node.js 24 API; also serves the production web build                                |
| `packages/core` | Typed content, validation, Arabic/Urdu search, shared interface strings and number formatting |

The web app uses React with Vite because the current product is an interactive study workspace with a separate shared backend. Next.js is useful when server rendering and public content discovery become product requirements; those features do not currently justify another server framework. Both clients use the same content contract. See [architecture](docs/architecture.md).

## Features

- All 29 word occurrences, with contextual Urdu meanings and grammatical segments.
- 18 root meanings and four verb paradigms, including باب، ماضی، مضارع and patterns.
- Morphology, syntax, dictionary explanations, 18 rules, and related-root navigation.
- 14 phrase constructions and concise tafsir notes across seven ayahs.
- Floating bottom navigation, a Surah/Juz catalog, and an ayah selector. Al-Fatihah is available; the remaining content is marked Coming soon. Juz 1 is a partial preview of Al-Fatihah only.
- Part-of-speech filters and the meaning toggle stay behind a collapsed Filters button. Search is currently hidden in both apps; the shared API retains its search endpoint.
- Three short grammar practice questions, explanations and an honest attempt score, with a restart option.
- English interface and counts by default; Settings saves an English/Urdu preference on the current browser or device. Language changes affect interface text and numbers only.
- Mobile web detail sheet with focus trapping, dismiss/back controls, and preserved reading position; desktop side inspector.
- Native study and word-detail screens, bundled fonts, explicit offline content option, and API loading/error/retry states.

There is no References tab or repeated source-link UI. Settings → About contains the compact Quranic Arabic Corpus credit and link required by its published attribution terms, alongside the teaching-draft notice. Source provenance and font licenses are maintained in [third-party notices](THIRD_PARTY_NOTICES.md). The Urdu explanations remain educational drafts awaiting scholarly review.

## Run locally

Use Node.js 24 and npm. From the repository root:

```sh
npm ci
npm run dev:web
```

Web: http://localhost:5173 · API: http://localhost:4000/api/health.
Vite proxies `/api` to the Node server; no web environment file is needed locally.

Every command below runs from the repository root:

| Command                     | Opens or creates                                 |
| --------------------------- | ------------------------------------------------ |
| `npm run dev:web`           | Web app and Node API                             |
| `npm run dev:android`       | Android emulator in Expo Go, with the Node API   |
| `npm run dev:ios`           | iPhone simulator in Expo Go, with the Node API   |
| `npm run build:android:apk` | Standalone test APK at `build/quran-grammar.apk` |

The simulator commands reuse a healthy Quran Grammar API already running on port 4000, otherwise start one. They stop only the processes they started when you press Ctrl+C. Android requires an Android Studio emulator; iPhone requires macOS, Xcode and an available iOS simulator. Both use an SDK 57-compatible Expo Go client, which supports the native modules currently used by this project. A custom development client can be added when app-specific native modules or native configuration testing require it.

For a physical phone or a different API origin:

```sh
cp apps/mobile/.env.example apps/mobile/.env
# Set EXPO_PUBLIC_API_URL to the API origin reachable from your phone.
npm run dev:mobile
```

Open with a matching SDK 57 Expo Go client. A physical phone needs the computer's LAN IP instead of `localhost`; a deployed HTTPS origin also works. If no API origin is configured, the app explicitly offers its bundled Al-Fatihah edition. See [native setup](apps/mobile/README.md).

The APK command builds locally with JDK 17+, Android SDK Platform 36 and Build-Tools 36. It bundles JavaScript and fonts, so the installed APK does not require Metro or Expo Go. It uses Expo's debug signing key for local testing, **not a Play Store release**. The first build generates the ignored Android project and downloads native build dependencies. Later builds reuse it without replacing native files. See [APK build setup and options](docs/android-build.md).

## Verify

```sh
npm run verify          # all TypeScript checks, core/API tests, web/API builds
npm run build:mobile    # Android + iOS JavaScript bundles
npx playwright install chromium
npm run test:e2e        # desktop/mobile browser interactions and API failure recovery
```

GitHub Actions runs these checks on pushes to main and pull requests. You can also run the Verify workflow manually with a public `base_url` to check a deployed app from GitHub's cloud runner. A successful native bundle is not a signed store build or a device test. Store signing, store accounts and submissions are not configured.

## Docker

```sh
docker compose up -d --build --wait
```

The production Node process serves both the web app and `/api` on localhost port 8080. Only API runtime dependencies are included in the final image. [Home server deployment and removal](docs/deployment.md) describes HTTPS through an existing Caddy proxy and the Portainer-visible Compose project.

## Content and future work

This edition contains Al-Fatihah only. The app is read-only; no account system, database or scholar-editing workflow is implied. Stable word occurrence IDs and a versioned API leave room for reviewed content expansion without duplicating the data between platforms. [Content provenance](docs/content-provenance.md) records the source and editorial status.

Original application code has no general reuse license assigned yet. Third-party material retains its own licenses; public repository visibility does not change them.

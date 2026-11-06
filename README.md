# Quran Grammar · قرآن گرامر

A grammar-focused Quran study app with Urdu explanations, covering Al-Fatihah, Surahs 18, 23, 32, 36 and 55, and the final ten Surahs (105–114). The five longer chapters are published drafts awaiting scholarly review, explicitly authorized by the owner on 2026-11-07. The interface opens in English; Settings can switch buttons, navigation, headings and counts to Urdu. Quranic Arabic and Urdu learning content stay unchanged. One shared study model and Node API support a React web app and native Android/iOS apps.

## Project

| Directory       | Responsibility                                                                                |
| --------------- | --------------------------------------------------------------------------------------------- |
| `apps/web`      | React + Vite; responsive reader and mobile word-detail sheet                                  |
| `apps/mobile`   | Expo SDK 57 / React Native; Android and iOS study screens                                     |
| `apps/api`      | Express / Node.js 24 API; also serves the production web build                                |
| `packages/core` | Typed content, validation, Arabic/Urdu search, shared interface strings and number formatting |

The web app uses React with Vite because the current product is an interactive study workspace with a separate shared backend. Next.js is useful when server rendering and public content discovery become product requirements; those features do not currently justify another server framework. Both clients use the same content contract. See [architecture](docs/architecture.md).

## Features

- All 4,307 word occurrences across 474 ayahs in 16 Surahs, with contextual Urdu meanings and grammatical segments. The five longer chapters show a persistent draft/review-pending notice while reading.
- Root-family meanings and a paradigm for every finite verb, including باب، ماضی، مضارع and patterns.
- Occurrence-specific morphology, syntax, dictionary explanations, grammar rules, and related-root navigation.
- Phrase constructions and concise tafsir notes for every ayah, using the same data format as Al-Fatihah.
- Floating bottom navigation, a Surah/Juz catalog, and an ayah selector. Al-Fatihah, Surahs 18, 23, 32, 36, 55 and 105–114 are available; other chapters are marked Coming soon. Available Juz ranges are explicitly partial previews. Juz 16 opens Al-Kahf at ayah 75 and Juz 23 opens Ya-Sin at ayah 28.
- Part-of-speech filters and the meaning toggle stay behind a collapsed Filters button. Search is currently hidden in both apps; the shared API retains its search endpoint.
- Three Al-Fatihah grammar practice questions, explanations and an honest attempt score, with a restart option.
- English interface and counts by default; Settings saves an English/Urdu preference on the current browser or device. Language changes affect interface text and numbers only.
- Mobile web detail sheet with focus trapping, dismiss/back controls, and preserved reading position; desktop side inspector.
- Native study and word-detail screens, bundled fonts, explicit offline content option, and API loading/error/retry states.

There is no References tab or repeated source-link UI. Settings → About contains the compact Quranic Arabic Corpus credit and link required by its published attribution terms, alongside the teaching-draft notice. Source provenance and font licenses are maintained in [third-party notices](THIRD_PARTY_NOTICES.md). Settings explicitly labels the Urdu explanations as AI-assisted educational drafts awaiting scholarly review. They are not verbatim imports from Urdu dictionaries, translations or tafsir books.

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
| `npm run db:sqlite`         | Local SQLite copy of the content, verified       |
| `npm run db:sync`           | Postgres (Supabase) copy via `QG_PSQL`, verified |

The simulator commands reuse a healthy Quran Grammar API already running on port 4000, otherwise start one. They stop only the processes they started when you press Ctrl+C. Android requires an Android Studio emulator; iPhone requires macOS, Xcode and an available iOS simulator. Both use an SDK 57-compatible Expo Go client, which supports the native modules currently used by this project. A custom development client can be added when app-specific native modules or native configuration testing require it.

For a physical phone or a different API origin:

```sh
cp apps/mobile/.env.example apps/mobile/.env
# Set EXPO_PUBLIC_API_URL to the API origin reachable from your phone.
npm run dev:mobile
```

Open with a matching SDK 57 Expo Go client. A physical phone needs the computer's LAN IP instead of `localhost`; a deployed HTTPS origin also works. If no API origin is configured, the app uses its bundled sixteen-Surah edition, including the five labeled drafts. See [native setup](apps/mobile/README.md).

The APK command builds locally with JDK 17+, Android SDK Platform 36 and Build-Tools 36. It bundles JavaScript and fonts, so the installed APK does not require Metro or Expo Go. It uses Expo's debug signing key for local testing, **not a Play Store release**. Each build applies the current app config and launcher icons through incremental Expo Prebuild, retaining the native directory and build caches. See [APK build setup and options](docs/android-build.md).

## Verify

The approved open-book artwork is in `design/app-icons/19-book-only-{light,black}.png`.
Run `npm run build:icons` after replacing that artwork to regenerate the 1024px
mobile icons, Android adaptive/themed layers, web header logo and favicons.
iOS has light and black icon appearances. Android uses the light adaptive icon;
supported launchers apply the user's palette to the monochrome themed layer.
Native launcher icon changes require a new app build/install; Expo Go does not
verify the installed app's launcher icons.

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

**Current release (2026-11-07):** the owner authorized publishing the five completed
expansion snapshots as drafts while scholarly review continues. The app, PostgreSQL
copy and SQLite copy use the same 16-Surah registry. See
[`draft-publication.json`](content-pipeline/draft-publication.json) for exact hashes
and authorization, and `npm run publish:drafts` to reproduce the runtime modules.
Scholarly approvals remain pending. The following paragraphs record the earlier
pre-publication review and private testing snapshot.

This edition contains Al-Fatihah, Al-Fil, Quraysh, Al-Maʿun, Al-Kawthar, Al-Kafirun, An-Nasr, Al-Masad, Al-Ikhlas, Al-Falaq and An-Nas. The app is read-only; no account system or scholar-editing interface is implied. Stable word occurrence IDs and a versioned API leave room for reviewed content expansion without duplicating the data between platforms.

All 127 chunks of the five-Surah expansion — Al-Kahf, Al-Mu'minun, As-Sajdah, Ya-Sin and Ar-Rahman — are authored: 419 ayahs and 4,077 words. All five held JSON drafts exist. All 127 chunks have passed current-input independent grammar and meaning reviews plus clean final confirmation, including the [ن ه ر vowel contrast](content-pipeline/reports/codex-nahr-root-adjudication.json) and [ق ص ر plural pattern](content-pipeline/reports/codex-qasr-root-adjudication.json) corrections. The [current review manifest](content-pipeline/reports/chunk-review-manifest.json), all five held drafts and source audits are complete; structural validation reports zero errors and zero warnings. Scholarly review remains pending; the public app and both content databases still contain 11 Surahs, 55 ayahs and 230 words. PR #1 was merged and deployed at `a52e1de` without activating the expansion.

Private browser fixtures, an Android emulator and an iPhone 17 Pro simulator running iOS 26.5 exercise the held drafts without changing the public registry. Both native previews verified the Juz boundary jumps, manual reading labels, same-chapter jumps, roots/paradigms, modal return and Study/Grammar switching. The iOS checks used Expo Go 57 and headless XCTest; no physical phone or standalone iOS IPA was tested. [Native verification](content-pipeline/reports/codex-native-verification.json) records the evidence and log limitations. The completed offline review bundle embeds the existing licensed Arabic/Urdu fonts: [open the index](build/review/quran-grammar/index.html) or [download the ZIP](build/review/quran-grammar-scholarly-review.zip). These generated files remain local and git-ignored. All 4,077 word strings and 419 ayah strings matched the source inventories in Chromium, with fonts loaded and no overflow, page errors or external requests. Final verification passed: 220 Node tests, 46 Python tests, 33 browser tests, web/API builds and both mobile exports, with no test skips. The remaining work and exact commands are in [content-pipeline/README.md](content-pipeline/README.md); [content provenance](docs/content-provenance.md) records the source and editorial status.

Original application code has no general reuse license assigned yet. Third-party material retains its own licenses; public repository visibility does not change them.

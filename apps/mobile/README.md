# Quran Grammar · iOS and Android

A native Expo SDK 57 app. The React Native screens share their content, TypeScript
types, search and validation with `@quran-grammar/core`; they are not a WebView of
the website. Expo Router provides the native navigation stack and dismissible
word detail screen. Expo UI supplies the native translation switch. Rules use an accessible React
Native disclosure: the SwiftUI disclosure body did not render reliably in the
SDK 57 Expo Go client during simulator testing.

## Run

From the repository root, install the workspace dependencies with `npm install`.
Then start the app:

```sh
npm run start --workspace=@quran-grammar/mobile
```

Open it using an SDK 57 compatible Expo Go client, or use the `ios` / `android`
scripts to open an available simulator/emulator. No EAS account is needed for
local development.

## One backend

Copy `.env.example` to `.env` and set `EXPO_PUBLIC_API_URL` to the Node API origin.
The app requests `/api/v1/surahs/1`. Use your computer's LAN address when testing
on a physical phone; `localhost` means the phone itself. Use HTTPS for a deployed
API. The value is bundled into the client and must not contain credentials.

Without an API URL, the app opens the clearly labelled bundled Al-Fatihah demo.
When a configured API fails, the app shows retry and an explicit action to use the
bundled lesson. A refresh failure keeps already loaded content visible.

## Study flow

- Tap any of the 29 words to see its meaning, segments, root meaning, morphology,
  syntax, rules and related words. The four verbs also show باب، ماضی، مضارع، وزن.
- Search in Arabic or Urdu, by root or verb family. The Filter button reveals
  part-of-speech filters and the translation toggle; full ayah context stays visible.
- Study, Grammar and Settings use English controls by default. Settings switches
  the interface and counts between English and Urdu, persists the preference,
  and leaves all Quranic Arabic and Urdu learning explanations unchanged.
- Content connection status, the teaching draft notice and required attribution
  are grouped in Settings to keep the reader focused.
- Grammar shows phrase relationships and concise tafsir notes.
- Native back, dismissal gestures and the close/return controls leave the detail
  screen. Previous/next stay within the current surah.

Amiri Quran, Noto Naskh Arabic and Noto Nastaliq Urdu are bundled locally, with
their SIL Open Font License notices under `assets/fonts/`.

## Checks

```sh
npm run typecheck --workspace=@quran-grammar/mobile
npm run export --workspace=@quran-grammar/mobile
npm test --workspace=@quran-grammar/mobile
```

An export verifies native JavaScript and asset bundling, not device rendering or
an installable APK/IPA. Device testing and store signing are separate steps.
Before store publication, confirm the app identifiers, replace the scaffold app
icon, and complete scholar review of the teaching draft.

### Verification on 2026-10-23

- SDK compatibility check and TypeScript check passed with React Native 0.86.3.
- iOS and Android production JavaScript/asset exports passed after the final UI
  and language-setting changes.
- Ran in Expo Go 57.0.9 on the iPhone 17 Pro simulator (iOS 26.5). Checked Arabic
  and Urdu fonts, the compact reader, filters, root/باب search, word detail,
  next-word navigation, segment selection, rule expansion, closing detail, and
  the grammar view.
- Checked English/Urdu controls and counts; saved Urdu persisted across reload.
  Restored English afterward. Learning text stayed unchanged.
- Checked that hiding word meanings preserves the full ayah translation and
  restored the default collapsed filter panel afterward.
- Simulated an API 503 using a temporary local proxy, observed the error/retry
  screen, restored the real backend and verified that retry loaded the lesson.
- Launched Expo Go on the existing Pixel 7 / Android 16 emulator and checked
  the first reader screen, Arabic/Urdu rendering and application logs. Android
  interaction flows still need a manual pass because the desktop automation
  interface cannot attach to the emulator window.
- Regression checks cover Quran and English control row direction under both
  LTR and RTL native layouts. No global RTL setting is changed. The native switch
  and Android app theme explicitly use the app's light color scheme.
- No store publication was performed.

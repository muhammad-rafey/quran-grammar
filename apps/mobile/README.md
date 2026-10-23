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
The app requests `/api/v1/surahs/:number` for the selected available chapter.
It validates the response and chapter number before displaying it. Use your computer's LAN address when testing
on a physical phone; `localhost` means the phone itself. Use HTTPS for a deployed
API. The value is bundled into the client and must not contain credentials.

Without an API URL, the app uses the bundled study registry, starting at Al-Fatihah.
Offline status is shown in Settings; choosing another available surah loads its own lesson.
When a configured API fails, the app shows retry and an explicit action to use the
bundled lesson for the selected surah. A refresh failure keeps already loaded
content visible. A chapter change clears the previous chapter while loading;
cancelled requests cannot replace the newly selected lesson.

## Study flow

- Tap a word to see its meaning, segments, root meaning, morphology,
  syntax, rules and related words. Verbs also show باب، ماضی، مضارع، وزن.
- Choose Surah or Juz in the native catalog sheet, then use the chapter's own
  ayah picker. The catalog lists all 114 surahs and 30 juz; unavailable entries
  are disabled and labelled Coming soon. Available chapters come from the shared
  registry: Al-Fatihah and surahs 105–114. Juz 1 and Juz 30 are partial previews;
  expand a Juz to choose one of its available surahs.
- The compact Filter button reveals part-of-speech filters and the word-meaning
  toggle; full ayah context and translation stay visible. There is no search bar.
- Study, Grammar and Settings use English controls by default. Settings switches
  the interface and counts between English and Urdu, persists the preference,
  and leaves all Quranic Arabic and Urdu learning explanations unchanged.
- Content connection status, the teaching draft notice and required attribution
  are grouped in Settings to keep the reader focused.
- A floating bottom dock switches Study, Grammar and Settings. Al-Fatihah's
  Grammar view includes three interactive practice questions with explanations,
  first-attempt scoring and restart. Every available chapter has its own phrase
  relationships and concise tafsir notes; other chapters do not show Al-Fatihah's quiz.
- Native back, dismissal gestures and the close/return controls leave the detail
  screen. Previous/next stay within the current surah.
- A word route selects the chapter encoded in its occurrence ID. Malformed,
  unavailable and nonexistent occurrence links show a return-to-study action.

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

### Previous redesign verification on 2026-10-23

- SDK compatibility check and TypeScript check passed with React Native 0.86.3.
- iOS and Android production JavaScript/asset exports passed after the final UI
  and language-setting changes.
- Ran the redesigned app in Expo Go 57.0.9 on iPhone 17 Pro (iOS 26.5). Checked
  the reader and floating dock, catalog sheet, disabled availability, Juz 1
  partial-preview label, ayah 5 jump, root/باب detail, next-word navigation,
  segment selection, rule expansion, closing detail and grammar view.
- Completed practice with one wrong and two correct answers; the result was
  correctly 2/3. Restart cleared the answers and disabled Check answer until a
  new choice. Explanations appeared after both correct and incorrect choices.
- Verified cancelling a staged Juz selection keeps the reader in Surah mode.
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
- Installed the rebuilt `build/quran-grammar.apk` on that emulator and launched
  the standalone app with Metro stopped. Its bundled JavaScript rendered the new
  selectors, floating dock and complete first ayah with the saved Urdu interface
  preference.
  App-specific runtime logs had no JavaScript or Android fatal errors. This APK
  is signed for local testing.
- Regression checks cover Quran and English control row direction under both
  LTR and RTL native layouts. No global RTL setting is changed. The native switch
  and Android app theme explicitly use the app's light color scheme.
- No store publication was performed.

### Multi-surah verification on 2026-10-23

- TypeScript, all four native regression tests, and the installed Expo 57 ESLint
  configuration passed (16 source files, zero errors and warnings).
- Shared-core tests cover all 11 lessons, all 230 word occurrences, the exact
  Arabic inventory for the 201 added words, complete rule/phrase references,
  availability, and the identified grammar edge cases. These are technical
  checks, not a scholarly review of the AI-assisted Urdu draft.
- On iPhone 17 Pro / iOS 26.5 with Expo Go 57.0.9, selected Juz 30, expanded its
  partial preview, and loaded An-Nas. Its selector offered exactly six ayahs;
  jumping to ayah 5 opened the quadriliteral verb analysis with the correct root,
  form, and 14/20 occurrence counter. Closing returned to An-Nas. Grammar view
  showed the selected chapter's syntax without Fatihah-only practice.
- Fixed a native sheet height issue that left the last catalog row beyond the
  visible scroll area. Verified Juz 30 expansion after the fix. Available lessons
  appear first in both catalogs; canonical catalog numbering is unchanged.
- Stopped the local API, opened the Al-Ikhlas occurrence deep link, and verified
  the error screen required choosing the saved lesson. The saved lesson displayed
  the passive verb analysis and correct 10/15 counter. Settings showed Offline
  content and the AI-assisted/scholar-review-pending notice. After restoring the
  API, Try again changed the status to Connected.
- Installed the final testing APK on Pixel 7 / Android 16 and cold-launched it
  with Metro stopped. The reader rendered Arabic and Urdu correctly, retaining
  the saved Urdu interface preference. App-specific logs showed no JavaScript or
  Android fatal errors. Android tap-through flows remain unverified because the
  desktop automation interface cannot attach to the emulator window.

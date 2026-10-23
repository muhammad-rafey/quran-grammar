# Architecture decision: shared content, native clients, one API

## Decision

Use npm workspaces with React/Vite for web, Expo React Native for Android/iOS, and one Express service on Node.js 24. Share typed study content, normalization, searching, schema validation, interface strings and numeral formatting in `@quran-grammar/core`. Keep DOM UI and native UI separate so each uses appropriate layout and accessibility primitives.

The Node service returns a complete chapter from a shared eleven-Surah registry (1 and 105–114). Clients request the selected chapter, validate the chapter number and data relationships, and cancel obsolete requests so content from another chapter cannot appear under the selected title. Search and word inspection run locally after loading, keeping interactions immediate. Stable `surah:ayah:word` IDs preserve contextual differences even when a word is repeated. The native app bundles a clearly labelled copy for offline study; the server remains the source for connected operation.

## Why React/Vite for web

The current requirement is an interactive reader, not server-rendered content pages. Vite produces a static frontend that the same Node process can serve. It avoids splitting API behavior between a Next.js server and a separate backend. Next.js remains a reasonable future choice if indexed public lesson pages, metadata per ayah, or server rendering become a concrete requirement.

References for the framework decision: [Vite guide](https://vite.dev/guide/), [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports), [Expo monorepos](https://docs.expo.dev/guides/monorepos/), and [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/).

## API boundary

The initial service is read-only. It offers health, surah inventory, a complete surah, a word detail, and bounded chapter-scoped search endpoints under `/api`. Unknown API routes return JSON 404s and never fall through to the web app. CORS allows configured origins and requests without an Origin header, as used by native clients. No cookies or credentials are needed. Search accepts `surah=105`, for example, and defaults to Surah 1 for compatibility. Unpublished chapters return JSON 404 responses.

No database is necessary for this versioned, read-only seed dataset. Its Urdu teaching explanations await scholarly review. A future content database should preserve occurrence IDs, distinguish root entries from contextual word meanings, and record scholarly review/version history. Authoring and review need their own authorization model before exposing writes.

## UI behavior

Mobile web retains full verse context and opens word analysis in a dismissible native HTML dialog. The selected word header and next/previous controls remain visible while the details scroll. Desktop uses a side inspector. Part-of-speech filters highlight matches without deleting words from Quranic verses. Filters are collapsed initially; their button reveals word-type selection and the word-meaning toggle. Search remains available through the API but is hidden in both interfaces. Surah/Juz and ayah selectors sit above the reader. Juz selections expose only the included chapters. Color is supplemented by text labels; mobile touch targets, keyboard focus, RTL text and reduced motion are supported.

Study, Grammar and Settings use English interface text and ASCII digits by default. Settings allows Urdu interface text and Urdu digits. The shared `getUiStrings`, `formatCount` and `isUiLanguage` helpers keep the two clients consistent. The web client stores its preference in localStorage; the native client uses AsyncStorage. Preferences are local to that browser or app installation, with no account synchronization. Only supported saved values are accepted; a missing or invalid value falls back to English, and storage failures are reported.

Interface language never translates or replaces Quranic Arabic, Urdu meanings, grammatical labels within teaching content, dictionary notes or tafsir. Those content containers keep their Arabic/Urdu language and right-to-left direction while interface controls follow the selected language. Numeral conversion is deterministic across platforms and does not depend on the device locale.

The user-facing References view was removed. Settings → About retains the compact Quranic Arabic Corpus credit and source link required by its published terms, plus the teaching-draft notice. Data provenance and font notices remain in the repository; the study API has no per-record reference links.

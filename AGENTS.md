# Quran Grammar

This is a standalone npm-workspaces project that helps users understand the Quran and its grammar. Use Node.js 24 and `npm ci`.
Read https://docs.expo.dev/versions/v57.0.0/ before changing native app code.

- `apps/web`: React and Vite, responsive study interface.
- `apps/mobile`: Expo React Native for Android and iOS.
- `apps/api`: the shared Node API; also serves the production web bundle.
- `packages/core`: typed study data, search/validation, interface strings and numeral formatting. Lessons are JSON in `packages/core/data/lessons/surah-N.json` (all 114), built by the pipeline; do not hand-edit them.
- `content-pipeline`: the whole Quran is built from sources only (owner decision 2026-11-26) in `content-pipeline/full-quran`; read its README.md and `scope.json` before content work. No AI-written data in new chapters; fields without a source stay empty and hidden. The earlier authoring/review records (Surahs 18, 23, 32, 36, 55 in `content-pipeline/`, Edition 2 in `edition-2/`, Edition 3 in `edition-3/`) remain the provenance of the published grammar layer those chapters keep. Scholarly review remains pending; do not claim scholarly approval.

Preserve Arabic text, word occurrence IDs, contextual grammar, root meanings and verb paradigms. Content changes need scholarly review. Preserve provenance in the repository and the required Corpus credit/link plus the Quran.com credit in Settings → About; the study interface has no References tab or per-word source links. No tafsir.

English is the default interface language. Settings persists the user's English/Urdu preference locally; it changes controls, navigation, headings and counts only. Settings also offers six Quran.com Urdu ayah translations (`translationEditions` in `packages/core/src/translations.ts`; the first is the default); they are Urdu content, shown RTL. Keep Quranic Arabic, Urdu translations and Urdu learning explanations unchanged and RTL. Reuse the shared interface helpers rather than duplicating interface strings or numeral conversion. Keep word-type filters and the meaning toggle collapsed under the Filters button initially.

Run `npm run verify` and targeted browser checks for behavior changes. Run `npm run build:mobile` for native app changes; bundling alone is not a device test. Never commit credentials, deployment-specific environment files, or generated native projects.

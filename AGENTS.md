# Quran Grammar

This is a standalone npm-workspaces project. Use Node.js 24 and `npm ci`.
Read https://docs.expo.dev/versions/v57.0.0/ before changing native app code.

- `apps/web`: React and Vite, responsive study interface.
- `apps/mobile`: Expo React Native for Android and iOS.
- `apps/api`: the shared Node API; also serves the production web bundle.
- `packages/core`: typed study data, search/validation, interface strings and numeral formatting.

Preserve Arabic text, word occurrence IDs, contextual grammar, root meanings and verb paradigms. Content changes need scholarly review. Preserve provenance in the repository and the required Corpus credit/link in Settings → About; the study interface has no References tab or per-word source links.

English is the default interface language. Settings persists the user's English/Urdu preference locally; it changes controls, navigation, headings and counts only. Keep Quranic Arabic and Urdu learning explanations unchanged and RTL. Reuse the shared interface helpers rather than duplicating translations or numeral conversion. Keep word-type filters and the meaning toggle collapsed under the Filters button initially.

Run `npm run verify` and targeted browser checks for behavior changes. Run `npm run build:mobile` for native app changes; bundling alone is not a device test. Never commit credentials, deployment-specific environment files, or generated native projects.

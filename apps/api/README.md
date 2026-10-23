# Node API

The single read-only backend serves the same versioned dataset to the React web and Expo mobile applications. It has no database, accounts, API keys, or external content dependency at runtime.

From the repository root:

```sh
npm run dev --workspace=@quran-grammar/api
npm run build --workspace=@quran-grammar/api
npm run start --workspace=@quran-grammar/api
```

Environment variables:

| Variable          | Default                                       | Purpose                                                                         |
| ----------------- | --------------------------------------------- | ------------------------------------------------------------------------------- |
| `PORT`            | `4000`                                        | HTTP port                                                                       |
| `HOST`            | `0.0.0.0`                                     | Bind address; allows a physical device on your LAN to reach development         |
| `ALLOWED_ORIGINS` | `http://localhost:5173,http://127.0.0.1:5173` | Comma-separated browser origins; no wildcards or paths                          |
| `WEB_DIST`        | unset                                         | Absolute or process-relative web build folder containing `index.html`; optional |

Native requests without an Origin header are accepted. CORS is a browser policy, not authentication; this is a public read-only API. Set the deployed web origin explicitly if using different web and API origins.

| GET endpoint                        | Response                                                      |
| ----------------------------------- | ------------------------------------------------------------- |
| `/api/health`                       | Health status and schema version                              |
| `/api/v1/surahs`                    | `{ surahs: [summary] }`                                       |
| `/api/v1/surahs/1`                  | Direct `StudyData` object                                     |
| `/api/v1/surahs/1/words/1%3A5%3A2`  | `{ word, root, verbForm, rules }`; absent root/form is `null` |
| `/api/v1/search?q=استفعال&pos=verb` | `{ query, pos, total, words }`                                |

Search accepts up to 120 characters, normalizes Arabic diacritics and common Urdu letter variants, and supports `all`, `noun`, `adjective`, `verb`, `particle`, `pronoun`. The `noun` filter includes adjectives. Omitting `q` returns all words matching the filter. Duplicate query values and invalid filters return HTTP 400. Unsupported surahs, word occurrences, and API paths return JSON 404 responses. Error shape: `{ "error": { "code": "...", "message": "..." } }`.

When `WEB_DIST` is set, non-API page routes fall back to the SPA entry point. Missing files and unknown API routes still return 404; API errors never silently become HTML.

# Node API

The single read-only backend serves study content, grammar topics and practice questions to the React web app. It has no accounts or API keys. Its content comes from a `ContentRepository`:

- `DATABASE_URL` set: the home-server Supabase Postgres copy (schema `quran_grammar`, schema version 2) through a read-only role, a pool of at most 4 connections, read-only sessions and a 5 s statement timeout. Results are cached in memory, since the content only changes with a sync and redeploy.
- otherwise, or when Postgres is unreachable or not a schema-v2 copy at startup: the bundled lessons from `@quran-grammar/core/content`. These hold the same content.

`/api/health` reports which one is in use as `source` (`"postgres"` or `"bundled"`). The Expo app does not use this API: it reads the bundled SQLite file built by `npm run db:mobile`.

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
| `DATABASE_URL`    | unset                                         | Postgres content source, e.g. `postgresql://quran_grammar_reader:<pw>@supabase-db:5432/postgres` |

Native requests without an Origin header are accepted. CORS is a browser policy, not authentication; this is a public read-only API. Set the deployed web origin explicitly if using different web and API origins.

| GET endpoint                        | Response                                                      |
| ----------------------------------- | ------------------------------------------------------------- |
| `/api/health`                       | Health status, schema version and content `source`            |
| `/api/v1/surahs`                    | `{ surahs: [summary] }`                                       |
| `/api/v1/surahs/1`                  | Direct `StudyData` object                                     |
| `/api/v1/surahs/1/words/1%3A5%3A2`  | `{ word, root, verbForm, rules }`; absent root/form is `null` |
| `/api/v1/search?q=استفعال&pos=verb` | `{ query, pos, total, words }`                                |
| `/api/v1/topics`                    | `{ topics: GrammarTopicSummary[] }` in display order          |
| `/api/v1/topics/haal`               | `GrammarTopicDetail`; id must match `^[a-z0-9-]{1,64}$`       |
| `/api/v1/practice?topic=haal`       | `{ questions: PracticeQuestion[] }` for one topic             |
| `/api/v1/practice?set=fatihah`      | `{ questions }` for the three Al-Fatihah questions            |

Topic and practice routes return 400 (`INVALID_TOPIC`, `INVALID_PRACTICE`) for malformed or ambiguous queries (practice needs exactly one of `topic` or `set=fatihah`) and 404 `TOPIC_NOT_FOUND` for unknown topics.

Search accepts up to 120 characters, normalizes Arabic diacritics and common Urdu letter variants, and supports `all`, `noun`, `adjective`, `verb`, `particle`, `pronoun`. The `noun` filter includes adjectives. Omitting `q` returns all words matching the filter. Duplicate query values and invalid filters return HTTP 400. Unsupported surahs, word occurrences, and API paths return JSON 404 responses. Error shape: `{ "error": { "code": "...", "message": "..." } }`.

When `WEB_DIST` is set, non-API page routes fall back to the SPA entry point. Missing files and unknown API routes still return 404; API errors never silently become HTML.

## Content databases (schema v2)

`@quran-grammar/core/db` holds the shared table definitions, row mapping and SQL; `src/db/cli.ts` builds and verifies the copies. Every command verifies the copy by reading every table back and comparing it with the bundled lessons and the built grammar content.

| Command (repository root)                          | Result                                                                |
| -------------------------------------------------- | --------------------------------------------------------------------- |
| `npm run db:sqlite`                                | `build/db/quran-grammar.sqlite`                                       |
| `npm run db:mobile`                                | `apps/mobile/assets/db/quran-grammar.db` (git-ignored app asset)      |
| `npm run db:verify-sqlite -w @quran-grammar/api`   | Verify a SQLite file                                                  |
| `npm run db:sync`                                  | Load and verify Postgres through `QG_PSQL` (one transaction)          |
| `npm run db:verify-postgres -w @quran-grammar/api` | Verify Postgres through `QG_PSQL`                                     |
| `npm run db:postgres-role-sql -w @quran-grammar/api` | Print the read-only role SQL below                                  |

`QG_PSQL` is a psql command line for an administrator, for example `ssh <server> docker exec -i supabase-db psql -U postgres -d postgres`. The sync creates any new tables, truncates and reloads all content, and never grants anything.

### Read-only role for the API (run once, as `postgres`)

```sql
-- psql -v reader_password='<generated password>' -f role.sql
do $$ begin
  if not exists (select from pg_roles where rolname = 'quran_grammar_reader') then
    create role quran_grammar_reader login;
  end if;
end $$;
alter role quran_grammar_reader with login password :'reader_password';
alter role quran_grammar_reader set default_transaction_read_only = on;
alter role quran_grammar_reader set statement_timeout = '5s';
grant usage on schema quran_grammar to quran_grammar_reader;
grant select on all tables in schema quran_grammar to quran_grammar_reader;
alter default privileges in schema quran_grammar grant select on tables to quran_grammar_reader;
```

The default privileges cover tables a later sync creates as `postgres`. Then put the URL in an untracked `.env` beside `compose.homeserver.yaml` (the app container joins the external `supabase_default` network, so `supabase-db` resolves):

```sh
DATABASE_URL=postgresql://quran_grammar_reader:<password>@supabase-db:5432/postgres
```

Never commit this file. URL-encode the password if it contains reserved characters.

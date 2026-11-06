# Content databases

The app still serves the bundled, versioned study content from `@quran-grammar/core`. Two synchronised database copies hold exactly the same content so a database can replace the bundled data later:

- **SQLite** — a local file, `build/db/quran-grammar.sqlite` (ignored by git; rebuild it at any time).
- **Postgres in the home-server Supabase** — schema `quran_grammar`, kept separate from every other project's data.

Both are produced from the same rows by `apps/api/src/db`. Every sync rebuilds the copy from the bundled lessons and then proves it: each table is read back, converted to `StudyData`, validated with `isStudyData`, and compared byte for byte with the bundled lessons. A `content_version` row records the content SHA-256, the source commit, the sync time and the surah/ayah/word counts.

## Commands

```sh
npm run db:sqlite        # build build/db/quran-grammar.sqlite and verify it
npm run db:sync          # load Postgres through $QG_PSQL and verify it
npm run db:verify        # re-verify both copies without changing them
```

`QG_PSQL` is the psql command line for the target database. It is never committed. For the home-server Supabase the deployment uses SSH and the database container's local socket, so no database password leaves the server:

```sh
export QG_PSQL='ssh <server> docker exec -i supabase-db psql -U postgres -d postgres'
npm run db:sync
```

A direct connection also works: `QG_PSQL='psql "postgresql://…"'`. Generate the Postgres script without running it with `npm run db:postgres-sql -w @quran-grammar/api`.

## Schema

| Table                     | Holds                                                                                                                         |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `surahs`                  | number, Urdu and Arabic names, ayah and word counts                                                                           |
| `ayahs`                   | translation, theme and tafsir per ayah                                                                                        |
| `words`                   | each occurrence (`surah:ayah:word` id), Arabic text, meaning, word type, root, lemma, morphology, syntax and dictionary notes |
| `word_segments`           | ordered segments of each word                                                                                                 |
| `word_rules`              | ordered rule references of each word                                                                                          |
| `rules`                   | each lesson's rule cards, in lesson order                                                                                     |
| `roots`                   | each lesson's root entries, in lesson order                                                                                   |
| `verb_forms`              | the باب، ماضی، مضارع and pattern card for every verb occurrence                                                               |
| `phrases`, `phrase_words` | phrase constructions and their ordered words                                                                                  |
| `content_version`         | which content the copy holds                                                                                                  |

Rules and roots are stored per lesson because each lesson carries its own wording. Every list keeps an explicit `position`, so the rows reproduce the bundled order exactly. Foreign keys keep words, segments, phrases, rule references and verb paradigms consistent.

The Postgres schema is private: it is not listed in the Supabase REST API's exposed schemas, and `anon`, `authenticated` and `service_role` have no access to it. A sync is one transaction (create if needed, truncate, insert, record the version), so a failed sync leaves the previous copy in place.

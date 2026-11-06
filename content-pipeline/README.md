# Five-Surah expansion — plan, progress and handoff

**Status (2026-11-06): paused by the owner after the shared libraries and a three-chunk pilot.**
No new lesson is live. The app still ships Al-Fatihah and Surahs 105–114 (11 Surahs, 55 ayahs,
230 words). This folder holds everything needed to resume: the plan, the deterministic tooling,
the verified shared libraries, the verified pilot chunks, the adjudicated corrections to the
Corpus data, the workflow scripts and a ready-to-apply integration patch.

Read this file first. Then read `guide/authoring-guide.md`, which every authoring and review agent
follows.

---

## 1. Goal

Add five Surahs in exactly the existing lesson pattern (`StudyData` modules in
`packages/core/src/lessons/`, one entry per word occurrence with an Urdu meaning, word type,
lemma, morphology, syntax and dictionary notes, segments and rule references; a verb-paradigm
card for every verb occurrence; per-lesson root entries and rule cards; phrases, translation,
theme and a concise tafsir for every ayah; a source audit and Arabic inventory per Surah; tests).

| Surah | Name        |   Ayahs |     Words | Juz                    |
| ----: | ----------- | ------: | --------: | ---------------------- |
|    18 | Al-Kahf     |     110 |     1,579 | 15 (1–74), 16 (75–110) |
|    23 | Al-Mu'minun |     118 |     1,050 | 18                     |
|    32 | As-Sajdah   |      30 |       372 | 21                     |
|    36 | Ya-Sin      |      83 |       725 | 22 (1–27), 23 (28–83)  |
|    55 | Ar-Rahman   |      78 |       351 | 27                     |
|       | **Total**   | **419** | **4,077** |                        |

That is about 18 times the current content: 1,048 verb occurrences (357 Corpus verb lexemes plus
one split, see §5), 589 roots. After the expansion the edition has 16 Surahs, 474 ayahs and 4,307
words.

## 2. Plan (method)

The owner asked for the same approach as Surahs 105–114 — open data plus AI-written Urdu
explanation — implemented with parallel subagents and double verification.

1. **Deterministic source layer** (scripts, no AI):
   - Arabic words: Quran.com Content API v4 `text_uthmani`. Never typed by an agent.
   - Morphology: Quranic Arabic Corpus (QAC) 0.4, a verbatim copy checked by SHA-256
     (`910b721a…532d`), used locally only. The mustafa0x fork is used for cross-checks.
   - Syntax references: QAC word-by-word pages (Arabic i‘rab per word) and verse grammar pages.
   - Meaning references: Tafsir al-Muyassar and Tafsir al-Sa‘di (Arabic), Ibn Kathir abridged
     (English), Saheeh International and Taqi Usmani translations — all via the Quran.com API.
   - Word type (`pos`) and `root` are derived from QAC stem tags with a mapping that reproduces
     all 230 existing roots and 228/230 existing word types (the two exceptions are an
     inconsistency in Surah 109; see §5).
   - 127 chunks of whole ayahs, about 30 words each (`meta/plan.json`).
2. **Shared libraries, authored once and double-verified** (so every chunk agrees):
   112 grammar rules (`libs/rules.json`), 358 verb paradigms (`libs/lexemes/`), 589 root entries
   (`libs/roots/`). Each batch: author → two independent reviewers with different lenses → fixer
   → confirming reviewer → second fixer if needed.
3. **Chunk authoring** (`workflows/chunks.js`): for each chunk an author writes all words and
   ayahs from a source packet; a grammar reviewer and a meaning/tafsir/Urdu reviewer check it
   independently; a fixer applies or rejects each finding with a reason; a confirming reviewer
   re-checks the whole chunk and the loop repeats while serious issues remain.
   `scripts/validate_chunk.py` enforces structure, ids, segment slices that rejoin to the exact
   Arabic word, rule references, phrase coverage and the absence of Latin text or URLs.
4. **Deterministic assembly** (`scripts/assemble.py`): chunks + libraries → lesson modules in the
   exact house style (prettier 3.6.2, verified byte-identical on existing lessons), rule cards in
   first-use order with templated examples, roots and verb cards from the libraries, phrase ids
   `S:A:phraseK`. Then source audits (`scripts/gen_audit.py`), registry/availability/tests/docs
   (`integration/five-surahs.patch`) and the content databases.

## 3. Done

### 3.1 App and infrastructure (in this PR, verified)

- **Juz boundaries:** `catalog.ts` now has the ayah ranges of all 30 juz (checked against the
  Quran.com `/juzs` endpoint; every ayah of all 114 chapters covered once). `JuzCatalogEntry`
  gains `ranges`; new `getJuzForAyah` and `getJuzStartAyah`.
- **Web and mobile pickers:** a chapter chosen from a juz opens at its first ayah inside that juz,
  and the juz label follows the ayah being read (needed for Al-Kahf and Ya-Sin). Web deep link
  `#surah=N&ayah=M`.
- **Mobile performance:** the reader memoises its ayah and word lists so scroll-driven ayah
  updates do not re-render every word (Al-Kahf will have 1,579 words).
- **Content databases** (`apps/api/src/db`, `docs/database.md`): a lossless `StudyData` ↔ rows
  model, a local SQLite copy (`npm run db:sqlite`), a Postgres copy in the home-server Supabase
  (`npm run db:sync`, private schema `quran_grammar`), and a verify step that reads every table
  back and compares it byte for byte with the bundled lessons. The live app still serves the
  bundled data (owner decision).
- Verified: `npm run verify` (typecheck, all unit/API/database tests, web and API builds),
  `npm run test:e2e` (21/21), `npm run build:mobile`. Not yet tested on a device or simulator.

### 3.2 Content pipeline (this folder)

- Sources fetched and cross-checked: all 419 ayahs have identical word counts in Quran.com,
  QAC 0.4 and the fork.
- 154 recitation signs that the API separates from a word by a space (waqf signs, the saktah
  sign, the sajdah sign ۩ and the rub al-hizb marker ۞) are excluded from stored word tokens,
  following the Surahs 110–114 precedent. Each exclusion is listed in `inventory/inventory-N.json`.
- **65 adjudicated corrections to QAC tags** in `meta/overrides.json`; see §5.
- **Libraries, verified:**

  | Library        | Entries | Review findings (critical / major / minor) |                       Applied | Confirm round                                         |
  | -------------- | ------: | ------------------------------------------ | ----------------------------: | ----------------------------------------------------- |
  | Rules          |     112 | 0 / 14 / 23                                |    37 (2 missing rules added) | stopped at hand-off before it reported; re-check (§4) |
  | Verb paradigms | 357 + 1 | 4 / 31 / 89                                | 136 (5 rejected with reasons) | 5 major + 14 minor, all fixed (not re-confirmed)      |
  | Roots          |     589 | 0 / 26 / 104                               |              141 (2 rejected) | 13 minor, all fixed                                   |

  The verb-paradigm authors settled each Form I vowel class (باب) from imperfects attested
  across the whole Corpus and from standard lexica (Lane, Lisān al-‘Arab, al-Mu‘jam al-Wasīṭ),
  recorded in each entry's `evidenceEnglish`.

- **Pilot chunks, fully verified** (author → two reviews → fix → confirm → fix):
  `chunks/18/18-c01.json` (18:1–4, 35 words), `chunks/36/36-c01.json` (36:1–8, 37 words),
  `chunks/55/55-c01.json` (55:1–10, 30 words). Reviews found 1 major issue in total (a tafsir
  cross-reference to Surah al-Baqarah, now forbidden by the guide) and minor polish, all fixed.
  Quality was scholarly-grade; the authors also caught a QAC tag error on their own.
- `reports/`: per-agent review summaries for the libraries and the pilot.

### 3.3 Operations (outside the repository)

- Rollback backup of the live container (commit `3df065c`, image
  `sha256:a3a3a9ad…`): `~/Backups/quran-grammar-homeserver/2026-11-06/` on the owner's Mac
  (image tarball, deployment config, manifest, SHA-256 sums).
- Home-server Supabase: schema `quran_grammar` created and loaded with the current 11 Surahs;
  read back and verified identical (content SHA-256 `1e9bca62…219f`). Not reachable through the
  Supabase REST API (`anon`, `authenticated` and `service_role` have no access).
- Local SQLite copy built at `build/db/quran-grammar.sqlite` (git-ignored).

## 4. What is left (in order)

1. **Re-check the open library items:** the rules library's confirmation round (it was stopped
   when the work was paused — run `scripts/validate_lib.py . rules` and a fresh review of
   `libs/rules.json`), and the five verb-paradigm notes fixed after confirmation without a
   further check: `mak~a|II|ACT`, `n~aZara|I|ACT`, `>axa*a|I|PASS`, `>uEiydu|IV|ACT`,
   `sabaqa|I|ACT`.
2. **Rebuild sources and packets** (third-party texts are git-ignored; see §6):
   `fetch_sources.py`, `fetch_qac.py`, `prepare.py`, `make_batches.py`, `build_packets.py`.
   `prepare.py` regenerates `meta/plan.json` deterministically; confirm it is unchanged.
3. **Run the remaining 124 chunks** with `workflows/chunks.js` (Workflow tool,
   `args: {"chunks": [...], "work": "<absolute path of this folder>"}`). Four balanced groups
   ran well in planning (each workflow runs about 12 agents at once):
   - A: `18-c02` … `18-c32` (31)
   - B: `18-c33` … `18-c50`, `23-c01` … `23-c13` (31)
   - C: `23-c14` … `23-c33`, `32-c01` … `32-c11` (31)
   - D: `32-c12`, `36-c02` … `36-c21`, `55-c02` … `55-c11` (31)

   Pilot measurements: about 17–20 minutes per chunk author at maximum effort, about 50 minutes
   for a chunk's whole pipeline, about 1.1 million subagent tokens per chunk. Expect roughly
   2.5–3 hours of wall time with four workflows and roughly 140 million subagent tokens.

4. **Review the run:** unresolved confirm findings, `libraryIssues` reported by chunk reviewers
   (fix the library, then any chunk text that repeats the error), and `auditNotes` that dispute a
   fixed `pos`/`root` (add an override if justified).
5. **Consistency pass:** `scripts/assemble.py . <repo>` (without `--write`) reports lemma variants
   and verb lemmas that differ from the paradigm's past form; check that chunk text naming a باب
   or form agrees with the final paradigm library. A final cross-chunk review agent is advisable.
6. **Assemble and integrate:** `scripts/assemble.py . <repo> --write`,
   `scripts/gen_audit.py . <repo> reports/chunk-results.json`, `git apply
integration/five-surahs.patch` (registry, availability, 16-Surah tests and docs), run
   prettier.
7. **Verify:** `npm run verify`, `npm run test:e2e` (the patch adds a full-load test for the five
   chapters and a juz test: Juz 16 opens Al-Kahf at ayah 75, Juz 23 opens Ya-Sin at ayah 28),
   `npm run build:mobile`, and a simulator/device check of Al-Kahf scrolling and the juz picker.
8. **Databases:** `npm run db:sqlite` and `npm run db:sync` (with `QG_PSQL`, see
   `docs/database.md`) to load all 16 Surahs.
9. **Ship:** PR, merge, then redeploy the home server from `main` (§7).

## 5. Issues and hurdles (read before resuming)

- **QAC 0.4 has occurrence-level tag errors.** Found so far and corrected in
  `meta/overrides.json` (65 entries, each with evidence): verb mood (e.g. يُوحَىٰ 18:110,
  يَتَوَفَّىٰكُم 32:11, يَسْعَىٰ 36:20, وَيَبْقَىٰ 55:27 tagged subjunctive though indicative;
  تَسْطِع 18:82 tagged indicative though jussive after لَمْ), voice (تُظْلَمُ 36:54 and يُغَاثُوا۟
  18:29 are passive; وَزِدْنَـٰهُمْ 18:13, مِتُّمْ 23:35 and مِتْنَا 23:82 are active), person
  (تُنذِرْهُمْ 36:10, تُخَاطِبْنِى 23:27), verb form (تَعَالَى 23:92/116 is Form VI), and noun case
  (duals in ـَيْنِ, annexed vocatives such as رَبِّ / يَـٰقَوْمِ, objects with first-person ـِى, and
  others tagged nominative). `build_packets.py` passes each correction to authors as
  `qacCorrection`; `assemble.py` uses corrected lexeme keys. QAC's lemma ids are sometimes
  inflected forms (بُشِّرَ for بَشَّرَ) and one lemma (taEa`laY`) merges two verbs — 23:91:17
  وَلَعَلَا now has its own paradigm (`libs/lexemes/lex-extra.json`).
  `scripts/check_verbs.py` flags further mood/voice contradictions heuristically; most of its
  flags on weak verbs are false positives, so adjudicate by hand. Authors are instructed to
  follow the vocalised word and log any further discrepancy in `auditNotes`.
- **Quran.com pause signs:** `text_uthmani` appends waqf/saktah/sajdah signs and prefixes ۞ with a
  space; these are excluded (saktah written inside a word without a space, e.g. عِوَجَاۜ 18:1, is
  kept). Segments must rejoin to the stored word exactly.
- **QAC download:** the official download asks for an e-mail address. The pipeline uses a verbatim
  Git LFS mirror and verifies its SHA-256 (`scripts/fetch_qac.py`). The Corpus file is never
  committed or bundled.
- **Existing-data inconsistencies:** Surah 109 tags preposition + pronoun words (لَكُمْ، لِىَ) as
  pronouns, while Surahs 1, 105 and 112 use particle; the new content uses particle. Rule cards,
  verb cards and phrase ids differ in style between Surahs 105–109 and 110–114; the new content
  follows 105–109 (phrase ids `S:A:phraseK`, examples «word — meaning۔ …»).
- **Agents and shared files:** a library fixer once edited `meta/overrides.json` (its two
  additions were correct and kept). The chunk prompts now allow writing only the agent's own
  chunk file; reviewers write nothing.
- **Size:** the five lessons add several MB of source. The mobile app bundles every lesson for
  offline use; the web app fetches one chapter at a time (Al-Kahf will be a few MB of JSON before
  compression). Check performance on a real device.
- **Licensing:** tafsir texts, translations and bulk Corpus data are references only and are
  git-ignored (`.gitignore`). The committed libraries and chunks are original AI-assisted Urdu.
  AI review is not scholarly review; every new lesson stays labelled as a draft awaiting it.
- **Home server public IP changed** to `39.36.246.28`, so the live address
  `https://quran-grammar.39.36.252.180.sslip.io` is unreachable (the other sslip.io routes on that
  server — n8n, supabase, quran — are affected the same way). Moving the quran-grammar route needs
  the commands in §7; the agent was not permitted to run remote write commands.
- **Tooling:** Playwright needed `npx playwright install chromium` for its current browser build.
- **QuranAcademy is a separate project and database.** Never mix it with Quran Grammar.

## 6. How to resume

```sh
cd content-pipeline
python3 -I scripts/fetch_sources.py .   # Quran.com + QAC pages, about 10 minutes, rate-limited
python3 -I scripts/fetch_qac.py .       # QAC 0.4 (SHA-256 checked) + mustafa0x fork
python3 -I scripts/prepare.py . .       # words/ayahs metadata, plan, inventories
python3 -I scripts/make_batches.py .    # library batch inputs (libraries already exist)
python3 -I scripts/check_verbs.py .     # optional: heuristic QAC mood/voice flags
python3 -I scripts/build_packets.py .   # one source packet per chunk, with corrections
# Workflow tool: workflows/chunks.js with {"chunks": [...], "work": "<abs path>"} per group (§4.3)
python3 -I scripts/assemble.py . ..          # report only
python3 -I scripts/assemble.py . .. --write  # write lesson modules + inventories
python3 -I scripts/gen_audit.py . .. reports/chunk-results.json
cd .. && git apply content-pipeline/integration/five-surahs.patch
npm run verify && npm run test:e2e && npm run build:mobile
npm run db:sqlite && QG_PSQL='…' npm run db:sync
```

Summarise a workflow's journal with
`python3 -I scripts/journal_summary.py <journal.jsonl> reports/<name>.json`.

## 7. Home-server redeploy (after the PR is merged)

On the server (`ssh <server>`), from `~/quran-grammar`:

```sh
# Move the route to the current public IP (the shared Caddyfile is validated before reload).
for f in .env .deployment/proxy-route.caddy .deployment/README.md; do cp -p "$f" "$f.before-ip-change"; done
sed -i 's/39\.36\.252\.180/39.36.246.28/g' .env .deployment/proxy-route.caddy .deployment/README.md
python3 .deployment/manage-proxy.py install
# Deploy main.
git pull --ff-only
docker compose -f compose.yaml -f compose.homeserver.yaml up -d --build --wait
```

Then check `https://quran-grammar.39.36.246.28.sslip.io/api/health` and `/api/v1/surahs`.
Rollback: `docker load` the image tarball from the backup folder, restore the `.before-ip-change`
files and re-run `manage-proxy.py install`.

## 8. Owner decisions on record

- Content databases hold the grammar content only; the app keeps serving its bundled data for now
  (SQLite can replace Supabase later).
- QuranAcademy is a separate project; do not touch its Supabase project.
- Grammar authoring paused after the pilot; resume from §4.
- Work through a pull request; redeploy the server from `main` after merge.

## 9. File map

| Path                                                           | Purpose                                                             | Tracked |
| -------------------------------------------------------------- | ------------------------------------------------------------------- | ------- |
| `guide/authoring-guide.md`                                     | Binding style and accuracy guide for agents                         | yes     |
| `scripts/`                                                     | Fetch, prepare, validate, build packets, assemble, audit, summarise | yes     |
| `workflows/`                                                   | Library and chunk workflow scripts                                  | yes     |
| `libs/`                                                        | Verified rules, verb paradigms, roots                               | yes     |
| `chunks/`                                                      | Verified pilot chunks                                               | yes     |
| `inventory/`                                                   | Arabic inventories with excluded signs                              | yes     |
| `meta/overrides.json`                                          | Adjudicated QAC corrections                                         | yes     |
| `meta/plan.json`, `meta/*-batches.json`                        | Chunk plan and library batches                                      | yes     |
| `meta/existing-rules.json`, `meta/style-exemplars.json`        | Inputs taken from the existing lessons                              | yes     |
| `integration/five-surahs.patch`                                | Registry, availability, 16-Surah tests and docs                     | yes     |
| `reports/`                                                     | Library and pilot review summaries                                  | yes     |
| `sources/`, `qac/`, `packets/`, `inputs/`, other `meta/*.json` | Third-party or regenerable data                                     | no      |

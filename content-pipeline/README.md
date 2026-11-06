# Five-Surah expansion — plan, progress and handoff

**Status (2026-11-06): resumed by the owner; all new content is held for scholarly review.**
No new lesson is live. The app still ships Al-Fatihah and Surahs 105–114 (11 Surahs, 55 ayahs,
230 words). This folder holds everything needed to resume: the plan, the deterministic tooling,
the verified shared libraries, the verified pilot chunks, the adjudicated corrections to the
Corpus data, the workflow scripts and a ready-to-apply integration patch.

Read this file first. Then read `guide/authoring-guide.md`, which every authoring and review agent
follows.

### Resumption status

- **110 of 127 chunks are authored and structurally valid:** 365 ayahs and 3,553 words.
  As-Sajdah (32), Ya-Sin (36) and Ar-Rahman (55) have complete held JSON drafts in `drafts/`.
  Al-Kahf has 44/50 chunks; Al-Mu’minun has 22/33. These are drafts, not new live lessons.
- **Codex account capacity is exhausted.** The CLI and review agents reported a usage limit
  with a reset of November 12, 2026 at 3:39 PM (timezone not supplied). Further model work
  requires restored capacity. Do not repeatedly retry while the limit remains.
- **101 chunks completed independent AI reviews against the prior library version.** Two late
  shared-library findings were then corrected: the `condition-answer` exception for suddenness
  إِذَا (23:64/77), and Urdu agreement in the اِتَّخَذَ paradigm note. Seven Ar-Rahman lemma-only
  consistency edits were also applied. **All 110 authored chunks now need fresh full reviews**
  against current inputs; no checkpoint was upgraded or counted current. See
  `reports/progress.json`, `reports/codex-final-corrections.json` and the source-backed
  `reports/codex-condition-answer-adjudication.json`.
- All 112 rules received fresh initial confirmation and focused predicate/clause audits;
  the five outstanding verb notes were confirmed. Later findings above demonstrate why
  these AI audits must not be called exhaustive correctness certification. Root-risk and
  library-adjudication reports preserve the decisions. Other possible Urdu agreement polish
  should be checked during the resumed reviews.
- Sources were checked and all 127 packets rebuilt. Arabic inventories and the plan reproduce
  unchanged. `make_batches.py` preserves the adjudicated `lex-extra` split on regeneration.
- The owner explicitly approved authenticated Codex CLI processing of public reference packets
  and draft text. Approval persists; do not request it again. The runner uses the owner’s CLI
  model/settings, bounded concurrency, isolated workspaces and input/content checkpoints.
- The Quran Grammar HTTPS route is repaired with backups and Caddy validation. Both content
  databases and the actual API still contain only the published eleven-Surah edition.
- Android/iOS bundles and a fresh Android 36 emulator APK test passed. Private browser fixtures
  can exercise assembled drafts without changing the real registry, API or publication hold.

**Publication hold:** `review-status.json` records all five new Surahs as pending. `assemble.py
--write` refuses runtime output until an actual scholarly review record has a reviewer, date,
evidence and the current content SHA-256. `--draft` emits reviewer JSON and inventories only
under `content-pipeline/drafts/`; it never registers a lesson. AI review cannot grant this
approval. Do not apply `integration/five-surahs.patch` while the hold remains.

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
   re-checks the whole chunk and the loop repeats until no findings remain.
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
  `npm run test:e2e` (now 24/24), `npm run build:mobile`. The current 11-Surah APK has now
  passed Android emulator interactions. Private browser checks now cover the complete held
  As-Sajdah, Ya-Sin and Ar-Rahman drafts and Ya-Sin’s Juz boundary; long-chapter native checks remain.

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
  | Rules          |     112 | 0 / 14 / 23                                |    37 (2 missing rules added) | fresh confirmation complete; 2 further minor clarifications fixed and confirmed |
  | Verb paradigms | 357 + 1 | 4 / 31 / 89                                | 136 (5 rejected with reasons) | outstanding five notes freshly confirmed             |
  | Roots          |     589 | 0 / 26 / 104                               |              141 (2 rejected) | 13 minor, all fixed                                   |

  The verb-paradigm authors settled each Form I vowel class (باب) from imperfects attested
  across the whole Corpus and from standard lexica (Lane, Lisān al-‘Arab, al-Mu‘jam al-Wasīṭ),
  recorded in each entry's `evidenceEnglish`.

- **Pilot chunks, AI reviewed** (author → two reviews → fix, with confirmation where recorded):
  `chunks/18/18-c01.json` (18:1–4, 35 words), `chunks/36/36-c01.json` (36:1–8, 37 words),
  `chunks/55/55-c01.json` (55:1–10, 30 words). Reviews found 1 major issue in total (a tafsir
  cross-reference to Surah al-Baqarah, now forbidden by the guide) and minor polish, all fixed.
  Those original pilot records were superseded by fresh independent reviews during resumption.
  They now require another full review after the shared-library corrections above, like every
  other authored chunk. These are AI checks, not scholarly approval.
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

1. **Restore authenticated Codex account capacity.** Model jobs stopped on the usage limit,
   not on a code or permission failure. Public-reference processing is already authorized.
2. **Author the 17 missing chunks first:** `18-c45`–`18-c50`, `23-c22`, `23-c24`–`23-c33`.
   `23-c22` has an incomplete private candidate missing two words; it was deliberately not
   imported. Nine other interrupted candidates passed strict validation and were preserved
   as unreviewed authored text (`reports/codex-authored-seeds.json`).
3. **Complete fresh independent reviews for all 127 chunks.** Use `--resume --reuse-authored`:
   valid authored text is retained, but grammar and meaning reviews, fixes and a clean final
   confirmation still run. Resolve library findings before the final full pass. The recent
   rule change invalidates every old input fingerprint; the seven lemma edits also invalidate
   their old content hashes. No historical completion record grants current approval.
4. **Finish cross-chunk consistency and source-type adjudication.** `reports/validation-report.json`
   records zero structural errors and eight type-label warnings across the 110 chunks. Resolve
   those source/analysis disagreements explicitly before the final fresh pass; retain evidence
   and add a justified override rather than silently changing raw metadata. As-Sajdah’s 372 lemmas have no required corrections.
   Ar-Rahman’s seven recommendations are applied and await fresh review. Complete this pass
   for Al-Kahf, Al-Mu’minun and Ya-Sin after their current reviews; compare diagnostic variants
   carefully, preserving authentic citation forms and exact Arabic. The assembler compares
   Unicode-normalized strings only for diagnostics and respects effective passive overrides.
5. **Export and assemble the completed review edition:**

   ```sh
   node content-pipeline/scripts/export_reviews.mjs
   python3 -I content-pipeline/scripts/assemble.py content-pipeline . --draft
   python3 -I content-pipeline/scripts/gen_audit.py content-pipeline . content-pipeline/reports/chunk-results.json
   python3 -I content-pipeline/scripts/review_bundle.py content-pipeline --output "$PWD/build/review/quran-grammar"
   ```

   The exporter refuses missing/stale/incomplete reviews and pins all 127 exact chunk bytes.
   Source audits validate the complete result snapshot before writing. The offline HTML bundle
   requires current AI-review inputs and carries a persistent scholarly-review-pending notice.
   It copies only original drafts, inventories, public audits and review metadata; no raw
   third-party downloads, private model logs or credentials. No completed bundle exists yet.
6. **Verify the held drafts and stable app.** Run `npm run verify`, `npm run test:e2e` and
   `npm run build:mobile`. The private preview tests check every assembled chapter’s complete
   IDs/Arabic/counts, both Juz boundaries and the 390px Al-Kahf word-detail flow. Missing drafts
   are skipped explicitly; public `BASE_URL` runs always skip private fixtures. The long-chapter
   native/device check remains outstanding; the current eleven-Surah Android APK was tested.
7. **Obtain actual scholarly review.** All five records in `review-status.json` remain pending.
   Apply reviewer corrections, repeat AI/structural checks, regenerate artifacts and record
   reviewer identity, date, evidence and the exact final digest. AI cannot grant this approval.
8. **Only after approval:** gated `assemble.py --write`, apply the future integration patch,
   verify the sixteen-Surah app on web/native, sync the databases, merge and deploy from main.
   Until then, databases and runtime registry stay at eleven Surahs. Stable infrastructure
   changes may ship independently through the existing PR without activating the drafts.

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
- **Home-server route repaired:** `https://quran-grammar.39.36.246.28.sslip.io` is the current
  verified Quran Grammar address. The old `.252.180` address is obsolete. Only this project’s
  route and allowed origin were updated; other services and QuranAcademy were preserved.
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
# Local Codex CLI, once external processing is explicitly authorized:
node scripts/run_chunks.mjs --chunks 18-c02,18-c03 --dry-run
node scripts/run_chunks.mjs --chunks 18-c02,18-c03 --concurrency 3 --chunk-concurrency 3 --resume --reuse-authored
# Or Workflow tool: workflows/chunks.js with {"chunks": [...], "work": "<abs path>"}
python3 -I scripts/assemble.py . ..          # report only
python3 -I scripts/assemble.py . .. --draft  # reviewer artifacts outside the live app
# After all chunks pass current AI reviews, export their public summaries:
node scripts/export_reviews.mjs
python3 -I scripts/gen_audit.py . .. reports/chunk-results.json
python3 -I scripts/review_bundle.py . --output "$PWD/../build/review/quran-grammar"
# Only after actual scholarly review is recorded for every selected Surah:
python3 -I scripts/release_gate.py . --surah 18 23 32 36 55 --digest
python3 -I scripts/assemble.py . .. --write  # gated lesson modules + inventories
cd .. && git apply content-pipeline/integration/five-surahs.patch
npm run verify && npm run test:e2e && npm run build:mobile
npm run db:sqlite && QG_PSQL='…' npm run db:sync
```

After capacity is restored, run the missing-source group first from the repository root:

```sh
node content-pipeline/scripts/run_chunks.mjs --chunks 18-c45,18-c46,18-c47,18-c48,18-c49,18-c50,23-c22,23-c24,23-c25,23-c26,23-c27,23-c28,23-c29,23-c30,23-c31,23-c32,23-c33 --concurrency 16 --chunk-concurrency 16 --resume --reuse-authored
# After adjudicating any new library findings, review the entire plan against final inputs.
QG_ALL_CHUNKS=$(node --input-type=module -e 'import {readFileSync} from "node:fs"; console.log(JSON.parse(readFileSync("content-pipeline/meta/plan.json", "utf8")).map(x => x.chunk).join(","))')
node content-pipeline/scripts/run_chunks.mjs --chunks "$QG_ALL_CHUNKS" --concurrency 16 --chunk-concurrency 16 --resume --reuse-authored
```

All 127 source packets must already match the shared libraries. Lower either concurrency setting
if desired; 16 is a ceiling, not a requirement. A held or interrupted chunk must never be
promoted manually. The private checkpoints remain the raw provenance; tracked
`reports/progress.json` is a frozen handoff snapshot, and `reports/codex-chunks.json` summarizes
historical stages rather than current approvals.

Summarise a workflow's journal with
`python3 -I scripts/journal_summary.py <journal.jsonl> reports/<name>.json`.

The adapter uses the installed Codex login, model and reasoning settings. Each chunk runs in an
isolated temporary folder; reviewers are read-only. Raw logs, checkpoints and blocked candidates
stay private under git-ignored `runs/`. `--resume` reuses work only when source and content hashes
match; concurrent invocations cannot share a run directory. Library fingerprints cover all
supplied rules and only the specific root/paradigm entries supplied to a chunk. The optional
`--reuse-authored` flag preserves a structurally valid draft as authored text, with explicit
provenance, but requires both independent reviews and a clean confirmation against current inputs. The runner never applies the
integration patch, updates a database or deploys. From the repository root,
`npm run test:content-pipeline` runs offline regressions; these also run in `npm run verify`
and CI without the ignored source downloads.

## 7. Home-server redeploy (after the PR is merged)

The Quran Grammar IP-route repair was completed on 2026-11-06 and its public HTTPS deployment
verified. Deploy merged `main` only; check PR #1 and the server's `git rev-parse HEAD` for the
current deployed revision. Timestamped `.before-ip-change-*` files preserve the route-repair
rollback configuration. Other services' routes were not changed. The repaired route does not
need another IP replacement while its public address remains current.

On the server (`ssh <server>`), from `~/quran-grammar`:

```sh
# Only if the public IP changes again: update the scoped route and validate before reload.
# The following repair already ran; use the actual old/new addresses for a future change.
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
- Grammar authoring resumed after the pilot; every new lesson stays out of the runtime until
  scholarly review is recorded for its exact content.
- Work through a pull request; redeploy the server from `main` after merge.

## 9. File map

| Path                                                           | Purpose                                                             | Tracked |
| -------------------------------------------------------------- | ------------------------------------------------------------------- | ------- |
| `guide/authoring-guide.md`                                     | Binding style and accuracy guide for agents                         | yes     |
| `scripts/`                                                     | Fetch, prepare, validate, build packets, assemble, audit, summarise | yes     |
| `workflows/`                                                   | Library and chunk workflow scripts                                  | yes     |
| `libs/`                                                        | Verified rules, verb paradigms, roots                               | yes     |
| `chunks/`                                                      | Pilot drafts and new authored/reviewed chunks; status is recorded separately | yes |
| `review-status.json`                                           | Pending/approved scholarly review tied to exact inputs and assembler code | yes |
| `tests/`                                                       | Offline runner, confirmation, correction and publication-hold regressions | yes |
| `runs/`                                                        | Private CLI logs, checkpoints and blocked candidates                 | no      |
| `inventory/`                                                   | Arabic inventories with excluded signs                              | yes     |
| `meta/overrides.json`                                          | Adjudicated QAC corrections                                         | yes     |
| `meta/plan.json`, `meta/*-batches.json`                        | Chunk plan and library batches                                      | yes     |
| `meta/existing-rules.json`, `meta/style-exemplars.json`        | Inputs taken from the existing lessons                              | yes     |
| `integration/five-surahs.patch`                                | Registry, availability, 16-Surah tests and docs                     | yes     |
| `reports/`                                                     | Library/chunk reviews, exact progress and consistency adjudications  | yes     |
| `drafts/`                                                      | Held reviewer JSON and Arabic inventories; never runtime imports     | yes     |
| `build/review/quran-grammar/` (repository root)                   | Offline HTML reviewer bundle after current reviews complete         | no      |
| `sources/`, `qac/`, `packets/`, `inputs/`, other `meta/*.json` | Third-party or regenerable data                                     | no      |

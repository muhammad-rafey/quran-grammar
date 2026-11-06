# Five-Surah expansion — plan, progress and handoff

**Status (2026-11-06): all 127 chunks authored and AI-reviewed; review bundle complete; scholarly review pending.**
No new lesson is live. The app still ships Al-Fatihah and Surahs 105–114 (11 Surahs, 55 ayahs,
230 words). This folder holds the authoring and review records, deterministic tooling,
shared libraries, source inventories, adjudicated Corpus corrections, held JSON drafts
and a deferred integration patch. The patch must remain unapplied until scholarly approval.

Read this file first. Then read `guide/authoring-guide.md`, which every authoring and review agent
follows.

### Resumption status

- **All 127 chunks are authored: 419 ayahs and 4,077 words.** All five complete held JSON
  drafts exist in `drafts/`. Their final snapshots, all five source audits and the offline
  bundle are complete from the reviewed inputs; all remain outside the published app.
- **All 127 chunks passed current-input independent AI review.** Each has separate grammar
  and meaning/tafsir/Urdu reviews plus a clean final confirmation bound to current source and
  content hashes. No chunk is blocked or active. This includes the final source-type, rule
  and scoped root-note corrections. These are AI checks, not scholarly approval.
- **All nine source-type conflicts are resolved through explicit particle overrides.**
  `meta/overrides.json` now has 74 occurrence records: 65 prior tag corrections plus nine
  selected contextual-type analyses. Raw source metadata, occurrence IDs and Arabic remain
  unchanged. Recognized alternative analyses are not automatically source errors.
- **The final preparation batch is applied:** two rule-scope clarifications, Urdu agreement
  fixes in 35 lexeme and 21 root notes, and two Al-Kahf lemma consistency edits. The exact
  changes and input/output hashes are in `reports/codex-resumption-corrections.json`, backed
  by the rule, agreement, type and cross-chunk consistency reports. Earlier condition-answer
  corrections and seven Ar-Rahman lemma edits remain documented in
  `reports/codex-final-corrections.json`. These AI audits are not scholarly approval.
- Sources and packets were checked against current libraries and overrides. Arabic inventories
  and the plan preserve the original coverage. `make_batches.py` preserves the adjudicated
  `lex-extra` split on regeneration. All five cross-chunk lemma audits are recorded in
  `reports/codex-consistency-{18,23,32,36,55}.json`.
- The `ق ر أ` root-note clarification permits both recitation/recited-revelation and
  proper-name uses of Quran. `reports/codex-qara-root-adjudication.json` records the primary
  evidence and the four affected chunks: `18-c27`, `36-c01`, `36-c18`, `55-c01`. That root-only edit
  affected four chunk review fingerprints. The later global override and rule changes
  triggered a fresh all-127 pass, now complete. All five final wrappers have current release
  digests, which include every shared root file.
- The later `ن ه ر` note now distinguishes both initial hamza and nūn sukūn in أَنْهَار
  from nūn fatḥa in نَهَار. `reports/codex-nahr-root-adjudication.json` records the exact
  correction and five supplied-root chunks: `18-c17`, `18-c18`, `23-c23`, `36-c09`, `36-c10`.
  The affected chunks passed fresh reviews; all final wrappers have current release digests.
- The `ق ص ر` note now gives the full feminine plural مَقْصُورَات its مَفْعُولَات
  pattern, explicitly identifying it as a feminine sound plural of the passive participle.
  `reports/codex-qasr-root-adjudication.json` records the exact correction, isolated validation
  and affected supplied-root chunks `55-c09` and `55-c11`. Both passed fresh reviews.
- The owner explicitly approved authenticated Codex CLI processing of public reference packets
  and draft text. Approval persists; do not request it again. The runner uses the owner’s CLI
  model/settings, bounded concurrency, isolated workspaces and input/content checkpoints.
- **PR #1 is merged and deployed at `a52e1de`.** The repaired public HTTPS app and both content
  databases remain the published eleven-Surah edition: 55 ayahs and 230 words.
- The native Juz navigation bug is fixed. Private Android emulator and iPhone 17 Pro / iOS 26.5
  simulator previews verified both Juz boundary jumps, manual reading labels, same-chapter
  jumps, root/paradigm/modal return and Study/Grammar switching. The ten iOS assertions passed
  in Expo Go 57 with headless XCTest. `reports/codex-native-verification.json` records the
  evidence and retained-log limitations, including an Apple logging-quarantine fault. No
  physical phone or standalone iOS IPA was tested. Both platform bundles export.
- The offline reviewer exporter embeds the existing licensed project fonts in every HTML page
  and preserves their licenses. The completed 27-file bundle is available locally at
  [the index](../build/review/quran-grammar/index.html) and
  [the ZIP](../build/review/quran-grammar-scholarly-review.zip). Generated files are git-ignored.
- `reports/chunk-review-manifest.json` pins all 127 current reviewed chunks. All five held
  JSON drafts assembled with zero errors; the final all-chunk structural scan has zero errors
  and zero warnings. All five source audits were regenerated. Chromium verified exact Arabic
  for every one of the 4,077 words and 419 ayahs, loaded fonts, no overflow or page errors,
  and no external requests in the offline bundle.

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
     root assignments for all 230 existing word occurrences, including words with no root,
     and 228/230 existing word types (the two exceptions are an
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

### 3.1 App and infrastructure (merged baseline and continuation)

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
- The merged baseline passed `npm run verify`, browser tests and `npm run build:mobile`;
  its eleven-Surah Android APK passed emulator interactions. Continuation checks include
  private browser previews of held drafts and Android emulator/iOS simulator interactions for
  both mid-Juz starts, manual boundaries, same-chapter jumps, word details and view switching.
  The native reader’s initial Juz navigation race was found and fixed during this preview.
  Final verification passed: 220 Node tests (11 API, 12 mobile, 12 core, 185 pipeline), 46
  Python tests and 33 browser tests, with zero skips; web/API builds and both mobile exports
  also passed. Native evidence and
  the qualified iOS log check are in `reports/codex-native-verification.json`; no physical
  phone was used.

### 3.2 Content pipeline (this folder)

- Sources fetched and cross-checked: all 419 ayahs have identical word counts in Quran.com,
  QAC 0.4 and the fork.
- 154 recitation signs that the API separates from a word by a space (waqf signs, the saktah
  sign, the sajdah sign ۩ and the rub al-hizb marker ۞) are excluded from stored word tokens,
  following the Surahs 110–114 precedent. Each exclusion is listed in `inventory/inventory-N.json`.
- **74 occurrence override records** in `meta/overrides.json`: 65 prior tag corrections and
  nine selected contextual-type analyses; see §5.
- **Historical library review counts (before the later corrections listed above):**

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
  Like every authored chunk, they passed current-input reviews after the latest shared-input
  corrections. These are AI checks, not scholarly approval.
- Latest preparation: two final rule-scope clarifications, 35 lexeme-note and 21 root-note Urdu
  agreement fixes, initially eight contextual-type overrides and two Al-Kahf lemma edits.
  `reports/codex-resumption-corrections.json` records each applied change and its hashes.
  The later `ق ر أ` lexical qualification is recorded separately in
  `reports/codex-qara-root-adjudication.json`; it changes no source Arabic or occurrence IDs.
  The ninth selected type analysis, extra-particle مَا at 23:78:9, is documented in
  `reports/codex-final-type-adjudication.json`. The final prohibition-card clarification
  supplies explicit حرف as its Urdu antecedent;
  `reports/codex-prohibition-agreement-adjudication.json` records the evidence and full rule
  agreement scan. Neither changes source Arabic. The subsequent `ن ه ر` vowel-contrast
  correction and its five affected chunks are recorded in
  `reports/codex-nahr-root-adjudication.json`. The later feminine-plural pattern correction
  for `ق ص ر` and its two affected chunks are in `reports/codex-qasr-root-adjudication.json`.
- `reports/`: library/chunk reviews, source adjudications and all five cross-chunk lemma audits.
  These reports describe their own snapshots; only exact current review hashes count for export.

### 3.3 Operations (outside the repository)

- Rollback backup of the live container (commit `3df065c`, image
  `sha256:a3a3a9ad…`): `~/Backups/quran-grammar-homeserver/2026-11-06/` on the owner's Mac
  (image tarball, deployment config, manifest, SHA-256 sums).
- Home-server Supabase: schema `quran_grammar` created and loaded with the current 11 Surahs;
  read back and verified identical (content SHA-256 `1e9bca62…219f`). Not reachable through the
  Supabase REST API (`anon`, `authenticated` and `service_role` have no access).
- Local SQLite copy built at `build/db/quran-grammar.sqlite` (git-ignored).

## 4. What is left (in order)

The AI-reviewed edition, source audits, current manifest and offline review bundle are complete.
Open [the local index](../build/review/quran-grammar/index.html) or share
[the ZIP](../build/review/quran-grammar-scholarly-review.zip) with a qualified scholarly reviewer.
The ZIP is 6,153,696 bytes; SHA-256:
`4c203d25e1eaa32e641c1fc98ea010acb3a6f4d9684ac48e543bbb2366924d68`.
Its persistent English/Urdu banner identifies every page as an AI draft awaiting scholarly review.

1. **Obtain qualified scholarly review of all five Surahs.** All five records in
   `review-status.json` remain pending. Review the Urdu meanings, contextual syntax,
   dictionary and root notes, paradigms, grammar cards, phrases and tafsir summaries.
   Record actual reviewer identity, date, evidence and the exact reviewed content-input digest.
   AI reviews and automated checks cannot grant this approval.
2. **Apply reviewer corrections and regenerate the review edition if needed.** Preserve exact
   Arabic and occurrence IDs. Obtain current independent AI reviews for affected chunks,
   export the manifest, regenerate held drafts/audits/bundle and repeat relevant checks. The
   reproducibility commands are in §6. Any changed digest requires corresponding scholarly
   approval of the revised content. Do not manually promote held or stale checkpoints.
3. **Only after recorded approval:** use gated `assemble.py --write`, check/apply the deferred
   integration patch, verify the sixteen-Surah app on web/native, sync the databases, merge
   and deploy from main. Until then, databases and runtime registry stay at eleven Surahs.
   PR #1 is already merged/deployed; app fixes can ship independently of held content.
   Physical-phone and standalone iOS IPA tests remain separate outstanding coverage; Android
   emulator and iOS simulator interaction checks already passed for the private held preview.

## 5. Issues and hurdles (read before resuming)

- **QAC 0.4 has occurrence-level tag errors and contextual-analysis disagreements.**
  `meta/overrides.json` has 74 evidence-bearing records: 65 prior tag corrections plus nine
  selected contextual-type analyses. Prior tag corrections include verb mood (e.g. يُوحَىٰ 18:110,
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
  follow the vocalised word and log any further discrepancy in `auditNotes`. The nine particle
  overrides document the chosen contextual reading (for example, مصدرية rather than relative ما),
  not a claim that every alternate analysis is impossible. `reports/codex-type-adjudication.json`
  and `reports/codex-resumption-corrections.json` preserve the initial eight decisions and
  applied changes. `reports/codex-final-type-adjudication.json` records the ninth at 23:78:9.
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

All 127 current-input AI reviews and clean confirmations are complete. The commands below
preserve reproducibility and support future reviewer corrections; do not repeat authoring
unless inputs or content change. Existing sources, chunks and packets are prepared, and all final
review artifacts are complete. Public-reference processing is already authorized.

```sh
cd content-pipeline
python3 -I scripts/fetch_sources.py .   # Quran.com + QAC pages, about 10 minutes, rate-limited
python3 -I scripts/fetch_qac.py .       # QAC 0.4 (SHA-256 checked) + mustafa0x fork
python3 -I scripts/prepare.py . .       # words/ayahs metadata, plan, inventories
python3 -I scripts/make_batches.py .    # library batch inputs (libraries already exist)
python3 -I scripts/check_verbs.py .     # optional: heuristic QAC mood/voice flags
python3 -I scripts/build_packets.py .   # one source packet per chunk, with corrections
# Local Codex CLI for future corrections (processing is already authorized):
node scripts/run_chunks.mjs --chunks 18-c02,18-c03 --dry-run
node scripts/run_chunks.mjs --chunks 18-c02,18-c03 --concurrency 3 --chunk-concurrency 3 --resume --reuse-authored
# Or Workflow tool: workflows/chunks.js with {"chunks": [...], "work": "<abs path>"}
python3 -I scripts/assemble.py . ..          # report only
# After all affected chunks pass current AI reviews, export their public summaries:
node scripts/export_reviews.mjs
python3 -I scripts/assemble.py . .. --draft  # reviewer artifacts outside the live app
python3 -I scripts/gen_audit.py . .. reports/chunk-results.json
python3 -I scripts/review_bundle.py . --output "$PWD/../build/review/quran-grammar"
# Only after actual scholarly review is recorded for every selected Surah:
python3 -I scripts/release_gate.py . --surah 18 23 32 36 55 --digest
python3 -I scripts/assemble.py . .. --write  # gated lesson modules + inventories
cd .. && git apply content-pipeline/integration/five-surahs.patch
npm run verify && npm run test:e2e && npm run build:mobile
npm run db:sqlite && QG_PSQL='…' npm run db:sync
```

If a future correction requires a complete fresh review pass, run from the repository root:

```sh
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
match; concurrent invocations cannot share a run directory. `meta/overrides.json` has a whole-file
fingerprint, so any override edit requires fresh reviews of all 127 chunks under the current
policy; this triggered the conservative rerun after the ninth selected type analysis. Library
fingerprints cover all supplied rules, while root/paradigm fingerprints cover only the specific
entries supplied to each packet. The optional
`--reuse-authored` flag preserves a structurally valid draft as authored text, with explicit
provenance, but requires both independent reviews and a clean confirmation against current inputs. The runner never applies the
integration patch, updates a database or deploys. From the repository root,
`npm run test:content-pipeline` runs offline regressions; these also run in `npm run verify`
and CI without the ignored source downloads.

## 7. Home-server deployment (merged baseline; future redeploys)

The Quran Grammar IP-route repair was completed on 2026-11-06 and its public HTTPS deployment
verified. PR #1 was merged and deployed at `a52e1de`; the live app/databases still serve
11 Surahs, 55 ayahs and 230 words. Deploy merged `main` only; check the server's
`git rev-parse HEAD` before a future redeploy. Timestamped `.before-ip-change-*` files preserve the route-repair
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
| `meta/overrides.json`                                          | 74 evidence-bearing tag/contextual-analysis overrides                                         | yes     |
| `meta/plan.json`, `meta/*-batches.json`                        | Chunk plan and library batches                                      | yes     |
| `meta/existing-rules.json`, `meta/style-exemplars.json`        | Inputs taken from the existing lessons                              | yes     |
| `integration/five-surahs.patch`                                | Registry, availability, 16-Surah tests and docs                     | yes     |
| `reports/`                                                     | Library/chunk reviews, exact progress and consistency adjudications  | yes     |
| `drafts/`                                                      | Held reviewer JSON and Arabic inventories; never runtime imports     | yes     |
| `build/review/quran-grammar/` (repository root)                   | Completed offline HTML reviewer bundle         | no      |
| `sources/`, `qac/`, `packets/`, `inputs/`, other `meta/*.json` | Third-party or regenerable data                                     | no      |

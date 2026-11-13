# Edition 2 — Surahs 4, 7, 25, 29 and 85–104: plan, progress and handoff

**Status (2026-11-13): the owner authorized publishing all 24 Surahs as labeled drafts.**
All 312 chunks passed mechanical validation, and all 807 ayahs and 10,098 words assembled
into the pinned draft snapshots. Independent grammar and meaning review remains in progress,
and scholarly review is pending. See `reports/resumption-status.json` for the per-chunk validation snapshot
and `reports/codex-*-adjudication.json` for the source checks and corrections from this pass.

To review the assembled lessons locally, run `python3 -I content-pipeline/scripts/assemble.py content-pipeline/edition-2 . --draft`
from the repository root after rebuilding the ignored inputs in §5. The generated lessons and
inventories appear in `drafts/`. The status counts in §3 describe the original handoff.
Read `../README.md` and `../guide/authoring-guide.md` for the shared workflow and source conventions.

## 1. Goal (owner request, 2026-11-13)

Give the app full grammar analysis and translation, in the existing lesson format, for:

- **The last 30 Surahs.** 105–114 already existed, so this edition adds **85–104** (20 Surahs).
- **An-Nisa (4), Al-A‘raf (7), Al-Furqan (25) and Al-‘Ankabut (29).** As-Sajdah (32) was also
  requested but is already published, so it is skipped.

The owner asked for maximum parallelism with subagents, then (same day) for both content databases
(local SQLite and the home-server Supabase schema `quran_grammar`) to be populated once the content
is ready. The deployment notes are in `../README.md` §7. The Mac's existing SSH key reaches the
server; never store a password.

| Surahs              | Ayahs |  Words | Chunks |
| ------------------- | ----: | -----: | -----: |
| 4 An-Nisa           |   176 |  3,747 |    113 |
| 7 Al-A‘raf          |   206 |  3,320 |    105 |
| 25 Al-Furqan        |    77 |    893 |     28 |
| 29 Al-‘Ankabut      |    69 |    976 |     30 |
| 85–104 (20 Surahs)  |   279 |  1,162 |     36 |
| **Total**           | **807** | **10,098** | **312** |

Counts come from `meta/plan.json` and the Arabic inventories (`inventory/inventory-N.json`). The
app before this release shipped Al-Fatihah, 18, 23, 32, 36, 55 and 105–114 (16 Surahs, 474 ayahs, 4,307 words).
With this edition the combined registry contains 40 Surahs, 1,281 ayahs and 14,405 words.

## 2. How this edition is organised

This is a **second pipeline work directory**, so the first edition's pinned review provenance
(`../reports/chunk-review-manifest.json`, `../draft-publication.json` hashes) is untouched.

- `edition.json` declares the Surahs. `../scripts/edition.py` reads it. Without an
  `edition.json` (the original `content-pipeline/`), every script keeps its five-Surah defaults, so all
  185 Node and 46 Python pipeline tests still pass.
- `scripts`, `guide`, `workflows` and `qac` are symlinks to the shared folders. `sources/`, `packets/`, `inputs/`,
  `runs/`, the adjudication inputs and the bulk `meta/` files (`words`, `ayahs`, `lexemes`, `roots`,
  `tag-inventory`, `verb-flags`, `case-flags`) are git-ignored, as before, because they contain
  third-party text. Regenerate them before resuming (§5). Tracked: `edition.json`, `meta/plan.json`,
  `meta/overrides.json`, the batch maps, `libs/`, `chunks/`, `inventory/`, `review-status.json` and
  `reports/`.
- Generalised scripts: `fetch_sources.py` (`QG_FETCH_ONLY`, `QG_FETCH_SKIP_GRAMMAR` for parallel
  fetchers), `prepare.py`, `build_packets.py` (now also applies an `aspect` override), `assemble.py`,
  `release_gate.py`, `gen_audit.py`, and `make_batches.py` (`--missing-only`, `--tag`, `QG_LEX_BATCH`,
  `QG_ROOT_BATCH`; staged batch maps merge). `QG_EDITION_ONLY` restricts a run to some Surahs.
- New scripts: `seed_libs.py` copies already-reviewed library entries verbatim from the first
  edition, and `check_cases.py` is a heuristic noun-case screen with 36/43 recall on the first edition's case corrections.
- `../workflows/libraries.js` takes `args.surahLabel`. `../workflows/chunks-reuse.js` is a copy of
  `chunks.js` that can skip authoring for already-validated drafts (`args.reuseAuthored`). `chunks.js`
  itself must stay byte-identical because the first edition's manifest pins it.
- `../../scripts/publish-draft-lessons.ts` accepts an optional `work` field per authorization entry
  (e.g. `"work": "content-pipeline/edition-2"`). Entries without it reproduce the existing lessons
  byte for byte.
- `review-status.json`: every Surah is `pending`.

## 3. Original handoff

1. **Sources** (retrieved 2026-11-13): Quran.com verses, translations and three tafsirs, and QAC grammar and
   word-by-word pages for all 807 ayahs. A final gap-filling pass confirmed complete coverage.
   `prepare.py` reported zero problems (every word matched QAC 0.4).
2. **Libraries: complete and double-reviewed.**
   - 225 verb paradigms and 433 roots were reused verbatim from the reviewed first-edition libraries
     (`libs/*/lex-00.json`, `root-00.json`; provenance and source hashes in
     `reports/seeded-libraries.json`).
   - 430 new paradigms (`lex-a01…a14`, `lex-b01…b31`, `lex-xextra`) and 381 new roots
     (`root-a01…a12`, `root-b01…b16`) were authored in batches of about 10 and 14, using the existing
     author → two independent reviewers → fixer → confirming reviewer → second fixer procedure:
     411 agents, no errors. All files pass `validate_lib.py`, and every verb and root in the
     10,098 words is covered.
   - The rule library is the first edition's 112 rules, copied unchanged (`libs/rules.json`).
3. **QAC tag corrections:** `meta/overrides.json` has **44 records**.
   - `check_verbs.py` and `check_cases.py` flagged 207 occurrences. Ten parallel adjudicators accepted
     27 corrections and rejected 180 false positives with reasons (`reports/adjudication/`). Examples:
     subjunctive تَعُولُوا۟ 4:3, Form IV أَرَىٰكَ 4:105 (perfect, not 1st-person imperfect), first person
     لَـَٔاتِيَنَّهُم 7:17, annexed vocative يَـٰعِبَادِىَ 29:56.
   - Two Form V تَجَلَّىٰ records (7:143, 92:2) were added from a library-review finding.
   - 14 verb-form records follow the reviewed paradigms (`reports/adjudication/form-mismatches.json`),
     for example quadriliteral زُلْزِلَتِ / بُعْثِرَ / وَسْوَسَ / دَمْدَمَ, Form II دَسَّىٰهَا, and Form III
     لَـٰمَسْتُمُ in Hafs.
   - One record, 4:171:4 لَا تَغْلُوا۟ (`png` 2MP rather than QAC's dual), was written directly into
     `meta/overrides.json` by a library-stage agent instead of being escalated. Its analysis is
     correct: it addresses أَهْلَ ٱلْكِتَـٰبِ, and the unpronounced alif is alif al-fāriqa. It is kept but
     should be confirmed during adjudication. Total: 27 + 2 + 14 + 1 = 44.
   - Four new paradigm keys created by the corrections were authored in `lex-xextra`. The old keys
     `tusaw~aY|I|PASS` and `talaZ~aY|I|ACT` remain as unused duplicates.
4. **Packets:** all 312 were built with absolute paths. Six Stage A packets were rebuilt after the form overrides.
5. **Chunk authoring and review: in progress.** Snapshot in `reports/progress.json`:

   | Status | Chunks |
   | ------ | -----: |
   | AI-reviewed with clean confirmation (`4-c63`, `7-c86`, `25-c01`, `25-c02`, `25-c04`, `25-c12`) | 6 |
   | Authored and validated, reviews started but unfinished | 50 |
   | Authored and validated, not yet reviewed | 71 |
   | File exists but fails validation (partial author run) | 8 |
   | Not started | 177 |

   Reviewers had raised 88 shared-library findings (per chunk in `progress.json`, field
   `libraryIssues`). They still need adjudication; the workflow marks such chunks blocked until then.

**Why it stopped:** 26 chunk workflows of 12 chunks each ran in parallel (the runtime caps one
workflow at 12 concurrent agents). The account usage limit was then reached and every in-flight
agent failed. After the reset, the owner asked to pause and record progress. Workflow caches only
resume inside the same session, so the next session cannot use them. Use `reports/resume-args.json`
instead.

## 4. Review and release workflow

1. **Finish independent chunk review.**
   - All 312 drafts are available to review. Select chunk IDs from `meta/plan.json` and
     skip only checkpoints whose source and lesson hashes still match. The lists in
     `reports/resume-args.json` describe the original handoff.
   - Split them into groups of 12, one workflow each, for maximum parallelism, but expect the
     account usage limit. A chunk costs about 6–8 agents.
   - Re-validate every `reuseAuthored` file first: drop any that no longer pass, and let partial or invalid files go through the
     author-retry path.
   - From the repository root, run `node content-pipeline/scripts/run_chunks.mjs --work content-pipeline/edition-2 --chunks CHUNK_IDS --resume --reuse-authored`
     with comma-separated chunk IDs. Add `--author-only` to save validated drafts for a later
     independent review run. The review pass uses fresh grammar and meaning reviewers plus final
     confirmation. Use separate run directories for simultaneous, disjoint batches. Do not run
     overlapping batches on the same chunk.
2. **Adjudicate shared-library findings** from the chunk reviews. If a library entry changes, rebuild the packets of the
   chunks that use it and re-review the affected chunks.
3. **Assemble drafts:** `python3 -I scripts/assemble.py "$PWD" ../.. --draft`. The expected
   `words` counts in `edition.json` have been verified against the plan and the Arabic inventories.
   Then run `gen_audit.py` (writes `docs/source-audits/surah-N.md`).
4. **Reproduce the labeled drafts.** The owner authorized Edition 2 publication on
   2026-11-13. The release adds entries with `"work": "content-pipeline/edition-2"` and the
   wrapper/study hashes to `../draft-publication.json`, then run `npm run publish:drafts`. Then update
   `packages/core/src/registry.ts`, `availability.ts` and `publication.ts` (draft list), the core and
   API tests (counts, juz previews 4–6, 8–9, 18–21, 30), the docs and the source-audit inventories.
5. **Verify:** `npm run verify`, `npm run test:e2e`, `npm run build:mobile`. Check mobile bundle
   size: about 10k more words is roughly 2.5× the first expansion.
6. **Databases:** run `npm run db:sqlite`, then
   `QG_PSQL='ssh me@659.duckdns.org docker exec -i supabase-db psql -U postgres -d postgres' npm run db:sync`
   and `npm run db:verify`. The owner requested both on 2026-11-13. Use only schema `quran_grammar`, never
   QuranAcademy.
7. Merge the PR, then redeploy the home server from `main` (`../README.md` §7).

## 5. Reproduce the ignored source layer

```sh
cd content-pipeline/edition-2
python3 -I scripts/fetch_sources.py .          # optionally in parallel: QG_FETCH_ONLY=4 … (idempotent; rerun once at the end)
python3 -I scripts/prepare.py . .              # words/ayahs/plan/lexemes/roots + inventories
python3 -I scripts/check_verbs.py . && python3 -I scripts/check_cases.py .   # screens (already adjudicated)
python3 -I scripts/build_packets.py "$PWD"     # absolute paths; libraries are already complete
```

Do not rerun `seed_libs.py` or `make_batches.py`: the libraries are complete. Rerunning
`make_batches.py` without `--tag` rewrites the batch maps that `validate_lib.py` uses.

## 6. Key decisions and pitfalls (read before changing anything)

- **Separate work directory, not an extension of the five-Surah folder.** Adding Surahs to
  `content-pipeline/` would have rewritten its `meta/overrides.json`, `libs/rules.json` and
  `plan.json`. That invalidates the pinned review fingerprints of all 127 published-draft chunks
  and fails `draft-inventory.test.mjs`. For the same reason the guide and `chunks.js` must not be
  edited: the first edition's manifest pins their bytes.
- **Library reuse:** entries are keyed by Corpus lexeme key / root, so first-edition entries were
  copied verbatim (`seed_libs.py`). Their notes mention the derived words of the first five Surahs;
  that is acceptable lexical information, but a reviewer may suggest broadening a note.
- **Batch sizes 10 (paradigms) / 14 (roots)** instead of 30/45, to run more agents in parallel.
  Staged batches (`a`, `b`, `x`) let library work start for Stage A (Al-Furqan and 85–104) while the long Surahs were
  still being fetched. `make_batches.py --tag` merges batch maps and excludes keys already assigned
  to another stage.
- **Override fields:** the first edition's fields plus `aspect` (`PERF`/`IMPF`), used where QAC
  tags a perfect verb as imperfect (4:105:10, 7:189:13, 7:190:2, 7:190:8). `build_packets.py`
  applies it. A voice or form correction must carry the corrected `lexemeKey`, and that key needs a
  paradigm entry (see `lex-xextra`).
- **Library fixers do not edit `meta/overrides.json`.** They escalate; the orchestrator adjudicates.
  The three escalations (4:64:6 passive of Form IV أَطَاعَ, 4:103:11 the
  ط م ن verb as QIV rather than QAC's XII, 92:2:3 / 7:143:25 تَجَلَّىٰ as Form V) are resolved through the 14 + 2 verb-form records.
- **Workflow runtime limits:** at most 12 concurrent agents per workflow, so run many 12-chunk
  workflows to parallelise. Workflow caches (`resumeFromRunId`) work only within the session that
  created them. The account usage limit stops every in-flight agent at once; partial chunk files
  can be left behind, which the author-retry path repairs.
- **Cost reference:** libraries took 411 agents (about 32M subagent tokens). One chunk takes
  author + 2 reviewers + fixer + 1–3 confirmations (+ fixes), about 6–8 agents. All 312 chunks are
  roughly 2,000 agents.
- **Publication:** the 2026-11-07 owner authorization covers Surahs 18, 23, 32, 36 and 55.
  The 2026-11-13 authorization covers all 24 Edition 2 Surahs. Both decisions are recorded in
  `../draft-publication.json`. Scholarly review remains pending in `review-status.json`.
- **Mobile size:** the native app bundles every lesson. About 10k more words is roughly 20 MB of
  lesson source, so check `npm run build:mobile` and a real device after integration.
- **QuranAcademy is a separate project and database; never touch it.**

## 7. File map (edition-2)

| Path | Purpose |
| ---- | ------- |
| `edition.json` | Surah list, names (English/Arabic/Urdu), slugs; `words` filled at assembly time |
| `meta/plan.json` | 312 chunks of whole ayahs, about 30 words each |
| `meta/overrides.json` | 44 adjudicated occurrence corrections |
| `meta/lexeme-batches.json`, `meta/root-batches.json` | Library batch maps (`a`, `b`, `x` stages) |
| `libs/` | Rules (copy), seeded paradigms/roots (`*-00`), new reviewed batches |
| `chunks/<surah>/<chunk>.json` | Authored lesson chunks (see `reports/progress.json` for status) |
| `inventory/` | Exact Arabic word inventories with excluded pause signs |
| `reports/progress.json` | Per-chunk status, completed stages and raised library issues |
| `reports/resume-args.json` | `remainingChunks` and `reuseAuthored` for `workflows/chunks-reuse.js` |
| `reports/.chunk-groups.json` | The 26 groups of 12 used for parallel workflows |
| `reports/adjudication/` | Tag-flag results, rejections with reasons, form mismatches |
| `reports/seeded-libraries.json` | Provenance of reused library entries |
| `review-status.json` | Scholarly review: all pending |

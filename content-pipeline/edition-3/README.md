# Edition 3 — Al-Hajj and Al-Waqi‘ah: plan, status and handoff

**Status (2026-11-15): published by owner authorization; scholarly review pending.**
All 53 chunks are authored and pass mechanical validation. Both Surahs assembled into
pinned draft snapshots with zero errors and zero warnings (`reports/assembly-report.json`).
They are integrated in the shared registry, and `npm run publish:drafts` reproduces
`packages/core/src/lessons/surah-22.ts` and `surah-56.ts` byte for byte.
Independent AI review follows the Edition 2 release pattern: source-checked corrections are recorded
in `reports/review-adjudication.json`, and every chunk remains `authored-review-pending` in
`reports/authoring-status.json`. `review-status.json` keeps both Surahs pending. Do not
describe these lessons as scholar-approved.

Read `../README.md` and `../guide/authoring-guide.md` for the shared workflow and source
conventions, and `../edition-2/README.md` for the multi-edition tooling this folder reuses.

## 1. Goal (owner request, 2026-11-13)

Add complete Urdu study lessons for **Al-Hajj (22)** and **Al-Waqi‘ah (56)** in the existing
lesson format. Every word occurrence has a contextual meaning, word type, lemma, morphology,
syntax and dictionary note, segments and rule references. Every verb has a paradigm card.
Each ayah has phrases, a translation, a theme and a concise tafsir. The owner also asked to
keep the web, mobile, SQLite and home-server Supabase copies synchronized.

| Surah            | Ayahs |    Words | Chunks | Juz                       |
| ---------------- | ----: | -------: | -----: | ------------------------- |
| 22 Al-Hajj       |    78 |    1,274 |     41 | 17 (whole Surah)          |
| 56 Al-Waqi‘ah    |    96 |      379 |     12 | 27 (with Ar-Rahman)       |
| **Total**        | **174** | **1,653** | **53** |                         |

Counts come from `meta/plan.json` and the Arabic inventories (`inventory/inventory-N.json`).
With this edition the registry contains 42 Surahs, 1,455 ayahs and 16,058 words.
Juz 17 (Al-Hajj only) and Juz 27 (Ar-Rahman and Al-Waqi‘ah) are partial previews.

## 2. How this edition is organised

This is a third pipeline work directory, so the pinned provenance of `../` (first edition) and
`../edition-2/` is untouched.

- `edition.json` declares the two Surahs, their names and verified word counts.
  `../scripts/edition.py` reads it.
- `scripts`, `guide` and `workflows` are symlinks to the shared folders. As in Edition 2,
  `sources/`, `packets/`, `inputs/`, `runs/`, `qac/` and the bulk `meta/` files are git-ignored
  because they contain third-party text. Regenerate them before resuming (§4).
- **Libraries.** 132 verb paradigms and 321 roots were copied verbatim from the reviewed
  Edition 2 libraries (`libs/lexemes/lex-00.json`, `libs/roots/root-00.json`; source files and
  SHA-256 values in `reports/seeded-libraries.json`). New entries cover 65 verb lookup keys
  (`lex-new01…08`, `lex-supplement`) and 79 root families (`root-new01…07`). The rule library
  is the shared rule set (`libs/rules.json`).
- **Occurrence overrides.** `meta/overrides.json` has 7 records where the vocalized text or
  syntax differs from the raw Corpus tags; each record carries its evidence, and
  `reports/occurrence-adjudication.json` keeps the adjudication. Examples: the quadriliteral
  اِفْعَلَلَّ pattern at 22:11:11, the accusative object before the first-person yāʾ at
  22:26:12, the jussive protasis at 22:42:2 and the active مِتْنَا at 56:47:4.
- **Review corrections.** `reports/review-adjudication.json` lists the 18 source-checked
  corrections to roots, paradigm notes, rules and individual occurrences applied after authoring.
- `drafts/` holds the assembled wrappers and inventories. `docs/source-audits/surah-22.md`,
  `surah-56.md` and their inventories are the public source audits.

## 3. Release workflow (as performed)

1. Assemble: `python3 -I content-pipeline/scripts/assemble.py "$PWD/content-pipeline/edition-3" "$PWD" --draft`.
2. Generate the source audits with `gen_audit.py`.
3. Add entries with `"work": "content-pipeline/edition-3"` and the wrapper/study hashes to
   `../draft-publication.json`, plus an `additionalAuthorizations` record, then run
   `npm run publish:drafts`.
4. Update `packages/core/src/registry.ts`, `availability.ts`, the core, API and browser tests
   (counts and the Juz 17/27 previews), and the documentation.
5. Verify: `npm run verify`, `npm run test:e2e`, `npm run build:mobile` and a native check.
6. Databases: `npm run db:sqlite`, then
   `QG_PSQL='ssh <server> docker exec -i supabase-db psql -U postgres -d postgres' npm run db:sync`
   and `npm run db:verify`. Use only schema `quran_grammar`.
7. Merge, then redeploy the home server from `main` (`../README.md` §7).

## 4. Reproduce the ignored source layer

Run from the repository root with the local QAC files in `content-pipeline/qac/`:

```sh
work="$PWD/content-pipeline/edition-3"
python3 -I content-pipeline/scripts/fetch_sources.py "$work"
python3 -I content-pipeline/scripts/prepare.py "$work" "$work"
python3 -I content-pipeline/scripts/build_packets.py "$work"
python3 -I content-pipeline/scripts/assemble.py "$work" "$PWD" --draft
```

Do not rerun `seed_libs.py` or `make_batches.py`: the libraries are complete, and rerunning the
batch maker without `--tag` rewrites the batch maps that `validate_lib.py` uses.

## 5. Key decisions and pitfalls

- **Separate work directory.** Adding these Surahs to `../` or `../edition-2/` would rewrite their
  overrides, plans and pinned review fingerprints. Keep shared scripts backward compatible.
- **Library reuse** is keyed by Corpus lexeme key and root, so seeded entries are byte-identical
  copies of Edition 2. Their notes may mention derived words from earlier Surahs.
- **Overrides can change lookup keys.** A voice or form correction carries the corrected
  `lexemeKey`, which needs a paradigm entry (22:44:3 uses the passive Form II key; 56:47:4 uses
  `mata-yamatu|I|ACT`).
- **Publication** is owner-authorized (`../draft-publication.json`, 2026-11-13). It is not
  scholarly approval; `review-status.json` stays pending until a named reviewer records evidence
  and the exact content digest.
- **QuranAcademy is a separate project and database; never touch it.**

## 6. File map

| Path | Purpose |
| ---- | ------- |
| `edition.json` | Surah list, names (English/Arabic/Urdu), slugs and word counts |
| `meta/plan.json` | 53 chunks of whole ayahs |
| `meta/overrides.json` | 7 adjudicated occurrence corrections |
| `meta/lexeme-batches.json`, `meta/root-batches.json` | Library batch maps |
| `libs/` | Seeded (`*-00`) and new paradigm/root entries, shared rules |
| `chunks/<surah>/<chunk>.json` | Authored lesson chunks |
| `inventory/`, `drafts/inventory-*.json` | Exact Arabic word inventories with excluded pause signs |
| `drafts/surah-*.json` | Assembled wrappers pinned by `../draft-publication.json` |
| `reports/authoring-status.json` | Per-chunk status and content hashes |
| `reports/assembly-report.json` | Assembly counts, warnings and errors |
| `reports/occurrence-adjudication.json` | Evidence for the occurrence overrides |
| `reports/review-adjudication.json` | Source-checked corrections after authoring |
| `reports/seeded-libraries.json` | Provenance of reused library entries |
| `review-status.json` | Scholarly review: both pending |

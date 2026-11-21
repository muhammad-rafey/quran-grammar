# Full Quran — source-first grammar and word-by-word pipeline

**Status (2026-11-22): pilot — Al-Baqarah 2:1–20 (230 words) built for owner verification.**
Scholarly review pending. Not yet synced to the home-server Supabase.

## 1. Goal (owner request, 2026-11-21/22)

Populate the app with grammar and word-by-word meaning for the whole Quran. The owner set the
content policy:

- **No ayah translation, theme or tafsir, and no phrase cards.** These ayah fields are empty strings;
  the apps hide them.
- **Quranic text is Quran.com's `text_uthmani`, unchanged** (owner decision 2026-11-22: use the
  ready-made published text, as all existing lessons do; do not construct the text).
- Everything that a source provides comes from the source; **only the remaining fields are AI-written**.

The pilot verifies the approach on 2:1–20 before scaling.

## 2. Where each field comes from

| Field | Source | AI? |
| ----- | ------ | --- |
| `arabic`, word ids | Quran.com API v4 `text_uthmani` (end-of-ayah markers and space-separated pause signs excluded, as in all lessons). Each word's letters are cross-checked against the Quranic Arabic Corpus 0.4; the build fails on any letter difference. | no |
| `meaningUrdu` | Quran.com API v4 word-by-word Urdu (`language=ur`), whitespace-normalised only | no |
| `pos`, `root`, `lemma` | Corpus tags via the shared `../scripts/qac.py` mapping (verb lemma = paradigm past form) | no |
| `segments[].arabic`, `segments[].roleUrdu` | Corpus segmentation; roles from a fixed Urdu term table | no |
| `posUrdu`, `morphologyUrdu` | Corpus features rendered with fixed Urdu terminology (`scripts/build.py`) | no |
| `syntaxUrdu` | The Corpus's Arabic i‘rab for the word (corpus.quran.com word-by-word pages), verbatim | no |
| `ruleIds` (tag-based) | Deterministic Corpus-tag → rule-library mapping (case, tense, mood, voice, particles…) | no |
| `ruleIds` (syntax-based additions) | `words/<surah>/*.json` → `addRuleIds`, checked against `../libs/rules.json` | yes |
| `segments[].meaningUrdu`, `dictionaryUrdu` | `words/<surah>/*.json` | yes |
| Root cards | Published libraries (`../libs`, `../edition-2/libs`, `../edition-3/libs`); new roots in `libs/roots/` | reused / yes |
| Verb paradigm cards | Published libraries; new lexeme keys in `libs/lexemes/` | reused / yes |
| Rule cards | Shared rule library `../libs/rules.json` | reused |

Pilot numbers (2:1–20): 230 words; 77 of 83 roots and 34 of 39 verb lexemes reused from the
published libraries; 6 roots and 5 paradigms newly written; 34 words where Quran.com's spelling
spells marks differently from the Corpus (tatweel before dagger alif, small-meem tanwīn marks ۭ/ۢ,
ـٔ vs ء); the letters agree in all 230, and the differences are listed in `inventory/inventory-2.json`.

## 3. Commands

From the repository root (`npm ci` and the QAC file in `content-pipeline/qac/` first):

```sh
work=content-pipeline/full-quran
python3 -I $work/scripts/fetch.py $work            # sources/ for every range in scope.json (git-ignored)
python3 -I $work/scripts/build.py $work packets    # deterministic layer + AI packets in packets/ (git-ignored)
# AI step: write words/<surah>/*.json and any missing libs/roots, libs/lexemes entries
python3 -I $work/scripts/build.py $work check      # validates AI layer, libraries, alignment, text
python3 -I $work/scripts/build.py $work assemble .  # writes packages/core/src/lessons/surah-N.ts
```

Then register the lesson (`packages/core/src/registry.ts`, `availability.ts`), run `npm run verify`,
`npm run test:e2e`, `npm run db:sqlite`, `npm run db:mobile`, and — with owner permission —
`npm run db:sync`.

## 4. Scaling to the whole Quran

`scope.json` lists ayah ranges; extend `toAyah` or add chapters. A partially built chapter is
published with the ayahs built so far (`surah.ayahCount` = ayahs present). The AI step is
per-chunk and per-library-entry, so it parallelises: library entries are written once per root /
lexeme key, and word entries need only segment glosses, a dictionary note and syntax rules.

## 5. Pitfalls

- Corpus lemma ids are sometimes inflected forms (`yuxa`diEu`, `rabiHat`): lexeme keys are opaque
  handles; the word's displayed verb lemma comes from the paradigm's `past`.
- Corpus case tags can be wrong (see `../meta/overrides.json`). The pilot screen found no conflict in
  2:1–20 (seven flags were sound plurals ending in نَ, i.e. false positives). Larger ranges need the
  `../scripts/check_cases.py` screen and adjudicated overrides.
- Quran.com's Urdu word-by-word does not name its translator in the API; provenance is the API URL
  and retrieval date in `inventory/`.
- QuranAcademy is a separate project and database; never touch it.

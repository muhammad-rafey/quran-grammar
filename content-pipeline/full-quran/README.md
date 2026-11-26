# Full Quran — source-only grammar, word-by-word and translation pipeline

**Status (2026-11-26): all 114 Surahs (6,236 ayahs, 77,429 words) are built from sources only.**
Scholarly review pending; never describe this content as scholarly approved. Syncing the
home-server Supabase copy still needs the owner's permission.

## 1. Goal and content policy (owner decisions)

The app's focus is helping users understand the Quran and its grammar. On 2026-11-26 the owner
decided, superseding the 2026-11-22 pilot rules ("no ayah translation", AI-written gap fields):

- **The whole Quran is populated from sources only. Newly built chapters contain no AI-written data.**
  Fields no source provides are empty strings, and the web and mobile apps hide them.
- **Quranic text is Quran.com's `text_uthmani`, unchanged** (decision of 2026-11-22, still in force:
  use the ready-made published text; do not construct it).
- **Ayah translations are compulsory, tafsir is excluded.** Six Quran.com Urdu translations are
  offered through a Settings switcher (§3). No tafsir, theme or commentary is shown.
- The 43 previously published lessons keep their published grammar layer (§4); their word
  meanings come from Quran.com, and their AI ayah translation, theme and tafsir were deleted.

## 2. Where each field comes from

| Field | Source |
| ----- | ------ |
| `arabic`, word ids | Quran.com API v4 `/verses/by_chapter` `text_uthmani` (end-of-ayah markers and space-separated pause signs excluded, as in all lessons). Each word's letters are cross-checked against the Quranic Arabic Corpus 0.4; the build fails on any letter difference. Mark-only spelling differences are listed in `inventory/inventory-N.json`. |
| `meaningUrdu` | Quran.com API v4 word-by-word Urdu (`language=ur`), whitespace-normalised only. The Corpus has only English word-by-word glosses. |
| `pos`, `root`, `lemma` | Corpus 0.4 tags via the shared `../scripts/qac.py` mapping |
| `segments[].arabic`, `segments[].roleUrdu` | Corpus segmentation; roles from a fixed Urdu term table |
| `posUrdu`, `morphologyUrdu` | Corpus features rendered with fixed Urdu terminology (`scripts/build.py`) |
| `syntaxUrdu` | The Corpus's own Arabic i‘rab for the word (corpus.quran.com word-by-word pages), verbatim |
| `ruleIds`, verb form (باب) and pattern | Deterministic Corpus-tag mappings (fixed tables in `scripts/build.py`) |
| Rule cards (title, explanation) | Shared rule library `../libs/rules.json`; the example line is the word and its Quran.com meaning |
| `ayahs[].translations` | Six Quran.com Urdu translations (§3) |
| `segments[].meaningUrdu`, `dictionaryUrdu`, root `meaningUrdu`/`noteUrdu`, verb `present`/`noteUrdu` | No source: empty strings in source-only words; the apps hide them |

## 3. Ayah translations

`scope.json` → `translations` lists them in display order; the first is the default. The same
catalog is `translationEditions` in `packages/core/src/translations.ts`.

| Order | Id | Quran.com resource | Translator |
| ----- | -- | ------------------ | ---------- |
| 1 (default) | `jalandhari` | 234 | Fateh Muhammad Jalandhari |
| 2 | `junagarhi` | 54 | Muhammad Junagarhi |
| 3 | `mahmud-al-hasan` | 151 | Shaykh al-Hind Mahmud al-Hasan |
| 4 | `israr-ahmad` | 158 | Dr. Israr Ahmad (Bayan-ul-Quran) |
| 5 | `maududi` | 97 | Syed Abul A'la Maududi (Tafheem-ul-Quran) |
| 6 | `wahiduddin-khan` | 819 | Maulana Wahiduddin Khan |

Fetched from `https://api.quran.com/api/v4/quran/translations/{id}?fields=verse_key` (one request
returns all 6,236 ayahs). Footnote markers (`<sup foot_note>`, which point to tafsir notes) and
markup are removed and whitespace collapsed; the words are verbatim. `excludedTranslations`
records the rejected editions: 156 Fi Zilal al-Qur'an (some ayahs embed commentary, e.g. 26:224)
and 831 (Roman Urdu, Latin script).

These translations belong to their translators and publishers; Quran.com is the source.
Settings → About credits Quran.com alongside the required Corpus credit and link. **No copyright
license or permission for redistributing these translations has been recorded.**

## 4. Previously published lessons

`scope.json` → `existingLessons` (1, 4, 7, 18, 22, 23, 25, 29, 32, 36, 55, 56, 85–114) and
`partialPilot` (Surah 2, ayahs 1–20) are read from the committed lesson JSON. They keep their
published grammar layer — morphology, i‘rab text, dictionary notes, phrase cards, roots,
paradigms and rule cards — and their word IDs must equal Quran.com's. Only `meaningUrdu` is
replaced by the Quran.com Urdu word-by-word meaning, and the ayah gets the six translations;
the AI ayah translation, theme and tafsir were deleted. Al-Baqarah 2:1–20 keeps the pilot grammar
layer; 2:21–286 are source-only. The pilot's AI layer files (`words/2/*.json`, `libs/roots/`,
`libs/lexemes/`) remain as its provenance; the current build does not read them.

## 5. Commands

From the repository root (`npm ci`, and the Corpus file `content-pipeline/qac/qac04-lfs.txt`):

```sh
work=content-pipeline/full-quran
python3 -I $work/scripts/fetch.py $work [--workers N]  # sources/ (git-ignored); resumable
python3 -I $work/scripts/build.py $work check           # build all 114 chapters in memory, report
python3 -I $work/scripts/build.py $work assemble .      # write lessons + inventory
python3 -I $work/scripts/verify.py …                    # independent cross-check; arguments in its usage line
```

- `fetch.py` writes `sources/qurancom/chapters.json`, `verses-N-ur.json` (text + Urdu
  word-by-word, every chapter), `translation-ID.json` (one per `translations` entry) and
  `sources/qac-wbw/wbw-N.json` (Corpus word-by-word pages: English gloss, morphology and Arabic
  i‘rab per word). Complete files are reused, so an interrupted fetch resumes.
- `build.py … check` builds every chapter and prints a summary (words, published vs source-only
  words, meanings replaced, Corpus spelling differences, excluded pause signs). It exits non-zero
  on any problem: a letter difference, a word-count or word-ID mismatch with the Corpus or a
  published lesson, a missing Urdu meaning or i‘rab, or an incomplete translation.
- `build.py … assemble <repo-root>` runs the same build, then writes
  `packages/core/data/lessons/surah-1.json` … `surah-114.json`, `inventory/sources.json` (source
  URLs, retrieval dates, translation policy, summary) and `inventory/inventory-N.json`
  (per-chapter spelling differences and excluded pause signs).
- `scripts/verify.py` is the verification step: an independent cross-check of the assembled
  lessons against the raw sources. Read its usage line before running it.

Then run `npm run verify`, `npm run test:e2e`, `npm run db:sqlite`, `npm run db:mobile`, and —
with owner permission — `npm run db:sync` (`QG_PSQL`) and `npm run db:verify`.

## 6. Pitfalls

- Corpus lemma ids are sometimes inflected forms (`yuxa`diEu`, `rabiHat`): the lexeme key is an
  opaque handle. A source-only verb's lemma and paradigm past form are the Corpus's Arabic lemma
  (tanwīn and an assimilation shadda carried into the lemma id removed).
- Corpus case tags can be wrong (see `../meta/overrides.json`); source-only chapters render the
  tags as given. The `../scripts/check_cases.py` screen can flag candidates for adjudication.
- Quran.com's Urdu word-by-word does not name its translator in the API; provenance is the API URL
  and retrieval date in `sources/` and `inventory/sources.json`.
- Quran.com spells some marks differently from the Corpus (tatweel before dagger alif, small-meem
  tanwīn ۭ/ۢ, ـٔ vs ء). Letters must agree; mark differences are recorded, not "fixed".
- QuranAcademy is a separate project and database; never touch it.
- **Quran.com word-meaning gaps (280 words, e.g. 2:74:5):** Quran.com's Urdu word-by-word is empty
  there, so `meaningUrdu` is empty (the apps hide it). This includes 70 previously published words
  whose old AI meaning was removed (owner rule 2026-11-26: no AI-written meanings). Lists:
  `inventory/sources.json` → `meaningGaps`.
- **Quran.com vs Corpus quirks handled by the build:** small yeh written `ـۧ` vs `ۦ`; precomposed
  `آ` (compared after NFD); words written with an internal space (2:181:3 بَعْدَ مَا); a Corpus form
  containing a space (37:130:3, fixed in `../scripts/qac.py`); Corpus segments with no written
  form (elided pronouns) merged into the previous segment card; three genuine letter differences
  (11:13:3, 12:39:1, 12:41:1) where the segment cards use the Corpus spelling.
- **Translation cleaning:** only `<sup foot_note>` markers and markup are removed; the source's own
  spaces stay (a marker glued between two words becomes one space). Markup debris at the end of a
  text (4:106 Junagarhi `>`) is removed.
- **IndoPak text:** `text_indopak` minus bidi controls, U+200B and U+FEFF, with whitespace collapsed
  and no space before a trailing waqf sign; Quran.com's private-use waqf glyphs (U+E01A–E022) stay
  verbatim and render with Al Qalam Quran Majeed.
- **Verification:** `scripts/verify.py --write` (independent of build.py) must report `RESULT: OK`;
  on 2026-11-26 a separate live re-check against fresh Quran.com data found 0 content differences in
  Arabic, IndoPak text, word meanings and all 37,416 translation texts.

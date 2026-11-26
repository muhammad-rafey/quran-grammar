# Grammar layer for the whole Quran — authoring guide

Owner decision 2026-11-26: every chapter gets the same grammar analysis the 43 published lessons
have. **Word meanings and ayah translations are NOT written here** — they stay Quran.com's. You
write only grammar notes, in Urdu, in the existing pattern. Scholarly review is pending; never claim
approval.

## What you write (files you create — never edit other files)

| Work unit | File | Content |
| --------- | ---- | ------- |
| word chunk `SSS-AAA-BBB` | `words/<surah>/<chunk>.json` | one entry per word id in the packet |
| same chunk | `phrases/<surah>/<chunk>.json` | phrase cards for every ayah of the chunk |
| root batch | `libs/roots/<batch>.json` | `{"entries": [...]}` for the listed roots |
| verb batch | `libs/lexemes/<batch>.json` | `{"entries": [...]}` for the listed lexeme keys |

Inputs: `packets/words-<chunk>.json` (per word: Arabic, Quran.com Urdu meaning, Corpus word type,
root, lemma, lexeme key, Urdu morphology, Corpus Arabic i‘rab, segments with roles, deterministic
rule ids, Corpus English gloss/morphology; per ayah: Arabic and Jalandhari translation for
context), `packets/needs-roots.json`, `packets/needs-lexemes.json`, rule library
`../libs/rules.json` (ids, Urdu titles, explanations).

### Word entry (`words/<surah>/<chunk>.json`)

```json
{
  "2:21:1": {
    "arabic": "يَـٰٓأَيُّهَا",
    "segmentMeaningsUrdu": ["اے", "…"],
    "dictionaryUrdu": "…",
    "addRuleIds": ["vocative"]
  }
}
```

- `arabic` — copy exactly from the packet (it is checked).
- `segmentMeaningsUrdu` — exactly one non-empty Urdu gloss per packet segment, in order, for that
  segment's own contribution (prefix وَ → «اور», حرفِ تعریف ٱلْ → «وہ / ال», stem → its sense here,
  attached pronoun → «ان کا», «ہم نے» …). Consistent with the Quran.com word meaning.
- `dictionaryUrdu` — 1–3 short Urdu sentences: what the word is (form, pattern, root sense) and
  why it has this form here (case/mood/agreement/function in this ayah), pointing out a likely
  confusion when useful. Follow the Corpus i‘rab (`irabArabic`) and morphology; do not contradict
  them. No tafsir, no theology beyond the plain grammatical meaning, no quoting translations.
- `addRuleIds` — extra rule ids from `../libs/rules.json` for syntax the tags cannot see (e.g.
  `subject`, `object`, `two-objects`, `idafa`, `adjective`, `badal`, `tawkid`, `verbal-sentence`,
  `nominal`, `haal`, `tamyiz`, `cognate-object`, `purpose-object`, `quoted-speech`, `fronting`,
  `elision`, `condition-answer`, `oath`…; use only ids that exist in `../libs/rules.json`).
  Can be `[]`.

### Phrase cards (`phrases/<surah>/<chunk>.json`)

```json
{
  "2:21": [
    { "wordIds": ["2:21:1", "2:21:2"], "labelUrdu": "ندا", "explanationUrdu": "…" }
  ]
}
```

- Every ayah of the chunk gets 1–6 cards (short ayahs 1–2, long ayahs more) covering its sentence
  structure: sentence type (اسمیہ/فعلیہ), مبتدا/خبر, فعل/فاعل/مفعول, شرط/جوابِ شرط, صلہ, حال,
  عطف, جار و مجرور and what it attaches to, اضافت, نعت, استثنا, قسم, ندا, etc.
- `wordIds` — consecutive or not, but all from that ayah. `labelUrdu` — a short grammatical label
  (2–6 words). `explanationUrdu` — 1–2 Urdu sentences explaining the construction.
- Match the style of `packages/core/data/lessons/surah-18.json` / `surah-36.json` phrases.

### Root entry (`libs/roots/<batch>.json`)

`{"root": "ر ب ح", "meaningUrdu": "…", "noteUrdu": "…"}` — `root` exactly as in the needs list
(space-separated Arabic letters). `meaningUrdu`: the core sense(s) in a short Urdu phrase list.
`noteUrdu`: 1–3 sentences on the root's basic meaning and how its main Quranic derivatives relate
(use the listed occurrences). Style: `content-pipeline/libs/roots/*.json`.

### Verb paradigm entry (`libs/lexemes/<batch>.json`)

`{"key": "<lexeme key>", "baabUrdu": "بابِ نَصَرَ يَنْصُرُ", "formUrdu": "ثلاثی مجرد — اوّل (I)",
"past": "…", "present": "…", "pattern": "فَعَلَ — يَفْعُلُ", "noteUrdu": "…",
"evidenceEnglish": "…"}` — `key` exactly from the needs list. `past`/`present`: fully vowelled
3rd-person masculine singular active (passive keys: the passive forms). For Form I give the bāb
from the present-tense vowel (نَصَرَ/ضَرَبَ/فَتَحَ/سَمِعَ/كَرُمَ/حَسِبَ); derived forms: the
standard bāb. `formUrdu` uses the existing wording (`ثلاثی مجرد — اوّل (I)`, `ثلاثی مزید فیہ —
چہارم (IV)`, quadriliteral forms likewise). `noteUrdu`: 1–3 sentences (transitivity, weak/hamzated
letters and how they change, distinctive usage). `evidenceEnglish`: one line citing the Quranic
occurrences (ids) that show the imperfect/vowel — this is the audit trail. Style:
`content-pipeline/edition-3/libs/lexemes/*.json`.

## Rules

- Urdu only in Urdu fields (Arabic words allowed); no Latin letters, no URLs, no references.
- Never alter Arabic text, word ids, Quran.com meanings or translations.
- Validate before finishing: `QG_SURAHS=<surah> python3 -I content-pipeline/full-quran/scripts/build.py content-pipeline/full-quran check`
  from the repo root must report `"problems": 0` for your files (other agents' unfinished chunks
  simply stay source-only and do not cause problems).

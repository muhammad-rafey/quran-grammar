# Authoring guide — Quran Grammar lessons for Surahs 18, 23, 32, 36, 55

You are writing original **Urdu** teaching content for a Quranic Arabic grammar app. Learners are
Urdu speakers studying Arabic grammar word by word. The app already ships Al-Fatihah and Surahs
105–114 in exactly this format; your output must match that pattern and quality.

Everything you write is an **AI-assisted educational draft awaiting scholarly review**, but it
must still be correct. Accuracy beats elegance. Never guess silently: when the sources disagree or
you are unsure, choose the analysis of the primary sources below and record the alternative in
`auditNotes`.

## 1. Sources and their authority

Each packet gives you, per word and per ayah:

| Field                                                                            | Source                                            | Use it for                                                                                                                       |
| -------------------------------------------------------------------------------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `arabic`                                                                         | Quran.com API `text_uthmani`                      | The exact Quranic word. **Never retype, normalise or "fix" it.**                                                                 |
| `qacSegments`, `qacMorphologyEnglish`                                            | Quranic Arabic Corpus (QAC) 0.4                   | Segmentation, part of speech, root, lemma, verb form, voice, mood, case, person/gender/number. **Authoritative for morphology.** |
| `qacIrabArabic`, ayah `qacGrammarNotesArabic`                                    | QAC i‘rab adapted from the Quran Printing Complex | Syntactic role (i‘rab). **Primary authority for syntax.**                                                                        |
| `pos`, `root`                                                                    | Derived deterministically from QAC                | Already decided. Do not contradict them; if you believe one is wrong, write normally and explain in `auditNotes`.                |
| `glossEnglishQac`, `glossEnglishQuranCom`                                        | Word-by-word English                              | Meaning check only.                                                                                                              |
| `translationSahihInternational`, `translationTaqiUsmani`                         | English translations                              | Meaning check only.                                                                                                              |
| `tafsir.muyassarArabic`, `tafsir.saadiArabic`, `tafsir.ibnKathirEnglishAbridged` | Classical tafsir                                  | Basis for the Urdu tafsir summary.                                                                                               |
| `lexemes` (verbs), `roots`                                                       | Verified shared libraries                         | Keep your verb and root statements consistent with them.                                                                         |

Do **not** copy any source sentence verbatim or translate it sentence by sentence. Write original,
concise Urdu. Do not import third-party Urdu translations or tafsir (none are provided, and you
must not reproduce one from memory).

**QAC tags are occasionally wrong.** When a packet word carries `qacCorrection`, follow it — it
was adjudicated from the vocalised word and its context — and mention the correction in
`auditNotes`. If you find another clear contradiction between a QAC tag (or the generated i‘rab
line) and the vocalised Uthmani word or its governing particle — case, mood, voice, person — write
the correct analysis and record the discrepancy in `auditNotes`. The `pos` and `root` fields are
fixed; if you believe one is wrong, write correctly and explain in `auditNotes`.

## 2. What you write (JSON)

Write exactly this structure to the chunk file named in your task:

```json
{
  "chunk": "18-c01",
  "ayahs": [
    {
      "number": 1,
      "translationUrdu": "…",
      "themeUrdu": "…",
      "tafsirUrdu": "…",
      "phrases": [{ "wordIds": ["18:1:1", "18:1:2"], "labelUrdu": "…", "explanationUrdu": "…" }]
    }
  ],
  "words": [
    {
      "id": "18:1:1",
      "meaningUrdu": "…",
      "posUrdu": "…",
      "lemma": "…",
      "morphologyUrdu": "…",
      "syntaxUrdu": "…",
      "dictionaryUrdu": "…",
      "segments": [{ "arabic": "…", "roleUrdu": "…", "meaningUrdu": "…" }],
      "ruleIds": ["…"],
      "verbNoteUrdu": "… (verbs only)"
    }
  ],
  "auditNotes": [{ "ref": "18:1:3", "noteEnglish": "…" }]
}
```

- `words` must list **every planned word id, in reading order**, and nothing else. Do not add
  `arabic`, `pos`, `root`, `ayah` or `position`; they are filled automatically from the sources.
- `ayahs` must list every planned ayah number in order.
- Every string is a single line (no newlines), trimmed, Urdu or Arabic only — **no Latin letters,
  no URLs**. Use Urdu punctuation (۔ ، ؛ ؟) and «» for quotations, as the existing lessons do.

## 3. Field-by-field rules

### Word fields

- **meaningUrdu** (≤ 40 characters ideally, max 60): the contextual meaning _in this ayah_, as a
  learner would gloss it under the word, e.g. `بے شک ہم نے`, `اپنے رب کے لیے`, `اور قربانی کرو`.
  Include attached particles/pronouns in the gloss when they are part of the word.
- **posUrdu** (short label): the word's make-up, e.g. `فعلِ ماضی + ضمیرِ فاعل`, `حرفِ جر + اسم + ضمیر`,
  `اسمِ منصوب`, `حرفِ عطف + فعلِ امر`, `اسمِ موصول`, `ضمیرِ منفصل`, `حرفِ نفی`. It must name the
  QAC-derived word type: verb → «فعل», noun/adjective → «اسم/صفت/ظرف/مصدر», particle → «حرف»,
  pronoun → «ضمیر/اسمِ موصول/اسمِ اشارہ». A word whose head is a preposition with an attached
  pronoun (لَهُ، بِهِ، عَلَيْهِمْ) is a particle in this app.
- **lemma**: Arabic dictionary form with full vowels: verbs → 3rd-person masculine singular active
  perfect (`أَعْطَى`, `قَالَ`); nouns/adjectives → singular base (`رَبّ`, `كَهْف`); particles →
  the particle (`إِنَّ`); a fused particle + pronoun may be written `إِنَّ + نَا`. Arabic letters
  only — never Urdu ی ک ہ ے.
- **morphologyUrdu** (1–2 sentences, about 60–200 characters): صرف — word class; pattern/derivation
  (اسمِ فاعل، اسمِ مفعول، مصدر، صفتِ مشبہ، اسمِ تفضیل، جمعِ تکسیر، جمعِ مذکر سالم…); gender and
  number; case or mood **with its sign** (ضمہ، فتحہ، کسرہ، واو، یاء، الف، سکون، حذفِ نون، مقدر);
  definiteness; voice (معروف/مجہول); verb form; weak/hamzated/doubled letters; attached pronouns.
  Built (مبنی) words: say on what they are built. State only what QAC supports.
- **syntaxUrdu** (1–2 sentences, about 60–200 characters): نحو — the role in this ayah (فاعل،
  نائبِ فاعل، مفعول بہ، مبتدا، خبر، حال، تمییز، صفت، مضاف الیہ، بدل، معطوف، جار و مجرور کا متعلق،
  جوابِ شرط…) and which word it relates to. Follow `qacIrabArabic` / `qacGrammarNotesArabic`. If
  a well-known alternative exists, you may mention it briefly («ایک تجزیے میں…») and log it.
- **dictionaryUrdu** (1–2 sentences, about 60–200 characters): the lexical meaning, how the
  contextual meaning follows, and a learner caution where useful (e.g. a weak letter that hides a
  radical, a word that is not a verb despite its meaning). Keep consistent with the root entry.
- **segments**: split the exact `arabic` string into learner units — prefixes (وَ، فَ، بِ، لِ، كَ،
  سَ، أَ، ٱلْ), the stem, suffixes (ضمائر، علاماتِ جمع/تثنیہ، نونِ تاکید). Each `arabic` must be a
  contiguous slice; **concatenated in order they must equal the word exactly**, including every
  Uthmani mark, small letter, tatweel and pause sign (a pause sign attaches to the last segment).
  Use one segment for an unsplittable word. `roleUrdu` names the grammatical role (e.g.
  `حرفِ عطف`, `فعلِ ماضی، بابِ افعال`, `ضمیرِ مفعول بہ`); `meaningUrdu` glosses that piece.
- **ruleIds**: 1–6 ids from `libs/rules.json` that a learner should study for _this_ word, most
  important first. Use only ids whose `appliesWhenEnglish` condition holds for this occurrence.
- **verbNoteUrdu** (verbs only, 1–2 sentences): an occurrence note for the verb-paradigm card:
  how this occurrence relates to the lexeme paradigm — person/number/gender, aspect, mood and its
  cause, voice, attached subject/object pronouns, hidden subject, weak-letter changes. Must agree
  with the lexeme entry given in the packet (bab, form, past, present).

### Ayah fields

- **translationUrdu**: a complete, faithful, fluent Urdu translation of the whole ayah. Implied
  words may go in parentheses. Address to the Prophet ﷺ uses «آپ»; address to people in general
  uses «تم»/«تم لوگ»; Allah's majestic plural «نَحْنُ / نَا» is «ہم». Do not drop any clause.
- **themeUrdu**: a 2–6 word title of the ayah's theme.
- **tafsirUrdu** (2–3 sentences, about 120–350 characters): an original Urdu summary of the
  mainstream Sunni explanation found in the provided tafsir (Muyassar, Sa‘di, Ibn Kathir). Explain
  what the ayah teaches in context. Where the provided tafsir records a significant difference of
  opinion, say «بعض مفسرین کے نزدیک…» rather than presenting one view as the only one. Do not add
  narrations, numbers, names or stories that are not in the provided tafsir. Never attribute a
  saying to the Prophet ﷺ unless the provided tafsir does so, and keep it brief and accurate.
  State each point directly: do not refer the learner to discussions elsewhere in the tafsir
  books (e.g. «جیسا کہ سورۂ بقرہ کے آغاز میں گزرا»), which the app does not contain.
- **phrases**: group the ayah into grammatical constructions (مرکبِ اضافی، مرکبِ توصیفی، جار و مجرور،
  جملۂ فعلیہ، جملۂ اسمیہ، شرط و جواب، صلہ و موصول، حال، استثنا…). Every word of the ayah must
  appear in at least one phrase; phrases may overlap; list `wordIds` in reading order. A short ayah
  may have 1–3 phrases; a long ayah usually 3–8. `labelUrdu` names the construction;
  `explanationUrdu` explains how its parts relate.

## 4. Quoting Arabic inside Urdu text

When an explanation quotes Quranic words, copy them **exactly** from the packet's `arabic`
strings (you may quote a single word or a contiguous run of words). Paradigm forms and lemmas
(يَفْعَلُ، أَعْطَى) are not quotes and may be written normally with full vowels. Never quote a
Quranic phrase from memory.

## 5. Grammar conventions (match the existing lessons)

- Case/mood terms: رفع، نصب، جر، جزم؛ مرفوع، منصوب، مجرور، مجزوم؛ محلِ رفع/نصب/جر for built words.
- Verb terms: فعلِ ماضی، فعلِ مضارع، فعلِ امر، نہی (لا + مضارع مجزوم)، معروف، مجہول، لازم، متعدی؛
  ثلاثی مجرد، ثلاثی مزید فیہ، رباعی؛ صحیح، مثال، اجوف، ناقص، لفیف، مہموز، مضاعف.
- Pronouns: ضمیرِ متصل/منفصل/مستتر؛ «پوشیدہ فاعل» for an implied subject (e.g. هُوَ، أَنْتَ، نَحْنُ).
- The divine name ٱللَّه, root أ ل ه, is a proper noun; follow the existing lessons' caution
  that the root grouping is a lexical index, not a settled etymology.
- `إِذَا` (time adverb with conditional sense) is a noun (ظرف) in this app; `إِنْ`, `لَوْ`, `لَمْ`,
  `لَنْ`, `قَدْ`, `سَوْفَ`, `إِلَّا`, `بَلْ`, `ثُمَّ` are particles.
- Quranic initials such as يسٓ are particles with no root (حروفِ مقطعات); do not invent meanings —
  say their meaning is known to Allah, as the classical tafsir does.
- Proper names without a QAC root keep root `null`; do not invent etymologies.
- Participles, verbal nouns and adjectives are nouns, never verbs, even when they govern objects.

## 6. Accuracy checklist before you finish

1. Every word: does morphology match QAC (form, voice, mood, case, person/gender/number)?
2. Every word: does the syntax match the QAC i‘rab for this occurrence?
3. Every verb: does `verbNoteUrdu` agree with the lexeme entry and with QAC's aspect/mood/voice?
4. Every meaning and translation: faithful to the Arabic and consistent with the references?
5. Every tafsir: supported by the provided tafsir, no invented details, no single view presented
   as unanimous where the sources differ?
6. Every quoted Arabic run copied exactly from the packet?
7. Urdu is natural, correctly spelled (Urdu ی ک ہ ے in Urdu words), and uses the terms above.
8. Run the validator and fix every error. Treat warnings seriously.

Use `auditNotes` (English) for any source disagreement, alternative analysis, or decision a
scholar reviewer should see. Keep notes factual and short.

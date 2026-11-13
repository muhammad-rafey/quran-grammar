# Surah 92 — Al-Layl: source audit

Researched 2026-11-13. This lesson contains **21 ayahs and 71 word occurrences**. All Urdu word glosses, translations, grammatical explanations, dictionary summaries, verb-paradigm notes and concise tafsir notes are original AI-assisted editorial drafts. They are **not scholar-reviewed** and are not attributed to a named Urdu translator. No third-party Urdu book, dictionary, translation or tafsir was imported.

## Arabic inventory

`inventory-92.json` records the Quran.com Content API v4 `text_uthmani` word strings ([source](https://api.quran.com/api/v4/verses/by_chapter/92?words=true&word_fields=text_uthmani&per_page=50)), retrieved 2026-11-13, excluding end-of-ayah markers. Recitation signs that the API separates from a word by a space — waqf signs, the saktah sign, the sajdah sign and the rub al-hizb marker — are not part of the stored word token, following the Surahs 110–114 precedent. The inventory lists all 0 such exclusions with the original API text; no other character was changed. The unnumbered opening basmalah is not inserted as a numbered occurrence. Automated tests compare every stored word, its id and its segments with this inventory.

Word boundaries and counts match the Quranic Arabic Corpus morphology for every ayah. Per-ayah word counts: 3, 3, 4, 3, 4, 2, 2, 4, 2, 2, 6, 3, 4, 3, 4, 3, 2, 4, 6, 5, 2.

## Sources and method

- **Morphology:** Quranic Arabic Corpus morphology 0.4 (Kais Dukes, GNU GPL with the Corpus terms of use), a verbatim distribution checked by SHA-256 `910b721a8f04f4334ac5d4c62b19e858f5d720c525bb975f2e750ea2c6bb532d`. It was consulted locally for segmentation, part of speech, root, lemma, verb form, voice, mood and case; it is not bundled or redistributed.
- **Word types and roots** are derived deterministically from the Corpus stem tags with the mapping that reproduces root assignments for all 230 word occurrences of the existing lessons, including words with no root. A preposition with an attached pronoun (لَهُ، بِهِ، عَلَيْهِمْ) is a particle, following Surahs 1, 105 and 112. Words without a Corpus root, such as proper names, keep no root.
- **Syntax:** the Corpus word-by-word pages (English morphology and Arabic i‘rab for every word) and verse grammar pages (Arabic i‘rab notes adapted from the Quran Printing Complex), retrieved 2026-11-13. 4 of 21 verse pages carry no grammar note: 2, 6, 9, 13.
- **Verb paradigms** (باب، ماضی، مضارع، وزن) for all 23 verb occurrences come from a shared library of 657 verb lexemes for this expansion edition. Form I vowel classes were decided from imperfects attested across the whole Corpus and standard lexica (Lane, Lisan al-Arab, al-Mu‘jam al-Wasit). The edition’s library review and subsequent corrections are recorded in its handoff and adjudication reports.
- **Tafsir consulted** through the Quran.com API: Tafsir al-Muyassar (Arabic), Tafsir al-Sa‘di (Arabic) and Ibn Kathir (abridged, English). Translations consulted for meaning only: Saheeh International and Mufti Taqi Usmani. The Urdu wording is original and concise; it is not a translation of these works.

Word-type, verb-form and passive-voice counts below apply the adjudicated occurrence overrides; they are not uncorrected Corpus tag counts.

| Measure | Count |
| --- | ---: |
| Nouns | 29 |
| Adjectives | 1 |
| Verbs | 23 |
| Particles | 15 |
| Pronouns | 3 |
| Passive verb occurrences | 2 |
| Distinct roots | 41 |
| Verb form I | 6 |
| Verb form II | 6 |
| Verb form IV | 4 |
| Verb form V | 5 |
| Verb form VIII | 1 |
| Verb form X | 1 |

## Editorial checks

The lesson is organized into 2 chunks of whole ayahs. No review-result snapshot was supplied. This source audit therefore does not certify completion of independent reviews, fixes or final confirmations. The intended workflow requires independent grammar and meaning/tafsir reviews and a clean final confirmation after every correction, including minor findings.
The chunk validator checks the exact Arabic word, segments that rejoin to the exact word, ids and order, rule references, verb-note presence, phrase coverage of every word, and the absence of URLs or Latin text. AI review and automated checks are not scholarly review.

Nouns without a Corpus root (root left empty): إِذَا، مَنْ، مَنۢ.

## Corrections to Corpus tags

These occurrences carry an adjudicated correction or a documented source/analysis disagreement. The lessons follow the recorded contextual analysis; the raw Corpus data itself is unchanged.

- **92:2:3** تَجَلَّىٰ: QAC tags تَجَلَّىٰ as Form I, but the ta- prefix and doubled middle radical (tafaʿʿala) make it Form V of ج ل و (the Form I verb is جَلَا يَجْلُو). The reviewed paradigm entry under this lexeme handle is written as Form V; raised by the lex-a02 library review.
- **92:14:3** تَلَظَّىٰ: QAC gives تَلَظَّىٰ no form tag (Form I); it is Form V تَلَظَّى (tafaʿʿala, ta prefix + doubled middle radical) with one of the two ta's elided from تَتَلَظَّى. Its mood is correctly indicative (hidden damma on the alif; nothing governs it), the sentence being an adjective of نَارًا.

## Analysis decisions and cautions

Notes recorded by the authors and reviewers for scholarly review; they mark alternative analyses, source disagreements and editorial choices.

- **92:2:2:** The verse-level iʿrab gives no note for this verse. The lesson takes idha as a time adverb parallel to 92:1:2 and relates it to the implied oath verb.
- **92:2:3:** The packet’s adjudicated correction and reviewed paradigm identify Form V of j-l-w. The raw QAC tag is Form I, which does not account for the ta prefix and geminated middle radical.
- **92:3:1:** The lesson follows the ayah iʿrab and QAC relative reading, taking ma as conjoined to al-nahar and referring to the Creator. Saʿdi also records a masdariyya reading, in which the oath is by the creation of male and female.
- **92:4:3:** QAC tags shatta masculine singular. The reviewed root library analyzes it as the broken plural of shatit, matching the sense of disparate efforts. The lesson follows the library and retains the nominative predicate with an implicit case vowel.
- **92:5:1:** The word-level QAC gloss calls initial fa resumptive, while the ayah iʿrab calls it a conjunction and connects the full sentence to the answer to the oath. The lesson follows the ayah iʿrab.
- **92:5:2:** QAC tags man as a conditional noun. The ayah iʿrab makes it a relative mubtada with the verse 7 clause as khabar; amma supplies the condition and detailing. The lesson keeps the effective noun type and teaches the contextual relative analysis.
- **92:6:2:** Muyassar and Saʿdi connect al-husna to tawhid and its implications and reward. The grouped Ibn Kathir commentary gives the recompense or best reward. The lesson keeps both interpretive scopes in view, also at 92:9:2.
- **92:8:2:** As at 92:5:2, the QAC word tag says conditional, but the ayah iʿrab takes man as a relative mubtada and 92:10 gives its khabar. The lesson uses that relative analysis while retaining the effective noun type.
- **92:11:1:** QAC labels waw resumptive, while the ayah iʿrab conjoins the sentence to the preceding sanuyassiruhu clause. The lesson follows the ayah iʿrab for waw and the word-level negative analysis for ma; Saheeh International conveys the negation as a rhetorical question.
- **92:11:2:** The raw Corpus lemma is the feminine perfect form aghnat. The lesson uses the reviewed Form IV citation aghna, with this occurrence remaining an indicative masculine singular imperfect.
- **92:11:6:** Saʿdi explains taradda as perishing or dying, while Muyassar takes it as falling into the Fire. Both interpretations are also reported in the grouped Ibn Kathir passage.
- **92:14:3:** Followed qacCorrection: QAC gives no form tag (Form I); written as Form V imperfect 3FS تَتَلَظَّى with one ta elided, indicative (implied damma on alif), sentence = adjective of نَارًا. The lexeme entry agrees.
- **92:14:1:** Word i‘rab calls the فَ استئنافية (QAC REM), while the ayah note says the clause is معطوفة on إِنَّ عَلَيْنَا لَلْهُدَىٰ. Tagged resumption per the word-level label; the عطف reading is mentioned in syntaxUrdu.
- **92:15:2:** Clause لَا يَصْلَىٰهَآ treated as the second نعت of نَارًا per the ayah note; tagged adjective on the verb as clause head.
- **92:17:1:** Lemma given as the active perfect جَنَّبَ (guide convention); lexeme past is the passive جُنِّبَ. ٱلْأَتْقَى is nāʾib fāʿil and ـهَا the retained second object, per i‘rab.
- **92:18:1:** No ayah note for 92:18; ٱلَّذِى treated as نعت of ٱلْأَتْقَى by parallel with the note on 92:16. A بدل reading is also possible.
- **92:18:4:** Followed the ayah note: يَتَزَكَّىٰ is a ḥāl clause from the fāʿil of يُؤْتِى. A known alternative (e.g. al-Zamakhshari) also allows reading it as بدل of the ṣila يُؤْتِى with no محل.
- **92:19:1:** QAC labels the وَ CONJ and the word i‘rab says عاطفة, but the ayah note makes the whole clause حالية from the fāʿil of يَتَزَكَّىٰ; tagged haal and called واوِ حالیہ.
- **92:19:6:** Lexeme note says the recipient of recompense becomes nāʾib fāʿil; here the hidden nāʾib fāʿil هِيَ refers to نِّعْمَةٍۢ (the favour that is repaid). Not a library defect, only a different construction.
- **92:20:1:** QAC tags إِلَّا EXP and the word i‘rab says أداة استثناء, while the ayah note says للحصر with ٱبْتِغَآءَ as مفعول لأجله; tagged restriction. Common alternative: استثناء منقطع (= لكن) with ٱبْتِغَآءَ منصوب على الاستثناء.
- **92:21:1:** Word i‘rab calls the وَ عاطفة; the ayah note says وَلَسَوْفَ يَرْضَىٰ answers an implied oath whose sentence is مستأنفة. Kept conjunction per the word label and tagged oath + emphatic-lam.
- **92:15:4:** ٱلْأَشْقَى and ٱلْأَتْقَى (92:17:2) are elatives; Muyassar glosses them as شديد الشقاء / شديد التقوى, i.e. intensity rather than strict comparison. Tagged comparative.
- **92:13:4:** ٱلْأُولَىٰ: QAC N with lemma أَوَّل; explained as the feminine فُعْلَى of أَوَّل without tagging comparative.

## Per-ayah sources

- **92:1:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=92&verse=1); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=92&verse=1); [Quran.com](https://quran.com/92/1).
- **92:2:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=92&verse=2); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=92&verse=2); [Quran.com](https://quran.com/92/2).
- **92:3:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=92&verse=3); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=92&verse=3); [Quran.com](https://quran.com/92/3).
- **92:4:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=92&verse=4); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=92&verse=4); [Quran.com](https://quran.com/92/4).
- **92:5:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=92&verse=5); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=92&verse=5); [Quran.com](https://quran.com/92/5).
- **92:6:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=92&verse=6); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=92&verse=6); [Quran.com](https://quran.com/92/6).
- **92:7:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=92&verse=7); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=92&verse=7); [Quran.com](https://quran.com/92/7).
- **92:8:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=92&verse=8); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=92&verse=8); [Quran.com](https://quran.com/92/8).
- **92:9:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=92&verse=9); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=92&verse=9); [Quran.com](https://quran.com/92/9).
- **92:10:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=92&verse=10); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=92&verse=10); [Quran.com](https://quran.com/92/10).
- **92:11:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=92&verse=11); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=92&verse=11); [Quran.com](https://quran.com/92/11).
- **92:12:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=92&verse=12); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=92&verse=12); [Quran.com](https://quran.com/92/12).
- **92:13:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=92&verse=13); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=92&verse=13); [Quran.com](https://quran.com/92/13).
- **92:14:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=92&verse=14); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=92&verse=14); [Quran.com](https://quran.com/92/14).
- **92:15:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=92&verse=15); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=92&verse=15); [Quran.com](https://quran.com/92/15).
- **92:16:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=92&verse=16); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=92&verse=16); [Quran.com](https://quran.com/92/16).
- **92:17:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=92&verse=17); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=92&verse=17); [Quran.com](https://quran.com/92/17).
- **92:18:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=92&verse=18); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=92&verse=18); [Quran.com](https://quran.com/92/18).
- **92:19:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=92&verse=19); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=92&verse=19); [Quran.com](https://quran.com/92/19).
- **92:20:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=92&verse=20); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=92&verse=20); [Quran.com](https://quran.com/92/20).
- **92:21:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=92&verse=21); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=92&verse=21); [Quran.com](https://quran.com/92/21).

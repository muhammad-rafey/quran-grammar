# Surah 99 — Az-Zalzalah: source audit

Researched 2026-11-13. This lesson contains **8 ayahs and 36 word occurrences**. All Urdu word glosses, translations, grammatical explanations, dictionary summaries, verb-paradigm notes and concise tafsir notes are original AI-assisted editorial drafts. They are **not scholar-reviewed** and are not attributed to a named Urdu translator. No third-party Urdu book, dictionary, translation or tafsir was imported.

## Arabic inventory

`inventory-99.json` records the Quran.com Content API v4 `text_uthmani` word strings ([source](https://api.quran.com/api/v4/verses/by_chapter/99?words=true&word_fields=text_uthmani&per_page=50)), retrieved 2026-11-13, excluding end-of-ayah markers. Recitation signs that the API separates from a word by a space — waqf signs, the saktah sign, the sajdah sign and the rub al-hizb marker — are not part of the stored word token, following the Surahs 110–114 precedent. The inventory lists all 0 such exclusions with the original API text; no other character was changed. The unnumbered opening basmalah is not inserted as a numbered occurrence. Automated tests compare every stored word, its id and its segments with this inventory.

Word boundaries and counts match the Quranic Arabic Corpus morphology for every ayah. Per-ayah word counts: 4, 3, 4, 3, 4, 6, 6, 6.

## Sources and method

- **Morphology:** Quranic Arabic Corpus morphology 0.4 (Kais Dukes, GNU GPL with the Corpus terms of use), a verbatim distribution checked by SHA-256 `910b721a8f04f4334ac5d4c62b19e858f5d720c525bb975f2e750ea2c6bb532d`. It was consulted locally for segmentation, part of speech, root, lemma, verb form, voice, mood and case; it is not bundled or redistributed.
- **Word types and roots** are derived deterministically from the Corpus stem tags with the mapping that reproduces root assignments for all 230 word occurrences of the existing lessons, including words with no root. A preposition with an attached pronoun (لَهُ، بِهِ، عَلَيْهِمْ) is a particle, following Surahs 1, 105 and 112. Words without a Corpus root, such as proper names, keep no root.
- **Syntax:** the Corpus word-by-word pages (English morphology and Arabic i‘rab for every word) and verse grammar pages (Arabic i‘rab notes adapted from the Quran Printing Complex), retrieved 2026-11-13. 2 of 8 verse pages carry no grammar note: 2, 8.
- **Verb paradigms** (باب، ماضی، مضارع، وزن) for all 11 verb occurrences come from a shared library of 658 verb lexemes for this expansion edition. Form I vowel classes were decided from imperfects attested across the whole Corpus and standard lexica (Lane, Lisan al-Arab, al-Mu‘jam al-Wasit). The edition’s library review and subsequent corrections are recorded in its handoff and adjudication reports.
- **Tafsir consulted** through the Quran.com API: Tafsir al-Muyassar (Arabic), Tafsir al-Sa‘di (Arabic) and Ibn Kathir (abridged, English). Translations consulted for meaning only: Saheeh International and Mufti Taqi Usmani. The Urdu wording is original and concise; it is not a translation of these works.

Word-type, verb-form and passive-voice counts below apply the adjudicated occurrence overrides; they are not uncorrected Corpus tag counts.

| Measure | Count |
| --- | ---: |
| Nouns | 22 |
| Adjectives | 0 |
| Verbs | 11 |
| Particles | 3 |
| Pronouns | 0 |
| Passive verb occurrences | 2 |
| Distinct roots | 18 |
| Verb form I | 6 |
| Verb form II | 1 |
| Verb form IV | 3 |
| Verb form QI | 1 |

## Editorial checks

The lesson is organized into 1 chunks of whole ayahs. No review-result snapshot was supplied. This source audit therefore does not certify completion of independent reviews, fixes or final confirmations. The intended workflow requires independent grammar and meaning/tafsir reviews and a clean final confirmation after every correction, including minor findings.
The chunk validator checks the exact Arabic word, segments that rejoin to the exact word, ids and order, rule references, verb-note presence, phrase coverage of every word, and the absence of URLs or Latin text. AI review and automated checks are not scholarly review.

Nouns without a Corpus root (root left empty): إِذَا، فَمَن، مَا، وَمَن، يَوْمَئِذٍۢ.

## Corrections to Corpus tags

These occurrences carry an adjudicated correction or a documented source/analysis disagreement. The lessons follow the recorded contextual analysis; the raw Corpus data itself is unchanged.

- **99:1:2** زُلْزِلَتِ: QAC tags زُلْزِلَتِ as Form I; the vocalised Hafs word belongs to زُلْزِلَ (Form QI), as decided and double-reviewed in the edition-2 verb-paradigm library entry (zulozilu|I|PASS). The lexeme handle is kept; follow the reviewed paradigm.

## Analysis decisions and cautions

Notes recorded by the authors and reviewers for scholarly review; they mark alternative analyses, source disagreements and editorial choices.

- **99:1:2:** Followed the packet qacCorrection: QAC tags this verb Form I, but it is the passive perfect of the bare quadriliteral زَلْزَلَ (Form QI, fuʿlila — yufaʿlalu) as in the reviewed paradigm entry. The lemma field gives the active citation form زَلْزَلَ per the guide; the paradigm past is the passive زُلْزِلَ. In connected recitation, hamzat al-waṣl drops and the temporary kasra on the feminine tāʾ separates it from the sākin lām of the article. The clause being in محل جر by iḍāfa to إِذَا is the standard analysis; the QAC word i‘rab line states only فعل ماض مبني للمجهول.
- **99:1:4:** QAC tags زِلْزَالَهَا as a plain noun (N), not a verbal noun; the ayah i‘rab calls it مفعول مطلق, so it is taught as the masdar (fiʿlāl) of زَلْزَلَ and tagged verbal-noun + cognate-object.
- **99:2:3:** QAC lemma ثَّقَلَان is an identifier, not the singular. Lemma given as ثِقْل (burden, pl. أَثْقَال); the packet lemmaFork and lexica also allow ثَقَل as a singular of أَثْقَال. Reviewer may prefer ثَقَل.
- **99:4:1:** Followed the ayah i‘rab: يَوْمَئِذٍ is a ẓarf in apposition (بدل) to إِذَا; a common alternative attaches it directly to تُحَدِّثُ. Segments split يَوْمَ + ئِذٍۢ for teaching although QAC treats the word as one stem.
- **99:4:3:** Taught as the direct object of تُحَدِّثُ (QAC: اسم منصوب; paradigm evidence calls it the direct object). Some i‘rab works treat it as the second object with the first (e.g. الخلقَ/الناسَ) elided; mentioned briefly in syntaxUrdu.
- **99:5:4:** أَوْحَى normally takes إِلَى; here the lām is read as equivalent to إِلَى. Ibn Kathir's abridged text glosses the sense as 'permit it', Mujahid and Ibn Abbas as commanding it to speak; the tafsir summary records both. Some grammarians take the lām as causal (لأجلها); not included in the lesson.
- **99:6:4:** QAC lemma is the plural أَشْتَات; the lemma field gives the singular شَتّ (lexica: قوم شَتٌّ وأشتات). Tagged ḥāl of ٱلنَّاسُ per the ayah i‘rab.
- **99:6:5:** Follows QAC and the paradigm entry: Form IV passive (أُرِيَ — يُرَى), subjunctive by implied أَنْ after lām al-taʿlīl, sign = dropped nūn; the wāw is nāʾib fāʿil, corresponding to the first object in the active construction and أَعْمَـٰلَهُمْ the second object. The passive يُرَى is identical in shape to the Form I passive; the reading 'be shown' follows QAC and the tafsir (ليريهم الله). Rule two-objects placed on أَعْمَـٰلَهُمْ only because of the six-rule limit.
- **99:7:1:** Source disagreement: the word i‘rab (and QAC REM tag) calls the فَ استئنافية, while the ayah grammar note says the clause فمن يعمل is معطوفة على جملة يصدر الناس. Per the resumption rule (follow the ayah i‘rab) the فَ is taught as عاطفة and tagged conjunction; the استئنافية view is mentioned in syntaxUrdu.
- **99:7:1:** مَن is taught as mubtada in محل رفع (standard); the khabar of a conditional mubtada is disputed (condition clause, answer, or both) and is not specified in the lesson. Same for 99:8:1.
- **99:7:5:** خَيْرًا is tamyīz per the ayah i‘rab; alternatives in i‘rab literature are بدل from مِثْقَالَ (mentioned in syntaxUrdu) or ḥāl. The same applies to شَرًّا in 99:8:5 (ayah 8 has no grammar note; parallel analysis applied).
- **99:7:6:** يَرَهُۥ is the jussive answer of مَن without فَ; QAC JUS agrees. The tafsir (Muyassar) specifies seeing its reward (99:7) and its punishment (99:8); the lesson follows this.

## Per-ayah sources

- **99:1:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=99&verse=1); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=99&verse=1); [Quran.com](https://quran.com/99/1).
- **99:2:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=99&verse=2); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=99&verse=2); [Quran.com](https://quran.com/99/2).
- **99:3:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=99&verse=3); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=99&verse=3); [Quran.com](https://quran.com/99/3).
- **99:4:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=99&verse=4); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=99&verse=4); [Quran.com](https://quran.com/99/4).
- **99:5:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=99&verse=5); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=99&verse=5); [Quran.com](https://quran.com/99/5).
- **99:6:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=99&verse=6); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=99&verse=6); [Quran.com](https://quran.com/99/6).
- **99:7:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=99&verse=7); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=99&verse=7); [Quran.com](https://quran.com/99/7).
- **99:8:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=99&verse=8); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=99&verse=8); [Quran.com](https://quran.com/99/8).

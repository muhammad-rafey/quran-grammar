# Surah 103 — Al-'Asr: source audit

Researched 2026-11-13. This lesson contains **3 ayahs and 14 word occurrences**. All Urdu word glosses, translations, grammatical explanations, dictionary summaries, verb-paradigm notes and concise tafsir notes are original AI-assisted editorial drafts. They are **not scholar-reviewed** and are not attributed to a named Urdu translator. No third-party Urdu book, dictionary, translation or tafsir was imported.

## Arabic inventory

`inventory-103.json` records the Quran.com Content API v4 `text_uthmani` word strings ([source](https://api.quran.com/api/v4/verses/by_chapter/103?words=true&word_fields=text_uthmani&per_page=50)), retrieved 2026-11-13, excluding end-of-ayah markers. Recitation signs that the API separates from a word by a space — waqf signs, the saktah sign, the sajdah sign and the rub al-hizb marker — are not part of the stored word token, following the Surahs 110–114 precedent. The inventory lists all 0 such exclusions with the original API text; no other character was changed. The unnumbered opening basmalah is not inserted as a numbered occurrence. Automated tests compare every stored word, its id and its segments with this inventory.

Word boundaries and counts match the Quranic Arabic Corpus morphology for every ayah. Per-ayah word counts: 1, 4, 9.

## Sources and method

- **Morphology:** Quranic Arabic Corpus morphology 0.4 (Kais Dukes, GNU GPL with the Corpus terms of use), a verbatim distribution checked by SHA-256 `910b721a8f04f4334ac5d4c62b19e858f5d720c525bb975f2e750ea2c6bb532d`. It was consulted locally for segmentation, part of speech, root, lemma, verb form, voice, mood and case; it is not bundled or redistributed.
- **Word types and roots** are derived deterministically from the Corpus stem tags with the mapping that reproduces root assignments for all 230 word occurrences of the existing lessons, including words with no root. A preposition with an attached pronoun (لَهُ، بِهِ، عَلَيْهِمْ) is a particle, following Surahs 1, 105 and 112. Words without a Corpus root, such as proper names, keep no root.
- **Syntax:** the Corpus word-by-word pages (English morphology and Arabic i‘rab for every word) and verse grammar pages (Arabic i‘rab notes adapted from the Quran Printing Complex), retrieved 2026-11-13. 1 of 3 verse pages carry no grammar note: 1.
- **Verb paradigms** (باب، ماضی، مضارع، وزن) for all 4 verb occurrences come from a shared library of 657 verb lexemes for this expansion edition. Form I vowel classes were decided from imperfects attested across the whole Corpus and standard lexica (Lane, Lisan al-Arab, al-Mu‘jam al-Wasit), and every entry was independently reviewed.
- **Tafsir consulted** through the Quran.com API: Tafsir al-Muyassar (Arabic), Tafsir al-Sa‘di (Arabic) and Ibn Kathir (abridged, English). Translations consulted for meaning only: Saheeh International and Mufti Taqi Usmani. The Urdu wording is original and concise; it is not a translation of these works.

Word-type, verb-form and passive-voice counts below apply the adjudicated occurrence overrides; they are not uncorrected Corpus tag counts.

| Measure | Count |
| --- | ---: |
| Nouns | 6 |
| Adjectives | 0 |
| Verbs | 4 |
| Particles | 3 |
| Pronouns | 1 |
| Passive verb occurrences | 0 |
| Distinct roots | 9 |
| Verb form I | 1 |
| Verb form IV | 1 |
| Verb form VI | 2 |

## Editorial checks

The lesson is organized into 1 chunks of whole ayahs. No review-result snapshot was supplied. This source audit therefore does not certify completion of independent reviews, fixes or final confirmations. The intended workflow requires independent grammar and meaning/tafsir reviews and a clean final confirmation after every correction, including minor findings.
The chunk validator checks the exact Arabic word, segments that rejoin to the exact word, ids and order, rule references, verb-note presence, phrase coverage of every word, and the absence of URLs or Latin text. AI review and automated checks are not scholarly review.

## Analysis decisions and cautions

Notes recorded by the authors and reviewers for scholarly review; they mark alternative analyses, source disagreements and editorial choices.

- **103:1:1:** Oath wāw: QAC tags it P (oath); the jar-majrur attaches to an elided verb (أقسم), answered by 103:2. Muyassar and Sa'di take al-'Asr as time (Sa'di: night and day); Ibn Kathir reports Zayd bin Aslam (via Malik) that it is the evening, but calls 'time' the popular view. The lesson follows 'time' and mentions the other view.
- **103:2:3:** The EMPH lām is treated as lām al-muzaḥlaqa on the khabar of إنّ; the khabar is taken as an elided ثابت/كائن to which لفي خسر attaches. Lemma written as the preposition فِي; the lām is described in segments.
- **103:2:4:** QAC tags خسر as a plain noun (not VN), so verbal-noun was not tagged even though lexica treat it as a masdar of خَسِرَ. The remark that the indefinite conveys magnitude/extent is an interpretive grammatical point, not from the provided tafsir; reviewer may remove it.
- **103:3:2:** Per the ayah QAC note, الذين is منصوب على الاستثناء from the genus noun الإنسان (connected exception after a complete affirmative clause); tagged exception, not restriction.
- **103:3:5:** QAC lemma is صالحات; lesson uses the singular base صَالِحَة (as lemmaFork). Treated as a substantivized participle and direct object of عملوا; an alternative analysis makes it an adjective of an elided object (الأعمال الصالحات).
- **103:3:6:** QAC lemma تَوَاصَ is truncated; citation form تَوَاصَى per the lexeme entry. Assimilation not tagged: the added tāʾ of form VI is unchanged. Same applies to 103:3:8. Bina' of تواصوا is given as a ḍamma muqaddara on the alif elided before the plural wāw (meeting of two sākins); some i'rab works instead say a fatḥa muqaddara on the elided alif. Applies to 103:3:8 too.

## Per-ayah sources

- **103:1:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=103&verse=1); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=103&verse=1); [Quran.com](https://quran.com/103/1).
- **103:2:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=103&verse=2); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=103&verse=2); [Quran.com](https://quran.com/103/2).
- **103:3:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=103&verse=3); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=103&verse=3); [Quran.com](https://quran.com/103/3).

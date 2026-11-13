# Surah 101 — Al-Qari'ah: source audit

Researched 2026-11-13. This lesson contains **11 ayahs and 36 word occurrences**. All Urdu word glosses, translations, grammatical explanations, dictionary summaries, verb-paradigm notes and concise tafsir notes are original AI-assisted editorial drafts. They are **not scholar-reviewed** and are not attributed to a named Urdu translator. No third-party Urdu book, dictionary, translation or tafsir was imported.

## Arabic inventory

`inventory-101.json` records the Quran.com Content API v4 `text_uthmani` word strings ([source](https://api.quran.com/api/v4/verses/by_chapter/101?words=true&word_fields=text_uthmani&per_page=50)), retrieved 2026-11-13, excluding end-of-ayah markers. Recitation signs that the API separates from a word by a space — waqf signs, the saktah sign, the sajdah sign and the rub al-hizb marker — are not part of the stored word token, following the Surahs 110–114 precedent. The inventory lists all 0 such exclusions with the original API text; no other character was changed. The unnumbered opening basmalah is not inserted as a numbered occurrence. Automated tests compare every stored word, its id and its segments with this inventory.

Word boundaries and counts match the Quranic Arabic Corpus morphology for every ayah. Per-ayah word counts: 1, 2, 4, 5, 4, 4, 4, 4, 2, 4, 2.

## Sources and method

- **Morphology:** Quranic Arabic Corpus morphology 0.4 (Kais Dukes, GNU GPL with the Corpus terms of use), a verbatim distribution checked by SHA-256 `910b721a8f04f4334ac5d4c62b19e858f5d720c525bb975f2e750ea2c6bb532d`. It was consulted locally for segmentation, part of speech, root, lemma, verb form, voice, mood and case; it is not bundled or redistributed.
- **Word types and roots** are derived deterministically from the Corpus stem tags with the mapping that reproduces root assignments for all 230 word occurrences of the existing lessons, including words with no root. A preposition with an attached pronoun (لَهُ، بِهِ، عَلَيْهِمْ) is a particle, following Surahs 1, 105 and 112. Words without a Corpus root, such as proper names, keep no root.
- **Syntax:** the Corpus word-by-word pages (English morphology and Arabic i‘rab for every word) and verse grammar pages (Arabic i‘rab notes adapted from the Quran Printing Complex), retrieved 2026-11-13. 1 of 11 verse pages carry no grammar note: 5.
- **Verb paradigms** (باب، ماضی، مضارع، وزن) for all 6 verb occurrences come from a shared library of 657 verb lexemes for this expansion edition. Form I vowel classes were decided from imperfects attested across the whole Corpus and standard lexica (Lane, Lisan al-Arab, al-Mu‘jam al-Wasit). The edition’s library review and subsequent corrections are recorded in its handoff and adjudication reports.
- **Tafsir consulted** through the Quran.com API: Tafsir al-Muyassar (Arabic), Tafsir al-Sa‘di (Arabic) and Ibn Kathir (abridged, English). Translations consulted for meaning only: Saheeh International and Mufti Taqi Usmani. The Urdu wording is original and concise; it is not a translation of these works.

Word-type, verb-form and passive-voice counts below apply the adjudicated occurrence overrides; they are not uncorrected Corpus tag counts.

| Measure | Count |
| --- | ---: |
| Nouns | 21 |
| Adjectives | 4 |
| Verbs | 6 |
| Particles | 3 |
| Pronouns | 2 |
| Passive verb occurrences | 0 |
| Distinct roots | 19 |
| Verb form I | 4 |
| Verb form IV | 2 |

## Editorial checks

The lesson is organized into 1 chunks of whole ayahs. No review-result snapshot was supplied. This source audit therefore does not certify completion of independent reviews, fixes or final confirmations. The intended workflow requires independent grammar and meaning/tafsir reviews and a clean final confirmation after every correction, including minor findings.
The chunk validator checks the exact Arabic word, segments that rejoin to the exact word, ids and order, rule references, verb-note presence, phrase coverage of every word, and the absence of URLs or Latin text. AI review and automated checks are not scholarly review.

Nouns without a Corpus root (root left empty): مَا، مَن، مَنْ، وَمَآ.

## Analysis decisions and cautions

Notes recorded by the authors and reviewers for scholarly review; they mark alternative analyses, source disagreements and editorial choices.

- **101:3:1:** QAC morphology and word iʿrab classify the wāw as a conjunction. The verse iʿrab calls the wāw resumptive and also describes the question as coordinated with the prior one. The prefix follows the explicit verse-level classification.
- **101:4:4:** The shared ف ر ش note covers bedding (فِرَاش, plural فُرُش). This occurrence is فَرَاش with initial fatḥa, the collective for moths or similar insects, as supported by the supplied tafsirs. The root mapping is unchanged.
- **101:6:2:** QAC morphology and word iʿrab tag مَن as conditional, but the verse iʿrab explicitly parses it as a relative mubtada. The فاء in 101:7:1 answers أَمَّا and introduces the relative subject’s predicate.
- **101:8:2:** QAC morphology and word iʿrab tag مَنْ as conditional. The verse iʿrab coordinates this construction with 101:6, where the noun is relative, and the note for 101:9 identifies its clause as the predicate of the second subject. The فاء answers أَمَّا.
- **101:9:1:** The gloss uses the abode reading supported by the supplied tafsirs. The tafsir summary also retains the reported headfirst-fall reading.
- **101:9:2:** The shared ه و ي note centers on desire. The occurrence uses the separate falling sense included in the root gloss, with هَاوِيَة naming the abyss of Hell in the supplied tafsirs. The root mapping is unchanged.
- **101:10:3:** The verse iʿrab identifies the whole inner question as the second object without assigning its two terms. The inner question is parsed with interrogative مَا as a fronted predicate and the definite pronoun as subject.
- **101:10:4:** QAC treats هِيَهْ as one PRON segment. The learner segmentation shows the syntactically inert hāʾ of pause separately and preserves the supplied spelling.

## Per-ayah sources

- **101:1:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=101&verse=1); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=101&verse=1); [Quran.com](https://quran.com/101/1).
- **101:2:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=101&verse=2); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=101&verse=2); [Quran.com](https://quran.com/101/2).
- **101:3:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=101&verse=3); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=101&verse=3); [Quran.com](https://quran.com/101/3).
- **101:4:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=101&verse=4); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=101&verse=4); [Quran.com](https://quran.com/101/4).
- **101:5:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=101&verse=5); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=101&verse=5); [Quran.com](https://quran.com/101/5).
- **101:6:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=101&verse=6); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=101&verse=6); [Quran.com](https://quran.com/101/6).
- **101:7:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=101&verse=7); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=101&verse=7); [Quran.com](https://quran.com/101/7).
- **101:8:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=101&verse=8); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=101&verse=8); [Quran.com](https://quran.com/101/8).
- **101:9:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=101&verse=9); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=101&verse=9); [Quran.com](https://quran.com/101/9).
- **101:10:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=101&verse=10); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=101&verse=10); [Quran.com](https://quran.com/101/10).
- **101:11:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=101&verse=11); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=101&verse=11); [Quran.com](https://quran.com/101/11).

# Surah 102 — At-Takathur: source audit

Researched 2026-11-13. This lesson contains **8 ayahs and 28 word occurrences**. All Urdu word glosses, translations, grammatical explanations, dictionary summaries, verb-paradigm notes and concise tafsir notes are original AI-assisted editorial drafts. They are **not scholar-reviewed** and are not attributed to a named Urdu translator. No third-party Urdu book, dictionary, translation or tafsir was imported.

## Arabic inventory

`inventory-102.json` records the Quran.com Content API v4 `text_uthmani` word strings ([source](https://api.quran.com/api/v4/verses/by_chapter/102?words=true&word_fields=text_uthmani&per_page=50)), retrieved 2026-11-13, excluding end-of-ayah markers. Recitation signs that the API separates from a word by a space — waqf signs, the saktah sign, the sajdah sign and the rub al-hizb marker — are not part of the stored word token, following the Surahs 110–114 precedent. The inventory lists all 0 such exclusions with the original API text; no other character was changed. The unnumbered opening basmalah is not inserted as a numbered occurrence. Automated tests compare every stored word, its id and its segments with this inventory.

Word boundaries and counts match the Quranic Arabic Corpus morphology for every ayah. Per-ayah word counts: 2, 3, 3, 4, 5, 2, 4, 5.

## Sources and method

- **Morphology:** Quranic Arabic Corpus morphology 0.4 (Kais Dukes, GNU GPL with the Corpus terms of use), a verbatim distribution checked by SHA-256 `910b721a8f04f4334ac5d4c62b19e858f5d720c525bb975f2e750ea2c6bb532d`. It was consulted locally for segmentation, part of speech, root, lemma, verb form, voice, mood and case; it is not bundled or redistributed.
- **Word types and roots** are derived deterministically from the Corpus stem tags with the mapping that reproduces root assignments for all 230 word occurrences of the existing lessons, including words with no root. A preposition with an attached pronoun (لَهُ، بِهِ، عَلَيْهِمْ) is a particle, following Surahs 1, 105 and 112. Words without a Corpus root, such as proper names, keep no root.
- **Syntax:** the Corpus word-by-word pages (English morphology and Arabic i‘rab for every word) and verse grammar pages (Arabic i‘rab notes adapted from the Quran Printing Complex), retrieved 2026-11-13. 2 of 8 verse pages carry no grammar note: 1, 8.
- **Verb paradigms** (باب، ماضی، مضارع، وزن) for all 8 verb occurrences come from a shared library of 657 verb lexemes for this expansion edition. Form I vowel classes were decided from imperfects attested across the whole Corpus and standard lexica (Lane, Lisan al-Arab, al-Mu‘jam al-Wasit). The edition’s library review and subsequent corrections are recorded in its handoff and adjudication reports.
- **Tafsir consulted** through the Quran.com API: Tafsir al-Muyassar (Arabic), Tafsir al-Sa‘di (Arabic) and Ibn Kathir (abridged, English). Translations consulted for meaning only: Saheeh International and Mufti Taqi Usmani. The Urdu wording is original and concise; it is not a translation of these works.

Word-type, verb-form and passive-voice counts below apply the adjudicated occurrence overrides; they are not uncorrected Corpus tag counts.

| Measure | Count |
| --- | ---: |
| Nouns | 9 |
| Adjectives | 0 |
| Verbs | 8 |
| Particles | 11 |
| Pronouns | 0 |
| Passive verb occurrences | 1 |
| Distinct roots | 11 |
| Verb form I | 7 |
| Verb form IV | 1 |

## Editorial checks

The lesson is organized into 1 chunks of whole ayahs. No review-result snapshot was supplied. This source audit therefore does not certify completion of independent reviews, fixes or final confirmations. The intended workflow requires independent grammar and meaning/tafsir reviews and a clean final confirmation after every correction, including minor findings.
The chunk validator checks the exact Arabic word, segments that rejoin to the exact word, ids and order, rule references, verb-note presence, phrase coverage of every word, and the absence of URLs or Latin text. AI review and automated checks are not scholarly review.

Nouns without a Corpus root (root left empty): يَوْمَئِذٍ.

## Analysis decisions and cautions

Notes recorded by the authors and reviewers for scholarly review; they mark alternative analyses, source disagreements and editorial choices.

- **102:1:2:** QAC tags the verbal noun takathur as form III; its pattern tafa'ul is the masdar of form VI (takathara). The lesson describes it as form VI; scholar to confirm.
- **102:2:1:** QAC word tag is INC (harf ibtida'), but the ayah i'rab note treats hatta as harf ghaya wa jarr with an interpreted masdar (an zurtum) attached to alhakum. The lesson follows the ayah note and mentions the inceptive analysis as an alternative.
- **102:2:3:** Lemma given as the singular maqbara per the guide (QAC lemma is the plural maqabir).
- **102:3:3:** Object of ta'lamun is elided per the ayah i'rab note; the same treatment is applied to 102:4:4.
- **102:4:1:** Ayah i'rab note: the sentence is coordinated on the preceding one and is not lafzi tawkid; the lesson follows this, although some grammarians treat the repetition as emphasis.
- **102:5:4:** QAC tags 'ilma as a plain noun (no VN feature); the ayah i'rab calls it maf'ul mutlaq, so the lesson treats it as the masdar of 'alima.
- **102:6:1:** QAC includes the plural waw in the stem taraw; the lesson segments it as the subject pronoun per the ayah i'rab (al-waw fa'il). Mood is indicative with the raf' nun elided before the heavy emphatic nun, per the ayah note. Same for 102:7:2.
- **102:7:3:** Follows the ayah i'rab: 'ayna is na'ib maf'ul mutlaq (attribute of an omitted masdar, ru'yata 'ayni l-yaqin). Sa'di glosses the seeing as visual; the reading of 'ayn as 'the essence of certainty' is not used.
- **102:8:2:** Ayah 8 has no QAC grammar note; analysed in parallel with 102:6-7 as a coordinated oath answer. The na'ib fa'il is the elided plural waw (tus'alunna < tus'aluna-nna).
- **102:8:3:** QAC treats yawma'idhin as one time-adverb stem with no root; the lesson splits it into yawma + idhin for learners, keeps root null, and explains the tanwin of compensation.

## Per-ayah sources

- **102:1:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=102&verse=1); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=102&verse=1); [Quran.com](https://quran.com/102/1).
- **102:2:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=102&verse=2); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=102&verse=2); [Quran.com](https://quran.com/102/2).
- **102:3:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=102&verse=3); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=102&verse=3); [Quran.com](https://quran.com/102/3).
- **102:4:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=102&verse=4); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=102&verse=4); [Quran.com](https://quran.com/102/4).
- **102:5:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=102&verse=5); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=102&verse=5); [Quran.com](https://quran.com/102/5).
- **102:6:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=102&verse=6); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=102&verse=6); [Quran.com](https://quran.com/102/6).
- **102:7:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=102&verse=7); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=102&verse=7); [Quran.com](https://quran.com/102/7).
- **102:8:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=102&verse=8); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=102&verse=8); [Quran.com](https://quran.com/102/8).

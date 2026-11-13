# Surah 104 — Al-Humazah: source audit

Researched 2026-11-13. This lesson contains **9 ayahs and 33 word occurrences**. All Urdu word glosses, translations, grammatical explanations, dictionary summaries, verb-paradigm notes and concise tafsir notes are original AI-assisted editorial drafts. They are **not scholar-reviewed** and are not attributed to a named Urdu translator. No third-party Urdu book, dictionary, translation or tafsir was imported.

## Arabic inventory

`inventory-104.json` records the Quran.com Content API v4 `text_uthmani` word strings ([source](https://api.quran.com/api/v4/verses/by_chapter/104?words=true&word_fields=text_uthmani&per_page=50)), retrieved 2026-11-13, excluding end-of-ayah markers. Recitation signs that the API separates from a word by a space — waqf signs, the saktah sign, the sajdah sign and the rub al-hizb marker — are not part of the stored word token, following the Surahs 110–114 precedent. The inventory lists all 1 such exclusions with the original API text; no other character was changed. The unnumbered opening basmalah is not inserted as a numbered occurrence. Automated tests compare every stored word, its id and its segments with this inventory.

Word boundaries and counts match the Quranic Arabic Corpus morphology for every ayah. Per-ayah word counts: 4, 4, 4, 4, 4, 3, 4, 3, 3.

## Sources and method

- **Morphology:** Quranic Arabic Corpus morphology 0.4 (Kais Dukes, GNU GPL with the Corpus terms of use), a verbatim distribution checked by SHA-256 `910b721a8f04f4334ac5d4c62b19e858f5d720c525bb975f2e750ea2c6bb532d`. It was consulted locally for segmentation, part of speech, root, lemma, verb form, voice, mood and case; it is not bundled or redistributed.
- **Word types and roots** are derived deterministically from the Corpus stem tags with the mapping that reproduces root assignments for all 230 word occurrences of the existing lessons, including words with no root. A preposition with an attached pronoun (لَهُ، بِهِ، عَلَيْهِمْ) is a particle, following Surahs 1, 105 and 112. Words without a Corpus root, such as proper names, keep no root.
- **Syntax:** the Corpus word-by-word pages (English morphology and Arabic i‘rab for every word) and verse grammar pages (Arabic i‘rab notes adapted from the Quran Printing Complex), retrieved 2026-11-13. All 9 verse pages carry a grammar note.
- **Verb paradigms** (باب، ماضی، مضارع، وزن) for all 7 verb occurrences come from a shared library of 657 verb lexemes for this expansion edition. Form I vowel classes were decided from imperfects attested across the whole Corpus and standard lexica (Lane, Lisan al-Arab, al-Mu‘jam al-Wasit). The edition’s library review and subsequent corrections are recorded in its handoff and adjudication reports.
- **Tafsir consulted** through the Quran.com API: Tafsir al-Muyassar (Arabic), Tafsir al-Sa‘di (Arabic) and Ibn Kathir (abridged, English). Translations consulted for meaning only: Saheeh International and Mufti Taqi Usmani. The Urdu wording is original and concise; it is not a translation of these works.

Word-type, verb-form and passive-voice counts below apply the adjudicated occurrence overrides; they are not uncorrected Corpus tag counts.

| Measure | Count |
| --- | ---: |
| Nouns | 15 |
| Adjectives | 2 |
| Verbs | 7 |
| Particles | 7 |
| Pronouns | 2 |
| Passive verb occurrences | 1 |
| Distinct roots | 19 |
| Verb form I | 3 |
| Verb form II | 1 |
| Verb form IV | 2 |
| Verb form VIII | 1 |

## Editorial checks

The lesson is organized into 1 chunks of whole ayahs. No review-result snapshot was supplied. This source audit therefore does not certify completion of independent reviews, fixes or final confirmations. The intended workflow requires independent grammar and meaning/tafsir reviews and a clean final confirmation after every correction, including minor findings.
The chunk validator checks the exact Arabic word, segments that rejoin to the exact word, ids and order, rule references, verb-note presence, phrase coverage of every word, and the absence of URLs or Latin text. AI review and automated checks are not scholarly review.

Nouns without a Corpus root (root left empty): مَا، وَمَآ، وَيْلٌۭ.

## Analysis decisions and cautions

Notes recorded by the authors and reviewers for scholarly review; they mark alternative analyses, source disagreements and editorial choices.

- **104:1:4:** QAC labels the token feminine. The reviewed root note treats the ta marbuta of the intensive pattern fuʿala as an intensifier rather than a feminine marker, parallel to 104:1:3. The lesson follows that account of its form and the ayah iʿrab reading as a genitive adjective. Initial lam shadda in the Corpus lemma reflects recitational assimilation; the dictionary lemma is ungeminated.
- **104:1:** The two intensive epithets overlap. The tafsir gives the distinction of disparagement through gestures and actions versus through speech as one reported explanation, alongside the general sense of reviling others.
- **104:5:1:** Word-level QAC gloss labels waw a conjunction, while the ayah-level iʿrab calls the question resumptive. The lesson follows the ayah-level analysis.
- **104:5:3:** The ayah iʿrab specifies the whole inner question as adra’s second object. Internally the lesson treats ma as the interrogative mubtada and al-hutama as its khabar. The reverse analysis (fronted interrogative khabar and delayed mubtada) is also recognized.
- **104:7:2:** The raw Corpus lemma omits initial hamzat al-wasl. The lesson uses the standard Form VIII citation form in the reviewed paradigm.
- **104:8:3:** QAC lists a nominative noun with root w-s-d and leaves the derivation unspecified. The lesson retains the noun type and describes the Form IV passive participle. The Hafs form has hamza where the same lexical family also yields an unhamzated form; lexicographers also cite hamzated asada as an analysis. The initial meem shadda belongs to recitational assimilation from the preceding word.
- **104:9:** The translation keeps the wording of extended columns. Saʿdi describes columns behind the gates, while the grouped Ibn Kathir commentary also reports columns over the prisoners and chains on their necks; the combined Muyassar passage describes extended chains and shackles. The tafsir presents the first two descriptions as reported interpretations.

## Per-ayah sources

- **104:1:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=104&verse=1); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=104&verse=1); [Quran.com](https://quran.com/104/1).
- **104:2:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=104&verse=2); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=104&verse=2); [Quran.com](https://quran.com/104/2).
- **104:3:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=104&verse=3); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=104&verse=3); [Quran.com](https://quran.com/104/3).
- **104:4:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=104&verse=4); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=104&verse=4); [Quran.com](https://quran.com/104/4).
- **104:5:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=104&verse=5); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=104&verse=5); [Quran.com](https://quran.com/104/5).
- **104:6:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=104&verse=6); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=104&verse=6); [Quran.com](https://quran.com/104/6).
- **104:7:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=104&verse=7); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=104&verse=7); [Quran.com](https://quran.com/104/7).
- **104:8:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=104&verse=8); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=104&verse=8); [Quran.com](https://quran.com/104/8).
- **104:9:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=104&verse=9); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=104&verse=9); [Quran.com](https://quran.com/104/9).

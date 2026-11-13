# Surah 93 — Ad-Duhaa: source audit

Researched 2026-11-13. This lesson contains **11 ayahs and 40 word occurrences**. All Urdu word glosses, translations, grammatical explanations, dictionary summaries, verb-paradigm notes and concise tafsir notes are original AI-assisted editorial drafts. They are **not scholar-reviewed** and are not attributed to a named Urdu translator. No third-party Urdu book, dictionary, translation or tafsir was imported.

## Arabic inventory

`inventory-93.json` records the Quran.com Content API v4 `text_uthmani` word strings ([source](https://api.quran.com/api/v4/verses/by_chapter/93?words=true&word_fields=text_uthmani&per_page=50)), retrieved 2026-11-13, excluding end-of-ayah markers. Recitation signs that the API separates from a word by a space — waqf signs, the saktah sign, the sajdah sign and the rub al-hizb marker — are not part of the stored word token, following the Surahs 110–114 precedent. The inventory lists all 0 such exclusions with the original API text; no other character was changed. The unnumbered opening basmalah is not inserted as a numbered occurrence. Automated tests compare every stored word, its id and its segments with this inventory.

Word boundaries and counts match the Quranic Arabic Corpus morphology for every ayah. Per-ayah word counts: 1, 3, 5, 5, 4, 4, 3, 3, 4, 4, 4.

## Sources and method

- **Morphology:** Quranic Arabic Corpus morphology 0.4 (Kais Dukes, GNU GPL with the Corpus terms of use), a verbatim distribution checked by SHA-256 `910b721a8f04f4334ac5d4c62b19e858f5d720c525bb975f2e750ea2c6bb532d`. It was consulted locally for segmentation, part of speech, root, lemma, verb form, voice, mood and case; it is not bundled or redistributed.
- **Word types and roots** are derived deterministically from the Corpus stem tags with the mapping that reproduces root assignments for all 230 word occurrences of the existing lessons, including words with no root. A preposition with an attached pronoun (لَهُ، بِهِ، عَلَيْهِمْ) is a particle, following Surahs 1, 105 and 112. Words without a Corpus root, such as proper names, keep no root.
- **Syntax:** the Corpus word-by-word pages (English morphology and Arabic i‘rab for every word) and verse grammar pages (Arabic i‘rab notes adapted from the Quran Printing Complex), retrieved 2026-11-13. 3 of 11 verse pages carry no grammar note: 1, 7, 8.
- **Verb paradigms** (باب، ماضی، مضارع، وزن) for all 14 verb occurrences come from a shared library of 657 verb lexemes for this expansion edition. Form I vowel classes were decided from imperfects attested across the whole Corpus and standard lexica (Lane, Lisan al-Arab, al-Mu‘jam al-Wasit), and every entry was independently reviewed.
- **Tafsir consulted** through the Quran.com API: Tafsir al-Muyassar (Arabic), Tafsir al-Sa‘di (Arabic) and Ibn Kathir (abridged, English). Translations consulted for meaning only: Saheeh International and Mufti Taqi Usmani. The Urdu wording is original and concise; it is not a translation of these works.

Word-type, verb-form and passive-voice counts below apply the adjudicated occurrence overrides; they are not uncorrected Corpus tag counts.

| Measure | Count |
| --- | ---: |
| Nouns | 15 |
| Adjectives | 0 |
| Verbs | 14 |
| Particles | 11 |
| Pronouns | 0 |
| Passive verb occurrences | 0 |
| Distinct roots | 23 |
| Verb form I | 9 |
| Verb form II | 2 |
| Verb form IV | 3 |

## Editorial checks

The lesson is organized into 1 chunks of whole ayahs. No review-result snapshot was supplied. This source audit therefore does not certify completion of independent reviews, fixes or final confirmations. The intended workflow requires independent grammar and meaning/tafsir reviews and a clean final confirmation after every correction, including minor findings.
The chunk validator checks the exact Arabic word, segments that rejoin to the exact word, ids and order, rule references, verb-note presence, phrase coverage of every word, and the absence of URLs or Latin text. AI review and automated checks are not scholarly review.

Nouns without a Corpus root (root left empty): إِذَا.

## Corrections to Corpus tags

These occurrences carry an adjudicated correction or a documented source/analysis disagreement. The lessons follow the recorded contextual analysis; the raw Corpus data itself is unchanged.

- **93:8:3** فَأَغْنَىٰ: QAC tags فَأَغْنَىٰ as Form I; the vocalised Hafs word belongs to أَغْنَى (Form IV), as decided and double-reviewed in the edition-2 verb-paradigm library entry (>agonaY`|I|ACT). The lexeme handle is kept; follow the reviewed paradigm.

## Analysis decisions and cautions

Notes recorded by the authors and reviewers for scholarly review; they mark alternative analyses, source disagreements and editorial choices.

- **93:2:2:** Verse i‘rab explicitly treats idha as a pure temporal adverb attached to the understood oath verb, without a separate conditional answer.
- **93:4:1:** The word line labels the waw resumptive and the lam emphatic. The verse i‘rab gives coordination to the prior oath answer and a lam in the answer of a renewed implied oath, which the lesson follows.
- **93:5:1:** The word line labels the waw resumptive and the lam emphatic. The verse i‘rab specifically analyzes this as a clause coordinated to the oath answer with an oath-answer lam.
- **93:8:3:** The adjudicated packet override corrects the raw Form I tag to Form IV. The visible prefixed hamza and the reviewed paradigm support Form IV. The raw lexeme handle is preserved.
- **93:9:3:** Verse i‘rab identifies this fa as the connector answering amma. The word-level line calls it coordinating.
- **93:10:3:** The fa is the answer connector of amma, in parallel with 93:9. The word-level line calls it coordinating.
- **93:11:4:** The construction with amma takes an answer-linking fa before the imperative. The word-level line calls the fa resumptive.

## Per-ayah sources

- **93:1:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=93&verse=1); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=93&verse=1); [Quran.com](https://quran.com/93/1).
- **93:2:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=93&verse=2); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=93&verse=2); [Quran.com](https://quran.com/93/2).
- **93:3:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=93&verse=3); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=93&verse=3); [Quran.com](https://quran.com/93/3).
- **93:4:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=93&verse=4); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=93&verse=4); [Quran.com](https://quran.com/93/4).
- **93:5:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=93&verse=5); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=93&verse=5); [Quran.com](https://quran.com/93/5).
- **93:6:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=93&verse=6); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=93&verse=6); [Quran.com](https://quran.com/93/6).
- **93:7:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=93&verse=7); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=93&verse=7); [Quran.com](https://quran.com/93/7).
- **93:8:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=93&verse=8); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=93&verse=8); [Quran.com](https://quran.com/93/8).
- **93:9:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=93&verse=9); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=93&verse=9); [Quran.com](https://quran.com/93/9).
- **93:10:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=93&verse=10); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=93&verse=10); [Quran.com](https://quran.com/93/10).
- **93:11:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=93&verse=11); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=93&verse=11); [Quran.com](https://quran.com/93/11).

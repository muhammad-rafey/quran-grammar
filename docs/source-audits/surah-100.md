# Surah 100 — Al-'Adiyat: source audit

Researched 2026-11-13. This lesson contains **11 ayahs and 40 word occurrences**. All Urdu word glosses, translations, grammatical explanations, dictionary summaries, verb-paradigm notes and concise tafsir notes are original AI-assisted editorial drafts. They are **not scholar-reviewed** and are not attributed to a named Urdu translator. No third-party Urdu book, dictionary, translation or tafsir was imported.

## Arabic inventory

`inventory-100.json` records the Quran.com Content API v4 `text_uthmani` word strings ([source](https://api.quran.com/api/v4/verses/by_chapter/100?words=true&word_fields=text_uthmani&per_page=50)), retrieved 2026-11-13, excluding end-of-ayah markers. Recitation signs that the API separates from a word by a space — waqf signs, the saktah sign, the sajdah sign and the rub al-hizb marker — are not part of the stored word token, following the Surahs 110–114 precedent. The inventory lists all 1 such exclusions with the original API text; no other character was changed. The unnumbered opening basmalah is not inserted as a numbered occurrence. Automated tests compare every stored word, its id and its segments with this inventory.

Word boundaries and counts match the Quranic Arabic Corpus morphology for every ayah. Per-ayah word counts: 2, 2, 2, 3, 3, 4, 4, 4, 7, 4, 5.

## Sources and method

- **Morphology:** Quranic Arabic Corpus morphology 0.4 (Kais Dukes, GNU GPL with the Corpus terms of use), a verbatim distribution checked by SHA-256 `910b721a8f04f4334ac5d4c62b19e858f5d720c525bb975f2e750ea2c6bb532d`. It was consulted locally for segmentation, part of speech, root, lemma, verb form, voice, mood and case; it is not bundled or redistributed.
- **Word types and roots** are derived deterministically from the Corpus stem tags with the mapping that reproduces root assignments for all 230 word occurrences of the existing lessons, including words with no root. A preposition with an attached pronoun (لَهُ، بِهِ، عَلَيْهِمْ) is a particle, following Surahs 1, 105 and 112. Words without a Corpus root, such as proper names, keep no root.
- **Syntax:** the Corpus word-by-word pages (English morphology and Arabic i‘rab for every word) and verse grammar pages (Arabic i‘rab notes adapted from the Quran Printing Complex), retrieved 2026-11-13. 1 of 11 verse pages carry no grammar note: 10.
- **Verb paradigms** (باب، ماضی، مضارع، وزن) for all 5 verb occurrences come from a shared library of 657 verb lexemes for this expansion edition. Form I vowel classes were decided from imperfects attested across the whole Corpus and standard lexica (Lane, Lisan al-Arab, al-Mu‘jam al-Wasit). The edition’s library review and subsequent corrections are recorded in its handoff and adjudication reports.
- **Tafsir consulted** through the Quran.com API: Tafsir al-Muyassar (Arabic), Tafsir al-Sa‘di (Arabic) and Ibn Kathir (abridged, English). Translations consulted for meaning only: Saheeh International and Mufti Taqi Usmani. The Urdu wording is original and concise; it is not a translation of these works.

Word-type, verb-form and passive-voice counts below apply the adjudicated occurrence overrides; they are not uncorrected Corpus tag counts.

| Measure | Count |
| --- | ---: |
| Nouns | 21 |
| Adjectives | 0 |
| Verbs | 5 |
| Particles | 11 |
| Pronouns | 3 |
| Passive verb occurrences | 2 |
| Distinct roots | 23 |
| Verb form I | 2 |
| Verb form II | 1 |
| Verb form IV | 1 |
| Verb form QI | 1 |

## Editorial checks

The lesson is organized into 1 chunks of whole ayahs. No review-result snapshot was supplied. This source audit therefore does not certify completion of independent reviews, fixes or final confirmations. The intended workflow requires independent grammar and meaning/tafsir reviews and a clean final confirmation after every correction, including minor findings.
The chunk validator checks the exact Arabic word, segments that rejoin to the exact word, ids and order, rule references, verb-note presence, phrase coverage of every word, and the absence of URLs or Latin text. AI review and automated checks are not scholarly review.

Nouns without a Corpus root (root left empty): إِذَا، يَوْمَئِذٍۢ.

## Corrections to Corpus tags

These occurrences carry an adjudicated correction or a documented source/analysis disagreement. The lessons follow the recorded contextual analysis; the raw Corpus data itself is unchanged.

- **100:9:4** بُعْثِرَ: QAC tags بُعْثِرَ as Form I; the vocalised Hafs word belongs to بُعْثِرَ (Form QI), as decided and double-reviewed in the edition-2 verb-paradigm library entry (buEovira|I|PASS). The lexeme handle is kept; follow the reviewed paradigm.

## Analysis decisions and cautions

Notes recorded by the authors and reviewers for scholarly review; they mark alternative analyses, source disagreements and editorial choices.

- **100:1:1:** The primary tafsirs and translations here take the runners as horses. The supplied ض ب ح root note records the alternative of camels; the Urdu tafsir acknowledges that view. The supplied ع د و note describes exceeding/passing, but does not list the contextual sense of running.
- **100:2:1:** The supplied و ر ي root entry describes concealment/direction, but lacks the ignition sense of أَوْرَى. The QAC Form IV active participle, the two Arabic tafsirs and the supplied ق د ح root note support the latter sense here.
- **100:3:1:** The supplied غ ي ر root entry discusses difference and change, and its note only explains غَيْر. QAC tags the present word as a Form IV active participle, and both Arabic tafsirs support أَغَارَ in the sense of raiding.
- **100:3:2:** The supplied ص ب ح root note says the root occurs only as the deficient verb أَصْبَحَ / يُصْبِحُ in the covered surahs. Here QAC and the ayah iʿrab identify صُبْحًۭا as the overt time adverb meaning at dawn.
- **100:5:2:** For the referent of the hāʾ, the Urdu follows al-Saʿdi and al-Muyassar (the horses enter among the enemy with their riders). The supplied abridged Ibn Kathir connects the expression to entering the same place in the midst of the enemy.
- **100:5:3:** The English word glosses say collectively, but the QAC ayah iʿrab identifies an explicit direct object. Both Arabic tafsirs and Taqi Usmani support the enemy host as the referent.
- **100:7:1:** Al-Saʿdi and the supplied abridged Ibn Kathir record both the human and Allah as possible antecedents of the hāʾ. The translation takes the human as antecedent following Taqi Usmani; the tafsir records the alternative.
- **100:8:4:** The translation follows al-Saʿdi and the English translations in taking this as intense love of wealth. The supplied abridged Ibn Kathir also gives covetousness or stinginess due to love of wealth, reflected in the tafsir.
- **100:9:1:** The prefixed fāʾ follows the QAC word iʿrab as supplemental; an alternative analysis treats it as coordinating.
- **100:9:3:** The QAC ayah iʿrab treats إِذَا as a time adverb without a conditional protasis, attached to the recompense implied by the predicate in 100:11. The Urdu translation uses an explicit temporal link for fluency.
- **100:9:4:** Followed the packet correction: بُعْثِرَ is a passive Form QI quadriliteral perfect, not a triliteral Form I. The retained raw lexeme handle supplies the corrected paradigm.
- **100:11:1:** The QAC ayah iʿrab treats the complete إِنَّ clause as filling the two object slots of يَعْلَمُ in 100:9; the lām in the predicate accounts for the initial kasra of إِنَّ.
- **100:11:2:** Sahih International and the Arabic sources use a third-person plural possessive, as do QAC and the vocalised word. The Taqi Usmani line in the packet says your Lord; the Urdu follows their Lord.

## Per-ayah sources

- **100:1:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=100&verse=1); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=100&verse=1); [Quran.com](https://quran.com/100/1).
- **100:2:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=100&verse=2); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=100&verse=2); [Quran.com](https://quran.com/100/2).
- **100:3:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=100&verse=3); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=100&verse=3); [Quran.com](https://quran.com/100/3).
- **100:4:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=100&verse=4); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=100&verse=4); [Quran.com](https://quran.com/100/4).
- **100:5:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=100&verse=5); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=100&verse=5); [Quran.com](https://quran.com/100/5).
- **100:6:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=100&verse=6); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=100&verse=6); [Quran.com](https://quran.com/100/6).
- **100:7:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=100&verse=7); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=100&verse=7); [Quran.com](https://quran.com/100/7).
- **100:8:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=100&verse=8); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=100&verse=8); [Quran.com](https://quran.com/100/8).
- **100:9:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=100&verse=9); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=100&verse=9); [Quran.com](https://quran.com/100/9).
- **100:10:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=100&verse=10); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=100&verse=10); [Quran.com](https://quran.com/100/10).
- **100:11:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=100&verse=11); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=100&verse=11); [Quran.com](https://quran.com/100/11).

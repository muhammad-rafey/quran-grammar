# Surah 94 — Ash-Sharh: source audit

Researched 2026-11-13. This lesson contains **8 ayahs and 27 word occurrences**. All Urdu word glosses, translations, grammatical explanations, dictionary summaries, verb-paradigm notes and concise tafsir notes are original AI-assisted editorial drafts. They are **not scholar-reviewed** and are not attributed to a named Urdu translator. No third-party Urdu book, dictionary, translation or tafsir was imported.

## Arabic inventory

`inventory-94.json` records the Quran.com Content API v4 `text_uthmani` word strings ([source](https://api.quran.com/api/v4/verses/by_chapter/94?words=true&word_fields=text_uthmani&per_page=50)), retrieved 2026-11-13, excluding end-of-ayah markers. Recitation signs that the API separates from a word by a space — waqf signs, the saktah sign, the sajdah sign and the rub al-hizb marker — are not part of the stored word token, following the Surahs 110–114 precedent. The inventory lists all 0 such exclusions with the original API text; no other character was changed. The unnumbered opening basmalah is not inserted as a numbered occurrence. Automated tests compare every stored word, its id and its segments with this inventory.

Word boundaries and counts match the Quranic Arabic Corpus morphology for every ayah. Per-ayah word counts: 4, 3, 3, 3, 4, 4, 3, 3.

## Sources and method

- **Morphology:** Quranic Arabic Corpus morphology 0.4 (Kais Dukes, GNU GPL with the Corpus terms of use), a verbatim distribution checked by SHA-256 `910b721a8f04f4334ac5d4c62b19e858f5d720c525bb975f2e750ea2c6bb532d`. It was consulted locally for segmentation, part of speech, root, lemma, verb form, voice, mood and case; it is not bundled or redistributed.
- **Word types and roots** are derived deterministically from the Corpus stem tags with the mapping that reproduces root assignments for all 230 word occurrences of the existing lessons, including words with no root. A preposition with an attached pronoun (لَهُ، بِهِ، عَلَيْهِمْ) is a particle, following Surahs 1, 105 and 112. Words without a Corpus root, such as proper names, keep no root.
- **Syntax:** the Corpus word-by-word pages (English morphology and Arabic i‘rab for every word) and verse grammar pages (Arabic i‘rab notes adapted from the Quran Printing Complex), retrieved 2026-11-13. 3 of 8 verse pages carry no grammar note: 1, 2, 4.
- **Verb paradigms** (باب، ماضی، مضارع، وزن) for all 7 verb occurrences come from a shared library of 657 verb lexemes for this expansion edition. Form I vowel classes were decided from imperfects attested across the whole Corpus and standard lexica (Lane, Lisan al-Arab, al-Mu‘jam al-Wasit), and every entry was independently reviewed.
- **Tafsir consulted** through the Quran.com API: Tafsir al-Muyassar (Arabic), Tafsir al-Sa‘di (Arabic) and Ibn Kathir (abridged, English). Translations consulted for meaning only: Saheeh International and Mufti Taqi Usmani. The Urdu wording is original and concise; it is not a translation of these works.

Word-type, verb-form and passive-voice counts below apply the adjudicated occurrence overrides; they are not uncorrected Corpus tag counts.

| Measure | Count |
| --- | ---: |
| Nouns | 10 |
| Adjectives | 0 |
| Verbs | 7 |
| Particles | 9 |
| Pronouns | 1 |
| Passive verb occurrences | 0 |
| Distinct roots | 14 |
| Verb form I | 6 |
| Verb form IV | 1 |

## Editorial checks

The lesson is organized into 1 chunks of whole ayahs. No review-result snapshot was supplied. This source audit therefore does not certify completion of independent reviews, fixes or final confirmations. The intended workflow requires independent grammar and meaning/tafsir reviews and a clean final confirmation after every correction, including minor findings.
The chunk validator checks the exact Arabic word, segments that rejoin to the exact word, ids and order, rule references, verb-note presence, phrase coverage of every word, and the absence of URLs or Latin text. AI review and automated checks are not scholarly review.

Nouns without a Corpus root (root left empty): فَإِذَا.

## Analysis decisions and cautions

Notes recorded by the authors and reviewers for scholarly review; they mark alternative analyses, source disagreements and editorial choices.

- **94:2:3:** QAC tags وِزْر as feminine (F). The word is masculine: it is described by the masculine relative ٱلَّذِىٓ (94:3, i'rab: نعت لـ«وزرك») and lexica treat it as masculine. Written as masculine.
- **94:2:1:** QAC calls the wāw عاطفة without naming the coordinated clause. The lesson explains it as coordinated with the affirmative sense of أَلَمْ نَشْرَحْ (= شَرَحْنَا), a common grammarians' explanation that is not stated in the packet i'rab; reviewer should confirm wording.
- **94:5:1:** Word i'rab calls the فَ عاطفة (QAC CONJ), while the ayah note says الجملة مستأنفة. The lesson follows the ayah note and tags resumption. The consoling statement remains connected in meaning to the preceding verses.
- **94:5:2:** QAC tags مَعَ (94:5:2 and 94:6:2) as P with i'rab حرف جر, but the ayah note says «مع» ظرف مكان متعلق بالخبر, and classical grammar treats مَعَ as an adverbial noun. The app pos (particle) is kept, posUrdu reads «ظرف (ایپ کے زمرے میں حرف)», syntax follows the ayah note, and the adverb rule is tagged. Reviewer should confirm the posUrdu wording.
- **94:6:1:** The ayah note calls 94:6 مستأنفة; many i'rab works call it توكيد لفظي of 94:5. Sa'di reads the repetition as one definite hardship and two indefinite eases; Ibn Kathir as reaffirmation. Lesson presents the emphasis reading and Sa'di's point.
- **94:7:1:** QAC i'rab gives only ظرف زمان for إِذَا; the lesson adds the standard analysis (conditional adverb in محل نصب attached to its answer فَٱنصَبْ, with فَرَغْتَ as its muḍāf ilayh clause in محل جر).
- **94:7:2:** QAC lemma string فَرَغْ is truncated; lemma written as the paradigm citation فَرَغَ per the lexeme entry (فَرَغَ يَفْرُغُ).
- **94:7:3:** QAC files فَٱنصَبْ under LEM nuSibato (passive of نَصَبَ 'set up'). Following the reviewed lexeme entry, the lesson treats it as the imperative of نَصِبَ يَنْصَبُ 'toil' (fatha on ṣād), lemma نَصِبَ.
- **94:7:** Sa'di's main reading: when free from worldly occupations, strive in worship and supplication; he also reports (وقد قيل) that it means: when finished with prayer, strive in du'a. Both are given, the second as «بعض مفسرین کے نزدیک».
- **94:8:3:** Word i'rab calls the فَ عاطفة (QAC CONJ), while the ayah note says الفاء رابطة لجواب شرط مقدر (إذا سألت فارغب إلى ربك). The lesson follows the ayah note (condition-answer + elision) and mentions the عاطفة label.
- **94:8:1:** The restrictive sense of fronting إِلَىٰ رَبِّكَ before فَٱرْغَب follows Muyassar and Sa'di (وحده); the packet i'rab does not state it explicitly.

## Per-ayah sources

- **94:1:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=94&verse=1); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=94&verse=1); [Quran.com](https://quran.com/94/1).
- **94:2:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=94&verse=2); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=94&verse=2); [Quran.com](https://quran.com/94/2).
- **94:3:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=94&verse=3); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=94&verse=3); [Quran.com](https://quran.com/94/3).
- **94:4:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=94&verse=4); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=94&verse=4); [Quran.com](https://quran.com/94/4).
- **94:5:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=94&verse=5); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=94&verse=5); [Quran.com](https://quran.com/94/5).
- **94:6:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=94&verse=6); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=94&verse=6); [Quran.com](https://quran.com/94/6).
- **94:7:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=94&verse=7); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=94&verse=7); [Quran.com](https://quran.com/94/7).
- **94:8:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=94&verse=8); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=94&verse=8); [Quran.com](https://quran.com/94/8).

# Surah 97 — Al-Qadr: source audit

Researched 2026-11-13. This lesson contains **5 ayahs and 30 word occurrences**. All Urdu word glosses, translations, grammatical explanations, dictionary summaries, verb-paradigm notes and concise tafsir notes are original AI-assisted editorial drafts. They are **not scholar-reviewed** and are not attributed to a named Urdu translator. No third-party Urdu book, dictionary, translation or tafsir was imported.

## Arabic inventory

`inventory-97.json` records the Quran.com Content API v4 `text_uthmani` word strings ([source](https://api.quran.com/api/v4/verses/by_chapter/97?words=true&word_fields=text_uthmani&per_page=50)), retrieved 2026-11-13, excluding end-of-ayah markers. Recitation signs that the API separates from a word by a space — waqf signs, the saktah sign, the sajdah sign and the rub al-hizb marker — are not part of the stored word token, following the Surahs 110–114 precedent. The inventory lists all 0 such exclusions with the original API text; no other character was changed. The unnumbered opening basmalah is not inserted as a numbered occurrence. Automated tests compare every stored word, its id and its segments with this inventory.

Word boundaries and counts match the Quranic Arabic Corpus morphology for every ayah. Per-ayah word counts: 5, 5, 6, 9, 5.

## Sources and method

- **Morphology:** Quranic Arabic Corpus morphology 0.4 (Kais Dukes, GNU GPL with the Corpus terms of use), a verbatim distribution checked by SHA-256 `910b721a8f04f4334ac5d4c62b19e858f5d720c525bb975f2e750ea2c6bb532d`. It was consulted locally for segmentation, part of speech, root, lemma, verb form, voice, mood and case; it is not bundled or redistributed.
- **Word types and roots** are derived deterministically from the Corpus stem tags with the mapping that reproduces root assignments for all 230 word occurrences of the existing lessons, including words with no root. A preposition with an attached pronoun (لَهُ، بِهِ، عَلَيْهِمْ) is a particle, following Surahs 1, 105 and 112. Words without a Corpus root, such as proper names, keep no root.
- **Syntax:** the Corpus word-by-word pages (English morphology and Arabic i‘rab for every word) and verse grammar pages (Arabic i‘rab notes adapted from the Quran Printing Complex), retrieved 2026-11-13. 1 of 5 verse pages carry no grammar note: 1.
- **Verb paradigms** (باب، ماضی، مضارع، وزن) for all 3 verb occurrences come from a shared library of 657 verb lexemes for this expansion edition. Form I vowel classes were decided from imperfects attested across the whole Corpus and standard lexica (Lane, Lisan al-Arab, al-Mu‘jam al-Wasit). The edition’s library review and subsequent corrections are recorded in its handoff and adjudication reports.
- **Tafsir consulted** through the Quran.com API: Tafsir al-Muyassar (Arabic), Tafsir al-Sa‘di (Arabic) and Ibn Kathir (abridged, English). Translations consulted for meaning only: Saheeh International and Mufti Taqi Usmani. The Urdu wording is original and concise; it is not a translation of these works.

Word-type, verb-form and passive-voice counts below apply the adjudicated occurrence overrides; they are not uncorrected Corpus tag counts.

| Measure | Count |
| --- | ---: |
| Nouns | 20 |
| Adjectives | 0 |
| Verbs | 3 |
| Particles | 6 |
| Pronouns | 1 |
| Passive verb occurrences | 0 |
| Distinct roots | 16 |
| Verb form IV | 2 |
| Verb form V | 1 |

## Editorial checks

The lesson is organized into 1 chunks of whole ayahs. No review-result snapshot was supplied. This source audit therefore does not certify completion of independent reviews, fixes or final confirmations. The intended workflow requires independent grammar and meaning/tafsir reviews and a clean final confirmation after every correction, including minor findings.
The chunk validator checks the exact Arabic word, segments that rejoin to the exact word, ids and order, rule references, verb-note presence, phrase coverage of every word, and the absence of URLs or Latin text. AI review and automated checks are not scholarly review.

Nouns without a Corpus root (root left empty): مَا، وَمَآ.

## Analysis decisions and cautions

Notes recorded by the authors and reviewers for scholarly review; they mark alternative analyses, source disagreements and editorial choices.

- **97:2:1:** QAC word i'rab calls the wa عاطفة (CONJ), while the ayah note calls the clause «وما أدراك» مستأنفة. The lesson tags conjunction per QAC and states both; either way the clause has no syntactic position.
- **97:2:2:** Per the ayah i'rab, كَ is the first object of أدرى and the clause «ما ليلة القدر» the second object (the lexeme entry calls this taʿlīq). The zanna rule was not tagged because the i'rab does not use المعلق/سدت مسد.
- **97:2:3:** QAC word i'rab only says اسم استفهام. The lesson takes ما as mubtada and ليلة as khabar (commonly given), and mentions the alternative ما = خبر مقدم, ليلة = مبتدأ مؤخر.
- **97:4:1:** تَنَزَّلُ = تَتَنَزَّلُ with one tāʾ elided. Grammarians differ on whether the elided tāʾ is the imperfect prefix or the Form V tāʾ, so the lesson only says that one tāʾ is dropped. QAC mood null is read as indicative (ḍamma visible).
- **97:4:3:** الروح = Jibril: Muyassar states it directly; Ibn Kathir reports it as 'it is said'. Ibn Kathir also notes the coordination of a specific item onto a general one (عطف الخاص على العام).
- **97:4:7:** The ayah i'rab attaches «من كل أمر» to تنزل. Sahih International renders it as purpose ('for every matter') and Taqi Usmani as accompaniment ('along with every command'). Ibn Kathir reports Mujahid's reading of peace concerning every matter, which links the phrase to سلام. The lesson's tafsir mentions this view.
- **97:4:6:** The Taqi Usmani English translation has 'your Lord' for رَبِّهِم; the Urdu follows the Arabic 3MP pronoun ('their/their own Lord').
- **97:5:1:** The ayah i'rab says the clause (هي سلام) is معترضة between حتى مطلع and its governor تنزل. Another common analysis attaches حتى مطلع الفجر to سلام. The lesson follows the i'rab and mentions the alternative. QAC tags سلام plain N (not VN), so it is not called a masdar.
- **97:5:4:** مَطْلَع (Ḥafṣ, fatḥa on lām) is taught as a noun of time on مَفْعَل (from يَطْلُعُ); it can also be taken as a masdar mīmī (= طلوع, cf. Saʿdī 'طلوع الفجر', Sahih Int. 'emergence'). The root entry ط ل ع gives مَطْلِع in the sense of a place of rising and omits the form مَطْلَع used in 97:5.
- **97:5:5:** Library issue: the noteUrdu of root ف ج ر ends with «مگر یہاں صرف پانی جاری کرنے کا معنی ہے», which is wrong for this occurrence (فجر = dawn). The lesson gives the dawn sense and links it to the root's core meaning of splitting/bursting forth. The shared root note should be made occurrence-neutral.

## Per-ayah sources

- **97:1:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=97&verse=1); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=97&verse=1); [Quran.com](https://quran.com/97/1).
- **97:2:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=97&verse=2); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=97&verse=2); [Quran.com](https://quran.com/97/2).
- **97:3:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=97&verse=3); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=97&verse=3); [Quran.com](https://quran.com/97/3).
- **97:4:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=97&verse=4); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=97&verse=4); [Quran.com](https://quran.com/97/4).
- **97:5:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=97&verse=5); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=97&verse=5); [Quran.com](https://quran.com/97/5).

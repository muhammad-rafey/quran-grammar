# Surah 87 — Al-A'la: source audit

Researched 2026-11-13. This lesson contains **19 ayahs and 72 word occurrences**. All Urdu word glosses, translations, grammatical explanations, dictionary summaries, verb-paradigm notes and concise tafsir notes are original AI-assisted editorial drafts. They are **not scholar-reviewed** and are not attributed to a named Urdu translator. No third-party Urdu book, dictionary, translation or tafsir was imported.

## Arabic inventory

`inventory-87.json` records the Quran.com Content API v4 `text_uthmani` word strings ([source](https://api.quran.com/api/v4/verses/by_chapter/87?words=true&word_fields=text_uthmani&per_page=50)), retrieved 2026-11-13, excluding end-of-ayah markers. Recitation signs that the API separates from a word by a space — waqf signs, the saktah sign, the sajdah sign and the rub al-hizb marker — are not part of the stored word token, following the Surahs 110–114 precedent. The inventory lists all 1 such exclusions with the original API text; no other character was changed. The unnumbered opening basmalah is not inserted as a numbered occurrence. Automated tests compare every stored word, its id and its segments with this inventory.

Word boundaries and counts match the Quranic Arabic Corpus morphology for every ayah. Per-ayah word counts: 4, 3, 3, 3, 3, 3, 9, 2, 4, 3, 2, 4, 6, 4, 4, 4, 3, 5, 3.

## Sources and method

- **Morphology:** Quranic Arabic Corpus morphology 0.4 (Kais Dukes, GNU GPL with the Corpus terms of use), a verbatim distribution checked by SHA-256 `910b721a8f04f4334ac5d4c62b19e858f5d720c525bb975f2e750ea2c6bb532d`. It was consulted locally for segmentation, part of speech, root, lemma, verb form, voice, mood and case; it is not bundled or redistributed.
- **Word types and roots** are derived deterministically from the Corpus stem tags with the mapping that reproduces root assignments for all 230 word occurrences of the existing lessons, including words with no root. A preposition with an attached pronoun (لَهُ، بِهِ، عَلَيْهِمْ) is a particle, following Surahs 1, 105 and 112. Words without a Corpus root, such as proper names, keep no root.
- **Syntax:** the Corpus word-by-word pages (English morphology and Arabic i‘rab for every word) and verse grammar pages (Arabic i‘rab notes adapted from the Quran Printing Complex), retrieved 2026-11-13. 3 of 19 verse pages carry no grammar note: 4, 13, 18.
- **Verb paradigms** (باب، ماضی، مضارع، وزن) for all 26 verb occurrences come from a shared library of 657 verb lexemes for this expansion edition. Form I vowel classes were decided from imperfects attested across the whole Corpus and standard lexica (Lane, Lisan al-Arab, al-Mu‘jam al-Wasit). The edition’s library review and subsequent corrections are recorded in its handoff and adjudication reports.
- **Tafsir consulted** through the Quran.com API: Tafsir al-Muyassar (Arabic), Tafsir al-Sa‘di (Arabic) and Ibn Kathir (abridged, English). Translations consulted for meaning only: Saheeh International and Mufti Taqi Usmani. The Urdu wording is original and concise; it is not a translation of these works.

Word-type, verb-form and passive-voice counts below apply the adjudicated occurrence overrides; they are not uncorrected Corpus tag counts.

| Measure | Count |
| --- | ---: |
| Nouns | 20 |
| Adjectives | 5 |
| Verbs | 26 |
| Particles | 12 |
| Pronouns | 9 |
| Passive verb occurrences | 0 |
| Distinct roots | 41 |
| Verb form I | 13 |
| Verb form II | 6 |
| Verb form IV | 4 |
| Verb form V | 3 |

## Editorial checks

The lesson is organized into 2 chunks of whole ayahs. No review-result snapshot was supplied. This source audit therefore does not certify completion of independent reviews, fixes or final confirmations. The intended workflow requires independent grammar and meaning/tafsir reviews and a clean final confirmation after every correction, including minor findings.
The chunk validator checks the exact Arabic word, segments that rejoin to the exact word, ids and order, rule references, verb-note presence, phrase coverage of every word, and the absence of URLs or Latin text. AI review and automated checks are not scholarly review.

Nouns without a Corpus root (root left empty): إِبْرَٰهِيمَ، وَمُوسَىٰ.

## Analysis decisions and cautions

Notes recorded by the authors and reviewers for scholarly review; they mark alternative analyses, source disagreements and editorial choices.

- **87:1:4:** QAC takes ٱلْأَعْلَى as a نعت of رَبِّكَ, with an implied kasra. An alternative takes it as a صفة of ٱسْمَ, with an implied fatḥa.
- **87:2:2:** The objects of خَلَقَ، سَوَّىٰ، قَدَّرَ and هَدَىٰ are elided. For هَدَىٰ the object is each creature, and what suits it is the destination of guidance in Muyassar.
- **87:4:3:** ٱلْمَرْعَىٰ is on the مَفْعَل pattern (QAC plain N). It can denote the grazing place or the herbage itself; tafsir (الكلأ الأخضر) supports herbage, so noun-of-place-time was not tagged.
- **87:5:3:** QAC takes أَحْوَىٰ as the نعت of غُثَآءً, the second object of جَعَلَ. Another iʿrāb analysis takes أَحْوَىٰ as a ḥāl of ٱلْمَرْعَىٰ, describing its dark green colour when it was brought forth. The supplied tafsir supports the QAC reading used here.
- **87:6:1:** QAC marks only the كاف as مفعول به; the second object of أَقْرَأَ (the Qur'an, per Muyassar) is understood. Lemma written as citation form أَقْرَأَ per the lexeme entry (QAC lemma نُقْرِئُ is inflected).
- **87:6:2:** The QAC word-level iʿrāb marks the fāʾ as resumptive (REM). The ayah-level iʿrāb treats it as a conjunction coordinating فَلَا تَنسَىٰٓ with سَنُقْرِئُكَ. The lesson follows the ayah-level analysis and tags conjunction.
- **87:6:3:** QAC treats the negation as non-governing and the verb as indicative, consistent with the retained final alif. Ibn Kathir also reports a prohibitive interpretation, mentioned in the ayah 6 tafsir and the dictionary note for فَلَا.
- **87:7:1:** QAC calls إِلَّا أداة استثناء and مَا a relative mustathnā. With no stated mustathnā minhu in the negative clause, the restriction tag follows the mufarragh analysis, in which مَا is the object of تَنسَىٰٓ.
- **87:7:2:** The QAC ayah iʿrāb identifies مَا as a relative pronoun in the exception. The resumptive direct object in شَآءَ ٱللَّهُ is elided.
- **87:8:2:** QAC tags the stem as N (FS). It is the feminine elative of أَيْسَر, used substantivally for the easiest way, so the noun type is retained and comparative is tagged.
- **87:9:1:** The raw QAC lemma looks passive (ذُكِّرَ), but the tagged occurrence is an active Form II imperative. The lemma follows the verified active paradigm.
- **87:9:** The opening command supplies the sense of the omitted conditional answer, as in the ayah i‘rab. It is parsed as an independent imperative, not as an overt answer clause.
- **87:10:3:** The object of fearing is understood as Allah from the translations and tafsir. The verb also allows an absolute reading that emphasizes the person's quality of reverence.
- **87:13:3:** The raw QAC lemma مَّاتَ carries an initial shadda from assimilation. The supplied active paradigm gives the citation form مَاتَ.
- **87:13:4:** QAC's English morphology calls the suffix an object pronoun. Here it is in a genitive position after the preposition, as the i‘rab and segmentation indicate.
- **87:13:6:** The raw QAC lemma حَىَّ represents the assimilated perfect حَيَّ. The supplied paradigm uses the unassimilated citation form حَيِيَ, which displays the two identical yāʾ radicals separately.
- **87:14:** The tafsir gives a general reading of self-purification. Purifying one's wealth, including through zakat al-fitr in a reported application, is also included in the supplied commentary.
- **87:15:1:** The ayah-level note prints وذكِّر for the coordinated clause. The vocalized word, segments and word-level i‘rab show وَذَكَرَ, an active Form I perfect.
- **87:15:** Al-Sa‘di includes the Eid prayer as an application of the wording alongside the general reading of remembrance and prayer.
- **87:16:2:** The corpus groups the final wāw and nūn under the suffix tag. The word i‘rab assigns only wāw to the subject; retained nūn is the indicative marker.
- **87:17:1:** The word-level QAC line calls the wāw coordinating, while the ayah-level analysis describes an independent clause. The lesson takes the wāw as resumptive; clause-level coordination is also possible.
- **87:18:** The supplied tafsir gives both a broad reference to the surah's teaching and a narrower reference to the preceding passage on purification, remembrance, prayer and the Hereafter.

## Per-ayah sources

- **87:1:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=87&verse=1); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=87&verse=1); [Quran.com](https://quran.com/87/1).
- **87:2:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=87&verse=2); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=87&verse=2); [Quran.com](https://quran.com/87/2).
- **87:3:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=87&verse=3); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=87&verse=3); [Quran.com](https://quran.com/87/3).
- **87:4:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=87&verse=4); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=87&verse=4); [Quran.com](https://quran.com/87/4).
- **87:5:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=87&verse=5); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=87&verse=5); [Quran.com](https://quran.com/87/5).
- **87:6:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=87&verse=6); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=87&verse=6); [Quran.com](https://quran.com/87/6).
- **87:7:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=87&verse=7); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=87&verse=7); [Quran.com](https://quran.com/87/7).
- **87:8:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=87&verse=8); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=87&verse=8); [Quran.com](https://quran.com/87/8).
- **87:9:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=87&verse=9); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=87&verse=9); [Quran.com](https://quran.com/87/9).
- **87:10:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=87&verse=10); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=87&verse=10); [Quran.com](https://quran.com/87/10).
- **87:11:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=87&verse=11); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=87&verse=11); [Quran.com](https://quran.com/87/11).
- **87:12:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=87&verse=12); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=87&verse=12); [Quran.com](https://quran.com/87/12).
- **87:13:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=87&verse=13); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=87&verse=13); [Quran.com](https://quran.com/87/13).
- **87:14:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=87&verse=14); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=87&verse=14); [Quran.com](https://quran.com/87/14).
- **87:15:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=87&verse=15); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=87&verse=15); [Quran.com](https://quran.com/87/15).
- **87:16:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=87&verse=16); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=87&verse=16); [Quran.com](https://quran.com/87/16).
- **87:17:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=87&verse=17); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=87&verse=17); [Quran.com](https://quran.com/87/17).
- **87:18:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=87&verse=18); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=87&verse=18); [Quran.com](https://quran.com/87/18).
- **87:19:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=87&verse=19); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=87&verse=19); [Quran.com](https://quran.com/87/19).

# Surah 86 — At-Tariq: source audit

Researched 2026-11-13. This lesson contains **17 ayahs and 61 word occurrences**. All Urdu word glosses, translations, grammatical explanations, dictionary summaries, verb-paradigm notes and concise tafsir notes are original AI-assisted editorial drafts. They are **not scholar-reviewed** and are not attributed to a named Urdu translator. No third-party Urdu book, dictionary, translation or tafsir was imported.

## Arabic inventory

`inventory-86.json` records the Quran.com Content API v4 `text_uthmani` word strings ([source](https://api.quran.com/api/v4/verses/by_chapter/86?words=true&word_fields=text_uthmani&per_page=50)), retrieved 2026-11-13, excluding end-of-ayah markers. Recitation signs that the API separates from a word by a space — waqf signs, the saktah sign, the sajdah sign and the rub al-hizb marker — are not part of the stored word token, following the Surahs 110–114 precedent. The inventory lists all 0 such exclusions with the original API text; no other character was changed. The unnumbered opening basmalah is not inserted as a numbered occurrence. Automated tests compare every stored word, its id and its segments with this inventory.

Word boundaries and counts match the Quranic Arabic Corpus morphology for every ayah. Per-ayah word counts: 2, 4, 2, 6, 4, 4, 5, 4, 3, 6, 3, 3, 3, 3, 3, 2, 4.

## Sources and method

- **Morphology:** Quranic Arabic Corpus morphology 0.4 (Kais Dukes, GNU GPL with the Corpus terms of use), a verbatim distribution checked by SHA-256 `910b721a8f04f4334ac5d4c62b19e858f5d720c525bb975f2e750ea2c6bb532d`. It was consulted locally for segmentation, part of speech, root, lemma, verb form, voice, mood and case; it is not bundled or redistributed.
- **Word types and roots** are derived deterministically from the Corpus stem tags with the mapping that reproduces root assignments for all 230 word occurrences of the existing lessons, including words with no root. A preposition with an attached pronoun (لَهُ، بِهِ، عَلَيْهِمْ) is a particle, following Surahs 1, 105 and 112. Words without a Corpus root, such as proper names, keep no root.
- **Syntax:** the Corpus word-by-word pages (English morphology and Arabic i‘rab for every word) and verse grammar pages (Arabic i‘rab notes adapted from the Quran Printing Complex), retrieved 2026-11-13. 1 of 17 verse pages carry no grammar note: 12.
- **Verb paradigms** (باب، ماضی، مضارع، وزن) for all 10 verb occurrences come from a shared library of 657 verb lexemes for this expansion edition. Form I vowel classes were decided from imperfects attested across the whole Corpus and standard lexica (Lane, Lisan al-Arab, al-Mu‘jam al-Wasit). The edition’s library review and subsequent corrections are recorded in its handoff and adjudication reports.
- **Tafsir consulted** through the Quran.com API: Tafsir al-Muyassar (Arabic), Tafsir al-Sa‘di (Arabic) and Ibn Kathir (abridged, English). Translations consulted for meaning only: Saheeh International and Mufti Taqi Usmani. The Urdu wording is original and concise; it is not a translation of these works.

Word-type, verb-form and passive-voice counts below apply the adjudicated occurrence overrides; they are not uncorrected Corpus tag counts.

| Measure | Count |
| --- | ---: |
| Nouns | 32 |
| Adjectives | 3 |
| Verbs | 10 |
| Particles | 15 |
| Pronouns | 1 |
| Passive verb occurrences | 3 |
| Distinct roots | 33 |
| Verb form I | 7 |
| Verb form II | 1 |
| Verb form IV | 2 |

## Editorial checks

The lesson is organized into 2 chunks of whole ayahs. No review-result snapshot was supplied. This source audit therefore does not certify completion of independent reviews, fixes or final confirmations. The intended workflow requires independent grammar and meaning/tafsir reviews and a clean final confirmation after every correction, including minor findings.
The chunk validator checks the exact Arabic word, segments that rejoin to the exact word, ids and order, rule references, verb-note presence, phrase coverage of every word, and the absence of URLs or Latin text. AI review and automated checks are not scholarly review.

Nouns without a Corpus root (root left empty): ذَاتِ، مَا، وَمَآ.

## Analysis decisions and cautions

Notes recorded by the authors and reviewers for scholarly review; they mark alternative analyses, source disagreements and editorial choices.

- **86:2:1:** QAC word i'rab labels this waw CONJ (عاطفة); the ayah grammar note calls it مستأنفة. Followed the ayah note and tagged resumption.
- **86:2:2:** Followed the QAC note: ka is the first object and the clause ma al-tariq the second object of adra. Alternative analysis: adra (= a'lama) takes three objects and the interrogative clause stands in place of the second and third (ta'liq).
- **86:2:3:** Taught ma as mubtada and al-tariq as khabar (common analysis); some grammarians reverse the two. QAC word i'rab only says اسم استفهام.
- **86:4:4:** QAC tags lamma EXP with i'rab أداة استثناء; the ayah note calls it أداة حصر بمعنى إلا. Taught as restriction after negative in (Hafs reading lamma with shadda). The reading lama with light mim (in lightened, ma extra) is a different qira'a and is not taught.
- **86:4:5:** Inside the khabar clause, taught 'alayha as fronted khabar and hafiz as delayed mubtada. A known alternative takes hafiz as fa'il of the prepositional phrase (which relies on a preceding mubtada).
- **86:5:1:** QAC word i'rab labels the fa CONJ (عاطفة); the ayah note calls it استئنافية. Followed the ayah note (resumption). The final kasra is the jussive sukun moved to kasra to avoid two sakins before al-insan.
- **86:5:3:** QAC tags the ma of mimma REL; the ayah grammar note says it is interrogative (الاستفهامية) with its alif elided. Followed the note: taught interrogative, not relative, and did not use the relative rule.
- **86:6:4:** Taught dafiq as active participle per QAC; noted the grammarians' view that it is fa'il in the sense of maf'ul (madfuq), as in the root entry.
- **86:7:5:** QAC lemma is the plural t~araA^}ib with MP; per the guide the lemma field gives the singular base tariba. Root t-r-b is the QAC grouping; no etymological link to turab is claimed. Diptote fa'a'il pattern takes kasra here because of al.
- **86:7:** Tafsir differs: Ibn Kathir and Muyassar take the backbone of the man and the chest of the woman; Sa'di also gives the view that both belong to the man and inclines to it. Both views presented.
- **86:8:3:** QAC tags raj' as plain noun (N), not verbal noun, so the verbal-noun rule was not used, though its meaning is the masdar of raja'a (to bring back). Pronoun taken as referring to man; Sa'di mentions and rejects the view that it means returning the fluid.
- **86:9:1:** The ayah i‘rab attaches the time adverb to the preceding predicate قَادِر. Alternatives attach it to the preceding verbal noun رَجْع or supply an implied imperative اذكر.
- **86:9:3:** The lesson supplies the singular dictionary lemma سَرِيرَة for the QAC plural lemma سَرَائِر.
- **86:10:1:** The QAC morphology and word i‘rab identify a coordinating fāʾ, while the ayah i‘rab explicitly makes it resumptive. The lesson follows the ayah i‘rab. The fronted predicate and delayed mubtada support taking مَا as non-governing.
- **86:10:5:** The QAC word i‘rab calls لَا a negative particle. It is also described as extra for strengthening the negation (زائدة لتأكيد النفي), without any change to the following noun’s case.
- **86:11:2:** The feminine dictionary form ذَات is used for both occurrences. QAC files them under ذُو. Both have ordinary vowel case endings. The 86:12 ayah note is blank, and its parallel syntax with 86:11 supports a genitive attributive modifier.
- **86:13:1:** The attached pronoun refers to the Qur’an in the provided tafsir, as adopted here. An alternative takes it as an anticipatory pronoun of the matter (ضمير الشأن), with a nominal clause as the predicate.
- **86:13:3:** QAC tags the occurrence as an adjective, and the word i‘rab confirms its attributive role. Lexically it is a verbal noun used adjectivally (وصف بالمصدر).
- **86:14:3:** QAC treats مَا as governing like لَيْسَ, giving the khabar accusative position and surface genitive from extra bāʾ. Under the alternative non-governing analysis, the predicate has nominative position.
- **86:15:3:** The word i‘rab gives only اسم منصوب for both occurrences of كَيْد. The verified verb lexeme identifies the verbal noun, supporting the cognate accusative (مفعول مطلق) analysis in 86:15 and 86:16.
- **86:16:1:** The word i‘rab and morphology tag the wāw as coordinating, while the ayah note calls the clause circumstantial. The lesson follows the ayah note and supplies an implied mubtada before the affirmative imperfect, yielding وَأَنَا أَكِيدُ.
- **86:17:4:** The ayah i‘rab treats رُوَيْد as a substitute for the cognate accusative and a diminutive of إِرْوَاد formed by tarḫīm. An alternative takes it as modifying an omitted إِمْهَال. The shared ر و د entry describes its forms solely as derivatives of أَرَادَ and lacks this separate lexical formation and sense.

## Per-ayah sources

- **86:1:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=86&verse=1); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=86&verse=1); [Quran.com](https://quran.com/86/1).
- **86:2:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=86&verse=2); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=86&verse=2); [Quran.com](https://quran.com/86/2).
- **86:3:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=86&verse=3); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=86&verse=3); [Quran.com](https://quran.com/86/3).
- **86:4:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=86&verse=4); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=86&verse=4); [Quran.com](https://quran.com/86/4).
- **86:5:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=86&verse=5); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=86&verse=5); [Quran.com](https://quran.com/86/5).
- **86:6:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=86&verse=6); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=86&verse=6); [Quran.com](https://quran.com/86/6).
- **86:7:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=86&verse=7); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=86&verse=7); [Quran.com](https://quran.com/86/7).
- **86:8:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=86&verse=8); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=86&verse=8); [Quran.com](https://quran.com/86/8).
- **86:9:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=86&verse=9); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=86&verse=9); [Quran.com](https://quran.com/86/9).
- **86:10:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=86&verse=10); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=86&verse=10); [Quran.com](https://quran.com/86/10).
- **86:11:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=86&verse=11); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=86&verse=11); [Quran.com](https://quran.com/86/11).
- **86:12:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=86&verse=12); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=86&verse=12); [Quran.com](https://quran.com/86/12).
- **86:13:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=86&verse=13); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=86&verse=13); [Quran.com](https://quran.com/86/13).
- **86:14:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=86&verse=14); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=86&verse=14); [Quran.com](https://quran.com/86/14).
- **86:15:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=86&verse=15); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=86&verse=15); [Quran.com](https://quran.com/86/15).
- **86:16:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=86&verse=16); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=86&verse=16); [Quran.com](https://quran.com/86/16).
- **86:17:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=86&verse=17); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=86&verse=17); [Quran.com](https://quran.com/86/17).

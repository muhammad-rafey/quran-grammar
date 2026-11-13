# Surah 90 — Al-Balad: source audit

Researched 2026-11-13. This lesson contains **20 ayahs and 82 word occurrences**. All Urdu word glosses, translations, grammatical explanations, dictionary summaries, verb-paradigm notes and concise tafsir notes are original AI-assisted editorial drafts. They are **not scholar-reviewed** and are not attributed to a named Urdu translator. No third-party Urdu book, dictionary, translation or tafsir was imported.

## Arabic inventory

`inventory-90.json` records the Quran.com Content API v4 `text_uthmani` word strings ([source](https://api.quran.com/api/v4/verses/by_chapter/90?words=true&word_fields=text_uthmani&per_page=50)), retrieved 2026-11-13, excluding end-of-ayah markers. Recitation signs that the API separates from a word by a space — waqf signs, the saktah sign, the sajdah sign and the rub al-hizb marker — are not part of the stored word token, following the Surahs 110–114 precedent. The inventory lists all 0 such exclusions with the original API text; no other character was changed. The unnumbered opening basmalah is not inserted as a numbered occurrence. Automated tests compare every stored word, its id and its segments with this inventory.

Word boundaries and counts match the Quranic Arabic Corpus morphology for every ayah. Per-ayah word counts: 4, 4, 3, 5, 6, 4, 5, 4, 2, 2, 3, 4, 2, 6, 3, 4, 9, 3, 6, 3.

## Sources and method

- **Morphology:** Quranic Arabic Corpus morphology 0.4 (Kais Dukes, GNU GPL with the Corpus terms of use), a verbatim distribution checked by SHA-256 `910b721a8f04f4334ac5d4c62b19e858f5d720c525bb975f2e750ea2c6bb532d`. It was consulted locally for segmentation, part of speech, root, lemma, verb form, voice, mood and case; it is not bundled or redistributed.
- **Word types and roots** are derived deterministically from the Corpus stem tags with the mapping that reproduces root assignments for all 230 word occurrences of the existing lessons, including words with no root. A preposition with an attached pronoun (لَهُ، بِهِ، عَلَيْهِمْ) is a particle, following Surahs 1, 105 and 112. Words without a Corpus root, such as proper names, keep no root.
- **Syntax:** the Corpus word-by-word pages (English morphology and Arabic i‘rab for every word) and verse grammar pages (Arabic i‘rab notes adapted from the Quran Printing Complex), retrieved 2026-11-13. 4 of 20 verse pages carry no grammar note: 9, 16, 19, 20.
- **Verb paradigms** (باب، ماضی، مضارع، وزن) for all 18 verb occurrences come from a shared library of 658 verb lexemes for this expansion edition. Form I vowel classes were decided from imperfects attested across the whole Corpus and standard lexica (Lane, Lisan al-Arab, al-Mu‘jam al-Wasit). The edition’s library review and subsequent corrections are recorded in its handoff and adjudication reports.
- **Tafsir consulted** through the Quran.com API: Tafsir al-Muyassar (Arabic), Tafsir al-Sa‘di (Arabic) and Ibn Kathir (abridged, English). Translations consulted for meaning only: Saheeh International and Mufti Taqi Usmani. The Urdu wording is original and concise; it is not a translation of these works.

Word-type, verb-form and passive-voice counts below apply the adjudicated occurrence overrides; they are not uncorrected Corpus tag counts.

| Measure | Count |
| --- | ---: |
| Nouns | 37 |
| Adjectives | 2 |
| Verbs | 18 |
| Particles | 17 |
| Pronouns | 8 |
| Passive verb occurrences | 0 |
| Distinct roots | 45 |
| Verb form I | 11 |
| Verb form IV | 4 |
| Verb form VI | 2 |
| Verb form VIII | 1 |

## Editorial checks

The lesson is organized into 3 chunks of whole ayahs. No review-result snapshot was supplied. This source audit therefore does not certify completion of independent reviews, fixes or final confirmations. The intended workflow requires independent grammar and meaning/tafsir reviews and a clean final confirmation after every correction, including minor findings.
The chunk validator checks the exact Arabic word, segments that rejoin to the exact word, ids and order, rule references, verb-note presence, phrase coverage of every word, and the absence of URLs or Latin text. AI review and automated checks are not scholarly review.

Nouns without a Corpus root (root left empty): ذَا، ذِى، مَا، وَمَآ.

## Analysis decisions and cautions

Notes recorded by the authors and reviewers for scholarly review; they mark alternative analyses, source disagreements and editorial choices.

- **90:1:1:** QAC tags la as NEG and the ayah i'rab says la nafiya, negating the oath to magnify what is sworn by. A common alternative treats it as extra (za'ida) for emphasis; Ibn Kathir reports from Mujahid that it rejects the Quraysh's claim. The tafsir all read the verse as an oath, so the translation keeps the oath meaning.
- **90:2:1:** Word-level i'rab labels the waw 'atifa, but the ayah grammar note says the clause wa-anta hillun is haliyya. Followed the ayah note (haal rule).
- **90:2:2:** hill: the tafsir give two readings: made lawful for the Prophet (fighting in Makkah for part of a day; Ibn Abbas and others, Muyassar under 90:1) and residing in it (Muyassar under 90:2, Sa'di). The translation glosses it as 'lawful (and free)' and the tafsir summary gives both.
- **90:3:2:** ma refers to rational beings (offspring). Referent disputed in Ibn Kathir: Adam and his children (majority), Ibrahim and his progeny (Abu Imran al-Jawni), or every father and child (Ibn Jarir). The tafsir summary gives all three.
- **90:3:3:** The resumptive object pronoun of the sila (walada-hu) is elided. This is a standard analysis; the packet i'rab gives only fi'l madi.
- **90:4:4:** fi kabadin attaches to an implied hal of al-insan, as the ayah i'rab states. Sa'di also allows a second meaning (upright, strong constitution), mentioned as a minority view in the tafsir.
- **90:5:2:** QAC morphology tags an as SUB and the word i'rab says harf masdari, while the ayah grammar note says it is lightened from anna, its ism is the implied damir al-sha'n and lan yaqdira ... is its khabar; the masdar fills both objects of hasiba. Followed the ayah note: tagged lightened-particle + pronoun-of-matter, not masdar-particle, per that rule's boundary. yaqdira is mansub by lan, not by an.
- **90:6:4:** lubad: QAC tags it a masculine singular adjective (fu'al). Some lexicographers treat it as the plural of lubda; the lesson follows QAC.
- **90:7:2:** The ayah grammar note refers back to 90:5 (taqaddama i'rabuha). The same lightened-an analysis is applied, with lam yarahu ahadun as the khabar.
- **90:7:4:** ra'a here means seeing with the eye (one object, hu), so zanna/two-objects are not tagged. The jussive is shown by dropping the final alif (yara > yara-).
- **90:8:2:** Per the ayah i'rab (الجار «له» متعلق بـ«نجعل»، وهو بمعنى نخلق) جَعَلَ here has one object (create/make), so zanna/two-objects are not tagged. The jussive sukun on the final lām is unwritten because of idghām into لَّهُۥ.
- **90:9:2:** QAC lemma is the dual شَفَتَيْن; the lesson gives the singular base شَفَة per the guide and the root entry (ش ف ه, final hāʾ elided).
- **90:10:** Translation keeps the rhetorical question of 90:8 running through 90:10, with implied (کیا)/(نہیں) in parentheses; grammatically وَهَدَيْنَـٰهُ is an affirmative perfect coordinated with the clause أَلَمْ نَجْعَل (whose sense is affirmative: جعلنا).
- **90:10:2:** QAC lemma is the dual نَّجْدَيْن; the lesson gives the singular نَجْد. Interpretation as the paths of good and evil follows Muyassar and Sa'di; other classical readings (not in the provided tafsir) are not mentioned.
- **90:11:1:** QAC and Sa'di read لَا as negation of the past (لم يقتحم); Muyassar paraphrases as exhortation (فهلا تجاوز), noted in the tafsir with «بعض مفسرین». Grammarians also discuss a non-repeated لَا before a perfect (often explained as repeated in meaning by ثُمَّ كَانَ in 90:17); not taught in the lesson.
- **90:12:1:** Word i'rab calls the wāw عاطفة (followed: conjunction), while the ayah note calls the sentence مستأنفة. QAC word line gives مَا only as اسم استفهام; the lesson uses the standard analysis مَا مبتدأ with the أَدْرَىٰكَ clause as khabar.
- **90:12:2:** Ayah note: جملة «ما العقبة» مفعول ثان (suspension by the interrogative). zanna was not tagged because the i'rab does not use المعلق/سدت مسد; two-objects is tagged. The built-on-implied-fatḥa statement is standard for an alif-final perfect.
- **90:12:3:** Alternative analysis: مَا khabar muqaddam and ٱلْعَقَبَةُ mubtada mu'akhkhar; the lesson uses مَا mubtada, ٱلْعَقَبَةُ khabar.
- **90:13:1:** QAC tags فَكُّ as a plain noun (no VN tag); the root entry calls it a masdar, so it is described as a masdar in dictionaryUrdu but verbal-noun is not tagged. Khabar of an elided mubtada هي per the ayah note. Another canonical reading has verbs (فَكَّ رَقَبَةً أَوْ أَطْعَمَ); the lesson follows Ḥafṣ only.
- **90:14:3:** QAC does not state the attachment of فِى يَوْمٍۢ; the lesson attaches it to the masdar إِطْعَـٰمٌۭ (the usual i'rab).
- **90:14:6:** مَسْغَبَة is called مصدر میمی per the root entry; QAC tags it a plain noun, so verbal-noun is not tagged. Same pattern analysis (مَفْعَلَة) is used for مَقْرَبَة and مَتْرَبَة without a masdar claim.
- **90:15:2:** QAC lemma for ذَا (90:15:2, 90:16:3) is ذَا; the lemma fork and the five-nouns analysis give ذُو, used in the lesson.
- **90:15:1:** يَتِيمًۭا is the object of the tanwīn masdar إِطْعَـٰمٌۭ per the ayah note; مِسْكِينًۭا (90:16:2) is coordinated on it.
- **90:17:1:** The ayah note makes the ثم clause coordinate with «لا اقتحم» (90:11). Muyassar glosses it as 'together with those deeds he was among the believers'; some grammarians take ثُمَّ here as ranking (تراخي رتبي) rather than time. The lesson keeps the neutral 'then'.
- **90:17:2:** QAC word i'rab says only فعل ماض. The lesson treats كان as nāqiṣa with a hidden ism هو (the human addressed in the surah) and مِنَ ٱلَّذِينَ attached to the elided khabar, which is the standard analysis.
- **90:17:6:** Lemma written as تَوَاصَى (citation form from the reviewed lexeme entry); QAC's lemma تَوَاصَ is truncated. Same for 90:17:8.
- **90:17:9:** مَرْحَمَة (pattern مَفْعَلَة) is often described as a maṣdar mīmī; QAC tags it a plain noun (N), so the verbal-noun rule was not used and the lesson only names the pattern.
- **90:18:2:** Lemma given as the singular صَاحِب per the guide; QAC's lemma is the plural أَصْحَٰب. Same for 90:19:5.
- **90:19:4:** QAC word i'rab gives only ضمير منفصل and the ayah note is empty. The lesson takes هُمْ as a second mubtada with أَصْحَـٰبُ as its khabar and the clause as khabar of ٱلَّذِينَ; the alternative is ضمير فصل (no syntactic position), with أَصْحَـٰبُ then the khabar of ٱلَّذِينَ directly.
- **90:20:1:** Ayah note is empty. The lesson analyses عليهم as fronted khabar (متعلق بمحذوف) and نار as delayed mubtada. The whole clause may be read as a new sentence or as a further khabar about ٱلَّذِينَ of 90:19; the lesson does not commit to either.
- **90:20:3:** QAC tags مُّؤْصَدَةٌۢ ADJ with root و ص د (not 'passive participle'), so the participle rule was not used; the lesson only notes it has the shape of a form IV passive participle. In Ḥafṣ the word is read with hamza; lexicographers relate it either to أَوْصَدَ (hamza for wāw) or to آصَدَ (root أ ص د). The shadda on the mīm reflects idghām of the preceding tanwīn.

## Per-ayah sources

- **90:1:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=90&verse=1); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=90&verse=1); [Quran.com](https://quran.com/90/1).
- **90:2:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=90&verse=2); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=90&verse=2); [Quran.com](https://quran.com/90/2).
- **90:3:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=90&verse=3); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=90&verse=3); [Quran.com](https://quran.com/90/3).
- **90:4:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=90&verse=4); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=90&verse=4); [Quran.com](https://quran.com/90/4).
- **90:5:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=90&verse=5); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=90&verse=5); [Quran.com](https://quran.com/90/5).
- **90:6:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=90&verse=6); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=90&verse=6); [Quran.com](https://quran.com/90/6).
- **90:7:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=90&verse=7); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=90&verse=7); [Quran.com](https://quran.com/90/7).
- **90:8:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=90&verse=8); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=90&verse=8); [Quran.com](https://quran.com/90/8).
- **90:9:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=90&verse=9); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=90&verse=9); [Quran.com](https://quran.com/90/9).
- **90:10:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=90&verse=10); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=90&verse=10); [Quran.com](https://quran.com/90/10).
- **90:11:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=90&verse=11); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=90&verse=11); [Quran.com](https://quran.com/90/11).
- **90:12:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=90&verse=12); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=90&verse=12); [Quran.com](https://quran.com/90/12).
- **90:13:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=90&verse=13); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=90&verse=13); [Quran.com](https://quran.com/90/13).
- **90:14:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=90&verse=14); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=90&verse=14); [Quran.com](https://quran.com/90/14).
- **90:15:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=90&verse=15); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=90&verse=15); [Quran.com](https://quran.com/90/15).
- **90:16:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=90&verse=16); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=90&verse=16); [Quran.com](https://quran.com/90/16).
- **90:17:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=90&verse=17); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=90&verse=17); [Quran.com](https://quran.com/90/17).
- **90:18:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=90&verse=18); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=90&verse=18); [Quran.com](https://quran.com/90/18).
- **90:19:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=90&verse=19); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=90&verse=19); [Quran.com](https://quran.com/90/19).
- **90:20:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=90&verse=20); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=90&verse=20); [Quran.com](https://quran.com/90/20).

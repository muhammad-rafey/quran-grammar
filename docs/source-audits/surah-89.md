# Surah 89 — Al-Fajr: source audit

Researched 2026-11-13. This lesson contains **30 ayahs and 137 word occurrences**. All Urdu word glosses, translations, grammatical explanations, dictionary summaries, verb-paradigm notes and concise tafsir notes are original AI-assisted editorial drafts. They are **not scholar-reviewed** and are not attributed to a named Urdu translator. No third-party Urdu book, dictionary, translation or tafsir was imported.

## Arabic inventory

`inventory-89.json` records the Quran.com Content API v4 `text_uthmani` word strings ([source](https://api.quran.com/api/v4/verses/by_chapter/89?words=true&word_fields=text_uthmani&per_page=50)), retrieved 2026-11-13, excluding end-of-ayah markers. Recitation signs that the API separates from a word by a space — waqf signs, the saktah sign, the sajdah sign and the rub al-hizb marker — are not part of the stored word token, following the Surahs 110–114 precedent. The inventory lists all 2 such exclusions with the original API text; no other character was changed. The unnumbered opening basmalah is not inserted as a numbered occurrence. Automated tests compare every stored word, its id and its segments with this inventory.

Word boundaries and counts match the Quranic Arabic Corpus morphology for every ayah. Per-ayah word counts: 1, 2, 2, 3, 6, 6, 3, 6, 5, 3, 4, 3, 5, 3, 11, 10, 5, 5, 4, 4, 6, 5, 9, 4, 5, 4, 3, 5, 3, 2.

## Sources and method

- **Morphology:** Quranic Arabic Corpus morphology 0.4 (Kais Dukes, GNU GPL with the Corpus terms of use), a verbatim distribution checked by SHA-256 `910b721a8f04f4334ac5d4c62b19e858f5d720c525bb975f2e750ea2c6bb532d`. It was consulted locally for segmentation, part of speech, root, lemma, verb form, voice, mood and case; it is not bundled or redistributed.
- **Word types and roots** are derived deterministically from the Corpus stem tags with the mapping that reproduces root assignments for all 230 word occurrences of the existing lessons, including words with no root. A preposition with an attached pronoun (لَهُ، بِهِ، عَلَيْهِمْ) is a particle, following Surahs 1, 105 and 112. Words without a Corpus root, such as proper names, keep no root.
- **Syntax:** the Corpus word-by-word pages (English morphology and Arabic i‘rab for every word) and verse grammar pages (Arabic i‘rab notes adapted from the Quran Printing Complex), retrieved 2026-11-13. 4 of 30 verse pages carry no grammar note: 1, 3, 18, 30.
- **Verb paradigms** (باب، ماضی، مضارع، وزن) for all 32 verb occurrences come from a shared library of 657 verb lexemes for this expansion edition. Form I vowel classes were decided from imperfects attested across the whole Corpus and standard lexica (Lane, Lisan al-Arab, al-Mu‘jam al-Wasit), and every entry was independently reviewed.
- **Tafsir consulted** through the Quran.com API: Tafsir al-Muyassar (Arabic), Tafsir al-Sa‘di (Arabic) and Ibn Kathir (abridged, English). Translations consulted for meaning only: Saheeh International and Mufti Taqi Usmani. The Urdu wording is original and concise; it is not a translation of these works.

Word-type, verb-form and passive-voice counts below apply the adjudicated occurrence overrides; they are not uncorrected Corpus tag counts.

| Measure | Count |
| --- | ---: |
| Nouns | 71 |
| Adjectives | 4 |
| Verbs | 32 |
| Particles | 26 |
| Pronouns | 4 |
| Passive verb occurrences | 3 |
| Distinct roots | 64 |
| Verb form I | 18 |
| Verb form II | 3 |
| Verb form IV | 7 |
| Verb form V | 1 |
| Verb form VI | 1 |
| Verb form VIII | 2 |

## Editorial checks

The lesson is organized into 4 chunks of whole ayahs. No review-result snapshot was supplied. This source audit therefore does not certify completion of independent reviews, fixes or final confirmations. The intended workflow requires independent grammar and meaning/tafsir reviews and a clean final confirmation after every correction, including minor findings.
The chunk validator checks the exact Arabic word, segments that rejoin to the exact word, ids and order, rule references, verb-note presence, phrase coverage of every word, and the absence of URLs or Latin text. AI review and automated checks are not scholarly review.

Nouns without a Corpus root (root left empty): إِذَا، إِرَمَ، بِجَهَنَّمَ، ذَاتِ، ذِى، فَيَوْمَئِذٍۢ، لِّذِى، وَثَمُودَ، وَفِرْعَوْنَ، يَـٰٓأَيَّتُهَا، يَوْمَئِذٍۢ، يَوْمَئِذٍۭ.

## Analysis decisions and cautions

Notes recorded by the authors and reviewers for scholarly review; they mark alternative analyses, source disagreements and editorial choices.

- **89:1:1:** The oath answer is elided; the QAC grammar note at 89:2 supplies it as 'We will surely requite everyone for what he did', inferred from the following account of past nations. Sa'di instead holds that the thing sworn by is itself what is sworn upon. Only the elided-answer analysis is given in the lesson.
- **89:1:** Tafsir: Ibn Kathir gives 'the morning' as the well-known view and reports from Masruq and Muhammad bin Ka'b that al-Fajr is specifically the day of sacrifice; both are mentioned.
- **89:2:** Ten nights: Muyassar and Ibn Kathir say the first ten of Dhul-Hijjah; Sa'di says the last ten of Ramadan or the ten of Dhul-Hijjah. Both are presented. The prophetic saying about the ten days is from Ibn Kathir's citation of al-Bukhari and is paraphrased briefly.
- **89:2:1:** QAC lemma is لَيْل; لَيَالٍ is commonly treated as the plural of لَيْلَة. Lemma kept as QAC's لَيْل and the relation to لَيْلَة explained. Per the QAC grammar note it is genitive with an implied fatha (standing for kasra, diptote) on the elided yaa; the tanwin is tanwin of compensation.
- **89:2:2:** QAC tags عَشْرٍ as ADJ with masculine plural features; it is a cardinal numeral used as نعت (QAC note: «عشر» نعت مجرور). The lesson calls it صفت (اسمِ عدد) and does not repeat the MP label; it explains the tāʾ-less form by gender polarity with the feminine counted noun لَيْلَة.
- **89:3:** Only Muyassar comments on الشفع والوتر in the packet ('every even and odd'); no other views are given in the provided tafsir, so none are added.
- **89:4:3:** يَسْرِ is indicative (QAC IMPF with no mood; QAC note: مرفوع بالضمة المقدرة على الياء المحذوفة). The final yaa is omitted in the Uthmani rasm at the verse end; it is not a jussive. Tagged implied-case + elision.
- **89:5:1:** هَلْ is treated as a rhetorical question seeking affirmation (Muyassar paraphrases with أليس, Sa'di answers نعم). The Urdu translation adds (نہیں) in parentheses, as do both English translations.
- **89:6:3:** Following the QAC grammar note, كَيْفَ is a حال. A common alternative analysis makes it مفعول مطلق of فَعَلَ; not used in the lesson.
- **89:6:6:** QAC assigns the proper noun عاد the root ع و د; the lesson treats this only as a lexical index and does not etymologise the name. The shared root entry for ع و د covers only the sense 'return'.
- **89:7:** Iram: Sa'di and Muyassar make it the tribe; Ibn Kathir reports that it was the first 'Ad, while Qatadah and as-Suddi say it was the seat of 'Ad's kingdom. ذات العماد: lofty pillared buildings (Muyassar, Ibn Kathir) versus great strength and tyranny (Sa'di); both are given.
- **89:8:1:** The QAC grammar note makes ٱلَّتِى a نعت of «ذات العماد» (the whole description of Iram); it is followed as such. Ibn Kathir reports Ibn Zayd's view that the pronoun of مِثْلُهَا refers to the pillars and calls it weak, preferring the tribe (Qatadah, Ibn Jarir).
- **89:9:2:** ثَمُود is diptote as a feminine (tribal) proper name per the QAC note, yet is described by the masculine plural ٱلَّذِينَ, which follows the meaning (the people). This is explained in the lesson.
- **89:9:3:** The shared root entry ج و ب gives only 'answer/respond'; the sense here (cut, hew) follows the lexeme entry and Ibn Kathir. The dictionary note keeps both senses.
- **89:10:3:** Lemma written as the singular وَتِد per the guide (QAC lemma is the plural أَوْتَاد). The root entry also mentions a second explanation (stakes used to bind and torture people); the provided tafsir (Muyassar, Sa'di) gives only the 'armies that fixed his rule' explanation, so tafsirUrdu and dictionaryUrdu follow that.
- **89:11:1:** Followed QAC i'rab: ٱلَّذِينَ is a na't of فرعون with an elided muḍāf (قوم فرعون), in maḥall jarr. Sa'di applies the description semantically to ʿĀd, Thamūd and Pharaoh together; other i'rab works treat it as a description of all three or as a cut-off (maqṭūʿ) na't. Reviewer may confirm.
- **89:11:2:** Built status of طَغَوْا described as built on an implied ḍamma on the elided alif (common i'rab); some grammarians say built on an implied fatḥa. QAC only says فعل ماض.
- **89:14:3:** مِرْصَاد explained per the root entry as the place of watching/ambush on مِفْعَال; some commentators read it as an intensive (مبالغة) form. Not tagged intensive (its rule mentions مِفْعَال but the root entry and context support the place sense). Khabar of إِنَّ treated as the elided muta'allaq of the jar-majrur, with lām al-muzaḥlaqa per the ayah note.
- **89:15:7:** QAC tags the فَ of فَأَكْرَمَهُۥ as conjunction (عاطفة); the translations render it as explanatory ('and [thus]'), reflected by «(اس طرح)» in the Urdu translation. Same for فَقَدَرَ in 89:16:5.
- **89:15:9:** QAC word i'rab calls the فَ واقعة في جواب الشرط; the ayah note makes the فيقول clause the khabar of ٱلْإِنسَـٰنُ (فاء رابطة for أَمَّا), with the إِذَا conditional parenthetical and its answer elided. Tagged detailing + condition-answer. Same in 89:16:8, where the mubtada after أَمَّا is implied.
- **89:15:11:** The 1st-person yāʾ after nūn al-wiqāya is not written in this text; analysed per QAC i'rab (الياء المحذوفة مفعول به) as an elided object. Same for أَهَـٰنَنِ (89:16:10).
- **89:12:1:** Shared-data issue: the root entry ك ث ر says the أَكْثَر shape is a noun everywhere in these surahs, but 89:12:1 فَأَكْثَرُوا۟ is a Form IV verb (QAC, lexeme entry). The lesson follows QAC; the root note should be revised. Lemma written as perfect أَكْثَرَ per the lexeme entry.
- **89:11:4:** Shared-data note: the root entry ب ل د says definite ٱلْبَلَد in these surahs means Makkah; here the plural ٱلْبِلَـٰدِ means the lands where these nations transgressed (Sa'di: بلاد الله), not Makkah. Lesson text follows the tafsir.
- **89:18:4:** طَعَامِ is tagged a plain noun by QAC; following the tafsir (على إطعام المسكين) it is taught in the sense of إطعام (feeding). An alternative reads an elided muḍāf (giving the food of the poor); mentioned briefly.
- **89:18:2:** Taught per QAC/Hafs and the lexeme entry as Form VI imperfect with one of two ta's elided (تتحاضون). Which ta is elided is not specified. Other readings (e.g. تحضون) are not discussed.
- **89:19:2:** Stated that the tāʾ of تراث replaces an original wāw (وراث), consistent with QAC root و ر ث; this is standard lexicography but not stated in the packet's root entry.
- **89:19:3:** Packet word i'rab gives only اسم منصوب; the ayah note makes لمّا its نعت. Taught as مفعول مطلق (masdar of تأكلون describing the manner), the standard analysis; cognate-object tagged on that basis.
- **89:20:3:** QAC tags حبًّا as a plain noun (not VN); the ayah note calls it اسم مصدر and نائب مفعول مطلق, which is followed. verbal-noun rule not used.
- **89:21:1:** كلّا taught as deterrence (QAC AVR, Sa'di). Ibn Kathir glosses it 'truly' (حقًّا); recorded as بعض مفسرین in syntax and tafsir.
- **89:21:3:** Lemma written as the active perfect دَكَّ per the guide (verbs: 3MS active perfect); the lexeme entry's past field is the passive دُكَّ.
- **89:21:5:** Followed the ayah note: دكًّا دكًّا together are مصدران في موضع الحال (repeated pounding), explicitly not تأكيد. Some i'rab works parse the first as مفعول مطلق and the second as توكيد; the first alternative is mentioned briefly.
- **89:22:4:** صفًّا صفًّا taught as one ḥāl (مصطفّين) per the ayah note; QAC labels both as verbal nouns.
- **89:22:1:** Divine coming rendered literally (آئے گا … جس طرح چاہے گا) following Ibn Kathir 'as He wills' and Sa'di; no figurative interpretation introduced.
- **89:23:2:** Followed the ayah note: the first يومئذ is بدل of إذا and the second is بدل of the first. Many i'rab works instead attach يومئذ as ظرف to يتذكر; not mentioned in the lesson text.
- **89:23:7:** QAC word i'rab calls the wāw عاطفة, but the ayah note calls it معترضة; the note was followed (parenthetical) and conjunction not tagged. Some works call it حالية.
- **89:23:9:** Followed the ayah note: أنّى is an interrogative adverb attached to an elided khabar, الذكرى is the mubtada, and لَهُ attaches to an elided ḥāl of الذكرى. An alternative attaches لَهُ to the khabar.
- **89:24:1:** Per the ayah i'rab the clause يقول is badal ishtimal of the clause يتذكر in 89:23; the following ليت clause is treated as its maqul al-qawl.
- **89:24:2:** QAC labels the prefixed يا as VOC, but the ayah i'rab says «يا» للتنبيه; followed the i'rab (inna-sisters, no vocative). QAC's single PRON suffix نِى is split for learners into nun al-wiqaya نِ + first-person ya ى.
- **89:24:4:** Lam taken as attached to قدّمت with the sense 'for my (eternal) life' per Muyassar and Sa'di. A known alternative reads the lam temporally ('in my lifetime'); not used. Case of حياة treated as implied (muqaddar) before the first-person ya. Lemma written حَيَاة; QAC lemma is the Uthmani spelling حَيَوٰة.
- **89:25:1:** QAC tags يومئذ as one time adverb (T, no root); the lesson explains its make-up (يومَ + إذْ with tanwin of compensation) without assigning a root. Ayah i'rab: ظرف متعلق بـ«يعذب».
- **89:25:4:** Word i'rab gives only اسم منصوب; analysed as na'ib maf'ul mutlaq, parallel to the ayah note for وثاقه in 89:26. Pronoun referred to Allah following Muyassar (مثل تعذيب الله). Some commentators refer it to the punished person, especially with the passive reading يُعَذَّبُ (al-Kisa'i, Ya'qub); Hafs's active reading is followed.
- **89:26:2:** Lemma written as the perfect أَوْثَقَ per the reviewed paradigm entry; QAC's lemma is the inflected imperfect يُوثِقُ. Hafs active reading followed (passive يُوثَقُ is another qira'a).
- **89:26:3:** Ayah i'rab: «وثاقه» نائب مفعول مطلق. Described as an ism masdar in the sense of binding (regular masdar إيثاق), consistent with the root entry.
- **89:27:1:** QAC tags أَيَّتُهَا as one nominative noun (NOM) including ها. Lesson follows the standard i'rab: أيّة munada nakira maqsuda built on damma in mahall nasb, ها a particle of tanbih; nominative rule not tagged (per the rule library). Lemma given as أَيّ (QAC lemma أَيَّتُهَا).
- **89:27:2:** Ayah i'rab calls النفس عطف بيان of أيتها; tagged badal (the library's card for 'atf bayan). Its damma follows the lafz of the built munada.
- **89:27:3:** QAC labels المطمئنة a form XII active participle of root ط م ن. Classical sarf treats اطمأنّ as an augmented quadriliteral (root ط م أ ن). Lesson keeps the packet root, avoids naming a form number in Urdu, and does not tag derived-form (XII is outside that rule's scope); reviewer may decide.
- **89:27:** The implied introduction '(it will be said)' is supplied in parentheses following Sa'di (فيقال له) and the reference translations.
- **89:28:5:** Ayah i'rab: «راضية مرضية» حالان; both tagged haal of the ya of ارجعي. The shadda on the meem of مَّرْضِيَّةً is noted as idgham of the preceding tanwin.
- **89:29:** Sa'di says the address is made to the soul both on the Day of Resurrection and at death; presented with «بعض مفسرین کے نزدیک» since Ibn Kathir's text is not provided for these ayahs.
- **89:30:2:** Word i'rab gives only اسم منصوب (QAC grammar note for 89:30 is empty). Analysed as maf'ul bihi of ادخلي (place after دخل); the alternative منصوب على نزع الخافض (implied في) / على السعة is mentioned in the Urdu. Case treated as implied before the first-person ya.
- **89:30:1:** No ayah i'rab note for 89:30; وادخلي taken as conjoined to فادخلي (QAC: الواو عاطفة).

## Per-ayah sources

- **89:1:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=89&verse=1); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=89&verse=1); [Quran.com](https://quran.com/89/1).
- **89:2:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=89&verse=2); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=89&verse=2); [Quran.com](https://quran.com/89/2).
- **89:3:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=89&verse=3); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=89&verse=3); [Quran.com](https://quran.com/89/3).
- **89:4:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=89&verse=4); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=89&verse=4); [Quran.com](https://quran.com/89/4).
- **89:5:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=89&verse=5); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=89&verse=5); [Quran.com](https://quran.com/89/5).
- **89:6:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=89&verse=6); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=89&verse=6); [Quran.com](https://quran.com/89/6).
- **89:7:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=89&verse=7); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=89&verse=7); [Quran.com](https://quran.com/89/7).
- **89:8:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=89&verse=8); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=89&verse=8); [Quran.com](https://quran.com/89/8).
- **89:9:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=89&verse=9); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=89&verse=9); [Quran.com](https://quran.com/89/9).
- **89:10:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=89&verse=10); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=89&verse=10); [Quran.com](https://quran.com/89/10).
- **89:11:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=89&verse=11); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=89&verse=11); [Quran.com](https://quran.com/89/11).
- **89:12:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=89&verse=12); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=89&verse=12); [Quran.com](https://quran.com/89/12).
- **89:13:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=89&verse=13); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=89&verse=13); [Quran.com](https://quran.com/89/13).
- **89:14:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=89&verse=14); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=89&verse=14); [Quran.com](https://quran.com/89/14).
- **89:15:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=89&verse=15); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=89&verse=15); [Quran.com](https://quran.com/89/15).
- **89:16:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=89&verse=16); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=89&verse=16); [Quran.com](https://quran.com/89/16).
- **89:17:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=89&verse=17); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=89&verse=17); [Quran.com](https://quran.com/89/17).
- **89:18:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=89&verse=18); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=89&verse=18); [Quran.com](https://quran.com/89/18).
- **89:19:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=89&verse=19); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=89&verse=19); [Quran.com](https://quran.com/89/19).
- **89:20:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=89&verse=20); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=89&verse=20); [Quran.com](https://quran.com/89/20).
- **89:21:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=89&verse=21); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=89&verse=21); [Quran.com](https://quran.com/89/21).
- **89:22:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=89&verse=22); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=89&verse=22); [Quran.com](https://quran.com/89/22).
- **89:23:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=89&verse=23); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=89&verse=23); [Quran.com](https://quran.com/89/23).
- **89:24:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=89&verse=24); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=89&verse=24); [Quran.com](https://quran.com/89/24).
- **89:25:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=89&verse=25); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=89&verse=25); [Quran.com](https://quran.com/89/25).
- **89:26:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=89&verse=26); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=89&verse=26); [Quran.com](https://quran.com/89/26).
- **89:27:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=89&verse=27); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=89&verse=27); [Quran.com](https://quran.com/89/27).
- **89:28:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=89&verse=28); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=89&verse=28); [Quran.com](https://quran.com/89/28).
- **89:29:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=89&verse=29); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=89&verse=29); [Quran.com](https://quran.com/89/29).
- **89:30:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=89&verse=30); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=89&verse=30); [Quran.com](https://quran.com/89/30).

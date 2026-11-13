# Surah 25 — Al-Furqan: source audit

Researched 2026-11-13. This lesson contains **77 ayahs and 893 word occurrences**. All Urdu word glosses, translations, grammatical explanations, dictionary summaries, verb-paradigm notes and concise tafsir notes are original AI-assisted editorial drafts. They are **not scholar-reviewed** and are not attributed to a named Urdu translator. No third-party Urdu book, dictionary, translation or tafsir was imported.

## Arabic inventory

`inventory-25.json` records the Quran.com Content API v4 `text_uthmani` word strings ([source](https://api.quran.com/api/v4/verses/by_chapter/25?words=true&word_fields=text_uthmani&per_page=50)), retrieved 2026-11-13, excluding end-of-ayah markers. Recitation signs that the API separates from a word by a space — waqf signs, the saktah sign, the sajdah sign and the rub al-hizb marker — are not part of the stored word token, following the Surahs 110–114 precedent. The inventory lists all 36 such exclusions with the original API text; no other character was changed. The unnumbered opening basmalah is not inserted as a numbered occurrence. Automated tests compare every stored word, its id and its segments with this inventory.

Word boundaries and counts match the Quranic Arabic Corpus morphology for every ayah. Per-ayah word counts: 9, 19, 22, 16, 9, 12, 16, 17, 9, 17, 8, 9, 9, 8, 13, 10, 16, 21, 15, 20, 19, 10, 9, 7, 7, 9, 11, 6, 11, 9, 11, 15, 8, 11, 9, 9, 13, 8, 7, 16, 11, 17, 9, 15, 16, 5, 11, 13, 10, 9, 7, 7, 15, 12, 14, 5, 14, 13, 17, 13, 11, 13, 12, 5, 11, 4, 11, 22, 8, 16, 9, 9, 10, 13, 9, 5, 12.

## Sources and method

- **Morphology:** Quranic Arabic Corpus morphology 0.4 (Kais Dukes, GNU GPL with the Corpus terms of use), a verbatim distribution checked by SHA-256 `910b721a8f04f4334ac5d4c62b19e858f5d720c525bb975f2e750ea2c6bb532d`. It was consulted locally for segmentation, part of speech, root, lemma, verb form, voice, mood and case; it is not bundled or redistributed.
- **Word types and roots** are derived deterministically from the Corpus stem tags with the mapping that reproduces root assignments for all 230 word occurrences of the existing lessons, including words with no root. A preposition with an attached pronoun (لَهُ، بِهِ، عَلَيْهِمْ) is a particle, following Surahs 1, 105 and 112. Words without a Corpus root, such as proper names, keep no root.
- **Syntax:** the Corpus word-by-word pages (English morphology and Arabic i‘rab for every word) and verse grammar pages (Arabic i‘rab notes adapted from the Quran Printing Complex), retrieved 2026-11-13. All 77 verse pages carry a grammar note.
- **Verb paradigms** (باب، ماضی، مضارع، وزن) for all 243 verb occurrences come from a shared library of 657 verb lexemes for this expansion edition. Form I vowel classes were decided from imperfects attested across the whole Corpus and standard lexica (Lane, Lisan al-Arab, al-Mu‘jam al-Wasit). The edition’s library review and subsequent corrections are recorded in its handoff and adjudication reports.
- **Tafsir consulted** through the Quran.com API: Tafsir al-Muyassar (Arabic), Tafsir al-Sa‘di (Arabic) and Ibn Kathir (abridged, English). Translations consulted for meaning only: Saheeh International and Mufti Taqi Usmani. The Urdu wording is original and concise; it is not a translation of these works.

Word-type, verb-form and passive-voice counts below apply the adjudicated occurrence overrides; they are not uncorrected Corpus tag counts.

| Measure | Count |
| --- | ---: |
| Nouns | 365 |
| Adjectives | 27 |
| Verbs | 243 |
| Particles | 183 |
| Pronouns | 75 |
| Passive verb occurrences | 16 |
| Distinct roots | 250 |
| Verb form I | 167 |
| Verb form II | 21 |
| Verb form III | 3 |
| Verb form IV | 28 |
| Verb form V | 4 |
| Verb form VI | 3 |
| Verb form VII | 1 |
| Verb form VIII | 13 |
| Verb form X | 3 |

## Editorial checks

The lesson is organized into 28 chunks of whole ayahs. No review-result snapshot was supplied. This source audit therefore does not certify completion of independent reviews, fixes or final confirmations. The intended workflow requires independent grammar and meaning/tafsir reviews and a clean final confirmation after every correction, including minor findings.
The chunk validator checks the exact Arabic word, segments that rejoin to the exact word, ids and order, rule references, verb-note presence, phrase coverage of every word, and the absence of URLs or Latin text. AI review and automated checks are not scholarly review.

Nouns without a Corpus root (root left empty): إِذَا، إِذَآ، إِذْ، بَرْزَخًۭا، جَهَنَّمَ، لَّمَّا، مَالِ، مَعَ، مَعَهُۥ، مَعَهُۥٓ، مُوسَى، نُوحٍۢ، هَـٰرُونَ، هُنَالِكَ، وَإِذَا، وَإِذَآ، وَثَمُودَا۟، يَـٰوَيْلَتَىٰ، يَوْمَئِذٍ، يَوْمَئِذٍۢ.

## Corrections to Corpus tags

These occurrences carry an adjudicated correction or a documented source/analysis disagreement. The lessons follow the recorded contextual analysis; the raw Corpus data itself is unchanged.

- **25:17:11** عِبَادِى: QAC tags عِبَادِى nominative, but in ءَأَنتُمْ أَضْلَلْتُمْ عِبَادِى it is the direct object of أَضْلَلْتُمْ (whose subject is the تُمْ suffix): accusative with the fatha implied before the 1S ya, هَـٰٓؤُلَآءِ following as its descriptor.
- **25:30:5** قَوْمِى: QAC tags قَوْمِى nominative, but in إِنَّ قَوْمِى ٱتَّخَذُوا۟ it is the noun (ism) of إِنَّ: accusative with the fatha implied before the 1S ya; the predicate is the clause ٱتَّخَذُوا۟.
- **25:45:2** تَرَ: QAC tags تَرَ 3rd person feminine singular; in أَلَمْ تَرَ إِلَىٰ رَبِّكَ it addresses the Prophet (رَبِّكَ), so it is 2nd person masculine singular. The jussive after لَمْ (final alif dropped) is correct.
- **25:52:2** تُطِعِ: QAC tags تُطِعِ third person feminine singular. The paired singular imperatives address the Prophet, so this is second person masculine singular after prohibitive lā. Its final kasra is for joining to the next word.
- **25:53:4** ٱلْبَحْرَيْنِ: QAC tags this word NOM, contradicting the vocalised form and its role. ٱلْبَحْرَيْنِ is the object of مَرَجَ (He released the two seas); the dual ya ending marks the accusative.
- **25:59:3** ٱلسَّمَـٰوَٰتِ: QAC tags ٱلسَّمَـٰوَٰتِ genitive. It is an object of خَلَقَ and takes kasra in the accusative because it is a sound feminine plural.
- **25:60:10** لِمَا: QAC tags mā in لِمَا as relative. The verse i‘rab takes the lām as causal and mā as a masdar particle, with a relative reading possible as an alternative. The lesson follows the verse i‘rab.

## Analysis decisions and cautions

Notes recorded by the authors and reviewers for scholarly review; they mark alternative analyses, source disagreements and editorial choices.

- **25:1:7:** The hidden ism of يكون is taken as the servant (the Prophet), following Muyassar ('ليكون رسولا'). Sa'di's wording relates it to the sending down (ذلك الإنزال), and some grammarians refer the pronoun to al-Furqan; recorded as alternatives.
- **25:1:8:** Following the QAC ayah note, لِلْعَـٰلَمِينَ attaches to the khabar نَذِيرًا and is placed before it; attaching it to an implied ḥāl or to يكون are recognised alternatives.
- **25:2:1:** QAC note: الذي is badal of the preceding relative (25:1:2), so in محل رفع. Common alternatives (na't of الذي, or khabar of an elided هو / قطع للمدح) are not used in the lesson.
- **25:2:2:** The QAC note only says «له ملك» is the ṣila; the lesson uses the standard analysis لَهُۥ = خبر مقدم (متعلق بمحذوف), مُلْكُ = مبتدأ مؤخر.
- **25:2:8:** Following the QAC note, وَلَدًا is the second object of يتخذ with an elided first object (أحدًا); hence two-objects and zanna (اتخذ 'make into'). Many grammarians read اتخذ here with a single object ('take a son'); a reviewer may prefer object only.
- **25:2:11:** Per QAC, the jar-majrur لَّهُۥ is attached to the (elided) khabar of يكن and فِى ٱلْمُلْكِ to شريك; the khabar is fronted and the ism شريك delayed.
- **25:2:19:** Packet i'rab gives only اسم منصوب; the lesson treats تَقْدِيرًا as مفعول مطلق مؤكد of قَدَّرَ, the standard analysis, with verbal-noun from QAC's VN tag.
- **25:1:4:** QAC tags فُرْقَان as a plain noun (not VN); the lesson calls it a noun on the فُعْلَان pattern and does not label it a masdar.
- **25:3:1:** Word i‘rab calls the wa عاطفة while the ayah note calls the clause «واتخذوا» مستأنفة; the lesson presents the wa as a conjunction opening a new statement (no i‘rab position).
- **25:3:2:** Followed the QAC note: «من دونه» attaches to the (unstated) second object of اتخذ, with آلهة as the first object. Alternative analysis: اتخذ with a single object and «من دونه» an adverbial/ḥāl phrase (a phrase preceding the indefinite آلهة). two-objects and zanna (اتخذ of transformation) are tagged on 25:3:1 and 25:3:4 per this analysis, since those rules cover an elided object; on 25:3:1 conjunction and hamzated were dropped to stay within six rules (assimilation already covers the hamza of أ خ ذ becoming tāʾ).
- **25:3:6:** The rational masculine plural (يخلقون، هم، يملكون، أنفسهم) refers to آلهة; the QAC note makes «وهم يخلقون» a ḥāl of the wāw of يخلقون. Muyassar also states that Allah created both the idols and their worshippers; the lesson follows the i‘rab reference to the gods.
- **25:3:10:** The i‘rab note does not state the attachment of «ولا يملكون…»; the lesson treats it as coordinated with the ṣifa clause «لا يخلقون شيئا». Some may coordinate it with the ḥāl clause instead; meaning is unaffected.
- **25:3:11:** QAC lemma is مَلَكَتْ (3FS form, LEM malakato); the lesson gives the citation form مَلَكَ per the reviewed lexeme entry. Same for 25:3:17.
- **25:3:12:** «لأنفسهم» attached to يملكون; an alternative attaches it to an implied ḥāl of the indefinite ضرًّا that follows.
- **25:3:20:** QAC lemma حَيَوٰة reflects the Uthmani spelling; the lesson lemma is the standard حَيَاة.
- **25:4:8:** Hidden subject هو identified with the Prophet ﷺ as the disbelievers intend (Muyassar, Ibn Kathir); the object pronoun ـه refers back to إفك. The عليه in 25:4:10 is taken to refer to the fabrication (Muyassar: أعانه على ذلك).
- **25:4:14:** Uthmani spelling جَآءُو has no wāw-alif after the plural wāw. Per QAC note «ظلمًا» is مفعول به with جاء transitive by itself; alternatives in the i‘rab literature: منصوب بنزع الخافض (جاءوا بظلم) or ḥāl. The lesson follows QAC and mentions the first alternative.
- **25:4:16:** QAC lemma shows زُّور (LEM z~uwr) with a shadda on zay, apparently an artifact; the lesson lemma is زُور.
- **25:5:2:** QAC i'rab: khabar of an elided mubtada (هي). Lemma written as the plural أَسَاطِير following QAC; the singular is disputed among lexicographers, so none is asserted. Diptote rule not tagged because the word is mudaf here.
- **25:5:4:** Clause analysed as hal of أساطير per QAC i'rab. Meaning 'had it written for himself / copied' follows the lexeme entry and Muyassar (استنسخها); Sahih: 'has written down'. Hidden subject = the Prophet as alleged by the disbelievers.
- **25:5:6:** تُمْلَىٰ glossed 'dictated' (Sahih, lexeme); Muyassar paraphrases تُقرأ عليه and Taqi Usmani 'read out to him'; the Urdu combines both (پڑھ کر لکھوائی جاتی ہیں).
- **25:6:6:** QAC note attaches فِى ٱلسَّمَـٰوَٰتِ to the (implied) second object of يعلم; lesson follows it. Alternative analysis (hal of ٱلسِّرَّ) mentioned briefly. two-objects/zanna rules not tagged since no second object is expressed.
- **25:6:9:** Whether the إنّه clause continues the speech commanded by قُلْ or is a direct divine statement is not settled by the i'rab; the first phrase therefore covers only 25:6:1-8.
- **25:6:12:** QAC i'rab: صفة منصوبة of غفورا; the common alternative (second khabar of كان) is mentioned. Shadda on the rā' reflects idgham of the preceding tanwin.
- **25:7:2:** QAC gives مَالِ a single INTG segment (lemma ما), but the word also contains the preposition لِ (Uthmani spelling joins it to ما, separated from هذا); the QAC grammar note itself says والجار متعلق بالخبر. Lesson segments it as مَا + لِ, keeping the noun word type.
- **25:7:7:** QAC lemma مَّشَ carries an assimilation shadda; lemma written in citation form مَشَى per the lexeme entry.
- **25:7:9:** QAC lemma سُّوق carries a stray shadda; lemma written سُوق.
- **25:7:14:** Per QAC note: فاء السببية, verb subjunctive by implied أن in answer to the تحضيض, interpreted masdar coordinated with a masdar derived from the preceding clause. Hidden ism of يكون taken as the angel (Sahih/Taqi Usmani).
- **25:7:15:** QAC i'rab only says ظرف مكان منصوب; attachment to نذيرا is the lesson's choice (alternatives: implied hal/khabar-related attachment).
- **25:8:2:** Following the standard i'rab (Zamakhshari/Abu Hayyan line), يُلْقَى and تَكُونُ are coordinated with the perfect أُنزِلَ of 25:7 (understood as present in sense), hence marfu'; they are not coordinated with the subjunctive فَيَكُونَ. The packet's ayah grammar note does not state the attachment.
- **25:8:6:** Analysed تَكُونُ as incomplete (ناقصة): لَهُۥ khabar muqaddam, جَنَّةٌ ism mu'akhkhar. A common alternative takes تكون as complete (تامة) with جَنَّةٌ as fa'il and لَهُۥ attached to the verb; the QAC i'rab line only says اسم مرفوع.
- **25:8:9:** The clause يَأْكُلُ مِنْهَا is treated as a sifa of the indefinite جَنَّةٌ (standard i'rab; not stated in the packet note). Hidden subject هو refers to the Messenger.
- **25:8:11:** QAC note: وقال الظالمون is coordinated with وَقَالُوا of 25:7. Sa'di explains the explicit noun الظالمون as indicating that their wrongdoing, not genuine doubt, drove the statement; this is reflected in the syntax/tafsir text.
- **25:8:17:** The leading shadda in مَّسْحُورًا comes from assimilation of the preceding tanwin into mim; QAC lemma «مَّسْحُور» retains it, lemma written مَسْحُور.
- **25:8:** Only Sa'di's tafsir is supplied for this ayah (no Muyassar; Ibn Kathir is grouped at 25:7 and not included), so the Urdu tafsir summary rests on Sa'di alone.
- **25:9:2:** كَيْفَ taken as hal (from the subject of ضَرَبُوا) per the QAC ayah note; some i'rab works allow it as a maf'ul mutlaq (how = what kind of coining). The clause is the object of the suspended (معلق) ٱنظُرْ.
- **25:9:7:** QAC tags the فَ of فَلَا as REM and its word i'rab line says الفاء استئنافية, but the QAC ayah grammar note says جملة «فلا يستطيعون» معطوفة على جملة «ضلوا». Per the rule library, followed the ayah note (عاطفة, consequential sense) and tagged conjunction. The فَ of فَضَلُّوا is kept استئنافية per QAC; some i'rab works call it عاطفة as well.
- **25:9:9:** Muyassar: they find no way to the truth (to correct their lies about him); Sa'di stresses that their sayings contain no guidance or doubt against the message. Translation adds '(to the truth)' in parentheses following Muyassar.
- **25:10:10:** QAC 0.4 tags جَنَّـٰتٍۢ GEN, but the ayah i‘rab makes it a badal of خَيْرًۭا, i.e. accusative; as a sound feminine plural its naṣb is shown by kasra. Taught as منصوب بالکسرہ with accusative + feminine-plural, not genitive.
- **25:10:6:** Followed the QAC note that لَكَ attaches to the (elided) second object of جَعَلَ, so جَعَلَ is taught as two-object with خَيْرًۭا as first object. A common alternative treats جَعَلَ here as single-object (give/make) with لَكَ attached to the verb.
- **25:10:16:** QAC gives no specific attachment for the second لَّكَ; the lesson attaches it to وَيَجْعَل and suggests, by analogy with the first clause, the elided second object. Reviewer may simplify to attachment to the verb.
- **25:10:15:** Jussive (Hafs) per QAC and the ayah note (معطوف على محل جعل); the sukun is not written because the lām assimilates into لَّكَ. Other readings with raf‘ exist but are not in the provided sources and are not mentioned in the lesson.
- **25:10:7:** QAC tags خَيْرًۭا as plain N (not ELA); taught as a noun with elative meaning (better than), given the following مِّن comparison and the comparative rule’s explicit inclusion of خَيْر.
- **25:11:4:** Word i‘rab says الواو عاطفة while the ayah note calls the sentence مستأنفة; the lesson keeps عاطفة for the particle and says the clause, like the preceding one, has no syntactic position. QAC lemma أَعْتَدَتْ is a 3FS inflected form; lemma written as citation أَعْتَدَ per the lexeme entry.
- **25:11:8:** QAC morphology tags سَعِيرًا masculine, but the QAC ayah note for 25:12 says it is feminine (وهي مؤنثة), and the following رَأَتْهُم and لَهَا refer to it with feminine pronouns. The lesson states the masculine tag and explains the feminine reference by its meaning (fire).
- **25:12:7:** QAC only says جار ومجرور. Lesson gives attachment to سَمِعُوا۟ as primary and mentions the alternative that لَهَا is a fronted ḥāl of تَغَيُّظًۭا.
- **25:12:1:** Per the QAC ayah note the whole إِذَا conditional sentence is the na‘t of سَعِيرًا (11:8); إِذَا taught as a conditional time adverb attached to its answer سَمِعُوا۟ (standard i‘rab, not stated explicitly in QAC).
- **25:13:4:** Followed the QAC grammar note: makanan is a place adverb (zarf makan) attached to ulqu. Some i'rab works read it as accusative by removal of the preposition (fi makanin); not adopted. Tagged noun-of-place-time on the maf'al pattern under root k-w-n as in the root library; some lexicographers derive it from m-k-n.
- **25:13:3:** minha attached to an elided hal of makanan (originally its sifa, fronted), per the QAC grammar note. The pronoun ha refers to the Fire (sa'ir of 25:11-12).
- **25:13:6:** muqarranin: Muyassar explains it as hands chained to necks; Sa'di as bound with chains and fetters; Taqi Usmani renders "chained together". Lesson uses the general Urdu gloss "bound in chains" and cites the Muyassar explanation as one tafsir.
- **25:13:8:** QAC morphology and word i'rab tag hunalika as a time adverb (zarf zaman), while the QAC ayah grammar note calls it a demonstrative place adverb (ism isharah zarf makan) attached to da'aw. Lesson follows the effective pos (noun) and presents both senses; tagged demonstrative + adverb per the rule text.
- **25:13:9:** thuburan: QAC grammar note makes it maf'ul bih (they say "ya thuburah"). Some grammarians read it as a maf'ul mutlaq of the sense of the verb; not adopted. The root library calls it a masdar, but neither QAC nor the i'rab labels it a verbal noun, so the verbal-noun rule was not applied (same for 25:14:4 and 25:14:7).
- **25:14:1:** Per the QAC grammar note the prohibition clause is the maqul of an implied verb of saying ("it will be said to them"); shown in parentheses in the translation and tagged quoted-speech + elision on la.
- **25:15:3:** QAC tags khayr as a plain noun; the lesson treats it as an elative ("better") in this comparison, as the comparative rule explicitly allows for khayr.
- **25:15:8:** The second object / resumptive pronoun of the sila is elided (wu'idaha); Muyassar paraphrases "allati wu'ida biha". Singular passive verb before an explicit plural na'ib fa'il (al-muttaqun).
- **25:15:9:** QAC lemma for al-muttaquna is the plural form muttaqin; the lesson gives the singular base muttaqi as the lemma.
- **25:15:10:** Followed the QAC grammar note: the kanat clause is a hal of jannatu al-khuld. Other i'rab works allow it as a second sifa or as a new (isti'nafiyya) sentence. The perfect is rendered as future ("will be") with the sense of something already decreed; translations differ on whether the question ends before or after this clause.
- **25:15:13:** masir is glossed as place/end of return (root library: place or final outcome); it can also be read as a masdar mimi (becoming, ending). Tagged noun-of-place-time.
- **25:17:11:** QAC tags عِبَادِى nominative and the generated i'rab line says اسم مرفوع; per the packet qacCorrection it is the accusative direct object of أَضْلَلْتُمْ (subject = تُمْ), with the fatha implied before the 1st-person yaa. Lesson follows the correction.
- **25:17:9:** QAC i'rab only labels أنتم ضمير منفصل. Lesson treats it as mubtada with the clause أضللتم عبادي هؤلاء as khabar (likewise هم + ضلوا السبيل). Alternative analysis: fa'il of an elided verb explained by the following one (أأضللتم أنتم), since the interrogative hamza favours a verb; mentioned briefly in syntaxUrdu.
- **25:17:16:** QAC gives only اسم منصوب. Lesson follows the common analysis منصوب على نزع الخافض (ضلوا عن السبيل), consistent with the lexeme entry calling ضَلَّ intransitive; alternative: ضلّ used transitively ('lost/missed the way') making السبيل a direct object. Both mentioned.
- **25:17:16:** Shared-data issue: root entry س ب ل noteUrdu contains a passage-specific sentence about the fish making its way into the sea ('یہاں دونوں جگہ مچھلی…', from 18:61/18:63) that is wrong outside that context. Not used here; the root library entry should be generalised.
- **25:17:12:** Ayah grammar note calls هؤلاء نعت مؤول بمشتق (المشار إليهم) of عبادي; lesson follows it and mentions the common alternative بدل/عطف بيان.
- **25:17:1:** Per the ayah grammar note, يوم is مفعول به of an implied اذكر (not a ظرف), and the clause is coordinated with the earlier قل (25:15). Rules elision + object used accordingly.
- **25:16:6:** The ism of كان is a hidden pronoun; Muyassar and Sa'di gloss the referent as their entering Paradise (دخولهم إياها/دخولها والوصول إليها). Lesson phrases it as the promised reward (entry into Paradise).
- **25:16:10:** مسؤولا explained per Muyassar and Sa'di: requested by Allah's pious servants. The packet's Ibn Kathir text for 25:16 is only a pointer to grouped commentary at 25:15 (not included), so the 25:16 tafsir summary rests on Muyassar and Sa'di.
- **25:18:2:** QAC word i'rab says only "اسم منصوب"; the lesson gives the standard analysis of سُبْحَانَ as مفعول مطلق of an elided verb (نُسَبِّحُ). QAC tags it N, not VN.
- **25:18:4:** Ism of كان taken as an implied ضمير الشأن and its khabar as the clause ينبغي لنا أن نتخذ, following the ayah grammar note.
- **25:18:5:** QAC lemma is the imperfect يَنۢبَغِى; lemma field gives the paradigm perfect اِنْبَغَى per the verified lexeme entry. Fa'il is the interpreted masdar أن نتخذ (ayah note).
- **25:18:10:** Ayah note attaches من دونك to an elided second object of نتخذ; other i'rab works attach it to نتخذ directly or to a ḥāl from أولياء. Lesson follows the note.
- **25:18:12:** QAC GEN is the surface case after extra مِنْ (diptote, fatha for kasra); syntactically it is مفعول به in محل نصب, per the ayah note.
- **25:18:14:** QAC lemma label مَّتَّعْ is the stem before the suffix; lemma field uses مَتَّعَ per the lexeme entry. The shadda on the first mīm reflects assimilation of the nūn of وَلَـٰكِن.
- **25:18:15:** QAC lemma is the plural آبَاء; the lemma field gives the singular أَب per the authoring guide (singular base for nouns).
- **25:18:16:** QAC and the ayah note treat حتى as jārra with an implied أن forming a masdar with نسوا (مجرور متعلق بمتعتهم). Many grammarians call حتى before a perfect verb ابتدائية; mentioned briefly as an alternative.
- **25:18:19:** كانوا taken as ordinary nāqiṣ كان (ism the wāw, khabar قوما); both English translations render "became", i.e. some read it in the sense of صار. Noted as an alternative.
- **25:18:21:** QAC tags بُور ADJ masculine plural; the root entry records it either as plural of بائر or as a masdar used descriptively. The broken-plural rule was not applied because of this disagreement.
- **25:19:1:** Fa' follows QAC (استئنافية); some i'rab works call it الفاء الفصيحة (an implied condition: if you claimed this, then they have belied you).
- **25:19:3:** مَا follows QAC REL with an elided returning pronoun; it can also be analysed as مصدرية (بقولكم). The tafsir paraphrase (في ادعائكم) fits both.
- **25:19:5:** Word i'rab calls this fa' استئنافية, but the ayah grammar note says the clause فما تستطيعون is معطوفة on كذبوكم. Lesson follows the ayah note (conjunction with a consequential sense) and mentions the other label.
- **25:19:8:** QAC calls لا حرف نفي; many i'rab works call it زائدة لتأكيد النفي after the coordinating wāw. The lesson describes it as repeated for emphasis of the negation and keeps the negation rule.
- **25:19:10:** QAC tags مَن REL and its wāw عاطفة, but the ayah note says «مَنْ» شرطية مبتدأ and جملة «ومن يظلم» مستأنفة; both following verbs are jussive. Lesson follows the ayah note: resumptive wāw + conditional مَن (conditional-jazm), and the posUrdu says اسمِ شرط.
- **25:19:11:** The jussive sukūn on the mīm of يَظْلِم is not written because the mīm assimilates into the shadda-marked mīm of مِّنكُمْ.
- **25:20:1:** Word i'rab calls the wa of وَمَآ, وَكَانَ (25:20:18) and وَقَالَ (25:21:1) عاطفة (QAC CONJ), while the ayah grammar notes call these sentences مستأنفة. Lessons follow the word i'rab (conjunction) and mention the ayah-note reading.
- **25:20:2:** Per the ayah note, the object of أَرْسَلْنَا is elided (أحدًا) and مِنَ ٱلْمُرْسَلِينَ attaches to its implied adjective; مِنْ is therefore not treated as زائدة.
- **25:20:7:** The إِنَّهُمْ clause is taught as حال of ٱلْمُرْسَلِينَ following the ayah note; some i'rab works instead assume an elided described noun before it. Kasra of إِنَّ explained by clause-initial position and the lām on its khabar.
- **25:20:20:** QAC generated i'rab line reads صفة منصوبة (word-type label: accusative adjective); syntactically بَصِيرًۭا is the khabar of كَانَ. Lesson says so explicitly.
- **25:21:5:** QAC tags لِقَآء as a form III verbal noun; the root library notes it serves as maṣdar of both لَقِيَ and لَاقَى. Lesson states QAC's form III and mentions لَقِيَ.
- **25:21:16:** QAC English label says feminine plural; أَنفُس is a broken plural (أَفْعُل) of نَفْس, tagged broken-plural per the rule library caution.
- **25:21:17:** QAC lemma عَتَ is a truncated identifier; lemma written عَتَا per the lexeme entry. Mood/structure follows the ayah note: built on implied ḍamma on the elided alif. Uthmani spelling here lacks the alif fāriqa.
- **25:21:18:** QAC tags عُتُوًّۭا as a plain noun (not VN) and the word i'rab says only اسم منصوب; lesson treats it as the maṣdar of عَتَا (root library) functioning as مفعول مطلق, the standard i'rab, and tags cognate-object. Reviewer should confirm.
- **25:21:4:** يَرْجُونَ rendered «امید رکھتے» (Muyassar: لا يؤمّلون); Sa'di pairs hope with fear, noted in dictionaryUrdu without changing the translation.
- **25:22:** Ibn Kathir text for 25:22-24 is only a pointer to grouped commentary at 25:21 and was not supplied; tafsir summaries for 25:22-24 rest on Muyassar and Sa'di.
- **25:22:1:** Follows the i'rab: يَوْمَ is the object of an implied اذكر. Another known analysis attaches يَوْمَ to the sense of the negation (they will be denied good news on the day they see the angels); not adopted.
- **25:22:5:** QAC tags بُشْرَىٰ NOM. The ayah i'rab speaks of «خبر لا» and the noun is an indefinite non-mudaf after لا, so the lesson treats لا as لا النافية للجنس and بُشْرَىٰ as its ism built on an implied fatha (محل نصب). An analysis with a non-governing لا (بشرى mubtada, raf' implied) would match the QAC label; flagged for review.
- **25:22:8:** Speaker of حِجْرًۭا مَّحْجُورًۭا differs in the sources: Muyassar and Sahih International make it the angels (Paradise is forbidden to you); Sa'di (they seek refuge from the angels) and Taqi Usmani make it the criminals. Translation kept neutral («وہ کہیں گے») and both views given in tafsir/syntax.
- **25:22:9:** The i'rab says only «مفعول مطلق لفعل محذوف»; the gloss of the omitted verb in syntaxUrdu is illustrative.
- **25:24:1:** Lemma given as singular صَاحِب per the guide (singular base); QAC lemma is the plural أَصْحَٰب.
- **25:24:5:** QAC tags مُّسْتَقَرًّۭا as a form X passive participle; it is taught as a noun of place on the passive-participle shape (noun-of-place-time rule), consistent with the root entry (ٹھہرنے کا مقام).
- **25:24:7:** QAC tags مَقِيلًۭا as a passive participle. Taught as a noun of place (resting place, from قَالَ يَقِيلُ 'to take midday rest'), per the noun-of-place-time rule, the root entry and Sa'di's gloss (القيلولة); the shape coincides with a hollow-yāʾ passive participle.
- **25:25:4:** The i'rab note does not specify the sense of بِ in بِٱلْغَمَـٰمِ. Lesson takes it as accompaniment (the sky splits and clouds appear, per Muyassar/Sahih International); an instrumental/causal reading ('split by the clouds', cf. Ibn Kathir 'pierced by the clouds') is also known. tafsirUrdu now gives both the Muyassar view (clouds emerge from the sky's openings) and the Sa'di/Ibn Kathir view (the sky splits because of the descending clouds).
- **25:25:7:** The packet i'rab gives only «اسم منصوب» for تَنزِيلًا; it is analysed as an emphatic مفعول مطلق of نُزِّلَ (same root and form II masdar).
- **25:26:3:** Followed the ayah i'rab: al-haqq is na't of al-mulk and li-r-Rahman attaches to the elided khabar, with yawma'idhin attached to the same istiqrar. A known alternative makes al-haqq the khabar (with li-r-Rahman attached to it or as a further predicate); mentioned only here.
- **25:26:2:** QAC gives yawma'idhin as a single T segment (root none). For learners it is split into yawma + 'idhin (tanwin of compensation); no root is invented.
- **25:27:7:** QAC labels the ya of ya-laytani VOC, but the ayah i'rab says ya is li-t-tanbih; per rule inna-sisters only, no vocative rule. Khabar of layta is the clause ittakhadhtu...
- **25:27:9:** Ayah i'rab: ma'a is a place adverb attached to an elided second object of ittakhadhtu (sabilan = first object). Other analyses attach ma'a al-rasul to the verb or treat it as hal of sabilan; following the i'rab, the verb is tagged two-objects (plus zanna, as transformative ittakhadha, consistent with 25:28:4) and sabilan two-objects, since the two-objects rule covers an elided object.
- **25:28:1:** QAC tags wayl(ata) NOM and gives no root; ayah i'rab: munada mudaf, mansub with implied fatha before the first-person ya changed into alif, the alif being mudaf ilayh. Followed the i'rab (vocative, implied-case, accusative); root left null.
- **25:28:4:** Packet word i'rab gives only 'ism mansub' for fulanan and khalilan; the standard two-object analysis (first and second object of ittakhadha 'take X as Y') is used, as also reflected in the lexeme note.
- **25:28:5:** Identity of fulan: Muyassar says the disbelieving friend; Sa'di says a human or jinn devil. Both given with 'ba'd mufassirin'. The Ibn Kathir abridged text for these ayahs is not in the packet, so no named individual or occasion of revelation is mentioned.
- **25:29:8:** QAC word i'rab calls the waw 'atifa, but the ayah grammar note calls the clause wa-kana al-shaytanu ... khadhulan musta'nafa; followed the ayah note (resumption rule).
- **25:29:11:** QAC word-level i'rab label 'sifa mansuba' reflects the ADJ tag; syntactically khadhulan is khabar of kana per the ayah note. Same label on 'asiran (25:26:9) is correct there: it is na't of yawman.
- **25:29:** Translations differ on whether 'and Satan is ever a deserter of man' continues the wrongdoer's speech (Sahih International) or is Allah's comment (Taqi Usmani). The Urdu translation uses no closing quotation mark so as not to decide; tafsir wording is neutral.
- **25:30:1:** Word i'rab calls the wa 'atifa while the ayah note calls the clause musta'nafa; both are mentioned. Sahih International renders the perfect as past ('has said'); Taqi Usmani and Ibn Kathir render it as future ('will say'). The translation keeps the past form; the tafsir notes that some sources present it as a future complaint.
- **25:30:5:** qacCorrection followed: QAC tags قَوْمِى NOM and the word i'rab says اسم مرفوع, but it is the ism of إِنَّ, accusative with the fatha implied before the first-person ya; its khabar is the clause ٱتَّخَذُوا۟.
- **25:30:8:** The packet i'rab gives only 'proper noun, accusative'. ٱلْقُرْءَانَ is analysed as badal of هَـٰذَا (alternative: 'atf bayan); please confirm.
- **25:31:1:** Word i'rab says الواو عاطفة; the ayah note says الواو مستأنفة. Followed the ayah note (resumption). The kaf is analysed per the ayah note as na'ib maf'ul mutlaq (= مثل) with the demonstrative as mudaf ilayh, although the word i'rab says only جار ومجرور.
- **25:31:3:** Per the ayah note, لِكُلِّ نَبِىٍّ is attached to the (elided) second object of جَعَلْنَا, with عَدُوًّا as first object; presented as a fronted prepositional phrase in the second-object slot.
- **25:31:4:** QAC lemma string نَّبِىّ carries a stray shadda on the nun; lemma written نَبِيّ. The lexicographic alternative deriving نَبِيّ from a root meaning elevation is mentioned briefly as a reported view; the app root remains ن ب أ.
- **25:31:8:** Word i'rab says الواو عاطفة; the ayah note says the wa in وكفى is مستأنفة. Followed the ayah note (resumption).
- **25:31:10:** Ayah note calls هَادِيًا tamyiz; it is also commonly parsed as hal. Tamyiz followed, hal mentioned as alternative. وَنَصِيرًا follows it as ma'tuf.
- **25:31:11:** نَصِير is tagged intensive (fa'il from the transitive نَصَرَ used as an attribute); QAC gives only 'noun'. Some grammarians classify it as sifa mushabbaha.
- **25:32:10:** Followed the ayah note: كَذَٰلِكَ attaches to an elided khabar of an elided mubtada (الأمر كذلك). Muyassar and Sa'di paraphrase 'كذلك أنزلناه مفرقا', which suggests the alternative of the kaf as na'ib maf'ul mutlaq of an implied أنزلناه.
- **25:32:11:** QAC lemma string ثَبَّتْ is truncated; lemma written as the lexeme past ثَبَّتَ. Subjunctive explained as by an implied أَنْ after lam al-ta'lil (QAC word i'rab says only فعل مضارع منصوب).
- **25:32:12:** QAC gives no lemma for بِهِۦ; lemma written as the preposition بِ. The pronoun is taken to refer to the Quran (its gradual revelation), per the tafsir.
- **25:32:14:** QAC lemma string رَتَّلْ is truncated; lemma written رَتَّلَ. Meaning of رتلناه: Sa'di/Muyassar 'revealed gradually with deliberation'; Ibn Kathir reports Qatadah 'We explained it'; both given.
- **25:32:15:** QAC word i'rab says only اسم منصوب; analysed as maf'ul mutlaq (verbal noun of the same verb) for emphasis.
- **25:33:1:** The word-level QAC line tags wāw as coordinating. The ayah iʿrab treats the clause as resumptive, followed here.
- **25:33:5:** The ayah iʿrab identifies the exception clause as ḥāl of the Prophet, the object of the preceding verb. The prepositional phrase in 33:6 attaches to an understood ḥāl of the subject of this verb.
- **25:34:9:** QAC groups مَكَان under ك و ن, retained in the packet; the supplied root note discusses the contested related مَكَانَة derivation. The teaching text gives the contextual sense without claiming a settled derivation.
- **25:34:11:** The supplied س ب ل note says both occurrences refer to a fish making its way into the sea. That is an inherited scope statement from al-Kahf and does not describe this occurrence, which means the path from which the deniers strayed.
- **25:35:1:** The word-level QAC label treats wāw as coordination. The verse iʿrab specifies resumption, followed here.
- **25:35:3:** The QAC word-level noun tag and iʿrab give nominative. The explicit subject is the first-person plural suffix of ءَاتَيْنَا; Moses is the first object with implied fatḥa, and the Book is the second object.
- **25:35:7:** The QAC word-level noun tag and iʿrab give nominative. The written alif of أَخَاهُ marks naṣb as the first object of جَعَلْنَا; هَـٰرُونَ is its accusative substitute and وَزِيرًۭا is the second object.
- **25:36:1:** QAC word-level tag calls fāʾ resumptive; the ayah iʿrab coordinates the clause with جَعَلْنَا, followed here.
- **25:36:8:** QAC word-level tag calls fāʾ resumptive; the ayah iʿrab coordinates the clause with the omitted clause of the people denying the two messengers, followed here.
- **25:37:1:** Word-level QAC tags the wa as CONJ (i'rab line: عاطفة), but the ayah i'rab calls it مستأنفة and makes قوم the object of an implied اذكر; followed the ayah i'rab (resumption). Known alternatives not adopted: قوم منصوب by an implied verb explained by أغرقناهم, or coordinated with the object of دمّرناهم in 25:36.
- **25:37:3:** QAC morphology tags لَمَّا as a time adverb (effective pos noun) while the ayah i'rab calls it حرف وجوب لوجوب; kept the ظرف analysis per packet pos and mentioned the particle view. The ayah i'rab makes the whole conditional sentence a ḥāl of قوم نوح; reported as such.
- **25:37:8:** QAC i'rab only says جار ومجرور; per the ayah note it attaches to an implied ḥāl of آية (fronted adjective of an indefinite becomes ḥāl).
- **25:38:2:** QAC tags وَثَمُودَا۟ GEN and the generated i'rab line says اسم علم مجرور, but there is no preposition or muḍāf; it is coordinated with the accusatives وَعَادًۭا / وَقَوْمَ and is a diptote accusative with fatḥa (the written alif carries the not-pronounced circle). Wrote منصوب, ممنوع من الصرف.
- **25:38:1:** Following the ayah i'rab (معطوف على قوم, i.e. under the implied اذكر), translations for 25:37–38 supply «یاد کیجیے». Both English translations and al-Muyassar render the governing sense as 'We destroyed' (أهلكنا); this is reflected in the tafsir summary, not the syntax.
- **25:38:3:** QAC lemma is the plural أَصْحَٰب; per the guide's singular-base convention the lemma field gives صَاحِب.
- **25:38:8:** QAC tags كَثِيرًا as N (not ADJ); ayah i'rab calls it the second نعت of قرونا. Kept pos noun and described it as a فعيل noun used adjectivally; no resembling-adjective rule assigned.
- **25:39:1:** Per the ayah i'rab, the first كُلًّا is the object of an omitted verb explained by what follows (implied أنذرنا), the ضربنا clause being تفسيرية — tagged ishtighal. Lemma fields for verbs use the 3MS perfect (أَغْرَقَ، أَعْتَدَ، تَبَّرَ) from the lexeme entries rather than the QAC lemma strings.
- **25:39:7:** QAC i'rab line says only اسم منصوب; analysed as مفعول مطلق of تَبَّرْنَا (masdar of the same verb), consistent with the root entry.
- **25:40:1:** The word-level wāw is tagged CONJ, but the ayah iʿrab calls the clause resumptive. Followed the verse analysis.
- **25:40:9:** The word-level iʿrab calls fāʾ supplemental, while the ayah note coordinates the entire question with the preceding clause. The Urdu records both levels and tags the particle supplemental under the shared extra-particle rule.
- **25:40:15:** The supplied ر ج و root card describes the singular يَرْجُوا۟ and the silent Uthmani alif; in this verse يَرْجُونَ is explicitly plural. The word entry distinguishes the radical wāw from the plural marker.
- **25:41:1:** The word-level wāw is tagged CONJ, but the ayah iʿrab calls the conditional clause resumptive, and gives an omitted قول as its answer. The intervening negative sentence is parenthetical on this analysis.
- **25:41:6:** The lexical teaching form follows Hafs هُزُو as explained by the supplied root entry, while the root retains its original hamza.
- **25:41:11:** The ayah iʿrab calls رسولا ḥāl of the omitted object pronoun in بعثه. It is not a second object of بَعَثَ.
- **25:42:1:** QAC word morphology tags إِن as a conditional particle. The ayah iʿrab identifies it as lightened إِنَّ without syntactic government, corroborated by the distinguishing lām on the predicate of كَادَ; the teaching text follows the ayah analysis.
- **25:42:6:** The ayah iʿrab identifies counterfactual لولا before a nominal construction, with both an understood predicate for the interpreted masdar and an elided answer supplied by the preceding speech. The library's exhortation card is scoped to لولا of urging, and its law-condition card is scoped to لَوْ; neither is assigned.
- **25:42:10:** The word-level wāw is tagged coordinating, but the ayah note calls the clause resumptive. Followed the ayah note.
- **25:42:15:** QAC word morphology tags مَنْ relative. The ayah iʿrab identifies an interrogative mubtada; the question suspends the normal direct government of يَعْلَمُونَ and fills its two object slots.
- **25:42:17:** The supplied س ب ل root note describes both occurrences as the fish making its way into the sea. This inherited scope statement does not describe the path from which the deniers have strayed here.
- **25:43:4:** The ayah iʿrab lists إِلَـٰهَهُۥ and هَوَىٰهُ as the two objects of ٱتَّخَذَ. The Urdu explains the predicate relation: desire is taken as a god, with the predicate object presented before the entity taken as such.
- **25:43:5:** The QAC lemma/fork gives هَوَاء, which the supplied root note distinguishes as air or emptiness. Here the vocalised token and all meaning sources support the lemma هَوًى, meaning desire.
- **25:44:1:** QAC tags أَمْ as CONJ and its word i'rab says حرف عطف, but the ayah grammar note calls it «أم» المنقطعة (= بل + interrogative hamza). The lesson follows the ayah i'rab (retraction rule).
- **25:44:4:** QAC labels أَكْثَرَ a plain noun; the lesson describes it as an elative (af'al) in line with the root library entry. It is the ism of أَنَّ; the أَنَّ clause fills both objects of تَحْسَبُ (سدّ مسدّ مفعولي حسب).
- **25:44:11:** QAC i'rab gives only جار ومجرور; the lesson attaches it to an elided khabar of هُمْ (standard analysis). Some grammarians treat this kāf as a noun meaning مثل; not raised in the lesson.
- **25:44:12:** The i'rab calls بَلْ only حرف اضراب. The lesson explains it as moving to a stronger statement without cancelling the first (إضراب انتقالي), an interpretive gloss consistent with Muyassar and Sa'di.
- **25:44:14:** The second term of comparison (من الأنعام) is elided and understood from context; Sa'di makes it explicit.
- **25:45:2:** qacCorrection applied: QAC tags تَرَ 3FS; addressed to the Prophet (رَبِّكَ), it is 2MS jussive after لَمْ with the final alif dropped. The generated i'rab line was not followed on person.
- **25:45:5:** The ayah note says كيف is a ḥāl but does not name its ṣāḥib (the hidden subject of مَدَّ or ٱلظِّلَّ are both possible); the lesson leaves it unspecified. The clause كَيْفَ مَدَّ is بدل اشتمال of رَبِّكَ per the ayah note.
- **25:45:8:** QAC word i'rab labels the wāw عاطفة, while the ayah note calls the clause «ولو شاء لجعله» اعتراضية (between مَدَّ and the coordinated ثُمَّ جَعَلْنَا). The lesson follows the ayah note and calls the wāw اعتراضية (parenthetical rule).
- **25:45:11:** QAC i'rab says only اسم منصوب. The lesson treats سَاكِنًا as the second object of جَعَلَ in the sense صيّر ("make it still"), with هُ as first object; a ḥāl reading would require جعل = خلق, which does not fit the meaning.
- **25:45:15:** Per the ayah note, عَلَيْهِ is attached to a ḥāl of دَلِيلًا; the lesson explains it as a fronted attribute of an indefinite noun becoming ḥāl (standard rule). The pronoun refers to ٱلظِّلَّ.
- **25:48:7:** QAC 0.4 tags يَدَىْ NOM and its generated i‘rab says «اسم مرفوع». In بَيْنَ يَدَىْ رَحْمَتِهِۦ it is the muḍāf ilayh of the adverb بَيْنَ, so it is genitive with the dual yāʾ (nūn dropped for iḍāfa). Lesson writes genitive and tags genitive, not nominative; same pattern as the dual NOM errors listed under the nominative rule.
- **25:48:9:** QAC i‘rab gives only «الواو عاطفة». The lesson calls the clause وَأَنزَلْنَا coordinated with the preceding sentence and notes the shift from 3rd to 1st person (iltifat); it does not commit to whether it is coordinated to the ṣila or to the whole nominal sentence, since the clause has no pronoun returning to ٱلَّذِىٓ.
- **25:48:5:** QAC tags بُشْرًۢا as a masculine indefinite noun (LEM bu$or) and the ayah note makes it ḥāl of ٱلرِّيَـٰحَ. Lexical analysis (plural of بشير lightened from بُشُر, or a masdar used as ḥāl) is not stated in the lesson; reviewer may add it.
- **25:49:4:** Masculine adjective مَيْتًا for feminine بَلْدَةً: the lesson gives the common explanation that بلدة here means place/land (بمعنى البلد/المكان); this explanation is from standard i‘rab works, not from the packet sources. QAC tags the adjective MS.
- **25:49:5:** Following the QAC ayah note, أَنْعَـٰمًا is the first object of نُسْقِيَ and the attached هُ (the water) is treated as the second object. QAC word i‘rab only says «مفعول به» for the pronoun. Subjunctive by coordination on لِّنُحْـِۧىَ.
- **25:49:6:** Per QAC note, مِمَّا attaches to an implied ḥāl of أَنْعَـٰمًا (fronted because its owner is indefinite); the returning pronoun of the ṣila خَلَقْنَآ is elided (خلقناه).
- **25:49:9:** أَنَاسِىَّ: lesson follows the QAC note (plural of إنسان, originally أناسين, nūn changed to yāʾ and assimilated). A well-known alternative makes it the plural of إِنْسِيّ (like كرسيّ/كراسيّ). Diptote (صيغة منتهى الجموع), no tanwīn.
- **25:49:10:** QAC: كَثِيرًا is «صفة منصوبة»; the lesson attaches it to أَنَاسِىَّ (nearest noun). Some i‘rab works allow it to describe both أنعاما and أناسي.
- **25:47:11:** نُشُورًا glossed per Muyassar/Sa‘di (people rise and spread out in the day for their livelihood); QAC gloss "resurrection" reflects the root sense, mentioned in dictionaryUrdu. QAC tags it plain N, so the lesson calls it a فُعُول noun with verbal-noun meaning rather than labelling it a masdar.
- **25:46:2:** Perfect قَبَضْنَـٰهُ translated in past tense; Sa‘di explains it as the recurring daily shrinking of shadow. The Ibn Kathir commentary for 25:45–47 is referenced but not included in the packet, so the 25:46–47 tafsir summaries rely on Muyassar (47) and Sa‘di.
- **25:48:** Tafsir summary cites the hadith «إن الماء طهور لا ينجسه شيء» only because the provided Ibn Kathir text records it; reviewer may prefer to drop it for brevity.
- **25:50:2:** The lesson follows the context of the preceding water verses and Muyassar in taking the object pronoun as rainwater apportioned among people. Saʿdi connects the wording more broadly to the preceding observable signs.
- **25:50:5:** Word-level QAC calls the fa resumptive. The verse iʿrab conjoins its clause to sarrafnahu; the lesson follows the verse analysis.
- **25:51:1:** The word-level source calls waw conjunctive, while the verse note describes the conditional sentence as resumptive. The lesson preserves the connective in translation and describes the clause as a fresh conditional.
- **25:52:1:** QAC labels la as negation, but the command context and the jussive verb establish prohibitive la (nahy). The lesson keeps the effective particle type and teaches the prohibitive construction.
- **25:52:2:** QAC labels the verb feminine third singular, a form that is superficially homographic with the masculine singular address. The addressee is the Prophet and the following coordinated imperative jahidhum is second masculine singular; the lesson therefore teaches 2MS. The final kasra is for connected recitation after the original jussive sukun.
- **25:53:4:** Packet correction applied: QAC NOM is inconsistent with the dual ya ending and the word being the object of maraja. The lesson teaches the accusative dual.
- **25:53:6:** The shared root entry for ʿ-dh-b covers punishment but omits the distinct lexical sense of ʿadhb as fresh/palatable water. The occurrence note gives the attested contextual sense without changing the shared root assignment.
- **25:53:10:** The brief word-level iʿrab specifies nominative only. The lesson reads ujaj as the adjective of milh, paralleling the ʿadhb furat clause; a second-predicate reading is also possible.
- **25:53:12:** The verse iʿrab attaches baynahuma to an implied second object of jaʿala. A direct attachment to jaʿala in the sense of placing or creating a barrier also yields the same contextual sense.
- **25:53:15:** QAC gives a noun/passive participle in the accusative. The lesson retains that word type and analyzes it as the adjective of hijran.
- **25:54:10:** Word-level i'rab line calls this wa عاطفة (QAC CONJ), but the ayah grammar note calls «وكان ربك قديرا» مستأنفة; the lesson follows the ayah note and treats the wa as resumptive. The same applies to 25:55:1, 25:55:10 and 25:56:1, whose clauses the ayah notes also call مستأنفة. Reviewer to confirm.
- **25:54:7:** جعل taken as صيّر with two objects: the attached pronoun (referring to بشرا) is the first object and نسبا the second, with صهرا coordinated. The word i'rab only states the pronoun is مفعول به; some render the sense as 'made of him relations' (implied ذا نسب or من), which keeps the same case analysis.
- **25:54:12:** قدير tagged intensive (فعيل as an intensive of قادر, a common analysis); QAC labels it a plain noun. Reviewer may prefer resembling-adjective.
- **25:55:14:** The generated i'rab line reads «صفة منصوبة», which reflects the word class (QAC ADJ); its syntactic role here is خبر كان, with «على ربه» attached to it and fronted. The attachment of the prepositional phrase is not stated in the QAC notes and follows the standard analysis.
- **25:55:11:** The article in الكافر is explained as generic (جنس), consistent with the provided tafsir, which speak of the disbeliever in general; no specific person is named in the sources.
- **25:55:9:** Lemma written as the perfect ضَرَّ per the guide and the lexeme entry; QAC's lemma identifier is the imperfect يَضُرَّ.
- **25:55:7:** The singular verbs ينفعهم/يضرهم agree with the wording of ما while referring to many idols; the Urdu translation uses plural for natural meaning.
- **25:57:5:** The verse iʿrab specifies extra min after the negation and ajrin as the second object. The lesson distinguishes its visible genitive ending from its accusative syntactic position.
- **25:57:7:** The word-level QAC label is restriction. The verse iʿrab specifies an explicit disconnected exception, with the relative man as mustathna, so the lesson uses the exception rule.
- **25:57:12:** The verse iʿrab attaches ila rabbihi to an implied second object of yattakhidha. Taking ittakhadha as adopting a path with one explicit object and the phrase as a modifier of sabilan is another reading consistent with the reviewed paradigm.
- **25:58:9:** The word-level QAC gloss calls the waw conjunctive; the verse note marks kafa bihi as a resumptive sentence. The lesson follows the verse analysis.
- **25:58:10:** The verse iʿrab identifies the first ba as extra and the attached pronoun as the subject in the nominative syntactic position. The following ba in bidhunubi is ordinary and attaches to khabiran.
- **25:58:13:** The word-level iʿrab supplies the accusative adjective classification. At sentence level the verse iʿrab specifies its function as tamyiz, which is the analysis taught here.
- **25:59:3:** QAC word-level morphology and iʿrab call al-samawat genitive because of its kasra. It is the direct object of khalaqa and is accusative; the sound feminine plural marks the accusative with kasra. The following coordinated al-ard shows the ordinary accusative fatha.
- **25:59:14:** QAC tags the word as an adjective, which describes its lexical class. The verse iʿrab takes it as the nominative predicate of the opening relative pronoun, which the lesson follows.
- **25:59:17:** The translation and word analysis follow the verse iʿrab: ask one well informed about Him, with bihi attached to khabiran. Muyassar and Saʿdi identify Allah as the one who knows His own attributes and greatness; the Sahih International gloss identifies the Prophet as the informed one.
- **25:60:1:** Word-level QAC calls waw conjunctive; the verse iʿrab treats it and the conditional sentence as resumptive. The lesson follows the verse analysis.
- **25:60:2:** The verse iʿrab treats the hidden pronoun referring to the verbal noun of qila as the passive subject. The lesson follows that analysis; some analyses give the reported clause that syntactic role.
- **25:60:7:** Raw QAC calls ma relative, but the verse iʿrab treats it as an interrogative mubtada with al-Rahman as khabar. The lesson keeps the effective pronoun category and teaches the contextual interrogative reading.
- **25:60:10:** Raw QAC reads relative ma. The verse iʿrab and Saʿdi take the lam as causal and ma as masdariyya: “shall we prostrate merely because you command us?” The lesson follows that analysis and mentions the relative alternative in the label to account for the effective pronoun type. Both English translations represent the relative reading.
- **25:60:12:** Word-level QAC calls waw conjunctive. The verse iʿrab treats the clause as resumptive and the hidden subject of zada as referring to the preceding saying, the call to prostrate.
- **25:61:7:** The ayah i'rab states only that «في السماء» attaches to the elided second object of the first جعل. The second جعل (with فيها) is analysed in parallel (سراجا first object, فيها attached to an elided second object); an alternative is single-object جعل ('placed') with فيها attached directly to the verb.
- **25:61:6:** QAC lemma is the plural بُرُوج; the lesson gives the singular base بُرْج per the guide's lemma convention. Tafsir differs on the meaning: great stars (Ibn Kathir, citing Mujahid and others; Muyassar) or the stations of the sun and moon (Sa'di gives both).
- **25:62:7:** The packet i'rab does not state what لِّمَنْ attaches to; the lesson attaches it to جَعَلَ. An alternative attaches it to an implied adjective of خِلْفَةً.
- **25:62:13:** QAC tags شُكُورًا as a plain noun. Lexically it is a masdar of شَكَرَ (like شُكْر), not the intensive شَكُور; since neither QAC nor the i'rab names it a masdar, the verbal-noun rule was not applied and morphology describes it only as a noun on فُعُول.
- **25:63:1:** QAC and its generated i'rab line label the وَ a conjunction (الواو عاطفة), but the ayah i'rab calls the sentence مستأنفة with its khabar in 25:75; the lesson follows the ayah i'rab (resumption).
- **25:63:2:** The generated i'rab line reads صفة مجرورة (from QAC's ADJ tag), but syntactically ٱلرَّحْمَـٰنِ is the مضاف إليه of عِبَادُ; the lesson calls it a صفت by word type and مضاف الیہ by role.
- **25:63:3:** Per the ayah i'rab (khabar in 25:75), ٱلَّذِينَ is a نعت of عباد in محل رفع. Both provided translations ('are those who') read it as the khabar; translationUrdu follows that common rendering («وہ ہیں جو») and the phrase note explains the i'rab view. Reviewer may prefer a rendering that leaves the sentence open.
- **25:63:4:** QAC lemma for يَمْشُونَ is written مَّشَ (assimilation artefact); the lesson uses the lexeme's citation form مَشَى.
- **25:63:7:** هَوْنًا is نائب مفعول مطلق per the ayah i'rab (مشيًا هونًا); an alternative takes it as a ḥāl (هيّنين), in line with Sa'di's gloss ساكنين متواضعين.
- **25:63:12:** سَلَامًا follows the ayah i'rab: نائب مفعول مطلق of an implied نسلّم (اسم مصدر of تسليم). An alternative takes it as the direct object of قالوا meaning a sound, sin-free saying, close to the tafsir paraphrase (خطابا يسلمون فيه من الإثم).
- **25:61:11:** Shared-data observation: the root entry ن و ر says only نَار occurs from this root in the in-scope surahs, but this chunk has مُنِير (form IV active participle). Likewise the root entry ش ك ر says only the imperfect occurs, but 25:62:13 has the noun شُكُور. The root notes appear written for Surahs 18/23/32/36/55 and should be generalised.
- **25:64:2:** The ayah grammar note treats يَبِيتُونَ as an incomplete (ناسخ) verb whose wāw is its ism and سُجَّدًۭا its khabar; the word i'rab calls the wāw a fāʿil (complete verb, سُجَّدًۭا then ḥāl). The lesson follows the ayah note and mentions the alternative.
- **25:64:4:** Word i'rab labels سُجَّدًۭا 'صفة منصوبة' (adjective-type word); its role is taught as khabar of يَبِيتُونَ per the ayah note, with ḥāl as the alternative if بات is complete.
- **25:64:5:** QAC lemma for قِيَـٰمًۭا is قَآئِم (broken plural of the active participle, like صِيَام of صَائِم). A common alternative takes قِيَام as a masdar used in the sense of the participle; mentioned in dictionaryUrdu.
- **25:65:8:** Speaker of إِنَّ عَذَابَهَا … and 25:66: Sahih International and Sa'di (وهذا منهم على وجه التضرع) keep them in the believers' supplication; Taqi Usmani closes the quotation at the end of 25:65. The Urdu translation and tafsir present them as part of the supplication; the ayah note calls the clause مستأنفة.
- **25:66:2:** Taught as a blame verb like بِئْسَ with a hidden fāʿil (هي) explained by the tamyīz and an elided مخصوص بالذم (جهنم), following the ayah note and the lexeme entry. Alternative: ordinary verb 'it is evil' with هي referring to جهنم and مُسْتَقَرًّۭا still tamyīz.
- **25:66:3:** QAC labels مُسْتَقَرًّۭا and مُقَامًۭا Form X / Form IV passive participles; taught under noun-of-place-time as place nouns on the passive-participle shape (rule example مُرْتَفَقًا). Either could also be read as a masdar mīmī (settling/residing); not mentioned in the lesson.
- **25:67:9:** Following the ayah note, بَيْنَ ذَٰلِكَ attaches to an implied ḥāl of قَوَامًۭا (an adjective fronted before its noun). Other i'rab treat بَيْنَ ذَٰلِكَ as the khabar of كان with قَوَامًۭا as ḥāl or a second khabar; not mentioned in the lesson.
- **25:67:7:** Lexeme entry notes other canonical readings يَقْتِرُوا and يُقْتِرُوا; the lesson follows the Hafs text (يَقْتُرُوا۟, bab nasara) and only mentions the lexical variant يَقْتِرُ.
- **25:67:3:** The object of أَنفَقُوا۟ is unstated (their wealth, per Muyassar); tagged elision for the omitted object.
- **25:68:18:** QAC morphology and word iʿrab label مَن relative and the wāw a conjunction. The verse iʿrab makes this a resumptive conditional and مَن its conditional subject. The two jussive imperfects support that analysis. The effective app type remains unchanged.
- **25:68:22:** The contextual gloss follows the broad sense of punishment given by the supplied tafsirs. Ibn Kathir also records an interpretation as a valley of Hell, which is included in the tafsir summary.
- **25:69:1:** The lemma uses the active Form III citation form, while the occurrence is passive. The verse iʿrab analyzes its clause as a substitute for the conditional answer.
- **25:70:1:** QAC tags إِلَّا RES (i‘rab line: أداة حصر). The ayah note calls مَن مستثنى متصل and the excepted-from group (the sinner of 25:68–69) is stated, so the lesson teaches exception per rules.json.
- **25:70:2:** Taught as مستثنى متصل in محل نصب per the ayah note. Some i‘rab works treat the exception as منقطع, or مَن as a mubtada whose khabar is فَأُو۟لَـٰٓئِكَ…; not adopted.
- **25:70:8:** QAC labels the فاء استئنافية and the note calls «فأولئك يبدل» مستأنفة; followed. Some analysts take it as a linking فاء because of the conditional sense of مَن.
- **25:70:11:** QAC morphology tags سَيِّـَٔاتِهِمْ GEN and the generated i‘rab line says اسم مجرور, but the ayah note states the two accusative nouns are the two objects of يُبَدِّلُ. Taught as first object, منصوب with kasra (sound feminine plural); QAC case tag is a discrepancy.
- **25:70:12:** QAC tags حَسَنَـٰتٍۢ GEN (i‘rab line: اسم مجرور); there is no preposition and the ayah note makes it the second object of يُبَدِّلُ. Taught as منصوب with kasra tanwin. A minority analysis (منصوب بنزع الخافض, i.e. بحسنات) is not adopted.
- **25:70:13:** QAC labels the واو of وَكَانَ عاطفة; many i‘rab works call it استئنافية. Followed QAC.
- **25:70:15:** QAC i‘rab line «صفة منصوبة» for غَفُورًۭا and رَّحِيمًۭا reflects the ADJ morphology tag. Syntactically taught as khabar of كان and second khabar; رَّحِيمًۭا as صفة of غَفُورًۭا mentioned as an alternative.
- **25:71:1:** QAC tags مَن REL and the فاء of فَإِنَّهُۥ REM (استئنافية); the ayah note only says the sentence is مستأنفة and gives no khabar. The lesson teaches مَن as relative mubtada whose khabar is the إِنَّ clause, joined by a فاء that links the khabar because the general relative has conditional sense, and mentions the source label. Common alternative: مَن شرطية, تَابَ فعل الشرط, الفاء رابطة لجواب الشرط. Reviewer should confirm.
- **25:71:4:** Ayah note: «صالحًا» مفعول به; followed. Alternative: صفة of an elided object (عملًا صالحًا), mentioned briefly.
- **25:71:9:** QAC morphology tags مَتَابًۭا as a plain noun; the ayah note calls it مصدر ميمي مفعول مطلق; taught accordingly (underlying مَتْوَب).
- **25:72:1:** Per the note, ٱلَّذِينَ is coordinated with the relative of 25:68. محل رفع assumes the chain of relatives describing عباد الرحمن (25:63) is nominative.
- **25:72:3:** Tafsir differ on لَا يَشْهَدُونَ ٱلزُّورَ: not attending falsehood (Sa‘di; Ibn Kathir from context) vs not giving false testimony (Muyassar mentions both; Ibn Kathir reports it). The lesson follows QAC (ٱلزُّورَ direct object) with the attend meaning and mentions the testimony view.
- **25:72:9:** QAC tags كِرَامًۭا N, MP, lemma كَرِيم; taught as broken plural (فِعَال) of كَرِيم and حال from the واو of the second مَرُّوا۟ per the ayah note.
- **25:70:** Packet tafsir for 25:70 and 25:71 contains Sa‘di only: Muyassar is absent and the Ibn Kathir field points to grouped commentary at 25:68 that is not included. Tafsir summaries for these two ayahs rest on Sa‘di alone; the hadith Sa‘di mentions was omitted.
- **25:75:4:** QAC tags مَا in بِمَا as REL (effective pos pronoun), but the ayah i'rab note says «ما» مصدرية with the interpreted masdar governed by بِ and attached to يُجْزَوْنَ. Written as masdar ما per the i'rab; a relative reading (بالذي صبروا عليه) would give the same meaning.
- **25:73:7:** لَمْ normally gives past negation; here it is the answer of إِذَا describing a habitual trait, so it is translated in the general present («نہیں گر پڑتے»). The negation targets the ḥāl صُمًّا وَعُمْيَانًا (they do attend to the verses, but not deaf and blind), following Muyassar and Sa'di.
- **25:74:13:** Singular إِمَامًا is the second object of a plural first object (نَا). The Urdu explains it as the rank of leadership / each being an exemplar; this is a standard grammatical explanation not stated in the packet sources (Muyassar قدوة, Sa'di درجة الإمامة). Taqi Usmani renders 'heads' (plural), Sahih International 'a leader'.
- **25:74:6:** Per the QAC ayah note, مِنْ أَزْوَٰجِنَا وَذُرِّيَّـٰتِنَا attaches to an implied ḥāl of قُرَّةَ (fronted adjective of an indefinite). Likewise لِلْمُتَّقِينَ attaches to an implied ḥāl of إِمَامًا.
- **25:74:7:** Sa'di glosses أزواجنا as قرنائنا (companions, peers and wives); the translation uses 'wives' and the dictionary note mentions the wider view without presenting either as exclusive.
- **25:74:8:** QAC lemma is the plural ذُرِّيَّٰت; lemma written as the singular base ذُرِّيَّة (packet lemmaFork) per the guide.
- **25:73:3:** Lemma fields for the passive verbs (ذُكِّرُوا۟، يُجْزَوْنَ، وَيُلَقَّوْنَ) are given as the active 3MS perfect (ذَكَّرَ، جَزَى، لَقَّى) per the guide; the verb notes use the passive lexeme entries ذُكِّرَ/يُذَكَّرُ، جُزِيَ/يُجْزَى، لُقِّيَ/يُلَقَّى.
- **25:75:1:** Per the QAC ayah note, the clause أُو۟لَـٰٓئِكَ يُجْزَوْنَ is the khabar of عِبَادُ in 25:63; the ٱلَّذِينَ of 25:73-74 are taken as coordinated with the earlier relatives (محل رفع).
- **25:76:** Tafsir: only Sa'di's grouped commentary on 25:75-76 is provided (no Muyassar text; Ibn Kathir points to the 25:75 group). The Urdu summary draws on Sa'di only and adds nothing beyond it.
- **25:76:1:** QAC note: hal from the na'ib fa'il of يُجْزَوْنَ in 25:75. Lesson follows it.
- **25:76:3:** Per QAC note the verb is used like نعم: fa'il is a hidden pronoun explained by the tamyiz مُسْتَقَرًّا, the makhsus (الغرفة) is elided, and the clause is hal from الغرفة (25:75). One could also read it as an independent praise sentence; not used.
- **25:76:4:** QAC tags it a form X passive participle; taught as a noun of place on the passive-participle pattern (rules: noun-of-place-time, not participle). A masdar-mimi reading (settling) is also possible lexically.
- **25:76:5:** QAC tags it a form IV passive participle (مُقَام with damma, from أَقَامَ); taught as noun of place, distinguished from مَقَام.
- **25:77:2:** QAC i'rab: ما نافية. A known alternative takes it as interrogative (What would my Lord care for you...), which Sahih International's rendering reflects; mentioned briefly in syntaxUrdu.
- **25:77:3:** QAC lemma is the imperfect identifier يَعْبَؤُا۟; lesson lemma uses the lexeme entry's perfect عَبَأَ per the guide's lemma convention. Mood not marked by QAC: indicative (no governor), damma on the hamza.
- **25:77:6:** لولا here is حرف امتناع لوجود (QAC COND). The rule library has no dedicated card for this لولا (law-condition and exhortation both exclude it), so it is tagged elision + condition-answer for the elided khabar and elided answer. Consider adding a rule.
- **25:77:7:** QAC tags دُعَاء a plain noun (not verbal noun), so verbal-noun was not used. Meaning follows Muyassar and Sa'di: your calling on Him in worship and in petition (masdar annexed to its subject). No other view appears in the provided tafsir.
- **25:77:9:** Object of كَذَّبْتُمْ is unexpressed; translation supplies (the truth) following Taqi Usmani. Tagged elision for the unstated object.
- **25:77:10:** Word-level QAC i'rab calls this فاء استئنافية (QAC REM), but the ayah grammar note says the clause فسوف يكون is معطوفة على المستأنفة. Lesson follows the ayah note (conjunction) per the rules library.
- **25:77:11:** QAC note: ism of يكون is a pronoun for the punishment (العذاب); Sa'di agrees. Muyassar and Sahih International take the referent as your denial (which leads to clinging punishment). Lesson follows QAC; both meanings converge.
- **25:77:12:** QAC tags لِزَام a plain noun; the root entry calls it the masdar of لَازَمَ used in the sense of a clinging thing. verbal-noun rule not applied since neither QAC nor the i'rab names it a masdar.

## Per-ayah sources

- **25:1:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=1); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=1); [Quran.com](https://quran.com/25/1).
- **25:2:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=2); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=2); [Quran.com](https://quran.com/25/2).
- **25:3:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=3); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=3); [Quran.com](https://quran.com/25/3).
- **25:4:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=4); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=4); [Quran.com](https://quran.com/25/4).
- **25:5:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=5); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=5); [Quran.com](https://quran.com/25/5).
- **25:6:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=6); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=6); [Quran.com](https://quran.com/25/6).
- **25:7:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=7); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=7); [Quran.com](https://quran.com/25/7).
- **25:8:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=8); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=8); [Quran.com](https://quran.com/25/8).
- **25:9:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=9); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=9); [Quran.com](https://quran.com/25/9).
- **25:10:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=10); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=10); [Quran.com](https://quran.com/25/10).
- **25:11:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=11); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=11); [Quran.com](https://quran.com/25/11).
- **25:12:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=12); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=12); [Quran.com](https://quran.com/25/12).
- **25:13:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=13); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=13); [Quran.com](https://quran.com/25/13).
- **25:14:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=14); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=14); [Quran.com](https://quran.com/25/14).
- **25:15:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=15); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=15); [Quran.com](https://quran.com/25/15).
- **25:16:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=16); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=16); [Quran.com](https://quran.com/25/16).
- **25:17:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=17); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=17); [Quran.com](https://quran.com/25/17).
- **25:18:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=18); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=18); [Quran.com](https://quran.com/25/18).
- **25:19:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=19); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=19); [Quran.com](https://quran.com/25/19).
- **25:20:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=20); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=20); [Quran.com](https://quran.com/25/20).
- **25:21:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=21); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=21); [Quran.com](https://quran.com/25/21).
- **25:22:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=22); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=22); [Quran.com](https://quran.com/25/22).
- **25:23:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=23); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=23); [Quran.com](https://quran.com/25/23).
- **25:24:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=24); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=24); [Quran.com](https://quran.com/25/24).
- **25:25:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=25); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=25); [Quran.com](https://quran.com/25/25).
- **25:26:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=26); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=26); [Quran.com](https://quran.com/25/26).
- **25:27:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=27); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=27); [Quran.com](https://quran.com/25/27).
- **25:28:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=28); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=28); [Quran.com](https://quran.com/25/28).
- **25:29:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=29); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=29); [Quran.com](https://quran.com/25/29).
- **25:30:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=30); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=30); [Quran.com](https://quran.com/25/30).
- **25:31:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=31); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=31); [Quran.com](https://quran.com/25/31).
- **25:32:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=32); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=32); [Quran.com](https://quran.com/25/32).
- **25:33:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=33); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=33); [Quran.com](https://quran.com/25/33).
- **25:34:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=34); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=34); [Quran.com](https://quran.com/25/34).
- **25:35:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=35); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=35); [Quran.com](https://quran.com/25/35).
- **25:36:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=36); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=36); [Quran.com](https://quran.com/25/36).
- **25:37:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=37); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=37); [Quran.com](https://quran.com/25/37).
- **25:38:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=38); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=38); [Quran.com](https://quran.com/25/38).
- **25:39:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=39); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=39); [Quran.com](https://quran.com/25/39).
- **25:40:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=40); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=40); [Quran.com](https://quran.com/25/40).
- **25:41:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=41); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=41); [Quran.com](https://quran.com/25/41).
- **25:42:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=42); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=42); [Quran.com](https://quran.com/25/42).
- **25:43:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=43); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=43); [Quran.com](https://quran.com/25/43).
- **25:44:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=44); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=44); [Quran.com](https://quran.com/25/44).
- **25:45:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=45); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=45); [Quran.com](https://quran.com/25/45).
- **25:46:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=46); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=46); [Quran.com](https://quran.com/25/46).
- **25:47:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=47); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=47); [Quran.com](https://quran.com/25/47).
- **25:48:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=48); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=48); [Quran.com](https://quran.com/25/48).
- **25:49:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=49); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=49); [Quran.com](https://quran.com/25/49).
- **25:50:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=50); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=50); [Quran.com](https://quran.com/25/50).
- **25:51:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=51); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=51); [Quran.com](https://quran.com/25/51).
- **25:52:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=52); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=52); [Quran.com](https://quran.com/25/52).
- **25:53:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=53); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=53); [Quran.com](https://quran.com/25/53).
- **25:54:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=54); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=54); [Quran.com](https://quran.com/25/54).
- **25:55:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=55); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=55); [Quran.com](https://quran.com/25/55).
- **25:56:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=56); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=56); [Quran.com](https://quran.com/25/56).
- **25:57:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=57); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=57); [Quran.com](https://quran.com/25/57).
- **25:58:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=58); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=58); [Quran.com](https://quran.com/25/58).
- **25:59:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=59); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=59); [Quran.com](https://quran.com/25/59).
- **25:60:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=60); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=60); [Quran.com](https://quran.com/25/60).
- **25:61:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=61); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=61); [Quran.com](https://quran.com/25/61).
- **25:62:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=62); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=62); [Quran.com](https://quran.com/25/62).
- **25:63:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=63); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=63); [Quran.com](https://quran.com/25/63).
- **25:64:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=64); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=64); [Quran.com](https://quran.com/25/64).
- **25:65:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=65); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=65); [Quran.com](https://quran.com/25/65).
- **25:66:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=66); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=66); [Quran.com](https://quran.com/25/66).
- **25:67:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=67); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=67); [Quran.com](https://quran.com/25/67).
- **25:68:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=68); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=68); [Quran.com](https://quran.com/25/68).
- **25:69:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=69); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=69); [Quran.com](https://quran.com/25/69).
- **25:70:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=70); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=70); [Quran.com](https://quran.com/25/70).
- **25:71:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=71); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=71); [Quran.com](https://quran.com/25/71).
- **25:72:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=72); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=72); [Quran.com](https://quran.com/25/72).
- **25:73:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=73); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=73); [Quran.com](https://quran.com/25/73).
- **25:74:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=74); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=74); [Quran.com](https://quran.com/25/74).
- **25:75:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=75); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=75); [Quran.com](https://quran.com/25/75).
- **25:76:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=76); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=76); [Quran.com](https://quran.com/25/76).
- **25:77:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=25&verse=77); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=25&verse=77); [Quran.com](https://quran.com/25/77).

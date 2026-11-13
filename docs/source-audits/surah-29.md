# Surah 29 — Al-'Ankabut: source audit

Researched 2026-11-13. This lesson contains **69 ayahs and 976 word occurrences**. All Urdu word glosses, translations, grammatical explanations, dictionary summaries, verb-paradigm notes and concise tafsir notes are original AI-assisted editorial drafts. They are **not scholar-reviewed** and are not attributed to a named Urdu translator. No third-party Urdu book, dictionary, translation or tafsir was imported.

## Arabic inventory

`inventory-29.json` records the Quran.com Content API v4 `text_uthmani` word strings ([source](https://api.quran.com/api/v4/verses/by_chapter/29?words=true&word_fields=text_uthmani&per_page=50)), retrieved 2026-11-13, excluding end-of-ayah markers. Recitation signs that the API separates from a word by a space — waqf signs, the saktah sign, the sajdah sign and the rub al-hizb marker — are not part of the stored word token, following the Surahs 110–114 precedent. The inventory lists all 66 such exclusions with the original API text; no other character was changed. The unnumbered opening basmalah is not inserted as a numbered occurrence. Automated tests compare every stored word, its id and its segments with this inventory.

Word boundaries and counts match the Quranic Arabic Corpus morphology for every ayah. Per-ayah word counts: 1, 10, 11, 10, 12, 10, 12, 21, 7, 31, 6, 18, 11, 16, 6, 13, 27, 13, 13, 19, 8, 17, 13, 20, 27, 12, 18, 14, 23, 6, 15, 16, 23, 12, 7, 16, 7, 16, 13, 28, 19, 12, 8, 10, 21, 25, 19, 13, 14, 16, 15, 19, 12, 6, 13, 8, 7, 17, 5, 12, 13, 14, 22, 15, 16, 6, 15, 17, 9.

## Sources and method

- **Morphology:** Quranic Arabic Corpus morphology 0.4 (Kais Dukes, GNU GPL with the Corpus terms of use), a verbatim distribution checked by SHA-256 `910b721a8f04f4334ac5d4c62b19e858f5d720c525bb975f2e750ea2c6bb532d`. It was consulted locally for segmentation, part of speech, root, lemma, verb form, voice, mood and case; it is not bundled or redistributed.
- **Word types and roots** are derived deterministically from the Corpus stem tags with the mapping that reproduces root assignments for all 230 word occurrences of the existing lessons, including words with no root. A preposition with an attached pronoun (لَهُ، بِهِ، عَلَيْهِمْ) is a particle, following Surahs 1, 105 and 112. Words without a Corpus root, such as proper names, keep no root.
- **Syntax:** the Corpus word-by-word pages (English morphology and Arabic i‘rab for every word) and verse grammar pages (Arabic i‘rab notes adapted from the Quran Printing Complex), retrieved 2026-11-13. 2 of 69 verse pages carry no grammar note: 1, 30.
- **Verb paradigms** (باب، ماضی، مضارع، وزن) for all 259 verb occurrences come from a shared library of 657 verb lexemes for this expansion edition. Form I vowel classes were decided from imperfects attested across the whole Corpus and standard lexica (Lane, Lisan al-Arab, al-Mu‘jam al-Wasit). The edition’s library review and subsequent corrections are recorded in its handoff and adjudication reports.
- **Tafsir consulted** through the Quran.com API: Tafsir al-Muyassar (Arabic), Tafsir al-Sa‘di (Arabic) and Ibn Kathir (abridged, English). Translations consulted for meaning only: Saheeh International and Mufti Taqi Usmani. The Urdu wording is original and concise; it is not a translation of these works.

Word-type, verb-form and passive-voice counts below apply the adjudicated occurrence overrides; they are not uncorrected Corpus tag counts.

| Measure | Count |
| --- | ---: |
| Nouns | 385 |
| Adjectives | 13 |
| Verbs | 259 |
| Particles | 238 |
| Pronouns | 81 |
| Passive verb occurrences | 16 |
| Distinct roots | 223 |
| Verb form I | 181 |
| Verb form II | 15 |
| Verb form III | 5 |
| Verb form IV | 42 |
| Verb form V | 4 |
| Verb form VIII | 9 |
| Verb form X | 3 |

## Editorial checks

The lesson is organized into 30 chunks of whole ayahs. No review-result snapshot was supplied. This source audit therefore does not certify completion of independent reviews, fixes or final confirmations. The intended workflow requires independent grammar and meaning/tafsir reviews and a clean final confirmation after every correction, including minor findings.
The chunk validator checks the exact Arabic word, segments that rejoin to the exact word, ids and order, rule references, verb-note presence, phrase coverage of every word, and the absence of URLs or Latin text. AI review and automated checks are not scholarly review.

Nouns without a Corpus root (root left empty): إِبْرَٰهِيمَ، إِذْ، إِسْحَـٰقَ، جَهَنَّمَ، شُعَيْبًۭا، فَإِذَا، فَإِذَآ، فَلَمَّا، لَمَعَ، لَمَّا، لُوطًۭا، لُوطٌۭ، مَدْيَنَ، مَعَكُمْ، مَّعَ، مُّوسَىٰ، نُوحًا، وَإِبْرَٰهِيمَ، وَثَمُودَا۟، وَفِرْعَوْنَ، وَقَـٰرُونَ، وَكَأَيِّن، وَلَمَّا، وَلَمَّآ، وَلُوطًا، وَهَـٰمَـٰنَ، وَيَعْقُوبَ.

## Corrections to Corpus tags

These occurrences carry an adjudicated correction or a documented source/analysis disagreement. The lessons follow the recorded contextual analysis; the raw Corpus data itself is unchanged.

- **29:8:15** تُطِعْهُمَآ: QAC tags تُطِعْهُمَآ third person feminine singular. The nearby singular addressee and the instruction to the person whose parents exert pressure require second person masculine singular, jussive after prohibitive lā.
- **29:9:4** ٱلصَّـٰلِحَـٰتِ: QAC tags ٱلصَّـٰلِحَـٰتِ genitive. The word is the direct object of عَمِلُوا and takes accusative kasra as a sound feminine plural.
- **29:18:2** تُكَذِّبُوا۟: QAC tags تُكَذِّبُوا۟ passive subjunctive. The kasra on the dhal makes it the active Form II (the passive would be تُكَذَّبُوا with fatha), with the waw as subject (if you deny); it is the jussive verb of the conditional وَإِن, its nun dropped for jazm, answered by فَقَدْ كَذَّبَ.
- **29:30:2** رَبِّ: QAC tags this word NOM, contradicting the vocalised form and its role. رَبِّ (يا محذوفة): an annexed vocative (منادیٰ مضاف) is accusative; the visible kasra signals the first-person ya, so the nasb is implied.
- **29:33:15** تَحْزَنْ: QAC groups this occurrence under the transitive lemma حَزَنَ يَحْزُنُ. The fatḥa on zāy and the intransitive sense of feeling sorrow establish حَزِنَ يَحْزَنُ (Form I, samiʿa class). Preserve the occurrence mood and person.
- **29:36:6** يَـٰقَوْمِ: QAC tags this word NOM, contradicting the vocalised form and its role. يَـٰقَوْمِ: an annexed vocative (منادیٰ مضاف) is accusative; the visible kasra signals the first-person ya, so the nasb is implied.
- **29:48:3** تَتْلُوا۟: QAC tags تَتْلُوا۟ 3rd person feminine singular, but its subject is the addressee of وَمَا كُنتَ (you did not recite), parallel to وَلَا تَخُطُّهُۥ; the ta prefix is second person masculine singular. Its indicative mood (khabar of كان, damma implied on the waw; the final alif is orthographic) is correct.
- **29:51:7** يُتْلَىٰ: QAC tags يُتْلَىٰ subjunctive, but no particle of nasb precedes it; it is an indicative passive verbal sentence (hal of ٱلْكِتَـٰبَ per the verse i'rab) with an implied damma.
- **29:56:1** يَـٰعِبَادِىَ: QAC tags this word NOM, contradicting the vocalised form and its role. يَـٰعِبَادِىَ: an annexed vocative (منادیٰ مضاف) is accusative; the kasra before the first-person ya means the nasb is implied.
- **29:56:5** أَرْضِى: QAC tags أَرْضِى nominative, but in إِنَّ أَرْضِى وَٰسِعَةٌ it is the noun (ism) of إِنَّ, with وَٰسِعَةٌ as its predicate: accusative, the nasb implied before the first-person ya (the generated i'rab line's مرفوع is wrong here).

## Analysis decisions and cautions

Notes recorded by the authors and reviewers for scholarly review; they mark alternative analyses, source disagreements and editorial choices.

- **29:1:1:** Tagged muqattaat: QAC INL. The rule text lists 32:1 and 36:1 as examples only; this occurrence meets the same INL condition.
- **29:2:2:** QAC tags ٱلنَّاسُ MP noun; taught as a collective noun (اسم جمع). Root ن و س follows the packet; the root note records the alternative derivation from أ ن س.
- **29:2:5:** Followed the QAC ayah note: the second أَن clause is منصوب على نزع الخافض (implied لـ). Some i'rab works allow other analyses (e.g. an implied بـ, or a link to the first masdar); reviewer may confirm.
- **29:2:8:** QAC word i'rab says الواو عاطفة, but the ayah note says جملة «وهم لا يفتنون» حالية. Followed the ayah note (واو الحال, haal rule).
- **29:2:10:** QAC lemma handle is فَتَنُ; lemma written as citation form فَتَنَ per the lexeme entries (fatanu|I|PASS, fatanu|I|ACT). Same for 29:3:2.
- **29:3:1:** Lam of لَقَدْ treated as the lam of an implied oath's answer, per the ayah note (جملة «ولقد فتنا» مع القسم المقدر); QAC word label is لام التوكيد.
- **29:3:6:** QAC gives no mood for يَعْلَمَنَّ; taught as built on fatha because of the directly attached heavy emphatic nun. Meaning taught as manifest knowledge (علم ظهور) per Muyassar (علما ظاهرا للخلق) and Ibn Kathir, avoiding any implication that Allah's knowledge is new. Same for 29:3:10.
- **29:4:1:** QAC word i'rab says حرف عطف; the ayah note says «أم» المنقطعة للإضراب. Followed the ayah note (retraction rule, meaning بل + interrogative hamza).
- **29:4:9:** Followed the QAC ayah note: «ما» موصول فاعل of سَآءَ with المخصوص بالذم elided (حكمهم). Known alternatives treat ما as an indefinite noun in tamyiz position or as masdariyya (ساء حكمهم); not taught.
- **29:4:10:** An elided resumptive pronoun in the sila (يحكمونه / يحكمون به) is mentioned as an assumption; the QAC note does not state it explicitly.
- **29:5:1:** QAC morphology and word iʿrab label مَن relative. The verse iʿrab makes it a conditional mubtada, which governs the following clause and has a fā-linked answer.
- **29:5:6:** QAC labels the fā resumptive. It links the nominal جواب of the condition explicitly identified in the verse iʿrab.
- **29:5:10:** QAC labels the wāw coordinating. The verse iʿrab treats the sentence as resumptive.
- **29:5:12:** QAC tags ٱلْعَلِيمُ as an adjective and the word iʿrab describes a nominative modifier. The verse iʿrab gives a second predicate. The effective adjective type is preserved.
- **29:6:1:** QAC tags مَن relative, but the parallel to 29:5, the condition-result construction, and the supplied translations support the conditional reading. The effective pronoun type is preserved.
- **29:6:3:** QAC labels the fā resumptive. In the conditional reading it links the إنما result clause.
- **29:7:4:** The packet tags GEN, but ٱلصَّـٰلِحَـٰتِ is the direct object of وَعَمِلُوا۟. The sound feminine plural has kasra in accusative position.
- **29:7:7:** The packet tags GEN, but سَيِّـَٔاتِهِمْ is the direct object of لَنُكَفِّرَنَّ. The sound feminine plural has kasra in accusative position; only the attached pronoun is genitive by annexation.
- **29:8:1:** The word iʿrab labels the wāw coordinating. The verse iʿrab calls the clause resumptive, and the learner analysis follows that description.
- **29:8:3:** The shared و ل د note explains offspring but does not cover وَالِد or the dual used for both parents. The occurrence note supplies that sense without changing the root.
- **29:8:14:** QAC tags the fā resumptive and لَا negative. It is the linker of the response to وَإِن, and the prohibition governs the jussive تُطِعْهُمَآ.
- **29:8:15:** The raw 3FS tag is inconsistent with the prohibition addressed to the singular human addressee; the verb is 2MS. The suffix is a third-person dual direct object referring to both parents.
- **29:8:16:** QAC puts the fused form in the preposition segment and gives the first-person suffix an empty surface form. The teaching note explains the assimilation and keeps one exact segment.
- **29:9:1:** The word iʿrab labels the wāw coordinating. The verse iʿrab treats the sentence as resumptive and places the oath and its response as the predicate.
- **29:9:4:** The packet tags GEN, but ٱلصَّـٰلِحَـٰتِ is the object of وَعَمِلُوا۟. Its kasra is the accusative sign of a sound feminine plural.
- **29:9:5:** The opaque key and QAC lemma retain a passive-looking form, but the occurrence is active Form IV as in the supplied paradigm. The shared د خ ل note explains Form I entering but omits the causative Form IV sense used here.
- **29:10:1:** The word-level i‘rab labels the opening waw conjunctive, while the ayah note calls the whole opening clause resumptive. The lesson keeps the word label and describes the clause as a fresh nominal sentence.
- **29:10:7:** The word-level i‘rab labels fa resumptive, while the ayah note describes the conditional clause as coordinated with the opening clause. The segment follows the explicit word-level label and the lesson presents the conditional as a continuation.
- **29:10:16:** The emphatic lam is the prelude to an implied oath. The ensuing oath answer makes the separate conditional answer dispensable.
- **29:10:21:** The occurrence has no explicit mood tag. The ayah i‘rab analyzes the plural imperfect as indicative, with the indicative nun omitted to avoid successive like consonants and the subject waw omitted to avoid successive sukuns. The visible nun is the heavy emphatic nun.
- **29:10:22:** QAC English labels the suffix an object pronoun. In this occurrence it is the accusative ism of inna, as the Arabic i‘rab specifies. The spelling shares the doubled nun across the morpheme boundary, so the displayed suffix slice is the final alif.
- **29:10:23:** QAC English labels the suffix a subject pronoun. The Arabic i‘rab identifies it specifically as the nominative ism of incomplete kana.
- **29:10:25:** The lesson follows the word i‘rab in treating the waw after the interrogative hamza as supplemental. An alternative takes it as a conjunction.
- **29:10:27:** The fatḥa marks surface genitive because the elative is diptote. The word is also in the accusative syntactic position of the khabar of laysa, as the prefixed ba is supplemental.
- **29:11:1:** The word-level line and morphology label the first wāw as coordinating. The ayah iʿrab calls the first clause resumptive, which the lesson follows. Both emphatic imperfects in 29:11 have direct nūn attachment and are built on fatḥ.
- **29:11:1:** The translation follows the tafsir reading of manifesting what Allah knows, also reflected in Sahih International. Taqi Usmani retains the literal wording of knowing.
- **29:11:6:** The QAC lemma is inflected. The lesson uses singular مُنَافِق. The shared ن ف ق root note also says only Form IV occurs in the covered surahs, but this packet contains a Form III active participle.
- **29:12:9:** Raw QAC and generated word iʿrab mark GEN, but the word is the direct object of نَحْمِلْ. The case is accusative with fatḥa estimated on the final alif. The same plural at 29:12:14 is genuinely genitive with estimated kasra.
- **29:12:10:** Word-level QAC labels wāw as coordinating. The lesson follows the ayah iʿrab, which treats the negative clause as parenthetical and gives mā the government of laysa.
- **29:12:12:** The ayah iʿrab specifies the extra bāʾ and min. The participle and its object at 29:12:16 are genitive in surface form and accusative in syntactic position.
- **29:12:17:** The QAC morphology gloss describes the suffix as an object pronoun. Here the word iʿrab correctly identifies it as the ism of inna, in the accusative position.
- **29:13:1:** As the ayah iʿrab indicates by comparison to 29:10, both emphatic plurals here remain indicative. The indicative nūn is dropped before the heavy emphatic nūn, and the plural wāw is deleted to avoid adjacent sākin letters. The wāw is the subject at 29:13:1 and the deputy subject at 29:13:6.
- **29:13:2:** Raw QAC gives the dual ثَقَلَان as the lemma for all three occurrences of أَثْقَال in 29:13. The visible noun is a broken plural on أَفْعَال and its singular is ثَقَل, burden. The effective root remains ث ق ل.
- **29:13:4:** The word iʿrab identifies the accusative adverb without specifying its attachment. The lesson reads the phrase with the indefinite second burdens as a modifier. Attachment directly to the carrying verb gives the same contextual meaning.
- **29:13:7:** QAC word iʿrab gives a generic accusative label. The lesson identifies the function as an adverb of time modifying the passive questioning verb.
- **29:13:9:** The lesson keeps the QAC relative mā and treats the object returning to it as elided in the relative clause.
- **29:14:1:** The word-level i‘rab labels the waw coordinating, while the ayah notes describe the clause as resumptive and the laqad clause as an implied oath’s answer. The lesson distinguishes the discourse opening from the internal oath construction.
- **29:14:7:** The QAC English morphology calls the suffix an object pronoun. The i‘rab treats it as genitive after the preposition, which governs the lesson.
- **29:14:10:** QAC labels the particle restriction. The explicit duration before it and the ayah i‘rab’s mustathna analysis make this a complete affirmative exception.
- **29:14:12:** The word-level line gives only accusative case. The singular indefinite noun specifying the decade numeral is analyzed as its tamyiz.
- **29:14:13:** The word-level tag and line call fa resumptive. The ayah i‘rab coordinates the clause with an implied clause of denial, so the lesson follows that clause-level analysis.
- **29:15:1:** The word-level tag and i‘rab call fa resumptive, but the ayah i‘rab coordinates the rescue clause with the preceding flood clause. The lesson follows the ayah-level coordination.
- **29:15:4:** The translation takes the feminine pronoun to refer to the ship. Al-Sa‘di also gives the story of Nuh as an antecedent, and the grouped Ibn Kathir commentary discusses the specific ship and seafaring in general.
- **29:16:1:** The ayah i‘rab coordinates Ibrahim with Nuh in 29:14, as reflected in both packet translations. Al-Muyassar instead supplies an implied command to mention Ibrahim.
- **29:16:2:** The word-level i‘rab gives a time adverb; the ayah-level i‘rab further specifies badal ishtimal from Ibrahim. The lesson uses that relation.
- **29:16:8:** QAC’s second-person masculine plural feature refers to the addressees in the ending, while the demonstrative itself points to the preceding instruction.
- **29:16:12:** QAC’s English morphology calls the suffix a subject pronoun. Following the word-level i‘rab, it is the ism of incomplete kana. The perfect is in the syntactic position of jazm as the condition verb; the following imperfect stays indicative in the predicate.
- **29:17:3:** The ayah i‘rab attaches the first prepositional phrase to an implied circumstantial qualifier of the indefinite object, not directly to the worship verb.
- **29:17:12:** The ayah note specifies the attachment only for the first occurrence. The second phrase is read with the worship verb in the relative clause. It can also be construed with an implied circumstantial qualifier of the elided resumptive object.
- **29:17:16:** The raw QAC lemma is the feminine perfect form. The verified citation form is the masculine singular perfect, and the occurrence is masculine plural indicative imperfect.
- **29:17:24:** The shared root note says only imperfect forms occur in its scope. This packet has a clear imperative here, consistent with the reviewed lexeme.
- **29:17:26:** QAC English calls the attached hāʾ an object pronoun. It is in the genitive position after the preposition, as the i‘rab indicates.
- **29:18:2:** The packet correction overrides raw QAC morphology and word i‘rab: the kasra on dhāl marks active Form II, conditional in governs the jussive with nūn deletion, and the wāw is the subject.
- **29:18:3:** Raw QAC and the word i‘rab label the fāʾ resumptive. Here it links the explicit reply to the condition, as the packet’s correction for the preceding verb specifies.
- **29:18:** The translation leaves the identity of the speaker and current addressees open. Usmani reads the line in the flow of Abraham’s address. Muyassar explains it as addressing those who deny Muhammad’s message.
- **29:19:1:** The lesson follows QAC SUP and the word i‘rab in taking waw after the interrogative hamza as supplemental. A coordinating waw with the interrogative hamza given precedence is an alternative.
- **29:19:8:** The raw lemma is a first-person imperfect form. The occurrence is third-person masculine singular active, and the reviewed paradigm gives the dictionary form أَعَادَ and the imperfect يُعِيدُ.
- **29:19:10:** QAC tags the demonstrative as a single stem. The lesson separates the demonstrative base, distance lam and addressee kaf for teaching.
- **29:19:13:** The word line صفة مرفوعة describes the adjectival form. Syntactically it is the predicate of إِنَّ, and the verse note attaches the preceding prepositional phrase to it.
- **29:20:5:** The inflected QAC lemma begins with a shadda. The lesson uses the verified dictionary paradigm نَظَرَ يَنْظُرُ and the regular plural imperative.
- **29:20:9:** Raw QAC tags ثُمَّ as a conjunction, but the ayah i‘rab explicitly treats it as resumptive and places the future re-creation outside the scope of the command to observe. The resumption rule wording names waw and fa and could also cover this attested use of thumma.
- **29:20:12:** The packet word i‘rab specifies accusative without naming the role. The lesson reads the noun as a direct object denoting the resulting creation. A cognate accusative of kind is also possible, with the same-root noun substituting for the regular form-IV verbal noun إِنْشَاء.
- **29:20:13:** QAC tags the word N and the word line only specifies its accusative case. The lesson preserves the noun classification and explains its syntactic role as a feminine singular modifier agreeing with the preceding noun.
- **29:21:2:** The two relative clauses are read with an elided resumptive understood through the intended action: punishing that person in the first clause and having mercy on that person in the second.
- **29:21:3:** The reviewed lexeme adopts the sami'a class for شَاءَ based on the hollow pattern. Its evidence notes that the surface forms alone do not exclude a fa'ala analysis with a guttural final radical. This applies to both occurrences.
- **29:21:4:** The QAC lemma has an initial shadda carried over from its source form. The reviewed dictionary citation is رَحِمَ, with no initial shadda.
- **29:21:8:** QAC's lemma handle is a passive imperfect form; the guide's active citation is قَلَبَ, and the occurrence note uses the reviewed passive paradigm قُلِبَ / يُقْلَبُ.
- **29:22:1:** The word i'rab calls the opening waw conjunctive, while the ayah note treats the first negative clause as resumptive. The lesson follows the ayah-level reading.
- **29:22:3:** The extra ba gives the predicate surface genitive with ya; QAC's ayah note makes its syntactic position accusative as the predicate of ma working like laysa.
- **29:22:17:** The QAC word i'rab records genitive. The visible kasra supports coordination with the surface case of the preceding delayed subject.
- **29:23:** The translation preserves the perfect wording of يَئِسُوا۟. Muyassar explains despair when the deniers see their punishment; Sa'di emphasizes why they pursue no means of obtaining mercy in this life. The tafsir summary includes both.
- **29:23:** The packet's Ibn Kathir fields point to grouped commentary beginning at 29:19 and supply no excerpt for these three ayahs. The Urdu tafsir draws on the supplied Muyassar and Sa'di texts.
- **29:23:5:** QAC classifies لِقَاء as a Form III verbal noun here. The root library also records its use as a verbal noun of Form I لَقِيَ.
- **29:23:6:** For both occurrences, the dictionary citation uses the plural demonstrative أُولَٰئِكَ following the QAC demonstrative lemma, with final vocalization supplied; the packet fork points to singular ذا.
- **29:24:18:** QAC 0.4 tags the stem GEN and the word-level i'rab says اسم مجرور, but the word is the delayed ism of إِنَّ (the ayah grammar note itself calls its lām لام التوكيد and لقوم a نعت لآيات), so it is accusative with kasra as a sound feminine plural. Taught as منصوب بالكسرة; accusative rule used, genitive not.
- **29:24:11:** Word-level i'rab and QAC (REM) call the fāʾ استئنافية; the ayah grammar note calls the sentence فأنجاه الله معطوفة على جملة قالوا. Taught as resumptive with the coordination view mentioned; Muyassar supplies the implied intervening clause فألقوه فيها.
- **29:24:1:** Word-level i'rab calls the fāʾ عاطفة (QAC CONJ) while the ayah grammar note calls the sentence فما كان جواب قومه مستأنفة. Both are mentioned in syntaxUrdu; conjunction rule follows QAC CONJ.
- **29:24:10:** QAC lemma string حَرِّقُ is the imperative stem; lemma given as the Form II citation perfect حَرَّقَ, matching the reviewed paradigm entry (حَرَّقَ / يُحَرِّقُ).
- **29:24:9:** QAC gives أَوْ only as a coordinating conjunction; whether it is for choice (تخيير) or division (تنويع, some proposed killing, others burning, cf. Muyassar قال بعضهم لبعض) is not decided in the lesson.
- **29:25:3:** The QAC ayah note attaches the prepositional phrase to an implicit second object and takes mawaddata as a purpose accusative. The translation follows that reading. Sahih International also conveys the sense of the idols as a bond of affection. The lexeme records a minority derivation of ittakhadha from t-kh-dh instead of the adopted hamza assimilation from hamza-kh-dh.
- **29:25:22:** The raw QAC stem tag and word i‘rab mark the abode noun genitive. The ayah-level analysis makes it the mubtada before al-naru, so its nominative damma is implied on the final alif. The attached pronoun is genitive by idafa.
- **29:25:27:** The QAC word-level genitive is the surface case after extra min. The ayah note identifies the noun as the delayed mubtada and the preceding prepositional phrase as attached to the predicate.
- **29:26:4:** The word i‘rab labels the waw coordinating, while the ayah grammar treats the speech clause as resumptive. The lesson follows the ayah analysis. Muyassar, Sa‘di and both translations take Ibrahim as the speaker. Ibn Kathir also records Lut as a possible antecedent.
- **29:26:5:** QAC English calls the attached ya an object pronoun. The word i‘rab identifies it as the accusative ism of inna.
- **29:26:9:** QAC English calls the attached ha an object pronoun. The word i‘rab identifies it as the accusative ism of inna.
- **29:26:10:** The QAC ayah note takes huwa as emphasis of the ha of inna. An alternative is a separating pronoun without syntactic position.
- **29:26:12:** The word i‘rab calls al-hakimu a nominative adjective, and the app retains the adjective word type. The ayah note takes it syntactically as a second predicate, which the lesson follows.
- **29:27:3:** QAC morphology and the word-level i‘rab give genitive for this diptote. The preceding lām already governs the attached pronoun in 29:27:2. Isaac is the direct object of wahaba, and the visible fatḥa marks accusative here.
- **29:27:4:** QAC morphology and the word-level i‘rab also give genitive for Jacob. He is coordinated with the accusative direct object Isaac, so the visible fatḥa marks accusative.
- **29:27:5:** The ayah i‘rab attaches the prepositional phrase to an understood second object. On a one-object reading of jaʿala as “place”, that phrase can attach directly to the verb. The lesson follows the ayah i‘rab.
- **29:27:7:** The packet indexes dhurriyya under dh-r-r. The root entry also records derivations under dh-r-ʾ and dh-r-w, so the lesson avoids asserting a single derivation.
- **29:27:16:** QAC gives the masculine lemma ākhir and correctly tags the occurrence as feminine singular. The learner lemma is the lexicalized feminine noun ākhira “the Hereafter”.
- **29:28:1:** The ayah i‘rab coordinates Lot with Abraham in 29:16. The Urdu rendering supplies “mention” in line with Muyassar and Sahih International. Taqi Usmani supplies “We sent” in his rendering.
- **29:28:9:** The verified paradigm uses yasbiqu, the attested Quranic imperfect. The lexeme entry records yasbuqu as a lexical variant.
- **29:28:12:** The ayah i‘rab specifies the overt subject and the extra min. The word-level genitive analysis describes the visible ending; the subject has nominative syntactic position.
- **29:29:1:** QAC English calls the attached pronoun an object pronoun. The word i‘rab identifies it as the accusative ism of inna. The ayah note treats the question as a clausal badal of the emphatic statement in 29:28.
- **29:29:4:** The raw QAC lemma is قُطِعَ. The vocalized imperfect and QAC occurrence features are active, agreeing with the reviewed قَطَعَ / يَقْطَعُ paradigm.
- **29:29:5:** The shared root note describes the fish taking its path in Al-Kahf. Here the noun is the road that the people obstruct.
- **29:29:8:** QAC tags the noun as an active participle on the فَاعِل pattern. It is used lexically here for the gathering or meeting place. The shared root note covers calling and does not give this noun sense.
- **29:29:10:** The word-level QAC analysis labels the fa as coordinating. The ayah i‘rab calls the entire clause resumptive, which the lesson follows.
- **29:29:15:** The ayah i‘rab takes the interpreted masdar as the delayed ism of kana. The visible fatha makes the preceding answer phrase its fronted predicate in this reading.
- **29:29:21:** QAC English uses the general label subject pronoun. The word i‘rab specifies that the ta is the ism of incomplete kana. The perfect verb is in a jussive syntactic position under the condition particle.
- **29:30:2:** The packet correction supersedes raw QAC NOM and the generated nominative i‘rab. This is an annexed vocative with elided vocative particle and first-person ya. Its accusative fatha is implied and the visible kasra accommodates the elided ya.
- **29:29:** The packet provides Sa‘di for this ayah. Muyassar is absent here, and Ibn Kathir for both ayahs is a pointer to the grouped commentary at 29:28 rather than commentary text.
- **29:31:1:** Word i'rab calls the wa عاطفة while the ayah note calls the لما sentence مستأنفة; followed the word i'rab (conjunction). QAC gives لما only as ظرف زمان; its attachment to the answer قالوا is the standard i'rab, stated as such. Alternative view (Sibawayh): لما here is a particle (حرف وجود لوجود), not a noun.
- **29:31:7:** The speakers of إنا here (and of نحن / لننجينه in 29:32) are the angels; rendered «ہم» without the divine majestic-plural sense.
- **29:31:8:** QAC gives مهلكوا as one stem; the lesson splits stem + plural ending (و + silent alif) for learners. Participle in idafa to أهل (nun dropped); أهل is its semantic object.
- **29:31:11:** QAC i'rab says only اسم مجرور; analysed as badal of هذه (some i'rab works: عطف بيان or نعت).
- **29:32:3:** QAC i'rab says only جار ومجرور; analysed per standard i'rab as fronted khabar of إن (متعلق بمحذوف) with delayed ism لوطا.
- **29:32:4:** No QAC root for the proper name; treated as munsarif (tanwin visible), with the standard explanation for short three-letter names with a quiescent middle.
- **29:32:10:** QAC gives no mood; described as built on fatha because the heavy emphatic nun is directly attached. Oath elided, per the QAC ayah note (جواب القسم).
- **29:32:12:** QAC labels إلا RES / أداة حصر, but the clause is affirmative and the excluded-from group (him and his family) is stated, so it is taught as استثناء متصل with the excepted noun accusative (rule exception).
- **29:32:14:** Follows the QAC note: the كانت clause is حال of امرأته. Some i'rab works read it as a new explanatory sentence. The perfect is translated «ہے», following the English translations' 'is to be / will be'.
- **29:32:16:** QAC lemma is the plural غابرين; the lesson lemma uses the singular base غابر, as the guide requires.
- **29:33:2:** The word-level QAC SUB tag and generic i‘rab call this masdariyya. The ayah-level i‘rab explicitly calls it extra after lamma, which the lesson follows.
- **29:33:6:** The word-level i‘rab specifies the passive but leaves its deputy subject unstated. The lesson takes it as a concealed pronoun referring to Lut, with the following bi-phrase attached to the verb.
- **29:33:12:** QAC NEG and the generic word i‘rab label this la as negative. The direct address and following jussive identify prohibitive la, parallel to the second la.
- **29:33:15:** The packet lexeme key resolves to transitive ḥazana yaḥzunu, bab naṣara. The visible fatḥa on zay and the context require intransitive ḥazina yaḥzanu, bab samiʿa, which the lexeme note itself distinguishes. The occurrence mapping needs correction in shared data.
- **29:33:18:** The lesson follows the ayah i‘rab in supplying a deleted rescue verb for the accusative family noun. Coordination with the object sense of the attached kaf is an alternative analysis.
- **29:33:19:** The generic word i‘rab calls this restriction. The stated group and the accusative excepted noun establish a complete affirmative exception.
- **29:34:6:** Word-level i‘rab gives only genitive. The lesson treats the noun specifying the demonstrative as badal or explanatory apposition.
- **29:34:10:** The QAC REL tag yields the packet’s effective pronoun type. The ayah i‘rab explicitly takes ma as masdariyya, so the lesson teaches the causal bi plus an interpreted verbal noun. The effective type remains pronoun in shared data.
- **29:35:3:** Both word glosses say “about it”. The preposition and the tafsir support “from it”, referring to the settlement in the preceding ayah.
- **29:36:1:** The ayah i‘rab takes the initial wāw as resumptive, while QAC morphology and the word i‘rab call it coordinating. The lesson follows the ayah i‘rab.
- **29:36:3:** Raw QAC morphology and the word i‘rab say nominative. The ayah i‘rab makes this the object of implied أَرْسَلْنَا, and the alif of the annexed five-noun form marks accusative.
- **29:36:6:** Follows the packet correction. The annexed vocative has an implied accusative fatḥa and an elided first-person possessive yāʾ. The visible kasra suits that yāʾ. Raw morphology and word i‘rab say nominative.
- **29:36:9:** The tafsir sources explain the command as expecting the Day and its recompense. Ibn Kathir also transmits the interpretation “fear the Last Day”.
- **29:36:11:** The effective app type is noun, as in QAC. In the phrase it functions as the attributive adjective of the preceding noun.
- **29:36:13:** The attested fatḥa before plural wāw supports the reviewed عَثِيَ يَعْثَى paradigm. Some lexica also list the synonym عَثَا يَعْثُو or index the verb under ع ث ي. The packet root is retained.
- **29:37:1:** The ayah i‘rab coordinates this clause with the preceding speech verb. The QAC morphology and word i‘rab instead call its fāʾ resumptive. The lesson follows the ayah i‘rab.
- **29:38:1:** Followed the ayah i'rab note: عادًا is the object of an implied أهلكنا, the implied clause being coordinated with أرسلنا of 29:36 (Muyassar also supplies أهلكنا). Other analyses found in i'rab works (object of an implied اذكر, or coordination with the object pronoun of فَأَخَذَتْهُمُ in 29:37) were not adopted. QAC assigns this tribal name root ع و د; the lesson treats that as a lexical index only, not an etymology.
- **29:38:2:** وَثَمُودَا۟ has fatha without tanwin and a silent written alif (small round zero); taught as a diptote (tribal name) in naṣb. QAC irab says only اسم علم منصوب; the diptote label is from the vocalised text.
- **29:38:3:** QAC word-level i'rab calls the wāw of وَقَد عاطفة, but the ayah grammar note calls it اعتراضية and the clause وقد تبين لكم من مساكنهم a parenthetical between the coordinated clauses; the lesson follows the ayah note.
- **29:38:4:** The ayah note says the fāʿil of تَبَيَّنَ is مضمر (ما حلّ بهم); the lesson presents it as a hidden pronoun referring to what befell them. The shadda on the initial tāʾ comes from idghām of the dāl of قد (recitation), not a morphological change, so the assimilation rule was not applied.
- **29:38:15:** QAC word-level i'rab calls the wāw of وَكَانُوا۟ عاطفة; the ayah grammar note makes the clause حالية from the pronoun هم in فصدّهم. The lesson follows the ayah note (wāw al-ḥāl) and translates 'though they were'.
- **29:38:16:** Two readings of مُسْتَبْصِرِينَ in the provided tafsir: Muyassar — clear-sighted/self-satisfied in their disbelief, thinking themselves guided; Sa'di (and Taqi Usmani's 'people of insight') — the messengers' clear signs gave them the means of insight, yet they rejected. The translation keeps the literal 'possessing insight' and the tafsir gives both views.
- **29:39:1:** QAC tags وَقَـٰرُونَ GEN and its word i'rab says مجرور بالفتحة (diptote), but the ayah grammar note says it is معطوف على ثمود, which is accusative (object of implied أهلكنا), and Muyassar reads وأهلكنا قارون. The lesson teaches it as منصوب with fatha (diptote); the visible ending is identical either way. Reviewer should confirm.
- **29:39:4:** QAC word-level i'rab calls the wāw of وَلَقَدْ عاطفة, but the ayah note calls the clause ولقد جاءهم مستأنفة; the lesson follows the ayah note (resumption). QAC calls the lām لام التوكيد; the lesson adds that many grammarians take it as the lām answering an implied oath (oath rule).
- **29:39:8:** QAC labels the fāʾ of فَٱسْتَكْبَرُوا۟ REM (استئنافية); semantically it expresses consequence/sequence after Mūsā's coming and some i'rab works call it عاطفة. Followed QAC.
- **29:38:14:** Shared-data issue: the root entry س ب ل noteUrdu says 'یہاں دونوں جگہ مچھلی کا سمندر میں اپنی راہ بنا لینا مراد ہے', which is Surah 18 context (18:61, 18:63) and wrong for 29:38. The word's dictionaryUrdu here was written for this ayah; the root library note should be made context-neutral.
- **29:39:13:** The object of سَـٰبِقِينَ (whom they could not outstrip) is not expressed; Sa'di supplies اللّه and Muyassar ليفوتوننا. The lesson states it as understood from meaning without tagging it as an i'rab elision.
- **29:40:1:** QAC tags the fa of فَكُلًّا REM and the word i‘rab says الفاء استئنافية, but the ayah grammar note says الفاء عاطفة with the أخذنا clause coordinated to استكبروا in 29:39. The lesson follows the ayah note (conjunction rule). كُلًّا is taught as مفعول مقدم with tanwīn of compensation (elision rule).
- **29:40:4:** QAC tags the fa of فَمِنْهُم REM (word i‘rab استئنافية), whereas the ayah note says the clause «فمنهم من أرسلنا» is معطوفة on «أخذنا». The lesson follows the ayah note; it can also be read as a detailing fa.
- **29:40:5:** The four مِنْهُم + مَنْ pairs are analysed as خبر مقدم (prepositional phrase attached to an elided khabar) + مَنْ موصول مبتدأ مؤخر, following the ayah note («مَنْ» موصول مبتدأ). The khabar attachment is inferred, not stated explicitly in the packet.
- **29:40:20:** The returning object pronoun of the ṣila أَغْرَقْنَا is elided (understood أغرقناه); this is inferred from the structure, not stated in the packet i‘rab. Lemma written as the citation perfect أَغْرَقَ, matching the lexeme entry; QAC LEM names it by the 1S imperfect أُغْرِقُ.
- **29:40:22:** Per the ayah note, the khabar of كَانَ is elided (تقدير: مريدًا للظلم) and the interpreted masdar after the lām is genitive, attached to that elided khabar. Rendered in Urdu without quoting the Arabic taqdīr.
- **29:40:24:** QAC tags the lām as PRP (purpose) and the word i‘rab says لام التعليل, but the ayah note says اللام للجحود after ما كان. The lesson teaches لام الجحود with implied أَنْ. The purpose-lam rule was not applied because its card teaches purpose; the library has no lām al-juḥūd rule — consider adding one.
- **29:40:8:** QAC segment form حَاصِبًا lacks the small low mīm (U+06ED) present in the Uthmani word; the lesson segment uses the exact Uthmani string.
- **29:40:16:** QAC tags هِ in بِهِ as a PRON stem with prefixed bi; the effective packet pos is particle, as for other preposition + pronoun words.
- **29:40:** Tafsir sources differ on identifications: Muyassar says the ḥāṣib was sent on the people of Lūṭ, Saʿdī says ʿĀd; Muyassar names the people of Ṣāliḥ and Shuʿayb for the ṣayḥa, Saʿdī only Ṣāliḥ; for drowning Muyassar names the people of Nūḥ and Pharaoh with his people, Saʿdī Pharaoh, Hāmān and their armies. The Urdu tafsir records the ḥāṣib disagreement and states only the shared points. The Ibn Kathir field only points to grouped commentary at 29:38, so no Ibn Kathir content was used.
- **29:41:3:** The verified paradigm follows QAC’s hamzated root and exceptional assimilation in Form VIII. The lexeme also records a derivation from ت خ ذ, which applies as an alternative to both occurrences in this ayah.
- **29:41:9:** QAC tags the noun masculine at both 29:41:9 and 29:41:16. The overt feminine singular verb at 29:41:10 establishes feminine agreement in this context, as the root note explains.
- **29:41:12:** Word iʿrab and QAC segment tagging give a coordinating waw. The ayah grammar treats the clause as resumptive, which the lesson follows.
- **29:42:4:** The packet’s derived POS and word iʿrab give a relative pronoun, matching the supplied English translations. The ayah grammar gives negative mā and an object clause with suspended government, which the lesson follows, including the reinforcing min at 29:42:8 and the underlying accusative at 29:42:9. The relative reading takes the relative expression as the object of the verb of knowing.
- **29:43:2:** The ayah note makes نضربها the khabar of تلك, so ٱلْأَمْثَـٰلُ is taught as badal (or ʿaṭf bayān) of تلك; QAC word i‘rab says only اسم مرفوع. Alternative: ٱلْأَمْثَـٰلُ khabar and نضربها ḥāl.
- **29:43:1:** Lemma given as ذَٰلِكَ following QAC LEM for the feminine demonstrative تِلْكَ; the dictionary field explains that تلك is its feminine.
- **29:44:5:** Per the ayah note, بِٱلْحَقِّ attaches to an implied ḥāl of the Divine name. Muyassar glosses it بالعدل والقسط, Sa‘di as "not in vain / for a purpose"; the lesson combines both.
- **29:45:1:** Lemma written تَلَا as in the reviewed lexeme entry; QAC LEM spelling is تَلَىٰ.
- **29:45:5:** مِنَ taken as explicative (bayān) of مَآ; a partitive (tabʿīḍ) reading is also possible. Attachment to a ḥāl of the pronoun in أُوحِىَ follows the ayah note.
- **29:45:15:** QAC morphology labels the وَ CONJ and the word i‘rab says الواو عاطفة, but the ayah grammar note calls it مستأنفة with lām al-ibtidā’; the lesson follows the ayah note (resumption).
- **29:45:17:** QAC word i‘rab "صفة مرفوعة" names the word type; syntactically أَكْبَرُ is the khabar of ذِكْرُ. The compared item is omitted: Sa‘di prefers "the dhikr within prayer is greater than its restraining effect" (also Ibn Kathir: the higher objective) and reports the majority view "dhikr of Allah is greater than prayer"; Muyassar: greater than everything. The tafsir summary gives two views with بعض مفسرین.
- **29:45:18:** QAC labels the وَ CONJ (word i‘rab عاطفة), but the ayah note says جملة «والله يعلم» مستأنفة لا محل لها; tagged resumption.
- **29:45:20:** مَا taken as relative (QAC REL) with an elided resumptive pronoun (تصنعونه); a masdar reading (ما مصدرية = صنعكم) is a known alternative.
- **29:46:9:** The generic word i‘rab calls both occurrences of illā a restriction marker. The ayah note explicitly supports restriction for the first, before the manner phrase. The second excludes wrongdoers from the stated People of the Book and is tagged exception.
- **29:46:14:** The QAC surface split places the whole shadda on the suffix segment. That doubled nūn represents both the stem-final nūn and the initial nūn of the subject suffix.
- **29:46:22:** QAC classifies the word as an adjective, and the isolated i‘rab line says ṣifa marfūʿa. In the nominal clause cited by the ayah note it is the shared khabar of the two coordinated subjects. Its adjective morphology is retained.
- **29:47:1:** Word i‘rab calls the waw coordinating and identifies a prepositional phrase. The ayah note treats the waw as resumptive and the comparative kaf construction as substituting for the cognate accusative. The lesson follows the ayah note for clause function.
- **29:47:5:** QAC morphology and word i‘rab call the fa resumptive. The ayah i‘rab coordinates the whole fa-clause with the preceding revelation clause, which the lesson follows.
- **29:47:15:** Word i‘rab calls the waw coordinating. The ayah i‘rab treats the denial clause as parenthetical between coordinated clauses, which the lesson follows.
- **29:48:3:** The packet correction overrides QAC’s 3FS tag. This is active 2MS indicative with an implicit damma on radical waw and an orthographic final alif. The clause is the khabar of kana in an accusative position.
- **29:48:7:** Word i‘rab records overt genitive. The ayah note identifies kitabin as the direct object of the reading verb and the second min as extra, so the noun has genitive wording and accusative position.
- **29:48:10:** QAC tags yamin masculine. The hand sense is commonly treated as feminine, and this phrase contains no agreement marker to resolve the discrepancy. The lesson leaves lexical gender unstated.
- **29:48:11:** QAC tags this SUR and the word i‘rab calls it a surprise particle. The tanwin spelling and counterfactual context identify the response and consequence particle idhan, as specified by the answer-particle rule.
- **29:48:12:** Word i‘rab calls the lam emphatic. The ayah i‘rab specifies its role as the lam in the answer to an implied law condition. The written shadda reflects assimilation of the preceding tanwin in connected recitation.
- **29:50:1:** The QAC segments and word i‘rab label the initial waw coordinating. The ayah i‘rab treats the clause as resumptive, which the lesson follows.
- **29:50:4:** QAC English uses “object pronoun” as a broad label for the suffix. Here the word i‘rab identifies a prepositional phrase, so the pronoun is in genitive position.
- **29:50:16:** The app retains the QAC noun type for the Form IV active participle. Its syntactic function is adjectival. The tafsirs support both the plain warning and the clarification of truth conveyed by the participle.
- **29:51:1:** The word i‘rab and QAC SUP treat the wāw after the interrogative hamza as supplemental. A coordinating wāw is another analysis.
- **29:51:3:** The corpus gloss labels nā as an object pronoun. In this construction it is the ism of anna. The contracted written form prevents a cut that displays the full pronoun independently.
- **29:51:7:** Applied the packet correction. The raw QAC tag and word i‘rab say subjunctive. The passive imperfect has no nāṣib and is indicative with implied ḍamma. Its clause, as ḥāl of the Book, occupies an accusative position.
- **29:51:13:** Raw QAC and the generated word i‘rab label dhikrā nominative. The lesson takes it as coordinated with the accusative ism of inna, with implied fatḥa on the feminine alif. The surface ending does not distinguish the cases.
- **29:52:6:** The shared root entry allows tamyīz or ḥāl in the general kafā bi-construction. The verse i‘rab explicitly selects tamyīz here.
- **29:52:12:** Raw QAC and word i‘rab call the wāw coordinating. The verse i‘rab treats the sentence as resumptive, which the lesson follows. Coordination of independent sentences is the other reading of the connective.
- **29:52:18:** The verse i‘rab specifies ḍamīr faṣl. A second mubtada with the following noun as its khabar is an alternative parse.
- **29:53:1:** The word-level line calls the initial waw conjunctive. The ayah note treats the opening clause as resumptive, which the lesson follows.
- **29:53:5:** QAC morphology and the word-level i‘rab give genitive. The participle modifies nominative أَجَلٌۭ and is nominative with an implied ḍamma on its final alif.
- **29:53:6:** QAC labels the lām emphatic. Here it specifically introduces the affirmative answer to لَوْلَآ.
- **29:53:8:** The word-level line calls the waw conjunctive. The ayah note analyzes the implied oath and its answer as a fresh sentence. Direct attachment of the heavy emphatic nūn makes the imperfect built on fatḥa.
- **29:53:12:** The lesson follows the reviewed standard paradigm شَعَرَ / يَشْعُرُ. The lexeme evidence also records شَعُرَ with the same imperfect.
- **29:53:** Muyassar discusses worldly punishment and Sa‘di illustrates the warning with Badr. Ibn Kathir identifies the appointed term with the Day of Resurrection.
- **29:54:3:** The word-level line calls the waw conjunctive. The ayah note treats the إِنَّ clause as an independent resumption, which the lesson follows.
- **29:54:4:** QAC morphology and the word-level i‘rab give genitive. جَهَنَّمَ is the ism of إِنَّ and is accusative with an overt fatḥa. It is also diptotic.
- **29:55:2:** The lesson follows the packet’s root غ ش و. The lexeme evidence notes that some dictionaries file the verb under غ ش ي.
- **29:55:9:** The selected reading وَيَقُولُ is active, with Allah understood as the speaker per Muyassar and Taqi Usmani. Sahih International renders the speech introduction impersonally.
- **29:56:1:** qacCorrection followed: QAC tags عِبَادِ NOM and the generated i'rab says مرفوع; as an annexed vocative (منادى مضاف) it is accusative with the nasb implied before the first-person ya.
- **29:56:5:** qacCorrection followed: QAC tags أَرْضِ NOM and the i'rab line says مرفوع; it is the ism of إِنَّ (accusative, nasb implied before the first-person ya), with وَٰسِعَةٌ as khabar.
- **29:56:7:** QAC tags the first fa REM and its word i'rab says استئنافية; the ayah grammar note says الفاء الأولى عاطفة, the clause being coordinated on إن أرضي واسعة. Followed the ayah note (conjunction). A well-known alternative (e.g. al-Kashshaf) treats it as answering an elided condition (if you cannot worship Me sincerely in one land, do so in another). Tagged ishtighal because the note gives مفعول به لفعل محذوف يفسره ما بعده, although the rule text speaks of a fronted noun and this is the pronoun إيّا.
- **29:56:8:** QAC tags the second fa REM (word i'rab استئنافية); the ayah grammar note says الفاء الثانية زائدة and the clause اعبدون is تفسيرية. Followed the ayah note (extra-particle). QAC segments نِ as the 1S pronoun; it is the nun al-wiqaya with the object ya elided in the Uthmani spelling, as the word i'rab itself states (الياء المحذوفة).
- **29:58:4:** QAC tags ٱلصَّٰلِحَٰتِ GEN and the generated i'rab says اسم مجرور, but it is the direct object of عَمِلُوا, accusative with kasra as the sign of nasb (sound feminine plural). Written as accusative. Some grammarians analyse it as an adjective standing for an elided object (الأعمال الصالحات).
- **29:58:5:** The oath is implied (ayah note: جواب القسم); the lam is the lam of the oath's answer. QAC gives no mood; the imperfect is built on fatha because the heavy emphatic nun is attached directly.
- **29:58:6:** Ayah note: من الجنة متعلق بحال من غرفا (a description fronted before an indefinite becomes hal). The fatha on the nun is for the meeting of two sakins; the shadda on the mim reflects assimilation of the preceding هُم.
- **29:58:11:** QAC tags تَحْت as N and the i'rab says اسم مجرور; it is a place-adverb noun here governed by مِن, so the adverb rule was not applied.
- **29:58:15:** The praised noun (المخصوص بالمدح) is elided: the ayah note supplies الجنة, while Muyassar's wording points to هذه الغرف; both are mentioned. The نعم clause is مستأنفة per the ayah note.
- **29:58:9:** Lemma written as the citation form جَرَى per the lexeme entry; QAC's lemma id جَرَيْ is not a citation form.
- **29:60:1:** The ayah iʿrab treats the wāw as resumptive and the built quantity noun as a mubtada in a nominative position. The word line calls the wāw conjunctive and describes the noun generically as nominative.
- **29:60:2:** The ayah iʿrab attaches the prepositional phrase to an implied adjective of the quantity noun. A common alternative describes the phrase as its genitive specification (tamyīz).
- **29:60:10:** The word line tags the wāw as conjunctive. The ayah iʿrab treats the nominal clause as independent, so the lesson treats the wāw as resumptive.
- **29:61:1:** The ayah iʿrab calls the opening clause independent. The lesson treats the initial wāw as resumptive although the word line labels it conjunctive, and reads the lām as preparatory to the implied oath.
- **29:61:3:** QAC morphology and the word iʿrab label man as relative. The ayah iʿrab explicitly treats the clause as interrogative and suspending the government of the asking verb, so man is taught as an interrogative mubtada.
- **29:61:5:** QAC morphology and the word iʿrab label the heavens genitive. It is the direct object of khalaqa, accusative with kasra because it is a sound feminine plural. The following coordinated singular shows accusative fatḥa.
- **29:61:10:** The ayah iʿrab treats the verb as indicative, with the indicative nūn omitted to avoid a succession of like consonants and the subject wāw omitted to avoid two adjacent sukūns. The remaining stem wāw belongs to the root. This is the oath answer and supplies the sense of the elided conditional answer.
- **29:61:11:** The ayah iʿrab supplies an omitted verb of creation with the divine name as its subject. The resulting clause is the reported reply.
- **29:61:12:** The root index groups the interrogative annā under ʾ-n-y as a lexical reference. Its contextual meaning is not derived from the root verb.
- **29:61:13:** The lesson lemma gives the active citation form as required by the guide. The packet lexeme gives the passive pair and identifies the active pair in its note.
- **29:62:9:** The surface pronoun refers back to the relative expression. The translation follows Taqi Usmani, Muyassar and Sa‘di in construing constriction as a second distribution by Allah’s will. Sahih International renders the surface pronoun directly.
- **29:62:14:** The generated line labels the word a raised adjective by lexical type. Syntactically it is the khabar of inna, with the preceding prepositional phrase attached to it.
- **29:63:3:** QAC morphology and generated word i‘rab label man relative. The ayah-level i‘rab explicitly treats the clause as interrogative and as the object of the suspended question verb. The lesson follows the ayah-level analysis and treats man as mubtada.
- **29:63:14:** QAC identifies the active imperfect as third-person masculine plural. The lesson treats it as indicative with the mood nun deleted to avoid consecutive nuns, and with the subject waw deleted before the heavy emphatic nun. The written waw belongs to the root. The oath answer supplies the sense of the omitted conditional answer.
- **29:63:15:** The ayah-level i‘rab takes Allah as the subject of an omitted verb. Its supplied reconstruction uses a feminine plural object pronoun with no clear antecedent in this ayah. The lesson follows the subject analysis and reconstructs the sense from the actual question.
- **29:63:22:** The raw QAC lemma bears a final damma. The verified paradigm gives the active citation form with final fatha. The lesson also distinguishes the plural subject waw from the retained indicative nun, which QAC bundles in one suffix.
- **29:64:3:** The word i‘rab gives only “nominative noun”. The lesson treats it as badal of the demonstrative. The alternative ʿaṭf bayān leaves its case and meaning intact.
- **29:64:10:** QAC tags the word N, and the word i‘rab says only “accusative noun”. The lesson retains the noun label and teaches its contextual function as the adjective of dār.
- **29:64:11:** The ayah note makes the whole nominal clause the khabar of inna, so the pronoun is taught as its mubtada. A separating-pronoun analysis is also possible, with the following noun alone as khabar of inna.
- **29:65:1:** The word i‘rab calls the prefixed fāʾ coordinating. The ayah note calls the full conditional sentence resumptive. The lesson follows the word-level label for the particle.
- **29:65:4:** Fulk can denote a ship or ships with the same form. The lesson uses the generic singular in Urdu, consistent with the two verse translations.
- **29:65:10:** The word i‘rab and QAC morphology label the fāʾ resumptive. The ayah note describes the second conditional as coordinated with the daʿaw clause. The word lesson follows the former for the particle. The lamma rule specifies a perfect answer, whereas the answer here is a nominal clause introduced by sudden-event idha.
- **29:66:1:** Word i‘rab calls the lām lām al-taʿlīl and QAC labels it PRP. The ayah i‘rab specifies lām al-ʿāqiba attached to the preceding verse’s final verb. The lesson teaches the result reading with the same subjunctive government.
- **29:66:4:** The packet has kasra on the lām and QAC analyzes the verb as subjunctive. Taqi Usmani gives a command-like translation, which can suggest the alternative imperative interpretation. The lesson follows the packet’s result reading.
- **29:67:1:** Word i‘rab treats the wāw after the interrogative hamza as supplemental, as taught here. A coordinating analysis is also used.
- **29:67:3:** QAC’s English gloss calls the suffix an object pronoun, while the word i‘rab correctly treats it as the ism of anna. The orthographic segmentation puts the shared nūn shadda in the first slice and leaves the written alif in the second.
- **29:67:5:** The supplied word i‘rab marks haraman accusative without specifying the object count. The lesson reads jaʿala as establishing a sanctuary, with haraman as its object and āminan as its adjective. Another analysis takes Makkah as an understood first object and haraman as the second.
- **29:67:11:** Word i‘rab treats the fāʾ after the interrogative hamza as supplemental. The verse-level note coordinates the resulting question with the opening question. Treating the fāʾ itself as the conjunction is an alternative.
- **29:68:1:** Both QAC morphology and word i‘rab label the first man relative. The rhetorical nominal question requires interrogative man as mubtada, with the elative as khabar. The initial wāw links the discourse, and the ayah note treats the question as an independent sentence.
- **29:68:7:** The word i‘rab specifies accusative without a role. The lesson reads kadhiban as the fabricated content, a direct object. A cognate-accusative analysis by semantic equivalence with fabrication is also possible.
- **29:68:11:** The supplied word i‘rab treats lammā as a temporal adverb and the ayah note supplies an elided answer. A particle analysis is also used for this construction.
- **29:68:16:** QAC morphology and the generated word i‘rab label mathwan genitive. It is the delayed nominative ism of laysa, with implied ḍamma on alif maqṣūra. The fronted prepositional phrase is the predicate.
- **29:69:1:** The word i‘rab calls the initial wāw coordinating, while the ayah note treats the full nominal sentence as a new independent clause. The lesson retains the connective gloss.
- **29:69:3:** QAC’s English label “object pronoun” describes the suffix on fī. It is in the genitive position governed by the preposition, as shown by the word i‘rab.
- **29:69:4:** QAC leaves the imperfect mood unspecified and marks the emphatic suffix. Direct attachment of the heavy emphatic nūn makes the verb built on fatḥa. The lām opens the answer to an implied oath, as the ayah i‘rab states.

## Per-ayah sources

- **29:1:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=1); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=1); [Quran.com](https://quran.com/29/1).
- **29:2:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=2); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=2); [Quran.com](https://quran.com/29/2).
- **29:3:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=3); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=3); [Quran.com](https://quran.com/29/3).
- **29:4:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=4); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=4); [Quran.com](https://quran.com/29/4).
- **29:5:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=5); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=5); [Quran.com](https://quran.com/29/5).
- **29:6:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=6); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=6); [Quran.com](https://quran.com/29/6).
- **29:7:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=7); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=7); [Quran.com](https://quran.com/29/7).
- **29:8:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=8); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=8); [Quran.com](https://quran.com/29/8).
- **29:9:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=9); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=9); [Quran.com](https://quran.com/29/9).
- **29:10:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=10); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=10); [Quran.com](https://quran.com/29/10).
- **29:11:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=11); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=11); [Quran.com](https://quran.com/29/11).
- **29:12:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=12); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=12); [Quran.com](https://quran.com/29/12).
- **29:13:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=13); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=13); [Quran.com](https://quran.com/29/13).
- **29:14:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=14); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=14); [Quran.com](https://quran.com/29/14).
- **29:15:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=15); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=15); [Quran.com](https://quran.com/29/15).
- **29:16:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=16); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=16); [Quran.com](https://quran.com/29/16).
- **29:17:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=17); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=17); [Quran.com](https://quran.com/29/17).
- **29:18:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=18); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=18); [Quran.com](https://quran.com/29/18).
- **29:19:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=19); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=19); [Quran.com](https://quran.com/29/19).
- **29:20:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=20); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=20); [Quran.com](https://quran.com/29/20).
- **29:21:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=21); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=21); [Quran.com](https://quran.com/29/21).
- **29:22:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=22); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=22); [Quran.com](https://quran.com/29/22).
- **29:23:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=23); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=23); [Quran.com](https://quran.com/29/23).
- **29:24:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=24); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=24); [Quran.com](https://quran.com/29/24).
- **29:25:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=25); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=25); [Quran.com](https://quran.com/29/25).
- **29:26:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=26); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=26); [Quran.com](https://quran.com/29/26).
- **29:27:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=27); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=27); [Quran.com](https://quran.com/29/27).
- **29:28:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=28); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=28); [Quran.com](https://quran.com/29/28).
- **29:29:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=29); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=29); [Quran.com](https://quran.com/29/29).
- **29:30:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=30); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=30); [Quran.com](https://quran.com/29/30).
- **29:31:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=31); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=31); [Quran.com](https://quran.com/29/31).
- **29:32:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=32); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=32); [Quran.com](https://quran.com/29/32).
- **29:33:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=33); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=33); [Quran.com](https://quran.com/29/33).
- **29:34:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=34); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=34); [Quran.com](https://quran.com/29/34).
- **29:35:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=35); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=35); [Quran.com](https://quran.com/29/35).
- **29:36:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=36); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=36); [Quran.com](https://quran.com/29/36).
- **29:37:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=37); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=37); [Quran.com](https://quran.com/29/37).
- **29:38:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=38); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=38); [Quran.com](https://quran.com/29/38).
- **29:39:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=39); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=39); [Quran.com](https://quran.com/29/39).
- **29:40:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=40); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=40); [Quran.com](https://quran.com/29/40).
- **29:41:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=41); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=41); [Quran.com](https://quran.com/29/41).
- **29:42:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=42); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=42); [Quran.com](https://quran.com/29/42).
- **29:43:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=43); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=43); [Quran.com](https://quran.com/29/43).
- **29:44:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=44); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=44); [Quran.com](https://quran.com/29/44).
- **29:45:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=45); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=45); [Quran.com](https://quran.com/29/45).
- **29:46:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=46); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=46); [Quran.com](https://quran.com/29/46).
- **29:47:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=47); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=47); [Quran.com](https://quran.com/29/47).
- **29:48:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=48); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=48); [Quran.com](https://quran.com/29/48).
- **29:49:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=49); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=49); [Quran.com](https://quran.com/29/49).
- **29:50:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=50); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=50); [Quran.com](https://quran.com/29/50).
- **29:51:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=51); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=51); [Quran.com](https://quran.com/29/51).
- **29:52:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=52); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=52); [Quran.com](https://quran.com/29/52).
- **29:53:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=53); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=53); [Quran.com](https://quran.com/29/53).
- **29:54:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=54); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=54); [Quran.com](https://quran.com/29/54).
- **29:55:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=55); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=55); [Quran.com](https://quran.com/29/55).
- **29:56:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=56); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=56); [Quran.com](https://quran.com/29/56).
- **29:57:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=57); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=57); [Quran.com](https://quran.com/29/57).
- **29:58:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=58); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=58); [Quran.com](https://quran.com/29/58).
- **29:59:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=59); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=59); [Quran.com](https://quran.com/29/59).
- **29:60:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=60); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=60); [Quran.com](https://quran.com/29/60).
- **29:61:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=61); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=61); [Quran.com](https://quran.com/29/61).
- **29:62:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=62); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=62); [Quran.com](https://quran.com/29/62).
- **29:63:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=63); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=63); [Quran.com](https://quran.com/29/63).
- **29:64:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=64); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=64); [Quran.com](https://quran.com/29/64).
- **29:65:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=65); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=65); [Quran.com](https://quran.com/29/65).
- **29:66:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=66); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=66); [Quran.com](https://quran.com/29/66).
- **29:67:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=67); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=67); [Quran.com](https://quran.com/29/67).
- **29:68:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=68); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=68); [Quran.com](https://quran.com/29/68).
- **29:69:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=29&verse=69); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=29&verse=69); [Quran.com](https://quran.com/29/69).

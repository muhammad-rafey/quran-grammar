# Surah 22 — Al-Hajj: source audit

Researched 2026-11-13. This lesson contains **78 ayahs and 1,274 word occurrences**. All Urdu word glosses, translations, grammatical explanations, dictionary summaries, verb-paradigm notes and concise tafsir notes are original AI-assisted editorial drafts. They are **not scholar-reviewed** and are not attributed to a named Urdu translator. No third-party Urdu book, dictionary, translation or tafsir was imported.

## Arabic inventory

`inventory-22.json` records the Quran.com Content API v4 `text_uthmani` word strings ([source](https://api.quran.com/api/v4/verses/by_chapter/22?words=true&word_fields=text_uthmani&per_page=50)), retrieved 2026-11-13, excluding end-of-ayah markers. Recitation signs that the API separates from a word by a space — waqf signs, the saktah sign, the sajdah sign and the rub al-hizb marker — are not part of the stored word token, following the Surahs 110–114 precedent. The inventory lists all 77 such exclusions with the original API text; no other character was changed. The unnumbered opening basmalah is not inserted as a numbered occurrence. Automated tests compare every stored word, its id and its segments with this inventory.

Word boundaries and counts match the Quranic Arabic Corpus morphology for every ayah. Per-ayah word counts: 9, 22, 12, 11, 69, 13, 12, 13, 15, 9, 25, 14, 10, 17, 22, 9, 22, 37, 17, 6, 4, 12, 22, 9, 25, 16, 14, 20, 8, 24, 21, 9, 11, 20, 15, 27, 20, 13, 10, 35, 17, 9, 4, 11, 14, 23, 14, 11, 8, 8, 8, 27, 16, 21, 16, 12, 8, 18, 7, 16, 15, 17, 15, 12, 27, 10, 17, 7, 9, 18, 18, 29, 28, 9, 11, 10, 11, 44.

## Sources and method

- **Morphology:** Quranic Arabic Corpus morphology 0.4 (Kais Dukes, GNU GPL with the Corpus terms of use), a verbatim distribution checked by SHA-256 `910b721a8f04f4334ac5d4c62b19e858f5d720c525bb975f2e750ea2c6bb532d`. It was consulted locally for segmentation, part of speech, root, lemma, verb form, voice, mood and case; it is not bundled or redistributed.
- **Word types and roots** are derived deterministically from the Corpus stem tags with the mapping that reproduces root assignments for all 230 word occurrences of the existing lessons, including words with no root. A preposition with an attached pronoun (لَهُ، بِهِ، عَلَيْهِمْ) is a particle, following Surahs 1, 105 and 112. Words without a Corpus root, such as proper names, keep no root.
- **Syntax:** the Corpus word-by-word pages (English morphology and Arabic i‘rab for every word) and verse grammar pages (Arabic i‘rab notes adapted from the Quran Printing Complex), retrieved 2026-11-13. All 78 verse pages carry a grammar note.
- **Verb paradigms** (باب، ماضی، مضارع، وزن) for all 280 verb occurrences come from a shared library of 199 verb lexemes for this expansion edition. Form I vowel classes were decided from imperfects attested across the whole Corpus and standard lexica (Lane, Lisan al-Arab, al-Mu‘jam al-Wasit). The edition’s library review and subsequent corrections are recorded in its handoff and adjudication reports.
- **Tafsir consulted** through the Quran.com API: Tafsir al-Muyassar (Arabic), Tafsir al-Sa‘di (Arabic) and Ibn Kathir (abridged, English). Translations consulted for meaning only: Saheeh International and Mufti Taqi Usmani. The Urdu wording is original and concise; it is not a translation of these works.

Word-type, verb-form and passive-voice counts below apply the adjudicated occurrence overrides; they are not uncorrected Corpus tag counts.

| Measure | Count |
| --- | ---: |
| Nouns | 524 |
| Adjectives | 45 |
| Verbs | 280 |
| Particles | 313 |
| Pronouns | 112 |
| Passive verb occurrences | 27 |
| Distinct roots | 328 |
| Verb form I | 158 |
| Verb form II | 24 |
| Verb form III | 10 |
| Verb form IV | 68 |
| Verb form V | 4 |
| Verb form VII | 1 |
| Verb form VIII | 12 |
| Verb form X | 2 |
| Verb form QIV | 1 |

## Editorial checks

The lesson is organized into 41 chunks of whole ayahs. No review-result snapshot was supplied. This source audit therefore does not certify completion of independent reviews, fixes or final confirmations. The intended workflow requires independent grammar and meaning/tafsir reviews and a clean final confirmation after every correction, including minor findings.
The chunk validator checks the exact Arabic word, segments that rejoin to the exact word, ids and order, rule references, verb-note presence, phrase coverage of every word, and the absence of URLs or Latin text. AI review and automated checks are not scholarly review.

Nouns without a Corpus root (root left empty): إِبْرَٰهِيمَ، إِذَا، ذَاتِ، فَإِذَا، فَإِذَآ، فَكَأَيِّن، لُوطٍۢ، لِإِبْرَٰهِيمَ، مَدْيَنَ، مُوسَىٰ، نُوحٍۢ، وَإِذَا، وَإِذْ، وَثَمُودُ، وَكَأَيِّن، يَـٰٓأَيُّهَا، يَوْمَئِذٍۢ.

## Corrections to Corpus tags

These occurrences carry an adjudicated correction or a documented source/analysis disagreement. The lessons follow the recorded contextual analysis; the raw Corpus data itself is unchanged.

- **22:11:11** ٱطْمَأَنَّ: The vocalized quadriliteral-augmented pattern is اِفْعَلَلَّ as in اِقْشَعَرَّ, rather than the unrelated triliteral Form XII. Use the existing QIV paradigm; the inherited QAC key is an index.
- **22:26:12** بَيْتِىَ: The house is the direct object of the imperative وَطَهِّرْ. Its accusative fatḥa is estimated before the first-person yāʾ, which is in the genitive position as the possessive complement. The QAC nominative tag conflicts with this construction.
- **22:30:16** يُتْلَىٰ: The passive verb is in the relative clause of مَا. No subjunctive or jussive governor precedes it; it is indicative with an estimated ḍamma on the final alif. The token-level QAC subjunctive analysis conflicts with the verse-level identification of a relative phrase.
- **22:42:2** يُكَذِّبُوكَ: The verb is the protasis after conditional إِنْ, so it is jussive with nūn omitted. The plural wāw is the subject and the kāf the object. QAC instead tags it as subjunctive.
- **22:44:3** وَكُذِّبَ: The ḍamma on kāf and kasra on dhāl establish the passive كُذِّبَ. Mūsā is the following subject of the passive. The raw lookup key was mapped to an active paradigm for the differently vocalized 29:18:2 in Edition 2.
- **22:52:11** تَمَنَّىٰٓ: The prefixed tāʾ and doubled second radical mark Form V تَمَنَّى. The verse’s tafsir sources discuss recitation and desire; preserve their interpretive distinction in the lesson.

## Analysis decisions and cautions

Notes recorded by the authors and reviewers for scholarly review; they mark alternative analyses, source disagreements and editorial choices.

- **22:1:1:** QAC gives the vocative stem a nominative tag. Ayy is built on damma in an accusative vocative slot, and ha is the alerting particle within the QAC stem.
- **22:1:2:** The ayah i‘rab treats al-nas as badal. The root library treats its root assignment as a lexical index and records an alternative derivation from unas.
- **22:2:2:** The feminine object pronoun is taken to refer to the convulsion of the Hour. Muyassar describes it more broadly as witnessing the onset of the Hour.
- **22:2:3:** The lexeme adopts dhahila for the perfect. It also records dhahala as a lexical variant consistent with the attested imperfect.
- **22:2:6:** The lesson follows the QAC relative analysis with an omitted object resumptive in the following verb. A masdariyya reading would instead give the sense of being distracted from nursing.
- **22:2:13:** The QAC ayah note treats the visual verb as taking one object, with the following plural as hal. A cognitive reading could yield a second object.
- **22:2:18:** QAC word-level i‘rab gives surface jarr. The ayah note supplies the additional predicate position: accusative in syntactic position after negative ma acting like laysa.
- **22:2:19:** The QAC ayah note coordinates the istidrak clause with an implied independent clause, glossed as all this is slight.
- **22:2:22:** The generated word-level line calls it a raised adjective. Its lexical class is adjectival, and its syntactic role is the nominative predicate of lakinna.
- **22:3:1:** The word-level i‘rab calls the waw coordinating, while the ayah note calls the clause resumptive. The lesson retains the conjunction at word level and treats the clause as syntactically independent.
- **22:3:2:** QAC tags the noun masculine plural. The lesson uses the root library’s collective analysis and retains its plural meaning. The indexed root is not a settled etymology.
- **22:4:4:** QAC segments, morphology and word-level i‘rab label man relative. The ayah i‘rab makes it a jussive-governing conditional mubtada, with the perfect verb in a jussive position and a linked answer.
- **22:4:6:** The word-level QAC label REM and i‘rab call the fa resumptive. The ayah i‘rab identifies the nominal clause with an understood predicate as the conditional answer, so the fa is taught as the linking fa. The second ha is read as referring to the devil, while the first is explicitly identified as a pronoun of matter.
- **22:5:1:** QAC NOM describes the visible damma of ayy; the vocative is built on damma in the accusative position. The segment hā is a particle of attention.
- **22:5:2:** The noun specifies the vocative and follows its surface damma. The lesson treats it as an explicative dependent (ʿaṭf bayān); a common alternative calls it a naʿt. The packet root is a lexical index and its derivation is disputed.
- **22:5:6:** The shared root note describes the generic negative lā construction, which does not govern this occurrence. Here the noun is genitive after fī.
- **22:5:8:** The ordinary lexical analysis is the verbal noun of baʿatha; QAC tags it as a plain noun.
- **22:5:9:** Word QAC labels the fā resumptive and the pronoun an object. The lesson treats the fā as linking the overt nominal answer and the pronoun as ism inna. The translation supplies an invitation to reflect, since creation precedes the stated doubt.
- **22:5:22:** Word iʿrab gives the surface case. Agreement and context support taking the first participle as a modifier of the preceding lump, with ghayr coordinated to it and the second participle as genitive complement of ghayr.
- **22:5:24:** The tafsirs connect the two states to formation and pregnancy loss. Ibn Kathir also reports Mujahid applying both states to miscarried fetuses. The translation retains the two states without specifying an outcome for either.
- **22:5:27:** Word QAC labels the wāw coordinating. The ayah-level iʿrab calls the indicative clause independent, and the lesson follows it.
- **22:5:37:** QAC tags a plain singular noun. The ayah iʿrab treats it as a circumstantial accusative and explains the singular by its original use as a masdar.
- **22:5:39:** The ayah iʿrab attaches the interpreted masdar to an elided coordinated verb of giving lifespan.
- **22:5:43:** The tafsirs place the death at different stages: Muyassar and Saʿdi include death before maturity, while Ibn Kathir mentions death in youth and strength. The translation leaves the age open.
- **22:5:50:** QAC groups kay and lā under a negative stem. The ayah-level iʿrab distinguishes genitive lām, subjunctive kay, and negating lā.
- **22:5:54:** QAC labels ʿilm a plain noun. The ayah iʿrab gives it the verbal-noun government of the following object.
- **22:5:55:** The ayah iʿrab makes shayʾan the object of ʿilm. A direct object of yaʿlama is another possible attachment and gives a similar overall sense.
- **22:5:56:** The lesson reads the singular address generically as any observer. It follows the ayah iʿrab in treating the sight verb as taking one object, with the following accusative as circumstantial.
- **22:5:64:** The root note discusses an elevated place, relevant to rabwah. This occurrence is the verb rabā with feminine tāʾ and means the earth swelled.
- **22:6:4:** The ayah i‘rab specifies a separating pronoun without a syntactic position. An alternative treats it as a second subject and the resulting nominal clause as the predicate of anna.
- **22:6:6:** The generic QAC English object-pronoun label describes the suffix form. The suffix is syntactically the accusative ism of anna here and at 22:6:9.
- **22:6:7:** The final radical yāʾ is unwritten in the Uthmani form here. The verb is active indicative with implied ḍamma and has no jussive governor.
- **22:7:3:** The QAC lemma is an uninflected stem label. The canonical indefinite masculine headword آتٍ is the active participle of أَتَى, as shown by the feminine occurrence.
- **22:7:4:** The supplied ayah i‘rab makes the whole lā clause the second predicate of anna. An alternative reads it as an interposed clause affirming the first predicate.
- **22:7:5:** The word-level ACC gloss does not distinguish an inflected accusative from this built ism of generic lā. It is built on fatḥa in the accusative position.
- **22:7:6:** QAC's generic object-pronoun label for the suffix is morphological. Here the suffix is in the genitive position governed by fī.
- **22:8:4:** QAC’s lemma label is not the citation form. The verified paradigm gives جَادَلَ and يُجَادِلُ.
- **22:8:9:** The repeated lā here is non-governing; the following nouns are coordinated with ʿilmin and are genitive.
- **22:8:10:** The written tanwīn on this indefinite maqṣūr noun does not indicate accusative case; the genitive kasra is implied on the final alif.
- **22:9:1:** QAC tags a plain accusative noun. The form is the active participle of ثَنَى, and the ayah i‘rab makes it a circumstantial accusative of the subject of the disputing verb in 22:8. The genitive complement is its semantic object.
- **22:9:3:** The ayah i‘rab attaches the purpose construction to the disputing verb in 22:8. The lesson follows the supplied active Form IV reading, with people understood as the object.
- **22:9:9:** QAC treats the word as a feminine singular noun here. Its lexical base is the feminine of the elative أَدْنَى, used substantivally for this worldly life.
- **22:10:2:** The lesson follows QAC in taking مَا as a relative with an omitted object resumptive. A possible alternative takes it as a masdar particle, yielding a paraphrase such as “because of your deeds.”
- **22:10:7:** The occurrence and the verified paradigm give لَيْسَ. The raw QAC lemma carries an initial shadda, which belongs to recitational assimilation and is excluded from the dictionary form.
- **22:10:8:** The word i‘rab only gives the surface preposition and genitive. The bāʾ reinforces negation and the predicate is locally accusative. The ayah i‘rab reads فَعَّال as attribution (ذي ظلم), so the lesson does not limit the negation to excessive wrongdoing.
- **22:10:9:** The generic word i‘rab gives a prepositional phrase. The ayah i‘rab identifies the lām as supplementary for strengthening government and the noun as the object of the preceding فَعَّال expression.
- **22:11:2:** QAC indexes the collective noun under ن و س. The root library also records an analysis from أُنَاس under أ ن س.
- **22:11:11:** Raw QAC labels this Form XII. The reviewed paradigm analyzes it as augmented quadriliteral Form IV (باب اِفْعِلَّال). The packet indexes ط م ن; some lexicographers count hamza as radical, and Sibawayh is reported to analyze the form as metathesized.
- **22:11:20:** QAC morphology and word i‘rab both give nominative. Here this is the direct object of خَسِرَ, with accusative fatḥa implied on final alif; the coordinated following noun has overt accusative fatḥa.
- **22:11:23:** The ayah i‘rab treats هُوَ as a separating pronoun here and at 22:12:12. An alternative parses it as a second mubtada with the following noun as its predicate, the inner clause serving as predicate of the demonstrative.
- **22:11:24:** QAC gives a generic noun tag. The lesson identifies خُسْرَان as the verbal noun of خَسِرَ.
- **22:12:13:** QAC gives a generic noun tag. The lesson identifies ضَلَال as the verbal noun of ضَلَّ, consistent with the packet root entry.
- **22:13:1:** The Uthmani silent alif follows a radical final waw in this 3ms indicative; the spelling does not mark a plural subject.
- **22:13:2:** The ayah-level i‘rab takes the lam as supplemental emphasis on the direct object, not a preposition. It cites a reading without this lam in support.
- **22:13:4:** The word-level i‘rab says nominative adjective. The ayah-level i‘rab identifies the elative as the predicate of the relative clause, which is the analysis followed here.
- **22:13:8:** QAC morphology and word-level i‘rab mark genitive. The ayah-level i‘rab gives the definite noun as the subject of the verb of blame, hence nominative with an implied damma.
- **22:13:** The packet has Sa‘di for this ayah, no Muyassar text, and only a grouped-commentary pointer for Ibn Kathir. The tafsir summary draws on Sa‘di and the immediate Quranic context.
- **22:14:3:** The raw QAC lemma has passive vocalization. The occurrence and the reviewed paradigm are active, so the citation form is أَدْخَلَ.
- **22:14:7:** QAC morphology and word-level i‘rab label this genitive. It is the direct object of عَمِلَ and takes accusative kasra as a sound feminine plural.
- **22:14:8:** QAC morphology and word-level i‘rab label this genitive. The ayah-level i‘rab identifies the second object of أَدْخَلَ, so its kasratan marks accusative.
- **22:15:1:** QAC morphology and word i‘rab call this relative. The ayah i‘rab takes it as a conditional mubtada, with the perfect condition verb in a jussive position.
- **22:15:4:** The word sources label this a masdar particle. The ayah i‘rab specifies lightened anna with an implicit pronoun of matter and the following negative clause as its predicate.
- **22:15:11:** The word sources call the fa resumptive. The ayah i‘rab makes this clause the conditional answer, so its fa is the answer linker.
- **22:15:16:** The raw lemma is vocalized as a passive perfect, while the occurrence is an active jussive and the reviewed paradigm is قَطَعَ يَقْطَعُ. The cutting is left implicit in the translation. Muyassar and Ibn Kathir describe a ceiling and self-strangling, while Sa‘di reads the image as reaching heaven to cut off divine support.
- **22:15:17:** The prefixed fa is treated as resumptive following the word i‘rab. The ayah i‘rab describes the interrogative clause as the object of the suspended verb of looking.
- **22:15:19:** The ayah and word i‘rab identify the attached emphatic nun. Direct attachment makes the imperfect built on fatha, in a nominative-mood position here.
- **22:15:20:** QAC tags a plain noun. The lesson identifies كَيْد as the verbal noun of كَادَ يَكِيدُ, the verb identified in the root entry, and uses its contextual sense of a scheme.
- **22:16:1:** The word sources call the waw coordinating and describe the surface prepositional phrase. The ayah i‘rab calls the waw resumptive and the comparison kaf a substitute for the cognate accusative.
- **22:16:3:** QAC tags this word genitive. The ayah i‘rab makes it an accusative hal of the object pronoun, with kasra marking the accusative sound feminine plural.
- **22:16:4:** The word sources label the adjective genitive. It follows the accusative hal and has the same kasra accusative ending of the sound feminine plural.
- **22:16:5:** The ayah i‘rab coordinates the interpreted masdar with the object pronoun of the preceding verb, reflected by the parenthetical wording in Urdu. Sahih International renders a causal relation, while Taqi Usmani and Ibn Kathir give the clause as an assertion.
- **22:16:9:** The relative clause has an understood object, the guidance of that person. Its understood possessive pronoun supplies the link back to the relative.
- **22:17:5:** QAC gives the truncated stem هَادُ as lemma. The reviewed Form I paradigm gives هَادَ / يَهُودُ, used here for becoming or being Jewish.
- **22:17:6:** The supplied tafsirs report disagreement about the Sabians’ identity. The lesson marks the Muyassar description as one view.
- **22:17:8:** QAC labels the group name as a passive participle. The word i‘rab and packet root entry treat it as a community name, and its derivation is uncertain. The learner lemma gives the individual form مَجُوسِيّ.
- **22:17:22:** The word i‘rab says صفة مرفوعة. This fits its lexical adjective class, while its clause function is khabar of the final إِنَّ. The preceding prepositional phrase is construed with this predicate.
- **22:18:** The packet supplies Muyassar and Ibn Kathir abridged for this ayah. The Sa‘di text is absent.
- **22:18:2:** The ayah i‘rab treats the following interpreted masdar as filling both object slots, supporting cognitive perception here.
- **22:18:18:** The Corpus English label 'masculine plural' is coarse here. This is the broken plural of the feminine singular dābbah.
- **22:18:21:** The packet indexes nās under n-w-s. The root entry also reports derivation from unās under ʾ-n-s as an alternative.
- **22:18:22:** The ayah i‘rab coordinates the second kathīr with the first and treats the following clause as its adjective. A separate nominal clause with kathīr as subject and the verbal clause as predicate is an alternative.
- **22:18:24:** The English morphology calls the suffix an object pronoun. Here it is governed by the preposition and is in a genitive position.
- **22:18:26:** The word tags and word i‘rab mark the wāw as coordinating and man as relative. The ayah i‘rab treats the clause as independent and man as a conditional direct object, consistent with the jussive.
- **22:18:29:** The word tags call the fāʾ resumptive. The ayah i‘rab makes this the conditional answer, with fāʾ linking its negative clause to the condition.
- **22:18:32:** The word i‘rab records surface genitive. The ayah i‘rab identifies an underlying nominative subject after supplemental min.
- **22:18:37:** The reviewed lexeme adopts the samiʿa class. Its evidence notes that the surface forms alone do not exclude a faʿala analysis.
- **22:19:1:** The packet identifies the dual demonstrative as mubtada. The lesson describes its visible dual nominative form with alif. Another grammatical convention describes dual demonstratives as built with a nominative syntactic position.
- **22:19:6:** QAC morphology and the word i‘rab treat the fa as resumptive. The ayah notes describe the whole sentence as coordinated with the opening independent clause.
- **22:19:13:** The root note’s wording about an active verb describes the scourge expression elsewhere. This occurrence is passive, as the packet morphology and reviewed paradigm confirm.
- **22:19:17:** The word line labels this a nominative adjective. The packet root entry and passive clause identify its syntactic role as deputy subject, with the adjectival form used substantivally.
- **22:20:1:** The packet root entry for ص ه ر foregrounds kinship by marriage and says the melting verb does not occur in the covered surahs. This occurrence and the reviewed verb paradigm directly attest the melting sense.
- **22:22:1:** The lesson follows the packet’s temporal analysis: كُلَّ governs an interpreted masdar formed with source-particle مَا and attaches to the return verb. The construction also conveys recurrent condition in meaning.
- **22:22:6:** The ayah i‘rab analyzes the phrase as badal of inclusion with an implied possessive pronoun. The translation conveys the natural causal sense of the anguish.
- **22:23:7:** Raw QAC GEN and the generated genitive iʿrab conflict with the direct-object role after عَمِلَ. The visible kasra marks accusative on a sound feminine plural.
- **22:23:8:** Raw QAC GEN and the generated genitive iʿrab conflict with the ayah note identifying this as the second object. The sound feminine plural takes kasra in the accusative.
- **22:23:15:** The ayah note describes the first min phrase as attached to an adjectival governor (متعلق بنعت لأساور). Its wording leaves the governor implicit. The lesson retains the descriptive analysis and follows the note on the accusative coordination of pearls with the phrase’s syntactic position.
- **22:23:16:** The root entry gives إِسْوَار as a possible singular and also records a plural-of-plural derivation from سِوَار. The lemma uses the former and the lesson mentions both.
- **22:23:22:** The shared root entry ح ر ر covers freedom and heat and omits the silk sense of this noun. The lesson uses the word gloss and tafsir for its contextual meaning.
- **22:24:9:** QAC tags this as a genitive adjective. It is used substantivally as the genitive complement in the primary reading, referring to Allah. Al-Saʿdi also offers a praiseworthy-path interpretation.
- **22:25:1:** The predicate of inna is understood as a threat. Muyassar supplies a painful punishment, and Taqi Usmani supplies the act of punishing in parentheses.
- **22:25:11:** The word i‘rab identifies the attached object pronoun. The ayah notes add an implied second object to which the prepositional phrase at 22:25:12 attaches.
- **22:25:13:** QAC morphology gives a plain accusative noun. The ayah notes identify it more specifically as a masdar used as a hal of al-nas and make the resident the masdar’s subject.
- **22:25:16:** QAC morphology and word i‘rab mark genitive. The ayah notes coordinate it with the nominative resident and specify nominative with an implied damma on the omitted final ya.
- **22:25:17:** QAC morphology and word i‘rab give a coordinating waw and relative pronoun. The ayah notes read a resumptive waw and a conditional noun in subject position, consistent with the two jussive verbs.
- **22:25:20:** The ayah notes attach the bi-phrase to an implied hal of the omitted object of the condition verb and take the following bi-phrase as its badal.
- **22:25:22:** The initial shadda marks recitational assimilation of the preceding tanwin into nun. The verb remains first-person plural, with no emphatic nun.
- **22:26:1:** The word line and QAC prefix tag give a coordinating wāw. The ayah-level iʿrab makes it resumptive and takes the time adverb as object of an implied command to remember.
- **22:26:12:** Applied the packet correction: the House is the direct object of the imperative, with estimated fatḥa before the possessive first-person yāʾ. The raw QAC nominative tag and generated word iʿrab conflict with this syntax.
- **22:26:16:** Retained QAC’s genitive adjectival analysis. In this context the form is the broken plural of the active participle, on fuʿūl, homonymous with the verbal noun. The root entry gives a different plural pattern, fuʿʿal, which is not the surface form here.
- **22:27:5:** QAC morphology and the word iʿrab label the form subjunctive. The ayah-level iʿrab makes it the answer to an implied condition after the imperative, so it is jussive by deletion of the indicative nūn. The surviving wāw is the subject and the kāf the direct object.
- **22:27:6:** The ayah iʿrab makes this an accusative ḥāl of the subject wāw. The contrasting riding phrase supports the lexical plural of rājil, “on foot,” rather than the homonymous plural of rajul.
- **22:27:10:** The ayah iʿrab attaches this adjectival clause to the whole kull-plus-participle phrase. Feminine plural agreement is with the implied she-camels, whereas the preceding overt participle has masculine singular morphology.
- **22:28:** The supplied abridged Ibn Kathir excerpt discusses 22:30 and following material. The lesson uses the relevant Muyassar and Saadi texts for both ayahs.
- **22:28:5:** The lesson follows the packet root index س م و for اِسْم. The shared root note also records the alternative derivation from و س م.
- **22:28:12:** Following the verified lexeme, the attached pronoun is the recipient and the deleted second object is the resumptive pronoun for مَا.
- **22:29:2:** The word-level QAC prefix, mood, and generated irab indicate purpose and subjunctive. The ayah-level irab identifies the command lam, so the lesson follows the jussive analysis with nun deletion.
- **22:29:3:** The translation gives removal of untidiness. The tafsir also records the broader explanation including completion of the rites.
- **22:29:5:** The word is the broken plural of نَذْر, used here for vows. The shared root note excludes the vow sense in its scope statement, although its meaning field includes it.
- **22:29:6:** QAC gives an assimilated imperfect-shaped lemma. The lesson uses the reviewed citation form تَطَوَّفَ.
- **22:29:8:** The translation gives ancient. The tafsir and lexical note also retain the explanation of the House as protected from tyrants.
- **22:30:2:** Token QAC labels man relative and the wa conjunctive. The verse i‘rab treats man as a conditional mubtada and the clause as resumptive, consistent with the jussive verb.
- **22:30:4:** QAC marks the noun genitive. It is the direct object of the active conditional verb, with kasra marking accusative on the sound feminine plural.
- **22:30:6:** Token QAC calls the fa resumptive. It links the nominal answer to the jussive condition. The pronoun refers to the act of honoring, understood from the condition verb.
- **22:30:7:** The lesson reads khayr as an elative, following the Sahih International rendering. Taqi Usmani renders the same predicate as good for him.
- **22:30:11:** Token QAC labels wa conjunctive. The verse i‘rab treats the passive clause as a new independent sentence.
- **22:30:14:** Token QAC labels illa a restriction particle. The verse i‘rab analyzes an exception from the expressly stated livestock, with the relative ma in the accusative position.
- **22:30:16:** Applied the packet correction. The raw subjunctive tag and token i‘rab conflict with the relative clause, which has no subjunctive or jussive governor. This passive imperfect is indicative with an estimated damma on final alif.
- **22:30:20:** The verse i‘rab attaches the prepositional phrase to an implied circumstantial modifier of rijs. Many exegetes take min as specifying the kind of impurity, while Sa‘di prefers the partitive reading.
- **22:30:** The Ibn Kathir abridged field points to grouped commentary at 22:28 and provides no local text. The Urdu tafsir draws on the supplied Muyassar and Sa‘di excerpts.
- **22:31:6:** The word-level REL and coordinating-waw labels differ from the ayah i‘rab, which identifies a conditional mubtada and a resumptive clause. The following overt jussive supports the conditional reading.
- **22:31:9:** The word-level i‘rab labels fa resumptive. The ayah-level note identifies the clause as the conditional answer, so fa is taught as linking the answer. Ma blocks the usual government of ka’anna.
- **22:31:20:** The QAC lemma includes an initial mim shadda absent from the occurrence and standard citation form. The lesson keeps the packet root and uses the ungeminated citation form.
- **22:32:2:** The word-level REL and coordinating-waw labels differ from the ayah i‘rab, which identifies a conditional mubtada and a resumptive waw. The following verb has overt jussive sukun.
- **22:32:3:** The QAC lemma is the inflected jussive. The lesson uses the verified active perfect citation form.
- **22:32:4:** QAC labels the plural masculine. The lesson describes its broken-plural pattern and gives sha‘irah as the singular dictionary form.
- **22:32:6:** QAC labels fa resumptive and ha an object pronoun. The ayah i‘rab identifies the conditional answer and the word i‘rab makes ha the ism of inna. The feminine singular may refer grammatically to the nonhuman plural sha‘a’ir. The tafsirs unpack the meaning as the act of honoring them.
- **22:32:9:** QAC marks feminine plural. This is a broken plural of qalb, not a sound feminine plural.
- **22:33:2:** QAC English calls the suffix an object pronoun generically. It is genitive after the preposition. The suffix denotes the sacrificial animals in the supplied tafsir.
- **22:33:11:** The gloss follows the supplied translations in taking the epithet as ancient. The root entry also records the exegetical sense of the House being kept free of tyrants.
- **22:34:1:** The verse iʿrab treats the initial waw as resumptive, while the generated line and QAC segment label it coordinating. The verse iʿrab is followed.
- **22:34:4:** The verse iʿrab makes mansakan the first object and attaches li-kulli to an implied second object. With jaʿala in the sense of prescribing, a one-object analysis attaching the prepositional phrase directly to the verb is also possible. Ibn Kathir also transmits interpretations of mansak as festivals and as Makkah.
- **22:34:10:** The relative clause has an elided second-object resumptive pronoun referring to ma. The written plural pronoun is the first object.
- **22:34:14:** The verse iʿrab treats this nominal clause as independent. Its initial fa is taught as resumptive, although the QAC segment and generated line label it coordinating.
- **22:34:17:** The verse iʿrab explicitly coordinates the imperative clause with the preceding nominal clause. The QAC segment and generated line instead call its fa resumptive. The verse iʿrab is followed.
- **22:34:19:** The verse iʿrab treats this command as a new independent clause, while the segment and generated line label the waw coordinating. The citation follows the reviewed active paradigm bashshara despite the passive-shaped raw QAC lemma. The final kasra is for liaison.
- **22:35:7:** The lesson follows QAC in coordinating the accusative participle with the preceding ayah’s object. The fluent Urdu translation presents the qualities as one continuous description.
- **22:35:14:** The word-level i‘rab states the overt object pronoun. The reviewed lexeme entry also identifies a deleted second object, the resumptive pronoun of relative mā.
- **22:36:1:** The word-level QAC line labels the wāw coordinating. The ayah notes take it as resumptive and parse the accusative noun through ishtighāl, with an omitted verb explained by the following clause.
- **22:36:10:** QAC morphology and the word-level iʿrāb label the fāʾ resumptive. The ayah notes explicitly coordinate the command clause with the appointment clause, which is the analysis taught here.
- **22:36:14:** QAC codes the broken plural as masculine plural. The usual singular for this use is ṣāffah, describing a standing she-camel. The accusative circumstantial points back to the pronoun in the preceding prepositional phrase.
- **22:36:18:** QAC morphology and the word-level iʿrāb label the fāʾ resumptive. The imperative is the answer of the overt idhā condition, so its fāʾ is taught as the answer linker.
- **22:36:1:** The tafsirs record a scope difference for budn: sacrificial camels, or camels and cattle. The translation uses a broad gloss and the tafsir states both views.
- **22:36:21:** The translation follows Muyassar and Saʿdi: the self-restrained needy person and the one who asks. Ibn Kathir also records the visitor who does not ask aloud and a reversal of the two glosses.
- **22:36:23:** The word-level QAC gives a prepositional phrase. The ayah notes take the kāf as a substitute for the cognate accusative and the demonstrative as its genitive complement. The syntax teaches that detailed analysis while retaining the particle segmentation.
- **22:37:6:** The packet indexes the noun under d-m-w. Its root entry records the lexicographic alternative d-m-y for the lost final radical of the singular.
- **22:37:9:** QAC tags the noun masculine. Taqwa is treated here as grammatically feminine with alif al-ta’nith al-maqsura. The preposed verb may be masculine with this non-personal feminine subject.
- **22:37:11:** QAC’s word line gives a prepositional analysis. The ayah note analyzes the kaf as a substitute for the cognate accusative, with the demonstrative as its genitive complement. The lesson follows that more specific syntax.
- **22:37:17:** The effective app type remains pronoun. QAC’s word tag and word i‘rab read relative ma, while its ayah note reads masdariyya. The label shows both analyses. The explanation follows the ayah note, with the resulting masdar governed by ala.
- **22:37:19:** QAC’s word line labels the waw coordinating. The ayah note treats the imperative clause as resumptive. The lesson follows the clause analysis and uses the verified active citation form bashshara for the imperative.
- **22:38:12:** The word i‘rab gives a generic genitive adjective label. The intensive is adjectival in form and is used substantivally as the complement of kull; an implicit described noun is another way to express that reading.
- **22:39:2:** The word-level i‘rab gives only the prepositional phrase. The ayah-level i‘rab assigns that phrase the passive subject function, which the lesson follows.
- **22:39:4:** QAC morphology calls the suffix an object pronoun. The i‘rab identifies it as the ism of the accusative particle anna.
- **22:39:6:** QAC morphology and word-level i‘rab label the waw coordinating. The ayah-level i‘rab calls the following clause resumptive, which the lesson follows.
- **22:39:9:** QAC gives the general noun tag. The verified root entry identifies this noun as the verbal noun of nasara.
- **22:40:7:** QAC labels the particle RES and the short i’rab calls it a restriction marker. The ayah i’rab explicitly takes the interpreted masdar as a disconnected exception, which the lesson follows.
- **22:40:12:** The word-level i’rab calls the waw coordinating. The ayah-level i’rab describes the conditional as a syntactically independent new sentence.
- **22:40:21:** The shared root entry gives the ordinary prayer sense. The contextual synagogue gloss follows both packet translations and the tafsir identification of Jewish places of worship.
- **22:40:23:** The ayah i’rab attaches the descriptive clause to mosques. Al-Sa’di applies the remembrance to the listed places of worship more broadly. The grammar and translation follow the narrower attachment.
- **22:40:24:** The English morphology calls the suffix an object pronoun. After a preposition it occupies the genitive syntactic position.
- **22:40:27:** The short i’rab calls the word an accusative adjective. The ayah i’rab specifies that it stands in for the omitted cognate accusative.
- **22:40:28:** The word-level i’rab calls the waw coordinating. The ayah i’rab treats the oath and its answer as a syntactically independent new sentence. Direct attachment of the heavy nun makes the imperfect built on fatha.
- **22:40:35:** The short i’rab labels the word a nominative adjective, followed in the primary analysis. A second predicate of inna is also possible.
- **22:41:1:** The ayah note takes the relative as the predicate of an omitted hum. An alternative is to take it as an appositive to the relative referring to those expelled in 22:40.
- **22:41:3:** The raw QAC lemma ends before the assimilated radical nun. The lesson uses the reviewed form II lemma makkana and treats the written shadda on nun as shared by the final radical and the subject suffix.
- **22:41:15:** The ayah note treats the final nominal sentence as independent, so the lesson uses resumptive waw despite the raw conjunction tag and generated word i‘rab.
- **22:42:2:** Following the packet correction, conditional in governs a jussive with nun deletion. The raw QAC mood and generated word i‘rab say subjunctive. Waw is the subject and kaf is the object.
- **22:42:3:** QAC labels fa resumptive. The lesson treats it as the link to the expressed conditional response with qad. Since the prior denial is already established, the clause can also be read as evidence for an implied response, conveying consolation.
- **22:42:8:** The proper name is definite by reference despite the raw INDEF tag and its tanwin of declension. The packet’s root index is retained without deriving the tribal name from the verb meaning to return.
- **22:44:3:** The vocalized كُذِّبَ is passive. The former library key had been assigned an active paradigm for a distinct occurrence in 29:18. This token now links to the Form II passive paradigm.
- **22:44:5:** QAC segmentation and word iʿrab mark the fāʾ as resumptive. The ayah note coordinates the clause with the preceding conditional sentence in 22:42. The lesson follows the ayah-level analysis.
- **22:44:11:** QAC supplies a first-person possessive suffix with an empty written span. The word iʿrab identifies the yāʾ as elided. The lesson explains it without adding a segment.
- **22:45:1:** QAC segmentation and word iʿrab mark the fāʾ as coordinating. The ayah-level iʿrab takes it as resumptive and treats the numeral expression as mubtadaʾ. The lesson follows the ayah note.
- **22:45:2:** The QAC ayah note attaches the min phrase to an implied adjective of the expression of abundance. It can also be described as specifying the counted category, an alternative analysis as tamyīz governed by min.
- **22:45:7:** QAC segmentation and word iʿrab mark the fāʾ as resumptive. The ayah note coordinates the clause with the destruction clause. The lesson follows the ayah-level analysis.
- **22:45:14:** QAC tags the occurrence as a passive participle. Its pattern is the Form I passive of shāda. The shared root note illustrates the related Form II mushayyadah, while its gloss also supports plastered construction as a lexical nuance.
- **22:46:1:** The word i‘rab and SUP segmentation treat the first fa as supplemental, which the extra-particle rule follows. The ayah i‘rab calls it resumptive. A coordinating reading is also possible.
- **22:46:5:** The ayah i‘rab treats the verb as incomplete kāna and analyzes the implied masdar after causal fa as coordinated with a masdar inferred from the preceding question.
- **22:46:8:** The adjectival clause after the indefinite hearts is inferred by parallelism with the ayah note’s explicit adjectival clause after ears.
- **22:46:14:** The suffix is the ism of inna per word i‘rab. The lesson reads it as anticipatory feminine ha (the pronoun of the matter or story), with the following clause supplying its content. The packet does not explicitly label it as such.
- **22:46:16:** Raw QAC morphology and word i‘rab label this jussive. Negative lā here does not govern mood, and the retained alif maqṣūra confirms the indicative with implied damma, as the reviewed lexeme specifies. Both occurrences are active.
- **22:47:1:** The word i‘rab and morphology label the initial waw coordinating. The ayah i‘rab describes the opening clause as independent, so the lesson reads this waw as resumptive.
- **22:47:6:** QAC tags the stem as a plain noun. The lesson identifies waʿd lexically as the verbal noun of waʿada, used here as the direct object meaning His promise.
- **22:47:7:** The word i‘rab and morphology label this waw coordinating. The ayah i‘rab describes the inna clause as independent, so the lesson reads this waw as resumptive.
- **22:47:13:** The lesson follows the packet’s relative mā, with an omitted object resumptive. The prepositional phrase qualifies the counted year(s). A maṣdariyya reading would give “by your reckoning.”
- **22:48:1:** The word-level analysis calls the waw coordinating. The verse i'rab treats it as resumptive and the built numeral expression as a mubtada in nominative position.
- **22:48:3:** The verse i'rab attaches the min phrase to an implied adjective. Another analysis treats the genitive noun after min as specification of the numeral expression.
- **22:48:10:** The verse note treats the final sentence as resumptive, while the word-level analysis calls the waw coordinating. The preposition and first-person ya share the written geminate.
- **22:48:11:** Masir can denote the final destination or the act of returning as a mim-verbal noun. The Urdu foregrounds return.
- **22:49:2:** QAC labels the vocative noun nominative from the visible damma. Ayy is built on damma in an accusative position, and ha is a particle of attention.
- **22:49:3:** The root library indexes nas under n-w-s and also reports a derivation from unas under hamza-n-s. The lesson leaves the etymology open.
- **22:49:8:** The verse i'rab takes mubin as a second predicate. An attributive reading as a modifier of nadhir is also possible and fits the supplied translations.
- **22:50:1:** QAC morphology and the word note call the fa resumptive. The verse i'rab coordinates the sentence with the preceding declaration, which the lesson follows.
- **22:50:4:** QAC and the generated word i'rab mark genitive. The noun is the direct object of amilu and is accusative with kasra as a sound feminine plural.
- **22:50:** The standalone Sa'di extract substitutes wording from another passage. The tafsir follows the grouped Muyassar and Ibn Kathir entries at 22:49.
- **22:51:** The standalone Sa'di extract substitutes wording from another passage. The tafsir follows the grouped Muyassar and Ibn Kathir entries at 22:49 and retains two reported explanations of the opponents' efforts.
- **22:51:5:** The root-library example describes form IV mu'jiz. This occurrence is form III mu'ajiz, an accusative circumstantial participle describing the opponents' efforts.
- **22:52:1:** The token iʿrab calls the prefixed wāw conjunctive, while the ayah note treats the clause it introduces as independent. Both levels are reflected.
- **22:52:6:** The token iʿrab gives surface genitive. The ayah note identifies supplemental min and the noun as direct object, hence accusative in syntactic position. The coordinated nabiyy follows the surface genitive.
- **22:52:10:** The ayah iʿrab treats the entire conditional as a modifier of nabiyy. Its local case can be described by reference to the surface genitive or the underlying object position.
- **22:52:11:** Raw QAC omits the augmented form and the derived occurrence metadata defaults to Form I. The visible tāʾ and medial shadda agree with the verified Form V paradigm. The lesson uses “recited,” the majority interpretation reported by Ibn Kathir. His excerpt also records “spoke.” The usual lexical sense is “wished.”
- **22:52:16:** The shared root note claims only the written-copy noun occurs in its covered surahs. This attested verb means “efface, nullify,” as the verified paradigm and tafsir indicate.
- **22:52:22:** The raw lemma reflects a passive perfect from another occurrence. The vocalized occurrence and verified paradigm establish the active imperfect of أَحْكَمَ.
- **22:52:24:** QAC morphology and token iʿrab give genitive for the stem. It is the direct object of يُحْكِمُ, with accusative kasra on the sound feminine plural. The attached pronoun is in the genitive position by iḍāfa.
- **22:52:25:** The token iʿrab calls the wāw conjunctive, while the ayah note treats the nominal clause as independent. The token gloss “raised adjective” for the following two words describes their form; the lesson takes them as two predicates. The second may also be read as a modifier of the first predicate.
- **22:52:26:** The supplied Saʿdi excerpt reads ʿazīz in its closing gloss. The packet’s Qurʾanic text reads ʿalīm, as do the two translations and the other supplied tafsirs. The lesson follows the Qurʾanic text.
- **22:53:6:** The packet identifies a prepositional phrase and does not specify its governor. The lesson explains that the phrase identifies those for whom the casting becomes a trial.
- **22:53:12:** The word-level iʿrāb labels the wāw coordinating, while the ayah-level iʿrāb calls the entire clause resumptive. The lesson follows the ayah-level construction.
- **22:54:1:** The two purpose clauses follow the ayah iʿrāb in attaching to the previous ayah’s verb of making the signs firm.
- **22:54:5:** The QAC English segment description calls hāʾ an object pronoun. The word iʿrāb correctly identifies it as the ism of anna in the accusative position.
- **22:54:11:** The word iʿrāb labels fāʾ coordinating. The lesson treats the subjunctive as inherited through coordination, while expressing the resulting sequence in Urdu.
- **22:54:14:** The word-level iʿrāb labels the wāw coordinating, while the ayah-level iʿrāb calls the entire clause resumptive. The lesson follows the ayah-level construction.
- **22:54:16:** The ayah iʿrāb specifies an implied ḍamma on the omitted final yāʾ of the construct participle. The written kasra does not mark genitive case on the head.
- **22:54:21:** QAC tags this word as a Form X active participle and the short iʿrāb gives its case. It functions as the adjective of the preceding noun.
- **22:55:1:** Word i‘rab calls the waw coordinating, while the ayah i‘rab describes the ensuing clause as independent. The lesson retains the word-level label for waw and explains its connection to the preceding discourse.
- **22:55:7:** QAC English labels the suffix an object pronoun. After min it is in a genitive position, as the word i‘rab indicates.
- **22:55:11:** QAC morphology tags a plain noun; the ayah i‘rab and root entry identify a masdar functioning as hal.
- **22:55:16:** Muyassar and Sa‘di identify the barren day as Resurrection. The abridged Ibn Kathir also transmits the Day of Badr interpretation.
- **22:56:6:** Word-level QAC labels the fa resumptive. The ayah i‘rab explicitly coordinates the relative construction with the preceding judgment clause; the lesson follows that linkage.
- **22:56:9:** Raw QAC morphology and word i‘rab label the noun genitive. It is the direct object of the unprepositioned verb ʿamila, so the visible kasra marks accusative on a sound feminine plural.
- **22:57:5:** Word-level QAC tags fa as resumptive; the ayah i‘rab calls it supplemental because the relative subject resembles a condition. The lesson explains its linking role and tags extra-particle. The ayah note reverses some predicate labels; the lesson reads the demonstrative as an embedded mubtada, its following nominal clause as its khabar, and that whole sentence as the outer relative subject’s khabar.
- **22:58:12:** The ayah i‘rab assigns the noun as the second object. The lesson follows this and reads it as the provision bestowed, rather than a cognate accusative.
- **22:58:14:** Word i‘rab and raw QAC mark the wāw as coordinating. The ayah-level note makes the closing clause independent (mustaʾnafa), which the lesson follows.
- **22:58:16:** The word i‘rab identifies an independent pronoun without specifying its syntactic role. The lesson takes it as an inner mubtada whose clause is the khabar of inna. A separating pronoun without syntactic position is also possible, with khayr then the direct khabar of inna.
- **22:59:2:** QAC tags the Form IV noun as a passive participle. The lesson uses the same pattern as a noun of place in context, retaining the ayah i‘rab’s second-object analysis. The form also permits a mīmī verbal-noun reading referring to the admission itself.
- **22:59:4:** Word i‘rab and raw QAC mark the wāw as coordinating. The ayah-level note makes the closing clause independent (mustaʾnafa), which the lesson follows.
- **22:59:7:** The word i‘rab calls this a nominative adjective, which the lesson follows. A second predicate of inna is also possible.
- **22:60:2:** The word-level i’rab calls the waw coordinating, but the ayah i’rab calls it resumptive. The ayah note identifies man as relative and the oath plus its answer as its predicate. Its separate statement that the ʿāqaba clause is also khabar is internally inconsistent. That clause is taught as the relative clause, through the coordinated passive clause. A conditional reading of man is possible, with the oath answer indicating the omitted conditional answer.
- **22:60:9:** The packet identifies the passive and the following prepositional phrase but does not specify the deputy subject. The lesson takes the phrase as filling that slot with this intransitive verb.
- **22:60:16:** The word i’rab labels ghafūr a nominative adjective. The lesson reads it as modifying ʿafuww. A second predicate is also possible.
- **22:61:5:** The QAC and Uthmani surface split puts the single written geminated lām in the article slice. The lesson explains that it represents both the article lām and the first radical. The same split recurs at 22:61:11.
- **22:61:14:** Both final words receive the brief word-level label nominative adjective. Samīʿ is the first predicate of anna in this sentence. Baṣīr is taught as a second predicate, with an attributive reading of baṣīr also possible.
- **22:62:11:** The ayah i‘rab treats the middle هُوَ as a mubtada whose nominal clause is the predicate of أَنَّ. A parallel analysis as a separating pronoun is possible, as with the first and third occurrences.
- **22:62:17:** The word i‘rab labels this a nominative adjective, which permits a naʿt reading. The ayah note explicitly takes it as the second predicate of the third أَنَّ. The lesson follows the ayah note and retains the adjectival morphology.
- **22:63:9:** QAC segments and word i‘rab mark the fāʾ as resumptive, while the ayah i‘rab coordinates the clause with the preceding clause. The lesson follows the ayah i‘rab. The verb is indicative with visible ḍamma under either reading.
- **22:63:14:** The word i‘rab labels the word a nominative adjective. The lesson keeps the adjectival morphology and teaches its syntactic function as the first predicate of إِنَّ.
- **22:63:15:** The word i‘rab gives a generic nominative adjective label. The ayah i‘rab specifies a second predicate of إِنَّ, which the lesson follows.
- **22:64:10:** The ayah note makes the inner nominal clause the predicate of inna, so huwa is its mubtada. A separating-pronoun parse would make al-ghaniyy the direct predicate of inna.
- **22:64:12:** The generated word line calls al-hamid a nominative adjective. The ayah-level i‘rab specifies a second predicate, adopted here as the second predicate of inna.
- **22:65:2:** The ayah i‘rab treats the anna clause as filling both object slots of ra’a, so the lesson follows cognitive perception, with seeing the signs as context.
- **22:65:10:** The corpus features mark fulk masculine. Its form serves for both singular and plural, and here the sense is plural ships with feminine singular agreement in tajri. The Sa‘di excerpt vocalizes the quoted noun with kasra, while the packet’s Uthmani occurrence has fatha and the accusative coordination is used.
- **22:65:17:** QAC gives the interpreted masdar as maf‘ul li-ajlih with an understood khashyah. An alternative analysis supplies a preposition such as min or ‘an to express what the sky is held back from.
- **22:65:27:** The word-level i‘rab labels rahim an adjective, followed here. It can also be analyzed as a second predicate of inna.
- **22:66:1:** The word i‘rab calls the waw coordinative, while the ayah note describes the whole nominal sentence as independent. The lesson retains the word-level particle label and explains the clause as a new statement.
- **22:67:1:** The lesson follows the verse i‘rab: the fronted prepositional phrase attaches to the understood second object of jaʿalnā, and mansakan is its first object.
- **22:67:4:** Mansak is rendered broadly as a prescribed way of worship. Ibn Kathir discusses the term's place sense and also reports a divine-decree reading of the verse.
- **22:67:7:** The raw tags and word i‘rab call fa resumptive and la negative. The verse i‘rab gives coordinating fa and prohibitive la.
- **22:67:8:** Raw QAC labels the verb third-person masculine singular and gives no jussive tag. The verse i‘rab and reviewed lexeme establish third-person masculine plural, jussive by loss of the five-verbs nun, with an elided subject waw before heavy emphatic nun. The damma before the suffix reflects the elided waw.
- **22:67:14:** QAC English calls the suffix an object pronoun. The word i‘rab identifies it as the accusative ism of inna.
- **22:68:3:** The raw prefix tag and word i‘rab call fa resumptive. The imperative answers the explicit condition, so the lesson treats fa as the answer linker.
- **22:68:5:** The word i‘rab gives a generic nominative adjective label. The elative is the predicate of the divine name and governs the following prepositional phrase.
- **22:68:6:** QAC tags ma as relative and the app word type is pronoun. The lesson follows the verse i‘rab in analyzing it as masdariyya. The relative reading would give essentially the same contextual translation.
- **22:69:8:** QAC uses its broad English label “object pronoun” for the suffix. The preposition governs it in the genitive slot, and it resumes relative mā in 22:69:6.
- **22:70:12:** The prepositional phrase supplies the predicate of the first inna. The word note gives the traditional analysis in which it attaches to an understood predicate.
- **22:70:15:** Muyassar emphasizes the ease of encompassing all things in knowledge. Saʿdi explicitly includes both encompassing knowledge and recording it, which the lesson adopts.
- **22:70:18:** The short iʿrab calls yasīr a nominative ṣifa. This is its lexical class here. Syntactically it is the predicate of the second inna, with ʿalā Allāh attached to it as the ayah notes specify.
- **22:71:11:** The raw QAC lemma carries an initial shadda. The reviewed lexeme and the unprefixed Uthmani occurrence give لَيْسَ.
- **22:71:15:** The word-level QAC tags and generated i‘rab call the waw coordinating. The ayah i‘rab treats the final sentence as resumptive and its negative mā as non-governing. The lesson follows the ayah analysis.
- **22:71:18:** The QAC genitive describes the visible ending after supplemental min. The ayah i‘rab identifies the noun as the delayed mubtada, nominative in syntactic position.
- **22:72:3:** QAC calls the suffix an object pronoun in its English display. It is in محل جر after the preposition, as at 22:72:16.
- **22:72:5:** The token morphology and word iʿrāb read GEN and صفة مجرورة. The ayah iʿrāb correctly takes it as حال from the definite nominative آياتنا. Kasra marks the accusative of the sound feminine plural here.
- **22:72:12:** The QAC English display calls the wāw a subject pronoun. The word iʿrāb specifies that it occupies the nominative position of the ism of يكاد.
- **22:72:17:** QAC morphology and word iʿrāb label the noun genitive. It is the direct object of the active يتلون. The kasra marks accusative on the sound feminine plural, while the attached nā is genitive in iḍāfa.
- **22:72:19:** The word iʿrāb calls the fāʾ supplemental, matching QAC SUP. The ayah note analyzes the question as coordinated with an implied preceding address within the reported speech. The lesson gives both levels of analysis.
- **22:72:22:** The QAC 2MP label reflects the plural masculine addressees marked by the address ending. The demonstrative itself points to a singular referent or preceding situation.
- **22:72:28:** The token tags and word iʿrāb call the wāw conjunctive, while the ayah iʿrāb calls the blame clause independent and supplies النار as the omitted specific object of blame. The lesson takes the wāw as resumptive.
- **22:73:1:** QAC labels the vocative stem nominative. أَيُّ is a vocative built on ḍamma in the accusative position, and هَا is the attention particle.
- **22:73:2:** The word iʿrab gives only nominative. The lesson follows the rule library in teaching the noun after أَيُّهَا as badal or explanatory apposition. Another traditional analysis is naʿt. The packet root is a lexical index, with disputed derivation.
- **22:73:5:** The word tags and word iʿrab call the fāʾ resumptive. The ayah iʿrab coordinates the imperative clause with the preceding passive clause, which the lesson follows.
- **22:73:16:** QAC tags the wāw as a conjunction. The ayah iʿrab gives it circumstantial force and coordinates the concessive circumstance with an implicit general circumstance. The answer of law is understood from the preceding clause.
- **22:73:23:** The negative lā does not govern the jussive. The following verb is jussive as the answer of conditional in.
- **22:73:25:** QAC English uses “object pronoun” for the suffix. Here it is in the genitive position after a preposition.
- **22:73:27:** Muyassar, Saʿdi and the contextual reading favored in Ibn Kathir take the seeker as the false deity and the sought as the fly. Ibn Kathir also reports the worshipper and idol interpretation. The shared root note discusses a water-seeking occurrence elsewhere and does not describe this context.
- **22:74:5:** QAC tags qadr as a plain noun. In context it is the verbal noun of the preceding verb and is genitive as the complement of ḥaqq, which the ayah iʿrab identifies as the substitute for the cognate accusative.
- **22:74:9:** The lesson follows QAC word iʿrab and teaches ʿazīz as a nominative adjective of the first predicate. A second predicate is also syntactically possible.
- **22:75:4:** Retained the packet’s m-l-k lexical grouping for malak. The root entry records a proposed derivation from ʾ-l-k.
- **22:75:7:** QAC tags masculine plural. The lesson treats nās as a collective with plural sense and retains the n-w-s lexical indexing.
- **22:75:10:** The word-level iʿrab labels 75:10 and 75:11 nominative adjectives. Their clause functions are first and second predicates of inna, corroborated by the 22:76 note naming yaʿlamu the third predicate.
- **22:76:4:** QAC morphology and the word-level iʿrab say nominative. This is the genitive muḍāf ilayh of bayna, with an implicit kasra on final yāʾ, and is itself muḍāf to the pronoun.
- **22:76:7:** QAC and the word-level iʿrab label the wāw coordinating. The ayah notes call the turjaʿu clause independent (mustaʾnafa), so the lesson treats the wāw as resumptive.
- **22:77:1:** QAC marks ayyuhā nominative and the word-level iʿrab calls it marfūʿ. Ayy is a vocative built on ḍamma in the accusative syntactic position. The following relative is treated as badal per the ayah notes, following the visible ḍamma in its nominative position. A descriptive analysis of the follower is also possible.
- **22:77:10:** QAC English calls the suffix an object pronoun. The word-level iʿrab identifies it as the accusative ism of laʿalla.
- **22:78:4:** The generic word iʿrab gives the case only. The ayah note identifies the noun as a substitute for the cognate accusative.
- **22:78:5:** QAC tags a plain noun. The verified root entry identifies the Form III verbal noun, which is genitive here as the dependent of word 4.
- **22:78:7:** The shared root note includes an occurrence-specific gloss for 7:203 about devising a sign. The 22:78 occurrence has the ordinary selection sense given in the reviewed paradigm.
- **22:78:14:** The word-level GEN describes the surface ending after supplemental min. The ayah iʿrab identifies the underlying position as the first object of jaʿala.
- **22:78:15:** The ayah iʿrab supplies an implied aʿnī. Saʿdi also paraphrases this as an exhortation to adhere to the creed, consistent with the alternative analysis that supplies ilzamū.
- **22:78:18:** QAC parses the naming clause as a circumstantial clause from Ibrahim, allowing Ibrahim as the antecedent. Muyassar, Saʿdi, and the supplied translations take Allah as the antecedent. The lesson follows their reading and treats the clause as resumptive. The packet supplies only a pointer to the grouped Ibn Kathir commentary.
- **22:78:20:** QAC tags the stem PN and the word iʿrab calls it a proper name. Its morphology is a Form IV active participle in the sound masculine plural, used here as a community designation and the second object of naming.
- **22:78:22:** The generic genitive tag reflects the position. The detailed ayah note specifies that the word is built on damma after severance from an understood genitive complement.
- **22:78:27:** The word-level line labels the word an accusative adjective. The adjectival form functions here as the predicate of yakūna.
- **22:78:40:** The word-level GEN tag and generic iʿrab misassign case to the head, which is the nominative predicate with implied damma on the alif. The attached pronoun is in a genitive position.
- **22:78:42:** The word-level GEN tag and generic iʿrab conflict with the ayah note. This is the subject of the praise verb and is nominative with implied damma on the alif.

## Per-ayah sources

- **22:1:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=1); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=1); [Quran.com](https://quran.com/22/1).
- **22:2:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=2); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=2); [Quran.com](https://quran.com/22/2).
- **22:3:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=3); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=3); [Quran.com](https://quran.com/22/3).
- **22:4:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=4); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=4); [Quran.com](https://quran.com/22/4).
- **22:5:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=5); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=5); [Quran.com](https://quran.com/22/5).
- **22:6:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=6); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=6); [Quran.com](https://quran.com/22/6).
- **22:7:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=7); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=7); [Quran.com](https://quran.com/22/7).
- **22:8:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=8); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=8); [Quran.com](https://quran.com/22/8).
- **22:9:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=9); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=9); [Quran.com](https://quran.com/22/9).
- **22:10:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=10); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=10); [Quran.com](https://quran.com/22/10).
- **22:11:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=11); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=11); [Quran.com](https://quran.com/22/11).
- **22:12:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=12); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=12); [Quran.com](https://quran.com/22/12).
- **22:13:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=13); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=13); [Quran.com](https://quran.com/22/13).
- **22:14:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=14); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=14); [Quran.com](https://quran.com/22/14).
- **22:15:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=15); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=15); [Quran.com](https://quran.com/22/15).
- **22:16:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=16); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=16); [Quran.com](https://quran.com/22/16).
- **22:17:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=17); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=17); [Quran.com](https://quran.com/22/17).
- **22:18:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=18); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=18); [Quran.com](https://quran.com/22/18).
- **22:19:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=19); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=19); [Quran.com](https://quran.com/22/19).
- **22:20:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=20); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=20); [Quran.com](https://quran.com/22/20).
- **22:21:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=21); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=21); [Quran.com](https://quran.com/22/21).
- **22:22:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=22); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=22); [Quran.com](https://quran.com/22/22).
- **22:23:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=23); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=23); [Quran.com](https://quran.com/22/23).
- **22:24:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=24); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=24); [Quran.com](https://quran.com/22/24).
- **22:25:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=25); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=25); [Quran.com](https://quran.com/22/25).
- **22:26:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=26); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=26); [Quran.com](https://quran.com/22/26).
- **22:27:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=27); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=27); [Quran.com](https://quran.com/22/27).
- **22:28:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=28); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=28); [Quran.com](https://quran.com/22/28).
- **22:29:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=29); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=29); [Quran.com](https://quran.com/22/29).
- **22:30:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=30); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=30); [Quran.com](https://quran.com/22/30).
- **22:31:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=31); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=31); [Quran.com](https://quran.com/22/31).
- **22:32:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=32); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=32); [Quran.com](https://quran.com/22/32).
- **22:33:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=33); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=33); [Quran.com](https://quran.com/22/33).
- **22:34:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=34); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=34); [Quran.com](https://quran.com/22/34).
- **22:35:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=35); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=35); [Quran.com](https://quran.com/22/35).
- **22:36:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=36); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=36); [Quran.com](https://quran.com/22/36).
- **22:37:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=37); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=37); [Quran.com](https://quran.com/22/37).
- **22:38:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=38); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=38); [Quran.com](https://quran.com/22/38).
- **22:39:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=39); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=39); [Quran.com](https://quran.com/22/39).
- **22:40:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=40); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=40); [Quran.com](https://quran.com/22/40).
- **22:41:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=41); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=41); [Quran.com](https://quran.com/22/41).
- **22:42:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=42); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=42); [Quran.com](https://quran.com/22/42).
- **22:43:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=43); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=43); [Quran.com](https://quran.com/22/43).
- **22:44:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=44); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=44); [Quran.com](https://quran.com/22/44).
- **22:45:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=45); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=45); [Quran.com](https://quran.com/22/45).
- **22:46:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=46); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=46); [Quran.com](https://quran.com/22/46).
- **22:47:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=47); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=47); [Quran.com](https://quran.com/22/47).
- **22:48:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=48); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=48); [Quran.com](https://quran.com/22/48).
- **22:49:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=49); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=49); [Quran.com](https://quran.com/22/49).
- **22:50:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=50); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=50); [Quran.com](https://quran.com/22/50).
- **22:51:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=51); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=51); [Quran.com](https://quran.com/22/51).
- **22:52:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=52); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=52); [Quran.com](https://quran.com/22/52).
- **22:53:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=53); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=53); [Quran.com](https://quran.com/22/53).
- **22:54:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=54); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=54); [Quran.com](https://quran.com/22/54).
- **22:55:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=55); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=55); [Quran.com](https://quran.com/22/55).
- **22:56:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=56); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=56); [Quran.com](https://quran.com/22/56).
- **22:57:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=57); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=57); [Quran.com](https://quran.com/22/57).
- **22:58:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=58); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=58); [Quran.com](https://quran.com/22/58).
- **22:59:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=59); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=59); [Quran.com](https://quran.com/22/59).
- **22:60:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=60); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=60); [Quran.com](https://quran.com/22/60).
- **22:61:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=61); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=61); [Quran.com](https://quran.com/22/61).
- **22:62:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=62); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=62); [Quran.com](https://quran.com/22/62).
- **22:63:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=63); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=63); [Quran.com](https://quran.com/22/63).
- **22:64:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=64); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=64); [Quran.com](https://quran.com/22/64).
- **22:65:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=65); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=65); [Quran.com](https://quran.com/22/65).
- **22:66:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=66); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=66); [Quran.com](https://quran.com/22/66).
- **22:67:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=67); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=67); [Quran.com](https://quran.com/22/67).
- **22:68:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=68); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=68); [Quran.com](https://quran.com/22/68).
- **22:69:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=69); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=69); [Quran.com](https://quran.com/22/69).
- **22:70:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=70); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=70); [Quran.com](https://quran.com/22/70).
- **22:71:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=71); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=71); [Quran.com](https://quran.com/22/71).
- **22:72:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=72); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=72); [Quran.com](https://quran.com/22/72).
- **22:73:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=73); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=73); [Quran.com](https://quran.com/22/73).
- **22:74:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=74); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=74); [Quran.com](https://quran.com/22/74).
- **22:75:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=75); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=75); [Quran.com](https://quran.com/22/75).
- **22:76:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=76); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=76); [Quran.com](https://quran.com/22/76).
- **22:77:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=77); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=77); [Quran.com](https://quran.com/22/77).
- **22:78:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=22&verse=78); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=22&verse=78); [Quran.com](https://quran.com/22/78).

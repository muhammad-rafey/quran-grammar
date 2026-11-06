# Surah 23 — Al-Mu'minun: source audit

Researched 2026-11-06. This lesson contains **118 ayahs and 1,050 word occurrences**. All Urdu word glosses, translations, grammatical explanations, dictionary summaries, verb-paradigm notes and concise tafsir notes are original AI-assisted editorial drafts. They are **not scholar-reviewed** and are not attributed to a named Urdu translator. No third-party Urdu book, dictionary, translation or tafsir was imported.

## Arabic inventory

`inventory-23.json` records the Quran.com Content API v4 `text_uthmani` word strings ([source](https://api.quran.com/api/v4/verses/by_chapter/23?words=true&word_fields=text_uthmani&per_page=50)), retrieved 2026-11-06, excluding end-of-ayah markers. Recitation signs that the API separates from a word by a space — waqf signs, the saktah sign, the sajdah sign and the rub al-hizb marker — are not part of the stored word token, following the Surahs 110–114 precedent. The inventory lists all 37 such exclusions with the original API text; no other character was changed. The unnumbered opening basmalah is not inserted as a numbered occurrence. Automated tests compare every stored word, its id and its segments with this inventory.

Word boundaries and counts match the Quranic Arabic Corpus morphology for every ayah. Per-ayah word counts: 3, 5, 5, 4, 4, 10, 7, 5, 5, 3, 6, 7, 6, 21, 5, 5, 10, 13, 13, 9, 15, 4, 16, 26, 10, 5, 32, 15, 8, 7, 6, 14, 25, 7, 9, 4, 10, 12, 5, 5, 8, 6, 7, 19, 8, 7, 7, 4, 6, 11, 11, 8, 9, 5, 7, 7, 7, 5, 5, 10, 7, 12, 14, 8, 7, 9, 4, 10, 7, 10, 16, 9, 5, 8, 11, 8, 12, 10, 7, 10, 6, 8, 12, 8, 5, 8, 5, 14, 5, 5, 24, 6, 6, 6, 7, 9, 7, 5, 8, 16, 10, 6, 10, 6, 8, 8, 7, 5, 14, 8, 8, 7, 8, 9, 8, 11, 18, 7.

## Sources and method

- **Morphology:** Quranic Arabic Corpus morphology 0.4 (Kais Dukes, GNU GPL with the Corpus terms of use), a verbatim distribution checked by SHA-256 `910b721a8f04f4334ac5d4c62b19e858f5d720c525bb975f2e750ea2c6bb532d`. It was consulted locally for segmentation, part of speech, root, lemma, verb form, voice, mood and case; it is not bundled or redistributed.
- **Word types and roots** are derived deterministically from the Corpus stem tags with the mapping that reproduces root assignments for all 230 word occurrences of the existing lessons, including words with no root. A preposition with an attached pronoun (لَهُ، بِهِ، عَلَيْهِمْ) is a particle, following Surahs 1, 105 and 112. Words without a Corpus root, such as proper names, keep no root.
- **Syntax:** the Corpus word-by-word pages (English morphology and Arabic i‘rab for every word) and verse grammar pages (Arabic i‘rab notes adapted from the Quran Printing Complex), retrieved 2026-11-06. 2 of 118 verse pages carry no grammar note: 1, 48.
- **Verb paradigms** (باب، ماضی، مضارع، وزن) for all 253 verb occurrences come from a shared library of 358 verb lexemes for the five new lessons. Form I vowel classes were decided from imperfects attested across the whole Corpus and standard lexica (Lane, Lisan al-Arab, al-Mu‘jam al-Wasit), and every entry was independently reviewed.
- **Tafsir consulted** through the Quran.com API: Tafsir al-Muyassar (Arabic), Tafsir al-Sa‘di (Arabic) and Ibn Kathir (abridged, English). Translations consulted for meaning only: Saheeh International and Mufti Taqi Usmani. The Urdu wording is original and concise; it is not a translation of these works.

Word-type, verb-form and passive-voice counts below apply the adjudicated occurrence overrides; they are not uncorrected Corpus tag counts.

| Measure | Count |
| --- | ---: |
| Nouns | 393 |
| Adjectives | 24 |
| Verbs | 253 |
| Particles | 277 |
| Pronouns | 103 |
| Passive verb occurrences | 15 |
| Distinct roots | 271 |
| Verb form I | 174 |
| Verb form II | 9 |
| Verb form III | 4 |
| Verb form IV | 42 |
| Verb form V | 6 |
| Verb form VI | 4 |
| Verb form VIII | 11 |
| Verb form X | 3 |

## Editorial checks

The supplied final result snapshot marks all 33 chunks of whole ayahs AI-reviewed with successful structural validation and a clean last confirmation. The workflow requires independent grammar and meaning/tafsir reviews, a fixer that applies or rejects each finding with a reason, and fresh whole-chunk confirmation after corrections. Every finding, including a minor finding, must be resolved or rejected before a clean final confirmation; an unconfirmed last edit does not count as completion.
In this supplied snapshot, the two independent reviews report 10 finding entries (0 critical, 4 major). The recorded first fix rounds report 10 applications and 0 rejections; confirmation rounds contain 0 finding entries, with every last confirmation clean. These are snapshot counts, not cumulative historical totals: reused authored drafts may already contain corrections from earlier passes, repeated findings may occur in more than one round, and intermediate fixer totals are not reconstructed.
The chunk validator checks the exact Arabic word, segments that rejoin to the exact word, ids and order, rule references, verb-note presence, phrase coverage of every word, and the absence of URLs or Latin text. AI review and automated checks are not scholarly review.

Nouns without a Corpus root (root left empty): أَءِذَا، إِذَا، إِذَآ، بَرْزَخٌ، جَهَنَّمَ، ذَا، ذَاتِ، سَيْنَآءَ، فَإِذَا، فِرْعَوْنَ، كَمْ، لَدَيْهِمْ، مَرْيَمَ، مَعَ، مَعَهُۥ، مُوسَى، مُوسَىٰ، مَّعَكَ، نُوحًا، هَـٰرُونَ، هَيْهَاتَ، وَلَدَيْنَا، يَـٰٓأَيُّهَا، يَوْمَئِذٍۢ، ٱلتَّنُّورُ، ٱلْفِرْدَوْسَ.

## Corrections to Corpus tags

These occurrences carry an adjudicated correction or a documented source/analysis disagreement. The lessons follow the recorded contextual analysis; the raw Corpus data itself is unchanged.

- **23:23:7** يَـٰقَوْمِ: QAC tags this word NOM, contradicting the vocalised form and its role. يَـٰقَوْمِ: an annexed vocative (منادیٰ مضاف) is accusative; the visible kasra signals the first-person ya, so the nasb is implied.
- **23:26:2** رَبِّ: QAC tags this word NOM, contradicting the vocalised form and its role. رَبِّ (يا محذوفة): an annexed vocative (منادیٰ مضاف) is accusative; the visible kasra signals the first-person ya, so the nasb is implied.
- **23:26:4** بِمَا: QAC tags the stem of بِمَا REL, deriving pronoun, but the primary 23:26 verse i‘rab explicitly calls ما مصدرية and bi causal, with the interpreted masdar attached to انصرني. Follow that selected contextual analysis. The effective app word type is particle; preserve raw QAC tags and exact Arabic.
- **23:27:17** زَوْجَيْنِ: QAC tags this word NOM, contradicting the vocalised form and its role. زَوْجَيْنِ is the object of فَٱسْلُكْ (مِن كُلٍّ with tanwin in Hafs); the dual ya ending marks the accusative.
- **23:27:18** ٱثْنَيْنِ: QAC tags this word NOM, contradicting the vocalised form and its role. ٱثْنَيْنِ is the adjective of accusative زَوْجَيْنِ; accusative with the dual ya ending.
- **23:27:27** تُخَـٰطِبْنِى: QAC tags تُخَاطِبْنِى 3rd person feminine singular; it follows prohibitive لَا and addresses Nuh: 2nd person masculine singular jussive.
- **23:35:4** مِتُّمْ: QAC tags مِتُّمْ passive. Hafs' kasra form is the active dialectal perfect of مَاتَ (as in خِفْتُ from خَافَ), intransitive with no personal passive; translations render it active ('you die').
- **23:37:7** وَنَحْيَا: QAC tags نَحْيَا subjunctive, but no particle of nasb precedes it (نَمُوتُ وَنَحْيَا); it is indicative with an implied damma.
- **23:39:2** رَبِّ: QAC tags this word NOM, contradicting the vocalised form and its role. رَبِّ (يا محذوفة): an annexed vocative (منادیٰ مضاف) is accusative; the visible kasra signals the first-person ya, so the nasb is implied.
- **23:39:4** بِمَا: QAC tags the stem of بِمَا REL, deriving pronoun, but the primary 23:39 verse i‘rab explicitly calls ما مصدرية, with كذبون its clause and the interpreted masdar attached to انصرني. Follow that selected contextual analysis. The effective app word type is particle; preserve raw QAC tags and exact Arabic.
- **23:45:4** وَأَخَاهُ: QAC tags this word NOM, contradicting the vocalised form and its role. وَأَخَاهُ is coordinated with the object مُوسَىٰ of أَرْسَلْنَا: accusative, marked by alif as one of the five nouns.
- **23:50:9** ذَاتِ: QAC tags this word NOM, contradicting the vocalised form and its role. ذَاتِ is the adjective of genitive رَبْوَةٍ: genitive with kasra.
- **23:62:12** يُظْلَمُونَ: QAC tags يُظْلَمُونَ jussive; the retained nun after negative لا shows it is indicative (passive).
- **23:64:4** مُتْرَفِيهِم: QAC tags this word NOM, contradicting the vocalised form and its role. مُتْرَفِيهِم is the object of أَخَذْنَا: accusative, marked by the sound-plural ya (nun dropped before the pronoun).
- **23:78:9** مَّا: QAC tags مَّا REL, deriving pronoun, but the primary 23:78 verse i‘rab explicitly calls ما زائدة after قليلا functioning as نائب مفعول مطلق. Follow the extra-particle analysis, with no case position or relative clause. The effective app word type is particle; preserve raw QAC tags and exact Arabic.
- **23:82:3** مِتْنَا: QAC tags مِتْنَا passive; as in 23:35, Hafs' kasra form is the active dialectal perfect of مَاتَ.
- **23:91:17** وَلَعَلَا: QAC's lemma taEa`laY` merges two verbs. وَلَعَلَا here is Form I عَلَا يَعْلُو (would have overpowered), not Form VI تَعَالَى; it gets its own paradigm card.
- **23:92:4** فَتَعَـٰلَىٰ: QAC gives فَتَعَـٰلَىٰ no form tag (Form I); it is Form VI تَعَالَى (tafāʿala, defective), as the mustafa0x fork tags it.
- **23:93:2** رَّبِّ: QAC tags this word NOM, contradicting the vocalised form and its role. رَّبِّ (يا محذوفة): an annexed vocative (منادیٰ مضاف) is accusative; the visible kasra signals the first-person ya, so the nasb is implied.
- **23:94:1** رَبِّ: QAC tags this word NOM, contradicting the vocalised form and its role. رَبِّ (يا محذوفة): an annexed vocative (منادیٰ مضاف) is accusative; the visible kasra signals the first-person ya, so the nasb is implied.
- **23:97:2** رَّبِّ: QAC tags this word NOM, contradicting the vocalised form and its role. رَّبِّ (يا محذوفة): an annexed vocative (منادیٰ مضاف) is accusative; the visible kasra signals the first-person ya, so the nasb is implied.
- **23:98:3** رَبِّ: QAC tags this word NOM, contradicting the vocalised form and its role. رَبِّ (يا محذوفة): an annexed vocative (منادیٰ مضاف) is accusative; the visible kasra signals the first-person ya, so the nasb is implied.
- **23:99:7** رَبِّ: QAC tags this word NOM, contradicting the vocalised form and its role. رَبِّ (يا محذوفة): an annexed vocative (منادیٰ مضاف) is accusative; the visible kasra signals the first-person ya, so the nasb is implied.
- **23:110:5** ذِكْرِى: QAC tags this word NOM, contradicting the vocalised form and its role. ذِكْرِى is the second object of أَنسَوْكُمْ: accusative (sign implied before the first-person ya).
- **23:116:1** فَتَعَـٰلَى: QAC gives فَتَعَـٰلَى no form tag (Form I); it is Form VI تَعَالَى (tafāʿala, defective), as the mustafa0x fork tags it.
- **23:118:2** رَّبِّ: QAC tags this word NOM, contradicting the vocalised form and its role. رَّبِّ (يا محذوفة): an annexed vocative (منادیٰ مضاف) is accusative; the visible kasra signals the first-person ya, so the nasb is implied.

## Analysis decisions and cautions

Notes recorded by the authors and reviewers for scholarly review; they mark alternative analyses, source disagreements and editorial choices.

- **23:4:3:** Followed the ayah-level i‘rab over the generic word-level jar-wa-majrur label: the lam is strengthening/extra, and zakah is the participle’s fronted direct object, genitive in form and accusative in position.
- **23:5:3:** As in 23:4:3, the ayah-level i‘rab specifies a strengthening lam and a fronted direct object; the occurrence retains its visible genitive kasra.
- **23:6:1:** Followed the supplied i‘rab in calling illa restrictive. Guarding implies refraining from sexual relations, with wives and bondwomen as the only permitted relations; no overt excluded-from group is stated. An exception analysis with an implied general set is also possible.
- **23:6:6:** Used the reviewed citation lemma malaka rather than the raw QAC inflected lemma malakat. The feminine ta is a marker, not a subject pronoun; aymanuhum is the explicit subject and the relative-clause object resumptive is omitted.
- **23:3:5:** The raw QAC lemma is plural; the authored lemma gives the regular singular active participle, consistent with the supplied root entry.
- **23:4:** Tafsir includes the supplied alternative/additional interpretation of zakah as purification of the soul alongside payment of wealth zakah.
- **23:7:1:** The ayah grammar note explicitly treats man as conditional and fa as coordinating; followed it over the word-level REL and resumptive-fa labels. The conditional verb is perfect in a jussive position, not an inflected jussive imperfect.
- **23:7:5:** Followed the ayah grammar note: fa links the conditional answer, despite the word-level resumptive label. Hum is a separating pronoun with no syntactic position.
- **23:7:3:** Kept the packet root grouping w-r-y. The shared root entry also records the lexicographical alternative w-r-hamza; no etymological certainty is implied.
- **23:8:3:** Followed the ayah-level strengthening-lam analysis: the trust noun is genitive in wording and accusative in position as the fronted object of the active participle. The coordinated covenant shares that construction.
- **23:11:3:** The tafsir preserves both the highest and best part of Paradise and, in some exegetes’ reading, Paradise as a whole. The feminine pronoun in 23:11:5 refers to Firdaus understood as jannah. No root was assigned to the proper name.
- **23:12:1:** Followed the ayah-level note calling wa resumptive, rather than the word-level coordinating tag. The lam in laqad is explained as emphatic and conventionally as introducing the answer to an implied oath.
- **23:13:3:** Treated nutfatan as the second object of jaala in the sense of making, consistent with the translations and reviewed root note. A hal analysis is possible if jaala means placing; the supplied word irab only says accusative noun.
- **23:14:5:** For the fa prefixes at 23:14:5, 8 and 11, followed the supplied QAC segmentation and word irab (resumption). Coordination is another familiar analysis of this sequence.
- **23:14:10:** QAC lemma azeem for the bones nouns at 23:14:10 and 12 conflicts with their meaning and reviewed root entry. Used singular azm (bone) as lemma; retained the fixed noun type and root.
- **23:14:16:** Followed the ayah grammar note: khalqan is a hal from the object pronoun in anshanahu. Did not adopt the common cognate-accusative analysis with anshaa understood as khalaqa.
- **23:14:20:** Followed the supplied ayah grammar note in treating ahsanu as a definite adjective of Allah through pure idafa, rather than the alternative badal analysis.
- **23:17:5:** The word-level QAC morphology and generated irab label طرائق accusative, but the ayah grammar note explicitly makes it mudaf ilayh after سبع. Followed the ayah note: genitive with fatha because this plural on the pattern فَعَائِل is diptote.
- **23:17:5:** QAC labels the plural masculine. Its supplied lemma طريقة is feminine, which explains the ta-less numeral سبع; the lesson teaches this singular-based numeral agreement and does not repeat the masculine plural label.
- **23:17:7:** Kept كنا as one learner segment because the radical nun and the initial nun of subject suffix نا merge under one written shadda; the morphology and verb note explain both components.
- **23:18:6:** Kept the verb and subject suffix together in one learner segment after fa because the radical nun and the nun of نا share a written shadda. The separate object pronoun is segmented; this shadda is neither Form II nor an emphatic nun.
- **23:18:9:** Kept إِنَّا together after the conjunction in learner segmentation. It contracts إِنَّ + نَا by deleting one of the three successive nuns for lightening, not by assimilating the pronoun’s nun. The attached pronoun نا is identified in the lemma, morphology and syntax.
- **23:18:12:** Followed the ayah grammar note: به attaches to an understood adjective of ذهاب. The lexical explanation gives the idiomatic meaning of ذهاب with ب without replacing this supplied syntactic attachment.
- **23:19:6:** QAC labels nakhil masculine plural; the lesson describes its collective tree sense without tagging it as a broken plural. The singular dictionary headword is nakhlah.
- **23:19:12:** The feminine singular pronoun is taken as referring to the gardens, with eating understood as eating their produce; a reference to the fruits is also possible.
- **23:20:6:** Following the packet grammar, tanbutu is a circumstantial clause describing the subject of takhruju. It is Form I nabata/yanbutu in the reviewed paradigm, with bi expressing accompaniment, not a Form IV transitive verb.
- **23:21:1:** The word-level line calls waw coordinating, but the ayah grammar explicitly calls the opening sentence resumed. The lesson follows the ayah-level analysis and labels this waw resumptive.
- **23:21:3:** Following the supplied ayah grammar, fi al-anam attaches to a fronted implied hal of ibrah, not directly to the predicate.
- **23:21:6:** The reviewed Form IV paradigm takes two objects. Kum is the first object; the drink (milk) is understood as the omitted second object, while mimma attaches to the verb as specified by the supplied grammar.
- **23:21:11:** Following the supplied ayah grammar, fiha attaches to an implied fronted hal of manafi, rather than treating it as a second predicate.
- **23:23:7:** Followed the supplied qacCorrection: the annexed vocative is accusative with an implied fatha, not nominative as the raw QAC tag and generated irab state. The final kasra reflects the elided first-person ya.
- **23:23:14:** Followed the ayah grammar note: ghayruhu is a nominative adjective agreeing with the syntactic position of ilah, which is a delayed subject, genitive only in surface form after extra min. The annexation does not make ghayr definite here.
- **23:23:15:** Followed the supplied word irab and SUP tag in treating fa as extra. A coordinating analysis is also known; the question remains rhetorical and la is negative, not prohibitive.
- **23:24:11:** Following the supplied root note, mithl remains indefinite despite pronominal idafa and is the first adjective of bashar; the yuridu clause is the second adjective as stated in the ayah grammar note.
- **23:24:24:** The supplied word irab identifies fi only as a preposition and does not specify the attachment of fi abaʾina. The lesson describes its scope as the ancestral background of the hearing-denial without asserting a unique omitted governor.
- **23:25:** Muyassar is supplied under 23:24 and covers both verses. Saʿdi at 23:25 explains the proposed wait as waiting for death; Muyassar also mentions recovery and abandoning the call. The lesson retains the broader wording of waiting for his outcome. Ibn Kathir contains only a grouped-commentary pointer, so no additional details were inferred.
- **23-c07:** The user-referenced [local instruction/runtime path omitted] was unavailable at the supplied path. The complete local authoring guide and the named packet and rule library were used.
- **23:26:2:** Followed the supplied correction: annexed vocative with implied accusative before the elided first-person ya, not QAC NOM or the generated nominative irab.
- **23:26:4:** QAC tags the stem of بِمَا REL, deriving pronoun, but the primary 23:26 verse i‘rab explicitly calls ما مصدرية and bi causal, with the interpreted masdar attached to انصرني. Follow that selected contextual analysis. The effective app word type is particle; preserve raw QAC tags and exact Arabic.
- **23:27:8:** The word-level fa tag is REM, whereas the ayah grammar coordinates the whole conditional with the preceding imperative. The lesson retains that clause-level coordination without treating idha as sudden-event idha.
- **23:27:13:** Followed the ayah grammar: fa links the answer of idha, overriding the word-level REM/resumptive description.
- **23:27:17:** Followed the supplied correction and ayah grammar: accusative direct object, with dual ya; raw NOM and generated nominative irab are incorrect.
- **23:27:18:** Followed the supplied correction: accusative adjective of the preceding dual, marked by ya, not the raw NOM tag.
- **23:27:20:** The ayah grammar calls this exception and explicitly identifies the following relative as the excepted term. This takes precedence over raw RES and generated restriction wording; the stated excluded-from group is the family.
- **23:27:25:** Retained the ayah grammar attachment to an implied hal of the pronoun in alayhi. Its reference to a ya in alayhi appears to be a slip: the resumptive pronoun is ha.
- **23:27:26:** The raw NEG and generated negation description are overridden by context and the supplied correction on the following verb: la is prohibitive and governs a jussive addressed to Nuh.
- **23:27:27:** Followed the supplied correction: active second-person masculine singular jussive addressed to Nuh, not raw third-person feminine singular. The exact Quran.com tatweel and superscript alif are preserved in segmentation.
- **23:28:8:** The word-level i‘rab calls fa resumptive, but the surrounding idha construction requires it to link the imperative conditional answer; the lesson uses that contextual analysis.
- **23:29:4:** QAC tags munzalan as a form IV passive participle. With the packet gloss and ayah i‘rab (second object), the lesson explains its place-noun use on that pattern. A mim-verbal-noun/cognate-object analysis is an alternative, not the adopted syntax.
- **23:29:6:** The word-level entry labels waw conjunctive; the higher-priority ayah grammar note explicitly makes the clause circumstantial to the subject of anzilni, followed here.
- **23:30:4:** QAC morphology and the generated word irab label ayatin genitive. It is the delayed accusative ism of inna, with kasra replacing fatha in the sound feminine plural; no genitive governor is present. The fixed noun POS and root are retained.
- **23:31:** The supplied tafsirs differ on the nation: Muyassar identifies Ad, Sadi favours Thamud, and Ibn Kathir records both. The lesson preserves both views without choosing a prophet's name.
- **23:31:6:** The plural adjective follows the collective sense of singular qarn, referring to the people of the generation, as required by the supplied adjective analysis.
- **23:32:11:** The word-level GEN tag records surface case after extra min. The ayah grammar identifies the noun as a delayed subject, locally nominative; ghayruhu follows that local nominative as an adjective.
- **23:32:13:** The lesson follows the supplied word irab and SUP tag in treating fa as supplemental. An alternative grammatical analysis treats it as a conjunction linking the question to the preceding assertion.
- **23:32:14:** The occurrence has no explicit mood field; retained nun and non-governing negative la establish indicative mood. The supplied ayah irab treats the clause as resumptive.
- **23:33:25:** The ayah syntax note identifies an omitted resumptive prepositional phrase after the final relative ma. The earlier relative construction has an explicit minhu at 23:33:22.
- **23:34:1:** The ayah-level syntax note calls the opening clause resumed, while the word-level line calls waw a conjunction. The lesson follows the ayah-level resumption analysis. The lam introduces an implied oath, whose stated answer makes the conditional answer dispensable.
- **23:34:6:** The word-level QAC tag SUR and its generated irab call this a surprise particle. The vocalised idhan with tanwin, the ayah-level syntax note (harf jawab), and the answer-particle rule establish a particle of response and consequence here.
- **23:35:4:** Followed qacCorrection and reviewed lexeme: مِتُّمْ is active perfect, with the tāʾ as subject, not passive with a deputy subject. The kasra is the attested Hafs active dialectal form.
- **23:35:7:** QAC lemma عَظِيم is inappropriate for bones here. Used singular عَظْم, consistent with the packet root entry and gloss.
- **23:35:** Followed the ayah syntax note: إِذَا is a pure time adverb attached to مُّخْرَجُونَ; the repeated أَنَّكُم resumes the first particle and its ism, and the final participle is the first particle’s predicate.
- **23:36:1:** QAC morphology calls هَيْهَاتَ an accusative noun. Followed the ayah syntax note: an ism fiʿl madi built on fath without a case position. The second token repeats it for emphasis.
- **23:36:3:** Followed the ayah syntax note: lam is extra and ma is masdariyya; ma plus تُوعَدُونَ forms the subject of هَيْهَاتَ. QAC segments and the fixed app pos instead classify ma as relative. The pos label flags both classifications; main syntax follows the masdariyya reading.
- **23:37:7:** Followed qacCorrection and the reviewed lexeme: وَنَحْيَا is indicative with an implied damma, not subjunctive as in raw QAC and its generated word-level irab; no governing nasb particle occurs.
- **23:38:8:** The word-level irab gives only accusative noun. Treated كَذِبًۭا as the direct object of the preceding verb, consistent with the reviewed transitive lexeme (to fabricate a lie).
- **23:39:2:** Followed the supplied qacCorrection: the annexed vocative has implied accusative case before an elided first-person ya, not the raw QAC nominative.
- **23:39:4:** QAC tags the stem of بِمَا REL, deriving pronoun, but the primary 23:39 verse i‘rab explicitly calls ما مصدرية, with كذبون its clause and the interpreted masdar attached to انصرني. Follow that selected contextual analysis. The effective app word type is particle; preserve raw QAC tags and exact Arabic.
- **23:40:2:** Followed the ayah grammar note: ma is extra after an, not a relative pronoun as in the word-level tagging.
- **23:40:4:** Followed the detailed ayah analysis: indicative plural imperfect of an incomplete verb, with the indicative nun omitted to avoid successive identical consonants and the plural waw unexpressed before emphatic nun. It is not a singular imperfect built on fatha.
- **23:41:6:** The ayah grammar note calls fa conjunctive, whereas the segment tag and generated word irab call it resumptive. Followed the ayah note, including the implied verb governing the cognate accusative and the implied saying.
- **23:41:7:** Followed the ayah note attaching the prepositional phrase to an implied verb meaning I mean, rather than attaching it directly to the cognate accusative.
- **23:43:4:** The genitive tag describes the surface case after extra min; the ayah note identifies ummat as the subject, so both surface genitive and syntactic nominative position are explained.
- **23:43:7:** The masculine plural subject follows the sense of ummat as a community of people; the preceding feminine singular verb follows its grammatical form.
- **23:45:3:** Raw QAC and generated i‘rab mark Musa nominative, but it is the object of arsalna: accusative with an implied fatha on the final alif. The attached na is the subject; Harun is accusative as badal of the coordinated brother.
- **23:45:4:** Followed the supplied qacCorrection: wa-akhahu is accusative, coordinated with Musa as object of arsalna; alif marks nasb for one of the five nouns. Raw QAC NOM and generated nominative i‘rab are incorrect.
- **23:44:17:** Followed the ayah i‘rab attaching li-qawmin to an implied a‘ni, rather than directly to bu‘dan. At 23:44:16 the source analyses bu‘dan as a cognate object of an omitted imperative within an omitted saying.
- **23:46:4:** The word-level i‘rab and REM segment call fa resumptive, while the ayah grammar note explicitly coordinates fastakbaru with arsalna. Followed the more specific clause analysis and used conjunction.
- **23:46:7:** The supplied root entry ع ل و supports the contextual meaning and weak-letter explanation. Used the singular citation form عَالٍ rather than the inflected plural lemma in raw QAC.
- **23:49:3:** QAC and the generated word i‘rab label Musa nominative. With active atayna and its attached subject na, Musa is the first direct object: accusative with an implied fatha on the final alif.
- **23:50:3:** QAC and the generated word i‘rab label Maryam accusative. Here Maryam is mudaf ilayh of ibn, genitive with fatha instead of kasra because the proper name is diptote.
- **23:50:9:** Followed the supplied qacCorrection: dhati is the adjective of genitive rabwatin, genitive with kasra, despite the raw NOM tag and generated nominative i‘rab. Dhat is an ordinary feminine noun, not one of the five nouns.
- **23:51:1:** The raw NOM tag and generated nominative i‘rab for ayyuha describe the visible damma incompletely. Ayy is a vocative built on damma in an accusative position; ha is a particle of attention.
- **23:51:9:** The ayah grammar note explicitly analyses ma as masdariyya, whereas word segmentation tags it REL and the fixed derived pos is pronoun. Followed the primary syntactic note: bi plus ma and ta‘maluna form a genitive interpreted masdar attached to ‘alim. Relative ma with an omitted resumptive object is an alternative.
- **23:50:11:** Kept the supplied root ‘ayn-ya-nun for ma‘in. The root library also records derivation from mim-‘ayn-nun as a lexical alternative; no exclusive derivational pattern is asserted.
- **23:52:4:** Read ummatan as a circumstantial accusative from ummatukum, with wahidatan its adjective; the packet word-level irab only labels both accusative.
- **23:52:8:** Follow the ayah grammar note, which coordinates the imperative clause; the word-level irab and prefix tag instead call the fa resumptive. The written nun is protective; the first-person object ya is elided.
- **23:53:2:** Treat amrahum as the direct object, using the transitive sense allowed by the reviewed lexeme. An alternative analysis supplies a preposition, accusative by its omission.
- **23:53:4:** Follow the ayah irab: zuburan is a hal from the subject, meaning separate factions. Retain packet lemma zubur because the root entry distinguishes zubur here from zubar, plural of zubrah, without establishing a contextual singular.
- **23:53:8:** Laday is taught as an adverb with an estimated accusative on its alif, converted to ya before the pronominal suffix; the packet gives no case tag.
- **23:54:1:** The lemma is the reviewed theoretical citation wadhara, whose perfect is disused. The library follows fataha; its evidence also records a reconstructed wadhira / samia alternative. Occurrence analysis is unaffected.
- **23:55:** The interrogative sentence continues into 23:56. For a self-contained Urdu rendering, the following predicate is supplied parenthetically in 23:55 and translated in its own ayah as well.
- **23:55:2:** Follow QAC syntax: anna governs relative ma as its ism; this is not anna with preventive ma and not a restriction construction.
- **23:55:7:** Use singular ibn for banin, following the reviewed root note and actual context. The raw QAC lemma bunayy is a diminutive and is unsuitable as this occurrence dictionary lemma.
- **23:56:1:** Follow the ayah grammar note: the predicate of anna has an elided resumptive bihi referring to relative ma in 23:55.
- **23:57:** Verses 57–60 form the coordinated ism construction of inna; following the ayah grammar note, the nominal sentence beginning at 23:61:1 is its delayed khabar. Urdu translations preserve the continuing sentence across ayah boundaries.
- **23:60:5:** QAC marks qulub feminine plural. The lesson treats it as the broken plural of masculine qalb with non-human plural feminine-singular agreement, rather than teaching that its singular is feminine.
- **23:60:6:** The generated word-level irab says nominative adjective. Syntactically wajilatun is the khabar of qulubuhum, not an attributive adjective; the definite subject and indefinite predicate form the circumstantial nominal clause specified in the ayah note.
- **23:60:7:** Following the primary ayah irab, the interpreted masdar is accusative by removal of the causal lam (naz al-khafid), rather than assigning a direct object or independent subject role.
- **23:62:12:** Followed qacCorrection: the retained nun after non-governing negative la marks an indicative passive imperfect, not the raw QAC jussive tag or generated irab.
- **23:62:** The tafsir summary preserves the supplied distinction: Muyassar and Ibn Kathir identify the record as the book of deeds; Sadi describes the first book containing everything.
- **23:63:12:** Followed the ayah-level irab: hum laha amilun is a hal clause from the pronoun in lahum, rather than an adjective clause modifying amal.
- **23:63:** The translation adopts the prospective sense of amilun supported by Muyassar and Sadi. The word card also mentions ongoing action; the shared Ibn Kathir passage discusses evil deeds besides shirk and deeds inevitably committed before death.
- **23:64:4:** Followed qacCorrection: mutrafihim is the accusative direct object of akhadhna, marked by sound masculine plural ya; the nun is omitted for idafa. Raw QAC NOM and its generated irab are not followed.
- **23:64:6:** The ayah-level irab identifies the second idha as sudden-event (fujaiyya), unlike the generated word-level temporal label. Kept the fixed app noun type and explained the adverbial analysis; a particle analysis is also recognized in the rule library.
- **23:65:5:** MIN + NAA has a shared geminate nun in the written form. The exact-slice segments assign that shared nun to the first slice and label the final alif as the remainder of NAA; the morphology explicitly explains the assimilation.
- **23:67:2:** Muyassar and Saadi refer the pronoun to the familiar Sacred House or sanctuary. Translation and explanation follow that tafsir; the supplied English translations can instead suggest a reference to the Quran.
- **23:67:4:** The evil-talk sense is selected following the supplied Muyassar and Saadi tafsir. The shared lexeme/root notes also record the alternative sense of abandoning; the active Form I paradigm is unchanged.
- **23:68:1:** The supplemental fa is taught as extra following the word irab and SUP tag. A coordinating analysis of this fa is a recognized alternative.
- **23:68:4:** The ayah grammar note explicitly calls AM discontinuous; this takes priority over the generic CONJ tag and word-level conjunction label. The lesson therefore uses retraction rather than conjunction.
- **23:69:1:** The unpaired am is treated as disconnected am, parallel to the explicit ayah-level analysis at 23:70; the generic word-level conjunction label is retained only as source data.
- **23:69:5:** The word-level source labels fa resumptive, but the ayah grammar calls the nominal clause coordinated with the preceding independent clause. The lesson follows the ayah-level coordination, as it also does at 23:71:13.
- **23:70:8:** The word-level source labels waw a conjunction; the ayah grammar explicitly makes the nominal clause a circumstantial clause referring to the object pronoun in jaahum. The lesson follows that clause analysis and uses haal rather than conjunction.
- **23:71:3:** The translation retains truth, following Taqi Usmani and the Saadi explanation of truth and justice. Sahih International explicitly interprets the Truth as Allah; Muyassar explains the hypothetical as Allah legislating in accordance with their desires. Both express that desire cannot be the standard for divine guidance.
- **23:71:12:** Dhikr is translated as their admonition, while its supported sense of their honour through the Quran is explained in the tafsir and dictionary fields.
- **23:70:1:** The ayah grammar explicitly calls am disconnected, overriding the generic coordinating-conjunction label in the word-level source.
- **23:71:6:** The sound feminine plural ending is written with dagger alif instead of a full alif. Segmentation retains that exact combining mark with the final ta as the plural ending; concatenation preserves the complete Uthmani word.
- **23:72:1:** The ayah grammar identifies am as discontinuous; retraction follows that note rather than the generic CONJ word tag.
- **23:72:6:** The generated word irab says adjective, but khayrun is the predicate of kharaju rabbika, not an attributive adjective; the lesson preserves its QAC adjective/elative morphology.
- **23:73:1:** The ayah grammar calls the clause resumptive, while the word entry labels waw conjunctive. The lesson follows the ayah-level syntax and treats waw as resumptive.
- **23:75:1:** The ayah grammar calls the conditional sentence resumptive; waw is therefore taught as resumptive rather than following the generic conjunctive word tag.
- **23:75:6:** The supplied ayah irab attaches min durr to an omitted hal of ma; the lesson follows that syntax while explaining its specifying sense.
- **23:75:8:** The supplied lexeme adopts lajja yalajju, originally lajija, in the samia class. The daraba-class variant lajaja yalijju is also recorded; the attested perfect plural does not distinguish the vowel classes.
- **23:75:11:** The supplied lexeme adopts amiha yamahu in the samia class; amaha is a recorded perfect variant with the same imperfect. Only the imperfect is attested here.
- **23:76:4:** The word-level irab calls fa resumptive, whereas the ayah grammar note explicitly coordinates the clause with akhadhnahum. The lesson follows the ayah-level coordination analysis.
- **23:76:5:** The lesson follows QAC and the reviewed lexeme: Form X, root k-y-n, citation istakana/yastakinu. The lexeme records alternative derivations from k-w-n (Form X) or s-k-n (Form VIII with vowel lengthening).
- **23:77:9:** The second idha introduces a sudden nominal result, unlike the conditional idha at 23:77:2. QAC tags both as time adverbs; the app noun type is retained and the surprise-idha rule is used. Some grammarians instead classify sudden idha as a particle.
- **23:77:** The supplied tafsir differs in scope: Muyassar and the grouped Ibn Kathir emphasize the Hereafter, while Sadi includes severe worldly punishment such as Badr. The summary preserves both readings.
- **23:78:1:** The ayah grammar note calls this an independent resumed sentence, whereas the word-level QAC labels waw coordinating. Resumption is taught following the ayah note.
- **23:78:8:** The generic word-level adjective label is refined by the ayah irab: qalilan stands in for the omitted cognate accusative, being the adjective of an implied shukran.
- **23:78:9:** QAC labels ma a relative pronoun; the primary ayah irab explicitly calls it extra: tashkuruna shukran qalilan. The explicit occurrence override sets the effective app type to particle, consistently with the adopted extra-particle analysis; raw QAC tags remain unchanged.
- **23:82:3:** Followed the explicit qacCorrection and reviewed lexeme: Hafs مِتْنَا is an active dialectal perfect of مَاتَ, with نَا as subject. Raw QAC morphology and generated i‘rab incorrectly call it passive and the suffix a deputy subject.
- **23:82:6:** Used عَظْم as the singular lemma of عِظَام, meaning bones, as the gloss and verified root entry require; raw QAC lemma عَظِيم is inappropriate here.
- **23:80:9:** Followed the supplied i‘rab and SUP tag in describing the fa as supplemental; a common alternative parses it as a conjunction after the interrogative hamza.
- **23:81:3:** Followed the ayah i‘rab: مِثْلَ is a direct object and مَا is a relative pronoun in the genitive, rather than treating مِثْلَ as a substitute cognate object or مَا as a masdar particle.
- **23:82:2:** Followed the ayah note: conditional إِذَا attaches to the meaning of an elided answer, understood as نُبْعَثُ; the clause beginning أَءِنَّا explains that answer, and the preceding adverb does not directly attach to لَمَبْعُوثُونَ across إِنَّ.
- **23:82:4:** Kept كُنَّا in one learner segment after the conjunction because the root-final nun and the suffix-initial nun are written as one geminate; explained نَا as the ism of kana, rather than copying the QAC surface split كُ / نَّا.
- **23:82:7:** Kept ءِنَّا together after the interrogative prefix: the contraction of إِنَّ + نَا prevents a faithful surface split showing the full suffix. Explained نَا as the ism of inna rather than presenting the QAC final alif alone as the pronoun.
- **23:80:7:** Kept the whole written word as one segment because the article lam and the stem-initial lam are fused in a geminate; the raw QAC prefix/stem split would leave a nonword stem.
- **23:83:7:** QAC labels qablu genitive without detailing construction. The vocalized damma is bina: the omitted mudaf ilayh remains intended, so qablu is built on damma in the position of jarr after min.
- **23:83:11:** Used the common singular usturah for asatir. The supplied root entry notes disagreement over the singular; this is not presented as unanimous.
- **23:83:12:** The generated word irab calls al-awwalin a genitive adjective. It functions here as mudaf ilayh of asatir, with the adjective standing substantivally for former peoples; it cannot be an agreeing adjective of nominative asatir.
- **23:84:2:** QAC tags man as REL. The translations and the interrogative sentence require interrogative man after the possessive lam; the prepositional phrase serves as a fronted predicate.
- **23:85:4:** Followed the word irab and rule-library policy in teaching fa as supplemental (zaidah). The ayah grammar note instead analyses it as a conjunction to an omitted clause about heedlessness; this is a supported alternative.
- **23:86:2:** The word-level QAC tags and generated irab call man relative. The ayah note parses man/rabbu as subject and predicate, and both translations show a question. Followed interrogative man as mubtada and rabbu as khabar.
- **23:87:4:** The word-level QAC analysis calls fa supplemental/extra, while the ayah note coordinates the question with an implied prior saying. The lesson retains the word-level extra-fa analysis and records the ayah-level coordination; conjunction with an implied clause is an alternative analysis of fa.
- **23:88:2:** QAC morphology and the generated word irab label man relative. The explicit ayah grammar note identifies an interrogative mubtada, as required by the question and translations; the lesson follows that note.
- **23:88:10:** The supplied irab specifies a passive verb but does not identify its naib fail. The lesson states the passive morphology and relation of alayhi without assigning an unsupported hidden pronoun or a disputed naib-fail analysis; scholarly review may expand this point.
- **23:89:4:** The word-level fa is labeled resumptive, but the ayah grammar note identifies it as linking the answer of an implied condition. The lesson follows the ayah note and treats anna as a hal of the passive subject.
- **23:90:4:** QAC segmentation and word-level irab call waw coordinating, while the ayah grammar note identifies the full inna clause as a hal of the preceding object pronoun. The lesson follows the ayah-level hal analysis.
- **23:91:11:** QAC labels the tanwin form idhan SUR and the generated irab calls it a surprise particle. Here it means “in that case” and is taught as a particle of answer and consequence, following the rule-library boundary and the hypothetical argument.
- **23:91:17:** Applied the supplied correction: ala is Form I, bab nasara, ala/yalu, not Form VI taala. The raw QAC lemma merges the two verbs; the reviewed separate lexeme is followed.
- **23:92:4:** Applied the supplied correction: taala is Form VI, bab tafaul, taala/yataala, despite the missing raw form tag. For syntax, the ayah grammar note explicitly coordinates this clause with the implied governor of subhan in 23:91; it is followed over the word-level REM/resumption label.
- **23:91:23:** Ma is retained as relative, following QAC, with an omitted object resumptive in its following clause. A masdari analysis giving “their description/ascription” is also possible; similarly at 23:92:5 “their associating partners”.
- **23:91:4:** The ayah grammar notes identify both min occurrences after negation as extra. Thus walad is genitive in form but accusative in syntactic position as object, while ilah in 23:91:10 is genitive in form but nominative in position as the delayed ism of kana.
- **23:92:1:** The genitive active participle follows the supplied ayah analysis as a badal of Allah in 23:91:22. The Urdu independent wording in the translation expresses the meaning without changing this cross-ayah syntactic attachment.
- **23:91:20:** QAC labels ba'd indefinite. Here its tanwin compensates for an omitted mudaf ilayh referring to the same hypothetical gods; elision replaces indefinite in the teaching rules.
- **23:93:2:** Followed the supplied qacCorrection: an annexed vocative with elided first-person ya is accusative with an implied fatha, not nominative as in the raw QAC tag and generated word irab.
- **23:93:3:** The ayah grammar note identifies in + extra ma, overriding the EXL morphology label and generated tafsil irab. The fused spelling is kept as one contiguous learner segment.
- **23:94:1:** Followed the supplied qacCorrection: an annexed vocative with elided first-person ya is accusative with an implied fatha, not nominative as in the raw QAC tag and generated word irab.
- **23:94:2:** Followed the ayah-level conditional construction: fa links the answer to the condition in 23:93, rather than the raw REM/resumptive word label.
- **23:95:1:** Followed the ayah note calling the clause resumptive, over the word-level CONJ label. Inna + na is kept fused after the separate waw because the two nuns overlap in the written form.
- **23:96:8:** The ayah irab explicitly makes ma masdariyya, while the word morphology and fixed derived pos label it a relative pronoun. The lesson follows the primary syntax and tags masdar-particle; the relative reading (what they attribute, with an elided resumptive object) is a valid alternative. No shared data was changed.
- **23:97:2:** Followed the supplied qacCorrection: annexed vocative with an elided first-person ya; accusative with an implied fatha, not the raw nominative QAC tag or generated irab.
- **23:97:7:** Retained the QAC PN classification for rule tagging, while explaining the contextual plural meaning devils rather than treating it as a singular personal name. The root entry is followed as a lexical index, without asserting a settled etymology.
- **23:98:3:** Followed qacCorrection: annexed vocative with implied accusative, not the raw NOM tag; the vocative clause is parenthetical.
- **23:99:7:** Followed qacCorrection: annexed vocative with implied accusative; both vocative ya and first-person possessive ya are elided.
- **23:99:8:** The imperative is morphologically second-person masculine plural. The Urdu prayer uses a natural singular address to the Lord; no addressee beyond the supplied sources is asserted. The retained nun is protective, not the deleted imperative nun.
- **23:100:11:** The ayah-level primary irab explicitly calls this waw circumstantial, although the segment and generated word irab label it conjunctive. Followed the ayah note: a hal clause with a fronted predicate, applying singular huwa collectively.
- **23:101:5:** Followed the ayah-level irab: the fa links the conditional answer, despite the REM label and generated resumptive description. La is generic negation, as shown by the following indefinite built noun.
- **23:101:6:** The raw ACC label is expressed more precisely as built on fatha in the accusative position: the non-mudaf ism of la nafiyah lil-jins. The plural counts as mufrad in this construction.
- **23:101:8:** The exact Uthmani segmentation preserves the hamza seat in the second slice; grammatically this represents idh. The tanwin compensates for the omitted clause, rather than marking indefiniteness.
- **23:98:5:** The primary ayah irab distinguishes the deleted inflectional nun, retained protective nun, and elided first-person object ya. Learner segments preserve the written nun while explaining the elided ya; the same distinction is used at 23:99:8.
- **23:102:1:** The ayah note explicitly treats man as conditional and the opening clause as coordinated with the preceding conditional. This takes precedence over the word-level REL and resumptive-fa labels; man is a conditional mubtada and thaqulat its predicate.
- **23:102:4:** The fa links the nominal conditional answer, rather than being resumptive as labelled in the word data.
- **23:103:1:** Man is read conditionally in parallel with 23:102 and its coordinated conditional structure, despite the word-level relative label. A relative reading with a fa-linked predicate is possible but is not adopted.
- **23:103:4:** The fa is treated as linking the conditional answer. Following the ayah note, alladhina is the first predicate and khalidun the second predicate of ulaika.
- **23:104:4:** Following the ayah note and word irab, waw coordinates this nominal circumstantial clause with the preceding circumstantial clause. The alternative analysis of waw as directly circumstantial is not used.
- **23:105:4:** The lemma gives the active dictionary form tala as required by the guide; the occurrence and verb note follow the verified passive paradigm tuliya/yutla. The hidden feminine deputy subject refers to ayati, which remains the ism of takun.
- **23:106:3:** The raw QAC lemma is غَلَبُ; the citation lemma غَلَبَ and daraba-class paradigm follow the supplied verified lexeme.
- **23:107:4:** The word-level QAC labels the first fa resumptive, while the ayah note coordinates the conditional sentence with the preceding request. The lesson follows the ayah-level syntax and teaches conjunction.
- **23:107:6:** The generated word irab labels fa resumptive. In context it necessarily links the nominal conditional answer, so it is taught as fa rabita; the answer clause is in the jussive position.
- **23:108:5:** Following the ayah grammar note, the surviving nun is nun al-wiqaya, not the five-verbs indicative nun. The latter is deleted by prohibitive la, and the first-person object ya is elided. The final segment carries the protection nun and signals the omitted object; it is not itself a pronoun.
- **23:109:9:** The word-level fa is tagged resumptive, but the ayah grammar explicitly coordinates the imperative clause with the response to the vocative. The lesson follows the ayah-level syntax and tags conjunction.
- **23:109:12:** The word-level waw is labelled conjunction; the ayah note instead makes the nominal clause circumstantial to the subject of ارحمنا. The lesson follows the ayah note and teaches waw al-hal.
- **23:109:5:** The genitive kasra before first-person ya is taught as estimated because the final consonant is occupied by the vowel of suitability; the packet gives GEN without specifying the sign.
- **23:107:6:** In inna + na, one of the consecutive nuns is omitted for lightening. The exact written segmentation follows the packet: fa + inna + alif, with the last slice representing the surviving part of the first-person plural suffix.
- **23:110:1:** Followed the ayah-level i‘rab in treating fa as conjunctive; the word-level line and QAC REM label instead call it resumptive.
- **23:110:3:** Followed the supplied ayah i‘rab and hatta rule: prepositional hatta governing an interpreted masdar with implied an before the perfect clause. An inceptive hatta analysis is an alternative.
- **23:110:5:** Applied qacCorrection: dhikri is the accusative second object of ansawkum, with an implied fatha before the first-person ya, not nominative as in the raw tag and generated word i‘rab.
- **23:111:4:** The fixed app pos is pronoun and QAC labels ma REL, but the authoritative ayah i‘rab explicitly analyses ma as masdariyya. Taught the masdar analysis and noted the relative alternative in the label; no relative rule was assigned.
- **23:111:6:** Followed the supplied ayah i‘rab: the interpreted masdar from anna is accusative through omission of a governing lam, while the second object of jazaytuhum is an omitted al-janna. Other analyses make the anna clause the reward or an explanatory replacement.
- **23:111:7:** Followed the ayah note in treating the independent hum as emphasis of the attached pronoun, hence in an accusative position. Separating-pronoun and subject analyses are alternatives.
- **23:113:7:** Followed the ayah-level i‘rab in treating the fa clause as coordinated with labithna; the word-level line and QAC REM instead label fa resumptive. The imperative is built on sukun; the written final kasra is for avoiding two adjacent sakin letters in liaison.
- **23:114:5:** Followed the ayah syntax note: qalilan substitutes for the omitted cognate object labthan qalilan, rather than being labelled a time adverb.
- **23:114:7:** Followed the ayah syntax note: the anna-clause is the subject of an implied thabata after law; the conditional answer is omitted.
- **23:115:2:** The word segments label ma SUB and the generated word i‘rab calls it masdariyya. Followed the explicit ayah note instead: ma is kaffah and anna is makfufah; the anna-clause supplies the two objects of hasiba.
- **23:115:4:** Followed the explicit ayah note: the masdar abathan is used as a hal. Its contextual Urdu gloss is purposelessly; it was not tagged as a cognate accusative or object of purpose.
- **23:116:1:** Applied qacCorrection and the reviewed lexeme paradigm: ta‘ala is Form VI, bab tafa‘ul, not the raw QAC Form I default.
- **23:116:6:** The generic word line calls ilaha accusative. As the non-mudaf ism of la al-nafiyah lil-jins, it is more precisely built on fatha in an accusative position.
- **23:116:8:** Followed the ayah note: huwa substitutes for the hidden pronoun in the omitted predicate; rabb is a second badal from huwa. The tawhid clause is a hal from the divine name.
- **23:117:1:** QAC labels man REL, but the ayah grammar identifies a conditional sentence and yadʿu is jussive. Taught man as a conditional noun in the nominative subject position, with the condition clause as its predicate following the ayah note.
- **23:117:8:** The generic la construction makes burhan a non-annexed ism built on fatha in the accusative position; the raw ACC label is not taught as ordinary declension.
- **23:117:10:** The packet gives only jar wa-majrur. Attached bihi to an implied adjective of burhan, referring to the other deity and its supposed entitlement to worship; direct attachment to burhan is another analysis.
- **23:117:11:** The word-level QAC line calls fa resumptive, but the ayah is explicitly conditional (also in the supplied Ibn Kathir). Taught fa as linking its nominal answer; innama remains restrictive and non-governing.
- **23:118:2:** Followed the supplied qacCorrection: rabb is an annexed vocative, accusative with an implied fatha before the elided first-person ya, not nominative as in the raw QAC tag/generated line. Both the vocative particle and first-person ya are elided; no empty segment was added.
- **23:118:5:** The ayah grammar explicitly makes the final nominal clause a hal from the subject of irham. Followed this over the word-level CONJ/atifa label and taught waw as circumstantial.
- **23:118:4:** Used the reviewed paradigm citation rahima without initial shadda; the raw QAC lemma initial shadda is contextual, as explained in the supplied lexeme entry.

## Per-ayah sources

- **23:1:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=1); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=1); [Quran.com](https://quran.com/23/1).
- **23:2:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=2); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=2); [Quran.com](https://quran.com/23/2).
- **23:3:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=3); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=3); [Quran.com](https://quran.com/23/3).
- **23:4:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=4); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=4); [Quran.com](https://quran.com/23/4).
- **23:5:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=5); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=5); [Quran.com](https://quran.com/23/5).
- **23:6:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=6); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=6); [Quran.com](https://quran.com/23/6).
- **23:7:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=7); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=7); [Quran.com](https://quran.com/23/7).
- **23:8:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=8); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=8); [Quran.com](https://quran.com/23/8).
- **23:9:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=9); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=9); [Quran.com](https://quran.com/23/9).
- **23:10:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=10); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=10); [Quran.com](https://quran.com/23/10).
- **23:11:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=11); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=11); [Quran.com](https://quran.com/23/11).
- **23:12:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=12); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=12); [Quran.com](https://quran.com/23/12).
- **23:13:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=13); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=13); [Quran.com](https://quran.com/23/13).
- **23:14:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=14); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=14); [Quran.com](https://quran.com/23/14).
- **23:15:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=15); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=15); [Quran.com](https://quran.com/23/15).
- **23:16:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=16); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=16); [Quran.com](https://quran.com/23/16).
- **23:17:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=17); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=17); [Quran.com](https://quran.com/23/17).
- **23:18:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=18); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=18); [Quran.com](https://quran.com/23/18).
- **23:19:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=19); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=19); [Quran.com](https://quran.com/23/19).
- **23:20:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=20); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=20); [Quran.com](https://quran.com/23/20).
- **23:21:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=21); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=21); [Quran.com](https://quran.com/23/21).
- **23:22:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=22); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=22); [Quran.com](https://quran.com/23/22).
- **23:23:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=23); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=23); [Quran.com](https://quran.com/23/23).
- **23:24:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=24); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=24); [Quran.com](https://quran.com/23/24).
- **23:25:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=25); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=25); [Quran.com](https://quran.com/23/25).
- **23:26:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=26); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=26); [Quran.com](https://quran.com/23/26).
- **23:27:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=27); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=27); [Quran.com](https://quran.com/23/27).
- **23:28:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=28); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=28); [Quran.com](https://quran.com/23/28).
- **23:29:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=29); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=29); [Quran.com](https://quran.com/23/29).
- **23:30:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=30); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=30); [Quran.com](https://quran.com/23/30).
- **23:31:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=31); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=31); [Quran.com](https://quran.com/23/31).
- **23:32:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=32); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=32); [Quran.com](https://quran.com/23/32).
- **23:33:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=33); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=33); [Quran.com](https://quran.com/23/33).
- **23:34:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=34); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=34); [Quran.com](https://quran.com/23/34).
- **23:35:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=35); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=35); [Quran.com](https://quran.com/23/35).
- **23:36:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=36); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=36); [Quran.com](https://quran.com/23/36).
- **23:37:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=37); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=37); [Quran.com](https://quran.com/23/37).
- **23:38:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=38); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=38); [Quran.com](https://quran.com/23/38).
- **23:39:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=39); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=39); [Quran.com](https://quran.com/23/39).
- **23:40:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=40); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=40); [Quran.com](https://quran.com/23/40).
- **23:41:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=41); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=41); [Quran.com](https://quran.com/23/41).
- **23:42:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=42); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=42); [Quran.com](https://quran.com/23/42).
- **23:43:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=43); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=43); [Quran.com](https://quran.com/23/43).
- **23:44:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=44); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=44); [Quran.com](https://quran.com/23/44).
- **23:45:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=45); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=45); [Quran.com](https://quran.com/23/45).
- **23:46:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=46); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=46); [Quran.com](https://quran.com/23/46).
- **23:47:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=47); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=47); [Quran.com](https://quran.com/23/47).
- **23:48:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=48); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=48); [Quran.com](https://quran.com/23/48).
- **23:49:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=49); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=49); [Quran.com](https://quran.com/23/49).
- **23:50:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=50); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=50); [Quran.com](https://quran.com/23/50).
- **23:51:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=51); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=51); [Quran.com](https://quran.com/23/51).
- **23:52:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=52); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=52); [Quran.com](https://quran.com/23/52).
- **23:53:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=53); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=53); [Quran.com](https://quran.com/23/53).
- **23:54:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=54); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=54); [Quran.com](https://quran.com/23/54).
- **23:55:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=55); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=55); [Quran.com](https://quran.com/23/55).
- **23:56:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=56); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=56); [Quran.com](https://quran.com/23/56).
- **23:57:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=57); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=57); [Quran.com](https://quran.com/23/57).
- **23:58:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=58); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=58); [Quran.com](https://quran.com/23/58).
- **23:59:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=59); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=59); [Quran.com](https://quran.com/23/59).
- **23:60:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=60); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=60); [Quran.com](https://quran.com/23/60).
- **23:61:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=61); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=61); [Quran.com](https://quran.com/23/61).
- **23:62:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=62); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=62); [Quran.com](https://quran.com/23/62).
- **23:63:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=63); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=63); [Quran.com](https://quran.com/23/63).
- **23:64:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=64); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=64); [Quran.com](https://quran.com/23/64).
- **23:65:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=65); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=65); [Quran.com](https://quran.com/23/65).
- **23:66:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=66); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=66); [Quran.com](https://quran.com/23/66).
- **23:67:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=67); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=67); [Quran.com](https://quran.com/23/67).
- **23:68:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=68); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=68); [Quran.com](https://quran.com/23/68).
- **23:69:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=69); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=69); [Quran.com](https://quran.com/23/69).
- **23:70:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=70); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=70); [Quran.com](https://quran.com/23/70).
- **23:71:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=71); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=71); [Quran.com](https://quran.com/23/71).
- **23:72:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=72); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=72); [Quran.com](https://quran.com/23/72).
- **23:73:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=73); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=73); [Quran.com](https://quran.com/23/73).
- **23:74:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=74); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=74); [Quran.com](https://quran.com/23/74).
- **23:75:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=75); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=75); [Quran.com](https://quran.com/23/75).
- **23:76:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=76); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=76); [Quran.com](https://quran.com/23/76).
- **23:77:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=77); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=77); [Quran.com](https://quran.com/23/77).
- **23:78:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=78); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=78); [Quran.com](https://quran.com/23/78).
- **23:79:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=79); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=79); [Quran.com](https://quran.com/23/79).
- **23:80:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=80); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=80); [Quran.com](https://quran.com/23/80).
- **23:81:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=81); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=81); [Quran.com](https://quran.com/23/81).
- **23:82:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=82); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=82); [Quran.com](https://quran.com/23/82).
- **23:83:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=83); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=83); [Quran.com](https://quran.com/23/83).
- **23:84:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=84); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=84); [Quran.com](https://quran.com/23/84).
- **23:85:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=85); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=85); [Quran.com](https://quran.com/23/85).
- **23:86:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=86); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=86); [Quran.com](https://quran.com/23/86).
- **23:87:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=87); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=87); [Quran.com](https://quran.com/23/87).
- **23:88:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=88); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=88); [Quran.com](https://quran.com/23/88).
- **23:89:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=89); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=89); [Quran.com](https://quran.com/23/89).
- **23:90:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=90); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=90); [Quran.com](https://quran.com/23/90).
- **23:91:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=91); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=91); [Quran.com](https://quran.com/23/91).
- **23:92:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=92); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=92); [Quran.com](https://quran.com/23/92).
- **23:93:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=93); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=93); [Quran.com](https://quran.com/23/93).
- **23:94:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=94); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=94); [Quran.com](https://quran.com/23/94).
- **23:95:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=95); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=95); [Quran.com](https://quran.com/23/95).
- **23:96:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=96); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=96); [Quran.com](https://quran.com/23/96).
- **23:97:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=97); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=97); [Quran.com](https://quran.com/23/97).
- **23:98:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=98); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=98); [Quran.com](https://quran.com/23/98).
- **23:99:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=99); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=99); [Quran.com](https://quran.com/23/99).
- **23:100:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=100); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=100); [Quran.com](https://quran.com/23/100).
- **23:101:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=101); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=101); [Quran.com](https://quran.com/23/101).
- **23:102:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=102); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=102); [Quran.com](https://quran.com/23/102).
- **23:103:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=103); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=103); [Quran.com](https://quran.com/23/103).
- **23:104:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=104); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=104); [Quran.com](https://quran.com/23/104).
- **23:105:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=105); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=105); [Quran.com](https://quran.com/23/105).
- **23:106:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=106); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=106); [Quran.com](https://quran.com/23/106).
- **23:107:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=107); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=107); [Quran.com](https://quran.com/23/107).
- **23:108:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=108); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=108); [Quran.com](https://quran.com/23/108).
- **23:109:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=109); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=109); [Quran.com](https://quran.com/23/109).
- **23:110:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=110); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=110); [Quran.com](https://quran.com/23/110).
- **23:111:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=111); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=111); [Quran.com](https://quran.com/23/111).
- **23:112:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=112); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=112); [Quran.com](https://quran.com/23/112).
- **23:113:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=113); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=113); [Quran.com](https://quran.com/23/113).
- **23:114:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=114); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=114); [Quran.com](https://quran.com/23/114).
- **23:115:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=115); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=115); [Quran.com](https://quran.com/23/115).
- **23:116:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=116); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=116); [Quran.com](https://quran.com/23/116).
- **23:117:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=117); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=117); [Quran.com](https://quran.com/23/117).
- **23:118:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=23&verse=118); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=23&verse=118); [Quran.com](https://quran.com/23/118).

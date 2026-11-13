# Surah 56 — Al-Waqi'ah: source audit

Researched 2026-11-13. This lesson contains **96 ayahs and 379 word occurrences**. All Urdu word glosses, translations, grammatical explanations, dictionary summaries, verb-paradigm notes and concise tafsir notes are original AI-assisted editorial drafts. They are **not scholar-reviewed** and are not attributed to a named Urdu translator. No third-party Urdu book, dictionary, translation or tafsir was imported.

## Arabic inventory

`inventory-56.json` records the Quran.com Content API v4 `text_uthmani` word strings ([source](https://api.quran.com/api/v4/verses/by_chapter/56?words=true&word_fields=text_uthmani&per_page=50)), retrieved 2026-11-13, excluding end-of-ayah markers. Recitation signs that the API separates from a word by a space — waqf signs, the saktah sign, the sajdah sign and the rub al-hizb marker — are not part of the stored word token, following the Surahs 110–114 precedent. The inventory lists all 1 such exclusions with the original API text; no other character was changed. The unnumbered opening basmalah is not inserted as a numbered occurrence. Automated tests compare every stored word, its id and its segments with this inventory.

Word boundaries and counts match the Quranic Arabic Corpus morphology for every ayah. Per-ayah word counts: 3, 3, 2, 4, 3, 3, 3, 5, 5, 2, 2, 3, 3, 3, 3, 3, 4, 5, 5, 3, 4, 2, 3, 4, 6, 4, 5, 3, 2, 2, 2, 2, 4, 2, 3, 2, 2, 2, 3, 3, 5, 3, 3, 4, 5, 5, 9, 2, 4, 5, 5, 5, 3, 4, 3, 4, 4, 3, 5, 7, 9, 6, 3, 5, 6, 2, 3, 4, 7, 6, 4, 6, 5, 4, 4, 5, 3, 3, 4, 4, 4, 4, 4, 3, 7, 5, 4, 5, 4, 6, 5, 6, 3, 2, 5, 4.

## Sources and method

- **Morphology:** Quranic Arabic Corpus morphology 0.4 (Kais Dukes, GNU GPL with the Corpus terms of use), a verbatim distribution checked by SHA-256 `910b721a8f04f4334ac5d4c62b19e858f5d720c525bb975f2e750ea2c6bb532d`. It was consulted locally for segmentation, part of speech, root, lemma, verb form, voice, mood and case; it is not bundled or redistributed.
- **Word types and roots** are derived deterministically from the Corpus stem tags with the mapping that reproduces root assignments for all 230 word occurrences of the existing lessons, including words with no root. A preposition with an attached pronoun (لَهُ، بِهِ، عَلَيْهِمْ) is a particle, following Surahs 1, 105 and 112. Words without a Corpus root, such as proper names, keep no root.
- **Syntax:** the Corpus word-by-word pages (English morphology and Arabic i‘rab for every word) and verse grammar pages (Arabic i‘rab notes adapted from the Quran Printing Complex), retrieved 2026-11-13. 12 of 96 verse pages carry no grammar note: 5, 29, 30, 31, 32, 34, 43, 46, 49, 72, 92, 94.
- **Verb paradigms** (باب، ماضی، مضارع، وزن) for all 68 verb occurrences come from a shared library of 199 verb lexemes for this expansion edition. Form I vowel classes were decided from imperfects attested across the whole Corpus and standard lexica (Lane, Lisan al-Arab, al-Mu‘jam al-Wasit). The edition’s library review and subsequent corrections are recorded in its handoff and adjudication reports.
- **Tafsir consulted** through the Quran.com API: Tafsir al-Muyassar (Arabic), Tafsir al-Sa‘di (Arabic) and Ibn Kathir (abridged, English). Translations consulted for meaning only: Saheeh International and Mufti Taqi Usmani. The Urdu wording is original and concise; it is not a translation of these works.

Word-type, verb-form and passive-voice counts below apply the adjudicated occurrence overrides; they are not uncorrected Corpus tag counts.

| Measure | Count |
| --- | ---: |
| Nouns | 181 |
| Adjectives | 16 |
| Verbs | 68 |
| Particles | 86 |
| Pronouns | 28 |
| Passive verb occurrences | 3 |
| Distinct roots | 141 |
| Verb form I | 47 |
| Verb form II | 7 |
| Verb form IV | 10 |
| Verb form V | 3 |
| Verb form VIII | 1 |

## Editorial checks

The lesson is organized into 12 chunks of whole ayahs. No review-result snapshot was supplied. This source audit therefore does not certify completion of independent reviews, fixes or final confirmations. The intended workflow requires independent grammar and meaning/tafsir reviews and a clean final confirmation after every correction, including minor findings.
The chunk validator checks the exact Arabic word, segments that rejoin to the exact word, ids and order, rule references, verb-note presence, phrase coverage of every word, and the absence of URLs or Latin text. AI review and automated checks are not scholarly review.

Nouns without a Corpus root (root left empty): أَئِذَا، أَيُّهَا، إِذَا، مَآ، وَأَبَارِيقَ.

## Corrections to Corpus tags

These occurrences carry an adjudicated correction or a documented source/analysis disagreement. The lessons follow the recorded contextual analysis; the raw Corpus data itself is unchanged.

- **56:47:4** مِتْنَا: مِتْنَا is active and intransitive, with nā as subject. The kasra on mīm is the attested variant discussed by al-Naḥḥās, who connects it with مَاتَ يَمَاتُ and records a second explanation. QAC tags it passive although its own gloss is “we die.”

## Analysis decisions and cautions

Notes recorded by the authors and reviewers for scholarly review; they mark alternative analyses, source disagreements and editorial choices.

- **56:1:1:** The lesson follows the QAC analysis with an elided conditional answer. It treats 56:2 and 56:3 as circumstantial clauses and the temporal expression in 56:4 as a substitute for the first.
- **56:2:3:** QAC tags a feminine active participle and the ayah notes make it the ism of laysa. The contextual gloss follows the denier reading. The negation is also understood as excluding denial or doubt, and Ibn Kathir records the sense that the event cannot be averted.
- **56:3:2:** The initial written shadda reflects recitational assimilation of the preceding tanwin into ra, and is absent from the dictionary form. The lesson takes this participle as the second predicate of the same omitted subject.
- **56:3:1:** The translation follows the change in people’s ranks. The tafsir also records the interpretation that the event is heard by those near and far.
- **56:4:4:** The word-level i‘rab gives the accusative only. QAC identifies a verbal noun, and the packet root entry confirms its role as the cognate accusative of the preceding passive verb.
- **56:5:3:** QAC gives a plain accusative noun. The verified root entry identifies the form as the masdar of the preceding verb and confirms the cognate accusative analysis.
- **56:6:1:** QAC morphology and word-level i‘rab call the fa resumptive. The ayah-level i‘rab explicitly coordinates this clause with the preceding passive clause, so the lesson teaches fa as coordinating and marking the result.
- **56:6:3:** QAC labels the word an adjective without identifying a participial form. The lesson retains the adjective analysis and identifies its derivation as the active participle of intransitive Form VII inbaththa. Initial mim shadda reflects liaison with the preceding tanwin.
- **56:8:3:** For both 56:8 and 56:9, the lesson reads the interrogative ma as the inner mubtada and the repeated idafa as its khabar. The entire question is the outer khabar, linked by repetition. The inverse analysis of the inner roles is also possible.
- **56:10:2:** QAC takes the repetition as lexical emphasis (tawkid lafzi), with 56:11 as the predicate. The repeated noun can alternatively be read as the predicate, a reading compatible with the supplied translations.
- **56:13:3:** The packet indexes the word under أ و ل, whose derivation is disputed in the root entry. The tafsir distinguishes earlier nations, the early generations of this Ummah, and an inclusive interpretation.
- **56:18:2:** Raw QAC morphology and the word-level i‘rab mark this noun accusative. It is genitive in coordination with the noun governed by بِ in 56:18:1. As a diptote on the pattern أَفَاعِيل, it marks genitive with fatḥa here.
- **56:18:5:** The packet follows QAC in indexing مَعِين under ع ي ن. The root entry also records the lexical derivation from م ع ن, associated with flowing.
- **56:19:5:** The raw QAC lemma has fatḥa on zāy. The supplied Ḥafṣ form has kasra, and the occurrence analysis and reviewed paradigm give active Form IV. The lesson follows the supplied tafsir in taking the verb as loss of sense through intoxication.
- **56:21:4:** The raw QAC lookup lemma is a feminine perfect form. The verified paradigm supplies the active dictionary forms اِشْتَهَى and يَشْتَهِي for this masculine plural imperfect.
- **56:24:1:** QAC morphology labels the word a plain noun. The ayah-level i‘rab explicitly calls it a masdar and analyzes it as maf‘ul li-ajlih.
- **56:24:2:** The lesson follows QAC REL and supplies an elided object resumptive in the relative clause. On the alternative masdariyya reading, the following clause denotes their acting and requires no resumptive.
- **56:25:3:** QAC English calls the suffix an object pronoun. Here it is governed by the preposition and occupies a genitive position.
- **56:26:1:** QAC tags the particle RES and calls it a restriction particle at word level. The ayah-level i‘rab explicitly analyzes the following noun as a disconnected exception.
- **56:27:1:** The word-level line and segmentation call the waw a conjunction. The ayah-level i‘rab explicitly makes it resumptive, opening the account of the people of the right.
- **56:27:3:** The lesson takes interrogative ma as the inner mubtada and the following idafa as its khabar. An alternative treats ma as a fronted khabar and the following idafa as the delayed mubtada. The full question is the outer khabar in either analysis.
- **56:29:1:** The supplied references identify ṭalḥ variously as banana trees or a familiar desert tree. The translation retains the tree name and the tafsir notes both views.
- **56:30:** The packet has no standalone tafsir text for this verse. Its Ibn Kathir entry points to grouped commentary at 56:27, which is not included in the context excerpt. The summary stays close to the verse and the surrounding tafsir.
- **56:31:2:** QAC tags this passive participle N and the word-level iʿrab states only that it is genitive. It functions as the adjective of the preceding water noun, with the packet's noun classification preserved.
- **56:33:2:** The word-level iʿrab gives only the genitive case. The ayah-level iʿrab identifies this passive participle as the second adjective of the fruit noun in 56:32.
- **56:33:3:** The word-level iʿrab calls the second lā a negative particle. The ayah-level iʿrab calls it supplemental, understood here as non-governing repetition reinforcing the negation.
- **56:33:4:** The ayah-level iʿrab specifies coordination with the first negated participle. The word-level iʿrab records only the genitive case.
- **56:34:2:** QAC tags the passive participle N and the word-level iʿrab states only its case. It functions as the feminine singular adjective of the preceding non-human plural.
- **56:35:1:** The English morphology labels nā an object pronoun. The Arabic iʿrab identifies it as the accusative ism of inna. The exact written segment after the shared shadda is only the final alif with its mark.
- **56:35:3:** The QAC ayah note identifies a cognate object. The translations and supplied tafsir support rendering the creation as special, alongside the formal emphatic function of the unmodified cognate accusative.
- **56:37:1:** QAC's MP feature conflicts with the feminine referents and the feminine singular base ʿarūb given by the lexical sources. The lesson follows the lexical evidence and the ayah iʿrab, which identifies the word as the first adjective of abkāran.
- **56:37:2:** QAC tags the broken plural MP. The singular tirb can denote a peer of either sex and the referents are women here. The ayah-level iʿrab identifies it as the second adjective of abkāran.
- **56:39:2:** The phrase describing the company of the earlier peoples is analyzed as adjectival in parallel with the explicit QAC analysis of 56:40.
- **56:41:3:** The ayah note makes the whole question the first mubtada’s khabar. Within the question, the lesson treats mā as mubtada and the repeated iḍāfa as khabar. Fronted khabar with the repeated iḍāfa as delayed mubtada is another analysis.
- **56:42:2:** The word glosses give scorching fire. The lesson follows the supplied tafsir and Usmani in taking samūm as a scorching wind from the fire.
- **56:44:2:** The ayah iʿrab and the lesson translation attach the adjectives to yaḥmūm. Another analysis attaches them to ẓill. The supplied tafsir describes the shade as offering no coolness or relief.
- **56:47:3:** The QAC note takes idhā with an implied passive verb meaning ‘we are raised’ and the final question as explanatory. The lesson follows that attachment and teaches the temporal function. A conditional analysis treats the implied verb as the answer.
- **56:47:4:** Applied the packet correction: active intransitive perfect, first person plural, with nā as subject. Raw QAC and generated iʿrab mark it passive. The reviewed māta–yamātu paradigm accounts for the attested kasra, and al-Naḥḥās also records another explanation.
- **56:47:7:** The raw QAC lemma ʿaẓīm gives way to singular ʿaẓm ‘bone’ in this context, as supported by the root entry and both word glosses.
- **56:47:8:** The contracted particle-pronoun combination has one written nūn with shadda. The learner segmentation groups that letter with the pronoun and labels it as shared. The QAC suffix slice shows the alif alone.
- **56:48:1:** The lesson follows the word iʿrab and rule library in treating the waw after the question hamza as supplemental. The ayah iʿrab takes it as coordinating the nominal clause with the preceding clause and supplies the omitted predicate.
- **56:50:5:** The word iʿrab supplies only genitive case. Agreement and context identify the passive participle as an adjective of the day.
- **56:51:2:** QAC English calls the suffix an object pronoun. The word iʿrab identifies it as the ism of inna in accusative position.
- **56:51:3:** QAC tags the fused expression NOM. The munada is built on damma in accusative position with the vocative particle omitted, and ha is a particle of attention.
- **56:51:4:** The word iʿrab gives only rafʿ. The lesson uses badal after the vocative as specified by the rule library. An analysis as an agreeing naʿt of ayy is also possible for this derived noun.
- **56:51:5:** The word iʿrab gives only rafʿ. The lesson takes the second participle as a naʿt of the first. It can also be read as a second modifier in the vocative construction.
- **56:52:5:** QAC tags the word both PN and INDEF. The word iʿrab and root entry identify it as the name of a tree. The lesson treats the tanwin as compatible with a fully declinable proper name.
- **56:53:1:** The word iʿrab calls the fa resumptive and QAC tags it REM. The ayah iʿrab explicitly coordinates the participle with the preceding predicate, which the lesson follows.
- **56:53:2:** QAC English calls the suffix an object pronoun. It is genitive after the preposition. The feminine suffix refers to the zaqqum tree understood as shajarah, or to the collective shajar by meaning.
- **56:54:2:** QAC English calls the suffix an object pronoun. It is genitive after the preposition, and the tafsir explains its antecedent as the zaqqum food.
- **56:55:3:** QAC gives a masculine noun with a singular English gloss. The root entry specifies the plural sense. Saʿdi gives both intensely thirsty camels and camels whose thirst persists due to disease.
- **56:57:3:** The ayah-level i‘rab coordinates the exhortation clause with the preceding clause. The word-level i‘rab and REM tag call the fāʾ resumptive. The lesson follows the ayah-level analysis.
- **56:57:4:** The ayah grammar note miscites the vocalization of the verb. The occurrence follows the packet’s Uthmani text and Form II active paradigm.
- **56:58:1:** The word i‘rab and SUP tag treat the fāʾ after the question hamza as supplemental. A coordinating analysis is also possible. The lesson follows the word i‘rab.
- **56:58:3:** The raw lemma is passive يُمْنَىٰ, while the occurrence is active, as shown by the vowel before the subject wāw and the reviewed paradigm أَمْنَى يُمْنِي. The root summary omits this attested sense of emitting semen.
- **56:60:5:** The packet leaves the government of negative mā unspecified. The lesson uses Hijazi mā with a locally accusative predicate and supplemental bāʾ. On the non-governing analysis, naḥnu is the mubtadaʾ and the predicate is locally nominative.
- **56:61:4:** QAC supplies مَثَل as the lemma. The lesson selects مِثْل for the likeness/form sense supported by the root entry and Ibn Kathir’s explanation. Usmani’s translation reflects the alternative sense of replacing the addressees with others like them.
- **56:62:1:** The word-level QAC analysis calls wāw coordinating. The verse-level note calls it resumptive, which is followed here. The lām of la-qad is taught as marking the answer to an implied oath.
- **56:62:4:** QAC tags this as nominative and the word-level iʿrab repeats that case. It is the agreeing adjective of the accusative feminine noun at 56:62:3, with an implied fatḥa on the final alif.
- **56:62:5:** QAC marks fāʾ as resumptive at word level. The verse-level note treats the exhortative clause as coordinated with the preceding clause, which is followed here.
- **56:63:1:** The supplemental fāʾ analysis follows QAC word-level iʿrab. The verse-level note coordinates the whole question with the parallel question at 56:58. A coordinating fāʾ is another grammatical analysis.
- **56:64:** The verse-level note refers to the parallel at 56:59. The lesson supplies the subject–predicate analysis from the present construction and follows 56:63 in taking the full question as the second object.
- **56:65:3:** The lesson specifies the emphatic lām as the lām introducing the answer to law and distinguishes the two objects of jaʿala in its transformation sense.
- **56:65:5:** QAC word-level iʿrab calls fāʾ resumptive and tāʾ a subject. The verse-level analysis coordinates the clause with the answer to law and calls the verb incomplete. The attached tāʾ therefore serves as its ism, as the verified lexeme also explains.
- **56:65:6:** The contextual meaning follows al-Muyassar and Ibn Kathir's explanation of astonishment. Al-Saʿdi explains regret, and Ibn Kathir also reports sorrow and mutual blame.
- **56:66:1:** QAC English labels the suffix an object pronoun. The word iʿrab correctly identifies it as the ism of inna in the accusative position. The reported words follow an implied verb of saying.
- **56:66:2:** The translation uses the debt sense found in the two packet translations. The commentary preserves the broader loss and punishment readings in the supplied tafsirs.
- **56:68:1:** The supplemental fāʾ analysis follows QAC word-level iʿrab. The verse-level note coordinates the full question with 56:63. A coordinating fāʾ is an alternative analysis.
- **56:69:** The verse-level note refers to the parallel at 56:59. The lesson supplies the subject–predicate analysis from the present construction and follows 56:68 in taking the full question as the second object.
- **56:69:2:** The wāw between the two pronominal elements lengthens the vowel of the plural mīm. QAC groups it with the subject suffix.
- **56:70:5:** The ayah grammar coordinates the exhortation with the answer clause. The word i‘rab and QAC morphology instead mark the fa as resumptive. The lesson follows the ayah grammar.
- **56:71:1:** The word i‘rab treats the fa after the interrogative hamza as supplemental. A common alternative takes this fa as connective. The ayah grammar coordinates the whole question with the parallel question in 56:68.
- **56:72:** The packet has no ayah-level i‘rab for this verse. The lesson takes both independent pronouns as subjects of nominal clauses and uses 56:71's ayah note for the question's role as the second object.
- **56:73:5:** The main gloss follows Muyassar and the translations in taking the participle as travelers. Sa‘di also gives the broader sense of people who benefit. The shared root entry describes strength and does not cover this Form IV sense.
- **56:75:1:** QAC morphology and the word i‘rab label lā as negative. The ayah i‘rab calls it supplemental for emphasis. Ibn Kathir discusses reading it as a rebuttal of the claims about the Quran before the oath. The lesson follows the ayah i‘rab.
- **56:75:3:** The shared root entry illustrates the Form III participle, while the occurrence here is the broken plural of the place noun mawqiʿ.
- **56:76:1:** QAC morphology and the word i‘rab label the waw as coordinating. The ayah grammar calls it parenthetical and places this clause between the oath and its answer.
- **56:76:5:** QAC labels this word as a noun and the word i‘rab gives only its nominative case. The ayah grammar identifies it as the adjective of the oath noun across the intervening conditional clause.
- **56:77:1:** The QAC object-pronoun label is generic. The word i‘rab makes the suffix the ism of inna. The lesson takes the ha as referring to the Quran.
- **56:77:2:** QAC tags the head both PN and INDEF, and the word i‘rab calls it a proper name. The lesson preserves the named referent and the nunated construction with an indefinite adjective.
- **56:78:** Al-Sa‘di gives the Preserved Tablet and the register held by the angels as possible referents of the protected book.
- **56:79:1:** QAC treats la as negating and the verb is indicative. Al-Sa‘di reports a prohibition understood from the declarative wording without changing the grammatical mood.
- **56:79:2:** The Quran is the antecedent in the QAC adjectival analysis. The ha can also refer to the protected register, the nearer noun in the preceding ayah.
- **56:80:1:** The ayah i‘rab takes tanzīl as another nominative adjective of Quran. An independent nominal sentence with an implied subject is also possible and matches the independent wording of the supplied translations.
- **56:81:1:** QAC marks the fa SUP and the word i‘rab calls it extra. The ayah i‘rab explicitly calls it resumptive, which the lesson follows.
- **56:81:2:** The word i‘rab only gives the genitive. The lesson presents the noun clarifying the demonstrative as badal. It can also be termed ʿaṭf bayān.
- **56:81:4:** Muyassar glosses the conduct as denial. Al-Sa‘di explains it as concealing or compromising the truth out of fear of others.
- **56:82:2:** The Urdu translation supplies the sense of thanking for provision, following Muyassar and Al-Sa‘di. Taqi Usmani instead renders denial as the livelihood the audience takes.
- **56:82:3:** The QAC object-pronoun label is generic. The suffix is the ism of anna per the word i‘rab, and the ayah i‘rab makes the interpreted masdar the second object.
- **56:83:2:** The ayah i‘rab makes idhā a pure time adverb attached to the later verb of returning the soul at 56:87. The translation supplies that verb in parentheses to make the cross-ayah connection clear.
- **56:84:1:** The word-level CONJ tag and word i‘rab call the waw coordinating. The ayah note calls the clause circumstantial, so the lesson treats the waw as introducing the ḥāl.
- **56:84:3:** The initial shadda in the raw QAC lemma is an assimilation artefact. The reviewed lexeme gives the citation form naẓara.
- **56:85:1:** The word-level CONJ tag and word i‘rab call the waw coordinating. The ayah note calls the clause circumstantial, and the lesson teaches it as a ḥāl during the onlookers’ watching.
- **56:85:** Ibn Kathir explains the nearness through the angels. Al-Sa‘di includes Allah’s knowledge as well as His angels.
- **56:86:1:** The ayah-level iʿrab identifies the whole expression as verbal emphasis of its counterpart in 56:83. The first fa is resumptive and lawla is exhortative.
- **56:86:3:** At both 56:86:3 and 56:87:3, the QAC subject-pronoun gloss is a morphological label. The attached ta is syntactically the ism of incomplete kana, and the perfect verb occupies the jussive position of the condition.
- **56:86:5:** The raw QAC lemma is inflected. The lesson uses singular madin for the Form I passive participle in the recompense or reckoning sense.
- **56:87:1:** Both English renderings express the challenge as a command. The Arabic is an active second-person plural indicative imperfect with retained nun; the ayah iʿrab treats the clause as resumptive and places it after the first lawla in the underlying order. The answers to the two in conditions in 56:86–87 are elided.
- **56:88:5:** The raw QAC lemma is plural. The lesson gives singular muqarrab as the Form II passive participle.
- **56:89:1:** The ayah iʿrab analyzes the fa as the link to the answer of amma, overriding the raw REM and generated resumptive labels. It makes rawh the predicate of an elided subject, roughly his reward. The nested in has an elided answer. Initial shadda in the raw lemma is excluded from the dictionary form.
- **56:89:2:** The raw lemma includes initial shadda, excluded from the dictionary form. The translation selects the provision reading of rayhan; the tafsir also records the fragrance reading.
- **56:89:3:** QAC tags the noun as feminine plural. The vocalized rasm, singular lemma, and translations support feminine singular jannah with open ta in this construct.
- **56:91:1:** The ayah iʿrab makes the fa the answer link despite QAC REM and the generated resumptive gloss. The ayah note prints imma where the preceding verse has amma. Salam is the subject and the two prepositional phrases attach to the implied predicate.
- **56:91:3:** The translation uses the greeting from the People of the Right reading, supported by al-Saʿdi and the ayah-level attachment. The tafsir also records the assurance of safety reading, supported by al-Muyassar and the grouped Ibn Kathir.
- **56:92:** The packet supplies an empty ayah-level iʿrab note here. Word-level iʿrab and the parallel with 56:88–91 support the nested condition, with the fa in 56:93 answering amma and conveying the elided answer of in.
- **56:92:5:** The raw QAC lemma is inflected and carries an initial shadda. The lesson uses singular mukadhdhib for the Form II active participle.
- **56:93:1:** QAC morphology and the word-level i‘rab call the fāʾ resumptive. The ayah-level i‘rab calls it linking, so it is taught as the fāʾ of the answer to the preceding conditional framing with ammā, with an omitted mubtada (jazāʾuhu).
- **56:93:** The shared root note records lodging as an alternative sense of nuzul. Hospitality fits the supplied translations and al-Sa‘di here.
- **56:95:3:** The ayah-level i‘rab makes the whole inner nominal clause the predicate of inna, so huwa is taught as its mubtada. Another parse treats huwa as a separating pronoun and ḥaqq as the direct predicate of inna.
- **56:95:5:** The effective app POS and raw QAC tag are adjective, and the word-level i‘rab labels a genitive adjective. The lesson follows the iḍāfa analysis: nominative ḥaqqu is the muḍāf and genitive al-yaqīni is the muḍāf ilayh. A direct adjective of ḥaqqu would require nominative agreement.
- **56:96:2:** The packet indexes ism under s-m-w and records the alternative derivation from w-s-m. The lesson avoids deriving the word from either root in its explanation.

## Per-ayah sources

- **56:1:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=1); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=1); [Quran.com](https://quran.com/56/1).
- **56:2:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=2); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=2); [Quran.com](https://quran.com/56/2).
- **56:3:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=3); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=3); [Quran.com](https://quran.com/56/3).
- **56:4:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=4); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=4); [Quran.com](https://quran.com/56/4).
- **56:5:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=5); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=5); [Quran.com](https://quran.com/56/5).
- **56:6:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=6); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=6); [Quran.com](https://quran.com/56/6).
- **56:7:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=7); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=7); [Quran.com](https://quran.com/56/7).
- **56:8:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=8); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=8); [Quran.com](https://quran.com/56/8).
- **56:9:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=9); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=9); [Quran.com](https://quran.com/56/9).
- **56:10:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=10); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=10); [Quran.com](https://quran.com/56/10).
- **56:11:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=11); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=11); [Quran.com](https://quran.com/56/11).
- **56:12:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=12); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=12); [Quran.com](https://quran.com/56/12).
- **56:13:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=13); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=13); [Quran.com](https://quran.com/56/13).
- **56:14:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=14); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=14); [Quran.com](https://quran.com/56/14).
- **56:15:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=15); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=15); [Quran.com](https://quran.com/56/15).
- **56:16:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=16); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=16); [Quran.com](https://quran.com/56/16).
- **56:17:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=17); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=17); [Quran.com](https://quran.com/56/17).
- **56:18:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=18); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=18); [Quran.com](https://quran.com/56/18).
- **56:19:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=19); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=19); [Quran.com](https://quran.com/56/19).
- **56:20:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=20); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=20); [Quran.com](https://quran.com/56/20).
- **56:21:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=21); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=21); [Quran.com](https://quran.com/56/21).
- **56:22:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=22); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=22); [Quran.com](https://quran.com/56/22).
- **56:23:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=23); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=23); [Quran.com](https://quran.com/56/23).
- **56:24:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=24); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=24); [Quran.com](https://quran.com/56/24).
- **56:25:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=25); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=25); [Quran.com](https://quran.com/56/25).
- **56:26:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=26); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=26); [Quran.com](https://quran.com/56/26).
- **56:27:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=27); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=27); [Quran.com](https://quran.com/56/27).
- **56:28:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=28); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=28); [Quran.com](https://quran.com/56/28).
- **56:29:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=29); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=29); [Quran.com](https://quran.com/56/29).
- **56:30:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=30); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=30); [Quran.com](https://quran.com/56/30).
- **56:31:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=31); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=31); [Quran.com](https://quran.com/56/31).
- **56:32:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=32); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=32); [Quran.com](https://quran.com/56/32).
- **56:33:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=33); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=33); [Quran.com](https://quran.com/56/33).
- **56:34:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=34); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=34); [Quran.com](https://quran.com/56/34).
- **56:35:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=35); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=35); [Quran.com](https://quran.com/56/35).
- **56:36:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=36); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=36); [Quran.com](https://quran.com/56/36).
- **56:37:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=37); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=37); [Quran.com](https://quran.com/56/37).
- **56:38:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=38); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=38); [Quran.com](https://quran.com/56/38).
- **56:39:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=39); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=39); [Quran.com](https://quran.com/56/39).
- **56:40:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=40); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=40); [Quran.com](https://quran.com/56/40).
- **56:41:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=41); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=41); [Quran.com](https://quran.com/56/41).
- **56:42:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=42); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=42); [Quran.com](https://quran.com/56/42).
- **56:43:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=43); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=43); [Quran.com](https://quran.com/56/43).
- **56:44:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=44); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=44); [Quran.com](https://quran.com/56/44).
- **56:45:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=45); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=45); [Quran.com](https://quran.com/56/45).
- **56:46:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=46); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=46); [Quran.com](https://quran.com/56/46).
- **56:47:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=47); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=47); [Quran.com](https://quran.com/56/47).
- **56:48:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=48); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=48); [Quran.com](https://quran.com/56/48).
- **56:49:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=49); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=49); [Quran.com](https://quran.com/56/49).
- **56:50:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=50); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=50); [Quran.com](https://quran.com/56/50).
- **56:51:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=51); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=51); [Quran.com](https://quran.com/56/51).
- **56:52:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=52); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=52); [Quran.com](https://quran.com/56/52).
- **56:53:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=53); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=53); [Quran.com](https://quran.com/56/53).
- **56:54:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=54); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=54); [Quran.com](https://quran.com/56/54).
- **56:55:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=55); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=55); [Quran.com](https://quran.com/56/55).
- **56:56:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=56); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=56); [Quran.com](https://quran.com/56/56).
- **56:57:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=57); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=57); [Quran.com](https://quran.com/56/57).
- **56:58:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=58); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=58); [Quran.com](https://quran.com/56/58).
- **56:59:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=59); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=59); [Quran.com](https://quran.com/56/59).
- **56:60:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=60); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=60); [Quran.com](https://quran.com/56/60).
- **56:61:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=61); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=61); [Quran.com](https://quran.com/56/61).
- **56:62:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=62); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=62); [Quran.com](https://quran.com/56/62).
- **56:63:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=63); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=63); [Quran.com](https://quran.com/56/63).
- **56:64:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=64); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=64); [Quran.com](https://quran.com/56/64).
- **56:65:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=65); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=65); [Quran.com](https://quran.com/56/65).
- **56:66:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=66); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=66); [Quran.com](https://quran.com/56/66).
- **56:67:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=67); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=67); [Quran.com](https://quran.com/56/67).
- **56:68:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=68); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=68); [Quran.com](https://quran.com/56/68).
- **56:69:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=69); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=69); [Quran.com](https://quran.com/56/69).
- **56:70:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=70); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=70); [Quran.com](https://quran.com/56/70).
- **56:71:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=71); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=71); [Quran.com](https://quran.com/56/71).
- **56:72:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=72); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=72); [Quran.com](https://quran.com/56/72).
- **56:73:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=73); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=73); [Quran.com](https://quran.com/56/73).
- **56:74:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=74); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=74); [Quran.com](https://quran.com/56/74).
- **56:75:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=75); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=75); [Quran.com](https://quran.com/56/75).
- **56:76:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=76); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=76); [Quran.com](https://quran.com/56/76).
- **56:77:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=77); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=77); [Quran.com](https://quran.com/56/77).
- **56:78:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=78); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=78); [Quran.com](https://quran.com/56/78).
- **56:79:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=79); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=79); [Quran.com](https://quran.com/56/79).
- **56:80:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=80); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=80); [Quran.com](https://quran.com/56/80).
- **56:81:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=81); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=81); [Quran.com](https://quran.com/56/81).
- **56:82:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=82); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=82); [Quran.com](https://quran.com/56/82).
- **56:83:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=83); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=83); [Quran.com](https://quran.com/56/83).
- **56:84:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=84); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=84); [Quran.com](https://quran.com/56/84).
- **56:85:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=85); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=85); [Quran.com](https://quran.com/56/85).
- **56:86:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=86); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=86); [Quran.com](https://quran.com/56/86).
- **56:87:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=87); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=87); [Quran.com](https://quran.com/56/87).
- **56:88:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=88); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=88); [Quran.com](https://quran.com/56/88).
- **56:89:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=89); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=89); [Quran.com](https://quran.com/56/89).
- **56:90:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=90); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=90); [Quran.com](https://quran.com/56/90).
- **56:91:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=91); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=91); [Quran.com](https://quran.com/56/91).
- **56:92:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=92); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=92); [Quran.com](https://quran.com/56/92).
- **56:93:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=93); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=93); [Quran.com](https://quran.com/56/93).
- **56:94:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=94); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=94); [Quran.com](https://quran.com/56/94).
- **56:95:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=95); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=95); [Quran.com](https://quran.com/56/95).
- **56:96:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=56&verse=96); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=56&verse=96); [Quran.com](https://quran.com/56/96).

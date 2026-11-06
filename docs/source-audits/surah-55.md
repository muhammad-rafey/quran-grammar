# Surah 55 — Ar-Rahman: source audit

Researched 2026-11-06. This lesson contains **78 ayahs and 351 word occurrences**. All Urdu word glosses, translations, grammatical explanations, dictionary summaries, verb-paradigm notes and concise tafsir notes are original AI-assisted editorial drafts. They are **not scholar-reviewed** and are not attributed to a named Urdu translator. No third-party Urdu book, dictionary, translation or tafsir was imported.

## Arabic inventory

`inventory-55.json` records the Quran.com Content API v4 `text_uthmani` word strings ([source](https://api.quran.com/api/v4/verses/by_chapter/55?words=true&word_fields=text_uthmani&per_page=50)), retrieved 2026-11-06, excluding end-of-ayah markers. Recitation signs that the API separates from a word by a space — waqf signs, the saktah sign, the sajdah sign and the rub al-hizb marker — are not part of the stored word token, following the Surahs 110–114 precedent. The inventory lists all 3 such exclusions with the original API text; no other character was changed. The unnumbered opening basmalah is not inserted as a numbered occurrence. Automated tests compare every stored word, its id and its segments with this inventory.

Word boundaries and counts match the Quranic Arabic Corpus morphology for every ayah. Per-ayah word counts: 1, 2, 2, 2, 3, 3, 4, 4, 6, 3, 5, 4, 4, 5, 6, 4, 4, 4, 3, 4, 4, 4, 4, 6, 4, 4, 6, 4, 10, 4, 4, 4, 16, 4, 8, 4, 6, 4, 8, 4, 6, 4, 6, 5, 4, 5, 4, 2, 4, 3, 4, 5, 4, 9, 4, 9, 4, 3, 4, 5, 4, 3, 4, 1, 4, 3, 4, 4, 4, 3, 4, 4, 4, 6, 4, 6, 4, 6.

## Sources and method

- **Morphology:** Quranic Arabic Corpus morphology 0.4 (Kais Dukes, GNU GPL with the Corpus terms of use), a verbatim distribution checked by SHA-256 `910b721a8f04f4334ac5d4c62b19e858f5d720c525bb975f2e750ea2c6bb532d`. It was consulted locally for segmentation, part of speech, root, lemma, verb form, voice, mood and case; it is not bundled or redistributed.
- **Word types and roots** are derived deterministically from the Corpus stem tags with the mapping that reproduces root assignments for all 230 word occurrences of the existing lessons, including words with no root. A preposition with an attached pronoun (لَهُ، بِهِ، عَلَيْهِمْ) is a particle, following Surahs 1, 105 and 112. Words without a Corpus root, such as proper names, keep no root.
- **Syntax:** the Corpus word-by-word pages (English morphology and Arabic i‘rab for every word) and verse grammar pages (Arabic i‘rab notes adapted from the Quran Printing Complex), retrieved 2026-11-06. 32 of 78 verse pages carry no grammar note: 2, 6, 16, 18, 21, 23, 25, 28, 30, 32, 34, 36, 38, 40, 42, 45, 47, 49, 51, 53, 55, 57, 59, 61, 63, 65, 67, 69, 71, 73, 75, 77.
- **Verb paradigms** (باب، ماضی، مضارع، وزن) for all 68 verb occurrences come from a shared library of 358 verb lexemes for the five new lessons. Form I vowel classes were decided from imperfects attested across the whole Corpus and standard lexica (Lane, Lisan al-Arab, al-Mu‘jam al-Wasit), and every entry was independently reviewed.
- **Tafsir consulted** through the Quran.com API: Tafsir al-Muyassar (Arabic), Tafsir al-Sa‘di (Arabic) and Ibn Kathir (abridged, English). Translations consulted for meaning only: Saheeh International and Mufti Taqi Usmani. The Urdu wording is original and concise; it is not a translation of these works.

Word-type, verb-form and passive-voice counts below apply the adjudicated occurrence overrides; they are not uncorrected Corpus tag counts.

| Measure | Count |
| --- | ---: |
| Nouns | 226 |
| Adjectives | 5 |
| Verbs | 68 |
| Particles | 46 |
| Pronouns | 6 |
| Passive verb occurrences | 4 |
| Distinct roots | 105 |
| Verb form I | 26 |
| Verb form II | 34 |
| Verb form IV | 3 |
| Verb form VI | 1 |
| Verb form VII | 1 |
| Verb form VIII | 2 |
| Verb form X | 1 |

## Editorial checks

The supplied final result snapshot marks all 11 chunks of whole ayahs AI-reviewed with successful structural validation and a clean last confirmation. The workflow requires independent grammar and meaning/tafsir reviews, a fixer that applies or rejects each finding with a reason, and fresh whole-chunk confirmation after corrections. Every finding, including a minor finding, must be resolved or rejected before a clean final confirmation; an unconfirmed last edit does not count as completion.
In this supplied snapshot, the two independent reviews report 4 finding entries (0 critical, 1 major). The recorded first fix rounds report 4 applications and 0 rejections; confirmation rounds contain 0 finding entries, with every last confirmation clean. These are snapshot counts, not cumulative historical totals: reused authored drafts may already contain corrections from earlier passes, repeated findings may occur in more than one round, and intermediate fixer totals are not reconstructed.
The chunk validator checks the exact Arabic word, segments that rejoin to the exact word, ids and order, rule references, verb-note presence, phrase coverage of every word, and the absence of URLs or Latin text. AI review and automated checks are not scholarly review.

Nouns without a Corpus root (root left empty): أَيُّهَ، إِسْتَبْرَقٍۢ، بَرْزَخٌۭ، جَهَنَّمُ، ذَاتُ، ذَوَاتَآ، ذُو، ذِى، فَإِذَا، فَبِأَىِّ، فَيَوْمَئِذٍۢ، ٱلْيَاقُوتُ.

## Corrections to Corpus tags

These occurrences carry an adjudicated correction or a documented source/analysis disagreement. The lessons follow the recorded contextual analysis; the raw Corpus data itself is unchanged.

- **55:12:4** وَٱلرَّيْحَانُ: QAC tags this word GEN, contradicting the vocalised form and its role. In the Hafs reading وَٱلرَّيْحَانُ is nominative, coordinated with ٱلْحَبُّ (damma visible); the genitive tag reflects another reading.
- **55:17:2** ٱلْمَشْرِقَيْنِ: QAC tags this word NOM, contradicting the vocalised form and its role. ٱلْمَشْرِقَيْنِ is the muḍāf ilayh of رَبُّ; the dual ya ending marks the genitive.
- **55:17:4** ٱلْمَغْرِبَيْنِ: QAC tags this word NOM, contradicting the vocalised form and its role. ٱلْمَغْرِبَيْنِ is the muḍāf ilayh of رَبُّ; the dual ya ending marks the genitive.
- **55:27:1** وَيَبْقَىٰ: QAC tags وَيَبْقَىٰ subjunctive, but no particle governs it; it is indicative with an implied damma, coordinated with the nominal sentence of 55:26.
- **55:33:1** يَـٰمَعْشَرَ: QAC tags this word NOM, contradicting the vocalised form and its role. يَـٰمَعْشَرَ: an annexed vocative (منادیٰ مضاف) is accusative with fatha.

## Analysis decisions and cautions

Notes recorded by the authors and reviewers for scholarly review; they mark alternative analyses, source disagreements and editorial choices.

- **55:1:1:** Word-level QAC label «صفة مرفوعة» gives the word class; the ayah i'rab makes ٱلرَّحْمَـٰنُ the mubtada whose khabar is the clause of 55:2, with 55:3 and 55:4 as second and third khabar (followed). A common alternative reads it as khabar of an omitted mubtada (هو / الله الرحمن), with 55:2 opening a new sentence. Tagged resembling-adjective because the rule library lists the فَعْلَان pattern there; some grammarians instead call الرحمن a صيغة مبالغة.
- **55:2:1:** QAC and the ayah notes are silent on the elided first object of the doubly transitive عَلَّمَ. The Urdu calls ٱلْقُرْءَانَ the thing taught and supplies the learner from the provided tafsir (Muyassar: الإنسان; Sa'di: عباده).
- **55:5:3:** The ayah i'rab only says the sentence is مستأنفة, and the word i'rab is جار ومجرور. The Urdu attaches بِحُسْبَانٍۢ to an elided khabar, glossed with Muyassar's يجريان; other i'rab works supply a generic كائنان. QAC tags حُسْبَان as N, not VN; the lexica differ on whether it is a masdar or a plural of حساب, so the Urdu does not decide.
- **55:6:1:** The ayah i'rab is empty; the standard analysis is used: the wa joins this nominal sentence to 55:5, النجم is mubtada, الشجر is coordinated, and يسجدان is the khabar. The provided tafsir differs on النجم: stars (Mujahid, al-Hasan and Qatadah; Sa'di; Ibn Kathir's preference) or stemless plants (Ibn Abbas via Ali b. Abi Talhah; Ibn Jarir's preference). Muyassar gives both, and so do the Urdu gloss, translation and tafsir.
- **55:8:1:** Source conflict. QAC morphology tags أَ as INT (an explanatory أن) with prohibitive لا; the ayah i'rab calls أن مصدرية, with the interpreted masdar accusative by removal of the lam (منصوب على نزع الخافض). Following the explanatory-an rule, we used the ayah i'rab (masdar-particle) and kept QAC's PRO and jussive, i.e. a masdar أن introducing a prohibition. Common alternatives: masdar أن + negative لا, with تطغوا subjunctive (the written form is the same because the nun drops in both moods); or explanatory أن + prohibitive لا (QAC's own tag). A scholar should confirm.
- **55:8:2:** Mood kept as QAC's jussive (after prohibitive لا) so that the verb note agrees with QAC; under the masdar أن + negative لا reading it would be subjunctive. The jussive sign is the dropped nun; the final weak letter fell before the plural waw, not because of the jazm.
- **55:9:2:** QAC tags وَزْن (and بَيَان at 55:4:2) as plain nouns (N), not verbal nouns, so verbal-noun is not tagged and the morphology does not call them masdars. The dictionary line keeps the root entry's sense of weighing.
- **55:9:4:** The ayah i'rab does not say what وَلَا تُخْسِرُوا۟ ٱلْمِيزَانَ is coordinated on; the Urdu takes it as coordinated on the imperative clause وَأَقِيمُوا۟ ٱلْوَزْنَ.
- **55:9:5:** QAC's lemma ID is the imperfect يُخْسِرُ, because only imperfects are attested. The lemma field uses the lexeme entry's perfect أَخْسَرَ, which comes from the lexica.
- **55:10:2:** The 55:10 ayah note does not label the clause وَضَعَهَا. By parallel with 55:7, where «رفعها» is called تفسيرية, it is described as the explanatory clause with no i'rab position.
- **55:12:4:** Followed the packet qacCorrection: the Hafs form has visible damma and is nominative, coordinated with al-habb; raw QAC GEN and generated genitive irab were not followed.
- **55:13:1:** Followed the ayah grammar note: fa links the answer of an implied condition, despite REM and the word-level resumptive label. The identical refrain in 55:16:1 is explained the same way.
- **55:13:2:** The shared root entry gives ala and ila as alternative singulars of alaa; the lemma uses the former. The same choice is used at 55:16:2.
- **55:15:** The translation follows the supplied English translations and Ibn Kathir on a smokeless flame. The tafsir also records Sadi's alternative of a flame mixed with smoke; neither view is presented as unanimous.
- **55:17:2:** QAC labels the dual NOM and generates nominative irab, but the vocalised -ayni and its position after rabb require genitive idafa; explained as genitive with ya.
- **55:17:4:** QAC labels the dual NOM and generates nominative irab, but the vocalised -ayni and its position after rabb require genitive idafa; explained as genitive with ya.
- **55:18:1:** The repeated interrogative is analysed as resumptive fa, following the supplied word irab. A fa answering an implied condition is another analysis; it is not used here. The same choice applies at 55:21:1, 55:23:1 and 55:25:1.
- **55:19:1:** The paradigm follows the supplied reviewed lexeme: transitive maraja, yamruju, bab nasara. The packet marks the lexical class as moderately certain; no Quranic imperfect is attested.
- **55:22:4:** Marjan is rendered coral, following both supplied translations. The shared root note also records interpretations as small or large precious pearls; the provided ayah tafsir does not elaborate this alternative.
- **55:24:1:** The prefixed waw is retained as coordinating per the word irab. The ayah-level note calls the complete nominal sentence independent; these describe different levels of the construction.
- **55:24:2:** Following the ayah irab, al-jawari is nominative with an implied damma on its omitted final ya, not genitive despite the written kasra. The lemma is the singular jariya rather than the plural Corpus lemma.
- **55:24:3:** The passive participle follows the supplied vocalisation and Form IV analysis. The translation emphasises elevation; the tafsir summary includes raised masts and sails (Muyassar) and human construction and use of ships (Saadi).
- **55:18:** The Ibn Kathir fields in all eight ayahs contain only a grouped-commentary pointer, not commentary text. Tafsir summaries therefore use the substantive Muyassar and, where supplied, Saadi extracts; 55:22 has no Saadi field.
- **55:27:1:** Followed the packet correction and reviewed lexeme: the imperfect is indicative with an implied damma on final alif, not subjunctive as in the raw QAC tag and generated irab.
- **55:31:3:** The raw QAC nominative tag and generated irab are interpreted as the vocative form: ayyu is built on damma in an accusative position after an omitted ya; ha is the attached attention particle. The following noun is appositive as specified in the ayah grammar note.
- **55:33:1:** Followed the supplied qacCorrection: the annexed vocative is accusative with visible fatha, not nominative as in the raw QAC tag and generated irab.
- **55:33:12:** The fa introduces the imperative conditional answer to in istatatum; taught as a linking fa and tagged condition-answer, despite the word-level QAC REM/resumptive label.
- **55:34:1:** QAC labels ayyi N here, unlike INTG in 55:32:1. Its interrogative function is unchanged in the identical refrain.
- **55:35:6:** Translation follows the supplied English translations with smoke. Tafsir preserves the packet distinction: Sadi explains a smoke-mixed flame, while Muyassar explains molten copper. No single interpretation is presented as exclusive.
- **55:32:2:** Used ala as the singular dictionary lemma for alaa, following the supplied root entry; ila is also recorded there as a singular variant. The same decision applies at 55:34:2.
- **55:37:1:** Followed the ayah iʿrab: the conditional answer is elided (a tremendous horror would be seen); the parenthesized Urdu ending supplies its sense. The fa in 55:37:4 coordinates within the condition and is not the answer marker.
- **55:37:6:** Dihan is rendered as oil following the word gloss and Muyassar/Saadi. The provided references also record dyes or changing colors, while the Taqi Usmani translation and root entry mention red hides; these are alternatives, not a unique asserted identification.
- **55:38:1:** QAC labels the stem N here, unlike INTG in 55:36:1 and 55:40:1. The identical rhetorical question is taught as an interrogative noun; derived pos remains noun.
- **55:39:1:** Word-level QAC labels the fa resumptive, but the ayah iʿrab calls it coordinating and joins the negative clause to the preceding elided conditional answer. Followed the ayah analysis. Yawm is accusative; idh is built in genitive position, with compensatory tanwin.
- **55:39:** The negation of questioning is explained as excluding requests for unknown information, following Saadi; the stage-specific explanation in Ibn Kathir and questioning for rebuke or acknowledgment are also preserved.
- **55:41:3:** Followed the primary ayah iʿrab attaching bi-simahum to an implied hal of al-mujrimun; the common direct attachment to the recognition verb is an alternative. The singular Arabic noun is glossed with a natural Urdu plural.
- **55:41:5:** Followed the supplied ayah iʿrab: the ba prepositional phrase is the naib faʿil of yuʾkhadhu. The phrase is in a nominative position, while nawasi itself remains genitive with an estimated kasra on final ya.
- **55:41:6:** QAC marks aqdam masculine plural. The lesson retains the fixed noun classification and gives plural morphology without teaching a masculine gender for its singular qadam, commonly treated as feminine.
- **55-c06:** The user-referenced [local instruction/runtime path omitted] could not be read because that path does not exist in this environment. The complete task-local authoring guide was read and followed.
- **55:42:2:** The rare singular of the plural of favors is given as either أَلًى or إِلًى in the supplied root entry. أَلًى is used as the lemma throughout the repeated refrain.
- **55:45:1:** QAC labels the interrogative noun as plain N here and at 55:47:1, unlike INTG at 55:42:1. All three occurrences are taught as interrogative nouns in the same rhetorical question. The resumptive fa analysis follows each supplied word irab.
- **55:44:1:** The supplied ayah irab explicitly attaches the circumstantial clause to Jahannam in the preceding ayah; this is retained. A familiar alternative takes the clause as a circumstance of the criminals, who are the subject of the verb.
- **55:46:1:** The word-level source calls waw conjunctive whereas the ayah-level note calls the whole sentence independent. Waw is retained as conjunctive linking the discourse, while the full nominal sentence begins a new statement.
- **55:46:3:** The primary rendering follows Muyassar, Ibn Kathir and Taqi Usmani: standing before the Lord. Maqam is explained as an action-denoting mim verbal noun here. Sadi also explains fear of the Lord and His watching over the servant; this alternative is mentioned without changing the accusative object analysis.
- **55:48:1:** The feminine singular ذات is used as the learner lemma for this feminine dual; QAC lists the masculine lexical head ذو. This is a dual with its nun deleted in idafa, not a sound feminine plural or a singular five-nouns ending.
- **55:48:2:** The main translation and singular lemma follow the branches interpretation, فنن. Sadi and the supplied root entry also record فن, kind, yielding varieties of bliss; this is explicitly preserved in the tafsir and dictionary note.
- **55:50:3:** Raw QAC labels the verb and its subject suffix 2FD. The antecedent is the third-person feminine dual noun for the two springs; the reviewed lexeme explicitly confirms 3FD. Authored as third-person feminine dual indicative active, with retained nun.
- **55:54:7:** Raw word-level QAC labels the noun genitive and wa conjunctive. Followed the explicit ayah grammar note: wa introduces a circumstantial nominal clause, jana is nominative mubtada with implied damma on alif, and dan is its predicate.
- **55:54:8:** Raw QAC morphology and generated word-level irab label the dual accusative. It is the genitive mudaf ilayh of jana in the nominal clause, as required by the ayah-level analysis and the rule library; ya marks genitive here.
- **55:51:1:** At 55:51:1, 55:53:1 and 55:55:1 raw QAC calls ayy a generic noun, unlike INTG at 55:49:1. All are interrogative nouns in the identical rhetorical question; the derived noun POS is retained.
- **55:49:1:** For the repeated refrain followed the supplied word-level irab treating fa as resumptive. An implied-condition/answer analysis is possible, but is not asserted in these lessons.
- **55:49:2:** For the repeated plural ala, used the root library singular ala (أَلًى) as lemma and mentioned the alternative ila (إِلًى) in dictionary notes; the plural itself is the usual lexical citation.
- **55:54:4:** QAC labels the broken plural bataain masculine plural although its singular bitana is feminine. The lesson states broken plural without asserting that gender label and retains the feminine singular possessive suffix referring to nonhuman plural bedding.
- **55:56:1:** The feminine plural pronoun is explained with reference to the previously mentioned couches, following the supplied Muyassar text; a broader reference to the gardens and their contents is also possible.
- **55:56:2:** Following the ayah grammar note, the active participle has a verbal (lafzi) idafa and remains indefinite; the following negative clause is its nominative adjective.
- **55:58:3:** Marjan is retained in the translation; the lexical explanation records coral and the pearl interpretation found in the supplied root entry and Ibn Kathir excerpt.
- **55:62:1:** The prefixed waw is labelled a conjunction following the word-level irab; the ayah note labels the whole clause resumptive. Both levels are preserved without asserting a different case role.
- **55:62:2:** The suffix huma is gender-invariant and refers to the two previously described gardens; the raw QAC 3MD suffix label is not taught as an exclusively masculine antecedent.
- **55:63:1:** The same analysis is used at 55:65:1, 55:67:1, 55:69:1 and 55:71:1: the supplied occurrence i‘rab calls fa resumptive, so resumption is followed. An alternative takes fa as linking the answer to an implied condition.
- **55:70:3:** QAC tags hisan as masculine plural, but its referents here are women. The lesson explains it as a broken-plural adjective used for either gender and retains the supplied nominative adjective syntax; it does not teach masculine referents.
- **55:70:1:** The supplied ayah i‘rab makes the nominal clause a fourth modifier of the earlier dual gardens. Muyassar and Saadi interpret the feminine-plural pronoun as referring to all the previously mentioned gardens. Both the supplied syntactic attachment and that tafsir scope are represented.
- **55:78:4:** QAC word morphology and generated word irab label dhi nominative. The vocalized Hafs text has genitive dhi, agreeing with rabbika as explicitly stated in the ayah grammar note. Taught as a genitive adjective marked by ya, one of the five nouns.
- **55:73:1:** The repeated refrain at 55:73, 55:75 and 55:77 follows QAC word irab: fa is resumptive. A common alternative takes it as the answer to an implied condition; this alternative is not the teaching analysis here.
- **55:76:3:** Rafraf and abqari at 55:76:5 are taught as collective nouns with plural meaning, matching QAC semantic feminine-plural labels without claiming sound or broken plural morphology. Rafraf can denote cushions or draped furnishings; the cushion gloss follows Muyassar.
- **55:76:4:** QAC labels khudr masculine without a plural feature, but the supplied root entry identifies it as the broken plural of akhdar. This lexically supported plural analysis is used; its genitive case is unchanged.
- **55:72:2:** Maqsurat is taught as a feminine plural passive participle, supported by the supplied root entry although QAC only labels it N. The full spelling is retained as a single segment to keep the superscript alif attached to its written base.
- **55:73:2:** The singular lemma أَلًى for the recurring plural آلَاء is one of the two singular forms supplied in the root entry; إِلًى is also recorded there.

## Per-ayah sources

- **55:1:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=1); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=1); [Quran.com](https://quran.com/55/1).
- **55:2:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=2); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=2); [Quran.com](https://quran.com/55/2).
- **55:3:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=3); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=3); [Quran.com](https://quran.com/55/3).
- **55:4:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=4); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=4); [Quran.com](https://quran.com/55/4).
- **55:5:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=5); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=5); [Quran.com](https://quran.com/55/5).
- **55:6:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=6); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=6); [Quran.com](https://quran.com/55/6).
- **55:7:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=7); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=7); [Quran.com](https://quran.com/55/7).
- **55:8:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=8); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=8); [Quran.com](https://quran.com/55/8).
- **55:9:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=9); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=9); [Quran.com](https://quran.com/55/9).
- **55:10:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=10); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=10); [Quran.com](https://quran.com/55/10).
- **55:11:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=11); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=11); [Quran.com](https://quran.com/55/11).
- **55:12:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=12); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=12); [Quran.com](https://quran.com/55/12).
- **55:13:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=13); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=13); [Quran.com](https://quran.com/55/13).
- **55:14:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=14); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=14); [Quran.com](https://quran.com/55/14).
- **55:15:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=15); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=15); [Quran.com](https://quran.com/55/15).
- **55:16:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=16); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=16); [Quran.com](https://quran.com/55/16).
- **55:17:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=17); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=17); [Quran.com](https://quran.com/55/17).
- **55:18:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=18); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=18); [Quran.com](https://quran.com/55/18).
- **55:19:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=19); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=19); [Quran.com](https://quran.com/55/19).
- **55:20:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=20); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=20); [Quran.com](https://quran.com/55/20).
- **55:21:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=21); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=21); [Quran.com](https://quran.com/55/21).
- **55:22:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=22); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=22); [Quran.com](https://quran.com/55/22).
- **55:23:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=23); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=23); [Quran.com](https://quran.com/55/23).
- **55:24:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=24); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=24); [Quran.com](https://quran.com/55/24).
- **55:25:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=25); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=25); [Quran.com](https://quran.com/55/25).
- **55:26:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=26); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=26); [Quran.com](https://quran.com/55/26).
- **55:27:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=27); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=27); [Quran.com](https://quran.com/55/27).
- **55:28:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=28); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=28); [Quran.com](https://quran.com/55/28).
- **55:29:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=29); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=29); [Quran.com](https://quran.com/55/29).
- **55:30:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=30); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=30); [Quran.com](https://quran.com/55/30).
- **55:31:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=31); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=31); [Quran.com](https://quran.com/55/31).
- **55:32:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=32); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=32); [Quran.com](https://quran.com/55/32).
- **55:33:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=33); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=33); [Quran.com](https://quran.com/55/33).
- **55:34:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=34); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=34); [Quran.com](https://quran.com/55/34).
- **55:35:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=35); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=35); [Quran.com](https://quran.com/55/35).
- **55:36:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=36); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=36); [Quran.com](https://quran.com/55/36).
- **55:37:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=37); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=37); [Quran.com](https://quran.com/55/37).
- **55:38:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=38); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=38); [Quran.com](https://quran.com/55/38).
- **55:39:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=39); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=39); [Quran.com](https://quran.com/55/39).
- **55:40:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=40); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=40); [Quran.com](https://quran.com/55/40).
- **55:41:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=41); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=41); [Quran.com](https://quran.com/55/41).
- **55:42:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=42); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=42); [Quran.com](https://quran.com/55/42).
- **55:43:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=43); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=43); [Quran.com](https://quran.com/55/43).
- **55:44:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=44); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=44); [Quran.com](https://quran.com/55/44).
- **55:45:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=45); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=45); [Quran.com](https://quran.com/55/45).
- **55:46:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=46); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=46); [Quran.com](https://quran.com/55/46).
- **55:47:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=47); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=47); [Quran.com](https://quran.com/55/47).
- **55:48:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=48); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=48); [Quran.com](https://quran.com/55/48).
- **55:49:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=49); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=49); [Quran.com](https://quran.com/55/49).
- **55:50:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=50); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=50); [Quran.com](https://quran.com/55/50).
- **55:51:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=51); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=51); [Quran.com](https://quran.com/55/51).
- **55:52:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=52); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=52); [Quran.com](https://quran.com/55/52).
- **55:53:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=53); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=53); [Quran.com](https://quran.com/55/53).
- **55:54:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=54); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=54); [Quran.com](https://quran.com/55/54).
- **55:55:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=55); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=55); [Quran.com](https://quran.com/55/55).
- **55:56:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=56); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=56); [Quran.com](https://quran.com/55/56).
- **55:57:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=57); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=57); [Quran.com](https://quran.com/55/57).
- **55:58:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=58); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=58); [Quran.com](https://quran.com/55/58).
- **55:59:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=59); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=59); [Quran.com](https://quran.com/55/59).
- **55:60:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=60); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=60); [Quran.com](https://quran.com/55/60).
- **55:61:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=61); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=61); [Quran.com](https://quran.com/55/61).
- **55:62:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=62); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=62); [Quran.com](https://quran.com/55/62).
- **55:63:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=63); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=63); [Quran.com](https://quran.com/55/63).
- **55:64:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=64); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=64); [Quran.com](https://quran.com/55/64).
- **55:65:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=65); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=65); [Quran.com](https://quran.com/55/65).
- **55:66:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=66); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=66); [Quran.com](https://quran.com/55/66).
- **55:67:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=67); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=67); [Quran.com](https://quran.com/55/67).
- **55:68:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=68); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=68); [Quran.com](https://quran.com/55/68).
- **55:69:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=69); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=69); [Quran.com](https://quran.com/55/69).
- **55:70:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=70); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=70); [Quran.com](https://quran.com/55/70).
- **55:71:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=71); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=71); [Quran.com](https://quran.com/55/71).
- **55:72:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=72); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=72); [Quran.com](https://quran.com/55/72).
- **55:73:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=73); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=73); [Quran.com](https://quran.com/55/73).
- **55:74:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=74); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=74); [Quran.com](https://quran.com/55/74).
- **55:75:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=75); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=75); [Quran.com](https://quran.com/55/75).
- **55:76:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=76); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=76); [Quran.com](https://quran.com/55/76).
- **55:77:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=77); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=77); [Quran.com](https://quran.com/55/77).
- **55:78:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=55&verse=78); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=55&verse=78); [Quran.com](https://quran.com/55/78).

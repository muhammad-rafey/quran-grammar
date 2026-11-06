# Surah 32 — As-Sajdah: source audit

Researched 2026-11-06. This lesson contains **30 ayahs and 372 word occurrences**. All Urdu word glosses, translations, grammatical explanations, dictionary summaries, verb-paradigm notes and concise tafsir notes are original AI-assisted editorial drafts. They are **not scholar-reviewed** and are not attributed to a named Urdu translator. No third-party Urdu book, dictionary, translation or tafsir was imported.

## Arabic inventory

`inventory-32.json` records the Quran.com Content API v4 `text_uthmani` word strings ([source](https://api.quran.com/api/v4/verses/by_chapter/32?words=true&word_fields=text_uthmani&per_page=50)), retrieved 2026-11-06, excluding end-of-ayah markers. Recitation signs that the API separates from a word by a space — waqf signs, the saktah sign, the sajdah sign and the rub al-hizb marker — are not part of the stored word token, following the Surahs 110–114 precedent. The inventory lists all 18 such exclusions with the original API text; no other character was changed. The unnumbered opening basmalah is not inserted as a numbered occurrence. Automated tests compare every stored word, its id and its segments with this inventory.

Word boundaries and counts match the Quranic Arabic Corpus morphology for every ayah. Per-ayah word counts: 1, 8, 18, 24, 17, 6, 10, 8, 14, 14, 11, 16, 16, 14, 15, 11, 13, 8, 12, 21, 9, 13, 14, 10, 11, 18, 17, 7, 11, 5.

## Sources and method

- **Morphology:** Quranic Arabic Corpus morphology 0.4 (Kais Dukes, GNU GPL with the Corpus terms of use), a verbatim distribution checked by SHA-256 `910b721a8f04f4334ac5d4c62b19e858f5d720c525bb975f2e750ea2c6bb532d`. It was consulted locally for segmentation, part of speech, root, lemma, verb form, voice, mood and case; it is not bundled or redistributed.
- **Word types and roots** are derived deterministically from the Corpus stem tags with the mapping that reproduces root assignments for all 230 word occurrences of the existing lessons, including words with no root. A preposition with an attached pronoun (لَهُ، بِهِ، عَلَيْهِمْ) is a particle, following Surahs 1, 105 and 112. Words without a Corpus root, such as proper names, keep no root.
- **Syntax:** the Corpus word-by-word pages (English morphology and Arabic i‘rab for every word) and verse grammar pages (Arabic i‘rab notes adapted from the Quran Printing Complex), retrieved 2026-11-06. 1 of 30 verse pages carry no grammar note: 1.
- **Verb paradigms** (باب، ماضی، مضارع، وزن) for all 101 verb occurrences come from a shared library of 358 verb lexemes for the five new lessons. Form I vowel classes were decided from imperfects attested across the whole Corpus and standard lexica (Lane, Lisan al-Arab, al-Mu‘jam al-Wasit), and every entry was independently reviewed.
- **Tafsir consulted** through the Quran.com API: Tafsir al-Muyassar (Arabic), Tafsir al-Sa‘di (Arabic) and Ibn Kathir (abridged, English). Translations consulted for meaning only: Saheeh International and Mufti Taqi Usmani. The Urdu wording is original and concise; it is not a translation of these works.

Word-type, verb-form and passive-voice counts below apply the adjudicated occurrence overrides; they are not uncorrected Corpus tag counts.

| Measure | Count |
| --- | ---: |
| Nouns | 139 |
| Adjectives | 8 |
| Verbs | 101 |
| Particles | 101 |
| Pronouns | 23 |
| Passive verb occurrences | 8 |
| Distinct roots | 131 |
| Verb form I | 66 |
| Verb form II | 7 |
| Verb form IV | 19 |
| Verb form V | 2 |
| Verb form VIII | 6 |
| Verb form X | 1 |

## Editorial checks

The supplied final result snapshot marks all 12 chunks of whole ayahs AI-reviewed with successful structural validation and a clean last confirmation. The workflow requires independent grammar and meaning/tafsir reviews, a fixer that applies or rejects each finding with a reason, and fresh whole-chunk confirmation after corrections. Every finding, including a minor finding, must be resolved or rejected before a clean final confirmation; an unconfirmed last edit does not count as completion.
In this supplied snapshot, the two independent reviews report 3 finding entries (0 critical, 3 major). The recorded first fix rounds report 3 applications and 0 rejections; confirmation rounds contain 0 finding entries, with every last confirmation clean. These are snapshot counts, not cumulative historical totals: reused authored drafts may already contain corrections from earlier passes, repeated findings may occur in more than one round, and intermediate fixer totals are not reconstructed.
The chunk validator checks the exact Arabic word, segments that rejoin to the exact word, ids and order, rule references, verb-note presence, phrase coverage of every word, and the absence of URLs or Latin text. AI review and automated checks are not scholarly review.

Nouns without a Corpus root (root left empty): أَءِذَا، إِذَا، إِذِ، إِسْرَٰٓءِيلَ، جَهَنَّمَ، كَمْ، لَمَّا، مَتَىٰ، مُوسَى، ٱلَّذِينَ.

## Corrections to Corpus tags

These occurrences carry an adjudicated correction or a documented source/analysis disagreement. The lessons follow the recorded contextual analysis; the raw Corpus data itself is unchanged.

- **32:9:13** مَّا: QAC tags مَّا REL, deriving pronoun, but the primary 32:9 verse i‘rab explicitly calls ما زائدة, after قليلا functioning as نائب مفعول مطلق. Follow the extra-particle analysis, with no case position or relative clause. The effective app word type is particle; preserve raw QAC tags and exact Arabic.
- **32:11:2** يَتَوَفَّىٰكُم: QAC tags يَتَوَفَّىٰكُم subjunctive, but nothing governs nasb after قُلْ; it is indicative with an implied damma.
- **32:14:2** بِمَا: QAC tags the first بِمَا of 32:14 REL, deriving pronoun, but the primary verse i‘rab explicitly calls this ما مصدرية, with the interpreted masdar attached to فذوقوا. Follow that selected causal masdar-particle analysis. The effective app word type is particle; preserve raw QAC tags and exact Arabic.

## Analysis decisions and cautions

Notes recorded by the authors and reviewers for scholarly review; they mark alternative analyses, source disagreements and editorial choices.

- **32:2:4:** QAC gives accusative and the generated word gloss says اسم منصوب. More precisely, the non-mudaf ism of generic la is built on fatha in the accusative position; the lesson follows the la-generic rule.
- **32:3:1:** The word-level tag says CONJ, but the ayah grammar explicitly identifies am as disconnected (منقطعة) for retraction. Followed the ayah analysis and tagged retraction rather than conjunction.
- **32:3:7:** Retained the supplied ayah analysis: min rabbika attaches to an implied modifier (نعت) of al-haqq.
- **32:3:14:** QAC genitive describes the surface case after extra min. The ayah syntax explicitly makes nadhir the subject: genitive in wording, nominative in syntactic position. It is not the object of atahum.
- **32:4:4:** QAC labels the word GEN and the generated word-level irab says genitive. It is the direct object of khalaqa and is accusative, marked by kasra in the sound feminine plural. The lesson follows the governing verb and the vocalised ending.
- **32:4:1:** Followed the supplied ayah grammar: Allah is mubtada, the relative pronoun is its naat, and the negative nominal clause is its khabar. Taking the relative pronoun as khabar and the negative clause as a new sentence is an alternative analysis.
- **32:4:20:** The GEN tag describes surface inflection under extra min. Following the ayah grammar, waliyy is a delayed mubtada, genitive in wording but nominative in syntactic position; shafii is coordinated to its surface inflection. The earlier min dunihi phrase attaches to an implied haal as the supplied grammar specifies.
- **32:4:23:** Followed the QAC SUP tag and word-level irab in calling fa extra. A common alternative calls it conjunctive, connecting this rhetorical question to the preceding statement; its contextual connective sense is retained in Urdu.
- **32:6:5:** The word-level generated i‘rab calls this a nominative adjective; the ayah grammar note specifies a second predicate of dhalika. Syntax follows the more specific ayah note while retaining the adjective word class.
- **32:6:6:** The word-level generated i‘rab calls this a nominative adjective; the ayah grammar note specifies a third predicate of dhalika. Syntax follows that ayah note; the intensive fa‘il treatment follows the rule library.
- **32:7:1:** Following the ayah grammar note, the relative pronoun is the fourth predicate of the preceding dhalika, rather than an adjectival continuation.
- **32:7:5:** Following the explicit ayah note, khalaqahu is an adjectival clause modifying kulla, in accusative position. The common alternative attaches the adjective to shay’in, in genitive position; the meaning is unchanged.
- **32:5:16:** Following QAC REL, ma is relative with an omitted object resumptive pronoun in ta‘udduna. A masdariyya reading is also possible; the packet ayah note attaches the whole prepositional phrase to an implied adjective of sanah.
- **32:5:17:** The learner segmentation separates the plural waw subject from the retained nun of indicative inflection; QAC groups both in its suffix segment. All Uthmani characters are preserved.
- **32-c03:** The referenced [local instruction/runtime path omitted] was unavailable. The supplied authoring guide, packet and rule library were followed; no shared files were changed.
- **32:9:12:** The ayah-level i‘rab identifies qalilan as a substitute for a cognate accusative, qualifying an omitted masdar of shukr. This is more specific than the word-level generic adjective label and is followed here.
- **32:9:13:** QAC tags مَّا REL, deriving pronoun, but the primary 32:9 verse i‘rab explicitly calls ما زائدة, after قليلا functioning as نائب مفعول مطلق. Follow the extra-particle analysis, with no case position or relative clause. The effective app word type is particle; preserve raw QAC tags and exact Arabic.
- **32:10:1:** The ayah-level grammar calls wa-qalu an independent new sentence, while the word-level prefix is called coordinating. The lesson follows the ayah-level analysis and uses resumption.
- **32:10:6:** The contracted spelling of inna with the first-person plural pronoun does not allow a clean contiguous stem/suffix boundary. After the question prefix, the combined particle-plus-pronoun is kept as one learner unit rather than presenting the final alif alone as the pronoun.
- **32:10:2:** Following the ayah grammar, conditional idha relates to an implied nub‘athu, and the following interrogative nominal clause explains that omitted answer. Idha does not make the perfect verb jussive.
- **32:11:2:** Followed the supplied qacCorrection: indicative with an implied damma, not the raw QAC subjunctive tag or generated accusative irab; no nasb governor follows qul.
- **32:11:3:** Treated malak as the common noun angel, not the proper name supplied by the QAC English named-entity gloss. No personal angel name is added from that gloss. The fixed root grouping m l k is a lexical index; the alternative derivation from a l k is acknowledged without choosing an etymology.
- **32:12:2:** Used the general addressee in the translation, following Muyassar ayyuha al-mukhatab. The condition answer is elided as the ayah grammar notes specify; a parenthetical rendering supplies its sense.
- **32:12:5:** The construct active participle has a sound masculine plural waw of nominative and omitted nun. The final Uthmani alif is orthographic, not a verbal subject pronoun; the idafa is verbal and its complement is semantically the object.
- **32:12:14:** The supplied word irab specifies only accusative noun. Chose a substantive direct object meaning righteous work, with the omitted noun amalan understood. An alternative analysis takes salihan as the adjective replacing an omitted cognate object, hence naib maf ul mutlaq.
- **32:12:15:** Kept one learner segment because the underlying particle and pronoun cannot both be represented in full by contiguous slices. The contraction involves deletion of one of three consecutive nuns, not assimilation.
- **32:13:6:** QAC morphology and generated word irab label hudaha GEN. It is the second direct object of ata and is accusative with an estimated fatha on the final alif; ha remains a genitive possessive pronoun.
- **32:13:12:** QAC and generated word irab label Jahannam GEN with diptote fatha. It is the direct object of amlaanna, accusative with visible fatha, and remains diptote.
- **32:13:10:** The supplied word irab gives only jar wa majrur. The lesson takes minni as an elided circumstantial qualifier of al-qawl (a statement issuing from Me); attachment to haqqa is another possible analysis.
- **32:13:15:** Nas is a collective lexical noun; its lemma is retained as nas rather than replaced with insan, a singular of different form. The supplied root grouping n-w-s is an index, not a settled etymology.
- **32:13:16:** The ayah note explicitly calls ajmain a genitive emphatic follower of al-nas; this is followed. Its semantic scope includes the coordinated jinn and humans who qualify for punishment, as the supplied tafsir specifies unbelief and sin.
- **32:14:1:** The word irab calls fa resumptive, whereas the ayah note describes the whole imperative clause as coordinated with earlier reported speech. The lesson uses a resumptive fa at word level and understands the command as addressed to the criminals.
- **32:14:2:** QAC tags the first بِمَا of 32:14 REL, deriving pronoun, but the primary verse i‘rab explicitly calls this ما مصدرية, with the interpreted masdar attached to فذوقوا. Follow that selected causal masdar-particle analysis. The effective app word type is particle; preserve raw QAC tags and exact Arabic.
- **32:14:6:** The ayah note explicitly analyses hadha as a genitive adjective of yawmikum, interpreted as the indicated day. This is followed rather than the alternative badal analysis.
- **32:14:7:** Inna with the first-person plural pronoun na has a contracted spelling involving nun reduction. A single exact-text segment avoids representing the final alif alone as the complete pronoun na.
- **32:14:12:** For the second bima, the lesson follows the supplied REL morphology: ma is relative with an omitted object return in tamalun. A masdariyya reading (because of your doing) is also grammatically possible; the explicit masdariyya note in the ayah concerns the first bima.
- **32:15:13:** Followed the ayah grammar note: waw is circumstantial and the nominal clause is a hal of the subject of sabbahu. The segment and generated word-level irab instead label waw as a conjunction.
- **32:16:1:** The occurrence has no derived-form marker in raw QAC and its raw lemma repeats the inflected word. Followed the reviewed lexeme and root entry: form VI tajafa/yatajafa, defective waw root, 3FS active indicative with an implied damma.
- **32:16:7:** Followed the ayah note in treating khawfan as an object of purpose and taman as coordinated with it. The common alternative construes the two masdars as a circumstantial description of the supplicants.
- **32:16:10:** The reviewed lexeme explains razaqa here as doubly transitive: hum is the recipient object, and the omitted second object is the resumptive pronoun referring to relative ma.
- **32:17:1:** Followed the ayah grammar note that the clause is resumptive, taking fa as inceptive. The raw segment and generated word irab instead label fa as a conjunction.
- **32:17:10:** Followed the ayah grammar note in assigning jazaan the role of object of purpose. A common alternative takes it as an absolute object of an implied recompensing verb.
- **32:17:11:** Retained the QAC relative analysis of ma with an omitted object resumptive in yamalun. A masdariyya analysis, interpreting the clause as their doing, is also possible.
- **32:18:1:** The word-level i‘rab and SUP tag call the fa extra; the ayah note calls it resumptive. Followed the word-level analysis and the explicit extra-particle rule; the resumptive analysis remains an alternative.
- **32:18:8:** The QAC segment boundary puts the radical waw in the suffix. Learner segmentation keeps the radical waw in the stem and separates the small written waw of the plural subject and the indicative nun. The plural subject follows the collective sense of the two relative man expressions.
- **32:19:2:** QAC tags alladhina COND and the generated word-level i‘rab calls it conditional. It is a relative mubtada, as the ayah-level khabar analysis and the rule library specify; amma supplies the conditional/detailing construction. The fixed app pos remains noun.
- **32:19:5:** QAC labels the word GEN and the generated i‘rab repeats that label. It is the direct object of amilu and therefore accusative, with kasra as the sound feminine plural accusative sign.
- **32:19:6:** QAC REM and the generated word i‘rab call the fa resumptive. In this amma construction it links the answer; the full nominal clause is the khabar of alladhina.
- **32:19:9:** Followed the ayah-level analysis of nuzulan as hal from jannat. The causal prepositional phrase bima attaches to an implied adjective of nuzulan, as specified by that note.
- **32:19:10:** Followed QAC and the ayah note in treating ma as relative, with an omitted returning object pronoun in the sila. A masdariyya analysis is also possible but was not adopted.
- **32:20:2:** QAC labels alladhina COND and the word-level irab says conditional noun. The ayah-level irab explicitly makes it the mubtada whose khabar is fa-mawahum al-nar; the relative rule also addresses this occurrence. Taught as a relative noun, not a jussive conditional.
- **32:20:4:** The word-level QAC line calls fa resumptive. In the amma detailing construction it links the answer, while the whole nominal clause is the khabar of alladhina. Used detailing and condition-answer rather than resumption.
- **32:20:13:** The supplied occurrence irab does not identify a specific naib fail for qila. Following the reviewed passive lexeme note, the lesson leaves open analyses involving the quoted clause or a pronoun referring to qawl; it does not label an ordinary active subject.
- **32:21:4:** QAC morphology labels al-adna NOM and its generated word-level irab says nominative adjective. It modifies al-adhabi governed by min and is therefore genitive, with an implied kasra on final alif. Taught the required genitive agreement.
- **32:21:** Muyassar identifies the nearer punishment as worldly trials; Sadi includes punishment at death and in barzakh, with a foretaste in worldly afflictions. The tafsir summary presents worldly warning first and marks the broader interpretation as a view of some exegetes. The supplied Ibn Kathir field points to grouped commentary not reproduced in this packet, so no extra details were imported.
- **32:22:1:** The word-level QAC REL tag and generated relative-pronoun irab conflict with the ayah grammar note. Followed the ayah note: man is an interrogative mubtada in a rhetorical question, with azlamu its khabar.
- **32:23:3:** QAC marks Musa NOM and the generated word irab says marfu. The verb has the attached subject na; Musa is its first object and al-kitab its second, as the ayah note states for al-kitab. Taught Musa as accusative with an estimated fatha on alif.
- **32:23:5:** The word-level prefix is REM and the generated irab calls fa resumptive, but the ayah grammar note explicitly coordinates fa-la takun with atayna. Followed that note and used conjunction, while preserving the prohibitive analysis of la.
- **32:23:10:** Translation follows Muyassar and Ibn Kathir: the pronoun refers to Musa and the meeting on the Night of Isra. Taqi Usmani renders receiving it, and Saadi connects the reassurance with the mutually confirming scriptures; the alternative book-reference is acknowledged without treating it as the only reading.
- **32:23:12:** QAC GEN and the generated genitive irab for hudan are erroneous. It is the accusative second object of jaalnahu, with fatha estimated on alif; the attached object pronoun refers to the Book.
- **32:23:13:** The QAC lemma bunayy is unsuitable here: bani is the construct genitive plural of ibn, treated with sound-masculine-plural endings, not the diminutive. Used singular ibn and retained the fixed shared root grouping b n y, whose etymology the root library marks as disputed.
- **32:24:1:** Jaalna is taught here as appoint/place with one explicit direct object (aimmatan) and minhum attached to the verb expressing selection from them. This differs from the unambiguous two-object transformation construction in 32:23.
- **32:24:6:** Followed QAC in treating lamma as a time-adverb noun and the ayah grammar note in treating the conditional answer as elided, indicated by the preceding appointment of leaders. The past clause is its genitive complement; lamma here does not govern jussive mood.
- **32:22:10:** Kept inna plus na as one fused learner segment: the written form contracts innana by dropping one nun, so a clean contiguous split preserving both complete morphemes is impossible. The QAC segmentation of inna plus bare alif is orthographic rather than a complete pronoun boundary.
- **32:26:1:** Word-level irab calls waw extra (QAC SUP), while the ayah grammar note calls it resumptive. The lesson follows the word-level analysis and the extra-particle rule; resumption is the recorded alternative.
- **32:26:4:** QAC morphology and word-level irab label kam interrogative. The explicit ayah syntax identifies declarative kam as a fronted object; the lesson follows that analysis and uses kam, not interrogative or fronted-object.
- **32:26:8:** The ayah syntax attaches min al-qurun to an implied adjective of kam. The lesson follows this and does not tag tamyiz; the common alternative is a specifying noun in the genitive after min.
- **32:26:10:** The ayah grammar note makes yamshuna a circumstantial clause of al-qurun, describing the destroyed generations while they inhabited their dwellings. The translation, syntax and phrases follow this primary analysis, also compatible with the supplied Taqi Usmani wording. All supplied tafsir explanations instead understand the present deniers walking among earlier peoples’ dwellings; the tafsir summary reflects that reading. On that reading the clause describes the current deniers and the dwellings’ possessive pronoun refers to the destroyed peoples.
- **32:26:16:** QAC morphology and generated word-level irab label ayat genitive. It is the delayed ism of inna, accusative with kasra in place of fatha as a sound feminine plural; the preceding fi-dhalika phrase supplies the fronted predicate. The lam is emphatic, not a preposition.
- **32:27:1:** The word-level irab calls the waw extra, followed here; the ayah note coordinates the complete question with 32:26. A coordinating analysis of the waw is a common alternative.
- **32:27:2:** Following the ayah irab, the anna clause is the single object of visual seeing; an intellectual-seeing analysis can instead let it fill two object slots.
- **32:27:8:** QAC labels juruz masculine singular although it modifies feminine ard. Juruz is used unchanged for masculine and feminine referents; the lesson explains that usage.
- **32:27:9:** Following the supplied word-level irab, fa is resumptive. Coordination with nasuqu is an alternative analysis.
- **32:27:16:** Following the supplied word-level irab, fa after the question hamza is extra; a coordinating analysis is a common alternative.
- **32:28:1:** The segments and word irab label waw coordinating, but the ayah grammar note calls the clause resumptive. The lesson follows the ayah note and uses resumption.
- **32:27:3:** The contracted anna reduces the cluster of nuns in anna plus na. The supplied exact surface segmentation leaves only the alif as the visibly separate pronoun portion.

## Per-ayah sources

- **32:1:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=32&verse=1); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=32&verse=1); [Quran.com](https://quran.com/32/1).
- **32:2:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=32&verse=2); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=32&verse=2); [Quran.com](https://quran.com/32/2).
- **32:3:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=32&verse=3); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=32&verse=3); [Quran.com](https://quran.com/32/3).
- **32:4:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=32&verse=4); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=32&verse=4); [Quran.com](https://quran.com/32/4).
- **32:5:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=32&verse=5); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=32&verse=5); [Quran.com](https://quran.com/32/5).
- **32:6:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=32&verse=6); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=32&verse=6); [Quran.com](https://quran.com/32/6).
- **32:7:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=32&verse=7); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=32&verse=7); [Quran.com](https://quran.com/32/7).
- **32:8:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=32&verse=8); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=32&verse=8); [Quran.com](https://quran.com/32/8).
- **32:9:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=32&verse=9); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=32&verse=9); [Quran.com](https://quran.com/32/9).
- **32:10:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=32&verse=10); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=32&verse=10); [Quran.com](https://quran.com/32/10).
- **32:11:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=32&verse=11); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=32&verse=11); [Quran.com](https://quran.com/32/11).
- **32:12:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=32&verse=12); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=32&verse=12); [Quran.com](https://quran.com/32/12).
- **32:13:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=32&verse=13); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=32&verse=13); [Quran.com](https://quran.com/32/13).
- **32:14:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=32&verse=14); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=32&verse=14); [Quran.com](https://quran.com/32/14).
- **32:15:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=32&verse=15); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=32&verse=15); [Quran.com](https://quran.com/32/15).
- **32:16:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=32&verse=16); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=32&verse=16); [Quran.com](https://quran.com/32/16).
- **32:17:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=32&verse=17); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=32&verse=17); [Quran.com](https://quran.com/32/17).
- **32:18:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=32&verse=18); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=32&verse=18); [Quran.com](https://quran.com/32/18).
- **32:19:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=32&verse=19); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=32&verse=19); [Quran.com](https://quran.com/32/19).
- **32:20:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=32&verse=20); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=32&verse=20); [Quran.com](https://quran.com/32/20).
- **32:21:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=32&verse=21); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=32&verse=21); [Quran.com](https://quran.com/32/21).
- **32:22:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=32&verse=22); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=32&verse=22); [Quran.com](https://quran.com/32/22).
- **32:23:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=32&verse=23); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=32&verse=23); [Quran.com](https://quran.com/32/23).
- **32:24:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=32&verse=24); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=32&verse=24); [Quran.com](https://quran.com/32/24).
- **32:25:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=32&verse=25); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=32&verse=25); [Quran.com](https://quran.com/32/25).
- **32:26:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=32&verse=26); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=32&verse=26); [Quran.com](https://quran.com/32/26).
- **32:27:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=32&verse=27); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=32&verse=27); [Quran.com](https://quran.com/32/27).
- **32:28:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=32&verse=28); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=32&verse=28); [Quran.com](https://quran.com/32/28).
- **32:29:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=32&verse=29); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=32&verse=29); [Quran.com](https://quran.com/32/29).
- **32:30:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=32&verse=30); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=32&verse=30); [Quran.com](https://quran.com/32/30).

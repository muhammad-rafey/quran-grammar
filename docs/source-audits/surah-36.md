# Surah 36 — Ya-Sin: source audit

Researched 2026-11-06. This lesson contains **83 ayahs and 725 word occurrences**. All Urdu word glosses, translations, grammatical explanations, dictionary summaries, verb-paradigm notes and concise tafsir notes are original AI-assisted editorial drafts. They are **not scholar-reviewed** and are not attributed to a named Urdu translator. No third-party Urdu book, dictionary, translation or tafsir was imported.

## Arabic inventory

`inventory-36.json` records the Quran.com Content API v4 `text_uthmani` word strings ([source](https://api.quran.com/api/v4/verses/by_chapter/36?words=true&word_fields=text_uthmani&per_page=50)), retrieved 2026-11-06, excluding end-of-ayah markers. Recitation signs that the API separates from a word by a space — waqf signs, the saktah sign, the sajdah sign and the rub al-hizb marker — are not part of the stored word token, following the Surahs 110–114 precedent. The inventory lists all 23 such exclusions with the original API text; no other character was changed. The unnumbered opening basmalah is not inserted as a numbered occurrence. Automated tests compare every stored word, its id and its segments with this inventory.

Word boundaries and counts match the Quranic Arabic Corpus morphology for every ayah. Per-ayah word counts: 1, 2, 3, 3, 3, 7, 8, 10, 12, 8, 12, 14, 8, 11, 15, 6, 5, 12, 9, 10, 7, 8, 15, 5, 4, 7, 7, 13, 8, 11, 11, 6, 10, 10, 8, 13, 9, 8, 7, 15, 8, 6, 9, 6, 11, 11, 24, 7, 8, 7, 10, 12, 10, 11, 7, 7, 6, 5, 4, 13, 5, 8, 5, 5, 11, 9, 10, 7, 12, 8, 12, 6, 6, 7, 7, 9, 11, 11, 10, 11, 14, 10, 8.

## Sources and method

- **Morphology:** Quranic Arabic Corpus morphology 0.4 (Kais Dukes, GNU GPL with the Corpus terms of use), a verbatim distribution checked by SHA-256 `910b721a8f04f4334ac5d4c62b19e858f5d720c525bb975f2e750ea2c6bb532d`. It was consulted locally for segmentation, part of speech, root, lemma, verb form, voice, mood and case; it is not bundled or redistributed.
- **Word types and roots** are derived deterministically from the Corpus stem tags with the mapping that reproduces root assignments for all 230 word occurrences of the existing lessons, including words with no root. A preposition with an attached pronoun (لَهُ، بِهِ، عَلَيْهِمْ) is a particle, following Surahs 1, 105 and 112. Words without a Corpus root, such as proper names, keep no root.
- **Syntax:** the Corpus word-by-word pages (English morphology and Arabic i‘rab for every word) and verse grammar pages (Arabic i‘rab notes adapted from the Quran Printing Complex), retrieved 2026-11-06. All 83 verse pages carry a grammar note.
- **Verb paradigms** (باب، ماضی، مضارع، وزن) for all 189 verb occurrences come from a shared library of 358 verb lexemes for the five new lessons. Form I vowel classes were decided from imperfects attested across the whole Corpus and standard lexica (Lane, Lisan al-Arab, al-Mu‘jam al-Wasit), and every entry was independently reviewed.
- **Tafsir consulted** through the Quran.com API: Tafsir al-Muyassar (Arabic), Tafsir al-Sa‘di (Arabic) and Ibn Kathir (abridged, English). Translations consulted for meaning only: Saheeh International and Mufti Taqi Usmani. The Urdu wording is original and concise; it is not a translation of these works.

Word-type, verb-form and passive-voice counts below apply the adjudicated occurrence overrides; they are not uncorrected Corpus tag counts.

| Measure | Count |
| --- | ---: |
| Nouns | 253 |
| Adjectives | 16 |
| Verbs | 189 |
| Particles | 208 |
| Pronouns | 59 |
| Passive verb occurrences | 14 |
| Distinct roots | 211 |
| Verb form I | 120 |
| Verb form II | 12 |
| Verb form IV | 39 |
| Verb form V | 1 |
| Verb form VII | 2 |
| Verb form VIII | 11 |
| Verb form X | 4 |

## Editorial checks

The supplied final result snapshot marks all 21 chunks of whole ayahs AI-reviewed with successful structural validation and a clean last confirmation. The workflow requires independent grammar and meaning/tafsir reviews, a fixer that applies or rejects each finding with a reason, and fresh whole-chunk confirmation after corrections. Every finding, including a minor finding, must be resolved or rejected before a clean final confirmation; an unconfirmed last edit does not count as completion.
In this supplied snapshot, the two independent reviews report 7 finding entries (0 critical, 6 major). The recorded first fix rounds report 7 applications and 0 rejections; confirmation rounds contain 0 finding entries, with every last confirmation clean. These are snapshot counts, not cumulative historical totals: reused authored drafts may already contain corrections from earlier passes, repeated findings may occur in more than one round, and intermediate fixer totals are not reconstructed.
The chunk validator checks the exact Arabic word, segments that rejoin to the exact word, ids and order, rule references, verb-note presence, phrase coverage of every word, and the absence of URLs or Latin text. AI review and automated checks are not scholarly review.

Nouns without a Corpus root (root left empty): ءَادَمَ، أَيُّهَا، إِذَآ، إِذْ، جَهَنَّمُ، فَإِذَا، فَإِذَآ، كَمْ، لَّدَيْنَا، مَتَىٰ، مَّعَكُمْ، وَإِذَا، وَمَا، يَـٰوَيْلَنَا.

## Corrections to Corpus tags

These occurrences carry an adjudicated correction or a documented source/analysis disagreement. The lessons follow the recorded contextual analysis; the raw Corpus data itself is unchanged.

- **36:10:6** تُنذِرْهُمْ: QAC tags تُنذِرْهُمْ 3rd person feminine singular; in ءَأَنذَرْتَهُمْ أَمْ لَمْ تُنذِرْهُمْ it is 2nd person masculine singular, jussive after لَمْ, parallel to أَنذَرْتَ.
- **36:14:4** ٱثْنَيْنِ: QAC tags this word NOM, contradicting the vocalised form and its role. ٱثْنَيْنِ is the object of أَرْسَلْنَآ; the dual ya ending marks the accusative.
- **36:20:6** يَسْعَىٰ: QAC tags يَسْعَىٰ subjunctive; it is an indicative verbal sentence describing رَجُلٌ (QAC's own ayah note makes it a نعت), with an implied damma.
- **36:26:6** قَوْمِى: QAC tags this word NOM, contradicting the vocalised form and its role. قَوْمِى is the noun (اسم) of لَيْتَ: accusative (sign implied before the first-person ya).
- **36:32:3** لَّمَّا: QAC tags لَّمَّا T, deriving noun, but the primary 36:32 verse i‘rab explicitly calls لما أداة حصر بمعنى إلا, paired with negative إن. Follow the restrictive-particle analysis, not temporal or jussive lamma. The effective app word type is particle; preserve raw QAC tags and exact Arabic.
- **36:52:2** يَـٰوَيْلَنَا: QAC tags this word NOM, contradicting the vocalised form and its role. يَـٰوَيْلَنَا: an annexed vocative (منادیٰ مضاف) is accusative, here with visible fatha.
- **36:54:3** تُظْلَمُ: QAC tags تُظْلَمُ active and jussive. The prefix vowel u with fatha on the lam makes it passive (no soul will be wronged), نَفْسٌ is its na'ib al-fa'il, and after negative لَا it is indicative (final damma).
- **36:78:8** يُحْىِ: QAC tags يُحْىِ jussive, but مَن here is interrogative and nothing governs jazm; it is indicative. Its second ya is not written before the hamzat al-wasl of ٱلْعِظَـٰمَ.

## Analysis decisions and cautions

Notes recorded by the authors and reviewers for scholarly review; they mark alternative analyses, source disagreements and editorial choices.

- **36:1:1:** QAC gives no lemma for the Quranic initials; lemma written as the word itself. Ibn Kathir's narrations on the virtues of reciting Ya-Sin are not summarised in tafsirUrdu (not needed for the ayah's meaning); a reviewer may add them with an agreed grading.
- **36:2:1:** Lemma written in dictionary spelling قُرْآن; QAC lemma is the Uthmani قُرْءَان.
- **36:4:1:** Followed the QAC i'rab: the phrase عَلَىٰ صِرَٰطٍۢ مُّسْتَقِيمٍۢ attaches to ٱلْمُرْسَلِينَ. Well-known alternative (mentioned briefly): a second khabar of إِنَّ ('and you are on a straight path').
- **36:4:3:** QAC word i'rab says only اسم مجرور; the lesson treats it as the na't of صِرَٰطٍۢ, the standard analysis.
- **36:5:1:** Followed QAC: مفعول مطلق of an implied نَزَّلَ. Alternative mentioned briefly: accusative of praise (object of an implied أمدح/أعني). Other canonical readings have تَنْزِيلُ in the nominative (khabar of an omitted mubtada); not discussed in the Urdu text.
- **36:5:2:** QAC word i'rab labels it صفة مجرورة (morphologically an adjective). Syntactically it is the muḍāf ilayh of تَنزِيلَ, an attribute standing for the unmentioned noun (Allah); the lesson says this explicitly. Tagged resembling-adjective (عَزِيز from intransitive عَزَّ).
- **36:5:3:** Treated as na't of ٱلْعَزِيزِ (QAC: صفة مجرورة); some analyses call it a second attribute of the same unmentioned noun, with no difference in meaning.
- **36:6:3:** مَا taken as negative, per QAC (NEG) and all three tafsirs. Some exegetes also allow relative or masdari مَا ('to warn a people of what their forefathers were warned'); not used.
- **36:6:6:** QAC morphology tags this فَ REM and its word i'rab says الفاء استئنافية, but the ayah i'rab says the clause فهم غافلون is معطوفة on ما أنذر. Followed the ayah i'rab (conjunction, causal sense) per the rules.json resumption tie-breaker; the resumptive reading is mentioned briefly.
- **36:7:6:** Same conflict as 36:6:6: QAC REM / word i'rab استئنافية vs ayah i'rab 'جملة فهم لا يؤمنون معطوفة على جملة حق'. Followed the ayah i'rab; resumptive reading mentioned.
- **36:8:9:** Same conflict as 36:6:6: QAC REM / word i'rab استئنافية vs ayah i'rab 'جملة فهم مقمحون معطوفة على جملة هي إلى الأذقان'. Followed the ayah i'rab; resumptive reading mentioned.
- **36:8:1:** Segmentation follows QAC (إِنَّ + ا): the final alif is what remains of the pronoun نَا after one nūn is dropped (إِنَّنَا > إِنَّا).
- **36:8:2:** Followed the QAC i'rab: فِى أَعْنَاقِهِمْ attaches to an elided second object, so جَعَلَ is two-object (tagged two-objects, zanna, elision). Alternative mentioned: جَعَلَ 'put/place' with one object and the phrase attached to the verb; translation uses 'ڈال دیے' either way.
- **36:8:5:** Lemma written غُلّ (iron collar, with ḍamma) per the verified root entry and the lexica; QAC's lemma is غِلّ (kasra), which is the word for rancour.
- **36:6:5:** Lemma given as the singular أَب per the guide; QAC lists the plural آبَاء as the lemma. Same for 36:8:8 (ذَقَن vs QAC أَذْقَان) and 36:8:10 (written مُقْمَح; QAC lemma is the plural form مُّقْمَحُون). For 36:3:3 and 36:6:7 QAC already gives the singular.
- **36:8:** tafsirUrdu presents the simile reading shared by Muyassar and Ibn Kathir, with Sa'di's point that the collars stand for the barriers keeping faith from their hearts. Ibn Kathir's Ikrimah report about Abu Jahl is not summarised.
- **36:9:4:** Raw QAC morphology and generated i‘rab label أَيْدِيهِمْ nominative. It is genitive as the mudaf ilayh of بَيْنِ, with an implied kasra on the final ya. The fixed noun POS and root are retained.
- **36:9:1:** Following the ayah grammar note, مِنۢ بَيْنِ أَيْدِيهِمْ is attached to an implied second object and each سَدًّۭا is a first object; a common alternative takes جَعَلَ as put with one object and attaches the location phrase to the verb.
- **36:9:9:** QAC uses the passive-shaped lemma أُغْشِيَتْ for this lexeme. The occurrence is active, so the lesson cites أَغْشَى, matching the verified lexeme.
- **36:9:10:** The word-level QAC REM tag and generated i‘rab call the fa resumptive, while the ayah grammar note coordinates the whole nominal clause with فَأَغْشَيْنَـٰهُمْ. The lesson follows the ayah-level conjunction analysis.
- **36:10:6:** Applied the packet qacCorrection: تُنذِرْهُمْ is second-person masculine singular, not the raw QAC third-person feminine singular; it is active and jussive after لَمْ, with hidden subject أَنْتَ.
- **36:11:9:** QAC gives passive-shaped بُشِّرَ as the lemma; the active imperative requires citation بَشَّرَ, as in the verified lexeme. The word-level REM tag calls fa resumptive, but the ayah grammar note calls the imperative clause coordinated with خشي; the lesson follows that ayah-level note. A resumptive consequence analysis remains an alternative for scholarly review.
- **36:11:8:** The ayah grammar note attaches the prepositional phrase to a circumstantial qualifier of the subject of خشي. Both fearing Allah unseen (the translations) and fearing Him in private (Muyassar) are reflected; neither is presented as excluding the other.
- **36:11:** Restriction is explained as restriction of beneficial warning, following Muyassar and Sa‘di, rather than restriction of whom the Prophet addresses. The supplied Ibn Kathir fields only refer to grouped commentary at 36:8 and contain no actual commentary text for this chunk; no unprovided narration was added.
- **36:12:4:** Raw QAC NOM and the generated nominative irab conflict with the syntax: this is the direct object of nuhyi, accusative with an implied fatha on the final alif.
- **36:12:3:** The final radical ya is omitted in the Uthmani spelling. The verb is indicative with an implied damma, not jussive; the reviewed lexeme explains this spelling.
- **36:13:1:** The word-level QAC line calls waw a conjunction, but the ayah grammar describes the clause as mustanafa. The lesson uses resumptive waw to match that clause-level analysis.
- **36:14:4:** Followed the supplied qacCorrection: ithnayni is the direct object of arsalna and accusative with ya, despite raw QAC NOM and the generated nominative irab. Its lemma retains the numeral two, which has no singular.
- **36:14:5:** The ayah grammar explicitly calls all fa prefixes coordinating. This takes precedence over the word-level REM/resumptive labels on 36:14:5 and 36:14:6. The full huma suffix is the dual object pronoun; the generated irab abbreviates it to ha.
- **36:14:** The provided Ibn Kathir commentary reports both messengers from Allah and emissaries sent by Jesus. The tafsir notes the latter as an alternative without identifying the unnamed town or adding disputed personal names.
- **36:15:10:** MIN is extra after negation before an indefinite. Following the ayah grammar note, SHAY is the object of ANZALA: genitive in wording but accusative in syntactic position; the generated word-level line gives only the surface genitive.
- **36:16:4:** The INNA clause fills both objects of YAALAMU; the emphatic lam suspends its overt government. Fused INNA plus NA is kept as one learner segment because a literal morpheme split cannot preserve the contracted nuns in the packet spelling.
- **36:18:2:** INNA plus NA is treated as one surface segment for the same contraction described at 36:16:4. MINNA at 36:18:10 likewise stays one segment because the two nuns share a written shadda.
- **36:18:3:** The reviewed paradigm supplies TATAYYARA, not the truncated assimilated raw QAC lemma. The occurrence is the unassimilated Form V; no assimilation rule is applied.
- **36:18:5:** Following the ayah grammar note, the lam prepares an implied oath; LANARJUMANNAKUM answers that oath, and the conditional answer is omitted. It is not labelled as a separately expressed conditional answer.
- **36:18:10:** The packet word-level i‘rab gives only jar wa-majrur. The lesson attaches MINNA to the preceding verb as source; another valid analysis attaches it to an omitted hal of the following indefinite ADHAB (a fronted adjectival phrase).
- **36:20:6:** Followed packet qacCorrection: raw QAC SUBJ and generated منصوب are incorrect. The ungoverned indicative has implied damma; its clause is a nominative adjective of رَجُلٌ, as the ayah grammar note states.
- **36:21:6:** Followed the ayah grammar note: the nominal clause is coordinated with the preceding negative relative clause. A common alternative treats it as circumstantial; no haal rule is assigned here.
- **36:22:6:** Used the reviewed فَطَرَ / يَفْطُرُ nasara paradigm. Its entry notes that some lexica also allow يَفْطِرُ; this perfect occurrence does not decide the imperfect vowel.
- **36:25:4:** The ayah-level QAC grammar note explicitly coordinates the imperative clause with the preceding faith clause; this is followed over the word-level REM/resumptive label on fa.
- **36:26:1:** Following the supplied ayah-level i‘rab, the passive has an implied deputy-subject pronoun referring to the verbal noun of saying. The common alternative analysis treats the following quoted clause as the deputy subject.
- **36:26:3:** The place noun after dakhala is taught as an accusative direct object by syntactic extension. An alternative treats it as accusative through omission of a preposition; the reviewed lexeme notes the transitivity disagreement.
- **36:26:5:** Following the ayah-level i‘rab and rule-library instruction, ya before layta is a particle of attention, not a vocative, despite the word-level QAC VOC tag.
- **36:26:6:** Applied the supplied qacCorrection: qawmi is the accusative ism of layta with an implied fatha before first-person ya, not nominative as in the raw QAC tag and generated i‘rab.
- **36:27:1:** Followed the ayah grammar note: ma is masdariyya, although the QAC segment and fixed app pos classify it as relative/pronoun. The interpreted masdar is governed by bi and relates to yaʿlamun in 36:26. Relative ma is an alternative analysis.
- **36:28:1:** Followed the ayah grammar note making the opening waw resumptive; the word-level QAC segment and generated irab call it conjunctive.
- **36:28:8:** Extra min causes overt genitive kasra, but jund remains the direct object in accusative position, as specified by the ayah grammar note.
- **36:28:12:** Kept kunna as one learner segment because the stem nun and the nun of na are geminated in the exact written string; the morphology explains both.
- **36:29:6:** Followed the ayah-level analysis that the fa-idha clause is coordinated with the preceding clause; the word-level QAC irab instead labels fa resumptive. Idha is sudden-event, not conditional.
- **36:30:7:** Extra min causes overt genitive kasra, but rasul is the delayed subject in nominative position according to the ayah grammar note; the generic word irab only reports genitive.
- **36:31:3:** The ayah-level irab identifies declarative kam, overriding the generic interrogative word tag.
- **36:31:6:** The primary irab attaches min al-qurun to an omitted adjective of kam. The common alternative treats al-qurun as a specifying genitive tamyiz with min.
- **36:31:8:** Following the supplied ayah irab, the interpreted masdar is the object of omitted qadayna. Other syntactic treatments exist; none is required for the translation.
- **36:32:1:** The word-level COND label and conditional irab conflict with the ayah note: in is negative here, paired with restrictive lamma.
- **36:32:3:** QAC tags لَّمَّا T, deriving noun, but the primary 36:32 verse i‘rab explicitly calls لما أداة حصر بمعنى إلا, paired with negative إن. Follow the restrictive-particle analysis, not temporal or jussive lamma. The effective app word type is particle; preserve raw QAC tags and exact Arabic.
- **36:33:1:** The ayah-level irab calls waw resumptive, whereas the word-level segmentation and irab call it coordinating. The lesson follows the ayah note.
- **36:34:3:** QAC marks jannat genitive, including in the generated word irab. It is the first object of jaalna, accusative with kasra as a sound feminine plural.
- **36:34:1:** The lesson follows the supplied two-object analysis with fiha attached to an omitted second object. A common alternative reads jaala as placing or creating with one object and fiha attached directly to the verb.
- **36:35:4:** The ayah grammar note treats ma as relative, coordinated with thamarihi, whereas the word-level morphology and irab explicitly mark negation. The supplied translations and Muyassar/Sadi also support negation. The lesson follows negative ma; the relative reading would include what their hands produce.
- **36:35:3:** The suffix is taken as referring to Allah, attributing the fruit to its Creator, consistent with the supplied Sahih translation. Returning it to the preceding vegetation or gardens understood collectively is another analysis.
- **36:35:7:** Fa is taught as supplemental/extra in accordance with the word-level QAC irab; coordination is another grammatical analysis.
- **36:37:4:** The raw QAC lemma is an imperfect form. The lesson uses the reviewed lexeme past salakha and its attested fataha-class imperfect; the lexeme also records a lexical alternative with damma.
- **36:37:7:** The ayah grammar note explicitly coordinates the fa-idha clause with naslakhu; the word-level line calls fa resumptive. Following the ayah note, fa is taught as coordinating. Idha is surprise idha, retaining the app noun/adverb type.
- **36:37:3:** The night word is kept as one learner segment because its Uthmani spelling merges the article lam with the root-initial lam in one shadda. Morphology explains the article; the raw QAC slice yl is not an independent learner stem.
- **36:38:1:** Followed the ayah i‘rab: the sun is coordinated with the night in 36:37 and the following verbal clause is circumstantial. The common independent mubtada–khabar analysis is not used here.
- **36:38:3:** QAC tags mustaqarr as a form X passive participle. Explained its passive-participle shape and contextual place/time sense, consistent with the supplied root entry; the destination is not restricted to a specific physical location or date.
- **36:38:7:** The generated word i‘rab calls al-aziz a genitive adjective. It is an adjective used substantivally as the genitive complement of taqdir (or an adjective of an understood divine name); al-alim is its following adjective. The fixed adjective POS is retained.
- **36:39:2:** The word-level i‘rab calls the suffix a direct object, while the ayah note explicitly takes it as accusative after omission of the preposition: qaddarna lahu manazil. Followed that more detailed analysis; manazil is the stated object, not a second object.
- **36:39:4:** Followed the supplied analysis of hatta as a preposition governing an interpreted masdar with an elided an. An inceptive hatta introducing the past-tense clause is another analysis.
- **36:39:5:** Followed the ordinary-verb analysis: ada has a hidden subject and the simile is circumstantial. Alternatively ada can mean sara, became, with the simile as its predicate; the supplied lexeme acknowledges this.
- **36:40:9:** The written definite article and initial radical lam share one shadda-bearing lam in the Uthmani spelling. Kept the whole word as one learner segment to avoid treating the residual yl as an independent lexical stem.
- **36:40:12:** Explained kullun with compensatory tanwin for its omitted complement, following the supplied root entry; did not apply the ordinary indefinite-tanwin rule despite QAC INDEF.
- **36:40:15:** Separated the plural subject waw from the following indicative nun for teaching; QAC groups both as the suffix un(a). The verified citation form sabaha is used instead of the raw imperfect lemma handle.
- **36:41:5:** The translation retains the lexical sense of offspring/lineage. Many provided commentators interpret the referent as forefathers aboard Noah’s ship; al-Saadi also develops a later-descendants interpretation in the commentary supplied under 36:43. Both are acknowledged in the tafsir.
- **36:42:3:** The prepositional phrase is attached to an implied haal of the relative pronoun, following the supplied ayah i‘rab, rather than directly to the verb of creation.
- **36:43:4:** The word-level line calls faa resumptive, whereas the ayah-level i‘rab explicitly coordinates the laa-sareekh clause with nughriqhum. The lesson follows the ayah-level coordination analysis; faa expresses the consequence, not the start of the conditional answer.
- **36:43:5:** QAC gives a generic accusative noun label. As the non-mudaaf ism of laa negating the entire class, sareekh is more precisely built on fatha in an accusative position, not an ordinary declinable accusative.
- **36:45:7:** The supplied QAC case tag and generated word i‘rab say nominative, but aydikum is necessarily genitive as the mudaaf ilayh of bayna. Its genitive kasra is estimated on final yaa. The lesson corrects the case and retains the fixed POS and root.
- **36:45:2:** The supplied i‘rab identifies the passive verb but does not specify its naaib faa‘il. The lesson leaves that point open: grammarians may treat the quoted content as occupying the passive-subject position or posit a pronoun referring to the verbal noun.
- **36:45:** The omitted conditional answer is supplied in parentheses in the translation, following the ayah i‘rab and tafsir: they turn away. The before/behind expressions remain broad in translation; provided tafsir explains worldly/otherworldly punishments and also discusses sins and future consequences.
- **36:41:3:** The contracted anna form contains the first-person plural ism; its final alif is only the remaining written part of naa in the packet segmentation. Segment labels avoid treating that alif as an independent pronoun. The analogous fused spelling in 36:44:3 has actual noon assimilation.
- **36:46:9:** Followed the ayah grammar note in treating the kana clause as a hal of the negated indefinite ayah; the resumptive pronoun is ha in anha.
- **36:47:2:** The packet specifies the passive verb but does not settle its naib fail. The lesson identifies the following imperative as the content said without fixing its formal analysis; the quoted clause and an implied pronoun referring to the verbal noun are alternative analyses.
- **36:47:16:** Followed the reviewed lexeme paradigm sha’a–yasha’u, bab sami‘a. Law is non-jussive, so the occurrence remains indicative with visible damma despite its hypothetical meaning.
- **36:48:4:** The ayah note makes the predicate of the demonstrative implicit. The following definite noun is taught as badal; atf bayan is also possible. The supplied word-level irab only specifies nominative.
- **36:49:2:** The raw QAC lemma carries a leading assimilation shadda. The citation form is normalized to nazara as in the reviewed lexeme; the occurrence is Form I active, meaning await.
- **36:50:1:** The occurrence prefix and word-level irab call fa resumptive, but the ayah grammar note explicitly coordinates the clause with yakhissimun. The lesson follows the ayah-level syntax and uses conjunction, recording the resumptive alternative here.
- **36:51:4:** The word-level entry tags idha as a time adverb, whereas the ayah note explicitly calls it sudden-event idha. The fixed noun type is retained with surprise-idha; no conditional answer is taught. Grammarians also analyze sudden-event idha as a particle.
- **36:51:** Muyassar and Sadi count the resurrection blast as the second, while the supplied Ibn Kathir excerpt calls it the third after distinguishing terror and death. The tafsir states both enumerations without choosing one.
- **36:52:2:** Followed the supplied correction and ayah grammar: the annexed vocative is accusative with visible fatha, not nominative as the raw QAC morphology and generated word irab state.
- **36:52:3:** The raw REL tag and generated word irab conflict with the ayah grammar and the question. Analysed man as an interrogative noun in the nominative position of mubtada, with the following verbal clause as its predicate.
- **36:52:7:** Followed the ayah grammar and Muyassar in treating the demonstrative clause as a new reply introduced by an implied saying. The packet does not identify the speaker, so the lesson does not assign one.
- **36:53:2:** Used incomplete kana with an implicit feminine ism referring to the resurrection-event and sayhatan as its accusative predicate; the feminine ta is a marker, not a subject pronoun.
- **36:53:6:** Followed the ayah grammar in treating fa as coordinating, rather than the word-level REM/generated resumptive label. Idha expresses suddenness before a nominal clause; retained the app noun/adverb type, while using surprise-idha rather than the conditional rule. A particle analysis of sudden idha is also known.
- **36:53:8:** Followed the ayah grammar: jamiun is the first predicate and muhdarun is the second predicate; ladayna attaches to the latter. Jamiun is not an accusative hal or a formal emphatic follower here.
- **36:54:1:** Followed the ayah grammar: fa is coordinating, despite the word-level REM/generated resumptive label. The time adverb attaches to la tuzlamu; the larger speech context contains an implied saying.
- **36:54:3:** Followed the supplied correction: tuzlamu is passive indicative, with visible final damma after negative la; nafsun is its deputy subject. Raw QAC morphology and generated word irab incorrectly label it active/jussive.
- **36:54:5:** Followed the ayah grammar in taking shayan as a substitute cognate accusative expressing any degree of wrongdoing, rather than as a direct object.
- **36:54:9:** Followed the ayah grammar and the passive lexeme entry in taking relative ma as the second object of tujzawna. The resumptive object pronoun in the relative clause is elided.
- **36:59:3:** QAC labels the noun NOM generically. In this vocative, ayyu is built on damma in an accusative position, with an omitted ya; ha is the attention particle. The lesson follows the guide and vocative rule rather than calling it a declinable nominative.
- **36:56:6:** The singular dictionary lemma is arikah, following the reviewed root entry, rather than the plural QAC lemma. QAC labels the occurrence masculine plural; the lesson states its plural pattern without inferring masculine gender for the feminine singular lemma.
- **36:60:4:** QAC marks the noun nominative and supplies the diminutive lemma بُنَىّ. The vocalized plural is a mudaf munada, accusative with ya, with nun omitted for idafa; the singular lemma is اِبْن.
- **36:60:5:** QAC labels Adam accusative, but it is mudaf ilayh after bani: genitive with fatha in place of kasra because the proper name is diptote.
- **36:62:4:** QAC tags this noun feminine plural with lemma جِبِلَّة, while the following adjective is explicitly masculine singular. The lesson retains the supplied dictionary lemma and teaches the attested collective sense (a multitude of people), noting the singular masculine modifier without treating this as a sound feminine plural.
- **36:62:6:** The supplied word irab calls the fa extra (زائدة); the lesson follows it. A common alternative treats this fa as a coordinating or consequential link after the interrogative hamza.
- **36:62:8:** The raw QAC lemma is عَقَلُ. The lesson uses the reviewed lexeme paradigm عَقَلَ / يَعْقِلُ, bab daraba. The indicative verb heads the clause functioning as kana khabar; the clause position does not make the internal verb subjunctive.
- **36:64:3:** The ayah grammar note explicitly takes ma as masdariyya and the ba as causal; the lexical segmentation calls ma REL and the fixed derived POS is pronoun. Primary syntax follows the ayah note; the relative alternative is acknowledged in the word label. No shared data changed.
- **36:66:6:** The word-level prefix tag and generated irab call fa resumptive, but the ayah grammar note explicitly coordinates fastabaqu with tamasna. Followed the ayah syntax, using conjunction rather than resumption. This is active perfect Form VIII, not imperative or Form X.
- **36:66:8:** The word-level prefix tag and generated irab call fa resumptive; the ayah grammar note calls it coordinating and places anna in accusative position as hal. Followed the ayah note.
- **36:67:6:** The word-level prefix tag and generated irab call fa resumptive, whereas the ayah grammar note coordinates ma istatau with the conditional answer. Followed the ayah note.
- **36:67:5:** Kept the supplied root k-w-n for makana. The root entry notes an alternative derivation from m-k-n; no etymological certainty is claimed.
- **36:66:** The supplied abridged Ibn Kathir field refers to grouped commentary beginning at 36:63 without supplying its text. Tafsir uses the available Muyassar and Sadi texts. At 36:66 Sadi connects the path with the route to salvation; this is presented as an interpretation rather than the only reading.
- **36:68:1:** The word-level REL tag and generated relative-pronoun label conflict with the two jussive verbs and the ayah note calling this a conditional sentence. Followed the conditional analysis of man, as explicitly required by the relative and conditional-jazm rule boundaries.
- **36:69:11:** Overrode QAC's PN tag and generated proper-noun label: quran here is an indefinite common noun denoting the revealed recitation, consistent with QAC's INDEF tag and the following indefinite adjective mubin. Treating it as a definite proper name would contradict this attributive analysis.
- **36:70:1:** Took the hidden 3MS subject to refer to the Quran, consistent with Taqi Usmani and the grouped Ibn Kathir commentary. Reference to the Prophet is also a recognized reading of the subject; both preserve the supplied active 3MS subjunctive morphology. The ayah syntax attaches the purpose masdar to an implied verb meaning He sent it down.
- **36:71:2:** Followed the ayah syntax note, which explicitly gives the anna clause the slot of a singular object of yaraw. A knowledge-based reading of raa can instead make the clause fill two object slots; no two-objects or zanna rule was assigned here.
- **36:71:10:** The word-level analysis calls fa resumptive, while the ayah syntax note explicitly coordinates the nominal sentence with amilat. Followed the ayah-level conjunction analysis; the resumptive analysis is the alternative.
- **36:68:6:** Retained the supplied supplemental/extra analysis of fa after the interrogative hamza; many grammarians instead treat it as a conjunction. The same source-based choice applies to wa in 36:71:1.
- **36:72:1:** The raw QAC lemma is the passive inflected ذُلِّلَتْ; the occurrence is active first-person plural. The active dictionary lemma and paradigm follow the reviewed lexeme ذَلَّلَ / يُذَلِّلُ.
- **36:72:3:** The word-level QAC labels the fa as resumptive, while the ayah note calls the ensuing nominal clause coordinated. The lesson retains the word-level resumption label and explains the result/detail connection.
- **36:73:2:** The supplied word-level irab only says prepositional phrase. It is attached here to an implied haal describing the fronted benefits, while ولهم is the fronted predicate; attachment to the benefits themselves is another possible analysis.
- **36:73:5:** Fa follows the supplied word-level زائد analysis; many grammarians instead describe this connective as coordinating.
- **36:74:1:** The word-level irab calls waw coordinating, whereas the ayah note calls the entire clause resumptive. Both source descriptions are distinguished explicitly in syntaxUrdu.
- **36:74:5:** اتخذ is treated here as taking one object, آلهة, in the sense of adopting deities; مِن دون الله follows the provided attachment to an implied haal of that object.
- **36:75:4:** Translation and word glosses follow the worshippers-as-troops interpretation reflected in both English translations and the Qatadah/Hasan report in the supplied grouped Ibn Kathir at 36:74. وهم refers to worshippers and لهم to their deities. Muyassar and Sadi emphasize joint attendance for punishment; the Mujahid report takes the idols as present at their worshippers accounting. The tafsir records the significant eschatological alternative without presenting the earthly interpretation as unanimous.
- **36:75:7:** محضرون follows the ayah irab as an adjective of the collective جند, with plural agreement by meaning. It remains a form IV passive participle, not a passive finite verb.
- **36:76:2:** The jussive sukun on the final root nun is not graphically marked in the exact Uthmani word; morphology follows the prohibitive la and QAC JUS. The visible explicit subject is قولهم, and ك is the object.
- **36:76:4:** Exact-string segmentation follows QAC إِنَّ + ا. The alif segment represents the written remainder of first-person plural نا in the contracted إِنَّا (from إِنَّنَا, with one of the three nuns omitted for lightness); it is not an independent alif pronoun.
- **36:77:1:** Followed the supplied word i‘rab and extra-particle rule for supplemental waw after the question hamza; coordination is a known alternative.
- **36:77:4:** The contracted anna + na is kept as one exact segment because a spelling-based split cannot show both morphemes independently. Both grammatical roles are explained together.
- **36:77:8:** The ayah grammar calls idha sudden and coordinates the whole nominal clause with the opening clause. Followed that syntax rather than the generated temporal-adverb and resumptive-fa line; retained the fixed noun type.
- **36:77:11:** Followed the ayah grammar: mubin is a second predicate. The generated word-level i‘rab instead says adjective; adjective of khasim is an alternative.
- **36:78:7:** Raw QAC and generated i‘rab label man relative, but the interrogative context, tafsir and correction on the following verb require interrogative man, analyzed here as mubtada.
- **36:78:8:** Applied the explicit packet qacCorrection: this is an indicative imperfect, not jussive. Final ya is dropped in connected recitation to avoid two consecutive sukuns before the definite article and is also omitted in Uthmani spelling; the indicative damma remains implied. This is not jussive deletion.
- **36:78:9:** Used singular lemma عَظْم, consistent with the supplied root entry and the meaning bones. The raw QAC lemma عَظِيم is not the intended lexeme here.
- **36:79:5:** Followed the ayah grammar in treating awwal as a substitute cognate object, originally an adjective of an omitted verbal noun; a temporal-adverb analysis is also common.
- **36:79:6:** QAC labels marra masculine, but its vocalized form and ordinary grammatical gender are feminine. Corrected the gender in the lesson.
- **36:79:7:** Followed the ayah grammar in coordinating the nominal clause with ansha’aha, not treating the waw as circumstantial.
- **36:79:10:** Alim is an intensive adjective morphologically and the predicate of huwa syntactically, as the ayah grammar states. The generated word-level line only labels it a nominative adjective.
- **36:80:2:** Followed the ayah i‘rab: lakum attaches to an omitted second object of ja‘ala and min al-shajar to an omitted hal of naran. The common one-object analysis of ja‘ala meaning create is an alternative.
- **36:80:8:** Idha before antum is treated as sudden-presentational rather than conditional. Retained the packet noun/adverb word type; grammarians also analyse sudden idha as a particle.
- **36:81:1:** Followed the word i‘rab and rule library in calling the waw supplemental. Coordination or resumption is another grammatical analysis.
- **36:81:4:** QAC morphology tags GEN and the generated word i‘rab says genitive. Corrected to accusative direct object of khalaqa: the kasra is the accusative sign of the sound feminine plural, also confirmed by coordinated al-arda.
- **36:81:14:** The ayah i‘rab explicitly makes al-‘alim a second predicate, while the word i‘rab calls it an adjective. Followed the ayah-level syntax; retained its adjective word class and intensive morphology.
- **36:82:10:** Followed the ayah grammar note: fa is resumptive and the complete indicative yakunu clause is the predicate of an omitted mubtada. Word segmentation/i‘rab instead labels fa coordinating; did not treat it as causing subjunctive mood.

## Per-ayah sources

- **36:1:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=1); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=1); [Quran.com](https://quran.com/36/1).
- **36:2:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=2); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=2); [Quran.com](https://quran.com/36/2).
- **36:3:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=3); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=3); [Quran.com](https://quran.com/36/3).
- **36:4:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=4); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=4); [Quran.com](https://quran.com/36/4).
- **36:5:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=5); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=5); [Quran.com](https://quran.com/36/5).
- **36:6:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=6); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=6); [Quran.com](https://quran.com/36/6).
- **36:7:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=7); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=7); [Quran.com](https://quran.com/36/7).
- **36:8:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=8); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=8); [Quran.com](https://quran.com/36/8).
- **36:9:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=9); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=9); [Quran.com](https://quran.com/36/9).
- **36:10:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=10); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=10); [Quran.com](https://quran.com/36/10).
- **36:11:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=11); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=11); [Quran.com](https://quran.com/36/11).
- **36:12:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=12); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=12); [Quran.com](https://quran.com/36/12).
- **36:13:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=13); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=13); [Quran.com](https://quran.com/36/13).
- **36:14:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=14); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=14); [Quran.com](https://quran.com/36/14).
- **36:15:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=15); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=15); [Quran.com](https://quran.com/36/15).
- **36:16:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=16); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=16); [Quran.com](https://quran.com/36/16).
- **36:17:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=17); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=17); [Quran.com](https://quran.com/36/17).
- **36:18:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=18); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=18); [Quran.com](https://quran.com/36/18).
- **36:19:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=19); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=19); [Quran.com](https://quran.com/36/19).
- **36:20:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=20); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=20); [Quran.com](https://quran.com/36/20).
- **36:21:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=21); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=21); [Quran.com](https://quran.com/36/21).
- **36:22:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=22); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=22); [Quran.com](https://quran.com/36/22).
- **36:23:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=23); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=23); [Quran.com](https://quran.com/36/23).
- **36:24:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=24); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=24); [Quran.com](https://quran.com/36/24).
- **36:25:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=25); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=25); [Quran.com](https://quran.com/36/25).
- **36:26:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=26); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=26); [Quran.com](https://quran.com/36/26).
- **36:27:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=27); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=27); [Quran.com](https://quran.com/36/27).
- **36:28:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=28); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=28); [Quran.com](https://quran.com/36/28).
- **36:29:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=29); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=29); [Quran.com](https://quran.com/36/29).
- **36:30:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=30); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=30); [Quran.com](https://quran.com/36/30).
- **36:31:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=31); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=31); [Quran.com](https://quran.com/36/31).
- **36:32:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=32); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=32); [Quran.com](https://quran.com/36/32).
- **36:33:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=33); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=33); [Quran.com](https://quran.com/36/33).
- **36:34:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=34); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=34); [Quran.com](https://quran.com/36/34).
- **36:35:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=35); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=35); [Quran.com](https://quran.com/36/35).
- **36:36:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=36); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=36); [Quran.com](https://quran.com/36/36).
- **36:37:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=37); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=37); [Quran.com](https://quran.com/36/37).
- **36:38:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=38); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=38); [Quran.com](https://quran.com/36/38).
- **36:39:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=39); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=39); [Quran.com](https://quran.com/36/39).
- **36:40:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=40); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=40); [Quran.com](https://quran.com/36/40).
- **36:41:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=41); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=41); [Quran.com](https://quran.com/36/41).
- **36:42:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=42); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=42); [Quran.com](https://quran.com/36/42).
- **36:43:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=43); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=43); [Quran.com](https://quran.com/36/43).
- **36:44:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=44); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=44); [Quran.com](https://quran.com/36/44).
- **36:45:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=45); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=45); [Quran.com](https://quran.com/36/45).
- **36:46:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=46); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=46); [Quran.com](https://quran.com/36/46).
- **36:47:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=47); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=47); [Quran.com](https://quran.com/36/47).
- **36:48:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=48); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=48); [Quran.com](https://quran.com/36/48).
- **36:49:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=49); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=49); [Quran.com](https://quran.com/36/49).
- **36:50:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=50); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=50); [Quran.com](https://quran.com/36/50).
- **36:51:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=51); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=51); [Quran.com](https://quran.com/36/51).
- **36:52:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=52); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=52); [Quran.com](https://quran.com/36/52).
- **36:53:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=53); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=53); [Quran.com](https://quran.com/36/53).
- **36:54:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=54); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=54); [Quran.com](https://quran.com/36/54).
- **36:55:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=55); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=55); [Quran.com](https://quran.com/36/55).
- **36:56:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=56); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=56); [Quran.com](https://quran.com/36/56).
- **36:57:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=57); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=57); [Quran.com](https://quran.com/36/57).
- **36:58:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=58); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=58); [Quran.com](https://quran.com/36/58).
- **36:59:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=59); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=59); [Quran.com](https://quran.com/36/59).
- **36:60:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=60); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=60); [Quran.com](https://quran.com/36/60).
- **36:61:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=61); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=61); [Quran.com](https://quran.com/36/61).
- **36:62:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=62); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=62); [Quran.com](https://quran.com/36/62).
- **36:63:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=63); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=63); [Quran.com](https://quran.com/36/63).
- **36:64:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=64); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=64); [Quran.com](https://quran.com/36/64).
- **36:65:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=65); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=65); [Quran.com](https://quran.com/36/65).
- **36:66:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=66); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=66); [Quran.com](https://quran.com/36/66).
- **36:67:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=67); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=67); [Quran.com](https://quran.com/36/67).
- **36:68:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=68); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=68); [Quran.com](https://quran.com/36/68).
- **36:69:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=69); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=69); [Quran.com](https://quran.com/36/69).
- **36:70:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=70); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=70); [Quran.com](https://quran.com/36/70).
- **36:71:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=71); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=71); [Quran.com](https://quran.com/36/71).
- **36:72:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=72); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=72); [Quran.com](https://quran.com/36/72).
- **36:73:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=73); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=73); [Quran.com](https://quran.com/36/73).
- **36:74:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=74); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=74); [Quran.com](https://quran.com/36/74).
- **36:75:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=75); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=75); [Quran.com](https://quran.com/36/75).
- **36:76:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=76); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=76); [Quran.com](https://quran.com/36/76).
- **36:77:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=77); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=77); [Quran.com](https://quran.com/36/77).
- **36:78:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=78); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=78); [Quran.com](https://quran.com/36/78).
- **36:79:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=79); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=79); [Quran.com](https://quran.com/36/79).
- **36:80:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=80); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=80); [Quran.com](https://quran.com/36/80).
- **36:81:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=81); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=81); [Quran.com](https://quran.com/36/81).
- **36:82:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=82); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=82); [Quran.com](https://quran.com/36/82).
- **36:83:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=36&verse=83); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=36&verse=83); [Quran.com](https://quran.com/36/83).

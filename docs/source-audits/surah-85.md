# Surah 85 — Al-Buruj: source audit

Researched 2026-11-13. This lesson contains **22 ayahs and 109 word occurrences**. All Urdu word glosses, translations, grammatical explanations, dictionary summaries, verb-paradigm notes and concise tafsir notes are original AI-assisted editorial drafts. They are **not scholar-reviewed** and are not attributed to a named Urdu translator. No third-party Urdu book, dictionary, translation or tafsir was imported.

## Arabic inventory

`inventory-85.json` records the Quran.com Content API v4 `text_uthmani` word strings ([source](https://api.quran.com/api/v4/verses/by_chapter/85?words=true&word_fields=text_uthmani&per_page=50)), retrieved 2026-11-13, excluding end-of-ayah markers. Recitation signs that the API separates from a word by a space — waqf signs, the saktah sign, the sajdah sign and the rub al-hizb marker — are not part of the stored word token, following the Surahs 110–114 precedent. The inventory lists all 2 such exclusions with the original API text; no other character was changed. The unnumbered opening basmalah is not inserted as a numbered occurrence. Automated tests compare every stored word, its id and its segments with this inventory.

Word boundaries and counts match the Quranic Arabic Corpus morphology for every ayah. Per-ayah word counts: 3, 2, 2, 3, 3, 4, 6, 9, 10, 14, 14, 4, 4, 3, 3, 3, 4, 2, 5, 4, 4, 3.

## Sources and method

- **Morphology:** Quranic Arabic Corpus morphology 0.4 (Kais Dukes, GNU GPL with the Corpus terms of use), a verbatim distribution checked by SHA-256 `910b721a8f04f4334ac5d4c62b19e858f5d720c525bb975f2e750ea2c6bb532d`. It was consulted locally for segmentation, part of speech, root, lemma, verb form, voice, mood and case; it is not bundled or redistributed.
- **Word types and roots** are derived deterministically from the Corpus stem tags with the mapping that reproduces root assignments for all 230 word occurrences of the existing lessons, including words with no root. A preposition with an attached pronoun (لَهُ، بِهِ، عَلَيْهِمْ) is a particle, following Surahs 1, 105 and 112. Words without a Corpus root, such as proper names, keep no root.
- **Syntax:** the Corpus word-by-word pages (English morphology and Arabic i‘rab for every word) and verse grammar pages (Arabic i‘rab notes adapted from the Quran Printing Complex), retrieved 2026-11-13. 2 of 22 verse pages carry no grammar note: 3, 21.
- **Verb paradigms** (باب، ماضی، مضارع، وزن) for all 14 verb occurrences come from a shared library of 658 verb lexemes for this expansion edition. Form I vowel classes were decided from imperfects attested across the whole Corpus and standard lexica (Lane, Lisan al-Arab, al-Mu‘jam al-Wasit). The edition’s library review and subsequent corrections are recorded in its handoff and adjudication reports.
- **Tafsir consulted** through the Quran.com API: Tafsir al-Muyassar (Arabic), Tafsir al-Sa‘di (Arabic) and Ibn Kathir (abridged, English). Translations consulted for meaning only: Saheeh International and Mufti Taqi Usmani. The Urdu wording is original and concise; it is not a translation of these works.

Word-type, verb-form and passive-voice counts below apply the adjudicated occurrence overrides; they are not uncorrected Corpus tag counts.

| Measure | Count |
| --- | ---: |
| Nouns | 52 |
| Adjectives | 7 |
| Verbs | 14 |
| Particles | 24 |
| Pronouns | 12 |
| Passive verb occurrences | 1 |
| Distinct roots | 53 |
| Verb form I | 9 |
| Verb form IV | 5 |

## Editorial checks

The lesson is organized into 3 chunks of whole ayahs. No review-result snapshot was supplied. This source audit therefore does not certify completion of independent reviews, fixes or final confirmations. The intended workflow requires independent grammar and meaning/tafsir reviews and a clean final confirmation after every correction, including minor findings.
The chunk validator checks the exact Arabic word, segments that rejoin to the exact word, ids and order, rule references, verb-note presence, phrase coverage of every word, and the absence of URLs or Latin text. AI review and automated checks are not scholarly review.

Nouns without a Corpus root (root left empty): إِذْ، جَهَنَّمَ، ذَاتِ، ذُو، فِرْعَوْنَ، وَثَمُودَ.

## Analysis decisions and cautions

Notes recorded by the authors and reviewers for scholarly review; they mark alternative analyses, source disagreements and editorial choices.

- **85:1:1:** The oath wa governs al-sama'; the jar-majrur is attached to an elided oath verb (uqsimu), as standard; QAC gives only 'jar wa majrur'.
- **85:1:2:** Lemma given as dhu (QAC lemma); dhat is its feminine. Not tagged five-nouns per rule library (dhat declines with kasra).
- **85:3:1:** Tafsir differs on shahid/mashhud: Muyassar (one who witnesses / what is witnessed), Sa'di (general: seer and seen, present and attended). Ibn Kathir cites a narration from Abu Hurayrah (recorded both as the Prophet's saying and as Abu Hurayrah's own statement) that shahid = Friday and mashhud = the Day of Arafah; the lesson mentions it only as 'a narration' without attribution to keep it brief.
- **85:4:1:** QAC grammar note: the qutila clause is the answer of the oath and is a khabar, not a du'a. Sa'di reports this as one view ('wa qila'), calling it a du'a against them, and prefers that the sworn-to content is the signs implied by the oaths; Muyassar glosses lu'ina. Syntax follows QAC; translation shows the imprecatory sense in parentheses, consistent with the lexeme note.
- **85:5:1:** Followed QAC: al-nar is badal ishtimal of al-ukhdud with an implied resumptive pronoun (al-nar fihi).
- **85:6:3:** Muyassar paraphrases 'qu'ud 'ala al-ukhdud'; the feminine pronoun ha grammatically refers to al-nar (the fire in the ditch). The jar-majrur is attached to qu'ud per QAC and placed before it.
- **85:6:4:** QAC tags qu'ud as a verbal noun. The lesson explains it as a predicate describing the subject's state of sitting. The root entry also records qu'ud as a broken plural of qa'id.
- **85:7:1:** QAC i'rab calls this waw 'atifa (coordinating the clause with hum 'alayha qu'ud); a hal reading is conceivable but not adopted.
- **85:7:3:** ma taken as relative with an elided resumptive object pronoun (yaf'alunahu); a masdariyya reading ('their doing') is a possible alternative.
- **85:7:4:** Imperfect used for a past scene; translated as past continuous, matching both English translations.
- **85:8:2:** QAC lemma is the truncated stem naqamu; citation form naqama, present yanqimu per the verified lexeme entry.
- **85:8:6:** Imperfect after an (subjunctive, nun dropped); Muyassar and Sa'di paraphrase as 'an kanu mu'minin / annahum kanu yu'minun', hence 'used to believe'.
- **85:8:8:** al-'aziz tagged resembling-adjective (fa'il of intransitive 'azza); some classify it as an intensive. al-hamid (fa'il in the sense of mahmud) was given no pattern rule, to avoid choosing between intensive and resembling-adjective.
- **85:9:6:** The word-level tag and generated i‘rab classify the waw as coordinating. The ayah-level i‘rab treats the entire nominal clause as independent, so the lesson uses resumptive waw.
- **85:10:9:** The word-level tag and generated i‘rab call the fa resumptive. The ayah-level i‘rab calls it extra, linking the predicate of inna because the relative subject has conditional force. The lesson follows the ayah-level analysis.
- **85:13:2:** The packet treats the detached pronoun as emphasis of the attached hāʾ, in accusative position. An alternative parses it as an inner mubtada with the verbal clause as its predicate.
- **85:15:3:** The word-level line calls it a nominative adjective, the ayah note a fourth predicate, and Saʿdi describes the nominative as an attribute of Allah. Saʿdi also records the genitive reading, in which it modifies the Throne.
- **85:16:1:** QAC broadly tags this as an active participle. The specific faʿʿāl pattern is an intensive noun, so the intensive rule is used.
- **85:16:2:** The word line gives a prepositional construction; the ayah note identifies the lām as strengthening and the relative mā as the intensive noun’s object.
- **85:20:3:** The packet indexes warāʾ under w-r-y and notes that some lexicographers treat the final hamza as radical and index it under w-r-ʾ.
- **85:21:1:** QAC tags bal as CONJ and the word line calls it a conjunction. Before a full nominal clause it functions as a clause-opening particle of iḍrāb, so the lesson uses the retraction rule.
- **85:21:3:** QAC labels the word PN and also marks it indefinite. The lesson follows the indefinite predicate construction supported by the agreeing adjective while retaining the contextual reference to the revealed Quran.

## Per-ayah sources

- **85:1:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=85&verse=1); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=85&verse=1); [Quran.com](https://quran.com/85/1).
- **85:2:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=85&verse=2); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=85&verse=2); [Quran.com](https://quran.com/85/2).
- **85:3:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=85&verse=3); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=85&verse=3); [Quran.com](https://quran.com/85/3).
- **85:4:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=85&verse=4); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=85&verse=4); [Quran.com](https://quran.com/85/4).
- **85:5:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=85&verse=5); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=85&verse=5); [Quran.com](https://quran.com/85/5).
- **85:6:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=85&verse=6); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=85&verse=6); [Quran.com](https://quran.com/85/6).
- **85:7:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=85&verse=7); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=85&verse=7); [Quran.com](https://quran.com/85/7).
- **85:8:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=85&verse=8); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=85&verse=8); [Quran.com](https://quran.com/85/8).
- **85:9:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=85&verse=9); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=85&verse=9); [Quran.com](https://quran.com/85/9).
- **85:10:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=85&verse=10); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=85&verse=10); [Quran.com](https://quran.com/85/10).
- **85:11:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=85&verse=11); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=85&verse=11); [Quran.com](https://quran.com/85/11).
- **85:12:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=85&verse=12); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=85&verse=12); [Quran.com](https://quran.com/85/12).
- **85:13:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=85&verse=13); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=85&verse=13); [Quran.com](https://quran.com/85/13).
- **85:14:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=85&verse=14); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=85&verse=14); [Quran.com](https://quran.com/85/14).
- **85:15:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=85&verse=15); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=85&verse=15); [Quran.com](https://quran.com/85/15).
- **85:16:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=85&verse=16); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=85&verse=16); [Quran.com](https://quran.com/85/16).
- **85:17:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=85&verse=17); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=85&verse=17); [Quran.com](https://quran.com/85/17).
- **85:18:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=85&verse=18); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=85&verse=18); [Quran.com](https://quran.com/85/18).
- **85:19:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=85&verse=19); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=85&verse=19); [Quran.com](https://quran.com/85/19).
- **85:20:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=85&verse=20); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=85&verse=20); [Quran.com](https://quran.com/85/20).
- **85:21:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=85&verse=21); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=85&verse=21); [Quran.com](https://quran.com/85/21).
- **85:22:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=85&verse=22); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=85&verse=22); [Quran.com](https://quran.com/85/22).

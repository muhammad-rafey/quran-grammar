# Surah 98 — Al-Bayyinah: source audit

Researched 2026-11-13. This lesson contains **8 ayahs and 94 word occurrences**. All Urdu word glosses, translations, grammatical explanations, dictionary summaries, verb-paradigm notes and concise tafsir notes are original AI-assisted editorial drafts. They are **not scholar-reviewed** and are not attributed to a named Urdu translator. No third-party Urdu book, dictionary, translation or tafsir was imported.

## Arabic inventory

`inventory-98.json` records the Quran.com Content API v4 `text_uthmani` word strings ([source](https://api.quran.com/api/v4/verses/by_chapter/98?words=true&word_fields=text_uthmani&per_page=50)), retrieved 2026-11-13, excluding end-of-ayah markers. Recitation signs that the API separates from a word by a space — waqf signs, the saktah sign, the sajdah sign and the rub al-hizb marker — are not part of the stored word token, following the Surahs 110–114 precedent. The inventory lists all 4 such exclusions with the original API text; no other character was changed. The unnumbered opening basmalah is not inserted as a numbered occurrence. Automated tests compare every stored word, its id and its segments with this inventory.

Word boundaries and counts match the Quranic Arabic Corpus morphology for every ayah. Per-ayah word counts: 12, 6, 3, 11, 16, 16, 9, 21.

## Sources and method

- **Morphology:** Quranic Arabic Corpus morphology 0.4 (Kais Dukes, GNU GPL with the Corpus terms of use), a verbatim distribution checked by SHA-256 `910b721a8f04f4334ac5d4c62b19e858f5d720c525bb975f2e750ea2c6bb532d`. It was consulted locally for segmentation, part of speech, root, lemma, verb form, voice, mood and case; it is not bundled or redistributed.
- **Word types and roots** are derived deterministically from the Corpus stem tags with the mapping that reproduces root assignments for all 230 word occurrences of the existing lessons, including words with no root. A preposition with an attached pronoun (لَهُ، بِهِ، عَلَيْهِمْ) is a particle, following Surahs 1, 105 and 112. Words without a Corpus root, such as proper names, keep no root.
- **Syntax:** the Corpus word-by-word pages (English morphology and Arabic i‘rab for every word) and verse grammar pages (Arabic i‘rab notes adapted from the Quran Printing Complex), retrieved 2026-11-13. All 8 verse pages carry a grammar note.
- **Verb paradigms** (باب، ماضی، مضارع، وزن) for all 18 verb occurrences come from a shared library of 657 verb lexemes for this expansion edition. Form I vowel classes were decided from imperfects attested across the whole Corpus and standard lexica (Lane, Lisan al-Arab, al-Mu‘jam al-Wasit), and every entry was independently reviewed.
- **Tafsir consulted** through the Quran.com API: Tafsir al-Muyassar (Arabic), Tafsir al-Sa‘di (Arabic) and Ibn Kathir (abridged, English). Translations consulted for meaning only: Saheeh International and Mufti Taqi Usmani. The Urdu wording is original and concise; it is not a translation of these works.

Word-type, verb-form and passive-voice counts below apply the adjudicated occurrence overrides; they are not uncorrected Corpus tag counts.

| Measure | Count |
| --- | ---: |
| Nouns | 42 |
| Adjectives | 2 |
| Verbs | 18 |
| Particles | 20 |
| Pronouns | 12 |
| Passive verb occurrences | 2 |
| Distinct roots | 42 |
| Verb form I | 13 |
| Verb form IV | 4 |
| Verb form V | 1 |

## Editorial checks

The lesson is organized into 3 chunks of whole ayahs. No review-result snapshot was supplied. This source audit therefore does not certify completion of independent reviews, fixes or final confirmations. The intended workflow requires independent grammar and meaning/tafsir reviews and a clean final confirmation after every correction, including minor findings.
The chunk validator checks the exact Arabic word, segments that rejoin to the exact word, ids and order, rule references, verb-note presence, phrase coverage of every word, and the absence of URLs or Latin text. AI review and automated checks are not scholarly review.

Nouns without a Corpus root (root left empty): جَهَنَّمَ، عَدْنٍۢ.

## Analysis decisions and cautions

Notes recorded by the authors and reviewers for scholarly review; they mark alternative analyses, source disagreements and editorial choices.

- **98:1:1:** Identity of al-bayyina: Muyassar takes it as the sign promised in earlier scriptures; Ibn Kathir as the Qur'an; Sa'di as clear evidence, explained in 98:2 as the Messenger. Tafsir summary presents these as differing views.
- **98:1:2:** يَكُنِ: jussive by لَمْ with sukun, changed to kasra to avoid two sakins before the lam of ٱلَّذِينَ; kana here is naqisa (i'rab: منفكين خبر كان).
- **98:1:5:** i'rab attaches من أهل to an implied hal of the subject of كفروا. Whether مِنْ is bayaniyya (explicative) or tab'idiyya (partitive) is debated; the lesson presents it as specifying the groups.
- **98:1:8:** وَٱلْمُشْرِكِينَ is genitive, coordinated with أَهْلِ (from the People of the Book and from the polytheists), not with ٱلْكِتَـٰبِ.
- **98:1:9:** مُنفَكِّينَ: i'rab says from the complete (تامّ) انفكّ, i.e. 'desisting/separating', not the incomplete ما انفكّ. Lemma written as singular base مُنْفَكّ (QAC LEM مُنفَكِّين, plural).
- **98:1:10:** حَتَّىٰ treated as jarra with an implied أَنْ governing تَأْتِيَ; the interpreted masdar attaches to منفكين per the ayah i'rab.
- **98:2:1:** i'rab: رسول is badal kull of البينة (hyperbolically identifying the Messenger with the proof). Alternative: khabar of an implied mubtada' (هي), matching Muyassar's paraphrase «وهي رسول الله».
- **98:2:4:** يَتْلُوا۟: final alif after the radical waw is orthographic only; verb is 3MS indicative with implied damma. Lemma written تَلَا per the reviewed lexeme entry (QAC LEM spelling تَلَىٰ).
- **98:2:5:** Lemma written as singular base صَحِيفَة; QAC LEM is the plural صُحُف.
- **98:2:6:** Lemma written as masculine singular base مُطَهَّر; QAC LEM is feminine مُّطَهَّرَة.
- **98:3:1:** QAC labels the هَا of فِيهَا 'object pronoun'; it is a pronoun governed by the preposition (محل جر). i'rab: the clause فيها كتب قيمة is a na't of صحفا; فيها is khabar muqaddam and كتب mubtada' mu'akhkhar.
- **98:3:3:** Lemma written as masculine base قَيِّم (QAC LEM قَيِّمَة).
- **98:4:6:** QAC 0.4 tags this إِلَّا as CERT ('particle of certainty') with the gloss 'until'. Structurally it is the restriction particle (أداة حصر) after the negated, incomplete clause وَمَا تَفَرَّقَ; written as restriction.
- **98:4:9:** QAC tags مَا as REL (effective pos pronoun), but the ayah i'rab says «ما» مصدرية and the interpreted masdar is mudaf ilayh of بعد; lesson follows the i'rab and labels it a masdar particle (no resumptive pronoun exists). posUrdu therefore deliberately reads مَا مصدریہ, which triggers the validator warning about the effective pos; an adjudicated pos override to particle may be warranted.
- **98:4:1:** Tafsir: Muyassar applies the splitting to the People of the Book over Muhammad's prophethood after his coming; Ibn Kathir also applies it to their differing in their own scriptures after proofs were established. Both presented.
- **98:5:3:** QAC 0.4 tags this إِلَّا as CERT with i‘rab «حرف تحقيق». Structurally it follows negative مَا with no stated mustathna minhu (استثناء مفرّغ), so it is written as a particle of restriction (أداة حصر) with the restriction rule. Reviewer should confirm.
- **98:5:4:** Followed QAC: lām of purpose (لام التعليل) with an implied أَنْ; the interpreted masdar attaches to أُمِرُوٓا۟. Sa‘di paraphrases «إلا أن يعبدوا»; some grammarians treat a lām after verbs of commanding as standing in place of أَنْ. Not mentioned in the Urdu.
- **98:5:16:** QAC gives a plain genitive noun (muḍāf ilayh). The common classical reading assumes an elided qualified noun (دين الملة القيمة); mentioned in syntaxUrdu as an alternative. Tagged resembling-adjective because قَيِّم is the فَيْعِل adjective listed in that rule.
- **98:6:7:** Followed QAC (GEN, coordinated with أَهْلِ under مِنْ). The ending ـِينَ would also fit coordination with the accusative ٱلَّذِينَ, but the tafsir (Muyassar) reads the phrase as 'those who disbelieved from the Jews, Christians and polytheists', supporting the genitive.
- **98:6:10:** QAC i‘rab says ممنوع من الصرف without giving a cause; the Urdu states only that it is a diptote proper noun and does not name the cause (commonly given as proper name + feminine, or foreignness).
- **98:6:14:** Followed QAC: هُمْ is ضمير فصل. Alternative analysis (second mubtada with شَرُّ as its khabar, the clause being khabar of أُو۟لَـٰٓئِكَ) mentioned briefly in syntaxUrdu.
- **98:6:16:** Root entry notes a reading with hamza (البريئة); the lesson follows the packet's Ḥafṣ text and does not discuss the variant reading. Tagged hamzated because the radical hamza of ب ر أ became yāʾ and merged.
- **98:7:5:** QAC: accusative feminine plural active participle, object of عملوا. Taught as a participle used substantively (adjective of an elided noun such as الأعمال); kasra marks nasb.
- **98:7:7:** Ayah i‘rab: هم is ضمير فصل and the clause أولئك هم خير is khabar of إنّ. Alternative analysis (هم second mubtada, خير its khabar, clause khabar of أولئك) mentioned briefly.
- **98:7:8:** QAC tags خير as a plain noun; in خير البرية it has elative sense (best), so the comparative rule is used and the word type kept as noun.
- **98:7:9:** Root ب ر أ per QAC and the root entry (hamza assimilated into the ya; a reading with hamza exists). Some lexicographers propose other derivations; not taught.
- **98:8:1:** QAC morphology says noun; the ayah grammar note calls جزاؤهم a masdar (عند متعلق بالمصدر), so verbal-noun is used.
- **98:8:2:** Followed the QAC note: عند attaches to the masdar جزاؤهم. Some i‘rab works attach it to an implied ḥāl; not taught.
- **98:8:5:** QAC: proper noun, no root, munsarif (tanwin). Its sense (residence/permanence) is given only from the provided tafsir (جنات إقامة); no etymology taught.
- **98:8:6:** QAC lemma id جَرَيْ is not a citation form; lemma written جَرَى per the lexeme entry. Clause is ḥāl of جنات per the ayah note (definite through annexation to the proper name عدن).
- **98:8:10:** QAC i‘rab gives only اسم منصوب; the ayah note does not name the ṣāḥib al-ḥāl. Taught as ḥāl from the pronoun هم of جزاؤهم (governed by the masdar); other i‘rab works treat it as an anticipated ḥāl (حال مقدرة) with an implied verb such as يدخلونها.
- **98:8:13:** The QAC lemma رَّضِىَ carries the shadda produced by idgham of the preceding tanwin; lemma written رَضِيَ per the lexeme entry, and the lesson explains the shadda.
- **98:8:19:** مَن taken as relative (QAC REL; perfect verb, no jussive, no conditional answer). The phrase لمن is khabar of ذلك via an implied متعلق.

## Per-ayah sources

- **98:1:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=98&verse=1); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=98&verse=1); [Quran.com](https://quran.com/98/1).
- **98:2:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=98&verse=2); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=98&verse=2); [Quran.com](https://quran.com/98/2).
- **98:3:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=98&verse=3); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=98&verse=3); [Quran.com](https://quran.com/98/3).
- **98:4:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=98&verse=4); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=98&verse=4); [Quran.com](https://quran.com/98/4).
- **98:5:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=98&verse=5); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=98&verse=5); [Quran.com](https://quran.com/98/5).
- **98:6:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=98&verse=6); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=98&verse=6); [Quran.com](https://quran.com/98/6).
- **98:7:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=98&verse=7); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=98&verse=7); [Quran.com](https://quran.com/98/7).
- **98:8:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=98&verse=8); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=98&verse=8); [Quran.com](https://quran.com/98/8).

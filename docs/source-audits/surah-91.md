# Surah 91 — Ash-Shams: source audit

Researched 2026-11-13. This lesson contains **15 ayahs and 54 word occurrences**. All Urdu word glosses, translations, grammatical explanations, dictionary summaries, verb-paradigm notes and concise tafsir notes are original AI-assisted editorial drafts. They are **not scholar-reviewed** and are not attributed to a named Urdu translator. No third-party Urdu book, dictionary, translation or tafsir was imported.

## Arabic inventory

`inventory-91.json` records the Quran.com Content API v4 `text_uthmani` word strings ([source](https://api.quran.com/api/v4/verses/by_chapter/91?words=true&word_fields=text_uthmani&per_page=50)), retrieved 2026-11-13, excluding end-of-ayah markers. Recitation signs that the API separates from a word by a space — waqf signs, the saktah sign, the sajdah sign and the rub al-hizb marker — are not part of the stored word token, following the Surahs 110–114 precedent. The inventory lists all 0 such exclusions with the original API text; no other character was changed. The unnumbered opening basmalah is not inserted as a numbered occurrence. Automated tests compare every stored word, its id and its segments with this inventory.

Word boundaries and counts match the Quranic Arabic Corpus morphology for every ayah. Per-ayah word counts: 2, 3, 3, 3, 3, 3, 3, 3, 4, 4, 3, 3, 7, 7, 3.

## Sources and method

- **Morphology:** Quranic Arabic Corpus morphology 0.4 (Kais Dukes, GNU GPL with the Corpus terms of use), a verbatim distribution checked by SHA-256 `910b721a8f04f4334ac5d4c62b19e858f5d720c525bb975f2e750ea2c6bb532d`. It was consulted locally for segmentation, part of speech, root, lemma, verb form, voice, mood and case; it is not bundled or redistributed.
- **Word types and roots** are derived deterministically from the Corpus stem tags with the mapping that reproduces root assignments for all 230 word occurrences of the existing lessons, including words with no root. A preposition with an attached pronoun (لَهُ، بِهِ، عَلَيْهِمْ) is a particle, following Surahs 1, 105 and 112. Words without a Corpus root, such as proper names, keep no root.
- **Syntax:** the Corpus word-by-word pages (English morphology and Arabic i‘rab for every word) and verse grammar pages (Arabic i‘rab notes adapted from the Quran Printing Complex), retrieved 2026-11-13. 7 of 15 verse pages carry no grammar note: 1, 3, 4, 6, 7, 9, 10.
- **Verb paradigms** (باب، ماضی، مضارع، وزن) for all 19 verb occurrences come from a shared library of 657 verb lexemes for this expansion edition. Form I vowel classes were decided from imperfects attested across the whole Corpus and standard lexica (Lane, Lisan al-Arab, al-Mu‘jam al-Wasit), and every entry was independently reviewed.
- **Tafsir consulted** through the Quran.com API: Tafsir al-Muyassar (Arabic), Tafsir al-Sa‘di (Arabic) and Ibn Kathir (abridged, English). Translations consulted for meaning only: Saheeh International and Mufti Taqi Usmani. The Urdu wording is original and concise; it is not a translation of these works.

Word-type, verb-form and passive-voice counts below apply the adjudicated occurrence overrides; they are not uncorrected Corpus tag counts.

| Measure | Count |
| --- | ---: |
| Nouns | 25 |
| Adjectives | 0 |
| Verbs | 19 |
| Particles | 5 |
| Pronouns | 5 |
| Passive verb occurrences | 0 |
| Distinct roots | 36 |
| Verb form I | 8 |
| Verb form II | 7 |
| Verb form IV | 2 |
| Verb form VII | 1 |
| Verb form QI | 1 |

## Editorial checks

The lesson is organized into 2 chunks of whole ayahs. No review-result snapshot was supplied. This source audit therefore does not certify completion of independent reviews, fixes or final confirmations. The intended workflow requires independent grammar and meaning/tafsir reviews and a clean final confirmation after every correction, including minor findings.
The chunk validator checks the exact Arabic word, segments that rejoin to the exact word, ids and order, rule references, verb-note presence, phrase coverage of every word, and the absence of URLs or Latin text. AI review and automated checks are not scholarly review.

Nouns without a Corpus root (root left empty): إِذَا، إِذِ، ثَمُودُ.

## Corrections to Corpus tags

These occurrences carry an adjudicated correction or a documented source/analysis disagreement. The lessons follow the recorded contextual analysis; the raw Corpus data itself is unchanged.

- **91:10:4** دَسَّىٰهَا: QAC tags دَسَّىٰهَا as Form I; the vocalised Hafs word belongs to دَسَّى (Form II), as decided and double-reviewed in the edition-2 verb-paradigm library entry (das~aY`|I|ACT). The lexeme handle is kept; follow the reviewed paradigm.
- **91:14:3** فَدَمْدَمَ: QAC tags فَدَمْدَمَ as Form I; the vocalised Hafs word belongs to دَمْدَمَ (Form QI), as decided and double-reviewed in the edition-2 verb-paradigm library entry (damodama|I|ACT). The lexeme handle is kept; follow the reviewed paradigm.

## Analysis decisions and cautions

Notes recorded by the authors and reviewers for scholarly review; they mark alternative analyses, source disagreements and editorial choices.

- **91:10:4:** QAC tags دَسَّىٰهَا as Form I (no form marker); per the packet qacCorrection and the reviewed paradigm entry (handle das~aY`|I|ACT), it is taught as Form II دَسَّى يُدَسِّي. The generated i‘rab line (فعل ماض) is unaffected.
- **91:1:1:** QAC i‘rab gives only جار ومجرور; the lesson attaches the oath phrase to an implied أُقْسِمُ, as the QAC note on 91:2 does. The wāws in 91:1:2 through 91:7:1 follow QAC (CONJ, عاطفة); some grammarians treat each such wāw as a fresh oath wāw.
- **91:2:2:** Following the QAC note, إِذَا (91:2:2, 91:3:2, 91:4:2) is ظرف محض attached to the implied oath verb; the following verbal clause is described as its muḍāf ilayh (standard analysis, not stated in the packet i‘rab). Other grammarians make it a ḥāl of the sworn-by noun via an implied كائنًا; not used.
- **91:3:3:** Referent of ها in جَلَّىٰهَا differs: Muyassar the darkness, Sa‘di what is on the face of the earth; Taqi Usmani’s translation (and many classical commentators) the sun. The Urdu translation keeps the neutral «اسے».
- **91:4:3:** Referent of ها in يَغْشَىٰهَا: Ibn Kathir the sun; Sa‘di and Muyassar the earth. Both mentioned. The imperfect is indicative with implied ḍamma on the alif.
- **91:5:2:** QAC: مَا relative (referring to Allah) in محل جر, coordinated with ٱلسَّمَآءِ. Sa‘di and Qatadah (in Ibn Kathir) allow مَا مصدرية (the heaven and its construction); mentioned as an alternative in 91:5:2 and the tafsir. 91:6:2 and 91:7:2 parallel.
- **91:9:1:** Packet i‘rab is silent on the oath’s answer. The lesson presents قَدْ أَفْلَحَ … as جواب القسم with an elided lām (لَقَدْ), consistent with Sa‘di’s wording. Some grammarians instead hold the answer is elided and inferred from the following story; not mentioned in the learner text.
- **91:9:4:** Subject of زَكَّىٰهَا / دَسَّىٰهَا: the person himself (Qatadah, Sa‘di) or Allah (Ibn ‘Abbas via al-‘Awfi and ‘Ali b. Abi Talhah, in Ibn Kathir). Lesson follows the first and notes the second; same for 91:10:4.
- **91:8:3:** QAC tags تَقْوَىٰ and ضُحَىٰ (91:1:2) as masculine; many grammarians treat the final alif of تَقْوَى as feminine alif maqṣūra. Gender is therefore left unstated in the morphology of both words.
- **91:8:2:** Shared root entry ف ج ر ends «مگر یہاں صرف پانی جاری کرنے کا معنی ہے», written for another context; in 91:8:2 فُجُور means disobedience/wickedness. Library note should be generalised (not edited here).
- **91:2:3:** Shared root entry ت ل و says «یہاں یہ پڑھ کر سنانے کے معنی میں ہے»; in 91:2:3 the meaning is "to follow". Similarly root غ ش و mentions «یہاں آنے والے أَغْشَيْنَا», which does not occur in this chunk. Library notes should be generalised (not edited here).
- **91:11:2:** Thamūd denotes the tribe here, as reflected in the feminine verbal agreement. The Hafs word has nominative damma without tanwin.
- **91:11:3:** The bāʾ is causal, as specified by both translations and by al-Saʿdi.
- **91:12:2:** The English glosses suggest a passive, but QAC morphology and the reviewed Form VII paradigm give an active intransitive verb here. The tafsirs and Taqi Usmani support rose up.
- **91:13:5:** The visible fatḥa and QAC ayah iʿrab identify the camel noun as the object of an omitted verb of warning. The English word gloss and the Quranic quotation embedded in the supplied abridged Ibn Kathir render a nominative analysis; Urdu follows the vocalised Hafs packet and the QAC ayah note.
- **91:14:1:** The word-level QAC line and morph tag label the prefixed fāʾ resumptive; the ayah iʿrab treats the clause as coordinated with the preceding speech clause. Urdu follows the ayah iʿrab.
- **91:14:2:** Shared paradigm Eaqara|I|ACT correctly gives يَعْقِرُ but the note places kasra on the letter ʿayn. It is on qāf, the second radical, as shown by the cited form.
- **91:14:3:** Followed the packet correction: دَمْدَمَ is an active Form QI quadriliteral perfect, rather than a triliteral Form I. The retained raw lexeme handle supplies the corrected paradigm.
- **91:14:7:** Al-Saʿdi and the supplied abridged Ibn Kathir understand the object here as the punishment being made equal for the whole tribe. The Quran.com and QAC word glosses instead say leveled them.
- **91:15:1:** The word-level QAC line and morph tag label the prefixed wāw coordinating; the ayah iʿrab treats this clause as circumstantial from the subject of the last verb of 91:14. Urdu follows the ayah iʿrab. Ibn Kathir also notes a reading with fāʾ; the Hafs text here uses wāw.

## Per-ayah sources

- **91:1:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=91&verse=1); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=91&verse=1); [Quran.com](https://quran.com/91/1).
- **91:2:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=91&verse=2); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=91&verse=2); [Quran.com](https://quran.com/91/2).
- **91:3:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=91&verse=3); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=91&verse=3); [Quran.com](https://quran.com/91/3).
- **91:4:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=91&verse=4); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=91&verse=4); [Quran.com](https://quran.com/91/4).
- **91:5:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=91&verse=5); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=91&verse=5); [Quran.com](https://quran.com/91/5).
- **91:6:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=91&verse=6); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=91&verse=6); [Quran.com](https://quran.com/91/6).
- **91:7:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=91&verse=7); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=91&verse=7); [Quran.com](https://quran.com/91/7).
- **91:8:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=91&verse=8); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=91&verse=8); [Quran.com](https://quran.com/91/8).
- **91:9:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=91&verse=9); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=91&verse=9); [Quran.com](https://quran.com/91/9).
- **91:10:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=91&verse=10); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=91&verse=10); [Quran.com](https://quran.com/91/10).
- **91:11:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=91&verse=11); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=91&verse=11); [Quran.com](https://quran.com/91/11).
- **91:12:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=91&verse=12); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=91&verse=12); [Quran.com](https://quran.com/91/12).
- **91:13:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=91&verse=13); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=91&verse=13); [Quran.com](https://quran.com/91/13).
- **91:14:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=91&verse=14); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=91&verse=14); [Quran.com](https://quran.com/91/14).
- **91:15:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=91&verse=15); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=91&verse=15); [Quran.com](https://quran.com/91/15).

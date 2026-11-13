# Surah 96 — Al-'Alaq: source audit

Researched 2026-11-13. This lesson contains **19 ayahs and 72 word occurrences**. All Urdu word glosses, translations, grammatical explanations, dictionary summaries, verb-paradigm notes and concise tafsir notes are original AI-assisted editorial drafts. They are **not scholar-reviewed** and are not attributed to a named Urdu translator. No third-party Urdu book, dictionary, translation or tafsir was imported.

## Arabic inventory

`inventory-96.json` records the Quran.com Content API v4 `text_uthmani` word strings ([source](https://api.quran.com/api/v4/verses/by_chapter/96?words=true&word_fields=text_uthmani&per_page=50)), retrieved 2026-11-13, excluding end-of-ayah markers. Recitation signs that the API separates from a word by a space — waqf signs, the saktah sign, the sajdah sign and the rub al-hizb marker — are not part of the stored word token, following the Surahs 110–114 precedent. The inventory lists all 1 such exclusions with the original API text; no other character was changed. The unnumbered opening basmalah is not inserted as a numbered occurrence. Automated tests compare every stored word, its id and its segments with this inventory.

Word boundaries and counts match the Quranic Arabic Corpus morphology for every ayah. Per-ayah word counts: 5, 4, 3, 3, 5, 4, 3, 4, 3, 3, 5, 3, 4, 5, 6, 3, 2, 2, 5.

## Sources and method

- **Morphology:** Quranic Arabic Corpus morphology 0.4 (Kais Dukes, GNU GPL with the Corpus terms of use), a verbatim distribution checked by SHA-256 `910b721a8f04f4334ac5d4c62b19e858f5d720c525bb975f2e750ea2c6bb532d`. It was consulted locally for segmentation, part of speech, root, lemma, verb form, voice, mood and case; it is not bundled or redistributed.
- **Word types and roots** are derived deterministically from the Corpus stem tags with the mapping that reproduces root assignments for all 230 word occurrences of the existing lessons, including words with no root. A preposition with an attached pronoun (لَهُ، بِهِ، عَلَيْهِمْ) is a particle, following Surahs 1, 105 and 112. Words without a Corpus root, such as proper names, keep no root.
- **Syntax:** the Corpus word-by-word pages (English morphology and Arabic i‘rab for every word) and verse grammar pages (Arabic i‘rab notes adapted from the Quran Printing Complex), retrieved 2026-11-13. 5 of 19 verse pages carry no grammar note: 6, 12, 13, 18, 19.
- **Verb paradigms** (باب، ماضی، مضارع، وزن) for all 28 verb occurrences come from a shared library of 658 verb lexemes for this expansion edition. Form I vowel classes were decided from imperfects attested across the whole Corpus and standard lexica (Lane, Lisan al-Arab, al-Mu‘jam al-Wasit). The edition’s library review and subsequent corrections are recorded in its handoff and adjudication reports.
- **Tafsir consulted** through the Quran.com API: Tafsir al-Muyassar (Arabic), Tafsir al-Sa‘di (Arabic) and Ibn Kathir (abridged, English). Translations consulted for meaning only: Saheeh International and Mufti Taqi Usmani. The Urdu wording is original and concise; it is not a translation of these works.

Word-type, verb-form and passive-voice counts below apply the adjudicated occurrence overrides; they are not uncorrected Corpus tag counts.

| Measure | Count |
| --- | ---: |
| Nouns | 19 |
| Adjectives | 3 |
| Verbs | 28 |
| Particles | 18 |
| Pronouns | 4 |
| Passive verb occurrences | 0 |
| Distinct roots | 32 |
| Verb form I | 19 |
| Verb form II | 4 |
| Verb form IV | 1 |
| Verb form V | 1 |
| Verb form VIII | 2 |
| Verb form X | 1 |

## Editorial checks

The lesson is organized into 2 chunks of whole ayahs. No review-result snapshot was supplied. This source audit therefore does not certify completion of independent reviews, fixes or final confirmations. The intended workflow requires independent grammar and meaning/tafsir reviews and a clean final confirmation after every correction, including minor findings.
The chunk validator checks the exact Arabic word, segments that rejoin to the exact word, ids and order, rule references, verb-note presence, phrase coverage of every word, and the absence of URLs or Latin text. AI review and automated checks are not scholarly review.

Nouns without a Corpus root (root left empty): إِذَا.

## Analysis decisions and cautions

Notes recorded by the authors and reviewers for scholarly review; they mark alternative analyses, source disagreements and editorial choices.

- **96:1:1:** Object of ٱقْرَأْ is unexpressed; taught as 'what is being revealed' following Muyassar (ما أنزل إليك). Some grammarians treat the verb here as used without an intended object.
- **96:1:2:** Followed the QAC ayah note: بِٱسْمِ attaches to an elided ḥāl (مفتتحًا باسم ربك). Known alternatives: bāʾ of accompaniment/instrument attached to ٱقْرَأْ, or an extra bāʾ with اسم as the object. Not adopted.
- **96:2:1:** QAC note: the خَلَقَ clause is badal of the preceding خَلَقَ (the ṣila of ٱلَّذِى), so it is taught as having no syntactic position; same reasoning for 96:5:1, badal of the ṣila in 96:4.
- **96:2:4:** QAC tags عَلَقٍ only as N M INDEF GEN. Description as a collective (اسم جنس) of عَلَقَة is lexical, from the dictionaries, and kept in dictionaryUrdu only.
- **96:3:2:** Source disagreement: the QAC prefix tag (REM) and the word-level iʿrab line say الواو استئنافية; the ayah grammar note says الواو حالية with ربك الأكرم مبتدأ وخبر. Followed the ayah note (ḥāl clause of the hidden subject of ٱقْرَأْ) and mentioned the استئنافية reading in syntaxUrdu.
- **96:3:3:** Source disagreement: the word-level iʿrab line says صفة مرفوعة (from the ADJ tag), but the ayah grammar note makes ٱلْأَكْرَمُ the khabar of رَبُّ. Taught as khabar (nominative, elative); effective pos 'adjective' kept as اسم تفضیل.
- **96:4:1:** Ayah note says only «الذي» نعت; head not named. Taught as a descriptor of the Lord of 96:3 in محل رفع (head could be رَبُّكَ or ٱلْأَكْرَمُ). Some analyses also allow badal or a khabar of an elided mubtada.
- **96:4:2:** Both objects of عَلَّمَ are elided; Muyassar supplies خلقه الكتابة, which the lesson follows.
- **96:6:1:** QAC iʿrab: حرف ردع; Muyassar glosses كَلَّا here as حقًا. Lesson teaches deterrence and mentions the حقًا reading.
- **96:6:4:** Lām taught as the emphatic lām on the khabar of إِنَّ (QAC: لام التوكيد); verb indicative with implied ḍamma on the alif maqṣūra (QAC mood unmarked).
- **96:7:1:** QAC note: the interpreted masdar is منصوب على نزع الخافض (elided lām of cause).
- **96:7:2:** Followed QAC note: رَأَى of the heart with two objects (هُ and the clause ٱسْتَغْنَىٰٓ), the subject and object pronouns referring to the same person. The perfect is rendered with an Urdu present-habitual sense following both English translations.
- **96:8:3:** Addressee of كَ: taught as the Prophet ﷺ, with mention that it may address every human (Ibn Kathir's paraphrase addresses the transgressor).
- **96:8:4:** QAC tags ٱلرُّجْعَىٰٓ N F ACC (delayed ism of إِنَّ, implied fatḥa); not tagged as a verbal noun, so the verbal-noun rule was not used although the word means 'return'.
- **96:11:1:** The verse 11 iʿrab first mentions a first-object pronoun referring back to the forbidding man, then specifies elision of both objects in the second أَرَءَيْتَ. The learner note follows that explicit enumeration. The subject of كَانَ and أَمَرَ is the praying servant in the supplied tafsirs.
- **96:12:3:** QAC labels تَقْوَى masculine. The lemma has an alif maqṣūra and its final case vowel is implied. The occurrence note focuses on the visible form and the genitive construction.
- **96:14:3:** The word-level tag records a preposition; the verse-level iʿrab explicitly calls the باء extra for emphasis and makes the interpreted masdar occupy both object slots of يَعْلَم.
- **96:15:2:** The word iʿrab gives an emphatic lām, while the verse iʿrab specifies the lām preparing an oath. The explanation follows the more specific verse-level analysis.
- **96:15:5:** The light emphatic nūn is shown by the written alif with the preceding tanwīn-like sign. The ayah iʿrab makes the imperfect built on fatḥa. The answer is an oath answer, which supplies the understood conditional consequence.
- **96:17:2:** QAC labels نَادِيَ an active participle by form. The supplied tafsirs treat it here as the noun for a gathering or meeting place, used for the people assembled. The shared ن د و note treats calling and does not cover this noun sense.
- **96:18:1:** QAC has no jussive tag here. The future sīn precedes an indicative imperfect and the final radical wāw of نَدْعُو is omitted in the Uthmani spelling. This differs from the grammatical deletion after the command lām in 96:17:1. The shared د ع و note and paradigm discuss grammatical deletion but do not mention this occurrence’s orthography.
- **96:18:2:** The shared ز ب ن note records differing singular analyses for this plural designation. The learner lemma keeps the attested collective rather than selecting a disputed singular.

## Per-ayah sources

- **96:1:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=96&verse=1); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=96&verse=1); [Quran.com](https://quran.com/96/1).
- **96:2:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=96&verse=2); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=96&verse=2); [Quran.com](https://quran.com/96/2).
- **96:3:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=96&verse=3); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=96&verse=3); [Quran.com](https://quran.com/96/3).
- **96:4:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=96&verse=4); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=96&verse=4); [Quran.com](https://quran.com/96/4).
- **96:5:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=96&verse=5); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=96&verse=5); [Quran.com](https://quran.com/96/5).
- **96:6:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=96&verse=6); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=96&verse=6); [Quran.com](https://quran.com/96/6).
- **96:7:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=96&verse=7); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=96&verse=7); [Quran.com](https://quran.com/96/7).
- **96:8:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=96&verse=8); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=96&verse=8); [Quran.com](https://quran.com/96/8).
- **96:9:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=96&verse=9); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=96&verse=9); [Quran.com](https://quran.com/96/9).
- **96:10:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=96&verse=10); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=96&verse=10); [Quran.com](https://quran.com/96/10).
- **96:11:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=96&verse=11); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=96&verse=11); [Quran.com](https://quran.com/96/11).
- **96:12:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=96&verse=12); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=96&verse=12); [Quran.com](https://quran.com/96/12).
- **96:13:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=96&verse=13); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=96&verse=13); [Quran.com](https://quran.com/96/13).
- **96:14:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=96&verse=14); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=96&verse=14); [Quran.com](https://quran.com/96/14).
- **96:15:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=96&verse=15); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=96&verse=15); [Quran.com](https://quran.com/96/15).
- **96:16:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=96&verse=16); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=96&verse=16); [Quran.com](https://quran.com/96/16).
- **96:17:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=96&verse=17); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=96&verse=17); [Quran.com](https://quran.com/96/17).
- **96:18:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=96&verse=18); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=96&verse=18); [Quran.com](https://quran.com/96/18).
- **96:19:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=96&verse=19); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=96&verse=19); [Quran.com](https://quran.com/96/19).

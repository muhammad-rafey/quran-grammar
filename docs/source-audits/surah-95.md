# Surah 95 — At-Tin: source audit

Researched 2026-11-13. This lesson contains **8 ayahs and 34 word occurrences**. All Urdu word glosses, translations, grammatical explanations, dictionary summaries, verb-paradigm notes and concise tafsir notes are original AI-assisted editorial drafts. They are **not scholar-reviewed** and are not attributed to a named Urdu translator. No third-party Urdu book, dictionary, translation or tafsir was imported.

## Arabic inventory

`inventory-95.json` records the Quran.com Content API v4 `text_uthmani` word strings ([source](https://api.quran.com/api/v4/verses/by_chapter/95?words=true&word_fields=text_uthmani&per_page=50)), retrieved 2026-11-13, excluding end-of-ayah markers. Recitation signs that the API separates from a word by a space — waqf signs, the saktah sign, the sajdah sign and the rub al-hizb marker — are not part of the stored word token, following the Surahs 110–114 precedent. The inventory lists all 0 such exclusions with the original API text; no other character was changed. The unnumbered opening basmalah is not inserted as a numbered occurrence. Automated tests compare every stored word, its id and its segments with this inventory.

Word boundaries and counts match the Quranic Arabic Corpus morphology for every ayah. Per-ayah word counts: 2, 2, 3, 6, 4, 9, 4, 4.

## Sources and method

- **Morphology:** Quranic Arabic Corpus morphology 0.4 (Kais Dukes, GNU GPL with the Corpus terms of use), a verbatim distribution checked by SHA-256 `910b721a8f04f4334ac5d4c62b19e858f5d720c525bb975f2e750ea2c6bb532d`. It was consulted locally for segmentation, part of speech, root, lemma, verb form, voice, mood and case; it is not bundled or redistributed.
- **Word types and roots** are derived deterministically from the Corpus stem tags with the mapping that reproduces root assignments for all 230 word occurrences of the existing lessons, including words with no root. A preposition with an attached pronoun (لَهُ، بِهِ، عَلَيْهِمْ) is a particle, following Surahs 1, 105 and 112. Words without a Corpus root, such as proper names, keep no root.
- **Syntax:** the Corpus word-by-word pages (English morphology and Arabic i‘rab for every word) and verse grammar pages (Arabic i‘rab notes adapted from the Quran Printing Complex), retrieved 2026-11-13. 1 of 8 verse pages carry no grammar note: 3.
- **Verb paradigms** (باب، ماضی، مضارع، وزن) for all 6 verb occurrences come from a shared library of 657 verb lexemes for this expansion edition. Form I vowel classes were decided from imperfects attested across the whole Corpus and standard lexica (Lane, Lisan al-Arab, al-Mu‘jam al-Wasit), and every entry was independently reviewed.
- **Tafsir consulted** through the Quran.com API: Tafsir al-Muyassar (Arabic), Tafsir al-Sa‘di (Arabic) and Ibn Kathir (abridged, English). Translations consulted for meaning only: Saheeh International and Mufti Taqi Usmani. The Urdu wording is original and concise; it is not a translation of these works.

Word-type, verb-form and passive-voice counts below apply the adjudicated occurrence overrides; they are not uncorrected Corpus tag counts.

| Measure | Count |
| --- | ---: |
| Nouns | 20 |
| Adjectives | 1 |
| Verbs | 6 |
| Particles | 5 |
| Pronouns | 2 |
| Passive verb occurrences | 0 |
| Distinct roots | 22 |
| Verb form I | 4 |
| Verb form II | 1 |
| Verb form IV | 1 |

## Editorial checks

The lesson is organized into 1 chunks of whole ayahs. No review-result snapshot was supplied. This source audit therefore does not certify completion of independent reviews, fixes or final confirmations. The intended workflow requires independent grammar and meaning/tafsir reviews and a clean final confirmation after every correction, including minor findings.
The chunk validator checks the exact Arabic word, segments that rejoin to the exact word, ids and order, rule references, verb-note presence, phrase coverage of every word, and the absence of URLs or Latin text. AI review and automated checks are not scholarly review.

Nouns without a Corpus root (root left empty): سِينِينَ، فَمَا.

## Analysis decisions and cautions

Notes recorded by the authors and reviewers for scholarly review; they mark alternative analyses, source disagreements and editorial choices.

- **95:1:1:** QAC word i‘rab gives only «جار ومجرور»; the attachment to an implied oath verb (أقسم) is the standard analysis and is taught here (elision rule).
- **95:1:2:** Ayah grammar note: the wa of «والزيتون» is a conjunction (معطوف على التين), not a second oath particle; followed.
- **95:2:2:** Followed QAC i‘rab: proper noun, diptote (علمية وعجمة), genitive with fatha. Some grammarians instead treat سينين like a sound masculine plural (genitive by yāʾ); not taught. Tafsir identifies it with Ṭūr Sīnāʾ. Root null kept.
- **95:3:2:** QAC word i‘rab says only «اسم مجرور»; analysed as badal (or ‘atf bayan) of the demonstrative هذا, the usual analysis after a demonstrative.
- **95:3:3:** أمين on fa‘il: read as “secure / place of safety” per tafsir (الأمين من كل خوف). Not tagged resembling-adjective or intensive because the fa‘il sense (آمن vs مأمون فيه) is debated.
- **95:4:4:** Per ayah note, «في أحسن» attaches to an implied ḥāl of «الإنسان»; the preposition entry is tagged haal and elision.
- **95:5:3:** Followed QAC: أسفل is ظرف مكان منصوب (originally the adjective of an omitted مكانًا). Alternative analyses: second object of ردّ in the sense of صيّر, or ḥāl; not taught.
- **95:6:1:** Exception analysed as متصل from the object pronoun of رددناه (الإنسان as genus), matching the Hell interpretation preferred by Ibn Kathir. If the “old age” view is taken it is منقطع (= لكن), and Muyassar paraphrases with «لكن»; mentioned briefly in syntaxUrdu.
- **95:6:6:** Label conflict: QAC word i‘rab calls the fa «استئنافية» (REM), but the ayah note says «جملة فلهم أجر معطوفة على جملة وعملوا». Following the ayah i‘rab (resumption rule instruction), taught as conjunctive fa with causal sense and tagged conjunction, not resumption. Another analysis makes الذين a mubtada (exception منقطع) with فلهم أجر as its khabar.
- **95:6:8:** غير tagged adjective (نعت per ayah note); exception rule not used since here it negates the following participle (“not cut off”) rather than meaning “other than / except”.
- **95:6:9:** ممنون glossed per Muyassar/Sa‘di as “cut off” (غير مقطوع); the root library also records “not reproached with reminders of favour”, mentioned only in dictionaryUrdu.
- **95:7:2:** Addressee of ك taken as man (Muyassar, Sa‘di, Ibn Kathir: “O son of Adam”). The provided tafsir does not give the other known view (address to the Prophet, ما = من), so it is not taught. Causative sense “what makes you deny” follows the tafsir paraphrase.
- **95:7:3:** بعد is built on ḍamma, cut off from iḍāfa; ayah note gives the implied mudaf ilayh as «ذكر الإنسان». Rendered in Urdu without quoting the Arabic restoration.
- **95:8:3:** Ayah note: the bā’ is extra on the khabar of ليس; أحكم is لفظًا مجرور، محلًا منصوب. أحكم rendered with both “most just judge” (Ibn Kathir) and “most wise” (Muyassar/Sa‘di) senses.

## Per-ayah sources

- **95:1:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=95&verse=1); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=95&verse=1); [Quran.com](https://quran.com/95/1).
- **95:2:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=95&verse=2); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=95&verse=2); [Quran.com](https://quran.com/95/2).
- **95:3:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=95&verse=3); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=95&verse=3); [Quran.com](https://quran.com/95/3).
- **95:4:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=95&verse=4); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=95&verse=4); [Quran.com](https://quran.com/95/4).
- **95:5:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=95&verse=5); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=95&verse=5); [Quran.com](https://quran.com/95/5).
- **95:6:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=95&verse=6); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=95&verse=6); [Quran.com](https://quran.com/95/6).
- **95:7:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=95&verse=7); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=95&verse=7); [Quran.com](https://quran.com/95/7).
- **95:8:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=95&verse=8); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=95&verse=8); [Quran.com](https://quran.com/95/8).

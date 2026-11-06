# Content provenance

The initial dataset covers Al-Fatihah, counting the basmalah as 1:1: seven ayahs, 29 word occurrences, 18 roots, four verb paradigms, 14 phrase constructions, and 18 reusable grammar explanations. Stable IDs use surah:ayah:word, and repeated spellings retain their occurrence-specific syntax.

Urdu glosses, translations, dictionary summaries, grammar explanations, and short tafsir summaries were newly authored with AI assistance for the prototype and are teaching drafts awaiting scholarly review. No complete Urdu dictionary, commercial book, or third-party Urdu translation was imported. Root letters identify lexical families; individual glyphs do not have independent lexical meanings. Learner headwords are not a verbatim lemma export.

Arabic inventory, root assignments, and grammatical facts were checked against the Quranic Arabic Corpus (Kais Dukes, University of Leeds). Its morphology and Arabic i‘rab pages were consulted; the latter credit the Quran Printing Complex. No unmodified bulk corpus download is bundled. The Corpus download page identifies GPL licensing together with additional text-preservation and source-link conditions. See [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md); public accessibility is not a claim of unrestricted reuse. The interface keeps a concise Corpus attribution; per-record links and the former references tab are excluded from the learning flow.

Additional consultation: Al-‘Ukbari’s _Al-Tibyan fi i‘rab al-Qur’an_ via Islamweb, Aamir Al-Khumaisi’s _Taysir al-i‘rab li-ay al-kitab_ via Alukah, concise Ibn Kathir commentary as hosted on Quran.com, Cairo Arabic Language Academy dictionary entries, and classical dictionary entries hosted by Hawramani. The wording in this repository is an original Urdu summary, not a transcription of those editions. No license or permission for bulk redistribution of these hosted works is asserted.

References below record the original prototype’s audit trail (researched 2026-10-22; migrated 2026-10-23). The study API deliberately omits these URLs. Source alternatives and uncertainty, including the derivations of اسم and اللہ and the syntax of غیر, remain in the teaching notes.

## Expansion: Surahs 105–114

The expansion adds 48 ayahs and 201 word occurrences, bringing the edition to 11 Surahs, 55 ayahs and 230 words. Every chapter uses the same `StudyData` shape and word-detail fields as Al-Fatihah. Unnumbered opening basmalahs are not inserted as extra numbered occurrences in these chapters.

**AI involvement is explicit:** the Arabic text is transcribed from the observed source text, not generated. The QAC morphology/grammar references and selected dictionary entries inform the grammatical facts, root assignments and paradigms. Urdu word meanings, verse translations, root/dictionary summaries, morphology/syntax explanations, phrase notes, rules and short tafsir summaries are AI-assisted original teaching drafts. They are not a verbatim source edition and have not received human scholarly approval. Automated schema checks and source comparisons do not constitute scholarly review.

- [Surahs 105–109: source audit](source-audits/surahs-105-109.md) and [Arabic inventory](source-audits/inventory-105-109.json).
- [Surahs 110–114: source audit](source-audits/surahs-110-114.md) and [Arabic inventory](source-audits/inventory-110-114.json).

These audits distinguish Quran.com Uthmani Arabic text (API fields or observed verse pages) from QAC occurrence boundaries, root/morphology annotations and Arabic i‘rab pages. Do not describe the Arabic fixtures as a byte-for-byte QAC morphology export. The fixtures preserve the observed word strings separately from the editable teaching modules; automated tests compare all 201 occurrences and their IDs. Selected source disagreements and alternate readings are retained in the editorial notes instead of being presented as undisputed facts.

The same AI-assisted/pending-review label appears in Settings → About on web, Android and iOS. Per-record source URLs remain in this repository rather than the learning payload.

## Five-Surah drafts held for scholarly review

The expansion targets Al-Kahf (18), Al-Mu’minun (23), As-Sajdah (32), Ya-Sin (36) and Ar-Rahman (55): 419 ayahs and 4,077 word occurrences. All 127 chunks are authored and all five held JSON drafts exist in `content-pipeline/drafts/`. All 127 chunks have passed current-input independent grammar and meaning reviews plus clean final confirmation after the source-type, rule and root-note corrections. The [current review manifest](../content-pipeline/reports/chunk-review-manifest.json), all five final held drafts and source audits are complete. Final structural validation reports zero errors and zero warnings. The published registry and both synchronized content databases remain the eleven-Surah edition (55 ayahs, 230 words). PR #1 was merged and deployed at `a52e1de` without activating these drafts. Completing an AI review does not make a draft available in the public study interface.

Arabic word strings come from the Quran.com Content API v4 Uthmani field, with 154 separately spaced recitation signs excluded under the existing token policy and recorded in the tracked inventories. Morphology was checked against a local verbatim Quranic Arabic Corpus 0.4 copy with SHA-256 `910b721a8f04f4334ac5d4c62b19e858f5d720c525bb975f2e750ea2c6bb532d` and a second morphology reference. Raw source metadata, occurrence IDs and Arabic remain unchanged. `content-pipeline/meta/overrides.json` contains 74 occurrence records: 65 prior tag corrections plus nine explicitly selected contextual-type analyses, all nine classified as particles. These document the adopted source-backed contextual reading rather than ruling out every recognized alternative. The split of a merged source lexeme is also preserved. Internal lookup identifiers preserve source provenance and do not override corrected teaching fields.

The Urdu explanations, translations, dictionary notes, rules and tafsir summaries are original AI-assisted drafts. Quran.com’s Muyassar, Sa‘di and abridged Ibn Kathir references and the Saheeh International and Taqi Usmani English translations support meaning checks; their bulk texts remain local and ignored by git. Shared libraries contain 112 rules, 358 verb paradigms and 589 roots. Independent grammar and meaning reviews, corrections, fresh confirmations, source inventories and hash-bound review records document the editorial process. The latest preparation batch applied two rule-scope clarifications, Urdu agreement fixes in 35 lexeme and 21 root notes, and two Al-Kahf lemma consistency edits. [`codex-resumption-corrections.json`](../content-pipeline/reports/codex-resumption-corrections.json) records the applied changes and hashes; its supporting rule, agreement, type and five cross-chunk consistency reports preserve the evidence. The later [`ق ر أ adjudication`](../content-pipeline/reports/codex-qara-root-adjudication.json) qualifies Quran's recitation and proper-name uses without changing source Arabic or imposing one analysis on every occurrence. That root-only edit affected four supplied-root chunk fingerprints; the later global override and rule changes triggered a fresh all-127 pass, now complete. Final draft wrappers have current release digests. The ninth selected particle analysis at 23:78:9 is recorded in [`codex-final-type-adjudication.json`](../content-pipeline/reports/codex-final-type-adjudication.json); the explicit حرف antecedent in the prohibition card is documented in [`codex-prohibition-agreement-adjudication.json`](../content-pipeline/reports/codex-prohibition-agreement-adjudication.json). The later [`ن ه ر correction`](../content-pipeline/reports/codex-nahr-root-adjudication.json) distinguishes initial hamza and nūn sukūn in أَنْهَار from nūn fatḥa in نَهَار; its five supplied-root chunks (`18-c17`, `18-c18`, `23-c23`, `36-c09`, `36-c10`) have passed fresh AI reviews. The [`ق ص ر correction`](../content-pipeline/reports/codex-qasr-root-adjudication.json) gives the full feminine plural مَقْصُورَات its مَفْعُولَات pattern; supplied-root chunks `55-c09` and `55-c11` have passed fresh reviews. Earlier reports retain their original snapshot status. These checks do not constitute scholarly approval.

The offline review exporter uses only held drafts, inventories, public source audits, review metadata and the existing licensed project fonts. Each HTML page embeds the original Amiri/Naskh/Nastaliq fonts and their SIL OFL notices for offline reading; raw reference downloads, private model logs and credentials are excluded. The completed 27-file bundle is available locally as [HTML](../build/review/quran-grammar/index.html) and [a ZIP](../build/review/quran-grammar-scholarly-review.zip), both git-ignored. Chromium checked exact source Arabic for all 4,077 words and 419 ayahs, font loading and absence of overflow, page errors and external requests. The 6,153,696-byte ZIP has SHA-256 `4c203d25e1eaa32e641c1fc98ea010acb3a6f4d9684ac48e543bbb2366924d68`.

[`content-pipeline/README.md`](../content-pipeline/README.md) records the method and progress. [`review-status.json`](../content-pipeline/review-status.json) keeps all five Surahs pending until actual reviewer identity, date, evidence and an exact content-input digest are recorded. Draft assembly writes outside the runtime; runtime assembly refuses missing or stale scholarly approval. Corpus credit and the required link remain in Settings → About; no per-word reference links are added to the learning payload.

Private Android emulator and iPhone 17 Pro / iOS 26.5 simulator interactions verified held-fixture Juz jumps, reading-position labels, same-chapter selection, roots/paradigms, modal return and Study/Grammar switching. The ten iOS assertions passed in Expo Go 57 with headless XCTest. [`Native verification`](../content-pipeline/reports/codex-native-verification.json) preserves evidence and log limitations, including an Apple logging-quarantine fault. These were simulator tests of a private preview, not physical-phone tests, a standalone iOS IPA test or scholarly approval.

## Navigation metadata and practice

The 114 surah numbers, Arabic names and conventional English transliterations in `packages/core/src/catalog.ts` were checked against [Quran.com’s chapter metadata API](https://api.quran.com/api/v4/chapters?language=en) on 2026-10-23; the endpoint is described in the [Quran Foundation chapter documentation](https://api-docs.quran.com/docs/content_apis_versioned/4.0.0/list-chapters/). These are factual navigation labels, not verse text or a translated work. The [juz metadata endpoint](https://api.quran.com/api/v4/juzs) confirms 30 distinct juz numbers and places Al-Fatihah within Juz 1. This edition enables Surah 1 and Surahs 105–114. Juz 1 is a partial preview of Al-Fatihah; Juz 30 is a partial preview of its final ten Surahs. Other chapters remain unavailable. The ayah ranges of all 30 juz were checked against the same juz endpoint on 2026-11-06 and are stored in `catalog.ts`, so a chapter that spans two juz will open at its first ayah inside the chosen juz.

The three practice questions are original Urdu teaching drafts based on the existing Al-Fatihah entries: identifying نَعْبُدُ as a verb, the imperative form in ٱهْدِنَا, and the root ع ب د. Arabic word choices reuse the exact stored lesson occurrences; distractors are existing words, grammatical labels or roots, without invented Quranic text. The existing scholar-review status applies to these questions too.

## Record-level audit trail

### Word 1:1:1

- <https://corpus.quran.com/wordmorphology.jsp?location=%281%3A1%3A1%29>
- <https://corpus.quran.com/grammar.jsp?chapter=1&verse=1>
- <https://corpus.quran.com/qurandictionary.jsp?q=smw>

### Word 1:1:2

- <https://corpus.quran.com/wordmorphology.jsp?location=%281%3A1%3A2%29>

### Word 1:1:3

- <https://corpus.quran.com/wordmorphology.jsp?location=%281%3A1%3A3%29>
- <https://corpus.quran.com/grammar.jsp?chapter=1&verse=1>

### Word 1:1:4

- <https://corpus.quran.com/wordmorphology.jsp?location=%281%3A1%3A4%29>
- <https://corpus.quran.com/grammar.jsp?chapter=1&verse=1>

### Word 1:2:1

- <https://corpus.quran.com/wordmorphology.jsp?location=%281%3A2%3A1%29>
- <https://corpus.quran.com/treebank.jsp?chapter=1&verse=2>
- <https://www.alukah.net/sharia/0/167735/تيسير-الإعراب-لآي-الكتاب/>

### Word 1:2:2

- <https://corpus.quran.com/wordmorphology.jsp?location=%281%3A2%3A2%29>
- <https://corpus.quran.com/treebank.jsp?chapter=1&verse=2>

### Word 1:2:3

- <https://corpus.quran.com/wordmorphology.jsp?location=%281%3A2%3A3%29>
- <https://corpus.quran.com/grammar.jsp?chapter=1&verse=2>

### Word 1:2:4

- <https://corpus.quran.com/wordmorphology.jsp?location=%281%3A2%3A4%29>
- <https://corpus.quran.com/grammar.jsp?chapter=1&verse=2>
- <https://corpus.quran.com/qurandictionary.jsp?q=Elm>

### Word 1:3:1

- <https://corpus.quran.com/wordmorphology.jsp?location=%281%3A3%3A1%29>
- <https://corpus.quran.com/treebank.jsp?chapter=1&verse=3>

### Word 1:3:2

- <https://corpus.quran.com/wordmorphology.jsp?location=%281%3A3%3A2%29>
- <https://corpus.quran.com/treebank.jsp?chapter=1&verse=3>

### Word 1:4:1

- <https://corpus.quran.com/wordmorphology.jsp?location=%281%3A4%3A1%29>
- <https://corpus.quran.com/grammar.jsp?chapter=1&verse=4>

### Word 1:4:2

- <https://corpus.quran.com/wordmorphology.jsp?location=%281%3A4%3A2%29>
- <https://corpus.quran.com/treebank.jsp?chapter=1&verse=4>

### Word 1:4:3

- <https://corpus.quran.com/wordmorphology.jsp?location=%281%3A4%3A3%29>
- <https://corpus.quran.com/treebank.jsp?chapter=1&verse=4>

### Word 1:5:1

- <https://corpus.quran.com/wordmorphology.jsp?location=%281%3A5%3A1%29>
- <https://corpus.quran.com/grammar.jsp?chapter=1&verse=5>

### Word 1:5:2

- <https://corpus.quran.com/wordmorphology.jsp?location=%281%3A5%3A2%29>
- <https://corpus.quran.com/treebank.jsp?chapter=1&verse=5>
- <https://www.alukah.net/sharia/0/167735/تيسير-الإعراب-لآي-الكتاب/>

### Word 1:5:3

- <https://corpus.quran.com/wordmorphology.jsp?location=%281%3A5%3A3%29>
- <https://corpus.quran.com/treebank.jsp?chapter=1&verse=5>

### Word 1:5:4

- <https://corpus.quran.com/wordmorphology.jsp?location=%281%3A5%3A4%29>
- <https://corpus.quran.com/grammar.jsp?chapter=1&verse=6>
- <https://corpus.quran.com/qurandictionary.jsp?q=Ewn>

### Word 1:6:1

- <https://corpus.quran.com/wordmorphology.jsp?location=%281%3A6%3A1%29>
- <https://corpus.quran.com/treebank.jsp?chapter=1&verse=6>
- <https://www.alukah.net/sharia/0/167735/تيسير-الإعراب-لآي-الكتاب/>

### Word 1:6:2

- <https://corpus.quran.com/wordmorphology.jsp?location=%281%3A6%3A2%29>
- <https://corpus.quran.com/grammar.jsp?chapter=1&verse=6>

### Word 1:6:3

- <https://corpus.quran.com/wordmorphology.jsp?location=%281%3A6%3A3%29>
- <https://corpus.quran.com/qurandictionary.jsp?q=qwm>
- <https://www.alukah.net/sharia/0/167735/تيسير-الإعراب-لآي-الكتاب/>

### Word 1:7:1

- <https://corpus.quran.com/wordmorphology.jsp?location=%281%3A7%3A1%29>
- <https://corpus.quran.com/grammar.jsp?chapter=1&verse=7>

### Word 1:7:2

- <https://corpus.quran.com/wordmorphology.jsp?location=%281%3A7%3A2%29>
- <https://corpus.quran.com/treebank.jsp?chapter=1&verse=7>

### Word 1:7:3

- <https://corpus.quran.com/wordmorphology.jsp?location=%281%3A7%3A3%29>
- <https://corpus.quran.com/treebank.jsp?chapter=1&verse=7>

### Word 1:7:4

- <https://corpus.quran.com/wordmorphology.jsp?location=%281%3A7%3A4%29>

### Word 1:7:5

- <https://corpus.quran.com/wordmorphology.jsp?location=%281%3A7%3A5%29>
- <https://corpus.quran.com/grammar.jsp?chapter=1&verse=7>

### Word 1:7:6

- <https://corpus.quran.com/wordmorphology.jsp?location=%281%3A7%3A6%29>
- <https://corpus.quran.com/grammar.jsp?chapter=1&verse=7>

### Word 1:7:7

- <https://corpus.quran.com/wordmorphology.jsp?location=%281%3A7%3A7%29>
- <https://corpus.quran.com/grammar.jsp?chapter=1&verse=7>

### Word 1:7:8

- <https://corpus.quran.com/wordmorphology.jsp?location=%281%3A7%3A8%29>
- <https://corpus.quran.com/grammar.jsp?chapter=1&verse=7>

### Word 1:7:9

- <https://corpus.quran.com/wordmorphology.jsp?location=%281%3A7%3A9%29>
- <https://corpus.quran.com/grammar.jsp?chapter=1&verse=7>

### Ayah 1:1

- <https://corpus.quran.com/grammar.jsp?chapter=1&verse=1>
- <https://corpus.quran.com/treebank.jsp?chapter=1&token=1&verse=1>
- <https://quran.com/al-fatihah/1/tafsirs/en-tafisr-ibn-kathir>

### Phrase 1:1:phrase1

- <https://corpus.quran.com/documentation/possessiveconstruction.jsp>

### Phrase 1:1:phrase2

- <https://corpus.quran.com/grammar.jsp?chapter=1&verse=1>

### Ayah 1:2

- <https://corpus.quran.com/grammar.jsp?chapter=1&verse=2>
- <https://www.alukah.net/sharia/0/167735/تيسير-الإعراب-لآي-الكتاب/>
- <https://quran.com/al-fatihah/2/tafsirs/en-tafisr-ibn-kathir>

### Phrase 1:2:phrase1

- <https://www.alukah.net/sharia/0/167735/تيسير-الإعراب-لآي-الكتاب/>

### Phrase 1:2:phrase2

- <https://corpus.quran.com/grammar.jsp?chapter=1&verse=2>

### Ayah 1:3

- <https://corpus.quran.com/treebank.jsp?chapter=1&token=1&verse=3>
- <https://corpus.quran.com/documentation/adjective.jsp>
- <https://quran.com/al-fatihah/3/tafsirs/en-tafisr-ibn-kathir>

### Phrase 1:3:phrase1

- <https://corpus.quran.com/documentation/adjective.jsp>

### Ayah 1:4

- <https://corpus.quran.com/treebank.jsp?chapter=1&token=1&verse=4>
- <https://www.alukah.net/sharia/0/167735/تيسير-الإعراب-لآي-الكتاب/>
- <https://quran.com/al-fatihah/4/tafsirs/en-tafisr-ibn-kathir>

### Phrase 1:4:phrase1

- <https://www.alukah.net/sharia/0/167735/تيسير-الإعراب-لآي-الكتاب/>

### Ayah 1:5

- <https://corpus.quran.com/treebank.jsp?chapter=1&token=1&verse=5>
- <https://www.alukah.net/sharia/0/167735/تيسير-الإعراب-لآي-الكتاب/>
- <https://quran.com/al-fatihah/5/tafsirs/en-tafisr-ibn-kathir>

### Phrase 1:5:phrase1

- <https://quran.com/al-fatihah/5/tafsirs/en-tafisr-ibn-kathir>

### Phrase 1:5:phrase2

- <https://corpus.quran.com/treebank.jsp?chapter=1&token=1&verse=5>

### Ayah 1:6

- <https://corpus.quran.com/grammar.jsp?chapter=1&verse=6>
- <https://corpus.quran.com/treebank.jsp?chapter=1&token=1&verse=6>
- <https://quran.com/al-fatihah/6/tafsirs/en-tafisr-ibn-kathir>
- <https://www.alukah.net/sharia/0/167735/تيسير-الإعراب-لآي-الكتاب/>

### Phrase 1:6:phrase1

- <https://corpus.quran.com/grammar.jsp?chapter=1&verse=6>

### Phrase 1:6:phrase2

- <https://corpus.quran.com/treebank.jsp?chapter=1&token=1&verse=6>

### Ayah 1:7

- <https://corpus.quran.com/grammar.jsp?chapter=1&verse=7>
- <https://www.islamweb.net/amp/ar/library/content/69/6/سورة-الفاتحة>
- <https://www.islamweb.net/amp/ar/library/content/69/7/سورة-الفاتحة>
- <https://quran.com/al-fatihah/7/tafsirs/en-tafisr-ibn-kathir>

### Phrase 1:7:phrase1

- <https://www.islamweb.net/amp/ar/library/content/69/6/سورة-الفاتحة>

### Phrase 1:7:phrase2

- <https://www.islamweb.net/amp/ar/library/content/69/6/سورة-الفاتحة>

### Phrase 1:7:phrase3

- <https://www.islamweb.net/amp/ar/library/content/69/7/سورة-الفاتحة>

### Phrase 1:7:phrase4

- <https://corpus.quran.com/grammar.jsp?chapter=1&verse=7>

### Rule preposition

- <https://corpus.quran.com/documentation/prepositionphrase.jsp>

### Rule idafa

- <https://corpus.quran.com/documentation/possessiveconstruction.jsp>

### Rule adjective

- <https://corpus.quran.com/documentation/adjective.jsp>

### Rule definite

- <https://corpus.quran.com/documentation/morphologicalfeatures.jsp>

### Rule genitive

- <https://corpus.quran.com/grammar.jsp?chapter=1&verse=2>

### Rule nominative

- <https://corpus.quran.com/treebank.jsp?chapter=1&token=1&verse=2>

### Rule imperfect

- <https://corpus.quran.com/treebank.jsp?chapter=1&token=1&verse=5>

### Rule imperative

- <https://corpus.quran.com/documentation/imperative.jsp>

### Rule object-pronoun

- <https://corpus.quran.com/documentation/verb.jsp>

### Rule relative

- <https://corpus.quran.com/documentation/subordinate.jsp>

### Rule conjunction

- <https://corpus.quran.com/documentation/conjunction.jsp>

### Rule negation

- <https://corpus.quran.com/grammar.jsp?chapter=1&verse=7>

### Rule participle

- <https://corpus.quran.com/documentation/morphologicalfeatures.jsp>

### Rule fronted-object

- <https://quran.com/al-fatihah/5/tafsirs/en-tafisr-ibn-kathir>

### Rule weak-verb

- <https://www.islamweb.net/amp/ar/library/content/69/6/سورة-الفاتحة>

### Rule perfect

- <https://corpus.quran.com/wordmorphology.jsp?location=(1:7:3)>

### Rule accusative

- <https://corpus.quran.com/grammar.jsp?chapter=1&verse=6>

### Rule subject-pronoun

- <https://corpus.quran.com/documentation/verb.jsp>

### Root س م و

- <https://corpus.quran.com/qurandictionary.jsp?q=smw>
- <https://arabiclexicon.hawramani.com/سمو/>

### Root أ ل ه

- <https://corpus.quran.com/qurandictionary.jsp?q=Alh>
- <https://arabiclexicon.hawramani.com/أله/>

### Root ر ح م

- <https://corpus.quran.com/qurandictionary.jsp?q=rHm>

### Root ح م د

- <https://corpus.quran.com/qurandictionary.jsp?q=Hmd>

### Root ر ب ب

- <https://corpus.quran.com/qurandictionary.jsp?q=rbb>
- <https://arabiclexicon.hawramani.com/ربب/>

### Root ع ل م

- <https://corpus.quran.com/qurandictionary.jsp?q=Elm>

### Root م ل ك

- <https://corpus.quran.com/qurandictionary.jsp?q=mlk>

### Root ي و م

- <https://corpus.quran.com/qurandictionary.jsp?q=ywm>
- <https://www.arabicacademy.gov.eg/ar/search_engine/roots/يوم>

### Root د ي ن

- <https://corpus.quran.com/qurandictionary.jsp?q=dyn>
- <https://www.arabicacademy.gov.eg/ar/search_engine/roots/دين>

### Root ع ب د

- <https://corpus.quran.com/qurandictionary.jsp?q=Ebd>
- <https://www.arabicacademy.gov.eg/ar/search_engine/roots/عبد>

### Root ع و ن

- <https://corpus.quran.com/qurandictionary.jsp?q=Ewn>
- <https://www.arabicacademy.gov.eg/ar/search_engine/roots/عون>

### Root ه د ي

- <https://corpus.quran.com/qurandictionary.jsp?q=hdy>
- <https://www.arabicacademy.gov.eg/ar/search_engine/roots/هدي>

### Root ص ر ط

- <https://corpus.quran.com/qurandictionary.jsp?q=SrT>

### Root ق و م

- <https://corpus.quran.com/qurandictionary.jsp?q=qwm>

### Root ن ع م

- <https://corpus.quran.com/qurandictionary.jsp?q=nEm>
- <https://www.arabicacademy.gov.eg/ar/search_engine/roots/نعم>

### Root غ ي ر

- <https://corpus.quran.com/qurandictionary.jsp?q=gyr>

### Root غ ض ب

- <https://corpus.quran.com/qurandictionary.jsp?q=gDb>

### Root ض ل ل

- <https://corpus.quran.com/qurandictionary.jsp?q=Dll>

### Verb paradigm 1:5:2

- <https://corpus.quran.com/wordmorphology.jsp?location=%281%3A5%3A2%29>
- <https://www.arabicacademy.gov.eg/ar/search_engine/roots/عبد>

### Verb paradigm 1:5:4

- <https://corpus.quran.com/wordmorphology.jsp?location=%281%3A5%3A4%29>
- <https://corpus.quran.com/qurandictionary.jsp?q=Ewn>
- <https://www.arabicacademy.gov.eg/ar/search_engine/roots/عون>
- <https://corpus.quran.com/grammar.jsp?chapter=1&verse=6>

### Verb paradigm 1:6:1

- <https://corpus.quran.com/wordmorphology.jsp?location=%281%3A6%3A1%29>
- <https://www.arabicacademy.gov.eg/ar/search_engine/roots/هدي>

### Verb paradigm 1:7:3

- <https://corpus.quran.com/wordmorphology.jsp?location=%281%3A7%3A3%29>
- <https://corpus.quran.com/qurandictionary.jsp?q=nEm>
- <https://www.arabicacademy.gov.eg/ar/search_engine/roots/نعم>

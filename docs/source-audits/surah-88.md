# Surah 88 — Al-Ghashiyah: source audit

Researched 2026-11-13. This lesson contains **26 ayahs and 92 word occurrences**. All Urdu word glosses, translations, grammatical explanations, dictionary summaries, verb-paradigm notes and concise tafsir notes are original AI-assisted editorial drafts. They are **not scholar-reviewed** and are not attributed to a named Urdu translator. No third-party Urdu book, dictionary, translation or tafsir was imported.

## Arabic inventory

`inventory-88.json` records the Quran.com Content API v4 `text_uthmani` word strings ([source](https://api.quran.com/api/v4/verses/by_chapter/88?words=true&word_fields=text_uthmani&per_page=50)), retrieved 2026-11-13, excluding end-of-ayah markers. Recitation signs that the API separates from a word by a space — waqf signs, the saktah sign, the sajdah sign and the rub al-hizb marker — are not part of the stored word token, following the Surahs 110–114 precedent. The inventory lists all 0 such exclusions with the original API text; no other character was changed. The unnumbered opening basmalah is not inserted as a numbered occurrence. Automated tests compare every stored word, its id and its segments with this inventory.

Word boundaries and counts match the Quranic Arabic Corpus morphology for every ayah. Per-ayah word counts: 4, 3, 2, 3, 4, 6, 6, 3, 2, 3, 4, 3, 3, 2, 2, 2, 6, 4, 4, 4, 4, 3, 4, 4, 3, 4.

## Sources and method

- **Morphology:** Quranic Arabic Corpus morphology 0.4 (Kais Dukes, GNU GPL with the Corpus terms of use), a verbatim distribution checked by SHA-256 `910b721a8f04f4334ac5d4c62b19e858f5d720c525bb975f2e750ea2c6bb532d`. It was consulted locally for segmentation, part of speech, root, lemma, verb form, voice, mood and case; it is not bundled or redistributed.
- **Word types and roots** are derived deterministically from the Corpus stem tags with the mapping that reproduces root assignments for all 230 word occurrences of the existing lessons, including words with no root. A preposition with an attached pronoun (لَهُ، بِهِ، عَلَيْهِمْ) is a particle, following Surahs 1, 105 and 112. Words without a Corpus root, such as proper names, keep no root.
- **Syntax:** the Corpus word-by-word pages (English morphology and Arabic i‘rab for every word) and verse grammar pages (Arabic i‘rab notes adapted from the Quran Printing Complex), retrieved 2026-11-13. 3 of 26 verse pages carry no grammar note: 15, 16, 20.
- **Verb paradigms** (باب، ماضی، مضارع، وزن) for all 17 verb occurrences come from a shared library of 657 verb lexemes for this expansion edition. Form I vowel classes were decided from imperfects attested across the whole Corpus and standard lexica (Lane, Lisan al-Arab, al-Mu‘jam al-Wasit), and every entry was independently reviewed.
- **Tafsir consulted** through the Quran.com API: Tafsir al-Muyassar (Arabic), Tafsir al-Sa‘di (Arabic) and Ibn Kathir (abridged, English). Translations consulted for meaning only: Saheeh International and Mufti Taqi Usmani. The Urdu wording is original and concise; it is not a translation of these works.

Word-type, verb-form and passive-voice counts below apply the adjudicated occurrence overrides; they are not uncorrected Corpus tag counts.

| Measure | Count |
| --- | ---: |
| Nouns | 36 |
| Adjectives | 11 |
| Verbs | 17 |
| Particles | 26 |
| Pronouns | 2 |
| Passive verb occurrences | 5 |
| Distinct roots | 50 |
| Verb form I | 12 |
| Verb form II | 2 |
| Verb form IV | 2 |
| Verb form V | 1 |

## Editorial checks

The lesson is organized into 3 chunks of whole ayahs. No review-result snapshot was supplied. This source audit therefore does not certify completion of independent reviews, fixes or final confirmations. The intended workflow requires independent grammar and meaning/tafsir reviews and a clean final confirmation after every correction, including minor findings.
The chunk validator checks the exact Arabic word, segments that rejoin to the exact word, ids and order, rule references, verb-note presence, phrase coverage of every word, and the absence of URLs or Latin text. AI review and automated checks are not scholarly review.

Nouns without a Corpus root (root left empty): وَزَرَابِىُّ، وَنَمَارِقُ، يَوْمَئِذٍ، يَوْمَئِذٍۢ.

## Analysis decisions and cautions

Notes recorded by the authors and reviewers for scholarly review; they mark alternative analyses, source disagreements and editorial choices.

- **88:2:2:** The ayah note treats yawm as attached to khāshiʿa and the tanwīn on idh as compensation for the omitted clause about the Overwhelming Event enveloping people. The two grammatical units are separated for teaching although QAC has one segment.
- **88:2:3:** The linked QAC analysis reads this as a modifier of the mubtadaʾ and makes the clause in 88:4 its first predicate. Another analysis takes khāshiʿa as the predicate in 88:2.
- **88:3:** Al-Saʿdi favors toil and weariness in the punishment on contextual grounds and records the reading of futile worldly striving without faith. Ibn Kathir also reports a mixed reading: worldly toil in disobedience and exhaustion in the Fire.
- **88:5:1:** The passive imperfect surface form can also arise from Form IV. The lesson follows the QAC occurrence and the reviewed Form I passive paradigm. The lemma field gives the active citation form as required by the guide.
- **88:6:4:** The word-level iʿrab gives the generic exception label. The ayah note specifically calls this restriction and attaches the following prepositional phrase to an understood adjective of ṭaʿām.
- **88:6:6:** The packet's root entry for ḍ-r-ʿ covers supplication and humility but gives no gloss for ḍarīʿ. The plant gloss follows the packet tafsir, which also reports an interpretation as a tree of Hell.
- **88:4–7:** The packet lacks separate Muyassar fields for 88:4–7. Its grouped text at 88:2–3 covers these verses, and the packet also supplies al-Saʿdi and grouped Ibn Kathir.
- **88:7:4:** The final Uthmani dotless yāʾ represents the retained root yāʾ of the indicative imperfect. There is no weak-letter deletion.
- **88:8:3:** The ayah note calls nāʿima a modifier and attaches the time adverb to it. Taking nāʿima as the predicate is an alternative.
- **88:9:2:** QAC ayah note makes راضية the khabar of وجوه (88:8), which implies ناعمة there is its na't; some i'rab works instead take ناعمة as first khabar and راضية as a second khabar. Followed QAC.
- **88:9:1:** The shadda on the initial letter of لسعيها, لا (88:11:1), مرفوعة (88:13:3) and موضوعة (88:14:2) reflects idgham of the preceding tanwin in continuous recitation, not part of the word; stated in morphology where relevant.
- **88:9:1:** QAC tags سعي as a plain noun (N), not VN; the lesson calls it the masdar of سعى lexically, consistent with the root entry, without tagging the verbal-noun rule.
- **88:11:2:** QAC tags تسمع as 2MS (hidden أنت, generic addressee) and the translation follows it; the prefix ت would also allow 3FS with hidden هي referring to the faces (88:8). Both English translations render 'they will hear'. Noted briefly in dictionaryUrdu.
- **88:11:4:** لاغية is QAC active participle; it is explained as qualifying an elided noun (كلمة لاغية, as Sa'di glosses 'كلمة لغو'). Some take it as a masdar-like noun meaning لغو; not mentioned in the lesson.
- **88:12:1:** QAC word i'rab gives only جار ومجرور for فيها in 88:12-13; lesson uses the standard analysis خبر مقدم (متعلق بمحذوف) with عين/سرر as مبتدأ مؤخر, the whole clause being na't of جنة per the ayah notes. An alternative takes the noun as fa'il of the prepositional phrase (relying on its mawsuf).
- **88:10:1:** Sa'di's text for 88:10 also comments on قطوفها دانية, which is not in this ayah; that part was not used in the tafsir summary.
- **88:15:1:** QAC gives no root for نمارق or زرابي (88:16:1); root left null. The singulars نمرقة and زربية are given lexically in dictionaryUrdu and should be checked by the reviewer. QAC marks both nouns indefinite. The adjectives agree in definiteness. The diptote nouns take no tanwin, and the triptote adjectives take nominative tanwin.
- **88:15:1:** Ayah notes for 88:15 and 88:16 are empty; نمارق and زرابي are taken as coordinated on سرر like أكواب in 88:14 (QAC note there).
- **88:17:1:** Word i'rab calls the فاء of أفلا زائدة (QAC SUP) while the ayah note calls it مستأنفة; many grammarians call it عاطفة on an implied clause. Followed the word i'rab per the extra-particle rule.
- **88:17:4:** QAC tags الإبل masculine (M). The lesson follows the root entry and the feminine singular agreement in خلقت, teaching الإبل as a grammatically feminine collective.
- **88:17:5:** Following the QAC ayah note: كيف is حال (محل نصب) governed by the following verb, the clause كيف خلقت is بدل اشتمال of الإبل, and the verb ينظرون is suspended (معلق). Same analysis applied to 88:18.
- **88:9:2:** Participle lemmas follow the QAC/fork feminine lemmas (راضية، عالية، لاغية، جارية، مرفوعة، موضوعة، مصفوفة، مبثوثة), with the assimilation shadda of مرفوعة/موضوعة removed; broken-plural nouns use the singular dictionary base required by the guide.
- **88:19:3:** Packet i'rab gives only 'اسم استفهام' for كَيْفَ; the lesson adds the standard analysis (built on fatḥa, maḥall naṣb ḥāl of the passive verb's subject) and follows the ayah note that the clause كيف نُصبت is badal ishtimāl of الجبال. Same treatment in 88:20 (whose ayah note is empty; parallel structure assumed).
- **88:19:4:** Lemma written as the active citation نَصَبَ per the guide; QAC lemma is the inflected passive نُصِبَتْ. Same for 88:20:4 (سَطَحَ for QAC سُطِحَتْ).
- **88:21:1:** Followed the i'rab (فاء استئنافية, clause مستأنفة). Some grammarians call this فاء الفصيحة (an implied condition: if they do not reflect, then remind); not used here.
- **88:22:** Followed the ayah note that the whole clause لَّسْتَ عَلَيْهِم بِمُصَيْطِرٍ is نعت of مُذَكِّرٌ; many i'rab works treat it as a new (مستأنفة) sentence instead.
- **88:22:3:** QAC tags مُصَيْطِر as a form II active participle; the vocalised pattern is مُفَيْعِل from سَيْطَرَ (فَيْعَلَ, attached to the quadriliteral), so the lesson gives the مُفَيْعِل pattern and does not tag derived-form. The ص stands for the root's س (assimilation to ط); qirāʾāt variants (س / إشمام) not mentioned. Reviewer may wish to confirm.
- **88:23:2:** The ayah i'rab makes مَن an exception from the pronoun of عَلَيْهِم (naṣb as an exception, or jarr as badal of the pronoun) and coordinates 88:24 with the clause of وَكَفَرَ within the relative clause. Muyassar and Saʿdi gloss إِلَّا as لكن, supporting a disconnected reading. In that analysis مَن can be the mubtada and the clause beginning فَيُعَذِّبُهُ its khabar, with fāʾ linking the predicate to the relative. The translation and tafsir reflect the disconnected reading.
- **88:24:1:** Word-level i'rab says الفاء استئنافية, but the ayah note says the clause فيعذبه is معطوفة على جملة «كفر». Per the resumption rule, the lesson follows the ayah note (عاطفة) and tags conjunction, not resumption.
- **88:24:3:** Followed ayah note: ٱلْعَذَابَ is نائب مفعول مطلق (the noun عَذَاب standing in for the masdar تَعْذِيب); some parse it simply as مفعول مطلق (اسم مصدر).
- **88:25:3:** QAC tags إِيَاب as plain N, with no verbal noun feature. The morphology and dictionary explanations identify it as the masdar of آبَ يَؤُوبُ following the root library. The weak-verb rule covers the change of root wāw to yāʾ.
- **88:26:4:** QAC tags حِسَاب as a form III verbal noun (of حَاسَبَ); lexica also give it as a masdar of form I حَسَبَ يَحْسُبُ (to count). Lesson follows QAC.

## Per-ayah sources

- **88:1:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=88&verse=1); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=88&verse=1); [Quran.com](https://quran.com/88/1).
- **88:2:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=88&verse=2); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=88&verse=2); [Quran.com](https://quran.com/88/2).
- **88:3:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=88&verse=3); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=88&verse=3); [Quran.com](https://quran.com/88/3).
- **88:4:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=88&verse=4); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=88&verse=4); [Quran.com](https://quran.com/88/4).
- **88:5:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=88&verse=5); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=88&verse=5); [Quran.com](https://quran.com/88/5).
- **88:6:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=88&verse=6); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=88&verse=6); [Quran.com](https://quran.com/88/6).
- **88:7:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=88&verse=7); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=88&verse=7); [Quran.com](https://quran.com/88/7).
- **88:8:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=88&verse=8); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=88&verse=8); [Quran.com](https://quran.com/88/8).
- **88:9:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=88&verse=9); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=88&verse=9); [Quran.com](https://quran.com/88/9).
- **88:10:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=88&verse=10); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=88&verse=10); [Quran.com](https://quran.com/88/10).
- **88:11:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=88&verse=11); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=88&verse=11); [Quran.com](https://quran.com/88/11).
- **88:12:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=88&verse=12); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=88&verse=12); [Quran.com](https://quran.com/88/12).
- **88:13:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=88&verse=13); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=88&verse=13); [Quran.com](https://quran.com/88/13).
- **88:14:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=88&verse=14); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=88&verse=14); [Quran.com](https://quran.com/88/14).
- **88:15:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=88&verse=15); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=88&verse=15); [Quran.com](https://quran.com/88/15).
- **88:16:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=88&verse=16); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=88&verse=16); [Quran.com](https://quran.com/88/16).
- **88:17:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=88&verse=17); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=88&verse=17); [Quran.com](https://quran.com/88/17).
- **88:18:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=88&verse=18); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=88&verse=18); [Quran.com](https://quran.com/88/18).
- **88:19:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=88&verse=19); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=88&verse=19); [Quran.com](https://quran.com/88/19).
- **88:20:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=88&verse=20); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=88&verse=20); [Quran.com](https://quran.com/88/20).
- **88:21:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=88&verse=21); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=88&verse=21); [Quran.com](https://quran.com/88/21).
- **88:22:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=88&verse=22); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=88&verse=22); [Quran.com](https://quran.com/88/22).
- **88:23:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=88&verse=23); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=88&verse=23); [Quran.com](https://quran.com/88/23).
- **88:24:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=88&verse=24); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=88&verse=24); [Quran.com](https://quran.com/88/24).
- **88:25:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=88&verse=25); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=88&verse=25); [Quran.com](https://quran.com/88/25).
- **88:26:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter=88&verse=26); [word morphology](https://corpus.quran.com/wordbyword.jsp?chapter=88&verse=26); [Quran.com](https://quran.com/88/26).

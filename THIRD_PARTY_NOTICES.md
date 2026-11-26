# Third-party notices

The source code license does not replace the terms applicable to third-party content, fonts, or dependencies. Public access to a website is not a grant of unrestricted redistribution rights.

## Quranic Arabic Corpus

Grammatical annotations and root assignments come from, or were checked against, the [Quranic Arabic Corpus](https://corpus.quran.com/), by Kais Dukes and the University of Leeds. The project describes its corpus as open source under the GNU General Public License; its [download terms](https://corpus.quran.com/download/) also require a visible source credit and link and restrict alteration of the distributed source file.

The download header identifies:

> Quranic Arabic Corpus (Version 0.4)
>
> Copyright (C) 2011 Kais Dukes
>
> License: GNU General Public License

Since 2026-11-26 the grammar layer of every source-only word (the 71 chapters without an earlier lesson, and Al-Baqarah 2:21–286) is derived from Corpus 0.4 morphology (part of speech, root, lemma, segments and features, rendered with fixed Urdu terminology) and the Corpus's own Arabic i‘rab from its word-by-word pages, built by [`content-pipeline/full-quran`](content-pipeline/full-quran/README.md). The 43 previously published chapters also keep their earlier AI-assisted Urdu grammar explanations, which were checked against the Corpus; scholarly review remains pending. The repository does not contain the bulk morphology download (the pipeline reads a local, git-ignored copy) or claim to be an official Corpus release. The app retains a concise Corpus credit and link. Its Arabic i‘rab reference pages credit the Quran Printing Complex; the corpus describes its Arabic text as based on Tanzil. Preserve the original copyright and source notices when adding or redistributing source datasets, and retain the additional conditions published by the relevant source.

## Quran.com

The Arabic word text (`text_uthmani`), word positions, Urdu word-by-word meanings and the six Urdu ayah translations are retrieved from the [Quran.com API v4](https://api.quran.com/api/v4) (Quran Foundation). Settings → About credits Quran.com alongside the Corpus credit. Quran.com does not name the translator of its Urdu word-by-word data in the API; provenance is the API URL and retrieval date recorded in `content-pipeline/full-quran/inventory/sources.json`.

The ayah translations belong to their translators and publishers; Quran.com is the source from which they were retrieved:

| Quran.com resource | Translation |
| --- | --- |
| 234 | Fateh Muhammad Jalandhari (default) |
| 54 | Muhammad Junagarhi |
| 151 | Shaykh al-Hind Mahmud al-Hasan |
| 158 | Dr. Israr Ahmad, _Bayan-ul-Quran_ |
| 97 | Syed Abul A'la Maududi, _Tafheem-ul-Quran_ |
| 819 | Maulana Wahiduddin Khan |

Only footnote markers and markup were removed; the words are verbatim. No tafsir or footnote text is included. **No license or permission to redistribute these translations, or the Urdu word-by-word meanings, has been recorded.** Obtain and record the rights holders' terms before relying on redistribution in a public release.

## Dictionaries and explanatory works

The earlier AI-assisted Urdu summaries in the 43 previously published chapters were informed by the following references; their full text is not included:

- [Cairo Arabic Language Academy](https://www.arabicacademy.gov.eg/): dictionary entries used to verify roots and verb vowel patterns.
- [Hawramani Arabic Lexicon](https://arabiclexicon.hawramani.com/): hosted classical lexical entries consulted for selected roots.
- Al-‘Ukbari, _Al-Tibyan fi i‘rab al-Qur’an_, consulted through [Islamweb](https://www.islamweb.net/).
- Aamir Al-Khumaisi, _Taysir al-i‘rab li-ay al-kitab_, consulted through [Alukah](https://www.alukah.net/sharia/0/167735/تيسير-الإعراب-لآي-الكتاب/).
- Ibn Kathir commentary, consulted through [Quran.com](https://quran.com/al-fatihah/1/tafsirs/en-tafisr-ibn-kathir).

No general redistribution license for those hosted editions is asserted. No third-party Urdu book, dictionary or tafsir has been imported; the only third-party Urdu texts are the Quran.com translations and word-by-word meanings above. Quran.com Uthmani text supplies the Arabic; the per-Surah audits distinguish its API and page sources from QAC morphology checks. The remaining AI-assisted Urdu grammar explanations in previously published chapters are teaching drafts awaiting scholarly review. Record-specific references and editorial context are retained in [the content provenance file](docs/content-provenance.md).

## Fonts and software

`apps/mobile/LICENSE` records the Expo template's MIT license. It does not assign a general license to this project's original application code or study content.

The bundled reading fonts are distributed under the SIL Open Font License 1.1, except Al Qalam Quran Majeed (below). Each font file is in both `apps/web/public/fonts/` and `apps/mobile/assets/fonts/` (identical bytes) next to its copyright and license file, and is listed in the shared registry `packages/core/src/fonts.ts`:

| File | Font | Copyright / source | License file |
| --- | --- | --- | --- |
| `amiri-quran.ttf` | Amiri Quran 1.003 | The Amiri Project Authors, [aliftype/amiri](https://github.com/aliftype/amiri) | `OFL-Amiri.txt` |
| `naskh.ttf` | Noto Naskh Arabic 2.021 | The Noto Project Authors, [notofonts](https://github.com/notofonts/arabic) | `OFL-Naskh.txt` |
| `nastaliq.ttf` | Noto Nastaliq Urdu 3.007 | The Noto Project Authors, [notofonts/nastaliq](https://github.com/notofonts/nastaliq) | `OFL-Nastaliq.txt` |
| `scheherazade-new.ttf` | Scheherazade New 4.500, Regular | SIL Global (Reserved Font Names "Scheherazade", "SIL"), [silnrsi/font-scheherazade](https://github.com/silnrsi/font-scheherazade), file from [google/fonts](https://github.com/google/fonts/tree/main/ofl/scheherazadenew) | `OFL-ScheherazadeNew.txt` |
| `lateef.ttf` | Lateef 4.400, Regular | SIL Global (Reserved Font Names "Lateef", "SIL"), [silnrsi/font-lateef](https://github.com/silnrsi/font-lateef), file from [google/fonts](https://github.com/google/fonts/tree/main/ofl/lateef) | `OFL-Lateef.txt` |
| `al-qalam-quran-majeed.ttf` | Al Qalam Quran Majeed (unmodified, renamed on disk) | © Al Qalam; credits Abdul Majeed Khan, Arif Karim, Shakir-ul-Qadree, Jawad; [alqlm.org/fonts](http://www.alqlm.org/fonts) | `LICENSE-AlQalamQuranMajeed.txt` (not open source) |

The SIL fonts are unmodified and only renamed on disk.

Al Qalam Quran Majeed carries no license text of its own, and part of its glyph outlines are identical to PDMS Saleem Quran Font, whose end-user license forbids distribution without a distribution license from Pakistan Data Management Services. It may be published in builds only with the rights holders' written permission, recorded in `LICENSE-AlQalamQuranMajeed.txt`. DigitalKhatt IndoPak was removed from the app in November 2026.

Fonts whose terms do not clearly permit redistribution in an app are not bundled. This includes the AlQuran IndoPak font by QuranWBW, the King Fahd Complex (KFGQPC) fonts and PDMS Saleem QuranFont.

Dependency licenses remain with their respective packages and are recorded through the package lockfile. Keep the font license files when redistributing builds or source assets.

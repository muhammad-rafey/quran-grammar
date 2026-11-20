# Third-party notices

The source code license does not replace the terms applicable to third-party content, fonts, or dependencies. Public access to a website is not a grant of unrestricted redistribution rights.

## Quranic Arabic Corpus

Grammatical annotations and root assignments were checked against the [Quranic Arabic Corpus](https://corpus.quran.com/), by Kais Dukes and the University of Leeds. The project describes its corpus as open source under the GNU General Public License; its [download terms](https://corpus.quran.com/download/) also require a visible source credit and link and restrict alteration of the distributed source file.

The download header identifies:

> Quranic Arabic Corpus (Version 0.4)
>
> Copyright (C) 2011 Kais Dukes
>
> License: GNU General Public License

This repository contains newly structured teaching datasets for Al-Fatihah and Surahs 105–114, plus five-Surah drafts (18, 23, 32, 36 and 55) published by explicit owner authorization on 2026-11-07 while scholarly review remains pending, with original AI-assisted Urdu explanations. It does not contain the bulk morphology download or claim to be an official Corpus release. The app retains a concise Corpus credit and link. Its Arabic i‘rab reference pages credit the Quran Printing Complex; the corpus describes its Arabic text as based on Tanzil. Preserve the original copyright and source notices when adding or redistributing source datasets, and retain the additional conditions published by the relevant source.

## Dictionaries and explanatory works

Original Urdu summaries were informed by the following references; their full text is not included:

- [Cairo Arabic Language Academy](https://www.arabicacademy.gov.eg/): dictionary entries used to verify roots and verb vowel patterns.
- [Hawramani Arabic Lexicon](https://arabiclexicon.hawramani.com/): hosted classical lexical entries consulted for selected roots.
- Al-‘Ukbari, _Al-Tibyan fi i‘rab al-Qur’an_, consulted through [Islamweb](https://www.islamweb.net/).
- Aamir Al-Khumaisi, _Taysir al-i‘rab li-ay al-kitab_, consulted through [Alukah](https://www.alukah.net/sharia/0/167735/تيسير-الإعراب-لآي-الكتاب/).
- Ibn Kathir commentary, consulted through [Quran.com](https://quran.com/al-fatihah/1/tafsirs/en-tafisr-ibn-kathir).

No general redistribution license for those hosted editions is asserted. No third-party Urdu book, dictionary, translation, or complete tafsir has been imported. Quran.com Uthmani text supplies the new Arabic inventories; the per-Surah audits distinguish its API and page sources from QAC morphology checks. The Urdu content is an AI-assisted authored teaching draft awaiting scholarly review. Record-specific references and editorial context are retained in [the content provenance file](docs/content-provenance.md).

## Fonts and software

`apps/mobile/LICENSE` records the Expo template's MIT license. It does not assign a general license to this project's original application code or study content.

All bundled reading fonts are distributed under the SIL Open Font License 1.1. Each font file is in both `apps/web/public/fonts/` and `apps/mobile/assets/fonts/` (identical bytes) next to its copyright and license file, and is listed in the shared registry `packages/core/src/fonts.ts`:

| File | Font | Copyright / source | License file |
| --- | --- | --- | --- |
| `amiri-quran.ttf` | Amiri Quran 1.003 | The Amiri Project Authors, [aliftype/amiri](https://github.com/aliftype/amiri) | `OFL-Amiri.txt` |
| `naskh.ttf` | Noto Naskh Arabic 2.021 | The Noto Project Authors, [notofonts](https://github.com/notofonts/arabic) | `OFL-Naskh.txt` |
| `nastaliq.ttf` | Noto Nastaliq Urdu 3.007 | The Noto Project Authors, [notofonts/nastaliq](https://github.com/notofonts/nastaliq) | `OFL-Nastaliq.txt` |
| `scheherazade-new.ttf` | Scheherazade New 4.500, Regular | SIL Global (Reserved Font Names "Scheherazade", "SIL"), [silnrsi/font-scheherazade](https://github.com/silnrsi/font-scheherazade), file from [google/fonts](https://github.com/google/fonts/tree/main/ofl/scheherazadenew) | `OFL-ScheherazadeNew.txt` |
| `lateef.ttf` | Lateef 4.400, Regular | SIL Global (Reserved Font Names "Lateef", "SIL"), [silnrsi/font-lateef](https://github.com/silnrsi/font-lateef), file from [google/fonts](https://github.com/google/fonts/tree/main/ofl/lateef) | `OFL-Lateef.txt` |
| `digitalkhatt-indopak.otf` | DigitalKhatt IndoPak (font version 0.1, release v1.0.0-beta.1) | Amine Anane and Tarteel Inc., [DigitalKhatt/indopakfont](https://github.com/DigitalKhatt/indopakfont) (no Reserved Font Name) | `OFL-DigitalKhattIndoPak.txt` |

The SIL fonts are unmodified and only renamed on disk. `digitalkhatt-indopak.otf` is a modified version, as the OFL permits: the upstream `indopak.otf` of release v1.0.0-beta.1 (a CFF2 variable font with justification axes) was instanced at its default location with fontTools (`varLib.instancer LTAT=0 RTAT=0 --static`) and its outlines converted from CFF2 to CFF (`cffLib.CFF2ToCFF`) so that older Android and iOS text stacks can render it. No glyphs were removed, and shaping of every word in the study data is identical to the upstream file.

Fonts whose terms do not clearly permit redistribution in an app are not bundled. This includes Al Qalam Quran Majeed, whose files carry no license, the AlQuran IndoPak font by QuranWBW, the King Fahd Complex (KFGQPC) fonts and PDMS Saleem QuranFont.

Dependency licenses remain with their respective packages and are recorded through the package lockfile. Keep the font license files when redistributing builds or source assets.

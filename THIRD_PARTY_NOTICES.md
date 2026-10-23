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

This repository contains newly structured teaching datasets for Al-Fatihah and Surahs 105–114, with original AI-assisted Urdu explanations. It does not contain the bulk morphology download or claim to be an official Corpus release. The app retains a concise Corpus credit and link. Its Arabic i‘rab reference pages credit the Quran Printing Complex; the corpus describes its Arabic text as based on Tanzil. Preserve the original copyright and source notices when adding or redistributing source datasets, and retain the additional conditions published by the relevant source.

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

Bundled Amiri Quran, Noto Naskh Arabic, and Noto Nastaliq Urdu fonts are distributed under the SIL Open Font License 1.1; their font copyright and license files accompany the app assets. Dependency licenses remain with their respective packages and are recorded through the package lockfile. Keep the font license files when redistributing builds or source assets.

"""Surah set of one pipeline work directory.

The original work directory (content-pipeline/) holds the five-Surah expansion and has no
edition file, so every script keeps its historical constants. A further work directory (for
example content-pipeline/juz-amma/) declares its own Surahs in <work-dir>/edition.json:

{"name": "...", "surahs": [{"number": 85, "ayahs": 22, "words": 109, "nameEnglish": "Al-Buruj",
  "nameArabicShort": "البروج", "nameUrdu": "سورۃ البروج", "nameArabic": "سُورَةُ الْبُرُوجِ",
  "slug": "al-buruj"}, ...]}

"words" may be null until prepare.py has counted the fetched Arabic inventory.
"""
import json
import os
from collections import OrderedDict

FIVE = [
    dict(number=18, ayahs=110, words=1579, nameEnglish='Al-Kahf', nameArabicShort='الكهف',
         nameUrdu='سورۃ الکہف', nameArabic='سُورَةُ الْكَهْفِ', slug='al-kahf'),
    dict(number=23, ayahs=118, words=1050, nameEnglish="Al-Mu'minun", nameArabicShort='المؤمنون',
         nameUrdu='سورۃ المؤمنون', nameArabic='سُورَةُ الْمُؤْمِنُونَ', slug='al-muminun'),
    dict(number=32, ayahs=30, words=372, nameEnglish='As-Sajdah', nameArabicShort='السجدة',
         nameUrdu='سورۃ السجدہ', nameArabic='سُورَةُ السَّجْدَةِ', slug='as-sajdah'),
    dict(number=36, ayahs=83, words=725, nameEnglish='Ya-Sin', nameArabicShort='يس',
         nameUrdu='سورۃ یٰسٓ', nameArabic='سُورَةُ يسٓ', slug='ya-sin'),
    dict(number=55, ayahs=78, words=351, nameEnglish='Ar-Rahman', nameArabicShort='الرحمن',
         nameUrdu='سورۃ الرحمٰن', nameArabic='سُورَةُ الرَّحْمٰنِ', slug='ar-rahman'),
]


def load(work):
    """Return the edition's Surah records (ordered by number) for a work directory."""
    path = os.path.join(work, 'edition.json')
    if not os.path.exists(path):
        return [dict(x) for x in FIVE]
    data = json.load(open(path, encoding='utf-8'))
    surahs = sorted(data['surahs'], key=lambda x: x['number'])
    if os.environ.get('QG_EDITION_ONLY'):
        # Staged preparation: restrict this process to a subset of the edition.
        only = {int(x) for x in os.environ['QG_EDITION_ONLY'].split(',')}
        surahs = [s for s in surahs if s['number'] in only]
    for s in surahs:
        for key in ('number', 'ayahs', 'nameEnglish', 'nameArabicShort', 'nameUrdu', 'nameArabic', 'slug'):
            if key not in s:
                raise ValueError(f'edition.json: Surah record lacks {key}: {s}')
    return surahs


def ayah_counts(work):
    return OrderedDict((s['number'], s['ayahs']) for s in load(work))


def numbers(work):
    return tuple(s['number'] for s in load(work))


def by_number(work):
    return OrderedDict((s['number'], s) for s in load(work))


def is_default(work):
    return not os.path.exists(os.path.join(work, 'edition.json'))

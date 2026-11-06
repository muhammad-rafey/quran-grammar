"""Strict validator for one authored chunk.

Usage: python3 -I validate_chunk.py <work-dir> <chunk-id>
Prints a JSON report; exit status 0 only when there are no errors.
"""
import json
import os
import re
import sys

WORK, CHUNK = sys.argv[1], sys.argv[2]
surah = int(CHUNK.split('-')[0])
plan = {p['chunk']: p for p in json.load(open(os.path.join(WORK, 'meta', 'plan.json')))}
words_meta = json.load(open(os.path.join(WORK, 'meta', 'words.json')))
rules = json.load(open(os.path.join(WORK, 'libs', 'rules.json')))['rules']
rule_ids = {r['id'] for r in rules}
path = os.path.join(WORK, 'chunks', str(surah), f'{CHUNK}.json')

errors, warnings = [], []


def err(where, message):
    errors.append(f'{where}: {message}')


def warn(where, message):
    warnings.append(f'{where}: {message}')


ARABIC_LETTER = re.compile(r'[ء-يٱ-ۓۺ-ۿ]')
URDU_ONLY = re.compile(r'[یکہےںٹڈڑھگچپژۃ]')
LATIN = re.compile(r'[A-Za-z]')
URL = re.compile(r'https?://|www\.', re.I)
CONTROL = re.compile(r'[\u0000-\u001F\u007F​-‍﻿]')

LIMITS = {
    'meaningUrdu': (1, 60),
    'posUrdu': (3, 70),
    'lemma': (1, 40),
    'morphologyUrdu': (20, 450),
    'syntaxUrdu': (20, 450),
    'dictionaryUrdu': (20, 450),
    'verbNoteUrdu': (15, 400),
    'translationUrdu': (5, 900),
    'themeUrdu': (2, 60),
    'tafsirUrdu': (40, 900),
    'labelUrdu': (2, 70),
    'explanationUrdu': (15, 450),
    'roleUrdu': (2, 70),
    'segmentMeaningUrdu': (1, 60),
}


def check_text(where, name, value, urdu=True, limit_key=None):
    if not isinstance(value, str) or not value.strip():
        err(where, f'{name} must be a non-empty string')
        return
    if value != value.strip():
        err(where, f'{name} has leading/trailing whitespace')
    lo, hi = LIMITS[limit_key or name]
    if not lo <= len(value) <= hi:
        err(where, f'{name} length {len(value)} outside {lo}-{hi}')
    if CONTROL.search(value) or '\n' in value or '\t' in value:
        err(where, f'{name} contains a newline, tab or invisible control character')
    if URL.search(value):
        err(where, f'{name} contains a URL; source links stay in the audit')
    if LATIN.search(value):
        err(where, f'{name} contains Latin letters; write Urdu/Arabic only')
    if not ARABIC_LETTER.search(value):
        err(where, f'{name} contains no Arabic-script letters')
    if urdu and name not in ('meaningUrdu', 'segmentMeaningUrdu', 'labelUrdu', 'themeUrdu', 'posUrdu', 'roleUrdu') and not URDU_ONLY.search(value):
        warn(where, f'{name} has no Urdu-specific letters; check it is Urdu prose, not Arabic')


try:
    data = json.load(open(path, encoding='utf-8'))
except FileNotFoundError:
    print(json.dumps({'ok': False, 'errors': [f'missing file {path}'], 'warnings': []}, ensure_ascii=False))
    sys.exit(1)
except json.JSONDecodeError as exc:
    print(json.dumps({'ok': False, 'errors': [f'invalid JSON: {exc}'], 'warnings': []}, ensure_ascii=False))
    sys.exit(1)

spec = plan[CHUNK]
allowed_top = {'chunk', 'ayahs', 'words', 'auditNotes'}
if not isinstance(data, dict):
    err('chunk', 'top level must be an object')
    data = {}
for key in data:
    if key not in allowed_top:
        err('chunk', f'unexpected top-level key {key}')
if data.get('chunk') != CHUNK:
    err('chunk', f'chunk must be "{CHUNK}"')

# Words
words = data.get('words')
if not isinstance(words, list):
    err('words', 'must be a list')
    words = []
ids = [w.get('id') if isinstance(w, dict) else None for w in words]
if ids != spec['wordIds']:
    missing = [i for i in spec['wordIds'] if i not in ids]
    extra = [i for i in ids if i not in spec['wordIds']]
    err('words', f'ids must equal the planned ids in order; missing={missing[:8]} extra={extra[:8]}')
word_fields = {'id', 'meaningUrdu', 'posUrdu', 'lemma', 'morphologyUrdu', 'syntaxUrdu', 'dictionaryUrdu', 'segments', 'ruleIds', 'verbNoteUrdu'}
for w in words:
    if not isinstance(w, dict):
        err('words', 'each word must be an object')
        continue
    wid = w.get('id')
    meta = words_meta.get(wid)
    where = f'word {wid}'
    if meta is None:
        err(where, 'unknown id')
        continue
    for key in w:
        if key not in word_fields:
            err(where, f'unexpected key {key} (arabic/pos/root/ayah/position are filled automatically)')
    for name in ('meaningUrdu', 'posUrdu', 'morphologyUrdu', 'syntaxUrdu', 'dictionaryUrdu'):
        check_text(where, name, w.get(name))
    lemma = w.get('lemma')
    if not isinstance(lemma, str) or not lemma.strip():
        err(where, 'lemma must be a non-empty Arabic string')
    else:
        if URDU_ONLY.search(lemma) or LATIN.search(lemma):
            err(where, 'lemma must use Arabic letters only (no Urdu ی ک ہ ے or Latin)')
        if not ARABIC_LETTER.search(lemma):
            err(where, 'lemma has no Arabic letters')
        if not 1 <= len(lemma) <= LIMITS['lemma'][1]:
            err(where, 'lemma too long')
    segs = w.get('segments')
    if not isinstance(segs, list) or not segs:
        err(where, 'segments must be a non-empty list')
        segs = []
    joined = ''
    for i, s in enumerate(segs):
        sw = f'{where} segment {i + 1}'
        if not isinstance(s, dict) or set(s) != {'arabic', 'roleUrdu', 'meaningUrdu'}:
            err(sw, 'segment needs exactly arabic, roleUrdu, meaningUrdu')
            continue
        a = s.get('arabic')
        if not isinstance(a, str) or not a:
            err(sw, 'arabic must be non-empty')
            continue
        if URDU_ONLY.search(a) or LATIN.search(a) or ' ' in a:
            err(sw, 'segment arabic must be an exact slice of the Quranic word (no spaces, Urdu letters or Latin)')
        joined += a
        check_text(sw, 'roleUrdu', s.get('roleUrdu'))
        check_text(sw, 'meaningUrdu', s.get('meaningUrdu'), limit_key='segmentMeaningUrdu')
    if segs and joined != meta['arabic']:
        err(where, f'segments must concatenate exactly to the Quranic word {meta["arabic"]!r}; got {joined!r}')
    rids = w.get('ruleIds')
    if not isinstance(rids, list) or not rids or not all(isinstance(r, str) for r in rids):
        err(where, 'ruleIds must be a non-empty list of rule ids')
    else:
        if len(set(rids)) != len(rids):
            err(where, 'ruleIds contains duplicates')
        unknown = [r for r in rids if r not in rule_ids]
        if unknown:
            err(where, f'unknown ruleIds {unknown}; use ids from libs/rules.json only')
    is_verb = meta['pos'] == 'verb'
    if is_verb:
        check_text(where, 'verbNoteUrdu', w.get('verbNoteUrdu'))
    elif 'verbNoteUrdu' in w:
        err(where, 'verbNoteUrdu is only for verbs (this word is not a verb in the QAC-derived word type)')
    pos_urdu = w.get('posUrdu') or ''
    expect = {
        'verb': r'فعل',
        'noun': r'اسم|ظرف|مصدر|صفت|منادی|علم',
        'adjective': r'صفت|اسم',
        'particle': r'حرف|حروف',
        'pronoun': r'ضمیر|موصول|اشارہ|اشارة',
    }[meta['pos']]
    if not re.search(expect, pos_urdu):
        warn(where, f'posUrdu "{pos_urdu}" does not name the QAC-derived word type {meta["pos"]}')

# Ayahs
ayahs = data.get('ayahs')
if not isinstance(ayahs, list):
    err('ayahs', 'must be a list')
    ayahs = []
numbers = [a.get('number') if isinstance(a, dict) else None for a in ayahs]
if numbers != spec['ayahs']:
    err('ayahs', f'ayah numbers must be exactly {spec["ayahs"]} in order; got {numbers}')
ayah_fields = {'number', 'translationUrdu', 'themeUrdu', 'tafsirUrdu', 'phrases'}
for a in ayahs:
    if not isinstance(a, dict):
        continue
    n = a.get('number')
    where = f'ayah {surah}:{n}'
    for key in a:
        if key not in ayah_fields:
            err(where, f'unexpected key {key}')
    for name in ('translationUrdu', 'themeUrdu', 'tafsirUrdu'):
        check_text(where, name, a.get(name))
    phrases = a.get('phrases')
    if not isinstance(phrases, list) or not phrases:
        err(where, 'phrases must be a non-empty list')
        continue
    ayah_ids = [i for i in spec['wordIds'] if words_meta[i]['ayah'] == n]
    covered = set()
    seen = set()
    for j, p in enumerate(phrases):
        pw = f'{where} phrase {j + 1}'
        if not isinstance(p, dict) or set(p) != {'wordIds', 'labelUrdu', 'explanationUrdu'}:
            err(pw, 'phrase needs exactly wordIds, labelUrdu, explanationUrdu')
            continue
        wids = p.get('wordIds')
        if not isinstance(wids, list) or not wids:
            err(pw, 'wordIds must be a non-empty list')
            continue
        if len(set(wids)) != len(wids):
            err(pw, 'duplicate wordIds')
        bad = [i for i in wids if i not in ayah_ids]
        if bad:
            err(pw, f'wordIds outside this ayah: {bad}')
        if [i for i in ayah_ids if i in wids] != wids:
            warn(pw, 'wordIds are not in reading order')
        covered.update(wids)
        sig = (tuple(wids), p.get('labelUrdu'))
        if sig in seen:
            err(pw, 'duplicate phrase')
        seen.add(sig)
        check_text(pw, 'labelUrdu', p.get('labelUrdu'))
        check_text(pw, 'explanationUrdu', p.get('explanationUrdu'))
    uncovered = [i for i in ayah_ids if i not in covered]
    if uncovered:
        err(where, f'every word needs phrase context; uncovered {uncovered}')

notes = data.get('auditNotes', [])
if not isinstance(notes, list) or not all(isinstance(x, dict) and set(x) == {'ref', 'noteEnglish'} for x in notes):
    err('auditNotes', 'must be a list of {ref, noteEnglish}')

print(json.dumps({'ok': not errors, 'chunk': CHUNK, 'errors': errors, 'warnings': warnings}, ensure_ascii=False, indent=1))
sys.exit(0 if not errors else 1)

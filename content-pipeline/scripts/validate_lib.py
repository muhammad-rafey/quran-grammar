"""Validate authored shared libraries.

Usage:
  python3 -I validate_lib.py <work-dir> rules
  python3 -I validate_lib.py <work-dir> lexemes <batch-id>
  python3 -I validate_lib.py <work-dir> roots <batch-id>
"""
import json
import os
import re
import sys

WORK, KIND = sys.argv[1], sys.argv[2]
BATCH = sys.argv[3] if len(sys.argv) > 3 else None
errors, warnings = [], []
ARABIC_LETTER = re.compile(r'[ء-يٱ-ۓ]')
URDU_ONLY = re.compile(r'[یکہےںٹڈڑھگچپژ]')
LATIN = re.compile(r'[A-Za-z]')
URL = re.compile(r'https?://|www\.', re.I)
CONTROL = re.compile(r'[\u0000-\u001F\u007F​-‍﻿]')


def text(where, name, value, lo, hi, urdu=True, latin_ok=None):
    if not isinstance(value, str) or not value.strip() or value != value.strip():
        errors.append(f'{where}: {name} must be a trimmed non-empty string')
        return
    if not lo <= len(value) <= hi:
        errors.append(f'{where}: {name} length {len(value)} outside {lo}-{hi}')
    if CONTROL.search(value) or '\n' in value:
        errors.append(f'{where}: {name} has a newline/control character')
    if URL.search(value):
        errors.append(f'{where}: {name} contains a URL')
    stripped = re.sub(latin_ok, '', value) if latin_ok else value
    if LATIN.search(stripped):
        errors.append(f'{where}: {name} contains Latin letters')
    if not ARABIC_LETTER.search(value):
        errors.append(f'{where}: {name} has no Arabic-script letters')
    if urdu and lo >= 20 and not URDU_ONLY.search(value):
        warnings.append(f'{where}: {name} has no Urdu-specific letters')


def arabic_only(where, name, value, allow=''):
    if not isinstance(value, str) or not value.strip():
        errors.append(f'{where}: {name} must be non-empty Arabic')
        return
    if URDU_ONLY.search(value) or LATIN.search(value):
        errors.append(f'{where}: {name} must use Arabic letters only (no Urdu ی ک ہ or Latin)')
    if re.search(r'[^؀-ۿ\s' + re.escape(allow) + r']', value):
        errors.append(f'{where}: {name} has characters outside Arabic script: {value!r}')


if KIND == 'rules':
    path = os.path.join(WORK, 'libs', 'rules.json')
    data = json.load(open(path, encoding='utf-8'))
    rules = data.get('rules') if isinstance(data, dict) else None
    if not isinstance(rules, list) or not rules:
        errors.append('rules: must be {"rules": [...]}')
        rules = []
    ids = []
    for r in rules:
        where = f"rule {r.get('id') if isinstance(r, dict) else r}"
        if not isinstance(r, dict) or set(r) != {'id', 'titleUrdu', 'explanationUrdu', 'appliesWhenEnglish'}:
            errors.append(f'{where}: needs exactly id, titleUrdu, explanationUrdu, appliesWhenEnglish')
            continue
        if not re.fullmatch(r'[a-z][a-z0-9-]{1,40}', r['id']):
            errors.append(f'{where}: id must be lowercase kebab-case ASCII')
        ids.append(r['id'])
        text(where, 'titleUrdu', r['titleUrdu'], 2, 40)
        text(where, 'explanationUrdu', r['explanationUrdu'], 40, 420)
        if not isinstance(r['appliesWhenEnglish'], str) or len(r['appliesWhenEnglish']) < 15:
            errors.append(f'{where}: appliesWhenEnglish must explain when authors tag a word with it')
    if len(set(ids)) != len(ids):
        errors.append('rules: duplicate ids')
elif KIND == 'lexemes':
    batches = json.load(open(os.path.join(WORK, 'meta', 'lexeme-batches.json')))
    keys = batches[BATCH]
    path = os.path.join(WORK, 'libs', 'lexemes', f'{BATCH}.json')
    data = json.load(open(path, encoding='utf-8'))
    entries = data.get('entries') if isinstance(data, dict) else None
    if not isinstance(entries, list):
        errors.append('lexemes: must be {"entries": [...]}')
        entries = []
    got = [e.get('key') for e in entries if isinstance(e, dict)]
    if got != keys:
        errors.append(f'lexemes: keys must equal the batch keys in order; missing={[k for k in keys if k not in got][:6]} extra={[k for k in got if k not in keys][:6]}')
    fields = {'key', 'baabUrdu', 'formUrdu', 'past', 'present', 'pattern', 'noteUrdu', 'evidenceEnglish'}
    for e in entries:
        if not isinstance(e, dict):
            continue
        where = f"lexeme {e.get('key')}"
        if set(e) != fields:
            errors.append(f'{where}: needs exactly {sorted(fields)}')
            continue
        text(where, 'baabUrdu', e['baabUrdu'], 3, 70)
        text(where, 'formUrdu', e['formUrdu'], 3, 80, latin_ok=r'\((?:I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII|QI|QII|QIII|QIV)\)')
        arabic_only(where, 'past', e['past'])
        if e['present'] != '—':
            arabic_only(where, 'present', e['present'])
        arabic_only(where, 'pattern', e['pattern'], allow='—/')
        text(where, 'noteUrdu', e['noteUrdu'], 15, 320)
        if not isinstance(e['evidenceEnglish'], str) or len(e['evidenceEnglish']) < 10:
            errors.append(f'{where}: evidenceEnglish must state the basis for the bab/form decision')
        if ' — ' not in e['pattern'] and e['present'] != '—':
            warnings.append(f'{where}: pattern should read past — present, e.g. فَعَلَ — يَفْعُلُ')
elif KIND == 'roots':
    batches = json.load(open(os.path.join(WORK, 'meta', 'root-batches.json')))
    keys = batches[BATCH]
    path = os.path.join(WORK, 'libs', 'roots', f'{BATCH}.json')
    data = json.load(open(path, encoding='utf-8'))
    entries = data.get('entries') if isinstance(data, dict) else None
    if not isinstance(entries, list):
        errors.append('roots: must be {"entries": [...]}')
        entries = []
    got = [e.get('root') for e in entries if isinstance(e, dict)]
    if got != keys:
        errors.append(f'roots: entries must equal the batch roots in order; missing={[k for k in keys if k not in got][:6]} extra={[k for k in got if k not in keys][:6]}')
    for e in entries:
        if not isinstance(e, dict):
            continue
        where = f"root {e.get('root')}"
        if set(e) != {'root', 'meaningUrdu', 'noteUrdu'}:
            errors.append(f'{where}: needs exactly root, meaningUrdu, noteUrdu')
            continue
        text(where, 'meaningUrdu', e['meaningUrdu'], 4, 160)
        text(where, 'noteUrdu', e['noteUrdu'], 20, 360)
else:
    errors.append(f'unknown kind {KIND}')

print(json.dumps({'ok': not errors, 'kind': KIND, 'batch': BATCH, 'errors': errors, 'warnings': warnings}, ensure_ascii=False, indent=1))
sys.exit(0 if not errors else 1)

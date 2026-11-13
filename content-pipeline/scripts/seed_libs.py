"""Seed a further edition's libraries with already reviewed entries from another work directory.

Usage: python3 -I seed_libs.py <work-dir> <source-work-dir>
Copies, unchanged, every verb-paradigm and root entry that the edition needs and the source
libraries already contain into libs/lexemes/lex-00.json and libs/roots/root-00.json, and
records their provenance in reports/seeded-libraries.json. Missing entries are then authored
in new batches (make_batches.py --missing-only).
"""
import glob
import hashlib
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from qac import dump  # noqa: E402

WORK, SOURCE = sys.argv[1], sys.argv[2]
meta = os.path.join(WORK, 'meta')
lexemes = json.load(open(os.path.join(meta, 'lexemes.json')))
roots = json.load(open(os.path.join(meta, 'roots.json')))
overrides = json.load(open(os.path.join(meta, 'overrides.json')))
needed_lex = set(lexemes) | {v['lexemeKey'] for v in overrides.values() if isinstance(v, dict) and 'lexemeKey' in v}


def load(kind, key):
    out, files = {}, {}
    for path in sorted(glob.glob(os.path.join(SOURCE, 'libs', kind, '*.json'))):
        for entry in json.load(open(path))['entries']:
            out[entry[key]] = entry
            files[entry[key]] = os.path.relpath(path, SOURCE)
    return out, files


src_lex, lex_files = load('lexemes', 'key')
src_roots, root_files = load('roots', 'root')
lex_entries = [src_lex[k] for k in sorted(needed_lex) if k in src_lex]
root_entries = [src_roots[k] for k in sorted(roots) if k in src_roots]
os.makedirs(os.path.join(WORK, 'libs', 'lexemes'), exist_ok=True)
os.makedirs(os.path.join(WORK, 'libs', 'roots'), exist_ok=True)
dump(os.path.join(WORK, 'libs', 'lexemes', 'lex-00.json'), {'entries': lex_entries})
dump(os.path.join(WORK, 'libs', 'roots', 'root-00.json'), {'entries': root_entries})
os.makedirs(os.path.join(WORK, 'reports'), exist_ok=True)


def sha(path):
    return hashlib.sha256(open(path, 'rb').read()).hexdigest()


dump(os.path.join(WORK, 'reports', 'seeded-libraries.json'), {
    'note': 'Entries copied verbatim from the previously AI-reviewed five-Surah libraries; scholarly review pending.',
    'sourceWork': os.path.relpath(SOURCE, WORK),
    'sourceFiles': {p: sha(os.path.join(SOURCE, p)) for p in sorted(set(lex_files.values()) | set(root_files.values()))},
    'lexemes': {e['key']: lex_files[e['key']] for e in lex_entries},
    'roots': {e['root']: root_files[e['root']] for e in root_entries},
})
print('seeded lexemes', len(lex_entries), 'of', len(needed_lex), '; roots', len(root_entries), 'of', len(roots))

"""Split verb lexemes and roots into authoring batches; write batch input files.

Usage: python3 -I make_batches.py <work-dir>
"""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from qac import dump  # noqa: E402

WORK = sys.argv[1]
meta = os.path.join(WORK, 'meta')
lexemes = json.load(open(os.path.join(meta, 'lexemes.json')))
roots = json.load(open(os.path.join(meta, 'roots.json')))
words = json.load(open(os.path.join(meta, 'words.json')))
overrides = json.load(open(os.path.join(meta, 'overrides.json')))
LEX_BATCH, ROOT_BATCH = int(os.environ.get("QG_LEX_BATCH", 30)), int(os.environ.get("QG_ROOT_BATCH", 45))
# Optional batch-name tag for staged further editions (--tag a gives lex-a01, root-a01).
TAG = sys.argv[sys.argv.index('--tag') + 1] if '--tag' in sys.argv else ''
ALL_LEXEME_KEYS = set(lexemes)
if '--missing-only' in sys.argv[2:]:
    # Further editions: entries already present in libs/ (seeded from reviewed libraries)
    # are not re-authored; only the missing ones are batched after them.
    import glob
    have_lex, have_roots = set(), set()
    for path in glob.glob(os.path.join(WORK, 'libs', 'lexemes', '*.json')):
        have_lex.update(e['key'] for e in json.load(open(path))['entries'])
    for path in glob.glob(os.path.join(WORK, 'libs', 'roots', '*.json')):
        have_roots.update(e['root'] for e in json.load(open(path))['entries'])
    if TAG:
        # Keys already assigned to another stage's batch are being authored there.
        for name, other in (('lexeme-batches.json', have_lex), ('root-batches.json', have_roots)):
            path = os.path.join(meta, name)
            if os.path.exists(path):
                for batch, keys in json.load(open(path)).items():
                    if not batch.startswith(f'lex-{TAG}') and not batch.startswith(f'root-{TAG}'):
                        other.update(keys)
    lexemes = {k: v for k, v in lexemes.items() if k not in have_lex}
    roots = {k: v for k, v in roots.items() if k not in have_roots}

# Keep every lexeme of one root in the same batch so forms of a family stay consistent.
by_root = {}
for key, lex in lexemes.items():
    by_root.setdefault(lex['root'] or '∅', []).append(key)
lex_batches, current = {}, []
for root in sorted(by_root):
    group = by_root[root]
    if current and len(current) + len(group) > LEX_BATCH:
        lex_batches[f'lex-{TAG}{len(lex_batches) + 1:02d}'] = current
        current = []
    current.extend(group)
if current:
    lex_batches[f'lex-{TAG}{len(lex_batches) + 1:02d}'] = current

# Route every occurrence through the adjudicated key without changing raw meta.
# This also removes a split occurrence from the original, incorrect paradigm.
effective_occurrences = {}
for raw_key, lex in lexemes.items():
    for raw in lex['occurrences']:
        occurrence = dict(raw)
        fix = overrides.get(raw['id'], {})
        key = fix.get('lexemeKey', raw_key)
        if fix:
            occurrence['qacCorrection'] = fix
            for field in ('mood', 'png'):
                if field in fix:
                    occurrence[field] = fix[field]
        effective_occurrences.setdefault(key, []).append(occurrence)

# Adjudication can split a Corpus lemma into a new lexeme. Keep these in their
# own batch so rebuilding metadata never drops the reviewed split or renumbers
# the original authoring batches.
extra_occurrences = {}
for wid, fix in overrides.items():
    key = fix.get('lexemeKey') if isinstance(fix, dict) else None
    if key and key not in ALL_LEXEME_KEYS and key not in globals().get('have_lex', set()):
        extra_occurrences.setdefault(key, []).append(wid)
if extra_occurrences:
    lex_batches[f'lex-{TAG}extra' if TAG else 'lex-extra'] = sorted(extra_occurrences)

root_keys = sorted(roots)
count = max(1, -(-len(root_keys) // ROOT_BATCH))
size = max(1, -(-len(root_keys) // count))
root_batches = {
    f'root-{TAG}{i // size + 1:02d}': root_keys[i : i + size]
    for i in range(0, len(root_keys), size)
}

def _merged(name, batches):
    # Tagged (staged) batches are added to the existing batch map, never replacing earlier stages.
    path = os.path.join(meta, name)
    if TAG and os.path.exists(path):
        merged = json.load(open(path))
        merged.update(batches)
        return merged
    return batches


dump(os.path.join(meta, 'lexeme-batches.json'), _merged('lexeme-batches.json', lex_batches))
dump(os.path.join(meta, 'root-batches.json'), _merged('root-batches.json', root_batches))
os.makedirs(os.path.join(WORK, 'inputs', 'lexemes'), exist_ok=True)
os.makedirs(os.path.join(WORK, 'inputs', 'roots'), exist_ok=True)
for name, keys in lex_batches.items():
    items = []
    for k in keys:
        if k in extra_occurrences:
            # Source metadata stays verbatim; make the correction explicit in
            # the reviewer input rather than silently inheriting the bad lemma.
            items.append({
                'key': k,
                'occurrenceCount': len(extra_occurrences[k]),
                'occurrences': [
                    {'id': wid, 'word': words[wid], 'qacCorrection': overrides[wid]}
                    for wid in sorted(extra_occurrences[k])
                ],
            })
            continue
        lex = dict(lexemes[k])
        occ = effective_occurrences.get(k, [])
        lex['occurrenceCount'] = len(occ)
        lex['occurrences'] = occ[:8]
        for o in lex['occurrences']:
            w = words[o['id']]
            o['qacIrabArabic'] = w['qacIrabArabic']
            o['qacSegments'] = [
                {'formArabic': s['formArabic'], 'tag': s['tag'], 'features': s['features']}
                for s in w['qacSegments']
            ]
        items.append(lex)
    dump(os.path.join(WORK, 'inputs', 'lexemes', f'{name}.json'), {'batch': name, 'lexemes': items})
for name, keys in root_batches.items():
    dump(
        os.path.join(WORK, 'inputs', 'roots', f'{name}.json'),
        {'batch': name, 'roots': [roots[k] for k in keys]},
    )
print('lexeme batches', len(lex_batches), [len(v) for v in lex_batches.values()])
print('root batches', len(root_batches), [len(v) for v in root_batches.values()])

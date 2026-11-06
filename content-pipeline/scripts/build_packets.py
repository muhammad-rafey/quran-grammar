"""Build one self-contained source packet per chunk (after the libraries are verified).

Usage: python3 -I build_packets.py <work-dir>
"""
import glob
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from qac import dump  # noqa: E402

WORK = sys.argv[1]
ONLY = set(sys.argv[2:])  # optional chunk ids; then only their library entries are required
meta = os.path.join(WORK, 'meta')
plan = json.load(open(os.path.join(meta, 'plan.json')))
words = json.load(open(os.path.join(meta, 'words.json')))
ayahs = json.load(open(os.path.join(meta, 'ayahs.json')))
lex_meta = json.load(open(os.path.join(meta, 'lexemes.json')))
overrides = {k: v for k, v in json.load(open(os.path.join(meta, 'overrides.json'))).items() if not k.startswith('_')}


def corrected(word):
    """Apply adjudicated corrections to QAC-derived occurrence data (copy; meta stays raw)."""
    fix = overrides.get(word['id'])
    if not fix:
        return word
    word = json.loads(json.dumps(word))
    if 'lexemeKey' in fix:
        word['lexemeKey'] = fix['lexemeKey']
    if 'verb' in word:
        for key, field in (('passive', 'passive'), ('mood', 'mood'), ('png', 'png'), ('verbForm', 'form')):
            if key in fix:
                word['verb'][field] = fix[key]
    word['qacCorrection'] = fix['noteEnglish'] + ' Follow this correction, not the raw QAC tag or the generated i‘rab line; record it in auditNotes.'
    return word
NAMES = {
    18: ('Al-Kahf', 'الكهف'),
    23: ("Al-Mu'minun", 'المؤمنون'),
    32: ('As-Sajdah', 'السجدة'),
    36: ('Ya-Sin', 'يس'),
    55: ('Ar-Rahman', 'الرحمن'),
}
lexemes, roots = {}, {}
for path in sorted(glob.glob(os.path.join(WORK, 'libs', 'lexemes', 'lex-*.json'))):
    for e in json.load(open(path))['entries']:
        lexemes[e['key']] = e
for path in sorted(glob.glob(os.path.join(WORK, 'libs', 'roots', 'root-*.json'))):
    for e in json.load(open(path))['entries']:
        roots[e['root']] = e
targets = [p for p in plan if not ONLY or p['chunk'] in ONLY]
needed = [corrected(words[i]) for p in targets for i in p['wordIds']]
missing_lex = sorted({w['lexemeKey'] for w in needed if 'lexemeKey' in w and w['lexemeKey'] not in lexemes})
missing_roots = sorted({w['root'] for w in needed if w['root'] and w['root'] not in roots})
if missing_lex or missing_roots:
    raise SystemExit(f'libraries incomplete: lexemes {missing_lex[:5]} roots {missing_roots[:5]}')

KEEP_SEG = ('kind', 'tag', 'formArabic', 'lemmaArabic', 'root', 'verbForm', 'aspect', 'passive', 'mood', 'case', 'png', 'pronoun', 'derivation', 'indefinite', 'features')
os.makedirs(os.path.join(WORK, 'packets'), exist_ok=True)
for spec in targets:
    s = spec['surah']
    first, last = spec['ayahs'][0], spec['ayahs'][-1]
    ctx = {}
    for label, n in (('previousAyah', first - 1), ('nextAyah', last + 1)):
        a = ayahs.get(f'{s}:{n}')
        if a:
            ctx[label] = {
                'key': a['key'],
                'textUthmani': a['textUthmani'],
                'translationSahihInternational': a['translationSahihInternational'],
            }
    packet_words = []
    chunk_lex, chunk_roots = {}, {}
    for wid in spec['wordIds']:
        w = dict(corrected(words[wid]))
        w.pop('forkSegments', None)
        w['qacSegments'] = [{k: seg[k] for k in KEEP_SEG if k in seg} for seg in w['qacSegments']]
        if 'lexemeKey' in w:
            chunk_lex[w['lexemeKey']] = lexemes[w['lexemeKey']]
        if w['root']:
            chunk_roots[w['root']] = roots[w['root']]
        packet_words.append(w)
    packet = {
        'chunk': spec['chunk'],
        'surah': {'number': s, 'nameEnglish': NAMES[s][0], 'nameArabic': NAMES[s][1]},
        'plannedAyahs': spec['ayahs'],
        'plannedWordIds': spec['wordIds'],
        'outputFile': os.path.join(WORK, 'chunks', str(s), f"{spec['chunk']}.json"),
        'validateCommand': f"python3 -I {os.path.join(WORK, 'scripts', 'validate_chunk.py')} {WORK} {spec['chunk']}",
        'context': ctx,
        'ayahs': [ayahs[f'{s}:{n}'] for n in spec['ayahs']],
        'words': packet_words,
        'lexemes': chunk_lex,
        'roots': chunk_roots,
    }
    os.makedirs(os.path.join(WORK, 'packets', str(s)), exist_ok=True)
    os.makedirs(os.path.join(WORK, 'chunks', str(s)), exist_ok=True)
    dump(os.path.join(WORK, 'packets', str(s), f"{spec['chunk']}.json"), packet)
print('packets', len(targets))

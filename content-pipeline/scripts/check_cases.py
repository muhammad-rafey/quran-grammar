"""Flag QAC noun/adjective case tags that contradict the vocalised stem ending (heuristic).

High-recall screen for human/agent adjudication: duals and sound plurals in the oblique
ending, tanwin al-fath/kasr, kasra endings (e.g. annexed vocatives) and fatha endings tagged
nominative, and nominative endings tagged accusative/genitive. Most flags need checking against
the i'rab; many are false positives. Output: meta/case-flags.json.
Usage: python3 -I check_cases.py <work-dir>
"""
import json
import os
import re
import sys

WORK = sys.argv[1]
words = json.load(open(os.path.join(WORK, 'meta', 'words.json')))
flags = []
for wid, w in words.items():
    segs = w['qacSegments']
    for i, s in enumerate(segs):
        if s['kind'] != 'STEM' or s['tag'] not in ('N', 'ADJ') or not s.get('case'):
            continue
        form = re.sub(r'[~o`^#@\[\]:;,.!+%{}\-]+$', '', s.get('formBuckwalter', ''))
        if not form:
            continue
        case = s['case']
        problem = None
        if case == 'NOM':
            if form.endswith(('ayoni', 'ayoni', 'iyna', 'ayo')) or form[-1] in 'FK':
                problem = 'oblique/accusative ending tagged NOM'
            elif form[-1] == 'i' and not form.endswith('Ani'):
                problem = 'kasra ending tagged NOM (annexed vocative or elided ya?)'
            elif form[-1] == 'a' and not form.endswith(('wna', 'una')):
                problem = 'fatha ending tagged NOM'
        elif case == 'ACC' and (form[-1] in 'NK' or form.endswith(('uwna', 'Ani', 'uw'))):
            problem = 'nominative/genitive ending tagged ACC'
        elif case == 'GEN' and (form[-1] in 'NF' or form.endswith(('uwna', 'Ani', 'uw'))):
            problem = 'nominative/accusative ending tagged GEN'
        if problem:
            flags.append({'id': wid, 'arabic': w['arabic'], 'segment': i + 1, 'stemBuckwalter': s.get('formBuckwalter'),
                          'qac': s['features'], 'problem': problem, 'irab': w['qacIrabArabic']})
json.dump(flags, open(os.path.join(WORK, 'meta', 'case-flags.json'), 'w'), ensure_ascii=False, indent=1)
print('case flags', len(flags))

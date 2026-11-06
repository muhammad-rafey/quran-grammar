"""Flag QAC verb tags that contradict the vocalised word: voice, mood and verb form.

Mood comes from the stem ending / five-verb nun and the governing particle; voice from the
prefix and stem vowels. Output: meta/verb-flags.json (for human/agent adjudication).
Usage: python3 -I check_verbs.py <work-dir>
"""
import json
import os
import re
import sys

WORK = sys.argv[1]
words = json.load(open(os.path.join(WORK, 'meta', 'words.json')))
order = list(words)
index = {wid: i for i, wid in enumerate(order)}
VOWELS = 'aiuoFNK'
JUSSIVE_LEMMAS = {'lam', 'lam~aA'}  # لَمْ، لَمَّا (negative)
SUBJ_LEMMAS = {'>an', 'lan', 'kay', 'Hat~aY', '>al~aA', 'kayolaA'}


def stem(w):
    return next((s for s in w['qacSegments'] if s['kind'] == 'STEM' and s['tag'] == 'V'), None)


def suffix_pron(w):
    return [s for s in w['qacSegments'] if s['kind'] == 'SUFFIX']


def form_vowels(bw):
    return [c for c in bw if c in VOWELS]


def governor(wid):
    """Nearest preceding particle that governs mood, within the same ayah (look back 2 words)."""
    w = words[wid]
    # prefixes on the same word: lam of command, purpose lam, fa of causation are prefixes
    for s in w['qacSegments']:
        if s['kind'] == 'PREFIX':
            if s['tag'] == 'IMPV':
                return 'JUS', 'lam of command'
            if s['tag'] in ('PRP',):
                return 'SUBJ', 'purpose lam'
    i = index[wid]
    for back in (1, 2):
        if i - back < 0:
            break
        prev = words[order[i - back]]
        if prev['ayah'] != w['ayah'] or prev['surah'] != w['surah']:
            break
        for s in prev['qacSegments']:
            lem = s.get('lemmaBuckwalter', '')
            if s['kind'] != 'STEM':
                continue
            if s['tag'] == 'NEG' and lem in JUSSIVE_LEMMAS:
                return 'JUS', f'{prev["arabic"]} (negative jazm particle)'
            if s['tag'] == 'PRO':
                return 'JUS', f'{prev["arabic"]} (prohibition)'
            if s['tag'] == 'COND' and lem in ('<in', 'man', 'maA', '>ay~', 'mahomaA', '<im~aA', '>ayona', 'mataY'):
                return 'JUS?', f'{prev["arabic"]} (conditional; jussive if it governs this verb)'
            if s['tag'] in ('SUB', 'NEG') and lem in SUBJ_LEMMAS:
                return 'SUBJ', f'{prev["arabic"]} (subjunctive particle)'
        if back == 1 and any(s['tag'] == 'V' for s in prev['qacSegments']):
            break
    return None, None


flags = []
for wid in order:
    w = words[wid]
    st = stem(w)
    if st is None:
        continue
    bw = st['formBuckwalter']
    aspect = st.get('aspect')
    passive = bool(st.get('passive'))
    form = st.get('verbForm', 'I')
    vowels = form_vowels(bw)
    problems = []
    # Voice
    if aspect == 'IMPF' and form == 'I' and vowels:
        prefix_vowel = vowels[0]
        inferred = 'PASS' if prefix_vowel == 'u' else 'ACT'
        if inferred == 'PASS' and not passive:
            problems.append(f'voice: Form I imperfect with prefix vowel u looks passive, QAC says active ({bw})')
        if inferred == 'ACT' and passive:
            problems.append(f'voice: QAC says passive but the prefix vowel is {prefix_vowel} ({bw})')
    if aspect == 'PERF' and vowels:
        first = vowels[0]
        if first == 'u' and not passive and not bw.startswith(('{', 'A')):
            problems.append(f'voice: perfect starting with u looks passive, QAC says active ({bw})')
        if passive and first != 'u' and not bw.startswith('{'):
            problems.append(f'voice: QAC says passive but the perfect does not start with u ({bw})')
    # Mood (imperfect only)
    if aspect == 'IMPF':
        qmood = st.get('mood') or 'IND'
        suffixes = suffix_pron(w)
        subj_pron = [s for s in suffixes if s.get('pronoun') or s['tag'] == 'PRON']
        five = any(re.search(r'(^|[^a-z])(w|y|A)', s['formBuckwalter']) and s['formBuckwalter'][:1] in ('w', 'y', 'A') for s in suffixes)
        surface = None
        if five:
            first_suffix = suffixes[0]['formBuckwalter']
            if 'n' in first_suffix:  # wna / yna / Ani keep the nun
                surface = 'IND'
            else:
                surface = 'NOT-IND'
        else:
            last = bw.rstrip('`^#:@"[;,.!-+%]~')
            tail = [c for c in last if c in VOWELS]
            end = last[-1] if last else ''
            if end == 'u':
                surface = 'IND'
            elif end == 'a':
                surface = 'SUBJ'
            elif end in ('o',) or (end not in VOWELS):
                surface = 'JUS'
        gov, why = governor(wid)
        expected = None
        if surface == 'IND':
            expected = 'IND'
        elif surface == 'SUBJ':
            expected = 'SUBJ'
        elif surface == 'JUS':
            expected = 'JUS'
        elif surface == 'NOT-IND':
            expected = {'JUS': 'JUS', 'JUS?': 'JUS', 'SUBJ': 'SUBJ'}.get(gov, 'SUBJ/JUS')
        if expected and expected not in ('SUBJ/JUS',) and expected != qmood:
            # A final vowel can be hidden (weak verbs) or replaced by an emphatic nun: only flag clear cases.
            emphatic = any(s['tag'] == 'EMPH' for s in w['qacSegments'] if s['kind'] == 'SUFFIX')
            if not emphatic:
                problems.append(f'mood: surface/governor suggests {expected}, QAC says {qmood} ({bw}; governor: {why})')
        elif expected == 'SUBJ/JUS' and qmood == 'IND':
            problems.append(f'mood: dropped nun means not indicative, QAC says IND ({bw})')
        if surface == 'NOT-IND' and gov in ('JUS', 'JUS?', 'SUBJ') and qmood in ('SUBJ', 'JUS') and {'JUS': 'JUS', 'JUS?': 'JUS', 'SUBJ': 'SUBJ'}[gov] != qmood:
            problems.append(f'mood: governor {why} suggests {gov}, QAC says {qmood} ({bw})')
    if problems:
        flags.append({'id': wid, 'arabic': w['arabic'], 'lexemeKey': w.get('lexemeKey'), 'qac': st['features'], 'problems': problems,
                      'irab': w['qacIrabArabic']})

with open(os.path.join(WORK, 'meta', 'verb-flags.json'), 'w', encoding='utf-8') as handle:
    json.dump(flags, handle, ensure_ascii=False, indent=1)
print(len(flags), 'flagged verb occurrences')
for f in flags:
    print(f['id'], f['arabic'], '|', '; '.join(f['problems']))

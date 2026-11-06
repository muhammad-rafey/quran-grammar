"""Shared helpers: QAC 0.4 parsing (Buckwalter), deterministic POS/root derivation.

The QAC 0.4 morphology file is read locally as a reference; it is never bundled.
"""
import json
import re
from collections import OrderedDict

BW2AR = {
    "'": 'ء', '>': 'أ', '&': 'ؤ', '<': 'إ', '}': 'ئ', 'A': 'ا',
    'b': 'ب', 'p': 'ة', 't': 'ت', 'v': 'ث', 'j': 'ج', 'H': 'ح',
    'x': 'خ', 'd': 'د', '*': 'ذ', 'r': 'ر', 'z': 'ز', 's': 'س',
    '$': 'ش', 'S': 'ص', 'D': 'ض', 'T': 'ط', 'Z': 'ظ', 'E': 'ع',
    'g': 'غ', '_': 'ـ', 'f': 'ف', 'q': 'ق', 'k': 'ك', 'l': 'ل',
    'm': 'م', 'n': 'ن', 'h': 'ه', 'w': 'و', 'Y': 'ى', 'y': 'ي',
    'F': 'ً', 'N': 'ٌ', 'K': 'ٍ', 'a': 'َ', 'u': 'ُ', 'i': 'ِ',
    '~': 'ّ', 'o': 'ْ', '^': 'ٓ', '#': 'ٔ', '`': 'ٰ', '{': 'ٱ',
    ':': 'ۜ', '@': '۟', '"': '۠', '[': 'ۢ', ';': 'ۣ', ',': 'ۥ',
    '.': 'ۦ', '!': 'ۨ', '-': '۪', '+': '۫', '%': '۬', ']': 'ۭ',
}


def bw2ar(text):
    return ''.join(BW2AR.get(ch, ch) for ch in text)


def root_to_ar(root_bw):
    """QAC root letters use A for a hamza radical; existing lessons write it as أ."""
    letters = []
    for ch in root_bw:
        letters.append('أ' if ch == 'A' else BW2AR[ch])
    return ' '.join(letters)


LINE = re.compile(r'^\((\d+):(\d+):(\d+):(\d+)\)\t(\S*)\t(\S+)\t(\S+)$')


def load_qac(path, surahs=None):
    """Return OrderedDict word_id -> list of segment dicts."""
    words = OrderedDict()
    with open(path, encoding='utf-8') as handle:
        for raw in handle:
            m = LINE.match(raw.rstrip('\n'))
            if not m:
                continue
            c, v, w, s, form, tag, feats = m.groups()
            if surahs is not None and int(c) not in surahs:
                continue
            parts = feats.split('|')
            kind = parts[0]
            seg = {
                'segment': int(s),
                'kind': kind,
                'tag': tag,
                'formBuckwalter': form,
                'formArabic': bw2ar(form),
                'features': feats,
            }
            for p in parts[1:]:
                if p.startswith('LEM:'):
                    seg['lemmaBuckwalter'] = p[4:]
                    seg['lemmaArabic'] = bw2ar(p[4:])
                elif p.startswith('ROOT:'):
                    seg['rootBuckwalter'] = p[5:]
                    seg['root'] = root_to_ar(p[5:])
                elif p.startswith('POS:'):
                    seg['pos'] = p[4:]
                elif p.startswith('MOOD:'):
                    seg['mood'] = p[5:]
                elif p.startswith('PRON:'):
                    seg['pronoun'] = p[5:]
                elif re.fullmatch(r'\((I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII)\)', p):
                    seg['verbForm'] = p[1:-1]
                elif p in ('PERF', 'IMPF', 'IMPV'):
                    seg['aspect'] = p
                elif p == 'PASS':
                    seg['passive'] = True
                elif p in ('NOM', 'ACC', 'GEN'):
                    seg['case'] = p
                elif p == 'INDEF':
                    seg['indefinite'] = True
                elif p in ('ACT', 'PCPL', 'VN'):
                    seg.setdefault('derivation', []).append(p)
                elif re.fullmatch(r'[123]?[MF]?[SDP]', p) and p:
                    seg['png'] = p
            words.setdefault(f'{c}:{v}:{w}', []).append(seg)
    return words


NOUN_INTERROGATIVES = {'kayof', 'man', 'maA', '>ayona', 'mataY', '>ay~aAna', 'kam', '>ay~', '>an~aY', 'maA*aA'}


def derive_pos(segments, wbw_description=None):
    """Map QAC stem tags to the app's five word types, reproducing existing lessons."""
    stems = [s for s in segments if s['kind'] == 'STEM']
    tags = [s['tag'] for s in stems]
    prefixes = [s for s in segments if s['kind'] == 'PREFIX']
    if 'V' in tags:
        return 'verb'
    if 'ADJ' in tags and not any(t in ('N', 'PN') for t in tags):
        return 'adjective'
    if any(t in ('N', 'PN', 'T', 'LOC', 'IMPN') for t in tags):
        return 'noun'
    if tags and all(t in ('INTG', 'COND') for t in tags):
        desc = (wbw_description or '').lower()
        if 'noun' in desc:
            return 'noun'
        if 'particle' in desc:
            return 'particle'
        lem = stems[0].get('lemmaBuckwalter', '')
        return 'noun' if lem in NOUN_INTERROGATIVES else 'particle'
    if tags and all(t in ('PRON', 'DEM', 'REL') for t in tags):
        has_preposition_prefix = any(p['tag'] == 'P' for p in prefixes)
        return 'particle' if has_preposition_prefix and tags == ['PRON'] else 'pronoun'
    return 'particle'


def derive_root(segments, pos):
    if pos in ('particle', 'pronoun'):
        return None
    for s in segments:
        if s['kind'] == 'STEM' and s.get('root'):
            return s['root']
    return None


def stem_root_any(segments):
    for s in segments:
        if s['kind'] == 'STEM' and s.get('root'):
            return s['root']
    return None


def verb_stem(segments):
    for s in segments:
        if s['kind'] == 'STEM' and s['tag'] == 'V':
            return s
    return None


def dump(path, value):
    with open(path, 'w', encoding='utf-8') as handle:
        json.dump(value, handle, ensure_ascii=False, indent=1)
        handle.write('\n')

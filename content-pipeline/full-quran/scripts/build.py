"""Source-first lesson builder for the full-Quran pipeline.

Usage:
  python3 -I build.py <full-quran-dir> packets   # deterministic layer + AI packets (git-ignored)
  python3 -I build.py <full-quran-dir> check     # validate the AI layer against the packets
  python3 -I build.py <full-quran-dir> assemble <repo-root>  # write lesson modules

Source layer (no AI):
  Arabic word text and occurrence IDs   Quran.com API v4 text_uthmani (pause signs excluded)
  meaningUrdu                           Quran.com word-by-word Urdu (language=ur)
  pos, root, lemma, segments + roles    Quranic Arabic Corpus 0.4 morphology
  morphologyUrdu                        fixed Urdu terms rendered from the Corpus tags
  syntaxUrdu                            the Corpus's own Arabic i'rab for the word
  tag-based ruleIds                     deterministic mapping from Corpus tags to the rule library
AI layer (full-quran/libs and full-quran/words): root meanings and verb paradigms not already in
the published libraries, segment meanings, dictionary notes and syntax-based rule additions.
No ayah translation, theme, tafsir or phrase cards are produced.
"""
import glob
import json
import os
import re
import sys
import unicodedata
from collections import OrderedDict

HERE = os.path.dirname(os.path.abspath(__file__))
PIPE = os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, os.path.join(PIPE, 'scripts'))
from qac import derive_pos, derive_root, load_qac  # noqa: E402

WORK = os.path.abspath(sys.argv[1])
MODE = sys.argv[2]
SCOPE = json.load(open(os.path.join(WORK, 'scope.json'), encoding='utf-8'))
RANGES = {r['surah']: r for r in SCOPE['ranges']}


def load(path):
    with open(path, encoding='utf-8') as handle:
        return json.load(handle)


def dump(path, value):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as handle:
        json.dump(value, handle, ensure_ascii=False, indent=1)
        handle.write('\n')


# ---------------------------------------------------------------- Urdu terminology (fixed tables)
PERSON = {'1': 'متکلم', '2': 'حاضر', '3': 'غائب'}
NUMBER = {'S': 'واحد', 'D': 'تثنیہ', 'P': 'جمع'}
GENDER = {'M': 'مذکر', 'F': 'مؤنث'}
CASE = {'NOM': 'مرفوع', 'ACC': 'منصوب', 'GEN': 'مجرور'}
MOOD = {'IND': 'مرفوع', 'SUBJ': 'منصوب', 'JUS': 'مجزوم'}
ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']
ORDINAL = ['اوّل', 'دوم', 'سوم', 'چہارم', 'پنجم', 'ششم', 'ہفتم', 'ہشتم', 'نہم', 'دہم', 'یازدہم', 'دوازدہم']
BAAB = {'II': 'تَفْعِيل', 'III': 'مُفَاعَلَة', 'IV': 'إِفْعَال', 'V': 'تَفَعُّل', 'VI': 'تَفَاعُل',
        'VII': 'اِنْفِعَال', 'VIII': 'اِفْتِعَال', 'IX': 'اِفْعِلَال', 'X': 'اِسْتِفْعَال',
        'XI': 'اِفْعِيلَال', 'XII': 'اِفْعِيعَال'}
STEM_ROLE = {
    'N': 'اسم', 'PN': 'اسمِ علم', 'ADJ': 'صفت', 'IMPN': 'اسمِ فعل', 'PRON': 'ضمیرِ منفصل',
    'DEM': 'اسمِ اشارہ', 'REL': 'اسمِ موصول', 'T': 'ظرفِ زمان', 'LOC': 'ظرفِ مکان', 'V': 'فعل',
    'P': 'حرفِ جر', 'EMPH': 'لامِ تاکید', 'IMPV': 'لامِ امر', 'PRP': 'لامِ تعلیل', 'CONJ': 'حرفِ عطف',
    'SUB': 'حرفِ مصدری', 'ACC': 'حرفِ نصب', 'AMD': 'حرفِ استدراک', 'ANS': 'حرفِ جواب',
    'AVR': 'حرفِ ردع', 'CAUS': 'حرفِ سببیہ', 'CERT': 'حرفِ تحقیق', 'CIRC': 'واوِ حالیہ',
    'COM': 'واوِ معیت', 'COND': 'حرفِ شرط', 'EQ': 'ہمزۂ تسویہ', 'EXH': 'حرفِ تحضیض',
    'EXL': 'حرفِ تفصیل', 'EXP': 'حرفِ استثنا', 'FUT': 'حرفِ استقبال', 'INC': 'حرفِ ابتدا',
    'INT': 'حرفِ تفسیر', 'INTG': 'حرفِ استفہام', 'NEG': 'حرفِ نفی', 'PREV': 'حرفِ کاف',
    'PRO': 'حرفِ نہی', 'REM': 'حرفِ استئناف', 'RES': 'حرفِ حصر', 'RET': 'حرفِ اضراب',
    'RSLT': 'فاءِ جزا', 'SUP': 'حرفِ زائد', 'SUR': 'حرفِ فجاءت', 'VOC': 'حرفِ ندا',
    'INL': 'حروفِ مقطعات', 'DET': 'حرفِ تعریف',
}
# Prefix feature -> (Urdu role, Corpus tag used for rule mapping)
PREFIX = {
    'Al+': ('حرفِ تعریف', 'DET'), 'bi+': ('حرفِ جر', 'P'), 'ka+': ('حرفِ جر', 'P'),
    'ta+': ('حرفِ جر (قسم)', 'P'), 'sa+': ('حرفِ استقبال', 'FUT'), 'ya+': ('حرفِ ندا', 'VOC'),
    'ha+': ('حرفِ تنبیہ', 'ATT'),
}
PREFIX_TAG = {'CONJ': 'حرفِ عطف', 'REM': 'حرفِ استئناف', 'CIRC': 'واوِ حالیہ', 'SUP': 'حرفِ زائد',
              'P': 'حرفِ جر', 'EMPH': 'لامِ تاکید', 'PRP': 'لامِ تعلیل', 'IMPV': 'لامِ امر',
              'RSLT': 'فاءِ جزا', 'CAUS': 'فاءِ سببیہ', 'INTG': 'ہمزۂ استفہام', 'EQ': 'ہمزۂ تسویہ',
              'COM': 'واوِ معیت', 'VOC': 'حرفِ ندا'}
WEAK = set('wy')


def png_text(png):
    """'3MP' -> 'جمع مذکر غائب' (Urdu grammar order: number, gender, person)."""
    if not png:
        return ''
    m = re.fullmatch(r'([123])?([MF])?([SDP])?', png)
    person, gender, number = m.groups() if m else (None, None, None)
    return ' '.join(x for x in (NUMBER.get(number), GENDER.get(gender), PERSON.get(person)) if x)


def form_text(form):
    i = ROMAN.index(form)
    if form == 'I':
        return 'ثلاثی مجرد — اوّل (I)'
    return f'ثلاثی مزید فیہ — {ORDINAL[i]} ({form})'


def strip_marks(text):
    # Quran.com writes a seated hamza as tatweel + combining hamza (ـٔ); QAC writes ء.
    text = text.replace('ـٔ', 'ء').replace('ـٕ', 'ء')
    return ''.join(ch for ch in text if unicodedata.category(ch) != 'Mn' and ch != 'ـ')


# ---------------------------------------------------------------- sources
qac = load_qac(os.path.join(PIPE, 'qac', 'qac04-lfs.txt'), surahs=set(RANGES))
FEATS = {}
for raw in open(os.path.join(PIPE, 'qac', 'qac04-lfs.txt'), encoding='utf-8'):
    m = re.match(r'^\((\d+):(\d+):(\d+):(\d+)\)\t\S*\t\S+\t(\S+)$', raw.rstrip('\n'))
    if m and int(m.group(1)) in RANGES:
        FEATS[f'{m.group(1)}:{m.group(2)}:{m.group(3)}:{m.group(4)}'] = m.group(5).split('|')


def gender_number(feats):
    for f in feats:
        m = re.fullmatch(r'([123])?([MF])?([SDP])?', f)
        if m and f and not f.startswith(('LEM', 'ROOT', 'POS')) and any(m.groups()):
            return m.groups()
    return (None, None, None)


# Published libraries: later editions win (they were seeded from earlier ones and corrected).
LIB_DIRS = [os.path.join(PIPE, 'libs'), os.path.join(PIPE, 'edition-2', 'libs'), os.path.join(PIPE, 'edition-3', 'libs')]
pub_roots, pub_lexemes = {}, {}
for d in LIB_DIRS:
    for name in sorted(glob.glob(os.path.join(d, 'roots', '*.json'))):
        for e in load(name)['entries']:
            pub_roots[e['root']] = dict(e, _source=os.path.relpath(name, PIPE))
    for name in sorted(glob.glob(os.path.join(d, 'lexemes', '*.json'))):
        for e in load(name)['entries']:
            pub_lexemes[e['key']] = dict(e, _source=os.path.relpath(name, PIPE))
RULES = {r['id']: r for r in load(os.path.join(PIPE, 'libs', 'rules.json'))['rules']}
new_roots, new_lexemes = {}, {}
for name in sorted(glob.glob(os.path.join(WORK, 'libs', 'roots', '*.json'))):
    for e in load(name)['entries']:
        new_roots[e['root']] = dict(e, _source=os.path.relpath(name, PIPE))
for name in sorted(glob.glob(os.path.join(WORK, 'libs', 'lexemes', '*.json'))):
    for e in load(name)['entries']:
        new_lexemes[e['key']] = dict(e, _source=os.path.relpath(name, PIPE))


def segment_split(stored, segs):
    """Split the stored Quran.com word at QAC segment boundaries by matching base letters."""
    counts = [len(strip_marks(s['formArabic'])) for s in segs]
    if strip_marks(stored) != ''.join(strip_marks(s['formArabic']) for s in segs):
        return None
    out, current, seen, k = [], '', 0, 0
    for i, ch in enumerate(stored):
        nxt = stored[i + 1] if i + 1 < len(stored) else ''
        is_base = (unicodedata.category(ch) != 'Mn' and ch != 'ـ') or (ch == 'ـ' and nxt in 'ٕٔ')
        if is_base:
            while k < len(counts) and seen == counts[k]:
                out.append(current)
                current, seen, k = '', 0, k + 1
            seen += 1
        current += ch
    out.append(current)
    while len(out) < len(segs):
        out.append('')
    return out


def pronoun_functions(description):
    """Ordered subject/object/possessive labels for PRON suffix lines of the QAC description."""
    funcs = []
    for line in (description or '').split('\n'):
        if line.startswith('PRON'):
            low = line.lower()
            funcs.append('subject' if 'subject' in low else 'object' if 'object' in low
                         else 'possessive' if 'possessive' in low else 'other')
    return funcs


def build_word(wid, stored, segs, wbw, ur_gloss):
    info = wbw.get(wid, {})
    pos = derive_pos(segs, info.get('morphology'))
    root = derive_root(segs, pos)
    stems = [s for s in segs if s['kind'] == 'STEM']
    main = next((s for s in stems if s['tag'] in ('V', 'N', 'PN', 'ADJ', 'IMPN')), stems[0])
    feats = FEATS[f"{wid}:{main['segment']}"]
    lemma = re.sub('[ًٌٍ]+$', '', main.get('lemmaArabic') or '') or None
    if lemma and len(lemma) > 1 and lemma[1] == 'ّ':  # assimilation shadda carried into a QAC lemma id
        lemma = lemma[0] + lemma[2:]
    parts = segment_split(stored, segs)
    problems = []
    if parts is None or any(not p for p in parts):
        problems.append('segment alignment failed')
        parts = [stored] + [''] * (len(segs) - 1)
    pron_funcs = pronoun_functions(info.get('morphology'))
    pron_index = 0
    rules = []
    seg_out = []
    suffix_notes, prefix_notes = [], []
    is_verb_word = main['tag'] == 'V'
    for s, arabic in zip(segs, parts):
        f = FEATS[f"{wid}:{s['segment']}"]
        if s['kind'] == 'PREFIX':
            code = f[1]
            if code in PREFIX:
                role, tag = PREFIX[code]
            else:
                tag = code.split(':')[1].rstrip('+') if ':' in code else code
                role = PREFIX_TAG.get(tag, STEM_ROLE.get(tag, tag))
            seg_out.append([arabic, role, tag])
            prefix_notes.append(f'{arabic} ({role})')
        elif s['kind'] == 'SUFFIX':
            if s['tag'] == 'PRON':
                func = pron_funcs[pron_index] if pron_index < len(pron_funcs) else 'other'
                pron_index += 1
                person = png_text(s.get('pronoun'))
                if is_verb_word and func == 'subject':
                    role, rid = 'ضمیرِ فاعل', 'subject-pronoun'
                elif is_verb_word and func == 'object':
                    role, rid = 'ضمیرِ مفعول', 'object-pronoun'
                else:
                    role, rid = 'ضمیرِ متصل', 'pronoun'
                rules.append(rid)
                seg_out.append([arabic, f'{role} ({person})' if person else role, 'PRON'])
                suffix_notes.append(f'{arabic} {role}، {person}' if person else f'{arabic} {role}')
            elif '+n:EMPH' in f:
                rules.append('emphatic-nun')
                seg_out.append([arabic, 'نونِ تاکید', 'EMPH'])
                suffix_notes.append(f'{arabic} نونِ تاکید')
            else:
                seg_out.append([arabic, 'لاحقہ', s['tag']])
        else:
            role = STEM_ROLE.get(s['tag'], s['tag'])
            if s['tag'] == 'PRON' and any(x['kind'] == 'PREFIX' and x['tag'] == 'P' for x in segs):
                role = 'ضمیرِ متصل (مجرور)'
            deriv = s.get('derivation', [])
            if 'PCPL' in deriv:
                role = 'اسمِ فاعل' if 'ACT' in deriv else 'اسمِ مفعول'
            elif 'VN' in deriv:
                role = 'مصدر'
            if s.get('case') and s['tag'] in ('N', 'PN', 'ADJ', 'LOC', 'T'):
                role = f"{role} {CASE[s['case']]}"
            if s['tag'] == 'V':
                aspect = {'PERF': 'فعلِ ماضی', 'IMPF': 'فعلِ مضارع', 'IMPV': 'فعلِ امر'}[s['aspect']]
                role = aspect + (' مجہول' if s.get('passive') else '')
            seg_out.append([arabic, role, s['tag']])

    # morphology sentence and word-type label
    m_parts = []
    pos_urdu = STEM_ROLE.get(main['tag'], main['tag'])
    if main['tag'] == 'V':
        aspect = main['aspect']
        pos_urdu = {'PERF': 'فعلِ ماضی', 'IMPF': 'فعلِ مضارع', 'IMPV': 'فعلِ امر'}[aspect]
        if main.get('passive'):
            pos_urdu += ' مجہول'
        m_parts.append(pos_urdu)
        if aspect == 'IMPF':
            m_parts.append(MOOD[main.get('mood', 'IND')])
        m_parts.append('مجہول' if main.get('passive') else 'معروف')
        m_parts.append(png_text(main.get('png')))
        form = main.get('verbForm', 'I')
        m_parts.append(form_text(form) + (f'، بابِ {BAAB[form]}' if form in BAAB else ''))
    elif main['tag'] in ('N', 'ADJ', 'PN', 'LOC', 'T'):
        person, gender, number = gender_number(feats)
        deriv = main.get('derivation', [])
        kind = pos_urdu
        if 'PCPL' in deriv:
            kind = 'اسمِ فاعل' if 'ACT' in deriv else 'اسمِ مفعول'
        elif 'VN' in deriv:
            kind = 'مصدر'
        m_parts.append(kind)
        if main.get('verbForm') and ('PCPL' in deriv or 'VN' in deriv):
            form = main['verbForm']
            m_parts.append(form_text(form) + (f'، بابِ {BAAB[form]}' if form in BAAB else ''))
        gn = ' '.join(x for x in (NUMBER.get(number), GENDER.get(gender)) if x)
        if gn:
            m_parts.append(gn)
        if any(x['kind'] == 'PREFIX' and FEATS[f"{wid}:{x['segment']}"][1] == 'Al+' for x in segs):
            m_parts.append('ال کے ساتھ معرفہ')
        elif main.get('indefinite'):
            m_parts.append('نکرہ (تنوین)')
        if main.get('case'):
            m_parts.append(CASE[main['case']])
        if kind != pos_urdu:
            pos_urdu = kind
        if main.get('case') and main['tag'] != 'PN':
            pos_urdu = f"{pos_urdu} {CASE[main['case']]}"
        elif main['tag'] == 'PN' and main.get('case'):
            pos_urdu = f"اسمِ علم {CASE[main['case']]}"
    else:
        names = [STEM_ROLE.get(s['tag'], s['tag']) for s in stems]
        if any(x['kind'] == 'PREFIX' and x['tag'] == 'P' for x in segs) and [x['tag'] for x in stems] == ['PRON']:
            names = ['حرفِ جر', 'ضمیرِ متصل']
        pos_urdu = ' + '.join(dict.fromkeys(names))
        m_parts.append(pos_urdu)
        gn = png_text(next((x for x in feats if re.fullmatch(r'[123]?[MF]?[SDP]', x)), None))
        if gn and main['tag'] in ('PRON', 'DEM', 'REL'):
            m_parts.append(gn)
        if main['tag'] in ('PRON', 'DEM', 'REL', 'INL') or pos == 'particle':
            m_parts.append('مبنی')
    if any(x['kind'] == 'SUFFIX' and x['tag'] == 'PRON' for x in segs) and '+' not in pos_urdu:
        pos_urdu += ' + ضمیرِ متصل'
    morph = '، '.join(x for x in m_parts if x) + '۔'
    if prefix_notes:
        morph += ' سابقہ: ' + '؛ '.join(prefix_notes) + '۔'
    if suffix_notes:
        morph += ' لاحقہ: ' + '؛ '.join(suffix_notes) + '۔'

    # deterministic rules from tags
    for s in segs:
        f = FEATS[f"{wid}:{s['segment']}"]
        tag = s['tag']
        if s['kind'] == 'PREFIX':
            code = f[1]
            tag = PREFIX[code][1] if code in PREFIX else (code.split(':')[1].rstrip('+') if ':' in code else code)
        lem = s.get('lemmaBuckwalter', '')
        rules += {
            'DET': ['definite'], 'P': ['preposition'], 'CONJ': ['conjunction'], 'REM': ['resumption'],
            'INTG': ['interrogative'], 'EQ': ['equalization'], 'EMPH': ['emphatic-lam'],
            'PRP': ['purpose-lam'], 'IMPV': ['imperative-lam'], 'SUB': ['masdar-particle'],
            'CERT': ['qad'], 'RES': ['restriction'], 'EXP': ['exception'], 'VOC': ['vocative'],
            'INL': ['muqattaat'], 'SUP': ['extra-particle'], 'PRO': ['prohibition'],
            'RET': ['retraction'], 'AVR': ['deterrence'], 'EXH': ['exhortation'],
            'ANS': ['answer-particle'], 'INT': ['explanatory-an'], 'SUR': ['surprise-idha'],
            'RSLT': ['condition-answer'], 'FUT': ['future'], 'DEM': ['demonstrative'],
            'REL': ['relative'], 'PN': ['proper-noun'],
        }.get(tag, [])
        if s['kind'] != 'STEM':
            continue
        if tag == 'PRON':
            after_preposition = any(x['kind'] == 'PREFIX' and x['tag'] == 'P' for x in segs)
            rules.append('pronoun' if after_preposition else 'independent-pronoun')
        if tag == 'ACC':
            if any(x['tag'] == 'PREV' for x in segs):  # إِنَّمَا / أَنَّمَا: restriction, not إنّ's governance
                rules.append('restriction')
            else:
                rules.append('inna' if lem == '<in~' else 'inna-sisters')
        if tag == 'NEG' and lem == 'laA' and 'SP:<in~' in f:  # لا النافية للجنس (works like إِنَّ)
            rules.append('la-generic')
        elif tag == 'NEG':
            rules.append({'lam': 'lam-jussive', 'lan': 'lan-negation', '<in': 'negative-in'}.get(lem, 'negation'))
        if tag == 'COND':
            rules.append({'law': 'law-condition', '<i*aA': 'condition'}.get(lem, 'conditional-jazm'))
        if tag == 'T' and lem == 'lam~aA':
            rules.append('lamma')
        elif tag == 'T' and lem in ('<i*', '<i*aA'):
            rules.append('idh' if lem == '<i*' else 'condition')
        elif tag in ('T', 'LOC'):
            rules.append('adverb')
        if 'SP:kaAn' in f:
            rules.append('kana')
        if 'SP:kaAd' in f:
            rules.append('kada-asa')
        if tag in ('N', 'ADJ', 'PN') and s.get('case'):
            rules.append({'NOM': 'nominative', 'ACC': 'accusative', 'GEN': 'genitive'}[s['case']])
        if tag in ('N', 'ADJ') and s.get('indefinite'):
            rules.append('indefinite')
        deriv = s.get('derivation', [])
        if 'PCPL' in deriv:
            rules.append('participle')
        if 'VN' in deriv:
            rules.append('verbal-noun')
        _, _, number = gender_number(f)
        if tag in ('N', 'ADJ') and number == 'D':
            rules.append('dual')
        if tag in ('N', 'ADJ') and number == 'P' and lem not in ('naAs', 'n~aAs'):  # نَاس is a collective noun
            bw = s['formBuckwalter']
            if re.search(r'(uwna|iyna|uw|iy)$', bw) and 'MP' in f:
                rules.append('sound-plural')
            elif re.search(r'(`|A)t[uiaNKF]*$', bw) and 'FP' in f:
                rules.append('feminine-plural')
            else:
                rules.append('broken-plural')
        if tag == 'V':
            rules.append({'PERF': 'perfect', 'IMPF': 'imperfect', 'IMPV': 'imperative'}[s['aspect']])
            if s.get('passive'):
                rules.append('passive')
            if s.get('mood') == 'JUS':
                rules.append('jussive')
            if s.get('mood') == 'SUBJ':
                rules.append('subjunctive')
            if s.get('verbForm', 'I') != 'I':
                rules.append('derived-form')
            r = s.get('rootBuckwalter', '')
            if set(r) & WEAK:
                rules.append('weak-verb')
            if set(r) & set("A'"):
                rules.append('hamzated')
            if len(r) == 3 and r[1] == r[2]:
                rules.append('doubled')
            if len(r) == 4:
                rules.append('quadriliteral')
            if s['aspect'] == 'IMPF' and any(x['kind'] == 'SUFFIX' and x['tag'] == 'PRON' and
                                              x.get('pronoun', '')[-1:] in 'DP' and
                                              x['formBuckwalter'] in ('wna', 'na', 'Ani', 'w', 'A', 'wA@')
                                              for x in segs):
                rules.append('five-verbs')
    rules = [r for r in dict.fromkeys(rules) if r in RULES]
    lex_key = None
    vs = next((s for s in segs if s['kind'] == 'STEM' and s['tag'] == 'V'), None)
    if vs is not None:
        lex_key = f"{vs.get('lemmaBuckwalter')}|{vs.get('verbForm', 'I')}|{'PASS' if vs.get('passive') else 'ACT'}"
    irab = [re.sub(r'\s*\n\s*', '؛ ', x).strip() for x in info.get('irabArabic', []) if x.strip()]
    if not irab:
        problems.append('missing QAC i‘rab')
    meaning = re.sub(r'\s+', ' ', ur_gloss or '').strip()
    if not meaning:
        problems.append('missing Urdu word-by-word meaning')
    return OrderedDict(
        id=wid, arabic=stored, meaningUrdu=meaning, pos=pos, posUrdu=pos_urdu, root=root,
        lemma=lemma, morphologyUrdu=morph, syntaxUrdu='؛ '.join(irab),
        segments=[OrderedDict(arabic=a, roleUrdu=r, tag=t) for a, r, t in seg_out],
        ruleIds=rules, lexemeKey=lex_key,
        reference=OrderedDict(
            glossEnglishQac=info.get('gloss'), qacMorphologyEnglish=info.get('morphology'),
            qacFeatures=[FEATS[f"{wid}:{s['segment']}"] for s in segs],
        ),
        problems=problems,
    )


def deterministic(surah):
    rng = RANGES[surah]
    ur = {v['verse_number']: v for v in load(os.path.join(WORK, 'sources', 'qurancom', f'verses-{surah}-ur.json'))['verses']}
    en = {v['verse_number']: v for v in load(os.path.join(WORK, 'sources', 'qurancom', f'verses-{surah}-en.json'))['verses']}
    wbw = load(os.path.join(WORK, 'sources', 'qac-wbw', f'wbw-{surah}.json'))
    words, inventory, excluded = [], [], []
    text_diffs.clear()
    for n in range(rng['fromAyah'], rng['toAyah'] + 1):
        en_words = {w['position']: w for w in en[n]['words'] if w['char_type_name'] == 'word'}
        for w in [w for w in ur[n]['words'] if w['char_type_name'] == 'word']:
            wid = f'{surah}:{n}:{w["position"]}'
            raw = w['text_uthmani']
            api_word = re.sub(r'(?: [ۖ-ۜ۩]+)+$', '', re.sub(r'^۞ ', '', raw))
            if api_word != raw:
                excluded.append({'id': wid, 'apiText': raw, 'excludedMark': ' '.join(t for t in raw.split(' ') if t != api_word)})
            if en_words[w['position']]['text_uthmani'] != raw:
                raise SystemExit(f'{wid}: Arabic differs between language requests')
            # The stored Arabic is Quran.com's text_uthmani, unchanged (owner decision 2026-11-22; the
            # same text as every existing lesson). The Corpus is a letter-level cross-check only.
            stored = api_word
            corpus_word = ''.join(seg['formArabic'] for seg in qac[wid])
            if strip_marks(stored) != strip_marks(corpus_word):
                raise SystemExit(f'{wid}: Corpus and Quran.com letters differ: {corpus_word} / {stored}')
            if stored != corpus_word:
                text_diffs.append({'id': wid, 'quranCom': stored, 'corpus': corpus_word})
            entry = build_word(wid, stored, qac[wid], wbw, (w.get('translation') or {}).get('text'))
            entry['ayah'], entry['position'] = n, w['position']
            entry['reference']['glossEnglishQuranCom'] = (en_words[w['position']].get('translation') or {}).get('text')
            words.append(entry)
            inventory.append({'id': wid, 'arabic': stored})
        qac_count = len([k for k in qac if k.startswith(f'{surah}:{n}:')])
        if qac_count != len([w for w in words if w['ayah'] == n]):
            raise SystemExit(f'{surah}:{n}: word count differs from QAC')
    return words, inventory, excluded


text_diffs = []


def needs(words):
    roots, lexemes = OrderedDict(), OrderedDict()
    for w in words:
        if w['root'] and w['root'] not in pub_roots:
            r = roots.setdefault(w['root'], {'root': w['root'], 'occurrences': []})
            r['occurrences'].append({'id': w['id'], 'arabic': w['arabic'], 'lemma': w['lemma'],
                                     'meaningUrdu': w['meaningUrdu'], 'glossEnglish': w['reference']['glossEnglishQac']})
        if w['pos'] == 'verb' and w['lexemeKey'] not in pub_lexemes:
            key = w['lexemeKey']
            lemma_bw, form, voice = key.split('|')
            x = lexemes.setdefault(key, {'key': key, 'lemmaCorpus': w['lemma'], 'form': form,
                                         'voice': voice, 'root': w['root'], 'occurrences': []})
            x['occurrences'].append({'id': w['id'], 'arabic': w['arabic'], 'meaningUrdu': w['meaningUrdu'],
                                     'qacMorphologyEnglish': w['reference']['qacMorphologyEnglish']})
    return roots, lexemes


AI_RULES = sorted(set(RULES))

if MODE == 'packets':
    for surah in RANGES:
        words, inventory, excluded = deterministic(surah)
        roots, lexemes = needs(words)
        dump(os.path.join(WORK, 'packets', f'words-{surah}.json'), words)
        dump(os.path.join(WORK, 'packets', f'needs-{surah}.json'),
             {'roots': list(roots.values()), 'lexemes': list(lexemes.values())})
        problems = [(w['id'], w['problems']) for w in words if w['problems']]
        reused_r = len({w['root'] for w in words if w['root'] and w['root'] in pub_roots})
        reused_l = len({w['lexemeKey'] for w in words if w['pos'] == 'verb' and w['lexemeKey'] in pub_lexemes})
        print(json.dumps({'surah': surah, 'words': len(words), 'excludedPauseSigns': len(excluded),
                          'roots': {'reused': reused_r, 'new': len(roots)},
                          'lexemes': {'reused': reused_l, 'new': len(lexemes)},
                          'problems': problems}, ensure_ascii=False, indent=1))
    sys.exit(0)


def ai_layer(surah, words):
    """Load and validate the AI word layer; returns (layer, errors)."""
    layer, errors = {}, []
    for path in sorted(glob.glob(os.path.join(WORK, 'words', str(surah), '*.json'))):
        for key, value in load(path).items():
            if key in layer:
                errors.append(f'{key}: duplicated across AI word files')
            layer[key] = value
    arabic_letters = re.compile(r'[A-Za-z]|https?:')
    for w in words:
        e = layer.get(w['id'])
        if e is None:
            errors.append(f"{w['id']}: missing AI word entry")
            continue
        if e.get('arabic') != w['arabic']:
            errors.append(f"{w['id']}: arabic mismatch in AI entry")
        seg = e.get('segmentMeaningsUrdu')
        if not isinstance(seg, list) or len(seg) != len(w['segments']) or not all(isinstance(x, str) and x.strip() for x in seg):
            errors.append(f"{w['id']}: segmentMeaningsUrdu must have {len(w['segments'])} non-empty entries")
        if not isinstance(e.get('dictionaryUrdu'), str) or not e['dictionaryUrdu'].strip():
            errors.append(f"{w['id']}: dictionaryUrdu missing")
        for field in ('dictionaryUrdu',):
            if arabic_letters.search(e.get(field, '') or ''):
                errors.append(f"{w['id']}: Latin text or URL in {field}")
        bad = [r for r in e.get('addRuleIds', []) if r not in RULES]
        if bad:
            errors.append(f"{w['id']}: unknown rule ids {bad}")
    extra = set(layer) - {w['id'] for w in words}
    if extra:
        errors.append(f'AI layer has unknown ids: {sorted(extra)[:5]}')
    return layer, errors


def lib_errors(words):
    errors = []
    for w in words:
        if w['root'] and w['root'] not in pub_roots and w['root'] not in new_roots:
            errors.append(f"{w['id']}: no root entry for {w['root']}")
        if w['pos'] == 'verb' and w['lexemeKey'] not in pub_lexemes and w['lexemeKey'] not in new_lexemes:
            errors.append(f"{w['id']}: no paradigm for {w['lexemeKey']}")
    for key in set(new_roots) & set(pub_roots):
        errors.append(f'new root entry duplicates a published one: {key}')
    for key in set(new_lexemes) & set(pub_lexemes):
        errors.append(f'new paradigm duplicates a published one: {key}')
    for e in new_roots.values():
        if not all(isinstance(e.get(k), str) and e[k].strip() for k in ('root', 'meaningUrdu', 'noteUrdu')):
            errors.append(f"root {e.get('root')}: incomplete")
    for e in new_lexemes.values():
        if not all(isinstance(e.get(k), str) and e[k].strip() for k in ('key', 'baabUrdu', 'formUrdu', 'past', 'present', 'pattern', 'noteUrdu')):
            errors.append(f"paradigm {e.get('key')}: incomplete")
    return errors


EXAMPLE_SUFFIX = 'اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔'
all_errors, studies = [], []
for surah in RANGES:
    words, inventory, excluded = deterministic(surah)
    layer, errors = ai_layer(surah, words)
    errors += lib_errors(words)
    errors += [f"{w['id']}: {p}" for w in words for p in w['problems']]
    all_errors += errors
    if errors:
        continue
    words_out, verb_forms = [], OrderedDict()
    for w in words:
        e = layer[w['id']]
        seg = [OrderedDict(arabic=s['arabic'], roleUrdu=s['roleUrdu'], meaningUrdu=m.strip())
               for s, m in zip(w['segments'], e['segmentMeaningsUrdu'])]
        rules = list(dict.fromkeys(w['ruleIds'] + [r for r in e.get('addRuleIds', [])]))
        words_out.append(OrderedDict(
            id=w['id'], ayah=w['ayah'], position=w['position'], arabic=w['arabic'],
            meaningUrdu=w['meaningUrdu'], pos=w['pos'], posUrdu=w['posUrdu'], root=w['root'],
            lemma=(pub_lexemes.get(w['lexemeKey']) or new_lexemes[w['lexemeKey']])['past'] if w['pos'] == 'verb' else w['lemma'],
            morphologyUrdu=w['morphologyUrdu'], syntaxUrdu=w['syntaxUrdu'],
            dictionaryUrdu=e['dictionaryUrdu'].strip(), segments=seg, ruleIds=rules,
        ))
        if w['pos'] == 'verb':
            lex = pub_lexemes.get(w['lexemeKey']) or new_lexemes[w['lexemeKey']]
            verb_forms[w['id']] = OrderedDict((k, lex[k]) for k in ('baabUrdu', 'formUrdu', 'past', 'present', 'pattern', 'noteUrdu'))
    rule_order = list(dict.fromkeys(r for w in words_out for r in w['ruleIds']))
    rules_out = []
    for rid in rule_order:
        first = next(w for w in words_out if rid in w['ruleIds'])
        meaning = re.sub(r'[۔.؟?!،,؛;:\s]+$', '', first['meaningUrdu'])
        rules_out.append(OrderedDict(id=rid, titleUrdu=RULES[rid]['titleUrdu'],
                                     explanationUrdu=RULES[rid]['explanationUrdu'],
                                     exampleUrdu=f"{first['arabic']} — {meaning}۔ {EXAMPLE_SUFFIX}"))
    roots_out = OrderedDict()
    for w in words_out:
        if w['root'] and w['root'] not in roots_out:
            entry = pub_roots.get(w['root']) or new_roots[w['root']]
            roots_out[w['root']] = OrderedDict(meaningUrdu=entry['meaningUrdu'], noteUrdu=entry['noteUrdu'])
    rng = RANGES[surah]
    ayahs = [OrderedDict(number=n, translationUrdu='', themeUrdu='', tafsirUrdu='', phrases=[])
             for n in range(1, rng['toAyah'] + 1)]
    studies.append((surah, OrderedDict(
        schemaVersion=1,
        surah=OrderedDict(number=surah, nameUrdu=rng['nameUrdu'], nameArabic=rng['nameArabic'],
                          ayahCount=len(ayahs), wordCount=len(words_out)),
        words=words_out, ayahs=ayahs, rules=rules_out, roots=roots_out, verbForms=verb_forms,
    ), inventory, excluded, words))

if all_errors:
    print(json.dumps({'errors': all_errors[:60], 'count': len(all_errors)}, ensure_ascii=False, indent=1))
    sys.exit(1)
if MODE == 'check':
    print(json.dumps({'ok': True, 'surahs': {s: {'words': st['surah']['wordCount'], 'ayahs': st['surah']['ayahCount'],
                                                   'rules': len(st['rules']), 'roots': len(st['roots']),
                                                   'verbForms': len(st['verbForms'])} for s, st, *_ in studies}},
                     ensure_ascii=False, indent=1))
    sys.exit(0)

if MODE == 'assemble':
    sys.path.insert(0, os.path.join(PIPE, 'scripts'))
    from emit_ts import emit_lesson  # noqa: E402
    REPO = os.path.abspath(sys.argv[3])
    for surah, study, inventory, excluded, words in studies:
        header = [
            '// Source-first lesson (content-pipeline/full-quran): Arabic, IDs and Urdu word-by-word',
            '// meanings from Quran.com; word types, roots, lemmas, segments, morphology and Arabic',
            '// i‘rab from the Quranic Arabic Corpus. Root, paradigm, segment and dictionary notes',
            '// are AI-assisted. No ayah translation or tafsir. Scholarly review pending.',
            "import type { StudyData } from '../types';",
        ]
        out = emit_lesson(study, f'study{surah}', header)
        with open(os.path.join(REPO, 'packages', 'core', 'src', 'lessons', f'surah-{surah}.ts'), 'w', encoding='utf-8') as handle:
            handle.write(out)
        rng = RANGES[surah]
        dump(os.path.join(WORK, 'inventory', f'inventory-{surah}.json'), OrderedDict(
            textSource='Quran.com Content API v4 text_uthmani (end-of-ayah markers excluded); word boundaries and IDs checked against QAC 0.4 morphology',
            meaningSource='Quran.com Content API v4 word-by-word translation, language=ur',
            retrievedAt=load(os.path.join(WORK, 'sources', 'qurancom', f'verses-{surah}-ur.json'))['retrievedAt'],
            surah=surah, ayahs=[rng['fromAyah'], rng['toAyah']], wordCount=len(inventory),
            textPolicy='Stored Arabic is Quran.com text_uthmani, unchanged except excluded pause signs; QAC 0.4 letters are a cross-check (differences listed below are spelling marks only).',
            words=inventory, excludedPauseSigns=excluded, corpusSpellingDifferences=list(text_diffs),
        ))
        print('wrote surah', surah, study['surah'])

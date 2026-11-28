"""Source-only builder for the whole Quran (owner decision 2026-11-26: no AI-written data).

Usage:
  python3 -I build.py <full-quran-dir> check                # build every chapter in memory and report
  python3 -I build.py <full-quran-dir> assemble <repo-root> # write packages/core/data/lessons/*.json

Sources (fetched by fetch.py into <dir>/sources, git-ignored):
  Arabic word text and occurrence IDs   Quran.com API v4 text_uthmani, verbatim (pause signs and ۞ kept),
                                        letters cross-checked against QAC 0.4 for every word
  word arabicIndoPak                    Quran.com text_indopak (IndoPak orthography, for IndoPak fonts)
  word meaningUrdu                      Quran.com word-by-word Urdu (language=ur)
  ayah translations                     Quran.com Urdu translations listed in scope.json
                                        (footnote markers removed; text otherwise verbatim)
  pos, root, lemma, segments + roles    Quranic Arabic Corpus 0.4 morphology
  morphologyUrdu                        fixed Urdu terms rendered from the Corpus tags
  syntaxUrdu                            the Corpus's own Arabic i'rab for the word
  ruleIds, verb form/pattern            deterministic mapping from Corpus tags (fixed tables)

Chapters in scope.json `existingLessons` (and the first ayahs of a partial lesson) keep their
published grammar layer from the committed lesson JSON; only their word meanings and ayah
translations are refreshed from the sources. Their AI ayah translation, theme and tafsir are
dropped. Fields no source provides (segment glosses, dictionary notes, root meanings, verb
paradigm notes) are empty strings in source-only words; the apps hide them.
"""
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
SRC = os.path.join(WORK, 'sources')


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
    text = unicodedata.normalize('NFD', text.replace('ـٔ', 'ء').replace('ـٕ', 'ء'))
    # Small waw/yeh (ۥ ۦ, category Lm) are spelling marks too: Quran.com may write them as ـۧ.
    return ''.join(ch for ch in text if unicodedata.category(ch) != 'Mn' and ch not in SMALL_LETTERS)


# Quran.com writes a few words with an internal space (e.g. 2:181:3 بَعْدَ مَا); QAC has none.
SMALL_LETTERS = {'ـ', 'ۥ', 'ۦ', ' '}
# Words whose letters differ between Quran.com and QAC (e.g. 11:13:3 افْتَرَاهُ / ٱفْتَرَىٰهُ): the
# stored text stays Quran.com's; the segment cards show the Corpus's own segment spelling.
LETTER_MISMATCH = set()


# ---------------------------------------------------------------- sources
CHAPTERS = {c['id']: c for c in load(os.path.join(SRC, 'qurancom', 'chapters.json'))['chapters']}
qac = load_qac(os.path.join(PIPE, 'qac', 'qac04-lfs.txt'))
FEATS = {}
for raw in open(os.path.join(PIPE, 'qac', 'qac04-lfs.txt'), encoding='utf-8'):
    m = re.match(r'^\((\d+):(\d+):(\d+):(\d+)\)\t[^\t]*\t\S+\t(\S+)$', raw.rstrip('\n'))
    if m:
        FEATS[f'{m.group(1)}:{m.group(2)}:{m.group(3)}:{m.group(4)}'] = m.group(5).split('|')


def gender_number(feats):
    for f in feats:
        m = re.fullmatch(r'([123])?([MF])?([SDP])?', f)
        if m and f and not f.startswith(('LEM', 'ROOT', 'POS')) and any(m.groups()):
            return m.groups()
    return (None, None, None)


# Published libraries: later editions win (they were seeded from earlier ones and corrected).
RULES = {r['id']: r for r in load(os.path.join(PIPE, 'libs', 'rules.json'))['rules']}

# ---------------------------------------------------------------- grammar layer (owner 2026-11-26)
# The owner asked for the published grammar analysis for the whole Quran, in the existing pattern:
# root and verb-paradigm library cards, per-word segment glosses + dictionary note + extra rule
# ids, and phrase cards per ayah. Word meanings and ayah translations stay Quran.com's.
# Libraries: earlier editions first, this pipeline's own entries last (later wins).
import glob  # noqa: E402
LIB_DIRS = [os.path.join(PIPE, 'libs'), os.path.join(PIPE, 'edition-2', 'libs'),
            os.path.join(PIPE, 'edition-3', 'libs'), os.path.join(WORK, 'libs')]
LIB_ROOTS, LIB_LEXEMES = {}, {}
for _d in LIB_DIRS:
    for _name in sorted(glob.glob(os.path.join(_d, 'roots', '*.json'))):
        for _e in load(_name)['entries']:
            LIB_ROOTS[_e['root']] = _e
    for _name in sorted(glob.glob(os.path.join(_d, 'lexemes', '*.json'))):
        for _e in load(_name)['entries']:
            LIB_LEXEMES[_e['key']] = _e


CHUNK_FILES = []


problems = []  # collected everywhere below; reported at the end
# This pipeline's own library entries must be complete (earlier editions were reviewed already).
for _name in sorted(glob.glob(os.path.join(WORK, 'libs', 'roots', '*.json'))):
    for _e in load(_name)['entries']:
        if not all(isinstance(_e.get(k), str) and _e[k].strip() for k in ('root', 'meaningUrdu', 'noteUrdu')) \
                or re.search(r'[A-Za-z]|https?:', _e.get('meaningUrdu', '') + _e.get('noteUrdu', '')):
            problems.append(f"{os.path.basename(_name)}: root {_e.get('root')} incomplete or has Latin text")
for _name in sorted(glob.glob(os.path.join(WORK, 'libs', 'lexemes', '*.json'))):
    for _e in load(_name)['entries']:
        if not all(isinstance(_e.get(k), str) and _e[k].strip() for k in ('key', 'baabUrdu', 'formUrdu', 'past', 'present', 'pattern', 'noteUrdu')) \
                or re.search(r'[A-Za-z]|https?:', _e.get('baabUrdu', '') + _e.get('noteUrdu', '')):
            problems.append(f"{os.path.basename(_name)}: paradigm {_e.get('key')} incomplete or has Latin text")


def grammar_layer(surah):
    """words/<surah>/*.json (word id -> entry) and phrases/<surah>/*.json ('s:a' -> cards)."""
    words, phrases = {}, {}
    only = os.environ.get('QG_LAYER_FILE')  # e.g. 002-021-035: check one author's files alone
    pick = lambda names: [n for n in names if not only or os.path.basename(n) == f'{only}.json']  # noqa: E731
    for name in pick(sorted(glob.glob(os.path.join(WORK, 'words', str(surah), '*.json')))):
        m = re.fullmatch(r'(\d{3})-(\d{3})-(\d{3})\.json', os.path.basename(name))
        if m:
            CHUNK_FILES.append((surah, int(m.group(2)), int(m.group(3)), 'words', name))
        for key, value in load(name).items():
            if key in words:
                problems.append(f'{key}: grammar entry duplicated ({os.path.basename(name)})')
            words[key] = value
    for name in pick(sorted(glob.glob(os.path.join(WORK, 'phrases', str(surah), '*.json')))):
        m = re.fullmatch(r'(\d{3})-(\d{3})-(\d{3})\.json', os.path.basename(name))
        if m:
            CHUNK_FILES.append((surah, int(m.group(2)), int(m.group(3)), 'phrases', name))
        for key, value in load(name).items():
            if key in phrases:
                problems.append(f'{key}: phrase cards duplicated ({os.path.basename(name)})')
            phrases[key] = value
    return words, phrases


def segment_split(stored, segs):
    """Split the stored Quran.com word at QAC segment boundaries by matching base letters."""
    counts = [len(strip_marks(s['formArabic'])) for s in segs]
    if strip_marks(stored) != ''.join(strip_marks(s['formArabic']) for s in segs):
        return None
    out, current, seen, k = [], '', 0, 0
    for i, ch in enumerate(stored):
        nxt = stored[i + 1] if i + 1 < len(stored) else ''
        is_base = (unicodedata.category(ch) != 'Mn' and ch not in SMALL_LETTERS) or (ch == 'ـ' and nxt in 'ٕٔ')
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
    # A Corpus segment with no written form (an elided pronoun such as the ي of رَبِّ) has no text.
    if parts is not None:
        parts = [p.strip() for p in parts]
    if parts is None and wid in LETTER_MISMATCH:
        parts = [seg['formArabic'] for seg in segs]
    if parts is None or any(not p for p, seg in zip(parts, segs) if strip_marks(seg['formArabic'])):
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

    # Elided segments join the previous segment's card: «اسم + ضمیرِ متصل (محذوف)».
    merged = []
    for arabic, role, tag in seg_out:
        if not arabic and merged:
            merged[-1] = [merged[-1][0], f'{merged[-1][1]} + {role} (محذوف)', merged[-1][2]]
        else:
            merged.append([arabic, role, tag])
    seg_out = merged

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


# ---------------------------------------------------------------- source words, translations
PAUSE = re.compile(r'(?: [ۖ-ۜ۩]+)+$')


def pause_free(text):
    """A Quran.com Uthmani word without its pause signs, leading ۞ and bidi marks: the key the
    build aligns, segments and compares (Corpus, grammar layer, published lessons) with. The stored
    `arabic` is Quran.com's text verbatim (owner decision 2026-11-28); packages/core/src/search.ts
    `withoutPauseMarks` is the same rule."""
    raw = re.sub(r'[\u200e\u200f\u061c]', '', text).strip()
    return PAUSE.sub('', re.sub(r'^۞ ', '', raw))
text_diffs, pause_marks = {}, {}
missing_meanings, kept_meanings, letter_mismatches, merged_words, arabic_updates = [], [], [], [], []


QAC_WORDS_PER_AYAH = {}
for _key in qac:
    _s, _a, _ = _key.split(':')
    QAC_WORDS_PER_AYAH[(int(_s), int(_a))] = QAC_WORDS_PER_AYAH.get((int(_s), int(_a)), 0) + 1


def source_words(surah):
    """Every word of the chapter from Quran.com + QAC, in order."""
    ur = load(os.path.join(SRC, 'qurancom', f'verses-{surah}-ur.json'))['verses']
    wbw = load(os.path.join(SRC, 'qac-wbw', f'wbw-{surah}.json'))
    count = CHAPTERS[surah]['verses_count']
    if [v['verse_number'] for v in ur] != list(range(1, count + 1)):
        raise SystemExit(f'{surah}: Quran.com verses incomplete')
    words, diffs, with_pause = [], [], []
    for verse in ur:
        n = verse['verse_number']
        api_words = [w for w in verse['words'] if w['char_type_name'] == 'word']
        if [w['position'] for w in api_words] != list(range(1, len(api_words) + 1)):
            raise SystemExit(f'{surah}:{n}: Quran.com word positions are not 1..n')
        qac_count = QAC_WORDS_PER_AYAH.get((surah, n), 0)
        parts = []
        for w in api_words:
            verbatim = w['text_uthmani']
            stored = pause_free(verbatim)
            if stored != verbatim:
                with_pause.append({"id": f"{surah}:{n}:{w['position']}", "apiText": verbatim})
            parts.append((stored, (w.get('translation') or {}).get('text') or '', indopak(w.get('text_indopak')),
                          verbatim))
        # Align Quran.com words to QAC words by letters. Quran.com occasionally splits one Corpus
        # word in two (37:130 إِلْ يَاسِينَ); those parts are joined so word IDs follow the Corpus.
        groups, i = [], 0
        for k in range(1, qac_count + 1):
            target = strip_marks(''.join(seg['formArabic'] for seg in qac[f'{surah}:{n}:{k}']))
            take = 1
            remaining_words = qac_count - k
            for size in (1, 2, 3):
                if i + size + remaining_words > len(parts):
                    break
                if strip_marks(''.join(p[0] for p in parts[i:i + size])) == target:
                    take = size
                    break
            if k == qac_count:
                take = len(parts) - i
            groups.append(parts[i:i + take])
            i += take
        if i != len(parts) or any(not g for g in groups):
            raise SystemExit(f'{surah}:{n}: {len(api_words)} Quran.com words, {qac_count} QAC words')
        for k, group in enumerate(groups, start=1):
            wid = f'{surah}:{n}:{k}'
            stored = ' '.join(g[0] for g in group)
            meaning = ' '.join(g[1].strip() for g in group if g[1].strip())
            if len(group) > 1:
                merged_words.append({'id': wid, 'quranComWords': [g[0] for g in group]})
            corpus_word = ''.join(seg['formArabic'] for seg in qac[wid])
            if strip_marks(stored) != strip_marks(corpus_word):
                LETTER_MISMATCH.add(wid)
                letter_mismatches.append({'id': wid, 'quranCom': stored, 'corpus': corpus_word})
            if stored != corpus_word:
                diffs.append({'id': wid, 'quranCom': stored, 'corpus': corpus_word})
            entry = build_word(wid, stored, qac[wid], wbw, meaning)
            entry['ayah'], entry['position'] = n, k
            # Displayed text: Quran.com's words verbatim; `arabicPlain` stays the comparison key.
            entry['arabicPlain'], entry['arabic'] = stored, ' '.join(g[3] for g in group)
            entry['arabicIndoPak'] = ' '.join(g[2] for g in group if g[2])
            if not entry['arabicIndoPak']:
                problems.append(f'{wid}: no Quran.com text_indopak')
            words.append(entry)
    text_diffs[surah], pause_marks[surah] = diffs, with_pause
    return words


def indopak(text):
    """Quran.com text_indopak, without bidi controls or a leading ۞ (as for the Uthmani text);
    attached waqf signs stay, as in IndoPak print. Every jazm is U+0652 (owner decision
    2026-11-28): Quran.com writes the same jazm as U+06E1 (62,026 times) or U+0652 (366 times)
    with no rule (قُل: 220 / 40), and Al Qalam Quran Majeed draws U+06E1 as a small circle and
    U+0652 as the half-circle jazm, so one word showed both shapes (24:62 يَسۡتَـاْذِنُوۡنَكَ)."""
    text = re.sub(r'[\u200b\u200e\u200f\u061c\u202a-\u202e\u2066-\u2069\ufeff]', '', text or '')
    text = text.replace('\u06e1', '\u0652')
    text = re.sub(r'\s+', ' ', text)  # en spaces / doubled spaces left by removed controls
    text = re.sub(r'^۞\s*', '', text).strip()
    # A waqf sign is part of the word in IndoPak print: no space before it (1:7:4 عَلَيۡهِمۡ ۙ).
    # Quran.com also draws some waqf signs with private-use glyphs (U+E000–U+F8FF, Al Qalam has
    # them), e.g. 1:7:4 `…مۡ U+E021 ۙ`: they belong to the word too.
    signs = '\u0610-\u061a\u06d6-\u06ed\ue000-\uf8ff'
    return re.sub(rf'\s+(?=[{signs}][{signs}\s]*$)', '', text)


def with_indopak(word, text):
    """Copy of a lesson word with arabicIndoPak placed right after arabic."""
    out = OrderedDict()
    for key, value in word.items():
        if key == 'arabicIndoPak':
            continue
        out[key] = value
        if key == 'arabic':
            out['arabicIndoPak'] = text
    return out


def clean_translation(text):
    """Remove footnote markers (they point at tafsir notes) and markup; keep the words verbatim."""
    def footnote(m):
        # Remove only the marker; the source's own spaces stay. A marker glued between a word and
        # the next word (ہے۔<sup>1</sup>نہ) becomes one space so the words do not run together.
        before = m.string[m.start() - 1] if m.start() else ''
        after = m.string[m.end()] if m.end() < len(m.string) else ''
        glued = before and after and not before.isspace() and not after.isspace()
        return ' ' if glued and after not in '۔،؟!:؛,.)]»' else ''
    text = re.sub(r'<sup\b[^>]*>.*?</sup>', footnote, text, flags=re.S)
    text = re.sub(r'<[^>]+>', '', text)
    # Markup debris: 4:106 Junagarhi ends in a lone '>' left from a footnote tag.
    text = re.sub(r'\s*[<>]\s*$', '', text)
    return re.sub(r'\s+', ' ', text).strip()


TRANSLATIONS = OrderedDict()
for t in SCOPE['translations']:
    data = load(os.path.join(SRC, 'qurancom', f'translation-{t["resourceId"]}.json'))
    rows = data['translations']
    keys = [f'{s}:{v}' for s in range(1, 115) for v in range(1, CHAPTERS[s]['verses_count'] + 1)]
    if [r.get('verse_key') for r in rows] != keys:
        raise SystemExit(f'translation {t["resourceId"]}: verse keys are not the 6,236 ayahs in order')
    TRANSLATIONS[t['id']] = {r['verse_key']: clean_translation(r['text']) for r in rows}
    empty = [k for k, v in TRANSLATIONS[t['id']].items() if not v]
    if empty:
        raise SystemExit(f'translation {t["id"]}: empty ayahs {empty[:5]}')


def ayah_translations(surah, n):
    return OrderedDict((tid, TRANSLATIONS[tid][f'{surah}:{n}']) for tid in TRANSLATIONS)


# ---------------------------------------------------------------- source-only grammar layer
PATTERN = {'II': 'فَعَّلَ — يُفَعِّلُ', 'III': 'فَاعَلَ — يُفَاعِلُ', 'IV': 'أَفْعَلَ — يُفْعِلُ',
           'V': 'تَفَعَّلَ — يَتَفَعَّلُ', 'VI': 'تَفَاعَلَ — يَتَفَاعَلُ', 'VII': 'اِنْفَعَلَ — يَنْفَعِلُ',
           'VIII': 'اِفْتَعَلَ — يَفْتَعِلُ', 'IX': 'اِفْعَلَّ — يَفْعَلُّ', 'X': 'اِسْتَفْعَلَ — يَسْتَفْعِلُ'}
EXAMPLE_SUFFIX = 'اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔'


def source_only_word(w):
    """StudyData word from the sources alone; fields without a source stay empty."""
    if not w['syntaxUrdu']:
        problems.append(f"{w['id']}: no Corpus i‘rab")
    if not w['meaningUrdu']:
        missing_meanings.append(w['id'])  # Quran.com has a gap here; the apps hide the empty meaning
    for p in w['problems']:
        if p not in ('missing QAC i‘rab', 'missing Urdu word-by-word meaning'):
            problems.append(f"{w['id']}: {p}")
    return OrderedDict(
        id=w['id'], ayah=w['ayah'], position=w['position'], arabic=w['arabic'],
        arabicIndoPak=w['arabicIndoPak'], meaningUrdu=w['meaningUrdu'], pos=w['pos'], posUrdu=w['posUrdu'], root=w['root'],
        lemma=w['lemma'], morphologyUrdu=w['morphologyUrdu'], syntaxUrdu=w['syntaxUrdu'],
        dictionaryUrdu='',
        segments=[OrderedDict(arabic=s['arabic'], roleUrdu=s['roleUrdu'], meaningUrdu='') for s in w['segments']],
        ruleIds=w['ruleIds'],
    )


PARADIGM_FIELDS = ('baabUrdu', 'formUrdu', 'past', 'present', 'pattern', 'noteUrdu')
LATIN = re.compile(r'[A-Za-z]|https?:')


def authored_word(w, entry):
    """Source word plus its grammar layer (segment glosses, dictionary note, extra rules)."""
    word = source_only_word(w)
    if entry.get('arabic') != w['arabicPlain']:
        problems.append(f"{w['id']}: grammar entry Arabic {entry.get('arabic')} ≠ {w['arabicPlain']}")
    glosses = entry.get('segmentMeaningsUrdu')
    if not isinstance(glosses, list) or len(glosses) != len(word['segments']) or not all(
            isinstance(x, str) and x.strip() for x in glosses):
        problems.append(f"{w['id']}: segmentMeaningsUrdu needs {len(word['segments'])} non-empty glosses")
        glosses = [''] * len(word['segments'])
    note = entry.get('dictionaryUrdu')
    if not isinstance(note, str) or not note.strip():
        problems.append(f"{w['id']}: dictionaryUrdu missing")
        note = ''
    for text in [note, *glosses]:
        if LATIN.search(text or ''):
            problems.append(f"{w['id']}: Latin text or URL in the grammar entry")
    extra = entry.get('addRuleIds', [])
    if not isinstance(extra, list) or any(r not in RULES for r in extra):
        problems.append(f"{w['id']}: unknown addRuleIds {extra}")
        extra = []
    word['dictionaryUrdu'] = note.strip()
    for seg, gloss in zip(word['segments'], glosses):
        seg['meaningUrdu'] = gloss.strip()
    word['ruleIds'] = list(dict.fromkeys(word['ruleIds'] + extra))
    authored_ids.add(w['id'])
    return word


authored_ids = set()


def source_verb_form(w):
    form = w['lexemeKey'].split('|')[1] if w['lexemeKey'] else 'I'
    return OrderedDict(
        baabUrdu=f'بابِ {BAAB[form]}' if form in BAAB else '', formUrdu=form_text(form),
        past=w['lemma'] or '', present='', pattern=PATTERN.get(form, ''), noteUrdu='',
    )


def urdu_name(arabic):
    text = arabic.replace('ي', 'ی').replace('ى', 'ی').replace('ك', 'ک')
    return re.sub(r'ة(?=\s|$)', 'ہ', text)


# ---------------------------------------------------------------- chapters
LESSONS = os.path.join(os.path.abspath(sys.argv[3]) if len(sys.argv) > 3 else os.path.join(PIPE, '..'),
                       'packages', 'core', 'data', 'lessons')
EXISTING = set(SCOPE['existingLessons']) | {SCOPE['partialPilot']['surah']}


def build_chapter(surah):
    src = source_words(surah)
    by_id = {w['id']: w for w in src}
    count = CHAPTERS[surah]['verses_count']
    base = load(os.path.join(LESSONS, f'surah-{surah}.json')) if surah in EXISTING else None
    kept = base['surah']['ayahCount'] if base else 0
    if surah == SCOPE['partialPilot']['surah']:
        # Only the pilot's ayahs carry a published layer; later ayahs are rebuilt from sources
        # (keeps `assemble` idempotent once surah-2.json holds the whole chapter).
        kept = min(kept, SCOPE['partialPilot']['aiLayerThroughAyah'])
        pilot_words = [w for w in base['words'] if w['ayah'] <= kept]
        pilot_roots = {w['root'] for w in pilot_words if w['root']}
        pilot_rules = {r for w in pilot_words for r in w['ruleIds']}
        # The pilot's published layer is what its own words use; root, rule and phrase entries
        # that only later ayahs use are rebuilt (library cards, authored phrases) every time.
        base = dict(base, words=pilot_words,
                    verbForms={k: v for k, v in base['verbForms'].items() if int(k.split(':')[1]) <= kept},
                    roots=OrderedDict((r, v) for r, v in base['roots'].items() if r in pilot_roots),
                    rules=[r for r in base['rules'] if r['id'] in pilot_rules],
                    ayahs=[a for a in base['ayahs'] if a['number'] <= kept])
    if base and surah in SCOPE['existingLessons'] and kept != count:
        raise SystemExit(f'{surah}: existing lesson has {kept} of {count} ayahs')
    words, verb_forms = [], OrderedDict()
    meaning_changes = 0
    if base:
        base_ids = [w['id'] for w in base['words']]
        src_ids = [w['id'] for w in src if w['ayah'] <= kept]
        if base_ids != src_ids:
            raise SystemExit(f'{surah}: published word IDs differ from Quran.com')
        for old in base['words']:
            s = by_id[old['id']]
            word = with_indopak(old, s['arabicIndoPak'])
            old_plain = pause_free(old['arabic'])
            if old_plain != s['arabicPlain']:
                if strip_marks(old_plain) != strip_marks(s['arabicPlain']):
                    problems.append(f"{old['id']}: published Arabic {old['arabic']} ≠ Quran.com {s['arabic']}")
                # Same letters, different marks (e.g. tatweel before dagger alif): Quran.com's text wins.
                arabic_updates.append({'id': old['id'], 'published': old_plain, 'quranCom': s['arabicPlain']})
            word['arabic'] = s['arabic']  # Quran.com verbatim, pause signs included
            if s['meaningUrdu']:
                meaning_changes += word['meaningUrdu'] != s['meaningUrdu']
                word['meaningUrdu'] = s['meaningUrdu']
            else:
                # Quran.com gap: no AI-written meaning is kept (owner 2026-11-26); the apps hide it.
                kept_meanings.append(old['id'])
                meaning_changes += bool(word['meaningUrdu'])
                word['meaningUrdu'] = ''
            words.append(word)
        verb_forms.update(base['verbForms'])
    layer, layer_phrases = grammar_layer(surah)
    # The 2:1–20 pilot entries are already part of the published lesson (base).
    for s_, a1, a2, kind, name in [c for c in CHUNK_FILES if c[0] == surah]:
        have = load(name)
        if kind == 'words':
            want = [w['id'] for w in src if a1 <= w['ayah'] <= a2]
            missing = [x for x in want if x not in have]
            extra = [x for x in have if x not in want]
        else:
            want = [f'{surah}:{n}' for n in range(a1, a2 + 1)]
            missing = [x for x in want if not have.get(x)]
            extra = [x for x in have if x not in want]
        if missing or extra:
            problems.append(f'{os.path.relpath(name, WORK)}: missing {missing[:5]} extra {extra[:5]}')
    unknown = {k for k in layer if int(k.split(':')[1]) > kept} - {w['id'] for w in src}
    if unknown:
        problems.append(f'{surah}: grammar entries for unknown or published words {sorted(unknown)[:5]}')
    authored_words, authored_ayahs = 0, set()
    for w in src:
        if w['ayah'] <= kept:
            continue
        entry = layer.get(w['id'])
        if entry is not None:
            authored_words += 1
            authored_ayahs.add(w['ayah'])
        word = source_only_word(w) if entry is None else authored_word(w, entry)
        words.append(word)
        if w['pos'] == 'verb':
            lex = LIB_LEXEMES.get(w['lexemeKey'])
            verb_forms[w['id']] = (OrderedDict((k, lex[k]) for k in PARADIGM_FIELDS) if lex
                                   else source_verb_form(w))
            if lex and entry is not None:
                word['lemma'] = lex['past']

    # rules: published rule cards first (unchanged), then library cards for new rule ids
    rules = list(base['rules']) if base else []
    have = {r['id'] for r in rules}
    for w in words:
        for rid in w['ruleIds']:
            if rid in have:
                continue
            have.add(rid)
            meaning = re.sub(r'[۔.؟?!،,؛;:\s]+$', '', w['meaningUrdu'])
            rules.append(OrderedDict(id=rid, titleUrdu=RULES[rid]['titleUrdu'],
                                     explanationUrdu=RULES[rid]['explanationUrdu'],
                                     exampleUrdu=f"{pause_free(w['arabic'])} — {meaning}۔ {EXAMPLE_SUFFIX}"))
    roots = OrderedDict(base['roots']) if base else OrderedDict()
    for w in words:
        if w['root'] and w['root'] not in roots:
            lib = LIB_ROOTS.get(w['root'])
            roots[w['root']] = OrderedDict(meaningUrdu=lib['meaningUrdu'] if lib else '',
                                           noteUrdu=lib['noteUrdu'] if lib else '')
    phrases = {a['number']: a['phrases'] for a in base['ayahs']} if base else {}
    ids = {w['id'] for w in words}
    for key, cards in layer_phrases.items():
        n = int(key.split(':')[1])
        if not key.startswith(f'{surah}:') or n <= kept or n > count:
            problems.append(f'{key}: phrase cards outside the chapter\'s unpublished ayahs')
            continue
        out = []
        for i, card in enumerate(cards, start=1):
            bad = [x for x in card.get('wordIds', []) if x not in ids or int(x.split(':')[1]) != n]
            if bad or not card.get('wordIds') or not all(
                    isinstance(card.get(f), str) and card[f].strip() for f in ('labelUrdu', 'explanationUrdu')):
                problems.append(f'{key}: phrase card {i} invalid (word ids {bad or card.get("wordIds")})')
                continue
            out.append(OrderedDict(id=f'{key}:phrase:{i}', wordIds=list(card['wordIds']),
                                   labelUrdu=card['labelUrdu'].strip(),
                                   explanationUrdu=card['explanationUrdu'].strip()))
        phrases[n] = out
        authored_ayahs.add(n)
    ayahs = [OrderedDict(number=n, translations=ayah_translations(surah, n), phrases=phrases.get(n, []))
             for n in range(1, count + 1)]
    if base:
        name_urdu, name_arabic = base['surah']['nameUrdu'], base['surah']['nameArabic']
    else:
        name_arabic = f"سورة {CHAPTERS[surah]['name_arabic']}"
        name_urdu = f"سورۃ {urdu_name(CHAPTERS[surah]['name_arabic'])}"
    study = OrderedDict(
        schemaVersion=1,
        surah=OrderedDict(number=surah, nameUrdu=name_urdu, nameArabic=name_arabic,
                          ayahCount=count, wordCount=len(words)),
        words=words, ayahs=ayahs, rules=rules, roots=roots, verbForms=verb_forms,
    )
    stats = {'words': len(words), 'publishedWords': len([w for w in base['words']]) if base else 0,
             'meaningsReplaced': meaning_changes,
             'authoredWords': authored_words, 'authoredAyahs': sorted(authored_ayahs),
             'libraryRoots': sum(1 for r in roots if r not in (base['roots'] if base else {}) and r in LIB_ROOTS),
             'libraryParadigms': sum(1 for k, v in verb_forms.items()
                                     if int(k.split(':')[1]) > kept and v.get('present'))}
    return study, stats


ONLY_PACKETS = [int(x) for x in os.environ['QG_SURAHS'].split(',')] if os.environ.get('QG_SURAHS') else None
# ---------------------------------------------------------------- grammar work packets
if MODE == 'packets':
    # Chunk plan: consecutive ayahs of the unpublished part of each chapter, about TARGET words
    # each (an ayah is never split). Packets carry everything a grammar author needs.
    TARGET = int(os.environ.get('QG_CHUNK_WORDS', '220'))
    out_dir = os.path.join(WORK, 'packets')
    os.makedirs(out_dir, exist_ok=True)
    plan, need_roots, need_lex = [], OrderedDict(), OrderedDict()
    for surah in ONLY_PACKETS or range(1, 115):
        if surah in SCOPE['existingLessons']:
            continue
        start = SCOPE['partialPilot']['aiLayerThroughAyah'] + 1 if surah == SCOPE['partialPilot']['surah'] else 1
        src = [w for w in source_words(surah) if w['ayah'] >= start]
        by_ayah = OrderedDict()
        for w in src:
            by_ayah.setdefault(w['ayah'], []).append(w)
        chunk = []
        def flush():
            if not chunk:
                return
            a1, a2 = chunk[0]['ayah'], chunk[-1]['ayah']
            cid = f'{surah:03d}-{a1:03d}-{a2:03d}'
            packet = OrderedDict(
                chunk=cid, surah=surah, fromAyah=a1, toAyah=a2,
                ayahs=[OrderedDict(key=f'{surah}:{n}', arabic=' '.join(w['arabicPlain'] for w in by_ayah[n]),
                                   translationUrdu=TRANSLATIONS['jalandhari'][f'{surah}:{n}'])
                       for n in range(a1, a2 + 1)],
                words=[OrderedDict(
                    id=w['id'], arabic=w['arabicPlain'], meaningUrdu=w['meaningUrdu'], pos=w['pos'],
                    posUrdu=w['posUrdu'], root=w['root'], lemma=w['lemma'], lexemeKey=w['lexemeKey'],
                    morphologyUrdu=w['morphologyUrdu'], irabArabic=w['syntaxUrdu'],
                    segments=[OrderedDict(arabic=x['arabic'], roleUrdu=x['roleUrdu']) for x in w['segments']],
                    ruleIds=w['ruleIds'], glossEnglishCorpus=w['reference']['glossEnglishQac'],
                    morphologyEnglishCorpus=w['reference']['qacMorphologyEnglish'],
                ) for w in chunk],
            )
            dump(os.path.join(out_dir, f'words-{cid}.json'), packet)
            plan.append(OrderedDict(chunk=cid, surah=surah, fromAyah=a1, toAyah=a2, words=len(chunk)))
            chunk.clear()
        for n, ws in by_ayah.items():
            if chunk and len(chunk) + len(ws) > TARGET:
                flush()
            chunk.extend(ws)
        flush()
        for w in src:
            if w['root'] and w['root'] not in LIB_ROOTS:
                r = need_roots.setdefault(w['root'], OrderedDict(root=w['root'], occurrences=[]))
                if len(r['occurrences']) < 12:
                    r['occurrences'].append(OrderedDict(id=w['id'], arabic=w['arabicPlain'], lemma=w['lemma'],
                                                        meaningUrdu=w['meaningUrdu'],
                                                        glossEnglish=w['reference']['glossEnglishQac']))
            if w['pos'] == 'verb' and w['lexemeKey'] not in LIB_LEXEMES:
                lemma_bw, form, voice = w['lexemeKey'].split('|')
                x = need_lex.setdefault(w['lexemeKey'], OrderedDict(
                    key=w['lexemeKey'], lemmaCorpus=w['lemma'], form=form, voice=voice, root=w['root'],
                    occurrences=[]))
                if len(x['occurrences']) < 8:
                    x['occurrences'].append(OrderedDict(id=w['id'], arabic=w['arabicPlain'], meaningUrdu=w['meaningUrdu'],
                                                        morphologyEnglishCorpus=w['reference']['qacMorphologyEnglish']))
    dump(os.path.join(out_dir, 'needs-roots.json'), list(need_roots.values()))
    dump(os.path.join(out_dir, 'needs-lexemes.json'), list(need_lex.values()))
    dump(os.path.join(out_dir, 'plan.json'), plan)
    print(json.dumps({'chunks': len(plan), 'words': sum(c['words'] for c in plan),
                      'missingRoots': len(need_roots), 'missingLexemes': len(need_lex)}, indent=1))
    sys.exit(0)

# QG_SURAHS=1,2,3 limits a `check` run while sources are still downloading (never for assemble).
ONLY = [int(x) for x in os.environ['QG_SURAHS'].split(',')] if os.environ.get('QG_SURAHS') else None
if ONLY and MODE == 'assemble':
    raise SystemExit('assemble always builds all 114 chapters; unset QG_SURAHS')
def ranges(numbers):
    out = []
    for n in numbers:
        if out and out[-1][1] == n - 1:
            out[-1][1] = n
        else:
            out.append([n, n])
    return out


studies, report = {}, {}
for surah in ONLY or range(1, 115):
    studies[surah], report[surah] = build_chapter(surah)

total_words = sum(s['surah']['wordCount'] for s in studies.values())
summary = OrderedDict(
    surahs=len(studies), ayahs=sum(s['surah']['ayahCount'] for s in studies.values()), words=total_words,
    qacWords=len(qac), publishedWords=sum(r['publishedWords'] for r in report.values()),
    sourceOnlyWords=total_words - sum(r['publishedWords'] for r in report.values()),
    publishedMeaningsReplaced=sum(r['meaningsReplaced'] for r in report.values()),
    translations={tid: len(v) for tid, v in TRANSLATIONS.items()},
    corpusSpellingDifferences=sum(len(v) for v in text_diffs.values()),
    corpusLetterDifferences=[x['id'] for x in letter_mismatches],
    quranComSplitWordsJoined=[x['id'] for x in merged_words],
    publishedArabicAlignedToQuranCom=[x['id'] for x in arabic_updates],
    wordsWithPauseSigns=sum(len(v) for v in pause_marks.values()),
    sourceOnlyWordsWithoutQuranComMeaning=len(missing_meanings),
    publishedWordsWithoutQuranComMeaning=len(kept_meanings),
    grammarLayerWords=sum(r['authoredWords'] for r in report.values()),
    grammarLayerAyahs=sum(len(r['authoredAyahs']) for r in report.values()),
    libraryRootEntries=sum(r['libraryRoots'] for r in report.values()),
    libraryVerbParadigms=sum(r['libraryParadigms'] for r in report.values()),
    problems=len(problems),
)
if not ONLY and total_words != len(qac):
    problems.append(f'{total_words} words built, QAC has {len(qac)}')
print(json.dumps(summary, ensure_ascii=False, indent=1))
if problems:
    print(json.dumps(problems[:80], ensure_ascii=False, indent=1))
    sys.exit(1)

if MODE == 'assemble':
    for surah, study in studies.items():
        dump(os.path.join(LESSONS, f'surah-{surah}.json'), study)
    retrieved = {name: load(os.path.join(SRC, 'qurancom', name))['retrievedAt']
                 for name in ['chapters.json'] + [f'translation-{t["resourceId"]}.json' for t in SCOPE['translations']]}
    dump(os.path.join(WORK, 'inventory', 'sources.json'), OrderedDict(
        builtAt=max(retrieved.values()),
        textSource='Quran.com API v4 /verses/by_chapter text_uthmani verbatim, pause signs and ۞ included (end-of-ayah markers are separate tokens, not words); every word letter-checked against QAC 0.4 without its pause signs',
        meaningSource='Quran.com API v4 word-by-word translation, language=ur',
        grammarSource='Quranic Arabic Corpus 0.4 morphology (content-pipeline/qac) and corpus.quran.com word-by-word Arabic i‘rab',
        translationSource=[OrderedDict(t, url=f"https://api.quran.com/api/v4/quran/translations/{t['resourceId']}?fields=verse_key",
                                       retrievedAt=retrieved[f"translation-{t['resourceId']}.json"])
                           for t in SCOPE['translations']],
        translationPolicy='Footnote markers (<sup foot_note>) and markup removed, whitespace collapsed; words verbatim.',
        corpusLetterDifferences=OrderedDict(
            note='Quran.com and QAC 0.4 spell these words with different letters; the stored word is Quran.com text_uthmani and the segment cards use the Corpus segment spelling.',
            words=letter_mismatches),
        publishedArabicAlignedToQuranCom=OrderedDict(
            note='Published words whose Arabic differed from Quran.com text_uthmani only in marks; the Quran.com text is now stored.',
            words=arabic_updates),
        quranComSplitWordsJoined=OrderedDict(
            note='Quran.com writes these Corpus words as two words; they are joined (with a space) so word IDs follow the Corpus.',
            words=merged_words),
        meaningGaps=OrderedDict(
            note='Quran.com word-by-word Urdu is empty for these words, so their meaning is empty (hidden in the apps); no AI-written meaning is used.',
            sourceOnlyEmpty=missing_meanings, publishedEmptied=kept_meanings,
        ),
        grammarLayer=OrderedDict(
            note=('AI-authored grammar layer (owner decision 2026-11-26), scholarly review pending: '
                  'segment glosses, dictionary notes and extra rule ids from words/<surah>/*.json, phrase '
                  'cards from phrases/<surah>/*.json, root and verb-paradigm cards from the libraries '
                  '(applied to every unpublished word whose root or lexeme they cover). Word meanings and '
                  'ayah translations are never part of it. `chapters` lists, per chapter, the number of '
                  'authored words and the authored ayahs as [from, to] ranges.'),
            authoredWords=summary['grammarLayerWords'], authoredAyahs=summary['grammarLayerAyahs'],
            chapters=OrderedDict((str(s_), OrderedDict(words=r['authoredWords'], ayahs=ranges(r['authoredAyahs'])))
                                 for s_, r in report.items() if r['authoredWords'] or r['authoredAyahs']),
        ),
        summary=summary,
    ))
    for surah in studies:
        dump(os.path.join(WORK, 'inventory', f'inventory-{surah}.json'), OrderedDict(
            surah=surah, corpusSpellingDifferences=text_diffs[surah], wordsWithPauseSigns=pause_marks[surah],
        ))
    print('wrote', len(studies), 'lessons to', LESSONS)

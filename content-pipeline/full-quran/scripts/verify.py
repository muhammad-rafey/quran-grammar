"""Independent verification of the whole-Quran lesson build (second implementation).

Usage:
  python3 -I verify.py [--surahs 1,2,3] [--lessons DIR] [--write] [--allow-incomplete-sources]
                       [--examples N] [--json]

Re-derives every expected value from the raw sources and compares it with the built lessons
(packages/core/data/lessons/surah-N.json by default). It deliberately does NOT import
build.py: QAC 0.4 is parsed here, and Arabic text, word ids, meanings, translations and the
Corpus i'rab are rebuilt from the Quran.com / QAC files with independent code. Only the shared,
already-reviewed Buckwalter table and POS helper from content-pipeline/scripts/qac.py are used.

Sources: content-pipeline/full-quran/sources/ (fetch.py), content-pipeline/qac/qac04-lfs.txt,
content-pipeline/full-quran/scope.json.

Grammar layer (owner decision 2026-11-26): words/<surah>/*.json and phrases/<surah>/*.json under
--layer (default content-pipeline/full-quran) are the authored words and ayahs; the root and
verb-paradigm libraries are the roots/ and lexemes/ files of the --libs directories (later
directories win). Rule 8 checks that authored words carry exactly their authored notes, that every
other unpublished word carries none, and that unpublished roots/paradigms equal their library entry
(or stay empty without one); rule 10 does the same for phrase cards. Meanings, translations and
Arabic (rules 3-7) never come from the grammar layer.

Prints a human summary; with --write also writes full-quran/inventory/verification.json.
Exit code 1 on any failure. With --allow-incomplete-sources, chapters whose QAC word-by-word file
is missing or incomplete are reported as "source incomplete" and their Corpus-i'rab checks are
skipped without failing; without it, an incomplete source is a failure.
"""
import argparse
import datetime
import json
import os
import re
import sys
import time
import traceback
import unicodedata
from collections import Counter, OrderedDict, defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
FQ = os.path.abspath(os.path.join(HERE, '..'))
PIPE = os.path.abspath(os.path.join(FQ, '..'))
REPO = os.path.abspath(os.path.join(PIPE, '..'))
sys.path.insert(0, os.path.join(PIPE, 'scripts'))
from qac import BW2AR, bw2ar, derive_pos  # noqa: E402  (shared reviewed helpers only)

POS_VALUES = {'noun', 'verb', 'adjective', 'particle', 'pronoun'}
PAUSE_CHARS = {chr(c) for c in range(0x06D6, 0x06DD)} | {'۩'}
FORBIDDEN_KEYS = {'translationUrdu', 'themeUrdu', 'tafsirUrdu'}
AYAH_KEYS = ('number', 'translations', 'phrases')
TATWEEL = 'ـ'
LATIN = re.compile(r'[A-Za-z]|https?:')
PARADIGM_FIELDS = ('baabUrdu', 'formUrdu', 'past', 'present', 'pattern', 'noteUrdu')
DEFAULT_LIBS = [os.path.join(PIPE, 'libs'), os.path.join(PIPE, 'edition-2', 'libs'),
                os.path.join(PIPE, 'edition-3', 'libs'), os.path.join(FQ, 'libs')]
BIDI = {'\u200e', '\u200f', '\u061c'}  # LRM/RLM/ALM: seen glued to a sajdah sign (27:26:8 '۩\u200f')


# ---------------------------------------------------------------- report
class Report:
    def __init__(self, max_examples):
        self.max = max_examples
        self.failures = OrderedDict()
        self.warnings = OrderedDict()
        self.info = OrderedDict()

    def _add(self, bucket, cls, example):
        entry = bucket.setdefault(cls, {'count': 0, 'examples': []})
        entry['count'] += 1
        if example is not None and len(entry['examples']) < self.max:
            entry['examples'].append(example)

    def fail(self, cls, example=None):
        self._add(self.failures, cls, example)

    def warn(self, cls, example=None):
        self._add(self.warnings, cls, example)

    def note(self, cls, example=None):
        self._add(self.info, cls, example)


def collapse(text):
    return re.sub(r'\s+', ' ', text or '').strip()


def load_json(path):
    with open(path, encoding='utf-8') as handle:
        return json.load(handle)


# ---------------------------------------------------------------- sources
def load_qac(path, rep):
    """word id -> list of (segment no, kind, tag, form_bw, {feature: value}); ayah -> word count."""
    words = defaultdict(list)
    with open(path, encoding='utf-8') as handle:
        lines = handle.readlines()
    for raw in lines:
        if not raw.startswith('('):
            continue
        cols = raw.rstrip('\n').split('\t')
        if len(cols) != 4:
            rep.fail('source: QAC line unparsable', raw[:80])
            continue
        loc, form, tag, feats = cols
        c, v, w, s = (int(x) for x in loc.strip('()').split(':'))
        parts = feats.split('|')
        fmap = {'_kind': parts[0]}
        for p in parts[1:]:
            k, _, val = p.partition(':')
            fmap[k] = val if _ else True
        words[(c, v, w)].append((s, parts[0], tag, form, fmap))
    ayah_words = defaultdict(int)
    for (c, v, w), segs in words.items():
        if [x[0] for x in segs] != list(range(1, len(segs) + 1)):
            rep.fail('source: QAC segment numbers not 1..k', f'{c}:{v}:{w}')
        ayah_words[(c, v)] = max(ayah_words[(c, v)], w)
    for (c, v), n in ayah_words.items():
        for w in range(1, n + 1):
            if (c, v, w) not in words:
                rep.fail('source: QAC word numbers not 1..n', f'{c}:{v}:{w}')
    return words, ayah_words


def is_pause_token(token):
    return (any(ch in PAUSE_CHARS for ch in token)
            and all(ch in PAUSE_CHARS or ch in BIDI for ch in token))


def word_arabic_from_api(raw):
    """-> (expected word Arabic, a mark was removed, a removed token carried a bidi mark)."""
    tokens = raw.split(' ')
    removed = bidi = False
    if tokens and tokens[0] == '۞':
        tokens, removed = tokens[1:], True
    while len(tokens) > 1 and is_pause_token(tokens[-1]):
        bidi = bidi or any(ch in BIDI for ch in tokens[-1])
        tokens.pop()
        removed = True
    return ' '.join(tokens), removed, bidi


def join_split_words(s, a, api_words, qac_count, rep):
    """Quran.com sometimes writes one Corpus word as two (37:130 إِلْ يَاسِينَ). Join adjacent
    Quran.com words whose letters together equal the Corpus word, renumbering positions."""
    if len(api_words) <= qac_count or QAC_FORMS is None:
        return api_words
    out, i = [], 0
    for k in range(1, qac_count + 1):
        target = letters(QAC_FORMS.get((s, a, k), '')).replace(' ', '')
        take = 1
        for size in (2, 3):
            chunk = api_words[i:i + size]
            joined = ''.join(word_arabic_from_api(w.get('text_uthmani') or '')[0] for w in chunk)
            if len(chunk) == size and letters(joined).replace(' ', '') == target and \
                    letters(word_arabic_from_api(api_words[i].get('text_uthmani') or '')[0]) != target:
                take = size
                break
        if k == qac_count:
            take = len(api_words) - i
        chunk = api_words[i:i + take]
        i += take
        if len(chunk) == 1:
            out.append(dict(chunk[0], position=k))
            continue
        rep.warn('2 Quran.com split word joined to match the Corpus', f'{s}:{a}:{k}')
        out.append({
            'position': k, 'char_type_name': 'word',
            'text_uthmani': ' '.join(word_arabic_from_api(w.get('text_uthmani') or '')[0] for w in chunk),
            'text_indopak': ' '.join((w.get('text_indopak') or '') for w in chunk),
            'translation': {'text': ' '.join(collapse((w.get('translation') or {}).get('text'))
                                             for w in chunk if collapse((w.get('translation') or {}).get('text')))},
        })
    return out


QAC_FORMS = None  # (s, a, w) -> concatenated Arabic segment forms; set in main()


def letters(text):
    text = text.replace('ـٔ', 'ء').replace('ـٕ', 'ء')
    return ''.join(ch for ch in text if ch != TATWEEL and unicodedata.category(ch) != 'Mn')


def letters_small_yeh(text):
    # Secondary equivalence (reported separately): Quran.com writes small yeh as tatweel + U+06E7
    # (small high yeh, Mn); QAC writes U+06E6 (small yeh, Lm).
    return letters(text.replace('ـۧ', 'ۦ'))


TAG_OR_SUP = re.compile(r'<sup\b[^>]*>.*?</sup>|<[^>]+>', re.S | re.I)


def clean_translation(raw):
    """-> (expected text, set of non-space char indices where a marker/tag was removed)."""
    chunks = TAG_OR_SUP.split(raw)
    boundaries, count = set(), 0
    for i, chunk in enumerate(chunks):
        count += sum(1 for ch in chunk if not ch.isspace())
        if i < len(chunks) - 1:
            boundaries.add(count)
    # A lone '<' or '>' at the very end is markup debris (4:106 Junagarhi); it is dropped too.
    text = re.sub(r'\s*[<>]\s*$', '', ''.join(chunks))
    return collapse(text), boundaries


def space_profile(text):
    chars, spaces, pending = [], set(), False
    for ch in text:
        if ch.isspace():
            pending = bool(chars)
            continue
        if pending:
            spaces.add(len(chars))
            pending = False
        chars.append(ch)
    return ''.join(chars), spaces


def compare_translation(built, expected, boundaries):
    """'exact' | 'marker-space' (differs only at removed markers) | 'space' | 'content'."""
    if built == expected:
        return 'exact'
    b_chars, b_sp = space_profile(built)
    e_chars, e_sp = space_profile(expected)
    if b_chars != e_chars:
        return 'content'
    if built != collapse(built):
        return 'space'
    return 'marker-space' if (b_sp ^ e_sp) <= boundaries else 'space'


def mushaf_keys(chapters):
    return [f'{s}:{v}' for s in range(1, 115) for v in range(1, chapters[s]['verses_count'] + 1)]


def load_translation(path, keys, rep, rid):
    rows = load_json(path)['translations']
    with_key = sum(1 for r in rows if r.get('verse_key'))
    if with_key == len(rows) and rows:
        mode = 'verse_key'
        if [r['verse_key'] for r in rows] != keys:
            rep.fail('source: translation verse_key order is not mushaf order', rid)
        texts = {r['verse_key']: r.get('text') or '' for r in rows}
    else:
        mode = 'mushaf-order fallback' if with_key == 0 else 'mushaf-order fallback (partial verse_key)'
        if with_key:
            rep.fail('source: translation has verse_key on only some rows', f'{rid}: {with_key}/{len(rows)}')
        if len(rows) != len(keys):
            rep.fail('source: translation row count != 6236', f'{rid}: {len(rows)}')
        texts = {k: (r.get('text') or '') for k, r in zip(keys, rows)}
    return texts, mode


# ---------------------------------------------------------------- grammar layer
def _json_files(directory):
    if not os.path.isdir(directory):
        return []
    return [os.path.join(directory, n) for n in sorted(os.listdir(directory)) if n.endswith('.json')]


def load_layer(layer_dir, rep):
    """-> (word id -> authored entry, 'surah:ayah' -> authored phrase cards)."""
    words, phrases = {}, {}
    for kind, target in (('words', words), ('phrases', phrases)):
        base = os.path.join(layer_dir, kind)
        if not os.path.isdir(base):
            continue
        for sub in sorted(os.listdir(base)):
            for path in _json_files(os.path.join(base, sub)):
                for key, value in load_json(path).items():
                    if key in target:
                        rep.fail(f'8 grammar layer: duplicated {kind} entry', key)
                    target[key] = value
    return words, phrases


def load_libraries(dirs):
    """-> (root -> entry, lexeme key -> entry); later directories and file names win."""
    roots, lexemes = {}, {}
    for d in dirs:
        for path in _json_files(os.path.join(d, 'roots')):
            for e in load_json(path)['entries']:
                roots[e['root']] = e
        for path in _json_files(os.path.join(d, 'lexemes')):
            for e in load_json(path)['entries']:
                lexemes[e['key']] = e
    return roots, lexemes


def qac_lexeme_key(segs):
    """'LEM|form|ACT/PASS' of the verb stem, from the QAC features (e.g. '>anzala|IV|PASS')."""
    for _s, kind, tag, _form, f in segs:
        if kind == 'STEM' and tag == 'V':
            form = next((k[1:-1] for k in f if isinstance(k, str) and re.fullmatch(r'\([IVX]+\)', k)), 'I')
            return f"{f.get('LEM')}|{form}|{'PASS' if f.get('PASS') else 'ACT'}"
    return None


# ---------------------------------------------------------------- chapter checks
def walk_keys(value, path, found):
    if isinstance(value, dict):
        for k, v in value.items():
            if k in FORBIDDEN_KEYS:
                found.append(f'{path}.{k}')
            walk_keys(v, f'{path}.{k}', found)
    elif isinstance(value, list):
        for i, v in enumerate(value):
            walk_keys(v, f'{path}[{i}]', found)


def stems(segs):
    return [x for x in segs if x[1] == 'STEM']


def qac_root(segs):
    for x in stems(segs):
        root = x[4].get('ROOT')
        if isinstance(root, str) and root:
            return ' '.join('أ' if ch == 'A' else BW2AR[ch] for ch in root)
    return None


def qac_verb_lemma(segs):
    for x in stems(segs):
        if x[2] == 'V':
            lem = x[4].get('LEM')
            return bw2ar(lem) if isinstance(lem, str) else None
    return None


def qac_segments_for_derive(segs):
    out = []
    for s, kind, tag, form, f in segs:
        d = {'segment': s, 'kind': kind, 'tag': tag, 'formBuckwalter': form, 'formArabic': bw2ar(form)}
        if isinstance(f.get('LEM'), str):
            d['lemmaBuckwalter'] = f['LEM']
        if isinstance(f.get('ROOT'), str):
            d['rootBuckwalter'] = f['ROOT']
        out.append(d)
    return out


def irab_expected(entries):
    out = []
    for x in entries or []:
        x = re.sub(r'\s*\n\s*', '؛ ', (x or '').strip()).strip()
        if x:
            out.append(x)
    return '؛ '.join(out)


def verify_chapter(s, lesson, ctx, rep, stats):
    scope, chapters, qac, qac_ayah = ctx['scope'], ctx['chapters'], ctx['qac'], ctx['qac_ayah']
    pilot = scope['partialPilot']
    published_chapter = s in ctx['existing']

    def published(a):
        return published_chapter or (s == pilot['surah'] and a <= pilot['aiLayerThroughAyah'])

    layer_words, layer_phrases = ctx['layer_words'], ctx['layer_phrases']
    lib_roots, lib_lexemes = ctx['lib_roots'], ctx['lib_lexemes']
    authored_word_ayahs = {int(k.split(':')[1]) for k in layer_words if k.split(':')[0] == str(s)}
    n_ayahs = chapters[s]['verses_count']
    cs = stats.setdefault(s, OrderedDict(published='published' if published_chapter else (
        'partial' if s == pilot['surah'] else 'source-only')))

    # --- rule 1: chapter header and ayah numbering
    if lesson.get('schemaVersion') != 1:
        rep.fail('1 schemaVersion != 1', f'{s}: {lesson.get("schemaVersion")!r}')
    surah = lesson.get('surah') or {}
    words = lesson.get('words') or []
    ayahs = lesson.get('ayahs') or []
    if surah.get('number') != s:
        rep.fail('1 surah.number wrong', f'{s}: {surah.get("number")!r}')
    if surah.get('ayahCount') != n_ayahs:
        rep.fail('1 ayahCount != chapters.json verses_count', f'{s}: {surah.get("ayahCount")} vs {n_ayahs}')
    if surah.get('wordCount') != len(words):
        rep.fail('1 wordCount != len(words)', f'{s}: {surah.get("wordCount")} vs {len(words)}')
    if [a.get('number') for a in ayahs] != list(range(1, n_ayahs + 1)):
        rep.fail('1 ayahs not numbered 1..N', f'{s}: {len(ayahs)} ayahs, first numbers '
                 f'{[a.get("number") for a in ayahs[:3]]}')
    for field in ('nameUrdu', 'nameArabic'):
        if not surah.get(field):
            rep.fail(f'1 surah.{field} empty', s)
    cs['ayahs'] = len(ayahs)
    cs['words'] = len(words)
    stats['_totals']['ayahs'] += len(ayahs)
    stats['_totals']['words'] += len(words)

    # --- rule 2: word ids per ayah
    verses = ctx['verses'].get(s)
    api = {}
    expected_ids = []
    for v in verses or []:
        a = v['verse_number']
        api_words = [w for w in v['words'] if w.get('char_type_name') == 'word']
        if [w.get('position') for w in api_words] != list(range(1, len(api_words) + 1)):
            rep.fail('2 source: Quran.com word positions not 1..n', f'{s}:{a}')
        api_words = join_split_words(s, a, api_words, qac_ayah.get((s, a), 0), rep)
        if len(api_words) != qac_ayah.get((s, a), 0):
            rep.fail('2 Quran.com word count != QAC word count',
                     f'{s}:{a}: {len(api_words)} vs {qac_ayah.get((s, a), 0)}')
        for w in api_words:
            api[(a, w['position'])] = w
            expected_ids.append(f'{s}:{a}:{w["position"]}')
    built_ids = [w.get('id') for w in words]
    if verses is not None and built_ids != expected_ids:
        first = next((i for i, (x, y) in enumerate(zip(built_ids, expected_ids)) if x != y),
                     min(len(built_ids), len(expected_ids)))
        rep.fail('2 word ids != s:a:1..n from Quran.com/QAC',
                 f'{s}: {len(built_ids)} built vs {len(expected_ids)} expected; first difference at index '
                 f'{first}: {built_ids[first] if first < len(built_ids) else None} vs '
                 f'{expected_ids[first] if first < len(expected_ids) else None}')
    if len(set(built_ids)) != len(built_ids):
        rep.fail('2 duplicate word ids', s)

    wbw = ctx['wbw'].get(s)
    rules = lesson.get('rules') or []
    rule_ids = {r.get('id') for r in rules}
    if len(rule_ids) != len(rules):
        rep.fail('9 duplicate rule ids', s)
    roots = lesson.get('roots') or {}
    verb_forms = lesson.get('verbForms') or {}
    used_roots = Counter()
    published_roots = set()
    verb_word_ids = set()
    word_by_id = {}

    for w in words:
        wid = w.get('id') or ''
        word_by_id[wid] = w
        try:
            ws, wa, wp = (int(x) for x in wid.split(':'))
        except ValueError:
            rep.fail('2 unparsable word id', f'{s}: {wid!r}')
            continue
        if ws != s or w.get('ayah') != wa or w.get('position') != wp:
            rep.fail('2 word ayah/position fields disagree with id', f'{wid}: ayah={w.get("ayah")} '
                     f'position={w.get("position")}')
        pub = published(wa)
        if w.get('root'):
            used_roots[w['root']] += 1
            if pub:
                published_roots.add(w['root'])
        if w.get('pos') == 'verb':
            verb_word_ids.add(wid)
        segs = qac.get((ws, wa, wp))
        src = api.get((wa, wp))
        arabic = w.get('arabic') or ''

        # --- rule 3: Arabic text
        if src is not None:
            exp_ar, removed, bidi = word_arabic_from_api(src.get('text_uthmani') or '')
            if removed:
                stats['_totals']['pauseOrHizbMarkRemoved'] += 1
            if bidi:
                rep.note('3 source: pause token carries a bidi mark (treated as a pause token)',
                         {'id': wid, 'apiText': src.get('text_uthmani')})
            if ' ' in exp_ar:
                rep.note('3 source: Quran.com word contains an internal space', {'id': wid, 'arabic': exp_ar})
            if any(ch in BIDI for ch in arabic):
                rep.fail('3 bidi control character in word Arabic', {'id': wid, 'arabic': arabic})
            if arabic != exp_ar:
                ex = {'id': wid, 'built': arabic, 'expected': exp_ar}
                if pub:
                    rep.warn('3b Arabic != Quran.com (published chapter)', ex)
                else:
                    rep.fail('3a Arabic != Quran.com (source-only)', ex)
            if ' ' in arabic and is_pause_token(arabic.split(' ')[-1]):
                rep.fail('3 pause sign token left in word Arabic', {'id': wid, 'arabic': arabic})
            if arabic.startswith('۞'):
                rep.fail('3 rub-el-hizb mark left in word Arabic', {'id': wid, 'arabic': arabic})

            # --- rule 5: meaning
            exp_m = collapse((src.get('translation') or {}).get('text'))
            got_m = w.get('meaningUrdu')
            if not exp_m:
                # Quran.com gap (owner policy 2026-11-26): published words keep their published
                # meaning; source-only words stay empty (hidden by the apps).
                # No AI-written meaning anywhere: the word's meaning must be empty too.
                rep.warn('5 Quran.com meaning empty; meaning left empty', wid)
                if got_m:
                    rep.fail('5 meaning filled without a Quran.com source', {'id': wid, 'built': got_m, 'published': pub})
            elif not got_m:
                rep.fail('5 meaningUrdu empty', wid)
            elif got_m != exp_m:
                rep.fail('5 meaningUrdu != Quran.com word-by-word',
                         {'id': wid, 'built': got_m, 'expected': exp_m, 'published': pub})
        elif verses is not None:
            rep.fail('2 word not in Quran.com source', wid)

        # --- rule 4: letters vs QAC
        if segs is None:
            rep.fail('4 word not in QAC 0.4', wid)
        else:
            corpus = bw2ar(''.join(x[3] for x in segs))
            if letters(arabic) != letters(corpus):
                ex = {'id': wid, 'arabic': arabic, 'corpus': corpus, 'published': pub}
                if letters_small_yeh(arabic) == letters_small_yeh(corpus):
                    rep.warn('4 letters differ from QAC only by small-yeh spelling (ـۧ vs ۦ)', ex)
                elif letters(unicodedata.normalize('NFD', arabic)) == letters(unicodedata.normalize('NFD', corpus)):
                    rep.warn('4 letters equal QAC only after NFD (precomposed letter, e.g. آ U+0622 vs ا+ٓ)', ex)
                elif ' ' in arabic and letters(arabic.replace(' ', '')) == letters(corpus):
                    rep.warn('4 letters equal QAC only ignoring an internal space (Quran.com splits the word)', ex)
                else:
                    # A genuine spelling difference between the two sources (rule 3 already ties the
                    # stored word to Quran.com at this id); listed for review, not a build error.
                    rep.warn('4 letters != QAC segment forms (source spelling difference)', ex)

        if not isinstance(w.get('segments'), list) or not w['segments']:
            rep.fail('8 word has no segments', wid)
        if w.get('pos') not in POS_VALUES:
            rep.fail('8 pos not one of noun/verb/adjective/particle/pronoun', {'id': wid, 'pos': w.get('pos')})
        if not isinstance(w.get('ruleIds'), list):
            rep.fail('9 ruleIds not a list', wid)
        for rid in w.get('ruleIds') or []:
            if rid not in rule_ids:
                rep.fail('9 ruleId not in chapter rules', {'id': wid, 'ruleId': rid})

        # --- rule 8: unpublished words (grammar layer or source-only)
        authored = layer_words.get(wid)
        if pub and authored is not None:
            if published_chapter:
                rep.fail('8 grammar layer entry for a published word', wid)
            else:
                # words/2/a01-10.json … a17-20.json: the 2:1-20 pilot's own authoring records,
                # already part of the published lesson; the build does not re-apply them.
                stats['_totals']['pilotProvenanceEntries'] += 1
        if pub or segs is None:
            continue
        stats['_totals']['unpublishedWords'] += 1
        seg_list = w.get('segments') or []
        if authored is None:
            stats['_totals']['sourceOnlyWords'] += 1
            if w.get('dictionaryUrdu', None) != '':
                rep.fail('8 source-only dictionaryUrdu not empty (AI text)', {'id': wid, 'value': w.get('dictionaryUrdu')})
            for seg in seg_list:
                if seg.get('meaningUrdu', None) != '':
                    rep.fail('8 source-only segment meaningUrdu not empty (AI text)',
                             {'id': wid, 'segment': seg.get('arabic'), 'value': seg.get('meaningUrdu')})
        else:
            stats['_totals']['grammarLayerWords'] += 1
            if authored.get('arabic') != arabic:
                rep.fail('8 grammar layer entry Arabic != word Arabic',
                         {'id': wid, 'entry': authored.get('arabic'), 'arabic': arabic})
            note = w.get('dictionaryUrdu')
            if not isinstance(note, str) or not note.strip():
                rep.fail('8 grammar-layer dictionaryUrdu empty', wid)
            elif note != (authored.get('dictionaryUrdu') or '').strip():
                rep.fail('8 dictionaryUrdu != authored grammar entry', {'id': wid, 'built': note[:80]})
            glosses = [x.strip() if isinstance(x, str) else x for x in authored.get('segmentMeaningsUrdu') or []]
            built = [seg.get('meaningUrdu') for seg in seg_list]
            if any(not isinstance(x, str) or not x.strip() for x in built):
                rep.fail('8 grammar-layer segment meaningUrdu empty', {'id': wid, 'segments': built})
            elif built != glosses:
                rep.fail('8 segment glosses != authored grammar entry', {'id': wid, 'built': built, 'authored': glosses})
            texts = [note if isinstance(note, str) else ''] + [b for b in built if isinstance(b, str)]
            if any(LATIN.search(x) for x in texts):
                rep.fail('8 Latin text or URL in a grammar-layer word', wid)
            missing_rules = [r for r in authored.get('addRuleIds') or [] if r not in (w.get('ruleIds') or [])]
            if missing_rules:
                rep.fail('8 authored addRuleIds missing from ruleIds', {'id': wid, 'missing': missing_rules})
        # Segments written only as a small waw/yeh (ۥ ۦ) or not at all have no letters of their own.
        written = [x for x in segs if letters(bw2ar(x[3])).replace('ۥ', '').replace('ۦ', '')]
        if len(seg_list) != len(segs):
            if len(seg_list) == len(written):
                # A Corpus segment with no written form (elided pronoun) joins the previous card.
                rep.warn('8 elided Corpus segment merged into the previous segment', wid)
            else:
                rep.fail('8 segment count != QAC segment count', {'id': wid, 'built': len(seg_list), 'qac': len(segs)})
        if seg_list and ''.join(seg.get('arabic') or '' for seg in seg_list) != arabic:
            rep.warn('8 segment Arabic does not concatenate to word Arabic',
                     {'id': wid, 'arabic': arabic, 'segments': [seg.get('arabic') for seg in seg_list]})
        if any(not seg.get('arabic') for seg in seg_list):
            rep.warn('8 empty segment Arabic', {'id': wid, 'segments': [seg.get('arabic') for seg in seg_list]})
        if not seg_list or any(not seg.get('roleUrdu') for seg in seg_list):
            rep.warn('8 segment roleUrdu empty', wid)
        for field in ('posUrdu', 'morphologyUrdu'):
            if not w.get(field):
                rep.fail(f'8 source-only {field} empty', wid)

        # syntax from Corpus i'rab
        entry = (wbw or {}).get(wid)
        if entry is not None:  # per word, so a partly downloaded chapter is still checked where it can be
            exp_syn = irab_expected((entry or {}).get('irabArabic'))
            if not w.get('syntaxUrdu'):
                rep.fail('8 source-only syntaxUrdu empty', {'id': wid, 'expected': exp_syn})
            elif w['syntaxUrdu'] != exp_syn:
                rep.fail('8 syntaxUrdu != Corpus irabArabic joined',
                         {'id': wid, 'built': w['syntaxUrdu'], 'expected': exp_syn})
            if not exp_syn:
                rep.fail('8 source: Corpus irabArabic empty', wid)
            # POS through the shared reviewed helper (uses the QAC English description)
            exp_pos = derive_pos(qac_segments_for_derive(segs), (entry or {}).get('morphology'))
            if w.get('pos') != exp_pos:
                rep.fail('8 pos != qac.derive_pos', {'id': wid, 'built': w.get('pos'), 'expected': exp_pos})
        else:
            stats['_totals']['sourceOnlyWordsSkippedIrab'] += 1

        # independent coarse POS/root checks
        stem_tags = [x[2] for x in stems(segs)]
        if ('V' in stem_tags) != (w.get('pos') == 'verb'):
            rep.fail('8 verb/non-verb disagrees with QAC stem tags',
                     {'id': wid, 'pos': w.get('pos'), 'stemTags': stem_tags})
        exp_root = qac_root(segs)
        root = w.get('root')
        if root is not None and root != exp_root:
            rep.fail('8 root != QAC ROOT of stem', {'id': wid, 'built': root, 'expected': exp_root})
        if root is None and exp_root is not None and w.get('pos') not in ('particle', 'pronoun'):
            rep.fail('8 null root for a non-particle/pronoun word that has a QAC ROOT',
                     {'id': wid, 'pos': w.get('pos'), 'qacRoot': exp_root})
        main = next((x for x in stems(segs) if x[2] in ('V', 'N', 'PN', 'ADJ', 'IMPN')), (stems(segs) or [None])[0])
        lem = main[4].get('LEM') if main else None
        exp_lemma = bw2ar(lem) if isinstance(lem, str) else None
        lex_key = qac_lexeme_key(segs) if 'V' in stem_tags else None
        paradigm = lib_lexemes.get(lex_key) if lex_key else None
        if authored is not None and paradigm is not None:
            # A grammar-layer verb is listed under its paradigm's past form (as in published lessons).
            if w.get('lemma') != paradigm.get('past'):
                rep.fail('8 grammar-layer verb lemma != library paradigm past',
                         {'id': wid, 'built': w.get('lemma'), 'expected': paradigm.get('past'), 'key': lex_key})
        elif w.get('lemma') != exp_lemma:
            norm = (re.sub('[ًٌٍ]+$', '', exp_lemma) if exp_lemma else exp_lemma)
            if norm and len(norm) > 1 and norm[1] == 'ّ':
                norm = norm[0] + norm[2:]
            cls = ('8 lemma differs from QAC LEM only by tanween/shadda normalisation'
                   if w.get('lemma') == norm else '8 lemma != QAC LEM of main stem')
            rep.warn(cls, {'id': wid, 'built': w.get('lemma'), 'qac': exp_lemma})

        # verb forms
        if 'V' in stem_tags:
            vf = verb_forms.get(wid)
            exp_past = qac_verb_lemma(segs)
            if vf is None:
                rep.fail('8 verb word without verbForms entry', wid)
            elif paradigm is not None:
                stats['_totals']['libraryVerbParadigms'] += 1
                diff = [f for f in PARADIGM_FIELDS if vf.get(f) != paradigm.get(f)]
                if diff or set(vf) - set(PARADIGM_FIELDS):
                    rep.fail('8 verbForms != library paradigm',
                             {'id': wid, 'key': lex_key, 'fields': diff or sorted(set(vf) - set(PARADIGM_FIELDS))})
            else:
                if vf.get('past') != exp_past:
                    norm = exp_past
                    if norm and len(norm) > 1 and norm[1] == 'ّ':  # assimilation shadda in a QAC lemma id
                        norm = norm[0] + norm[2:]
                    if vf.get('past') == norm:
                        rep.warn('8 verbForms.past differs from QAC lemma only by assimilation shadda', wid)
                    else:
                        rep.fail('8 verbForms.past != QAC verb lemma',
                                 {'id': wid, 'built': vf.get('past'), 'expected': exp_past})
                for field in ('noteUrdu', 'present'):
                    if vf.get(field, '') != '':
                        rep.fail(f'8 source-only verbForms.{field} not empty (no source)',
                                 {'id': wid, 'value': vf.get(field)})

    for k in sorted(k for k in layer_words if k.split(':')[0] == str(s) and k not in word_by_id):
        rep.fail('8 grammar layer entry for an unknown word id', k)
    for k in sorted(k for k in layer_phrases if k.split(':')[0] == str(s)
                    and not (k.split(':')[1].isdigit() and 1 <= int(k.split(':')[1]) <= n_ayahs)):
        rep.fail('10 grammar layer phrase cards for an unknown ayah', k)

    # --- rule 9: referential integrity
    for r in sorted(set(used_roots) - set(roots)):
        rep.fail('9 root used by a word but missing from roots', {'surah': s, 'root': r})
    for r in sorted(set(roots) - set(used_roots)):
        rep.fail('9 roots entry not used by any word', {'surah': s, 'root': r})
    for k in sorted(set(verb_forms) - verb_word_ids):
        rep.fail('9 verbForms key is not a verb word', {'surah': s, 'id': k})
    for k in sorted(verb_word_ids - set(verb_forms)):
        rep.fail('9 verb word missing from verbForms', {'surah': s, 'id': k})
    # unpublished roots: the library card, or empty when no library has the root
    for r, entry in roots.items():
        if published_chapter or r in published_roots:
            continue
        lib = lib_roots.get(r)
        got = ((entry or {}).get('meaningUrdu'), (entry or {}).get('noteUrdu'))
        if lib is None:
            if got[0] or got[1]:
                rep.fail('8 source-only roots entry has meaningUrdu/noteUrdu (AI text)', {'surah': s, 'root': r})
        else:
            stats['_totals']['libraryRoots'] += 1
            if got != (lib.get('meaningUrdu'), lib.get('noteUrdu')):
                rep.fail('8 roots entry != library root card', {'surah': s, 'root': r})

    # --- rules 6, 7, 10: ayahs
    tids = ctx['translation_ids']
    phrases_total = 0
    for a in ayahs:
        n = a.get('number')
        extra = [k for k in a if k not in AYAH_KEYS]
        if extra:
            rep.fail('7 ayah has keys other than number/translations/phrases', {'ayah': f'{s}:{n}', 'keys': extra})
        phrases = a.get('phrases')
        if not isinstance(phrases, list):
            rep.fail('10 ayah phrases missing/not a list', f'{s}:{n}')
            phrases = []
        phrases_total += len(phrases)
        authored_cards = layer_phrases.get(f'{s}:{n}')
        if isinstance(n, int) and published(n):
            if authored_cards is not None:
                rep.fail('10 grammar layer phrase cards for a published ayah', f'{s}:{n}')
        elif isinstance(n, int) and authored_cards is None:
            if phrases:
                rep.fail('10 source-only ayah has phrases (AI grammar cards)', {'ayah': f'{s}:{n}', 'count': len(phrases)})
            if n in authored_word_ayahs:
                rep.warn('10 ayah has grammar-layer words but no phrase cards', f'{s}:{n}')
        elif isinstance(n, int):
            stats['_totals']['grammarLayerAyahs'] += 1
            stats['_totals']['grammarLayerPhrases'] += len(phrases)
            expected = [OrderedDict(id=f'{s}:{n}:phrase:{i}', wordIds=list(c.get('wordIds') or []),
                                    labelUrdu=(c.get('labelUrdu') or '').strip(),
                                    explanationUrdu=(c.get('explanationUrdu') or '').strip())
                        for i, c in enumerate(authored_cards, start=1)]
            if not phrases:
                rep.fail('10 grammar-layer ayah has no phrase cards', f'{s}:{n}')
            elif [dict(p) for p in phrases] != [dict(p) for p in expected]:
                rep.fail('10 phrase cards != authored grammar layer', f'{s}:{n}')
            for p in phrases:
                ids = p.get('wordIds') or []
                if not ids or any(not isinstance(x, str) or x.split(':')[:2] != [str(s), str(n)] for x in ids):
                    rep.fail('10 grammar-layer phrase card word ids not from its ayah', {'phrase': p.get('id'), 'wordIds': ids})
                if not (p.get('labelUrdu') or '').strip() or not (p.get('explanationUrdu') or '').strip():
                    rep.fail('10 grammar-layer phrase card label/explanation empty', p.get('id'))
                if LATIN.search((p.get('labelUrdu') or '') + (p.get('explanationUrdu') or '')):
                    rep.fail('10 Latin text or URL in a grammar-layer phrase card', p.get('id'))
        for p in phrases:
            for pw in p.get('wordIds') or []:
                if pw not in word_by_id:
                    rep.fail('9 phrase wordId not a word of the chapter', {'phrase': p.get('id'), 'wordId': pw})
        tr = a.get('translations')
        if not isinstance(tr, dict):
            rep.fail('6 ayah has no translations object', f'{s}:{n}')
            continue
        if list(tr) != tids:
            rep.fail('6 translation ids != scope ids in scope order', {'ayah': f'{s}:{n}', 'keys': list(tr)})
        for tid in tr:
            if tid not in ctx['translation_by_id']:
                rep.fail('6 translation id outside scope', {'ayah': f'{s}:{n}', 'id': tid})
        for tid in tids:
            text = tr.get(tid)
            key = f'{s}:{n}'
            if not isinstance(text, str) or not text.strip():
                rep.fail('6 translation missing or empty', {'ayah': key, 'id': tid})
                continue
            if '<' in text or 'foot_note' in text:
                rep.fail('6 markup/foot_note left in translation', {'ayah': key, 'id': tid, 'text': text[:120]})
            elif '>' in text:
                rep.fail("6 stray '>' left in translation", {'ayah': key, 'id': tid, 'text': text[-60:]})
            if re.search(r'&(#\d+|#x[0-9a-f]+|[a-z]+);', text, re.I):
                rep.warn('6 HTML entity in translation', {'ayah': key, 'id': tid})
            raw = ctx['translation_src'][tid].get(key)
            if raw is None:
                rep.fail('6 source: no source row for ayah', {'ayah': key, 'id': tid})
                continue
            expected, boundaries = ctx['translation_clean'][tid].get(key) or clean_translation(raw)
            verdict = compare_translation(text, expected, boundaries)
            stats['_totals'][f'translations.{verdict}'] += 1
            if verdict == 'marker-space':
                rep.note('6 differs from strict cleaning only in whitespace at a removed footnote marker',
                         {'ayah': key, 'id': tid})
            elif verdict == 'space':
                rep.fail('6 translation differs only in whitespace (not at a removed marker)',
                         {'ayah': key, 'id': tid, 'built': text[:160], 'expected': expected[:160]})
            elif verdict == 'content':
                rep.fail('6 translation text != cleaned source',
                         {'ayah': key, 'id': tid, 'built': text[:160], 'expected': expected[:160]})
            if text in ctx['excluded_texts'].get(key, ()):
                rep.fail('6 translation text equals an excluded resource (156/831…)', {'ayah': key, 'id': tid})

    found = []
    walk_keys(lesson, f'surah-{s}', found)
    for path in found:
        rep.fail('7 forbidden key (translationUrdu/themeUrdu/tafsirUrdu)', path)

    cs['phrases'] = phrases_total
    if s == pilot['surah']:
        cs['pilotPhrases'] = sum(len(a.get('phrases') or []) for a in ayahs
                                 if isinstance(a.get('number'), int) and a['number'] <= pilot['aiLayerThroughAyah'])
        # The committed 2:1-20 pilot has no phrases (phrases: [] at HEAD 733c320): report only.
    if published_chapter and phrases_total == 0:
        rep.fail('10 published chapter has no phrases (grammar cards lost)', s)


# ---------------------------------------------------------------- main
def run(argv=None, quiet=False):
    """Run the verification; returns (report dict, exit code). Used by main() and the tests."""
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('--surahs', help='comma-separated chapter numbers (default: all 114)')
    ap.add_argument('--lessons', default=os.path.join(REPO, 'packages', 'core', 'data', 'lessons'))
    ap.add_argument('--sources', default=os.path.join(FQ, 'sources'))
    ap.add_argument('--qac', default=os.path.join(PIPE, 'qac', 'qac04-lfs.txt'))
    ap.add_argument('--scope', default=os.path.join(FQ, 'scope.json'))
    ap.add_argument('--layer', default=FQ, help='directory holding the grammar layer words/ and phrases/')
    ap.add_argument('--libs', default=','.join(DEFAULT_LIBS),
                    help='comma-separated library directories (roots/, lexemes/), later wins')
    ap.add_argument('--write', action='store_true', help='write inventory/verification.json')
    ap.add_argument('--out', default=os.path.join(FQ, 'inventory', 'verification.json'))
    ap.add_argument('--allow-incomplete-sources', action='store_true')
    ap.add_argument('--examples', type=int, default=5)
    ap.add_argument('--json', action='store_true', help='print the JSON report to stdout')
    args = ap.parse_args(argv)
    t0 = time.time()

    rep = Report(args.examples)
    scope = load_json(args.scope)
    surahs = sorted({int(x) for x in args.surahs.split(',')}) if args.surahs else list(range(1, 115))
    full = surahs == list(range(1, 115))
    chapters = {c['id']: c for c in load_json(os.path.join(args.sources, 'qurancom', 'chapters.json'))['chapters']}
    if len(chapters) != 114 or sum(c['verses_count'] for c in chapters.values()) != 6236:
        rep.fail('source: chapters.json is not 114 chapters / 6236 ayahs')
    key = ('qac', args.qac, os.path.getmtime(args.qac))
    if key not in _CACHE:
        sub = Report(args.examples)
        _CACHE.clear()
        _CACHE[key] = load_qac(args.qac, sub) + (sub,)
    qac, qac_ayah, sub = _CACHE[key]
    global QAC_FORMS
    QAC_FORMS = {k: bw2ar(''.join(x[3] for x in segs)) for k, segs in qac.items()}
    for bucket, mine in ((sub.failures, rep.failures), (sub.warnings, rep.warnings)):
        for cls, entry in bucket.items():
            mine[cls] = json.loads(json.dumps(entry))
    qac_total = len(qac)
    keys = mushaf_keys(chapters)

    translation_ids = [t['id'] for t in scope['translations']]
    if len(set(translation_ids)) != len(translation_ids):
        rep.fail('source: duplicate translation ids in scope')
    src_mode, translation_src, translation_clean = OrderedDict(), {}, {}
    wanted_keys = {k for k in keys if int(k.split(':')[0]) in surahs}
    for t in scope['translations']:
        path = os.path.join(args.sources, 'qurancom', f'translation-{t["resourceId"]}.json')
        if not os.path.exists(path):
            rep.fail('source: translation file missing', t['resourceId'])
            translation_src[t['id']], translation_clean[t['id']] = {}, {}
            src_mode[t['resourceId']] = 'missing'
            continue
        texts, mode = load_translation(path, keys, rep, t['resourceId'])
        src_mode[t['resourceId']] = mode
        translation_src[t['id']] = texts
        translation_clean[t['id']] = {k: clean_translation(v) for k, v in texts.items() if k in wanted_keys}
        for k in wanted_keys:
            if not translation_clean[t['id']].get(k, ('',))[0]:
                rep.fail('6 source: cleaned source translation empty', {'ayah': k, 'id': t['id']})
    excluded_texts = defaultdict(set)
    excluded_seen = []
    for ex in scope.get('excludedTranslations', []):
        path = os.path.join(args.sources, 'qurancom', f'translation-{ex["resourceId"]}.json')
        if os.path.exists(path):
            texts, _ = load_translation(path, keys, rep, ex['resourceId'])
            excluded_seen.append(ex['resourceId'])
            for k, v in texts.items():
                if k in wanted_keys:
                    excluded_texts[k].add(clean_translation(v)[0])
                    excluded_texts[k].add(collapse(v))
    if not excluded_seen:
        rep.note('6 excluded-resource text comparison not possible (no translation-156/831 source files); '
                 'checked by key set only')

    verses, wbw, wbw_complete, incomplete = {}, {}, {}, OrderedDict()
    for s in surahs:
        p = os.path.join(args.sources, 'qurancom', f'verses-{s}-ur.json')
        if os.path.exists(p):
            vs = load_json(p)['verses']
            if [v['verse_number'] for v in vs] == list(range(1, chapters[s]['verses_count'] + 1)):
                verses[s] = vs
            else:
                incomplete.setdefault(s, []).append(f'Quran.com verses {len(vs)}/{chapters[s]["verses_count"]}')
        else:
            incomplete.setdefault(s, []).append('Quran.com verses file missing')
        p = os.path.join(args.sources, 'qac-wbw', f'wbw-{s}.json')
        chapter_words = [f'{c}:{v}:{w}' for (c, v, w) in qac if c == s]
        if os.path.exists(p):
            wbw[s] = load_json(p)
            missing = [k for k in chapter_words if k not in wbw[s]]
            wbw_complete[s] = not missing
            if missing:
                incomplete.setdefault(s, []).append(
                    f'QAC wbw {len(chapter_words) - len(missing)}/{len(chapter_words)} words (first missing {missing[0]})')
        else:
            wbw_complete[s] = False
            incomplete.setdefault(s, []).append('QAC wbw file missing')
    for s, why in incomplete.items():
        cls = 'source incomplete'
        if args.allow_incomplete_sources:
            rep.note(cls, f'{s}: ' + '; '.join(why))
        else:
            rep.fail(cls, f'{s}: ' + '; '.join(why))

    layer_words, layer_phrases = load_layer(args.layer, rep)
    lib_roots, lib_lexemes = load_libraries([d for d in args.libs.split(',') if d])
    ctx = dict(scope=scope, chapters=chapters, qac=qac, qac_ayah=qac_ayah, verses=verses, wbw=wbw,
               layer_words=layer_words, layer_phrases=layer_phrases, lib_roots=lib_roots, lib_lexemes=lib_lexemes,
               wbw_complete=wbw_complete, existing=set(scope['existingLessons']),
               translation_ids=translation_ids, translation_by_id={t['id']: t for t in scope['translations']},
               translation_src=translation_src, translation_clean=translation_clean,
               excluded_texts=excluded_texts)
    stats = OrderedDict(_totals=Counter())
    present = []
    for s in surahs:
        path = os.path.join(args.lessons, f'surah-{s}.json')
        if not os.path.exists(path):
            rep.fail('1 lesson file missing', s)
            continue
        try:
            lesson = load_json(path)
        except Exception as e:  # noqa: BLE001
            rep.fail('1 lesson file unreadable', f'{s}: {e}')
            continue
        present.append(s)
        try:
            verify_chapter(s, lesson, ctx, rep, stats)
        except Exception as e:  # noqa: BLE001  (malformed lesson: report, keep going)
            rep.fail('lesson structure error (verifier could not walk it)',
                     f'{s}: {type(e).__name__}: {e} @ {traceback.extract_tb(e.__traceback__)[-1].lineno}')

    totals = stats.pop('_totals')
    exp_words = sum(1 for (c, _v, _w) in qac if c in set(surahs))
    exp_ayahs = sum(chapters[s]['verses_count'] for s in surahs)
    if totals['ayahs'] != exp_ayahs:
        rep.fail('1 total ayahs != expected', f'{totals["ayahs"]} vs {exp_ayahs}')
    if totals['words'] != exp_words:
        rep.fail('1 total words != distinct QAC 0.4 words', f'{totals["words"]} vs {exp_words}')
    if full and (exp_ayahs != 6236):
        rep.fail('1 chapters.json total ayahs != 6236', exp_ayahs)

    ignored = {'source incomplete'} if args.allow_incomplete_sources else set()
    failed = any(k not in ignored for k in rep.failures)
    report = OrderedDict(
        generatedAt=datetime.datetime.now().isoformat(timespec='seconds'),
        verifier='content-pipeline/full-quran/scripts/verify.py (independent of build.py)',
        ok=not failed,
        options=OrderedDict(surahs='all' if full else surahs, lessons=os.path.relpath(args.lessons, REPO),
                            allowIncompleteSources=args.allow_incomplete_sources,
                            layer=os.path.relpath(args.layer, REPO),
                            libs=[os.path.relpath(d, REPO) for d in args.libs.split(',') if d]),
        grammarLayer=OrderedDict(authoredWordEntries=len(layer_words), authoredPhraseAyahs=len(layer_phrases),
                                 libraryRoots=len(lib_roots), libraryLexemes=len(lib_lexemes)),
        sources=OrderedDict(qacDistinctWords=qac_total, expectedWordsInScope=exp_words,
                            expectedAyahsInScope=exp_ayahs, translationKeyMode=src_mode,
                            excludedResourcesCompared=excluded_seen,
                            incompleteChapters=OrderedDict((str(k), v) for k, v in incomplete.items())),
        totals=OrderedDict(sorted(totals.items())),
        lessonsChecked=len(present),
        chapters=OrderedDict((str(k), v) for k, v in stats.items()),
        failures=rep.failures, warnings=rep.warnings, info=rep.info,
        seconds=round(time.time() - t0, 1),
    )

    # ------------------------------------------------ human summary
    out = open(os.devnull, 'w') if quiet else sys.stderr if args.json else sys.stdout
    print(f'verify.py: {len(present)}/{len(surahs)} lesson files checked, '
          f'{totals["words"]} words / {totals["ayahs"]} ayahs '
          f'(expected {exp_words} / {exp_ayahs}; QAC 0.4 distinct words {qac_total}) '
          f'in {report["seconds"]}s', file=out)
    print('translation sources: ' + ', '.join(f'{k}={v}' for k, v in src_mode.items()), file=out)
    print(f'grammar layer: {totals["grammarLayerWords"]} authored words, {totals["grammarLayerAyahs"]} ayahs with '
          f'{totals["grammarLayerPhrases"]} phrase cards, {totals["libraryRoots"]} library root cards, '
          f'{totals["libraryVerbParadigms"]} library verb paradigms; {totals["sourceOnlyWords"]} source-only words',
          file=out)
    if incomplete:
        print(f'source incomplete ({"allowed" if args.allow_incomplete_sources else "FAIL"}): '
              + ', '.join(f'{k} ({"; ".join(v)})' for k, v in list(incomplete.items())[:12])
              + (' …' if len(incomplete) > 12 else ''), file=out)
    pub_counts = {k: v.get('phrases') for k, v in stats.items() if v.get('published') != 'source-only'}
    if pub_counts:
        print('phrases (published/partial chapters): '
              + ' '.join(f'{k}:{v}' for k, v in pub_counts.items()), file=out)
    for title, bucket in (('FAILURES', rep.failures), ('WARNINGS', rep.warnings), ('INFO', rep.info)):
        if not bucket:
            continue
        print(f'\n{title}', file=out)
        for cls, entry in bucket.items():
            print(f'  [{entry["count"]:>6}] {cls}', file=out)
            for ex in entry['examples'][:3]:
                print('           e.g. ' + json.dumps(ex, ensure_ascii=False)[:220], file=out)
    print('\nRESULT: ' + ('OK' if not failed else 'FAIL'), file=out)

    if args.write:
        os.makedirs(os.path.dirname(args.out), exist_ok=True)
        with open(args.out, 'w', encoding='utf-8') as handle:
            json.dump(report, handle, ensure_ascii=False, indent=1)
            handle.write('\n')
        print(f'wrote {os.path.relpath(args.out, REPO)}', file=out)
    if args.json and not quiet:
        print(json.dumps(report, ensure_ascii=False, indent=1))
    if quiet:
        out.close()
    return report, 1 if failed else 0


_CACHE = {}  # QAC 0.4 parse, reused by in-process callers (tests)


def main(argv=None):
    return run(argv)[1]


if __name__ == '__main__':
    sys.exit(main())

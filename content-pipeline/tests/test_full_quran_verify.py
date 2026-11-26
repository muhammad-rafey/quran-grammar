"""full-quran/scripts/verify.py must catch each class of build error.

Builds small synthetic lessons from the downloaded sources with fixture code written here (not
build.py), checks that verify.py passes them, then mutates fields and checks each mutation is
reported. The sources are git-ignored downloads: the test skips when they are absent.
Lessons are written to a temporary directory only.

The grammar layer (authored words/phrases and the root/paradigm libraries) is a synthetic fixture
too, passed with --layer/--libs, so these tests do not depend on how many chapters a wave has
authored; the real layer is checked by running verify.py on the assembled lessons.
"""
import copy
import importlib.util
import json
import os
from pathlib import Path
import re
import sys
import tempfile
import unittest

PIPE = Path(__file__).resolve().parents[1]
FQ = PIPE / 'full-quran'
SRC = FQ / 'sources'
QAC = PIPE / 'qac' / 'qac04-lfs.txt'
sys.path.insert(0, str(PIPE / 'scripts'))
spec = importlib.util.spec_from_file_location('fq_verify', FQ / 'scripts' / 'verify.py')
V = importlib.util.module_from_spec(spec)
spec.loader.exec_module(V)
from qac import bw2ar, derive_pos  # noqa: E402

SCOPE = json.loads((FQ / 'scope.json').read_text(encoding='utf-8'))
PUBLISHED = set(SCOPE['existingLessons'])
# Real gaps in the downloaded sources (not fixture errors): Quran.com has words with an empty
# Urdu word meaning (e.g. 2:74:5); the verifier must keep reporting them, so the baseline allows
# exactly these classes.
SOURCE_GAP_CLASSES = set()
V_QAC = None  # QAC 0.4 parse, set in setUpClass
PAUSE_TAIL = re.compile(r'(?: [ۖ-ۜ۩]+)+$')


def fixture_translation(text):
    # Deliberately a different algorithm from verify.py: drop the marker with its surrounding
    # spaces, put one space back unless punctuation follows.
    def marker(m):
        after = m.string[m.end():m.end() + 1]
        return '' if m.start() == 0 or not after or after in '۔،؟!:؛,.)' else ' '
    text = re.sub(r'\s*<sup[^>]*>.*?</sup>\s*', marker, text, flags=re.S)
    return ' '.join(re.sub(r'<[^>]+>', '', text).split())


def load(path):
    return json.loads(Path(path).read_text(encoding='utf-8'))


def fixture_lexeme_key(segs):
    # Own derivation of the build's lexeme key 'LEM|form|ACT/PASS' from the QAC features.
    stem = next(x for x in segs if x[1] == 'STEM' and x[2] == 'V')
    form = next((k.strip('()') for k in stem[4] if isinstance(k, str) and k.startswith('(')), 'I')
    return f"{stem[4]['LEM']}|{form}|{'PASS' if 'PASS' in stem[4] else 'ACT'}"


EMPTY_LAYER = ({}, {}, {}, {})  # authored words, authored phrases, library roots, library lexemes


def build_fixture(surah, qac, translations, chapters, layer=EMPTY_LAYER):
    layer_words, layer_phrases, lib_roots, lib_lexemes = layer
    pub_roots, used_roots = set(), []
    verses = load(SRC / 'qurancom' / f'verses-{surah}-ur.json')['verses']
    wbw_path = SRC / 'qac-wbw' / f'wbw-{surah}.json'
    wbw = load(wbw_path) if wbw_path.exists() else {}
    pilot = SCOPE['partialPilot']
    words, ayahs, roots, verb_forms = [], [], {}, {}
    for v in verses:
        a = v['verse_number']
        pub = surah in PUBLISHED or (surah == pilot['surah'] and a <= pilot['aiLayerThroughAyah'])
        for w in [x for x in v['words'] if x['char_type_name'] == 'word']:
            wid = f'{surah}:{a}:{w["position"]}'
            segs = qac[(surah, a, w['position'])]
            info = wbw.get(wid, {})
            seg_dicts = V.qac_segments_for_derive(segs)
            pos = derive_pos(seg_dicts, info.get('morphology'))
            root = None if pos in ('particle', 'pronoun') else V.qac_root(segs)
            stems = [x for x in segs if x[1] == 'STEM']
            main = next((x for x in stems if x[2] in ('V', 'N', 'PN', 'ADJ', 'IMPN')), stems[0])
            lem = main[4].get('LEM')
            irab = [re.sub(r'\s*\n\s*', '؛ ', x.strip()) for x in info.get('irabArabic', []) if x.strip()]
            authored = None if pub else layer_words.get(wid)
            words.append({
                'id': wid, 'ayah': a, 'position': w['position'],
                'arabic': PAUSE_TAIL.sub('', re.sub(r'^۞ ', '', w['text_uthmani'])),
                'meaningUrdu': ' '.join(w['translation']['text'].split()),
                'pos': pos, 'posUrdu': 'x', 'root': root,
                'lemma': bw2ar(lem) if isinstance(lem, str) else None,
                'morphologyUrdu': 'x', 'syntaxUrdu': '؛ '.join(irab) or 'x',
                'dictionaryUrdu': 'published note' if pub else authored['dictionaryUrdu'] if authored else '',
                'segments': [{'arabic': bw2ar(x[3]), 'roleUrdu': 'x',
                              'meaningUrdu': 'published gloss' if pub else
                              authored['segmentMeaningsUrdu'][i] if authored else ''} for i, x in enumerate(segs)],
                'ruleIds': ['r1'] + (authored['addRuleIds'] if authored else []),
            })
            if root:
                used_roots.append(root)
                if pub:
                    pub_roots.add(root)
            if pos == 'verb':
                vstem = next(x for x in stems if x[2] == 'V')
                paradigm = None if pub else lib_lexemes.get(fixture_lexeme_key(segs))
                if paradigm:
                    verb_forms[wid] = {k: paradigm[k] for k in V.PARADIGM_FIELDS}
                    if authored:
                        words[-1]['lemma'] = paradigm['past']
                else:
                    verb_forms[wid] = {'baabUrdu': '', 'formUrdu': '', 'past': bw2ar(vstem[4]['LEM']),
                                       'present': 'published' if pub else '', 'pattern': '', 'noteUrdu': ''}
        ayahs.append({
            'number': a,
            'translations': {t['id']: fixture_translation(translations[t['id']][f'{surah}:{a}'])
                             for t in SCOPE['translations']},
            'phrases': ([{'id': f'{surah}:{a}:phrase1', 'wordIds': [f'{surah}:{a}:1'],
                          'labelUrdu': 'x', 'explanationUrdu': 'x'}] if surah in PUBLISHED else
                        [{'id': f'{surah}:{a}:phrase:{i}', 'wordIds': c['wordIds'], 'labelUrdu': c['labelUrdu'],
                          'explanationUrdu': c['explanationUrdu']}
                         for i, c in enumerate(layer_phrases.get(f'{surah}:{a}', []), start=1)]),
        })
    for root in used_roots:
        if root in pub_roots:
            roots[root] = {'meaningUrdu': 'published meaning', 'noteUrdu': ''}
        elif root in lib_roots:
            roots[root] = {'meaningUrdu': lib_roots[root]['meaningUrdu'], 'noteUrdu': lib_roots[root]['noteUrdu']}
        else:
            roots[root] = {'meaningUrdu': '', 'noteUrdu': ''}
    return {
        'schemaVersion': 1,
        'surah': {'number': surah, 'nameUrdu': 'x', 'nameArabic': chapters[surah]['name_arabic'],
                  'ayahCount': len(ayahs), 'wordCount': len(words)},
        'words': words, 'ayahs': ayahs,
        'rules': [{'id': 'r1', 'titleUrdu': 'x', 'explanationUrdu': 'x', 'exampleUrdu': 'x'},
                  {'id': 'r2', 'titleUrdu': 'x', 'explanationUrdu': 'x', 'exampleUrdu': 'x'}],
        'roots': roots, 'verbForms': verb_forms,
    }


def have_sources():
    return QAC.exists() and (SRC / 'qurancom' / 'chapters.json').exists() and all(
        (SRC / 'qurancom' / f'translation-{t["resourceId"]}.json').exists() for t in SCOPE['translations'])


@unittest.skipUnless(have_sources(), 'full-quran sources not downloaded (run full-quran/scripts/fetch.py)')
class VerifyCatchesBuildErrors(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp = tempfile.TemporaryDirectory()
        rep = V.Report(1)
        qac, _ = V.load_qac(str(QAC), rep)
        global V_QAC
        V_QAC = qac
        chapters = {c['id']: c for c in load(SRC / 'qurancom' / 'chapters.json')['chapters']}
        keys = V.mushaf_keys(chapters)
        translations = {t['id']: V.load_translation(
            str(SRC / 'qurancom' / f'translation-{t["resourceId"]}.json'), keys, rep, t['resourceId'])[0]
            for t in SCOPE['translations']}
        # Source-only chapter with complete QAC word-by-word data (smallest available).
        cls.source_only = None
        for s in sorted(range(1, 115), key=lambda n: chapters[n]['verses_count']):
            p = SRC / 'qac-wbw' / f'wbw-{s}.json'
            if s in PUBLISHED or s == 2 or not p.exists():
                continue
            if all(f'{c}:{v}:{w}' in load(p) for (c, v, w) in qac if c == s):
                cls.source_only = s
                break
        if cls.source_only is None:
            raise unittest.SkipTest('no source-only chapter with complete QAC wbw yet')
        cls.surahs = [1, 2, cls.source_only]
        plain = {s: build_fixture(s, qac, translations, chapters) for s in cls.surahs}
        cls.layer_dir, cls.libs_dir, layer = cls.write_layer(plain, qac)
        cls.layer = layer
        cls.base = {s: build_fixture(s, qac, translations, chapters, layer) for s in cls.surahs}

    @classmethod
    def write_layer(cls, plain, qac):
        """Synthetic grammar layer: ayahs 1-2 of the source-only chapter and 2:74 (it has a Quran.com
        meaning gap, 2:74:5) are authored; libraries cover one authored and one plain verb and two roots."""
        so = cls.source_only
        authored_ayahs = {so: [1, 2], 2: [74]}
        words, phrases = {}, {}
        for s, ayahs in authored_ayahs.items():
            for w in plain[s]['words']:
                if w['ayah'] in ayahs:
                    words[w['id']] = {'arabic': w['arabic'], 'segmentMeaningsUrdu': ['جز'] * len(w['segments']),
                                      'dictionaryUrdu': f'نوٹ {w["position"]}', 'addRuleIds': ['r2']}
            for a in ayahs:
                ids = [w['id'] for w in plain[s]['words'] if w['ayah'] == a]
                phrases[f'{s}:{a}'] = [{'wordIds': ids[:2], 'labelUrdu': 'جملہ', 'explanationUrdu': 'وضاحت'},
                                       {'wordIds': ids[-1:], 'labelUrdu': 'آخری لفظ', 'explanationUrdu': 'وضاحت'}]
        sw = plain[so]['words']
        verb_key = lambda w: fixture_lexeme_key(qac[tuple(int(x) for x in w['id'].split(':'))])  # noqa: E731
        authored_verb = next(w for w in sw if w['pos'] == 'verb' and w['id'] in words)
        plain_verb = next(w for w in sw if w['pos'] == 'verb' and w['id'] not in words
                          and verb_key(w) != verb_key(authored_verb))
        authored_root = next(w['root'] for w in sw if w['root'] and w['id'] in words)
        plain_root = next(w['root'] for w in sw if w['root'] and w['id'] not in words and w['root'] != authored_root)
        lib_lexemes = {verb_key(w): {'key': verb_key(w), 'baabUrdu': 'باب', 'formUrdu': 'ثلاثی', 'past': 'فَعَلَ',
                                     'present': 'يَفْعَلُ', 'pattern': 'فَعَلَ — يَفْعَلُ', 'noteUrdu': 'نوٹ'}
                       for w in (authored_verb, plain_verb)}
        lib_roots = {r: {'root': r, 'meaningUrdu': 'معنی', 'noteUrdu': 'نوٹ'} for r in (authored_root, plain_root)}
        layer_dir = Path(tempfile.mkdtemp(dir=cls.tmp.name))
        for s in authored_ayahs:
            for kind, data in (('words', {k: v for k, v in words.items() if k.startswith(f'{s}:')}),
                               ('phrases', {k: v for k, v in phrases.items() if k.startswith(f'{s}:')})):
                (layer_dir / kind / str(s)).mkdir(parents=True)
                (layer_dir / kind / str(s) / 'chunk.json').write_text(json.dumps(data, ensure_ascii=False), encoding='utf-8')
        libs_dir = Path(tempfile.mkdtemp(dir=cls.tmp.name))
        (libs_dir / 'roots').mkdir()
        (libs_dir / 'lexemes').mkdir()
        (libs_dir / 'roots' / 'r.json').write_text(json.dumps({'entries': list(lib_roots.values())}, ensure_ascii=False), encoding='utf-8')
        (libs_dir / 'lexemes' / 'l.json').write_text(json.dumps({'entries': list(lib_lexemes.values())}, ensure_ascii=False), encoding='utf-8')
        cls.fixture_ids = dict(authored_verb=authored_verb['id'], plain_verb=plain_verb['id'],
                               authored_root=authored_root, plain_root=plain_root)
        return str(layer_dir), str(libs_dir), (words, phrases, lib_roots, lib_lexemes)

    @classmethod
    def tearDownClass(cls):
        cls.tmp.cleanup()

    def run_verify(self, lessons, *extra, sources=None, layer=None):
        d = tempfile.mkdtemp(dir=self.tmp.name)
        for s, lesson in lessons.items():
            Path(d, f'surah-{s}.json').write_text(json.dumps(lesson, ensure_ascii=False), encoding='utf-8')
        argv = ['--lessons', d, '--surahs', ','.join(map(str, self.surahs)), '--allow-incomplete-sources',
                '--examples', '50', '--layer', layer or self.layer_dir, '--libs', self.libs_dir, *extra]
        if sources:
            argv += ['--sources', sources]
        return V.run(argv, quiet=True)

    def test_baseline_passes(self):
        report, code = self.run_verify(self.base)
        unexpected = {k: v for k, v in report['failures'].items() if k not in SOURCE_GAP_CLASSES}
        self.assertEqual(unexpected, {}, json.dumps(unexpected, ensure_ascii=False)[:2000])
        if not report['failures']:
            self.assertEqual(code, 0)
        # the fixture really exercises the grammar layer and the libraries
        self.assertEqual(report['totals']['grammarLayerWords'], len(self.layer[0]))
        self.assertEqual(report['totals']['grammarLayerAyahs'], len(self.layer[1]))
        self.assertGreater(report['totals']['libraryRoots'], 0)
        self.assertGreater(report['totals']['libraryVerbParadigms'], 0)
        self.assertGreater(report['totals']['sourceOnlyWords'], 0)

    def test_mutations_are_caught(self):
        L = copy.deepcopy(self.base)
        so = self.source_only
        authored_ids = self.layer[0]
        # source-only words of the source-only chapter (no grammar entry, no library paradigm)
        sw = [w for w in L[so]['words'] if w['id'] not in authored_ids and w['id'] != self.fixture_ids['plain_verb']]
        verb = next(w for w in sw if w['pos'] == 'verb')
        rooted = next(w for w in sw if w['root'] and w is not verb and w['root'] not in self.layer[2])
        expect = []  # (failure class, substring that must occur in one of its examples)

        L[1]['words'][0]['meaningUrdu'] = 'غلط'
        expect.append(('5 meaningUrdu != Quran.com word-by-word', '1:1:1'))
        tid = SCOPE['translations'][0]['id']
        L[1]['ayahs'][1]['translations'][tid] += ' <sup foot_note=1>1</sup>'
        expect += [('6 markup/foot_note left in translation', '1:2'), ('6 translation text != cleaned source', '1:2')]
        L[1]['ayahs'][2]['tafsirUrdu'] = 'تفسیر'
        expect += [('7 ayah has keys other than number/translations/phrases', '1:3'),
                   ('7 forbidden key (translationUrdu/themeUrdu/tafsirUrdu)', 'ayahs[2].tafsirUrdu')]
        del L[1]['ayahs'][3]['translations'][SCOPE['translations'][-1]['id']]
        expect += [('6 translation ids != scope ids in scope order', '1:4'), ('6 translation missing or empty', '1:4')]
        t = L[1]['ayahs'][4]['translations'][tid]
        L[1]['ayahs'][4]['translations'][tid] = t.replace(' ', '', 1)
        expect.append(('6 translation differs only in whitespace (not at a removed marker)', '1:5'))
        L[1]['ayahs'][5]['translations']['extra'] = 'x'
        expect.append(('6 translation id outside scope', '1:6'))
        for a in L[1]['ayahs']:
            a['phrases'] = []
        expect.append(('10 published chapter has no phrases (grammar cards lost)', '1'))

        sw[0]['dictionaryUrdu'] = 'AI note'
        expect.append(('8 source-only dictionaryUrdu not empty (AI text)', sw[0]['id']))
        sw[1]['segments'][0]['meaningUrdu'] = 'AI gloss'
        expect.append(('8 source-only segment meaningUrdu not empty (AI text)', sw[1]['id']))
        sw[2]['syntaxUrdu'] = 'غلط'
        expect.append(('8 syntaxUrdu != Corpus irabArabic joined', sw[2]['id']))
        sw[3]['arabic'] += ' ۚ'
        expect += [('3a Arabic != Quran.com (source-only)', sw[3]['id']),
                   ('3 pause sign token left in word Arabic', sw[3]['id'])]
        sw[4]['arabic'] = 'كتب'
        expect.append(('3a Arabic != Quran.com (source-only)', sw[4]['id']))
        sw[5]['ruleIds'] = ['no-such-rule']
        expect.append(('9 ruleId not in chapter rules', sw[5]['id']))
        rooted['root'] = 'ز ز ز'
        expect += [('8 root != QAC ROOT of stem', rooted['id']), ('9 root used by a word but missing from roots', 'ز ز ز')]
        del L[so]['verbForms'][verb['id']]
        expect += [('8 verb word without verbForms entry', verb['id']), ('9 verb word missing from verbForms', verb['id'])]
        other_verb = next(w for w in sw if w['pos'] == 'verb' and w is not verb
                          and fixture_lexeme_key(V_QAC[tuple(int(x) for x in w['id'].split(':'))]) not in self.layer[3])
        L[so]['verbForms'][other_verb['id']]['past'] = 'فَعَلَ'
        L[so]['verbForms'][other_verb['id']]['noteUrdu'] = 'AI'
        expect += [('8 verbForms.past != QAC verb lemma', other_verb['id']),
                   ('8 source-only verbForms.noteUrdu not empty (no source)', other_verb['id'])]
        L[so]['verbForms']['%d:1:999' % so] = {}
        expect.append(('9 verbForms key is not a verb word', '%d:1:999' % so))
        L[so]['roots']['ق ق ق'] = {'meaningUrdu': 'AI', 'noteUrdu': ''}
        expect += [('9 roots entry not used by any word', 'ق ق ق'),
                   ('8 source-only roots entry has meaningUrdu/noteUrdu (AI text)', 'ق ق ق')]
        L[so]['ayahs'][3]['phrases'] = [{'id': 'p', 'wordIds': ['%d:4:1' % so]}]
        expect.append(('10 source-only ayah has phrases (AI grammar cards)', '%d:4' % so))
        flip = next(w for w in sw[10:] if w['pos'] == 'noun')
        flip['pos'] = 'verb'
        expect += [('8 verb/non-verb disagrees with QAC stem tags', flip['id']), ('8 pos != qac.derive_pos', flip['id'])]
        dropped = L[so]['words'].pop(-1)
        expect += [('2 word ids != s:a:1..n from Quran.com/QAC', str(so)), ('1 wordCount != len(words)', str(so)),
                   ('1 total words != distinct QAC 0.4 words', '')]
        L[so]['ayahs'][-1]['themeUrdu'] = 'x'
        expect.append(('7 forbidden key (translationUrdu/themeUrdu/tafsirUrdu)', 'themeUrdu'))

        # Grammar layer: authored words carry exactly their authored notes and nothing else.
        aw = {w['id']: w for w in L[so]['words'] if w['id'] in authored_ids}
        a1 = [w for w in aw.values() if w['ayah'] == 1]
        a1[0]['dictionaryUrdu'] = ''
        expect.append(('8 grammar-layer dictionaryUrdu empty', a1[0]['id']))
        a1[1]['dictionaryUrdu'] = 'ایک اور نوٹ'
        expect.append(('8 dictionaryUrdu != authored grammar entry', a1[1]['id']))
        a1[2]['segments'][0]['meaningUrdu'] = ''
        expect.append(('8 grammar-layer segment meaningUrdu empty', a1[2]['id']))
        a1[3]['dictionaryUrdu'] += ' see https://example.com'
        expect.append(('8 Latin text or URL in a grammar-layer word', a1[3]['id']))
        a1[4]['ruleIds'] = ['r1']
        expect.append(('8 authored addRuleIds missing from ruleIds', a1[4]['id']))
        # an authored word's meaning is still Quran.com's: AI meaning text is caught by rule 5
        a1[5]['meaningUrdu'] = 'AI معنی'
        expect.append(('5 meaningUrdu != Quran.com word-by-word', a1[5]['id']))
        av = aw[self.fixture_ids['authored_verb']]
        av['lemma'] = 'غلط'
        expect.append(('8 grammar-layer verb lemma != library paradigm past', av['id']))
        L[so]['verbForms'][self.fixture_ids['plain_verb']]['present'] = 'يَغْلَطُ'
        expect.append(('8 verbForms != library paradigm', self.fixture_ids['plain_verb']))
        L[so]['roots'][self.fixture_ids['plain_root']]['noteUrdu'] = 'AI نوٹ'
        expect.append(('8 roots entry != library root card', self.fixture_ids['plain_root']))
        # phrase cards: authored ayahs keep exactly the authored cards
        L[so]['ayahs'][0]['phrases'][0]['explanationUrdu'] = 'AI'
        expect += [('10 phrase cards != authored grammar layer', '%d:1' % so),
                   ('10 Latin text or URL in a grammar-layer phrase card', '%d:1:phrase:1' % so)]
        L[so]['ayahs'][1]['phrases'] = []
        expect.append(('10 grammar-layer ayah has no phrase cards', '%d:2' % so))

        # Surah 2: pilot 2:1-20 keeps its layer; 2:74 is authored; every other ayah is source-only.
        s2 = {w['id']: w for w in L[2]['words']}
        s2['2:21:1']['dictionaryUrdu'] = 'AI note'
        expect.append(('8 source-only dictionaryUrdu not empty (AI text)', '2:21:1'))
        # Quran.com has no meaning for 2:74:5: even an authored word may not get an AI meaning.
        self.assertEqual(s2['2:74:5']['meaningUrdu'], '')
        self.assertIn('2:74:5', authored_ids)
        s2['2:74:5']['meaningUrdu'] = 'AI معنی'
        expect.append(('5 meaning filled without a Quran.com source', '2:74:5'))
        s2['2:75:1']['segments'][0]['meaningUrdu'] = 'AI gloss'
        expect.append(('8 source-only segment meaningUrdu not empty (AI text)', '2:75:1'))
        L[2]['ayahs'][74]['phrases'] = [{'id': '2:75:phrase:1', 'wordIds': ['2:75:1'], 'labelUrdu': 'x', 'explanationUrdu': 'x'}]
        expect.append(('10 source-only ayah has phrases (AI grammar cards)', '2:75'))
        L[2]['ayahs'] = L[2]['ayahs'][:-1]
        L[2]['surah']['ayahCount'] = 285
        expect += [('1 ayahs not numbered 1..N', '2:'), ('1 ayahCount != chapters.json verses_count', '2: 285'),
                   ('1 total ayahs != expected', '')]

        report, code = self.run_verify(L)
        self.assertEqual(code, 1)
        for cls, needle in expect:
            with self.subTest(cls=cls, needle=needle):
                self.assertIn(cls, report['failures'])
                blob = json.dumps(report['failures'][cls]['examples'], ensure_ascii=False)
                self.assertIn(needle, blob)
        # The pilot's 2:1-20 AI text and published Surah 1 notes are not flagged.
        blob = json.dumps(report['failures'].get('8 source-only dictionaryUrdu not empty (AI text)'), ensure_ascii=False)
        self.assertNotIn('"2:1:', blob)
        self.assertNotIn('"1:1:', blob)
        self.assertNotIn(dropped['id'], json.dumps(report['failures'].get('5 meaningUrdu != Quran.com word-by-word')))
        # Authored words are never reported as source-only AI text, and vice versa.
        blob = json.dumps(report['failures'].get('8 source-only dictionaryUrdu not empty (AI text)'), ensure_ascii=False)
        self.assertFalse(any(f'"{k}"' in blob for k in authored_ids))

    def test_layer_errors_are_caught(self):
        so = self.source_only
        words, phrases = copy.deepcopy(self.layer[0]), copy.deepcopy(self.layer[1])
        words['1:1:1'] = {'arabic': 'x', 'segmentMeaningsUrdu': ['x'], 'dictionaryUrdu': 'x', 'addRuleIds': []}
        words['%d:1:999' % so] = dict(words['1:1:1'])
        first = next(k for k in words if k.startswith(f'{so}:1:'))
        words[first] = dict(words[first], arabic='غلط')
        phrases['1:1'] = [{'wordIds': ['1:1:1'], 'labelUrdu': 'x', 'explanationUrdu': 'x'}]
        phrases['%d:999' % so] = phrases['1:1']
        d = Path(tempfile.mkdtemp(dir=self.tmp.name))
        for kind, data in (('words', words), ('phrases', phrases)):
            (d / kind / 'all').mkdir(parents=True)
            (d / kind / 'all' / 'x.json').write_text(json.dumps(data, ensure_ascii=False), encoding='utf-8')
        report, code = self.run_verify(self.base, layer=str(d))
        self.assertEqual(code, 1)
        for cls, needle in (('8 grammar layer entry for a published word', '1:1:1'),
                            ('8 grammar layer entry for an unknown word id', '%d:1:999' % so),
                            ('8 grammar layer entry Arabic != word Arabic', first),
                            ('10 grammar layer phrase cards for a published ayah', '1:1'),
                            ('10 grammar layer phrase cards for an unknown ayah', '%d:999' % so)):
            with self.subTest(cls=cls):
                self.assertIn(cls, report['failures'])
                self.assertIn(needle, json.dumps(report['failures'][cls]['examples'], ensure_ascii=False))
        # Without the layer every authored note is AI text in a source-only word.
        empty = Path(tempfile.mkdtemp(dir=self.tmp.name))
        report, code = self.run_verify(self.base, layer=str(empty))
        self.assertEqual(code, 1)
        self.assertIn('8 source-only dictionaryUrdu not empty (AI text)', report['failures'])
        self.assertIn('10 source-only ayah has phrases (AI grammar cards)', report['failures'])

    def test_old_format_is_failure_not_crash(self):
        old = copy.deepcopy(self.base)
        for a in old[1]['ayahs']:
            a['translationUrdu'] = a.pop('translations')[SCOPE['translations'][0]['id']]
            a['themeUrdu'] = a['tafsirUrdu'] = 'x'
        old[1]['words'][0]['segments'] = None
        report, code = self.run_verify(old)
        self.assertEqual(code, 1)
        self.assertIn('6 ayah has no translations object', report['failures'])
        self.assertNotIn('lesson structure error (verifier could not walk it)', report['failures'])

    def test_translation_fallback_and_excluded_resource(self):
        src = Path(tempfile.mkdtemp(dir=self.tmp.name))
        (src / 'qurancom').mkdir()
        for p in (SRC / 'qurancom').iterdir():
            os.symlink(p, src / 'qurancom' / p.name)
        os.symlink(SRC / 'qac-wbw', src / 'qac-wbw')
        first = SCOPE['translations'][0]['resourceId']
        data = load(SRC / 'qurancom' / f'translation-{first}.json')
        for r in data['translations']:
            r.pop('verse_key', None)
        os.unlink(src / 'qurancom' / f'translation-{first}.json')
        (src / 'qurancom' / f'translation-{first}.json').write_text(json.dumps(data, ensure_ascii=False), encoding='utf-8')
        excluded = SCOPE['excludedTranslations'][0]['resourceId']
        rows = [{'verse_key': r['verse_key'], 'text': 'excluded ' + r['verse_key']}
                for r in load(SRC / 'qurancom' / f'translation-{first}.json')['translations']]
        p = src / 'qurancom' / f'translation-{excluded}.json'
        if p.exists() or p.is_symlink():
            p.unlink()
        p.write_text(json.dumps({'translations': rows}), encoding='utf-8')

        report, code = self.run_verify(self.base, sources=str(src))
        self.assertEqual(report['sources']['translationKeyMode'][first], 'mushaf-order fallback')
        unexpected = {k: v for k, v in report['failures'].items() if k not in SOURCE_GAP_CLASSES}
        self.assertEqual(unexpected, {}, json.dumps(unexpected, ensure_ascii=False)[:2000])

        L = copy.deepcopy(self.base)
        L[1]['ayahs'][0]['translations'][SCOPE['translations'][1]['id']] = 'excluded 1:1'
        report, code = self.run_verify(L, sources=str(src))
        self.assertIn('6 translation text equals an excluded resource (156/831…)', report['failures'])
        self.assertEqual(code, 1)


if __name__ == '__main__':
    unittest.main()

"""full-quran/scripts/verify.py must catch each class of build error.

Builds small synthetic lessons from the downloaded sources with fixture code written here (not
build.py), checks that verify.py passes them, then mutates fields and checks each mutation is
reported. The sources are git-ignored downloads: the test skips when they are absent.
Lessons are written to a temporary directory only.
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


def build_fixture(surah, qac, translations, chapters):
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
            words.append({
                'id': wid, 'ayah': a, 'position': w['position'],
                'arabic': PAUSE_TAIL.sub('', re.sub(r'^۞ ', '', w['text_uthmani'])),
                'meaningUrdu': ' '.join(w['translation']['text'].split()),
                'pos': pos, 'posUrdu': 'x', 'root': root,
                'lemma': bw2ar(lem) if isinstance(lem, str) else None,
                'morphologyUrdu': 'x', 'syntaxUrdu': '؛ '.join(irab) or 'x',
                'dictionaryUrdu': 'published note' if pub else '',
                'segments': [{'arabic': bw2ar(x[3]), 'roleUrdu': 'x',
                              'meaningUrdu': 'published gloss' if pub else ''} for x in segs],
                'ruleIds': ['r1'],
            })
            if root:
                roots.setdefault(root, {'meaningUrdu': '', 'noteUrdu': ''})
                if pub:
                    roots[root] = {'meaningUrdu': 'published meaning', 'noteUrdu': ''}
            if pos == 'verb':
                vstem = next(x for x in stems if x[2] == 'V')
                verb_forms[wid] = {'baabUrdu': '', 'formUrdu': '', 'past': bw2ar(vstem[4]['LEM']),
                                   'present': 'published' if pub else '', 'pattern': '', 'noteUrdu': ''}
        ayahs.append({
            'number': a,
            'translations': {t['id']: fixture_translation(translations[t['id']][f'{surah}:{a}'])
                             for t in SCOPE['translations']},
            'phrases': ([{'id': f'{surah}:{a}:phrase1', 'wordIds': [f'{surah}:{a}:1'],
                          'labelUrdu': 'x', 'explanationUrdu': 'x'}] if surah in PUBLISHED else []),
        })
    return {
        'schemaVersion': 1,
        'surah': {'number': surah, 'nameUrdu': 'x', 'nameArabic': chapters[surah]['name_arabic'],
                  'ayahCount': len(ayahs), 'wordCount': len(words)},
        'words': words, 'ayahs': ayahs,
        'rules': [{'id': 'r1', 'titleUrdu': 'x', 'explanationUrdu': 'x', 'exampleUrdu': 'x'}],
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
        cls.base = {s: build_fixture(s, qac, translations, chapters) for s in cls.surahs}

    @classmethod
    def tearDownClass(cls):
        cls.tmp.cleanup()

    def run_verify(self, lessons, *extra, sources=None):
        d = tempfile.mkdtemp(dir=self.tmp.name)
        for s, lesson in lessons.items():
            Path(d, f'surah-{s}.json').write_text(json.dumps(lesson, ensure_ascii=False), encoding='utf-8')
        argv = ['--lessons', d, '--surahs', ','.join(map(str, self.surahs)), '--allow-incomplete-sources',
                '--examples', '50', *extra]
        if sources:
            argv += ['--sources', sources]
        return V.run(argv, quiet=True)

    def test_baseline_passes(self):
        report, code = self.run_verify(self.base)
        unexpected = {k: v for k, v in report['failures'].items() if k not in SOURCE_GAP_CLASSES}
        self.assertEqual(unexpected, {}, json.dumps(unexpected, ensure_ascii=False)[:2000])
        if not report['failures']:
            self.assertEqual(code, 0)

    def test_mutations_are_caught(self):
        L = copy.deepcopy(self.base)
        so = self.source_only
        sw = L[so]['words']
        verb = next(w for w in sw if w['pos'] == 'verb')
        rooted = next(w for w in sw if w['root'] and w is not verb)
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
        other_verb = next(w for w in sw if w['pos'] == 'verb' and w is not verb)
        L[so]['verbForms'][other_verb['id']]['past'] = 'فَعَلَ'
        L[so]['verbForms'][other_verb['id']]['noteUrdu'] = 'AI'
        expect += [('8 verbForms.past != QAC verb lemma', other_verb['id']),
                   ('8 source-only verbForms.noteUrdu not empty (no source)', other_verb['id'])]
        L[so]['verbForms']['%d:1:999' % so] = {}
        expect.append(('9 verbForms key is not a verb word', '%d:1:999' % so))
        L[so]['roots']['ق ق ق'] = {'meaningUrdu': 'AI', 'noteUrdu': ''}
        expect += [('9 roots entry not used by any word', 'ق ق ق'),
                   ('8 source-only roots entry has meaningUrdu/noteUrdu (AI text)', 'ق ق ق')]
        L[so]['ayahs'][0]['phrases'] = [{'id': 'p', 'wordIds': ['%d:1:1' % so]}]
        expect.append(('10 source-only ayah has phrases (AI grammar cards)', '%d:1' % so))
        flip = next(w for w in sw[10:] if w['pos'] == 'noun')
        flip['pos'] = 'verb'
        expect += [('8 verb/non-verb disagrees with QAC stem tags', flip['id']), ('8 pos != qac.derive_pos', flip['id'])]
        dropped = sw.pop(-1)
        expect += [('2 word ids != s:a:1..n from Quran.com/QAC', str(so)), ('1 wordCount != len(words)', str(so)),
                   ('1 total words != distinct QAC 0.4 words', '')]
        L[so]['ayahs'][-1]['themeUrdu'] = 'x'
        expect.append(('7 forbidden key (translationUrdu/themeUrdu/tafsirUrdu)', 'themeUrdu'))

        # Surah 2 pilot boundary: AI text allowed in 2:1-20, not in 2:21+.
        s2 = {w['id']: w for w in L[2]['words']}
        s2['2:21:1']['dictionaryUrdu'] = 'AI note'
        expect.append(('8 source-only dictionaryUrdu not empty (AI text)', '2:21:1'))
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

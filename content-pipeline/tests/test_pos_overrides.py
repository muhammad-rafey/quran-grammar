"""Effective types must agree across transport, validation and held artifacts.

All source text below is deliberately synthetic; no real Quran analysis is
changed, approved or fetched by these offline tests.
"""
import copy
import json
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]


def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False) + '\n', encoding='utf-8')


class EffectivePosTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.work = Path(self.temp.name).resolve() / 'pipeline'
        self.repo = Path(self.temp.name) / 'repo'
        self.repo.mkdir()
        for directory in ('scripts', 'workflows', 'guide'):
            shutil.copytree(ROOT / directory, self.work / directory)
        rules = {'rules': [{'id': 'synthetic', 'titleUrdu': 'فرضی قاعدہ',
                           'explanationUrdu': 'یہ صرف خودکار آزمائش کے لیے فرضی قاعدہ ہے۔',
                           'appliesWhenEnglish': 'Synthetic fixture only.'}]}
        write_json(self.work / 'libs/rules.json', rules)
        write_json(self.work / 'libs/lexemes/lex-fixture.json', {'entries': [{
            'key': 'synthetic', 'past': 'فَعَلَ', 'present': 'يَفْعَلُ',
            'baabUrdu': 'فرضی', 'formUrdu': 'فرضی', 'pattern': 'فَعَلَ',
        }]})
        write_json(self.work / 'libs/roots/root-fixture.json', {'entries': []})
        plan, words, ayahs, overrides = [], {}, {}, {}
        for surah in (18, 23, 32, 36, 55):
            count, total = (30, 372) if surah == 32 else (1, 1)
            chunk = f'{surah}-c01'
            draft_words, draft_ayahs, ids = [], [], []
            for ayah in range(1, count + 1):
                ayah_ids = []
                per_ayah = total // count + (ayah <= total % count)
                for position in range(1, per_ayah + 1):
                    wid = f'{surah}:{ayah}:{position}'
                    ids.append(wid); ayah_ids.append(wid)
                    # Two particle choices and a retained nominal relative share
                    # a raw lemma: grouping must use effective, not raw, types.
                    corrected = ayah == 1 and position in (1, 2, 3)
                    relative = ayah == 1 and position == 4
                    pos = 'verb' if corrected and position == 3 else 'pronoun' if corrected or relative else 'noun'
                    arabic = 'مَا' if corrected else 'مَنْ' if relative else 'مِثَالٌ'
                    word = {'id': wid, 'surah': surah, 'ayah': ayah, 'position': position,
                            'arabic': arabic, 'pos': pos, 'root': None, 'lemmaQac': arabic,
                            'qacMorphologyEnglish': 'RAW reference retained',
                            'qacIrabArabic': ['نص تجريبي'],
                            'qacSegments': [{'kind': 'STEM', 'tag': 'REL' if pos == 'pronoun' else 'V' if pos == 'verb' else 'N',
                                             'lemmaBuckwalter': 'maA' if corrected or relative else 'synthetic'}]}
                    if pos == 'verb':
                        word.update(lexemeKey='synthetic', verb={'form': 'I', 'aspect': 'PERF', 'passive': False, 'png': '3MS'})
                    words[wid] = word
                    if corrected:
                        overrides[wid] = {'pos': 'particle', 'noteEnglish': 'Synthetic effective-type choice for tests only.'}
                    draft_words.append({'id': wid, 'meaningUrdu': 'فرضی لفظ',
                        'posUrdu': 'حرف' if corrected else 'اسمِ موصول' if relative else 'اسم', 'lemma': arabic.rstrip('ٌ'),
                        'morphologyUrdu': 'یہ صرف خودکار آزمائش کا فرضی صرفی بیان ہے۔',
                        'syntaxUrdu': 'یہ صرف خودکار آزمائش کا فرضی نحوی بیان ہے۔',
                        'dictionaryUrdu': 'یہ صرف خودکار آزمائش کا فرضی لغوی بیان ہے۔',
                        'segments': [{'arabic': arabic, 'roleUrdu': 'فرضی لفظ', 'meaningUrdu': 'فرضی'}],
                        'ruleIds': ['synthetic']})
                ayahs[f'{surah}:{ayah}'] = {'surah': surah, 'ayah': ayah, 'wordIds': ayah_ids,
                                           'qacGrammarNotesArabic': ['نص تجريبي']}
                draft_ayahs.append({'number': ayah, 'translationUrdu': 'یہ صرف فرضی آزمائشی متن ہے۔',
                    'themeUrdu': 'فرضی آزمائش', 'tafsirUrdu': 'یہ صرف خودکار آزمائش کا فرضی بیان ہے اور کسی حقیقی آیت کی تفسیر نہیں ہے۔',
                    'phrases': [{'wordIds': ayah_ids, 'labelUrdu': 'فرضی ترکیب',
                                 'explanationUrdu': 'یہ صرف خودکار آزمائش کی فرضی ترکیب ہے۔'}]})
            plan.append({'chunk': chunk, 'surah': surah, 'ayahs': list(range(1, count + 1)), 'wordIds': ids})
            write_json(self.work / f'chunks/{surah}/{chunk}.json', {'chunk': chunk, 'words': draft_words, 'ayahs': draft_ayahs, 'auditNotes': []})
            write_json(self.work / f'inventory/inventory-{surah}.json', {'excludedPauseSigns': []})
        for name, value in [('plan', plan), ('words', words), ('ayahs', ayahs), ('overrides', overrides),
                            ('lexemes', {}), ('lexeme-batches', {}), ('root-batches', {})]:
            write_json(self.work / f'meta/{name}.json', value)
        self.words = words
        self.overrides = overrides
        self.raw_bytes = (self.work / 'meta/words.json').read_bytes()

    def python(self, name, *args):
        return subprocess.run(['python3', '-I', str(self.work / 'scripts' / name), str(self.work), *map(str, args)], capture_output=True, text=True)

    def runner(self):
        return subprocess.run(['node', str(self.work / 'scripts/run_chunks.mjs'), '--work', str(self.work),
                               '--chunks', '32-c01', '--dry-run'], capture_output=True, text=True)

    def assert_ok(self, result):
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_packets_validator_held_assembly_audit_and_raw_provenance_agree(self):
        self.assert_ok(self.python('build_packets.py'))
        packet = json.loads((self.work / 'packets/32/32-c01.json').read_text())
        self.assertEqual([w['pos'] for w in packet['words'][:4]], ['particle', 'particle', 'particle', 'pronoun'])
        for word in packet['words']:
            raw = self.words[word['id']]
            self.assertEqual((word['id'], word['arabic'], word['root']), (raw['id'], raw['arabic'], raw['root']))
            self.assertEqual(word['qacMorphologyEnglish'], raw['qacMorphologyEnglish'])
            self.assertEqual(word['qacIrabArabic'], raw['qacIrabArabic'])
            self.assertEqual(word['qacSegments'], [{k: v for k, v in s.items() if k != 'lemmaBuckwalter'} for s in raw['qacSegments']])
        result = self.python('validate_chunk.py', '32-c01'); self.assert_ok(result)
        self.assertEqual(json.loads(result.stdout)['warnings'], [])
        self.assert_ok(self.runner())
        self.assert_ok(self.python('assemble.py', self.repo, '--draft', '--surah', '32'))
        held = json.loads((self.work / 'drafts/surah-32.json').read_text())
        self.assertEqual(held['reviewStatus'], 'scholarly-review-pending')
        study = held['study']
        self.assertEqual([w['pos'] for w in study['words'][:4]], ['particle', 'particle', 'particle', 'pronoun'])
        self.assertEqual(study['verbForms'], {})
        self.assertEqual([(w['id'], w['arabic'], w['root']) for w in study['words']],
                         [(w['id'], w['arabic'], w['root']) for w in packet['words']])
        report = json.loads((self.work / 'reports/assembly-report.json').read_text())
        self.assertEqual(report['surahs']['32']['lemmaVariants'], {})
        self.assert_ok(self.python('gen_audit.py', self.repo))
        audit = (self.repo / 'docs/source-audits/surah-32.md').read_text()
        self.assertIn('| Particles | 3 |', audit)
        self.assertIn('| Pronouns | 1 |', audit)
        self.assertIn('| Nouns | 368 |', audit)
        self.assertIn('| Verbs | 0 |', audit)
        self.assertEqual((self.work / 'meta/words.json').read_bytes(), self.raw_bytes)
        # A source noun changed to a particle must also leave the no-root noun list.
        self.words['18:1:1']['pos'] = 'noun'
        write_json(self.work / 'meta/words.json', self.words)
        self.assert_ok(self.python('gen_audit.py', self.repo))
        audit = (self.repo / 'docs/source-audits/surah-18.md').read_text()
        self.assertIn('| Particles | 1 |', audit)
        self.assertNotIn('Nouns without a Corpus root', audit)

    def test_runner_rejects_forged_packet_pos_with_and_without_override(self):
        self.assert_ok(self.python('build_packets.py'))
        path = self.work / 'packets/32/32-c01.json'
        original = json.loads(path.read_text())
        for index in (0, 3):
            with self.subTest(has_override=index == 0):
                packet = copy.deepcopy(original)
                packet['words'][index]['pos'] = 'noun'
                write_json(path, packet)
                result = self.runner()
                self.assertNotEqual(result.returncode, 0)
                self.assertIn('Stale occurrence correction', result.stderr)
                self.assertFalse((self.work / 'runs').exists())
        self.assertEqual((self.work / 'meta/words.json').read_bytes(), self.raw_bytes)

    def test_invalid_type_and_unsupported_verb_promotion_fail_every_consumer(self):
        self.assert_ok(self.python('build_packets.py'))
        for pos in ('invented-type', 'verb'):
            with self.subTest(pos=pos):
                overrides = copy.deepcopy(self.overrides)
                overrides['32:1:1']['pos'] = pos
                write_json(self.work / 'meta/overrides.json', overrides)
                for command in [lambda: self.python('build_packets.py'),
                                lambda: self.python('validate_chunk.py', '32-c01'),
                                lambda: self.python('assemble.py', self.repo, '--draft', '--surah', '32'),
                                lambda: self.python('gen_audit.py', self.repo), self.runner]:
                    result = command()
                    self.assertNotEqual(result.returncode, 0, result.stdout + result.stderr)
                self.assertFalse((self.work / 'drafts').exists())
                self.assertFalse((self.repo / 'docs').exists())
                self.assertEqual((self.work / 'meta/words.json').read_bytes(), self.raw_bytes)


if __name__ == '__main__':
    unittest.main()

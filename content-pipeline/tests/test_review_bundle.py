"""Offline reviewer exports use synthetic lessons, never repository Quran content."""
import hashlib
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest


SCRIPTS = Path(__file__).resolve().parents[1] / 'scripts'
spec = importlib.util.spec_from_file_location('bundle_release_gate', SCRIPTS / 'release_gate.py')
gate = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gate)


def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False) + '\n', encoding='utf-8')


class ReviewBundleTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.repo = Path(self.temp.name).resolve()
        self.work = self.repo / 'content-pipeline'
        self.output = self.repo / 'build/review/quran-grammar'
        self.attack = '\"><script>alert(1)</script>&'
        # A full-sized but explicitly synthetic chapter avoids any source-cache,
        # formatter or network dependency while exercising the actual CLI.
        for relative in gate.SHARED_INPUTS:
            write_json(self.work / relative, {})
        words, ayahs, source = [], [], {}
        for n in range(1, 31):
            ids = []
            for p in range(1, 13 + (n <= 12)):
                wid = f'32:{n}:{p}'
                ids.append(wid)
                words.append({
                    'id': wid, 'ayah': n, 'position': p, 'arabic': 'حَقَ\u0651',
                    'meaningUrdu': self.attack, 'posUrdu': 'فرضی اسم', 'lemma': 'حَقَ\u0651',
                    'morphologyUrdu': 'صرف فرضی آزمائش', 'syntaxUrdu': 'صرف فرضی آزمائش',
                    'dictionaryUrdu': self.attack, 'root': None, 'ruleIds': ['synthetic'],
                    'segments': [{'arabic': 'حَقَ\u0651', 'roleUrdu': 'فرضی جز', 'meaningUrdu': self.attack}],
                })
            ayahs.append({'number': n, 'translationUrdu': self.attack, 'themeUrdu': 'فرضی آزمائش',
                          'tafsirUrdu': 'یہ حقیقی آیت کی تفسیر نہیں، صرف خودکار آزمائش ہے۔',
                          'phrases': [{'wordIds': ids, 'labelUrdu': 'فرضی ترکیب', 'explanationUrdu': self.attack}]})
            source[f'32:{n}'] = {'textUthmani': ' '.join('حَقَ\u0651' for _ in ids)}
        self.assertEqual(len(words), 372)
        chunk = self.work / 'chunks/32/32-c01.json'
        write_json(chunk, {'synthetic': True, 'notice': 'Not actual Quran content'})
        write_json(self.work / 'meta/plan.json', [{'chunk': '32-c01', 'surah': 32,
                   'ayahs': list(range(1, 31)), 'wordIds': [w['id'] for w in words]}])
        write_json(self.work / 'meta/ayahs.json', source)
        write_json(self.work / 'inventory/inventory-32.json', {'synthetic': True})
        for kind in ('roots', 'lexemes'):
            write_json(self.work / f'libs/{kind}/batch.json', {'entries': []})
        write_json(self.work / 'runs/codex/32-c01.json', {
            'status': 'ai-reviewed', 'result': {'status': 'ai-reviewed'},
            'contentHash': hashlib.sha256(chunk.read_bytes()).hexdigest(),
            'hashes': {'fixture': hashlib.sha256((self.work / 'libs/rules.json').read_bytes()).hexdigest()},
        })
        # This synthetic runner stands in for the separately tested real dry-run
        # fingerprint command. It never starts a model or accesses the network.
        (self.work / 'scripts/run_chunks.mjs').write_text('''
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
const args = process.argv.slice(2);
if (!args.includes('--dry-run')) process.exit(99);
const work = args[args.indexOf('--work') + 1];
const chunks = args[args.indexOf('--chunks') + 1].split(',');
const fixture = createHash('sha256').update(readFileSync(join(work, 'libs/rules.json'))).digest('hex');
process.stdout.write(JSON.stringify({ dryRun: true, chunks: chunks.map(chunk => ({chunk, hashes: {fixture}})) }));
''')
        write_json(self.work / 'review-status.json', {
            'schemaVersion': 1, 'surahs': {str(n): {'status': 'pending'} for n in (18, 23, 32, 36, 55)},
        })
        write_json(self.work / 'drafts/surah-32.json', {
            'reviewStatus': 'scholarly-review-pending', 'contentSha256': gate.content_digest(self.work, 32),
            'study': {'surah': {'number': 32, 'nameArabic': 'فرضی آزمائشی باب'}, 'words': words,
                      'ayahs': ayahs, 'rules': [{'id': 'synthetic', 'titleUrdu': 'فرضی قاعدہ',
                      'explanationUrdu': self.attack, 'exampleUrdu': 'صرف فرضی مثال'}],
                      'roots': {}, 'verbForms': {}},
        })
        write_json(self.work / 'drafts/inventory-32.json', {
            'words': [{'id': w['id'], 'arabic': w['arabic']} for w in words],
        })
        audit = self.repo / 'docs/source-audits/surah-32.md'
        audit.parent.mkdir(parents=True)
        audit.write_text('Synthetic public source audit; no real scholarly approval.\n')

    def run_export(self, output=None, selected=True):
        args = [sys.executable, '-I', str(SCRIPTS / 'review_bundle.py'), str(self.work),
                '--output', str(output or self.output)]
        if selected:
            args += ['--surah', '32']
        return subprocess.run(args, capture_output=True, text=True, timeout=30)

    def test_escaped_offline_bundle_is_deterministic_and_keeps_pending_text(self):
        result = self.run_export()
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        html = (self.output / 'surah-32.html').read_text()
        self.assertNotIn('<script>', html)
        self.assertIn('&quot;&gt;&lt;script&gt;alert(1)&lt;/script&gt;&amp;', html)
        self.assertIn('حَقَ\u0651', html)
        self.assertIn('AI draft — scholarly review pending', html)
        self.assertIn('position:sticky', html)
        self.assertIn('id="ayah-32-30"', html)
        self.assertIn('id="word-32-1-1"', html)
        manifest = json.loads((self.output / 'bundle-manifest.json').read_text())
        self.assertTrue(manifest['aiReviewComplete'])
        self.assertFalse(manifest['completeFiveSurahBundle'])
        self.assertEqual(manifest['surahs']['32']['scholarlyReview'], 'pending')
        self.assertEqual((self.output / 'surah-32.json').read_bytes(),
                         (self.work / 'drafts/surah-32.json').read_bytes())
        before = {p.relative_to(self.output): p.read_bytes() for p in self.output.rglob('*') if p.is_file()}
        self.assertEqual(set(map(str, before)), {
            'surah-32.html', 'surah-32.json', 'inventory-32.json', 'source-audits/surah-32.md',
            'review-status.json', 'bundle-manifest.json', 'README.txt', 'index.html',
        })
        self.assertEqual(self.run_export().returncode, 0)
        self.assertEqual(before, {p.relative_to(self.output): p.read_bytes() for p in self.output.rglob('*') if p.is_file()})
        self.assertFalse((self.repo / 'apps').exists())
        self.assertFalse((self.repo / 'packages').exists())

    def test_refuses_nonpending_stale_or_unreviewed_inputs_before_output(self):
        cases = [
            ('drafts/surah-32.json', lambda d: d.update(reviewStatus='approved')),
            ('review-status.json', lambda d: d['surahs']['32'].update(status='approved')),
            ('drafts/surah-32.json', lambda d: d.update(contentSha256='0' * 64)),
            ('runs/codex/32-c01.json', lambda d: d.update(status='running')),
        ]
        for relative, change in cases:
            with self.subTest(input=relative):
                path = self.work / relative
                original = path.read_bytes()
                data = json.loads(original)
                change(data)
                write_json(path, data)
                result = self.run_export()
                self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
                self.assertFalse(self.output.exists())
                path.write_bytes(original)

    def test_default_all_five_refuses_incomplete_bundle_before_output(self):
        result = self.run_export(selected=False)
        self.assertEqual(result.returncode, 1)
        self.assertFalse(self.output.exists())

    def test_changed_library_blocks_old_reviews_even_after_draft_reassembly(self):
        write_json(self.work / 'libs/rules.json', {'synthetic': 'changed rule'})
        path = self.work / 'drafts/surah-32.json'
        wrapper = json.loads(path.read_text())
        wrapper['contentSha256'] = gate.content_digest(self.work, 32)
        write_json(path, wrapper)
        result = self.run_export()
        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertIn('fresh AI reviews required', result.stdout)
        self.assertFalse(self.output.exists())

    def test_refuses_runtime_and_outside_output_paths(self):
        for target in [self.repo / 'apps/review', self.repo / 'packages/review', self.repo / 'elsewhere']:
            with self.subTest(target=target):
                result = self.run_export(target)
                self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
                self.assertIn('Output must be inside', result.stdout)
                self.assertFalse(target.exists())

    def test_refuses_output_symlinks_without_writing_outside_tree(self):
        outside = self.repo / 'outside'
        outside.mkdir()
        self.output.parent.mkdir(parents=True)
        self.output.symlink_to(outside, target_is_directory=True)
        result = self.run_export()
        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertIn('symlink', result.stdout)
        self.assertEqual(list(outside.iterdir()), [])


if __name__ == '__main__':
    unittest.main()

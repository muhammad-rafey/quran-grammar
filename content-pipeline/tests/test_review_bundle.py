"""Offline reviewer exports use synthetic lessons, never repository Quran content."""
import base64
import hashlib
from html import escape
import importlib.util
import json
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile
import unittest


SCRIPTS = Path(__file__).resolve().parents[1] / 'scripts'
PROJECT_FONTS = SCRIPTS.parents[1] / 'apps/web/public/fonts'
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

    def copy_fonts(self):
        target = self.repo / 'apps/web/public/fonts'
        shutil.copytree(PROJECT_FONTS, target)
        return target

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
        self.assertNotIn('@font-face', html)
        self.assertNotIn('Embedded font copyrights', html)
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

    def test_original_fonts_and_licenses_embedded_in_each_html_without_network_sources(self):
        fonts = self.copy_fonts()
        # Fixed assets only; unrelated local files must never enter the export.
        (fonts / 'private-notes.txt').write_text('do not export this fixture')
        self.assertEqual(self.run_export().returncode, 0)
        expected_fonts = ['amiri-quran.ttf', 'naskh.ttf', 'nastaliq.ttf']
        expected_licenses = ['OFL-Amiri.txt', 'OFL-Naskh.txt', 'OFL-Nastaliq.txt']
        for filename in ('index.html', 'surah-32.html'):
            with self.subTest(page=filename):
                html = (self.output / filename).read_text()
                sources = re.findall(r'src:url\(([^)]+)\)', html)
                self.assertEqual(len(sources), 3)
                for source, original in zip(sources, expected_fonts):
                    self.assertTrue(source.startswith('data:font/ttf;base64,'))
                    self.assertEqual(base64.b64decode(source.split(',', 1)[1], validate=True),
                                     (fonts / original).read_bytes())
                policy = re.search(r'http-equiv="Content-Security-Policy" content="([^"]+)"', html)[1]
                self.assertIn("default-src 'none'", policy)
                self.assertIn('font-src data:;', policy)
                self.assertNotIn('https:', policy)
                self.assertNotIn("'self'", policy)
                self.assertTrue('font-family:Nastaliq,Naskh' in html)
                self.assertTrue('font-family:Amiri,Naskh' in html)
                self.assertTrue('AI draft — scholarly review pending' in html)
                if filename.startswith('surah-'):
                    self.assertTrue('حَقَ\u0651' in html)  # No mark normalization during embedding.
                for license_name in expected_licenses:
                    original = (fonts / license_name).read_bytes()
                    self.assertTrue(escape(original.decode('utf-8'), quote=True) in html,
                                    f'{filename}: full {license_name} notice must accompany embedded font')
                    self.assertEqual((self.output / 'font-licenses' / license_name).read_bytes(), original)
        manifest = json.loads((self.output / 'bundle-manifest.json').read_text())
        for name in expected_licenses:
            key = f'font-licenses/{name}'
            self.assertEqual(manifest['filesSha256'][key],
                             hashlib.sha256((fonts / name).read_bytes()).hexdigest())
        self.assertEqual(len(list(self.output.rglob('*.*'))), 11)
        self.assertNotIn('private-notes.txt', str(manifest))
        self.assertIn('font-licenses/', (self.output / 'README.txt').read_text())
        before = {p.relative_to(self.output): p.read_bytes() for p in self.output.rglob('*') if p.is_file()}
        self.assertEqual(self.run_export().returncode, 0)
        self.assertEqual(before, {p.relative_to(self.output): p.read_bytes() for p in self.output.rglob('*') if p.is_file()})

    def test_unexpected_existing_files_are_preserved_and_block_all_new_output(self):
        for relative in ('private-fixture.txt', '.private-fixture', 'nested/.private-fixture'):
            with self.subTest(path=relative):
                marker = self.output / relative
                marker.parent.mkdir(parents=True, exist_ok=True)
                marker.write_bytes(b'Synthetic unrelated file; no real private data.')
                before = {p.relative_to(self.output): p.read_bytes()
                          for p in self.output.rglob('*') if p.is_file()}
                result = self.run_export()
                self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
                self.assertIn('Unexpected existing file', result.stdout)
                self.assertEqual(before, {p.relative_to(self.output): p.read_bytes()
                                          for p in self.output.rglob('*') if p.is_file()})
                marker.unlink()
        # An empty destination and subsequent owned-file regeneration still work.
        self.assertEqual(self.run_export().returncode, 0)
        before = {p.relative_to(self.output): p.read_bytes()
                  for p in self.output.rglob('*') if p.is_file()}
        self.assertEqual(self.run_export().returncode, 0)
        self.assertEqual(before, {p.relative_to(self.output): p.read_bytes()
                                  for p in self.output.rglob('*') if p.is_file()})

    def test_unlisted_directory_symlink_is_not_followed_or_shared(self):
        outside = self.repo / 'unrelated-fixture'
        outside.mkdir()
        sentinel = outside / 'private-fixture.txt'
        sentinel.write_bytes(b'Synthetic unrelated file; do not export.')
        self.output.mkdir(parents=True)
        link = self.output / '.unlisted-directory'
        link.symlink_to(outside, target_is_directory=True)
        result = self.run_export()
        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertIn('directory symlink', result.stdout)
        self.assertTrue(link.is_symlink())
        self.assertEqual(sentinel.read_bytes(), b'Synthetic unrelated file; do not export.')
        self.assertEqual(list(self.output.iterdir()), [link])

    def test_present_fonts_require_complete_valid_licenses_before_any_output(self):
        fonts = self.copy_fonts()
        license_path = fonts / 'OFL-Nastaliq.txt'
        original = license_path.read_bytes()
        for contents in (None, b'License missing from fixture'):
            with self.subTest(contents=contents):
                if contents is None:
                    license_path.unlink()
                else:
                    license_path.write_bytes(contents)
                result = self.run_export()
                self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
                self.assertFalse(self.output.exists())
        license_path.write_bytes(original)
        (fonts / 'amiri-quran.ttf').write_bytes(b'not a TrueType font')
        self.assertEqual(self.run_export().returncode, 1)
        self.assertFalse(self.output.exists())

    def test_font_symlink_is_refused_and_license_html_is_escaped(self):
        fonts = self.copy_fonts()
        license_path = fonts / 'OFL-Amiri.txt'
        original = license_path.read_bytes()
        outside = self.repo / 'unrelated-license.txt'
        outside.write_bytes(original)
        license_path.unlink()
        license_path.symlink_to(outside)
        result = self.run_export()
        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertIn('font asset symlink', result.stdout)
        self.assertFalse(self.output.exists())
        license_path.unlink()
        license_path.write_bytes(original + b'\n<script>license fixture</script>\n')
        self.assertEqual(self.run_export().returncode, 0)
        html = (self.output / 'index.html').read_text()
        self.assertTrue('<script>' not in html)
        self.assertTrue('&lt;script&gt;license fixture&lt;/script&gt;' in html)

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

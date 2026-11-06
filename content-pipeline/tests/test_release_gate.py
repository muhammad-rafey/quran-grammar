"""Publication hold tests use synthetic content in isolated temporary directories."""
import importlib.util
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest


SCRIPTS = Path(__file__).resolve().parents[1] / 'scripts'
spec = importlib.util.spec_from_file_location('release_gate', SCRIPTS / 'release_gate.py')
gate = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gate)


def write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False) + '\n', encoding='utf-8')


def pending_manifest(work):
    write_json(work / 'review-status.json', {
        'schemaVersion': 1,
        'surahs': {str(s): {'status': 'pending'} for s in gate.SURAH_NUMBERS},
    })


def approve_fixture(work, surah):
    """Synthetic metadata: never approves repository teaching content."""
    manifest = json.loads((work / 'review-status.json').read_text())
    manifest['surahs'][str(surah)] = {
        'status': 'approved',
        'reviewer': 'Synthetic fixture reviewer; tests only',
        'reviewedAt': '2026-11-06',
        'evidence': 'Synthetic isolated fixture; no actual scholarly review claimed',
        'contentSha256': gate.content_digest(work, surah),
    }
    write_json(work / 'review-status.json', manifest)


class ReleaseGateTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.work = Path(self.temp.name)
        pending_manifest(self.work)
        for path in gate.SHARED_INPUTS:
            write_json(self.work / path, {})
        write_json(self.work / 'meta/plan.json', [{'surah': 32, 'chunk': '32-c01'}])
        write_json(self.work / 'chunks/32/32-c01.json', {'synthetic': 'chunk'})
        write_json(self.work / 'inventory/inventory-32.json', {'synthetic': 'inventory'})
        for kind in ('lexemes', 'roots'):
            write_json(self.work / f'libs/{kind}/batch.json', {'entries': []})

    def test_pending_blocks_before_source_dependencies(self):
        (self.work / 'meta/plan.json').unlink()
        with self.assertRaisesRegex(gate.ReleaseBlocked, 'scholarly review pending'):
            gate.require_approvals(self.work, [32])

    def test_matching_approved_digest_passes(self):
        approve_fixture(self.work, 32)
        self.assertEqual(gate.require_approvals(self.work, [32]), {32: gate.content_digest(self.work, 32)})

    def test_each_required_input_mutation_invalidates_approval(self):
        for relative in gate.input_paths(self.work, 32):
            with self.subTest(input=relative):
                approve_fixture(self.work, 32)
                path = self.work / relative
                original = path.read_bytes()
                path.write_bytes(original + b' ')
                with self.assertRaisesRegex(gate.ReleaseBlocked, 'stale'):
                    gate.require_approvals(self.work, [32])
                path.write_bytes(original)

    def test_added_shared_library_invalidates_approval(self):
        approve_fixture(self.work, 32)
        write_json(self.work / 'libs/lexemes/new-batch.json', {'entries': []})
        with self.assertRaisesRegex(gate.ReleaseBlocked, 'stale'):
            gate.require_approvals(self.work, [32])

    def test_missing_required_input_blocks_even_with_approval(self):
        approve_fixture(self.work, 32)
        (self.work / 'inventory/inventory-32.json').unlink()
        with self.assertRaisesRegex(gate.ReleaseBlocked, 'Missing required input'):
            gate.require_approvals(self.work, [32])

    def test_missing_approval_metadata_blocks(self):
        for field in ('reviewer', 'reviewedAt', 'evidence', 'contentSha256'):
            with self.subTest(field=field):
                approve_fixture(self.work, 32)
                manifest = json.loads((self.work / 'review-status.json').read_text())
                del manifest['surahs']['32'][field]
                write_json(self.work / 'review-status.json', manifest)
                with self.assertRaisesRegex(gate.ReleaseBlocked, field):
                    gate.require_approvals(self.work, [32])

    def test_invalid_review_date_blocks(self):
        approve_fixture(self.work, 32)
        manifest = json.loads((self.work / 'review-status.json').read_text())
        manifest['surahs']['32']['reviewedAt'] = '2026-02-30'
        write_json(self.work / 'review-status.json', manifest)
        with self.assertRaisesRegex(gate.ReleaseBlocked, 'valid YYYY-MM-DD'):
            gate.require_approvals(self.work, [32])

    def test_every_selected_surah_requires_approval(self):
        approve_fixture(self.work, 32)
        with self.assertRaisesRegex(gate.ReleaseBlocked, 'Surah 55: scholarly review pending'):
            gate.require_approvals(self.work, [32, 55])

    def test_manifest_and_reports_do_not_change_content_digest(self):
        original = gate.content_digest(self.work, 32)
        approve_fixture(self.work, 32)
        write_json(self.work / 'reports/review.json', {'synthetic': True})
        self.assertEqual(original, gate.content_digest(self.work, 32))

    def test_traversal_chunk_name_is_rejected(self):
        write_json(self.work / 'meta/plan.json', [{'surah': 32, 'chunk': '../../elsewhere'}])
        with self.assertRaisesRegex(gate.ReleaseBlocked, 'invalid chunk name'):
            gate.content_digest(self.work, 32)


class AssemblyHoldTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.work = Path(self.temp.name) / 'pipeline'
        self.repo = Path(self.temp.name) / 'repo'
        self.repo.mkdir()
        pending_manifest(self.work)
        write_json(self.work / 'meta/plan.json', [])
        write_json(self.work / 'meta/words.json', {})
        write_json(self.work / 'meta/ayahs.json', {})
        write_json(self.work / 'meta/overrides.json', {})
        write_json(self.work / 'meta/lexeme-batches.json', {})
        write_json(self.work / 'meta/root-batches.json', {})
        write_json(self.work / 'libs/rules.json', {'rules': [{
            'id': 'nominative', 'titleUrdu': 'اسم کی آزمائش',
            'explanationUrdu': 'یہ صرف خودکار آزمائش کے لیے بنایا گیا عارضی فرضی قاعدہ ہے۔',
            'appliesWhenEnglish': 'Synthetic fixture rule only.',
        }]})
        for kind in ('lexemes', 'roots'):
            write_json(self.work / f'libs/{kind}/batch.json', {'entries': []})
        (self.work / 'scripts').mkdir()
        for name in ('validate_chunk.py', 'assemble.py', 'emit_ts.py'):
            shutil.copyfile(SCRIPTS / name, self.work / 'scripts' / name)

    def make_surah(self, surah, ayah_count, word_count, invalid=False):
        """Synthetic source/chunk alignment with the full expected coverage counts."""
        words_meta = json.loads((self.work / 'meta/words.json').read_text())
        words, ayahs, ids = [], [], []
        quotient, extra = divmod(word_count, ayah_count)
        for ayah in range(1, ayah_count + 1):
            ayah_ids = []
            for position in range(1, quotient + (ayah <= extra) + 1):
                wid = f'{surah}:{ayah}:{position}'
                ids.append(wid)
                ayah_ids.append(wid)
                words_meta[wid] = {
                    'id': wid, 'surah': surah, 'ayah': ayah, 'position': position,
                    'arabic': 'كَلِمَةٌ', 'pos': 'noun', 'root': None,
                    'qacSegments': [{'kind': 'STEM', 'lemmaBuckwalter': 'synthetic'}],
                }
                words.append({
                    'id': wid, 'meaningUrdu': 'آزمائشی لفظ', 'posUrdu': 'اسم', 'lemma': 'كَلِمَة',
                    'morphologyUrdu': 'یہ صرف خودکار آزمائش کا فرضی لفظ ہے اور اسم مرفوع ہے۔',
                    'syntaxUrdu': 'یہ صرف خودکار آزمائش کے فرضی جملے کا ایک حصہ ہے۔',
                    'dictionaryUrdu': 'یہ عبارت صرف خودکار آزمائش کے لیے لکھی گئی ہے۔',
                    'segments': [{'arabic': 'كَلِمَةٌ', 'roleUrdu': 'اسم', 'meaningUrdu': 'آزمائشی لفظ'}],
                    'ruleIds': ['nominative'],
                })
            ayahs.append({
                'number': ayah, 'translationUrdu': 'یہ صرف فرضی آزمائشی عبارت ہے۔',
                'themeUrdu': 'فرضی آزمائش',
                'tafsirUrdu': 'یہ متن صرف خودکار آزمائش کے لیے بنایا گیا ہے اور کسی حقیقی آیت کی تفسیر نہیں ہے۔',
                'phrases': [{'wordIds': ayah_ids, 'labelUrdu': 'فرضی ترکیب',
                             'explanationUrdu': 'یہ صرف خودکار آزمائش کے لیے فرضی ترکیب ہے۔'}],
            })
        if invalid:
            words[0]['meaningUrdu'] = None
        name = f'{surah}-c01'
        plan = json.loads((self.work / 'meta/plan.json').read_text())
        plan.append({'chunk': name, 'surah': surah, 'ayahs': list(range(1, ayah_count + 1)),
                     'words': word_count, 'wordIds': ids})
        write_json(self.work / 'meta/plan.json', plan)
        write_json(self.work / 'meta/words.json', words_meta)
        write_json(self.work / f'chunks/{surah}/{name}.json',
                   {'chunk': name, 'ayahs': ayahs, 'words': words, 'auditNotes': []})
        write_json(self.work / f'inventory/inventory-{surah}.json', {'surah': surah, 'synthetic': True})

    def run_assemble(self, *args, fixture_formatter=False):
        arguments = [str(SCRIPTS / 'assemble.py'), str(self.work), str(self.repo), *args]
        if fixture_formatter:
            # Publication behavior is the subject of these tests. A deterministic
            # emitter isolates it from npx/Prettier, network and package caches.
            code = (
                'import json,runpy,sys,types; '
                'emitter=types.ModuleType("emit_ts"); '
                'emitter.emit_lesson=lambda study,name,header: "\\n".join(header)+"\\nexport const "+name+" = "+json.dumps(study,ensure_ascii=False)+";\\n"; '
                'sys.modules["emit_ts"]=emitter; '
                f'sys.argv={arguments!r}; '
                'runpy.run_path(sys.argv[0],run_name="__main__")'
            )
            command = [sys.executable, '-I', '-c', code]
        else:
            command = [sys.executable, '-I', *arguments]
        return subprocess.run(command, capture_output=True, text=True, timeout=30)

    def make_verb_fixture(self, lemmas, raw_passive=False, passive_override=None):
        """Add synthetic verb occurrences; none represents an actual Quranic ayah."""
        self.make_surah(32, 30, 372)
        meta_path = self.work / 'meta/words.json'
        chunk_path = self.work / 'chunks/32/32-c01.json'
        metadata = json.loads(meta_path.read_text())
        chunk = json.loads(chunk_path.read_text())
        effective_passive = raw_passive if passive_override is None else passive_override
        # Deliberately use fatha-before-shadda in the paradigm, not the authored
        # shadda-before-fatha spelling, to exercise canonical mark ordering.
        past = 'شُقَ\u0651' if effective_passive else 'شَقَ\u0651'
        arabic = 'شُقَّ' if effective_passive else 'شَقَّ'
        overrides = {}
        for word, lemma in zip(chunk['words'], lemmas):
            metadata[word['id']].update({
                'arabic': arabic, 'pos': 'verb', 'root': 'ش ق ق',
                'qacSegments': [{'kind': 'STEM', 'tag': 'V', 'verbForm': 'I',
                                 'lemmaBuckwalter': 'synthetic-verb', 'root': 'ش ق ق'}],
                'verb': {'passive': raw_passive}, 'lexemeKey': 'synthetic-verb',
            })
            word.update({
                'lemma': lemma, 'posUrdu': 'فعلِ ماضی',
                'morphologyUrdu': 'یہ صرف خودکار آزمائش کے لیے بنایا گیا فرضی فعلِ ماضی ہے۔',
                'verbNoteUrdu': 'یہ صیغہ صرف خودکار آزمائش کے فرضی مواد کا حصہ ہے۔',
                'segments': [{'arabic': arabic, 'roleUrdu': 'فعلِ ماضی',
                              'meaningUrdu': 'فرضی آزمائشی فعل'}],
                'ruleIds': ['perfect'],
            })
            if passive_override is not None:
                overrides[word['id']] = {'passive': passive_override}
        write_json(meta_path, metadata)
        write_json(chunk_path, chunk)
        write_json(self.work / 'meta/overrides.json', overrides)
        write_json(self.work / 'libs/roots/batch.json', {'entries': [{
            'root': 'ش ق ق', 'meaningUrdu': 'چیرنا؛ صرف فرضی آزمائش۔',
            'noteUrdu': 'یہ مادہ صرف خودکار آزمائش کے فرضی مواد کے لیے ہے۔',
        }]})
        write_json(self.work / 'libs/lexemes/batch.json', {'entries': [{
            'key': 'synthetic-verb', 'baabUrdu': 'باب نصر', 'formUrdu': 'ثلاثی مجرد',
            'past': past, 'present': 'يُشَقُّ' if effective_passive else 'يَشُقُّ',
            'pattern': 'فُعِلَ يُفْعَلُ' if effective_passive else 'فَعَلَ يَفْعُلُ',
        }]})
        rules_path = self.work / 'libs/rules.json'
        rules = json.loads(rules_path.read_text())
        rules['rules'].append({
            'id': 'perfect', 'titleUrdu': 'فرضی فعل کی آزمائش',
            'explanationUrdu': 'یہ صرف خودکار آزمائش کے لیے بنایا گیا عارضی فرضی قاعدہ ہے۔',
            'appliesWhenEnglish': 'Synthetic fixture verb rule only.',
        })
        write_json(rules_path, rules)
        return past

    def test_nfc_diagnostics_preserve_authored_strings_and_real_citation_variants(self):
        lemmas = ['شَقَّ', 'شَقَ\u0651']
        past = self.make_verb_fixture(lemmas)
        chunk_path = self.work / 'chunks/32/32-c01.json'
        chunk = json.loads(chunk_path.read_text())
        chunk['words'][2]['lemma'] = 'كَلِمَةٌ'
        write_json(chunk_path, chunk)
        result = self.run_assemble('--draft', '--surah', '32')
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        report = json.loads((self.work / 'reports/assembly-report.json').read_text())['surahs']['32']
        self.assertEqual(report['verbLemmaNotActivePast'], [])
        self.assertEqual(report['lemmaVariants'], {
            'synthetic|None|noun': {'كَلِمَةٌ': 1, 'كَلِمَة': 369},
        })
        draft = json.loads((self.work / 'drafts/surah-32.json').read_text())
        self.assertEqual(draft['reviewStatus'], 'scholarly-review-pending')
        for index, lemma in enumerate(lemmas):
            word = draft['study']['words'][index]
            self.assertEqual(word['lemma'], lemma)
            self.assertEqual(word['arabic'], 'شَقَّ')
            self.assertEqual(word['segments'][0]['arabic'], 'شَقَّ')
            self.assertEqual(draft['study']['verbForms'][word['id']]['past'], past)
        self.assertEqual(list(self.repo.rglob('*')), [])

    def test_effective_active_override_checks_lemma_against_active_past(self):
        past = self.make_verb_fixture(['شُقَّ'], raw_passive=True, passive_override=False)
        result = self.run_assemble('--draft', '--surah', '32')
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        report = json.loads((self.work / 'reports/assembly-report.json').read_text())['surahs']['32']
        self.assertEqual(report['verbLemmaNotActivePast'], [
            ['32:1:1', 'شُقَّ', past],
        ])

    def test_effective_passive_override_does_not_compare_with_passive_past(self):
        past = self.make_verb_fixture(['شَقَّ'], raw_passive=False, passive_override=True)
        result = self.run_assemble('--draft', '--surah', '32')
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        report = json.loads((self.work / 'reports/assembly-report.json').read_text())['surahs']['32']
        self.assertEqual(report['verbLemmaNotActivePast'], [])
        study = json.loads((self.work / 'drafts/surah-32.json').read_text())['study']
        self.assertEqual(study['words'][0]['lemma'], 'شَقَّ')
        self.assertEqual(study['verbForms']['32:1:1']['past'], past)

    def test_write_refuses_pending_before_missing_dependencies(self):
        (self.work / 'meta/words.json').unlink()
        result = self.run_assemble('--write', '--surah', '32')
        self.assertEqual(result.returncode, 1)
        self.assertIn('scholarly review pending', result.stdout)
        self.assertNotIn('Traceback', result.stderr)
        self.assertEqual(list(self.repo.rglob('*')), [])

    def test_draft_writes_only_review_artifacts(self):
        self.make_surah(32, 30, 372)
        result = self.run_assemble('--draft', '--surah', '32')
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        draft = json.loads((self.work / 'drafts/surah-32.json').read_text())
        self.assertEqual(draft['reviewStatus'], 'scholarly-review-pending')
        self.assertEqual(draft['study']['surah']['wordCount'], 372)
        self.assertEqual(draft['contentSha256'], gate.content_digest(self.work, 32))
        self.assertTrue((self.work / 'drafts/inventory-32.json').is_file())
        self.assertEqual(list(self.repo.rglob('*')), [])
        manifest = json.loads((self.work / 'review-status.json').read_text())
        self.assertEqual(manifest['surahs']['32']['status'], 'pending')

    def test_invalid_second_surah_prevents_every_draft_output(self):
        self.make_surah(32, 30, 372)
        self.make_surah(55, 78, 351, invalid=True)
        result = self.run_assemble('--draft', '--surah', '32', '55')
        self.assertEqual(result.returncode, 1)
        self.assertIn('meaningUrdu', result.stdout)
        self.assertFalse((self.work / 'drafts').exists())
        self.assertEqual(list(self.repo.rglob('*')), [])

    def test_invalid_second_surah_prevents_every_runtime_output(self):
        self.make_surah(32, 30, 372)
        self.make_surah(55, 78, 351, invalid=True)
        approve_fixture(self.work, 32)
        approve_fixture(self.work, 55)
        result = self.run_assemble('--write', '--surah', '32', '55')
        self.assertEqual(result.returncode, 1)
        self.assertIn('meaningUrdu', result.stdout)
        self.assertEqual(list(self.repo.rglob('*')), [])

    def test_matching_approved_fixture_can_emit_runtime(self):
        self.make_surah(32, 30, 372)
        approve_fixture(self.work, 32)
        result = self.run_assemble('--write', '--surah', '32', fixture_formatter=True)
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        output = self.repo / 'packages/core/src/lessons/surah-32.ts'
        self.assertIn('scholarly approval recorded', output.read_text())
        self.assertTrue((self.repo / 'docs/source-audits/inventory-32.json').is_file())

    def test_truncated_plan_cannot_produce_a_complete_surah(self):
        self.make_surah(32, 1, 1)
        result = self.run_assemble('--draft', '--surah', '32')
        self.assertEqual(result.returncode, 1)
        self.assertIn('all 30 ayahs and 372 unique words', result.stdout)
        self.assertFalse((self.work / 'drafts').exists())

    def test_draft_symlink_outside_pipeline_is_rejected(self):
        self.make_surah(32, 30, 372)
        (self.work / 'drafts').symlink_to(self.repo, target_is_directory=True)
        result = self.run_assemble('--draft', '--surah', '32')
        self.assertEqual(result.returncode, 1)
        self.assertIn('drafts directory', result.stdout)
        self.assertEqual(list(self.repo.rglob('*')), [])


if __name__ == '__main__':
    unittest.main()

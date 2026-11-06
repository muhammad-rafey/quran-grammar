"""Source-audit generation must not turn partial AI work into completion claims."""
import copy
import hashlib
import json
from pathlib import Path
import subprocess
import tempfile
import unittest


SCRIPT = Path(__file__).resolve().parents[1] / 'scripts' / 'gen_audit.py'
SURAHS = (18, 23, 32, 36, 55)


def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False), encoding='utf-8')


class SourceAuditTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.work = Path(self.temporary.name) / 'pipeline'
        self.repo = Path(self.temporary.name) / 'repo'
        self.repo.mkdir()
        plan, words, ayahs, overrides, self.results = [], {}, {}, {}, []
        for surah in SURAHS:
            # Deliberately synthetic one-ayah records; no real lesson is authored
            # or approved by a fixture, and outputs stay in this temp directory.
            name, wid, key = f'{surah}-c01', f'{surah}:1:1', f'{surah}:1'
            plan.append({'chunk': name, 'surah': surah, 'ayahs': [1], 'wordIds': [wid]})
            words[wid] = {'id': wid, 'surah': surah, 'ayah': 1, 'arabic': 'تَعَالَى',
                          'pos': 'verb', 'root': 'ع ل و', 'lemmaQac': 'تَعَالَى',
                          'verb': {'form': 'I', 'passive': True}}
            ayahs[key] = {'surah': surah, 'ayah': 1, 'wordIds': [wid],
                          'qacGrammarNotesArabic': ['نص تجريبي للاختبار فقط']}
            overrides[wid] = {'verbForm': 'VI', 'passive': False,
                              'noteEnglish': 'Synthetic override; no actual Quran lesson.'}
            write_json(self.work / f'inventory/inventory-{surah}.json', {'excludedPauseSigns': []})
            write_json(self.work / f'chunks/{surah}/{name}.json', {'chunk': name, 'auditNotes': []})
            self.results.append({
                'chunk': name, 'status': 'ai-reviewed', 'scholarlyReview': 'pending',
                'blockingReasons': [], 'libraryIssues': [],
                'authored': {'validatorOk': True, 'words': 1, 'ayahs': 1,
                             'notes': 'Existing authored text reused; no historical review is reused.'},
                'reviewIssues': 1, 'reviewCritical': 0, 'reviewMajor': 1,
                'fix1': {'applied': 1, 'rejected': 0, 'validatorOk': True},
                'confirms': [{'round': 1, 'issues': []}], 'finalFix': None,
            })
        for filename, value in [('plan', plan), ('words', words), ('ayahs', ayahs), ('overrides', overrides)]:
            write_json(self.work / f'meta/{filename}.json', value)
        # The reviewed library has a split absent from raw source metadata.
        # The generator must count these actual entries, not meta/lexemes.json.
        write_json(self.work / 'libs/lexemes/batch.json', {
            'entries': [{'key': 'synthetic-source|I|PASS'}, {'key': 'synthetic-split|VI|ACT'}],
        })
        self.snapshot = self.work / 'results.json'
        write_json(self.snapshot, self.results)

    def command(self, snapshot=True):
        args = ['python3', '-I', str(SCRIPT), str(self.work), str(self.repo)]
        if snapshot:
            args.append(str(self.snapshot))
        return subprocess.run(args, capture_output=True, text=True)

    def outputs(self):
        return {surah: self.repo / f'docs/source-audits/surah-{surah}.md' for surah in SURAHS}

    def seed_existing_outputs(self):
        for surah, path in self.outputs().items():
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(f'original-{surah}', encoding='utf-8')

    def assert_original_outputs(self):
        for surah, path in self.outputs().items():
            self.assertEqual(path.read_text(), f'original-{surah}')

    def test_effective_counts_actual_library_and_honest_snapshot_summary(self):
        result = self.command()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(len(list((self.repo / 'docs/source-audits').glob('surah-*.md'))), 5)
        text = self.outputs()[18].read_text()
        self.assertIn('| Passive verb occurrences | 0 |', text)
        self.assertIn('| Verb form VI | 1 |', text)
        self.assertNotIn('| Verb form I | 1 |', text)
        self.assertIn('shared library of 2 verb lexemes', text)
        self.assertIn('not cumulative historical totals', text)
        self.assertIn('Every finding, including a minor finding', text)
        self.assertIn('not scholar-reviewed', text)
        self.assertNotIn('repeating while serious issues remained', text)

    def test_no_snapshot_does_not_claim_reviews_completed(self):
        result = self.command(snapshot=False)
        self.assertEqual(result.returncode, 0, result.stderr)
        text = self.outputs()[18].read_text()
        self.assertIn('No review-result snapshot was supplied', text)
        self.assertIn('does not certify completion', text)
        self.assertNotIn('snapshot marks all', text)

    def test_zero_new_fixes_does_not_invent_totals_for_reused_authored_drafts(self):
        for row in self.results:
            row.update(reviewIssues=0, reviewCritical=0, reviewMajor=0)
            row['fix1'].update(applied=0, rejected=0)
        write_json(self.snapshot, self.results)
        result = self.command()
        self.assertEqual(result.returncode, 0, result.stderr)
        text = self.outputs()[18].read_text()
        self.assertIn('first fix rounds report 0 applications and 0 rejections', text)
        self.assertIn('reused authored drafts may already contain corrections from earlier passes', text)

    def test_missing_supplied_snapshot_fails_instead_of_silently_omitting_reviews(self):
        self.snapshot.unlink()
        result = self.command()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('cannot read the supplied result snapshot', result.stderr)
        self.assertFalse((self.repo / 'docs').exists())

    def test_invalid_last_chunk_never_partially_replaces_five_existing_audits(self):
        self.seed_existing_outputs()
        variants = {}
        rows = copy.deepcopy(self.results); rows.pop(); variants['missing'] = rows
        rows = copy.deepcopy(self.results); rows.append(rows[-1]); variants['duplicate'] = rows
        rows = copy.deepcopy(self.results); rows[-1]['status'] = 'blocked'; variants['blocked'] = rows
        rows = copy.deepcopy(self.results); rows[-1]['confirms'] = []; variants['no-confirmation'] = rows
        rows = copy.deepcopy(self.results); rows[-1]['authored']['words'] = 0; variants['partial-author'] = rows
        rows = copy.deepcopy(self.results); rows[-1]['reviewCritical'] = True; variants['malformed-count'] = rows
        rows = copy.deepcopy(self.results); rows[-1]['libraryIssues'] = [{'kind': 'rule'}]; variants['library-issue'] = rows
        rows = copy.deepcopy(self.results); rows[-1]['confirms'][0]['issues'] = [{
            'ref': '55:1:1', 'field': 'syntaxUrdu', 'severity': 'minor', 'problem': 'Open', 'fix': 'Correction',
        }]; variants['open-minor-confirmation'] = rows
        variants['malformed-wrapper'] = {'results': None}
        for label, rows in variants.items():
            with self.subTest(case=label):
                write_json(self.snapshot, rows)
                result = self.command()
                self.assertNotEqual(result.returncode, 0, label)
                self.assert_original_outputs()

    def test_bad_late_source_input_does_not_leave_partial_audits(self):
        self.seed_existing_outputs()
        path = self.work / 'inventory/inventory-55.json'
        path.write_text('{malformed', encoding='utf-8')
        result = self.command()
        self.assertNotEqual(result.returncode, 0)
        self.assert_original_outputs()

    def test_runner_checkpoints_bind_success_to_current_chunk_bytes(self):
        rows = []
        for result in self.results:
            name = result['chunk']
            file = self.work / f'chunks/{name.split("-")[0]}/{name}.json'
            rows.append({'chunk': name, 'status': 'ai-reviewed',
                         'contentHash': hashlib.sha256(file.read_bytes()).hexdigest(), 'result': result})
        write_json(self.snapshot, {'publication': 'held-for-scholarly-review', 'results': rows})
        result = self.command()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.seed_existing_outputs()
        file = self.work / 'chunks/55/55-c01.json'
        file.write_bytes(file.read_bytes() + b'\n')
        result = self.command()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('differ from the supplied reviewed hash', result.stderr)
        self.assert_original_outputs()

    def test_unvalidated_final_fix_cannot_be_hidden_by_clean_confirmation(self):
        self.results[-1]['confirms'] = [
            {'round': 1, 'issues': [{'ref': '55:1:1', 'field': 'syntaxUrdu', 'severity': 'minor'}]},
            {'round': 2, 'issues': []},
        ]
        self.results[-1]['finalFix'] = {'validatorOk': False, 'applied': 1, 'rejected': []}
        write_json(self.snapshot, self.results)
        result = self.command()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('unvalidated final fix', result.stderr)
        self.assertFalse((self.repo / 'docs').exists())

    def test_safe_projection_can_confirm_a_reasoned_rejection_without_model_prose(self):
        self.results[-1]['confirms'] = [
            {'round': 1, 'issues': [{'ref': '55:1:1', 'field': 'syntaxUrdu', 'severity': 'minor'}]},
            {'round': 2, 'issues': []},
        ]
        self.results[-1]['finalFix'] = {
            'validatorOk': True, 'applied': 0,
            'rejected': [{'ref': '55:1:1', 'field': 'syntaxUrdu'}],
        }
        for row in self.results:
            name = row['chunk']
            file = self.work / f'chunks/{name.split("-")[0]}/{name}.json'
            row['contentSha256'] = hashlib.sha256(file.read_bytes()).hexdigest()
        write_json(self.snapshot, self.results)
        result = self.command()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.seed_existing_outputs()
        file = self.work / 'chunks/55/55-c01.json'
        file.write_bytes(file.read_bytes() + b'\n')
        result = self.command()
        self.assertNotEqual(result.returncode, 0)
        self.assert_original_outputs()


if __name__ == '__main__':
    unittest.main()

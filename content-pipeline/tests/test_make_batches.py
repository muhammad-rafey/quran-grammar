import json
from pathlib import Path
import subprocess
import tempfile
import unittest


SCRIPT = Path(__file__).resolve().parents[1] / 'scripts' / 'make_batches.py'


class CorrectedLexemeBatchTests(unittest.TestCase):
    def test_rebuild_preserves_adjudicated_split_without_rebatching_raw_lexemes(self):
        with tempfile.TemporaryDirectory() as folder:
            work = Path(folder)
            meta = work / 'meta'
            meta.mkdir()
            sources = {
                'lexemes': {'raw|VI|ACT': {'root': 'ع ل و', 'occurrences': [{'id': '23:91:17'}]}},
                'roots': {'ع ل و': {'root': 'ع ل و'}},
                'words': {'23:91:17': {'id': '23:91:17', 'lexemeKey': 'raw|VI|ACT'}},
                'overrides': {'23:91:17': {'lexemeKey': 'EalaA|I|ACT', 'verbForm': 'I', 'noteEnglish': 'Split incorrect merged source lemma'}},
            }
            for name, data in sources.items():
                (meta / f'{name}.json').write_text(json.dumps(data), encoding='utf-8')
            for _ in range(2):
                subprocess.run(['python3', '-I', str(SCRIPT), str(work)], check=True, capture_output=True)
                batches = json.loads((meta / 'lexeme-batches.json').read_text())
                self.assertEqual(batches, {'lex-01': ['raw|VI|ACT'], 'lex-extra': ['EalaA|I|ACT']})
                extra = json.loads((work / 'inputs/lexemes/lex-extra.json').read_text())
                original = json.loads((work / 'inputs/lexemes/lex-01.json').read_text())
                self.assertEqual(original['lexemes'][0]['occurrences'], [])
                self.assertEqual(original['lexemes'][0]['occurrenceCount'], 0)
                occurrence = extra['lexemes'][0]['occurrences'][0]
                self.assertEqual(occurrence['id'], '23:91:17')
                self.assertEqual(occurrence['qacCorrection']['verbForm'], 'I')
                self.assertEqual(occurrence['word']['lexemeKey'], 'raw|VI|ACT')
            self.assertEqual(json.loads((meta / 'lexemes.json').read_text()), sources['lexemes'])

    def test_rekey_to_an_existing_lexeme_moves_instead_of_duplicating_the_occurrence(self):
        with tempfile.TemporaryDirectory() as folder:
            work = Path(folder)
            meta = work / 'meta'
            meta.mkdir()
            sources = {
                'lexemes': {'old': {'root': 'ع ل و', 'occurrences': [{'id': '23:91:17'}]}, 'new': {'root': 'ع ل و', 'occurrences': []}},
                'roots': {'ع ل و': {'root': 'ع ل و'}},
                'words': {'23:91:17': {'id': '23:91:17', 'qacIrabArabic': [], 'qacSegments': []}},
                'overrides': {'23:91:17': {'lexemeKey': 'new', 'mood': 'JUS', 'noteEnglish': 'Correction'}},
            }
            for name, data in sources.items():
                (meta / f'{name}.json').write_text(json.dumps(data), encoding='utf-8')
            subprocess.run(['python3', '-I', str(SCRIPT), str(work)], check=True, capture_output=True)
            output = json.loads((work / 'inputs/lexemes/lex-01.json').read_text())
            entries = output['lexemes']
            self.assertEqual(entries[0]['occurrenceCount'], 0)
            self.assertEqual(entries[1]['occurrenceCount'], 1)
            self.assertEqual(entries[1]['occurrences'][0]['mood'], 'JUS')
            self.assertEqual(entries[1]['occurrences'][0]['qacCorrection']['lexemeKey'], 'new')


if __name__ == '__main__':
    unittest.main()

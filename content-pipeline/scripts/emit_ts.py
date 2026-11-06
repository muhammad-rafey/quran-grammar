"""Emit a lesson module in the repository's exact house style (prettier 3.6.2, single quotes, width 100).

Usage as a module: emit_lesson(study_dict, export_name, header_lines) -> str
CLI round-trip test: python3 -I emit_ts.py --roundtrip <existing-json> <surah-number> <existing-ts-file>
"""
import json
import os
import subprocess
import sys
import tempfile

PRETTIER = ['npx', '--yes', 'prettier@3.6.2', '--single-quote', '--print-width', '100', '--parser', 'typescript']


def emit_lesson(study, export_name, header_lines):
    body = json.dumps(study, ensure_ascii=False, indent=2)
    source = '\n'.join(header_lines) + f"\n\nexport const {export_name}: StudyData = {body};\n"
    with tempfile.NamedTemporaryFile('w', suffix='.ts', delete=False, encoding='utf-8') as handle:
        handle.write(source)
        temp = handle.name
    try:
        out = subprocess.run(PRETTIER + [temp], check=True, capture_output=True, text=True, encoding='utf-8')
        return out.stdout
    finally:
        os.unlink(temp)


if __name__ == '__main__' and sys.argv[1] == '--roundtrip':
    studies = json.load(open(sys.argv[2], encoding='utf-8'))
    number = int(sys.argv[3])
    study = next(s for s in studies if s['surah']['number'] == number)
    existing = open(sys.argv[4], encoding='utf-8').read()
    header = existing.split('\nexport const', 1)[0].rstrip('\n').split('\n')
    produced = emit_lesson(study, f'study{number}', header)
    if produced == existing:
        print('ROUNDTRIP IDENTICAL', number)
    else:
        import difflib
        diff = list(difflib.unified_diff(existing.splitlines(), produced.splitlines(), lineterm='', n=1))
        print('ROUNDTRIP DIFFERS', number, len(diff))
        print('\n'.join(diff[:40]))
        sys.exit(1)

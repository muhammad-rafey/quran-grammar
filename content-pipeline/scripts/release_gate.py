"""Bind scholarly publication approval to the exact content inputs.

This gate verifies an approval record; it cannot establish a reviewer's scholarship.
Usage: python3 -I release_gate.py <work-dir> --surah N [N ...] [--digest]
--digest computes review fingerprints without granting or recording approval.
"""
import argparse
from datetime import date
import hashlib
import json
from pathlib import Path
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import edition  # noqa: E402

SURAH_NUMBERS = (18, 23, 32, 36, 55)  # default (five-Surah) work directory


def surah_numbers(work):
    return edition.numbers(str(work))
SHARED_INPUTS = (
    'meta/plan.json',
    'meta/words.json',
    'meta/ayahs.json',
    'meta/overrides.json',
    'meta/lexeme-batches.json',
    'meta/root-batches.json',
    'libs/rules.json',
    'scripts/assemble.py',
    'scripts/emit_ts.py',
)


class ReleaseBlocked(ValueError):
    """The requested content is not approved for runtime publication."""


def _read_json(path):
    try:
        return json.loads(path.read_text(encoding='utf-8'))
    except (OSError, UnicodeError, json.JSONDecodeError) as exc:
        raise ReleaseBlocked(f'Cannot read required input {path}: {exc}') from exc


def input_paths(work, surah):
    """Return deterministic relative paths; missing required inputs fail closed.

    Shared metadata and every shared library are included conservatively: editing
    another Surah's shared source can invalidate this approval too. Review reports,
    timestamps, approvals themselves and generated output do not affect the digest.
    """
    work = Path(work)
    if surah not in surah_numbers(work):
        raise ReleaseBlocked(f'Unsupported expansion Surah: {surah}')
    plan = _read_json(work / 'meta/plan.json')
    if not isinstance(plan, list):
        raise ReleaseBlocked('meta/plan.json must contain a chunk list')
    chunks = [item for item in plan if isinstance(item, dict) and item.get('surah') == surah]
    if not chunks:
        raise ReleaseBlocked(f'Surah {surah} has no planned chunks')
    names = [item.get('chunk') for item in chunks]
    if any(not isinstance(name, str) or not re.fullmatch(rf'{surah}-c[0-9]+', name) for name in names):
        raise ReleaseBlocked(f'Surah {surah} has an invalid chunk name')
    if len(names) != len(set(names)):
        raise ReleaseBlocked(f'Surah {surah} has duplicate planned chunks')
    paths = set(SHARED_INPUTS)
    paths.add(f'inventory/inventory-{surah}.json')
    paths.update(f'chunks/{surah}/{name}.json' for name in names)
    for kind in ('lexemes', 'roots'):
        directory = work / 'libs' / kind
        files = sorted(directory.glob('*.json'))
        if not directory.is_dir() or not files:
            raise ReleaseBlocked(f'Missing required library files: libs/{kind}/*.json')
        paths.update(path.relative_to(work).as_posix() for path in files)
    for relative in sorted(paths):
        if not (work / relative).is_file():
            raise ReleaseBlocked(f'Missing required input: {relative}')
    return sorted(paths)


def content_digest(work, surah):
    """SHA-256 of framed UTF-8 relative paths and exact file bytes, in path order."""
    work = Path(work)
    digest = hashlib.sha256(b'quran-grammar-scholarly-review-v1\0')
    for relative in input_paths(work, surah):
        name = relative.encode('utf-8')
        try:
            payload = (work / relative).read_bytes()
        except OSError as exc:
            raise ReleaseBlocked(f'Cannot read required input {relative}: {exc}') from exc
        for value in (name, payload):
            digest.update(len(value).to_bytes(8, 'big'))
            digest.update(value)
    return digest.hexdigest()


def _approval_metadata(work, surahs):
    """Check approval metadata before loading missing/large source dependencies."""
    manifest = _read_json(Path(work) / 'review-status.json')
    if not isinstance(manifest, dict) or manifest.get('schemaVersion') != 1:
        raise ReleaseBlocked('review-status.json requires schemaVersion 1')
    records = manifest.get('surahs')
    if not isinstance(records, dict):
        raise ReleaseBlocked('review-status.json requires per-Surah records')
    approved = {}
    errors = []
    for surah in surahs:
        if surah not in surah_numbers(work):
            errors.append(f'Unsupported expansion Surah: {surah}')
            continue
        record = records.get(str(surah))
        if not isinstance(record, dict) or record.get('status') != 'approved':
            errors.append(f'Surah {surah}: scholarly review pending; runtime publication is blocked')
            continue
        for field in ('reviewer', 'reviewedAt', 'evidence', 'contentSha256'):
            value = record.get(field)
            if not isinstance(value, str) or not value.strip() or value != value.strip():
                errors.append(f'Surah {surah}: approval requires nonempty {field}')
        reviewed_at = record.get('reviewedAt')
        try:
            if not isinstance(reviewed_at, str) or not re.fullmatch(r'\d{4}-\d{2}-\d{2}', reviewed_at):
                raise ValueError('expected YYYY-MM-DD')
            date.fromisoformat(reviewed_at)
        except ValueError:
            errors.append(f'Surah {surah}: reviewedAt must be a valid YYYY-MM-DD date')
        if not isinstance(record.get('contentSha256'), str) or not re.fullmatch(r'[a-f0-9]{64}', record['contentSha256']):
            errors.append(f'Surah {surah}: contentSha256 must be a lowercase SHA-256 digest')
        approved[surah] = record
    if errors:
        raise ReleaseBlocked('; '.join(errors))
    return approved


def require_approvals(work, surahs):
    """Require complete metadata and a current digest for every selected Surah."""
    surahs = tuple(surahs)
    if not surahs:
        raise ReleaseBlocked('Select at least one expansion Surah')
    approved = _approval_metadata(work, surahs)
    result = {}
    errors = []
    for surah in surahs:
        try:
            actual = content_digest(work, surah)
            if actual != approved[surah]['contentSha256']:
                raise ReleaseBlocked(f'Surah {surah}: scholarly approval is stale; content inputs changed')
            result[surah] = actual
        except ReleaseBlocked as exc:
            errors.append(str(exc))
    if errors:
        raise ReleaseBlocked('; '.join(errors))
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('work_dir', type=Path)
    parser.add_argument('--surah', nargs='+', type=int, required=True)
    parser.add_argument('--digest', action='store_true', help='compute fingerprints only; does not approve content')
    args = parser.parse_args()
    try:
        values = ({s: content_digest(args.work_dir, s) for s in args.surah}
                  if args.digest else require_approvals(args.work_dir, args.surah))
        print(json.dumps({'ok': True, 'mode': 'digest-only' if args.digest else 'approved', 'contentSha256': values}, indent=2))
        return 0
    except ReleaseBlocked as exc:
        print(json.dumps({'ok': False, 'error': str(exc)}, indent=2))
        return 1


if __name__ == '__main__':
    raise SystemExit(main())

"""Validate and assemble chunks without publishing unreviewed content.

Usage: python3 -I assemble.py <work-dir> <repo-dir> [--write | --draft] [--surah N ...]
Default: validate/report only. --draft: reviewer JSON and inventories in <work-dir>/drafts/.
--write: runtime modules, only with current per-Surah scholarly approval.
All selected Surahs must pass before any lesson or inventory is written.
"""
import argparse
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import tempfile
import unicodedata
from collections import Counter, OrderedDict, defaultdict

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from emit_ts import emit_lesson  # noqa: E402
from release_gate import ReleaseBlocked, content_digest, require_approvals  # noqa: E402

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('work_dir')
parser.add_argument('repo_dir')
mode = parser.add_mutually_exclusive_group()
mode.add_argument('--write', action='store_true')
mode.add_argument('--draft', action='store_true')
parser.add_argument('--surah', type=int, nargs='+', choices=(18, 23, 32, 36, 55))
args = parser.parse_args()
WORK, REPO = args.work_dir, args.repo_dir
WRITE, DRAFT, only = args.write, args.draft, args.surah
SURAH_META = OrderedDict(
    [
        (18, ('سورۃ الکہف', 'سُورَةُ الْكَهْفِ')),
        (23, ('سورۃ المؤمنون', 'سُورَةُ الْمُؤْمِنُونَ')),
        (32, ('سورۃ السجدہ', 'سُورَةُ السَّجْدَةِ')),
        (36, ('سورۃ یٰسٓ', 'سُورَةُ يسٓ')),
        (55, ('سورۃ الرحمٰن', 'سُورَةُ الرَّحْمٰنِ')),
    ]
)
EXPECTED_COUNTS = {18: (110, 1579), 23: (118, 1050), 32: (30, 372), 36: (83, 725), 55: (78, 351)}
EXAMPLE_SUFFIX = 'اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔'

surahs = [s for s in SURAH_META if not only or s in only]
# Approval metadata is checked before any bulk-source or chunk dependency is loaded.
# This also fails closed when the third-party source cache is absent.
try:
    fingerprints = (require_approvals(WORK, surahs) if WRITE else
                    {s: content_digest(WORK, s) for s in surahs} if DRAFT else {})
except ReleaseBlocked as exc:
    print(json.dumps({'errors': [str(exc)], 'runtimeWritten': False}, ensure_ascii=False, indent=1))
    sys.exit(1)

meta = os.path.join(WORK, 'meta')
plan = json.load(open(os.path.join(meta, 'plan.json')))
words_meta = json.load(open(os.path.join(meta, 'words.json')))
ayahs_meta = json.load(open(os.path.join(meta, 'ayahs.json')))
rules_lib = {r['id']: r for r in json.load(open(os.path.join(WORK, 'libs', 'rules.json')))['rules']}
lexemes, roots = {}, {}
for name in sorted(os.listdir(os.path.join(WORK, 'libs', 'lexemes'))):
    for e in json.load(open(os.path.join(WORK, 'libs', 'lexemes', name)))['entries']:
        lexemes[e['key']] = e
for name in sorted(os.listdir(os.path.join(WORK, 'libs', 'roots'))):
    for e in json.load(open(os.path.join(WORK, 'libs', 'roots', name)))['entries']:
        roots[e['root']] = e

overrides = {k: v for k, v in json.load(open(os.path.join(meta, 'overrides.json'))).items() if not k.startswith('_')}
report = OrderedDict(errors=[], warnings=[], surahs=OrderedDict())
outputs = []
runtime_studies = []
for s in surahs:
    chunks = [p for p in plan if p['surah'] == s]
    expected_ayahs, expected_words = EXPECTED_COUNTS[s]
    planned_ayahs = [number for chunk in chunks for number in chunk['ayahs']]
    planned_ids = [wid for chunk in chunks for wid in chunk['wordIds']]
    if (planned_ayahs != list(range(1, expected_ayahs + 1)) or
            len(planned_ids) != expected_words or len(set(planned_ids)) != expected_words):
        report['errors'].append(f'{s}: plan must cover all {expected_ayahs} ayahs and {expected_words} unique words')
        report['surahs'][s] = {'status': 'incomplete-plan'}
        continue
    authored = {}
    for spec in chunks:
        res = subprocess.run(
            ['python3', '-I', os.path.join(WORK, 'scripts', 'validate_chunk.py'), WORK, spec['chunk']],
            capture_output=True, text=True,
        )
        if res.returncode != 0:
            try:
                errs = json.loads(res.stdout)['errors']
            except Exception:
                errs = [res.stdout[-400:] + res.stderr[-400:]]
            report['errors'].append({'chunk': spec['chunk'], 'validator': errs[:10]})
            continue
        authored[spec['chunk']] = json.load(open(os.path.join(WORK, 'chunks', str(s), f"{spec['chunk']}.json")))
    if len(authored) != len(chunks):
        report['surahs'][s] = {'status': 'incomplete', 'validChunks': len(authored), 'chunks': len(chunks)}
        continue

    words_out, ayahs_out, verb_forms = [], [], OrderedDict()
    word_by_id = {}
    for spec in chunks:
        data = authored[spec['chunk']]
        for w in data['words']:
            m = words_meta[w['id']]
            entry = OrderedDict(
                id=m['id'],
                ayah=m['ayah'],
                position=m['position'],
                arabic=m['arabic'],
                meaningUrdu=w['meaningUrdu'],
                pos=m['pos'],
                posUrdu=w['posUrdu'],
                root=m['root'],
                lemma=w['lemma'],
                morphologyUrdu=w['morphologyUrdu'],
                syntaxUrdu=w['syntaxUrdu'],
                dictionaryUrdu=w['dictionaryUrdu'],
                segments=[OrderedDict(arabic=x['arabic'], roleUrdu=x['roleUrdu'], meaningUrdu=x['meaningUrdu']) for x in w['segments']],
                ruleIds=list(w['ruleIds']),
            )
            words_out.append(entry)
            word_by_id[entry['id']] = entry
            if m['pos'] == 'verb':
                lex_key = overrides.get(m['id'], {}).get('lexemeKey', m['lexemeKey'])
                lex = lexemes.get(lex_key)
                if lex is None:
                    report['errors'].append(f"{m['id']}: missing lexeme {lex_key}")
                    continue
                verb_forms[m['id']] = OrderedDict(
                    baabUrdu=lex['baabUrdu'],
                    formUrdu=lex['formUrdu'],
                    past=lex['past'],
                    present=lex['present'],
                    pattern=lex['pattern'],
                    noteUrdu=w['verbNoteUrdu'],
                )
        for a in data['ayahs']:
            phrases = [
                OrderedDict(
                    id=f"{s}:{a['number']}:phrase{i + 1}",
                    wordIds=list(p['wordIds']),
                    labelUrdu=p['labelUrdu'],
                    explanationUrdu=p['explanationUrdu'],
                )
                for i, p in enumerate(a['phrases'])
            ]
            ayahs_out.append(
                OrderedDict(
                    number=a['number'],
                    translationUrdu=a['translationUrdu'],
                    themeUrdu=a['themeUrdu'],
                    tafsirUrdu=a['tafsirUrdu'],
                    phrases=phrases,
                )
            )

    # Rules: first-use order; example from the first word that uses the rule.
    rule_order = []
    for w in words_out:
        for rid in w['ruleIds']:
            if rid not in rule_order:
                rule_order.append(rid)
    rules_out = []
    for rid in rule_order:
        first = next(w for w in words_out if rid in w['ruleIds'])
        meaning = re.sub(r'[۔.؟?!،,؛;:\s]+$', '', first['meaningUrdu'])
        rule = rules_lib[rid]
        rules_out.append(
            OrderedDict(
                id=rid,
                titleUrdu=rule['titleUrdu'],
                explanationUrdu=rule['explanationUrdu'],
                exampleUrdu=f"{first['arabic']} — {meaning}۔ {EXAMPLE_SUFFIX}",
            )
        )
    roots_out = OrderedDict()
    for w in words_out:
        if w['root'] and w['root'] not in roots_out:
            entry = roots.get(w['root'])
            if entry is None:
                report['errors'].append(f"{w['id']}: missing root entry {w['root']}")
                continue
            roots_out[w['root']] = OrderedDict(meaningUrdu=entry['meaningUrdu'], noteUrdu=entry['noteUrdu'])

    name_urdu, name_arabic = SURAH_META[s]
    study = OrderedDict(
        schemaVersion=1,
        surah=OrderedDict(number=s, nameUrdu=name_urdu, nameArabic=name_arabic, ayahCount=len(ayahs_out), wordCount=len(words_out)),
        words=words_out,
        ayahs=ayahs_out,
        rules=rules_out,
        roots=roots_out,
        verbForms=verb_forms,
    )

    # Consistency diagnostics.
    expected_ids = [i for p in chunks for i in p['wordIds']]
    if [w['id'] for w in words_out] != expected_ids:
        report['errors'].append(f'{s}: word order/coverage mismatch')
    if [a['number'] for a in ayahs_out] != list(range(1, len(ayahs_out) + 1)):
        report['errors'].append(f'{s}: ayah numbering mismatch')
    lemma_variants = defaultdict(Counter)
    for w in words_out:
        m = words_meta[w['id']]
        stem = next((x for x in m['qacSegments'] if x['kind'] == 'STEM'), None)
        key = f"{stem.get('lemmaBuckwalter') if stem else ''}|{m['root']}|{m['pos']}"
        lemma_variants[key][w['lemma']] += 1
    # Normalize comparisons only; retain every authored citation in reports/output.
    variants = {
        k: dict(v) for k, v in lemma_variants.items()
        if len({unicodedata.normalize('NFC', lemma) for lemma in v}) > 1
    }
    verb_lemma_mismatch = []
    for w in words_out:
        m = words_meta[w['id']]
        if m['pos'] == 'verb' and overrides.get(m['id'], {}).get('passive', m['verb']['passive']) is False:
            lex = lexemes.get(overrides.get(m['id'], {}).get('lexemeKey', m['lexemeKey']))
            if lex is None:
                continue  # Already recorded above; do not crash before reporting the error.
            past = lex['past']
            if unicodedata.normalize('NFC', w['lemma']) != unicodedata.normalize('NFC', past):
                verb_lemma_mismatch.append((w['id'], w['lemma'], past))
    rule_use = Counter(r for w in words_out for r in w['ruleIds'])
    report['surahs'][s] = OrderedDict(
        status='ok',
        words=len(words_out),
        ayahs=len(ayahs_out),
        rules=len(rules_out),
        roots=len(roots_out),
        verbForms=len(verb_forms),
        phrases=sum(len(a['phrases']) for a in ayahs_out),
        lemmaVariants=variants,
        verbLemmaNotActivePast=verb_lemma_mismatch,
        ruleUse=dict(rule_use.most_common()),
    )
    if WRITE:
        inv = json.load(open(os.path.join(WORK, 'inventory', f'inventory-{s}.json')))
        runtime_studies.append((s, study, inv))
    elif DRAFT:
        draft_dir = Path(WORK) / 'drafts'
        if draft_dir.is_symlink() or not draft_dir.resolve().is_relative_to(Path(WORK).resolve()):
            report['errors'].append('The drafts directory must remain inside the content pipeline, without a symlink')
            continue
        draft = OrderedDict(
            reviewStatus='scholarly-review-pending',
            notice='AI-assisted educational draft. Held for scholarly review; not approved for runtime publication.',
            contentSha256=fingerprints[s],
            study=study,
        )
        outputs.append((draft_dir / f'surah-{s}.json', json.dumps(draft, ensure_ascii=False, indent=2) + '\n'))
        inv = json.load(open(os.path.join(WORK, 'inventory', f'inventory-{s}.json')))
        outputs.append((draft_dir / f'inventory-{s}.json', json.dumps(inv, ensure_ascii=False, indent=2) + '\n'))


def write_outputs_atomically(items):
    """Stage every artifact before replacement; roll back if replacement fails."""
    staged, backups, replaced = [], {}, []
    try:
        for target, text in items:
            if target.is_symlink():
                raise ValueError(f'Refusing to replace a symlink: {target}')
            target.parent.mkdir(parents=True, exist_ok=True)
            backups[target] = target.read_bytes() if target.exists() else None
            with tempfile.NamedTemporaryFile(dir=target.parent, prefix='.assembly-', delete=False) as handle:
                staged.append((Path(handle.name), target))
                handle.write(text.encode('utf-8'))
        for temporary, target in staged:
            os.replace(temporary, target)
            replaced.append(target)
    except Exception:
        for target in reversed(replaced):
            previous = backups[target]
            if previous is None:
                target.unlink(missing_ok=True)
            else:
                with tempfile.NamedTemporaryFile(dir=target.parent, prefix='.assembly-restore-', delete=False) as handle:
                    handle.write(previous)
                    restore = Path(handle.name)
                os.replace(restore, target)
        raise
    finally:
        for temporary, _ in staged:
            temporary.unlink(missing_ok=True)


if not report['errors'] and (WRITE or DRAFT):
    try:
        # Formatting can invoke an external tool; do it only after every selected
        # Surah has passed validation, while output is still staged in memory.
        for s, study, inv in runtime_studies:
            header = [
                '// AI-assisted Urdu content; scholarly approval recorded in content-pipeline/review-status.json.',
                f'// Reviewed content SHA-256: {fingerprints[s]}',
                f'// Source audit: docs/source-audits/surah-{s}.md',
                "import type { StudyData } from '../types';",
            ]
            outputs.append((Path(REPO) / 'packages/core/src/lessons' / f'surah-{s}.ts', emit_lesson(study, f'study{s}', header)))
            outputs.append((Path(REPO) / 'docs/source-audits' / f'inventory-{s}.json', json.dumps(inv, ensure_ascii=False, indent=2) + '\n'))
        # Detect edits during validation/assembly and re-check approval immediately
        # before publishing. No selected Surah is emitted when another one fails.
        current = (require_approvals(WORK, surahs) if WRITE else
                   {s: content_digest(WORK, s) for s in surahs})
        if current != fingerprints:
            raise ReleaseBlocked('Content inputs changed during assembly; retry against a stable snapshot')
        write_outputs_atomically(outputs)
        report['outputMode'] = 'runtime' if WRITE else 'scholarly-review-draft'
        report['writtenFiles'] = [str(target) for target, _ in outputs]
    except (ReleaseBlocked, OSError, ValueError, subprocess.SubprocessError) as exc:
        report['errors'].append(str(exc))

os.makedirs(os.path.join(WORK, 'reports'), exist_ok=True)
with open(os.path.join(WORK, 'reports', 'assembly-report.json'), 'w', encoding='utf-8') as handle:
    json.dump(report, handle, ensure_ascii=False, indent=1)
print(json.dumps({'errors': report['errors'][:20], 'surahs': {k: {kk: vv for kk, vv in v.items() if kk in ('status', 'words', 'ayahs', 'rules', 'roots', 'verbForms', 'phrases', 'validChunks', 'chunks')} for k, v in report['surahs'].items()}}, ensure_ascii=False, indent=1))
sys.exit(1 if report['errors'] else 0)

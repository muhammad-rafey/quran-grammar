"""Assemble verified chunks + libraries into lesson modules and source inventories.

Usage: python3 -I assemble.py <work-dir> <repo-dir> [--write] [--surah N ...]
Without --write it validates and reports only. Report: <work-dir>/reports/assembly-report.json
"""
import json
import os
import re
import subprocess
import sys
from collections import Counter, OrderedDict, defaultdict

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from emit_ts import emit_lesson  # noqa: E402

WORK, REPO = sys.argv[1], sys.argv[2]
WRITE = '--write' in sys.argv
only = [int(a) for a in sys.argv[3:] if a.isdigit()]
SURAH_META = OrderedDict(
    [
        (18, ('سورۃ الکہف', 'سُورَةُ الْكَهْفِ')),
        (23, ('سورۃ المؤمنون', 'سُورَةُ الْمُؤْمِنُونَ')),
        (32, ('سورۃ السجدہ', 'سُورَةُ السَّجْدَةِ')),
        (36, ('سورۃ یٰسٓ', 'سُورَةُ يسٓ')),
        (55, ('سورۃ الرحمٰن', 'سُورَةُ الرَّحْمٰنِ')),
    ]
)
EXAMPLE_SUFFIX = 'اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔'

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
surahs = [s for s in SURAH_META if not only or s in only]
for s in surahs:
    chunks = [p for p in plan if p['surah'] == s]
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
    variants = {k: dict(v) for k, v in lemma_variants.items() if len(v) > 1}
    verb_lemma_mismatch = []
    for w in words_out:
        m = words_meta[w['id']]
        if m['pos'] == 'verb' and m['verb']['passive'] is False:
            past = lexemes[overrides.get(m['id'], {}).get('lexemeKey', m['lexemeKey'])]['past']
            if w['lemma'] != past:
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
        header = [
            '// AI-assisted Urdu editorial draft; scholarly review pending.',
            f'// Source audit: docs/source-audits/surah-{s}.md',
            "import type { StudyData } from '../types';",
        ]
        ts = emit_lesson(study, f'study{s}', header)
        with open(os.path.join(REPO, 'packages', 'core', 'src', 'lessons', f'surah-{s}.ts'), 'w', encoding='utf-8') as handle:
            handle.write(ts)
        inv = json.load(open(os.path.join(WORK, 'inventory', f'inventory-{s}.json')))
        with open(os.path.join(REPO, 'docs', 'source-audits', f'inventory-{s}.json'), 'w', encoding='utf-8') as handle:
            json.dump(inv, handle, ensure_ascii=False, indent=2)
            handle.write('\n')

os.makedirs(os.path.join(WORK, 'reports'), exist_ok=True)
with open(os.path.join(WORK, 'reports', 'assembly-report.json'), 'w', encoding='utf-8') as handle:
    json.dump(report, handle, ensure_ascii=False, indent=1)
print(json.dumps({'errors': report['errors'][:20], 'surahs': {k: {kk: vv for kk, vv in v.items() if kk in ('status', 'words', 'ayahs', 'rules', 'roots', 'verbForms', 'phrases', 'validChunks', 'chunks')} for k, v in report['surahs'].items()}}, ensure_ascii=False, indent=1))
sys.exit(1 if report['errors'] else 0)

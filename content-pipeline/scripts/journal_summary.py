"""Summarise a workflow journal: per item review/confirm issue counts and unresolved findings.

Usage: python3 -I journal_summary.py <journal.jsonl> [out.json]
"""
import collections
import json
import sys

path = sys.argv[1]
events = [json.loads(line) for line in open(path) if line.strip()]
labels = {e['agentId']: e.get('label', '') for e in events if e.get('type') == 'started'}
results = []
for e in events:
    if e.get('type') != 'result':
        continue
    value = e.get('result')
    if value is None:
        for key in ('value', 'output', 'returnValue'):
            if key in e:
                value = e[key]
                break
    if isinstance(value, str):
        try:
            value = json.loads(value)
        except Exception:
            pass
    results.append((labels.get(e.get('agentId'), '?'), value))

items = collections.OrderedDict()
for label, value in results:
    item, _, stage = label.partition(':')
    items.setdefault(item, {})[stage] = value

summary = {}
for item, stages in items.items():
    row = {}
    for stage, value in stages.items():
        if isinstance(value, dict) and 'issues' in value:
            sev = collections.Counter(i['severity'] for i in value['issues'])
            row[stage] = dict(sev) or 0
            if stage.startswith('confirm'):
                row[stage + '-detail'] = [f"{i['severity']} {i['ref']} {i['field']}: {i['problem'][:140]}" for i in value['issues']]
            if value.get('libraryIssues'):
                row[stage + '-library'] = [f"{x['kind']} {x['key']}: {x['problem'][:160]}" for x in value['libraryIssues']]
        elif isinstance(value, dict) and 'applied' in value:
            row[stage] = {'applied': value['applied'], 'rejected': len(value.get('rejected', [])), 'validatorOk': value.get('validatorOk')}
        elif isinstance(value, dict) and 'validatorOk' in value:
            row[stage] = {'validatorOk': value['validatorOk']}
    summary[item] = row

for item, row in summary.items():
    compact = {k: v for k, v in row.items() if not k.endswith('-detail') and not k.endswith('-library')}
    print(item, json.dumps(compact, ensure_ascii=False))
    for k, v in row.items():
        if k.endswith('-detail') or k.endswith('-library'):
            for x in v:
                print('    ', k, x)
if len(sys.argv) > 2:
    with open(sys.argv[2], 'w', encoding='utf-8') as handle:
        json.dump({'items': summary, 'raw': [{'label': l, 'value': v} for l, v in results]}, handle, ensure_ascii=False, indent=1)

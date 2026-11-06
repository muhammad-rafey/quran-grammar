"""Build deterministic metadata for the five new lessons from open sources.

Usage: python3 -I prepare.py <scratchpad-sources-dir> <work-dir>
Outputs (work-dir/meta): words.json, ayahs.json, plan.json, lexemes.json, roots.json,
tag-inventory.json, existing-rules.json; work-dir/inventory/inventory-<surah>.json
"""
import glob
import html
import json
import os
import re
import sys
from collections import Counter, OrderedDict, defaultdict

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from qac import derive_pos, derive_root, dump, load_qac, stem_root_any, verb_stem  # noqa: E402

SRC, WORK = sys.argv[1], sys.argv[2]
SURAHS = OrderedDict([(18, 110), (23, 118), (32, 30), (36, 83), (55, 78)])
NAMES = {
    18: ('Al-Kahf', 'الكهف'),
    23: ("Al-Mu'minun", 'المؤمنون'),
    32: ('As-Sajdah', 'السجدة'),
    36: ('Ya-Sin', 'يس'),
    55: ('Ar-Rahman', 'الرحمن'),
}
TARGET_WORDS = 30  # chunk size target (ayah-aligned)
MAX_WORDS = 40

meta = os.path.join(WORK, 'meta')
inv_dir = os.path.join(WORK, 'inventory')
os.makedirs(meta, exist_ok=True)
os.makedirs(inv_dir, exist_ok=True)


def strip_html(text):
    text = re.sub(r'<sup[^>]*>.*?</sup>', '', text or '', flags=re.S)
    text = re.sub(r'<br\s*/?>', '\n', text)
    text = re.sub(r'</p>|</h\d>|</li>', '\n', text)
    text = re.sub(r'<[^>]+>', '', text)
    text = html.unescape(text)
    text = re.sub(r'[ \t]+', ' ', text)
    return re.sub(r'\n\s*\n+', '\n', text).strip()


qac = load_qac(os.path.join(SRC, 'qac', 'qac04-lfs.txt'), surahs=set(SURAHS))
fork = defaultdict(list)
for raw in open(os.path.join(SRC, 'qac', 'mustafa0x-quran-morphology.txt'), encoding='utf-8'):
    m = re.match(r'^(\d+):(\d+):(\d+):(\d+)\t([^\t]*)\t([^\t]*)\t([^\t\n]*)', raw)
    if m and int(m.group(1)) in SURAHS:
        fork[f'{m.group(1)}:{m.group(2)}:{m.group(3)}'].append(
            {'form': m.group(5), 'tag': m.group(6), 'features': m.group(7)}
        )

words = OrderedDict()
ayahs = OrderedDict()
problems = []
for surah, count in SURAHS.items():
    vfile = json.load(open(os.path.join(SRC, 'sources', 'qurancom', f'verses-{surah}.json')))
    verses = sorted(vfile['verses'], key=lambda v: v['verse_number'])
    assert [v['verse_number'] for v in verses] == list(range(1, count + 1)), surah
    grammar = json.load(open(os.path.join(SRC, 'sources', 'qac-grammar', f'grammar-{surah}.json')))
    wbw = json.load(open(os.path.join(SRC, 'sources', 'qac-wbw', f'wbw-{surah}.json')))
    tafsir = {}
    for tid, label in ((16, 'muyassarArabic'), (91, 'saadiArabic'), (169, 'ibnKathirEnglishAbridged')):
        data = json.load(open(os.path.join(SRC, 'sources', 'qurancom', f'tafsir-{tid}-{surah}.json')))
        for item in data['tafsirs']:
            key = item.get('verse_key')
            tafsir.setdefault(key, {})[label] = strip_html(item.get('text', ''))
    inventory = []
    excluded_marks = []
    for v in verses:
        n = v['verse_number']
        key = f'{surah}:{n}'
        tokens = [w for w in v['words'] if w['char_type_name'] == 'word']
        ids = []
        for w in tokens:
            wid = f'{surah}:{n}:{w["position"]}'
            if wid not in qac:
                problems.append(f'missing QAC {wid}')
                continue
            segs = qac[wid]
            info = wbw.get(wid, {})
            if not info:
                problems.append(f'missing QAC word-by-word row {wid}')
            pos = derive_pos(segs, info.get('morphology'))
            root = derive_root(segs, pos)
            dropped = stem_root_any(segs) if root is None and stem_root_any(segs) else None
            vs = verb_stem(segs)
            raw_text = w['text_uthmani']
            stored = re.sub(r'(?: [\u06D6-\u06DC\u06E9]+)+$', '', re.sub(r'^\u06DE ', '', raw_text))
            if ' ' in stored or not stored:
                problems.append(f'unexpected whitespace in {wid}: {raw_text!r}')
            if stored != raw_text:
                marks = [t for t in raw_text.split(' ') if t != stored]
                excluded_marks.append({'id': wid, 'apiText': raw_text, 'excludedMark': ' '.join(marks)})
            entry = OrderedDict(
                id=wid,
                surah=surah,
                ayah=n,
                position=w['position'],
                arabic=stored,
                transliteration=(w.get('transliteration') or {}).get('text'),
                glossEnglishQuranCom=(w.get('translation') or {}).get('text'),
                glossEnglishQac=info.get('gloss'),
                qacMorphologyEnglish=info.get('morphology'),
                qacIrabArabic=info.get('irabArabic', []),
                qacSegments=[
                    {k: s[k] for k in s if k not in ('features',)} | {'features': s['features']}
                    for s in segs
                ],
                forkSegments=fork.get(wid, []),
                pos=pos,
                root=root,
                rootWithheldForParticleOrPronoun=dropped,
                lemmaQac=next((s.get('lemmaArabic') for s in segs if s['kind'] == 'STEM' and s.get('lemmaArabic')), None),
                lemmaFork=next(
                    (re.search(r'LEM:([^|]+)', f['features']).group(1) for f in fork.get(wid, []) if 'LEM:' in f['features'] and f['tag'] not in ('P',) and 'PREF' not in f['features'].split('|')[:2]),
                    None,
                ),
                qacMorphologyUrl=f'https://corpus.quran.com/wordmorphology.jsp?location=({wid})',
            )
            if vs is not None:
                entry['verb'] = OrderedDict(
                    lemmaBuckwalter=vs.get('lemmaBuckwalter'),
                    lemmaArabic=vs.get('lemmaArabic'),
                    form=vs.get('verbForm', 'I'),
                    aspect=vs.get('aspect'),
                    passive=bool(vs.get('passive')),
                    mood=vs.get('mood'),
                    png=vs.get('png'),
                    root=vs.get('root'),
                )
                entry['lexemeKey'] = f"{vs.get('lemmaBuckwalter')}|{vs.get('verbForm', 'I')}|{'PASS' if vs.get('passive') else 'ACT'}"
            words[wid] = entry
            ids.append(wid)
            inventory.append({'id': wid, 'arabic': stored})
        translations = {t['resource_id']: strip_html(t['text']) for t in v.get('translations', [])}
        g = grammar.get(str(n), {})
        ayahs[key] = OrderedDict(
            key=key,
            surah=surah,
            ayah=n,
            wordIds=ids,
            textUthmani=' '.join(words[i]['arabic'] for i in ids),
            translationSahihInternational=translations.get(20),
            translationTaqiUsmani=translations.get(84),
            tafsir=tafsir.get(key, {}),
            qacGrammarNotesArabic=g.get('notes', []),
            qacGrammarUrl=g.get('url', f'https://corpus.quran.com/grammar.jsp?chapter={surah}&verse={n}'),
            qacWordByWordUrl=f'https://corpus.quran.com/wordbyword.jsp?chapter={surah}&verse={n}',
            quranComUrl=f'https://quran.com/{surah}/{n}',
        )
    dump(
        os.path.join(inv_dir, f'inventory-{surah}.json'),
        OrderedDict(
            retrievedAt='2026-11-06',
            textSource='Quran.com Content API v4 text_uthmani (end-of-ayah markers excluded); word boundaries and IDs checked against QAC 0.4 morphology',
            sources=[
                f'https://api.quran.com/api/v4/verses/by_chapter/{surah}?words=true&word_fields=text_uthmani&per_page=50'
            ],
            surah=surah,
            ayahCount=count,
            wordCount=len(inventory),
            pauseSignPolicy='Recitation signs that the API separates from a word by a space (waqf signs, the saktah sign, the sajdah sign and the rub al-hizb marker) are excluded from stored word tokens, following the Surahs 110-114 precedent; each exclusion is listed below.',
            words=inventory,
            excludedPauseSigns=excluded_marks,
        ),
    )

# Ibn Kathir (abridged) groups several ayahs; carry the group text forward as a pointer.
for surah in SURAHS:
    last = None
    for n in range(1, SURAHS[surah] + 1):
        t = ayahs[f'{surah}:{n}']['tafsir']
        ik = t.get('ibnKathirEnglishAbridged')
        if ik:
            last = f'{surah}:{n}'
        elif last:
            t['ibnKathirEnglishAbridged'] = f'(covered by the grouped commentary starting at {last})'

# Chunk plan: consecutive whole ayahs, ~30 words each.
plan = []
for surah, count in SURAHS.items():
    current, size, index = [], 0, 1
    for n in range(1, count + 1):
        k = len(ayahs[f'{surah}:{n}']['wordIds'])
        if current and (size + k > MAX_WORDS or size >= TARGET_WORDS):
            plan.append({'chunk': f'{surah}-c{index:02d}', 'surah': surah, 'ayahs': current, 'words': size})
            index += 1
            current, size = [], 0
        current.append(n)
        size += k
    if current:
        prev = plan[-1] if plan and plan[-1]['surah'] == surah else None
        if prev is not None and size < 12 and prev['words'] + size <= 48:
            prev['ayahs'] += current
            prev['words'] += size
        else:
            plan.append({'chunk': f'{surah}-c{index:02d}', 'surah': surah, 'ayahs': current, 'words': size})
for item in plan:
    item['wordIds'] = [i for n in item['ayahs'] for i in ayahs[f"{item['surah']}:{n}"]['wordIds']]

# Verb lexemes and roots with occurrences.
lexemes = OrderedDict()
roots = OrderedDict()
for wid, w in words.items():
    if 'verb' in w:
        key = w['lexemeKey']
        lex = lexemes.setdefault(
            key,
            OrderedDict(
                key=key,
                lemmaArabic=w['verb']['lemmaArabic'],
                lemmaBuckwalter=w['verb']['lemmaBuckwalter'],
                form=w['verb']['form'],
                voice='passive' if w['verb']['passive'] else 'active',
                root=w['verb']['root'],
                occurrences=[],
            ),
        )
        lex['occurrences'].append(
            {
                'id': wid,
                'arabic': w['arabic'],
                'aspect': w['verb']['aspect'],
                'mood': w['verb']['mood'],
                'png': w['verb']['png'],
                'gloss': w['glossEnglishQac'] or w['glossEnglishQuranCom'],
                'qacMorphologyEnglish': w['qacMorphologyEnglish'],
            }
        )
    if w['root']:
        r = roots.setdefault(w['root'], OrderedDict(root=w['root'], surahs=[], lemmas=Counter(), occurrences=[]))
        if w['surah'] not in r['surahs']:
            r['surahs'].append(w['surah'])
        r['lemmas'][w['lemmaQac'] or ''] += 1
        if len(r['occurrences']) < 12:
            r['occurrences'].append({'id': w['id'], 'arabic': w['arabic'], 'pos': w['pos'], 'gloss': w['glossEnglishQac'] or w['glossEnglishQuranCom']})
for r in roots.values():
    r['occurrenceCount'] = sum(r['lemmas'].values())
    r['lemmas'] = [{'lemma': k, 'count': v} for k, v in r['lemmas'].most_common()]

# QAC tag inventory for the rule library.
tags = Counter()
examples = defaultdict(list)
for wid, w in words.items():
    for s in w['qacSegments']:
        label = f"{s['kind']}:{s['tag']}"
        tags[label] += 1
        if len(examples[label]) < 4:
            examples[label].append(f"{wid} {w['arabic']} — {w['qacMorphologyEnglish']}")
    if 'verb' in w:
        for k in ('aspect', 'mood', 'form'):
            if w['verb'].get(k):
                tags[f"VERB:{k}:{w['verb'][k]}"] += 1
        if w['verb']['passive']:
            tags['VERB:passive'] += 1
    for s in w['qacSegments']:
        for d in s.get('derivation', []):
            tags[f'DERIV:{d}'] += 1
        if s.get('case'):
            tags[f"CASE:{s['case']}"] += 1
tag_inventory = [{'tag': k, 'count': v, 'examples': examples.get(k, [])} for k, v in tags.most_common()]

dump(os.path.join(meta, 'words.json'), words)
dump(os.path.join(meta, 'ayahs.json'), ayahs)
dump(os.path.join(meta, 'plan.json'), plan)
dump(os.path.join(meta, 'lexemes.json'), lexemes)
dump(os.path.join(meta, 'roots.json'), roots)
dump(os.path.join(meta, 'tag-inventory.json'), tag_inventory)

pos_counts = Counter(w['pos'] for w in words.values())
print('words', len(words), 'ayahs', len(ayahs), 'chunks', len(plan), 'lexemes', len(lexemes), 'roots', len(roots))
print('pos', dict(pos_counts))
print('verbs', sum(1 for w in words.values() if 'verb' in w))
print('withheld roots (particle/pronoun with QAC root):', sum(1 for w in words.values() if w['rootWithheldForParticleOrPronoun']))
print('chunk sizes', Counter((p['words'] // 10) * 10 for p in plan))
print('problems', len(problems), problems[:10])

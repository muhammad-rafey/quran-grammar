"""Polite fetcher for open reference sources (Quran.com API v4, QAC grammar + word-by-word pages).

Usage: python3 -I fetch_sources.py <pipeline-dir>   (writes <pipeline-dir>/sources; about 10 minutes)
These third-party texts are references only and are git-ignored; never commit them.
"""
import json, os, re, sys, time, urllib.request, html
SP = sys.argv[1]
SURAHS = {18: 110, 23: 118, 32: 30, 36: 83, 55: 78}
UA = 'quran-grammar-source-audit/1.0'
def get(url, binary=False):
    for attempt in range(5):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA})
            with urllib.request.urlopen(req, timeout=60) as r:
                data = r.read()
                return data if binary else data.decode('utf-8', errors='replace')
        except Exception as e:
            print('retry', attempt, url, e, flush=True)
            time.sleep(3 * (attempt + 1))
    raise RuntimeError('failed ' + url)
qc = os.path.join(SP, 'sources', 'qurancom')
for sub in ('qurancom', 'qac-grammar', 'qac-wbw'):
    os.makedirs(os.path.join(SP, 'sources', sub), exist_ok=True)
juzs = os.path.join(qc, 'juzs.json')
if not os.path.exists(juzs):
    open(juzs, 'w').write(get('https://api.quran.com/api/v4/juzs'))
# 1) Verses with words + translations (Sahih Intl 20, Taqi Usmani 84)
for s, n in SURAHS.items():
    out = os.path.join(qc, f'verses-{s}.json')
    if os.path.exists(out): continue
    verses = []
    page = 1
    while True:
        url = f'https://api.quran.com/api/v4/verses/by_chapter/{s}?language=en&words=true&word_fields=text_uthmani,location&translations=20,84&per_page=50&page={page}'
        d = json.loads(get(url))
        verses += d['verses']
        if not d['pagination'].get('next_page'): break
        page += 1
        time.sleep(0.4)
    assert len(verses) == n, (s, len(verses))
    json.dump({'retrievedAt': '2026-11-06', 'source': f'https://api.quran.com/api/v4/verses/by_chapter/{s}?language=en&words=true&word_fields=text_uthmani,location&translations=20,84', 'verses': verses}, open(out, 'w'), ensure_ascii=False)
    print('verses', s, len(verses), flush=True)
# 2) Tafsirs: Ibn Kathir abridged EN (169), Muyassar AR (16), Sa'di AR (91)
for tid in (169, 16, 91):
    for s, n in SURAHS.items():
        out = os.path.join(qc, f'tafsir-{tid}-{s}.json')
        if os.path.exists(out): continue
        items = []
        page = 1
        while True:
            url = f'https://api.quran.com/api/v4/tafsirs/{tid}/by_chapter/{s}?per_page=50&page={page}'
            d = json.loads(get(url))
            items += d.get('tafsirs', [])
            pg = d.get('pagination') or {}
            if not pg.get('next_page'): break
            page += 1
            time.sleep(0.4)
        json.dump({'retrievedAt': '2026-11-06', 'source': f'https://api.quran.com/api/v4/tafsirs/{tid}/by_chapter/{s}', 'tafsirs': items}, open(out, 'w'), ensure_ascii=False)
        print('tafsir', tid, s, len(items), flush=True)
# 3) QAC grammar notes per verse
def clean(t):
    t = re.sub(r'<br\s*/?>', '\n', t)
    t = re.sub(r'<[^>]+>', '', t)
    return html.unescape(t).strip()
gdir = os.path.join(SP, 'sources', 'qac-grammar')
for s, n in SURAHS.items():
    out = os.path.join(gdir, f'grammar-{s}.json')
    data = json.load(open(out)) if os.path.exists(out) else {}
    for v in range(1, n + 1):
        if str(v) in data: continue
        url = f'https://corpus.quran.com/grammar.jsp?chapter={s}&verse={v}'
        h = get(url)
        notes = [clean(x) for x in re.findall(r'<p class="grammarNotes">(.*?)</p>', h, flags=re.S)]
        data[str(v)] = {'url': url, 'notes': notes}
        json.dump(data, open(out, 'w'), ensure_ascii=False, indent=1)
        time.sleep(0.8)
    print('grammar', s, len(data), flush=True)
# 4) QAC word-by-word pages (English gloss, morphology description, Arabic word i'rab)
wdir = os.path.join(SP, 'sources', 'qac-wbw')
for s, n in SURAHS.items():
    out = os.path.join(wdir, f'wbw-{s}.json')
    data = json.load(open(out)) if os.path.exists(out) else {}
    counts = {v['verse_number']: len([w for w in v['words'] if w['char_type_name'] == 'word']) for v in json.load(open(os.path.join(qc, f'verses-{s}.json')))['verses']}
    v = 1
    while v <= n:
        have = [k for k in data if k.startswith(f'{s}:{v}:')]
        if len(have) == counts[v]:
            v += 1; continue
        url = f'https://corpus.quran.com/wordbyword.jsp?chapter={s}&verse={v}'
        h = get(url)
        i = h.find('class="morphologyTable"')
        table = h[i:h.find('</table>', i)]
        rows = re.findall(r'<tr>(.*?)</tr>', table, flags=re.S)
        got = 0
        for row in rows:
            cells = re.findall(r'<td[^>]*>(.*?)</td>', row, flags=re.S)
            if len(cells) < 3: continue
            first = cells[0]
            m = re.search(r'\((\d+):(\d+):(\d+)\)', first)
            if not m: continue
            loc = f'{m.group(1)}:{m.group(2)}:{m.group(3)}'
            parts = [clean(x) for x in re.split(r'<br\s*/?>', first)]
            col3 = cells[2]
            ar = re.findall(r'<div class="arabicGrammar">(.*?)</div>', col3, flags=re.S)
            rootq = re.search(r'qurandictionary\.jsp\?q=([^#"&]+)', first)
            data[loc] = {
                'url': url,
                'translit': parts[1] if len(parts) > 1 else '',
                'gloss': parts[2] if len(parts) > 2 else '',
                'qacRootBuckwalter': html.unescape(rootq.group(1)) if rootq else None,
                'morphology': clean(re.sub(r'<div class="arabicGrammar">.*?</div>', '', col3, flags=re.S)),
                'irabArabic': [clean(x) for x in ar],
            }
            got += 1
        json.dump(data, open(out, 'w'), ensure_ascii=False, indent=1)
        if got == 0:
            raise RuntimeError('no rows parsed at ' + url)
        time.sleep(0.8)
        have = [k for k in data if k.startswith(f'{s}:{v}:')]
        if len(have) != counts[v]:
            # page might start mid-verse; move on only if verse covered
            print('partial verse coverage', s, v, len(have), counts[v], flush=True)
            v += 1
    print('wbw', s, len(data), flush=True)
print('DONE', flush=True)

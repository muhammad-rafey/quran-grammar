"""Fetch the source layer for the whole Quran (Quran.com API v4 + QAC word pages).

Usage: python3 -I fetch.py <full-quran-dir> [--workers N]
Writes <dir>/sources/ (git-ignored). Complete files are reused, so the script resumes.
- Quran.com chapters (names, ayah counts).
- Quran.com verses with words for every chapter: text_uthmani (Madani orthography), text_indopak
  (IndoPak orthography, shown with IndoPak fonts) and Urdu word-by-word (language=ur).
- Quran.com Urdu ayah translations listed in scope.json (`translations`), whole Quran each.
- QAC word-by-word pages (one per ayah): English gloss, English morphology description and the
  Corpus's Arabic i'rab per word.
"""
import concurrent.futures
import datetime
import html
import json
import os
import re
import sys
import time
import urllib.request

WORK = os.path.abspath(sys.argv[1])
WORKERS = int(sys.argv[sys.argv.index('--workers') + 1]) if '--workers' in sys.argv else 4
SCOPE = json.load(open(os.path.join(WORK, 'scope.json'), encoding='utf-8'))
UA = 'quran-grammar-source-audit/1.0'
API = 'https://api.quran.com/api/v4'
SRC = os.path.join(WORK, 'sources')
for sub in ('qurancom', 'qac-wbw'):
    os.makedirs(os.path.join(SRC, sub), exist_ok=True)
today = datetime.date.today().isoformat()


def get(url):
    for attempt in range(6):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA})
            with urllib.request.urlopen(req, timeout=60) as r:
                return r.read().decode('utf-8', errors='replace')
        except Exception as e:  # noqa: BLE001
            print('retry', attempt, url, e, flush=True)
            time.sleep(3 * (attempt + 1))
    raise RuntimeError('failed ' + url)


def save(path, value, indent=None):
    tmp = path + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as handle:
        json.dump(value, handle, ensure_ascii=False, indent=indent)
    os.replace(tmp, path)


def clean(t):
    t = re.sub(r'<br\s*/?>', '\n', t)
    t = re.sub(r'<[^>]+>', '', t)
    return html.unescape(t).strip()


# 1) chapters
chapters_path = os.path.join(SRC, 'qurancom', 'chapters.json')
if not os.path.exists(chapters_path):
    url = f'{API}/chapters?language=ur'
    save(chapters_path, {'retrievedAt': today, 'source': url, 'chapters': json.loads(get(url))['chapters']})
CHAPTERS = {c['id']: c for c in json.load(open(chapters_path, encoding='utf-8'))['chapters']}
assert len(CHAPTERS) == 114 and sum(c['verses_count'] for c in CHAPTERS.values()) == 6236

# 2) ayah translations (one request each returns all 6,236 ayahs in mushaf order)
for t in SCOPE['translations']:
    out = os.path.join(SRC, 'qurancom', f'translation-{t["resourceId"]}.json')
    if os.path.exists(out):
        continue
    url = f'{API}/quran/translations/{t["resourceId"]}?fields=verse_key'
    rows = json.loads(get(url))['translations']
    assert len(rows) == 6236, (t, len(rows))
    save(out, {'retrievedAt': today, 'source': url, 'translations': rows})
    print('translation', t['resourceId'], len(rows), flush=True)


# 3) verses with Urdu word-by-word, whole chapters
def fetch_verses(s):
    out = os.path.join(SRC, 'qurancom', f'verses-{s}-ur.json')
    last = CHAPTERS[s]['verses_count']
    if os.path.exists(out):
        have = json.load(open(out, encoding='utf-8'))
        if max(v['verse_number'] for v in have['verses']) >= last and 'text_indopak' in have['source']:
            return
    verses, page = [], 1
    base = (f'{API}/verses/by_chapter/{s}?language=ur&words=true'
            '&word_fields=text_uthmani,text_indopak,location&per_page=50')
    while True:
        d = json.loads(get(f'{base}&page={page}'))
        verses += d['verses']
        if not d['pagination'].get('next_page'):
            break
        page += 1
        time.sleep(0.2)
    assert [v['verse_number'] for v in verses] == list(range(1, last + 1)), s
    save(out, {'retrievedAt': today, 'source': base, 'verses': verses})
    print('quran.com', s, len(verses), flush=True)


with concurrent.futures.ThreadPoolExecutor(WORKERS) as pool:
    list(pool.map(fetch_verses, range(1, 115)))


# 4) QAC word-by-word pages (one page per ayah)
def parse_wbw(s, v, h, url):
    rows = {}
    i = h.find('class="morphologyTable"')
    table = h[i:h.find('</table>', i)]
    for row in re.findall(r'<tr>(.*?)</tr>', table, flags=re.S):
        cells = re.findall(r'<td[^>]*>(.*?)</td>', row, flags=re.S)
        if len(cells) < 3:
            continue
        m = re.search(r'\((\d+):(\d+):(\d+)\)', cells[0])
        if not m or int(m.group(1)) != s or int(m.group(2)) != v:
            continue
        parts = [clean(x) for x in re.split(r'<br\s*/?>', cells[0])]
        col3 = cells[2]
        rows[f'{s}:{v}:{m.group(3)}'] = {
            'url': url,
            'retrievedAt': today,
            'gloss': parts[2] if len(parts) > 2 else '',
            'morphology': clean(re.sub(r'<div class="arabicGrammar">.*?</div>', '', col3, flags=re.S)),
            'irabArabic': [clean(x) for x in re.findall(r'<div class="arabicGrammar">(.*?)</div>', col3, flags=re.S)],
        }
    return rows


def fetch_qac(s):
    out = os.path.join(SRC, 'qac-wbw', f'wbw-{s}.json')
    data = json.load(open(out, encoding='utf-8')) if os.path.exists(out) else {}
    have = {tuple(map(int, k.split(':')[:2])) for k in data}
    todo = [v for v in range(1, CHAPTERS[s]['verses_count'] + 1) if (s, v) not in have]
    for n, v in enumerate(todo):
        url = f'https://corpus.quran.com/wordbyword.jsp?chapter={s}&verse={v}'
        rows = parse_wbw(s, v, get(url), url)
        if not rows:
            raise RuntimeError(f'no QAC rows for {s}:{v}')
        data.update(rows)
        if n % 20 == 19 or n == len(todo) - 1:
            save(out, data, indent=1)
        time.sleep(0.5)
    if todo:
        print('qac', s, len(todo), 'ayahs', flush=True)


# Longest chapters first so the pool stays busy to the end.
order = sorted(range(1, 115), key=lambda s: -CHAPTERS[s]['verses_count'])
with concurrent.futures.ThreadPoolExecutor(WORKERS) as pool:
    for f in concurrent.futures.as_completed([pool.submit(fetch_qac, s) for s in order]):
        f.result()
print('done', flush=True)

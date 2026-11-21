"""Fetch the source layer for the ayah ranges in scope.json (Quran.com API v4 + QAC word pages).

Usage: python3 -I fetch.py <full-quran-dir>
Writes <dir>/sources/ (git-ignored). Already-fetched files are reused, so the script resumes.
- Quran.com verses with words: text_uthmani, Urdu word-by-word (language=ur) and English
  word-by-word (language=en, reference only).
- QAC word-by-word pages: English morphology description and the Corpus's Arabic i'rab per word.
"""
import datetime
import html
import json
import os
import re
import sys
import time
import urllib.request

WORK = os.path.abspath(sys.argv[1])
SCOPE = json.load(open(os.path.join(WORK, 'scope.json'), encoding='utf-8'))
UA = 'quran-grammar-source-audit/1.0'
SRC = os.path.join(WORK, 'sources')
for sub in ('qurancom', 'qac-wbw'):
    os.makedirs(os.path.join(SRC, sub), exist_ok=True)


def get(url):
    for attempt in range(5):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA})
            with urllib.request.urlopen(req, timeout=60) as r:
                return r.read().decode('utf-8', errors='replace')
        except Exception as e:  # noqa: BLE001
            print('retry', attempt, url, e, flush=True)
            time.sleep(3 * (attempt + 1))
    raise RuntimeError('failed ' + url)


def clean(t):
    t = re.sub(r'<br\s*/?>', '\n', t)
    t = re.sub(r'<[^>]+>', '', t)
    return html.unescape(t).strip()


today = datetime.date.today().isoformat()
for item in SCOPE['ranges']:
    s, last = item['surah'], item['toAyah']
    # 1) Quran.com, one file per language; whole chapter pages up to the last ayah in scope.
    for lang in ('ur', 'en'):
        out = os.path.join(SRC, 'qurancom', f'verses-{s}-{lang}.json')
        have = json.load(open(out, encoding='utf-8')) if os.path.exists(out) else None
        if have and max(v['verse_number'] for v in have['verses']) >= last:
            continue
        verses, page = [], 1
        base = (f'https://api.quran.com/api/v4/verses/by_chapter/{s}?language={lang}&words=true'
                '&word_fields=text_uthmani,location&per_page=50')
        while True:
            d = json.loads(get(f'{base}&page={page}'))
            verses += d['verses']
            if not d['pagination'].get('next_page') or verses[-1]['verse_number'] >= last:
                break
            page += 1
            time.sleep(0.4)
        json.dump({'retrievedAt': today, 'source': base, 'verses': verses},
                  open(out, 'w', encoding='utf-8'), ensure_ascii=False)
        print('quran.com', s, lang, len(verses), flush=True)
    # 2) QAC word-by-word pages (one page per ayah).
    out = os.path.join(SRC, 'qac-wbw', f'wbw-{s}.json')
    data = json.load(open(out, encoding='utf-8')) if os.path.exists(out) else {}
    for v in range(item['fromAyah'], last + 1):
        if any(k.startswith(f'{s}:{v}:') for k in data):
            continue
        url = f'https://corpus.quran.com/wordbyword.jsp?chapter={s}&verse={v}'
        h = get(url)
        i = h.find('class="morphologyTable"')
        table = h[i:h.find('</table>', i)]
        for row in re.findall(r'<tr>(.*?)</tr>', table, flags=re.S):
            cells = re.findall(r'<td[^>]*>(.*?)</td>', row, flags=re.S)
            if len(cells) < 3:
                continue
            m = re.search(r'\((\d+):(\d+):(\d+)\)', cells[0])
            if not m or int(m.group(2)) != v:
                continue
            parts = [clean(x) for x in re.split(r'<br\s*/?>', cells[0])]
            col3 = cells[2]
            data[f'{m.group(1)}:{m.group(2)}:{m.group(3)}'] = {
                'url': url,
                'retrievedAt': today,
                'gloss': parts[2] if len(parts) > 2 else '',
                'morphology': clean(re.sub(r'<div class="arabicGrammar">.*?</div>', '', col3, flags=re.S)),
                'irabArabic': [clean(x) for x in re.findall(r'<div class="arabicGrammar">(.*?)</div>', col3, flags=re.S)],
            }
        json.dump(data, open(out, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
        print('qac', s, v, flush=True)
        time.sleep(0.8)

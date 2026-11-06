"""Download the Quranic Arabic Corpus 0.4 morphology file (verbatim GPL distribution) and the
mustafa0x fork used for cross-checks. Both stay local and git-ignored; they are never bundled.

The official download (https://corpus.quran.com/download/) asks for an e-mail address, so the
pipeline uses a verbatim copy mirrored with Git LFS and verifies its SHA-256.
Usage: python3 -I fetch_qac.py <pipeline-dir>
"""
import hashlib
import os
import sys
import urllib.request

ROOT = sys.argv[1]
OUT = os.path.join(ROOT, 'qac')
os.makedirs(OUT, exist_ok=True)
FILES = [
    (
        'qac04-lfs.txt',
        'https://media.githubusercontent.com/media/AhmedSaadi0/quran-words/main/data/quranic-corpus-morphology-0.4.txt',
        '910b721a8f04f4334ac5d4c62b19e858f5d720c525bb975f2e750ea2c6bb532d',
    ),
    (
        'mustafa0x-quran-morphology.txt',
        'https://raw.githubusercontent.com/mustafa0x/quran-morphology/master/quran-morphology.txt',
        None,
    ),
]
for name, url, sha in FILES:
    path = os.path.join(OUT, name)
    if not os.path.exists(path):
        request = urllib.request.Request(url, headers={'User-Agent': 'quran-grammar-source-audit/1.0'})
        with urllib.request.urlopen(request, timeout=120) as response:
            open(path, 'wb').write(response.read())
    digest = hashlib.sha256(open(path, 'rb').read()).hexdigest()
    if sha and digest != sha:
        raise SystemExit(f'{name}: SHA-256 {digest} does not match the verified copy {sha}')
    print(name, digest)

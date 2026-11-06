"""Export pending, AI-reviewed lessons as an offline scholarly review bundle.

Usage: python3 -I review_bundle.py <pipeline-dir> --output <repo>/build/review/quran-grammar [--surah N ...]
Defaults to all five expansion Surahs. Never writes runtime modules or approvals.
"""
import argparse
import base64
import hashlib
from html import escape
import json
import os
from pathlib import Path
import stat
import subprocess
import sys
import tempfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from release_gate import ReleaseBlocked, content_digest


NAMES = {18: 'Al-Kahf', 23: "Al-Mu’minun", 32: 'As-Sajdah', 36: 'Ya-Sin', 55: 'Ar-Rahman'}
COUNTS = {18: (110, 1579), 23: (118, 1050), 32: (30, 372), 36: (83, 725), 55: (78, 351)}
NOTICE = 'AI draft — scholarly review pending'
NOTICE_URDU = 'مصنوعی ذہانت کا تیار کردہ مسودہ — علمی و شرعی ماہر کا جائزہ باقی ہے'
# Fixed repository assets only: never glob/copy arbitrary source files into a bundle.
FONTS = (
    ('Amiri', 'amiri-quran.ttf', 'OFL-Amiri.txt'),
    ('Naskh', 'naskh.ttf', 'OFL-Naskh.txt'),
    ('Nastaliq', 'nastaliq.ttf', 'OFL-Nastaliq.txt'),
)
STYLE = """
*{box-sizing:border-box}body{margin:0;background:#f6f5ef;color:#182d28;font:17px/1.7 system-ui,sans-serif}
main{max-width:1050px;margin:auto;padding:1.5rem}.hold{position:sticky;top:0;z-index:10;background:#fff0bf;
border-bottom:2px solid #886614;padding:.65rem 1rem;text-align:center}.hold strong{display:block}
.urdu{direction:rtl;text-align:right;font-family:Nastaliq,Naskh,'Noto Nastaliq Urdu','Urdu Typesetting',serif;line-height:2.3}
.arabic{direction:rtl;text-align:right;font-family:Amiri,Naskh,'Traditional Arabic',serif;font-size:1.65rem;line-height:2}
a{color:#145f57}nav a{display:inline-block;margin:.2rem .4rem}section,article,details{border:1px solid #ccd6cb;
border-radius:.5rem;background:white;padding:1rem;margin:1rem 0}summary{cursor:pointer}summary .meaning{display:block}
h1,h2,h3{line-height:1.5}.id{direction:ltr;unicode-bidi:isolate;font:14px/1.5 monospace;color:#52655b}
table{width:100%;border-collapse:collapse}td,th{border-bottom:1px solid #ddd;padding:.4rem;text-align:right}
.font-licenses pre{white-space:pre-wrap;overflow-wrap:anywhere;font:13px/1.5 monospace}
:target{scroll-margin-top:8rem;outline:2px solid #8a6f1f}.links{direction:ltr;text-align:left}
@media print{.hold{position:static}details{break-inside:avoid}nav{display:none}}
"""


def read_json(path):
    return json.loads(path.read_text(encoding='utf-8'))


def current_review_inputs(work, chunks):
    """Use the runner's exact fingerprints, without starting any model job."""
    result = subprocess.run(
        ['node', str(work / 'scripts/run_chunks.mjs'), '--work', str(work),
         '--chunks', ','.join(chunks), '--dry-run'],
        capture_output=True, text=True, timeout=60,
    )
    if result.returncode:
        raise ValueError('Cannot verify current review inputs; rebuild packets before exporting')
    try:
        data = json.loads(result.stdout)
        rows = data['chunks']
        if data.get('dryRun') is not True or [row['chunk'] for row in rows] != chunks:
            raise ValueError('Incomplete review input fingerprints')
        return {row['chunk']: row['hashes'] for row in rows}
    except (ValueError, KeyError, TypeError) as exc:
        raise ValueError('Invalid review input fingerprints') from exc


def h(value):
    return escape(str(value), quote=True)


def embedded_fonts(repo):
    """Embed original licensed bytes so file:// readers need no CORS or network access."""
    directory = repo / 'apps/web/public/fonts'
    if not directory.exists() and not directory.is_symlink():
        # Synthetic test fixtures/standalone copies may omit all application assets.
        return '', '', {}
    css, notices, files = [], [], {}
    for family, filename, license_name in FONTS:
        font_path, license_path = directory / filename, directory / license_name
        for target in (font_path, license_path):
            for path in (target, *target.parents):
                if path == repo:
                    break
                if path.is_symlink():
                    raise ValueError(f'Refusing font asset symlink: {path}')
        data = font_path.read_bytes()
        license_bytes = license_path.read_bytes()
        license_text = license_bytes.decode('utf-8')
        if not data.startswith(b'\x00\x01\x00\x00'):
            raise ValueError(f'Expected original TrueType font: {filename}')
        if 'SIL OPEN FONT LICENSE Version 1.1' not in license_text or 'Copyright' not in license_text:
            raise ValueError(f'Missing font copyright/OFL notice: {license_name}')
        encoded = base64.b64encode(data).decode('ascii')
        css.append(f"@font-face{{font-family:{family};src:url(data:font/ttf;base64,{encoded}) format('truetype');"
                   "font-style:normal;font-weight:400;font-display:swap}")
        # Preserve copyright and license with every self-contained HTML copy too.
        notices.append(f'<h3>{h(family)}</h3><pre>{h(license_text)}</pre>')
        files[f'font-licenses/{license_name}'] = license_bytes
    license_html = ('<details class="font-licenses"><summary>Embedded font copyrights and licenses</summary>'
                    '<p>Original, unmodified project fonts; SIL Open Font License 1.1.</p>' +
                    ''.join(notices) + '</details>')
    return '\n'.join(css), license_html, files


def paragraph(label, value, arabic=False):
    return f'<p><strong>{h(label)}:</strong> <span class="{"arabic" if arabic else "urdu"}">{h(value)}</span></p>'


def page(title, body, font_css='', font_licenses=''):
    return (
        '<!doctype html><html lang="en"><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1">'
        '<meta http-equiv="Content-Security-Policy" content="default-src \'none\'; style-src \'unsafe-inline\'; '
        'font-src data:; base-uri \'none\'; form-action \'none\'">'
        f'<title>{h(title)} — {h(NOTICE)}</title><style>{font_css}\n{STYLE}</style>'
        f'<body><aside class="hold"><strong>{h(NOTICE)}</strong>'
        f'<span class="urdu" lang="ur" dir="rtl">{h(NOTICE_URDU)}</span></aside>'
        f'<main>{body}{font_licenses}</main></body></html>\n'
    )


def word_anchor(word_id):
    return 'word-' + word_id.replace(':', '-')


def render_surah(study, source_ayahs, font_css='', font_licenses=''):
    number = study['surah']['number']
    words = {w['id']: w for w in study['words']}
    rules = {r['id']: r for r in study['rules']}
    rule_anchors = {rid: f'rule-{i}' for i, rid in enumerate(rules)}
    by_ayah = {}
    for word in study['words']:
        by_ayah.setdefault(word['ayah'], []).append(word)
    parts = [f'<nav><a href="index.html">Review index</a> · <a href="surah-{number}.json">Pending JSON</a> · '
             f'<a href="inventory-{number}.json">Arabic inventory</a> · '
             f'<a href="source-audits/surah-{number}.md">Source audit</a></nav>',
             f'<h1>Surah {number} — {h(NAMES[number])}</h1>',
             f'<p class="arabic">{h(study["surah"]["nameArabic"])}</p>',
             f'<p>{len(study["ayahs"])} ayahs · {len(words)} words. Open each word for its lesson.</p>',
             '<nav aria-label="Ayahs">' + ' '.join(
                 f'<a href="#ayah-{number}-{a["number"]}">{a["number"]}</a>' for a in study['ayahs']) + '</nav>']
    for ayah in study['ayahs']:
        n = ayah['number']
        parts += [f'<section id="ayah-{number}-{n}"><h2>Ayah {number}:{n}</h2>',
                  f'<p class="arabic" lang="ar">{h(source_ayahs[f"{number}:{n}"]["textUthmani"])}</p>',
                  '<div class="urdu" lang="ur">', paragraph('ترجمہ', ayah['translationUrdu']),
                  paragraph('موضوع', ayah['themeUrdu']), paragraph('مختصر تفسیر', ayah['tafsirUrdu']),
                  '<h3>تراکیب</h3>']
        for phrase in ayah['phrases']:
            links = ' '.join(f'<a href="#{h(word_anchor(wid))}">{h(words[wid]["arabic"])}</a>' for wid in phrase['wordIds'])
            parts += [f'<p><strong>{h(phrase["labelUrdu"])}</strong><br><span class="arabic">{links}</span><br>'
                      f'{h(phrase["explanationUrdu"])}</p>']
        parts += ['<h3>لفظ بہ لفظ</h3>']
        for word in by_ayah[n]:
            wid = word['id']
            parts += [f'<details id="{h(word_anchor(wid))}"><summary><span class="id">{h(wid)}</span> '
                      f'<span class="arabic">{h(word["arabic"])}</span>'
                      f'<span class="meaning">{h(word["meaningUrdu"])}</span></summary>',
                      paragraph('بنیادی لفظ', word['lemma'], True), paragraph('قسم', word['posUrdu']),
                      paragraph('صرف', word['morphologyUrdu']), paragraph('نحو', word['syntaxUrdu']),
                      paragraph('لغوی وضاحت', word['dictionaryUrdu']),
                      '<table><thead><tr><th>جز</th><th>کردار</th><th>معنی</th></tr></thead><tbody>']
            for segment in word['segments']:
                parts += [f'<tr><td class="arabic">{h(segment["arabic"])}</td>'
                          f'<td>{h(segment["roleUrdu"])}</td><td>{h(segment["meaningUrdu"])}</td></tr>']
            links = ' · '.join(f'<a href="#{rule_anchors[rid]}">{h(rules[rid]["titleUrdu"])}</a>' for rid in word['ruleIds'])
            parts += [f'</tbody></table><p><strong>قواعد:</strong> {links}</p>']
            root = word['root']
            if root:
                entry = study['roots'][root]
                parts += [paragraph('مادہ', root, True), paragraph('مادے کا معنی', entry['meaningUrdu']),
                          paragraph('مادے کی وضاحت', entry['noteUrdu'])]
            if wid in study['verbForms']:
                verb = study['verbForms'][wid]
                for label, key in [('باب', 'baabUrdu'), ('بناوٹ', 'formUrdu'), ('ماضی', 'past'),
                                   ('مضارع', 'present'), ('وزن', 'pattern'), ('صیغے کی وضاحت', 'noteUrdu')]:
                    parts += [paragraph(label, verb[key], key in ('past', 'present', 'pattern'))]
            parts += ['</details>']
        parts += ['</div></section>']
    parts += ['<section class="urdu" lang="ur"><h2>قواعد کے کارڈ</h2>']
    for rid, rule in rules.items():
        parts += [f'<article id="{rule_anchors[rid]}"><h3>{h(rule["titleUrdu"])}</h3>',
                  f'<p>{h(rule["explanationUrdu"])}</p><p>{h(rule["exampleUrdu"])}</p></article>']
    parts += ['</section><p>Morphology credit: Quranic Arabic Corpus, Kais Dukes. '
              '<a href="https://corpus.quran.com/" rel="noreferrer">Corpus credit and terms</a>. '
              'This file loads no external scripts, fonts or resources.</p>']
    return page(f'Surah {number} — {NAMES[number]}', ''.join(parts), font_css, font_licenses)


def checked_output(work, requested):
    repo = work.parent
    allowed = repo / 'build/review/quran-grammar'
    output = Path(os.path.abspath(requested.expanduser()))
    if not output.is_relative_to(allowed):
        raise ValueError(f'Output must be inside {allowed}; apps, packages and other destinations are refused')
    return output, repo


def no_output_symlinks(repo, output, filenames):
    for relative in [Path('.'), *map(Path, filenames)]:
        target = output / relative
        for path in [target, *target.parents]:
            if path == repo:
                break
            if path.is_symlink():
                raise ValueError(f'Refusing output symlink: {path}')


def no_unexpected_output_files(output, filenames):
    """Never carry unrelated files into a reviewer folder that may be shared."""
    allowed = set(filenames)
    if not output.exists():
        return

    def unreadable(error):
        raise ValueError('Cannot inspect existing review output; no files changed') from error

    for parent, directories, existing_files in os.walk(output, followlinks=False, onerror=unreadable):
        for name in directories:
            if (Path(parent) / name).is_symlink():
                raise ValueError('Refusing an existing output directory symlink')
        for name in existing_files:
            path = Path(parent) / name
            if (not stat.S_ISREG(path.lstat().st_mode) or
                    path.relative_to(output).as_posix() not in allowed):
                raise ValueError('Unexpected existing file in review output; no files changed')


def export(work, output, selected):
    work = work.resolve()
    if (work / 'runs/codex/.runner.lock').exists():
        raise ValueError('Wait for the active chunk runner before exporting a review bundle')
    output, repo = checked_output(work, output)
    manifest = read_json(work / 'review-status.json')
    source_ayahs = read_json(work / 'meta/ayahs.json')
    plan = read_json(work / 'meta/plan.json')
    expected_inputs = current_review_inputs(work, [spec['chunk'] for spec in plan if spec['surah'] in selected])
    font_css, font_licenses, files = embedded_fonts(repo)
    records, links = {}, []
    for number in selected:
        wrapper_path = work / f'drafts/surah-{number}.json'
        wrapper = read_json(wrapper_path)
        if wrapper.get('reviewStatus') != 'scholarly-review-pending' or manifest['surahs'][str(number)]['status'] != 'pending':
            raise ValueError(f'Surah {number}: expected pending wrapper and scholarly-review manifest')
        study = wrapper['study']
        ayahs, word_count = COUNTS[number]
        if (study['surah']['number'] != number or len(study['words']) != word_count or
                [a['number'] for a in study['ayahs']] != list(range(1, ayahs + 1))):
            raise ValueError(f'Surah {number}: incomplete or mismatched draft')
        chunks = [spec for spec in plan if spec['surah'] == number]
        if not chunks or [wid for c in chunks for wid in c['wordIds']] != [w['id'] for w in study['words']]:
            raise ValueError(f'Surah {number}: draft does not match planned word coverage')
        for chunk in chunks:
            checkpoint = read_json(work / f'runs/codex/{chunk["chunk"]}.json')
            content = (work / f'chunks/{number}/{chunk["chunk"]}.json').read_bytes()
            if (checkpoint.get('status') != 'ai-reviewed' or checkpoint.get('result', {}).get('status') != 'ai-reviewed' or
                    checkpoint.get('contentHash') != hashlib.sha256(content).hexdigest()):
                raise ValueError(f'{chunk["chunk"]}: current chunk AI review is incomplete')
            if checkpoint.get('hashes') != expected_inputs[chunk['chunk']]:
                raise ValueError(f'{chunk["chunk"]}: review inputs changed; fresh AI reviews required')
        if wrapper.get('contentSha256') != content_digest(work, number):
            raise ValueError(f'Surah {number}: stale draft digest; reassemble before exporting')
        inventory_path = work / f'drafts/inventory-{number}.json'
        inventory = read_json(inventory_path)
        if ([(w['id'], w['arabic']) for w in inventory['words']] !=
                [(w['id'], w['arabic']) for w in study['words']]):
            raise ValueError(f'Surah {number}: inventory differs from draft Arabic')
        files[f'surah-{number}.html'] = render_surah(study, source_ayahs, font_css, font_licenses).encode('utf-8')
        files[f'surah-{number}.json'] = wrapper_path.read_bytes()
        files[f'inventory-{number}.json'] = inventory_path.read_bytes()
        files[f'source-audits/surah-{number}.md'] = (repo / f'docs/source-audits/surah-{number}.md').read_bytes()
        records[str(number)] = {'nameEnglish': NAMES[number], 'aiReviewComplete': True,
                                'scholarlyReview': 'pending', 'contentSha256': wrapper['contentSha256']}
        links += [f'<li><a href="surah-{number}.html">Surah {number} — {h(NAMES[number])}</a> '
                  f'({ayahs} ayahs, {word_count} words)</li>']
    files['review-status.json'] = (work / 'review-status.json').read_bytes()
    files['README.txt'] = (
        f'{NOTICE}\n{NOTICE_URDU}\n\nOpen index.html locally; no server or internet is needed.\n'
        'Review exact Arabic, Urdu explanations, word grammar, rules, roots and paradigms.\n'
        'Record corrections with Surah/ayah/word IDs. JSON and public source audits accompany each lesson.\n'
        'AI review is complete for these selected snapshots; qualified human scholarly approval is still pending.\n'
        'This bundle neither records approval nor changes the live app. Use the repository review process\n'
        'to apply corrections, rerun checks and bind scholarly approval to the final content digest.\n'
        + ('\nOriginal project fonts are embedded in each HTML page for offline Arabic/Urdu reading.\n'
           'Their copyright notices and SIL OFL 1.1 licenses are included in each page and font-licenses/.\n'
           if font_css else '')
    ).encode('utf-8')
    files['index.html'] = page('Quran Grammar scholarly review', '<h1>Quran Grammar scholarly review</h1>'
        '<p>Offline AI-assisted drafts for human review. Each chapter remains outside the live app.</p><ul>' +
        ''.join(links) + '</ul><p><a href="README.txt">Review instructions</a> · '
        '<a href="review-status.json">Scholarly review manifest</a> · '
        '<a href="bundle-manifest.json">Bundle fingerprints</a></p>', font_css, font_licenses).encode('utf-8')
    bundle_manifest = {'schemaVersion': 1, 'reviewStatus': 'scholarly-review-pending', 'aiReviewComplete': True,
                       'completeFiveSurahBundle': selected == list(NAMES), 'surahs': records,
                       'filesSha256': {name: hashlib.sha256(data).hexdigest() for name, data in sorted(files.items())}}
    files['bundle-manifest.json'] = (json.dumps(bundle_manifest, ensure_ascii=False, indent=2) + '\n').encode('utf-8')
    if (work / 'runs/codex/.runner.lock').exists():
        raise ValueError('Chunk runner became active during review export')
    no_output_symlinks(repo, output, files)
    no_unexpected_output_files(output, files)
    for name, data in sorted(files.items()):
        target = output / name
        target.parent.mkdir(parents=True, exist_ok=True)
        # Replacing an owned output must not follow an existing hard link either.
        with tempfile.NamedTemporaryFile(dir=target.parent, prefix='.review-', delete=False) as handle:
            temporary = Path(handle.name)
            handle.write(data)
        try:
            os.replace(temporary, target)
        finally:
            temporary.unlink(missing_ok=True)
    return {'output': str(output), 'surahs': selected, 'files': len(files), 'reviewStatus': 'scholarly-review-pending'}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('work_dir', type=Path)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--surah', type=int, choices=NAMES, nargs='+')
    args = parser.parse_args()
    selected = [n for n in NAMES if not args.surah or n in args.surah]
    try:
        result = export(args.work_dir, args.output, selected)
    except (OSError, ValueError, KeyError, TypeError, subprocess.TimeoutExpired, ReleaseBlocked) as exc:
        print(json.dumps({'error': str(exc), 'runtimeWritten': False}, ensure_ascii=False))
        return 1
    print(json.dumps(result, ensure_ascii=False))
    return 0


if __name__ == '__main__':
    sys.exit(main())

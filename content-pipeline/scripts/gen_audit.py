"""Generate docs/source-audits/surah-<n>.md for the five new lessons from the work records.

Usage: python3 -I gen_audit.py <work-dir> <repo-dir> [<chunk-results.json>]
"""
import json
import hashlib
import os
import sys
import tempfile
from collections import Counter, defaultdict
from pathlib import Path

WORK, REPO = sys.argv[1], sys.argv[2]
RESULTS = sys.argv[3] if len(sys.argv) > 3 else None
NAMES = {18: 'Al-Kahf', 23: "Al-Mu'minun", 32: 'As-Sajdah', 36: 'Ya-Sin', 55: 'Ar-Rahman'}
SLUGS = {18: 'al-kahf', 23: 'al-muminun', 32: 'as-sajdah', 36: 'ya-sin', 55: 'ar-rahman'}
QAC_SHA = '910b721a8f04f4334ac5d4c62b19e858f5d720c525bb975f2e750ea2c6bb532d'

meta = os.path.join(WORK, 'meta')
plan = json.load(open(os.path.join(meta, 'plan.json')))
words = json.load(open(os.path.join(meta, 'words.json')))
ayahs = json.load(open(os.path.join(meta, 'ayahs.json')))
overrides = {key: value for key, value in json.load(open(os.path.join(meta, 'overrides.json'))).items()
             if not key.startswith('_')}


def blocked(message):
    raise SystemExit(f'Audit generation blocked: {message}')


def nonnegative_integer(value):
    return type(value) is int and value >= 0


def validate_result(result, spec):
    """Check the completed workflow result, not a partial journal summary."""
    name = spec['chunk']
    if not isinstance(result, dict) or result.get('chunk') != name:
        blocked(f'{name}: malformed workflow result')
    if result.get('status') != 'ai-reviewed':
        blocked(f'{name}: result is not AI-reviewed')
    for key in ('blockingReasons', 'libraryIssues'):
        if not isinstance(result.get(key), list) or result[key]:
            blocked(f'{name}: unresolved or malformed {key}')
    authored = result.get('authored')
    if (not isinstance(authored, dict) or authored.get('validatorOk') is not True or
            not spec['wordIds'] or not spec['ayahs'] or
            type(authored.get('words')) is not int or authored['words'] != len(spec['wordIds']) or
            type(authored.get('ayahs')) is not int or authored['ayahs'] != len(spec['ayahs'])):
        blocked(f'{name}: missing validated author scope')
    for key in ('reviewIssues', 'reviewCritical', 'reviewMajor'):
        if not nonnegative_integer(result.get(key)):
            blocked(f'{name}: malformed {key}')
    if result['reviewCritical'] + result['reviewMajor'] > result['reviewIssues']:
        blocked(f'{name}: review severity counts exceed findings')
    fixed = result.get('fix1')
    if (not isinstance(fixed, dict) or fixed.get('validatorOk') is not True or
            not nonnegative_integer(fixed.get('applied')) or not nonnegative_integer(fixed.get('rejected'))):
        blocked(f'{name}: missing validated first-fix summary')
    if result['reviewIssues'] == 0 and (fixed['applied'] or fixed['rejected']):
        blocked(f'{name}: first-fix counts contradict an empty independent review')
    confirms = result.get('confirms')
    if not isinstance(confirms, list) or not confirms:
        blocked(f'{name}: no final confirmation')
    for index, confirm in enumerate(confirms, 1):
        if (not isinstance(confirm, dict) or type(confirm.get('round')) is not int or
                confirm['round'] != index or not isinstance(confirm.get('issues'), list)):
            blocked(f'{name}: malformed confirmation round')
        for issue in confirm['issues']:
            if (not isinstance(issue, dict) or issue.get('severity') not in ('critical', 'major', 'minor') or
                    any(not isinstance(issue.get(key), str) or not issue[key].strip()
                        for key in ('ref', 'field'))):
                blocked(f'{name}: malformed confirmation finding')
        if not confirm['issues'] and index != len(confirms):
            blocked(f'{name}: unexpected rounds after clean confirmation')
    if confirms[-1]['issues']:
        blocked(f'{name}: final confirmation has unresolved findings')
    last_fix = result.get('finalFix')
    if len(confirms) > 1 or last_fix is not None:
        if (not isinstance(last_fix, dict) or last_fix.get('validatorOk') is not True or
                not nonnegative_integer(last_fix.get('applied')) or not isinstance(last_fix.get('rejected'), list)):
            blocked(f'{name}: malformed or unvalidated final fix')


def load_results(path):
    if path is None:
        return {}
    try:
        supplied = json.load(open(path, encoding='utf-8'))
    except (OSError, ValueError) as exc:
        blocked(f'cannot read the supplied result snapshot: {exc}')
    if isinstance(supplied, dict):
        supplied = supplied.get('results')
    if not isinstance(supplied, list):
        blocked('result snapshot must be a list or an object containing a results list')
    expected = {spec['chunk']: spec for spec in plan}
    if len(expected) != len(plan) or {spec['surah'] for spec in plan} != set(NAMES):
        blocked('plan must contain unique chunks for all five Surahs')
    found = {}
    for row in supplied:
        if not isinstance(row, dict):
            blocked('malformed result row')
        checkpoint = 'result' in row
        result = row.get('result') if checkpoint else row
        if not isinstance(result, dict) or result.get('chunk') not in expected:
            blocked('result snapshot contains an unknown or malformed chunk')
        name = result['chunk']
        if name in found:
            blocked(f'{name}: duplicate result row')
        if checkpoint and (row.get('status') != 'ai-reviewed' or row.get('chunk') != name):
            blocked(f'{name}: checkpoint is not a matching AI-reviewed result')
        validate_result(result, expected[name])
        # Runner checkpoints bind review completion to the current file bytes.
        # A bare workflow result can still be reported as a supplied snapshot,
        # but is never silently upgraded to a byte-bound checkpoint.
        content_hash = row.get('contentHash', row.get('contentSha256'))
        if checkpoint and content_hash is None:
            blocked(f'{name}: checkpoint lacks reviewed content hash')
        if content_hash is not None:
            file = Path(chunk_file(expected[name]))
            if (not isinstance(content_hash, str) or
                    hashlib.sha256(file.read_bytes()).hexdigest() != content_hash):
                blocked(f'{name}: chunk bytes differ from the supplied reviewed hash')
        found[name] = result
    missing = sorted(set(expected) - set(found))
    if missing:
        blocked(f'missing completed results for {", ".join(missing)}')
    return found


def chunk_file(spec):
    return os.path.join(WORK, 'chunks', str(spec['surah']), f"{spec['chunk']}.json")


# Derive the same app types used by packets, validation and held assembly.
words_effective = {}
for wid, word in words.items():
    fix = overrides.get(wid, {})
    pos = fix.get('pos', word['pos'])
    if pos not in ('noun', 'adjective', 'verb', 'particle', 'pronoun'):
        blocked(f'{wid}: invalid effective word type override')
    if pos == 'verb' and 'pos' in fix and (not isinstance(word.get('verb'), dict) or
            not all(key in word['verb'] for key in ('form', 'aspect', 'passive', 'png')) or
            not isinstance(fix.get('lexemeKey', word.get('lexemeKey')), str)):
        blocked(f'{wid}: verb type override lacks morphology/paradigm')
    words_effective[wid] = dict(word, pos=pos)

results = load_results(RESULTS)
# Count the reviewed library itself, including adjudicated splits; raw metadata
# can deliberately retain the Corpus's merged or erroneous lookup identifiers.
reviewed_lexemes = {}
for path in sorted((Path(WORK) / 'libs' / 'lexemes').glob('*.json')):
    for entry in json.loads(path.read_text(encoding='utf-8'))['entries']:
        if entry['key'] in reviewed_lexemes:
            blocked(f'duplicate shared lexeme key: {entry["key"]}')
        reviewed_lexemes[entry['key']] = entry
if not reviewed_lexemes:
    blocked('shared verb-paradigm library is missing or empty')
outputs = {}


for surah, name in NAMES.items():
    chunks = [p for p in plan if p['surah'] == surah]
    inv = json.load(open(os.path.join(WORK, 'inventory', f'inventory-{surah}.json')))
    surah_words = [w for w in words_effective.values() if w['surah'] == surah]
    surah_ayahs = [a for a in ayahs.values() if a['surah'] == surah]
    per_ayah = [len(a['wordIds']) for a in sorted(surah_ayahs, key=lambda a: a['ayah'])]
    pos = Counter(w['pos'] for w in surah_words)
    verbs = [w for w in surah_words if w['pos'] == 'verb']
    forms = Counter(overrides.get(w['id'], {}).get('verbForm', w['verb']['form']) for w in verbs)
    passive = sum(1 for w in verbs if overrides.get(w['id'], {}).get('passive', w['verb']['passive']))
    roots = {w['root'] for w in surah_words if w['root']}
    no_root_nouns = sorted({(w['arabic'], w['lemmaQac'] or '') for w in surah_words if w['pos'] in ('noun', 'adjective') and not w['root']})
    empty_notes = [a['ayah'] for a in surah_ayahs if not any(n.strip() for n in a['qacGrammarNotesArabic'])]
    notes = defaultdict(list)
    review = Counter()
    for spec in chunks:
        data = json.load(open(chunk_file(spec)))
        for note in data.get('auditNotes', []):
            notes[spec['chunk']].append(note)
        r = results.get(spec['chunk'])
        if r:
            review['chunks'] += 1
            review['issues'] += r.get('reviewIssues', 0)
            review['critical'] += r.get('reviewCritical', 0)
            review['major'] += r.get('reviewMajor', 0)
            review['applied'] += (r.get('fix1') or {}).get('applied', 0)
            review['rejected'] += (r.get('fix1') or {}).get('rejected', 0)
            for c in r.get('confirms', []):
                review['confirmIssues'] += len(c.get('issues', []))
    lines = []
    out = lines.append
    out(f'# Surah {surah} — {name}: source audit')
    out('')
    out(
        f"Researched 2026-11-06. This lesson contains **{len(surah_ayahs)} ayahs and {len(surah_words):,} word occurrences**. "
        'All Urdu word glosses, translations, grammatical explanations, dictionary summaries, verb-paradigm notes and concise tafsir notes are original AI-assisted editorial drafts. '
        'They are **not scholar-reviewed** and are not attributed to a named Urdu translator. No third-party Urdu book, dictionary, translation or tafsir was imported.'
    )
    out('')
    out('## Arabic inventory')
    out('')
    out(
        f'`inventory-{surah}.json` records the Quran.com Content API v4 `text_uthmani` word strings '
        f'([source](https://api.quran.com/api/v4/verses/by_chapter/{surah}?words=true&word_fields=text_uthmani&per_page=50)), retrieved 2026-11-06, excluding end-of-ayah markers. '
        'Recitation signs that the API separates from a word by a space — waqf signs, the saktah sign, the sajdah sign and the rub al-hizb marker — are not part of the stored word token, following the Surahs 110–114 precedent. '
        f"The inventory lists all {len(inv['excludedPauseSigns'])} such exclusions with the original API text; no other character was changed. "
        'The unnumbered opening basmalah is not inserted as a numbered occurrence. Automated tests compare every stored word, its id and its segments with this inventory.'
    )
    out('')
    out(
        'Word boundaries and counts match the Quranic Arabic Corpus morphology for every ayah. Per-ayah word counts: '
        + ', '.join(str(n) for n in per_ayah)
        + '.'
    )
    out('')
    out('## Sources and method')
    out('')
    out(
        f'- **Morphology:** Quranic Arabic Corpus morphology 0.4 (Kais Dukes, GNU GPL with the Corpus terms of use), a verbatim distribution checked by SHA-256 `{QAC_SHA}`. '
        'It was consulted locally for segmentation, part of speech, root, lemma, verb form, voice, mood and case; it is not bundled or redistributed.'
    )
    out(
        '- **Word types and roots** are derived deterministically from the Corpus stem tags with the mapping that reproduces all 230 roots of the existing lessons. '
        'A preposition with an attached pronoun (لَهُ، بِهِ، عَلَيْهِمْ) is a particle, following Surahs 1, 105 and 112. Words without a Corpus root, such as proper names, keep no root.'
    )
    out(
        '- **Syntax:** the Corpus word-by-word pages (English morphology and Arabic i‘rab for every word) and verse grammar pages (Arabic i‘rab notes adapted from the Quran Printing Complex), retrieved 2026-11-06. '
        + (f"{len(empty_notes)} of {len(surah_ayahs)} verse pages carry no grammar note: {', '.join(str(n) for n in empty_notes)}." if empty_notes else f'All {len(surah_ayahs)} verse pages carry a grammar note.')
    )
    out(
        f'- **Verb paradigms** (باب، ماضی، مضارع، وزن) for all {len(verbs)} verb occurrences come from a shared library of {len(reviewed_lexemes)} verb lexemes for the five new lessons. '
        'Form I vowel classes were decided from imperfects attested across the whole Corpus and standard lexica (Lane, Lisan al-Arab, al-Mu‘jam al-Wasit), and every entry was independently reviewed.'
    )
    out(
        '- **Tafsir consulted** through the Quran.com API: Tafsir al-Muyassar (Arabic), Tafsir al-Sa‘di (Arabic) and Ibn Kathir (abridged, English). '
        'Translations consulted for meaning only: Saheeh International and Mufti Taqi Usmani. The Urdu wording is original and concise; it is not a translation of these works.'
    )
    out('')
    out('Word-type, verb-form and passive-voice counts below apply the adjudicated occurrence overrides; they are not uncorrected Corpus tag counts.')
    out('')
    out('| Measure | Count |')
    out('| --- | ---: |')
    for label, value in [
        ('Nouns', pos['noun']),
        ('Adjectives', pos['adjective']),
        ('Verbs', pos['verb']),
        ('Particles', pos['particle']),
        ('Pronouns', pos['pronoun']),
        ('Passive verb occurrences', passive),
        ('Distinct roots', len(roots)),
    ] + [(f'Verb form {k}', v) for k, v in sorted(forms.items(), key=lambda kv: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'].index(kv[0]) if kv[0] in ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'] else 99)]:
        out(f'| {label} | {value:,} |')
    out('')
    out('## Editorial checks')
    out('')
    if RESULTS:
        out(
            f'The supplied final result snapshot marks all {len(chunks)} chunks of whole ayahs AI-reviewed with successful structural validation and a clean last confirmation. '
            'The workflow requires independent grammar and meaning/tafsir reviews, a fixer that applies or rejects each finding with a reason, and fresh whole-chunk confirmation after corrections. '
            'Every finding, including a minor finding, must be resolved or rejected before a clean final confirmation; an unconfirmed last edit does not count as completion.'
        )
        out(
            f"In this supplied snapshot, the two independent reviews report {review['issues']:,} finding entries ({review['critical']} critical, {review['major']} major). "
            f"The recorded first fix rounds report {review['applied']:,} applications and {review['rejected']} rejections; confirmation rounds contain {review['confirmIssues']:,} finding entries, with every last confirmation clean. "
            'These are snapshot counts, not cumulative historical totals: reused authored drafts may already contain corrections from earlier passes, repeated findings may occur in more than one round, and intermediate fixer totals are not reconstructed.'
        )
    else:
        out(
            f'The lesson is organized into {len(chunks)} chunks of whole ayahs. No review-result snapshot was supplied. '
            'This source audit therefore does not certify completion of independent reviews, fixes or final confirmations. '
            'The intended workflow requires independent grammar and meaning/tafsir reviews and a clean final confirmation after every correction, including minor findings.'
        )
    out(
        'The chunk validator checks the exact Arabic word, segments that rejoin to the exact word, ids and order, rule references, verb-note presence, phrase coverage of every word, and the absence of URLs or Latin text. '
        'AI review and automated checks are not scholarly review.'
    )
    out('')
    if no_root_nouns:
        out('Nouns without a Corpus root (root left empty): ' + '، '.join(sorted({a for a, _ in no_root_nouns})) + '.')
        out('')
    fixes = {k: v for k, v in overrides.items() if k.startswith(f'{surah}:')}
    if fixes:
        out('## Corrections to Corpus tags')
        out('')
        out('These occurrences carry an adjudicated correction or a documented source/analysis disagreement. The lessons follow the recorded contextual analysis; the raw Corpus data itself is unchanged.')
        out('')
        for wid, fix in sorted(fixes.items(), key=lambda kv: [int(x) for x in kv[0].split(':')]):
            out(f"- **{wid}** {words[wid]['arabic']}: {fix['noteEnglish']}")
        out('')
    out('## Analysis decisions and cautions')
    out('')
    out('Notes recorded by the authors and reviewers for scholarly review; they mark alternative analyses, source disagreements and editorial choices.')
    out('')
    any_note = False
    for spec in chunks:
        for note in notes.get(spec['chunk'], []):
            text = ' '.join(note['noteEnglish'].split())
            out(f"- **{note['ref']}:** {text}")
            any_note = True
    if not any_note:
        out('- No alternative analyses were recorded.')
    out('')
    out('## Per-ayah sources')
    out('')
    for a in sorted(surah_ayahs, key=lambda a: a['ayah']):
        n = a['ayah']
        out(
            f"- **{surah}:{n}:** [Corpus i‘rab](https://corpus.quran.com/grammar.jsp?chapter={surah}&verse={n}); "
            f"[word morphology](https://corpus.quran.com/wordbyword.jsp?chapter={surah}&verse={n}); "
            f"[Quran.com](https://quran.com/{surah}/{n})."
        )
    out('')
    path = os.path.join(REPO, 'docs', 'source-audits', f'surah-{surah}.md')
    outputs[Path(path)] = '\n'.join(lines)


# Construct every audit before writing any of them. Bad review records or a
# missing late Surah input must not leave a partially refreshed audit set.
staged, originals, replaced = [], {}, []
try:
    for path, text in outputs.items():
        path.parent.mkdir(parents=True, exist_ok=True)
        originals[path] = path.read_bytes() if path.exists() else None
        with tempfile.NamedTemporaryFile(dir=path.parent, prefix='.audit-', delete=False) as handle:
            handle.write(text.encode('utf-8'))
            staged.append((Path(handle.name), path))
    for temporary, path in staged:
        os.replace(temporary, path)
        replaced.append(path)
except Exception:
    for path in reversed(replaced):
        previous = originals[path]
        if previous is None:
            path.unlink(missing_ok=True)
        else:
            path.write_bytes(previous)
    raise
finally:
    for temporary, _ in staged:
        temporary.unlink(missing_ok=True)
for path in outputs:
    print('wrote', path)

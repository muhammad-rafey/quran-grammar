"""Generate docs/source-audits/surah-<n>.md for the five new lessons from the work records.

Usage: python3 -I gen_audit.py <work-dir> <repo-dir> [<chunk-results.json>]
"""
import json
import os
import sys
from collections import Counter, defaultdict

WORK, REPO = sys.argv[1], sys.argv[2]
RESULTS = sys.argv[3] if len(sys.argv) > 3 else None
NAMES = {18: 'Al-Kahf', 23: "Al-Mu'minun", 32: 'As-Sajdah', 36: 'Ya-Sin', 55: 'Ar-Rahman'}
SLUGS = {18: 'al-kahf', 23: 'al-muminun', 32: 'as-sajdah', 36: 'ya-sin', 55: 'ar-rahman'}
QAC_SHA = '910b721a8f04f4334ac5d4c62b19e858f5d720c525bb975f2e750ea2c6bb532d'

meta = os.path.join(WORK, 'meta')
plan = json.load(open(os.path.join(meta, 'plan.json')))
words = json.load(open(os.path.join(meta, 'words.json')))
ayahs = json.load(open(os.path.join(meta, 'ayahs.json')))
lexemes = json.load(open(os.path.join(meta, 'lexemes.json')))
results = {}
if RESULTS and os.path.exists(RESULTS):
    for r in json.load(open(RESULTS)):
        if r:
            results[r['chunk']] = r


def chunk_file(spec):
    return os.path.join(WORK, 'chunks', str(spec['surah']), f"{spec['chunk']}.json")


for surah, name in NAMES.items():
    chunks = [p for p in plan if p['surah'] == surah]
    inv = json.load(open(os.path.join(WORK, 'inventory', f'inventory-{surah}.json')))
    surah_words = [w for w in words.values() if w['surah'] == surah]
    surah_ayahs = [a for a in ayahs.values() if a['surah'] == surah]
    per_ayah = [len(a['wordIds']) for a in sorted(surah_ayahs, key=lambda a: a['ayah'])]
    pos = Counter(w['pos'] for w in surah_words)
    verbs = [w for w in surah_words if w['pos'] == 'verb']
    forms = Counter(w['verb']['form'] for w in verbs)
    passive = sum(1 for w in verbs if w['verb']['passive'])
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
        f'- **Verb paradigms** (باب، ماضی، مضارع، وزن) for all {len(verbs)} verb occurrences come from a shared library of {len(lexemes)} verb lexemes for the five new lessons. '
        'Form I vowel classes were decided from imperfects attested across the whole Corpus and standard lexica (Lane, Lisan al-Arab, al-Mu‘jam al-Wasit), and every entry was independently reviewed.'
    )
    out(
        '- **Tafsir consulted** through the Quran.com API: Tafsir al-Muyassar (Arabic), Tafsir al-Sa‘di (Arabic) and Ibn Kathir (abridged, English). '
        'Translations consulted for meaning only: Saheeh International and Mufti Taqi Usmani. The Urdu wording is original and concise; it is not a translation of these works.'
    )
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
    out(
        f'The lesson was written in {len(chunks)} chunks of whole ayahs. Each chunk was drafted by one agent, then checked independently by a grammar reviewer (morphology, i‘rab, segments, rule tags, verb notes, phrases) '
        'and a meaning reviewer (word meanings, dictionary notes, translation completeness, tafsir support, Urdu quality, exact Arabic quotations). '
        'A fixer applied or rejected each finding with a reason, and a confirming reviewer re-checked the whole chunk, repeating while serious issues remained.'
    )
    if review['chunks']:
        out(
            f"Reviewers raised {review['issues']:,} findings ({review['critical']} critical, {review['major']} major); {review['applied']:,} corrections were applied in the first fix round and {review['rejected']} findings were rejected with reasons. "
            f"Confirming reviewers raised {review['confirmIssues']:,} further findings, which were fixed before assembly."
        )
    out(
        'An automated validator checked every chunk: the exact Arabic word, segments that rejoin to the exact word, ids and order, rule references, verb-note presence, phrase coverage of every word, and the absence of URLs or Latin text. '
        'AI review and automated checks are not scholarly review.'
    )
    out('')
    if no_root_nouns:
        out('Nouns without a Corpus root (root left empty): ' + '، '.join(sorted({a for a, _ in no_root_nouns})) + '.')
        out('')
    fixes = {k: v for k, v in json.load(open(os.path.join(meta, 'overrides.json'))).items() if k.startswith(f'{surah}:')}
    if fixes:
        out('## Corrections to Corpus tags')
        out('')
        out('These occurrences carry a Corpus 0.4 tag that contradicts the vocalised Uthmani word or its governing context. The lessons follow the corrected analysis; the Corpus data itself is unchanged.')
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
    with open(path, 'w', encoding='utf-8') as handle:
        handle.write('\n'.join(lines))
    print('wrote', path, len(lines), 'lines;', sum(len(v) for v in notes.values()), 'notes')

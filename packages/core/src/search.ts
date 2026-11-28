import {
  romanQuery,
  romanTarget,
  scoreRoman,
  type RomanOptions,
  type RomanQuery,
  type RomanTarget,
} from './roman';
import type { PartOfSpeechFilter, StudyData, Word } from './types';

/** Normalize search input without modifying the displayed Quran text. */
export function normalizeText(value: string): string {
  return value
    .normalize('NFKC')
    .replace(/[\u0610-\u061a\u064b-\u065f\u0670\u06d6-\u06ed\u0640]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/[ىی]/g, 'ي')
    .replace(/ک/g, 'ك')
    .replace(/\s+/g, ' ')
    .trim()
    .toLocaleLowerCase();
}

/**
 * A Quranic word without the pause signs Quran.com's Uthmani text carries with it: a leading
 * rub el hizb («۞ إِنَّ»), trailing space-separated waqf/sajdah signs («رَيْبَ ۛ», «ٱلْعَظِيمِ ۩»)
 * and bidi marks (the same rule as content-pipeline/full-quran/scripts/build.py `pause_free`). Word
 * Arabic is stored verbatim; this is for comparing words, not for display.
 */
export function withoutPauseMarks(arabic: string): string {
  return arabic
    .replace(/[\u200e\u200f\u061c]/g, '')
    .replace(/^\u06de /, '')
    .replace(/( [\u06d6-\u06dc\u06e9]+)+$/, '');
}

export function urduNumber(value: number | string): string {
  return String(value).replace(/[0-9]/g, (digit) => '۰۱۲۳۴۵۶۷۸۹'[Number(digit)]!);
}

/**
 * Roman Urdu targets per word, built on first use. Only the word's own Arabic forms (text,
 * segments, lemma, root) and its short Urdu meanings and rule titles take part: the long
 * morphology and syntax notes would match almost any Latin query.
 */
/** Everything searchable about a word, normalized, for Arabic- and Urdu-script queries. */
const wordTexts = new WeakMap<Word, string>();
function wordText(word: Word, study: StudyData): string {
  let text = wordTexts.get(word);
  if (text === undefined) {
    const root = word.root ? study.roots[word.root] : undefined;
    const verb = study.verbForms[word.id];
    text = normalizeText(
      [
        word.id,
        word.arabic,
        word.meaningUrdu,
        word.posUrdu,
        word.root ?? '',
        word.lemma ?? '',
        word.morphologyUrdu,
        word.syntaxUrdu,
        word.dictionaryUrdu,
        ...word.segments.flatMap((segment) => [
          segment.arabic,
          segment.roleUrdu,
          segment.meaningUrdu,
        ]),
        ...(root ? Object.values(root) : []),
        ...(verb ? Object.values(verb) : []),
        ...wordRules(word, study),
      ].join(' '),
    );
    wordTexts.set(word, text);
  }
  return text;
}

function wordRules(word: Word, study: StudyData): string[] {
  return study.rules.filter((rule) => word.ruleIds.includes(rule.id)).map((rule) => rule.titleUrdu);
}

/**
 * Roman Urdu targets per word, built on first Latin search. `main` holds the word's Arabic forms
 * (text, IndoPak text, segments, lemma, root), its Urdu meaning and root meaning; `rules` the
 * grammar rule titles, matched by whole words of 3+ skeleton letters only. The long morphology
 * and syntax notes are left out: they would match almost any Latin query.
 */
const romanTargets = new WeakMap<Word, { main: RomanTarget; rules: RomanTarget }>();
function wordRomanTargets(word: Word, study: StudyData) {
  let targets = romanTargets.get(word);
  if (!targets) {
    const root = word.root ? study.roots[word.root] : undefined;
    targets = {
      main: romanTarget(
        word.arabic,
        word.arabicIndoPak ?? '',
        word.lemma ?? '',
        word.root?.replaceAll(' ', '') ?? '',
        word.meaningUrdu,
        ...word.segments.map((segment) => segment.arabic),
        root?.meaningUrdu ?? '',
      ),
      rules: romanTarget(...wordRules(word, study)),
    };
    romanTargets.set(word, targets);
  }
  return targets;
}

/** Latin queries whose skeleton has 2+ letters: "allah" (lh) counts, "e" or "zzzz" (z) not. */
let lastRoman: { query: string; prepared: RomanQuery | undefined } | undefined;
function cachedRomanQuery(query: string): RomanQuery | undefined {
  if (lastRoman?.query !== query) {
    const prepared = romanQuery(query);
    const useful = prepared?.required.some((variants) => variants.some((v) => v.length >= 2));
    lastRoman = { query, prepared: useful ? prepared : undefined };
  }
  return lastRoman.prepared;
}

/**
 * Word search: Arabic or Urdu script matches any of the word's text, root, lemma, meanings,
 * notes and rule titles as typed (diacritics and letter variants ignored). A Latin query also
 * matches in Roman Urdu (roman.ts): "kitab" finds ٱلْكِتَٰبُ and the root ك ت ب, "zameen" the
 * meaning زمین. Roman matches are whole words or word starts only, no typos.
 */
export function matchesWord(
  word: Word,
  study: StudyData,
  query: string,
  pos: PartOfSpeechFilter = 'all',
): boolean {
  if (pos !== 'all' && word.pos !== pos && !(pos === 'noun' && word.pos === 'adjective')) {
    return false;
  }
  const normalized = normalizeText(query);
  if (!normalized) return true;
  const roman = cachedRomanQuery(query);
  if (roman && matchesRomanWord(roman, word, study)) return true;
  return (
    wordText(word, study).includes(normalized) ||
    Boolean(
      word.root && normalizeText(word.root).replaceAll(' ', '') === normalized.replaceAll(' ', ''),
    )
  );
}

const wordSearch: RomanOptions = { fuzzy: false, minPrefix: 3, joined: false };
const ruleSearch: RomanOptions = {
  fuzzy: false,
  minPrefix: Number.POSITIVE_INFINITY,
  joined: false,
};

function matchesRomanWord(roman: RomanQuery, word: Word, study: StudyData): boolean {
  const targets = wordRomanTargets(word, study);
  if (scoreRoman(roman, targets.main, wordSearch)) return true;
  return (
    roman.required.every((variants) => variants.every((variant) => variant.length >= 3)) &&
    Boolean(scoreRoman(roman, targets.rules, ruleSearch))
  );
}

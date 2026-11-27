import { surahCatalog, type SurahCatalogEntry } from './catalog';
import { formatCount } from './interface';
import { romanQuery, romanTarget, scoreRoman, type RomanTarget } from './roman';
import { normalizeText } from './search';
import { surahSearchNames } from './surah-names';

/** How a Surah matched, strongest first. */
export type SurahMatch = 'number' | 'exact' | 'prefix' | 'word' | 'substring' | 'fuzzy';

export interface SurahSearchResult {
  readonly surah: SurahCatalogEntry;
  /** A valid ayah of this Surah typed after the number or name: "2:255", "kahf 10". */
  readonly ayah?: number;
  /** Absent for an empty query, which lists every Surah in order. */
  readonly match?: SurahMatch;
}

const matchRank: Record<SurahMatch, number> = {
  number: 0,
  exact: 1,
  prefix: 2,
  word: 3,
  substring: 4,
  fuzzy: 5,
};

/** Any Arabic-script letter (Arabic, Urdu, presentation forms). Digits are converted first. */
const arabicScript = /[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]/;
const anyLetter = /[a-zÀ-ɏ؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]/i;
/** Leading words that only say "Surah"; dropped from queries and keys alike. */
const surahWords = new Set([
  'surah', 'sura', 'surat', 'surath', 'suratul', 'suratu', 'soorah', 'soora', 'soorat',
  'sooratul', 'chapter', 'سوره', 'سورت', 'سور',
]);
/** The Arabic article in its transliterated and assimilated forms, and English "the". */
const latinArticles = new Set([
  'al', 'el', 'ul', 'il', 'an', 'ar', 'as', 'at', 'ad', 'adh', 'ash', 'az', 'ath', 'the',
]);

/** Lowercase Latin words without accents, apostrophes (ʿayn/hamza marks) or punctuation. */
function latinWords(value: string): string[] {
  return value
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[ʿʾ'’‘`´ʻʼ]/g, '')
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

/**
 * Folds common transliteration variants together: ee/i, e/a, o/u, q/k, y/i, a word-final h
 * after a vowel and doubled letters. "Yaseen" and "Ya-Sin", "rehman" and "Rahman",
 * and "Baqarah" and "bakara" meet.
 */
function foldLatin(word: string): string {
  return word
    .replace(/ee/g, 'i')
    .replace(/e/g, 'a')
    .replace(/o/g, 'u')
    .replace(/q/g, 'k')
    .replace(/y/g, 'i')
    .replace(/([aiu])h$/, '$1')
    .replace(/(.)\1+/g, '$1');
}

/**
 * Arabic and Urdu words in one spelling: the shared `normalizeText` (marks, alef forms, ya and
 * kaf) plus ta marbuta/ha (ة ۃ ہ ھ → ه), Urdu ے and hamza seats (ئ → ي, ؤ → و).
 */
function arabicWords(value: string): string[] {
  return normalizeText(value)
    .replace(/[ةۃہھۂ]/g, 'ه')
    .replace(/[ےۓئ]/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/ء/g, '')
    .split(/[\s،؛؟۔.,:;!?'"()\-–]+/)
    .filter(Boolean);
}

/** Latin query words without "Surah" and a leading article, for the Roman Urdu matcher. */
function romanWords(value: string): string[] {
  const words = latinWords(value);
  while (words.length > 1 && surahWords.has(words[0]!)) words.shift();
  if (words.length > 1 && latinArticles.has(words[0]!) && words[0] !== 'the') words.shift();
  return words;
}

interface Forms {
  /** All words joined without spaces, article included: "albaqara". */
  readonly full: string;
  /** Without the article(s): "baqara". */
  readonly bare: string;
  /** The words of `bare`, for word-prefix matches inside a longer name. */
  readonly words: readonly string[];
}

function forms(value: string, arabic: boolean): Forms {
  const words = arabic ? arabicWords(value) : latinWords(value);
  while (words.length > 1 && surahWords.has(words[0]!)) words.shift();
  let bareWords: string[];
  if (arabic) {
    // ال on any word of 4+ letters (الم of "الم نشرح" and آل of "آل عمران" stay).
    bareWords = words.map((word) => (word.length > 3 && word.startsWith('ال') ? word.slice(2) : word));
  } else {
    bareWords = words.length > 1 && latinArticles.has(words[0]!) ? words.slice(1) : [...words];
    bareWords = bareWords.map(foldLatin);
  }
  const fold = (list: string[]) => {
    const joined = list.join('');
    return arabic ? joined : joined.replace(/(.)\1+/g, '$1');
  };
  return {
    full: fold(arabic ? words : words.map(foldLatin)),
    bare: fold(bareWords),
    words: bareWords.filter(Boolean),
  };
}

interface Key extends Forms {
  readonly arabic: boolean;
  /** The catalog's own transliteration or Arabic name, ranked above aliases on ties. */
  readonly primary: boolean;
}

let index:
  | ReadonlyArray<{ surah: SurahCatalogEntry; keys: readonly Key[]; roman: RomanTarget }>
  | undefined;
function searchIndex() {
  return (index ??= surahCatalog.map((surah) => {
    const [, meaning, latin, arabic] = surahSearchNames[surah.number - 1]!;
    const key = (value: string, isArabic: boolean, primary = false): Key => ({
      ...forms(value, isArabic),
      arabic: isArabic,
      primary,
    });
    // Every Arabic-script name as one Roman Urdu target (see roman.ts): any Latin spelling of
    // البقرة, یٰسٓ or الملک meets it even when no alias lists that spelling.
    const roman = romanTarget(surah.nameArabic, ...arabic.split('|'));
    return {
      surah,
      roman,
      keys: [
        key(surah.nameEnglish, false, true),
        key(surah.nameArabic, true, true),
        key(meaning, false),
        ...latin.split('|').map((value) => key(value, false)),
        ...arabic.split('|').map((value) => key(value, true)),
      ].filter((item) => item.full),
    };
  }));
}

/**
 * Optimal string alignment distance (Damerau-Levenshtein with adjacent transpositions), stopping
 * early once every path exceeds `max`.
 */
export function editDistance(a: string, b: string, max = Number.POSITIVE_INFINITY): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let previous2: number[] = [];
  let previous = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let value = Math.min(previous[j]! + 1, current[j - 1]! + 1, previous[j - 1]! + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1])
        value = Math.min(value, previous2[j - 2]! + 1);
      current.push(value);
      rowMin = Math.min(rowMin, value);
    }
    if (rowMin > max) return max + 1;
    previous2 = previous;
    previous = current;
  }
  return previous[b.length]!;
}

/** Typos allowed for a folded query: none below 4 letters, one from 4, two from 7. */
function typoLimit(length: number): number {
  return length >= 7 ? 2 : length >= 4 ? 1 : 0;
}

interface Scored {
  readonly match: SurahMatch;
  readonly distance: number;
  readonly primary: boolean;
}

function better(a: Scored, b: Scored | undefined): boolean {
  if (!b) return true;
  if (matchRank[a.match] !== matchRank[b.match]) return matchRank[a.match] < matchRank[b.match];
  if (a.distance !== b.distance) return a.distance < b.distance;
  return a.primary && !b.primary;
}

function scoreKey(query: Forms, key: Key): Scored | undefined {
  const queries = [...new Set([query.bare, query.full])].filter(Boolean);
  const targets = [...new Set([key.bare, key.full])];
  const result = (match: SurahMatch, distance = 0): Scored => ({ match, distance, primary: key.primary });
  if (queries.some((q) => targets.includes(q))) return result('exact');
  if (queries.some((q) => targets.some((target) => target.startsWith(q)))) return result('prefix');
  if (query.bare.length >= 2 && key.words.some((word) => word.startsWith(query.bare)))
    return result('word');
  if (queries.some((q) => q.length >= 3 && targets.some((target) => target.includes(q))))
    return result('substring');
  // Each comparison counts only within its own query's typo limit.
  const within = (q: string, target: string) => {
    const limit = typoLimit(q.length);
    const distance = limit ? editDistance(q, target, limit) : limit + 1;
    return distance <= limit ? distance : Number.POSITIVE_INFINITY;
  };
  let best = Number.POSITIVE_INFINITY;
  for (const q of queries) for (const target of targets) best = Math.min(best, within(q, target));
  // The start of the name while it is still being typed ("bakr" for Baqarah); the article-free
  // form only, so a shared "al"/"the" cannot pass for a match.
  const q = query.bare;
  for (let length = Math.max(4, q.length - 1); length <= q.length + 1; length += 1)
    if (length < key.bare.length) best = Math.min(best, within(q, key.bare.slice(0, length)));
  return best < Number.POSITIVE_INFINITY ? result('fuzzy', best) : undefined;
}

function validAyah(surah: SurahCatalogEntry, digits: string | undefined): number | undefined {
  if (!digits) return undefined;
  const ayah = Number(digits);
  return Number.isInteger(ayah) && ayah >= 1 && ayah <= surah.ayahCount ? ayah : undefined;
}

const separators = '[\\s:.\\/,\\u060c\\-–]';
/** "2", "2:255", "2 255", "2.255", "surah 2" (digits already ASCII). */
const numberQuery = new RegExp(`^(\\d+)(?:\\s*${separators}\\s*(\\d*))?$`);
/** "kahf 10", "bakra:255", "البقرة ٢٥٥". */
const nameAyahQuery = new RegExp(`^(.*?)${separators}+(\\d{1,3})$`);

/**
 * Loose Surah search for the pickers: number, transliteration, common alternative spellings,
 * English meaning, and Arabic or Urdu script. Case, accents, apostrophes, hyphens, the article
 * ("al-", "an-", "ar-", "the"), "Surah" and Arabic/Urdu letter variants are ignored, and small
 * typos are tolerated. Results are ranked number > exact > prefix > word prefix > substring >
 * fuzzy, then fewer typos, the catalog's own name over an alias, and Surah order. A trailing
 * ayah number ("2:255", "kahf 10") is returned when it exists in that Surah.
 */
export function searchSurahs(query: string): SurahSearchResult[] {
  let text = formatCount(query, 'en').trim();
  if (!text) return surahCatalog.map((surah) => ({ surah }));
  // "Surah 2", "سورۃ ۲": drop the word before testing for a number.
  const lead = text.split(/\s+/, 1)[0]!;
  const leadWords = arabicScript.test(lead) ? arabicWords(lead) : latinWords(lead);
  if (leadWords.length === 1 && surahWords.has(leadWords[0]!) && text.length > lead.length)
    text = text.slice(lead.length).trim();

  const number = numberQuery.exec(text);
  if (number) {
    const [, digits, ayahDigits] = number;
    const value = Number(digits);
    const results: SurahSearchResult[] = [];
    const exact = surahCatalog.find((surah) => surah.number === value);
    if (exact) results.push({ surah: exact, ayah: validAyah(exact, ayahDigits), match: 'number' });
    // While a bare number is typed, "1" also offers 10–19 and 100–114.
    if (ayahDigits === undefined && !digits!.startsWith('0'))
      for (const surah of surahCatalog)
        if (surah.number !== value && String(surah.number).startsWith(digits!))
          results.push({ surah, match: 'prefix' });
    return results;
  }

  let ayahDigits: string | undefined;
  const withAyah = nameAyahQuery.exec(text);
  if (withAyah && anyLetter.test(withAyah[1]!)) {
    text = withAyah[1]!.trim();
    ayahDigits = withAyah[2];
  }
  const arabic = arabicScript.test(text);
  const typed = forms(text, arabic);
  if (!typed.full) return [];
  // Roman Urdu needs a written vowel in every word: "bqrh" or "kfh" are typos, not spellings.
  const spelled = romanWords(text);
  const roman =
    !arabic && spelled.every((word) => /[aeiou]/.test(word) || /^\d+$/.test(word))
      ? romanQuery(spelled.join(' '))
      : undefined;
  const scored: { surah: SurahCatalogEntry; score: Scored }[] = [];
  for (const { surah, keys, roman: target } of searchIndex()) {
    let best: Scored | undefined;
    for (const key of keys) {
      if (key.arabic !== arabic) continue;
      const score = scoreKey(typed, key);
      if (score && better(score, best)) best = score;
    }
    // Roman Urdu against the Arabic and Urdu names is a loose match: it ranks with typos, a
    // whole word first (distance 0), then a started word (0.5), a substring (1) and typos
    // (1 + edits).
    const romanScore = roman && scoreRoman(roman, target);
    if (romanScore) {
      const distance = romanScore.tier < 3 ? romanScore.tier / 2 : 1 + romanScore.distance;
      const score: Scored = { match: 'fuzzy', distance, primary: false };
      if (better(score, best)) best = score;
    }
    if (best) scored.push({ surah, score: best });
  }
  scored.sort((a, b) =>
    better(a.score, b.score) ? -1 : better(b.score, a.score) ? 1 : a.surah.number - b.surah.number,
  );
  return scored.map(({ surah, score }) => ({
    surah,
    ayah: validAyah(surah, ayahDigits),
    match: score.match,
  }));
}

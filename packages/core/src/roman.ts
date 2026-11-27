/**
 * Loose search for Latin-script queries ("Roman Urdu" and everyday Arabic transliteration)
 * against Urdu and Arabic text, plus plain English matching. Pure and dependency-free; it never
 * changes what is displayed.
 *
 * Both sides are reduced to a phonetic consonant skeleton and compared with prefix, substring and
 * small-typo tolerance. "muraqab e izafi", "murakkab-e-izafi" and "murakab izafi" all become
 * `mrkb zf`, which meets مرکبِ اضافی (`mrkb Df`: ض is class D, met by a typed z or d).
 *
 * Skeleton alphabet (one character per sound class):
 *
 * | class | Arabic/Urdu letters        | Latin spellings                             |
 * | ----- | -------------------------- | ------------------------------------------- |
 * | b     | ب                          | b, bh                                       |
 * | p     | پ (پھ)                     | p, ph                                       |
 * | t     | ت ط ٹ (تھ ٹھ)              | t, th                                       |
 * | s     | ث س ص                      | s, th, sh (as س + ہ)                        |
 * | j     | ج (جھ)                     | j, jh                                       |
 * | C     | چ (چھ)                     | ch, chh                                     |
 * | h     | ح ہ ه ۃ ة ۂ                | h                                           |
 * | X     | خ کھ                       | kh                                          |
 * | d     | د ڈ (دھ ڈھ)                | d, dh                                       |
 * | z     | ذ ز ژ                      | z, zh, dh                                   |
 * | D     | ض ظ                        | z or d (matched by either), dh              |
 * | r     | ر ڑ                        | r                                           |
 * | S     | ش                          | sh                                          |
 * | G     | غ گھ                       | gh                                          |
 * | f     | ف                          | f, ph                                       |
 * | k     | ق ک ك                      | k, q, c (not ch), ck; x = ks                |
 * | g     | گ                          | g                                           |
 * | l m n | ل م ن ں                    | l m n                                       |
 * | w     | و only at the start        | w or v only at the start                    |
 * | y     | ی ي only at the start      | y only at the start                         |
 *
 * Rules, applied word by word:
 * - Vowels are dropped: Latin a e i o u (so the izafat "e" of "ism e ishara" / "isme" and the
 *   "o" of "jar o majrur" vanish), and the Arabic/Urdu vowel carriers ا آ أ إ ٱ ع ء ى ئ ؤ ے ۓ.
 *   Short-vowel marks, tanwin, shadda, Quranic annotation marks and tatweel are stripped.
 * - و/ی (and Latin w/v/y) count as consonants only at the start of a word; inside a word they
 *   are usually long vowels in both spellings (ضمیر zameer, مجرور majroor), so they are dropped.
 * - ھ (do-chashmi he) marks aspiration and is dropped, except کھ → X and گھ → G (so "khana"
 *   meets کھانا and "ghar" meets گھر). Latin bh/jh/chh drop their h the same way.
 * - Doubled letters collapse after vowels are removed ("murakkab", "majroor" → mrkb, mjr), and a
 *   word-final h is dropped on both sides when two letters remain: silent ہ/ة ("ishara",
 *   "isharah" and اشارہ → Sr) and the h some spellings leave off ("fiqh"/"fiq" → fk). Short
 *   words keep it (اللہ and "allah" → lh, روح and "ruh" → rh).
 * - The Arabic article and attached particles are optional: ٱلْكِتَٰبُ, وَٱلْأَرْضِ and بِٱللَّهِ
 *   also yield their bare forms. Latin "al-kahf", "alkahf" and assimilated "ar-rahman" /
 *   "arrahman" all meet. Single-letter query words ("al" → l, "wa" → w, "ya" → y) are optional
 *   when the query has other words.
 * - Ambiguous Latin digraphs expand to alternatives: th → s | t | th, dh → z | d | dh,
 *   ph → p | f, sh → S | sh.
 *
 * Matching: every query word (ignoring optional ones) must meet some word of the text, in any
 * order. A query word of 2+ skeleton letters may be a prefix of a text word (still typing); one of
 * 3+ may be a substring; with `fuzzy`, skeletons of 4+ letters allow one edit
 * (Damerau-Levenshtein, adjacent swaps count as one) and 8+ allow two, against the whole word or
 * its start. The whole query is also compared with the whole text without spaces, so "isme
 * ishara" and "ismeishara" or "ya seen" and "yaseen" meet.
 *
 * Limits: without vowels, different words can share a skeleton (رب/ریب "rb", میں/مِن "mn"), so
 * very short queries are broad; callers rank exact and prefix matches first.
 */

/** Strength of a match: 0 exact, 1 prefix, 2 substring, 3 typo; `distance` counts typos. */
export interface RomanScore {
  readonly tier: number;
  readonly distance: number;
}

export interface RomanOptions {
  /** Allow substring and typo matches (default true). Word search turns them off. */
  readonly fuzzy?: boolean;
  /** Shortest query skeleton that may match the start of a longer word (default 2). */
  readonly minPrefix?: number;
  /** Also compare the whole query and text without spaces (default true). */
  readonly joined?: boolean;
}

const arabicMarks = /[ؐ-ًؚ-ٰٟۖ-ۭـ‌‍‏]/g;
const arabicLetter = /[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]/;
const latinLetter = /[a-z]/i;

const arabicClasses: Record<string, string> = {
  ب: 'b', پ: 'p', ت: 't', ط: 't', ٹ: 't', ث: 's', س: 's', ص: 's', ج: 'j', چ: 'C',
  ح: 'h', ه: 'h', ہ: 'h', ة: 'h', ۃ: 'h', ۂ: 'h', خ: 'X', د: 'd', ڈ: 'd', ذ: 'z', ز: 'z',
  ژ: 'z', ض: 'D', ظ: 'D', ر: 'r', ڑ: 'r', ش: 'S', غ: 'G', ف: 'f', ق: 'k', ک: 'k', ك: 'k',
  گ: 'g', ل: 'l', م: 'm', ن: 'n', ں: 'n',
  ا: '', آ: '', أ: '', إ: '', ٱ: '', ع: '', ء: '', ى: '', ئ: '', ؤ: '', ے: '', ۓ: '',
};
const arabicW = new Set(['و', 'ۏ', 'ۄ', 'ۅ']);
const arabicY = new Set(['ی', 'ي', 'ې', 'ێ']);
const arabicAspiration = 'ھ';

/** Collapse doubled letters, then drop a final h when two letters remain (اللہ stays `lh`). */
function finish(skeleton: string): string {
  const collapsed = skeleton.replace(/(.)\1+/g, '$1');
  return collapsed.length > 2 && collapsed.endsWith('h') ? collapsed.slice(0, -1) : collapsed;
}

function arabicSkeleton(word: string): string {
  let out = '';
  let index = 0;
  for (const letter of word) {
    const first = index === 0;
    index += 1;
    if (arabicW.has(letter)) {
      if (first) out += 'w';
    } else if (arabicY.has(letter)) {
      if (first) out += 'y';
    } else if (letter === arabicAspiration) {
      if (first) out += 'h';
      else if (out.endsWith('k')) out = `${out.slice(0, -1)}X`;
      else if (out.endsWith('g')) out = `${out.slice(0, -1)}G`;
    } else if (letter in arabicClasses) {
      out += arabicClasses[letter];
    } else if (/[0-9]/.test(letter)) {
      out += letter;
    }
  }
  return finish(out);
}

/** Attached particles and the article that may be left out: و ف ب ك ل + ال, or لل. */
const arabicPrefix = /^(?:[وفبكل]?ال|لل)(?=..)/;

function arabicVariants(word: string): string[] {
  const variants = [arabicSkeleton(word)];
  const bare = word.replace(arabicPrefix, '');
  if (bare !== word) variants.push(arabicSkeleton(bare));
  // و/ف/ب attached without the article: وَهُوَ, فَقَالَ, بِسْمِ.
  else if (/^[وفب]../.test(word)) variants.push(arabicSkeleton(word.slice(1)));
  return [...new Set(variants.filter(Boolean))];
}

/** Latin digraphs, longest first: [spelling, alternatives]. */
const latinDigraphs: ReadonlyArray<readonly [string, readonly string[]]> = [
  ['chh', ['C']],
  ['kh', ['X']],
  ['gh', ['G']],
  ['sh', ['S', 'sh']],
  ['ch', ['C']],
  ['zh', ['z']],
  ['th', ['s', 't', 'th']],
  ['dh', ['z', 'd', 'dh']],
  ['ph', ['p', 'f']],
  ['bh', ['b']],
  ['jh', ['j']],
  ['ck', ['k']],
];
const latinSingles: Record<string, string> = { q: 'k', c: 'k', x: 'ks' };
const maxVariants = 12;

function latinVariants(word: string): string[] {
  let variants = [''];
  let i = 0;
  while (i < word.length) {
    const digraph = latinDigraphs.find(([spelling]) => word.startsWith(spelling, i));
    let options: readonly string[];
    if (digraph) {
      options = digraph[1];
      i += digraph[0].length;
    } else {
      const letter = word[i]!;
      if ('aeiou'.includes(letter)) options = [''];
      else if (letter === 'w' || letter === 'v') options = [i === 0 ? 'w' : ''];
      else if (letter === 'y') options = [i === 0 ? 'y' : ''];
      else options = [latinSingles[letter] ?? letter];
      i += 1;
    }
    if (options.length === 1) variants = variants.map((variant) => variant + options[0]);
    else
      variants = variants
        .flatMap((variant) => options.map((option) => variant + option))
        .slice(0, maxVariants);
  }
  return [...new Set(variants.map(finish).filter(Boolean))];
}

/** Lowercase Latin words without accents, apostrophes (ʿayn/hamza marks) or punctuation. */
export function latinWords(value: string): string[] {
  return value
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[ʿʾ'’‘`´ʻʼ]/g, '')
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

function arabicWordsOf(value: string): string[] {
  return value
    .normalize('NFKC')
    .replace(arabicMarks, '')
    .replace(/[ٱأإآ]/g, 'ا')
    .split(/[^؀-ۿݐ-ݿ0-9]+|[،؛؟۔٪-٭]+/)
    .filter((word) => arabicLetter.test(word));
}

/** Skeleton alternatives for each word of a text in any script; empty words are left out. */
function wordVariants(value: string): string[][] {
  const words: string[][] = [];
  for (const word of arabicWordsOf(value)) {
    const variants = arabicVariants(word);
    if (variants.length) words.push(variants);
  }
  if (latinLetter.test(value))
    for (const word of latinWords(value)) {
      const variants = latinVariants(word);
      if (variants.length) words.push(variants);
    }
  return words;
}

/**
 * The phonetic skeleton of a text in Arabic, Urdu or Latin script, one word per space:
 * `romanKey('murakkab-e-izafi') === 'mrkb zf'` and `romanKey('مرکبِ اضافی') === 'mrkb Df'`
 * (ض keeps its own class D, which a typed z or d meets).
 */
export function romanKey(text: string): string {
  return wordVariants(text)
    .map((variants) => variants[0])
    .join(' ');
}

/** True when the query has Latin letters and no Arabic-script letters. */
export function isLatinQuery(query: string): boolean {
  return latinLetter.test(query) && !arabicLetter.test(query);
}

/** A text prepared once for repeated Roman matching. */
export interface RomanTarget {
  readonly words: readonly (readonly string[])[];
  /** The whole text without spaces: with and without articles. */
  readonly joined: readonly string[];
}

export function romanTarget(...texts: readonly string[]): RomanTarget {
  const perText = texts.map((text) => wordVariants(text)).filter((list) => list.length);
  const words = perText.flat();
  const joined = new Set<string>();
  for (const list of perText) {
    joined.add(list.map((variants) => variants[0]).join(''));
    joined.add(list.map((variants) => variants[variants.length - 1]).join(''));
  }
  return { words, joined: [...joined].filter(Boolean) };
}

/** A Latin query prepared once. */
export interface RomanQuery {
  /** Words that must match: skeleton alternatives per word. */
  readonly required: readonly (readonly string[])[];
  /** Single-letter words ("al", "wa", "ya"): optional when other words exist. */
  readonly optional: readonly (readonly string[])[];
  readonly joined: readonly string[];
}

export function romanQuery(query: string): RomanQuery | undefined {
  if (!isLatinQuery(query)) return undefined;
  const words = latinWords(query)
    .map(latinVariants)
    .filter((variants) => variants.length);
  if (!words.length) return undefined;
  const long = words.filter((variants) => variants.some((variant) => variant.length > 1));
  const required = long.length ? long : words;
  const optional = long.length ? words.filter((variants) => !long.includes(variants)) : [];
  let joined = [''];
  for (const variants of required)
    joined = joined.flatMap((head) => variants.map((variant) => head + variant)).slice(0, 16);
  return { required, optional, joined: [...new Set(joined.map(finish))] };
}

/** Skeleton letters equal: ض/ظ (D) also meet a typed d or z. */
function same(query: string, target: string): boolean {
  return query === target || (target === 'D' && (query === 'd' || query === 'z'));
}

function equal(query: string, target: string): boolean {
  if (query.length !== target.length) return false;
  for (let i = 0; i < query.length; i += 1) if (!same(query[i]!, target[i]!)) return false;
  return true;
}

function startsWith(target: string, query: string, at = 0): boolean {
  if (query.length + at > target.length) return false;
  for (let i = 0; i < query.length; i += 1) if (!same(query[i]!, target[at + i]!)) return false;
  return true;
}

function includes(target: string, query: string): boolean {
  for (let at = 0; at + query.length <= target.length; at += 1)
    if (startsWith(target, query, at)) return true;
  return false;
}

/** Optimal string alignment distance with skeleton letter equivalence, capped at `max + 1`. */
export function romanDistance(query: string, target: string, max: number): number {
  if (Math.abs(query.length - target.length) > max) return max + 1;
  let previous2: number[] = [];
  let previous = Array.from({ length: target.length + 1 }, (_, j) => j);
  for (let i = 1; i <= query.length; i += 1) {
    const current = [i];
    let rowMin = i;
    for (let j = 1; j <= target.length; j += 1) {
      const cost = same(query[i - 1]!, target[j - 1]!) ? 0 : 1;
      let value = Math.min(previous[j]! + 1, current[j - 1]! + 1, previous[j - 1]! + cost);
      if (
        i > 1 &&
        j > 1 &&
        same(query[i - 1]!, target[j - 2]!) &&
        same(query[i - 2]!, target[j - 1]!)
      )
        value = Math.min(value, previous2[j - 2]! + 1);
      current.push(value);
      rowMin = Math.min(rowMin, value);
    }
    if (rowMin > max) return max + 1;
    previous2 = previous;
    previous = current;
  }
  return previous[target.length]!;
}

/** Typos allowed for a skeleton: none below 4 letters, one from 4, two from 8. */
export function romanTypoLimit(length: number): number {
  return length >= 8 ? 2 : length >= 4 ? 1 : 0;
}

interface Settings {
  readonly fuzzy: boolean;
  readonly minPrefix: number;
}

function compare(query: string, target: string, { fuzzy, minPrefix }: Settings): RomanScore | undefined {
  if (equal(query, target)) return { tier: 0, distance: 0 };
  if (query.length >= minPrefix && startsWith(target, query)) return { tier: 1, distance: 0 };
  if (!fuzzy) return undefined;
  if (query.length >= 3 && includes(target, query)) return { tier: 2, distance: 0 };
  const limit = romanTypoLimit(query.length);
  if (!limit) return undefined;
  let best = romanDistance(query, target, limit);
  // The start of a longer word, still being typed with a typo.
  for (let length = query.length - 1; length <= query.length + 1; length += 1)
    if (length >= 3 && length < target.length)
      best = Math.min(best, romanDistance(query, target.slice(0, length), limit));
  return best <= limit ? { tier: 3, distance: best } : undefined;
}

function bestOf(a: RomanScore | undefined, b: RomanScore | undefined): RomanScore | undefined {
  if (!a) return b;
  if (!b) return a;
  return a.tier !== b.tier ? (a.tier < b.tier ? a : b) : a.distance <= b.distance ? a : b;
}

function wordScore(
  variants: readonly string[],
  target: RomanTarget,
  settings: Settings,
): RomanScore | undefined {
  let best: RomanScore | undefined;
  for (const query of variants)
    for (const words of target.words)
      for (const word of words) {
        best = bestOf(best, compare(query, word, settings));
        if (best?.tier === 0) return best;
      }
  return best;
}

/** How well a prepared Latin query meets a prepared text, or undefined for no match. */
export function scoreRoman(
  query: RomanQuery,
  target: RomanTarget,
  options: RomanOptions = {},
): RomanScore | undefined {
  const settings: Settings = { fuzzy: options.fuzzy ?? true, minPrefix: options.minPrefix ?? 2 };
  let words: RomanScore | undefined = { tier: 0, distance: 0 };
  for (const variants of query.required) {
    const score = wordScore(variants, target, settings);
    if (!score) {
      words = undefined;
      break;
    }
    words = {
      tier: Math.max(words.tier, score.tier),
      distance: words.distance + score.distance,
    };
  }
  // A matched optional word ("al", "wa") is a small bonus, never a requirement.
  if (words && query.optional.length) {
    const exact: Settings = { fuzzy: false, minPrefix: Number.POSITIVE_INFINITY };
    const missed = query.optional.filter((variants) => !wordScore(variants, target, exact)).length;
    words = { tier: words.tier, distance: words.distance + missed * 0.5 };
  }
  let joined: RomanScore | undefined;
  if ((options.joined ?? true) && (query.required.length > 1 || target.words.length > 1))
    for (const q of query.joined)
      for (const t of target.joined) {
        // Exact, prefix or substring; typos only against the whole text, not its start.
        joined = bestOf(joined, compare(q, t, { ...settings, fuzzy: false }));
        if (!settings.fuzzy || q.length < 3) continue;
        if (includes(t, q)) joined = bestOf(joined, { tier: 2, distance: 0 });
        const limit = romanTypoLimit(q.length);
        const distance = limit ? romanDistance(q, t, limit) : 1;
        if (distance <= limit) joined = bestOf(joined, { tier: 3, distance });
      }
  return bestOf(words, joined);
}

/** True when a Latin (Roman Urdu or transliterated) query matches any of the texts. */
export function matchesRoman(query: string, ...texts: readonly string[]): boolean {
  const prepared = romanQuery(query);
  return Boolean(prepared && scoreRoman(prepared, romanTarget(...texts)));
}

// ---------------------------------------------------------------------------------------------
// Plain English matching

/** Words that carry no meaning in a search ("the past tense", "verbs of praise"). */
const englishStopWords = new Set([
  'the', 'a', 'an', 'of', 'and', 'or', 'in', 'on', 'to', 'for', 'with', 'by', 'its', 'is',
  'tense', 'form', 'forms',
]);

/**
 * Everyday English words for grammar terms the topic titles name differently. Search aliases
 * only; they do not change any title.
 */
const englishSynonyms: Record<string, readonly string[]> = {
  possessive: ['idafa', 'genitive'],
  possession: ['idafa', 'genitive'],
  past: ['perfect', 'past'],
  present: ['imperfect'],
  command: ['imperative', 'command'],
  order: ['imperative'],
  question: ['interrogative'],
  questions: ['interrogative'],
  negative: ['negation', 'negative'],
  not: ['negation', 'negative'],
  plural: ['plural'],
  pronouns: ['pronoun'],
  verbs: ['verb'],
  nouns: ['noun'],
  preposition: ['preposition'],
  prepositions: ['preposition'],
  adjectives: ['adjective'],
  if: ['conditional', 'condition'],
  this: ['demonstrative'],
  that: ['demonstrative'],
  who: ['relative'],
  which: ['relative'],
  except: ['exception'],
  calling: ['vocative'],
  swearing: ['oath'],
  comparative: ['elative', 'comparative'],
  superlative: ['elative', 'superlative'],
};

/** A text prepared once for repeated English matching. */
export interface EnglishTarget {
  readonly words: readonly string[];
  readonly joined: string;
}

export function englishTarget(...texts: readonly string[]): EnglishTarget {
  const words = texts.flatMap((text) => latinWords(text));
  return { words, joined: words.join(' ') };
}

function englishWordScore(query: string, target: EnglishTarget): RomanScore | undefined {
  let best: RomanScore | undefined;
  // A later synonym ranks slightly lower: "possessive" lists idafa before genitive.
  const candidates = [query, ...(englishSynonyms[query] ?? [])];
  for (const [index, candidate] of candidates.entries()) {
    const penalty = index / 10;
    for (const word of target.words) {
      if (word === candidate) best = bestOf(best, { tier: 0, distance: penalty });
      if (candidate.length >= 2 && word.startsWith(candidate))
        best = bestOf(best, { tier: 1, distance: penalty });
    }
    if (!best && candidate.length >= 3 && target.joined.includes(candidate))
      best = { tier: 2, distance: penalty };
    // English words are longer than skeletons: one typo from 5 letters, two from 8.
    const limit = candidate.length >= 8 ? 2 : candidate.length >= 5 ? 1 : 0;
    if (!best && limit)
      for (const word of target.words) {
        let distance = romanDistance(candidate, word, limit);
        if (word.length > candidate.length + 1)
          distance = Math.min(distance, romanDistance(candidate, word.slice(0, candidate.length), limit));
        if (distance <= limit) best = bestOf(best, { tier: 3, distance: distance + penalty });
      }
  }
  return best;
}

/** How well an English query meets English text: every meaningful word must match. */
export function scoreEnglish(query: string, target: EnglishTarget): RomanScore | undefined {
  const all = latinWords(query);
  const meaningful = all.filter((word) => !englishStopWords.has(word));
  const words = meaningful.length ? meaningful : all;
  if (!words.length) return undefined;
  let total: RomanScore = { tier: 0, distance: 0 };
  for (const word of words) {
    const score = englishWordScore(word, target);
    if (!score) return undefined;
    total = { tier: Math.max(total.tier, score.tier), distance: total.distance + score.distance };
  }
  return total;
}

export function matchesEnglish(query: string, ...texts: readonly string[]): boolean {
  return Boolean(scoreEnglish(query, englishTarget(...texts)));
}

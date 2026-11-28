/**
 * Selectable reading fonts, shared by web and native. Quranic Arabic and Urdu explanations each
 * have their own choice. Font files live in apps/web/public/fonts and apps/mobile/assets/fonts
 * (same file names, identical bytes), each with its license or permission file; see
 * THIRD_PARTY_NOTICES.md.
 * Web declares one @font-face per `family` in apps/web/src/fonts.css; native registers the files
 * with expo-font through apps/mobile/src/theme/font-assets.ts. A `family` always maps to one file,
 * so a file offered for both roles (Noto Naskh Arabic, Scheherazade New) is one face with two
 * registry entries.
 *
 * `metrics` are em-relative values measured from the font file:
 * - `ascent` / `descent`: the hhea ascender / descender, which Android and iOS use for line layout
 *   (the method behind apps/mobile/src/theme/font-metrics.ts).
 * - `inkTop` / `inkBottom`: the highest / deepest ink of the text the app actually shows, measured
 *   by shaping (HarfBuzz, marks positioned and stacked) every distinct word of the role's text in
 *   the bundled study database: Quranic words and segments plus the "۝ + Urdu digits" ayah-end
 *   marker for `quran`; every Urdu learning field (meanings, explanations, topics, practice) for
 *   `urdu`, including the Quranic words quoted inside it. Re-measure when new Surahs add text.
 * Line heights derived from them keep marks from clipping (see apps/mobile/src/theme/font-metrics.ts).
 *
 * `scale` matches each font's visual letter size (alef and letter-body height) to the role
 * default, so switching fonts keeps text sizes balanced.
 */
export type FontRole = 'quran' | 'urdu';
export type FontStyleKind = 'uthmani' | 'indopak' | 'naskh' | 'nastaliq';
/**
 * Quranic orthography (the text, not only the letterforms): 'uthmani' is the Madani text the
 * lessons store in `Word.arabic` (Quran.com text_uthmani: alif wasla U+0671, sukun U+0652, U+06DF
 * …); 'indopak' is the South Asian text in `Word.arabicIndoPak` (Quran.com text_indopak: plain alif
 * with fatha, attached waqf signs …; every jazm written U+0652, see content-pipeline/full-quran).
 */
export type QuranScript = 'uthmani' | 'indopak';

export interface FontMetrics {
  /** Typographic ascent / descent (positive) in em, as used by the platform for line layout. */
  readonly ascent: number;
  readonly descent: number;
  /** Highest / deepest glyph ink (all marks) above / below the baseline in em. */
  readonly inkTop: number;
  readonly inkBottom: number;
}

export interface ReadingFont {
  readonly id: string;
  readonly role: FontRole;
  readonly family: string;
  /** File name in the fonts folders. */
  readonly file: string;
  readonly label: string;
  readonly labelUrdu: string;
  readonly kind: FontStyleKind;
  /**
   * Quran fonts only: the orthography the font is designed for. An 'indopak' font draws Uthmani
   * marks in its own (Madani) way, e.g. a mark over every alif wasla, so it is given the IndoPak
   * text when the data has it (see `quranText`).
   */
  readonly script?: QuranScript;
  /** Visual size relative to the default font of its role (1 = same); keeps text sizes balanced. */
  readonly scale: number;
  readonly metrics: FontMetrics;
  /**
   * 'OFL-1.1', or 'permission' for a font bundled under the rights holder's written permission
   * (recorded in the license file next to it; see THIRD_PARTY_NOTICES.md).
   */
  readonly license: 'OFL-1.1' | 'permission';
  /**
   * Set when the font lacks characters used in the role's text: those characters are drawn by a
   * fallback font. Short and user-facing (English / Urdu); the exact code points are in comments.
   */
  readonly coverageNote?: string;
  readonly coverageNoteUrdu?: string;
}

export const readingFonts: readonly ReadingFont[] = [
  {
    id: 'amiri-quran',
    role: 'quran',
    family: 'AmiriQuran',
    file: 'amiri-quran.ttf',
    label: 'Amiri Quran',
    labelUrdu: 'امیری قرآن',
    kind: 'uthmani',
    script: 'uthmani',
    scale: 1,
    // Shaped ink: «ذَّٰ» reaches 1.42em; «أَلِيمٌۭ» (small low meem under a final meem) 0.95em, deeper
    // than the head bounding box (0.835em) that the old tokens.ts fontMetrics used. Quran.com's
    // pause signs after a space («رَيْبَ ۛ», 4,576 words) are drawn on the space up to 1.815em,
    // exactly the ascent, so native line boxes already hold them; they are left out of inkTop
    // because the web scales other fonts' line heights relative to this one.
    metrics: { ascent: 1.815, descent: 0.634, inkTop: 1.42, inkBottom: 0.95 },
    license: 'OFL-1.1',
  },
  {
    id: 'al-qalam-quran-majeed',
    role: 'quran',
    family: 'AlQalamQuranMajeed',
    file: 'al-qalam-quran-majeed.ttf',
    label: 'Al Qalam Quran Majeed',
    labelUrdu: 'القلم قرآن مجید',
    kind: 'indopak',
    // An IndoPak Quran face. It draws Uthmani text as given, so alif wasla (U+0671) keeps its
    // wasla mark (unwritten in IndoPak); Quran.com's IndoPak text (alif U+0627 + fatha …) reads as
    // an IndoPak mushaf. It draws U+0652 as the half-circle jazm and U+06E1 as a small circle; the
    // IndoPak text uses U+0652 only.
    script: 'indopak',
    // Alef 0.656em vs Amiri Quran 0.696em, letter bodies slightly taller: same visual size.
    scale: 1,
    // hhea line gap is 0. Ink of the Uthmani study text: «فَأُو۟لَـٰٓئِكَ» reaches 1.337em, «وَبِيَعٌۭ»
    // 0.653em below. The IndoPak text it shows instead (Quran.com text_indopak of the same ayahs,
    // 7295 distinct words) stacks higher: «تَمَنّٰٓى» 1.503em, «حَتّٰٓى» 1.493em (99.9% within
    // 1.382em); 0.62em below. Every word and the "۝ + Urdu digits" ayah-end marker shape without
    // .notdef (the marker's digits are placed inside the circle by the font).
    metrics: { ascent: 1.238, descent: 0.5, inkTop: 1.51, inkBottom: 0.66 },
    license: 'permission',
  },
  {
    id: 'scheherazade-new',
    role: 'quran',
    family: 'ScheherazadeNew',
    file: 'scheherazade-new.ttf',
    label: 'Scheherazade New',
    labelUrdu: 'شہرزاد نیو',
    kind: 'naskh',
    // General Naskh faces (no IndoPak orthography design): they keep the stored Uthmani text.
    script: 'uthmani',
    scale: 1,
    metrics: { ascent: 1.343, descent: 0.697, inkTop: 1.588, inkBottom: 1.22 },
    license: 'OFL-1.1',
  },
  {
    id: 'noto-naskh-quran',
    role: 'quran',
    family: 'Naskh',
    file: 'naskh.ttf',
    label: 'Noto Naskh Arabic',
    labelUrdu: 'نوٹو نسخ',
    kind: 'naskh',
    script: 'uthmani',
    scale: 1,
    metrics: { ascent: 1.069, descent: 0.634, inkTop: 1.277, inkBottom: 0.6 },
    license: 'OFL-1.1',
  },
  {
    id: 'noto-naskh',
    role: 'urdu',
    family: 'Naskh',
    file: 'naskh.ttf',
    label: 'Noto Naskh Arabic',
    labelUrdu: 'نوٹو نسخ',
    kind: 'naskh',
    scale: 1,
    metrics: { ascent: 1.069, descent: 0.634, inkTop: 1.277, inkBottom: 0.6 },
    license: 'OFL-1.1',
  },
  {
    id: 'noto-nastaliq',
    role: 'urdu',
    family: 'Nastaliq',
    file: 'nastaliq.ttf',
    label: 'Noto Nastaliq Urdu',
    labelUrdu: 'نوٹو نستعلیق',
    kind: 'nastaliq',
    // Alef and letter bodies are ~1.3x Naskh's at the same size; 0.85 keeps Nastaliq legible.
    scale: 0.85,
    // Ink: the Nastaliq cascade of «لَيَجْمَعَنَّكُمْ» reaches 2.72em; ﷺ reaches 1.382em below.
    // 99.9% of words stay within 2.35em / 0.78em.
    metrics: { ascent: 1.904, descent: 0.596, inkTop: 2.72, inkBottom: 1.382 },
    license: 'OFL-1.1',
    // Missing the Quranic marks quoted inside Urdu explanations: U+06DC, U+06DF (1800 uses),
    // U+06E2 (957), U+06E5 (403), U+06E6 (329), U+06E7 (13), U+06ED (2480).
    coverageNote: 'Some Quranic marks in quoted Arabic words use a fallback font.',
    coverageNoteUrdu:
      'وضاحتوں میں منقول قرآنی الفاظ کی بعض علامتیں متبادل فونٹ میں دکھائی دیتی ہیں۔',
  },
  {
    id: 'lateef',
    role: 'urdu',
    family: 'Lateef',
    file: 'lateef.ttf',
    label: 'Lateef',
    labelUrdu: 'لطیف',
    kind: 'naskh',
    // Lateef is drawn small (alef 0.53em vs Naskh 0.67em; letter bodies about two thirds).
    scale: 1.35,
    metrics: { ascent: 0.946, descent: 0.5, inkTop: 1.154, inkBottom: 0.848 },
    license: 'OFL-1.1',
  },
  {
    id: 'scheherazade-new-urdu',
    role: 'urdu',
    family: 'ScheherazadeNew',
    file: 'scheherazade-new.ttf',
    label: 'Scheherazade New',
    labelUrdu: 'شہرزاد نیو',
    kind: 'naskh',
    scale: 1,
    metrics: { ascent: 1.343, descent: 0.697, inkTop: 1.588, inkBottom: 1.22 },
    license: 'OFL-1.1',
  },
];

export const defaultFontIds: Readonly<Record<FontRole, string>> = {
  quran: 'amiri-quran',
  urdu: 'noto-naskh',
};

export function fontsForRole(role: FontRole): readonly ReadingFont[] {
  return readingFonts.filter((font) => font.role === role);
}

/**
 * The Quranic text to display for a word in a font: the IndoPak text for an IndoPak font when the
 * word has one, otherwise the stored Uthmani `arabic`. Display only: search, ids, grammar data and
 * Corpus segments stay on `arabic`.
 */
export function quranText(
  word: { readonly arabic: string; readonly arabicIndoPak?: string },
  font: Pick<ReadingFont, 'script'>,
): string {
  return (font.script === 'indopak' && word.arabicIndoPak) || word.arabic;
}

/**
 * Pause (waqf) marks that IndoPak fonts draw past the end of their word: they have no advance
 * width, and in Al Qalam Quran Majeed their ink reaches 0.3-0.5em beyond the word (U+0615,
 * U+06D6-U+06DB and the font's private-use waqf glyphs; measured from the font file).
 */
const overhangingPauseMark = /[\u0615\u06D6-\u06DB\uE000-\uF8FF]$/;

/** Al Qalam Quran Majeed's space advance (em); its gaps are counted in these spaces. */
const indoPakSpace = 0.1;

/**
 * The separator between two Quranic words in running text (display only), after the word
 * `previous` as shown. Uthmani fonts use a plain space. IndoPak fonts get a wider gap: Al Qalam's
 * space is only 0.1em (words nearly touched) and a pause mark ending the previous word overprinted
 * the next one (3:2 «هُوَۙ الۡحَىُّ»). The gap is made of ordinary spaces only: Al Qalam has no
 * thin, en or figure space, and the fallback glyphs threw Android's justified line widths off. A
 * line breaks only after the last space. The wide gap after a pause mark keeps its spaces before a
 * word joiner (U+2060), so only its last space hangs at a line end: a long run of hanging spaces
 * pushed the start of that line past the edge on Android (2:2 ending with «فِيۡهِۛۚ»).
 */
export function quranWordGap(previous: string, font: Pick<ReadingFont, 'script'>): string {
  const extra = quranWordGapExtra(previous, font);
  const spaces = ' '.repeat(Math.round(extra / indoPakSpace));
  return extra < 0.5 ? `${spaces} ` : `${spaces}\u2060 `;
}

/**
 * The width (em) that `quranWordGap` adds to one ordinary space: 0 (Uthmani), 0.2 (IndoPak) or
 * 0.7 (IndoPak, after an overhanging pause mark). On the web, where repeated spaces collapse,
 * render one space with this `word-spacing` instead.
 */
export function quranWordGapExtra(previous: string, font: Pick<ReadingFont, 'script'>): number {
  if (font.script !== 'indopak') return 0;
  return overhangingPauseMark.test(previous) ? 0.7 : 0.2;
}

/**
 * The non-breaking gap between an ayah's last word (as shown) and its ayah-end marker, so the
 * marker never starts a line alone. Uthmani fonts use a no-break space. Al Qalam's no-break space
 * has no width, so IndoPak fonts use ordinary spaces (see quranWordGap) closed by a word joiner
 * (U+2060): no line break is allowed before a word joiner, so none falls inside the gap.
 */
export function quranAyahEndGap(lastWord: string, font: Pick<ReadingFont, 'script'>): string {
  if (font.script !== 'indopak') return '\u00A0';
  return ' '.repeat(Math.round(quranAyahEndGapExtra(lastWord, font) / indoPakSpace)) + '\u2060';
}

/** The width (em) of `quranAyahEndGap` for IndoPak fonts (0 for Uthmani fonts' no-break space). */
export function quranAyahEndGapExtra(lastWord: string, font: Pick<ReadingFont, 'script'>): number {
  if (font.script !== 'indopak') return 0;
  return overhangingPauseMark.test(lastWord) ? 0.8 : 0.3;
}

/**
 * Running Quranic text joined by single spaces (an ayah, or part of one) with each space replaced
 * by `quranWordGap`. `before` is the text shown just before `text` (for a part of an ayah).
 */
export function spaceQuranText(
  text: string,
  font: Pick<ReadingFont, 'script'>,
  before = '',
): string {
  if (font.script !== 'indopak') return text;
  return text.replace(/ /g, (_, offset: number) =>
    quranWordGap(offset > 0 ? text[offset - 1]! : before, font),
  );
}

/** A practice option's text in a font: the IndoPak text of a Quranic word option for an IndoPak font. */
export function practiceOptionText(
  option: { readonly text: string; readonly textIndoPak?: string },
  font: Pick<ReadingFont, 'script'>,
): string {
  return (font.script === 'indopak' && option.textIndoPak) || option.text;
}

/**
 * A grammar-topic example's word and ayah in one orthography for a font (see `quranText`): the
 * IndoPak pair when the font is IndoPak and both texts exist, otherwise the Uthmani pair, so the
 * word can always be located in the ayah.
 */
export function exampleQuranText(
  example: {
    readonly wordArabic: string;
    readonly wordArabicIndoPak: string;
    readonly ayahArabic: string;
    readonly ayahArabicIndoPak: string;
  },
  font: Pick<ReadingFont, 'script'>,
): { readonly word: string; readonly ayah: string } {
  return font.script === 'indopak' && example.wordArabicIndoPak && example.ayahArabicIndoPak
    ? { word: example.wordArabicIndoPak, ayah: example.ayahArabicIndoPak }
    : { word: example.wordArabic, ayah: example.ayahArabic };
}

/**
 * Split an ayah (its words joined by single spaces) around the word at `position` (1-based), for
 * highlighting it in place; null when the word text is not in the ayah. Words may themselves
 * contain spaces (IndoPak «وَ عَمِلُوا», «ذٰ لِكُمُ», attached pause signs), so the ayah is not split
 * on spaces: the word is the first space-delimited match with at least `position - 1` spaces
 * before it (a word's own spaces only add to that count). With repeated words and inner spaces
 * the match can be an identical earlier word (2 of 77,429 IndoPak words; none in topic examples).
 * The spaces of Uthmani pause signs («رَيْبَ ۛ») and a leading ۞ are not counted (`separatesWords`).
 */
/** A space-led pause/sajdah sign token of Quran.com's Uthmani text (« ۛ», «  ۖ», « ۩‏»). */
const pauseToken = / *[\u06d6-\u06dc\u06e9\u200e\u200f\u061c]+(?: |$)/y;

/**
 * Whether the character at `index` is a space between two words: not the space inside a word
 * before its pause sign («رَيْبَ ۛ») or after a leading rub el hizb («۞ هَيْهَاتَ», 23:36:1).
 */
function separatesWords(text: string, index: number): boolean {
  if (text[index] !== ' ') return false;
  if (index === 1 && text[0] === '\u06de') return false;
  pauseToken.lastIndex = index + 1;
  return !pauseToken.test(text);
}

export function splitAyahAtWord(
  ayah: string,
  word: string,
  position: number,
): { readonly before: string; readonly word: string; readonly after: string } | null {
  if (!word) return null;
  let found = -1;
  let spaces = 0;
  let counted = 0;
  for (let index = ayah.indexOf(word); index >= 0; index = ayah.indexOf(word, index + 1)) {
    const end = index + word.length;
    if ((index > 0 && ayah[index - 1] !== ' ') || (end < ayah.length && ayah[end] !== ' ')) continue;
    for (; counted < index; counted += 1) if (separatesWords(ayah, counted)) spaces += 1;
    if (found < 0) found = index;
    if (spaces >= position - 1) {
      found = index;
      break;
    }
  }
  if (found < 0) return null;
  return {
    before: ayah.slice(0, Math.max(found - 1, 0)),
    word,
    after: ayah.slice(found + word.length + 1),
  };
}

/** The font for a stored id, falling back to the role default for unknown/stale ids. */
export function resolveFont(role: FontRole, id: string | null | undefined): ReadingFont {
  return (
    readingFonts.find((font) => font.role === role && font.id === id) ??
    readingFonts.find((font) => font.id === defaultFontIds[role])!
  );
}

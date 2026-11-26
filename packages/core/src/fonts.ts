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
 * with fatha, sukun U+06E1, attached waqf signs …).
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
    // than the head bounding box (0.835em) that the old tokens.ts fontMetrics used.
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
    // wasla mark (unwritten in IndoPak); Quran.com's IndoPak text (alif U+0627 + fatha, U+06E1 …)
    // reads as an IndoPak mushaf.
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

/** The font for a stored id, falling back to the role default for unknown/stale ids. */
export function resolveFont(role: FontRole, id: string | null | undefined): ReadingFont {
  return (
    readingFonts.find((font) => font.role === role && font.id === id) ??
    readingFonts.find((font) => font.id === defaultFontIds[role])!
  );
}

import type { FontMetrics, ReadingFont } from '@quran-grammar/core';

/** lineHeight (em) whose equally split leading keeps every glyph of the font inside the line box. */
export function inkLineHeight({ ascent, descent, inkTop, inkBottom }: FontMetrics): number {
  return ascent + descent + 2 * Math.max(0, inkTop - ascent, inkBottom - descent);
}

/** A design size (for the default font of the role) adjusted by the font's visual `scale`. */
export function scaledSize(font: ReadingFont, fontSize: number): number {
  return font.scale === 1 ? fontSize : Math.round(fontSize * font.scale * 2) / 2;
}

/**
 * lineHeight for Quranic text at a (scaled) size. React Native splits the leading equally (Android
 * CustomLineHeightSpan: ascent − ⌈L/2⌉, descent + ⌊L/2⌋; iOS likewise), so this line box holds the
 * tallest and deepest shaped ink of the font.
 */
export function quranLineHeight(font: ReadingFont, size: number): number {
  return Math.ceil(size * inkLineHeight(font.metrics));
}

/** The smallest lineHeight that keeps an Urdu font's strokes inside the line box at `size`. */
export function urduMinLineHeight(font: ReadingFont, size: number): number {
  return Math.ceil(size * (font.metrics.ascent + font.metrics.descent));
}

/**
 * Size and lineHeight for Urdu at a design `fontSize` (and optional design `lineHeight`, default
 * 1.75em): the font's `scale` is applied, then the lineHeight is raised to the font's minimum.
 */
export function urduLine(
  font: ReadingFont,
  fontSize: number,
  lineHeight?: number,
): { fontSize: number; lineHeight: number } {
  const size = scaledSize(font, fontSize);
  const wanted =
    lineHeight === undefined ? Math.round(size * 1.75) : Math.round(lineHeight * font.scale);
  return { fontSize: size, lineHeight: Math.max(wanted, urduMinLineHeight(font, size)) };
}

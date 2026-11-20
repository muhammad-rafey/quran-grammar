import { I18nManager, Platform, type TextStyle } from 'react-native';
import type { ReadingFont } from '@quran-grammar/core';
import { quranLineHeight, scaledSize, urduLine } from './font-metrics';
import { physicalRowDirection } from './physical-row';

export { urduMinLineHeight } from './font-metrics';

export const colors = {
  background: '#f7f8ef',
  paper: '#ffffff',
  ink: '#203b30',
  muted: '#65736b',
  primary: '#14654c',
  primaryEdge: '#104e3b',
  wash: '#eaf4df',
  mint: '#eef6ee',
  lime: '#d8ed9b',
  border: '#dbe5d5',
  edge: '#cbd9c4',
  white: '#ffffff',
  transparent: 'transparent',
  gold: '#b57a22',
  amber: '#80601c',
  amberWash: '#fbf5e6',
  blue: '#42648b',
  blueWash: '#edf2f9',
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const radius = { sm: 10, md: 16, lg: 24, pill: 999 } as const;
export const shadows = { floating: '0 8px 28px rgba(32,59,48,0.13)' } as const;

/**
 * Line layout for the selectable reading fonts (registry and em metrics in
 * packages/core/src/fonts.ts, measured from the font files and the shaped study text; the em
 * arithmetic is in font-metrics.ts). Size text through `useTypography()` (typography.ts) instead of
 * hand-written fontSize/lineHeight pairs.
 *
 * Android draws a Text only inside its own box, and with an explicit lineHeight React Native makes
 * the box of a one-line Text exactly `lineHeight` tall (ascent/descent ± half the leading), so ink
 * outside that band is cut off; extra paddingBottom does not help because TextView clips to the
 * content box at the bottom. Amiri Quran's below-marks (kasratan, small meem/noon under م ق غ ...)
 * reach far under its descent, so its old 29/66 style (and screen overrides such as 34/64) cropped
 * the bottom of many Quranic words.
 *
 * Quranic Arabic in `font` at `fontSize`, without clipped marks: an explicit lineHeight whose equally
 * split leading holds the font's tallest/deepest shaped ink (registry inkTop/inkBottom), on both
 * platforms. Android's natural layout (no lineHeight, includeFontPadding) is not used: it extends
 * lines only to the font's head bounding box, which stops short of the shaped ink (Amiri Quran's
 * small low meem in «أَلِيمٌۭ» reaches 0.95em, its box 0.835em; Scheherazade New 1.22em vs 0.74em)
 * or is far too tall (DigitalKhatt IndoPak, 3.70em, from unused stretched glyphs).
 */
export function quranTextStyle(font: ReadingFont, fontSize = 29): TextStyle {
  const size = scaledSize(font, fontSize);
  return {
    fontFamily: font.family,
    fontSize: size,
    lineHeight: quranLineHeight(font, size),
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
  };
}

/**
 * Urdu in `font` at `fontSize` (a design size; the font's `scale` is applied). `lineHeight` is
 * raised to at least the font's own ascent+descent (1.70em for Noto Naskh Arabic, far more for
 * Nastaliq) so ک/گ strokes and ی/ے tails never fall outside the line box.
 */
export function urduTextStyle(font: ReadingFont, fontSize: number, lineHeight?: number): TextStyle {
  return { fontFamily: font.family, ...urduLine(font, fontSize, lineHeight) };
}

/**
 * Append to the text of a Text that is sized to its content (a chip, a centred label, a button):
 * `<Text>{label}{lineEndSlack}</Text>`.
 *
 * Android measures text with summed glyph advances, but the TextView that draws it (apps target
 * SDK 35+) breaks lines using the glyphs' ink bounds, which are a pixel or two wider for Urdu/Arabic
 * strokes such as ک, گ and ی. A one-line label laid out at exactly its measured width then wraps
 * its last word onto a second line that falls outside the box, so the word disappears (seen with
 * «حرفِ عطف + اسم + ضمیر»). A trailing thin space is counted when measuring but hangs (is ignored)
 * when the line is broken, which gives the drawn line the missing slack. Android only.
 */
export const lineEndSlack = Platform.OS === 'android' ? '\u2009' : '';

export const row = {
  flexDirection: physicalRowDirection(true, I18nManager.isRTL),
  alignItems: 'center',
  gap: 10,
} as const;
export const card = {
  backgroundColor: colors.paper,
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: radius.lg,
  borderCurve: 'continuous',
  padding: spacing.lg,
  gap: 10,
} as const;

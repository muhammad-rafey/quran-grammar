import { StyleSheet, type StyleProp, type TextStyle } from 'react-native';
import {
  defaultTextSizes,
  scaleFontSize,
  type ReadingFont,
  type TextSizes,
} from '@quran-grammar/core';
import { useInterface } from '@/state/preferences-provider';
import { quranTextStyle, urduMinLineHeight, urduTextStyle } from './tokens';
import { useTheme, type Palette } from './theme';

/**
 * Text styles for the reader's chosen Quran and Urdu fonts. One frozen object per font pair (shared
 * and colour scheme, shared by every component), so memoized components can depend on it and styles
 * are built once per font or theme change rather than on each render. Sizes are design sizes for the default fonts; each font's
 * registry `scale` and metrics are applied here (see tokens.ts for the clipping rules).
 *
 * The reader's text sizes (Settings → Text size, core text-size.ts) are applied here too: every
 * Quranic Arabic style (`arabic`, `arabicText`) is multiplied by `textSizes.quran` and the ayah
 * translation styles by `textSizes.translation`; the line heights are then computed for the scaled
 * size, so marks stay inside the line box at every step.
 */
export type Typography = {
  readonly quranFont: ReadingFont;
  readonly urduFont: ReadingFont;
  /** The reader's Quran and translation text sizes applied below. */
  readonly textSizes: TextSizes;
  /** The palette the text colours below come from (see theme.tsx). */
  readonly colors: Palette;
  /** Quranic Arabic at the reading size (29 × the Quran text size), ink colour, right-to-left. */
  readonly arabic: TextStyle;
  /**
   * Quranic Arabic at the design `fontSize` × the Quran text size (at most `maxSize`, for a display
   * heading that must fit a phone's width): font family, size and lineHeight only.
   */
  readonly arabicText: (fontSize?: number, maxSize?: number) => TextStyle;
  /** Urdu at `fontSize`; `lineHeight` is raised to what the font needs. */
  readonly urduText: (fontSize: number, lineHeight?: number) => TextStyle;
  /** Urdu reading styles: body 18/32, small 15/26 (muted), heading 22/38. */
  readonly body: TextStyle;
  readonly small: TextStyle;
  readonly heading: TextStyle;
  /** An ayah translation: body (18/32) or small (15/26, muted) × the translation text size. */
  readonly translation: TextStyle;
  readonly translationSmall: TextStyle;
  /**
   * Flattens a text style and, when it is set in the Urdu font, raises a too-small lineHeight to the
   * font's ascent+descent so letters are not cropped on Android.
   */
  readonly safe: (style: StyleProp<TextStyle>) => TextStyle;
};

const rtl = { textAlign: 'right', writingDirection: 'rtl' } as const;

function memoBySize<T>(build: (key: string) => T): (key: string) => T {
  const cache = new Map<string, T>();
  return (key) => {
    let value = cache.get(key);
    if (value === undefined) {
      value = build(key);
      cache.set(key, value);
    }
    return value;
  };
}

function createTypography(
  quranFont: ReadingFont,
  urduFont: ReadingFont,
  colors: Palette,
  textSizes: TextSizes,
): Typography {
  const quranAt = memoBySize((key) => Object.freeze(quranTextStyle(quranFont, Number(key))));
  const quranSize = (fontSize: number, maxSize = Infinity) =>
    String(Math.min(scaleFontSize(fontSize, textSizes.quran), Math.max(fontSize, maxSize)));
  const translationAt = (fontSize: number, lineHeight: number) =>
    urduText(
      scaleFontSize(fontSize, textSizes.translation),
      Math.round(lineHeight * textSizes.translation),
    );
  const urduAt = memoBySize((key) => {
    const [size, lineHeight] = key.split('/');
    return Object.freeze(
      urduTextStyle(urduFont, Number(size), lineHeight ? Number(lineHeight) : undefined),
    );
  });
  const urduText = (fontSize: number, lineHeight?: number) =>
    urduAt(lineHeight === undefined ? `${fontSize}` : `${fontSize}/${lineHeight}`);
  return Object.freeze({
    quranFont,
    urduFont,
    textSizes,
    colors,
    arabic: Object.freeze({ ...quranAt(quranSize(29)), color: colors.ink, ...rtl }),
    arabicText: (fontSize = 29, maxSize?: number) => quranAt(quranSize(fontSize, maxSize)),
    urduText,
    body: Object.freeze({ ...urduText(18, 32), color: colors.ink, ...rtl }),
    small: Object.freeze({ ...urduText(15, 26), color: colors.muted, ...rtl }),
    heading: Object.freeze({ ...urduText(22, 38), color: colors.ink, ...rtl }),
    translation: Object.freeze({ ...translationAt(18, 32), color: colors.ink, ...rtl }),
    translationSmall: Object.freeze({ ...translationAt(15, 26), color: colors.muted, ...rtl }),
    safe: (style: StyleProp<TextStyle>) => {
      const flat = StyleSheet.flatten(style);
      if (flat.fontFamily !== urduFont.family || !flat.fontSize) return flat;
      const minimum = urduMinLineHeight(urduFont, flat.fontSize);
      const lineHeight = flat.lineHeight ?? Math.round(flat.fontSize * 1.75);
      return lineHeight >= minimum ? { ...flat, lineHeight } : { ...flat, lineHeight: minimum };
    },
  });
}

const typographies = new Map<string, WeakMap<Palette, Typography>>();

/** The shared Typography for a font pair and text sizes in a palette. */
export function typographyFor(
  quranFont: ReadingFont,
  urduFont: ReadingFont,
  colors: Palette,
  textSizes: TextSizes = defaultTextSizes,
): Typography {
  const key = `${quranFont.id}|${urduFont.id}|${textSizes.quran}|${textSizes.translation}`;
  let byPalette = typographies.get(key);
  if (!byPalette) {
    byPalette = new WeakMap();
    typographies.set(key, byPalette);
  }
  let typography = byPalette.get(colors);
  if (!typography) {
    typography = createTypography(quranFont, urduFont, colors, textSizes);
    byPalette.set(colors, typography);
  }
  return typography;
}

/**
 * Typography for the reader's fonts (the chosen ones once loaded; see preferences-provider) at
 * the reader's text sizes.
 */
export function useTypography(): Typography {
  const { activeFonts, textSizes } = useInterface();
  const { colors } = useTheme();
  return typographyFor(activeFonts.quran, activeFonts.urdu, colors, textSizes);
}

const derived = new WeakMap<object, WeakMap<Typography, unknown>>();

/**
 * Styles derived from a Typography by a module-level `build` function, built once per font pair
 * and palette (`typography.colors`) and shared, e.g. a screen's StyleSheet of font-dependent entries.
 */
export function fontStyles<T>(typography: Typography, build: (typography: Typography) => T): T {
  let byTypography = derived.get(build);
  if (!byTypography) {
    byTypography = new WeakMap();
    derived.set(build, byTypography);
  }
  if (!byTypography.has(typography)) byTypography.set(typography, build(typography));
  return byTypography.get(typography) as T;
}

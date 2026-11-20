import { StyleSheet, type StyleProp, type TextStyle } from 'react-native';
import type { ReadingFont } from '@quran-grammar/core';
import { useInterface } from '@/state/preferences-provider';
import { colors, quranTextStyle, urduMinLineHeight, urduTextStyle } from './tokens';

/**
 * Text styles for the reader's chosen Quran and Urdu fonts. One frozen object per font pair (shared
 * by every component), so memoized components can depend on it and styles are built once per font
 * change rather than on each render. Sizes are design sizes for the default fonts; each font's
 * registry `scale` and metrics are applied here (see tokens.ts for the clipping rules).
 */
export type Typography = {
  readonly quranFont: ReadingFont;
  readonly urduFont: ReadingFont;
  /** Quranic Arabic at the reading size (29), ink colour, right-to-left. */
  readonly arabic: TextStyle;
  /** Quranic Arabic at `fontSize`: font family and size (and lineHeight on iOS) only. */
  readonly arabicText: (fontSize?: number) => TextStyle;
  /** Urdu at `fontSize`; `lineHeight` is raised to what the font needs. */
  readonly urduText: (fontSize: number, lineHeight?: number) => TextStyle;
  /** Urdu reading styles: body 18/32, small 15/26 (muted), heading 22/38. */
  readonly body: TextStyle;
  readonly small: TextStyle;
  readonly heading: TextStyle;
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

function createTypography(quranFont: ReadingFont, urduFont: ReadingFont): Typography {
  const quranAt = memoBySize((key) => Object.freeze(quranTextStyle(quranFont, Number(key))));
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
    arabic: Object.freeze({ ...quranTextStyle(quranFont, 29), color: colors.ink, ...rtl }),
    arabicText: (fontSize = 29) => quranAt(String(fontSize)),
    urduText,
    body: Object.freeze({ ...urduText(18, 32), color: colors.ink, ...rtl }),
    small: Object.freeze({ ...urduText(15, 26), color: colors.muted, ...rtl }),
    heading: Object.freeze({ ...urduText(22, 38), color: colors.ink, ...rtl }),
    safe: (style: StyleProp<TextStyle>) => {
      const flat = StyleSheet.flatten(style);
      if (flat.fontFamily !== urduFont.family || !flat.fontSize) return flat;
      const minimum = urduMinLineHeight(urduFont, flat.fontSize);
      const lineHeight = flat.lineHeight ?? Math.round(flat.fontSize * 1.75);
      return lineHeight >= minimum ? { ...flat, lineHeight } : { ...flat, lineHeight: minimum };
    },
  });
}

const typographies = new Map<string, Typography>();

/** The shared Typography for a font pair. */
export function typographyFor(quranFont: ReadingFont, urduFont: ReadingFont): Typography {
  const key = `${quranFont.id}|${urduFont.id}`;
  let typography = typographies.get(key);
  if (!typography) {
    typography = createTypography(quranFont, urduFont);
    typographies.set(key, typography);
  }
  return typography;
}

/** Typography for the reader's fonts (the chosen ones once loaded; see preferences-provider). */
export function useTypography(): Typography {
  const { activeFonts } = useInterface();
  return typographyFor(activeFonts.quran, activeFonts.urdu);
}

const derived = new WeakMap<object, WeakMap<Typography, unknown>>();

/**
 * Styles derived from a Typography by a module-level `build` function, built once per font pair
 * and shared, e.g. a screen's StyleSheet of font-dependent entries.
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

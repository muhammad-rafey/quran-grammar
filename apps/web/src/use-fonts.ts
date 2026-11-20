import { useLayoutEffect, useState } from 'react';
import { defaultFontIds, resolveFont, type FontRole, type ReadingFont } from '@quran-grammar/core';

const preferenceKeys: Readonly<Record<FontRole, string>> = {
  quran: 'quran-grammar.quran-font',
  urdu: 'quran-grammar.urdu-font',
};

/**
 * Families declared in styles.css before the font registry existed. They stay in every font stack
 * so text keeps today's look if a registry face (fonts.css) fails to load.
 */
const legacyFamilies: Readonly<Record<FontRole, string>> = { quran: 'Amiri', urdu: 'Naskh' };

/** Full ink extent (highest mark above + deepest mark below the baseline) in em. */
const inkHeight = (font: ReadingFont) => font.metrics.inkTop + font.metrics.inkBottom;
const round = (value: number) => String(Math.round(value * 1000) / 1000);

/** Line-height multiplier (>= 1): the font's ink extent relative to its role's default font. */
export function lineScale(font: ReadingFont): string {
  // Capped: the ink extent comes from the single tallest stacked word; spacing every line for it
  // makes Nastaliq paragraphs read as double-spaced. Line boxes still never clip (overflow visible).
  return round(
    Math.min(1.45, Math.max(1, inkHeight(font) / inkHeight(resolveFont(font.role, null)))),
  );
}

/** CSS font stack for a font: the registry family, then the legacy face, then serif. */
export function fontStack(font: ReadingFont): string {
  return `'${font.family}', ${legacyFamilies[font.role]}, serif`;
}

/**
 * Custom properties for the chosen fonts, applied on the document root and read by styles.css:
 * - `--font-quran` / `--font-urdu`: font stacks.
 * - `--font-urdu-gloss`: only for a non-default Urdu font; word meanings and the word-panel
 *   translation otherwise keep their Nastaliq default.
 * - `--quran-scale` / `--urdu-scale`: font-size multipliers from the registry `scale`.
 * - `--quran-line-scale` / `--urdu-line-scale`: line-height multipliers (>= 1), the font's ink
 *   extent relative to the role default, so the hand-tuned line heights stay unchanged for the
 *   default fonts and grow for taller fonts (marks never collide or clip).
 * - `--quran-line-height` / `--urdu-line-height`: the font's ink extent in em, used as a floor
 *   (`max(<line-height>, var(...))`) where a line height was tuned for a different font.
 */
export function fontVariables(
  quran: ReadingFont,
  urdu: ReadingFont,
  urduChosen = urdu.id !== defaultFontIds.urdu,
): Record<string, string | null> {
  return {
    '--font-quran': fontStack(quran),
    '--font-urdu': fontStack(urdu),
    // Until the reader picks an Urdu font, word meanings keep the app's original Nastaliq look;
    // once any Urdu font is chosen (including Noto Naskh), every Urdu text uses it.
    '--font-urdu-gloss': urduChosen ? fontStack(urdu) : null,
    '--quran-scale': round(quran.scale),
    '--urdu-scale': round(urdu.scale),
    '--quran-line-scale': lineScale(quran),
    '--urdu-line-scale': lineScale(urdu),
    '--quran-line-height': round(inkHeight(quran)),
    '--urdu-line-height': round(inkHeight(urdu)),
  };
}

function readFont(role: FontRole): ReadingFont {
  try {
    return resolveFont(role, localStorage.getItem(preferenceKeys[role]));
  } catch {
    return resolveFont(role, null);
  }
}

/** Starts loading a face so switching fonts does not flash the fallback. */
function preload(font: ReadingFont) {
  try {
    void document.fonts?.load(`16px '${font.family}'`).catch(() => undefined);
  } catch {
    // Font loading is best effort; the stack falls back to the legacy face.
  }
}

/** Quran and Urdu reading fonts from Settings, persisted locally like the interface language. */
export function useFonts() {
  const [fonts, setFonts] = useState<Record<FontRole, ReadingFont>>(() => ({
    quran: readFont('quran'),
    urdu: readFont('urdu'),
  }));
  const [saveError, setSaveError] = useState(false);
  const [urduChosen, setUrduChosen] = useState(() => {
    try {
      return localStorage.getItem(preferenceKeys.urdu) !== null;
    } catch {
      return false;
    }
  });

  // Layout effect: the variables are in place before the first paint (no flash of another font).
  useLayoutEffect(() => {
    const style = document.documentElement.style;
    for (const [name, value] of Object.entries(
      fontVariables(fonts.quran, fonts.urdu, urduChosen || fonts.urdu.id !== defaultFontIds.urdu),
    )) {
      if (value === null) style.removeProperty(name);
      else style.setProperty(name, value);
    }
    preload(fonts.quran);
    preload(fonts.urdu);
  }, [fonts, urduChosen]);

  const changeFont = (role: FontRole, id: string) => {
    const font = resolveFont(role, id);
    preload(font);
    setFonts((current) => ({ ...current, [role]: font }));
    if (role === 'urdu') setUrduChosen(true);
    try {
      localStorage.setItem(preferenceKeys[role], font.id);
      setSaveError(false);
    } catch {
      setSaveError(true);
    }
  };

  return { quranFont: fonts.quran, urduFont: fonts.urdu, changeFont, saveError };
}

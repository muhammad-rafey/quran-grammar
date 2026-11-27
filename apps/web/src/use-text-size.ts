import { useLayoutEffect, useState } from 'react';
import {
  parseTextSizes,
  resolveTextSize,
  serializeTextSizes,
  type TextSizeRole,
  type TextSizes,
} from '@quran-grammar/core';

const preferenceKey = 'quran-grammar.text-size';

/**
 * Custom properties for the reader's text sizes (Settings → Text size), applied on the document
 * root and read by styles.css:
 * - `--quran-text-scale`: multiplies the font size of Quranic Arabic (word blocks, plain/mushaf
 *   text, the word panel heading, topic examples, Arabic practice options).
 * - `--translation-text-scale`: multiplies the font size of the ayah translations.
 * Line heights there are unitless multiples of the font size (with the font's ink extent from
 * use-fonts.ts), so they grow with the text and marks never clip.
 */
export function textSizeVariables(sizes: TextSizes): Record<string, string> {
  return {
    '--quran-text-scale': String(sizes.quran),
    '--translation-text-scale': String(sizes.translation),
  };
}

function readSizes(): TextSizes {
  try {
    return parseTextSizes(localStorage.getItem(preferenceKey));
  } catch {
    return parseTextSizes(null);
  }
}

/** Quran and translation text sizes from Settings, persisted locally like the interface language. */
export function useTextSize() {
  const [sizes, setSizes] = useState<TextSizes>(readSizes);
  const [saveError, setSaveError] = useState(false);

  // Layout effect: the sizes are in place before the first paint (no reflow after load).
  useLayoutEffect(() => {
    const style = document.documentElement.style;
    for (const [name, value] of Object.entries(textSizeVariables(sizes))) {
      style.setProperty(name, value);
    }
  }, [sizes]);

  const changeTextSize = (change: Partial<Record<TextSizeRole, number>>) => {
    const next = {
      quran: resolveTextSize(change.quran ?? sizes.quran),
      translation: resolveTextSize(change.translation ?? sizes.translation),
    };
    setSizes(next);
    try {
      localStorage.setItem(preferenceKey, serializeTextSizes(next));
      setSaveError(false);
    } catch {
      setSaveError(true);
    }
  };

  return { textSizes: sizes, changeTextSize, saveError };
}

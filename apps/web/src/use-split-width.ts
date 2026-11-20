import { useCallback, useState } from 'react';

const preferenceKey = 'quran-grammar.split-width';

/** Narrowest word-study panel (px). Mirrored by the clamp() in `.study-layout[data-split]`. */
export const minDetailWidth = 280;
/** Narrowest Quran reading area (px). Mirrored by the clamp() in `.study-layout[data-split]`. */
export const minReadingWidth = 420;

/**
 * Word-study panel width as a fraction of the space shared by both columns
 * (container width minus the gap), or null for the default stylesheet width.
 */
export type SplitWidth = number | null;

function isFraction(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 && value < 1;
}

function readPreference(): SplitWidth {
  try {
    const stored = Number(localStorage.getItem(preferenceKey) ?? NaN);
    return isFraction(stored) ? stored : null;
  } catch {
    return null;
  }
}

/** The fraction limits that keep both columns at or above their minimum widths. */
export function splitLimits(available: number) {
  if (!(available > 0)) return { min: 0, max: 1 };
  const min = Math.min(1, minDetailWidth / available);
  const max = Math.max(min, (available - minReadingWidth) / available);
  return { min, max };
}

/** Four decimals are finer than a pixel at any realistic width and keep storage tidy. */
export function roundSplit(fraction: number) {
  return Math.round(fraction * 10000) / 10000;
}

export function clampSplit(fraction: number, available: number) {
  const { min, max } = splitLimits(available);
  return Math.min(max, Math.max(min, fraction));
}

/** Desktop splitter position, persisted locally like the other reading preferences. */
export function useSplitWidth() {
  const [split, setSplit] = useState<SplitWidth>(readPreference);
  const changeSplit = useCallback((next: SplitWidth) => {
    const value = next === null || !isFraction(next) ? null : roundSplit(next);
    setSplit(value);
    try {
      if (value === null) localStorage.removeItem(preferenceKey);
      else localStorage.setItem(preferenceKey, String(value));
    } catch {
      // Storage can be unavailable (private mode, blocked site data); the width still applies.
    }
  }, []);
  return { split, changeSplit };
}

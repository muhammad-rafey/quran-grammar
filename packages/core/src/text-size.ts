/**
 * Reader text-size preferences shared by web and mobile (Settings → Text size). Two independent
 * multipliers of the design font sizes:
 * - `quran`: all Quranic Arabic (word blocks, plain and mushaf flow, the word panel/screen heading
 *   and its ayah, topic examples and Arabic practice options).
 * - `translation`: the Urdu ayah translations (study, word screen and topic examples). Urdu
 *   explanations, word meanings and interface labels keep their size.
 *
 * Each app multiplies its existing sizes and line heights (web: CSS custom properties set by
 * use-text-size.ts; mobile: typography.ts), so the fonts' ink metrics keep marks unclipped at any
 * step. Stored locally as JSON `{"quran":1.15,"translation":1}`.
 *
 * This module has no imports so app tests can load it directly with Node's type stripping.
 */
export type TextSizeRole = 'quran' | 'translation';
export type TextSizes = { readonly quran: number; readonly translation: number };

/** The selectable steps, smallest to largest (1 = the design size). */
export const textSizeSteps: readonly number[] = [0.85, 1, 1.15, 1.3, 1.5, 1.75];
export const defaultTextSize = 1;
export const defaultTextSizes: TextSizes = { quran: 1, translation: 1 };
export const textSizeRoles: readonly TextSizeRole[] = ['quran', 'translation'];

/** True for one of the selectable steps. */
export function isTextSize(value: unknown): value is number {
  return typeof value === 'number' && textSizeSteps.includes(value);
}

/** A stored or requested size as a step: the nearest step for a number, else the default. */
export function resolveTextSize(value: unknown): number {
  const number = typeof value === 'string' && value.trim() !== '' ? Number(value) : value;
  if (typeof number !== 'number' || !Number.isFinite(number)) return defaultTextSize;
  let nearest = defaultTextSize;
  for (const step of textSizeSteps) {
    if (Math.abs(step - number) < Math.abs(nearest - number)) nearest = step;
  }
  return nearest;
}

/** The next step up (+1) or down (−1), clamped to the smallest and largest steps. */
export function stepTextSize(size: number, direction: 1 | -1): number {
  const index = textSizeSteps.indexOf(resolveTextSize(size));
  const next = Math.min(textSizeSteps.length - 1, Math.max(0, index + direction));
  return textSizeSteps[next]!;
}

/** Whether a step up (+1) or down (−1) is possible (the − / + buttons are disabled otherwise). */
export function canStepTextSize(size: number, direction: 1 | -1): boolean {
  return stepTextSize(size, direction) !== resolveTextSize(size);
}

/** A size as a whole percentage, e.g. 1.15 → 115. */
export function textSizePercent(size: number): number {
  return Math.round(resolveTextSize(size) * 100);
}

/** Stored sizes (JSON) with each role validated; anything missing or invalid is the default. */
export function parseTextSizes(stored: string | null | undefined): TextSizes {
  if (!stored) return defaultTextSizes;
  try {
    const parsed: unknown = JSON.parse(stored);
    if (!parsed || typeof parsed !== 'object') return defaultTextSizes;
    const record = parsed as Record<string, unknown>;
    return { quran: resolveTextSize(record.quran), translation: resolveTextSize(record.translation) };
  } catch {
    return defaultTextSizes;
  }
}

export function serializeTextSizes(sizes: TextSizes): string {
  return JSON.stringify({
    quran: resolveTextSize(sizes.quran),
    translation: resolveTextSize(sizes.translation),
  });
}

/** A design font size at a text size, rounded to half a pixel. */
export function scaleFontSize(fontSize: number, size: number): number {
  return Math.round(fontSize * size * 2) / 2;
}

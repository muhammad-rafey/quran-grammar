/** Navigation metadata: every chapter is available (kept in sync with the registry by tests). */
export const availableSurahNumbers: readonly number[] = Array.from({ length: 114 }, (_, i) => i + 1);

/**
 * Chapters built only from ayah 1 up to the given ayah. Empty since the whole-Quran build
 * (content-pipeline/full-quran, 2026-11-26); navigation never opens an ayah past this point.
 */
export const partialSurahLastAyah: Readonly<Record<number, number>> = {};

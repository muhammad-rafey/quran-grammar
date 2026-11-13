/** Owner-authorized draft releases, 2026-11-07 and 2026-11-13. Scholarly review is pending. */
export const scholarlyReviewPendingSurahs: readonly number[] = [
  4, 7, 18, 23, 25, 29, 32, 36, 55, 85, 86, 87,
  88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101,
  102, 103, 104,
];

export function isStudyDraft(surahNumber: number): boolean {
  return scholarlyReviewPendingSurahs.includes(surahNumber);
}

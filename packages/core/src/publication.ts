/** Owner-authorized draft release, 2026-11-07; scholarly approval remains pending. */
export const scholarlyReviewPendingSurahs: readonly number[] = [18, 23, 32, 36, 55];

export function isStudyDraft(surahNumber: number): boolean {
  return scholarlyReviewPendingSurahs.includes(surahNumber);
}

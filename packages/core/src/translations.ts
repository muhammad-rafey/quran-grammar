/**
 * Urdu ayah translations offered in Settings (owner decision 2026-11-26), in display order; the
 * first is the default. Text comes from the Quran.com API v4 (`/quran/translations/{resourceId}`),
 * with footnote markers removed; see content-pipeline/full-quran. No tafsir is included.
 */
export interface TranslationEdition {
  readonly id: string;
  /** Quran.com translation resource id. */
  readonly resourceId: number;
  readonly nameEnglish: string;
  readonly nameUrdu: string;
}

export const translationEditions: readonly TranslationEdition[] = [
  { id: 'jalandhari', resourceId: 234, nameEnglish: 'Fateh Muhammad Jalandhari', nameUrdu: 'فتح محمد جالندھری' },
  { id: 'junagarhi', resourceId: 54, nameEnglish: 'Muhammad Junagarhi', nameUrdu: 'محمد جوناگڑھی' },
  { id: 'mahmud-al-hasan', resourceId: 151, nameEnglish: 'Shaykh al-Hind Mahmud al-Hasan', nameUrdu: 'شیخ الہند محمود الحسن' },
  { id: 'israr-ahmad', resourceId: 158, nameEnglish: 'Dr. Israr Ahmad (Bayan-ul-Quran)', nameUrdu: 'ڈاکٹر اسرار احمد (بیان القرآن)' },
  { id: 'maududi', resourceId: 97, nameEnglish: "Syed Abul A'la Maududi (Tafheem-ul-Quran)", nameUrdu: 'سید ابو الاعلیٰ مودودی (تفہیم القرآن)' },
  { id: 'wahiduddin-khan', resourceId: 819, nameEnglish: 'Maulana Wahiduddin Khan', nameUrdu: 'مولانا وحید الدین خان' },
];

export const translationIds: readonly string[] = translationEditions.map((edition) => edition.id);

export const defaultTranslationId = translationEditions[0].id;

export function isTranslationId(value: unknown): value is string {
  return typeof value === 'string' && translationIds.includes(value);
}

/** A stored preference, or the default when it is missing or no longer offered. */
export function resolveTranslationId(value: unknown): string {
  return isTranslationId(value) ? value : defaultTranslationId;
}

/** The selected translation of an ayah ('' if the data has none). */
export function translationText(
  translations: Readonly<Record<string, string>> | undefined,
  id: string,
): string {
  return translations?.[resolveTranslationId(id)] ?? '';
}

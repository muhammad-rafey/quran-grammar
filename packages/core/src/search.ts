import type { PartOfSpeechFilter, StudyData, Word } from './types';

/** Normalize search input without modifying the displayed Quran text. */
export function normalizeText(value: string): string {
  return value
    .normalize('NFKC')
    .replace(/[\u0610-\u061a\u064b-\u065f\u0670\u06d6-\u06ed\u0640]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/[ىی]/g, 'ي')
    .replace(/ک/g, 'ك')
    .replace(/\s+/g, ' ')
    .trim()
    .toLocaleLowerCase();
}

export function urduNumber(value: number | string): string {
  return String(value).replace(/[0-9]/g, (digit) => '۰۱۲۳۴۵۶۷۸۹'[Number(digit)]!);
}

export function matchesWord(
  word: Word,
  study: StudyData,
  query: string,
  pos: PartOfSpeechFilter = 'all',
): boolean {
  if (pos !== 'all' && word.pos !== pos && !(pos === 'noun' && word.pos === 'adjective')) {
    return false;
  }
  const normalized = normalizeText(query);
  if (!normalized) return true;
  const root = word.root ? study.roots[word.root] : undefined;
  const verb = study.verbForms[word.id];
  const text = normalizeText(
    [
      word.id,
      word.arabic,
      word.meaningUrdu,
      word.posUrdu,
      word.root ?? '',
      word.lemma ?? '',
      word.morphologyUrdu,
      word.syntaxUrdu,
      word.dictionaryUrdu,
      ...word.segments.flatMap((segment) => [
        segment.arabic,
        segment.roleUrdu,
        segment.meaningUrdu,
      ]),
      ...(root ? Object.values(root) : []),
      ...(verb ? Object.values(verb) : []),
      ...study.rules.filter((rule) => word.ruleIds.includes(rule.id)).map((rule) => rule.titleUrdu),
    ].join(' '),
  );
  return (
    text.includes(normalized) ||
    Boolean(
      word.root && normalizeText(word.root).replaceAll(' ', '') === normalized.replaceAll(' ', ''),
    )
  );
}

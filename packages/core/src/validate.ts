import type { StudyData } from './types';

type UnknownRecord = Record<string, unknown>;
const record = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const text = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0 && value.length <= 20_000;
const integer = (value: unknown): value is number =>
  typeof value === 'number' && Number.isSafeInteger(value) && value > 0;
const fields = (value: UnknownRecord, names: string[]) => names.every((name) => text(value[name]));
const array = (value: unknown): value is unknown[] =>
  Array.isArray(value) && value.length <= 10_000;
const stringArray = (value: unknown): value is string[] => array(value) && value.every(text);
const unique = (values: unknown[]) => new Set(values).size === values.length;
const positions = new Set(['noun', 'adjective', 'verb', 'particle', 'pronoun']);

/** Validate downloaded data before rendering; also catches broken editorial relationships. */
export function isStudyData(value: unknown): value is StudyData {
  if (!record(value) || value.schemaVersion !== 1 || !record(value.surah)) return false;
  const surah = value.surah;
  if (
    !integer(surah.number) ||
    surah.number > 114 ||
    !fields(surah, ['nameUrdu', 'nameArabic']) ||
    !integer(surah.ayahCount) ||
    !integer(surah.wordCount)
  )
    return false;
  if (
    !array(value.words) ||
    value.words.length !== surah.wordCount ||
    !array(value.ayahs) ||
    value.ayahs.length !== surah.ayahCount ||
    !array(value.rules) ||
    value.rules.length === 0 ||
    !record(value.roots) ||
    !record(value.verbForms)
  )
    return false;

  const words = value.words;
  const ayahs = value.ayahs;
  const rules = value.rules;
  for (const rule of rules) {
    if (!record(rule) || !fields(rule, ['id', 'titleUrdu', 'explanationUrdu', 'exampleUrdu']))
      return false;
  }
  const ruleIds = rules.map((rule) => (rule as UnknownRecord).id);
  if (!unique(ruleIds)) return false;
  for (const root of Object.values(value.roots)) {
    if (!record(root) || !fields(root, ['meaningUrdu', 'noteUrdu'])) return false;
  }
  for (const verb of Object.values(value.verbForms)) {
    if (
      !record(verb) ||
      !fields(verb, ['baabUrdu', 'formUrdu', 'past', 'present', 'pattern', 'noteUrdu'])
    )
      return false;
  }
  for (const word of words) {
    if (
      !record(word) ||
      !fields(word, [
        'id',
        'arabic',
        'meaningUrdu',
        'posUrdu',
        'morphologyUrdu',
        'syntaxUrdu',
        'dictionaryUrdu',
      ]) ||
      !integer(word.ayah) ||
      word.ayah > surah.ayahCount ||
      !integer(word.position) ||
      word.id !== `${surah.number}:${word.ayah}:${word.position}` ||
      !positions.has(word.pos as string) ||
      !(word.root === null || text(word.root)) ||
      !(word.lemma === null || text(word.lemma)) ||
      !array(word.segments) ||
      word.segments.length === 0 ||
      !stringArray(word.ruleIds) ||
      !unique(word.ruleIds) ||
      !word.ruleIds.every((id) => ruleIds.includes(id))
    )
      return false;
    if (
      !word.segments.every(
        (segment) => record(segment) && fields(segment, ['arabic', 'roleUrdu', 'meaningUrdu']),
      )
    )
      return false;
    if (word.root !== null && !Object.hasOwn(value.roots, word.root)) return false;
    if ((word.pos === 'particle' || word.pos === 'pronoun') && word.root !== null) return false;
    if ((word.pos === 'verb') !== Object.hasOwn(value.verbForms, word.id as string)) return false;
  }
  const typedWords = words as UnknownRecord[];
  const wordIds = typedWords.map((word) => word.id);
  if (!unique(wordIds)) return false;
  if (Object.keys(value.roots).some((root) => !typedWords.some((word) => word.root === root)))
    return false;
  if (
    Object.keys(value.verbForms).some(
      (id) => !typedWords.some((word) => word.id === id && word.pos === 'verb'),
    )
  )
    return false;
  const phraseIds: string[] = [];
  for (const [index, ayah] of ayahs.entries()) {
    if (
      !record(ayah) ||
      ayah.number !== index + 1 ||
      !fields(ayah, ['translationUrdu', 'themeUrdu', 'tafsirUrdu']) ||
      !array(ayah.phrases)
    )
      return false;
    const ayahWords = typedWords.filter((word) => word.ayah === ayah.number);
    if (!ayahWords.length || !ayahWords.every((word, position) => word.position === position + 1))
      return false;
    for (const phrase of ayah.phrases) {
      if (
        !record(phrase) ||
        !fields(phrase, ['id', 'labelUrdu', 'explanationUrdu']) ||
        !stringArray(phrase.wordIds) ||
        !phrase.wordIds.length ||
        !unique(phrase.wordIds) ||
        !phrase.wordIds.every((id) => ayahWords.some((word) => word.id === id))
      )
        return false;
      phraseIds.push(phrase.id as string);
    }
  }
  return unique(phraseIds);
}

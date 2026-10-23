export type {
  StudyData,
  Word,
  WordSegment,
  Ayah,
  Phrase,
  Rule,
  RootEntry,
  VerbForm,
  PartOfSpeech,
  PartOfSpeechFilter,
} from './types';
export { fatihahStudy } from './data';
export { normalizeText, urduNumber, matchesWord } from './search';
export { isStudyData } from './validate';
export type { UiLanguage, UiStrings } from './interface';
export { getUiStrings, formatCount, isUiLanguage } from './interface';

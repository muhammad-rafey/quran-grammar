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
export type { SurahCatalogEntry, JuzCatalogEntry } from './catalog';
export { surahCatalog, juzCatalog } from './catalog';
export type {
  PracticeOption,
  PracticeQuestion,
  PracticeAnswers,
  PracticeProgress,
} from './practice';
export { fatihahPractice, gradePracticeAnswer, getPracticeProgress } from './practice';

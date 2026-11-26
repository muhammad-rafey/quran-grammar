/**
 * Light entry for web and mobile bundles. It must never import the lesson registry, data.ts or
 * the grammar topic library (core.test.ts checks the import graph). Heavy content lives in
 * `@quran-grammar/core/content`; database schema and SQL in `@quran-grammar/core/db`.
 */
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
export { normalizeText, urduNumber, matchesWord } from './search';
export { isStudyData } from './validate';
export type { UiLanguage, UiStrings } from './interface';
export { getUiStrings, formatCount, isUiLanguage } from './interface';
export type { SurahCatalogEntry, JuzCatalogEntry, JuzSurahRange } from './catalog';
export { surahCatalog, juzCatalog, getSurahTitle, getJuzForAyah, getJuzStartAyah } from './catalog';
export type {
  PracticeOption,
  PracticeQuestion,
  PracticeAnswers,
  PracticeProgress,
} from './practice';
export { gradePracticeAnswer, getPracticeProgress } from './practice';
export type {
  AuthoredQuestionSource,
  TopicExampleSource,
  GrammarTopicSource,
  TopicExampleKind,
  ResolvedTopicExample,
  GrammarTopicSummary,
  GrammarTopicDetail,
  PracticeQuestionKind,
  GrammarTopicRecord,
  GrammarTopicExampleRecord,
  GrammarContent,
} from './grammar/types';
export type { ContentRepository, PracticeQuestionFilter, SurahSummary } from './repository';
export { cachedRepository } from './repository';

export { availableSurahNumbers, partialSurahLastAyah } from './availability';
export type { TranslationEdition } from './translations';
export {
  translationEditions,
  translationIds,
  defaultTranslationId,
  isTranslationId,
  resolveTranslationId,
  getTranslationEdition,
  translationText,
} from './translations';
export type { FontRole, FontStyleKind, FontMetrics, QuranScript, ReadingFont } from './fonts';
export { readingFonts, defaultFontIds, fontsForRole, resolveFont, quranText } from './fonts';

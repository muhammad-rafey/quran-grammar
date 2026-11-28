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
export { normalizeText, urduNumber, matchesWord, withoutPauseMarks } from './search';
export type { RomanScore, RomanOptions, RomanQuery, RomanTarget, EnglishTarget } from './roman';
export {
  romanKey,
  isLatinQuery,
  matchesRoman,
  romanQuery,
  romanTarget,
  scoreRoman,
  matchesEnglish,
  englishTarget,
  scoreEnglish,
} from './roman';
export type { SearchableTopic } from './topic-search';
export { searchTopics } from './topic-search';
export { isStudyData } from './validate';
export type { UiLanguage, UiStrings } from './interface';
export { getUiStrings, formatCount, isUiLanguage } from './interface';
export type { ThemePreference, ColorScheme } from './theme';
export {
  themePreferences,
  defaultThemePreference,
  isThemePreference,
  resolveColorScheme,
  contrastRatio,
} from './theme';
export type { TextSizeRole, TextSizes } from './text-size';
export {
  textSizeSteps,
  textSizeRoles,
  defaultTextSize,
  defaultTextSizes,
  isTextSize,
  resolveTextSize,
  stepTextSize,
  canStepTextSize,
  textSizePercent,
  parseTextSizes,
  serializeTextSizes,
  scaleFontSize,
} from './text-size';
export type { SurahCatalogEntry, JuzCatalogEntry, JuzSurahRange } from './catalog';
export { surahCatalog, juzCatalog, getSurahTitle, getJuzForAyah, getJuzStartAyah } from './catalog';
export type { SurahMatch, SurahSearchResult } from './surah-search';
export { searchSurahs } from './surah-search';
export type {
  PracticeOption,
  PracticeQuestion,
  PracticeAnswers,
  PracticeProgress,
} from './practice';
export { gradePracticeAnswer, getPracticeProgress, toResolvedOption } from './practice';
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
export { joinIndoPak } from './grammar/resolve';
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
export {
  readingFonts,
  defaultFontIds,
  fontsForRole,
  resolveFont,
  quranText,
  quranWordGap,
  quranWordGapExtra,
  quranAyahEndGap,
  quranAyahEndGapExtra,
  spaceQuranText,
  practiceOptionText,
  exampleQuranText,
  splitAyahAtWord,
} from './fonts';

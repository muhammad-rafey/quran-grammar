/**
 * Heavy entry (`@quran-grammar/core/content`): the complete bundled lessons, the authored grammar
 * topic library and the builders. Node/API/database-build only; never import it from web or
 * mobile bundles.
 */
import { fatihahPractice } from './fatihah-practice';
import { buildGrammarContent } from './grammar/build';
import { grammarTopicSources } from './grammar/topics/index';
import type { GrammarContent } from './grammar/types';
import { createBundledRepository } from './bundled-repository';
import type { ContentRepository } from './repository';
import { studies } from './registry';

export { fatihahStudy } from './data';
export { studies, getStudy } from './registry';
export { fatihahPractice } from './fatihah-practice';
export { grammarTopicSources } from './grammar/topics/index';
export {
  MAX_APPLY_QUESTIONS,
  MAX_QURANIC_EXAMPLES,
  MAX_SPOT_QUESTIONS,
  buildGrammarContent,
  checkGrammarSources,
  createWordContextLookup,
  listTopicSummaries,
  questionCounts,
  resolveGrammarTopic,
  stableHash,
} from './grammar/build';
export type { ExampleWordContext, GrammarSourceReport } from './grammar/build';
export { createBundledRepository } from './bundled-repository';
export type { BundledRepositoryOptions } from './bundled-repository';

let grammar: GrammarContent | undefined;
/** Grammar topics, examples and questions built from the bundled lessons (memoized). */
export function getGrammarContent(): GrammarContent {
  return (grammar ??= buildGrammarContent(studies, grammarTopicSources, fatihahPractice));
}

/** Repository over the complete bundled content. */
export function getBundledRepository(): ContentRepository {
  return createBundledRepository({ studies, grammar: getGrammarContent() });
}

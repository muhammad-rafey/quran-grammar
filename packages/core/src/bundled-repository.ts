import {
  buildGrammarContent,
  createPracticeResolver,
  createWordContextLookup,
  listTopicSummaries,
  resolveGrammarTopic,
} from './grammar/build';
import type { GrammarContent, GrammarTopicSource } from './grammar/types';
import type { PracticeQuestion } from './practice';
import type { ContentRepository } from './repository';
import type { StudyData } from './types';

export interface BundledRepositoryOptions {
  readonly studies: readonly StudyData[];
  /** Prebuilt grammar content; otherwise built from topicSources + fatihahPractice. */
  readonly grammar?: GrammarContent;
  readonly topicSources?: readonly GrammarTopicSource[];
  readonly fatihahPractice?: readonly PracticeQuestion[];
}

/**
 * In-memory repository over study data (API fallback, tests, database builds). Returned values
 * share the bundled objects: treat them as read-only.
 */
export function createBundledRepository(options: BundledRepositoryOptions): ContentRepository {
  const { studies } = options;
  let grammar: GrammarContent | undefined = options.grammar;
  const content = () =>
    (grammar ??= buildGrammarContent(
      studies,
      options.topicSources ?? [],
      options.fatihahPractice ?? [],
    ));
  let lookup: ReturnType<typeof createWordContextLookup> | undefined;
  let resolveQuestion: ReturnType<typeof createPracticeResolver> | undefined;
  return {
    async listSurahs() {
      return studies.map((study) => ({ ...study.surah }));
    },
    async getStudy(surah) {
      const study = studies.find((entry) => entry.surah.number === surah);
      return study ?? null;
    },
    async listTopics() {
      return listTopicSummaries(content());
    },
    async getTopic(id) {
      lookup ??= createWordContextLookup(studies);
      return resolveGrammarTopic(content(), id, lookup);
    },
    async getPracticeQuestions(filter) {
      resolveQuestion ??= createPracticeResolver(studies);
      return content()
        .questions.filter((question) =>
          'set' in filter
            ? filter.set === 'fatihah' && question.kind === 'fatihah'
            : question.topicId === filter.topicId,
        )
        .map(resolveQuestion);
    },
  };
}

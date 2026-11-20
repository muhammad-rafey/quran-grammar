import type { GrammarTopicDetail, GrammarTopicSummary } from './grammar/types';
import type { PracticeQuestion } from './practice';
import type { StudyData } from './types';

export type SurahSummary = StudyData['surah'];

/** Which practice questions to load: one grammar topic, or the original Al-Fatihah set. */
export type PracticeQuestionFilter = { readonly topicId: string } | { readonly set: 'fatihah' };

/**
 * Read-only access to all study content. Implementations: bundled (API fallback, tests),
 * Postgres (API), expo-sqlite (mobile). All implementations return identical values.
 */
export interface ContentRepository {
  listSurahs(): Promise<SurahSummary[]>;
  /** null when the Surah is not in this edition. */
  getStudy(surah: number): Promise<StudyData | null>;
  /** Ordered by position. */
  listTopics(): Promise<GrammarTopicSummary[]>;
  /** null for an unknown topic id. */
  getTopic(id: string): Promise<GrammarTopicDetail | null>;
  /** Ordered by position; empty for an unknown topic. */
  getPracticeQuestions(filter: PracticeQuestionFilter): Promise<PracticeQuestion[]>;
}

/**
 * Memoize a repository whose content never changes while it is open. Unknown ids are answered
 * from the cached lists, so arbitrary requests cannot grow the cache. Failed reads are retried.
 */
export function cachedRepository(source: ContentRepository): ContentRepository {
  const cache = new Map<string, Promise<unknown>>();
  function remember<T>(key: string, load: () => Promise<T>): Promise<T> {
    const hit = cache.get(key);
    if (hit) return hit as Promise<T>;
    const pending = load();
    cache.set(key, pending);
    pending.catch(() => cache.delete(key));
    return pending;
  }
  const listSurahs = () => remember('surahs', () => source.listSurahs());
  const listTopics = () => remember('topics', () => source.listTopics());
  return {
    listSurahs,
    listTopics,
    async getStudy(surah) {
      if (!(await listSurahs()).some((entry) => entry.number === surah)) return null;
      return remember(`study:${surah}`, () => source.getStudy(surah));
    },
    async getTopic(id) {
      if (!(await listTopics()).some((topic) => topic.id === id)) return null;
      return remember(`topic:${id}`, () => source.getTopic(id));
    },
    async getPracticeQuestions(filter) {
      if ('set' in filter) {
        if (filter.set !== 'fatihah') return [];
        return remember('practice:fatihah', () => source.getPracticeQuestions(filter));
      }
      if (!(await listTopics()).some((topic) => topic.id === filter.topicId)) return [];
      return remember(`practice:${filter.topicId}`, () => source.getPracticeQuestions(filter));
    },
  };
}

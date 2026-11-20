/**
 * ContentRepository over a SQL executor, with small in-memory caches. The content is static
 * for the lifetime of an installed database, so cached values never go stale.
 * Pure TypeScript (no React Native imports) so tests can run it against node:sqlite.
 */
import type {
  ContentRepository,
  GrammarTopicDetail,
  GrammarTopicSummary,
  PracticeQuestion,
  StudyData,
} from '@quran-grammar/core';
import {
  listSurahs,
  listTopics,
  loadPracticeQuestions,
  loadStudy,
  loadTopic,
  type PracticeFilter,
  type SqlExecutor,
} from './queries';

/** Small LRU of settled values plus de-duplication of in-flight requests. */
class Cache<K, V> {
  private readonly values = new Map<K, V>();
  private readonly pending = new Map<K, Promise<V>>();
  constructor(private readonly limit: number) {}

  peek(key: K): V | undefined {
    return this.values.get(key);
  }

  get(key: K, load: () => Promise<V>): Promise<V> {
    if (this.values.has(key)) {
      const value = this.values.get(key) as V;
      // Refresh recency.
      this.values.delete(key);
      this.values.set(key, value);
      return Promise.resolve(value);
    }
    const inFlight = this.pending.get(key);
    if (inFlight) return inFlight;
    const promise = load().then(
      (value) => {
        this.pending.delete(key);
        this.values.set(key, value);
        while (this.values.size > this.limit) {
          const oldest = this.values.keys().next().value as K;
          this.values.delete(oldest);
        }
        return value;
      },
      (error: unknown) => {
        // Failures are not cached; a retry queries again.
        this.pending.delete(key);
        throw error;
      },
    );
    this.pending.set(key, promise);
    return promise;
  }
}

export interface CachedContentRepository extends ContentRepository {
  /** Synchronously return a recently loaded chapter, so revisiting it renders without a spinner. */
  peekStudy(surah: number): StudyData | undefined;
}

export function createContentRepository(
  exec: SqlExecutor,
  options: { studyCacheSize?: number } = {},
): CachedContentRepository {
  const studies = new Cache<number, StudyData | null>(options.studyCacheSize ?? 6);
  const topicDetails = new Cache<string, GrammarTopicDetail | null>(24);
  const questions = new Cache<string, PracticeQuestion[]>(24);
  const lists = new Cache<'surahs' | 'topics', unknown>(2);

  return {
    peekStudy: (surah) => studies.peek(surah) ?? undefined,
    listSurahs: () =>
      lists.get('surahs', () => listSurahs(exec)) as Promise<StudyData['surah'][]>,
    getStudy: (surah) => {
      if (!Number.isSafeInteger(surah) || surah < 1 || surah > 114) return Promise.resolve(null);
      return studies.get(surah, async () => {
        const study = await loadStudy(exec, surah);
        // The installed database is verified against the bundled content hash when it opens,
        // so a full isStudyData walk of thousands of words on every load is redundant.
        if (study && study.surah.number !== surah)
          throw new Error(`The content database has invalid data for Surah ${surah}.`);
        return study;
      });
    },
    listTopics: () =>
      lists.get('topics', () => listTopics(exec)) as Promise<GrammarTopicSummary[]>,
    getTopic: (id) => {
      if (typeof id !== 'string' || !/^[a-z0-9-]{1,64}$/.test(id)) return Promise.resolve(null);
      return topicDetails.get(id, () => loadTopic(exec, id));
    },
    getPracticeQuestions: (filter: PracticeFilter) => {
      const key = 'topicId' in filter ? `topic:${filter.topicId}` : `set:${filter.set}`;
      return questions.get(key, () => loadPracticeQuestions(exec, filter));
    },
  };
}

import { useCallback, useEffect, useState } from 'react';
import type {
  GrammarTopicDetail,
  GrammarTopicSummary,
  PracticeQuestion,
} from '@quran-grammar/core';
import { getRepository } from '@/data/repository';
import type { CachedContentRepository } from '@/data/content-store';
import type { PracticeFilter } from '@/data/queries';

export type { PracticeFilter };

export type Resource<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
};

type Settled<T> = { key: string; data: T | null; error: string | null };

/**
 * Load one value from the content repository. `key` identifies the request: results for an
 * older key are discarded, so a screen never shows another topic's data. A null key skips.
 */
function useRepositoryValue<T>(
  key: string | null,
  load: (repository: CachedContentRepository) => Promise<T>,
): Resource<T> {
  const [attempt, setAttempt] = useState(0);
  const [settled, setSettled] = useState<Settled<T> | null>(null);

  useEffect(() => {
    if (key === null) return;
    let current = true;
    getRepository()
      .then(load)
      .then(
        (data) => current && setSettled({ key, data, error: null }),
        (reason: unknown) => {
          if (!current) return;
          console.warn('Content failed to load', reason);
          setSettled({
            key,
            data: null,
            error: reason instanceof Error ? reason.message : String(reason),
          });
        },
      );
    return () => {
      current = false;
    };
    // `load` is derived from `key`; re-running for a new closure with the same key is unnecessary.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, attempt]);

  const retry = useCallback(() => {
    setSettled(null);
    setAttempt((value) => value + 1);
  }, []);

  const fresh = settled !== null && settled.key === key;
  return {
    data: fresh ? settled.data : null,
    loading: key !== null && !fresh,
    error: fresh ? settled.error : null,
    retry,
  };
}

/** The opened repository (null until the bundled database is ready), for imperative reads. */
export function useContent(): Resource<CachedContentRepository> {
  return useRepositoryValue('repository', async (repository) => repository);
}

/** Grammar topics ordered by position. */
export function useTopics(): Resource<GrammarTopicSummary[]> {
  return useRepositoryValue('topics', (repository) => repository.listTopics());
}

/**
 * One topic with points and resolved examples. When loading has finished without an error,
 * `data === null` means the topic id does not exist (not found).
 */
export function useTopic(id: string | null | undefined): Resource<GrammarTopicDetail | null> {
  return useRepositoryValue<GrammarTopicDetail | null>(id ? `topic:${id}` : null, (repository) =>
    repository.getTopic(id!),
  );
}

/** Questions for a topic (`{ topicId }`) or the Al-Fatihah set (`{ set: 'fatihah' }`). */
export function usePracticeQuestions(
  filter: PracticeFilter | null | undefined,
): Resource<PracticeQuestion[]> {
  const key = !filter
    ? null
    : 'topicId' in filter
      ? `practice:topic:${filter.topicId}`
      : `practice:set:${filter.set}`;
  return useRepositoryValue(key, (repository) => repository.getPracticeQuestions(filter!));
}

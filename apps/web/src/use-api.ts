import { useEffect, useState } from 'react';
import type {
  GrammarTopicDetail,
  GrammarTopicSummary,
  PracticeOption,
  PracticeQuestion,
  ResolvedTopicExample,
} from '@quran-grammar/core';

/** Practice questions for one grammar topic or the Al-Fatihah quick-practice set. */
export type PracticeFilter = { readonly topicId: string } | { readonly set: 'fatihah' };

export interface ApiResource<T> {
  readonly data: T | null;
  readonly loading: boolean;
  readonly error: boolean;
  readonly retry: () => void;
}

const topicIdPattern = /^[a-z0-9-]{1,64}$/;
const wordIdPattern = /^\d{1,3}:\d{1,3}:\d{1,3}$/;
const questionKinds = new Set(['concept', 'apply', 'spot', 'fatihah']);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const isString = (value: unknown): value is string => typeof value === 'string';
const isText = (value: unknown): value is string => isString(value) && value.trim().length > 0;
const isCount = (value: unknown): value is number =>
  typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;

export const isTopicId = (value: unknown): value is string =>
  isString(value) && topicIdPattern.test(value);

function isTopicSummary(value: unknown): value is GrammarTopicSummary {
  return (
    isRecord(value) &&
    isTopicId(value.id) &&
    isCount(value.position) &&
    isText(value.titleUrdu) &&
    isText(value.titleEnglish) &&
    isString(value.summaryUrdu) &&
    isCount(value.questionCount) &&
    isCount(value.occurrenceCount)
  );
}

function isExample(value: unknown): value is ResolvedTopicExample {
  return (
    isRecord(value) &&
    (value.kind === 'annotated' || value.kind === 'quranic') &&
    isString(value.wordId) &&
    wordIdPattern.test(value.wordId) &&
    isCount(value.surah) &&
    isCount(value.ayah) &&
    isText(value.wordArabic) &&
    isString(value.meaningUrdu) &&
    isText(value.ayahArabic) &&
    isString(value.translationUrdu) &&
    (value.noteUrdu === null || isString(value.noteUrdu))
  );
}

function isTopicDetail(value: unknown): value is GrammarTopicDetail {
  return (
    isTopicSummary(value) &&
    isRecord(value) &&
    isString(value.explanationUrdu) &&
    Array.isArray(value.pointsUrdu) &&
    value.pointsUrdu.every(isString) &&
    Array.isArray(value.examples) &&
    value.examples.every(isExample) &&
    Array.isArray(value.quranicExamples) &&
    value.quranicExamples.every(isExample)
  );
}

function isOption(value: unknown): value is PracticeOption {
  return (
    isRecord(value) &&
    isText(value.id) &&
    isText(value.text) &&
    (value.language === 'ar' || value.language === 'ur')
  );
}

function isPracticeQuestion(value: unknown): value is PracticeQuestion {
  if (
    !isRecord(value) ||
    !isText(value.id) ||
    !isText(value.promptUrdu) ||
    !Array.isArray(value.options) ||
    value.options.length < 2 ||
    !value.options.every(isOption) ||
    !isText(value.correctOptionId) ||
    !isString(value.explanationUrdu) ||
    !(value.topicId === null || isTopicId(value.topicId)) ||
    !questionKinds.has(value.kind as string)
  )
    return false;
  const ids = (value.options as PracticeOption[]).map((option) => option.id);
  return new Set(ids).size === ids.length && ids.includes(value.correctOptionId);
}

const base = () => (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

// Grammar content is static for a deployment, so successful responses are reused in-session.
const cache = new Map<string, unknown>();

/**
 * Fetch and validate one API resource. Mirrors use-study.ts: VITE_API_URL base, abort on
 * change/unmount, 15 s timeout, one silent retry for transient network errors, manual retry.
 */
function useApiResource<T>(
  path: string | null,
  parse: (payload: unknown) => T | null,
): ApiResource<T> {
  const [state, setState] = useState<{ path: string | null; data: T | null; error: boolean }>(
    () => ({ path, data: path && cache.has(path) ? (cache.get(path) as T) : null, error: false }),
  );
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!path) return;
    if (cache.has(path)) {
      setState({ path, data: cache.get(path) as T, error: false });
      return;
    }
    const controller = new AbortController();
    let active = true;
    let timeout = 0;
    setState({ path, data: null, error: false });
    const load = async (tries: number): Promise<T> => {
      window.clearTimeout(timeout);
      timeout = window.setTimeout(() => controller.abort(), 15000);
      try {
        const response = await fetch(`${base()}${path}`, { signal: controller.signal });
        if (!response.ok) throw Object.assign(new Error('Unavailable'), { final: response.status < 500 });
        const parsed = parse(await response.json());
        if (parsed === null) throw Object.assign(new Error('Invalid payload'), { final: true });
        return parsed;
      } catch (error) {
        const final = controller.signal.aborted || (error as { final?: boolean }).final;
        if (final || tries <= 0) throw error;
        await new Promise((resolve) => window.setTimeout(resolve, 600));
        return load(tries - 1);
      }
    };
    load(1)
      .then((data) => {
        cache.set(path, data);
        if (active) setState({ path, data, error: false });
      })
      .catch(() => {
        if (active) setState({ path, data: null, error: true });
      })
      .finally(() => window.clearTimeout(timeout));
    return () => {
      active = false;
      controller.abort();
      window.clearTimeout(timeout);
    };
    // `parse` only depends on values already encoded in `path`.
  }, [path, attempt]);
  const current = state.path === path;
  return {
    data: current ? state.data : null,
    loading: !!path && !(current && (state.data !== null || state.error)),
    error: current && state.error,
    retry: () => setAttempt((value) => value + 1),
  };
}

const parseTopics = (payload: unknown) =>
  isRecord(payload) && Array.isArray(payload.topics) && payload.topics.every(isTopicSummary)
    ? [...payload.topics].sort((a, b) => a.position - b.position)
    : null;

export function useTopics(): ApiResource<readonly GrammarTopicSummary[]> {
  return useApiResource('/api/v1/topics', parseTopics);
}

export function useTopic(id: string | null): ApiResource<GrammarTopicDetail> {
  const path = id && isTopicId(id) ? `/api/v1/topics/${id}` : null;
  return useApiResource(path, (payload) =>
    isTopicDetail(payload) && payload.id === id ? payload : null,
  );
}

export function usePractice(filter: PracticeFilter | null): ApiResource<readonly PracticeQuestion[]> {
  const path = !filter
    ? null
    : 'set' in filter
      ? '/api/v1/practice?set=fatihah'
      : isTopicId(filter.topicId)
        ? `/api/v1/practice?topic=${filter.topicId}`
        : null;
  const topicId = filter && 'topicId' in filter ? filter.topicId : null;
  return useApiResource(path, (payload) =>
    isRecord(payload) &&
    Array.isArray(payload.questions) &&
    payload.questions.every(
      (question) => isPracticeQuestion(question) && question.topicId === topicId,
    )
      ? (payload.questions as PracticeQuestion[])
      : null,
  );
}

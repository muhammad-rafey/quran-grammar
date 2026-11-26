import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { availableSurahNumbers, type StudyData } from '@quran-grammar/core';
import { getOpenedRepository, getRepository } from '@/data/repository';

/** A request for the study screen to show an ayah (and highlight a word), e.g. from a deep link. */
export type StudyFocus = { surah: number; ayah: number; wordId: string | null; seq: number };

type StudyState = {
  selectedSurah: number;
  selectSurah: (number: number) => void;
  /** The latest focus request; the study screen applies each `seq` once. */
  focus: StudyFocus | null;
  /** Select the word's chapter and ask the study screen to show its ayah with the word selected. */
  focusWord: (surah: number, ayah: number, wordId: string | null) => void;
  /** Always the selected chapter's data, or null while it loads / after a failure. */
  study: StudyData | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
};

const StudyContext = createContext<StudyState | null>(null);
const available = new Set(availableSurahNumbers);

const cachedStudy = (surah: number) => getOpenedRepository()?.peekStudy(surah) ?? null;

export function StudyProvider({ children }: { children: ReactNode }) {
  const [selectedSurah, setSelectedSurah] = useState(1);
  const selectedSurahRef = useRef(1);
  const [study, setStudy] = useState<StudyData | null>(() => cachedStudy(1));
  const [loading, setLoading] = useState(() => cachedStudy(1) === null);
  const [error, setError] = useState<string | null>(null);
  // Bumped by retry; also identifies the latest request so older results are ignored.
  const [attempt, setAttempt] = useState(0);

  const selectSurah = useCallback((number: number) => {
    if (!available.has(number) || selectedSurahRef.current === number) return;
    selectedSurahRef.current = number;
    setSelectedSurah(number);
    // A previous chapter must never appear under the newly selected chapter's title.
    const cached = cachedStudy(number);
    setStudy(cached);
    setLoading(cached === null);
    setError(null);
  }, []);

  useEffect(() => {
    let current = true;
    const surah = selectedSurah;
    const cached = cachedStudy(surah);
    if (cached) {
      setStudy(cached);
      setError(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    getRepository()
      .then((repository) => repository.getStudy(surah))
      .then((value) => {
        if (!current || selectedSurahRef.current !== surah) return;
        if (!value || value.surah.number !== surah) throw new Error(`Surah ${surah} is missing.`);
        setStudy(value);
        setError(null);
      })
      .catch((reason: unknown) => {
        if (!current || selectedSurahRef.current !== surah) return;
        console.warn('Study content failed to load', reason);
        setError(reason instanceof Error ? reason.message : String(reason));
      })
      .finally(() => {
        if (current && selectedSurahRef.current === surah) setLoading(false);
      });
    return () => {
      current = false;
    };
  }, [selectedSurah, attempt]);

  const [focus, setFocus] = useState<StudyFocus | null>(null);
  const focusWord = useCallback(
    (surah: number, ayah: number, wordId: string | null) => {
      if (!available.has(surah)) return;
      selectSurah(surah);
      setFocus((current) => ({ surah, ayah, wordId, seq: (current?.seq ?? 0) + 1 }));
    },
    [selectSurah],
  );

  const retry = useCallback(() => {
    setError(null);
    setLoading(true);
    setAttempt((value) => value + 1);
  }, []);

  const value = useMemo(
    () => ({ selectedSurah, selectSurah, focus, focusWord, study, loading, error, retry }),
    [selectedSurah, selectSurah, focus, focusWord, study, loading, error, retry],
  );
  return <StudyContext value={value}>{children}</StudyContext>;
}

export function useStudy() {
  const context = use(StudyContext);
  if (!context) throw new Error('useStudy requires StudyProvider');
  return context;
}

/**
 * Any chapter's study data WITHOUT changing the study screen's selected chapter, e.g. for a word
 * opened from a grammar topic or quiz. Reuses the selected chapter and the repository's cache, so a
 * chapter that is open or was recently viewed renders immediately.
 */
export function useSurahStudy(surah: number | null) {
  const selected = useStudy();
  const shared = surah !== null && selected.study?.surah.number === surah ? selected.study : null;
  const [own, setOwn] = useState<{ surah: number; study: StudyData } | null>(null);
  const [failed, setFailed] = useState<{ surah: number; message: string } | null>(null);
  const [attempt, setAttempt] = useState(0);
  const peeked = surah !== null && !shared ? cachedStudy(surah) : null;
  const study =
    shared ?? peeked ?? (own && own.surah === surah ? own.study : null);

  useEffect(() => {
    if (surah === null || !available.has(surah) || study) return;
    let current = true;
    getRepository()
      .then((repository) => repository.getStudy(surah))
      .then((value) => {
        if (!current) return;
        if (!value || value.surah.number !== surah) throw new Error(`Surah ${surah} is missing.`);
        setOwn({ surah, study: value });
        setFailed(null);
      })
      .catch((reason: unknown) => {
        if (!current) return;
        console.warn('Study content failed to load', reason);
        setFailed({ surah, message: reason instanceof Error ? reason.message : String(reason) });
      });
    return () => {
      current = false;
    };
    // `study` is derived; only refetch when the chapter or a retry changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surah, attempt, Boolean(study)]);

  const error = failed && failed.surah === surah && !study ? failed.message : null;
  return {
    study,
    loading: surah !== null && !study && !error,
    error,
    retry: () => {
      setFailed(null);
      setAttempt((value) => value + 1);
    },
  };
}

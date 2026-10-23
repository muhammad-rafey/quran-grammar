import {
  createContext,
  use,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { fetch } from 'expo/fetch';
import { getStudy, isStudyData, type StudyData } from '@quran-grammar/core';

const apiOrigin = process.env.EXPO_PUBLIC_API_URL?.trim().replace(/\/+$/, '');

type StudyState = {
  selectedSurah: number;
  selectSurah: (number: number) => void;
  study: StudyData | null;
  loading: boolean;
  error: string | null;
  bundled: boolean;
  hasApi: boolean;
  retry: () => void;
  useBundled: () => void;
};

const StudyContext = createContext<StudyState | null>(null);

export function StudyProvider({ children }: { children: ReactNode }) {
  const [selectedSurah, setSelectedSurah] = useState(1);
  const selectedSurahRef = useRef(1);
  const [study, setStudy] = useState<StudyData | null>(apiOrigin ? null : (getStudy(1) ?? null));
  const [loading, setLoading] = useState(Boolean(apiOrigin));
  const [error, setError] = useState<string | null>(null);
  const [bundled, setBundled] = useState(!apiOrigin);
  const controller = useRef<AbortController | null>(null);

  const selectSurah = useCallback((number: number) => {
    if (!Number.isInteger(number) || !getStudy(number) || selectedSurahRef.current === number) {
      return;
    }
    controller.current?.abort();
    controller.current = null;
    selectedSurahRef.current = number;
    setSelectedSurah(number);
    // A previous chapter must never appear under the newly selected chapter's title.
    setStudy(apiOrigin ? null : (getStudy(number) ?? null));
    setBundled(!apiOrigin);
    setLoading(Boolean(apiOrigin));
    setError(null);
  }, []);

  const fetchStudy = useCallback(() => {
    if (!apiOrigin) return;
    controller.current?.abort();
    const next = new AbortController();
    controller.current = next;
    const timeout = setTimeout(() => next.abort(), 12000);
    void fetch(`${apiOrigin}/api/v1/surahs/${selectedSurah}`, { signal: next.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const value: unknown = await response.json();
        if (!isStudyData(value) || value.surah.number !== selectedSurah) {
          throw new Error('Invalid study data');
        }
        return value;
      })
      .then((value) => {
        if (controller.current !== next) return;
        setStudy(value);
        setBundled(false);
      })
      .catch(() => {
        if (controller.current !== next) return;
        setError('سبق لوڈ نہیں ہو سکا۔ انٹرنیٹ اور سرور کا رابطہ دیکھ کر دوبارہ کوشش کریں۔');
      })
      .finally(() => {
        clearTimeout(timeout);
        if (controller.current === next) setLoading(false);
      });
  }, [selectedSurah]);

  useEffect(() => {
    void fetchStudy();
    return () => {
      controller.current?.abort();
      controller.current = null;
    };
  }, [fetchStudy]);

  const retry = useCallback(() => {
    if (!apiOrigin) return;
    setLoading(true);
    setError(null);
    void fetchStudy();
  }, [fetchStudy]);

  const useBundled = useCallback(() => {
    controller.current?.abort();
    controller.current = null;
    setStudy(getStudy(selectedSurah) ?? null);
    setBundled(true);
    setLoading(false);
    setError(null);
  }, [selectedSurah]);

  return (
    <StudyContext
      value={{
        selectedSurah,
        selectSurah,
        study,
        loading,
        error,
        bundled,
        hasApi: Boolean(apiOrigin),
        retry,
        useBundled,
      }}
    >
      {children}
    </StudyContext>
  );
}

export function useStudy() {
  const context = use(StudyContext);
  if (!context) throw new Error('useStudy requires StudyProvider');
  return context;
}

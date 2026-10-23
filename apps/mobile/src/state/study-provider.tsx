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
import { fatihahStudy, isStudyData, type StudyData } from '@quran-grammar/core';

const apiOrigin = process.env.EXPO_PUBLIC_API_URL?.trim().replace(/\/+$/, '');

type StudyState = {
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
  const [study, setStudy] = useState<StudyData | null>(apiOrigin ? null : fatihahStudy);
  const [loading, setLoading] = useState(Boolean(apiOrigin));
  const [error, setError] = useState<string | null>(null);
  const [bundled, setBundled] = useState(!apiOrigin);
  const controller = useRef<AbortController | null>(null);

  const retry = useCallback(async () => {
    if (!apiOrigin) return;
    controller.current?.abort();
    const next = new AbortController();
    controller.current = next;
    setLoading(true);
    setError(null);
    const timeout = setTimeout(() => next.abort(), 12000);
    try {
      const response = await fetch(`${apiOrigin}/api/v1/surahs/1`, { signal: next.signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const value: unknown = await response.json();
      if (!isStudyData(value)) throw new Error('Invalid study data');
      if (controller.current !== next) return;
      setStudy(value);
      setBundled(false);
    } catch {
      if (controller.current !== next) return;
      setError('سبق لوڈ نہیں ہو سکا۔ انٹرنیٹ اور سرور کا رابطہ دیکھ کر دوبارہ کوشش کریں۔');
    } finally {
      clearTimeout(timeout);
      if (controller.current === next) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void retry();
    return () => {
      controller.current?.abort();
      controller.current = null;
    };
  }, [retry]);

  const useBundled = useCallback(() => {
    controller.current?.abort();
    controller.current = null;
    setStudy(fatihahStudy);
    setBundled(true);
    setLoading(false);
    setError(null);
  }, []);

  return (
    <StudyContext
      value={{ study, loading, error, bundled, hasApi: Boolean(apiOrigin), retry, useBundled }}
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

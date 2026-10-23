import { useEffect, useState } from 'react';
import { isStudyData, type StudyData } from '@quran-grammar/core';

export function useStudy() {
  const [data, setData] = useState<StudyData | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    let active = true;
    setError(false);
    const base = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
    fetch(`${base}/api/v1/surahs/1`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error('Study unavailable');
        const payload: unknown = await response.json();
        if (!isStudyData(payload)) throw new Error('Invalid study');
        if (active) setData(payload);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => window.clearTimeout(timeout));
    return () => {
      active = false;
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [attempt]);
  return { data, error, retry: () => setAttempt((value) => value + 1) };
}

export function useMobileLayout() {
  const [mobile, setMobile] = useState(() => matchMedia('(max-width: 1023px)').matches);
  useEffect(() => {
    const media = matchMedia('(max-width: 1023px)');
    const update = () => setMobile(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return mobile;
}

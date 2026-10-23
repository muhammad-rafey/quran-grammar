import { useEffect, useState } from 'react';
import { isStudyData, type StudyData } from '@quran-grammar/core';

export function useStudy(surahNumber: number) {
  const [data, setData] = useState<StudyData | null>(null);
  const [failedSurah, setFailedSurah] = useState<number | null>(null);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    let active = true;
    setFailedSurah(null);
    const base = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
    fetch(`${base}/api/v1/surahs/${surahNumber}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error('Study unavailable');
        const payload: unknown = await response.json();
        if (!isStudyData(payload) || payload.surah.number !== surahNumber)
          throw new Error('Invalid study');
        if (active) setData(payload);
      })
      .catch(() => {
        if (active) setFailedSurah(surahNumber);
      })
      .finally(() => window.clearTimeout(timeout));
    return () => {
      active = false;
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [attempt, surahNumber]);
  return {
    data: data?.surah.number === surahNumber ? data : null,
    error: failedSurah === surahNumber,
    retry: () => setAttempt((value) => value + 1),
  };
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

import { useState } from 'react';

const preferenceKey = 'quran-grammar.reading-layout';

export interface ReadingLayout {
  /** Word-by-word grammar blocks (meaning + word type). Off = continuous Quranic text. */
  readonly grammar: boolean;
  /** Urdu translation under each ayah. */
  readonly translation: boolean;
}

const defaults: ReadingLayout = { grammar: true, translation: true };

function readPreference(): ReadingLayout {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(preferenceKey) || 'null');
    if (typeof stored !== 'object' || stored === null) return defaults;
    const { grammar, translation } = stored as Record<string, unknown>;
    return {
      grammar: typeof grammar === 'boolean' ? grammar : defaults.grammar,
      translation: typeof translation === 'boolean' ? translation : defaults.translation,
    };
  } catch {
    return defaults;
  }
}

/** Reading-layout switches from Settings, persisted locally like the interface language. */
export function useReadingLayout() {
  const [layout, setLayout] = useState<ReadingLayout>(readPreference);
  const [saveError, setSaveError] = useState(false);
  const changeLayout = (change: Partial<ReadingLayout>) => {
    const next = { ...layout, ...change };
    setLayout(next);
    try {
      localStorage.setItem(preferenceKey, JSON.stringify(next));
      setSaveError(false);
    } catch {
      setSaveError(true);
    }
  };
  return { layout, changeLayout, saveError };
}

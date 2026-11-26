import { useState } from 'react';
import { resolveTranslationId } from '@quran-grammar/core';

const preferenceKey = 'quran-grammar.translation';

/** The selected Urdu ayah translation from Settings, persisted locally like the interface language. */
export function useTranslationChoice() {
  const [translationId, setTranslationId] = useState<string>(() => {
    try {
      return resolveTranslationId(localStorage.getItem(preferenceKey));
    } catch {
      return resolveTranslationId(null);
    }
  });
  const [saveError, setSaveError] = useState(false);
  const changeTranslation = (next: string) => {
    const id = resolveTranslationId(next);
    setTranslationId(id);
    try {
      localStorage.setItem(preferenceKey, id);
      setSaveError(false);
    } catch {
      setSaveError(true);
    }
  };
  return { translationId, changeTranslation, saveError };
}

import { useEffect, useState } from 'react';
import { isUiLanguage, type UiLanguage } from '@quran-grammar/core';

const preferenceKey = 'quran-grammar.ui-language';

export function useInterfaceLanguage() {
  const [language, setLanguage] = useState<UiLanguage>(() => {
    try {
      const stored = localStorage.getItem(preferenceKey);
      return isUiLanguage(stored) ? stored : 'en';
    } catch {
      return 'en';
    }
  });
  const [saveError, setSaveError] = useState(false);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr';
    document.title = language === 'en' ? 'Quran Grammar · Al-Fatihah' : 'قرآن گرامر — سورۃ الفاتحہ';
  }, [language]);

  const changeLanguage = (next: UiLanguage) => {
    setLanguage(next);
    try {
      localStorage.setItem(preferenceKey, next);
      setSaveError(false);
    } catch {
      setSaveError(true);
    }
  };

  return { language, changeLanguage, saveError };
}

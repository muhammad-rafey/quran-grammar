import { useEffect, useState } from 'react';
import {
  defaultThemePreference,
  isThemePreference,
  type ThemePreference,
} from '@quran-grammar/core';

/** Also read by the inline script in index.html, which applies the theme before first paint. */
const preferenceKey = 'quran-grammar.theme';

function readPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(preferenceKey);
    return isThemePreference(stored) ? stored : defaultThemePreference;
  } catch {
    return defaultThemePreference;
  }
}

/**
 * Settings → Theme. `data-theme` on <html> selects the palette in styles.css; "system" leaves it
 * to prefers-color-scheme, so an OS switch between light and dark applies without any script.
 */
export function useTheme() {
  const [theme, setTheme] = useState<ThemePreference>(readPreference);
  const [saveError, setSaveError] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const changeTheme = (next: ThemePreference) => {
    setTheme(next);
    try {
      localStorage.setItem(preferenceKey, next);
      setSaveError(false);
    } catch {
      setSaveError(true);
    }
  };

  return { theme, changeTheme, saveError };
}

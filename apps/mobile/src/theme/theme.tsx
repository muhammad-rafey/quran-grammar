import { createContext, use } from 'react';
import type { ColorScheme, ThemePreference } from '@quran-grammar/core';
import { palettes, type Palette } from './palettes';

export type { Palette } from './palettes';
export { palettes } from './palettes';

/**
 * The colour theme in use. PreferencesProvider resolves the saved preference (System follows the
 * device's light/dark setting through useColorScheme) and provides it; read it with useTheme().
 */
export type Theme = {
  /** The scheme drawn now. */
  scheme: ColorScheme;
  /** The palette for `scheme`; one shared object per scheme, so it can key memoized styles. */
  colors: Palette;
  /** The reader's choice in Settings (default: System). */
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => Promise<void>;
  /** The last preference change could not be saved. */
  saveError: boolean;
};

export const ThemeContext = createContext<Theme | null>(null);

export function useTheme(): Theme {
  const theme = use(ThemeContext);
  if (!theme) throw new Error('useTheme requires PreferencesProvider');
  return theme;
}

/**
 * Styles derived from a palette by a module-level `build` function, built once per palette and
 * shared: `const screenStyles = themed((colors) => StyleSheet.create({...}))`, then
 * `const styles = screenStyles(useTheme().colors)` in each component.
 */
export function themed<T>(build: (colors: Palette) => T): (colors: Palette) => T {
  const cache = new Map<Palette, T>();
  return (colors) => {
    let value = cache.get(colors);
    if (value === undefined) {
      value = build(colors);
      cache.set(colors, value);
    }
    return value;
  };
}

/** The palette for a scheme. */
export function paletteFor(scheme: ColorScheme): Palette {
  return palettes[scheme];
}

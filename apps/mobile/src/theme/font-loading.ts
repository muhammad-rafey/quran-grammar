import { isLoaded, loadAsync } from 'expo-font';
import {
  defaultFontIds,
  fontsForRole,
  resolveFont,
  type FontRole,
  type ReadingFont,
} from '@quran-grammar/core';
import { fontAssets } from '@/theme/font-assets';

/**
 * Reading fonts are registered with expo-font under their registry `family`. The role defaults are
 * loaded before the first screen (useFonts in app/_layout.tsx); any other font is loaded on demand
 * the first time it is chosen, and never blocks the screen: the previous font stays in use until
 * the new one is ready (see useActiveFont in state/preferences-provider.tsx).
 */
const assets: Readonly<Record<string, number | undefined>> = fontAssets;

/** Whether the app bundles a file for the font; fonts without one are not offered in Settings. */
export function hasFontAsset(font: ReadingFont): boolean {
  return assets[font.family] !== undefined;
}

const selectable = new Map<FontRole, readonly ReadingFont[]>();

/** The fonts of a role that can be chosen (bundled), in registry order; one array per role. */
export function selectableFonts(role: FontRole): readonly ReadingFont[] {
  let fonts = selectable.get(role);
  if (!fonts) {
    fonts = fontsForRole(role).filter(hasFontAsset);
    selectable.set(role, fonts);
  }
  return fonts;
}

/** The role defaults, for useFonts at startup. */
export const startupFonts: Record<string, number> = Object.fromEntries(
  (Object.keys(defaultFontIds) as FontRole[]).flatMap((role) => {
    const font = resolveFont(role, defaultFontIds[role]);
    const asset = assets[font.family];
    return asset === undefined ? [] : [[font.family, asset]];
  }),
);

export function isFontReady(font: ReadingFont): boolean {
  try {
    return isLoaded(font.family);
  } catch {
    return false;
  }
}

const loading = new Map<string, Promise<void>>();

/** Loads one reading font (once); rejects when it has no bundled file or cannot be registered. */
export function loadReadingFont(font: ReadingFont): Promise<void> {
  if (isFontReady(font)) return Promise.resolve();
  const pending = loading.get(font.family);
  if (pending) return pending;
  const asset = assets[font.family];
  const next =
    asset === undefined
      ? Promise.reject(new Error(`No bundled file for font ${font.id}`))
      : loadAsync({ [font.family]: asset });
  // A failed load may be retried later (e.g. after a transient file-system error).
  const tracked = next.catch((error: unknown) => {
    loading.delete(font.family);
    throw error;
  });
  loading.set(font.family, tracked);
  return tracked;
}

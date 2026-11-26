/**
 * Colour theme preference shared by web and mobile. `system` follows the operating system's
 * light/dark setting; the palettes themselves live with each app (web: CSS custom properties in
 * apps/web/src/styles.css, mobile: apps/mobile/src/theme/palettes.ts).
 *
 * This module has no imports so app tests can load it directly with Node's type stripping.
 */
export type ThemePreference = 'system' | 'light' | 'dark';
export type ColorScheme = 'light' | 'dark';

export const themePreferences: readonly ThemePreference[] = ['system', 'light', 'dark'];
export const defaultThemePreference: ThemePreference = 'system';

/** Validate a stored preference before applying it. */
export function isThemePreference(value: unknown): value is ThemePreference {
  return value === 'system' || value === 'light' || value === 'dark';
}

/** The scheme to draw: the explicit choice, else the OS scheme (light when it is unknown). */
export function resolveColorScheme(
  preference: ThemePreference,
  system: string | null | undefined,
): ColorScheme {
  if (preference !== 'system') return preference;
  return system === 'dark' ? 'dark' : 'light';
}

function channel(value: number): number {
  const srgb = value / 255;
  return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
}

/** Parse #rgb, #rrggbb or #rrggbbaa into 0-255 channels and 0-1 alpha. */
export function parseHexColor(hex: string): { r: number; g: number; b: number; a: number } {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(hex.trim());
  if (!match) throw new Error(`Not a hex colour: ${hex}`);
  let digits = match[1]!;
  if (digits.length === 3) digits = [...digits].map((digit) => digit + digit).join('');
  return {
    r: parseInt(digits.slice(0, 2), 16),
    g: parseInt(digits.slice(2, 4), 16),
    b: parseInt(digits.slice(4, 6), 16),
    a: digits.length === 8 ? parseInt(digits.slice(6, 8), 16) / 255 : 1,
  };
}

/** A translucent foreground composited over an opaque background, as #rrggbb. */
export function blendHexColor(foreground: string, background: string): string {
  const top = parseHexColor(foreground);
  const bottom = parseHexColor(background);
  const mix = (a: number, b: number) =>
    Math.round(a * top.a + b * (1 - top.a))
      .toString(16)
      .padStart(2, '0');
  return `#${mix(top.r, bottom.r)}${mix(top.g, bottom.g)}${mix(top.b, bottom.b)}`;
}

/** WCAG 2 relative luminance of an opaque hex colour. */
export function relativeLuminance(hex: string): number {
  const { r, g, b } = parseHexColor(hex);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** WCAG 2 contrast ratio (1-21) between two colours; a translucent foreground is blended first. */
export function contrastRatio(foreground: string, background: string): number {
  const front = relativeLuminance(blendHexColor(foreground, background));
  const back = relativeLuminance(background);
  const [light, dark] = front > back ? [front, back] : [back, front];
  return (light + 0.05) / (dark + 0.05);
}

/**
 * Light and dark colour palettes. Every colour the app draws comes from here, read through
 * `useTheme()` (theme.tsx); no component hard-codes a colour. Both palettes have the same keys.
 *
 * This file imports nothing from React Native so the contrast test (tests/theme-contrast.test.mjs)
 * can load it with Node. Text pairs meet WCAG AA (4.5:1) and controls 3:1 in both palettes.
 *
 * `primary` is both the accent text colour and the fill of primary controls; text on a primary
 * fill uses `onPrimary` (white on the dark green in light mode, near-black on the light green in
 * dark mode).
 */
export type Palette = {
  /** Screen background. */
  readonly background: string;
  /** Cards, header, floating navigation, inputs. */
  readonly paper: string;
  /** Body text. */
  readonly ink: string;
  /** Secondary text, placeholders, inactive icons. */
  readonly muted: string;
  /** Accent text, icons and the fill of primary controls. */
  readonly primary: string;
  /** The darker bottom edge of a primary button. */
  readonly primaryEdge: string;
  /** Text and icons drawn on a `primary` fill. */
  readonly onPrimary: string;
  /** Tinted surface: selected rows, quiet buttons, ayah numbers, noun labels. */
  readonly wash: string;
  /** Lighter tint: filter panel, pressed rows, suggested entries. */
  readonly mint: string;
  /** Highlight: the selected tab, pressed buttons, the selected word in its context. */
  readonly lime: string;
  /** Hairlines and card borders. */
  readonly border: string;
  /** Stronger edge of quiet buttons and practice cards. */
  readonly edge: string;
  readonly transparent: string;
  /** Decorative accent: practice icons, bullets, the topic example rule. */
  readonly gold: string;
  /** Particle labels, the wrong-answer state and warnings. */
  readonly amber: string;
  readonly amberWash: string;
  /** Verb labels. */
  readonly blue: string;
  readonly blueWash: string;
  /** Shadow colour of floating surfaces (#rrggbbaa). */
  readonly shadow: string;
};

export const lightColors: Palette = {
  background: '#f7f8ef',
  paper: '#ffffff',
  ink: '#203b30',
  muted: '#627067',
  primary: '#14654c',
  primaryEdge: '#104e3b',
  onPrimary: '#ffffff',
  wash: '#eaf4df',
  mint: '#eef6ee',
  lime: '#d8ed9b',
  border: '#dbe5d5',
  edge: '#cbd9c4',
  transparent: 'transparent',
  gold: '#b57a22',
  amber: '#80601c',
  amberWash: '#fbf5e6',
  blue: '#42648b',
  blueWash: '#edf2f9',
  shadow: '#203b3021',
};

/** Deep green-charcoal surfaces with light text; accents lightened to keep their hues. */
export const darkColors: Palette = {
  background: '#0f1713',
  paper: '#17221c',
  ink: '#e3ece5',
  muted: '#a2b3a8',
  primary: '#7fd0a9',
  primaryEdge: '#4b9474',
  onPrimary: '#0b1a13',
  wash: '#1f3027',
  mint: '#1a2820',
  lime: '#344a26',
  border: '#2d3d34',
  edge: '#3d5246',
  transparent: 'transparent',
  gold: '#e0ac57',
  amber: '#e8c274',
  amberWash: '#2f2817',
  blue: '#93b9e6',
  blueWash: '#1c2937',
  shadow: '#00000099',
};

export const palettes = { light: lightColors, dark: darkColors } as const;

// WCAG AA contrast of the colour pairs the app actually draws, in both palettes (src/theme/palettes.ts).
import assert from 'node:assert/strict';
import test from 'node:test';
import { darkColors, lightColors, palettes } from '../src/theme/palettes.ts';
import { contrastRatio } from '../../../packages/core/src/theme.ts';

/** Text (4.5:1): [foreground, background, where]. */
const textPairs = [
  ['ink', 'background', 'screen text, loading states'],
  ['ink', 'paper', 'cards, header, inputs'],
  ['ink', 'wash', 'quiet surfaces, selected rows'],
  ['ink', 'mint', 'filter panel, pressed rows'],
  ['ink', 'lime', 'selected practice option'],
  ['ink', 'amberWash', 'data status, wrong practice option'],
  ['muted', 'background', 'secondary text on the screen'],
  ['muted', 'paper', 'secondary text and placeholders in cards'],
  ['muted', 'wash', 'secondary text on quiet surfaces'],
  ['muted', 'mint', 'secondary text in the filter panel'],
  ['muted', 'amberWash', 'loading note in data status'],
  ['primary', 'paper', 'accent text and links in cards'],
  ['primary', 'background', 'accent text on the screen, example cards'],
  ['primary', 'wash', 'quiet buttons, the Back button, noun labels, segments'],
  ['primary', 'mint', 'pressed rows, suggested picker entries'],
  ['primary', 'lime', 'selected tab, selected cell, word in context'],
  ['onPrimary', 'primary', 'primary buttons, active chips and segments'],
  ['amber', 'amberWash', 'particle labels'],
  ['amber', 'paper', 'font load failure note'],
  ['amber', 'wash', 'wrong-answer note on the practice card'],
  ['blue', 'blueWash', 'verb labels'],
];

/** Non-text controls and icons (3:1). */
const uiPairs = [
  ['primary', 'paper', 'selected radio and word borders, icons'],
  ['primary', 'background', 'icons on the screen'],
  ['primary', 'wash', 'icons on quiet surfaces, the Back arrow'],
  ['muted', 'paper', 'unchecked radio ring, inactive tab icons'],
  ['gold', 'paper', 'practice icons'],
  ['gold', 'wash', 'practice icon on the quick-practice card'],
  ['gold', 'background', 'topic example rule'],
];

const results = [];
for (const [scheme, colors] of Object.entries(palettes)) {
  for (const [minimum, pairs] of [
    [4.5, textPairs],
    [3, uiPairs],
  ]) {
    for (const [fg, bg, where] of pairs) {
      results.push({
        scheme,
        fg,
        bg,
        where,
        minimum,
        ratio: contrastRatio(colors[fg], colors[bg]),
      });
    }
  }
}

test('both palettes define the same colour keys', () => {
  assert.deepEqual(Object.keys(darkColors).sort(), Object.keys(lightColors).sort());
});

test('every palette colour is a hex colour (or transparent)', () => {
  for (const colors of Object.values(palettes)) {
    for (const [key, value] of Object.entries(colors)) {
      if (key === 'transparent') assert.equal(value, 'transparent');
      else assert.match(value, /^#(?:[0-9a-f]{6}|[0-9a-f]{8})$/i, key);
    }
  }
});

test('text and controls meet WCAG AA contrast in light and dark', () => {
  const failures = results.filter((result) => result.ratio < result.minimum);
  if (process.env.SHOW_CONTRAST)
    for (const r of results)
      console.log(
        `${r.scheme}\t${r.fg} on ${r.bg}\t${r.ratio.toFixed(2)} (≥${r.minimum})\t${r.where}`,
      );
  assert.deepEqual(
    failures.map(
      (r) => `${r.scheme}: ${r.fg} on ${r.bg} ${r.ratio.toFixed(2)} < ${r.minimum} (${r.where})`,
    ),
    [],
  );
});

test('dark surfaces are dark and light surfaces are light', () => {
  for (const key of ['background', 'paper', 'wash', 'mint']) {
    assert.ok(contrastRatio(darkColors[key], '#000000') < 2, `dark ${key}`);
    assert.ok(contrastRatio(lightColors[key], '#ffffff') < 1.2, `light ${key}`);
  }
});

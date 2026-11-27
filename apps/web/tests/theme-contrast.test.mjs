// Light/dark palettes in styles.css: every colour is a token, both dark blocks agree, and the
// text and control pairs the stylesheet draws meet WCAG 2 AA in both themes.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { contrastRatio, parseHexColor } from '../../../packages/core/src/theme.ts';

const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8').replace(
  /\/\*[\s\S]*?\*\//g,
  '',
);

/** Declarations of the first block whose selector line matches `selector`. */
function block(selector) {
  const start = css.indexOf(`${selector} {`);
  assert.notEqual(start, -1, `${selector} block is missing`);
  const body = css.slice(start + selector.length + 2, css.indexOf('}', start));
  return Object.fromEntries(
    [...body.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map(([, name, value]) => [name, value.trim()]),
  );
}

const light = block(':root');
const dark = block(":root[data-theme='dark']");
const systemDark = block("  :root:not([data-theme='light'])");
const themes = { light, dark };
const colourTokens = Object.keys(light).filter((name) => /^#/.test(light[name]));

test('the dark palette is identical for data-theme="dark" and System on a dark OS', () => {
  assert.deepEqual(systemDark, dark);
});

test('both palettes define the same colour tokens as hex values', () => {
  assert.ok(colourTokens.length > 40, 'palette tokens were parsed');
  assert.deepEqual(Object.keys(dark).sort(), colourTokens.sort());
  for (const [name, palette] of Object.entries(themes))
    for (const token of colourTokens) assert.doesNotThrow(() => parseHexColor(palette[token]), `${name} ${token}`);
});

test('no colour is hard-coded outside the palette blocks', () => {
  const rules = css.slice(css.indexOf('@media (prefers-color-scheme: dark)'));
  const afterPalettes = rules.slice(rules.indexOf('\n}\n') + 3);
  const literals = afterPalettes.match(/#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(|\b(?:white|black)\b(?!-)/gi);
  assert.deepEqual(literals ?? [], []);
  const used = new Set([...css.matchAll(/var\((--[\w-]+)/g)].map(([, name]) => name));
  for (const name of used)
    if (!(name in light) && !/^--(font|quran|urdu|translation|sticky|split|ayah|detail|word)/.test(name))
      assert.fail(`${name} is used but not defined in the palette`);
});

const surfaces = ['--bg', '--paper', '--field', '--surface', '--surface-soft', '--mint', '--mint-strong', '--selected'];
const calm = ['--bg', '--paper', '--field', '--surface', '--surface-soft', '--mint'];
/** [foreground, backgrounds, minimum ratio]: 4.5 for text, 3 for focus rings and control parts. */
const pairs = [
  ...['--text', '--text-soft', '--muted', '--green', '--green-strong'].map((fg) => [fg, surfaces, 4.5]),
  ['--quiet', calm, 4.5],
  ...['noun', 'verb', 'particle', 'pronoun'].map((type) => [
    `--${type}`,
    ['--paper', '--surface', '--surface-soft', '--mint', '--selected', `--${type}-bg`],
    4.5,
  ]),
  ['--warn-text', ['--warn-bg', '--warn-bg-strong', '--paper'], 4.5],
  ['--highlight-text', ['--highlight'], 4.5],
  ['--danger', ['--danger-bg', '--paper'], 4.5],
  ['--success', ['--selected', '--mint'], 4.5],
  ['--gold', ['--paper', '--surface', '--mint'], 4.5],
  ['--on-accent', ['--accent-fill', '--accent-hover'], 4.5],
  ['--focus', ['--bg', '--paper', '--surface', '--mint', '--selected'], 3],
  ['--accent-fill', ['--bg', '--paper', '--mint'], 3],
  ['--track', ['--paper', '--mint'], 3],
  ['--knob', ['--track'], 3],
  ['--knob-on', ['--accent-fill'], 3],
  ['--success-mark', ['--mint-strong'], 3],
  ['--progress', ['--mint'], 3],
  ['--danger-line', ['--danger-bg'], 3],
  ['--success-line', ['--selected'], 3],
];

for (const [name, palette] of Object.entries(themes))
  test(`${name} palette meets WCAG AA for text (4.5:1) and controls (3:1)`, () => {
    const failures = [];
    for (const [foreground, backgrounds, minimum] of pairs)
      for (const background of backgrounds) {
        const ratio = contrastRatio(palette[foreground], palette[background]);
        if (ratio < minimum)
          failures.push(`${foreground} on ${background}: ${ratio.toFixed(2)} < ${minimum}`);
      }
    assert.deepEqual(failures, []);
  });

test('rules that set both a text colour and an opaque background are readable in both themes', () => {
  const failures = [];
  let checked = 0;
  for (const [, selector, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const color = /(?:^|;)\s*color:\s*var\((--[\w-]+)\)/.exec(body)?.[1];
    const background = /background:\s*var\((--[\w-]+)\)\s*;/.exec(body)?.[1];
    if (!color || !background || !(color in light) || !(background in light)) continue;
    // Disabled controls are exempt from WCAG contrast; --success-mark colours an icon (3:1 above).
    if (selector.includes(':disabled') || color === '--success-mark') continue;
    checked++;
    for (const [name, palette] of Object.entries(themes)) {
      const ratio = contrastRatio(palette[color], palette[background]);
      if (ratio < 4.5)
        failures.push(`${name} ${selector.trim()}: ${color} on ${background} ${ratio.toFixed(2)}`);
    }
  }
  assert.ok(checked > 15, `checked ${checked} rules`);
  assert.deepEqual(failures, []);
});

/** OKLab coordinates, for perceptual distance between the word-type colours. */
function oklab(hex) {
  const { r, g, b } = parseHexColor(hex);
  const [R, G, B] = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675778 * s,
  ];
}

test('word-type colours stay clearly distinct from each other in both themes', () => {
  const types = ['--noun', '--verb', '--particle', '--pronoun'];
  for (const [name, palette] of Object.entries(themes))
    for (const [index, a] of types.entries())
      for (const b of types.slice(index + 1)) {
        const [, a1, b1] = oklab(palette[a]);
        const [, a2, b2] = oklab(palette[b]);
        // Chroma-plane distance (hue/colourfulness), independent of lightness.
        const distance = Math.hypot(a1 - a2, b1 - b2);
        assert.ok(distance > 0.08, `${name} ${a} vs ${b}: ${distance.toFixed(3)}`);
      }
});

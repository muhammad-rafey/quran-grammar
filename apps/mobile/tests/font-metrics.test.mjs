import assert from 'node:assert/strict';
import test from 'node:test';
import {
  defaultFontIds,
  fontsForRole,
  readingFonts,
  resolveFont,
} from '../../../packages/core/src/fonts.ts';
import {
  inkLineHeight,
  quranLineHeight,
  urduLine,
  urduMinLineHeight,
} from '../src/theme/font-metrics.ts';

test('the default fonts keep their established sizes and line heights', () => {
  const amiri = resolveFont('quran', defaultFontIds.quran);
  const naskh = resolveFont('urdu', defaultFontIds.urdu);
  // Holds Amiri Quran's deepest shaped mark (0.95em, «أَلِيمٌۭ») below the baseline.
  assert.equal(quranLineHeight(amiri, 29), 90);
  assert.deepEqual(urduLine(naskh, 18, 32), { fontSize: 18, lineHeight: 32 });
  assert.deepEqual(urduLine(naskh, 15, 26), { fontSize: 15, lineHeight: 26 });
  assert.deepEqual(urduLine(naskh, 23), { fontSize: 23, lineHeight: 40 });
  // A heading whose requested lineHeight is too small is raised to ascent+descent.
  assert.deepEqual(urduLine(naskh, 24, 28), { fontSize: 24, lineHeight: 41 });
});

test('every Quran font gets an iOS line box that holds its tallest and deepest marks', () => {
  for (const font of fontsForRole('quran')) {
    for (const size of [23, 29, 46]) {
      const lineHeight = quranLineHeight(font, size);
      const leading = (lineHeight - size * (font.metrics.ascent + font.metrics.descent)) / 2;
      assert.ok(size * font.metrics.ascent + leading >= size * font.metrics.inkTop - 0.5, font.id);
      assert.ok(size * font.metrics.descent + leading >= size * font.metrics.inkBottom - 0.5, font.id);
    }
    assert.ok(inkLineHeight(font.metrics) >= font.metrics.ascent + font.metrics.descent);
  }
});

test('every Urdu font gets at least its ascent+descent as line height, at any requested size', () => {
  for (const font of fontsForRole('urdu')) {
    for (const [size, lineHeight] of [[13, 22], [16, 28], [18, 32], [24, 28], [28, 48]]) {
      const line = urduLine(font, size, lineHeight);
      assert.ok(line.lineHeight >= urduMinLineHeight(font, line.fontSize), font.id);
      assert.ok(line.lineHeight >= Math.round(lineHeight * font.scale), font.id);
    }
  }
});

test('registry entries have usable metrics and unique ids and families per role', () => {
  assert.equal(new Set(readingFonts.map((font) => font.id)).size, readingFonts.length);
  for (const role of ['quran', 'urdu']) {
    const fonts = fontsForRole(role);
    assert.equal(new Set(fonts.map((font) => font.family)).size, fonts.length, role);
  }
  for (const font of readingFonts) {
    const { ascent, descent, inkTop, inkBottom } = font.metrics;
    for (const value of [ascent, descent, inkTop, inkBottom, font.scale]) {
      assert.ok(Number.isFinite(value) && value > 0, font.id);
    }
  }
});

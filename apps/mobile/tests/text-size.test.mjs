import assert from 'node:assert/strict';
import test from 'node:test';
import { fontsForRole } from '../../../packages/core/src/fonts.ts';
import {
  parseTextSizes,
  scaleFontSize,
  textSizeSteps,
} from '../../../packages/core/src/text-size.ts';
import { quranLineHeight, scaledSize, urduLine, urduMinLineHeight } from '../src/theme/font-metrics.ts';

// typography.ts applies the reader's text sizes as design sizes (scaleFontSize) before the font
// metrics; these checks hold for every font at every step, so no size clips marks or letters.

test('Quranic Arabic keeps a line box holding its tallest and deepest marks at every text size', () => {
  for (const font of fontsForRole('quran')) {
    for (const step of textSizeSteps) {
      // Reading size, word-screen heading (capped at 64) and the smallest example size.
      for (const design of [
        scaleFontSize(29, step),
        Math.min(scaleFontSize(46, step), 64),
        scaleFontSize(23, step),
      ]) {
        const size = scaledSize(font, design);
        const lineHeight = quranLineHeight(font, size);
        const leading = (lineHeight - size * (font.metrics.ascent + font.metrics.descent)) / 2;
        assert.ok(size * font.metrics.ascent + leading >= size * font.metrics.inkTop - 0.5, `${font.id} ${step}`);
        assert.ok(
          size * font.metrics.descent + leading >= size * font.metrics.inkBottom - 0.5,
          `${font.id} ${step}`,
        );
      }
    }
  }
});

test('ayah translations keep at least the Urdu font line height at every text size', () => {
  for (const font of fontsForRole('urdu')) {
    for (const step of textSizeSteps) {
      for (const [fontSize, lineHeight] of [
        [18, 32],
        [15, 26],
      ]) {
        const line = urduLine(font, scaleFontSize(fontSize, step), Math.round(lineHeight * step));
        assert.ok(line.lineHeight >= urduMinLineHeight(font, line.fontSize), `${font.id} ${step}`);
        // The line grows with the text: no overlapping lines at larger sizes.
        assert.ok(line.lineHeight >= line.fontSize * 1.4, `${font.id} ${step}`);
      }
    }
  }
});

test('the word-screen heading fits a 360dp phone at the largest Quran text size', () => {
  const largest = textSizeSteps.at(-1);
  const heading = Math.min(scaleFontSize(46, largest), Math.max(46, 64));
  assert.equal(heading, 64);
  // The widest Quranic words are about 4.3em; the card's text column on a 360dp phone is ~296dp.
  assert.ok(heading * 4.3 <= 296);
});

test('stored mobile sizes are validated like the web ones', () => {
  assert.deepEqual(parseTextSizes('{"quran":1.75,"translation":0.85}'), { quran: 1.75, translation: 0.85 });
  assert.deepEqual(parseTextSizes('{"quran":true}'), { quran: 1, translation: 1 });
});

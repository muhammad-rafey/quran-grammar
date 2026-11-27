import assert from 'node:assert/strict';
import test from 'node:test';
import { getUiStrings } from './interface';
import {
  canStepTextSize,
  defaultTextSizes,
  isTextSize,
  parseTextSizes,
  resolveTextSize,
  scaleFontSize,
  serializeTextSizes,
  stepTextSize,
  textSizePercent,
  textSizeSteps,
} from './text-size';

test('text-size steps run from 85% to 175% with 100% as the default', () => {
  assert.deepEqual(textSizeSteps.map(textSizePercent), [85, 100, 115, 130, 150, 175]);
  assert.deepEqual(defaultTextSizes, { quran: 1, translation: 1 });
  assert.ok(textSizeSteps.every((step, index) => index === 0 || step > textSizeSteps[index - 1]!));
});

test('stepping moves one step and clamps at the smallest and largest steps', () => {
  assert.equal(stepTextSize(1, 1), 1.15);
  assert.equal(stepTextSize(1, -1), 0.85);
  assert.equal(stepTextSize(0.85, -1), 0.85);
  assert.equal(stepTextSize(1.75, 1), 1.75);
  assert.equal(canStepTextSize(0.85, -1), false);
  assert.equal(canStepTextSize(0.85, 1), true);
  assert.equal(canStepTextSize(1.75, 1), false);
  assert.equal(canStepTextSize(1.75, -1), true);
  // Walking up from the smallest step visits every step once.
  const visited = [0.85];
  while (canStepTextSize(visited.at(-1)!, 1)) visited.push(stepTextSize(visited.at(-1)!, 1));
  assert.deepEqual(visited, textSizeSteps);
});

test('stored sizes are validated: invalid values fall back, numbers snap to the nearest step', () => {
  assert.equal(resolveTextSize(null), 1);
  assert.equal(resolveTextSize('large'), 1);
  assert.equal(resolveTextSize(Number.NaN), 1);
  assert.equal(resolveTextSize(''), 1);
  assert.equal(resolveTextSize('1.3'), 1.3);
  assert.equal(resolveTextSize(1.2), 1.15);
  assert.equal(resolveTextSize(9), 1.75);
  assert.equal(resolveTextSize(-2), 0.85);
  assert.equal(isTextSize(1.5), true);
  assert.equal(isTextSize(1.2), false);
  assert.equal(isTextSize('1.5'), false);

  assert.deepEqual(parseTextSizes(null), defaultTextSizes);
  assert.deepEqual(parseTextSizes('not json'), defaultTextSizes);
  assert.deepEqual(parseTextSizes('[]'), defaultTextSizes);
  assert.deepEqual(parseTextSizes('{"quran":1.5}'), { quran: 1.5, translation: 1 });
  assert.deepEqual(parseTextSizes('{"quran":"x","translation":4}'), {
    quran: 1,
    translation: 1.75,
  });
  const sizes = { quran: 1.3, translation: 0.85 };
  assert.deepEqual(parseTextSizes(serializeTextSizes(sizes)), sizes);
});

test('font sizes scale to half pixels', () => {
  assert.equal(scaleFontSize(29, 1), 29);
  assert.equal(scaleFontSize(29, 1.15), 33.5);
  assert.equal(scaleFontSize(18, 1.75), 31.5);
});

test('text-size controls have English and Urdu labels', () => {
  for (const language of ['en', 'ur'] as const) {
    const ui = getUiStrings(language);
    for (const key of [
      'textSize',
      'textSizeHelp',
      'quranTextSize',
      'translationTextSize',
      'smaller',
      'larger',
      'resetTextSize',
    ] as const) {
      assert.ok(ui[key].length > 0, `${language}.${key}`);
    }
  }
  assert.notEqual(getUiStrings('en').larger, getUiStrings('ur').larger);
});

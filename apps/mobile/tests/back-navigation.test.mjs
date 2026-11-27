import assert from 'node:assert/strict';
import test from 'node:test';
import { backArrow, stackBackTarget, tabBackTarget } from '../src/state/back-navigation.ts';

test('a pushed practice screen pops to the screen that opened it', () => {
  assert.equal(stackBackTarget(true), 'pop');
});

test('a practice screen opened by a link with nothing under it returns home, never closes the app', () => {
  assert.equal(stackBackTarget(false), 'home');
});

test('Android back on Practice Grammar or Settings returns to the Study tab', () => {
  assert.equal(tabBackTarget('practice', 'words'), 'words');
  assert.equal(tabBackTarget('settings', 'words'), 'words');
});

test('Android back on the Study tab is left to the system', () => {
  assert.equal(tabBackTarget('words', 'words'), null);
});

test('the Back arrow points left in English and right in Urdu', () => {
  assert.equal(backArrow(false), 'arrowLeft');
  assert.equal(backArrow(true), 'arrowRight');
});

import assert from 'node:assert/strict';
import test from 'node:test';
import { physicalRowDirection } from '../src/theme/physical-row.ts';

test('Quran rows retain Arabic reading order on LTR and RTL devices', () => {
  assert.equal(physicalRowDirection(true, false), 'row-reverse');
  assert.equal(physicalRowDirection(true, true), 'row');
});

test('English controls retain left-to-right order on LTR and RTL devices', () => {
  assert.equal(physicalRowDirection(false, false), 'row');
  assert.equal(physicalRowDirection(false, true), 'row-reverse');
});

import assert from 'node:assert/strict';
import test from 'node:test';
import { parseWordLocation } from '../src/state/word-location.ts';

test('occurrence routes retain their chapter, ayah and word position', () => {
  assert.deepEqual(parseWordLocation('1:5:2'), { surah: 1, ayah: 5, position: 2 });
  assert.deepEqual(parseWordLocation('114:6:3'), { surah: 114, ayah: 6, position: 3 });
});

test('invalid route parameters cannot select chapters or request arbitrary API paths', () => {
  for (const value of [
    undefined,
    ['105:1:1'],
    '0:1:1',
    '115:1:1',
    '105:0:1',
    '105:1:0',
    '0105:1:1',
    '105:01:1',
    '105:1:1?x=1',
    '../105:1:1',
    '105:1:1:1',
    '105:1:1\n',
  ]) {
    assert.equal(parseWordLocation(value), null, String(value));
  }
});

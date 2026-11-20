import assert from 'node:assert/strict';
import test from 'node:test';
import { AyahJump, topVisibleAyah } from '../src/screens/ayah-scroll.ts';

const viewable = (index, number, isViewable = true) => ({ index, isViewable, item: { number } });

test('the current ayah is the top-most viewable cell, whatever order FlatList reports', () => {
  assert.equal(topVisibleAyah([viewable(5, 6), viewable(3, 4), viewable(4, 5)]), 4);
  assert.equal(topVisibleAyah([viewable(2, 3, false), viewable(3, 4)]), 4);
  assert.equal(topVisibleAyah([viewable(null, 9)]), null);
  assert.equal(topVisibleAyah([]), null);
});

test('a far jump starts a new slice at the target; jumps inside the slice settle after confirmations', () => {
  const jump = new AyahJump(4, 2);
  assert.equal(jump.mount(4, 176), 0, 'a fresh chapter starts at the top');
  jump.request(4, 150);
  assert.equal(jump.pendingFor(4), true);
  // From a slice starting at ayah 1 the target is index 149 of the slice, but not measured yet.
  assert.equal(jump.sliceIndex(4, 176, 0), 149);
  assert.equal(jump.failed(4), 'remount');
  assert.equal(jump.mount(4, 176), 149, 'the new slice starts at the target');
  assert.equal(jump.sliceIndex(4, 176, 149), 0, 'the target is now the first item');

  // Earlier ayahs were prepended (slice starts at ayah 138); jumping back to ayah 140 is in range.
  jump.request(4, 140);
  assert.equal(jump.sliceIndex(4, 176, 137), 2);
  assert.equal(jump.succeeded(4), true, 'first measured pass is confirmed once more');
  assert.equal(jump.succeeded(4), true);
  assert.equal(jump.succeeded(4), false, 'settled after the confirmation passes');
  assert.equal(jump.pendingFor(4), false);
  assert.equal(jump.sliceIndex(4, 176, 137), null);
  assert.equal(jump.failed(4), 'none');

  // A target before the slice needs a new slice.
  jump.request(4, 2);
  assert.equal(jump.sliceIndex(4, 176, 137), 'remount');
});

test('a Juz jump into another chapter applies only once that chapter is mounted', () => {
  const jump = new AyahJump();
  jump.request(22, 30); // Juz start in Al-Hajj while An-Nisa is still displayed.
  assert.equal(jump.mount(4, 176), 0, 'never applied to the chapter on screen');
  assert.equal(jump.sliceIndex(4, 176, 0), null);
  assert.equal(jump.pendingFor(4), false);
  assert.equal(jump.failed(4), 'none');
  assert.equal(jump.succeeded(4), false);
  assert.equal(jump.mount(22, 78), 29, 'Al-Hajj mounts at its Juz start ayah');
  assert.equal(jump.sliceIndex(22, 78, 29), 0);
});

test('targets are clamped to the chapter and a newer request supersedes an older one', () => {
  const jump = new AyahJump();
  jump.request(1, 99);
  assert.equal(jump.indexFor(1, 7), 6);
  assert.equal(jump.mount(1, 7), 6);
  jump.request(1, 3);
  assert.equal(jump.indexFor(1, 7), 2);
  jump.request(1, 0);
  assert.equal(jump.indexFor(1, 7), 0);
  assert.equal(jump.indexFor(1, 0), null);
});

test('dragging cancels a pending jump and repeated failures give up', () => {
  const jump = new AyahJump(2, 1);
  jump.request(4, 100);
  jump.cancel();
  assert.equal(jump.pendingFor(4), false);
  assert.equal(jump.sliceIndex(4, 176, 0), null);

  jump.request(4, 100);
  assert.equal(jump.failed(4), 'remount');
  assert.equal(jump.failed(4), 'remount');
  assert.equal(jump.failed(4), 'none', 'third failure exceeds the limit');
  assert.equal(jump.pendingFor(4), false);
});

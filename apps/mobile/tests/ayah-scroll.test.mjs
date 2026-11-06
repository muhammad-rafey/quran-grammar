import assert from 'node:assert/strict';
import test from 'node:test';
import { AyahScroll } from '../src/screens/ayah-scroll.ts';

test('short-to-long chapter jumps wait for the new content extent and native acknowledgement', () => {
  const previous = new AyahScroll();
  previous.recordViewport(700);
  previous.recordContent(800);
  previous.recordAyah(1, 20, 200);
  previous.deactivate();

  const current = new AyahScroll(28);
  current.recordViewport(700);
  current.recordAyah(6, 900, 300);
  current.recordAyah(28, 5000, 300);
  current.recordContent(800); // An initial incomplete native layout cannot reach ayah 28.
  assert.equal(current.takeScroll(8), null);
  assert.deepEqual(current.observeScroll(900, 1), { ayah: null, retry: false });
  current.recordContent(9000);
  assert.equal(current.takeScroll(8), 4992);
  assert.deepEqual(current.observeScroll(900, 2), { ayah: null, retry: true });
  assert.equal(current.takeScroll(8, true), 4992);
  assert.deepEqual(current.observeScroll(4992, 3), { ayah: 28, retry: false });
  assert.deepEqual(previous.observeScroll(0, 4), { ayah: null, retry: false });
  assert.equal(previous.takeScroll(8), null);
});

for (const order of ['content-first', 'ayah-first']) {
  test(`deferred target layout and content size work in ${order} order`, () => {
    const navigation = new AyahScroll(28);
    if (order === 'content-first') navigation.recordContent(9000);
    else navigation.recordAyah(28, 5000, 300);
    navigation.recordViewport(700);
    assert.equal(navigation.takeScroll(8), null);
    if (order === 'content-first') navigation.recordAyah(28, 5000, 300);
    else navigation.recordContent(9000);
    assert.equal(navigation.takeScroll(8), 4992);
    assert.equal(navigation.takeScroll(8), null, 'unchanged measurements do not schedule duplicate commands');
    assert.deepEqual(navigation.observeScroll(4992, 1), { ayah: 28, retry: false });
  });
}

test('content and target layout still wait for the viewport, including a top-of-chapter jump', () => {
  const navigation = new AyahScroll();
  navigation.recordContent(500);
  navigation.recordAyah(1, 100, 200);
  assert.equal(navigation.takeScroll(8), null);
  navigation.recordViewport(700);
  assert.equal(navigation.takeScroll(8), 0);
  assert.deepEqual(navigation.observeScroll(0, 1), { ayah: null, retry: false });
});

test('same-chapter jumps can supersede an earlier request without accepting its queued scroll', () => {
  const navigation = new AyahScroll(28);
  navigation.recordViewport(700);
  navigation.recordContent(9000);
  navigation.recordAyah(10, 1500, 300);
  navigation.recordAyah(28, 5000, 300);
  assert.equal(navigation.takeScroll(8), 4992);
  navigation.request(10);
  assert.equal(navigation.takeScroll(8), 1492);
  assert.deepEqual(navigation.observeScroll(4992, 1), { ayah: null, retry: true });
  assert.deepEqual(navigation.observeScroll(1492, 2), { ayah: 10, retry: false });
});

test('user dragging cancels a deferred jump and reading labels follow actual offsets', () => {
  const navigation = new AyahScroll(28);
  navigation.recordAyah(1, 20, 200);
  navigation.recordAyah(2, 300, 200);
  navigation.beginReading();
  assert.equal(navigation.takeScroll(8), null);
  assert.deepEqual(navigation.observeScroll(300, 10), { ayah: 2, retry: false });
  assert.deepEqual(navigation.observeScroll(0, 9), { ayah: null, retry: false }, 'older queued event is ignored');
  assert.deepEqual(navigation.observeScroll(0, 11), { ayah: 1, retry: false });
});

test('switching words/grammar surfaces discards previous-view layouts and scroll callbacks', () => {
  const words = new AyahScroll(28);
  words.recordViewport(700);
  words.recordContent(9000);
  words.recordAyah(28, 5000, 300);
  words.deactivate();
  const grammar = new AyahScroll();
  grammar.recordViewport(700);
  grammar.recordContent(2000);
  grammar.recordAyah(1, 20, 300);
  words.recordAyah(1, 1800, 300);
  assert.equal(words.takeScroll(8), null);
  assert.deepEqual(words.observeScroll(4992, 5), { ayah: null, retry: false });
  assert.equal(grammar.takeScroll(8), 0);
  assert.deepEqual(grammar.observeScroll(0, 1), { ayah: 1, retry: false });
});

test('a bottom-of-chapter target uses the reachable native offset rather than waiting forever', () => {
  const navigation = new AyahScroll(30);
  navigation.recordViewport(700);
  navigation.recordContent(5700);
  navigation.recordAyah(29, 4950, 400);
  navigation.recordAyah(30, 5500, 100);
  assert.equal(navigation.takeScroll(8), 5000);
  assert.deepEqual(navigation.observeScroll(5000, 1), { ayah: 29, retry: false });
});

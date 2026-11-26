import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { AyahJump } from '../src/screens/ayah-scroll.ts';
import {
  ayahAtOffset,
  ayahLines,
  blockIndexOf,
  flowBlockText,
  flowBlockWords,
  groupFlowBlocks,
  unbrokenWord,
} from '../src/screens/mushaf-flow.ts';

test('a word containing a space stays on one line (a word joiner follows the space)', () => {
  const joiner = String.fromCharCode(0x2060);
  // 2:3:3 in the IndoPak text: «وَ يُقِيۡمُوۡنَ».
  assert.equal(unbrokenWord('وَ يُقِيۡمُوۡنَ'), `وَ ${joiner}يُقِيۡمُوۡنَ`);
  assert.equal(unbrokenWord('ذٰلِكَ'), 'ذٰلِكَ');
});

const lesson = (surah) =>
  JSON.parse(
    readFileSync(
      new URL(`../../../packages/core/data/lessons/surah-${surah}.json`, import.meta.url),
      'utf8',
    ),
  );

function chapterBlocks(surah) {
  const { ayahs, words } = lesson(surah);
  const counts = new Map();
  for (const word of words) counts.set(word.ayah, (counts.get(word.ayah) ?? 0) + 1);
  return { ayahs, words, blocks: groupFlowBlocks(ayahs, (number) => counts.get(number) ?? 0) };
}

test('Al-Baqarah is cut into ~180-word blocks of whole ayahs, in order, ending at ayah ends', () => {
  const { ayahs, words, blocks } = chapterBlocks(2);
  assert.equal(ayahs.length, 286);
  assert.deepEqual(
    blocks.flatMap((block) => block.ayahs),
    ayahs.map((ayah) => ayah.number),
    'every ayah once, in order',
  );
  assert.equal(
    blocks.reduce((sum, block) => sum + block.words, 0),
    words.length,
  );
  // Few block boundaries (the only places a line can end early), each block quick to lay out.
  assert.ok(blocks.length >= 25 && blocks.length <= 40, `${blocks.length} blocks`);
  for (const block of blocks.slice(0, -1)) {
    assert.ok(block.words >= flowBlockWords, `${block.key}: ${block.words} words`);
    // A block closes as soon as it reaches the target, so it overshoots by less than one ayah.
    assert.ok(block.words < flowBlockWords + 130, `${block.key}: ${block.words} words`);
  }
  assert.ok(blocks.at(-1).words >= flowBlockWords / 3, 'no tiny tail block');
  assert.equal(new Set(blocks.map((block) => block.key)).size, blocks.length);
  // 2:282 (the longest ayah) is never split.
  assert.ok(blocks.some((block) => block.ayahs.includes(282)));
});

test('a short chapter is one block; a tiny tail is merged into the block before', () => {
  const { blocks } = chapterBlocks(1);
  assert.deepEqual(blocks.map((block) => block.ayahs), [[1, 2, 3, 4, 5, 6, 7]]);
  const ayahs = [1, 2, 3, 4].map((number) => ({ number }));
  const sizes = { 1: 100, 2: 90, 3: 100, 4: 10 };
  assert.deepEqual(
    groupFlowBlocks(ayahs, (number) => sizes[number], 180).map((block) => block.ayahs),
    [[1, 2], [3, 4]],
  );
  const tail = { 1: 100, 2: 90, 3: 50 };
  assert.deepEqual(
    groupFlowBlocks(ayahs.slice(0, 3), (number) => tail[number], 180).map((block) => block.ayahs),
    [[1, 2, 3]],
  );
});

test('an ayah maps to its block, and ayah jumps scroll to that block', () => {
  const { blocks } = chapterBlocks(2);
  for (const number of [1, 2, 100, 255, 282, 286]) {
    const block = blocks[blockIndexOf(blocks, number)];
    assert.ok(block.ayahs.includes(number), `ayah ${number}`);
  }
  assert.equal(blockIndexOf(blocks, 999), blocks.length - 1);
  assert.equal(blockIndexOf(blocks, 0), 0);

  const jump = new AyahJump();
  const indexOf = (number) => blockIndexOf(blocks, number);
  jump.request(2, 255);
  const target = blockIndexOf(blocks, 255);
  assert.equal(jump.targetAyah(2), 255);
  assert.equal(jump.targetAyah(3), null);
  // A far jump mounts a slice starting at the ayah's block, which is then the first cell.
  assert.equal(jump.mount(2, blocks.length, indexOf), target);
  assert.equal(jump.sliceIndex(2, blocks.length, target, indexOf), 0);
  assert.equal(jump.sliceIndex(2, blocks.length, target + 1, indexOf), 'remount');
  // Without a mapping the list has one cell per ayah, as before.
  assert.equal(jump.mount(2, 286), 254);
});

test('the running text puts each marker after its last word and records where each ayah starts', () => {
  const words = { 1: ['a', 'bb'], 2: ['ccc'], 3: ['dd', 'e'] };
  const { pieces, starts } = flowBlockText([1, 2, 3], (ayah) => words[ayah], (word) => word, {
    word: () => ' ',
    end: () => '~',
    marker: (ayah) => `#${ayah}`,
  });
  const text = pieces.map((piece) => piece.lead + piece.text).join('');
  assert.equal(text, 'a bb~#1 ccc~#2 dd e~#3');
  assert.deepEqual(
    starts.map((offset) => text.slice(offset, offset + 2)),
    ['a ', 'cc', 'dd'],
  );
  assert.deepEqual(
    pieces.filter((piece) => piece.kind === 'end').map((piece) => piece.lead),
    ['~', '~', '~'],
    'the marker is glued to the last word by the non-breaking end gap',
  );

  // Lines as onTextLayout reports them: ayah 2 starts part-way along the first line, ayah 3
  // part-way along the second.
  const lines = [
    { text: 'a bb~#1 cc', y: 0, height: 40 },
    { text: 'c~#2 dd e~#3', y: 40, height: 40 },
  ];
  const placed = ayahLines(lines, starts);
  assert.deepEqual(
    placed.map((line) => [line.top, line.bottom, line.atLineStart]),
    [
      [0, 40, true],
      [0, 40, false],
      [40, 80, false],
    ],
  );
  assert.deepEqual(
    ayahLines([], starts).map((line) => line.top),
    [0, 0, 0],
  );
  // The current ayah is the one at the start of the top line: ayah 1 at the chapter top (ayah 2
  // only starts later on that line), ayah 2 once the reader is on the second line.
  assert.equal(ayahAtOffset([1, 2, 3], placed, 10), 1);
  assert.equal(ayahAtOffset([1, 2, 3], placed, 45), 2);
  assert.equal(ayahAtOffset([1, 2, 3], placed, 85), 3);
  assert.equal(ayahAtOffset([1, 2, 3], undefined, 45), 1);
});

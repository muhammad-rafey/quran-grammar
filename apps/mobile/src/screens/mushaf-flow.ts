/**
 * Continuous (mushaf-like) reading: with word-by-word grammar and the translation off, the study
 * list shows the chapter as running Quranic text. Each ayah ends with its marker and the next ayah
 * continues on the same line.
 *
 * One Text holding a whole chapter (Al-Baqarah: 6,116 words) is too slow to lay out, so the
 * chapter is cut into flowing blocks of whole ayahs (~180 words each), one virtualized list cell
 * per block. A block always ends at an ayah end, so the only places a line can end early are the
 * few block boundaries. Ayah jumps and the current-ayah label map an ayah to its block and to the
 * line it starts on inside the block (from the block's text layout).
 */

export type FlowBlock = {
  /** Stable list key: the block's first ayah. */
  readonly key: string;
  /** The ayah numbers in the block, in order. */
  readonly ayahs: readonly number[];
  readonly words: number;
};

/** Words per block: large enough that breaks are rare, small enough to lay out quickly. */
export const flowBlockWords = 180;

/**
 * Groups a chapter's ayahs into flowing blocks of about `target` words. A block closes once it
 * reaches the target, so a long ayah (2:282, 128 words) is never split; a short tail block is
 * merged into the block before it.
 */
export function groupFlowBlocks(
  ayahs: readonly { readonly number: number }[],
  wordCount: (ayah: number) => number,
  target = flowBlockWords,
): FlowBlock[] {
  const blocks: { ayahs: number[]; words: number }[] = [];
  let current: { ayahs: number[]; words: number } | null = null;
  for (const { number } of ayahs) {
    if (!current) {
      current = { ayahs: [], words: 0 };
      blocks.push(current);
    }
    current.ayahs.push(number);
    current.words += wordCount(number);
    if (current.words >= target) current = null;
  }
  const last = blocks.at(-1);
  if (blocks.length > 1 && last && last.words < target / 3) {
    blocks.pop();
    const previous = blocks.at(-1)!;
    previous.ayahs.push(...last.ayahs);
    previous.words += last.words;
  }
  return blocks.map((block) => ({ ...block, key: `flow-${block.ayahs[0]}` }));
}

/** The index of the block holding `ayah` (the nearest block when it is out of range). */
export function blockIndexOf(blocks: readonly FlowBlock[], ayah: number): number {
  let low = 0;
  let high = blocks.length - 1;
  while (low < high) {
    const middle = Math.ceil((low + high) / 2);
    if (blocks[middle]!.ayahs[0]! <= ayah) low = middle;
    else high = middle - 1;
  }
  return Math.max(0, low);
}

const wordJoiner = String.fromCharCode(0x2060);

/**
 * A word's text kept on one line: some IndoPak words contain a space («وَ يُقِيۡمُوۡنَ», 2:3:3), and
 * a line break there split the word. A word joiner after the space forbids that break.
 */
export function unbrokenWord(text: string): string {
  return text.includes(' ') ? text.replace(/ /g, ` ${wordJoiner}`) : text;
}

export type FlowPiece<W> =
  | { readonly kind: 'word'; readonly word: W; readonly lead: string; readonly text: string }
  | { readonly kind: 'end'; readonly ayah: number; readonly lead: string; readonly text: string };

/**
 * The running text of a block: each word and ayah marker with the separator (`lead`) drawn before
 * it, and the character offset at which each ayah's first word starts (for its text-layout line).
 */
export function flowBlockText<W>(
  ayahs: readonly number[],
  wordsOf: (ayah: number) => readonly W[],
  textOf: (word: W) => string,
  gaps: {
    /** Between two words, or between a marker and the next ayah's first word. */
    readonly word: (previous: string) => string;
    /** Non-breaking, between an ayah's last word and its marker. */
    readonly end: (lastWord: string) => string;
    readonly marker: (ayah: number) => string;
  },
): { pieces: FlowPiece<W>[]; starts: number[] } {
  const pieces: FlowPiece<W>[] = [];
  const starts: number[] = [];
  let offset = 0;
  let previous: string | null = null;
  for (const ayah of ayahs) {
    let first = true;
    for (const word of wordsOf(ayah)) {
      const text = textOf(word);
      const lead = previous === null ? '' : gaps.word(previous);
      offset += lead.length;
      if (first) starts.push(offset);
      first = false;
      pieces.push({ kind: 'word', word, lead, text });
      offset += text.length;
      previous = text;
    }
    if (first) starts.push(offset);
    const text = gaps.marker(ayah);
    const lead = previous === null ? '' : gaps.end(previous);
    pieces.push({ kind: 'end', ayah, lead, text });
    offset += lead.length + text.length;
    previous = text;
  }
  return { pieces, starts };
}

/** Where an ayah starts in a laid-out block: its line, and whether it starts that line. */
export type AyahLine = { readonly top: number; readonly bottom: number; readonly atLineStart: boolean };

/**
 * The laid-out line holding each character offset, from a Text's onTextLayout lines (whose texts
 * concatenate to the whole text). Offsets past the end get the last line.
 */
export function ayahLines(
  lines: readonly { readonly text: string; readonly y: number; readonly height: number }[],
  offsets: readonly number[],
): AyahLine[] {
  const result: AyahLine[] = [];
  let line = 0;
  let lineStart = 0;
  for (const offset of offsets) {
    while (line < lines.length - 1 && offset >= lineStart + lines[line]!.text.length) {
      lineStart += lines[line]!.text.length;
      line += 1;
    }
    const current = lines[line];
    result.push({
      top: current?.y ?? 0,
      bottom: current ? current.y + current.height : 0,
      atLineStart: offset === lineStart,
    });
  }
  return result;
}

/**
 * The ayah being read at block-relative height `y` (the viewport top): the ayah that starts the
 * line at `y`, or that line's earlier part. An ayah starting part-way along that line does not
 * count yet. The first ayah when the block's layout is not known.
 */
export function ayahAtOffset(
  ayahs: readonly number[],
  lines: readonly AyahLine[] | undefined,
  y: number,
): number {
  let found = ayahs[0]!;
  if (!lines) return found;
  for (let index = 0; index < ayahs.length && index < lines.length; index += 1) {
    const line = lines[index]!;
    if (line.top > y) break;
    if (line.atLineStart || line.bottom <= y) found = ayahs[index]!;
  }
  return found;
}

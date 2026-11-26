import { expect, test, type Page } from '@playwright/test';

// Continuous (mushaf) reading: with word-by-word grammar and the translation off, each ayah ends
// with its marker and the next ayah continues on the same line, justified, with no per-ayah gaps.
test.use({
  storageState: { cookies: [], origins: [] },
  viewport: { width: 390, height: 844 },
});

const layoutKey = 'quran-grammar.reading-layout';
const quranFontKey = 'quran-grammar.quran-font';

async function openMushaf(page: Page, hash: string, ayahs: number, font?: string) {
  await page.addInitScript(
    ({ layoutKey, quranFontKey, font }) => {
      localStorage.setItem(layoutKey, JSON.stringify({ grammar: false, translation: false }));
      if (font) localStorage.setItem(quranFontKey, font);
    },
    { layoutKey, quranFontKey, font },
  );
  await page.goto(`/${hash}`);
  await expect(page.locator('.mushaf-text .plain-ayah')).toHaveCount(ayahs, { timeout: 30_000 });
  await page.evaluate(() => document.fonts.ready);
}

type Box = { top: number; bottom: number; left: number; right: number };

/**
 * The laid-out lines of the continuous text (word and marker boxes grouped by line), plus the
 * paragraph's content box, measured in the page.
 */
async function measureLines(page: Page, firstAyah: number, lastAyah: number) {
  return page.evaluate(
    ({ firstAyah, lastAyah }) => {
      const text = document.querySelector<HTMLElement>('.mushaf-text')!;
      const style = getComputedStyle(text);
      const outer = text.getBoundingClientRect();
      const content = {
        left: outer.left + parseFloat(style.paddingLeft),
        right: outer.right - parseFloat(style.paddingRight),
      };
      const pieces: (Box & { ayah: number; kind: string })[] = [];
      for (let ayah = firstAyah; ayah <= lastAyah; ayah += 1) {
        const span = document.getElementById(`ayah-${ayah}`)!;
        for (const element of span.querySelectorAll<HTMLElement>('.plain-word, .ayah-end')) {
          const box = element.getBoundingClientRect();
          pieces.push({
            ayah,
            kind: element.classList.contains('ayah-end') ? 'end' : 'word',
            top: box.top,
            bottom: box.bottom,
            left: box.left,
            right: box.right,
          });
        }
      }
      // Pieces on one line have their middles within half a line height of each other.
      const lineHeight = parseFloat(style.lineHeight);
      const middle = (box: Box) => (box.top + box.bottom) / 2;
      const lines: (typeof pieces)[] = [];
      for (const piece of pieces) {
        const line = lines.at(-1);
        if (line && Math.abs(middle(piece) - middle(line[0]!)) < lineHeight / 2) line.push(piece);
        else lines.push([piece]);
      }
      return { content, lines };
    },
    { firstAyah, lastAyah },
  );
}

async function expectContinuous(page: Page, firstAyah: number, lastAyah: number, chapterEnd: boolean) {
  const { content, lines } = await measureLines(page, firstAyah, lastAyah);
  expect(lines.length).toBeGreaterThan(2);
  // Every ayah marker is on the line of its ayah's last word (never alone at a line start).
  for (const line of lines) {
    expect(line[0]!.kind, `a line starts with the marker of ayah ${line[0]!.ayah}`).toBe('word');
  }
  // Every full line is justified edge to edge: no space is left at the end of an ayah. The last
  // measured line may be the chapter's last (start-aligned) or cut by the measured range.
  for (const line of lines.slice(1, chapterEnd ? -1 : -2)) {
    const right = Math.max(...line.map((piece) => piece.right));
    const left = Math.min(...line.map((piece) => piece.left));
    expect(right, `line of ayah ${line[0]!.ayah} starts at the right edge`).toBeGreaterThan(
      content.right - 6,
    );
    expect(left, `line of ayah ${line[0]!.ayah} reaches the left edge`).toBeLessThan(
      content.left + 6,
    );
  }
  return lines;
}

test('Al-Fatihah flows continuously: the next ayah starts on the line of the previous marker', async ({
  page,
}) => {
  await openMushaf(page, '#surah=1', 7);
  await expect(page.locator('.mushaf-text')).toHaveCSS('text-align', 'justify');
  const lines = await expectContinuous(page, 1, 7, true);
  // Ayahs are not separate rows: an ayah continues on the line of the previous ayah's marker
  // unless that marker ended a full line (at 390px: 3 → 4, 4 → 5, 5 → 6 and 6 → 7).
  const sharesLine = (ayah: number) =>
    lines
      .find((entry) => entry.some((piece) => piece.ayah === ayah && piece.kind === 'end'))
      ?.some((piece) => piece.ayah === ayah + 1 && piece.kind === 'word');
  expect([3, 4, 5, 6].map(sharesLine)).toEqual([true, true, true, true]);
});

test('Al-Baqarah flows continuously and still jumps to an ayah', async ({ page }) => {
  await openMushaf(page, '#surah=2', 286);
  await expectContinuous(page, 1, 30, false);
  await page.goto('/#surah=2&ayah=255');
  await expect(page.locator('#ayah-255')).toBeInViewport();
  await expectContinuous(page, 250, 258, false);
});

test('Al Qalam: pause marks keep clear of the next word and markers stay with their ayah', async ({
  page,
}) => {
  await openMushaf(page, '#surah=3', 200, 'al-qalam-quran-majeed');
  await expect(page.locator('.mushaf-text')).toHaveCSS('font-family', /AlQalam|Al Qalam/i);
  await expectContinuous(page, 1, 12, false);
  // 3:2 «هُوَۙ الۡحَىُّ»: the ۙ is drawn beyond its word; the gap after it is wide enough.
  const [first, second] = await Promise.all(
    ['3:2:5', '3:2:6'].map((id) => page.locator(`[data-word-id="${id}"]`).boundingBox()),
  );
  expect(await page.locator('[data-word-id="3:2:5"]').textContent()).toMatch(/ۙ$/);
  const fontSize = parseFloat(
    await page.locator('.mushaf-text').evaluate((element) => getComputedStyle(element).fontSize),
  );
  // Right to left: the gap runs from the end (left) of word 5 to the start (right) of word 6.
  if (first && second && Math.abs(first.y - second.y) < 5) {
    expect(first.x - (second.x + second.width)).toBeGreaterThan(0.55 * fontSize);
  }
});

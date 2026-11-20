import { expect, test, type Page } from '@playwright/test';

// Desktop study layout: the splitter between the Quran reading column and the word panel.
// At 1440px the page shell content is 1224px wide; with the 28px gap 1196px is shared.
const storageKey = 'quran-grammar.split-width';
const minDetail = 280;
const minReading = 420;

test.use({ storageState: { cookies: [], origins: [] }, viewport: { width: 1440, height: 1000 } });

const splitter = (page: Page, name = 'Resize panels') =>
  page.getByRole('separator', { name, exact: true });

async function loadStudy(page: Page, hash = '') {
  await page.goto(`/${hash}`);
  await expect(page.locator('.quran-word').first()).toBeVisible();
  await expect(splitter(page)).toBeVisible();
}

async function widths(page: Page) {
  return page.evaluate(() => {
    const width = (selector: string) => document.querySelector(selector)!.getBoundingClientRect();
    const reading = width('.reading-column');
    const detail = width('.word-detail');
    const handle = width('.split-handle');
    const layout = document.querySelector('.study-layout')!;
    const gap = parseFloat(getComputedStyle(layout).columnGap);
    return {
      reading: reading.width,
      detail: detail.width,
      available: layout.clientWidth - gap,
      readingLeft: reading.left,
      detailRight: detail.right,
      handleCenter: handle.left + handle.width / 2,
      handleWidth: handle.width,
      gapCenter:
        detail.right < reading.left
          ? (detail.right + reading.left) / 2
          : (reading.right + detail.left) / 2,
    };
  });
}

/** Drags the splitter grip (which stays in the viewport) horizontally by `dx` pixels. */
async function dragBy(page: Page, dx: number, steps = 8) {
  const grip = (await page.locator('.split-grip').boundingBox())!;
  const x = grip.x + grip.width / 2;
  const y = grip.y + grip.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + dx, y, { steps });
  await page.mouse.up();
  return x + dx;
}

test('dragging the splitter resizes both columns and clamps at the minimums', async ({ page }) => {
  await loadStudy(page);
  const separator = splitter(page);
  await expect(separator).toHaveAttribute('aria-orientation', 'vertical');
  await expect(separator).toHaveAttribute('aria-controls', 'word-detail-panel');
  await expect(separator).toHaveCSS('cursor', 'col-resize');
  const before = await widths(page);
  // Default layout is unchanged: 390px panel, splitter centred in the gap and ≥12px wide.
  expect(Math.round(before.detail)).toBe(390);
  expect(before.handleWidth).toBeGreaterThanOrEqual(12);
  expect(Math.abs(before.handleCenter - before.gapCenter)).toBeLessThan(1);
  await expect(separator).toHaveAttribute(
    'aria-valuenow',
    String(Math.round((390 / before.available) * 100)),
  );
  await expect(separator).toHaveAttribute(
    'aria-valuemin',
    String(Math.round((minDetail / before.available) * 100)),
  );
  await expect(separator).toHaveAttribute(
    'aria-valuemax',
    String(Math.round(((before.available - minReading) / before.available) * 100)),
  );

  // The word panel is at the inline end of the RTL layout (left); dragging right widens it.
  const pointer = await dragBy(page, 150);
  const wider = await widths(page);
  expect(wider.detail).toBeCloseTo(before.detail + 150, 0);
  expect(wider.reading).toBeCloseTo(before.reading - 150, 0);
  expect(Math.abs(wider.handleCenter - pointer)).toBeLessThan(2);
  await expect(separator).toHaveAttribute(
    'aria-valuenow',
    String(Math.round((wider.detail / wider.available) * 100)),
  );

  await dragBy(page, -260);
  const narrower = await widths(page);
  expect(narrower.detail).toBeCloseTo(wider.detail - 260, 0);

  // Far past either edge, each column keeps its minimum width.
  await dragBy(page, -800);
  expect(Math.round((await widths(page)).detail)).toBe(minDetail);
  await expect(separator).toHaveAttribute('aria-valuenow', await separator.getAttribute('aria-valuemin') as string);
  await dragBy(page, 1400, 12);
  expect(Math.round((await widths(page)).reading)).toBe(minReading);
  await expect(separator).toHaveAttribute('aria-valuenow', await separator.getAttribute('aria-valuemax') as string);
  await expect(page.locator('.word-detail')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.classList.contains('split-dragging'))).toBe(false);
});

test('the splitter is keyboard operable and Enter or double-click resets it', async ({ page }) => {
  await loadStudy(page);
  const separator = splitter(page);
  await separator.focus();
  const start = await widths(page);
  const step = start.available * 0.02;

  await page.keyboard.press('ArrowRight');
  expect((await widths(page)).detail).toBeCloseTo(start.detail + step, 0);
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  expect((await widths(page)).detail).toBeCloseTo(start.detail - step, 0);
  await page.keyboard.press('Shift+ArrowRight');
  expect((await widths(page)).detail).toBeCloseTo(start.detail - step + start.available * 0.1, 0);

  await page.keyboard.press('Home');
  expect(Math.round((await widths(page)).detail)).toBe(minDetail);
  await page.keyboard.press('ArrowLeft');
  expect(Math.round((await widths(page)).detail)).toBe(minDetail);
  await page.keyboard.press('End');
  expect(Math.round((await widths(page)).reading)).toBe(minReading);
  await expect(separator).toBeFocused();

  await page.keyboard.press('Enter');
  expect(Math.round((await widths(page)).detail)).toBe(390);
  expect(await page.evaluate((key) => localStorage.getItem(key), storageKey)).toBeNull();

  await page.keyboard.press('Shift+ArrowRight');
  expect(Math.round((await widths(page)).detail)).toBeGreaterThan(390);
  await page.locator('.split-grip').dblclick();
  expect(Math.round((await widths(page)).detail)).toBe(390);
});

test('the chosen width persists across reloads and is re-clamped on window resize', async ({
  page,
}) => {
  await loadStudy(page);
  await dragBy(page, 200);
  const chosen = await widths(page);
  const stored = Number(await page.evaluate((key) => localStorage.getItem(key), storageKey));
  expect(stored).toBeCloseTo(chosen.detail / chosen.available, 3);

  await page.reload();
  await expect(splitter(page)).toBeVisible();
  const restored = await widths(page);
  expect(restored.detail).toBeCloseTo(chosen.detail, 0);

  // A narrower window keeps the stored fraction but never squeezes the reading column.
  await dragBy(page, 1400, 12);
  await page.setViewportSize({ width: 1100, height: 900 });
  await expect
    .poll(async () => Math.round((await widths(page)).reading))
    .toBe(minReading);
  const narrow = await widths(page);
  await expect(splitter(page)).toHaveAttribute(
    'aria-valuenow',
    String(Math.round((narrow.detail / narrow.available) * 100)),
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

  // Mobile keeps the bottom sheet: no splitter, single column.
  await page.setViewportSize({ width: 900, height: 900 });
  await expect(page.getByRole('separator')).toHaveCount(0);
  await expect(page.locator('.word-detail')).toHaveCount(0);

  // Corrupt or unavailable storage falls back to the default width.
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.evaluate((key) => localStorage.setItem(key, 'nonsense'), storageKey);
  await page.reload();
  await expect(splitter(page)).toBeVisible();
  expect(Math.round((await widths(page)).detail)).toBe(390);
});

test('the splitter follows the pointer in the Urdu interface and the plain-text layout', async ({
  page,
}) => {
  await loadStudy(page);
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await page.getByRole('button', { name: 'اردو', exact: true }).click();
  // Plain Quran text instead of word-by-word grammar blocks.
  await page.locator('input[data-layout="grammar"]').uncheck();
  await page.locator('.bottom-nav button').first().click();
  await expect(page.locator('.plain-word').first()).toBeVisible();
  await expect(page.locator('.quran-word')).toHaveCount(0);
  const separator = splitter(page, 'پینلز کا سائز بدلیں');
  await expect(separator).toBeVisible();
  await expect(separator).toHaveAttribute('lang', 'ur');

  const before = await widths(page);
  const pointer = await dragBy(page, 120);
  const after = await widths(page);
  expect(Math.abs(after.handleCenter - pointer)).toBeLessThan(2);
  expect(after.detail).toBeCloseTo(before.detail + 120, 0);

  await separator.focus();
  await page.keyboard.press('ArrowLeft');
  const left = await widths(page);
  expect(left.handleCenter).toBeLessThan(after.handleCenter);
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  expect((await widths(page)).handleCenter).toBeGreaterThan(after.handleCenter);
});

test('word selection and ayah jumps keep working with a resized panel', async ({ page }) => {
  await page.goto('/#surah=18');
  await expect(page.locator('.quran-word')).toHaveCount(1579, { timeout: 20000 });
  await dragBy(page, -100);
  const resized = await widths(page);
  await page.locator('[data-word-id="18:3:1"]').click();
  await expect(page.locator('[data-word-id="18:3:1"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.word-detail')).toBeVisible();
  await page.evaluate(() => {
    location.hash = 'surah=18&ayah=60';
  });
  await expect(page.locator('#ayah-60')).toBeInViewport();
  await expect(page.locator('[data-word-id="18:60:1"]')).toHaveAttribute('aria-pressed', 'true');
  expect((await widths(page)).detail).toBeCloseTo(resized.detail, 0);
  // The grip stays reachable in the viewport while reading further down.
  await expect(page.locator('.split-grip')).toBeInViewport();
});

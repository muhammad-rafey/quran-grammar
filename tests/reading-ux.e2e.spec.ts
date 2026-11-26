import { expect, test, type Page } from '@playwright/test';

// Reading aids: keyboard word stepping, sticky ayah context, deep-link scrolling and the word panel.
test.use({ storageState: { cookies: [], origins: [] } });

const word = (page: Page, id: string) => page.locator(`#reading [data-word-id="${id}"]`);
const panel = (page: Page) => page.locator('.word-detail');
const ayahChip = (page: Page) => page.getByRole('button', { name: 'Select ayah', exact: true });

async function open(page: Page, hash: string, words: number) {
  await page.goto(`/${hash}`);
  await expect(page.locator('.quran-word')).toHaveCount(words, { timeout: 20_000 });
}

test('arrow keys step through words in reading order and keep focus on the selected word', async ({
  page,
}) => {
  await open(page, '', 29);
  await word(page, '1:1:4').click();
  await expect(panel(page).locator('.word-location')).toHaveText('1 : 4');
  // Quranic text runs right to left: ← is the next word, → the previous one.
  await page.keyboard.press('ArrowLeft');
  await expect(word(page, '1:2:1')).toHaveAttribute('aria-pressed', 'true');
  await expect(word(page, '1:2:1')).toBeFocused();
  await expect(ayahChip(page)).toHaveAttribute('data-ayah', '2');
  await expect(page).toHaveURL(/word=1%3A2%3A1/);
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await expect(word(page, '1:1:3')).toHaveAttribute('aria-pressed', 'true');
  await expect(word(page, '1:1:3')).toBeFocused();
  // The first word stays put at the start of the chapter.
  await word(page, '1:1:1').click();
  await page.keyboard.press('ArrowRight');
  await expect(word(page, '1:1:1')).toHaveAttribute('aria-pressed', 'true');
  // Keys typed into a field or a picker dialog are left alone.
  await ayahChip(page).click();
  const search = page.getByRole('textbox', { name: 'Go to ayah number', exact: true });
  await search.fill('3');
  await search.press('ArrowLeft');
  await expect(word(page, '1:1:1')).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Escape');
  // The panel buttons advertise the shortcuts.
  await expect(panel(page).getByRole('button', { name: 'Next word', exact: true })).toHaveAttribute(
    'aria-keyshortcuts',
    'ArrowLeft',
  );
  await expect(
    panel(page).getByRole('button', { name: 'Previous word', exact: true }),
  ).toHaveAttribute('aria-keyshortcuts', 'ArrowRight');
});

test('Al-Baqarah: deep links scroll to the word, the toolbar stays in view and follows the ayah', async ({
  page,
}) => {
  test.setTimeout(60_000);
  await open(page, '#word=2%3A100%3A3', 6116);
  await expect(word(page, '2:100:3')).toHaveAttribute('aria-pressed', 'true');
  await expect(word(page, '2:100:3')).toBeInViewport();
  await expect(ayahChip(page)).toHaveAttribute('data-ayah', '100');
  // Next in the side panel keeps the reading column on the selected word.
  for (let step = 0; step < 40; step += 1)
    await panel(page).getByRole('button', { name: 'Next word', exact: true }).click();
  const target = (await panel(page).locator('.word-location').textContent())!.replace(/\s/g, '');
  const [ayah, position] = target.split(':');
  await expect(word(page, `2:${ayah}:${position}`)).toHaveAttribute('aria-pressed', 'true');
  await expect(word(page, `2:${ayah}:${position}`)).toBeInViewport();
  // Scrolling away: the sticky toolbar stays on screen and names an ayah that is on screen.
  await page.mouse.move(700, 500);
  await page.mouse.wheel(0, 6000);
  await expect(page.locator('.lesson-toolbar')).toBeInViewport();
  await expect
    .poll(async () => Number(await ayahChip(page).getAttribute('data-ayah')))
    .toBeGreaterThan(Number(ayah));
  const shown = await ayahChip(page).getAttribute('data-ayah');
  await expect(page.locator(`#ayah-${shown}`)).toBeInViewport();
  // The word panel sits below the sticky toolbar, never under it.
  const toolbar = (await page.locator('.study-sticky').boundingBox())!;
  const detail = (await panel(page).boundingBox())!;
  expect(detail.y).toBeGreaterThanOrEqual(toolbar.y + toolbar.height);
  // Filters opened while scrolled stay in view.
  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  await expect(page.locator('#filter-panel')).toBeInViewport();
});

test('a common root lists a few related words first, then all on request', async ({ page }) => {
  test.setTimeout(60_000);
  await open(page, '#word=2%3A7%3A2', 6116);
  const section = panel(page).locator('.detail-section', { hasText: 'Words with the same root' });
  const related = section.locator('[data-related-word]');
  await expect(related).toHaveCount(12);
  const total = Number((await section.locator('h3 small').textContent())!.trim());
  expect(total).toBeGreaterThan(12);
  await section.getByRole('button', { name: `Show all (${total})`, exact: true }).click();
  await expect(related).toHaveCount(total);
  await panel(page).getByRole('button', { name: 'Next word', exact: true }).click();
  await expect(panel(page).locator('[data-related-word]')).not.toHaveCount(total);
});

test('the word panel leads with sentence role and word formation', async ({ page }) => {
  await open(page, '#word=1%3A2%3A1', 29);
  const facts = panel(page).locator('.grammar-summary h3');
  await expect(facts).toHaveText(['Sentence role', 'Word formation']);
  const summary = (await panel(page).locator('.grammar-summary').boundingBox())!;
  const parts = (await panel(page).getByRole('heading', { name: 'Word parts' }).boundingBox())!;
  expect(summary.y).toBeLessThan(parts.y);
});

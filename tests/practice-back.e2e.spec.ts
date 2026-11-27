import { expect, test, type Page } from '@playwright/test';

// The practice flow's Back: the in-app Back button and the browser's Back both return to the
// previous practice view (apps/web/src/practice-history.ts), without touching the #word= links.

async function loadStudy(page: Page, hash = '') {
  await page.goto(`/${hash}`);
  await expect(page.locator('.quran-word')).toHaveCount(29);
}

async function openPracticeGrammar(page: Page, nav = 'Practice Grammar') {
  await page.locator('.bottom-nav').getByRole('button', { name: nav, exact: true }).click();
  await expect(page.locator('.practice-view')).toBeVisible();
}

const quiz = (page: Page) => page.locator('.practice-card');
const topicList = (page: Page) => page.locator('.topic-list');
const topicDialog = (page: Page) => page.locator('dialog.topic-dialog[open]');
const backButton = (page: Page, name = 'Back') =>
  quiz(page).getByRole('button', { name, exact: true }).first();

test('the quiz Back button is prominent, at the top and keyboard accessible', async ({ page }) => {
  await loadStudy(page);
  await openPracticeGrammar(page);
  await page.locator('[data-practice="fatihah"]').click();
  await expect(quiz(page)).toBeVisible();
  const back = backButton(page);
  await expect(back).toBeInViewport();
  const box = (await back.boundingBox())!;
  const card = (await quiz(page).boundingBox())!;
  expect(box.height).toBeGreaterThanOrEqual(44);
  // First control of the card, above the quiz header.
  expect(box.y).toBeLessThan((await quiz(page).locator('.practice-header').boundingBox())!.y);
  expect(box.y - card.y).toBeLessThan(40);
  await expect(back.locator('svg')).toHaveCount(1);
  // Focus starts on the question; Shift+Tab reaches Back, Enter goes back to the list.
  await expect(quiz(page).locator('.practice-prompt')).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(back).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(quiz(page)).toHaveCount(0);
  await expect(page.locator('[data-practice="fatihah"]')).toBeFocused();
});

test('in-app Back and browser Back both return from a quiz to the topic list', async ({ page }) => {
  await loadStudy(page, '#word=1:1:3');
  await openPracticeGrammar(page);
  const first = page.locator('.topic-item').first();
  const topicId = (await first.getAttribute('data-topic'))!;

  // In-app Back.
  await first.locator('.topic-start').click();
  await expect(quiz(page)).toBeVisible();
  await backButton(page).click();
  await expect(quiz(page)).toHaveCount(0);
  await expect(topicList(page)).toBeVisible();
  await expect(page.locator(`[data-practice="${topicId}"]`)).toBeFocused();

  // Browser Back, then Forward reopens the quiz and Back leaves it again.
  await first.locator('.topic-start').click();
  await expect(quiz(page)).toBeVisible();
  await page.goBack();
  await expect(quiz(page)).toHaveCount(0);
  await expect(topicList(page)).toBeVisible();
  await expect(page.locator('.bottom-nav button.active')).toHaveText('Practice Grammar');
  await page.goForward();
  await expect(quiz(page)).toBeVisible();
  await page.goBack();
  await expect(topicList(page)).toBeVisible();

  // The same for the Al-Fatihah quick practice; the deep-link hash is untouched throughout.
  await page.locator('[data-practice="fatihah"]').click();
  await expect(page.getByRole('region', { name: 'Quick practice', exact: true })).toBeVisible();
  await page.goBack();
  await expect(page.locator('[data-practice="fatihah"]')).toBeVisible();
  await expect(page).toHaveURL(/#word=1:1:3$/);
});

test('Back from a quiz opened in a topic dialog returns to the dialog, then to the list', async ({
  page,
}) => {
  await loadStudy(page);
  await openPracticeGrammar(page);
  const open = page.locator('.topic-item').first().locator('.topic-open');
  await open.click();
  await expect(topicDialog(page)).toBeVisible();
  const title = (await topicDialog(page).locator('.topic-english').textContent())!;
  const close = topicDialog(page).getByRole('button', { name: 'Close', exact: true });
  expect((await close.boundingBox())!.height).toBeGreaterThanOrEqual(44);

  // Browser Back closes the dialog like its Close button.
  await page.goBack();
  await expect(topicDialog(page)).toHaveCount(0);
  await expect(open).toBeFocused();

  // Dialog → quiz → browser Back → dialog → in-app Back → dialog → Close → list.
  await open.click();
  await topicDialog(page).getByRole('button', { name: 'Practice this topic', exact: true }).click();
  await expect(topicDialog(page)).toHaveCount(0);
  await expect(page.getByRole('region', { name: title, exact: true })).toBeVisible();
  await page.goBack();
  await expect(topicDialog(page).locator('.topic-english')).toHaveText(title);
  await topicDialog(page).getByRole('button', { name: 'Practice this topic', exact: true }).click();
  await expect(quiz(page)).toBeVisible();
  await backButton(page).click();
  await expect(topicDialog(page).locator('.topic-english')).toHaveText(title);
  await topicDialog(page).getByRole('button', { name: 'Close', exact: true }).click();
  await expect(topicDialog(page)).toHaveCount(0);
  await expect(topicList(page)).toBeVisible();
  await expect(quiz(page)).toHaveCount(0);
});

test('the Urdu interface shows واپس with a right-pointing arrow and the same Back', async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.setItem('quran-grammar.ui-language', 'ur'));
  await page.setViewportSize({ width: 390, height: 844 });
  await loadStudy(page);
  await openPracticeGrammar(page, 'گرامر کی مشق');
  await page.locator('[data-practice="fatihah"]').click();
  const back = backButton(page, 'واپس');
  await expect(back).toBeInViewport();
  await expect(back).toHaveAttribute('dir', 'rtl');
  await expect(back.locator('svg')).toHaveClass(/arrow-right/);
  // In RTL the button sits at the right edge of the card.
  const box = (await back.boundingBox())!;
  const card = (await quiz(page).boundingBox())!;
  expect(card.x + card.width - (box.x + box.width)).toBeLessThan(40);
  await back.click();
  await expect(quiz(page)).toHaveCount(0);
  await page.locator('[data-practice="fatihah"]').click();
  await page.goBack();
  await expect(quiz(page)).toHaveCount(0);
  await expect(page.locator('[data-practice="fatihah"]')).toBeVisible();
});

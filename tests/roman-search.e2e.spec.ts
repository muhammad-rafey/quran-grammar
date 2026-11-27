import { expect, test, type Page } from '@playwright/test';

// Roman Urdu (and plain English) in every search bar: grammar topics, the Surah list and the
// word search API.

async function loadStudy(page: Page) {
  await page.goto('/');
  await expect(page.locator('.quran-word')).toHaveCount(29);
}

async function openPracticeGrammar(page: Page) {
  await page.locator('.bottom-nav').getByRole('button', { name: 'Practice Grammar', exact: true }).click();
  await expect(page.locator('.practice-view')).toBeVisible();
}

test('topic search finds مرکبِ اضافی from Roman Urdu and opens it', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await loadStudy(page);
  await openPracticeGrammar(page);
  const search = page.getByRole('searchbox', { name: 'Search topics' });
  await expect(search).toHaveAttribute('placeholder', 'Search topics in English, Urdu or Roman Urdu');
  const items = page.locator('.topic-item');
  await expect(items.first()).toBeVisible();

  for (const query of ['muraqab e izafi', 'murakkab-e-izafi', 'murakab izafi', 'possessive']) {
    await search.fill(query);
    await expect(items.first(), query).toHaveAttribute('data-topic', 'idafa');
    await expect(items.first().locator('strong[lang="ur"]')).toHaveText('مرکبِ اضافی');
  }
  for (const [query, title] of [
    ['fel mazi', 'فعلِ ماضی'],
    ['ism e ishara', 'اسمِ اشارہ'],
    ['jar o majrur', 'حرفِ جر اور جار و مجرور'],
    ['zameer', 'ضمیرِ متصل'],
  ] as const) {
    await search.fill(query);
    await expect(items.first().locator('strong[lang="ur"]'), query).toHaveText(title);
  }

  // Opening the found topic shows its dialog; practising it starts the quiz.
  await search.fill('muraqab e izafi');
  await expect(items).toHaveCount(1);
  await items.first().locator('.topic-open').click();
  const dialog = page.locator('dialog.topic-dialog[open]');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('#topic-title')).toHaveText('مرکبِ اضافی');
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await items.first().locator('.topic-start').click();
  await expect(page.locator('.practice-card')).toBeVisible();
  expect(errors).toEqual([]);
});

test('topic search hint is translated in the Urdu interface', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('quran-grammar.ui-language', 'ur'));
  await loadStudy(page);
  await page.locator('.bottom-nav button').nth(1).click();
  const search = page.getByRole('searchbox', { name: 'موضوعات تلاش کریں' });
  await expect(search).toHaveAttribute('placeholder', 'موضوعات اردو، رومن اردو یا انگریزی میں تلاش کریں');
  await search.fill('muraqab e izafi');
  await expect(page.locator('.topic-item').first()).toHaveAttribute('data-topic', 'idafa');
});

test('the surah list accepts Roman spellings of the Arabic and Urdu names', async ({ page }) => {
  await loadStudy(page);
  await page.getByRole('button', { name: 'Select surah', exact: true }).click();
  const catalog = page.getByRole('dialog', { name: 'Select surah', exact: true });
  const search = catalog.getByRole('searchbox', { name: 'Search surahs by name or number' });
  const rows = catalog.locator('[data-surah]');
  for (const [query, surah] of [
    ['suratul mulk', 67],
    ['surat un nisa', 4],
    ['kausr', 108],
    ['al kahaf', 18],
  ] as const) {
    await search.fill(query);
    await expect(rows.first(), query).toHaveAttribute('data-surah', String(surah));
  }
  await search.press('Enter');
  await expect(catalog).toHaveCount(0);
  await expect(page.locator('[data-word-id="18:1:1"]')).toBeVisible();
});

test('word search API finds كِتَاب words in Al-Baqarah from "kitab"', async ({ request }) => {
  const response = await request.get('/api/v1/search?q=kitab&surah=2');
  expect(response.ok()).toBe(true);
  const data = (await response.json()) as { total: number; words: { arabic: string }[] };
  expect(data.total).toBeGreaterThanOrEqual(40);
  expect(data.words.some((word) => word.arabic === 'ٱلْكِتَـٰبُ')).toBe(true);
  // Arabic script still works as before.
  const arabic = await (await request.get(`/api/v1/search?q=${encodeURIComponent('كتاب')}&surah=2`)).json();
  expect(arabic.total).toBeGreaterThan(0);
});

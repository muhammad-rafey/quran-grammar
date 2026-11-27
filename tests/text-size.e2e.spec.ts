import { expect, test, type Locator, type Page } from '@playwright/test';

// Settings → Text size: independent − / + steps (85%-175%) for the Quran text and the ayah
// translations, a reset and a live preview, persisted locally.
test.use({ storageState: { cookies: [], origins: [] } });

const textSizeKey = 'quran-grammar.text-size';
const layoutKey = 'quran-grammar.reading-layout';

const nav = (page: Page, name: string) =>
  page.locator('.bottom-nav').getByRole('button', { name, exact: true }).click();
const fontSize = (locator: Locator) =>
  locator.first().evaluate((element) => parseFloat(getComputedStyle(element).fontSize));
const lineHeight = (locator: Locator) =>
  locator.first().evaluate((element) => parseFloat(getComputedStyle(element).lineHeight));
const card = (page: Page) => page.locator('.text-size-settings');
const row = (page: Page, role: 'quran' | 'translation') =>
  card(page).locator(`[data-text-size="${role}"]`);
const step = (page: Page, role: 'quran' | 'translation', direction: 'Smaller' | 'Larger') =>
  page.getByRole('button', {
    name: `${direction}: ${role === 'quran' ? 'Quran text size' : 'Translation text size'}`,
    exact: true,
  });

async function loadStudy(page: Page, hash = '') {
  await page.goto(`/${hash}`);
  await expect(page.locator('.quran-word').first()).toBeVisible({ timeout: 20_000 });
  await page.evaluate(() => document.fonts.ready);
}

async function expectNoOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}

test('Quran and translation sizes step, preview live, persist and clamp at 85% and 175%', async ({
  page,
}) => {
  await loadStudy(page);
  const word = page.locator('.quran-word .arabic');
  const translation = page.locator('.ayah-translation');
  const title = page.locator('#detail-title');
  const base = {
    word: await fontSize(word),
    wordLine: await lineHeight(word),
    translation: await fontSize(translation),
    title: await fontSize(title),
  };
  const firstTranslation = (await translation.first().textContent())!;

  await nav(page, 'Settings');
  await expect(page.getByRole('heading', { name: 'Text size', exact: true })).toBeVisible();
  await expect(row(page, 'quran').locator('output')).toHaveText('100%');
  await expect(row(page, 'translation').locator('output')).toHaveText('100%');
  await expect(card(page).getByRole('button', { name: 'Reset to 100%' })).toBeDisabled();
  // The preview is the chapter's first ayah in the Quran font and its translation.
  const previewArabic = card(page).locator('.text-size-preview-arabic');
  const previewTranslation = card(page).locator('.text-size-preview-translation');
  await expect(previewArabic).toContainText('بِسْمِ');
  await expect(previewTranslation).toHaveText(firstTranslation);
  const preview = { arabic: await fontSize(previewArabic), translation: await fontSize(previewTranslation) };
  expect(preview.arabic).toBeCloseTo(base.word, 1);

  // Quran larger, translation smaller: each changes only its own text.
  await step(page, 'quran', 'Larger').click();
  await expect(row(page, 'quran').locator('output')).toHaveText('115%');
  expect(await fontSize(previewArabic)).toBeCloseTo(preview.arabic * 1.15, 1);
  expect(await fontSize(previewTranslation)).toBeCloseTo(preview.translation, 1);
  await step(page, 'translation', 'Smaller').click();
  await expect(row(page, 'translation').locator('output')).toHaveText('85%');
  expect(await fontSize(previewTranslation)).toBeCloseTo(preview.translation * 0.85, 1);
  await expect(card(page).getByRole('button', { name: 'Reset to 100%' })).toBeEnabled();

  await nav(page, 'Study');
  expect(await fontSize(word)).toBeCloseTo(base.word * 1.15, 1);
  // The line height is a multiple of the font size: it grows with the text (marks never clip).
  expect(await lineHeight(word)).toBeCloseTo(base.wordLine * 1.15, 0);
  expect(await fontSize(translation)).toBeCloseTo(base.translation * 0.85, 1);
  expect(await fontSize(title)).toBeCloseTo(base.title * 1.15, 1);

  // Persisted locally and applied on reload.
  expect(await page.evaluate((key) => localStorage.getItem(key), textSizeKey)).toBe(
    JSON.stringify({ quran: 1.15, translation: 0.85 }),
  );
  await loadStudy(page);
  expect(await fontSize(word)).toBeCloseTo(base.word * 1.15, 1);
  expect(await fontSize(translation)).toBeCloseTo(base.translation * 0.85, 1);

  // Clamped: + is disabled at 175%, − at 85%.
  await nav(page, 'Settings');
  await expect(row(page, 'quran').locator('output')).toHaveText('115%');
  for (const expected of ['130%', '150%', '175%']) {
    await step(page, 'quran', 'Larger').click();
    await expect(row(page, 'quran').locator('output')).toHaveText(expected);
  }
  await expect(step(page, 'quran', 'Larger')).toBeDisabled();
  await expect(step(page, 'quran', 'Smaller')).toBeEnabled();
  await expect(step(page, 'translation', 'Smaller')).toBeDisabled();
  expect(await fontSize(previewArabic)).toBeCloseTo(preview.arabic * 1.75, 1);
  await nav(page, 'Study');
  expect(await fontSize(word)).toBeCloseTo(base.word * 1.75, 1);
  await expectNoOverflow(page);

  // Keyboard: the buttons are reachable and operable without a pointer.
  await nav(page, 'Settings');
  await step(page, 'quran', 'Smaller').focus();
  await page.keyboard.press('Enter');
  await expect(row(page, 'quran').locator('output')).toHaveText('150%');
  await page.keyboard.press('Tab');
  await expect(step(page, 'quran', 'Larger')).toBeFocused();

  // Reset returns both sizes to 100%.
  await card(page).getByRole('button', { name: 'Reset to 100%' }).click();
  await expect(row(page, 'quran').locator('output')).toHaveText('100%');
  await expect(row(page, 'translation').locator('output')).toHaveText('100%');
  await expect(card(page).getByRole('button', { name: 'Reset to 100%' })).toBeDisabled();
  await nav(page, 'Study');
  expect(await fontSize(word)).toBeCloseTo(base.word, 1);
  expect(await fontSize(translation)).toBeCloseTo(base.translation, 1);
});

test('the Urdu interface labels the controls and shows Urdu digits', async ({ page }) => {
  await page.addInitScript((key) => localStorage.setItem(key, JSON.stringify({ quran: 1.3, translation: 1 })), textSizeKey);
  await page.addInitScript(() => localStorage.setItem('quran-grammar.ui-language', 'ur'));
  await loadStudy(page);
  await nav(page, 'ترتیبات');
  await expect(page.getByRole('heading', { name: 'متن کا سائز', exact: true })).toBeVisible();
  await expect(row(page, 'quran').locator('output')).toHaveText('۱۳۰٪');
  await expect(page.getByRole('button', { name: 'بڑا کریں: قرآنی متن کا سائز' })).toBeEnabled();
});

test('topic examples, practice options and mushaf text follow the Quran text size', async ({
  page,
}) => {
  await loadStudy(page);
  await page.locator('.word-detail .grammar-rule[data-rule="genitive"]').click();
  const dialog = page.locator('dialog.topic-dialog[open]');
  const base = {
    ayah: await fontSize(dialog.locator('.topic-ayah')),
    more: await fontSize(dialog.locator('.topic-more .arabic')),
    translation: await fontSize(dialog.locator('.topic-translation')),
  };
  await dialog.getByRole('button', { name: 'Close', exact: true }).click();
  await nav(page, 'Practice Grammar');
  await page.locator('[data-practice="fatihah"]').click();
  const option = page.locator('.practice-option[lang="ar"]');
  await expect(option.first()).toBeVisible();
  const optionBase = await fontSize(option);

  await page.evaluate(
    (key) => localStorage.setItem(key, JSON.stringify({ quran: 1.5, translation: 1.3 })),
    textSizeKey,
  );
  await loadStudy(page);
  await page.locator('.word-detail .grammar-rule[data-rule="genitive"]').click();
  expect(await fontSize(dialog.locator('.topic-ayah'))).toBeCloseTo(base.ayah * 1.5, 1);
  expect(await fontSize(dialog.locator('.topic-more .arabic'))).toBeCloseTo(base.more * 1.5, 1);
  expect(await fontSize(dialog.locator('.topic-translation'))).toBeCloseTo(base.translation * 1.3, 1);
  await dialog.getByRole('button', { name: 'Close', exact: true }).click();
  await nav(page, 'Practice Grammar');
  await page.locator('[data-practice="fatihah"]').click();
  expect(await fontSize(option)).toBeCloseTo(optionBase * 1.5, 1);

  // Continuous (mushaf) text at the largest size: scaled, justified, nothing wider than the page.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(
    ({ layoutKey, textSizeKey }) => {
      localStorage.setItem(layoutKey, JSON.stringify({ grammar: false, translation: false }));
      localStorage.setItem(textSizeKey, JSON.stringify({ quran: 1.75, translation: 1 }));
      localStorage.setItem('quran-grammar.quran-font', 'al-qalam-quran-majeed');
    },
    { layoutKey, textSizeKey },
  );
  await page.goto('about:blank');
  await page.goto('/#surah=1');
  const mushaf = page.locator('.mushaf-text');
  await expect(mushaf.locator('.plain-ayah')).toHaveCount(7);
  await page.evaluate(() => document.fonts.ready);
  const size = await fontSize(mushaf);
  const scale = await page.evaluate(() =>
    parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--quran-scale')),
  );
  expect(size).toBeCloseTo(27 * scale * 1.75, 1);
  await expectNoOverflow(page);
  // Each line of words stays inside the text box and lines never overlap.
  const overlaps = await page.evaluate(() => {
    const words = [...document.querySelectorAll<HTMLElement>('.mushaf-text .plain-word')];
    const box = document.querySelector('.mushaf-text')!.getBoundingClientRect();
    const tops = [...new Set(words.map((word) => Math.round(word.getBoundingClientRect().top)))];
    return {
      outside: words.filter((word) => {
        const rect = word.getBoundingClientRect();
        return rect.left < box.left - 1 || rect.right > box.right + 1;
      }).length,
      lines: tops.length,
      lineHeight: parseFloat(getComputedStyle(document.querySelector('.mushaf-text')!).lineHeight),
      fontSize: parseFloat(getComputedStyle(document.querySelector('.mushaf-text')!).fontSize),
    };
  });
  expect(overlaps.outside).toBe(0);
  expect(overlaps.lines).toBeGreaterThan(4);
  // Al Qalam's line box holds its tallest stacked marks at every size.
  expect(overlaps.lineHeight / overlaps.fontSize).toBeGreaterThan(2);
});

test('long chapters estimate off-screen ayah heights for the chosen sizes', async ({ page }) => {
  for (const sizes of [
    { quran: 1, translation: 1 },
    { quran: 1.75, translation: 1.75 },
  ]) {
    await page.addInitScript(
      ({ key, value }) => localStorage.setItem(key, value),
      { key: textSizeKey, value: JSON.stringify(sizes) },
    );
    await loadStudy(page, '#surah=2');
    await expect(page.locator('.reading-card.windowed')).toBeVisible();
    // Render the first ayahs and compare their real heights with the placeholder estimate.
    const ratio = await page.evaluate(() => {
      const card = document.querySelector<HTMLElement>('.reading-card')!;
      const base = parseFloat(card.style.getPropertyValue('--ayah-base'));
      const perWord = parseFloat(card.style.getPropertyValue('--word-block'));
      let estimated = 0;
      let actual = 0;
      for (const ayah of [...card.querySelectorAll<HTMLElement>('.ayah')].slice(0, 30)) {
        ayah.style.contentVisibility = 'visible';
        estimated += base + Number(ayah.style.getPropertyValue('--ayah-words')) * perWord;
        actual += ayah.getBoundingClientRect().height;
      }
      return estimated / actual;
    });
    expect(ratio, JSON.stringify(sizes)).toBeGreaterThan(0.75);
    expect(ratio, JSON.stringify(sizes)).toBeLessThan(1.33);
  }
});

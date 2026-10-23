import { expect, test, type Page } from '@playwright/test';

const word = (page: Page, id: string) => page.locator(`[data-word-id="${id}"]`);
const detail = (page: Page) => page.locator('.word-detail, .word-sheet[open]');
const withoutMarks = (text: string | null) => (text || '').replace(/[\u064b-\u065f\u0670]/g, '');
const preferenceKey = 'quran-grammar.ui-language';

// Every test receives a new browser context; reloads within a test retain its preference.
test.use({ storageState: { cookies: [], origins: [] } });

async function openFilters(page: Page) {
  const button = page.getByRole('button', { name: 'Filters', exact: true });
  if (await button.getAttribute('aria-expanded') !== 'true') await button.click();
  await expect(page.locator('#filter-panel')).toBeVisible();
}

async function loadStudy(page: Page, hash = '') {
  await page.goto(`/${hash}`);
  await expect(page.locator('.quran-word')).toHaveCount(29);
  await page.evaluate(() => document.fonts.ready);
}

async function expectNoOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}

test('all verses and words retain root meanings and the four verb paradigms', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await loadStudy(page);
  await expect(page.locator('.ayah')).toHaveCount(7);
  await expect(page.locator('.ayah-translation')).toHaveCount(7);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  await expect(page.locator('.ayah-number')).toHaveText(['1', '2', '3', '4', '5', '6', '7']);
  await expect(detail(page).locator('.detail-navigation')).toContainText('1 / 29');
  await expect(page.getByRole('button', { name: 'Filters', exact: true })).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#filter-panel, .meaning-toggle, .ayah-nav')).toHaveCount(0);
  const ids = await page.locator('.quran-word').evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-word-id')!));
  expect(new Set(ids).size).toBe(29);
  const roots = new Set<string>();
  const rules = new Set<string>();
  for (const id of ids) {
    const button = word(page, id);
    const arabic = await button.locator('.arabic').textContent();
    await button.click();
    await expect(detail(page).locator('#detail-title')).toHaveText(arabic!);
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    const root = await detail(page).locator('.root-pair strong').first().textContent();
    if (root !== '—') {
      roots.add(root!);
      await expect(detail(page).locator('.root-meaning > p').first()).not.toBeEmpty();
    } else {
      await expect(detail(page).locator('.root-meaning')).toHaveCount(0);
    }
    for (const title of await detail(page).locator('.grammar-rule summary').allTextContents()) rules.add(title);
  }
  expect(roots.size).toBe(18);
  expect(rules.size).toBe(18);
  const paradigms = [
    ['1:5:2', 'نصر', 'عَبَدَ', 'يَعْبُدُ'],
    ['1:5:4', 'استفعال', 'اِسْتَعَانَ', 'يَسْتَعِينُ'],
    ['1:6:1', 'ضرب', 'هَدَى', 'يَهْدِي'],
    ['1:7:3', 'إفعال', 'أَنْعَمَ', 'يُنْعِمُ'],
  ];
  for (const [id, baab, past, present] of paradigms) {
    await word(page, id!).click();
    await expect.poll(async () => withoutMarks(await detail(page).locator('.baab-title').textContent())).toContain(baab!);
    await expect(detail(page).locator('.verb-paradigm')).toContainText(past!);
    await expect(detail(page).locator('.verb-paradigm')).toContainText(present!);
    await expect(detail(page).locator('.verb-paradigm .pattern dd')).not.toBeEmpty();
  }
  expect(errors).toEqual([]);
});

test('segments, related words, rules and bounded word navigation work', async ({ page }) => {
  await loadStudy(page);
  await expect(detail(page).getByRole('button', { name: 'Previous word', exact: true })).toBeDisabled();
  await detail(page).locator('[data-segment="0"]').click();
  await expect(detail(page).locator('.segment-explanation')).toBeVisible();
  await expect(detail(page).locator('[data-segment="0"]')).toHaveAttribute('aria-pressed', 'true');
  const rule = detail(page).locator('.grammar-rule').first();
  await rule.locator('summary').click();
  await expect(rule).toHaveAttribute('open', '');
  await expect(rule.locator('.rule-example')).toBeVisible();
  await word(page, '1:1:3').click();
  await expect(detail(page).locator('.segment-explanation')).toHaveCount(0);
  await detail(page).locator('[data-related-word="1:3:1"]').click();
  await expect(word(page, '1:3:1')).toHaveAttribute('aria-pressed', 'true');
  await expect(page).toHaveURL(/word=1%3A3%3A1/);
  await detail(page).getByRole('button', { name: 'Next word', exact: true }).click();
  await expect(word(page, '1:3:2')).toHaveAttribute('aria-pressed', 'true');
  await word(page, '1:7:9').click();
  await expect(detail(page).getByRole('button', { name: 'Next word', exact: true })).toBeDisabled();
});

test('normalized search, grammatical filters, empty recovery and meaning toggle preserve verses', async ({ page }) => {
  await loadStudy(page);
  const search = page.getByRole('searchbox');
  await page.keyboard.press('/');
  await expect(search).toBeFocused();
  await search.fill('هدي');
  await expect(page.locator('.quran-word.matched')).toHaveCount(1);
  await expect(word(page, '1:6:1')).toHaveClass(/matched/);
  await search.fill('استفعال');
  await expect(word(page, '1:5:4')).toHaveClass(/matched/);
  await search.fill('اسْتَعَانَ');
  await expect(page.locator('.quran-word.matched')).toHaveCount(1);
  await search.fill('اطاعت');
  await expect(word(page, '1:5:2')).toHaveClass(/matched/);
  await search.fill('');
  await openFilters(page);
  await page.locator('[data-pos="verb"]').click();
  await expect(page.locator('.quran-word.matched')).toHaveCount(4);
  await expect(page.locator('.search-feedback')).toContainText('4 matches');
  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  await expect(page.locator('#filter-panel')).toHaveCount(0);
  await expect(page.locator('.quran-word.matched')).toHaveCount(4);
  await openFilters(page);
  await expect(page.locator('.quran-word')).toHaveCount(29);
  await expect(page.locator('.ayah')).toHaveCount(7);
  await search.fill('zzzz-no-word');
  await expect(page.locator('.quran-word.matched')).toHaveCount(0);
  await expect(page.locator('.search-feedback')).toContainText('No matching words');
  await page.getByRole('button', { name: 'Clear search' }).click();
  await expect(search).toHaveValue('');
  await expect(page.locator('[data-pos="all"]')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('.meaning-toggle').click();
  await expect(page.getByRole('checkbox', { name: 'Show word meanings' })).not.toBeChecked();
  await expect(page.locator('.word-meaning')).toHaveCount(0);
  await page.locator('.meaning-toggle').click();
  await expect(page.getByRole('checkbox', { name: 'Show word meanings' })).toBeChecked();
  await expect(page.locator('.word-meaning')).toHaveCount(29);
});

test('grammar has fourteen constructions and seven tafsir notes, with no references interface', async ({ page }) => {
  await loadStudy(page);
  await expect(page.locator('.study-tabs button')).toHaveText(['Study', 'Grammar', 'Settings']);
  await expect(page.getByRole('button', { name: /حوالہ جات|Sources|References/ })).toHaveCount(0);
  await expect(page.locator('a[href^="https://"]')).toHaveCount(0);
  await expect(page.locator('.page-footer, .reading-caption, .surah-stats, .breadcrumb')).toHaveCount(0);
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await expect(page.locator('.settings-view a')).toHaveCount(1);
  await expect(page.locator('.settings-view a')).toHaveAttribute('href', 'https://corpus.quran.com');
  await page.getByRole('button', { name: 'Grammar', exact: true }).click();
  await expect(page.locator('.grammar-card')).toHaveCount(7);
  await expect(page.locator('.phrase')).toHaveCount(14);
  await expect(page.locator('.tafsir')).toHaveCount(7);
  await expect(page.locator('.grammar-view a')).toHaveCount(0);
  await page.locator('#grammar-ayah-6').getByRole('button', { name: 'Back to study' }).click();
  await expect(page.locator('#ayah-6')).toBeInViewport();
  await openFilters(page);
  await page.getByRole('button', { name: 'Go to ayah 7' }).click();
  await expect(page.locator('#ayah-7')).toBeInViewport();
});

test('valid and invalid deep links select safely and hash changes are respected', async ({ page }) => {
  await loadStudy(page, '#word=1%3A5%3A2');
  await expect(word(page, '1:5:2')).toHaveAttribute('aria-pressed', 'true');
  await page.evaluate(() => { location.hash = 'word=1%3A6%3A1'; });
  await expect(word(page, '1:6:1')).toHaveAttribute('aria-pressed', 'true');
  await page.evaluate(() => { location.hash = 'word=invalid'; });
  await expect(word(page, '1:1:1')).toHaveAttribute('aria-pressed', 'true');
});

test('API failure is recoverable by the retry control', async ({ page }) => {
  await page.route('**/api/v1/surahs/1', (route) => route.abort());
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Could not load the study content.' })).toBeVisible();
  await expect(page.locator('.quran-word')).toHaveCount(0);
  await page.unroute('**/api/v1/surahs/1');
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.locator('.quran-word')).toHaveCount(29);
});

for (const width of [320, 390, 768]) {
  test(`mobile ${width}px sheet preserves reading position, keyboard focus and full content`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await loadStudy(page);
    await expectNoOverflow(page);
    await expect(page.locator('dialog')).not.toBeVisible();
    await openFilters(page);
    await expectNoOverflow(page);
    await page.getByRole('button', { name: 'Filters', exact: true }).click();
    const trigger = word(page, '1:5:2');
    await trigger.scrollIntoViewIfNeeded();
    const readingY = await page.evaluate(() => scrollY);
    await trigger.click();
    const sheet = page.getByRole('dialog');
    await expect(sheet).toBeVisible();
    await expect.poll(async () => withoutMarks(await sheet.locator('.baab-title').textContent())).toContain('نصر');
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('hidden');
    await expectNoOverflow(page);
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => !!document.activeElement?.closest('dialog'))).toBe(true);
    await sheet.locator('.detail-scroll').evaluate((node) => { node.scrollTop = node.scrollHeight; });
    await sheet.getByRole('button', { name: 'Next word', exact: true }).click();
    await expect(word(page, '1:5:3')).toHaveAttribute('aria-pressed', 'true');
    await expect.poll(() => sheet.locator('.detail-scroll').evaluate((node) => node.scrollTop)).toBe(0);
    await page.keyboard.press('Escape');
    await expect(sheet).not.toBeVisible();
    await expect(trigger).toBeFocused();
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('');
    expect(Math.abs((await page.evaluate(() => scrollY)) - readingY)).toBeLessThan(2);
    await trigger.click();
    await page.mouse.click(4, 4);
    await expect(sheet).not.toBeVisible();
    await expect(trigger).toBeFocused();
    await page.getByRole('button', { name: 'Grammar', exact: true }).click();
    await expect(page.locator('.phrase')).toHaveCount(14);
    await expectNoOverflow(page);
    await page.getByRole('button', { name: 'Settings', exact: true }).click();
    await expectNoOverflow(page);
    await page.getByRole('button', { name: 'اردو', exact: true }).click();
    await expectNoOverflow(page);
    await page.getByRole('button', { name: 'مطالعہ', exact: true }).click();
    await page.getByRole('button', { name: 'فلٹر', exact: true }).click();
    await expect(page.locator('#filter-panel')).toBeVisible();
    await expectNoOverflow(page);
  });
}

test('mobile deep link opens its word and closes without losing access to the page', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await loadStudy(page, '#word=1%3A6%3A1');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect.poll(async () => withoutMarks(await page.getByRole('dialog').locator('.baab-title').textContent())).toContain('ضرب');
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await openFilters(page);
  await page.getByRole('button', { name: 'Go to ayah 6' }).click();
  await expect(page.locator('#ayah-6')).toBeInViewport();
});

test('interface language persists while Arabic text and Urdu study content stay unchanged', async ({ page }) => {
  await loadStudy(page);
  const arabic = await page.locator('.quran-word .arabic').allTextContents();
  const meanings = await page.locator('.word-meaning').allTextContents();
  const translations = await page.locator('.ayah-translation').allTextContents();
  const rootMeaning = await detail(page).locator('.root-meaning p').allTextContents();
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await expect(page.getByRole('button', { name: 'English', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'اردو', exact: true }).click();
  await expect(page.locator('.study-tabs button')).toHaveText(['مطالعہ', 'قواعد', 'ترتیبات']);
  await expect(page.locator('html')).toHaveAttribute('lang', 'ur');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  expect(await page.evaluate((key) => localStorage.getItem(key), preferenceKey)).toBe('ur');
  await page.reload();
  await expect(page.locator('.quran-word')).toHaveCount(29);
  await expect(page.locator('.ayah-number')).toHaveText(['۱', '۲', '۳', '۴', '۵', '۶', '۷']);
  await expect(detail(page).locator('.detail-navigation')).toContainText('۱ / ۲۹');
  await expect(detail(page).getByRole('button', { name: 'اگلا لفظ', exact: true })).toBeVisible();
  expect(await page.locator('.quran-word .arabic').allTextContents()).toEqual(arabic);
  expect(await page.locator('.word-meaning').allTextContents()).toEqual(meanings);
  expect(await page.locator('.ayah-translation').allTextContents()).toEqual(translations);
  expect(await detail(page).locator('.root-meaning p').allTextContents()).toEqual(rootMeaning);
  await page.getByRole('button', { name: 'فلٹر', exact: true }).click();
  await page.locator('[data-pos="verb"]').click();
  await expect(page.locator('.search-feedback')).toContainText('۴ نتائج');
  await expect(page.locator('.ayah-nav button')).toHaveText(['۱', '۲', '۳', '۴', '۵', '۶', '۷']);
  await page.getByRole('button', { name: 'ترتیبات', exact: true }).click();
  await page.getByRole('button', { name: 'English', exact: true }).click();
  await page.reload();
  await expect(page.locator('.study-tabs button')).toHaveText(['Study', 'Grammar', 'Settings']);
  await expect(page.locator('.ayah-number')).toHaveText(['1', '2', '3', '4', '5', '6', '7']);
  expect(await page.evaluate((key) => localStorage.getItem(key), preferenceKey)).toBe('en');
});

test('invalid saved language falls back to English', async ({ page }) => {
  await page.addInitScript((key) => localStorage.setItem(key, 'invalid-language'), preferenceKey);
  await loadStudy(page);
  await expect(page.locator('.study-tabs button')).toHaveText(['Study', 'Grammar', 'Settings']);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('blocked storage does not prevent study or changing the current interface language', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Storage blocked', 'SecurityError'); } });
  });
  await loadStudy(page);
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await page.getByRole('button', { name: 'اردو', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('محفوظ نہیں ہو سکی');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ur');
  await page.getByRole('button', { name: 'مطالعہ', exact: true }).click();
  await expect(page.locator('.quran-word')).toHaveCount(29);
  expect(errors).toEqual([]);
});

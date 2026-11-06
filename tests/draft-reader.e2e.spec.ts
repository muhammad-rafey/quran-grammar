import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { expect, test, type BrowserContext, type Page } from '@playwright/test';
import { isStudyData } from '../packages/core/src/validate';
import type { StudyData } from '../packages/core/src/types';

const chapters = [
  { number: 18, ayahs: 110, words: 1579 },
  { number: 23, ayahs: 118, words: 1050 },
  { number: 32, ayahs: 30, words: 372 },
  { number: 36, ayahs: 83, words: 725 },
  { number: 55, ayahs: 78, words: 351 },
] as const;
const draftNumbers = chapters.map(({ number }) => number);
// GitHub's local CI run supplies BASE_URL=""; only an actual deployment URL
// disables private previews, matching Playwright's base-URL selection.
const publicTargetConfigured = Boolean(process.env.BASE_URL);

// Private browser fixtures only: no source registry, API, approval or runtime is changed.
// Availability has its own module; patching registry.ts would occur too late for
// catalog.ts, which eagerly snapshots availability when its module evaluates.
test.use({ storageState: { cookies: [], origins: [] }, extraHTTPHeaders: {}, httpCredentials: undefined, serviceWorkers: 'block' });
test.skip(publicTargetConfigured, 'Held-draft browser previews never run when BASE_URL is set.');

function localOrigin(baseURL: string | undefined) {
  if (publicTargetConfigured || !baseURL) throw new Error('Draft previews require the local Vite server without BASE_URL.');
  const origin = new URL(baseURL);
  if (!['http:', 'https:'].includes(origin.protocol) || !['localhost', '127.0.0.1', '[::1]'].includes(origin.hostname)) {
    throw new Error('Held-draft interception is restricted to a loopback browser origin.');
  }
  return origin.origin;
}

function loadDraft(number: number): StudyData {
  const file = fileURLToPath(new URL(`../content-pipeline/drafts/surah-${number}.json`, import.meta.url));
  test.skip(!existsSync(file), `Surah ${number} has not yet been assembled as a held scholarly-review draft.`);
  const wrapper: unknown = JSON.parse(readFileSync(file, 'utf8'));
  expect(wrapper).toMatchObject({ reviewStatus: 'scholarly-review-pending' });
  const study = (wrapper as { study?: unknown }).study;
  expect(isStudyData(study), `Held Surah ${number} must satisfy the actual application data validator`).toBe(true);
  const result = study as StudyData;
  expect(result.surah.number).toBe(number);
  return result;
}

async function installPreview(context: BrowserContext, baseURL: string | undefined, fixtures: readonly StudyData[]) {
  const origin = localOrigin(baseURL);
  const studies = new Map(fixtures.map((study) => [study.surah.number, study]));
  const hits = { availability: 0, chapters: [] as number[] };
  await context.route(/\/packages\/core\/src\/availability\.ts(?:\?.*)?$/, async (route) => {
    expect(new URL(route.request().url()).origin).toBe(origin);
    expect(route.request().headers().authorization).toBeUndefined();
    const response = await route.fetch();
    expect(response.status()).toBe(200);
    const source = await response.text();
    expect(source).toMatch(/\bavailableSurahNumbers\b/);
    const body = `${source}\n// Test-context-only held-draft preview; never persisted or published.\nif (!Array.isArray(availableSurahNumbers) || Object.isFrozen(availableSurahNumbers)) throw new Error('Unsupported availability module for private draft preview');\navailableSurahNumbers.push(...${JSON.stringify(draftNumbers)}.filter(number => !availableSurahNumbers.includes(number)));\n`;
    const headers: Record<string, string> = { ...response.headers(), 'cache-control': 'no-store' };
    delete headers['content-length'];
    delete headers['content-encoding'];
    hits.availability++;
    await route.fulfill({ response, headers, body });
  });
  await context.route('**/api/v1/surahs/*', async (route) => {
    const url = new URL(route.request().url());
    const number = Number(url.pathname.match(/^\/api\/v1\/surahs\/(\d+)$/)?.[1]);
    const study = studies.get(number);
    if (!study) return route.fallback();
    expect(url.origin).toBe(origin);
    expect(route.request().headers().authorization).toBeUndefined();
    hits.chapters.push(number);
    await route.fulfill({ json: study, headers: { 'cache-control': 'no-store', 'x-quran-grammar-test-fixture': 'private-held-draft' } });
  });
  return hits;
}

const ayahSelector = (page: Page) => page.getByRole('combobox', { name: 'Select ayah', exact: true });
const wordButton = (page: Page, id: string) => page.locator(`[data-word-id="${id}"]`);

async function chooseJuz(page: Page, number: number) {
  await page.getByRole('button', { name: 'Select surah', exact: true }).click();
  const catalog = page.getByRole('dialog', { name: 'Select surah', exact: true });
  await catalog.getByRole('button', { name: 'Juz', exact: true }).click();
  const juzCatalog = page.getByRole('dialog', { name: 'Select juz', exact: true });
  await expect(juzCatalog.locator(`[data-juz="${number}"]`)).toBeEnabled();
  await juzCatalog.locator(`[data-juz="${number}"]`).click();
  // Each selected Juz has exactly one available chapter in this private edition.
  await expect(juzCatalog).not.toBeVisible();
}

test('local preview transport is browser-only and the actual API still withholds expansion chapters', async ({ page, context, request, baseURL, browser }) => {
  localOrigin(baseURL);
  const response = await request.get('/api/v1/surahs/1');
  expect(response.status()).toBe(200);
  const fatihah = await response.json() as StudyData;
  expect(isStudyData(fatihah)).toBe(true);
  const hits = await installPreview(context, baseURL, [fatihah]);
  await page.goto('/');
  await expect(page.locator('.quran-word')).toHaveCount(29);
  expect(hits.availability).toBeGreaterThan(0);
  expect([...new Set(hits.chapters)]).toEqual([1]);
  await page.getByRole('button', { name: 'Select surah', exact: true }).click();
  for (const number of draftNumbers) await expect(page.locator(`[data-surah="${number}"]`)).toBeEnabled();
  expect((await request.get('/api/v1/surahs/18')).status()).toBe(404);
  expect(await context.cookies()).toEqual([]);
  const untouched = await browser.newContext({ baseURL, storageState: { cookies: [], origins: [] }, extraHTTPHeaders: {}, httpCredentials: undefined });
  try {
    const clean = await untouched.newPage();
    await clean.goto('/');
    await expect(clean.locator('.quran-word')).toHaveCount(29);
    await clean.getByRole('button', { name: 'Select surah', exact: true }).click();
    await expect(clean.locator('[data-surah="18"]')).toBeDisabled();
  } finally {
    await untouched.close();
  }
});

for (const chapter of chapters) {
  test(`held Surah ${chapter.number}: complete reader counts and exact first/last Arabic`, async ({ page, context, baseURL }) => {
    const study = loadDraft(chapter.number);
    test.setTimeout(60000);
    expect(study.surah.wordCount).toBe(chapter.words);
    expect(study.surah.ayahCount).toBe(chapter.ayahs);
    const hits = await installPreview(context, baseURL, [study]);
    await page.goto(`/#surah=${chapter.number}`);
    await expect(page.locator('.bottom-nav button')).toHaveText(['Study', 'Grammar', 'Settings']);
    await expect(page.locator('.quran-word')).toHaveCount(chapter.words);
    await expect(page.locator('.reading-card article.ayah')).toHaveCount(chapter.ayahs);
    await expect(ayahSelector(page).locator('option')).toHaveCount(chapter.ayahs);
    const first = study.words[0];
    const last = study.words.at(-1)!;
    expect(await wordButton(page, first.id).locator('.arabic').textContent()).toBe(first.arabic);
    expect(await wordButton(page, last.id).locator('.arabic').textContent()).toBe(last.arabic);
    const ids = await page.locator('.quran-word').evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-word-id')));
    expect(ids).toEqual(study.words.map((word) => word.id));
    await ayahSelector(page).selectOption(String(chapter.ayahs));
    await expect(page.locator(`#ayah-${chapter.ayahs}`)).toBeInViewport();
    expect(hits.availability).toBeGreaterThan(0);
    expect([...new Set(hits.chapters)]).toEqual([chapter.number]);
  });
}

for (const boundary of [
  { surah: 18, juz: 16, beforeJuz: 15, start: 75 },
  { surah: 36, juz: 23, beforeJuz: 22, start: 28 },
]) {
  test(`held Surah ${boundary.surah}: Juz ${boundary.juz} opens at ayah ${boundary.start} and follows the boundary`, async ({ page, context, baseURL }) => {
    const study = loadDraft(boundary.surah);
    test.setTimeout(60000);
    await installPreview(context, baseURL, [study]);
    await page.goto('/');
    await expect(page.locator('.quran-word')).toHaveCount(29);
    await chooseJuz(page, boundary.juz);
    await expect(page.locator('.quran-word')).toHaveCount(study.surah.wordCount);
    await expect(ayahSelector(page)).toHaveValue(String(boundary.start));
    await expect(page.locator('.collection-trigger')).toContainText(`Juz ${boundary.juz}`);
    await expect(page.locator(`#ayah-${boundary.start}`)).toBeInViewport();
    const first = study.words.find((word) => word.ayah === boundary.start)!;
    await expect(wordButton(page, first.id)).toHaveAttribute('aria-pressed', 'true');
    await expect(page).toHaveURL(new RegExp(`#surah=${boundary.surah}&ayah=${boundary.start}$`));
    await ayahSelector(page).selectOption(String(boundary.start - 1));
    await expect(page.locator('.collection-trigger')).toContainText(`Juz ${boundary.beforeJuz}`);
    await expect(page.locator(`#ayah-${boundary.start - 1}`)).toBeInViewport();
    await ayahSelector(page).selectOption(String(boundary.start));
    await expect(page.locator('.collection-trigger')).toContainText(`Juz ${boundary.juz}`);
    await expect(ayahSelector(page)).toHaveValue(String(boundary.start));
  });
}

test('390px held Al-Kahf reader opens a contextual verb paradigm and closes at the same reading position', async ({ page, context, baseURL }) => {
  const study = loadDraft(18);
  test.setTimeout(60000);
  await page.setViewportSize({ width: 390, height: 844 });
  await installPreview(context, baseURL, [study]);
  await page.goto('/#surah=18&ayah=75');
  await expect(page.locator('.quran-word')).toHaveCount(1579);
  await page.evaluate(() => document.fonts.ready);
  const verb = study.words.find((word) => word.id === '18:75:2' && word.pos === 'verb' && word.root && study.verbForms[word.id])
    ?? study.words.find((word) => word.ayah === 75 && word.pos === 'verb' && word.root && study.verbForms[word.id]);
  expect(verb, 'Ayah 75 must provide an occurrence-specific verb paradigm for this interaction').toBeTruthy();
  const selected = verb!;
  const paradigm = study.verbForms[selected.id];
  const root = study.roots[selected.root!];
  expect(root).toBeTruthy();
  const trigger = wordButton(page, selected.id);
  await trigger.scrollIntoViewIfNeeded();
  const readingY = await page.evaluate(() => scrollY);
  await trigger.click();
  const sheet = page.locator('.word-sheet[open]');
  await expect(sheet).toBeVisible();
  expect(await sheet.locator('#detail-title').textContent()).toBe(selected.arabic);
  await expect(sheet.locator('.root-pair strong').first()).toHaveText(selected.root!);
  await expect(sheet.locator('.root-meaning p').first()).toHaveText(root.meaningUrdu);
  await expect(sheet.locator('.baab-title')).toHaveText(paradigm.baabUrdu);
  await expect(sheet.locator('.verb-paradigm dd')).toHaveText([paradigm.past, paradigm.present, paradigm.pattern]);
  await expect(sheet.locator('.detail-navigation')).toContainText(`${study.words.indexOf(selected) + 1} / 1579`);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await sheet.getByRole('button', { name: 'Close', exact: true }).click();
  await expect(sheet).toHaveCount(0);
  await expect(trigger).toBeFocused();
  expect(Math.abs((await page.evaluate(() => scrollY)) - readingY)).toBeLessThan(2);
  await expect(ayahSelector(page)).toHaveValue('75');
});

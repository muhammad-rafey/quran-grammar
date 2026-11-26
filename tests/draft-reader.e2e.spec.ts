import { readFileSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';
import { isStudyData } from '../packages/core/src/validate';
import type { StudyData } from '../packages/core/src/types';

const chapters = [
  { number: 4, ayahs: 176, words: 3747 },
  { number: 7, ayahs: 206, words: 3320 },
  { number: 18, ayahs: 110, words: 1579 },
  { number: 22, ayahs: 78, words: 1274 },
  { number: 23, ayahs: 118, words: 1050 },
  { number: 32, ayahs: 30, words: 372 },
  { number: 36, ayahs: 83, words: 725 },
  { number: 55, ayahs: 78, words: 351 },
  { number: 56, ayahs: 96, words: 379 },
] as const;

// Exercise the actual published API and UI on localhost or the deployed server.
// No intercepted availability, mocked responses or scholarly-approval claims.
test.use({ storageState: { cookies: [], origins: [] } });
const chapterLoadTimeout = 20_000;
const { surahs: authorizedDrafts } = JSON.parse(
  readFileSync(new URL('../content-pipeline/draft-publication.json', import.meta.url), 'utf8'),
) as { surahs: Array<{ number: number; work?: string }> };
/**
 * A pinned draft snapshot. Drafts predate the whole-Quran build (2026-11-26): their ayahs still
 * carry the removed AI translation, theme and tafsir, and their word meanings are the drafts'.
 */
type DraftStudy = Omit<StudyData, 'ayahs'> & {
  ayahs: Array<Pick<StudyData['ayahs'][number], 'number' | 'phrases'> & Record<string, unknown>>;
};
function loadDraft(number: number): DraftStudy {
  const entry = authorizedDrafts.find((draft) => draft.number === number);
  expect(entry, `Surah ${number} has a pinned draft`).toBeDefined();
  const work = entry?.work ?? 'content-pipeline';
  const wrapper = JSON.parse(readFileSync(new URL(`../${work}/drafts/surah-${number}.json`, import.meta.url), 'utf8'));
  expect(wrapper.reviewStatus).toBe('scholarly-review-pending');
  expect(wrapper.study.surah.number).toBe(number);
  return wrapper.study;
}
/**
 * The published grammar layer: everything except the fields the whole-Quran build replaced
 * (word meanings now from Quran.com, IndoPak text added, ayah translation/theme/tafsir replaced
 * by the six Quran.com translations).
 */
function grammarLayer(study: DraftStudy | StudyData) {
  return {
    keys: Object.keys(study),
    schemaVersion: study.schemaVersion,
    surah: study.surah,
    words: study.words.map(({ meaningUrdu: _meaning, arabicIndoPak: _indoPak, ...word }) => word),
    ayahs: study.ayahs.map((ayah) => ({ number: ayah.number, phrases: ayah.phrases })),
    rules: study.rules,
    roots: study.roots,
    verbForms: study.verbForms,
  };
}

// The ayah chip opens a dialog with a number search and a grid of ayah buttons.
const ayahSelector = (page: Page, name = 'Select ayah') =>
  page.getByRole('button', { name, exact: true });
const ayahPicker = (page: Page, name = 'Select ayah') =>
  page.getByRole('dialog', { name, exact: true });
async function chooseAyah(page: Page, number: number | string) {
  await ayahSelector(page).click();
  const picker = ayahPicker(page);
  await expect(picker).toBeVisible();
  await picker.locator(`.ayah-grid [data-ayah="${number}"]`).click();
  await expect(picker).not.toBeVisible();
}
async function expectAyahNumbers(page: Page, count: number, name = 'Select ayah') {
  await ayahSelector(page, name).click();
  await expect(ayahPicker(page, name).locator('.ayah-grid button')).toHaveCount(count);
  await page.keyboard.press('Escape');
  await expect(ayahPicker(page, name)).not.toBeVisible();
}
const wordButton = (page: Page, id: string) => page.locator(`[data-word-id="${id}"]`);

async function chooseJuz(page: Page, number: number, surah: number) {
  await page.getByRole('button', { name: 'Select surah', exact: true }).click();
  const catalog = page.getByRole('dialog', { name: 'Select surah', exact: true });
  await catalog.getByRole('button', { name: 'Juz', exact: true }).click();
  const juzCatalog = page.getByRole('dialog', { name: 'Select juz', exact: true });
  await expect(juzCatalog.locator(`[data-juz="${number}"]`)).toBeEnabled();
  await juzCatalog.locator(`[data-juz="${number}"]`).click();
  if (await juzCatalog.isVisible()) await juzCatalog.locator(`[data-surah="${surah}"]`).click();
  await expect(juzCatalog).not.toBeVisible();
}

test('published lesson APIs keep the exact authorized grammar layer', async ({ request }) => {
  test.setTimeout(120_000);
  for (const chapter of authorizedDrafts) {
    const response = await request.get('/api/v1/surahs/' + chapter.number);
    expect(response.status(), `Surah ${chapter.number}`).toBe(200);
    const study = (await response.json()) as StudyData;
    expect(isStudyData(study), `Surah ${chapter.number}`).toBe(true);
    expect(grammarLayer(study)).toEqual(grammarLayer(loadDraft(chapter.number)));
    // Only the replaced fields differ: no AI ayah translation, theme or tafsir is served.
    for (const ayah of study.ayahs) expect(Object.keys(ayah)).toEqual(['number', 'translations', 'phrases']);
    expect(study.words.every((word) => word.arabicIndoPak)).toBe(true);
  }
});

for (const chapter of chapters) {
  test(`published Surah ${chapter.number}: complete reader counts and exact first/last Arabic`, async ({ page }) => {
    const study = loadDraft(chapter.number);
    test.setTimeout(60000);
    expect(study.surah.wordCount).toBe(chapter.words);
    expect(study.surah.ayahCount).toBe(chapter.ayahs);
    await page.goto(`/#surah=${chapter.number}`);
    await expect(page.locator('.bottom-nav button')).toHaveText(['Study', 'Practice Grammar', 'Settings']);
    await expect(page.locator('.quran-word')).toHaveCount(chapter.words, { timeout: chapterLoadTimeout });
    await expect(page.getByText(/published draft|scholar(?:ly)? review pending/i)).toHaveCount(0);
    expect(await page.locator('.quran-word .arabic').allTextContents()).toEqual(study.words.map(word => word.arabic));
    await expect(page.locator('.reading-card article.ayah')).toHaveCount(chapter.ayahs);
    await expectAyahNumbers(page, chapter.ayahs);
    const first = study.words[0];
    const last = study.words.at(-1)!;
    expect(await wordButton(page, first.id).locator('.arabic').textContent()).toBe(first.arabic);
    expect(await wordButton(page, last.id).locator('.arabic').textContent()).toBe(last.arabic);
    const ids = await page.locator('.quran-word').evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-word-id')));
    expect(ids).toEqual(study.words.map((word) => word.id));
    await chooseAyah(page, String(chapter.ayahs));
    await expect(page.locator(`#ayah-${chapter.ayahs}`)).toBeInViewport();
  });
}

for (const boundary of [
  { surah: 4, juz: 5, beforeJuz: 4, start: 24 },
  { surah: 7, juz: 9, beforeJuz: 8, start: 88 },
  { surah: 18, juz: 16, beforeJuz: 15, start: 75 },
  { surah: 36, juz: 23, beforeJuz: 22, start: 28 },
]) {
  test(`published Surah ${boundary.surah}: Juz ${boundary.juz} opens at ayah ${boundary.start} and follows the boundary`, async ({ page }) => {
    const study = loadDraft(boundary.surah);
    test.setTimeout(60000);
    await page.goto('/');
    await expect(page.locator('.quran-word')).toHaveCount(29);
    await chooseJuz(page, boundary.juz, boundary.surah);
    await expect(page.locator('.quran-word')).toHaveCount(study.surah.wordCount, { timeout: chapterLoadTimeout });
    await expect(ayahSelector(page)).toHaveAttribute('data-ayah', String(boundary.start));
    await expect(page.locator('.collection-trigger')).toContainText(`Juz ${boundary.juz}`);
    await expect(page.locator(`#ayah-${boundary.start}`)).toBeInViewport();
    const first = study.words.find((word) => word.ayah === boundary.start)!;
    await expect(wordButton(page, first.id)).toHaveAttribute('aria-pressed', 'true');
    await expect(page).toHaveURL(new RegExp(`#surah=${boundary.surah}&ayah=${boundary.start}$`));
    await chooseAyah(page, String(boundary.start - 1));
    await expect(page.locator('.collection-trigger')).toContainText(`Juz ${boundary.beforeJuz}`);
    await expect(page.locator(`#ayah-${boundary.start - 1}`)).toBeInViewport();
    await chooseAyah(page, String(boundary.start));
    await expect(page.locator('.collection-trigger')).toContainText(`Juz ${boundary.juz}`);
    await expect(ayahSelector(page)).toHaveAttribute('data-ayah', String(boundary.start));
  });
}

test('390px published Al-Kahf reader opens a contextual verb paradigm and closes at the same reading position', async ({ page }) => {
  const study = loadDraft(18);
  test.setTimeout(60000);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#surah=18&ayah=75');
  await expect(page.locator('.quran-word')).toHaveCount(1579, { timeout: chapterLoadTimeout });
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
  await expect(ayahSelector(page)).toHaveAttribute('data-ayah', '75');
});

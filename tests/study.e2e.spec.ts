import { readFileSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';
import type { StudyData } from '../packages/core/src/types';

/** The bundled lesson the API serves (packages/core/data/lessons). */
const lesson = (surah: number): StudyData =>
  JSON.parse(readFileSync(new URL(`../packages/core/data/lessons/surah-${surah}.json`, import.meta.url), 'utf8'));

/** Pipeline records: the scope and the grammar-layer summary written by build.py. */
const pipelineFile = (path: string) =>
  JSON.parse(readFileSync(new URL(`../content-pipeline/full-quran/${path}`, import.meta.url), 'utf8'));
const scope = pipelineFile('scope.json') as { existingLessons: number[]; partialPilot: { surah: number } };
const grammarChapters = pipelineFile('inventory/sources.json').grammarLayer.chapters as Record<string, unknown>;
/** The first chapter neither published nor touched by the grammar layer (null once all are authored). */
const plainChapter =
  Array.from({ length: 114 }, (_, index) => index + 1).find(
    (n) => !scope.existingLessons.includes(n) && n !== scope.partialPilot.surah && !(String(n) in grammarChapters),
  ) ?? null;
/** A chapter with authored grammar notes beyond the Al-Baqarah pilot (Al Imran in wave 1). */
const authoredChapter = Number(
  Object.keys(grammarChapters).find((n) => Number(n) !== scope.partialPilot.surah) ?? scope.partialPilot.surah,
);

const word = (page: Page, id: string) => page.locator(`[data-word-id="${id}"]`);
const detail = (page: Page) => page.locator('.word-detail, .word-sheet[open]');
const withoutMarks = (text: string | null) => (text || '').replace(/[\u064b-\u065f\u0670]/g, '');
const preferenceKey = 'quran-grammar.ui-language';
// The ayah chip opens a dialog with a number search and a grid of ayah buttons.
const ayahChip = (page: Page, name = 'Select ayah') =>
  page.getByRole('button', { name, exact: true });
const ayahPicker = (page: Page, name = 'Select ayah') =>
  page.getByRole('dialog', { name, exact: true });
async function chooseAyah(page: Page, number: number | string) {
  await ayahChip(page).click();
  const picker = ayahPicker(page);
  await expect(picker).toBeVisible();
  await picker.locator(`.ayah-grid [data-ayah="${number}"]`).click();
  await expect(picker).not.toBeVisible();
}
async function expectAyahNumbers(page: Page, count: number, name = 'Select ayah') {
  await ayahChip(page, name).click();
  await expect(ayahPicker(page, name).locator('.ayah-grid button')).toHaveCount(count);
  await page.keyboard.press('Escape');
  await expect(ayahPicker(page, name)).not.toBeVisible();
}

// Every test receives a new browser context; reloads within a test retain its preference.
test.use({ storageState: { cookies: [], origins: [] } });

async function openFilters(page: Page) {
  const button = page.getByRole('button', { name: 'Filters', exact: true });
  if ((await button.getAttribute('aria-expanded')) !== 'true') await button.click();
  await expect(page.locator('#filter-panel')).toBeVisible();
}

async function loadStudy(page: Page, hash = '') {
  await page.goto(`/${hash}`);
  await expect(page.locator('.quran-word')).toHaveCount(29);
  await page.evaluate(() => document.fonts.ready);
}

const navLabels = ['Study', 'Practice Grammar', 'Settings'];

// The Practice Grammar tab lists grammar topics (from the API) and the Al-Fatihah quick practice.
async function openPracticeGrammar(page: Page, nav = 'Practice Grammar') {
  const button = page.locator('.bottom-nav').getByRole('button', { name: nav, exact: true });
  await expect(button).toBeEnabled();
  await button.click();
  await expect(page.locator('.practice-view')).toBeVisible();
  await expect(page.locator('.lesson-toolbar')).toHaveCount(0);
  await expect(page.locator('.grammar-card, .phrase, .tafsir')).toHaveCount(0);
}

async function openFatihahPractice(page: Page, nav = 'Practice Grammar') {
  await openPracticeGrammar(page, nav);
  await page.locator('[data-practice="fatihah"]').click();
}

const topicDialog = (page: Page) => page.locator('dialog.topic-dialog[open]');

async function expectNoOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}

async function expectFloatingNavigation(page: Page) {
  const nav = page.locator('.bottom-nav');
  await expect(nav).toBeInViewport();
  const box = await nav.boundingBox();
  const viewport = page.viewportSize()!;
  expect(box!.x).toBeGreaterThanOrEqual(8);
  expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width - 8);
  expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height);
  for (const button of await nav.getByRole('button').all()) {
    const target = await button.boundingBox();
    expect(target!.width).toBeGreaterThanOrEqual(44);
    expect(target!.height).toBeGreaterThanOrEqual(44);
    await expect(button).toHaveAttribute('aria-label', /.+/);
  }
}

test('surah and juz catalogs expose available lessons and preserve picker focus', async ({
  page,
}) => {
  const requestedSurahs: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('/api/v1/surahs/'))
      requestedSurahs.push(new URL(request.url()).pathname);
  });
  await loadStudy(page);
  const trigger = page.getByRole('button', { name: 'Select surah', exact: true });
  await trigger.focus();
  await page.keyboard.press('Enter');
  const catalog = page.getByRole('dialog', { name: 'Select surah', exact: true });
  await expect(catalog).toBeVisible();
  await expect(catalog.locator('[data-surah]')).toHaveCount(114);
  // Every chapter is available; none is labelled as future content.
  await expect(catalog.locator('[data-surah]:disabled')).toHaveCount(0);
  await expect(catalog.locator('[data-surah]', { hasText: 'Coming soon' })).toHaveCount(0);
  expect(
    await catalog
      .locator('[data-surah]')
      .evaluateAll((nodes) => nodes.map((node) => Number(node.getAttribute('data-surah')))),
  ).toEqual(Array.from({ length: 114 }, (_, index) => index + 1));
  await expect(catalog.locator('[data-surah="1"]')).toBeEnabled();
  await expect(catalog.locator('[data-surah="3"]')).toBeEnabled();
  // Every chapter is available, so the list has no availability labels or headings.
  await expect(catalog).not.toContainText('Available');
  await expect(catalog.locator('[data-surah="3"]')).toContainText("Ali 'Imran");
  await expect(catalog.locator('[data-surah="3"]')).toContainText('Family of Imran · 200 ayahs');
  await expect(catalog.locator('[data-surah="3"]')).toContainText('آل عمران');
  await expect(catalog.locator('[data-surah="114"]')).toContainText('An-Nas');
  await expect(
    page.getByRole('button', { name: 'Select ayah', includeHidden: true }),
  ).toHaveAttribute('data-ayah', '1');
  for (let index = 0; index < 7; index++) {
    await page.keyboard.press('Tab');
    // Chromium may move focus to browser chrome between cycles; background controls stay inert.
    expect(
      await page.evaluate(
        () =>
          document.activeElement === document.body ||
          !!document.activeElement?.closest('.catalog-dialog'),
      ),
    ).toBe(true);
  }
  await page.keyboard.press('Escape');
  await expect(catalog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.getByRole('dialog').getByRole('button', { name: 'Juz', exact: true }).click();
  const juz = page.getByRole('dialog', { name: 'Select juz', exact: true });
  await expect(juz.locator('[data-juz]')).toHaveCount(30);
  await expect(juz.locator('[data-juz]:disabled')).toHaveCount(0);
  await expect(juz.locator('[data-juz]', { hasText: 'Partial preview' })).toHaveCount(0);
  await expect(juz).not.toContainText('Available');
  await expect(juz.locator('[data-juz="1"]')).toContainText('Al-Fatihah · Al-Baqarah');
  // Juz 1 holds Al-Fatihah and Al-Baqarah 1–141, so it lists its chapters first.
  await juz.locator('[data-juz="1"]').click();
  await expect(juz.locator('[data-surah]')).toHaveCount(2);
  await juz.locator('[data-surah="1"]').click();
  await expect(juz).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'Select juz', exact: true })).toBeFocused();
  await expect(page.locator('.collection-trigger')).toContainText('Juz 1');
  await expect(page.locator('.quran-word')).toHaveCount(29);
  expect(requestedSurahs.length).toBeGreaterThan(0);
  expect(requestedSurahs.every((path) => path === '/api/v1/surahs/1')).toBe(true);
});

test('ayah selector follows selection, jumps to ayahs and resets with the collection', async ({
  page,
}) => {
  await loadStudy(page);
  const selector = ayahChip(page);
  await selector.click();
  await expect(ayahPicker(page).locator('.ayah-grid button')).toHaveText([
    '1', '2', '3', '4', '5', '6', '7',
  ]);
  await page.keyboard.press('Escape');
  for (const number of ['1', '4', '7']) {
    await chooseAyah(page, number);
    await expect(page.locator(`#ayah-${number}`)).toBeInViewport();
    await expect(word(page, `1:${number}:1`)).toHaveAttribute('aria-pressed', 'true');
  }
  await word(page, '1:5:2').click();
  await expect(selector).toHaveAttribute('data-ayah', '5');
  await openPracticeGrammar(page);
  await expect(selector).toHaveCount(0);
  await page.getByRole('button', { name: 'Study', exact: true }).click();
  await expect(selector).toHaveAttribute('data-ayah', '1');
  await chooseAyah(page, '6');
  await expect(page.locator('#ayah-6')).toBeInViewport();
  await page.getByRole('button', { name: 'Select surah', exact: true }).click();
  await page.locator('[data-surah="1"]').click();
  await expect(selector).toHaveAttribute('data-ayah', '1');
  await expect(page.locator('#ayah-1')).toBeInViewport();
  await word(page, '1:5:2').click();
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await page.getByRole('button', { name: 'Study', exact: true }).click();
  await expect(selector).toHaveAttribute('data-ayah', '1');
  await expect(word(page, '1:1:1')).toHaveAttribute('aria-pressed', 'true');
  await expect(page).toHaveURL(/word=1%3A1%3A1/);
});

test('practice explains mistakes, grades three questions and resets the score', async ({
  page,
}) => {
  await loadStudy(page);
  await openFatihahPractice(page);
  const practice = page.getByRole('region', { name: 'Quick practice', exact: true });
  await expect(practice.locator('.practice-count')).toHaveText('1 / 3');
  await expect(practice.getByRole('button', { name: 'Check answer', exact: true })).toBeDisabled();
  await practice.locator('[data-answer="1:2:1"]').focus();
  await page.keyboard.press('Enter');
  await practice.getByRole('button', { name: 'Check answer', exact: true }).click();
  await expect(practice.getByRole('status')).toContainText('Not quite');
  await expect(practice.locator('.practice-feedback p')).not.toBeEmpty();
  await expect(practice.locator('[data-answer="1:5:2"]')).toHaveClass(/correct/);
  await expect(practice.locator('[data-answer]:disabled')).toHaveCount(3);
  await expect(practice.locator('.practice-feedback')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(practice.getByRole('button', { name: 'Next question', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect
    .poll(() =>
      page.evaluate(() => !!document.activeElement?.closest('.practice-prompt, .practice-options')),
    )
    .toBe(true);
  await practice.locator('[data-answer="imperative"]').click();
  await practice.getByRole('button', { name: 'Check answer', exact: true }).click();
  await expect(practice.getByRole('status')).toContainText('That’s right');
  await practice.getByRole('button', { name: 'Next question', exact: true }).click();
  await practice.locator('[data-answer="hmd"]').click();
  await practice.getByRole('button', { name: 'Check answer', exact: true }).click();
  await practice.getByRole('button', { name: 'Practice complete', exact: true }).click();
  await expect(
    practice.getByRole('heading', { name: 'Practice complete', exact: true }),
  ).toBeFocused();
  await expect(practice.getByRole('status')).toContainText('Correct answers: 1 / 3');
  await expect(practice.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '3');
  await practice.getByRole('button', { name: 'Practice again', exact: true }).click();
  await expect
    .poll(() =>
      page.evaluate(() => !!document.activeElement?.closest('.practice-prompt, .practice-options')),
    )
    .toBe(true);
  await expect(practice.locator('.practice-count')).toHaveText('1 / 3');
  await expect(practice.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  await expect(practice.locator('[data-answer][aria-pressed="true"]')).toHaveCount(0);
  for (const [index, answer] of ['1:5:2', 'imperative', 'abd'].entries()) {
    await practice.locator(`[data-answer="${answer}"]`).click();
    await practice.getByRole('button', { name: 'Check answer', exact: true }).click();
    await practice
      .getByRole('button', {
        name: index === 2 ? 'Practice complete' : 'Next question',
        exact: true,
      })
      .click();
  }
  await expect(practice.getByRole('status')).toContainText('Correct answers: 3 / 3');
  await practice.getByRole('button', { name: 'All topics' }).first().click();
  await expect(page.locator('[data-practice="fatihah"]')).toBeFocused();
});

test('practice grammar lists searchable topics and runs a topic quiz', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await loadStudy(page);
  await openPracticeGrammar(page);
  await expect(page.locator('.bottom-nav button.active')).toHaveText('Practice Grammar');
  const items = page.locator('.topic-item');
  await expect(items.first()).toBeVisible();
  const total = await items.count();
  expect(total).toBeGreaterThan(50);
  const first = items.first();
  await expect(first.locator('strong[lang="ur"]')).not.toBeEmpty();
  await expect(first.locator('.topic-english')).not.toBeEmpty();
  await expect(first.locator('.topic-meta')).toContainText('questions');
  const english = (await first.locator('.topic-english').textContent())!;
  const search = page.getByRole('searchbox', { name: 'Search topics' });
  await search.fill(english);
  await expect(items).not.toHaveCount(total);
  await expect(items.first().locator('.topic-english')).toHaveText(english);
  await expect(page.locator('[data-practice="fatihah"]')).toHaveCount(0);
  await search.fill('zzzz-no-such-topic');
  await expect(page.locator('.topic-empty')).toHaveText('No matching words');
  await page.getByRole('button', { name: 'Clear search' }).click();
  await expect(items).toHaveCount(total);

  const topicId = (await first.getAttribute('data-topic'))!;
  await first.locator('.topic-start').click();
  const quiz = page.locator('.practice-card');
  await expect(quiz).toBeVisible();
  const count = (await quiz.locator('.practice-count').textContent())!;
  const questions = Number(count.split('/')[1]!.trim());
  expect(questions).toBeGreaterThanOrEqual(3);
  await expect(quiz.locator('.practice-prompt')).toHaveAttribute('dir', 'rtl');
  for (const option of await quiz.locator('[data-answer][lang="ar"]').all())
    await expect(option).toHaveCSS('font-family', /Amiri/);
  for (let index = 0; index < questions; index += 1) {
    await expect(quiz.getByRole('button', { name: 'Check answer', exact: true })).toBeDisabled();
    await quiz.locator('[data-answer]').first().click();
    await quiz.getByRole('button', { name: 'Check answer', exact: true }).click();
    await expect(quiz.locator('.practice-feedback p')).not.toBeEmpty();
    await expect(quiz.locator('.practice-option.correct')).toHaveCount(1);
    // A wrong pick is marked separately from the correct answer.
    const picked = await quiz.locator('[data-answer]').first().getAttribute('data-answer');
    const right = await quiz.locator('.practice-option.correct').getAttribute('data-answer');
    await expect(quiz.locator('.practice-option.incorrect')).toHaveCount(picked === right ? 0 : 1);
    if (picked !== right)
      await expect(quiz.locator('.practice-option.incorrect')).toHaveAttribute('data-answer', picked!);
    await quiz
      .getByRole('button', {
        name: index === questions - 1 ? 'Practice complete' : 'Next question',
        exact: true,
      })
      .click();
  }
  await expect(quiz.getByRole('status')).toContainText(`Correct answers: `);
  await expect(quiz.getByRole('status')).toContainText(`/ ${questions}`);
  await quiz.getByRole('button', { name: 'Practice again', exact: true }).click();
  await expect(quiz.locator('.practice-count')).toHaveText(`1 / ${questions}`);
  await quiz.getByRole('button', { name: 'All topics' }).first().click();
  await expect(page.locator(`[data-practice="${topicId}"]`)).toBeFocused();
  await expectNoOverflow(page);
  expect(errors).toEqual([]);
});

test('a word rule opens its topic dialog, examples navigate and practice opens the quiz', async ({
  page,
}) => {
  await loadStudy(page);
  await expect(detail(page).locator('details, summary')).toHaveCount(0);
  await expect(detail(page).getByRole('button', { name: 'View grammar' })).toHaveCount(0);
  // 'genitive' has authored key points and annotated examples (some topics only have the summary).
  const rule = detail(page).locator('.grammar-rule[data-rule="genitive"]');
  await rule.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute('aria-modal', 'true');
  // The dialog shows the canonical library title (lesson rule titles may be phrased differently).
  await expect(dialog.locator('#topic-title')).not.toBeEmpty();
  await expect(dialog.locator('#topic-title')).toBeFocused();
  await expect(dialog.locator('.topic-english')).not.toBeEmpty();
  await expect(dialog.locator('.topic-text p').first()).not.toBeEmpty();
  await expect(dialog.locator('.topic-points li')).not.toHaveCount(0);
  await expect(dialog.locator('.topic-example').first().locator('mark')).not.toBeEmpty();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('hidden');
  // Focus stays in the dialog while tabbing.
  for (let index = 0; index < 4; index += 1) {
    await page.keyboard.press('Shift+Tab');
    expect(await page.evaluate(() => !!document.activeElement?.closest('.topic-dialog'))).toBe(true);
  }
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(rule).toBeFocused();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('');

  // Close button, then an example word navigates the study view.
  await rule.click();
  await expect(topicDialog(page)).toBeVisible();
  await topicDialog(page).getByRole('button', { name: 'Close', exact: true }).click();
  await expect(topicDialog(page)).toHaveCount(0);
  await rule.click();
  const example = topicDialog(page).locator('[data-example-word], .topic-reference').last();
  await expect(example).toBeVisible();
  const target =
    (await example.getAttribute('data-example-word')) ||
    (await example.locator('xpath=ancestor::li[1]').getAttribute('data-example'))!;
  await example.click();
  await expect(topicDialog(page)).toHaveCount(0);
  await expect(page).toHaveURL(new RegExp(`word=${encodeURIComponent(target)}`));
  await expect(word(page, target)).toHaveAttribute('aria-pressed', 'true');
  await expect(word(page, target)).toBeInViewport();

  // Practice this topic opens the topic quiz in Practice Grammar.
  await detail(page).locator('.grammar-rule').first().click();
  const topicTitle = (await topicDialog(page).locator('.topic-english').textContent())!;
  await topicDialog(page).getByRole('button', { name: 'Practice this topic', exact: true }).click();
  await expect(topicDialog(page)).toHaveCount(0);
  await expect(page.locator('.bottom-nav button.active')).toHaveText('Practice Grammar');
  await expect(page.getByRole('region', { name: topicTitle, exact: true })).toBeVisible();
  await expect(page.locator('.practice-card .practice-prompt')).toBeFocused();
  // The topic list's open-topic button shows the same dialog.
  await page.locator('.practice-card').getByRole('button', { name: 'All topics' }).first().click();
  const open = page.locator('.topic-item').first().locator('.topic-open');
  await open.click();
  await expect(topicDialog(page)).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(open).toBeFocused();
});

test('all verses and words retain root meanings and the four verb paradigms', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await loadStudy(page);
  await expectFloatingNavigation(page);
  const inspectorNavigation = await detail(page).locator('.detail-navigation').boundingBox();
  expect(inspectorNavigation!.y + inspectorNavigation!.height).toBeLessThanOrEqual(
    page.viewportSize()!.height,
  );
  await expect(page.locator('.ayah')).toHaveCount(7);
  await expect(page.locator('.ayah-translation')).toHaveCount(7);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  await expect(page.locator('.ayah-number')).toHaveText(['1', '2', '3', '4', '5', '6', '7']);
  await expect(detail(page).locator('.detail-navigation')).toContainText('1 / 29');
  await expect(page.getByRole('button', { name: 'Filters', exact: true })).toHaveAttribute(
    'aria-expanded',
    'false',
  );
  await expect(page.locator('#filter-panel, .meaning-toggle, .ayah-nav')).toHaveCount(0);
  const ids = await page
    .locator('.quran-word')
    .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-word-id')!));
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
    for (const title of await detail(page).locator('.grammar-rule-title').allTextContents())
      rules.add(title);
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
    await expect
      .poll(async () => withoutMarks(await detail(page).locator('.baab-title').textContent()))
      .toContain(baab!);
    await expect(detail(page).locator('.verb-paradigm')).toContainText(past!);
    await expect(detail(page).locator('.verb-paradigm')).toContainText(present!);
    await expect(detail(page).locator('.verb-paradigm .pattern dd')).not.toBeEmpty();
  }
  expect(errors).toEqual([]);
});

test('segments, related words, rules and bounded word navigation work', async ({ page }) => {
  await loadStudy(page);
  await expect(
    detail(page).getByRole('button', { name: 'Previous word', exact: true }),
  ).toBeDisabled();
  await detail(page).locator('[data-segment="0"]').click();
  await expect(detail(page).locator('.segment-explanation')).toBeVisible();
  await expect(detail(page).locator('[data-segment="0"]')).toHaveAttribute('aria-pressed', 'true');
  const rule = detail(page).locator('.grammar-rule').first();
  await expect(rule).toHaveAttribute('aria-haspopup', 'dialog');
  await rule.click();
  await expect(topicDialog(page)).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(rule).toBeFocused();
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

test('filters and meaning toggle preserve verses while search UI is removed', async ({ page }) => {
  await loadStudy(page);
  await expect(page.getByRole('searchbox')).toHaveCount(0);
  const picker = page.getByRole('button', { name: 'Select surah', exact: true });
  await picker.focus();
  await page.keyboard.press('/');
  await expect(picker).toBeFocused();
  await openFilters(page);
  await page.locator('[data-pos="verb"]').click();
  await expect(page.locator('.quran-word.matched')).toHaveCount(4);
  await expect(page.locator('.filter-feedback')).toContainText('4 matches');
  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  await expect(page.locator('#filter-panel')).toHaveCount(0);
  await expect(page.locator('.quran-word.matched')).toHaveCount(4);
  await openFilters(page);
  await expect(page.locator('.quran-word')).toHaveCount(29);
  await expect(page.locator('.ayah')).toHaveCount(7);
  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(page.locator('[data-pos="all"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.filter-feedback')).toHaveCount(0);
  await page.locator('.meaning-toggle').click();
  await expect(page.getByRole('checkbox', { name: 'Show word meanings' })).not.toBeChecked();
  await expect(page.locator('.word-meaning')).toHaveCount(0);
  await expect(page.locator('.ayah-translation')).toHaveCount(7);
  await page.locator('.meaning-toggle').click();
  await expect(page.getByRole('checkbox', { name: 'Show word meanings' })).toBeChecked();
  await expect(page.locator('.word-meaning')).toHaveCount(29);
});

test('practice grammar replaces the per-ayah grammar cards, with no references interface', async ({
  page,
}) => {
  await loadStudy(page);
  await expect(page.locator('.bottom-nav button')).toHaveText(navLabels);
  await expect(page.getByRole('button', { name: /حوالہ جات|Sources|References/ })).toHaveCount(0);
  await expect(page.locator('a[href^="https://"]')).toHaveCount(0);
  await expect(
    page.locator('.page-footer, .reading-caption, .surah-stats, .breadcrumb'),
  ).toHaveCount(0);
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  // About credits exactly the two sources: the required Corpus link and Quran.com.
  expect(
    await page.locator('.settings-view a').evaluateAll((links) => links.map((link) => link.getAttribute('href'))),
  ).toEqual(['https://corpus.quran.com', 'https://quran.com']);
  await openPracticeGrammar(page);
  await expect(page.getByText('مختصر تفسیری نوٹ')).toHaveCount(0);
  await expect(page.getByText('نحوی ترکیب')).toHaveCount(0);
  await expect(page.locator('.practice-view a')).toHaveCount(0);
  await page.getByRole('button', { name: 'Study', exact: true }).click();
  await chooseAyah(page, '7');
  await expect(page.locator('#ayah-7')).toBeInViewport();
});

test('ayah picker searches numbers, jumps from the grid or Enter and closes with Escape', async ({
  page,
}) => {
  test.setTimeout(60000);
  await page.goto('/#surah=4');
  await expect(page.locator('.quran-word')).toHaveCount(3747, { timeout: 20000 });
  const chip = ayahChip(page);
  await expect(chip).toHaveAttribute('aria-haspopup', 'dialog');
  await chip.click();
  const picker = ayahPicker(page);
  const search = picker.getByRole('textbox', { name: 'Go to ayah number', exact: true });
  const grid = picker.locator('.ayah-grid');
  await expect(search).toBeFocused();
  await expect(search).toHaveAttribute('inputmode', 'numeric');
  await expect(grid.locator('button')).toHaveCount(176);
  await expect(grid.locator('[aria-current="true"]')).toHaveText('1');
  // A dense grid: several numbers per row inside the anchored popover.
  expect(
    await grid.evaluate((node) => getComputedStyle(node).gridTemplateColumns.split(' ').length),
  ).toBeGreaterThanOrEqual(5);
  await expectNoOverflow(page);

  await search.fill('15');
  await expect(grid.locator('button')).toHaveText([
    '15', '150', '151', '152', '153', '154', '155', '156', '157', '158', '159',
  ]);
  // Urdu and Arabic-Indic digits search the same numbers.
  await search.fill('۱۵');
  await expect(grid.locator('button')).toHaveCount(11);
  await search.fill('١٥٣');
  await expect(grid.locator('button')).toHaveText(['153']);
  await search.fill('999');
  await expect(picker.getByRole('status')).toHaveText('No ayah with that number');
  await expect(grid).toHaveCount(0);

  // Enter on an exact valid number jumps directly.
  await search.fill('123');
  await search.press('Enter');
  await expect(picker).not.toBeVisible();
  await expect(chip).toBeFocused();
  await expect(chip).toHaveAttribute('data-ayah', '123');
  await expect(chip).toContainText('123');
  await expect(page.locator('#ayah-123')).toBeInViewport();
  await expect(word(page, '4:123:1')).toHaveAttribute('aria-pressed', 'true');
  await expect(page).toHaveURL(/word=4%3A123%3A1/);

  // Reopening clears the search and scrolls the current ayah into view.
  await chip.click();
  await expect(search).toHaveValue('');
  await expect(grid.locator('[aria-current="true"]')).toHaveText('123');
  await expect(grid.locator('[aria-current="true"]')).toBeInViewport();
  // Arrow keys move through the grid; Enter selects the focused number.
  await search.press('ArrowDown');
  await expect(grid.locator('[data-ayah="123"]')).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(grid.locator('[data-ayah="124"]')).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await expect(grid.locator('[data-ayah="122"]')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(picker).not.toBeVisible();
  await expect(chip).toHaveAttribute('data-ayah', '122');
  await expect(page.locator('#ayah-122')).toBeInViewport();

  // Escape closes without changing the ayah and returns focus to the chip.
  await chip.click();
  await expect(picker).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(picker).not.toBeVisible();
  await expect(chip).toBeFocused();
  await expect(chip).toHaveAttribute('data-ayah', '122');

  // A click outside the popover closes it.
  await chip.click();
  await expect(picker).toBeVisible();
  await page.mouse.click(10, 500);
  await expect(picker).not.toBeVisible();

  // Clicking a grid number jumps to it.
  await chip.click();
  await search.fill('17');
  await grid.locator('[data-ayah="176"]').click();
  await expect(picker).not.toBeVisible();
  await expect(chip).toHaveAttribute('data-ayah', '176');
  await expect(page.locator('#ayah-176')).toBeInViewport();
});

for (const width of [320, 390, 768, 1280]) {
  test(`ayah picker fits the ${width}px viewport in English and Urdu`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/#surah=18');
    await expect(page.locator('.quran-word')).toHaveCount(1579, { timeout: 20000 });
    for (const [chipName, searchName] of [
      ['Select ayah', 'Go to ayah number'],
      ['آیت منتخب کریں', 'آیت نمبر پر جائیں'],
    ]) {
      if (chipName !== 'Select ayah') {
        await page.getByRole('button', { name: 'Settings', exact: true }).click();
        await page.getByRole('button', { name: 'اردو', exact: true }).click();
        await page.locator('.bottom-nav button').first().click();
      }
      await ayahChip(page, chipName).click();
      const picker = ayahPicker(page, chipName);
      await expect(picker).toBeVisible();
      await expect(picker.getByRole('textbox', { name: searchName })).toBeFocused();
      await expectNoOverflow(page);
      const box = (await picker.boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width + 0.5);
      expect(box.y + box.height).toBeLessThanOrEqual(800 + 0.5);
      if (width <= 600) expect(Math.round(box.width)).toBe(width);
      const grid = picker.locator('.ayah-grid');
      expect(
        await grid.evaluate((node) => node.scrollWidth <= node.clientWidth),
      ).toBe(true);
      expect(
        await grid.evaluate((node) => getComputedStyle(node).gridTemplateColumns.split(' ').length),
      ).toBeGreaterThanOrEqual(5);
      await picker.getByRole('textbox', { name: searchName }).fill('۱۱۰');
      await expect(grid.locator('button')).toHaveText([chipName === 'Select ayah' ? '110' : '۱۱۰']);
      await page.keyboard.press('Enter');
      await expect(picker).not.toBeVisible();
      await expect(page.locator('#ayah-110')).toBeInViewport();
      await expectNoOverflow(page);
    }
  });
}

test('valid and invalid deep links select safely and hash changes are respected', async ({
  page,
}) => {
  await loadStudy(page, '#word=1%3A5%3A2');
  await expect(word(page, '1:5:2')).toHaveAttribute('aria-pressed', 'true');
  await page.evaluate(() => {
    location.hash = 'word=1%3A6%3A1';
  });
  await expect(word(page, '1:6:1')).toHaveAttribute('aria-pressed', 'true');
  await page.evaluate(() => {
    location.hash = 'word=invalid';
  });
  await expect(word(page, '1:1:1')).toHaveAttribute('aria-pressed', 'true');
});

test('API failure is recoverable by the retry control', async ({ page }) => {
  await page.route('**/api/v1/surahs/1', (route) => route.abort());
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Could not load the study content.' }),
  ).toBeVisible();
  await expect(page.locator('.quran-word')).toHaveCount(0);
  await page.unroute('**/api/v1/surahs/1');
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.locator('.quran-word')).toHaveCount(29);
});

for (const width of [390, 1440]) {
  test(`ayah deep links select and scroll to the requested occurrence at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/#surah=105&ayah=4');
    const selector = ayahChip(page);
    await expect(page.locator('.quran-word')).toHaveCount(23);
    await expect(word(page, '105:4:1')).toHaveAttribute('aria-pressed', 'true');
    await expect(selector).toHaveAttribute('data-ayah', '4');
    await expect(page.locator('#ayah-4')).toBeInViewport();
    await expect(page.locator('.word-sheet[open]')).toHaveCount(0);
    await page.evaluate(() => { location.hash = 'surah=105&ayah=2'; });
    await expect(word(page, '105:2:1')).toHaveAttribute('aria-pressed', 'true');
    await expect(selector).toHaveAttribute('data-ayah', '2');
    await expect(page.locator('#ayah-2')).toBeInViewport();
  });
}

test('invalid ayah links fall back safely and an explicit word takes precedence', async ({ page }) => {
  await loadStudy(page);
  for (const ayah of ['999', '-2', '2.5', 'NaN', '9007199254740992']) {
    await page.evaluate((value) => { location.hash = `surah=1&ayah=${value}`; }, ayah);
    await expect(word(page, '1:1:1')).toHaveAttribute('aria-pressed', 'true');
  }
  await page.evaluate(() => { location.hash = 'surah=1&ayah=2&word=1%3A5%3A2'; });
  await expect(word(page, '1:5:2')).toHaveAttribute('aria-pressed', 'true');
  await expect(ayahChip(page)).toHaveAttribute('data-ayah', '5');
});

for (const width of [320, 390, 768]) {
  test(`mobile ${width}px sheet preserves reading position, keyboard focus and full content`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await loadStudy(page);
    await expectNoOverflow(page);
    await expectFloatingNavigation(page);
    await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
    const lastTranslation = await page.locator('#ayah-7 .ayah-translation').boundingBox();
    const navBox = await page.locator('.bottom-nav').boundingBox();
    expect(lastTranslation!.y + lastTranslation!.height).toBeLessThanOrEqual(navBox!.y - 8);
    await page.getByRole('button', { name: 'Select surah', exact: true }).click();
    const picker = page.getByRole('dialog', { name: 'Select surah', exact: true });
    await expect(picker).toBeVisible();
    await expectNoOverflow(page);
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('hidden');
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: 'Select surah', exact: true })).toBeFocused();
    const ayahSelect = ayahChip(page);
    await ayahSelect.focus();
    await chooseAyah(page, '5');
    await expect(ayahSelect).toBeFocused();
    await expect(page.locator('.word-sheet')).not.toBeVisible();
    await openFilters(page);
    await expectNoOverflow(page);
    await page.getByRole('button', { name: 'Filters', exact: true }).click();
    const trigger = word(page, '1:5:2');
    await trigger.scrollIntoViewIfNeeded();
    const readingY = await page.evaluate(() => scrollY);
    await trigger.click();
    const sheet = page.getByRole('dialog');
    await expect(sheet).toBeVisible();
    await expect
      .poll(async () => withoutMarks(await sheet.locator('.baab-title').textContent()))
      .toContain('نصر');
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('hidden');
    await expectNoOverflow(page);
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => !!document.activeElement?.closest('dialog'))).toBe(true);
    await sheet.locator('.detail-scroll').evaluate((node) => {
      node.scrollTop = node.scrollHeight;
    });
    await sheet.getByRole('button', { name: 'Next word', exact: true }).click();
    await expect(word(page, '1:5:3')).toHaveAttribute('aria-pressed', 'true');
    await expect
      .poll(() => sheet.locator('.detail-scroll').evaluate((node) => node.scrollTop))
      .toBe(0);
    await page.keyboard.press('Escape');
    await expect(sheet).not.toBeVisible();
    await expect(trigger).toBeFocused();
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('');
    expect(Math.abs((await page.evaluate(() => scrollY)) - readingY)).toBeLessThan(2);
    await trigger.click();
    await page.mouse.click(4, 4);
    await expect(sheet).not.toBeVisible();
    await expect(trigger).toBeFocused();
    await trigger.click();
    await sheet.locator('.grammar-rule').first().click();
    const topic = topicDialog(page);
    await expect(topic).toBeVisible();
    if (width <= 600) {
      const box = (await topic.boundingBox())!;
      expect(box.width).toBe(width);
      expect(box.height).toBeGreaterThanOrEqual(840);
    }
    await expect
      .poll(() => topic.locator('.topic-body').evaluate((node) => node.scrollHeight > node.clientHeight))
      .toBe(true);
    await expectNoOverflow(page);
    await page.keyboard.press('Escape');
    await expect(topic).toHaveCount(0);
    await expect(sheet).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(sheet).not.toBeVisible();
    await openFatihahPractice(page);
    await expect(page.locator('.practice-card')).toBeVisible();
    await expectNoOverflow(page);
    await page.getByRole('button', { name: 'Settings', exact: true }).click();
    await expectNoOverflow(page);
    await expectFloatingNavigation(page);
    await page.getByRole('button', { name: 'اردو', exact: true }).click();
    await expectNoOverflow(page);
    await page.getByRole('button', { name: 'مطالعہ', exact: true }).click();
    await page.getByRole('button', { name: 'فلٹر', exact: true }).click();
    await expect(page.locator('#filter-panel')).toBeVisible();
    await expectNoOverflow(page);
  });
}

test('mobile deep link opens its word and closes without losing access to the page', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await loadStudy(page, '#word=1%3A6%3A1');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect
    .poll(async () =>
      withoutMarks(await page.getByRole('dialog').locator('.baab-title').textContent()),
    )
    .toContain('ضرب');
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await chooseAyah(page, '6');
  await expect(page.locator('#ayah-6')).toBeInViewport();
});

test('interface language persists while Arabic text and Urdu study content stay unchanged', async ({
  page,
}) => {
  await loadStudy(page);
  const arabic = await page.locator('.quran-word .arabic').allTextContents();
  const meanings = await page.locator('.word-meaning').allTextContents();
  const translations = await page.locator('.ayah-translation').allTextContents();
  const rootMeaning = await detail(page).locator('.root-meaning p').allTextContents();
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await expect(page.getByRole('button', { name: 'English', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.getByRole('button', { name: 'اردو', exact: true }).click();
  await expect(page.locator('.bottom-nav button')).toHaveText(['مطالعہ', 'گرامر کی مشق', 'ترتیبات']);
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
  await expect(page.locator('.filter-feedback')).toContainText('۴ نتائج');
  await ayahChip(page, 'آیت منتخب کریں').click();
  await expect(ayahPicker(page, 'آیت منتخب کریں')).toHaveAttribute('dir', 'rtl');
  await expect(
    ayahPicker(page, 'آیت منتخب کریں').getByRole('textbox', { name: 'آیت نمبر پر جائیں' }),
  ).toBeFocused();
  await expect(ayahPicker(page, 'آیت منتخب کریں').locator('.ayah-grid button')).toHaveText(
    ['۱', '۲', '۳', '۴', '۵', '۶', '۷'],
  );
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'سورت منتخب کریں', exact: true }).click();
  await expect(page.locator('[data-surah="1"]')).toContainText('الفاتحة');
  await expect(page.locator('[data-surah="3"]')).toContainText('۲۰۰ آیات');
  await expect(page.locator('.catalog-dialog')).not.toContainText('دستیاب');
  await page.keyboard.press('Escape');
  await openFatihahPractice(page, 'گرامر کی مشق');
  const practice = page.getByRole('region', { name: 'مختصر مشق', exact: true });
  await expect(practice.locator('.practice-count')).toHaveText('۱ / ۳');
  await practice.locator('[data-answer="1:5:2"]').click();
  await practice.getByRole('button', { name: 'جواب دیکھیں', exact: true }).click();
  await expect(practice.getByRole('status')).toContainText('درست جواب');
  await page.getByRole('button', { name: 'ترتیبات', exact: true }).click();
  await page.getByRole('button', { name: 'English', exact: true }).click();
  await page.reload();
  await expect(page.locator('.bottom-nav button')).toHaveText(navLabels);
  await expect(page.locator('.ayah-number')).toHaveText(['1', '2', '3', '4', '5', '6', '7']);
  expect(await page.evaluate((key) => localStorage.getItem(key), preferenceKey)).toBe('en');
});

test('reading layout switches persist and change the study text in both layouts', async ({
  page,
}) => {
  await loadStudy(page);
  const arabic = await page.locator('.quran-word .arabic').allTextContents();
  const settings = () => page.getByRole('button', { name: 'Settings', exact: true }).click();
  const study = () => page.getByRole('button', { name: 'Study', exact: true }).click();
  const grammar = page.getByRole('switch', { name: /Word-by-word grammar/ });
  const translation = page.getByRole('switch', { name: /^Translation/ });
  await settings();
  await expect(page.getByRole('heading', { name: 'Reading layout' })).toBeVisible();
  await expect(grammar).toBeChecked();
  await expect(translation).toBeChecked();

  // Translation off keeps the word blocks.
  await translation.uncheck();
  await study();
  await expect(page.locator('.quran-word')).toHaveCount(29);
  await expect(page.locator('.ayah-translation')).toHaveCount(0);

  // Grammar off: continuous Quranic text, no word blocks, filters hidden.
  await settings();
  await grammar.uncheck();
  await study();
  // With translation also off, the whole chapter flows as one continuous Quranic text.
  await expect(page.locator('.quran-word, .word-meaning, .word-kind')).toHaveCount(0);
  await expect(page.locator('.ayah-text')).toHaveCount(1);
  await expect(page.locator('.mushaf-text .plain-ayah')).toHaveCount(7);
  await expect(page.locator('.ayah-text')).toHaveAttribute('lang', 'ar');
  await expect(page.locator('.ayah-text')).toHaveCSS('font-family', /Amiri/);
  await expect(page.locator('.ayah-end')).toHaveText(['١', '٢', '٣', '٤', '٥', '٦', '٧']);
  await expect(page.locator('.ayah-translation')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Filters', exact: true })).toHaveCount(0);
  expect(await page.locator('.plain-word').allTextContents()).toEqual(arabic);
  await expectNoOverflow(page);

  // Ayah jumps and word selection still work in the plain layout.
  const selector = ayahChip(page);
  await chooseAyah(page, '6');
  await expect(page.locator('#ayah-6')).toBeInViewport();
  await word(page, '1:5:2').click();
  await expect(word(page, '1:5:2')).toHaveAttribute('aria-pressed', 'true');
  await expect(detail(page).locator('#detail-title')).toHaveText(
    (await word(page, '1:5:2').textContent())!,
  );

  // Translation on in the plain layout.
  await settings();
  await translation.check();
  await study();
  await expect(page.locator('.plain-ayah .ayah-translation')).toHaveCount(7);
  await expect(page.locator('.ayah-text')).toHaveCount(7);
  await chooseAyah(page, '4');
  await expect(page.locator('#ayah-4')).toBeInViewport();

  // Preferences persist and #ayah deep links work in the plain layout.
  expect(
    await page.evaluate(() => localStorage.getItem('quran-grammar.reading-layout')),
  ).toBe('{"grammar":false,"translation":true}');
  await page.goto('/#surah=18&ayah=60');
  await expect(page.locator('.plain-ayah')).toHaveCount(110, { timeout: 30000 });
  await expect(page.locator('#ayah-60')).toBeInViewport();
  await expect(selector).toHaveAttribute('data-ayah', '60');

  await settings();
  await grammar.check();
  await study();
  await expect(page.locator('.quran-word').first()).toBeVisible();
  await expect(page.locator('.ayah-translation')).toHaveCount(110);
});

test('invalid saved language falls back to English', async ({ page }) => {
  await page.addInitScript((key) => localStorage.setItem(key, 'invalid-language'), preferenceKey);
  await loadStudy(page);
  await expect(page.locator('.bottom-nav button')).toHaveText(navLabels);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('blocked storage does not prevent study or changing the current interface language', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new DOMException('Storage blocked', 'SecurityError');
      },
    });
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

const newChapters = [
  [105, 5, 23],
  [106, 4, 17],
  [107, 7, 25],
  [108, 3, 10],
  [109, 6, 26],
  [110, 3, 19],
  [111, 5, 23],
  [112, 4, 15],
  [113, 5, 23],
  [114, 6, 20],
] as const;

test('all ten new chapters use their own words, root details, grammar rules and ayah selector', async ({
  page,
}) => {
  test.setTimeout(90000);
  await loadStudy(page);
  for (const [number, ayahs, words] of newChapters) {
    await page.getByRole('button', { name: 'Select surah', exact: true }).click();
    await page.locator(`[data-surah="${number}"]`).click();
    await expect(page.locator('.quran-word')).toHaveCount(words);
    const ids = await page
      .locator('.quran-word')
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-word-id')!));
    expect(ids.every((id) => id.startsWith(`${number}:`))).toBe(true);
    await expectAyahNumbers(page, ayahs);
    await expect(detail(page).locator('.detail-navigation')).toContainText(`1 / ${words}`);
    await expect(
      detail(page).getByRole('button', { name: 'Previous word', exact: true }),
    ).toBeDisabled();
    for (const id of ids) {
      const button = word(page, id);
      const arabic = await button.locator('.arabic').textContent();
      await button.click();
      await expect(detail(page).locator('#detail-title')).toHaveText(arabic!);
      await expect(detail(page).locator('.detail-translation')).not.toBeEmpty();
      await expect(detail(page).locator('.grammar-rule')).not.toHaveCount(0);
      if (await button.evaluate((node) => node.classList.contains('verb'))) {
        await expect(detail(page).locator('.baab-title')).not.toBeEmpty();
        await expect(detail(page).locator('.verb-paradigm')).toBeVisible();
      }
    }
    await expect(
      detail(page).getByRole('button', { name: 'Next word', exact: true }),
    ).toBeDisabled();
    await chooseAyah(page, String(ayahs));
    await expect(page.locator(`#ayah-${ayahs}`)).toBeInViewport();
    await page.getByRole('button', { name: 'Study', exact: true }).click();
    await expect(word(page, `${number}:1:1`)).toHaveAttribute('aria-pressed', 'true');
  }
});

const fiveChapters = [
  [18, 110, 1579, 'Al-Kahf'],
  [23, 118, 1050, "Al-Mu'minun"],
  [32, 30, 372, 'As-Sajdah'],
  [36, 83, 725, 'Ya-Sin'],
  [55, 78, 351, 'Ar-Rahman'],
] as const;

test('five longer chapters load complete lessons with grammar rules and paradigms', async ({
  page,
}) => {
  test.setTimeout(180000);
  await loadStudy(page);
  for (const [number, ayahs, words, title] of fiveChapters) {
    await page.getByRole('button', { name: 'Select surah', exact: true }).click();
    await page.locator(`[data-surah="${number}"]`).click();
    await expect(page.locator('.quran-word')).toHaveCount(words);
    await expect(page.locator('.collection-trigger')).toContainText(title);
    const ids = await page
      .locator('.quran-word')
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-word-id')!));
    expect(ids.every((id) => id.startsWith(`${number}:`))).toBe(true);
    expect(new Set(ids).size).toBe(words);
    await expectAyahNumbers(page, ayahs);
    await expect(detail(page).locator('.detail-navigation')).toContainText(`1 / ${words}`);
    const verbIds = await page
      .locator('.quran-word.verb')
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-word-id')!));
    const sample = [
      ids[0],
      ids[1],
      verbIds[0],
      verbIds[Math.floor(verbIds.length / 2)],
      ids.at(-1)!,
    ];
    for (const id of sample) {
      const button = word(page, id);
      const arabic = await button.locator('.arabic').textContent();
      await button.scrollIntoViewIfNeeded();
      await button.click();
      await expect(detail(page).locator('#detail-title')).toHaveText(arabic!);
      await expect(detail(page).locator('.detail-translation')).not.toBeEmpty();
      await expect(detail(page).locator('.grammar-rule')).not.toHaveCount(0);
      if (verbIds.includes(id)) {
        await expect(detail(page).locator('.baab-title')).not.toBeEmpty();
        await expect(detail(page).locator('.verb-paradigm')).toBeVisible();
      }
    }
    await chooseAyah(page, String(ayahs));
    await expect(page.locator(`#ayah-${ayahs}`)).toBeInViewport();
    await page.getByRole('button', { name: 'Study', exact: true }).click();
  }
});

test('the surah list searches loose names, numbers and surah:ayah from the keyboard', async ({
  page,
}) => {
  await loadStudy(page);
  const trigger = page.getByRole('button', { name: 'Select surah', exact: true });
  const selector = ayahChip(page);
  const catalog = page.getByRole('dialog', { name: 'Select surah', exact: true });
  const search = catalog.getByRole('searchbox', { name: 'Search surahs by name or number' });
  const rows = catalog.locator('[data-surah]');
  await trigger.click();
  // A fine pointer focuses the search field; the current chapter is marked.
  await expect(search).toBeFocused();
  await expect(search).toHaveAttribute('placeholder', 'Search name or number, e.g. 2:255');
  await expect(catalog.getByRole('heading', { name: 'Available' })).toHaveCount(0);
  await expect(catalog).not.toContainText('Available');
  await expect(catalog.locator('[aria-current="true"]')).toHaveAttribute('data-surah', '1');
  const baqarah = catalog.locator('[data-surah="2"]');
  await expect(baqarah).toContainText('Al-Baqarah');
  await expect(baqarah).toContainText('The Cow · 286 ayahs');
  await expect(baqarah.locator('.catalog-arabic')).toHaveText('البقرة');
  expect((await baqarah.boundingBox())!.height).toBeGreaterThanOrEqual(56);

  for (const [query, surah, name] of [
    ['bakra', 2, 'Al-Baqarah'],
    ['36', 36, 'Ya-Sin'],
    ['rehman', 55, 'Ar-Rahman'],
    ['yaseen', 36, 'Ya-Sin'],
    ['ikhlaas', 112, 'Al-Ikhlas'],
    ['the cow', 2, 'Al-Baqarah'],
    ['البقرہ', 2, 'Al-Baqarah'],
    ['۳۶', 36, 'Ya-Sin'],
  ] as const) {
    await search.fill(query);
    await expect(rows.first(), query).toHaveAttribute('data-surah', String(surah));
    await expect(rows.first()).toContainText(name);
    await expect(rows.first()).toHaveClass(/is-suggested/);
  }
  await search.fill('36');
  await expect(rows).toHaveCount(1);
  await expect(catalog.getByRole('status')).toHaveText('1 matches');
  await search.fill('2');
  await expect(rows.first()).toHaveAttribute('data-surah', '2');
  await expect(rows).toHaveCount(11);

  // Empty state, then Escape clears the search before it closes the dialog.
  await search.fill('qwertyuiop');
  await expect(rows).toHaveCount(0);
  await expect(catalog.locator('.catalog-empty')).toContainText('No surah matches your search');
  await page.keyboard.press('Escape');
  await expect(catalog).toBeVisible();
  await expect(search).toHaveValue('');
  await expect(search).toBeFocused();
  await expect(rows).toHaveCount(114);
  // The clear button empties the field and keeps focus there.
  await search.fill('kahf');
  await expect(rows.first()).toHaveAttribute('data-surah', '18');
  await catalog.getByRole('button', { name: 'Clear search', exact: true }).click();
  await expect(search).toHaveValue('');
  await expect(search).toBeFocused();
  // Arrow keys move between the search field and the rows; typing on a row searches again.
  await search.fill('yasin');
  await page.keyboard.press('ArrowDown');
  await expect(catalog.locator('[data-surah="36"]')).toBeFocused();
  await page.keyboard.press('ArrowUp');
  await expect(search).toBeFocused();
  await search.fill('');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await expect(catalog.locator('[data-surah="2"]')).toBeFocused();
  await page.keyboard.press('End');
  await expect(catalog.locator('[data-surah="114"]')).toBeFocused();
  await page.keyboard.press('k');
  await expect(search).toBeFocused();
  await expect(search).toHaveValue('k');
  await page.keyboard.press('Escape');
  await page.keyboard.press('Escape');
  await expect(catalog).not.toBeVisible();
  await expect(trigger).toBeFocused();

  // Enter opens the top result.
  await trigger.click();
  await search.fill('rehman');
  await page.keyboard.press('Enter');
  await expect(catalog).not.toBeVisible();
  await expect(page.locator('.collection-trigger')).toContainText('Ar-Rahman');
  expect(page.url()).toContain('#surah=55');
  await expect(word(page, '55:1:1')).toBeVisible();

  // "2:255" opens Al-Baqarah at Ayat al-Kursi.
  await trigger.click();
  await search.fill('2:255');
  await expect(rows).toHaveCount(1);
  await expect(rows.first()).toContainText('Ayah 255');
  await page.keyboard.press('Enter');
  await expect(catalog).not.toBeVisible();
  await expect(page.locator('.collection-trigger')).toContainText('Al-Baqarah');
  await expect(selector).toHaveAttribute('data-ayah', '255');
  await expect(page.locator('#ayah-255')).toBeInViewport();
  expect(page.url()).toContain('#surah=2&ayah=255');
  // A name with an ayah, chosen by click.
  await trigger.click();
  await search.fill('kahf 10');
  await catalog.locator('[data-surah="18"]').click();
  await expect(selector).toHaveAttribute('data-ayah', '10');
  await expect(page.locator('#ayah-10')).toBeInViewport();
  await expectNoOverflow(page);
});

test('the surah search works in the Urdu interface and on a phone', async ({ page }) => {
  await page.addInitScript((key) => localStorage.setItem(key, 'ur'), preferenceKey);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('.quran-word')).toHaveCount(29);
  await page.getByRole('button', { name: 'سورت منتخب کریں', exact: true }).click();
  const catalog = page.getByRole('dialog', { name: 'سورت منتخب کریں', exact: true });
  await expect(catalog).toHaveAttribute('dir', 'rtl');
  const search = catalog.getByRole('searchbox', { name: 'سورت کا نام یا نمبر تلاش کریں' });
  await expect(search).toHaveAttribute('dir', 'rtl');
  await expect(catalog.locator('[data-surah="2"]')).toContainText('البقرة');
  await expect(catalog.locator('[data-surah="2"]')).toContainText('Al-Baqarah · ۲۸۶ آیات');
  await expect(catalog.locator('[data-surah="2"] .catalog-number')).toHaveText('۲');
  await search.fill('یٰسین');
  await expect(catalog.locator('[data-surah]').first()).toHaveAttribute('data-surah', '36');
  // Latin typed in the Urdu interface reads left to right.
  await search.fill('bakra');
  await expect(search).toHaveAttribute('dir', 'ltr');
  await expect(catalog.locator('[data-surah]').first()).toHaveAttribute('data-surah', '2');
  await search.fill('۲:۲۵۵');
  await expect(catalog.locator('[data-surah="2"]')).toContainText('آیت ۲۵۵');
  await expect(catalog.getByRole('status')).toHaveText('۱ نتائج');
  await search.fill('xyzq');
  await expect(catalog.locator('.catalog-empty')).toContainText('تلاش سے کوئی سورت نہیں ملی');
  await expectNoOverflow(page);
  await search.fill('۲:۲۵۵');
  await page.keyboard.press('Enter');
  await expect(catalog).not.toBeVisible();
  await expect(ayahChip(page, 'آیت منتخب کریں')).toHaveAttribute('data-ayah', '255');
});

test('juz previews open a chapter at its first ayah inside that juz', async ({ page }) => {
  await loadStudy(page);
  const trigger = page.locator('.collection-trigger');
  const selector = ayahChip(page);
  // Complete juz hold several chapters, so the juz lists them and one is chosen.
  const openJuz = async (number: number, surah: number, chapters: number[]) => {
    await trigger.click();
    await page.getByRole('dialog').getByRole('button', { name: 'Juz', exact: true }).click();
    const catalog = page.getByRole('dialog', { name: 'Select juz', exact: true });
    await expect(catalog).not.toContainText('Available');
    await expect(catalog.locator(`[data-juz="${number}"]`)).not.toContainText('Partial preview');
    await catalog.locator(`[data-juz="${number}"]`).click();
    expect(
      await catalog.locator('[data-surah]').evaluateAll((nodes) => nodes.map((node) => Number(node.getAttribute('data-surah')))),
    ).toEqual(chapters);
    await catalog.locator(`[data-surah="${surah}"]`).click();
    await expect(catalog).not.toBeVisible();
  };
  await openJuz(16, 18, [18, 19, 20]);
  await expect(page.locator('.quran-word')).toHaveCount(1579);
  await expect(selector).toHaveAttribute('data-ayah', '75');
  await expect(word(page, '18:75:1')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#ayah-75')).toBeInViewport();
  await expect(trigger).toContainText('Juz 16');
  await expect(trigger).toContainText('Al-Kahf');
  expect(page.url()).toContain('#surah=18&ayah=75');
  await chooseAyah(page, '74');
  await expect(trigger).toContainText('Juz 15');
  await openJuz(15, 18, [17, 18]);
  await expect(selector).toHaveAttribute('data-ayah', '1');
  await expect(trigger).toContainText('Juz 15');
  await openJuz(23, 36, [36, 37, 38, 39]);
  await expect(page.locator('.quran-word')).toHaveCount(725);
  await expect(selector).toHaveAttribute('data-ayah', '28');
  await expect(word(page, '36:28:1')).toHaveAttribute('aria-pressed', 'true');
  await expect(trigger).toContainText('Juz 23');
  await expect(trigger).toContainText('Ya-Sin');
  await page.goto('/#surah=18&ayah=100');
  await expect(selector).toHaveAttribute('data-ayah', '100');
  await expect(word(page, '18:100:1')).toHaveAttribute('aria-pressed', 'true');
  await expectNoOverflow(page);
});

test('Juz 30 lists all thirty-seven of its chapters as a complete Juz', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await loadStudy(page);
  await page.getByRole('button', { name: 'Select surah', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Juz', exact: true }).click();
  const catalog = page.getByRole('dialog');
  await expect(catalog.locator('[data-juz="30"]')).toContainText('An-Naba – An-Nas');
  await expect(catalog.locator('[data-juz="30"]')).not.toContainText('Partial preview');
  await catalog.locator('[data-juz="30"]').click();
  await expect(catalog.locator('[data-surah]')).toHaveCount(37);
  expect(
    await catalog.locator('[data-surah]').evaluateAll((nodes) => nodes.map((node) => Number(node.getAttribute('data-surah')))),
  ).toEqual(Array.from({ length: 37 }, (_, index) => 78 + index));
  await expect(catalog.locator('.catalog-subheading h3')).toHaveText('Juz 30');
  await expect(catalog.locator('[data-surah="78"]')).toContainText('Ayahs 1–40');
  await expect(catalog.locator('.catalog-subheading h3')).toBeFocused();
  await catalog.locator('.catalog-subheading button').click();
  await expect(catalog.locator('[data-juz="30"]')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(catalog.locator('.catalog-subheading h3')).toBeFocused();
  await expectNoOverflow(page);
  await page.keyboard.press('Escape');
  await expect(page.locator('.collection-trigger')).toContainText('Al-Fatihah');
  await page.getByRole('button', { name: 'Select surah', exact: true }).click();
  await catalog.getByRole('button', { name: 'Juz', exact: true }).click();
  await catalog.locator('[data-juz="30"]').click();
  await catalog.locator('[data-surah="114"]').click();
  await expect(page.locator('.quran-word')).toHaveCount(20);
  await expect(page.locator('.collection-trigger')).toContainText('Juz 30');
  await expect(page.locator('.collection-trigger')).toContainText('An-Nas');
  await word(page, '114:5:2').click();
  await expect(detail(page).locator('.root-pair')).toContainText('و س و س');
  await expect(detail(page).locator('.baab-title')).toContainText('رباعی');
  await expectNoOverflow(page);
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await expect(page.locator('.about-card').getByRole('link', { name: 'Quranic Arabic Corpus' }))
    .toHaveAttribute('href', 'https://corpus.quran.com');
  await expect(page.locator('.about-card')).not.toContainText(/draft|scholar(?:ly)? review pending/i);
  await page.getByRole('button', { name: 'اردو', exact: true }).click();
  await expect(page.locator('.about-card')).not.toContainText(/مسودہ|نظرِ ثانی باقی/);
  await page.getByRole('button', { name: 'مطالعہ', exact: true }).click();
  await expect(page.locator('.ayah-number')).toHaveText(['۱', '۲', '۳', '۴', '۵', '۶']);
  await expectNoOverflow(page);
});

test('cross-chapter deep links and failed requests never show the previous chapter as the new one', async ({
  page,
}) => {
  await page.goto('/#word=112%3A3%3A4');
  await expect(word(page, '112:3:4')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.quran-word')).toHaveCount(15);
  await expect(word(page, '112:1:1').locator('.word-kind')).toContainText('فعلِ امر');
  await expect(word(page, '112:3:4').locator('.word-kind')).toContainText('فعلِ مضارع');
  await page.route('**/api/v1/surahs/113', (route) => route.abort());
  await page.evaluate(() => {
    location.hash = 'surah=113';
  });
  await expect(
    page.getByRole('heading', { name: 'Could not load the study content.' }),
  ).toBeVisible();
  await expect(page.locator('.quran-word')).toHaveCount(0);
  await expect(page.locator('.collection-trigger')).toContainText('Al-Falaq');
  await page.unroute('**/api/v1/surahs/113');
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.locator('.quran-word')).toHaveCount(23);
  await expect(word(page, '113:1:1')).toHaveAttribute('aria-pressed', 'true');
  await page.evaluate(() => {
    location.hash = 'word=114%3A5%3A2';
  });
  await expect(word(page, '114:5:2')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.quran-word')).toHaveCount(20);
  // A chapter that does not exist falls back to Al-Fatihah.
  await page.evaluate(() => {
    location.hash = 'surah=115';
  });
  await expect(word(page, '1:1:1')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.quran-word')).toHaveCount(29);
});

test('valid JSON for the wrong chapter is rejected and a delayed earlier request cannot overwrite selection', async ({
  page,
  request,
}) => {
  const fatihah = await (await request.get('/api/v1/surahs/1')).json();
  await page.route('**/api/v1/surahs/105', (route) => route.fulfill({ json: fatihah }));
  await page.goto('/#surah=105');
  await expect(
    page.getByRole('heading', { name: 'Could not load the study content.' }),
  ).toBeVisible();
  await expect(page.locator('.quran-word')).toHaveCount(0);
  await page.unroute('**/api/v1/surahs/105');
  let release: () => void = () => {};
  const delayed = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route('**/api/v1/surahs/105', async (route) => {
    await delayed;
    await route.continue().catch(() => {});
  });
  await page.getByRole('button', { name: 'Try again' }).click();
  await page.getByRole('button', { name: 'Select surah', exact: true }).click();
  await page.locator('[data-surah="112"]').click();
  await expect(page.locator('.quran-word')).toHaveCount(15);
  release();
  await page.unroute('**/api/v1/surahs/105');
  await expect(page.locator('.collection-trigger')).toContainText('Al-Ikhlas');
  await expect(word(page, '112:1:1')).toHaveAttribute('aria-pressed', 'true');
});

test('skip navigation keeps the selected chapter and word URL', async ({ page }) => {
  await page.goto('/#word=112%3A3%3A4');
  await expect(word(page, '112:3:4')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('.skip-link').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  await expect(page.locator('.quran-word')).toHaveCount(15);
  await expect(page).toHaveURL(/word=112%3A3%3A4/);
});

test('the Settings translation switcher changes every ayah translation and persists across reloads', async ({
  page,
}) => {
  const fatihah = lesson(1);
  const ofEdition = (study: StudyData, id: string) => study.ayahs.map((ayah) => ayah.translations[id]);
  await loadStudy(page);
  // Jalandhari is the default translation.
  await expect(page.locator('.ayah-translation')).toHaveText(ofEdition(fatihah, 'jalandhari'));
  // The translator is named only in Settings: no credit or reference under the ayahs.
  const credits = page.locator('.translation-credit');
  await expect(credits).toHaveCount(0);
  await expect(page.locator('#reading')).not.toContainText('Jalandhari');
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  const options = page.locator('.translation-settings [data-translation]');
  await expect(options).toHaveCount(6);
  expect(await options.evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-translation')))).toEqual([
    'jalandhari',
    'junagarhi',
    'mahmud-al-hasan',
    'israr-ahmad',
    'maududi',
    'wahiduddin-khan',
  ]);
  await expect(options.locator('input:checked')).toHaveCount(1);
  await expect(page.locator('[data-translation="jalandhari"] input')).toBeChecked();
  // Each option previews the chapter's first ayah in that translation.
  await expect(page.locator('[data-translation="maududi"] .translation-preview')).toHaveText(
    fatihah.ayahs[0].translations.maududi,
  );
  await page.getByRole('radio', { name: "Syed Abul A'la Maududi (Tafheem-ul-Quran)", exact: true }).check();
  await expect(page.locator('[data-translation="maududi"] input')).toBeChecked();
  expect(await page.evaluate(() => localStorage.getItem('quran-grammar.translation'))).toBe('maududi');
  await page.getByRole('button', { name: 'Study', exact: true }).click();
  await expect(page.locator('.ayah-translation')).toHaveText(ofEdition(fatihah, 'maududi'));
  await expect(credits).toHaveCount(0);
  await expect(page.locator('#reading')).not.toContainText('Maududi');
  expect(ofEdition(fatihah, 'maududi')).not.toEqual(ofEdition(fatihah, 'jalandhari'));
  // The choice survives a reload and applies to every chapter.
  await page.reload();
  await expect(page.locator('.quran-word')).toHaveCount(29);
  await expect(page.locator('.ayah-translation')).toHaveText(ofEdition(fatihah, 'maududi'));
  await page.goto('/#surah=114');
  await expect(page.locator('.quran-word')).toHaveCount(20);
  await expect(page.locator('.ayah-translation')).toHaveText(ofEdition(lesson(114), 'maududi'));
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await expect(page.locator('[data-translation="maududi"] input')).toBeChecked();
  // The Urdu interface names the translators in Urdu; the translation text is unchanged.
  await page.getByRole('button', { name: 'اردو', exact: true }).click();
  await expect(page.locator('[data-translation="maududi"] strong')).toHaveText('سید ابو الاعلیٰ مودودی (تفہیم القرآن)');
  await page.getByRole('radio', { name: 'محمد جوناگڑھی', exact: true }).check();
  await page.getByRole('button', { name: 'مطالعہ', exact: true }).click();
  await expect(page.locator('.ayah-translation')).toHaveText(ofEdition(lesson(114), 'junagarhi'));
  await expect(credits).toHaveCount(0);
  await expect(page.locator('#reading')).not.toContainText('جوناگڑھی');
  // A stored id that is no longer offered falls back to the default.
  await page.evaluate(() => localStorage.setItem('quran-grammar.translation', 'not-offered'));
  await page.goto('/');
  await page.reload();
  await expect(page.locator('.quran-word')).toHaveCount(29);
  await expect(page.locator('.ayah-translation')).toHaveText(ofEdition(fatihah, 'jalandhari'));
});

test('a chapter without authored notes shows library root and paradigm cards, no dictionary note or glosses', async ({
  page,
}) => {
  test.skip(plainChapter === null, 'every chapter has authored grammar notes');
  const study = lesson(plainChapter!);
  const panel = detail(page);
  const open = async (id: string) => {
    await page.goto(`/#word=${encodeURIComponent(id)}`);
    await expect(page.locator('.quran-word')).toHaveCount(study.words.length, { timeout: 20_000 });
    await expect(word(page, id)).toHaveAttribute('aria-pressed', 'true');
    await expect(panel.locator('#detail-title')).toHaveText(study.words.find((entry) => entry.id === id)!.arabic);
  };
  // Corpus grammar, Quran.com meaning and the shared library cards; no AI-written word note.
  const verb = study.words.find(
    (entry) => entry.pos === 'verb' && entry.root && study.verbForms[entry.id]?.present && entry.ayah > 1,
  )!;
  const paradigm = study.verbForms[verb.id];
  expect(verb.dictionaryUrdu).toBe('');
  await open(verb.id);
  await expect(panel.locator('.detail-translation')).toHaveText(verb.meaningUrdu);
  await expect(panel.locator('.root-pair')).toContainText(verb.root!);
  await expect(panel.locator('.root-meaning p').first()).toHaveText(study.roots[verb.root!].meaningUrdu);
  await expect(panel.getByRole('heading', { name: 'Dictionary meaning' })).toHaveCount(0);
  await expect(panel.getByText(verb.morphologyUrdu, { exact: true })).toBeVisible();
  await expect(panel.getByText(verb.syntaxUrdu, { exact: true })).toBeVisible();
  await expect(panel.locator('.baab-title')).toHaveText(paradigm.baabUrdu);
  await expect(panel.locator('.verb-paradigm dd')).toHaveText([paradigm.past, paradigm.present, paradigm.pattern]);
  // A segment shows its role only, with no dangling separator for the missing gloss.
  await panel.locator('[data-segment="0"]').click();
  await expect(panel.locator('.segment-explanation')).toHaveText(verb.segments[0]!.roleUrdu);
  await expectNoOverflow(page);
  // Empty root and paradigm fields (a root or lexeme without a library card) are hidden too.
  const blank: StudyData = JSON.parse(JSON.stringify(study));
  blank.roots[verb.root!] = { meaningUrdu: '', noteUrdu: '' };
  blank.verbForms[verb.id] = { ...paradigm, baabUrdu: '', present: '', pattern: '', noteUrdu: '' };
  await page.route(`**/api/v1/surahs/${plainChapter}`, (route) => route.fulfill({ json: blank }));
  await page.goto('about:blank');
  await open(verb.id);
  await expect(panel.locator('.root-meaning')).toHaveCount(0);
  await expect(panel.getByRole('heading', { name: 'Root meaning' })).toHaveCount(0);
  await expect(panel.locator('.verb-section')).toBeVisible();
  await expect(panel.locator('.baab-title')).toHaveCount(0);
  await expect(panel.locator('.verb-paradigm dd')).toHaveText([paradigm.past]);
  await expect(panel.locator('.verb-section > p')).toHaveText([paradigm.formUrdu]);
  await expect(panel.locator('.verb-paradigm')).not.toContainText('Present');
});

test('an authored chapter word panel shows its grammar note, segment glosses and library cards', async ({
  page,
}) => {
  const study = lesson(authoredChapter);
  const panel = detail(page);
  const verb = study.words.find(
    (entry) => entry.pos === 'verb' && entry.dictionaryUrdu && entry.root && study.verbForms[entry.id]?.present,
  )!;
  const paradigm = study.verbForms[verb.id];
  await page.goto(`/#word=${encodeURIComponent(verb.id)}`);
  await expect(page.locator('.quran-word')).toHaveCount(study.words.length, { timeout: 20_000 });
  await expect(word(page, verb.id)).toHaveAttribute('aria-pressed', 'true');
  await expect(panel.locator('#detail-title')).toHaveText(verb.arabic);
  // The word meaning stays Quran.com's; the grammar layer adds the note and the glosses.
  await expect(panel.locator('.detail-translation')).toHaveText(verb.meaningUrdu);
  await expect(panel.getByRole('heading', { name: 'Dictionary meaning' })).toBeVisible();
  await expect(panel.getByText(verb.dictionaryUrdu, { exact: true })).toBeVisible();
  await expect(panel.locator('.root-meaning p').first()).toHaveText(study.roots[verb.root!].meaningUrdu);
  await expect(panel.locator('.baab-title')).toHaveText(paradigm.baabUrdu);
  await expect(panel.locator('.verb-paradigm dd')).toHaveText([paradigm.past, paradigm.present, paradigm.pattern]);
  await panel.locator('[data-segment="0"]').click();
  const segment = verb.segments[0]!;
  await expect(panel.locator('.segment-explanation')).toHaveText(`${segment.roleUrdu}: ${segment.meaningUrdu}`);
  await expectNoOverflow(page);
  // Published lessons keep their own sections.
  await page.goto('/#word=1%3A5%3A4');
  await expect(word(page, '1:5:4')).toHaveAttribute('aria-pressed', 'true');
  await expect(panel.locator('.root-meaning p').first()).toHaveText(lesson(1).roots['ع و ن'].meaningUrdu);
  await expect(panel.getByRole('heading', { name: 'Dictionary meaning' })).toBeVisible();
  await expect(panel.locator('.verb-paradigm dd')).toHaveCount(3);
});

test('Al-Baqarah opens complete: 286 ayahs, the pilot grammar layer through 2:20 and the full-Quran layer after', async ({
  page,
}) => {
  test.setTimeout(60_000);
  const baqarah = lesson(2);
  await page.goto('/#word=2%3A20%3A1');
  await expect(page.locator('.quran-word')).toHaveCount(6116, { timeout: 20_000 });
  await expect(page.locator('.reading-card article.ayah')).toHaveCount(286);
  await expect(page.locator('.ayah-translation')).toHaveCount(286);
  await expect(page.locator('#ayah-286 .ayah-translation')).toHaveText(baqarah.ayahs[285].translations.jalandhari);
  await expectAyahNumbers(page, 286);
  const panel = detail(page);
  await expect(word(page, '2:20:1')).toHaveAttribute('aria-pressed', 'true');
  await expect(panel.getByRole('heading', { name: 'Dictionary meaning' })).toBeVisible();
  await expect(panel.getByText(baqarah.words.find((entry) => entry.id === '2:20:1')!.dictionaryUrdu)).toBeVisible();
  await page.evaluate(() => {
    location.hash = 'word=2%3A21%3A1';
  });
  const next = baqarah.words.find((entry) => entry.id === '2:21:1')!;
  await expect(word(page, '2:21:1')).toHaveAttribute('aria-pressed', 'true');
  await expect(panel.locator('#detail-title')).toHaveText(next.arabic);
  // 2:21 onward: the full-Quran grammar layer where it is authored, otherwise no note.
  if (next.dictionaryUrdu) await expect(panel.getByText(next.dictionaryUrdu, { exact: true })).toBeVisible();
  else await expect(panel.getByRole('heading', { name: 'Dictionary meaning' })).toHaveCount(0);
  await chooseAyah(page, '286');
  await expect(page.locator('#ayah-286')).toBeInViewport();
  await expect(page.locator('.collection-trigger')).toContainText('Al-Baqarah');
});

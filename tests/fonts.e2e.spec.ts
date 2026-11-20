import { expect, test, type Locator, type Page } from '@playwright/test';
import { defaultFontIds, fontsForRole, readingFonts, type ReadingFont } from '../packages/core/src/fonts';

// Every test receives a new browser context; reloads within a test retain its preferences.
test.use({ storageState: { cookies: [], origins: [] } });

const keys = { quran: 'quran-grammar.quran-font', urdu: 'quran-grammar.urdu-font' } as const;
const byId = (id: string) => readingFonts.find((font) => font.id === id)!;
const defaults = { quran: byId(defaultFontIds.quran), urdu: byId(defaultFontIds.urdu) };
const alternate = (role: 'quran' | 'urdu') =>
  fontsForRole(role).find((font) => font.id !== defaultFontIds[role]) ?? defaults[role];

const nav = (page: Page, name: string) =>
  page.locator('.bottom-nav').getByRole('button', { name, exact: true }).click();
const fontGroup = (page: Page, name: string) => page.getByRole('radiogroup', { name, exact: true });

async function loadStudy(page: Page, hash = '') {
  await page.goto(`/${hash}`);
  await expect(page.locator('.quran-word')).toHaveCount(29);
  await page.evaluate(() => document.fonts.ready);
}

/** The computed font stack starts with the font's registry family. */
async function expectFamily(locator: Locator, font: ReadingFont) {
  await expect(locator).toHaveCSS('font-family', new RegExp(`^["']?${font.family}["']?,`));
}

async function chooseFont(page: Page, role: 'quran' | 'urdu', font: ReadingFont) {
  const group = fontGroup(page, role === 'quran' ? 'Quran font' : 'Urdu font');
  await group.getByRole('radio', { name: font.label, exact: true }).check();
  await expect(group.getByRole('radio', { name: font.label, exact: true })).toBeChecked();
}

async function expectNoOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}

test('Quran and Urdu fonts are chosen in Settings, applied everywhere and persisted', async ({
  page,
}) => {
  await loadStudy(page);
  const firstWord = (await page.locator('.quran-word .arabic').first().textContent())!;
  const translation = (await page.locator('.ayah-translation').first().textContent())!;
  const detail = page.locator('.word-detail');
  const explanation = detail.locator('.root-meaning p').first();

  // Defaults keep today's faces: Amiri Quran for the Quran, Naskh for explanations, Nastaliq
  // for word meanings.
  await expectFamily(page.locator('.quran-word .arabic').first(), defaults.quran);
  await expectFamily(detail.locator('#detail-title'), defaults.quran);
  await expectFamily(explanation, defaults.urdu);
  await expect(page.locator('.word-meaning').first()).toHaveCSS('font-family', /^["']?Nastaliq/);

  await nav(page, 'Settings');
  await expect(page.getByRole('heading', { name: 'Fonts', exact: true })).toBeVisible();
  for (const role of ['quran', 'urdu'] as const) {
    const group = fontGroup(page, role === 'quran' ? 'Quran font' : 'Urdu font');
    await expect(group.getByRole('radio')).toHaveCount(fontsForRole(role).length);
    await expect(group.getByRole('radio', { name: defaults[role].label, exact: true })).toBeChecked();
    for (const font of fontsForRole(role)) {
      // Each option previews the current chapter's first ayah in its own font.
      const preview = page.locator(`.font-option[data-font="${font.id}"] .font-preview-text`);
      await expect(preview).toContainText(role === 'quran' ? firstWord : translation.slice(0, 12));
      await expectFamily(preview, font);
      if (font.coverageNote)
        await expect(page.locator(`.font-option[data-font="${font.id}"]`)).toContainText(
          font.coverageNote,
        );
    }
  }

  const quran = alternate('quran');
  const urdu = alternate('urdu');
  await chooseFont(page, 'quran', quran);
  await chooseFont(page, 'urdu', urdu);
  await nav(page, 'Study');
  await expectFamily(page.locator('.quran-word .arabic').first(), quran);
  await expectFamily(detail.locator('#detail-title'), quran);
  await expectFamily(explanation, urdu);
  await expectFamily(page.locator('.ayah-translation').first(), urdu);
  if (urdu.id !== defaults.urdu.id) await expectFamily(page.locator('.word-meaning').first(), urdu);
  // Arabic roots and headwords stay in Naskh; interface text keeps its own font.
  await expect(detail.locator('.root-pair strong').first()).toHaveCSS('font-family', /^["']?Naskh/);

  // Plain (continuous) text uses the chosen Quran font too.
  await nav(page, 'Settings');
  await page.getByRole('switch', { name: /Word-by-word grammar/ }).uncheck();
  await nav(page, 'Study');
  await expectFamily(page.locator('.ayah-text').first(), quran);
  await expectFamily(page.locator('.plain-ayah .ayah-translation').first(), urdu);
  await nav(page, 'Settings');
  await page.getByRole('switch', { name: /Word-by-word grammar/ }).check();

  // Preferences persist across reloads.
  // (Re-checking an already selected default stores nothing, which also resolves to the default.)
  const stored = await page.evaluate(
    (k) => [localStorage.getItem(k.quran), localStorage.getItem(k.urdu)],
    keys,
  );
  expect(stored).toEqual([
    quran.id === defaults.quran.id ? stored[0] : quran.id,
    urdu.id === defaults.urdu.id ? stored[1] : urdu.id,
  ]);
  await loadStudy(page);
  await expectFamily(page.locator('.quran-word .arabic').first(), quran);
  await expectFamily(explanation, urdu);
  await nav(page, 'Settings');
  await expect(
    fontGroup(page, 'Quran font').getByRole('radio', { name: quran.label, exact: true }),
  ).toBeChecked();

  // The radio groups are keyboard operable and follow the Urdu interface.
  const urduGroup = fontGroup(page, 'Urdu font');
  await urduGroup.getByRole('radio', { checked: true }).focus();
  await page.keyboard.press('ArrowDown');
  const urduFonts = fontsForRole('urdu');
  const next = urduFonts[(urduFonts.findIndex((font) => font.id === urdu.id) + 1) % urduFonts.length];
  await expect(urduGroup.getByRole('radio', { name: next.label, exact: true })).toBeChecked();
  await expect(urduGroup.getByRole('radio', { name: next.label, exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'اردو', exact: true }).click();
  await expect(
    fontGroup(page, 'اردو فونٹ').getByRole('radio', { name: next.labelUrdu, exact: true }),
  ).toBeChecked();
});

test('invalid saved fonts fall back to the defaults', async ({ page }) => {
  await page.addInitScript((k) => {
    localStorage.setItem(k.quran, 'missing-font');
    localStorage.setItem(k.urdu, 'amiri-quran');
  }, keys);
  await loadStudy(page);
  await expectFamily(page.locator('.quran-word .arabic').first(), defaults.quran);
  await expectFamily(page.locator('.word-detail .root-meaning p').first(), defaults.urdu);
});

test('every registry font file loads when selected', async ({ page }) => {
  await loadStudy(page);
  await nav(page, 'Settings');
  for (const font of readingFonts) {
    await chooseFont(page, font.role, font);
    await expect
      .poll(
        () =>
          page.evaluate(async (family) => {
            await document.fonts.load(`16px "${family}"`).catch(() => undefined);
            const faces = [...document.fonts].filter(
              (face) => face.family.replace(/["']/g, '') === family,
            );
            return faces.length > 0 && faces.every((face) => face.status === 'loaded');
          }, font.family),
        { message: `${font.family} (${font.file}) loads` },
      )
      .toBe(true);
    expect(await page.evaluate((family) => document.fonts.check(`16px "${family}"`), font.family)).toBe(
      true,
    );
  }
});

for (const width of [390, 1280]) {
  test(`fonts never cause horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await loadStudy(page);
    for (const quran of fontsForRole('quran')) {
      await nav(page, 'Settings');
      await chooseFont(page, 'quran', quran);
      await chooseFont(page, 'urdu', alternate('urdu'));
      await expectNoOverflow(page);
      await nav(page, 'Study');
      await expectFamily(page.locator('.quran-word .arabic').first(), quran);
      await page.evaluate(() => document.fonts.ready);
      await expectNoOverflow(page);
    }
  });
}

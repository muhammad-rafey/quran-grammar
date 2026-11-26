import { expect, test, type Page } from '@playwright/test';

// Settings → Theme: System (default, follows the OS), Light and Dark, persisted locally.
test.use({ storageState: { cookies: [], origins: [] } });

const root = (page: Page) => page.locator('html');
/** Relative luminance (0-1) of a computed colour property of the first matching element. */
const luminance = (page: Page, selector: string, property: 'color' | 'backgroundColor') =>
  page
    .locator(selector)
    .first()
    .evaluate((element, key) => {
      const [r, g, b] = getComputedStyle(element)
        [key].match(/\d+(\.\d+)?/g)!
        .map(Number)
        .map((value) => {
          const s = value / 255;
          return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
        });
      return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
    }, property);
/** The page background (on <html>). */
const backgroundLuminance = (page: Page) => luminance(page, 'html', 'backgroundColor');
const textLuminance = (page: Page, selector: string) => luminance(page, selector, 'color');

async function openSettings(page: Page) {
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  return page.getByRole('group', { name: 'Theme', exact: true });
}

test('Dark applies the dark palette, persists across reloads and is applied before first paint', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  await expect(page.locator('.quran-word').first()).toBeVisible({ timeout: 20_000 });
  await expect(root(page)).toHaveAttribute('data-theme', 'system');
  expect(await backgroundLuminance(page)).toBeGreaterThan(0.8);

  const theme = await openSettings(page);
  await expect(theme.getByRole('button')).toHaveText(['System', 'Light', 'Dark']);
  await expect(theme.getByRole('button', { name: 'System' })).toHaveAttribute('aria-pressed', 'true');
  await theme.getByRole('button', { name: 'Dark' }).click();
  await expect(theme.getByRole('button', { name: 'Dark' })).toHaveAttribute('aria-pressed', 'true');
  await expect(root(page)).toHaveAttribute('data-theme', 'dark');
  expect(await backgroundLuminance(page)).toBeLessThan(0.02);
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe('dark');
  expect(await page.evaluate(() => localStorage.getItem('quran-grammar.theme'))).toBe('dark');

  // The inline script in index.html sets the theme before the app (and its CSS) runs.
  await page.addInitScript(() => {
    document.addEventListener(
      'DOMContentLoaded',
      () => ((window as unknown as { themeAtLoad: string }).themeAtLoad = document.documentElement.dataset.theme!),
    );
  });
  await page.reload();
  await expect(page.locator('.quran-word').first()).toBeVisible({ timeout: 20_000 });
  expect(await page.evaluate(() => (window as unknown as { themeAtLoad: string }).themeAtLoad)).toBe('dark');
  await expect(root(page)).toHaveAttribute('data-theme', 'dark');
  expect(await backgroundLuminance(page)).toBeLessThan(0.02);
  // Quranic text and word cards are light-on-dark.
  expect(await textLuminance(page, '.quran-word .arabic')).toBeGreaterThan(0.6);

  // Light overrides a dark OS.
  await page.emulateMedia({ colorScheme: 'dark' });
  const again = await openSettings(page);
  await again.getByRole('button', { name: 'Light' }).click();
  await expect(root(page)).toHaveAttribute('data-theme', 'light');
  expect(await backgroundLuminance(page)).toBeGreaterThan(0.8);
});

test('System follows the emulated prefers-color-scheme, including live changes', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  await expect(page.locator('.quran-word').first()).toBeVisible({ timeout: 20_000 });
  await expect(root(page)).toHaveAttribute('data-theme', 'system');
  expect(await backgroundLuminance(page)).toBeLessThan(0.02);
  await page.emulateMedia({ colorScheme: 'light' });
  expect(await backgroundLuminance(page)).toBeGreaterThan(0.8);

  // Theme labels follow the interface language.
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await page.getByRole('button', { name: 'اردو', exact: true }).click();
  const theme = page.getByRole('group', { name: 'تھیم', exact: true });
  await expect(theme.getByRole('button')).toHaveText(['سسٹم', 'ہلکا', 'گہرا']);
  await theme.getByRole('button', { name: 'ہلکا' }).click();
  await expect(root(page)).toHaveAttribute('data-theme', 'light');
  expect(await backgroundLuminance(page)).toBeGreaterThan(0.8);
});

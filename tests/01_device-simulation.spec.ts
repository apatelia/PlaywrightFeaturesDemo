import { expect, test } from "@playwright/test";

test('Visit Playwright Docs @device', async ({ page, isMobile }) => {
  await page.goto('https://playwright.dev');

  if (isMobile) {
    await page.getByRole('button', { name: 'Toggle navigation bar' }).click();
  }

  await page.getByRole('link', { name: 'Docs' }).click();

  const heading = await page.getByRole('heading', { name: 'Installation' }).textContent();

  expect(heading).toBe('Installation');
});

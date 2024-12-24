import { expect, test } from "@playwright/test";

test('Test static website for visual regression @visual', async ({ page }) => {
  await page.goto("http://localhost:3000");

  await expect(page).toHaveScreenshot({ fullPage: true });
});

import { expect, test } from "../fixtures/custom-test";

test('Test My Info tab functionality @fixture', async ({ loginPage, page }) => {
  // By using loginPage fixture, we are already logged in to the website.
  // Go to `My Info` tab.
  await page.getByRole('link', { name: 'My Info' }).click();

  const heading = page.getByRole('heading', { name: 'PIM' });

  await expect(heading).toHaveText('PIM');

  await page.pause();
});

test('Test Performance tab functionality @fixture', async ({ loginPage, page }) => {
  // By using loginPage fixture, we are already logged in to the website.
  // Go to `Performance` tab.
  await page.getByRole('link', { name: 'Performance' }).click();

  const heading = page.getByRole('heading', { name: 'Performance' });

  await expect(heading).toHaveText('Performance');

  await page.pause();
});

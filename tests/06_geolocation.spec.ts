import { test } from "@playwright/test";

test.use({
  geolocation: {
    // London's co-ordinates.
    // latitude: 51.500457,
    // longitude: 0.125827 

    // Colosseum, Rome.
    latitude: 41.890218,
    longitude: 12.492335
  },
  permissions: [ 'geolocation' ]
});

test('Visit Colosseum in Rome, Italy @geolocation', async ({ page }) => {
  await page.goto("https://www.bing.com/maps");

  await page.getByRole('button', { name: 'Locate me' }).click();

  await page.pause();
});

test('Spoof my location @geolocation', async ({ page }) => {
  await page.goto("https://mylocation.org/");

  await page.getByRole('tab', { name: 'Browser Geolocation' }).click();

  await page.getByRole('button', { name: 'Start Test' }).click();

  await page.pause();
});

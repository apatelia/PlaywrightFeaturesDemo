import { test } from "@playwright/test";

test.use({
    geolocation: {
        // London's co-ordinates.
        // latitude: 51.500457,
        // longitude: 0.125827 

        // Dracula's castle's location.
        latitude: 45.514993,
        longitude: 25.367217
    },
    permissions: ['geolocation']
});

test('Visit Dracula castle @dracula @geolocation', async ({ page }) => {
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
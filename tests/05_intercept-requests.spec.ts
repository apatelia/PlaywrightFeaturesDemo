import { expect, test } from "@playwright/test";

test("Block all jpg images @intercept", async ({ page }) => {
  await page.route("**/*.jpg", (route) => route.abort());

  await page.goto("https://flickr.com/explore");

  await page.pause();
});

test("A simple ad blocker for a page @intercept", async ({ page }) => {
  // Intercept all requests, block all iframe requests.
  await page.route("**/*", (route) => {
    if (route.request().frame().parentFrame()) route.abort();
    else route.continue();
  });

  await page.goto("https://theverge.com");

  await page.pause();
});

test("A simple ad blocker for all pages @intercept", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  // Intercept all requests, block all iframe requests.
  await context.route("**/*", (route) => {
    if (route.request().frame().parentFrame())
      route.abort();
    else
      route.continue();
  });

  await page.goto("https://theverge.com");

  await page.pause();
});

test("Modify response @intercept", async ({ page }) => {
  // Listen for the background request.
  await page.route("https://api.demoblaze.com/entries", async (route) => {
    // Fetch the response.
    const response = await route.fetch();

    // Modify JSON response i.e. change the price of the first entry.
    const json = await response.json();
    json.Items[ 0 ].price = 1001;

    // Complete the request with modified response.
    await route.fulfill({ response, json });
  });

  // Visit the page that will make the background request.
  await page.goto("https://www.demoblaze.com");

  // Find the price of the first product from the list.
  const galaxyPrice = page.locator("div.card-block").first().locator("h5");

  expect(await galaxyPrice.textContent()).toBe("$1001");

  await page.screenshot({
    path: "./test-results/galaxy-price.png",
    fullPage: true,
  });
});

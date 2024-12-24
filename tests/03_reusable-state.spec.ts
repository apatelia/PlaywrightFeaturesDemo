import { test } from "@playwright/test";

test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  // Login into the site as an admin.
  await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");
  await page.getByPlaceholder('Username').fill("Admin");
  await page.getByPlaceholder("Password").fill("admin123");
  await page.getByRole("button", { name: "Login" }).click();

  // Save the logged in state for later use.
  await context.storageState({ path: 'orangehrmlive.json' });

  await page.close();
  await context.close();
});

test('Test My Info tab functionality @reuse', async ({ browser }) => {
  // Use previously saved logged in state for this test.
  const adminContext = await browser.newContext({ storageState: 'orangehrmlive.json' });

  const page = await adminContext.newPage();

  await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php");

  // Go to `My Info` tab.
  await page.getByRole('link', { name: 'My Info' }).click();

  await page.pause();

  await page.close();
  await adminContext.close();
});

test('Test Performance tab functionality @reuse', async ({ browser }) => {
  // Use previously saved logged in state for this test.
  const adminContext = await browser.newContext({ storageState: 'orangehrmlive.json' });

  const page = await adminContext.newPage();

  await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php");

  // Go to `Performance` tab.
  await page.getByRole('link', { name: 'Performance' }).click();

  await page.pause();

  await page.close();
  await adminContext.close();
});

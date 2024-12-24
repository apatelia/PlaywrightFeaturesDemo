import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createHtmlReport } from "axe-html-reporter";

test('Test a webpage HAVING accessibility issues @accessibility', async ({ page }, testInfo) => {
  test.skip(process.env.CI != undefined, 'Skipping failing accessibility test on CI');

  await page.goto('https://www.washington.edu/accesscomputing/AU/before.html');

  // Run the automated accessibility tests
  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags([ 'wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa' ])
    .analyze();

  // Attach accessibility test results to Playwright's test report.
  await testInfo.attach('accessibility-scan-results', {
    body: JSON.stringify(accessibilityScanResults, null, 2),
    contentType: 'application/json'
  });

  // Create a nice HTML report of accessibility test results, with custom options.
  createHtmlReport({
    results: accessibilityScanResults,
    options: {
      outputDir: 'axe-reports',
      reportFileName: 'Before-Fix-Report.html',
    },
  });

  // Verify that there is no WCAG violation.
  // Display custom error message if this assertion fails.
  expect(accessibilityScanResults.violations, "This will always fail.").toEqual([]);
});

test('Test a webpage AFTER FIXING accessibility issues @accessibility', async ({ page }, testInfo) => {
  await page.goto('https://www.washington.edu/accesscomputing/AU/after.html');

  // Run the automated accessibility tests
  const accessibilityFixesScanResults = await new AxeBuilder({ page })
    .withTags([ 'wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa' ])
    .analyze();

  // Attach accessibility test results to Playwright's test report.
  await testInfo.attach('accessibility-scan-results', {
    body: JSON.stringify(accessibilityFixesScanResults, null, 2),
    contentType: 'application/json'
  });

  // Create a nice HTML report of accessibility test results, with custom options.
  createHtmlReport({
    results: accessibilityFixesScanResults,
    options: {
      outputDir: 'axe-reports',
      reportFileName: 'After-Fix-Report.html',
    },
  });

  // Verify that there is no WCAG violation.
  expect(accessibilityFixesScanResults.violations).toEqual([]);
});

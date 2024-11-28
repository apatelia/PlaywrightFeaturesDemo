import { test } from "@playwright/test";
import getPort from "get-port"
import { playAudit } from "playwright-lighthouse";

const pagesToTest = [
  {
    url: "https://playwright.dev?mobile",
    reportName: "playwright-mobile",
  },
  {
    url: "https://fastestwebsite.net?mobile",
    reportName: "fastestwebsite-mobile",
  },
  {
    url: "https://playwright.dev?desktop",
    reportName: "playwright-desktop",
  },
  {
    url: "https://fastestwebsite.net?desktop",
    reportName: "fastestwebsite-desktop",
  }
];

const MOBILE_SETTINGS = {
  formFactor: "mobile",
  screenEmulation: {
  mobile: true,
  width: 412,
  height: 823,
  deviceScaleFactor: 1.75,
  disabled: false,
  },
  emulatedUserAgent: 'Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36',
};

const DESKTOP_SETTINGS = {
  formFactor: "desktop",
  screenEmulation: {
    mobile: false,
    width: 1350,
    height: 940,
    deviceScaleFactor: 1,
    disabled: false,
  },
  emulatedUserAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
};


test.describe("Lighthouse performance tests", {
  tag: "@perf"
}, async () => {
  test.describe.configure({ timeout: 60_000, mode: "serial" });

  for (const individualPage of pagesToTest) {
    const url = individualPage.url;
    const reportName = individualPage.reportName;

    const deviceSettings = (url.endsWith("mobile"))
      ? MOBILE_SETTINGS
      : DESKTOP_SETTINGS;

    const lighthouseConfig = {
      extends: "lighthouse:default",
      settings: deviceSettings,
    }
    
    test(`Check performance for ${url}`, async ({ playwright }) => {
      const port = await getPort();

      const browser = await playwright.chromium.launch({
        args: [ `--remote-debugging-port=${port}`],
        headless: true
      });
      
      const page = await browser.newPage();
      await page.goto(url);
      
      const results = await playAudit({
        page: page,
        port: port,
        disableLogs: true,
        config: lighthouseConfig,
        thresholds: {
            performance: 70,
            accessibility: 80,
            "best-practices": 80,
            seo: 75
          },
        reports: {
          formats: { html: true },
          name: `${reportName}--${new Date().getTime()}`,
          directory: "lighthouse-reports"
        }
      });

      // Extract audit scores.
      const audits = results.lhr.audits;
      const fcp = `${audits[ "first-contentful-paint" ].displayValue}`;
      const lcp = `${audits[ "largest-contentful-paint" ].displayValue}`;
      const cls = `${audits[ "cumulative-layout-shift" ].displayValue}`;
      const totalBlockingTime = `${audits[ "total-blocking-time" ].displayValue}`;
      const speedIndex = `${audits[ "speed-index" ].displayValue}`;

      // Extract category based score.
      const categories = results.lhr.categories;
      const performanceScore = (categories.performance.score) ? `${categories.performance.score * 100}` : "undefined";
      const accessibilityScore = (categories.accessibility.score) ? `${categories.accessibility.score * 100}` : "undefined";
      const bestPracticesScore = (categories[ "best-practices" ].score) ? `${categories[ "best-practices" ].score * 100}` : "undefined";
      const seoScore = (categories.seo.score) ? `${categories.seo.score * 100}` : "undefined";

      console.log(`Extracted Audit Scores for ${url}`);
      console.log("============================================================");
      console.log("Performance: ", performanceScore);
      console.log("Accessibility: ", accessibilityScore);
      console.log("Best Practices: ", bestPracticesScore);
      console.log("SEO: ", seoScore);
      console.log("FCP: ", fcp);
      console.log("LCP: ", lcp);
      console.log("CLS: ", cls);
      console.log("Total Blocking Time: ", totalBlockingTime);
      console.log("Speed Index: ", speedIndex);
      console.log("============================================================");
    });
  }
});


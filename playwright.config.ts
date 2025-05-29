import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  retries: 0,
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 0,
    ignoreHTTPSErrors: true,
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    baseURL: 'https://gb-saa-test.vercel.app/',
  },
  workers: 1,
  reporter: [['html', { outputFolder: 'playwright-gha-report', open: 'never' }]],
  projects: [
    {
      name: 'Desktop Chromium',
      use: {
        browserName: 'chromium',
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'Mobile Safari (iPhone 12)',
      use: {
        ...devices['iPhone 12'],
      },
    },
  ],
});
// This configuration sets up Playwright to run tests in a headless browser with a specific viewport size,
// ignores HTTPS errors, and retains videos and screenshots only on test failures.

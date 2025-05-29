import { test, expect } from '@playwright/test';

test('[example] GB-SAA page loads and shows a header', async ({ page }) => {
  // Navigate to the base URL, which is set in the Playwright configuration
  await page.goto('/');
  // Check if the header contains the expected text
  await expect(page.locator('header')).toContainText('Your Shopping Cart');
});

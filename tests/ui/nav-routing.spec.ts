import { test, expect } from '@playwright/test';
// This url is the base URL for the application being tested.
const baseAppUrl = 'https://gb-saa-test.vercel.app';
// This array contains the test cases for the navigation tabs.
// Each test case includes the name of the tab, the URL it should navigate to, and any expected header text.
const tabTests = [
  {
    name: 'Home',
    url: '/',
    headerText: 'Welcome to the Home Page',
  },
  {
    name: 'Products',
    url: '/products',
    headerText: 'Products',
  },
  {
    name: 'Cart',
    url: '/cart',
    headerText: 'Your Shopping Cart',
  },
  {
    name: 'Profile',
    url: '/profile',
    headerText: 'Profile',
  },
];

test('[nav] [regression] [smoke] Tabs should navigate and update content', async ({ page }) => {
  await page.goto('/');

  // Locators for the navigation bar, links, and header
  const navLocator = page.locator('nav');
  const navLinksLocator = page.locator('nav a');
  const headerLocator = page.locator('header');

  // Check that the initial page loads correctly
  await expect(page).toHaveURL(`${baseAppUrl}/`);
  await expect(headerLocator).not.toContainText('Your Shopping Cart');

  // Assert that the navigation bar is visible
  await expect(navLocator).toBeVisible();

  // Assert that the navigation bar contains the correct number of tabs and their names
  await expect(navLinksLocator).toHaveCount(tabTests.length);
  await expect(navLinksLocator).toHaveText(tabTests.map((test) => test.name));

  // Loop through each tab test case and perform the navigation and checks
  for (const { name, url, headerText } of tabTests) {
    await navLinksLocator.filter({ hasText: name }).click();
    await expect(page).toHaveURL(`${baseAppUrl}${url}`);
    if (headerText) {
      await expect(headerLocator).toContainText(headerText);
    } else {
      await expect(headerLocator).not.toContainText('Your Shopping Cart');
    }
  }
});

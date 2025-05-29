import { test, expect, Locator } from '@playwright/test';

test('[cart] [regression] [smoke] Cart total reflects discounts and updates to zero after item removal', async ({
  page,
}) => {
  await page.goto('/');

  // ** Locators for cart items
  const cartItemsLocator = page.locator('.cart-item');
  const itemCount = await cartItemsLocator.count();

  // Skip test early if no cart items
  test.skip(itemCount === 0, 'Cart is empty. Skipping test.');

  // ** Locators for total amount and remove buttons
  const totalAmountLocator = page.locator('#totalAmount');
  const removeButtonLocator = (item: Locator) => item.locator('button.remove-item');
  const confirmRemoveLocator = page.locator('#remove-confirm-modal .confirm-remove');

  // ** Prices
  // Helper to get price from item
  const getPrice = async (item: Locator) => {
    const priceText = await item.locator('.price').innerText();
    return parseFloat(priceText.replace('$', '').trim());
  };

  // ** Discounts
  // Helper to get discount percent from item
  const getDiscountPercent = async (item: Locator) => {
    const badge = item.locator('.discount-badge');
    if ((await badge.count()) === 0) return 0;
    const badgeText = await badge.innerText(); // e.g., '15% OFF'
    /*
Regex Breakdown: /(\d+)%/
| Part    | Meaning
|--------|---------------------------------------------------------------|
| /.../   | Delimiters that define the regex pattern in JavaScript       |
| (...)   | Capturing group – stores the matched value for later use     |
| \d      | Matches any digit (0–9)                                      |
| +       | One or more of the preceding token, so \d+ matches "15"      |
| %       | Matches the literal percent sign                             |
*/
    const match = badgeText.match(/(\d+)%/);
    return match ? parseFloat(match[1]) : 0;
  };

  // Step 1: Calculate expected total with discounts
  let totalPriceWithDiscount = 0;

  // loops through each item to calculate total price with discounts
  for (let i = 0; i < itemCount; i++) {
    const item = cartItemsLocator.nth(i);
    await expect(item).toBeVisible();
    const price = await getPrice(item);
    const discount = await getDiscountPercent(item);
    const finalPrice = price * (1 - discount / 100);
    totalPriceWithDiscount += finalPrice;
  }

  // Step 2: Assert displayed total matches expected value (2 decimal precision)
  const displayedTotal = parseFloat(await totalAmountLocator.innerText());
  expect(displayedTotal).toBeCloseTo(totalPriceWithDiscount, 2);

  // Step 3: Remove each cart item and confirm total drops to $0.00
  for (let i = 0; i < itemCount; i++) {
    const item = cartItemsLocator.nth(0); // Always remove the first remaining item
    await removeButtonLocator(item).click();
    await confirmRemoveLocator.click();
  }

  // Final check: total should be $0.00
  await expect(totalAmountLocator).toBeVisible();
  await expect(totalAmountLocator).toHaveText('0.00');
});

import { test, expect, Locator } from '@playwright/test';
// This test checks if the cart total reflects discounts and ignores out-of-stock items,
// and updates to zero after item removal.

test('[cart] [regression] [smoke] Cart total reflects discounts and excludes out-of-stock items', async ({
  page,
}) => {
  await page.goto('/');

  // ** Locators for cart items
  const cartItemsLocator = page.locator('.cart-item');
  const validCartItemsLocator = page.locator('.cart-item:not(.out-of-stock)');
  const itemCount = await cartItemsLocator.count();
  const validItemCount = await validCartItemsLocator.count();

  // Skip test early if no cart items
  test.skip(itemCount === 0, 'Cart is empty. Skipping test.');

  // ** Locators for total amount and remove buttons
  const totalAmountLocator = page.locator('#totalAmount');
  const removeButtonLocator = (item: Locator) => item.locator('button.remove-item');
  const confirmRemoveLocator = page.locator('#remove-confirm-modal .confirm-remove');

  // ** Helper to get price from item
  const getPrice = async (item: Locator) => {
    const priceText = await item.locator('.price').innerText();
    return parseFloat(priceText.replace('$', '').trim());
  };

  // ** Helper to get discount percent from item
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

  // Step 1: Calculate expected total with discounts (excluding out-of-stock items)
  let totalPriceWithDiscount = 0;
  // Loop through each valid cart item to calculate total
  for (let i = 0; i < validItemCount; i++) {
    const item = validCartItemsLocator.nth(i);
    await expect(item).toBeVisible();
    const price = await getPrice(item);
    const discount = await getDiscountPercent(item);
    const finalPrice = price * (1 - discount / 100);
    totalPriceWithDiscount += finalPrice;
  }

  // Step 2: Assert displayed total matches expected value (2 decimal precision)
  const displayedTotal = parseFloat(await totalAmountLocator.innerText());
  // Ensure the displayed total is close to the calculated total
  expect(displayedTotal).toBeCloseTo(totalPriceWithDiscount, 2);

  // Step 3: Remove each cart item and confirm total drops to $0.00
  // loop through each item and remove it
  for (let i = 0; i < itemCount; i++) {
    const item = cartItemsLocator.nth(0);
    await removeButtonLocator(item).click();
    await confirmRemoveLocator.click();
  }

  // Final check: total should be $0.00
  await expect(totalAmountLocator).toBeVisible();
  await expect(totalAmountLocator).toHaveText('0.00');
});

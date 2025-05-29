import { test, expect, Locator } from '@playwright/test';

// This test checks if increasing the quantity of items in the cart updates the total amount correctly.
// It first removes any out-of-stock items to avoid interference and then calculates total from scratch.

test('[cart] [ui] [smoke] Increasing quantity updates total correctly after removing out-of-stock items', async ({
  page,
}) => {
  await page.goto('/');

  const totalAmountLocator = page.locator('#totalAmount');
  const cartItemLocator = page.locator('.cart-item:not(.out-of-stock)');
  const outOfStockItemLocator = page.locator('.cart-item.out-of-stock');
  const removeButtonLocator = (item: Locator) => item.locator('button.remove-item');
  const confirmRemoveLocator = page.locator('#remove-confirm-modal .confirm-remove');

  // Remove all out-of-stock items - because they don't seem to be included in the total calculation
  const outOfStockCount = await outOfStockItemLocator.count();
  for (let i = 0; i < outOfStockCount; i++) {
    const item = outOfStockItemLocator.nth(0);
    await removeButtonLocator(item).click();
    await confirmRemoveLocator.click();
  }

  // Skip if no valid cart items left
  const itemCount = await cartItemLocator.count();
  test.skip(itemCount === 0, 'No valid cart items after removing out-of-stock. Skipping test.');

  // Helper to parse price
  const getPrice = async (item: Locator) => {
    const priceText = await item.locator('.price').innerText();
    return parseFloat(priceText.replace('$', '').trim());
  };

  // Helper to get discount
  const getDiscountPercent = async (item: Locator) => {
    const badge = item.locator('.discount-badge');
    if ((await badge.count()) === 0) return 0;
    const badgeText = await badge.innerText();
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

  // Helper to round to 2 decimal places
  const roundTo2 = (num: number) => Math.round(num * 100) / 100;

  let expectedTotal = 0;

  // Loop through each item to update quantity and calculate expected total
  for (let i = 0; i < itemCount; i++) {
    const item = cartItemLocator.nth(i);
    const quantityInput = item.locator('input.quantity');
    const unitPrice = await getPrice(item);
    const discount = await getDiscountPercent(item);
    const effectiveUnitPrice = roundTo2(unitPrice * (1 - discount / 100));
    const newQuantity = 2;

    // Update quantity
    await quantityInput.fill(newQuantity.toString());
    // Ensure the input is blurred to trigger any change events
    await quantityInput.blur();
    // Assert the input value is updated
    await expect(quantityInput).toHaveValue(newQuantity.toString());

    // calculate item total and add to expected total
    const itemTotal = roundTo2(effectiveUnitPrice * newQuantity);
    expectedTotal += itemTotal;
    // Log the item details, very helpful for debugging
    console.log(
      `Item ${i + 1}: $${unitPrice.toFixed(2)} x ${newQuantity} (${discount}% off) → $${itemTotal.toFixed(2)}`,
    );
  }

  // Final total assertion
  // Get the displayed total amount and compare with expected total
  const actualTotal = parseFloat(await totalAmountLocator.innerText());
  await expect(totalAmountLocator).toHaveText(expectedTotal.toFixed(2));
  expect(actualTotal).toBeCloseTo(expectedTotal, 2);
  // Log the expected vs actual total for debugging
  console.log(
    `Expected total: $${expectedTotal.toFixed(2)}, Actual total: $${actualTotal.toFixed(2)}`,
  );
});

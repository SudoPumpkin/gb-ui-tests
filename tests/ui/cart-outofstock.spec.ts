import { test, expect, Locator } from '@playwright/test';
// This test checks if the checkout button enables after removing an out-of-stock item from the cart.
// It also verifies that the 'checkout' button triggers an action when clicked.

test('[cart] [validation] [regression] Checkout button enables after removing out-of-stock item and triggers action on click', async ({
  page,
}) => {
  await page.goto('/');

  const outOfStockItemLocator = page.locator('.cart-item.out-of-stock');
  const removeButtonLocator = (item: Locator) => item.locator('button.remove-item');
  const confirmRemoveLocator = page.locator('#remove-confirm-modal .confirm-remove');
  const checkoutBtn = page.locator('#checkoutBtn');
  const confirmationLocator = page.locator('.checkout-confirmation');

  // Skip test if no out-of-stock items
  const outOfStockCount = await outOfStockItemLocator.count();
  test.skip(outOfStockCount === 0, 'No out-of-stock item present. Skipping test.');

  // Step 1: Assert initial disabled state
  await expect(checkoutBtn).toBeDisabled();
  await expect(checkoutBtn).toHaveAttribute('title', 'Please remove out-of-stock items to proceed');
  await expect(checkoutBtn).toHaveCSS('background-color', 'rgb(156, 163, 175)'); // #9ca3af
  await expect(checkoutBtn).toHaveCSS('cursor', 'not-allowed');

  // Step 2: Remove all out-of-stock items
  while ((await outOfStockItemLocator.count()) > 0) {
    const item = outOfStockItemLocator.first();
    await removeButtonLocator(item).click();
    await confirmRemoveLocator.click();
  }

  // Step 3: Assert button is now enabled and styled correctly
  await expect(checkoutBtn).toBeEnabled();
  await expect(checkoutBtn).not.toHaveAttribute(
    'title',
    'Please remove out-of-stock items to proceed',
  );
  await expect(checkoutBtn).toHaveCSS('background-color', 'rgb(16, 185, 129)'); // #10b981
  await expect(checkoutBtn).toHaveCSS('cursor', 'pointer');

  // Step 4: Click Checkout and verify placeholder confirmation element appears
  await checkoutBtn.click();
  await expect(confirmationLocator).toBeVisible(); // ?? maybe ??
});

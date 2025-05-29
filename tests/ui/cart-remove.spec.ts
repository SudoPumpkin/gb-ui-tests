import { test, expect, Locator } from '@playwright/test';
// This test checks if removing all items from the cart persists the empty state on page reload.

test('[cart] [persistence] [regression] [smoke] Removing all items persists on reload', async ({
  page,
}) => {
  await page.goto('/');

  // Early skip if cart is already empty
  const cartItemsLocator = page.locator('.cart-item');
  const initialItemCount = await cartItemsLocator.count();
  if (initialItemCount === 0) {
    test.skip(); // Cart is empty. Skipping test.
  }

  // Locators
  const removeButtonLocator = (item: Locator) => item.locator('button.remove-item');
  const confirmRemoveLocator = page.locator('#remove-confirm-modal .confirm-remove');

  // Step 1: Remove each cart item
  for (let i = 0; i < initialItemCount; i++) {
    const item = cartItemsLocator.nth(0); // always get the current first remaining item
    await removeButtonLocator(item).click();
    await confirmRemoveLocator.click();
  }

  // Step 2: Assert cart is now empty
  await expect(cartItemsLocator).toHaveCount(0);

  // Step 3: Reload the page and confirm cart is still empty
  await page.reload();
  await expect(cartItemsLocator).toHaveCount(0);
});

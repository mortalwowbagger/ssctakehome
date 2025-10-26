import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { InventoryPage } from '../src/pages/InventoryPage';
import { CartPage } from '../src/pages/CartPage';
import { CheckoutPage } from '../src/pages/CheckoutPage';
import { CheckoutCompletePage } from '../src/pages/CheckoutCompletePage';
import { userFactory, productFactory } from '../src/fixtures/testData';

test.describe('SauceDemo purchase flow', () => {
  test('E2E purchase happy path C38', async ({ page }, testInfo) => {
    // Explicit TestRail annotation (reporter also parses @C1001)
    testInfo.annotations.push({ type: 'testrail', description: '38' });

    const user = userFactory();
    const products = productFactory();

    const login = new LoginPage(page);
    await login.goto();
    await login.login(user.username, user.password);

    const inventory = new InventoryPage(page);
    for (const p of products) {
      await inventory.addProductByName(p);
    }
    await inventory.openCart();

    const cart = new CartPage(page);
    await cart.expectItems(products);
    await cart.checkout();

    const checkout = new CheckoutPage(page);
    await checkout.fillYourInfo(user.firstName, user.lastName, user.postalCode);
    await checkout.finish();

    const complete = new CheckoutCompletePage(page);
    await complete.expectSuccessMessage();

    // Logout for clean teardown / repeatability
    await page.getByRole('button', { name: /Back Home/i }).click();
    await expect(page).toHaveURL(/inventory.html/);
    await inventory.logout();
  });
});

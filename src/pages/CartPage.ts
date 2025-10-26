import { expect, Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async expectItems(names: string[]) {
    const items = this.page.locator('.cart_item');
    await expect(items).toHaveCount(names.length);

    // check each expected name is actually in the cart
    for (const name of names) {
      const item = items.filter({ hasText: name });
      await expect(item, `Cart is missing "${name}"`).toBeVisible();
    }
  }

  async checkout() {
    await this.page.getByRole('button', { name: 'Checkout' }).click();
    await expect(this.page).toHaveURL(/checkout-step-one.html/);
  }
}

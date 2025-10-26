import { expect, Page } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async addProductByName(name: string) {
    const item = this.page.locator('.inventory_item').filter({ hasText: name });
    await expect(item).toBeVisible();
    const addBtn = item.getByRole('button', { name: /Add to cart/i });
    await addBtn.click();
  }

  async openCart() {
    await this.page.locator('.shopping_cart_link').click();
    await expect(this.page).toHaveURL(/cart.html/);
  }

  async logout() {
    // Menu can be mid-animation → wait for link to be visible.
    await this.page.locator('#react-burger-menu-btn').click();
    await this.page.locator('#logout_sidebar_link').waitFor({ state: 'visible' });
    await this.page.locator('#logout_sidebar_link').click();
    // SauceDemo redirects to "/" (not explicitly index.html). Assert UI as well.
    await this.page.waitForURL(/(index\.html)?\/?$/);
    await expect(this.page.locator('#login-button')).toBeVisible();
}

}

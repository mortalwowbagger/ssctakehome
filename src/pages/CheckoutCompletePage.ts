import { expect, Page } from '@playwright/test';

export class CheckoutCompletePage {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async expectSuccessMessage() {
    // The H2 is stable; no need to match on exact casing.
    await expect(this.page.getByRole('heading', { name: /Thank you for your order!/i })).toBeVisible();
  }
}

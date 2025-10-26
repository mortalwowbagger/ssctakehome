import { expect, Page } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async fillYourInfo(firstName: string, lastName: string, postalCode: string) {
    // The step one form is simple; fill + continue.
    await this.page.locator('#first-name').fill(firstName);
    await this.page.locator('#last-name').fill(lastName);
    await this.page.locator('#postal-code').fill(postalCode);
    await this.page.getByRole('button', { name: 'Continue' }).click();
    await expect(this.page).toHaveURL(/checkout-step-two.html/);
  }

  async finish() {
    await this.page.getByRole('button', { name: 'Finish' }).click();
    await expect(this.page).toHaveURL(/checkout-complete.html/);
  }
}

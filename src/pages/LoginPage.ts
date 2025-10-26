import { expect, Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/');
    await expect(this.page.locator('#login-button')).toBeVisible();
  }

  async login(username: string, password: string) {
    // Prefer placeholders over brittle CSS for these inputs.
    await this.page.getByPlaceholder('Username').fill(username);
    await this.page.getByPlaceholder('Password').fill(password);
    await this.page.locator('#login-button').click();
    await expect(this.page).toHaveURL(/inventory.html/);
  }
}

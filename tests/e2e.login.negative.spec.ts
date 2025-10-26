import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';

test('Locked out user cannot log in C39', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'testrail', description: '39' });

  const login = new LoginPage(page);
  await login.goto();

  await page.getByPlaceholder('Username').fill('locked_out_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.locator('#login-button').click();

  await expect(page.locator('[data-test="error"]')).toContainText(/locked out/i);
});

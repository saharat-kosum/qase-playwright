import { expect } from '@playwright/test';

export async function loginAsUser(page, {
  accountId = '6870021001',
  password = '1234',
  name = 'Elly Musk',
  balance = 0,
  baseUrl = 'http://localhost:3000/',
} = {}) {
  await page.goto(baseUrl);
  await page.getByRole('textbox', { name: 'Account Number:' }).fill(accountId);
  await page.getByRole('textbox', { name: 'Password:' }).fill(password);
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByRole('heading', { name })).toBeVisible();
  await expect(page.getByRole('heading', { name: String(balance) })).toBeVisible();
}

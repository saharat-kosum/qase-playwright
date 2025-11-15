import { test, expect } from '@playwright/test';

test.describe('Scenario 2: Login ไม่ผ่าน', () => {
  test('SC2-TC3 Login failed - Incorrect password', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('textbox', { name: 'Account Number:' }).click();
    await page.getByRole('textbox', { name: 'Account Number:' }).fill('6870021001');
    await page.getByRole('textbox', { name: 'Password:' }).click();
    await page.getByRole('textbox', { name: 'Password:' }).fill('3456');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Incorrect password. Please try again.')).toBeVisible();
  });
});
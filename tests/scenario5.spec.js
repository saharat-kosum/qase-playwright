import { test, expect } from '@playwright/test';
import { resetUserBalance } from '../utils/resetUserBalance.js';
import { getMongoClient } from "../utils/mongoClient.js";
import { loginAsUser } from '../utils/loginAsUser.js';

test.describe('Scenario 5: Login ผ่าน ตามด้วย การฝากเงินที่ผ่าน ถอนเงินผ่าน และ โอนเงินไม่ผ่าน (ใส่เลขบัญชีที่จะรับเงินโอนผิด)', () => {
  test.beforeAll(async () => {
    await resetUserBalance('6870021002', 5);
  });

  test.afterAll(async () => {
    const client = getMongoClient();
    await client.close();
    console.log('✔ MongoDB connection closed');
  });

  test.beforeEach(async ({ page }) => {
    await resetUserBalance('6870021001', 0);

    await loginAsUser(page);

    await page.getByRole('spinbutton', { name: 'Please put your amount:' }).first().click();
    await page.getByRole('spinbutton', { name: 'Please put your amount:' }).first().fill('110');
    await page.getByRole('button', { name: 'Confirm' }).first().click();
    await expect(page.getByRole('heading', { name: '110' })).toBeVisible();

    await page.getByRole('spinbutton', { name: 'Please put your amount:' }).nth(1).click();
    await page.getByRole('spinbutton', { name: 'Please put your amount:' }).nth(1).fill('10');
    await page.getByRole('button', { name: 'Confirm' }).nth(1).click();
    await expect(page.getByRole('heading', { name: '100' })).toBeVisible();
  });

  test('SC5-TC10 Transfer failed - Account not found', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Please put target Account ID:' }).fill('6870021006');
    await page.locator('form').filter({ hasText: 'Please put target Account ID:' }).getByPlaceholder('Please fill amount').fill('20');
    await page.locator('form').filter({ hasText: 'Please put target Account ID:' }).getByRole('button').click();

    await expect(page.getByText('We couldn\'t find the recipient\'s account. Please double-check the account ID.')).toBeVisible();
  });
});

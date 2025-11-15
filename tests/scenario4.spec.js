import { test, expect } from '@playwright/test';
import { resetUserBalance } from '../utils/resetUserBalance.js';
import { getMongoClient } from "../utils/mongoClient.js";
import { loginAsUser } from '../utils/loginAsUser.js';

test.describe('Scenario 4: Login ผ่าน ตามด้วย การฝากเงินที่ผ่าน และ ถอนเงินที่ไม่ผ่าน(เงินในบัญชีไม่พอ)', () => {
  test.afterAll(async () => {
    const client = getMongoClient();
    await client.close();
    console.log('✔ MongoDB connection closed');
  });

  test.beforeEach(async ({ page }) => {
    await resetUserBalance('6870021001', 0);
    await loginAsUser(page);    

    await page.getByRole('spinbutton', { name: 'Please put your amount:' }).first().click();
    await page.getByRole('spinbutton', { name: 'Please put your amount:' }).first().fill('100');
    await page.getByRole('button', { name: 'Confirm' }).first().click();
    await expect(page.getByRole('heading', { name: '100' })).toBeVisible();
  });

  test('SC4-TC5 Withdraw Fail: Withdraw amount เป็นจำนวนเต็ม มากกว่ายอดเงินคงเหลือ', async ({ page }) => {
    await page.getByRole('spinbutton', { name: 'Please put your amount:' }).nth(1).click();
    await page.getByRole('spinbutton', { name: 'Please put your amount:' }).nth(1).fill('120');
    await page.getByRole('button', { name: 'Confirm' }).nth(1).click();
    await expect(page.getByText('Your balance is not enough to complete the withdrawal')).toBeVisible();
  });
});

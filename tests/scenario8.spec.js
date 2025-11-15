import { test, expect } from '@playwright/test';
import { resetUserBalance } from '../utils/resetUserBalance.js';
import { getMongoClient } from "../utils/mongoClient.js";
import { loginAsUser } from '../utils/loginAsUser.js';

test.describe('Scenario 8: Login ผ่าน ตามด้วย user1 โอนเงินให้ user2 และ user2 ถอนเงินไม่ผ่าน (ถอนมากกว่าจำนวนเงินในบัญชี)', () => {
  let page2;

  test.afterAll(async () => {
    const client = getMongoClient();
    await client.close();
    console.log('✔ MongoDB connection closed');
  });

  test.beforeEach(async ({ page }) => {
    await resetUserBalance('6870021001', 20);
    await resetUserBalance('6870021002', 0);
    await loginAsUser(page, { balance: 20 });

    await page.getByRole('textbox', { name: 'Please put target Account ID:' }).fill('6870021002');
    await page.locator('form').filter({ hasText: 'Please put target Account ID:' }).getByPlaceholder('Please fill amount').fill('10');
    await page.locator('form').filter({ hasText: 'Please put target Account ID:' }).getByRole('button').click();
    await expect(page.getByRole('heading', { name: 'Elly Musk' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '10' })).toBeVisible();

    page2 = await page.context().newPage();
    await loginAsUser(page2, {accountId: '6870021002', name: 'Hans Miller', balance: 10});
  });

  test('SC8-TC5 Withdraw failed - Amount is more than balance', async ({ page }) => {
    await page2.getByRole('spinbutton', { name: 'Please put your amount:' }).nth(1).click();
    await page2.getByRole('spinbutton', { name: 'Please put your amount:' }).nth(1).fill('20');
    await page2.getByRole('button', { name: 'Confirm' }).nth(1).click();

    await expect(page2.getByText('Your balance is not enough to complete the withdrawal')).toBeVisible();
  });
});

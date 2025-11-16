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

  test('SC8-TC1 Withdraw success', async ({ page }) => {
    await page2.getByRole('spinbutton', { name: 'Please put your amount:' }).nth(1).click();
    await page2.getByRole('spinbutton', { name: 'Please put your amount:' }).nth(1).fill('10');
    await page2.getByRole('button', { name: 'Confirm' }).nth(1).click();
    await expect(page2.getByRole('heading', { name: 'Hans Miller' })).toBeVisible();
    await expect(page2.getByRole('heading', { name: '0' })).toBeVisible();
  });

  test('SC8-TC2 Withdraw failed - Amount is decimal', async ({ page }) => {
    await page2.getByRole('spinbutton', { name: 'Please put your amount:' }).nth(1).click();
    await page2.getByRole('spinbutton', { name: 'Please put your amount:' }).nth(1).fill('8.5');
    await page2.getByRole('button', { name: 'Confirm' }).nth(1).click();

    const message = await page2.locator('[cid="w1"]').evaluate(el => el.validationMessage);
    expect(message).toBe('Please enter a valid value. The two nearest valid values are 8 and 9.');
  });

  test('SC8-TC3 Withdraw failed - Amount is less than 0', async ({ page }) => {
    await page2.getByRole('spinbutton', { name: 'Please put your amount:' }).nth(1).click();
    await page2.getByRole('spinbutton', { name: 'Please put your amount:' }).nth(1).fill('-1');
    await page2.getByRole('button', { name: 'Confirm' }).nth(1).click();

    await expect(page2.getByText('The amount must be greater than 0. Please enter a positive number.')).toBeVisible();
  });

  test('SC8-TC4 Withdraw failed - Amount is not a number', async ({ page }) => {
    await page2.getByRole('spinbutton', { name: 'Please put your amount:' }).nth(1).click();
    await page2.getByRole('spinbutton', { name: 'Please put your amount:' }).nth(1).type('e');
    await page2.getByRole('button', { name: 'Confirm' }).nth(1).click();

    const message = await page2.locator('[cid="w1"]').evaluate(el => el.validationMessage);
    expect(message).toBe('Please enter a number.');
  });

  test('SC8-TC5 Withdraw failed - Amount is more than balance', async ({ page }) => {
    await page2.getByRole('spinbutton', { name: 'Please put your amount:' }).nth(1).click();
    await page2.getByRole('spinbutton', { name: 'Please put your amount:' }).nth(1).fill('20');
    await page2.getByRole('button', { name: 'Confirm' }).nth(1).click();

    await expect(page2.getByText('Your balance is not enough to complete the withdrawal')).toBeVisible();
  });

  test('SC8-TC6 Withdraw failed - Amount is empty', async ({ page }) => {
    await page2.getByRole('button', { name: 'Confirm' }).nth(1).click();

    const message = await page2.locator('[cid="w1"]').evaluate(el => el.validationMessage);
    expect(message).toBe('Please fill out this field.');
  });
});

import { test, expect } from '@playwright/test';
import { resetUserBalance } from '../utils/resetUserBalance.js';
import { getMongoClient } from "../utils/mongoClient.js";
import { loginAsUser } from '../utils/loginAsUser.js';

test.describe('Scenario 4', () => {
  test.beforeAll(async () => {
    await resetUserBalance('6870021001', 100);
  });

  test.afterAll(async () => {
    const client = getMongoClient();
    await client.close();
    console.log('✔ MongoDB connection closed');
  });

  test.beforeEach(async ({ page }) => {
    await loginAsUser(page);    
  });

  test('เจอ bug SC4-TC7 Withdraw Fail: Withdraw amount เป็นตัวเลขทศนิยม', async ({ page }) => {
    await resetUserBalance('6870021001', 100);
    await page.getByRole('spinbutton', { name: 'Please put your amount:' }).nth(1).click();
    await page.getByRole('spinbutton', { name: 'Please put your amount:' }).nth(1).fill('50.00000001');
    await page.getByRole('button', { name: 'Confirm' }).nth(1).click();

    const message = await page.locator('[cid="w1"]').evaluate(el => el.validationMessage);
    expect(message).toBe('Please enter a valid value. The two nearest valid values are 50 and 51.');

  });



});

import { test, expect } from '@playwright/test';
import { resetUserBalance } from '../utils/resetUserBalance.js';
import { getMongoClient } from "../utils/mongoClient.js";
import { loginAsUser } from '../utils/loginAsUser.js';

test.describe('Scenario 6: Login ผ่าน ตามด้วย การจ่ายบิลที่ไม่ผ่าน', () => {
    test.beforeAll(async () => {
        await resetUserBalance('6870021001', 1000);
    });

    test.afterAll(async () => {
        const client = getMongoClient();
        await client.close();
        console.log('✔ MongoDB connection closed');
    });

    test.beforeEach(async ({ page }) => {
        await loginAsUser(page);
    });

    test('SC6-TC6 Bill Payment Fail - No select payment type', async ({ page }) => {
        await page.locator('form').filter({ hasText: 'Water ChargeElectric' }).getByPlaceholder('Please fill amount').click();
        await page.locator('form').filter({ hasText: 'Water ChargeElectric' }).getByPlaceholder('Please fill amount').fill('100');
        await page.locator('form').filter({ hasText: 'Water ChargeElectric' }).getByRole('button').click();

        const message = await page.locator('[cid="b1"]').evaluate(el => el.validationMessage);
        expect(message).toBe('Please select one of these options.');
    });
});
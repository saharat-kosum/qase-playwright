import { test, expect } from '@playwright/test';
import { resetUserBalance } from '../utils/resetUserBalance.js';
import { getMongoClient } from "../utils/mongoClient.js";
import { loginAsUser } from '../utils/loginAsUser.js';

test.describe('Scenario 7: Login ผ่าน ตามด้วย การจ่ายบิลที่ผ่าน', () => {
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

    test('SC7-TC1 Bill Payment Water Charge Pass', async ({ page }) => {
        await resetUserBalance('6870021001', 1000);

        await page.getByRole('radio').first().check();
        await page.locator('form').filter({ hasText: 'Water ChargeElectric' }).getByPlaceholder('Please fill amount').click();
        await page.locator('form').filter({ hasText: 'Water ChargeElectric' }).getByPlaceholder('Please fill amount').fill('100');
        await page.locator('form').filter({ hasText: 'Water ChargeElectric' }).getByRole('button').click();
        await expect(page.getByRole('heading', { name: '900' })).toBeVisible();
    });

    test('SC7-TC2 Bill Payment Electric Charge Pass', async ({ page }) => {
        await resetUserBalance('6870021001', 900);
        
        await page.getByRole('radio').nth(1).check();
        await page.locator('form').filter({ hasText: 'Water ChargeElectric' }).getByPlaceholder('Please fill amount').click();
        await page.locator('form').filter({ hasText: 'Water ChargeElectric' }).getByPlaceholder('Please fill amount').fill('100');
        await page.locator('form').filter({ hasText: 'Water ChargeElectric' }).getByRole('button').click();
        await expect(page.getByRole('heading', { name: '800' })).toBeVisible();
    });

    test('SC7-TC3 Bill Payment Phone Charge Pass', async ({ page }) => {
        await resetUserBalance('6870021001', 800);
        
        await page.getByRole('radio').nth(2).check();
        await page.locator('form').filter({ hasText: 'Water ChargeElectric' }).getByPlaceholder('Please fill amount').click();
        await page.locator('form').filter({ hasText: 'Water ChargeElectric' }).getByPlaceholder('Please fill amount').fill('100');
        await page.locator('form').filter({ hasText: 'Water ChargeElectric' }).getByRole('button').click();
        await expect(page.getByRole('heading', { name: '700' })).toBeVisible();
    });
});
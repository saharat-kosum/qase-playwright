import { test, expect } from '@playwright/test';
import { resetUserBalance } from '../utils/resetUserBalance.js';
import { getMongoClient } from "../utils/mongoClient.js";
import { loginAsUser } from '../utils/loginAsUser.js';

test.describe('Scenario 6', () => {
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

    test('SC6-TC1 Bill Payment Fail - Payment amount is not decimal', async ({ page }) => {
        await resetUserBalance('6870021001', 1000);
        
        await page.getByRole('radio').first().check();
        await page.locator('form').filter({ hasText: 'Water ChargeElectric' }).getByPlaceholder('Please fill amount').click();
        await page.locator('form').filter({ hasText: 'Water ChargeElectric' }).getByPlaceholder('Please fill amount').fill('50.5');
        await page.locator('form').filter({ hasText: 'Water ChargeElectric' }).getByRole('button').click();

        const message = await page.locator('[cid="b4"]').evaluate(el => el.validationMessage);
        expect(message).toBe('Please enter a valid value. The two nearest valid values are 50 and 51.');
    });

    test('SC6-TC2 Bill Payment Fail - Payment amount is decimal & less than 0', async ({ page }) => {
        await resetUserBalance('6870021001', 1000);
        
        await page.getByRole('radio').nth(1).check();
        await page.locator('form').filter({ hasText: 'Water ChargeElectric' }).getByPlaceholder('Please fill amount').click();
        await page.locator('form').filter({ hasText: 'Water ChargeElectric' }).getByPlaceholder('Please fill amount').fill('-100');
        await page.locator('form').filter({ hasText: 'Water ChargeElectric' }).getByRole('button').click();

        await expect(page.getByText('The amount must be greater than 0. Please enter a positive number.')).toBeVisible();
    });

    // test('SC6-TC3 Bill Payment Fail - Payment amount is not a number', async ({ page }) => {
    //     await resetUserBalance('6870021001', 1000);
    //     await page.getByRole('radio').nth(2).check();
    //     await page.locator('form').filter({ hasText: 'Water ChargeElectric' }).getByPlaceholder('Please fill amount').click();
    //     await page.locator('form').filter({ hasText: 'Water ChargeElectric' }).getByPlaceholder('Please fill amount').fill('e');
    //     await page.locator('form').filter({ hasText: 'Water ChargeElectric' }).getByRole('button').click();

    //     const message = await page.locator('[cid="b4"]').evaluate(el => el.validationMessage);
    //     expect(message).toBe('Please enter a number.');
    // });

    test('SC6-TC4 Bill Payment Fail - Payment amount is blank', async ({ page }) => {
        await resetUserBalance('6870021001', 1000);
        
        await page.getByRole('radio').first().check();
        await page.locator('form').filter({ hasText: 'Water ChargeElectric' }).getByPlaceholder('Please fill amount').click();
        await page.locator('form').filter({ hasText: 'Water ChargeElectric' }).getByPlaceholder('Please fill amount').fill('');
        await page.locator('form').filter({ hasText: 'Water ChargeElectric' }).getByRole('button').click();

        const message = await page.locator('[cid="b4"]').evaluate(el => el.validationMessage);
        expect(message).toBe('Please fill out this field.');
    });

    test('SC6-TC5 Bill Payment Fail - Payment amount is more than balance', async ({ page }) => {
        await resetUserBalance('6870021001', 1000);
        
        await page.getByRole('radio').nth(2).check();
        await page.locator('form').filter({ hasText: 'Water ChargeElectric' }).getByPlaceholder('Please fill amount').click();
        await page.locator('form').filter({ hasText: 'Water ChargeElectric' }).getByPlaceholder('Please fill amount').fill('3000');
        await page.locator('form').filter({ hasText: 'Water ChargeElectric' }).getByRole('button').click();

        await expect(page.getByText('Your balance is not enough to complete the bill payment.')).toBeVisible();
    });

    test('SC6-TC6 Bill Payment Fail - No select payment type', async ({ page }) => {
        await resetUserBalance('6870021001', 1000);
        
        await page.locator('form').filter({ hasText: 'Water ChargeElectric' }).getByPlaceholder('Please fill amount').click();
        await page.locator('form').filter({ hasText: 'Water ChargeElectric' }).getByPlaceholder('Please fill amount').fill('100');
        await page.locator('form').filter({ hasText: 'Water ChargeElectric' }).getByRole('button').click();

        const message = await page.locator('[cid="b1"]').evaluate(el => el.validationMessage);
        expect(message).toBe('Please select one of these options.');
    });

});
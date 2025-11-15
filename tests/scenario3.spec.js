import { test, expect } from '@playwright/test';
import { loginAsUser } from '../utils/loginAsUser.js';
import { resetUserBalance } from '../utils/resetUserBalance.js';
import { getMongoClient } from "../utils/mongoClient.js";
import { openDb, setBalance, closeDb } from '../utils/db'

test.describe('Scenario 3: Login ผ่าน ตามด้วย การฝากเงินไม่ผ่าน', () => {
    test.beforeAll(async () => {
        await openDb();
    });

    test.beforeEach(async ({ page }) => {
        await setBalance('6870021001', 0);
        await loginAsUser(page);
    });

    test.afterEach(async ({ page }) => {
        await setBalance('6870021001', 0);
    });

    test.afterAll(async () => {
        await closeDb();
    });

    test('SC3-TC3: Deposit fail with amount = -1', async ({ page }) => {
        await page.getByRole('spinbutton', { name: 'Please put your amount:' }).first().click();
        await page.getByRole('spinbutton', { name: 'Please put your amount:' }).first().fill('-1');
        await page.getByRole('button', { name: 'Confirm' }).first().click();
        await expect(page.locator('#root')).toContainText('The amount must be greater than 0. Please enter a positive number.');
    });
});
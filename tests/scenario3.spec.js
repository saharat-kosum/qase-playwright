import { test, expect } from '@playwright/test';
import { loginAsUser } from '../utils/loginAsUser.js';
import { resetUserBalance } from '../utils/resetUserBalance.js';
import { getMongoClient } from "../utils/mongoClient.js";
import { openDb, setBalance, closeDb } from '../utils/db'

test.describe('Scenario 3', () => {
    test.beforeAll(async () => {
        await openDb();
    });

    test.beforeEach(async ({ page }) => {

        await loginAsUser(page, {
            accountId: '6870021001',
            password: '1234',
            name: 'Elly Musk',
            balance: 0,
            baseUrl: 'http://localhost:3000/',
        });
    });

    test.afterEach(async ({ page }) => {
        await setBalance('6870021001', 0);
    });

    test.afterAll(async () => {
        await closeDb();
    });

    test('SC3-TC1: Deposit success', async ({ page }) => {
        await page.getByRole('spinbutton', { name: 'Please put your amount:' }).first().click();
        await page.getByRole('spinbutton', { name: 'Please put your amount:' }).first().fill('100');
        await page.getByRole('button', { name: 'Confirm' }).first().click();
        await expect(page.locator('#root')).toContainText('200');
    });

    test('SC3-TC2: Deposit fail with amount = 0.1', async ({ page }) => {
        await page.getByRole('spinbutton', { name: 'Please put your amount:' }).first().click();
        await page.getByRole('spinbutton', { name: 'Please put your amount:' }).first().fill('0.1');
        await page.getByRole('button', { name: 'Confirm' }).first().click();
        await expect(page.locator('#root')).toContainText('100');
    });

    test('SC3-TC3: Deposit fail with amount = -1', async ({ page }) => {
        await page.getByRole('spinbutton', { name: 'Please put your amount:' }).first().click();
        await page.getByRole('spinbutton', { name: 'Please put your amount:' }).first().fill('-1');
        await page.getByRole('button', { name: 'Confirm' }).first().click();
        await expect(page.locator('#root')).toContainText('The amount must be greater than 0. Please enter a positive number.');
    });

    // test('SC3-TC4: Deposit fail with amount = +', async ({ page }) => {
    //     await page.getByRole('spinbutton', { name: 'Please put your amount:' }).first().click();
    //     await page.getByRole('spinbutton', { name: 'Please put your amount:' }).first().fill('+');
    //     await page.getByRole('button', { name: 'Confirm' }).first().click();
    //     await expect(page.locator('#root')).toContainText('0');
    // });

    test('SC3-TC5: Deposit fail with amount = empty string', async ({ page }) => {
        await page.goto('http://localhost:3000/account/');
        await page.getByRole('spinbutton', { name: 'Please put your amount:' }).first().click();
        await page.getByRole('spinbutton', { name: 'Please put your amount:' }).first().fill('');
        await page.getByRole('button', { name: 'Confirm' }).first().click();
        await expect(page.locator('#root')).toContainText('0');
    });


});
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

  
  test('SC4-TC1', async ({ page }) => {
    await page.getByRole('spinbutton', { name: 'Please put your amount:' }).nth(1).click();
    await page.getByRole('spinbutton', { name: 'Please put your amount:' }).nth(1).fill('50');
    await page.getByRole('button', { name: 'Confirm' }).nth(1).click();
    await expect(page.getByRole('heading', { name: '50' })).toBeVisible();

  });

  test('SC4-TC2', async ({ page }) => {
    await page.getByRole('spinbutton', { name: 'Please put your amount:' }).nth(1).click();
    await page.getByRole('spinbutton', { name: 'Please put your amount:' }).nth(1).fill('50.00000001');
    await page.getByRole('button', { name: 'Confirm' }).nth(1).click();

    const message = await page.locator('[cid="t2"]').evaluate(el => el.validationMessage);
    expect(message).toBe('Please enter a valid value. The two nearest valid values are 50 and 51.');
    await expect(page.getByRole('heading', { name: '100' })).toBeVisible();

  });

    test('SC4-TC3', async ({ page }) => {
    await page.getByRole('spinbutton', { name: 'Please put your amount:' }).nth(1).click();
    await page.getByRole('spinbutton', { name: 'Please put your amount:' }).nth(1).fill('-1');
    await page.getByRole('button', { name: 'Confirm' }).nth(1).click();
    await expect(page.getByText('The amount must be greater than 0. Please enter a positive number.')).toBeVisible();
    await expect(page.getByRole('heading', { name: '100' })).toBeVisible();

  });

  test('SC4-TC4', async ({ page }) => {
    await page.getByRole('spinbutton', { name: 'Please put your amount:' }).nth(1).click();
    await page.getByRole('spinbutton', { name: 'Please put your amount:' }).nth(1).fill('+');
    await page.getByRole('button', { name: 'Confirm' }).nth(1).click();
    const message = await page.locator('[cid="t2"]').evaluate(el => el.validationMessage);
    expect(message).toBe('Please enter a number');
    await expect(page.getByRole('heading', { name: '100' })).toBeVisible();

  });


  test('SC4-TC5', async ({ page }) => {
    await page.getByRole('spinbutton', { name: 'Please put your amount:' }).nth(1).click();
    await page.getByRole('spinbutton', { name: 'Please put your amount:' }).nth(1).fill('120');
    await page.getByRole('button', { name: 'Confirm' }).nth(1).click();
    await expect(page.getByText('Your balance is not enough to complete the withdrawal')).toBeVisible();
    await expect(page.getByRole('heading', { name: '100' })).toBeVisible();
  });


   test('SC4-TC6', async ({ page }) => {
    await page.getByRole('spinbutton', { name: 'Please put your amount:' }).nth(1).click();
    await page.getByRole('button', { name: 'Confirm' }).nth(1).click();
    const message = await page.locator('[cid="t2"]').evaluate(el => el.validationMessage);
    expect(message).toBe('Please fill out this field.');
    await expect(page.getByRole('heading', { name: '100' })).toBeVisible();
  });
});

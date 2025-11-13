import { test, expect } from '@playwright/test';
import { resetUserBalance } from '../utils/resetUserBalance.js';
import { getMongoClient } from "../utils/mongoClient.js";
import { loginAsUser } from '../utils/loginAsUser.js';

test.describe('Scenario 5', () => {
  test.beforeAll(async () => {
    await resetUserBalance('6870021002', 5);
  });

  test.afterAll(async () => {
    const client = getMongoClient();
    await client.close();
    console.log('✔ MongoDB connection closed');
  });

  test.beforeEach(async ({ page }) => {
    await resetUserBalance('6870021001', 0);

    await loginAsUser(page);

    await page.getByRole('spinbutton', { name: 'Please put your amount:' }).first().click();
    await page.getByRole('spinbutton', { name: 'Please put your amount:' }).first().fill('110');
    await page.getByRole('button', { name: 'Confirm' }).first().click();
    await expect(page.getByRole('heading', { name: '110' })).toBeVisible();

    await page.getByRole('spinbutton', { name: 'Please put your amount:' }).nth(1).click();
    await page.getByRole('spinbutton', { name: 'Please put your amount:' }).nth(1).fill('10');
    await page.getByRole('button', { name: 'Confirm' }).nth(1).click();
    await expect(page.getByRole('heading', { name: '100' })).toBeVisible();
  });

  test('SC5-TC1 Transfer success', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Please put target Account ID:' }).fill('6870021002');
    await page.locator('form').filter({ hasText: 'Please put target Account ID:' }).getByPlaceholder('Please fill amount').fill('10');
    await page.locator('form').filter({ hasText: 'Please put target Account ID:' }).getByRole('button').click();

    await expect(page.getByRole('heading', { name: 'Elly Musk' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '90' })).toBeVisible();

    // Login to second account to verify balance
    const page2 = await page.context().newPage();
    await page2.goto('http://localhost:3000/');
    await page2.getByRole('textbox', { name: 'Account Number:' }).fill('6870021002');
    await page2.getByRole('textbox', { name: 'Password:' }).fill('1234');
    await page2.getByRole('button', { name: 'Login' }).click();

    await expect(page2.getByRole('heading', { name: 'Hans Miller' })).toBeVisible();
    await expect(page2.getByRole('heading', { name: '15' })).toBeVisible();
  });

  test('SC5-TC2 Transfer failed - Account is not a number', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Please put target Account ID:' }).fill('mmmmmmmmmm');
    await page.locator('form').filter({ hasText: 'Please put target Account ID:' }).getByPlaceholder('Please fill amount').fill('20');
    await page.locator('form').filter({ hasText: 'Please put target Account ID:' }).getByRole('button').click();

    await expect(page.getByText('Your account ID should')).toBeVisible();
  });

  test('SC5-TC3 Transfer failed - Account less than 10 digits', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Please put target Account ID:' }).fill('687002100');
    await page.locator('form').filter({ hasText: 'Please put target Account ID:' }).getByPlaceholder('Please fill amount').fill('20');
    await page.locator('form').filter({ hasText: 'Please put target Account ID:' }).getByRole('button').click();

    await expect(page.getByText('Your account ID must be')).toBeVisible();
  });

  test('SC5-TC4 Transfer failed - Account more than 10 digits', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Please put target Account ID:' }).fill('68700210010');
    await page.locator('form').filter({ hasText: 'Please put target Account ID:' }).getByPlaceholder('Please fill amount').fill('20');
    await page.locator('form').filter({ hasText: 'Please put target Account ID:' }).getByRole('button').click();

    await expect(page.getByText('Your account ID must be')).toBeVisible();
  });

  test('SC5-TC5 Transfer failed - Account is empty', async ({ page }) => {
    await page.locator('form').filter({ hasText: 'Please put target Account ID:' }).getByPlaceholder('Please fill amount').fill('20');
    await page.locator('form').filter({ hasText: 'Please put target Account ID:' }).getByRole('button').click();

    const message = await page.$eval('#accountId', el => el.validationMessage);
    expect(message).toBe('Please fill out this field.');
  });

  test('SC5-TC6 Transfer failed - Amount is decimal', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Please put target Account ID:' }).fill('6870021002');
    await page.locator('form').filter({ hasText: 'Please put target Account ID:' }).getByPlaceholder('Please fill amount').fill('20.55');
    await page.locator('form').filter({ hasText: 'Please put target Account ID:' }).getByRole('button').click();

    const message = await page.locator('[cid="t2"]').evaluate(el => el.validationMessage);
    expect(message).toBe('Please enter a valid value. The two nearest valid values are 20 and 21.');
  });

  test('SC5-TC7 Transfer failed - Amount is less than 0', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Please put target Account ID:' }).fill('6870021002');
    await page.locator('form').filter({ hasText: 'Please put target Account ID:' }).getByPlaceholder('Please fill amount').fill('-1');
    await page.locator('form').filter({ hasText: 'Please put target Account ID:' }).getByRole('button').click();

    await expect(page.getByText('The amount must be greater')).toBeVisible();
  });

  test('SC5-TC8 Transfer failed - Amount is not a number', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Please put target Account ID:' }).fill('6870021002');
    await page.locator('form').filter({ hasText: 'Please put target Account ID:' }).getByPlaceholder('Please fill amount').fill('e');
    await page.locator('form').filter({ hasText: 'Please put target Account ID:' }).getByRole('button').click();

    const message = await page.locator('[cid="t2"]').evaluate(el => el.validationMessage);
    expect(message).toBe('Please enter a number.');
  });

  test('SC5-TC9 Transfer failed - Amount is more than balance', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Please put target Account ID:' }).fill('6870021002');
    await page.locator('form').filter({ hasText: 'Please put target Account ID:' }).getByPlaceholder('Please fill amount').fill('500');
    await page.locator('form').filter({ hasText: 'Please put target Account ID:' }).getByRole('button').click();

    await expect(page.getByText('Your balance is not enough to')).toBeVisible();
  });

  test('SC5-TC10 Transfer failed - Account not found', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Please put target Account ID:' }).fill('6870021006');
    await page.locator('form').filter({ hasText: 'Please put target Account ID:' }).getByPlaceholder('Please fill amount').fill('20');
    await page.locator('form').filter({ hasText: 'Please put target Account ID:' }).getByRole('button').click();

    await expect(page.getByText('We couldn\'t find the')).toBeVisible();
  });

  test('SC5-TC11 Transfer failed - Same Account', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Please put target Account ID:' }).fill('6870021001');
    await page.locator('form').filter({ hasText: 'Please put target Account ID:' }).getByPlaceholder('Please fill amount').fill('20');
    await page.locator('form').filter({ hasText: 'Please put target Account ID:' }).getByRole('button').click();

    await expect(page.getByText('You cannot transfer to your')).toBeVisible();
  });

  test('SC5-TC12 Transfer failed - Amount is empty', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Please put target Account ID:' }).fill('6870021002');
    await page.locator('form').filter({ hasText: 'Please put target Account ID:' }).getByRole('button').click();

    const message = await page.locator('[cid="t2"]').evaluate(el => el.validationMessage);
    expect(message).toBe('Please fill out this field.');
  });
});

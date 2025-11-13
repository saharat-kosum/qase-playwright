import { test, expect } from '@playwright/test';
import { MongoClient } from 'mongodb';
require('dotenv').config();

const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME;
const ACCOUNT_ID = '6870021001';

if (!MONGO_URL) {
  throw new Error('MONGO_URL env variable is required');
}

if (!DB_NAME) {
  throw new Error('DB_NAME env variable is required');
}

test.describe('Scenario 5', () => {
  test.beforeAll(async () => {
    const client = new MongoClient(MONGO_URL);

    await client.connect();
    const db = client.db(DB_NAME);
    const users = db.collection('users');

    await users.updateOne(
      { accountId: ACCOUNT_ID },
      {
        $set: {
          balance: 0,          // reset balance
          transactions: []       // clear history
        }
      }
    );

    console.log(`✔ MongoDB reset balance = 0 for account ${ACCOUNT_ID}`);
    await client.close();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('textbox', { name: 'Account Number:' }).click();
    await page.getByRole('textbox', { name: 'Account Number:' }).fill('6870021001');
    await page.getByRole('textbox', { name: 'Password:' }).click();
    await page.getByRole('textbox', { name: 'Password:' }).fill('1234');
    await page.getByRole('button', { name: 'Login' }).click();

    await page.waitForTimeout(1000); // wait 1 seconds
    await page.getByRole('spinbutton', { name: 'Please put your amount:' }).first().click();
    await page.getByRole('spinbutton', { name: 'Please put your amount:' }).first().fill('110');
    await page.getByRole('button', { name: 'Confirm' }).first().click();

    await page.waitForTimeout(1000); // wait 1 seconds
    await page.getByRole('spinbutton', { name: 'Please put your amount:' }).nth(1).click();
    await page.getByRole('spinbutton', { name: 'Please put your amount:' }).nth(1).fill('10');
    await page.getByRole('button', { name: 'Confirm' }).nth(1).click();
  });

  test('TC01 Transfer success', async ({ page }) => {
    await page.waitForTimeout(1000); // wait 1 seconds
    await page.getByRole('textbox', { name: 'Please put target Account ID:' }).fill('6870021002');
    await page.locator('form').filter({ hasText: 'Please put target Account ID:' }).getByPlaceholder('Please fill amount').fill('10');
    await page.locator('form').filter({ hasText: 'Please put target Account ID:' }).getByRole('button').click();

    await expect(page.getByRole('heading', { name: '90' })).toBeVisible();
  });
});

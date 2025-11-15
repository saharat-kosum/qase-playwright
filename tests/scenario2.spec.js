import { test, expect } from '@playwright/test';

test.describe('Scenario 2: Login ไม่ผ่าน', () => {
  test('SC2-TC1 Login success', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('textbox', { name: 'Account Number:' }).click();
    await page.getByRole('textbox', { name: 'Account Number:' }).fill('6870021001');
    await page.getByRole('textbox', { name: 'Password:' }).click();
    await page.getByRole('textbox', { name: 'Password:' }).fill('1234');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(/account/);
    await expect(page.getByRole('heading', { name: 'Elly Musk' })).toBeVisible();
  });

  test('SC2-TC2 Login failed - Account number not found', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('textbox', { name: 'Account Number:' }).click();
    await page.getByRole('textbox', { name: 'Account Number:' }).fill('6870021006');
    await page.getByRole('textbox', { name: 'Password:' }).click();
    await page.getByRole('textbox', { name: 'Password:' }).fill('1234');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('User not found. Please check')).toBeVisible();
  });

  test('SC2-TC3 Login failed - Incorrect password', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('textbox', { name: 'Account Number:' }).click();
    await page.getByRole('textbox', { name: 'Account Number:' }).fill('6870021001');
    await page.getByRole('textbox', { name: 'Password:' }).click();
    await page.getByRole('textbox', { name: 'Password:' }).fill('3456');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Incorrect password. Please')).toBeVisible();
  });

  test('SC2-TC4 Login failed - Account number is not a number', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('textbox', { name: 'Account Number:' }).click();
    await page.getByRole('textbox', { name: 'Account Number:' }).fill('687002100m');
    await page.getByRole('textbox', { name: 'Password:' }).click();
    await page.getByRole('textbox', { name: 'Password:' }).fill('1234');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Your account ID should')).toBeVisible();
  });

  test('SC2-TC5 Login failed - Account number less than 10 digits', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('textbox', { name: 'Account Number:' }).click();
    await page.getByRole('textbox', { name: 'Account Number:' }).fill('687002100');
    await page.getByRole('textbox', { name: 'Password:' }).click();
    await page.getByRole('textbox', { name: 'Password:' }).fill('1234');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Your account ID must be')).toBeVisible();
  });

  test('SC2-TC6 Login failed - Account number more than 10 digits', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('textbox', { name: 'Account Number:' }).click();
    await page.getByRole('textbox', { name: 'Account Number:' }).fill('68700210012');
    await page.getByRole('textbox', { name: 'Password:' }).click();
    await page.getByRole('textbox', { name: 'Password:' }).fill('1234');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Your account ID must be')).toBeVisible();
  });

  test('SC2-TC7 Login failed - Account number is empty', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('textbox', { name: 'Password:' }).click();
    await page.getByRole('textbox', { name: 'Password:' }).fill('1234');
    await page.getByRole('button', { name: 'Login' }).click();

    const message = await page.$eval('#accountId', el => el.validationMessage);
    expect(message).toBe('Please fill out this field.');
  });

  test('SC2-TC8 Login failed - Password is not a number', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('textbox', { name: 'Account Number:' }).click();
    await page.getByRole('textbox', { name: 'Account Number:' }).fill('6870021001');
    await page.getByRole('textbox', { name: 'Password:' }).click();
    await page.getByRole('textbox', { name: 'Password:' }).fill('mmmm');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Your password should contain')).toBeVisible();
  });

  test('SC2-TC9 Login failed - Password less than 4 digits', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('textbox', { name: 'Account Number:' }).click();
    await page.getByRole('textbox', { name: 'Account Number:' }).fill('6870021001');
    await page.getByRole('textbox', { name: 'Password:' }).click();
    await page.getByRole('textbox', { name: 'Password:' }).fill('123');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Your password must be exactly')).toBeVisible();
  });

  test('SC2-TC10 Login failed - Password more than 4 digits', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('textbox', { name: 'Account Number:' }).click();
    await page.getByRole('textbox', { name: 'Account Number:' }).fill('6870021001');
    await page.getByRole('textbox', { name: 'Password:' }).click();
    await page.getByRole('textbox', { name: 'Password:' }).fill('12345');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Your password must be exactly')).toBeVisible();
  });

  test('SC2-TC11 Login failed - Password is empty', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('textbox', { name: 'Account Number:' }).click();
    await page.getByRole('textbox', { name: 'Account Number:' }).fill('6870021001');
    await page.getByRole('button', { name: 'Login' }).click();

    const message = await page.$eval('#password', el => el.validationMessage);
    expect(message).toBe('Please fill out this field.');
  });
});
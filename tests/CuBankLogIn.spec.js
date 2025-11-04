import { test, expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
});

test(qase(14, 'TC01 Login success'), async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('textbox', { name: 'Account Number:' }).click();
  await page.getByRole('textbox', { name: 'Account Number:' }).fill('6870021001');
  await page.getByRole('textbox', { name: 'Password:' }).click();
  await page.getByRole('textbox', { name: 'Password:' }).fill('1234');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/account/);
  await expect(page.getByRole('heading', { name: 'Elly Musk' })).toBeVisible();
});

test(qase(16, 'TC02 Login failed - Account number not found'), async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('textbox', { name: 'Account Number:' }).click();
  await page.getByRole('textbox', { name: 'Account Number:' }).fill('6870021006');
  await page.getByRole('textbox', { name: 'Password:' }).click();
  await page.getByRole('textbox', { name: 'Password:' }).fill('1234');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByText('User not found. Please check')).toBeVisible();
});

test(qase(17, 'TC03 Login failed - Incorrect password'), async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('textbox', { name: 'Account Number:' }).click();
  await page.getByRole('textbox', { name: 'Account Number:' }).fill('6870021001');
  await page.getByRole('textbox', { name: 'Password:' }).click();
  await page.getByRole('textbox', { name: 'Password:' }).fill('3456');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByText('Incorrect password. Please')).toBeVisible();
});

test(qase(18, 'TC04 Login failed - Account number is not a number'), async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('textbox', { name: 'Account Number:' }).click();
  await page.getByRole('textbox', { name: 'Account Number:' }).fill('687002100m');
  await page.getByRole('textbox', { name: 'Password:' }).click();
  await page.getByRole('textbox', { name: 'Password:' }).fill('1234');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByText('Your account ID should')).toBeVisible();
});

test(qase(19, 'TC05 Login failed - Account number less than 10 digits'), async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('textbox', { name: 'Account Number:' }).click();
  await page.getByRole('textbox', { name: 'Account Number:' }).fill('687002100');
  await page.getByRole('textbox', { name: 'Password:' }).click();
  await page.getByRole('textbox', { name: 'Password:' }).fill('1234');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByText('Your account ID must be')).toBeVisible();
});

test(qase(20, 'TC06 Login failed - Account number more than 10 digits'), async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('textbox', { name: 'Account Number:' }).click();
  await page.getByRole('textbox', { name: 'Account Number:' }).fill('68700210012');
  await page.getByRole('textbox', { name: 'Password:' }).click();
  await page.getByRole('textbox', { name: 'Password:' }).fill('1234');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByText('Your account ID must be')).toBeVisible();
});

test(qase(21, 'TC07 Login failed - Account number is empty'), async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('textbox', { name: 'Password:' }).click();
  await page.getByRole('textbox', { name: 'Password:' }).fill('1234');
  await page.getByRole('button', { name: 'Login' }).click();

  const message = await page.$eval('#accountId', el => el.validationMessage);
  expect(message).toBe('Please fill out this field.');
});

test(qase(22, 'TC08 Login failed - Password is not a number'), async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('textbox', { name: 'Account Number:' }).click();
  await page.getByRole('textbox', { name: 'Account Number:' }).fill('6870021001');
  await page.getByRole('textbox', { name: 'Password:' }).click();
  await page.getByRole('textbox', { name: 'Password:' }).fill('mmmm');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByText('Your password should contain')).toBeVisible();
});

test(qase(23, 'TC09 Login failed - Password less than 4 digits'), async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('textbox', { name: 'Account Number:' }).click();
  await page.getByRole('textbox', { name: 'Account Number:' }).fill('6870021001');
  await page.getByRole('textbox', { name: 'Password:' }).click();
  await page.getByRole('textbox', { name: 'Password:' }).fill('123');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByText('Your password must be exactly')).toBeVisible();
});

test(qase(24, 'TC10 Login failed - Password more than 4 digits'), async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('textbox', { name: 'Account Number:' }).click();
  await page.getByRole('textbox', { name: 'Account Number:' }).fill('6870021001');
  await page.getByRole('textbox', { name: 'Password:' }).click();
  await page.getByRole('textbox', { name: 'Password:' }).fill('12345');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByText('Your password must be exactly')).toBeVisible();
});

test(qase(25, 'TC11 Login failed - Password is empty'), async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('textbox', { name: 'Account Number:' }).click();
  await page.getByRole('textbox', { name: 'Account Number:' }).fill('6870021001');
  await page.getByRole('button', { name: 'Login' }).click();

  const message = await page.$eval('#password', el => el.validationMessage);
  expect(message).toBe('Please fill out this field.');
});
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

  test('SC2-TC2 Login failed - Account Number ไม่มีในระบบ', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('textbox', { name: 'Account Number:' }).click();
    await page.getByRole('textbox', { name: 'Account Number:' }).fill('6870021006');
    await page.getByRole('textbox', { name: 'Password:' }).click();
    await page.getByRole('textbox', { name: 'Password:' }).fill('1234');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('User not found. Please check your account ID.')).toBeVisible();
  });

  test('SC2-TC3 Login failed - Password เป็นตัวเลขจำนวน 4 หลัก ไม่ตรงกับในระบบ', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('textbox', { name: 'Account Number:' }).click();
    await page.getByRole('textbox', { name: 'Account Number:' }).fill('6870021001');
    await page.getByRole('textbox', { name: 'Password:' }).click();
    await page.getByRole('textbox', { name: 'Password:' }).fill('3456');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Incorrect password. Please try again.')).toBeVisible();
  });

  test('SC2-TC4 Login failed - Account Number ไม่ใช่ตัวเลข', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('textbox', { name: 'Account Number:' }).click();
    await page.getByRole('textbox', { name: 'Account Number:' }).fill('687002100m');
    await page.getByRole('textbox', { name: 'Password:' }).click();
    await page.getByRole('textbox', { name: 'Password:' }).fill('1234');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Your account ID should contain numbers only.')).toBeVisible();
  });

  test('SC2-TC5 Login failed - Account Number เป็นตัวเลขจำนวนน้อยกว่า 10 หลัก', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('textbox', { name: 'Account Number:' }).click();
    await page.getByRole('textbox', { name: 'Account Number:' }).fill('687002100');
    await page.getByRole('textbox', { name: 'Password:' }).click();
    await page.getByRole('textbox', { name: 'Password:' }).fill('1234');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Your account ID must be exactly 10 digits long.')).toBeVisible();
  });

  test('SC2-TC6 Login failed - Account Number เป็นตัวเลขจำนวนมากกว่า 10 หลัก', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('textbox', { name: 'Account Number:' }).click();
    await page.getByRole('textbox', { name: 'Account Number:' }).fill('68700210012');
    await page.getByRole('textbox', { name: 'Password:' }).click();
    await page.getByRole('textbox', { name: 'Password:' }).fill('1234');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Your account ID must be exactly 10 digits long.')).toBeVisible();
  });

  test('SC2-TC7 Login failed - Account Number เป็นค่าว่าง', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('textbox', { name: 'Password:' }).click();
    await page.getByRole('textbox', { name: 'Password:' }).fill('1234');
    await page.getByRole('button', { name: 'Login' }).click();

    const message = await page.$eval('#accountId', el => el.validationMessage);
    expect(message).toBe('Please fill out this field.');
  });

  test('SC2-TC8 Login failed - Password ไม่ใช่ตัวเลขจำนวน 4 หลัก', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('textbox', { name: 'Account Number:' }).click();
    await page.getByRole('textbox', { name: 'Account Number:' }).fill('6870021001');
    await page.getByRole('textbox', { name: 'Password:' }).click();
    await page.getByRole('textbox', { name: 'Password:' }).fill('mmmm');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Your password should contain numbers only.')).toBeVisible();
  });

  test('SC2-TC9 Login failed - Password เป็นตัวเลขจำนวนน้อยกว่า 4 หลัก', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('textbox', { name: 'Account Number:' }).click();
    await page.getByRole('textbox', { name: 'Account Number:' }).fill('6870021001');
    await page.getByRole('textbox', { name: 'Password:' }).click();
    await page.getByRole('textbox', { name: 'Password:' }).fill('123');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Your password must be exactly 4 digits long.')).toBeVisible();
  });

  test('SC2-TC10 Login failed - Password เป็นตัวเลขจำนวนมากกว่า 4 หลัก', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('textbox', { name: 'Account Number:' }).click();
    await page.getByRole('textbox', { name: 'Account Number:' }).fill('6870021001');
    await page.getByRole('textbox', { name: 'Password:' }).click();
    await page.getByRole('textbox', { name: 'Password:' }).fill('12345');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Your password must be exactly 4 digits long.')).toBeVisible();
  });

  test('SC2-TC11 Login failed - Password เป็นค่าว่าง', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('textbox', { name: 'Account Number:' }).click();
    await page.getByRole('textbox', { name: 'Account Number:' }).fill('6870021001');
    await page.getByRole('button', { name: 'Login' }).click();

    const message = await page.$eval('#password', el => el.validationMessage);
    expect(message).toBe('Please fill out this field.');
  });
});
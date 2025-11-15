import { test, expect } from "@playwright/test";

test.describe("Scenario 1: ลงทะเบียนไม่ผ่าน", () => {
  test("SC1-TC3 Register Fail - ความยาวอักขระของ FirstName Lastname รวมช่องว่าง > 30", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000/");
    await page.getByRole("link", { name: "Register" }).click();
    await page.getByRole("textbox", { name: "Account Number:" }).click();
    await page
      .getByRole("textbox", { name: "Account Number:" })
      .fill("6870021007");
    await page.getByRole("textbox", { name: "Password:" }).click();
    await page.getByRole("textbox", { name: "Password:" }).fill("1234");
    await page.getByRole("textbox", { name: "First Name:" }).dblclick();
    await page
      .getByRole("textbox", { name: "First Name:" })
      .fill("Elly123456789012345");
    await page.getByRole("textbox", { name: "Last Name:" }).dblclick();
    await page
      .getByRole("textbox", { name: "Last Name:" })
      .fill("Musk1234567890");
    await page.getByRole("button", { name: "Register" }).click();

    await expect(page.getByText("The combined length of your first and last name must not exceed 30 characters.")).toBeVisible();
  });
});

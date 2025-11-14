import { test, expect } from "@playwright/test";

test.describe("Scenario 1", () => {
  test("SC1-TC1 Register success -3=<ความยาวอักขระของ FirstName Lastname รวมช่องว่าง >30 ", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000/");
    await page.getByRole("link", { name: "Register" }).click();
    await page
      .getByRole("textbox", { name: "Account Number:" })
      .fill("6870021001");
    await page.getByRole("textbox", { name: "Password:" }).fill("1234");
    await page.getByRole("textbox", { name: "First Name:" }).click();
    await page.getByRole("textbox", { name: "First Name:" }).fill("Elly");
    await page.getByRole("textbox", { name: "Last Name:" }).click();
    await page.getByRole("textbox", { name: "Last Name:" }).fill("Musk");
    await page.getByRole("button", { name: "Register" }).click();

    page.once("dialog", async (dialog) => {
      expect(dialog.message()).toBe("Registration successful!");
      await dialog.accept();
    });
  });

  test("SC1-TC2 Register success - ความยาวอักขระของ FirstName Lastname รวมช่องว่าง = 30", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000/");
    await page.getByRole("link", { name: "Register" }).click();
    await page.getByRole("textbox", { name: "Account Number:" }).click();
    await page
      .getByRole("textbox", { name: "Account Number:" })
      .fill("6870021006");
    await page.getByRole("textbox", { name: "Password:" }).click();
    await page.getByRole("textbox", { name: "Password:" }).fill("1234");
    await page.getByRole("textbox", { name: "First Name:" }).click();
    await page
      .getByRole("textbox", { name: "First Name:" })
      .fill("Elly12345678900");
    await page.getByRole("textbox", { name: "Last Name:" }).click();
    await page
      .getByRole("textbox", { name: "Last Name:" })
      .fill("Musk1234567890");
    await page.getByRole("button", { name: "Register" }).click();

    page.once("dialog", async (dialog) => {
      expect(dialog.message()).toBe("Registration successful!");
      await dialog.accept();
    });
  });

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

    await expect(page.getByText("The combined length of your")).toBeVisible();
  });

  test("SC1-TC4 Register Fail - Account Number = ไม่ใช่ตัวเลขจำนวน 10 หลัก", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000/");
    await page.getByRole("link", { name: "Register" }).click();
    await page.getByRole("textbox", { name: "Account Number:" }).click();
    await page
      .getByRole("textbox", { name: "Account Number:" })
      .fill("687002100m");
    await page.getByRole("textbox", { name: "Password:" }).click();
    await page.getByRole("textbox", { name: "Password:" }).fill("1234");
    await page.getByRole("textbox", { name: "First Name:" }).click();
    await page.getByRole("textbox", { name: "First Name:" }).fill("Elly");
    await page.getByRole("textbox", { name: "Last Name:" }).click();
    await page.getByRole("textbox", { name: "Last Name:" }).fill("Musk");
    await page.getByRole("button", { name: "Register" }).click();

    await expect(page.getByText("Your account ID should")).toBeVisible();
  });

  test("SC1-TC5 Register Fail - Account Number = เป็นตัวเลข จำนวนน้อยกว่า 10 หลัก", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000/");
    await page.getByRole("link", { name: "Register" }).click();
    await page.getByRole("textbox", { name: "Account Number:" }).click();
    await page
      .getByRole("textbox", { name: "Account Number:" })
      .fill("687002100");
    await page.getByRole("textbox", { name: "Password:" }).click();
    await page.getByRole("textbox", { name: "Password:" }).fill("1234");
    await page.getByRole("textbox", { name: "First Name:" }).click();
    await page.getByRole("textbox", { name: "First Name:" }).fill("Elly");
    await page.getByRole("textbox", { name: "Last Name:" }).click();
    await page.getByRole("textbox", { name: "Last Name:" }).fill("Musk");
    await page.getByRole("button", { name: "Register" }).click();

    await expect(page.getByText("Your account ID must be")).toBeVisible();
  });

  test("SC1-TC6 Register Fail -Account Number = เป็นตัวเลข จำนวนมากกว่า 10 หลัก", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000/");
    await page.getByRole("link", { name: "Register" }).click();
    await page.getByRole("textbox", { name: "Account Number:" }).click();
    await page
      .getByRole("textbox", { name: "Account Number:" })
      .fill("68700210012");
    await page.getByRole("textbox", { name: "Password:" }).click();
    await page.getByRole("textbox", { name: "Password:" }).fill("1234");
    await page.getByRole("textbox", { name: "First Name:" }).click();
    await page.getByRole("textbox", { name: "First Name:" }).fill("Elly");
    await page.getByRole("textbox", { name: "Last Name:" }).click();
    await page.getByRole("textbox", { name: "Last Name:" }).fill("Musk");
    await page.getByRole("button", { name: "Register" }).click();

    await expect(page.getByText("Your account ID must be")).toBeVisible();
  });

  test("SC1-TC7 Register Fail -Account Number = เป็นค่าว่าง", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000/");
    await page.getByRole("link", { name: "Register" }).click();
    await page.getByRole("textbox", { name: "Password:" }).click();
    await page.getByRole("textbox", { name: "Password:" }).fill("1234");
    await page.getByRole("textbox", { name: "First Name:" }).click();
    await page.getByRole("textbox", { name: "First Name:" }).fill("Elly");
    await page.getByRole("textbox", { name: "Last Name:" }).click();
    await page.getByRole("textbox", { name: "Last Name:" }).fill("Musk");
    await page.getByRole("textbox", { name: "First Name:" }).click();

    const message = await page.$eval(
      "#accountId",
      (el) => el.validationMessage
    );
    expect(message).toBe("Please fill out this field.");
  });

  test("SC1-TC8 Register Fail -Password = ไม่ใช่ตัวเลข จำนวน 4 หลัก", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000/");
    await page.getByRole("link", { name: "Register" }).click();
    await page.getByRole("textbox", { name: "Account Number:" }).click();
    await page
      .getByRole("textbox", { name: "Account Number:" })
      .fill("6870021006");
    await page.getByRole("textbox", { name: "Password:" }).click();
    await page.getByRole("textbox", { name: "Password:" }).fill("nana");
    await page.getByRole("textbox", { name: "First Name:" }).click();
    await page.getByRole("textbox", { name: "First Name:" }).fill("Elly");
    await page.getByRole("textbox", { name: "Last Name:" }).click();
    await page.getByRole("textbox", { name: "Last Name:" }).fill("Musk");
    await page.getByRole("button", { name: "Register" }).click();

    await expect(page.getByText("Your password should contain")).toBeVisible();
  });

  test("SC1-TC9 Register Fail -Password = เป็นตัวเลข จำนวนน้อยกว่า 4 หลัก", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000/");
    await page.getByRole("link", { name: "Register" }).click();
    await page.getByRole("textbox", { name: "Account Number:" }).click();
    await page
      .getByRole("textbox", { name: "Account Number:" })
      .fill("6870021006");
    await page.getByRole("textbox", { name: "Password:" }).click();
    await page.getByRole("textbox", { name: "Password:" }).fill("123");
    await page.getByRole("textbox", { name: "First Name:" }).click();
    await page.getByRole("textbox", { name: "First Name:" }).fill("Elly");
    await page.getByRole("textbox", { name: "Last Name:" }).click();
    await page.getByRole("textbox", { name: "Last Name:" }).fill("Musk");
    await page.getByRole("button", { name: "Register" }).click();

    await expect(page.getByText("Your password must be exactly")).toBeVisible();
  });

  test("SC1-TC10 Register Fail -Password = เป็นตัวเลข จำนวนมากกว่า 4 หลัก", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000/");
    await page.getByRole("link", { name: "Register" }).click();
    await page.getByRole("textbox", { name: "Account Number:" }).click();
    await page
      .getByRole("textbox", { name: "Account Number:" })
      .fill("6870021006");
    await page.getByRole("textbox", { name: "Password:" }).click();
    await page.getByRole("textbox", { name: "Password:" }).fill("12345");
    await page.getByRole("textbox", { name: "First Name:" }).click();
    await page.getByRole("textbox", { name: "First Name:" }).fill("Elly");
    await page.getByRole("textbox", { name: "Last Name:" }).click();
    await page.getByRole("textbox", { name: "Last Name:" }).fill("Musk");
    await page.getByRole("button", { name: "Register" }).click();

    await expect(page.getByText("Your password must be exactly")).toBeVisible();
  });

  test("SC1-TC11 Register Fail -Password = เป็นค่าว่าง", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await page.getByRole("link", { name: "Register" }).click();
    await page.getByRole("textbox", { name: "Account Number:" }).click();
    await page
      .getByRole("textbox", { name: "Account Number:" })
      .fill("6870021006");
    await page.getByRole("textbox", { name: "First Name:" }).click();
    await page.getByRole("textbox", { name: "First Name:" }).fill("Elly");
    await page.getByRole("textbox", { name: "Last Name:" }).click();
    await page.getByRole("textbox", { name: "Last Name:" }).fill("Musk");
    await page.getByRole("button", { name: "Register" }).click();

    const message = await page.$eval("#password", (el) => el.validationMessage);
    expect(message).toBe("Please fill out this field.");
  });

  test("SC1-TC12 Register Fail -Firstname = เป็นค่าว่าง", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await page.getByRole("link", { name: "Register" }).click();
    await page.getByRole("textbox", { name: "Account Number:" }).click();
    await page
      .getByRole("textbox", { name: "Account Number:" })
      .fill("6870021006");
    await page.getByRole("textbox", { name: "Password:" }).click();
    await page.getByRole("textbox", { name: "Password:" }).fill("1234");
    await page.getByRole("textbox", { name: "Last Name:" }).click();
    await page.getByRole("textbox", { name: "Last Name:" }).fill("Musk");
    await page.getByRole("button", { name: "Register" }).click();

    const message = await page.$eval(
      "#firstName",
      (el) => el.validationMessage
    );
    expect(message).toBe("Please fill out this field.");
  });
  test("SC1-TC13 Register Fail -Lastname = เป็นค่าว่าง", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await page.getByRole("link", { name: "Register" }).click();
    await page.getByRole("textbox", { name: "Account Number:" }).click();
    await page
      .getByRole("textbox", { name: "Account Number:" })
      .fill("6870021006");
    await page.getByRole("textbox", { name: "Password:" }).click();
    await page.getByRole("textbox", { name: "Password:" }).fill("1234");
    await page.getByRole("textbox", { name: "First Name:" }).click();
    await page.getByRole("textbox", { name: "First Name:" }).fill("Elly");
    await page.getByRole("button", { name: "Register" }).click();

    const message = await page.$eval("#lastName", (el) => el.validationMessage);
    expect(message).toBe("Please fill out this field.");
  });
  test("SC1-TC14 Register Fail -Account Number ถูกใช้ไปแล้ว", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000/");
    await page.getByRole("link", { name: "Register" }).click();
    await page.getByRole("textbox", { name: "Account Number:" }).click();
    await page
      .getByRole("textbox", { name: "Account Number:" })
      .fill("6870021001");
    await page.getByRole("textbox", { name: "Password:" }).click();
    await page.getByRole("textbox", { name: "Password:" }).fill("1234");
    await page.getByRole("textbox", { name: "First Name:" }).click();
    await page.getByRole("textbox", { name: "First Name:" }).fill("Elly");
    await page.getByRole("textbox", { name: "Last Name:" }).click();
    await page.getByRole("textbox", { name: "Last Name:" }).fill("Musk");
    await page.getByRole("button", { name: "Register" }).click();

    await expect(page.getByText("This account ID is already in")).toBeVisible();
  });
  test("SC1-TC15 Register Fail -Firstname เป็นการพิมพ์ช่องว่าง (spacebar)", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000/");
    await page.getByRole("link", { name: "Register" }).click();
    await page.getByRole("textbox", { name: "Account Number:" }).click();
    await page
      .getByRole("textbox", { name: "Account Number:" })
      .fill("6870021012");
    await page.getByRole("textbox", { name: "Password:" }).click();
    await page.getByRole("textbox", { name: "Password:" }).fill("1234");
    await page.getByRole("textbox", { name: "First Name:" }).click();
    await page.getByRole("textbox", { name: "First Name:" }).fill("     ");
    await page.getByRole("textbox", { name: "Last Name:" }).click();
    await page.getByRole("textbox", { name: "Last Name:" }).fill("Musk");
    await page.getByRole("button", { name: "Register" }).click();

    page.once("dialog", async (dialog) => {
      expect(dialog.message()).toBe("Registration successful!");
      await dialog.accept();
    });
  });
  test("SC1-TC16 Register Fail -Lastname เป็นการพิมพ์ช่องว่าง (spacebar)", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000/");
    await page.getByRole("link", { name: "Register" }).click();
    await page.getByRole("textbox", { name: "Account Number:" }).click();
    await page
      .getByRole("textbox", { name: "Account Number:" })
      .fill("6870021009");
    await page.getByRole("textbox", { name: "Password:" }).click();
    await page.getByRole("textbox", { name: "Password:" }).fill("1234");
    await page.getByRole("textbox", { name: "First Name:" }).click();
    await page.getByRole("textbox", { name: "First Name:" }).fill("Elly");
    await page.getByRole("textbox", { name: "Last Name:" }).click();
    await page.getByRole("textbox", { name: "Last Name:" }).fill("     ");
    await page.getByRole("button", { name: "Register" }).click();

    page.once("dialog", async (dialog) => {
      expect(dialog.message()).toBe("Registration successful!");
      await dialog.accept();
    });
  });
});

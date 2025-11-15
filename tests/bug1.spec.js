import { test, expect } from "@playwright/test";
import { getMongoClient } from "../utils/mongoClient.js";

test.describe("Scenario 1", () => {
  let client;

  test.beforeAll(async () => {
    client = getMongoClient();
    if (!client.topology || !client.topology.isConnected()) {
      await client.connect();
    }

    const DB_NAME = process.env.DB_NAME;
    await client.db(DB_NAME).collection("users").deleteOne({ accountId: "6870021009" });
    console.log("✔ Removed account 6870021009");
  });

  test.afterAll(async () => {
    if (client) {
      await client.close();
      console.log("✔ MongoDB connection closed");
    }
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

    const message = await page.$eval("#lastName", (el) => el.validationMessage);
    expect(message).toBe("Please fill out this field.");
  });
});

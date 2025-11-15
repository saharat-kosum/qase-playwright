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
    await client.db(DB_NAME).collection("users").deleteOne({ accountId: "6870021012" });
    console.log("✔ Removed account 6870021012");
  });

  test.afterAll(async () => {
    if (client) {
      await client.close();
      console.log("✔ MongoDB connection closed");
    }
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

    const message = await page.$eval("#firstName", (el) => el.validationMessage);
    expect(message).toBe("Please fill out this field.");
  });
});

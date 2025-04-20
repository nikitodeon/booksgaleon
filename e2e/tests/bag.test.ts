import { test, expect, Page, ElementHandle } from "@playwright/test";
import fs from "fs";
import path from "path";

async function login(page: Page) {
  console.log("Logging in...");
  await page.goto("/login");
  await page.fill('input[placeholder="Email"]', "testuser@gmail.com");
  await page.fill('input[placeholder="Пароль"]', "password");

  await Promise.all([
    page.waitForNavigation({ url: "**/" }),
    page.click('button[type="submit"]'),
  ]);

  await expect(page).toHaveURL("/");
  console.log("Login successful");
}

async function clearCart(page: Page) {
  console.log("Clearing cart...");
  await page.goto("/bag");

  const deleteButtons = page.locator("form button:has-text('Удалить')");
  const count = await deleteButtons.count();

  for (let i = 0; i < count; i++) {
    await deleteButtons.first().click();
    await page.waitForTimeout(500);
  }

  console.log("Cart cleared");
}

async function addFirstProductToCart(page: Page) {
  console.log("Adding first product to cart...");
  await page.goto("/");
  await page.waitForSelector("text=Подробнее");

  const firstProduct = page.locator("text=Подробнее").first();
  await firstProduct.click();

  await expect(page).toHaveURL(/\/product\//);
  await page.click("button:has-text('В корзину')");
  await page.waitForTimeout(1000);

  console.log("Product added");
}

async function goToBag(page: Page) {
  console.log("Opening cart...");
  await page.goto("/bag");
  await page.waitForSelector("main");
  console.log("Cart opened");
}

async function takeScreenshot(page: Page, name: string) {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const dir = path.resolve("e2e/screenshots");
    fs.mkdirSync(dir, { recursive: true });
    const filePath = path.join(dir, `${timestamp}-${name}.png`);
    await page.screenshot({ path: filePath, fullPage: true });
    console.log(`Screenshot saved: ${filePath}`);
  } catch (err) {
    console.log(`Error while taking screenshot: ${(err as Error).message}`);
  }
}

function saveLog(content: string) {
  const dir = path.resolve("e2e/logs");
  fs.mkdirSync(dir, { recursive: true });
  const logPath = path.join(dir, "bag-log.txt");
  fs.appendFileSync(logPath, `[${new Date().toISOString()}] ${content}\n`);
}

test.use({ browserName: "chromium" });

test("Complete cart workflow", async ({ page }) => {
  await login(page);
  await clearCart(page);

  await goToBag(page);
  await expect(page.locator("text=У вас нет товаров в корзине")).toBeVisible();
  await expect(page.locator("text=Перейти в магазин!")).toBeVisible();

  await addFirstProductToCart(page);
  await goToBag(page);
  await expect(page.locator("text=Количество:")).toBeVisible();

  const controls = page.locator('[data-testid="count-controls"]').first();
  await controls.waitFor({ state: "visible", timeout: 5000 });

  // const plusButton = controls.locator('[data-testid="count-plus"]');
  // const quantityText = controls.locator('[data-testid="quantity-text"]');
  // const initialCount = parseInt((await quantityText.textContent()) || "1");

  // // Increasing quantity
  // let attempts = 0;
  // let clicked = false;

  // while (attempts < 30) {
  //   try {
  //     console.log(`Attempt #${attempts + 1}`);
  //     saveLog(`Attempt #${attempts + 1}`);

  //     await expect(plusButton).toBeVisible({ timeout: 20000 });
  //     await expect(plusButton).toBeEnabled({ timeout: 20000 });

  //     console.log("Button is visible and active, attempting click...");
  //     saveLog("Button active. Performing click");

  //     await plusButton.hover();
  //     await page.mouse.down();
  //     await page.waitForTimeout(50);
  //     await page.mouse.up();
  //     await page.waitForTimeout(15000);

  //     clicked = true;
  //     break;
  //   } catch (err) {
  //     const msg = `Error on attempt ${attempts + 1}: ${(err as Error).message}`;
  //     console.log(msg);
  //     saveLog(msg);
  //     await takeScreenshot(page, `attempt-${attempts + 1}`);
  //   }

  //   await page.waitForTimeout(500);
  //   attempts++;
  // }

  // if (!clicked) {
  //   await takeScreenshot(page, "final-failure");
  //   throw new Error("'+' button didn't work after all attempts");
  // }

  // await expect(quantityText).toHaveText(String(initialCount + 1), {
  //   timeout: 5000,
  // });

  // // Decreasing quantity
  // const minusButton = controls.locator('[data-testid="count-minus"]');
  // if (initialCount + 1 > 1) {
  //   await minusButton.click();
  //   await expect(quantityText).toHaveText(String(initialCount));
  // } else {
  //   await expect(minusButton).toBeDisabled();
  // }

  // Removing product
  const deleteButton = page.locator("form button:has-text('Удалить')").first();
  await deleteButton.click();
  await expect(page.locator("text=У вас нет товаров в корзине")).toBeVisible({
    timeout: 10000,
  });
});

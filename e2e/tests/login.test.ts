import { test, expect } from "@playwright/test";

test.describe("Авторизация", () => {
  test("успешный логин редиректит на главную", async ({ page }) => {
    await page.goto("/login");

    await page.fill('input[placeholder="Email"]', "nikitodeon@gmail.com");
    await page.fill('input[placeholder="Пароль"]', "password");

    await Promise.all([
      page.waitForNavigation({ url: "**/" }),
      page.click('button[type="submit"]'),
    ]);

    await expect(page).toHaveURL("/");

    await expect(page.locator("text=BooksGaleon")).toBeVisible();
  });

  test("ошибка при неправильном пароле", async ({ page }) => {
    await page.goto("/login");

    await page.fill('input[placeholder="Email"]', "nikitodeon@gmail.com");
    await page.fill('input[placeholder="Пароль"]', "wrong-password");

    await page.click('button[type="submit"]');

    await expect(
      page.locator(".Toastify__toast--error >> text=Invalid credentials")
    ).toBeVisible({ timeout: 25000 });
  });
  test("ошибка при несуществующем пользователе", async ({ page }) => {
    await page.goto("/login");

    await page.fill(
      'input[placeholder="Email"]',
      "nikitodeon-does-not-exist@gmail.com"
    );
    await page.fill('input[placeholder="Пароль"]', "password");

    await page.click('button[type="submit"]');

    await expect(
      page.locator(".Toastify__toast--error >> text=Invalid credentials")
    ).toBeVisible({ timeout: 10000 });
  });
  test("переход на страницу регистрации", async ({ page }) => {
    await page.goto("/login");

    const registerLink = page.locator("text=Зарегистрируйтесь");
    await expect(registerLink).toBeVisible();

    await Promise.all([
      page.waitForNavigation({ url: "**/register" }),
      registerLink.click(),
    ]);

    await expect(page).toHaveURL("/register");

    await expect(page.locator("text=Регистрация")).toBeVisible();
    await expect(page.locator('input[placeholder="Email"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Пароль"]')).toBeVisible();
  });
});

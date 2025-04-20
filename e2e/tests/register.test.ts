import { test, expect } from "@playwright/test";
import { prisma } from "@/app/utils/db";

test.describe("Регистрация", () => {
  let testUserEmail: string;

  test.afterEach(async () => {
    // Удаляем тестового пользователя после каждого теста
    if (testUserEmail) {
      try {
        await prisma.user.delete({ where: { email: testUserEmail } });
      } catch (error) {
        console.error("Ошибка при удалении тестового пользователя:", error);
      }
    }
  });

  test("успешная регистрация нового пользователя", async ({ page }) => {
    testUserEmail = `testuser${Date.now()}@example.com`;

    await page.goto("/register");

    // Заполняем форму регистрации
    await page.fill('input[placeholder="Имя"]', "Test User");
    await page.fill('input[placeholder="Email"]', testUserEmail);
    await page.fill('input[placeholder="Пароль"]', "TestPassword123!");

    // Отправляем форму
    await Promise.all([
      page.waitForNavigation({ url: "**/login" }),
      page.click('button[type="submit"]:has-text("Зарегистрироваться")'),
    ]);

    // Проверяем успешный редирект на страницу входа
    await expect(page).toHaveURL("/login");
    await expect(page.locator("text=Вход")).toBeVisible();
  });

  test("ошибка при регистрации существующего пользователя", async ({
    page,
  }) => {
    // Сначала создаем пользователя
    testUserEmail = `existinguser${Date.now()}@example.com`;
    await prisma.user.create({
      data: {
        name: "Existing User",
        email: testUserEmail,
        passwordHash: "hashedpassword",
        profileImage: `https://avatar.vercel.sh/${testUserEmail}`,
      },
    });

    await page.goto("/register");

    // Пытаемся зарегистрироваться с тем же email
    await page.fill('input[placeholder="Имя"]', "Existing User");
    await page.fill('input[placeholder="Email"]', testUserEmail);
    await page.fill('input[placeholder="Пароль"]', "TestPassword123!");

    await page.click('button[type="submit"]:has-text("Зарегистрироваться")');

    // Проверяем сообщение об ошибке
    await expect(
      page.locator(".Toastify__toast--error >> text=User already exists")
    ).toBeVisible({ timeout: 10000 });
  });

  test("валидация формы регистрации", async ({ page }) => {
    // await page.waitForLoadState("domcontentloaded");

    await page.goto("/register");
    // console.log("HTML страницы:", await page.content());
    // await page.screenshot({ path: "debug.png" });
    // Проверяем валидацию имени (3+ символа)
    await page.fill('input[placeholder="Имя"]', "ok");
    await page.fill('input[placeholder="Email"]', "valid@test.com");
    await page.fill('input[placeholder="Пароль"]', "validpass");
    await page.click('button[type="submit"]');
    await expect(
      page.locator(
        "p.text-red-500 >> text=Имя должно содержать не менее 3 символов"
      )
    ).toBeVisible();

    // Проверяем валидацию email (ваш кастомный текст)
    await page.fill('input[placeholder="Имя"]', "Вася");
    await page.fill('input[placeholder="Email"]', "invalid-email");
    await page.fill('input[placeholder="Пароль"]', "validpass");
    await page.click('button[type="submit"]');
    await expect(
      page.locator("p.text-red-500 >> text=Некорректный email")
    ).toBeVisible();

    // Проверяем валидацию пароля (6+ символов)
    await page.fill('input[placeholder="Имя"]', "Вася");
    await page.fill('input[placeholder="Email"]', "valid@test.com");
    await page.fill('input[placeholder="Пароль"]', "123");
    await page.click('button[type="submit"]');
    await expect(
      page.locator(
        "p.text-red-500 >> text=Пароль должен содержать не менее 6 символов"
      )
    ).toBeVisible();
  });
  test("переход на страницу входа", async ({ page }) => {
    await page.goto("/register");

    const loginLink = page.locator("text=Вход");
    await expect(loginLink).toBeVisible();

    await Promise.all([
      page.waitForNavigation({ url: "**/login" }),
      loginLink.click(),
    ]);

    await expect(page).toHaveURL("/login");
    await expect(page.locator("text=Вход")).toBeVisible();
  });
});

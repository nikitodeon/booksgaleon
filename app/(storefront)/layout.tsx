// StoreFrontLayout.tsx
import { auth } from "@/auth"; // Логика аутентификации
import { prisma } from "@/app/utils/db"; // Для получения данных баннеров
import { ReactNode } from "react";
import { Navbar } from "../components/storefront/Navbar";
import { Footer } from "../components/storefront/Footer";
import { BestsellersProducts } from "../components/storefront/BestsellersProducts";
import { Cart } from "../lib/interfaces";
import { redis } from "../lib/redis";

// Функция для получения баннеров
async function getBanners() {
  return await prisma.banner.findMany(); // Получаем баннеры из базы данных
}

export default async function StoreFrontLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth(); // Получаем сессию пользователя на сервере
  const user = session?.user || null; // Извлекаем данные пользователя
  const banners = await getBanners(); // Получаем баннеры

  const cart: Cart | null = await redis.get(`cart-${user?.id}`);

  return (
    <>
      <Navbar user={user} banners={banners} cart={cart} />
      {/* Передаем данные о пользователе и баннерах в Navbar */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</main>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-[70px]">
        <BestsellersProducts />
      </div>
      <Footer />
    </>
  );
}

// StoreFrontLayout.tsx
import { auth } from "@/auth"; // Логика аутентификации
import { prisma } from "@/app/utils/db"; // Для получения данных баннеров
import { ReactNode, Suspense } from "react";
import { Navbar } from "../components/storefront/Navbar";
import { Footer } from "../components/storefront/Footer";

import { Cart } from "../lib/interfaces";
import { redis } from "../lib/redis";
import { ClientPathnameForBestsellers } from "../components/storefront/PathnameForBestsellers";
import { LoadingProductCard } from "../components/storefront/ProductCard";

// Функция для получения баннеров
async function getBanners() {
  return await prisma.banner.findMany(); // Получаем баннеры из базы данных
}
async function getData() {
  const bestsellersData = await prisma.product.findMany({
    where: {
      status: "published",
      isFeatured: true,
    },
    select: {
      id: true,
      name: true,
      description: true,
      images: true,
      price: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    // take: 3,
  });

  return {
    bestsellersData: bestsellersData.map((item) => ({
      ...item,
      price: item.price.toString(),
    })),
  };
}
export default async function StoreFrontLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth(); // Получаем сессию пользователя на сервере
  const user = session?.user || null; // Извлекаем данные пользователя
  const banners = await getBanners(); // Получаем баннеры
  const data = await getData();
  const cart: Cart | null = await redis.get(`cart-${user?.id}`);

  return (
    <>
      <Navbar user={user} banners={banners} cart={cart} />
      {/* Передаем данные о пользователе и баннерах в Navbar */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</main>
      <Suspense fallback={<LoadingRows />}>
        <ClientPathnameForBestsellers bestsellersData={data.bestsellersData} />
      </Suspense>
      <Footer />
    </>
  );
}
function LoadingRows() {
  return (
    <div className="mt-5 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
      <LoadingProductCard />
      <LoadingProductCard />
      <LoadingProductCard />
    </div>
  );
}

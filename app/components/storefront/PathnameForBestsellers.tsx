// app/components/storefront/ClientPathname.tsx
"use client"; // Указываем, что это клиентский компонент

import { usePathname } from "next/navigation"; // Хук для получения пути
import { useState, useEffect } from "react"; // Для работы с состоянием
import { BestsellersProducts } from "./BestsellersProducts";

type Product = {
  price: string;
  name: string;
  id: string;
  description: string;
  images: string[];
};

type ClientPathnameProps = {
  bestsellersData: Product[]; // Данные для бестселлеров
};
export function ClientPathnameForBestsellers({
  bestsellersData,
}: ClientPathnameProps) {
  const pathname = usePathname(); // Получаем текущий путь из хука
  const [isBestsellersPage, setIsBestsellersPage] = useState(false);

  useEffect(() => {
    // Проверяем, если путь содержит /bestsellers
    console.log("Current pathname:", pathname);
    if (pathname.includes("bestsellery")) {
      setIsBestsellersPage(true);
    } else {
      setIsBestsellersPage(false);
    }
  }, [pathname]);

  // Передаем состояние в родительский компонент или сохраняем в контексте
  return isBestsellersPage ? null : (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-[70px]">
      <BestsellersProducts bestsellersData={bestsellersData} />
    </div>
  );
}

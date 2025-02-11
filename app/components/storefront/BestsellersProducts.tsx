// BestsellersProducts.tsx
"use client";

import { ProductCard } from "./ProductCard";

// Типизация данных
type Product = {
  price: string;
  name: string;
  id: string;
  description: string;
  images: string[];
};

type BestsellersProductsProps = {
  bestsellersData: Product[]; // Данные для бестселлеров
};

export function BestsellersProducts({
  bestsellersData,
}: BestsellersProductsProps) {
  return (
    <>
      <h1 className="font-semibold text-3xl my-5 custom">Бестселлеры</h1>

      <LoadFeaturedProducts bestsellersData={bestsellersData} />
    </>
  );
}

function LoadFeaturedProducts({ bestsellersData }: BestsellersProductsProps) {
  // Здесь твой запрос к базе данных или другой логики для загрузки продуктов
  // Для примера, ты передаешь bestsellersData как пропсы в компонент
  return (
    <div className="mt-5 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
      {bestsellersData.map((item) => (
        <ProductCard key={item.id} item={item} />
      ))}
    </div>
  );
}

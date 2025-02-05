import { prisma } from "@/app/utils/db";
import { LoadingProductCard, ProductCard } from "./ProductCard";
import { Suspense } from "react";
import { unstable_noStore as noStore } from "next/cache";

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
    take: 3,
  });

  return {
    bestsellersData: bestsellersData.map((item) => ({
      ...item,
      price: item.price.toString(),
    })),
  };
}
export function BestsellersProducts() {
  return (
    <>
      <h1 className="font-semibold text-3xl my-5 custom">Бестселлеры</h1>
      <Suspense fallback={<LoadingRows />}>
        <LoadFeaturedproducts />
      </Suspense>
    </>
  );
}

async function LoadFeaturedproducts() {
  noStore();
  const data = await getData();

  return (
    <div className="mt-5 grid sm:grid-cols-4 lg:grid-cols-6 gap-5">
      {data.bestsellersData.map((item) => (
        <ProductCard key={item.id} item={item} />
      ))}
    </div>
  );
}

function LoadingRows() {
  return (
    <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <LoadingProductCard />
      <LoadingProductCard />
      <LoadingProductCard />
    </div>
  );
}

// import ProductGrid from '@/components/product/ProductGrid';
import { searchProducts } from "@/app/actions";
import React from "react";
import { ProductCard } from "@/app/components/storefront/ProductCard";

type SearchPageProps = {
  searchParams: Promise<{ query: string }>;
};
const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { query } = await searchParams;

  const products = await searchProducts(query);

  return (
    <div>
      <section>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((item) => (
            <ProductCard item={item} key={item.id} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default SearchPage;

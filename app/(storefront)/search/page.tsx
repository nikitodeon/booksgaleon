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
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6  gap-4">
          {products.map((item) => (
            <ProductCard item={item} key={item.id} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default SearchPage;

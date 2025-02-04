"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Product } from "@prisma/client";
import { Api } from "@/app/lib/api-client";
import Link from "next/link";
import Image from "next/image";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!query.trim()) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        const response = await Api.search(query);
        setProducts(response);
      } catch (error) {
        console.error("Ошибка загрузки товаров:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Результаты поиска: "{query}"</h1>

      {loading && <p>Загрузка...</p>}

      {!loading && products.length === 0 && (
        <p className="text-gray-500">Ничего не найдено</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="p-4 border rounded-lg shadow-sm hover:shadow-md transition"
          >
            <Image
              src={product.images[0]}
              alt={product.name}
              width={200}
              height={200}
              className="rounded-lg"
            />
            <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
            <p className="text-gray-700">{product.price.toString()} ₽</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;

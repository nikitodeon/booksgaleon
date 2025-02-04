"use client";

import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Api } from "@/app/lib/api-client";
import { Product } from "@prisma/client";
import Link from "next/link";
import React from "react";
import { useDebounce } from "react-use";

const SearchBar = () => {
  const searchParams = useSearchParams();
  const defaultQuery = searchParams.get("query") || "";
  const inputRef = useRef<HTMLInputElement>(null);
  const [isSearching, startTransition] = useTransition();
  const router = useRouter();
  const [query, setQuery] = useState<string>(defaultQuery);
  const [focused, setFocused] = useState(false);
  const [products, setProducts] = React.useState<Product[]>([]);

  const search = () => {
    startTransition(() => {
      router.push(`/search?query=${query}`);
    });
  };

  useDebounce(
    async () => {
      if (!query.trim()) {
        setProducts([]);
        return;
      }
      try {
        const response = await Api.search(query);
        // Проверка, что ответ является массивом
        if (Array.isArray(response)) {
          setProducts(response);
        } else {
          console.error("Expected array from API, received:", response);
          setProducts([]);
        }
      } catch (error) {
        console.error("API Error:", error);
        setProducts([]); // В случае ошибки очищаем список продуктов
      }
    },
    250,
    [query]
  );

  const onClickItem = () => {
    setFocused(false);
    setQuery("");
    setProducts([]);
  };

  return (
    <div className="relative w-full h-14 flex flex-col">
      <div className="relative h-14 z-10 rounded-md">
        <Input
          disabled={isSearching}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              search();
            }
            if (e.key === "Escape") {
              inputRef?.current?.blur();
            }
          }}
          ref={inputRef}
          className="absolute inset-0 h-full border-gray-700"
        />

        <Button
          disabled={isSearching}
          size="sm"
          onClick={search}
          className="absolute right-0 inset-y-0 h-full rounded-l-none"
        >
          {isSearching ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <Search className="h-6 w-6" />
          )}
        </Button>

        {products.length > 0 && (
          <div
            className={cn(
              "absolute w-full bg-white rounded-xl py-2 top-14 shadow-md transition-all duration-200 invisible opacity-0 z-30",
              focused && "visible opacity-100 top-12"
            )}
          >
            {products.map((product) => (
              <Link
                onClick={onClickItem}
                key={product.id}
                className="flex items-center gap-3 w-full px-3 py-2 hover:bg-primary/10"
                href={`/product/${product.id}`}
              >
                <img
                  className="rounded-sm h-8 w-8"
                  src={product.images[0]}
                  alt={product.name}
                />
                <span>{product.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;

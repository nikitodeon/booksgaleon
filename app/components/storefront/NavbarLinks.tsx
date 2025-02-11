"use client";
/* eslint-disable */

import { useState, useEffect } from "react";
import { Category } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { slugify } from "transliteration";

export const navbarLinks = [
  { id: 1, name: "Все жанры" },
  { id: 0, name: "Бестселлеры" },
  { id: 2, name: "Классика" },
  { id: 3, name: "Фантастика" },
  { id: 4, name: "Детективы" },
  { id: 5, name: "Научные" },
  { id: 6, name: "Приключения" },
  { id: 7, name: "Поэзия" },
  { id: 8, name: "Искусство и Культура" },
  { id: 9, name: "Для детей и подростков" },
];

export function NavbarLinks() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const location = usePathname();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) throw new Error("Ошибка загрузки категорий");
        const data: Category[] = await response.json();
        setCategories(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  const handleCategoryChange = (categorySlug: string) => {
    router.push(`/products/${categorySlug}`);
  };

  return (
    <div className="flex justify-center items-center gap-x-2">
      {" "}
      {navbarLinks.map((item) => {
        const navcategory = categories.find(
          (cat) => cat.title === item.name
        ) || { slug: slugify(item.name) };

        return (
          <div
            key={item.id}
            className={`flex justify-center items-center gap-x-2  ${
              item.name !== "Все жанры" && item.name !== "Бестселлеры"
                ? "hidden lg:flex xl:flex"
                : ""
            }`}
          >
            <Link
              href={
                item.name === "Все жанры"
                  ? "/"
                  : `/products/${navcategory.slug}`
              }
              className={`custom-navbar custom-navbar-link ${
                location === `/products/${navcategory.slug}` ||
                (item.name === "Все жанры" && location === "/")
                  ? "bg-[#B099D3] rounded-md"
                  : "hover:bg-[#DCD1EB] rounded-md hover:bg-opacity-75"
              } group p-2 font-medium ms-cded-md 
             break-words whitespace-normal max-w-[120px] text-center`}
            >
              <span className="custom-navbar-text">{item.name}</span>
            </Link>
          </div>
        );
      })}
      {/* Селектор для категорий с названием "Больше категорий" */}
      <div className="flex flex-col gap-3 mt-1  mr-2">
        <Select
          name="select"
          onValueChange={(value) => {
            const category = categories.find((cat) => cat.title === value);
            if (category) handleCategoryChange(category.slug);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Больше категорий" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem
                className="custom-button"
                key={category.id}
                value={category.title}
              >
                {category.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

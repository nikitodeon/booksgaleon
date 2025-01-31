"use client";

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
import { useEffect, useState } from "react";

export const navbarLinks = [
  {
    id: 0,
    name: "Бестселлеры",
    href: "/",
  },
  {
    id: 1,
    name: "Все жанры",
    href: "/products/all",
  },
  {
    id: 2,
    name: "Классика",
    href: "/products/classics",
  },
  {
    id: 3,
    name: "Фантастика",
    href: "/products/fiction",
  },
  {
    id: 4,
    name: "Детективы",
    href: "/products/detectives",
  },
  {
    id: 5,
    name: "Научные",
    href: "/products/classics",
  },
  {
    id: 6,
    name: "Приключения",
    href: "/products/fiction",
  },
  {
    id: 7,
    name: "Поэзия",
    href: "/products/classics",
  },
  {
    id: 8,
    name: "Популярные книги",
    href: "/products/fiction",
  },
  {
    id: 9,
    name: "Для детей и подростков",
    href: "/products/detectives",
  },
];

export function NavbarLinks() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const location = usePathname();
  const plsh = (
    <div className="text-[1rem] font-medium font-maname mb-2">
      Больше категорий
    </div>
  );
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

  const handleCategoryChange = (categoryId: string) => {
    router.push(`/products/${categoryId}`);
  };

  return (
    <div className="hidden md:flex justify-center items-center gap-x-2 ml-8">
      {navbarLinks.map((item) => (
        <Link
          href={item.href}
          key={item.id}
          className={`font-maname ${
            location === item.href
              ? "bg-muted"
              : "hover:bg-muted hover:bg-opacity-75"
          } group p-2 font-medium ms-cded-md`}
        >
          {item.name}
        </Link>
      ))}

      {/* Селектор для категорий с названием "Больше категорий" */}
      <div className="flex flex-col gap-3 mt-2">
        <Select
          name="select"
          onValueChange={(value) => {
            const category = categories.find((cat) => cat.title === value);
            if (category) handleCategoryChange(category.id);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder={plsh} />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.title}>
                {category.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

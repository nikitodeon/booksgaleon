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
    href: "1d25a2ec-12a6-4416-a74b-7e99bd603731",
  },
  {
    id: 1,
    name: "Все жанры",
    href: "/",
  },
  {
    id: 2,
    name: "Классика",
    href: "40b7370d-8149-43f2-8e5c-bf30a9de8989",
  },
  {
    id: 3,
    name: "Фантастика",
    href: "4cc3a70b-e37c-4bb8-a03a-8f0632c63ee6",
  },
  {
    id: 4,
    name: "Детективы",
    href: "dd2f79ce-2ebe-478c-9f21-a922812a0ffe",
  },
  {
    id: 5,
    name: "Научные",
    href: "bfe7cb52-27b0-4d6d-979b-d37c4e07e243",
  },
  {
    id: 6,
    name: "Приключения",
    href: "8238f385-231a-4b1c-bce0-671867ffdd5a",
  },
  {
    id: 7,
    name: "Поэзия",
    href: "7f82b187-e210-4276-8fb0-37697d8275eb",
  },
  {
    id: 8,
    name: "Популярные книги",
    href: "4da5a628-d946-40a9-b872-f3754f51fe21",
  },
  {
    id: 9,
    name: "Для детей и подростков",
    href: "055060a8-08d6-41d4-8a8c-4a3e9e924587",
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
    <div className="hidden md:flex justify-center items-center gap-x-2 ml-4">
      {navbarLinks.map((item) => (
        <Link
          href={item.href}
          key={item.id}
          className={`font-maname ${
            location === item.href
              ? "bg-muted rounded-md"
              : "hover:bg-muted rounded-md hover:bg-opacity-75"
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

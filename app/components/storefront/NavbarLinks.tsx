"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Category } from "@prisma/client";
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
    href: "/products/men",
  },
  {
    id: 3,
    name: "Фантастика",
    href: "/products/women",
  },
  {
    id: 4,
    name: "Детективы",
    href: "/products/kids",
  },
];

export function NavbarLinks() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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

  const handleCategoryChange = (categoryId: string) => {
    router.push(`/products/${categoryId}`);
  };

  return (
    <div className="hidden md:flex justify-center items-center gap-x-2 ml-8">
      {navbarLinks.map((item) => (
        <Link
          href={item.href}
          key={item.id}
          className={cn(
            "font-maname",
            location === item.href
              ? "bg-muted"
              : "hover:bg-muted hover:bg-opacity-75",
            "group p-2 font-medium ms-cded-md"
          )}
        >
          {item.name}
        </Link>
      ))}
      <div className="flex flex-col gap-3">
        <Select
          name={"select"}
          defaultValue={"ok"}
          onValueChange={(value) => {
            const category = categories.find((cat) => cat.title === value);
            if (category) handleCategoryChange(category.id);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Выберите категорию" />
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

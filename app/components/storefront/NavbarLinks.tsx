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
import { usePathname } from "next/navigation";
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

  const location = usePathname();
  return (
    <div className="hidden md:flex justify-center items-center gap-x-2 ml-8">
      {navbarLinks.map((item) => (
        <Link
          href={item.href}
          key={item.id}
          className={cn(
            location === item.href
              ? "bg-muted"
              : "hover:bg-muted hover:bg-opacity-75",
            "group p-2 font-medium rounded-md"
          )}
        >
          {item.name}
        </Link>
      ))}
      <div className="flex flex-col gap-3">
        <Select key={1} name={"select"} defaultValue="Больше категорий">
          <SelectTrigger>
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <Link
                href={`/products/${category.title}`}
                key={`${category.id}`}
                className={cn(
                  location === `/products/${category.title}`
                    ? "bg-muted"
                    : "hover:bg-muted hover:bg-opacity-75",
                  "group p-2 font-medium rounded-md"
                )}
              >
                <SelectItem key={category.id} value={category.id}>
                  {category.title}
                </SelectItem>
              </Link>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

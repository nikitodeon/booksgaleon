"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    name: "Дэшборд",
    href: "/dashboard",
  },
  {
    name: "Заказы",
    href: "/dashboard/orders",
  },
  {
    name: "Продукты",
    href: "/dashboard/products",
  },
  {
    name: "Баннер",
    href: "/dashboard/banner",
  },
  {
    name: "Категории",
    href: "/dashboard/categories",
  },
];

export function DashboardNavigation() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            link.href === pathname
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {link.name}
        </Link>
      ))}
    </>
  );
}

import { render, screen } from "@testing-library/react";
import CategoriesPage from "@/app/(storefront)/products/[category]/page";
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider";
// import { describe, expect, it, vi } from "vitest";
import React from "react";

jest.mock("@/app/utils/db", () => ({
  prisma: {
    product: {
      findMany: jest.fn(),
    },
    category: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("Not found");
  }),
  redirect: jest.fn((url: string) => {
    throw new Error(`Redirected to ${url}`);
  }),
}));

jest.mock("@/app/components/storefront/ProductCard", () => ({
  ProductCard: ({ item }: { item: any }) => (
    <div data-testid="product-card">
      <h3>{item.name}</h3>
      <p>{item.price} BYN</p>
    </div>
  ),
}));

describe("CategoriesPage", () => {
  it("рендерит заголовок и карточки товаров", async () => {
    // Мокируем данные
    const mockCategory = {
      id: "1",
      title: "Test Category",
    };

    const mockProducts = [
      {
        id: "1",
        name: "Test Product 1",
        description: "Description 1",
        price: "100.00",
        images: ["/image1.jpg"],
      },
    ];

    // Настраиваем моки
    const { prisma } = await import("@/app/utils/db");
    (prisma.category.findUnique as any).mockResolvedValue(mockCategory);
    (prisma.product.findMany as any).mockResolvedValue(mockProducts);

    const params = Promise.resolve({ category: "test-category" });

    // Рендерим компонент с правильными параметрами
    const Page = await CategoriesPage({ params });
    render(<MemoryRouterProvider>{Page}</MemoryRouterProvider>);

    // Проверяем заголовок
    expect(await screen.findByText(mockCategory.title)).toBeInTheDocument();
    expect(await screen.findByText("Test Product 1")).toBeInTheDocument();
    expect(await screen.findByText("100.00 BYN")).toBeInTheDocument();
  });

  it("вызывает notFound если категория не найдена", async () => {
    const { prisma } = await import("@/app/utils/db");
    const { notFound } = await import("next/navigation");
    (prisma.category.findUnique as any).mockResolvedValue(null);

    try {
      const params = Promise.resolve({ category: "non-existent" });
      const Page = await CategoriesPage({ params });
      render(<MemoryRouterProvider>{Page}</MemoryRouterProvider>);
    } catch (e) {
      expect(notFound).toHaveBeenCalled();
    }
  });

  it("перенаправляет для специальных категорий", async () => {
    const { redirect } = await import("next/navigation");

    try {
      const params = Promise.resolve({ category: "vse-zhanry" });
      const Page = await CategoriesPage({ params });
      render(<MemoryRouterProvider>{Page}</MemoryRouterProvider>);
    } catch (e) {
      expect(redirect).toHaveBeenCalledWith("/");
    }
  });
});

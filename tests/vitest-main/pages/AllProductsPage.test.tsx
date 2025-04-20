import { render, screen } from "@testing-library/react";
import AllProductsPage from "@/app/(storefront)/page";
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider";
import { describe, expect, it, vi } from "vitest";
import React from "react";
import { Decimal } from "@prisma/client/runtime/library";

// Мокируем зависимости
vi.mock("next/link", () => ({
  default: (props: any) =>
    React.createElement("a", {
      ...props,
      href: props.href,
    }),
}));

vi.mock("@/app/utils/db", () => ({
  prisma: {
    product: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock("@/app/components/storefront/ProductCard", () => ({
  ProductCard: ({ item }: { item: any }) => (
    <div data-testid="product-card">
      <h3>{item.name}</h3>
      <p>{item.price} BYN</p>
    </div>
  ),
}));

describe("AllProductsPage", () => {
  const mockProducts = [
    {
      id: "1",
      name: "Test Product 1",
      description: "Description 1",
      price: "100.00",
      images: ["/image1.jpg"],
    },
    {
      id: "2",
      name: "Test Product 2",
      description: "Description 2",
      price: "200.00",
      images: ["/image2.jpg"],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("рендерит заголовок и карточки товаров", async () => {
    // Настраиваем моки
    const { prisma } = await import("@/app/utils/db");
    (prisma.product.findMany as any).mockResolvedValue(mockProducts);

    // Рендерим компонент
    const Page = await AllProductsPage();
    render(<MemoryRouterProvider>{Page}</MemoryRouterProvider>);

    // Проверяем заголовок
    expect(await screen.findByText("Все жанры")).toBeInTheDocument();
    expect(await screen.findByText("Test Product 1")).toBeInTheDocument();
    expect(await screen.findByText("100.00 BYN")).toBeInTheDocument();
    expect(await screen.findByText("Test Product 2")).toBeInTheDocument();
    expect(await screen.findByText("200.00 BYN")).toBeInTheDocument();
  });

  it("отображает правильные классы для сетки товаров", async () => {
    const { prisma } = await import("@/app/utils/db");
    (prisma.product.findMany as any).mockResolvedValue(mockProducts);

    const Page = await AllProductsPage();
    const { container } = render(
      <MemoryRouterProvider>{Page}</MemoryRouterProvider>
    );

    const grid = container.querySelector(".grid");
    expect(grid).toHaveClass("grid-cols-3");
    expect(grid).toHaveClass("md:grid-cols-4");
    expect(grid).toHaveClass("lg:grid-cols-6");
    expect(grid).toHaveClass("sm:gap-5");
    expect(grid).toHaveClass("gap-x-2");
  });

  it("конвертирует Decimal цены в строки", async () => {
    const decimalProducts = [
      {
        ...mockProducts[0],
        price: new Decimal("150.50"),
      },
    ];

    const { prisma } = await import("@/app/utils/db");
    (prisma.product.findMany as any).mockResolvedValue(decimalProducts);

    const Page = await AllProductsPage();
    render(<MemoryRouterProvider>{Page}</MemoryRouterProvider>);

    // Проверяем наличие цены в любом формате (150.5 или 150.50)
    expect(
      screen.getByText(/150\.5\d* BYN/, { exact: false })
    ).toBeInTheDocument();
  });

  it("отображает правильные стили заголовка", async () => {
    const { prisma } = await import("@/app/utils/db");
    (prisma.product.findMany as any).mockResolvedValue(mockProducts);

    const Page = await AllProductsPage();
    const { container } = render(
      <MemoryRouterProvider>{Page}</MemoryRouterProvider>
    );

    const heading = container.querySelector("h1");
    expect(heading).toHaveClass("font-semibold");
    expect(heading).toHaveClass("text-3xl");
    expect(heading).toHaveClass("my-5");
    expect(heading).toHaveClass("custom");
  });
});

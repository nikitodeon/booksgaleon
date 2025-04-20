import { render, screen } from "@testing-library/react";
import { ProductCard } from "@/app/components/storefront/ProductCard";
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider";
import { describe, it, expect, vi } from "vitest";
import React from "react";
vi.mock("next/link", () => ({
  default: (props: any) =>
    React.createElement("a", {
      ...props,
      href: props.href,
    }),
}));

// Мок для embla-carousel-react
vi.mock("embla-carousel-react", () => ({
  default: vi.fn(() => [
    vi.fn(), // emblaRef
    {
      canScrollPrev: vi.fn(() => true),
      canScrollNext: vi.fn(() => true),
      scrollPrev: vi.fn(),
      scrollNext: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
    }, // emblaApi
  ]),
}));
// Мок для next/image
vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

const mockItem = {
  id: "1",
  name: "Test Product",
  description: "Test Description",
  price: "99.99",
  images: ["/test-image.jpg"],
};

describe("ProductCard Component", () => {
  it("renders product name and price correctly", () => {
    render(
      <MemoryRouterProvider>
        <ProductCard item={mockItem} />
      </MemoryRouterProvider>
    );

    expect(screen.getByText(mockItem.name)).toBeInTheDocument();
    expect(screen.getByText(`${mockItem.price} BYN`)).toBeInTheDocument();
  });

  it("displays product description", () => {
    render(
      <MemoryRouterProvider>
        <ProductCard item={mockItem} />
      </MemoryRouterProvider>
    );

    expect(screen.getByText(mockItem.description)).toBeInTheDocument();
  });

  it("has correct link to product page", () => {
    render(
      <MemoryRouterProvider>
        <ProductCard item={mockItem} />
      </MemoryRouterProvider>
    );

    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute("href", `/product/${mockItem.id}`);
    expect(links[1]).toHaveAttribute("href", `/product/${mockItem.id}`);
  });

  it("renders all product images", () => {
    const multiImageItem = {
      ...mockItem,
      images: ["/img1.jpg", "/img2.jpg", "/img3.jpg"],
    };

    render(
      <MemoryRouterProvider>
        <ProductCard item={multiImageItem} />
      </MemoryRouterProvider>
    );

    expect(screen.getAllByRole("img")).toHaveLength(3);
  });

  it("renders button with correct text", () => {
    render(
      <MemoryRouterProvider>
        <ProductCard item={mockItem} />
      </MemoryRouterProvider>
    );

    expect(screen.getByText("Подробнее")).toBeInTheDocument();
  });
});

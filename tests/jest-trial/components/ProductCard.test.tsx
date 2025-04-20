import { render, screen } from "@testing-library/react";
import { ProductCard } from "@/app/components/storefront/ProductCard";
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider";
import React from "react";

// Мок для embla-carousel-react
jest.mock("embla-carousel-react", () => ({
  __esModule: true,
  default: jest.fn(() => [
    jest.fn(), // emblaRef
    {
      canScrollPrev: jest.fn(() => true),
      canScrollNext: jest.fn(() => true),
      scrollPrev: jest.fn(),
      scrollNext: jest.fn(),
      on: jest.fn(),
      off: jest.fn(),
    }, // emblaApi
  ]),
}));

// Мок для карусели
jest.mock("@/components/ui/carousel", () => ({
  __esModule: true,
  Carousel: ({ children }: { children: React.ReactNode }) =>
    React.createElement("div", { "data-testid": "mock-carousel" }, children),
  CarouselContent: ({ children }: { children: React.ReactNode }) =>
    React.createElement(
      "div",
      { "data-testid": "mock-carousel-content" },
      children
    ),
  CarouselItem: ({ children }: { children: React.ReactNode }) =>
    React.createElement(
      "div",
      { "data-testid": "mock-carousel-item" },
      children
    ),
  CarouselPrevious: () =>
    React.createElement("button", { "data-testid": "mock-carousel-prev" }),
  CarouselNext: () =>
    React.createElement("button", { "data-testid": "mock-carousel-next" }),
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
    expect(screen.getByTestId("next-image")).toBeInTheDocument();
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

    const links = screen.getAllByTestId("next-link");
    expect(links[0]).toHaveAttribute("href", `/product/${mockItem.id}`);
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

    expect(screen.getAllByTestId("next-image")).toHaveLength(3);
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

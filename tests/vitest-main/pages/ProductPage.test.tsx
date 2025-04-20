// tests/vitest-main/pages/ProductPage.test.tsx
import { render, screen } from "@testing-library/react";
import ProductPage from "@/app/(storefront)/product/[id]/page";
import { prisma } from "@/app/utils/db";
import { notFound } from "next/navigation";
import React from "react";
import { vi } from "vitest";

// Мокируем зависимости
vi.mock("@/app/utils/db", () => ({
  prisma: {
    product: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("Not found");
  }),
}));

vi.mock("@/app/actions", () => ({
  addItem: vi.fn(),
}));

vi.mock("@/app/components/SubmitButtons", () => ({
  ShoppingBagButton: () => (
    <button data-testid="shopping-bag-button">Add to Bag</button>
  ),
  ToCartButton: () => <button data-testid="to-cart-button">Go to Cart</button>,
}));

vi.mock("@/app/components/storefront/ImageSlider", () => ({
  default: ({ images }: { images: string[] }) => (
    <div data-testid="image-slider">
      {images.map((img, i) => (
        <img key={i} src={img} alt={`Product ${i}`} />
      ))}
    </div>
  ),
}));

// Мокируем StarIcon с явным role="img"
vi.mock("lucide-react", () => ({
  StarIcon: () => (
    <svg
      role="img"
      aria-hidden="true"
      className="h-4 w-4 text-yellow-500 fill-yellow-500"
      data-testid="star-icon"
    >
      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
    </svg>
  ),
}));

describe("ProductPage", () => {
  const mockProduct = {
    id: "1",
    name: "Test Product",
    price: "99.99",
    description: "Test description",
    images: ["/image1.jpg", "/image2.jpg"],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (prisma.product.findUnique as any).mockResolvedValue({
      ...mockProduct,
      price: 99.99,
    });
  });

  it("should render product details correctly", async () => {
    const mockParams = Promise.resolve({ id: "1" });
    const Page = await ProductPage({ params: mockParams });
    render(Page);

    // Проверяем основные данные продукта
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(`${mockProduct.price} BYN`)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument();

    // Проверяем звезды рейтинга
    const starIcons = screen.getAllByTestId("star-icon");
    expect(starIcons).toHaveLength(5);

    // Альтернативный вариант проверки звезд
    const ratingContainer = screen.getByLabelText("Product rating");
    expect(ratingContainer.children).toHaveLength(5);

    // Проверяем слайдер изображений
    expect(screen.getByTestId("image-slider")).toBeInTheDocument();

    // Проверяем кнопки
    expect(screen.getByTestId("shopping-bag-button")).toBeInTheDocument();
    expect(screen.getByTestId("to-cart-button")).toBeInTheDocument();
  });

  it("should call notFound when product does not exist", async () => {
    // Мокируем отсутствие продукта
    (prisma.product.findUnique as any).mockResolvedValue(null);

    const mockParams = Promise.resolve({ id: "999" });

    try {
      const Page = await ProductPage({ params: mockParams });
      render(Page);
    } catch (e) {
      expect(notFound).toHaveBeenCalled();
    }
  });

  it("should convert Decimal price to string", async () => {
    // Мокируем Decimal цену
    (prisma.product.findUnique as any).mockResolvedValue({
      ...mockProduct,
      price: 123.45,
    });

    const mockParams = Promise.resolve({ id: "1" });

    const Page = await ProductPage({ params: mockParams });
    render(Page);

    expect(screen.getByText("123.45 BYN")).toBeInTheDocument();
  });
});

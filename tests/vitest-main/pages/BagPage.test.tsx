import { render, screen } from "@testing-library/react";
import BagRoute from "@/app/(storefront)/bag/page";
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider";
import { describe, expect, it, vi, beforeEach } from "vitest";
import React from "react";

// Моки для зависимостей
vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/app/lib/redis", () => ({
  redis: {
    get: vi.fn(),
  },
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`Redirected to ${url}`);
  }),
}));

vi.mock("@/app/components/SubmitButtons", () => ({
  DeleteItem: () => <button data-testid="delete-button">Удалить</button>,
}));

vi.mock("@/app/components/storefront/CountButton", () => ({
  CountButton: ({ value }: { value: number }) => (
    <div data-testid="count-button">{value}</div>
  ),
}));

// Исправленный мок для next/image
vi.mock("next/image", () => ({
  default: (props: any) => {
    const { fill, ...rest } = props;
    return React.createElement("img", {
      ...rest,
      "data-testid": "product-image",
      "data-fill": fill?.toString() || "false",
    });
  },
}));

// Исправленный мок для next/link
vi.mock("next/link", () => {
  const React = require("react");
  const ActualLink = vi.fn();
  ActualLink.mockImplementation(
    ({ children, href, legacyBehavior, ...props }: any) => {
      if (legacyBehavior) {
        return React.cloneElement(React.Children.only(children), {
          href,
          ...props,
          "data-testid": "checkout-link",
        });
      }
      return React.createElement(
        "a",
        {
          href,
          ...props,
          role: "link",
          "data-testid": "checkout-link",
        },
        children
      );
    }
  );
  return {
    __esModule: true,
    default: ActualLink,
  };
});

describe("BagRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("перенаправляет неавторизованных пользователей", async () => {
    const { auth } = await import("@/auth");
    (auth as any).mockResolvedValue(null);

    const { redirect } = await import("next/navigation");

    try {
      await BagRoute();
    } catch (e) {
      expect(redirect).toHaveBeenCalledWith("/");
    }
  });

  it("отображает пустую корзину", async () => {
    const { auth } = await import("@/auth");
    (auth as any).mockResolvedValue({ user: { id: "123" } });

    const { redis } = await import("@/app/lib/redis");
    (redis.get as any).mockResolvedValue(null);

    const Page = await BagRoute();
    render(<MemoryRouterProvider>{Page}</MemoryRouterProvider>);

    expect(screen.getByText("У вас нет товаров в корзине")).toBeInTheDocument();
    expect(
      screen.getByText(
        "В данный момент в вашей корзине нет товаров. Пожалуйста, добавьте товары, чтобы увидеть их прямо здесь."
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Перейти в магазин!")).toBeInTheDocument();
  });

  it("отображает товары в корзине без ошибок hydration", async () => {
    const { auth } = await import("@/auth");
    (auth as any).mockResolvedValue({ user: { id: "123" } });

    const mockCart = {
      items: [
        {
          id: "1",
          name: "Test Product",
          price: 100,
          imageString: "/test.jpg",
          quantity: 2,
        },
      ],
    };

    const { redis } = await import("@/app/lib/redis");
    (redis.get as any).mockResolvedValue(mockCart);

    const Page = await BagRoute();
    render(<MemoryRouterProvider>{Page}</MemoryRouterProvider>);

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("100 BYN")).toBeInTheDocument();
    expect(screen.getByText("Количество:")).toBeInTheDocument();
    expect(screen.getByTestId("count-button")).toHaveTextContent("2");
    expect(screen.getByTestId("delete-button")).toBeInTheDocument();
    expect(screen.getByText("Итого:")).toBeInTheDocument();
    expect(screen.getByText("200 BYN")).toBeInTheDocument();

    // Проверяем ссылку оформления заказа
    const checkoutLink = screen.getByTestId("checkout-link");
    expect(checkoutLink).toBeInTheDocument();
    expect(checkoutLink).toHaveTextContent("Перейти к оформлению");
    expect(checkoutLink).toHaveAttribute("href", "/checkout");
  });

  it("корректно рассчитывает общую стоимость", async () => {
    const { auth } = await import("@/auth");
    (auth as any).mockResolvedValue({ user: { id: "123" } });

    const mockCart = {
      items: [
        {
          id: "1",
          name: "Product 1",
          price: 100,
          imageString: "/test1.jpg",
          quantity: 2,
        },
        {
          id: "2",
          name: "Product 2",
          price: 50,
          imageString: "/test2.jpg",
          quantity: 3,
        },
      ],
    };

    const { redis } = await import("@/app/lib/redis");
    (redis.get as any).mockResolvedValue(mockCart);

    const Page = await BagRoute();
    render(<MemoryRouterProvider>{Page}</MemoryRouterProvider>);

    expect(screen.getByText("350 BYN")).toBeInTheDocument();
  });
});

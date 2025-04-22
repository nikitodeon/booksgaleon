import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CheckoutPage from "@/app/(checkout)/checkout/page";
import { useSession } from "next-auth/react";
import { createOrder } from "@/app/actions";
import "@testing-library/jest-dom";
import { act } from "react";
import { Mock, vi } from "vitest";

vi.mock("next-auth/react", () => ({
  useSession: vi.fn(),
}));

vi.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/app/actions", () => ({
  createOrder: vi.fn().mockResolvedValue("/payment-url"),
}));

vi.mock("@/app/components/storefront/checkout/CheckoutCart", () => ({
  CheckoutCart: () => <div data-testid="checkout-cart">Cart</div>,
}));

vi.mock("@/app/context/CartContext", () => ({
  CartProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="cart-provider">{children}</div>
  ),
}));

// 🔧 Заглушка для react-hook-form
vi.mock("react-hook-form", async () => {
  const actual = await vi.importActual<any>("react-hook-form");
  return {
    ...actual,
    useForm: () => ({
      handleSubmit: (fn: any) => (e: any) => fn(e),
      setValue: vi.fn(),
      register: vi.fn(),
      formState: { errors: {} },
    }),
    FormProvider: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
  };
});

// 🌐 Заглушка fetch
global.fetch = vi.fn().mockImplementation((url) => {
  switch (url) {
    case "/api/authroute":
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            name: "Иван Иванов",
            email: "ivan@example.com",
          }),
      });
    case "/api/cart":
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            items: [
              { id: "1", name: "Product 1", price: 100 },
              { id: "2", name: "Product 2", price: 150 },
            ],
          }),
      });
    default:
      return Promise.reject("Unknown route");
  }
}) as Mock;

describe("CheckoutPage", () => {
  beforeEach(() => {
    (useSession as Mock).mockReturnValue({
      data: {
        user: { name: "Иван Иванов", email: "ivan@example.com" },
      },
      status: "authenticated",
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the checkout page with title and button", async () => {
    await act(async () => {
      render(<CheckoutPage />);
    });

    expect(screen.getByText("Оформление заказа")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Назад" })).toBeInTheDocument();
    expect(screen.getByTestId("checkout-cart")).toBeInTheDocument();
    expect(screen.getByTestId("cart-provider")).toBeInTheDocument();
  });

  it("submits form and redirects on success", async () => {
    delete (window as any).location;
    window.location = { href: "" } as any;

    await act(async () => {
      render(<CheckoutPage />);
    });

    await act(async () => {
      const form = document.querySelector("form");
      expect(form).toBeInTheDocument();
      fireEvent.submit(form!);
    });

    await waitFor(() => {
      expect(createOrder).toHaveBeenCalled();
      expect(window.location.href).toBe("/payment-url");
    });
  });
});

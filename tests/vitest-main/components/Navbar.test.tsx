import { render, screen } from "@testing-library/react";
import { Navbar } from "@/app/components/storefront/Navbar";
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider";
import { describe, it, expect, vi } from "vitest";
import React from "react";

// Моки для всех зависимостей
vi.mock("next-auth", () => ({
  auth: vi.fn(() => Promise.resolve({ user: null })),
}));

vi.mock("next-themes", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useTheme: () => ({
    theme: "light",
    setTheme: vi.fn(),
    themes: ["light", "dark"],
  }),
}));

vi.mock("next/link", () => ({
  default: (props: any) => React.createElement("a", props),
}));

// Моки компонентов с уникальными data-testid
vi.mock("@/app/components/storefront/NavbarLinks", () => ({
  NavbarLinks: () => <div data-testid="navbar-links">NavbarLinks Mock</div>,
}));

vi.mock("@/app/components/storefront/UserDropdown", () => ({
  UserDropdown: () => <div data-testid="user-dropdown">UserDropdown Mock</div>,
}));

vi.mock("@/app/components/storefront/SearchBar", () => ({
  default: () => <div data-testid="search-bar">SearchBar Mock</div>,
}));

vi.mock("@/app/components/storefront/Hero", () => ({
  Hero: () => <div data-testid="hero">Hero Mock</div>,
}));

vi.mock("@/app/components/AuthButtons", () => ({
  RegisterButton: () => (
    <div data-testid="register-button">RegisterButton Mock</div>
  ),
}));

describe("Navbar Component", () => {
  const mockUser = {
    name: "Test User",
    email: "test@example.com",
  };

  const mockBanners = [
    { id: "1", imageString: "image1.jpg", title: "Banner 1" },
  ];

  const mockCart = {
    userId: "user123",
    items: [
      {
        id: "1",
        name: "Product 1",
        price: 10.99,
        quantity: 2,
        imageString: "/product1.jpg",
      },
    ],
  };

  it("renders correctly for authenticated user", () => {
    render(
      <MemoryRouterProvider>
        <Navbar user={mockUser} banners={mockBanners} cart={mockCart} />
      </MemoryRouterProvider>
    );

    // Проверяем основные компоненты
    expect(screen.getByTestId("navbar-links")).toBeInTheDocument();

    // Для компонентов, которые рендерятся дважды
    const dropdowns = screen.getAllByTestId("user-dropdown");
    expect(dropdowns.length).toBe(2);

    const searchBars = screen.getAllByTestId("search-bar");
    expect(searchBars.length).toBe(2);

    expect(screen.getByTestId("hero")).toBeInTheDocument();
  });

  it("renders correctly for unauthenticated user", () => {
    render(
      <MemoryRouterProvider>
        <Navbar user={null} banners={mockBanners} cart={null} />
      </MemoryRouterProvider>
    );

    expect(screen.getByTestId("register-button")).toBeInTheDocument();
    expect(screen.queryByTestId("user-dropdown")).not.toBeInTheDocument();
  });
});

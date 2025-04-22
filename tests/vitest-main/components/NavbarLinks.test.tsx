import { render, screen, waitFor } from "@testing-library/react";
import { NavbarLinks } from "@/app/components/storefront/NavbarLinks";
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { usePathname, useRouter } from "next/navigation";

// Mock next/link
vi.mock("next/link", () => ({
  default: (props: any) =>
    React.createElement("a", {
      ...props,
      href: props.href,
      "data-testid": "nav-link",
    }),
}));

// Mock transliteration
vi.mock("transliteration", () => ({
  slugify: (str: string) => str.toLowerCase().replace(/\s+/g, "-"),
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
  useRouter: vi.fn(),
}));

// Mock categories data
const mockCategories = [
  { id: "1", title: "Фантастика", slug: "fantasy" },
  { id: "2", title: "Детективы", slug: "detectives" },
];

// Create a proper Response mock
const createMockResponse = (ok: boolean, data: any): Response => {
  const response = {
    ok,
    status: ok ? 200 : 500,
    statusText: ok ? "OK" : "Internal Server Error",
    headers: new Headers(),
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
    blob: () => Promise.resolve(new Blob()),
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
    formData: () => Promise.resolve(new FormData()),
    clone: () => response,
    redirected: false,
    type: "basic" as ResponseType,
    url: "",
    body: null,
    bodyUsed: false,
    get bytes() {
      return new Uint8Array();
    },
  };

  return response as unknown as Response;
};

describe("NavbarLinks Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mocks
    vi.mocked(usePathname).mockReturnValue("/");
    vi.mocked(useRouter).mockReturnValue({
      push: vi.fn(),
    } as any);

    global.fetch = vi.fn((input: RequestInfo | URL, init?: RequestInit) =>
      Promise.resolve(createMockResponse(true, mockCategories))
    );
  });

  it("renders basic navigation links", async () => {
    render(
      <MemoryRouterProvider url="/">
        <NavbarLinks />
      </MemoryRouterProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Все жанры")).toBeInTheDocument();
    });
    expect(screen.getByText("Бестселлеры")).toBeInTheDocument();
  });

  it("fetches and renders categories", async () => {
    render(
      <MemoryRouterProvider url="/">
        <NavbarLinks />
      </MemoryRouterProvider>
    );

    expect(fetch).toHaveBeenCalledWith("/api/categories");

    await waitFor(() => {
      mockCategories.forEach((category) => {
        expect(screen.getByText(category.title)).toBeInTheDocument();
      });
    });
  });

  it("renders select dropdown for additional categories", async () => {
    render(
      <MemoryRouterProvider url="/">
        <NavbarLinks />
      </MemoryRouterProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole("combobox")).toBeInTheDocument();
      expect(screen.getByText("Больше категорий")).toBeInTheDocument();
    });
  });

  it("applies active style to current route link", async () => {
    vi.mocked(usePathname).mockReturnValue("/products/fantasy");

    render(
      <MemoryRouterProvider url="/products/fantasy">
        <NavbarLinks />
      </MemoryRouterProvider>
    );

    await waitFor(() => {
      // Find the link by text, then get its parent <a> element
      const fantasyLink = screen.getByText("Фантастика").closest("a");
      expect(fantasyLink).toHaveClass("bg-[#B099D3]");
    });
  });
  it("handles fetch error gracefully", async () => {
    global.fetch = vi.fn((input: RequestInfo | URL, init?: RequestInit) =>
      Promise.resolve(createMockResponse(false, null))
    );

    render(
      <MemoryRouterProvider url="/">
        <NavbarLinks />
      </MemoryRouterProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Все жанры")).toBeInTheDocument();
    });
  });
});

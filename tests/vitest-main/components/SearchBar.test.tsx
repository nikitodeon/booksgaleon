import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";

import { useRouter } from "next/navigation";
import SearchBar from "@/app/components/storefront/SearchBar";

// Мок для next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}));

// Мок для lucide-react иконок
vi.mock("lucide-react", () => ({
  Loader2: () => <div>Loader2</div>,
  Search: () => <div>Search</div>,
}));

describe("SearchBar Component", () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it("renders search input and button correctly", () => {
    render(
      <MemoryRouterProvider>
        <SearchBar />
      </MemoryRouterProvider>
    );

    expect(
      screen.getByPlaceholderText("Название, автор или описание книги...")
    ).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("updates query state when typing", () => {
    render(
      <MemoryRouterProvider>
        <SearchBar />
      </MemoryRouterProvider>
    );

    const input = screen.getByPlaceholderText(
      "Название, автор или описание книги..."
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "test query" } });

    expect(input.value).toBe("test query");
  });

  it("triggers search on button click", async () => {
    render(
      <MemoryRouterProvider>
        <SearchBar />
      </MemoryRouterProvider>
    );

    const input = screen.getByPlaceholderText(
      "Название, автор или описание книги..."
    );
    fireEvent.change(input, { target: { value: "test query" } });

    const button = screen.getByRole("button");
    await act(async () => {
      fireEvent.click(button);
    });

    expect(mockPush).toHaveBeenCalledWith("/search?query=test query");
  });

  it("does not trigger search with empty query", async () => {
    render(
      <MemoryRouterProvider>
        <SearchBar />
      </MemoryRouterProvider>
    );

    const button = screen.getByRole("button");
    await act(async () => {
      fireEvent.click(button);
    });

    expect(mockPush).not.toHaveBeenCalled();
  });

  it("handles escape key press", () => {
    render(
      <MemoryRouterProvider>
        <SearchBar />
      </MemoryRouterProvider>
    );

    const input = screen.getByPlaceholderText(
      "Название, автор или описание книги..."
    );
    fireEvent.keyDown(input, { key: "Escape" });

    // Проверяем, что input теряет фокус
    expect(document.activeElement).not.toBe(input);
  });
});

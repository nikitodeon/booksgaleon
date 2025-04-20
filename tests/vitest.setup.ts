import "@testing-library/jest-dom/vitest";
import { vi, expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import React from "react";

expect.extend(matchers);

// Мок для Button
vi.mock("@/components/ui/button", () => ({
  Button: ({ children, asChild, ...props }: any) => {
    const Component = asChild ? "div" : "button";
    return React.createElement(
      Component,
      {
        ...props,
        "data-testid": "mock-button",
      },
      children
    );
  },
}));

// Мок для next/image
vi.mock("next/link", () => {
  const React = require("react");
  return {
    __esModule: true,
    default: ({ children, href, legacyBehavior = false, ...props }: any) => {
      if (legacyBehavior) {
        return React.cloneElement(React.Children.only(children), {
          href,
          ...props,
        });
      }
      return React.createElement(
        "a",
        {
          href,
          ...props,
          role: "link", // Явно добавляем роль
        },
        children
      );
    },
  };
});

// Мок для next/link

afterEach(() => {
  cleanup();
});

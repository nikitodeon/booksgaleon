import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import React from "react";

// Мок для Button
jest.mock("@/components/ui/button", () => ({
  __esModule: true,
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

// Исправленный мок для next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    const { fill, ...rest } = props;
    return React.createElement("img", {
      ...rest,
      "data-testid": "next-image",
      "data-fill": fill ? "true" : "false", // Преобразуем в строку
    });
  },
}));

// Исправленный мок для next/link
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, legacyBehavior, ...props }: any) => {
    if (legacyBehavior) {
      return React.cloneElement(React.Children.only(children), {
        href,
        ...props,
        "data-testid": "next-link",
      });
    }
    return React.createElement(
      "a",
      {
        href,
        ...props,
        role: "link",
        "data-testid": "next-link",
      },
      children
    );
  },
}));

afterEach(() => {
  cleanup();
});

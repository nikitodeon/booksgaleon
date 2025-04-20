import { CartProvider } from "@/app/context/CartContext";

export const TestProviders = ({ children }: { children: React.ReactNode }) => {
  return <CartProvider>{children}</CartProvider>;
};

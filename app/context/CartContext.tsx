import React, { createContext, useContext, useState, useEffect } from "react";

// Интерфейсы
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageString: string;
}

interface Cart {
  items: CartItem[];
}

interface CartContextType {
  cart: Cart | null;
  totalAmount: number;
  updateCart: (cart: Cart) => void;
}

// Создаем контекст
const CartContext = createContext<CartContextType | undefined>(undefined);

// Хук для использования контекста
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

// Провайдер контекста
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  useEffect(() => {
    async function fetchCartInfo() {
      const response = await fetch("/api/cart");
      if (!response.ok) throw new Error("Ошибка загрузки корзины");
      const cartData: Cart | null = await response.json();
      setCart(cartData);
      setTotalAmount(
        cartData
          ? cartData.items.reduce(
              (acc, item) => acc + item.price * item.quantity,
              0
            )
          : 0
      );
    }

    fetchCartInfo();
  }, []);

  const updateCart = (updatedCart: Cart) => {
    setCart(updatedCart);
    setTotalAmount(
      updatedCart.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      )
    );
    // revalidatePath("/checkout");
  };

  return (
    <CartContext.Provider value={{ cart, totalAmount, updateCart }}>
      {children}
    </CartContext.Provider>
  );
};

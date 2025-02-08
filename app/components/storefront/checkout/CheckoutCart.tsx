import { delItem, updateQuantity } from "@/app/actions";
import { CheckoutButton, DeleteItem } from "@/app/components/SubmitButtons";
import { Button } from "@/components/ui/button";
import { ShoppingBasket } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { CheckoutCountButton } from "@/app/components/storefront/checkout/CheckoutCountButton";
import { useSession } from "next-auth/react";
import React from "react";
import { useCart } from "@/app/context/CartContext";

// Интерфейсы для корзины и элементов
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

export function CheckoutCart() {
  const { cart, totalAmount, updateCart } = useCart();
  const onClickCountButton = (
    id: string,
    quantity: number,
    type: "plus" | "minus"
  ) => {
    const newQuantity = type === "plus" ? quantity + 1 : quantity - 1;

    if (!cart) return;

    const updatedItems = cart.items.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    const updatedCart = { ...cart, items: updatedItems };

    updateCart(updatedCart);
    updateQuantity(id, newQuantity);
  };

  const handleDeleteItem = async (productId: string) => {
    const response = await fetch(`/api/cart/remove/${productId}`, {
      method: "DELETE",
    });
    if (response.ok && cart) {
      const updatedItems = cart.items.filter((item) => item.id !== productId);
      updateCart({ ...cart, items: updatedItems });
    }
  };

  // const [items, setItems] = React.useState<string[]>([]);
  // const [totalAmount, setTotalAmount] = React.useState<number>(0);
  // const [cart, setCart] = React.useState<Cart | null>(null);
  // noStore();
  // const { data: session } = useSession();

  // React.useEffect(() => {
  //   async function fetchCartInfo() {
  //     const response = await fetch("/api/cart");
  //     if (!response.ok) throw new Error("Ошибка загрузки корзины");
  //     const cart: Cart | null = await response.json();
  //     setCart(cart);
  //     setItems(cart ? cart.items.map((item) => item.id) : []);
  //     setTotalAmount(
  //       cart
  //         ? cart.items.reduce(
  //             (acc: number, item: CartItem) => acc + item.price * item.quantity,
  //             0
  //           )
  //         : 0
  //     );
  //   }

  //   fetchCartInfo();
  // }, []);

  // const onClickCountButton = (
  //   id: string,
  //   quantity: number,
  //   type: "plus" | "minus"
  // ) => {
  //   const newQuantity = type === "plus" ? quantity + 1 : quantity - 1;

  //   // Обновление локального состояния корзины
  //   setCart((prevCart) => {
  //     if (prevCart) {
  //       const updatedItems = prevCart.items.map((item) =>
  //         item.id === id ? { ...item, quantity: newQuantity } : item
  //       );
  //       const updatedCart = { ...prevCart, items: updatedItems };

  //       // Обновление общей суммы
  //       setTotalAmount(
  //         updatedCart.items.reduce(
  //           (acc: number, item: CartItem) => acc + item.price * item.quantity,
  //           0
  //         )
  //       );

  //       return updatedCart;
  //     }
  //     return prevCart;
  //   });

  //   // Запрос на сервер для обновления данных
  //   updateQuantity(id, newQuantity);
  // };

  // const handleDeleteItem = async (productId: string) => {
  //   // Запрос на сервер для удаления товара
  //   const response = await fetch(`/api/cart/remove/${productId}`, {
  //     method: "DELETE",
  //   });
  //   if (response.ok) {
  //     // Удалить товар из локального состояния корзины
  //     setCart((prevCart) => {
  //       if (prevCart) {
  //         const updatedItems = prevCart.items.filter(
  //           (item) => item.id !== productId
  //         );
  //         const updatedCart = { ...prevCart, items: updatedItems };

  //         // Обновление общей суммы
  //         setTotalAmount(
  //           updatedCart.items.reduce(
  //             (acc: number, item: CartItem) => acc + item.price * item.quantity,
  //             0
  //           )
  //         );

  //         return updatedCart;
  //       }
  //       return prevCart;
  //     });
  //     // revalidatePath("/bag");
  //   }
  // };

  return (
    <div className="max-w-2xl mx-auto mt-10 min-h-[55vh]">
      {!cart || (Array.isArray(cart.items) && cart.items.length === 0) ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center mt-20">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <ShoppingBasket className="w-10 h-10 text-primary" />
          </div>

          <h2 className="mt-6 text-xl font-semibold custom-cart-title">
            У вас нет товаров в корзине
          </h2>
          <p className="mb-8 mt-2 text-center text-sm leading-6 text-muted-foreground max-w-sm mx-auto custom-cart-description">
            В данный момент в вашей корзине нет товаров. Пожалуйста, добавьте
            товары, чтобы увидеть их прямо здесь.
          </p>

          <Button asChild>
            <Link href="/">{""}Перейти в магазин! </Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-y-10">
          {cart?.items.map((item) => (
            <div key={item.id} className="flex">
              <div className="w-24 h-24 sm:w-32 sm:h-32 relative">
                <Image
                  className="rounded-md object-contain"
                  fill
                  src={item.imageString}
                  alt="Product image"
                />
              </div>
              <div className="ml-5 flex justify-between w-full font-medium">
                <p>{item.name}</p>
                <div className="flex flex-col items-center justify-between gap-y-4 h-full">
                  <p className="text-sm font-semibold">{item.price} BYN</p>{" "}
                  {/* Цена сверху */}
                  <div className="flex flex-col items-center gap-y-4">
                    <span>Количество:</span>
                    <CheckoutCountButton
                      productId={item.id}
                      value={item.quantity}
                      onClick={onClickCountButton} // передаем onClick
                    />
                  </div>
                  {/* Кнопка удаления */}
                  <div className="mt-2 text-end">
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id)} // Удаление товара
                      className="font-medium text-primary"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="mt-10">
            <div className="flex items-center justify-between font-medium">
              <p>Итого:</p>
              <p>{new Intl.NumberFormat("en-US").format(totalAmount)} BYN</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

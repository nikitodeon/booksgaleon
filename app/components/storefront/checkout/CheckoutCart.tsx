import {
  //   checkOut,
  delItem,
} from "@/app/actions";
import { CheckoutButton, DeleteItem } from "@/app/components/SubmitButtons";
import { Cart } from "@/app/lib/interfaces";
import { redis } from "@/app/lib/redis";
import { Button } from "@/components/ui/button";
//
import {
  //  ShoppingBag,
  ShoppingBasket,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { CountButton } from "@/app/components/storefront/CountButton";
import { useSession } from "next-auth/react";
import React from "react";
import { set } from "zod";

export function CheckoutCart() {
  const [items, setItems] = React.useState<string[]>([]);
  const [totalAmount, setTotalAmount] = React.useState<number>(0);
  const [cart, setCart] = React.useState<Cart | null>(null);
  noStore();
  const { data: session } = useSession();
  // const session = await auth();
  //   const data = session?.user
  // const user = session?.user;

  // if (!user) {
  //   redirect("/");
  // }

  // const cart: Cart | null = await redis.get(`cart-${data?.id}`);
  React.useEffect(() => {
    async function fetchCartInfo() {
      const response = await fetch("/api/cart");
      if (!response.ok) throw new Error("Ошибка загрузки корзины");
      const cart: Cart | null = await response.json();
      setCart(cart);
      setItems(cart ? cart.items.map((item) => item.id) : []);
      setTotalAmount(
        cart
          ? cart.items.reduce(
              (acc, item) => acc + item.price * item.quantity,
              0
            )
          : 0
      );
    }

    fetchCartInfo();
  }, []);

  // let totalPrice = 0;

  // cart?.items.forEach((item) => {
  //   totalPrice += item.price * item.quantity;
  // });

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
            <Link href="/">
              {" "}
              <div className="custom-cart-description">Перейти в магазин! </div>
            </Link>
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
                    <CountButton productId={item.id} value={item.quantity} />
                  </div>
                  <form action={delItem} className="text-end">
                    <input type="hidden" name="productId" value={item.id} />
                    <div className="mt-2">
                      <DeleteItem />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          ))}
          <div className="mt-10">
            <div className="flex items-center justify-between font-medium">
              <p>Итого:</p>
              <p>{new Intl.NumberFormat("en-US").format(totalAmount)} BYN</p>
            </div>

            {/* <form action={checkOut}>
                <CheckoutButton />
              </form> */}
          </div>
        </div>
      )}
    </div>
  );
}

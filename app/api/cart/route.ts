/* eslint-disable */

import { Cart } from "@/app/lib/interfaces";
import { redis } from "@/app/lib/redis";
import { auth } from "@/auth";

import { redirect } from "next/navigation";

export async function GET(req: Request) {
  try {
    const session = await auth();

    const user = session?.user;

    if (!user || !user.id) {
      return redirect("/");
    }

    let cart: Cart | null = await redis.get(`cart-${user.id}`);
    console.log("Запрос к Redis для корзины пользователя:", user.id);
    // revalidatePath("/checkout");

    if (!cart || !cart.items) {
      return new Response(JSON.stringify([]), { status: 200 });
    }

    return new Response(JSON.stringify(cart), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Ошибка на сервере", { status: 500 });
  }
}

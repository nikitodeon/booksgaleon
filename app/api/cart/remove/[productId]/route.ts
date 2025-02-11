/* eslint-disable */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth"; // Путь до функции авторизации
import { redis } from "@/app/lib/redis"; // Подключение Redis
import { revalidatePath } from "next/cache"; // Для перегенерации пути

// Интерфейс для структуры корзины и товара
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageString: string;
}

interface Cart {
  userId: string;
  items: CartItem[];
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  const { productId } = params;

  // Проверяем, есть ли сессия пользователя
  const session = await auth();
  const user = session?.user;

  if (!user || !user.id) {
    return NextResponse.redirect("/"); // Перенаправление, если пользователь не авторизован
  }

  try {
    // Получаем корзину пользователя из Redis
    let cart = (await redis.get(`cart-${user.id}`)) as Cart | null;

    if (cart && cart.items) {
      // Обновляем корзину, удаляя товар по productId
      const updateCart = {
        userId: user.id,
        items: cart.items.filter((item: CartItem) => item.id !== productId),
      };

      // Сохраняем обновленную корзину в Redis
      await redis.set(`cart-${user.id}`, updateCart);

      // Обновляем путь корзины на клиенте
      revalidatePath("/bag");

      return NextResponse.json(
        { message: "Товар удален из корзины" },
        { status: 200 }
      );
    }

    // Если товар не найден в корзине
    return NextResponse.json(
      { error: "Товар не найден в корзине" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Ошибка при удалении товара из Redis:", error);
    return NextResponse.json(
      { error: "Не удалось удалить товар" },
      { status: 500 }
    );
  }
}

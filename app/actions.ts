"use server";

import { transliterate as tr, slugify } from "transliteration";

import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";
import {
  bannerSchema,
  categorySchema,
  CheckoutFormValues,
  productSchema,
} from "./lib/zodSchemas";
import { prisma } from "./utils/db";
import { auth } from "@/auth";
import { Decimal } from "@prisma/client/runtime/library";
import { SubmissionResult } from "@conform-to/react";
import { OrderStatus } from "@prisma/client";
import { redis } from "./lib/redis";
import { Cart } from "./lib/interfaces";
import { revalidatePath } from "next/cache";

import { createPayment } from "./lib/create-payment";

export async function createProduct(prevState: unknown, formData: FormData) {
  const session = await auth();

  if (!session?.user || session.user.email !== process.env.ADMIN_EMAIL) {
    return redirect("/");
  }

  const submission = parseWithZod(formData, {
    schema: productSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const flattenUrls = submission.value.images.flatMap((urlString) =>
    urlString.split(",").map((url) => url.trim())
  );

  await prisma.product.create({
    data: {
      name: submission.value.name,
      description: submission.value.description,
      status: submission.value.status,
      price: new Decimal(submission.value.price),
      images: flattenUrls,
      category: { connect: { id: submission.value.category } },
      isFeatured: submission.value.isFeatured === true ? true : false,
    },
  });

  redirect("/dashboard/products");
}

export async function editProduct(
  prevState: SubmissionResult<string[]> | undefined,
  formData: FormData
) {
  const session = await auth();

  if (!session?.user || session.user.email !== process.env.ADMIN_EMAIL) {
    return redirect("/");
  }
  const submission = parseWithZod(formData, {
    schema: productSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const flattenUrls = submission.value.images.flatMap((urlString) =>
    urlString.split(",").map((url) => url.trim())
  );

  const productId = formData.get("productId") as string;
  await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      name: submission.value.name,
      description: submission.value.description,
      category: { connect: { id: submission.value.category } },
      price: new Decimal(submission.value.price),
      isFeatured: submission.value.isFeatured === true ? true : false,
      status: submission.value.status,
      images: flattenUrls,
    },
  });

  redirect("/dashboard/products");
}

export async function deleteProduct(formData: FormData) {
  const session = await auth();

  if (!session?.user || session.user.email !== process.env.ADMIN_EMAIL) {
    return redirect("/dashboard/products");
  }

  await prisma.product.delete({
    where: {
      id: formData.get("productId") as string,
    },
  });

  redirect("/dashboard/products");
}

export async function createBanner(
  prevState: SubmissionResult<string[]> | undefined,
  formData: FormData
) {
  const session = await auth();

  if (!session?.user || session.user.email !== process.env.ADMIN_EMAIL) {
    return redirect("/");
  }

  const submission = parseWithZod(formData, {
    schema: bannerSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  await prisma.banner.create({
    data: {
      title: submission.value.title,
      imageString: submission.value.imageString,
    },
  });

  redirect("/dashboard/banner");
}

export async function editBanner(
  prevState: SubmissionResult<string[]> | undefined,
  formData: FormData
) {
  const session = await auth();

  if (!session?.user || session.user.email !== process.env.ADMIN_EMAIL) {
    return redirect("/");
  }
  const submission = parseWithZod(formData, {
    schema: bannerSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const bannerId = formData.get("bannerId") as string;
  await prisma.banner.update({
    where: {
      id: bannerId,
    },
    data: {
      title: submission.value.title,
    },
  });

  redirect("/dashboard/banner");
}

export async function deleteBanner(formData: FormData) {
  const session = await auth();

  if (!session?.user || session.user.email !== process.env.ADMIN_EMAIL) {
    return redirect("/");
  }

  await prisma.banner.delete({
    where: {
      id: formData.get("bannerId") as string,
    },
  });

  redirect("/dashboard/banner");
}

export async function createCategory(
  prevState: SubmissionResult<string[]> | null,
  formData: FormData
): Promise<SubmissionResult<string[]> | null> {
  const session = await auth();

  if (!session?.user || session.user.email !== process.env.ADMIN_EMAIL) {
    return redirect("/");
  }

  const submission = parseWithZod(formData, {
    schema: categorySchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { title, slug } = submission.value;
  const generatedSlug = slug || slugify(tr(title));

  // Проверяем, есть ли уже категория с таким title или slug
  const existingCategory = await prisma.category.findFirst({
    where: {
      OR: [{ title }, { slug: generatedSlug }],
    },
  });

  if (existingCategory) {
    return {
      error: {
        title: ["A category with this title or slug already exists."],
      },
    };
  }

  await prisma.category.create({
    data: {
      title,
      slug: generatedSlug,
    },
  });

  redirect("/dashboard/categories");
}

export async function updateCategory(
  prevState: SubmissionResult<string[]> | null,
  formData: FormData,
  categoryId: string
): Promise<SubmissionResult<string[]> | null> {
  const session = await auth();

  if (!session?.user || session.user.email !== process.env.ADMIN_EMAIL) {
    return redirect("/");
  }

  const submission = parseWithZod(formData, { schema: categorySchema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { title, slug } = submission.value;
  const generatedSlug = slug || title.toLowerCase().replace(/\s+/g, "-");

  const existingCategory = await prisma.category.findFirst({
    where: {
      id: { not: categoryId },
      OR: [{ title }, { slug: generatedSlug }],
    },
  });

  if (existingCategory) {
    return {
      status: "error",
      error: {
        title:
          existingCategory.title === title
            ? ["This title is already taken."]
            : [],
        slug:
          existingCategory.slug === generatedSlug
            ? ["This slug is already taken."]
            : [],
      },
    };
  }

  await prisma.category.update({
    where: { id: categoryId },
    data: { title, slug: generatedSlug },
  });

  return redirect("/dashboard/categories");
}

export async function deleteCategory(formData: FormData) {
  const session = await auth();

  if (!session?.user || session.user.email !== process.env.ADMIN_EMAIL) {
    return redirect("/");
  }

  const categoryId = formData.get("categoryId") as string;

  await prisma.category.delete({
    where: {
      id: categoryId,
    },
  });

  redirect("/dashboard/categories");
}

export const searchProducts = async (searchQuery: string) => {
  const products = await prisma.product.findMany({
    where: {
      OR: [
        {
          name: {
            contains: searchQuery, // Подстрока в названии
            mode: "insensitive", // Поиск без учета регистра
          },
        },
        {
          description: {
            contains: searchQuery, // Подстрока в описании
            mode: "insensitive", // Поиск без учета регистра
          },
        },
        {
          category: {
            title: {
              contains: searchQuery, // Подстрока в названии категории
              mode: "insensitive", // Поиск без учета регистра
            },
          },
        },
        {
          category: {
            slug: {
              contains: searchQuery, // Подстрока в слаг-стороне категории
              mode: "insensitive", // Поиск без учета регистра
            },
          },
        },
      ],
    },
    include: {
      category: true, // Включаем данные о категории
    },
  });

  return products;
};

export async function addItem(productId: string) {
  const session = await auth();

  const user = session?.user;

  if (!user || !user.id) {
    return redirect("/register");
  }

  const cart: Cart | null = await redis.get(`cart-${user.id}`);

  const selectedProduct = await prisma.product.findUnique({
    select: {
      id: true,
      name: true,
      price: true,
      images: true,
    },
    where: {
      id: productId,
    },
  });

  if (!selectedProduct) {
    throw new Error("No product with this id");
  }
  let myCart = {} as Cart;

  if (!cart || !cart.items) {
    myCart = {
      userId: user.id,
      items: [
        {
          price: selectedProduct.price.toNumber(),
          id: selectedProduct.id,
          imageString: selectedProduct.images[0],
          name: selectedProduct.name,
          quantity: 1,
        },
      ],
    };
  } else {
    let itemFound = false;

    myCart.items = cart.items.map((item) => {
      if (item.id === productId) {
        itemFound = true;
        item.quantity += 1;
      }

      return item;
    });

    if (!itemFound) {
      myCart.items.push({
        id: selectedProduct.id,
        imageString: selectedProduct.images[0],
        name: selectedProduct.name,
        price: selectedProduct.price.toNumber(),
        quantity: 1,
      });
    }
  }

  await redis.set(`cart-${user.id}`, myCart);

  revalidatePath("/", "layout");
}

export async function delItem(formData: FormData) {
  const session = await auth();

  const user = session?.user;

  if (!user || !user.id) {
    return redirect("/");
  }

  const productId = formData.get("productId");

  const cart: Cart | null = await redis.get(`cart-${user.id}`);

  if (cart && cart.items) {
    const updateCart: Cart = {
      userId: user.id,
      items: cart.items.filter((item) => item.id !== productId),
    };

    await redis.set(`cart-${user.id}`, updateCart);
  }

  revalidatePath("/bag");
}

export async function updateQuantity(itemId: string, newQuantity: number) {
  const session = await auth();

  const user = session?.user;

  if (!user || !user.id) {
    return redirect("/");
  }

  const cart: Cart | null = await redis.get(`cart-${user.id}`);

  if (cart && cart.items) {
    const updateCart: Cart = {
      userId: user.id,
      items: cart.items.map((item) => {
        if (item.id === itemId) {
          item.quantity = newQuantity;
        }

        return item;
      }),
    };

    await redis.set(`cart-${user.id}`, updateCart);
  }

  revalidatePath("/bag");
  // revalidatePath("/checkout");
}

export async function createOrder(data: CheckoutFormValues) {
  try {
    //
    const session = await auth();

    const user = session?.user;

    if (!user || !user.id) {
      return redirect("/");
    }

    const cart: Cart | null = await redis.get(`cart-${user.id}`);
    /* 
    /* Если корзина не найдена возращаем ошибку */
    if (!cart || !cart.items || cart.items.length === 0) {
      throw new Error("Cart not found or empty");
    }

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const VAT = 15;
    const DELIVERY_PRICE = 8;
    const vatPrice = ((totalAmount * VAT) / 100).toFixed(2);
    const totalPrice = parseFloat(
      (totalAmount + DELIVERY_PRICE + parseFloat(vatPrice)).toFixed(2)
    );
    ///////////////////////////////////////////

    // const changeCurrency = async (totalPriceInByn: number) => {
    const apiKey = process.env.CONVERTER_API_KEY;
    const API_URL = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/BYN/RUB`;
    let totalPriceInRub = totalPrice;
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      console.log(data.conversion_rate);
      totalPriceInRub = parseFloat(
        (totalPrice * data.conversion_rate).toFixed(2)
      );
    } catch (error) {
      console.error(error);
    }

    //////////////////////////////////////////

    //
    /* Создаем заказ */
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        fullName: data.firstName + " " + data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        comment: data.comment,
        totalAmount: totalPrice,
        status: OrderStatus.PENDING,
        items: JSON.stringify(cart.items),
      },
    });
    await redis.del(`cart-${user.id}`);

    const paymentData = await createPayment({
      amount: totalPriceInRub,
      orderId: order.id,
      description: "Оплата заказа #" + order.id,
    });

    if (!paymentData) {
      throw new Error("Payment data not found");
    }

    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        paymentId: paymentData.id,
      },
    });

    const paymentUrl = paymentData.confirmation.confirmation_url;

    //

    return paymentUrl;
  } catch (err) {
    console.log("[CreateOrder] Server error", err);
  }
}

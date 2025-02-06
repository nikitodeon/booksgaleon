"use server";
import { transliterate as tr, slugify } from "transliteration";
// import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
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
import { OrderStatus, Product } from "@prisma/client";
import { redis } from "./lib/redis";
import { Cart } from "./lib/interfaces";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createPayment } from "./lib/create-payment";
// import { redis } from "./lib/redis";
// import { Cart } from "./lib/interfaces";
// import { revalidatePath } from "next/cache";
// import { stripe } from "./lib/stripe";
// import Stripe from "stripe";

export async function createProduct(prevState: unknown, formData: FormData) {
  //   const { getUser } = getKindeServerSession();
  const session = await auth();

  if (!session?.user || session.user.email !== "sarah@test.com") {
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

export async function editProduct(prevState: any, formData: FormData) {
  // const { getUser } = getKindeServerSession();
  const session = await auth();

  if (!session?.user || session.user.email !== "sarah@test.com") {
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
  // const { getUser } = getKindeServerSession();
  const session = await auth();

  if (!session?.user || session.user.email !== "sarah@test.com") {
    return redirect("/dashboard/products");
  }

  await prisma.product.delete({
    where: {
      id: formData.get("productId") as string,
    },
  });

  redirect("/dashboard/products");
}

export async function createBanner(prevState: any, formData: FormData) {
  // const { getUser } = getKindeServerSession();
  const session = await auth();

  if (!session?.user || session.user.email !== "sarah@test.com") {
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

export async function editBanner(prevState: any, formData: FormData) {
  // const { getUser } = getKindeServerSession();
  const session = await auth();

  if (!session?.user || session.user.email !== "sarah@test.com") {
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
  // const { getUser } = getKindeServerSession();
  const session = await auth();

  if (!session?.user || session.user.email !== "sarah@test.com") {
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

  if (!session?.user || session.user.email !== "sarah@test.com") {
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

  if (!session?.user || session.user.email !== "sarah@test.com") {
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

  if (!session?.user || session.user.email !== "sarah@test.com") {
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
    return redirect("/");
  }

  let cart: Cart | null = await redis.get(`cart-${user.id}`);

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

  let cart: Cart | null = await redis.get(`cart-${user.id}`);

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

  let cart: Cart | null = await redis.get(`cart-${user.id}`);

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
}

export async function createOrder(data: CheckoutFormValues) {
  try {
    // const cookieStore = await cookies();
    // const cartToken = cookieStore.get('cartToken')?.value;

    // if (!cartToken) {
    //   throw new Error('Cart token not found');
    // }
    const session = await auth();

    const user = session?.user;

    if (!user || !user.id) {
      return redirect("/");
    }

    let cart: Cart | null = await redis.get(`cart-${user.id}`);
    /* Находим корзину по токену */
    // const userCart = await prisma.cart.findFirst({
    //   include: {
    //     user: true,
    //     items: {
    //       include: {
    //         ingredients: true,
    //         productItem: {
    //           include: {
    //             product: true,
    //           },
    //         },
    //       },
    //     },
    //   },
    //   where: {
    //     // token: cartToken,
    //   },
    // });

    /* Если корзина не найдена возращаем ошибку */
    if (!cart || !cart.items || cart.items.length === 0) {
      throw new Error("Cart not found or empty");
    }

    // if (cart && cart.items) {
    //   let sum=0
    //   let totalAmount=0

    // : Stripe.Checkout.SessionCreateParams.LineItem[]

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    //   price_data: {
    //     currency: "usd",
    //     unit_amount: ,
    //     product_data: {
    //       name: item.name,
    //       images: [item.imageString],
    //     },
    //   },
    //   quantity: item.quantity,

    /* Если корзина пустая возращаем ошибку */
    // if (cart?.totalAmount === 0) {
    //   throw new Error('Cart is empty');
    // }

    /* Создаем заказ */
    const order = await prisma.order.create({
      data: {
        // token: cartToken,
        userId: user.id,
        fullName: data.firstName + " " + data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        comment: data.comment,
        totalAmount: totalAmount,
        status: OrderStatus.PENDING,
        items: JSON.stringify(cart.items),
      },
    });
    await redis.del(`cart-${user.id}`);
    /* Очищаем корзину */
    // await prisma.cart.update({
    //   where: {
    //     id: userCart.id,
    //   },
    //   data: {
    //     totalAmount: 0,
    //   },
    // });

    // await prisma.cartItem.deleteMany({
    //   where: {
    //     cartId: userCart.id,
    //   },
    // });

    const paymentData = await createPayment({
      amount: totalAmount,
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

    // await sendEmail(
    //   data.email,
    //   'Next Pizza / Оплатите заказ #' + order.id,
    //   PayOrderTemplate({
    //     orderId: order.id,
    //     totalAmount: order.totalAmount,
    //     paymentUrl,
    //   }),
    // );

    return paymentUrl;
  } catch (err) {
    console.log("[CreateOrder] Server error", err);
  }
}

// export async function checkOut() {
//   const { getUser } = getKindeServerSession();
//   const user = await getUser();

//   if (!user) {
//     return redirect("/");
//   }

//   let cart: Cart | null = await redis.get(`cart-${user.id}`);

//   if (cart && cart.items) {
//     const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
//       cart.items.map((item) => ({
//         price_data: {
//           currency: "usd",
//           unit_amount: item.price * 100,
//           product_data: {
//             name: item.name,
//             images: [item.imageString],
//           },
//         },
//         quantity: item.quantity,
//       }));

//     const session = await stripe.checkout.sessions.create({
//       mode: "payment",
//       line_items: lineItems,
//       success_url:
//         process.env.NODE_ENV === "development"
//           ? "http://localhost:3000/payment/success"
//           : "https://shoe-marshal.vercel.app/payment/success",
//       cancel_url:
//         process.env.NODE_ENV === "development"
//           ? "http://localhost:3000/payment/cancel"
//           : "https://shoe-marshal.vercel.app/payment/cancel",
//       metadata: {
//         userId: user.id,
//       },
//     });

//     return redirect(session.url as string);
//   }
// }

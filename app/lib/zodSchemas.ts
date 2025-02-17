import { z } from "zod";

export const productSchema = z.object({
  name: z.string(),
  description: z.string(),
  status: z.enum(["draft", "published", "archived"]),

  price: z
    .string()
    .transform((val) => Number(val).toFixed(2)) // Оставляем два знака после запятой
    .refine((val) => parseFloat(val) >= 0 && parseFloat(val) <= 10000, {
      message: "Price must be a valid number",
    }),

  images: z.array(z.string()).min(1, "At least one image is required"),
  category: z.string().uuid(),
  isFeatured: z.boolean().optional(),
});

export const bannerSchema = z.object({
  title: z.string(),
  imageString: z.string(),
});
export const categorySchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters long")
    .max(100, "Title must be at most 100 characters long"),

  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters long")
    .max(100, "Slug must be at most 100 characters long")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and dashes"
    )
    .optional(), // Делаем `slug` необязательным, если хотим генерировать его автоматически
});

export const checkoutFormSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "Имя должно содержать не менее 2-х символов" }),
  lastName: z
    .string()
    .min(2, { message: "Фамилия должна содержать не менее 2-х символов" }),
  email: z.string().email({ message: "Введите корректную почту" }),
  phone: z.string().min(10, { message: "Введите корректный номер телефона" }),
  address: z.string().min(5, { message: "Введите корректный адрес" }),
  comment: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

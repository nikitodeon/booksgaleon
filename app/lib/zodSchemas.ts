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
  title: z.string(),
});

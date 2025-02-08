import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Некорректный email" }),
  password: z.string().min(6, {
    message: "Пароль должен содержать не менее 6 символов",
  }),
});

export type LoginSchema = z.infer<typeof loginSchema>;

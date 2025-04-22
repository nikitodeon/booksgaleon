"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { LoginSchema, loginSchema } from "@/lib/schemas/LoginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInUser } from "@/app/actions/authActions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";

export default function LoginForm() {
  const { theme, resolvedTheme } = useTheme(); // Получаем текущую тему
  const [themeLoaded, setThemeLoaded] = useState(false); // Состояние для отслеживания загрузки темы
  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const router = useRouter();

  const onSubmit = async (data: LoginSchema) => {
    const result = await signInUser(data);
    if (result.status === "success") {
      router.push("/");
      router.refresh();
    } else {
      toast.error(result.error as string);
    }
  };
  useEffect(() => {
    if (theme) {
      setThemeLoaded(true); // Обновляем состояние, когда тема загружена
    }
  }, [theme]);
  if (!themeLoaded) {
    return <div>Загрузка...</div>;
  }
  const logoPath =
    resolvedTheme === "dark" ? "/blacklogo.png" : "/whitelogo.png";
  return (
    <Card className="w-[500px] h-[600px]   my-auto">
      <Image
        src={logoPath}
        alt="Logo"
        width={250}
        height={250}
        className="mx-auto mt-6"
      />
      <CardHeader className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-semibold custom tracking-wider">Вход</h1>
        <p className="text-neutral-500 ">
          <span className="custom-maname text-lg">Добро пожаловать в</span>{" "}
          BooksGaleon
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              placeholder="Email"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-500">{errors.email?.message as string}</p>
            )}
            <Input
              placeholder="Пароль"
              type="password"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="text-red-500">
                {errors.password?.message as string}
              </p>
            )}
            <Button
              className="w-full"
              color="default"
              type="submit"
              disabled={!isValid}
            >
              Войти
            </Button>
            {/* <SocialLogin /> */}
            <div className="text-center">
              <p className="text-neutral-500 ">
                <span className="custom-maname text-lg">Нет аккаунта? </span>
                <Link href="/register">
                  <span className="custom-maname text-lg text-blue-700">
                    Зарегистрируйтесь
                  </span>
                </Link>
              </p>
              {/* <Link href="/forgot-password">Forgot password?</Link> */}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

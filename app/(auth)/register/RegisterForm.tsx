"use client";

import { registerUser } from "@/app/actions/authActions";
import {
  //   profileSchema,
  registerSchema,
  RegisterSchema,
} from "@/lib/schemas/RegisterSchema";
import { handleFormServerErrors } from "@/lib/utils";
// import { Card, CardHeader, CardBody, Button } from "@nextui-org/react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
// import { GiPadlock } from "react-icons/gi";
// import UserDetailsForm from "./UserDetailsForm";
// import ProfileDetailsForm from "./ProfileDetailsForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";

// const stepSchemas = [registerSchema, profileSchema];

export default function RegisterForm() {
  //   const [activeStep, setActiveStep] = useState(0);
  //   const currentValidationSchema = stepSchemas[activeStep];
  const { theme, resolvedTheme } = useTheme(); // Получаем текущую тему
  const [themeLoaded, setThemeLoaded] = useState(false); // Состояние для отслеживания загрузки темы

  // Если тема не загружена, показываем индикатор загрузки

  // Логика для смены логотипа в зависимости от темы
  const logoPath =
    resolvedTheme === "dark" ? "/blacklogo.png" : "/whitelogo.png";
  const registerFormMethods = useForm<RegisterSchema>({
    // resolver: zodResolver(
    //   registerSchema
    // currentValidationSchema
    // ),
    mode: "onTouched",
  });

  const {
    handleSubmit,
    register,
    getValues,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = registerFormMethods;

  const router = useRouter();

  const onSubmit = async (data: RegisterSchema) => {
    // console.log(data);
    const result = await registerUser(getValues());
    if (result.status === "success") {
      router.push("/login");
    } else {
      handleFormServerErrors(result, setError);
    }
  };

  //   const getStepContent = (step: number) => {
  //     switch (step) {
  //       case 0:
  //         return <UserDetailsForm />;
  //       case 1:
  //         return <ProfileDetailsForm />;
  //       default:
  //         return "Unknown step";
  //     }
  //   };

  //   const onBack = () => {
  //     setActiveStep((prev) => prev - 1);
  //   };

  //   const onNext = async () => {
  //     if (activeStep === stepSchemas.length - 1) {
  //       await onSubmit();
  //     } else {
  //       setActiveStep((prev) => prev + 1);
  //     }
  //   };
  useEffect(() => {
    if (theme) {
      setThemeLoaded(true); // Обновляем состояние, когда тема загружена
    }
  }, [theme]);
  if (!themeLoaded) {
    return <div>Загрузка...</div>;
  }
  return (
    <Card className="w-[500px] h-[700px]   my-auto">
      <Image
        src={logoPath}
        alt="Logo"
        width={250}
        height={250}
        className="mx-auto mt-6"
      />
      <CardHeader className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-semibold custom ">Регистрация</h1>
        <p className="text-neutral-500 ">
          <span className="custom-maname text-lg">Добро пожаловать в</span>{" "}
          BooksGaleon
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              defaultValue=""
              placeholder="Имя"
              {...register("name", { required: "Имя обязательно" })}
              //   isInvalid=
              //   {!!errors.Email}
              // errorMessage={errors.email?.message as string}
            />
            {errors.name && (
              <p className="text-red-500">{errors.name?.message as string}</p>
            )}

            <Input
              placeholder="Email"
              {...register("email", { required: "Email обязателен" })}
            />
            {errors.email && (
              <p className="text-red-500">{errors.email?.message as string}</p>
            )}
            <Input
              placeholder="Пароль"
              type="password"
              {...register("password", { required: "Пароль обязателен" })}
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
              Login
            </Button>
            {/* <SocialLogin /> */}
            <div className="text-center">
              <p className="text-neutral-500 ">
                <span className="custom-maname text-lg">
                  Уже есть аккаунт?{" "}
                </span>
                <Link href="/login">
                  <span className="custom-maname text-lg text-blue-700">
                    Вход
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

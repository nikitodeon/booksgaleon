"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React from "react";

import { useForm, SubmitHandler } from "react-hook-form";
import { loginSchema } from "@/lib/schemas/LoginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInUser } from "@/app/actions/authActions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { LoginSchema } from "@/lib/schemas/LoginSchema";
// import SocialLogin from "./SocialLogin";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const router = useRouter();

  const onSubmit =
    // (data: LoginSchema)
    //  =>
    //  console.log(data);

    async (data: LoginSchema) => {
      const result = await signInUser(data);
      if (result.status === "success") {
        router.push("/");
        router.refresh();
      } else {
        toast.error(result.error as string);
      }
    };

  return (
    <Card className="w-3/5 mx-auto">
      <CardHeader className="flex flex-col items-center justify-center">
        <div className="flex flex-col gap-2 items-center text-default">
          <div className="flex flex-row items-center gap-3">
            <h1 className="text-3xl font-semibold">Login</h1>
          </div>
          <p className="text-neutral-500">Welcome back to BooksGaleon</p>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              defaultValue=""
              placeholder="Email"
              {...register("email", { required: "Email is required" })}
              //   isInvalid=
              //   {!!errors.Email}
              //   errorMessage={errors.email?.message as string}
            />
            {errors.email && (
              <p className="text-red-500">{errors.email?.message as string}</p>
            )}

            <Input
              defaultValue=""
              placeholder="Password"
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
              Login
            </Button>
            {/* <SocialLogin /> */}
            <div className="flex justify-center hover:underline text-sm">
              <Link href="/forgot-password">Forgot password?</Link>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

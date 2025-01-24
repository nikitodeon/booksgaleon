"use client";

// import { registerUser } from "@/app/actions/authActions";
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
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
// import { GiPadlock } from "react-icons/gi";
// import UserDetailsForm from "./UserDetailsForm";
// import ProfileDetailsForm from "./ProfileDetailsForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

// const stepSchemas = [registerSchema, profileSchema];

export default function RegisterForm() {
  //   const [activeStep, setActiveStep] = useState(0);
  //   const currentValidationSchema = stepSchemas[activeStep];

  const registerFormMethods = useForm<RegisterSchema>({
    resolver: zodResolver(
      registerSchema
      // currentValidationSchema
    ),
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

  const onSubmit = (data: RegisterSchema) => {
    console.log(data);
    // const result = await registerUser(getValues());
    // if (result.status === "success") {
    //   router.push("/register/success");
    // } else {
    //   handleFormServerErrors(result, setError);
    // }
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

  return (
    <Card className="w-3/5 mx-auto">
      <CardHeader className="flex flex-col items-center justify-center">
        <div className="flex flex-col gap-2 items-center text-default">
          <div className="flex flex-row items-center gap-3">
            <h1 className="text-3xl font-semibold">Register</h1>
          </div>
          <p className="text-neutral-500">Welcome to BooksGaleon</p>
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
              Register
            </Button>
            {/* <SocialLogin /> */}
            <div className="flex justify-center hover:underline text-sm"></div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

"use client";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Title } from "@/app/components/storefront/checkout/Title";
import { Container } from "@/app/components/storefront/checkout/Container";
import { CheckoutCart } from "@/app/components/storefront/checkout/CheckoutCart";
import { CheckoutFormValues, checkoutFormSchema } from "@/app/lib/zodSchemas";
import { createOrder } from "@/app/actions";
import toast from "react-hot-toast";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { User } from "next-auth";

import { CartProvider } from "@/app/context/CartContext";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const { data: session } = useSession();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      comment: "",
    },
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("/api/authroute");
        if (!response.ok) throw new Error("Ошибка загрузки пользователя");

        const data: User = await response.json();
        const [firstName, lastName] = data.name?.split(" ") ?? ["", ""];

        form.setValue("firstName", firstName);
        form.setValue("lastName", lastName);
        form.setValue("email", data.email ?? "");
      } catch (error) {
        console.error("Ошибка при загрузке данных пользователя:", error);
      }
    };

    if (session) {
      fetchUserInfo();
    }
  }, [session, form]);

  const handleSubmit = async (data: CheckoutFormValues) => {
    try {
      const url = await createOrder(data);

      toast.success("Заказ успешно оформлен! 📝 Переход на оплату...", {
        icon: "✅",
      });

      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      console.error("Ошибка при оформлении заказа:", err);

      toast.error("Не удалось создать заказ", { icon: "❌" });
    }
  };

  return (
    <Container className="mt-10">
      <Title
        text="Оформление заказа"
        className="font-extrabold text-5xl custom mb-8 text-[36px]"
      />
      <Button
        type="button"
        onClick={() => window.history.back()}
        className="custom-button bg-[#B099D3] hover:bg-[#DCD1EB] text-black"
      >
        Назад
      </Button>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div>
            <CartProvider>
              <CheckoutCart />
            </CartProvider>
          </div>
        </form>
      </FormProvider>
    </Container>
  );
}

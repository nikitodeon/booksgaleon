"use client";

import { Button } from "@/components/ui/button";
import {
  Loader2,
  //  ShoppingBag,
  ShoppingBasket,
} from "lucide-react";
import { useFormStatus } from "react-dom";

interface buttonProps {
  text: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
  disabled?: boolean;
}

export function SubmitButton({ text, variant, disabled }: buttonProps) {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button disabled variant={variant}>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please Wait
        </Button>
      ) : (
        <Button variant={variant} type="submit" disabled={disabled}>
          {text}
        </Button>
      )}
    </>
  );
}

export function ShoppingBagButton() {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <Button disabled size="lg" className="w-full mt-5">
          <Loader2 className="mr-4 h-5 w-5 animate-spin" />{" "}
          <div className="text-xl">Пожалуйста, подождите </div>
        </Button>
      ) : (
        <Button
          size="lg"
          className="w-full mt-5 flex items-center gap-3"
          type="submit"
        >
          <ShoppingBasket className="  mr-4 transform scale-150  flex-shrink-0" />{" "}
          <div className="text-xl">Добавить в корзину</div>
        </Button>
      )}
    </>
  );
}

export function DeleteItem() {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <button disabled className="font-medium text-primary text-end">
          Удаление...
        </button>
      ) : (
        <button type="submit" className="font-medium text-primary text-end">
          Удалить
        </button>
      )}
    </>
  );
}

export function CheckoutButton() {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button disabled size="lg" className="w-full mt-5">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Please Wait
        </Button>
      ) : (
        <Button type="submit" size="lg" className="w-full mt-5">
          Checkout
        </Button>
      )}
    </>
  );
}

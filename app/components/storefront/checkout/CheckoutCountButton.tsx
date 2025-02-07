import { cn } from "@/lib/utils";
import React from "react";
import { CountIconButton } from "../CountIconButton";
import { updateQuantity } from "@/app/actions";

export interface CountButtonProps {
  value?: number;
  size?: "sm" | "lg";
  className?: string;
  productId: string;
  onClick: (id: string, quantity: number, type: "plus" | "minus") => void; // Добавлено
}

const onClickCountButton = (
  id: string,
  quantity: number,
  type: "plus" | "minus"
) => {
  const newQuantity = type === "plus" ? quantity + 1 : quantity - 1;
  updateQuantity(id, newQuantity);
};

export const CheckoutCountButton: React.FC<CountButtonProps> = ({
  className,
  productId,
  value = 1,
  size = "sm",
  onClick, // добавлен пропс onClick
}) => {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-between gap-3",
        className
      )}
    >
      <CountIconButton
        onClick={() => onClick(productId, value, "minus")} // передаем onClick
        disabled={value === 1}
        size={size}
        type="minus"
      />

      <b className={size === "sm" ? "text-sm" : "text-md"}>{value}</b>

      <CountIconButton
        onClick={() => onClick(productId, value, "plus")} // передаем onClick
        size={size}
        type="plus"
      />
    </div>
  );
};

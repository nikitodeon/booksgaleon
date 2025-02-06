"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { CountIconButton } from "./CountIconButton";
import { updateQuantity } from "@/app/actions";

export interface CountButtonProps {
  value?: number;
  size?: "sm" | "lg";
  //   onClick?: (type: "plus" | "minus") => void;
  className?: string;
  productId: string;
}

const onClickCountButton = (
  id: string,
  quantity: number,
  type: "plus" | "minus"
) => {
  const newQuantity = type === "plus" ? quantity + 1 : quantity - 1;
  updateQuantity(id, newQuantity);
};

export const CountButton: React.FC<CountButtonProps> = ({
  className,
  //   onClick,
  productId,
  value = 1,
  size = "sm",
}) => {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-between gap-3",
        className
      )}
    >
      <CountIconButton
        onClick={() => onClickCountButton(productId, value, "minus")}
        // {() => onClick?.("minus")}
        disabled={value === 1}
        size={size}
        type="minus"
      />

      <b className={size === "sm" ? "text-sm" : "text-md"}>{value}</b>

      <CountIconButton
        onClick={() => onClickCountButton(productId, value, "plus")}
        size={size}
        type="plus"
      />
    </div>
  );
};

"use client";

import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { CountIconButton } from "./CountIconButton";
import { updateQuantity } from "@/app/actions";

export interface CountButtonProps {
  value?: number;
  size?: "sm" | "lg";
  className?: string;
  productId: string;
}

export const CountButton: React.FC<CountButtonProps> = ({
  className,
  productId,
  value = 1,
  size = "sm",
}) => {
  const [localValue, setLocalValue] = useState(value);

  const handleClick = async (type: "plus" | "minus") => {
    const newQuantity = type === "plus" ? localValue + 1 : localValue - 1;
    await updateQuantity(productId, newQuantity);
    setLocalValue(newQuantity);
  };

  return (
    <div
      data-testid="count-controls"
      className={cn(
        "inline-flex items-center justify-between gap-3",
        className
      )}
    >
      <CountIconButton
        data-testid="count-minus"
        onClick={() => handleClick("minus")}
        disabled={localValue === 1}
        size={size}
        type="minus"
      />

      <b
        className={size === "sm" ? "text-sm" : "text-md"}
        data-testid="quantity-text"
      >
        {localValue}
      </b>

      <CountIconButton
        data-testid="count-plus"
        onClick={() => handleClick("plus")}
        size={size}
        type="plus"
      />
    </div>
  );
};

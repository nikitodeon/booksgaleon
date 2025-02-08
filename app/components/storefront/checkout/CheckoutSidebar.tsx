import React, { useEffect, useState } from "react";
import { WhiteBlock } from "./WhiteBlock";
import { CheckoutItemDetails } from "./CheckoutItemDetails";
import { ArrowRight, Package, Percent, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/app/context/CartContext";

const VAT = 15;
const DELIVERY_PRICE = 8;

interface Props {
  loading?: boolean;
  className?: string;
}

export const CheckoutSidebar: React.FC<Props> = ({ loading, className }) => {
  const { totalAmount } = useCart();

  const vatPrice = ((totalAmount * VAT) / 100).toFixed(2);
  const totalPrice = (
    totalAmount +
    DELIVERY_PRICE +
    parseFloat(vatPrice)
  ).toFixed(2);

  return (
    <WhiteBlock className={`p-6 sticky top-4 ${className}`}>
      <div className="flex flex-col gap-1">
        <span className="text-xl">Итого:</span>
        {loading ? (
          <Skeleton className="h-11 w-48" />
        ) : (
          <span className="h-11 text-[34px] font-extrabold">
            {totalPrice} ₽
          </span>
        )}
      </div>

      <CheckoutItemDetails
        title={
          <div className="flex items-center">
            <Package size={18} className="mr-2 text-gray-400" />
            Стоимость корзины:
          </div>
        }
        value={
          loading ? (
            <Skeleton className="h-6 w-16 rounded-[6px]" />
          ) : (
            `${totalAmount} BYN`
          )
        }
      />
      <CheckoutItemDetails
        title={
          <div className="flex items-center">
            <Percent size={18} className="mr-2 text-gray-400" />
            Налоги:
          </div>
        }
        value={
          loading ? (
            <Skeleton className="h-6 w-16 rounded-[6px]" />
          ) : (
            `${vatPrice} ₽`
          )
        }
      />
      <CheckoutItemDetails
        title={
          <div className="flex items-center">
            <Truck size={18} className="mr-2 text-gray-400" />
            Доставка:
          </div>
        }
        value={
          loading ? (
            <Skeleton className="h-6 w-16 rounded-[6px]" />
          ) : (
            `${DELIVERY_PRICE} ₽`
          )
        }
      />

      <Button
        // loading={loading}
        type="submit"
        className="w-full h-14 rounded-2xl mt-6 text-base font-bold "
      >
        Перейти к оплате
        <ArrowRight className="w-5 ml-2" />
      </Button>
    </WhiteBlock>
  );
};

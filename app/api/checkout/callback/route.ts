import { PaymentCallbackData } from "@/types/yookassa";
import { prisma } from "@/app/utils/db";

import { CartItemDTO } from "@/types/cart.dto";
import { OrderStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as PaymentCallbackData;

    const order = await prisma.order.findFirst({
      where: {
        id: Number(body.object.metadata.order_id),
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" });
    }

    const isSucceeded = body.object.status === "succeeded";

    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: isSucceeded ? OrderStatus.SUCCEEDED : OrderStatus.CANCELLED,
      },
    });

    const items = JSON.parse(order?.items as string) as CartItemDTO[];

    return NextResponse.json({ message: "Order status updated successfully" });
  } catch (error) {
    console.log("[Checkout Callback] Error:", error);
    return NextResponse.json({ error: "Server error" });
  }
}

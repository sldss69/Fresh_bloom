import { NextResponse } from "next/server";

import { logError, logInfo } from "@/lib/server/logger";
import {
  buildBusinessWhatsappUrl,
  createOrder,
  validateCustomer,
} from "@/lib/server/orders";
import { saveOrder } from "@/lib/server/order-repository";
import type {
  CheckoutCartItem,
  OrderCustomer,
  OrderDeliverySchedule,
} from "@/types/order";

type CashOrderRequest = {
  items: CheckoutCartItem[];
  customer: OrderCustomer;
  deliverySchedule: OrderDeliverySchedule;
};

export async function POST(request: Request) {
  try {
    logInfo("cash.order.request.received");
    const body = (await request.json()) as CashOrderRequest;
    const customer = validateCustomer(body.customer);
    const order = createOrder({
      items: body.items,
      customer,
      deliverySchedule: body.deliverySchedule,
      paymentMethod: "cash_whatsapp",
      status: "cash_pending",
    });

    logInfo("cash.order.created", {
      orderId: order.id,
      itemCount: order.items.length,
      total: order.total,
    });

    await saveOrder(order);
    logInfo("cash.order.saved", {
      orderId: order.id,
    });

    return NextResponse.json({
      orderId: order.id,
      whatsappUrl: buildBusinessWhatsappUrl(order),
    });
  } catch (error) {
    logError("cash.order.failed", {
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo crear el pedido en efectivo.",
      },
      { status: 400 },
    );
  }
}

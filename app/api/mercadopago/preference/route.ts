import { NextResponse } from "next/server";

import { createMercadoPagoPreference } from "@/lib/server/mercadopago";
import { saveOrder } from "@/lib/server/order-repository";
import { createOrder, validateCustomer } from "@/lib/server/orders";
import type {
  CheckoutCartItem,
  OrderCustomer,
  OrderDeliverySchedule,
} from "@/types/order";

type PreferenceRequest = {
  items: CheckoutCartItem[];
  customer: OrderCustomer;
  deliverySchedule: OrderDeliverySchedule;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as PreferenceRequest;
    const customer = validateCustomer(body.customer);
    const order = createOrder({
      items: body.items,
      customer,
      deliverySchedule: body.deliverySchedule,
      paymentMethod: "mercadopago",
      status: "pending",
    });
    const preference = await createMercadoPagoPreference(order);
    const orderWithPreference = {
      ...order,
      mercadoPagoPreferenceId: preference.id,
    };

    await saveOrder(orderWithPreference);

    return NextResponse.json({
      orderId: order.id,
      preferenceId: preference.id,
      checkoutUrl: preference.init_point ?? preference.sandbox_init_point,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo crear la preferencia de Mercado Pago.",
      },
      { status: 400 },
    );
  }
}

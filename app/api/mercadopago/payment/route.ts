import { NextResponse } from "next/server";

import {
  createMercadoPagoPayment,
  mapMercadoPagoStatus,
  type MercadoPagoBrickPaymentData,
} from "@/lib/server/mercadopago";
import { logError, logInfo } from "@/lib/server/logger";
import { saveOrder } from "@/lib/server/order-repository";
import {
  buildApprovedPaymentMessage,
  createOrder,
  sendBusinessWhatsappMessage,
  sendWhatsappMessage,
  validateCustomer,
} from "@/lib/server/orders";
import type {
  CheckoutCartItem,
  OrderCustomer,
  OrderDeliverySchedule,
  OrderRecord,
} from "@/types/order";

type PaymentRequest = {
  items: CheckoutCartItem[];
  customer: OrderCustomer;
  deliverySchedule: OrderDeliverySchedule;
  paymentData: MercadoPagoBrickPaymentData;
};

export async function POST(request: Request) {
  try {
    logInfo("mercadopago.payment.request.received");
    const body = (await request.json()) as PaymentRequest;
    const customer = validateCustomer(body.customer);
    const order = createOrder({
      items: body.items,
      customer,
      deliverySchedule: body.deliverySchedule,
      paymentMethod: "mercadopago",
      status: "pending",
    });

    logInfo("mercadopago.payment.order.created", {
      orderId: order.id,
      itemCount: order.items.length,
      total: order.total,
      paymentMethodId: body.paymentData.payment_method_id ?? null,
      hasToken: Boolean(body.paymentData.token),
    });

    const payment = await createMercadoPagoPayment(order, body.paymentData);
    const status = mapMercadoPagoStatus(payment.status);
    const paidOrder = {
      ...order,
      status,
      mercadoPagoPaymentId: String(payment.id),
      updatedAt: new Date().toISOString(),
    };

    logInfo("mercadopago.payment.created", {
      orderId: paidOrder.id,
      paymentId: String(payment.id),
      mercadoPagoStatus: payment.status ?? null,
      status,
      statusDetail: payment.status_detail ?? null,
    });

    await saveOrder(paidOrder);
    logInfo("mercadopago.payment.order.saved", {
      orderId: paidOrder.id,
      status,
    });

    if (status === "approved" && paidOrder.customer.phone) {
      const businessWhatsappResult = await sendBusinessWhatsappMessage(
        paidOrder,
      ).catch(() => ({ ok: false, skipped: false }));
      const whatsappResult = await sendWhatsappMessage(
        paidOrder,
        buildApprovedPaymentMessage(paidOrder),
      ).catch(() => ({ ok: false, skipped: false }));
      const whatsappStatus: OrderRecord["whatsappStatus"] = whatsappResult.ok
        ? "sent"
        : whatsappResult.skipped
          ? "skipped"
          : "failed";

      await saveOrder({
        ...paidOrder,
        whatsappStatus,
        updatedAt: new Date().toISOString(),
      });
      logInfo("mercadopago.payment.whatsapp.finished", {
        orderId: paidOrder.id,
        whatsappStatus,
        businessWhatsappStatus: businessWhatsappResult.ok
          ? "sent"
          : businessWhatsappResult.skipped
            ? "skipped"
            : "failed",
      });
    } else {
      logInfo("mercadopago.payment.not_confirmed", {
        orderId: paidOrder.id,
        status,
      });
    }

    return NextResponse.json({
      orderId: paidOrder.id,
      paymentId: payment.id,
      status: payment.status,
      statusDetail: payment.status_detail,
    });
  } catch (error) {
    logError("mercadopago.payment.failed", {
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo procesar el pago con Mercado Pago.",
      },
      { status: 400 },
    );
  }
}

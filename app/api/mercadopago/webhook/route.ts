import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";

import {
  getMercadoPagoPayment,
  mapMercadoPagoStatus,
  orderFromPayment,
} from "@/lib/server/mercadopago";
import { logError, logInfo, logWarn } from "@/lib/server/logger";
import {
  buildApprovedPaymentMessage,
  sendBusinessWhatsappMessage,
  sendWhatsappMessage,
} from "@/lib/server/orders";
import { getOrderById, saveOrder } from "@/lib/server/order-repository";
import type { OrderRecord } from "@/types/order";

type MercadoPagoWebhookBody = {
  type?: string;
  data?: {
    id?: string;
  };
};

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const rawBody = await request.text();
    const body = safeParseWebhookBody(rawBody);
    const type = body.type ?? url.searchParams.get("type");
    const paymentId = body.data?.id ?? url.searchParams.get("data.id");

    if (!verifyMercadoPagoWebhookSignature(request, url, paymentId ?? undefined)) {
      logWarn("mercadopago.webhook.invalid_signature");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (type !== "payment" || !paymentId) {
      logWarn("mercadopago.webhook.ignored", {
        type: type ?? null,
        hasPaymentId: Boolean(paymentId),
      });
      return NextResponse.json({ received: true });
    }

    logInfo("mercadopago.webhook.received", {
      type,
      paymentId,
    });

    const payment = await getMercadoPagoPayment(paymentId);
    const status = mapMercadoPagoStatus(payment.status);
    const paymentOrder = orderFromPayment(payment);
    const existingOrder = await getOrderById(paymentOrder.id);
    const order = mergePaymentOrder(existingOrder, paymentOrder, status);

    logInfo("mercadopago.webhook.payment.fetched", {
      orderId: order.id,
      paymentId: String(payment.id),
      mercadoPagoStatus: payment.status ?? null,
      status,
    });

    await saveOrder(order);

    if (
      status === "approved" &&
      order.customer.phone &&
      existingOrder?.status !== "approved"
    ) {
      const businessWhatsappResult = await sendBusinessWhatsappMessage(
        order,
      ).catch(() => ({ ok: false, skipped: false }));
      const whatsappResult = await sendWhatsappMessage(
        order,
        buildApprovedPaymentMessage(order),
      ).catch(() => ({ ok: false, skipped: false }));
      const whatsappStatus: OrderRecord["whatsappStatus"] = whatsappResult.ok
        ? "sent"
        : whatsappResult.skipped
          ? "skipped"
          : "failed";
      const updatedOrder = {
        ...order,
        status,
        whatsappStatus,
        updatedAt: new Date().toISOString(),
      };

      await saveOrder(updatedOrder);
      logInfo("mercadopago.webhook.whatsapp.finished", {
        orderId: updatedOrder.id,
        whatsappStatus,
        businessWhatsappStatus: businessWhatsappResult.ok
          ? "sent"
          : businessWhatsappResult.skipped
            ? "skipped"
            : "failed",
      });
    } else {
      logInfo("mercadopago.webhook.not_confirmed", {
        orderId: order.id,
        paymentId: String(payment.id),
        status,
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    logError("mercadopago.webhook.failed", {
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo procesar el webhook.",
      },
      { status: 500 },
    );
  }
}

function safeParseWebhookBody(rawBody: string): MercadoPagoWebhookBody {
  if (!rawBody.trim()) {
    return {};
  }

  try {
    return JSON.parse(rawBody) as MercadoPagoWebhookBody;
  } catch {
    return {};
  }
}

function mergePaymentOrder(
  existingOrder: OrderRecord | null,
  paymentOrder: OrderRecord,
  status: OrderRecord["status"],
): OrderRecord {
  if (!existingOrder) {
    return {
      ...paymentOrder,
      status,
      updatedAt: new Date().toISOString(),
    };
  }

  return {
    ...paymentOrder,
    id: existingOrder.id,
    createdAt: existingOrder.createdAt,
    updatedAt: new Date().toISOString(),
    customer: hasCompleteCustomer(paymentOrder)
      ? paymentOrder.customer
      : existingOrder.customer,
    deliverySchedule: paymentOrder.deliverySchedule.date
      ? paymentOrder.deliverySchedule
      : existingOrder.deliverySchedule,
    items:
      paymentOrder.items.length > 0 ? paymentOrder.items : existingOrder.items,
    subtotal:
      paymentOrder.total > 0 ? paymentOrder.subtotal : existingOrder.subtotal,
    total: paymentOrder.total > 0 ? paymentOrder.total : existingOrder.total,
    paymentMethod: existingOrder.paymentMethod,
    status,
    mercadoPagoPreferenceId: existingOrder.mercadoPagoPreferenceId,
    mercadoPagoPaymentId:
      paymentOrder.mercadoPagoPaymentId ?? existingOrder.mercadoPagoPaymentId,
    whatsappStatus: existingOrder.whatsappStatus ?? paymentOrder.whatsappStatus,
  };
}

function hasCompleteCustomer(order: OrderRecord) {
  return Boolean(
    order.customer.name &&
      order.customer.phone &&
      order.customer.address &&
      order.customer.postalCode,
  );
}

function verifyMercadoPagoWebhookSignature(
  request: Request,
  url: URL,
  paymentId?: string,
) {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;

  if (!secret) {
    return true;
  }

  const signatureHeader = request.headers.get("x-signature");
  const requestId = request.headers.get("x-request-id");
  const dataId = url.searchParams.get("data.id") ?? paymentId;

  if (!signatureHeader || !requestId || !dataId) {
    return false;
  }

  const signature = parseSignatureHeader(signatureHeader);
  const timestamp = signature.ts;
  const expectedSignature = signature.v1;

  if (!timestamp || !expectedSignature) {
    return false;
  }

  const manifest = `id:${dataId};request-id:${requestId};ts:${timestamp};`;
  const calculatedSignature = createHmac("sha256", secret)
    .update(manifest)
    .digest("hex");

  return safeCompare(calculatedSignature, expectedSignature);
}

function parseSignatureHeader(signatureHeader: string) {
  return signatureHeader.split(",").reduce<Record<string, string>>(
    (signature, part) => {
      const [key, value] = part.split("=");

      if (key && value) {
        signature[key.trim()] = value.trim();
      }

      return signature;
    },
    {},
  );
}

function safeCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

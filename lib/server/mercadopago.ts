import type { OrderRecord, OrderStatus } from "@/types/order";
import { logInfo } from "@/lib/server/logger";
import { getSiteUrl, isPublicHttpsUrl } from "@/lib/server/orders";

type MercadoPagoPreference = {
  id: string;
  init_point?: string;
  sandbox_init_point?: string;
};

type MercadoPagoPayment = {
  id: number;
  status?: string;
  status_detail?: string;
  external_reference?: string;
  metadata?: {
    order_id?: string;
    customer_name?: string;
    customer_phone?: string;
    customer_address?: string;
    customer_postal_code?: string;
    customer_notes?: string;
    customer_marketing_opt_in?: string | boolean;
    delivery_date?: string;
    delivery_time_window?: string;
    items?: string;
  };
};

export type MercadoPagoBrickPaymentData = {
  token?: string;
  issuer_id?: string;
  payment_method_id?: string;
  transaction_amount?: number;
  installments?: number;
  payer?: {
    email?: string;
    identification?: {
      type?: string;
      number?: string;
    };
  };
};

export async function createMercadoPagoPreference(order: OrderRecord) {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error("Falta MERCADOPAGO_ACCESS_TOKEN.");
  }

  const siteUrl = getSiteUrl();
  const publicSiteUrl = isPublicHttpsUrl(siteUrl);
  const body = {
    items: order.items.map((item) => ({
      id: item.id,
      title: item.name,
      quantity: item.quantity,
      currency_id: order.currency,
      unit_price: item.unitPrice,
    })),
    external_reference: order.id,
    metadata: {
      order_id: order.id,
      customer_name: order.customer.name,
      customer_phone: order.customer.phone,
      customer_address: order.customer.address,
      customer_postal_code: order.customer.postalCode,
      customer_notes: order.customer.notes ?? "",
      customer_marketing_opt_in: order.customer.marketingOptIn
        ? "true"
        : "false",
      delivery_date: order.deliverySchedule.date,
      delivery_time_window: order.deliverySchedule.timeWindow ?? "",
      items: JSON.stringify(order.items),
    },
    ...(publicSiteUrl
      ? {
          back_urls: {
            success: `${siteUrl}/confirmation?order=${order.id}&status=success`,
            failure: `${siteUrl}/checkout?status=failure`,
            pending: `${siteUrl}/checkout?status=pending`,
          },
          notification_url: `${siteUrl}/api/mercadopago/webhook`,
          auto_return: "approved",
        }
      : {}),
  };

  const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(formatMercadoPagoError(message));
  }

  return (await response.json()) as MercadoPagoPreference;
}

function formatMercadoPagoError(message: string) {
  try {
    const error = JSON.parse(message) as {
      code?: string;
      message?: string;
      status?: number;
    };

    if (error.code === "PA_UNAUTHORIZED_RESULT_FROM_POLICIES") {
      return [
        "Mercado Pago bloqueó la operación por políticas de la cuenta.",
        "Revisa que el Access Token corresponda a una cuenta vendedora habilitada,",
        "que la cuenta tenga identidad/actividad validada y que estés usando credenciales del ambiente correcto.",
      ].join(" ");
    }

    if (error.message) {
      return `Mercado Pago rechazó la preferencia: ${error.message}`;
    }
  } catch {
    // Fall back to raw text below.
  }

  return `Mercado Pago rechazó la preferencia: ${message}`;
}

export async function getMercadoPagoPayment(paymentId: string) {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error("Falta MERCADOPAGO_ACCESS_TOKEN.");
  }

  const response = await fetch(
    `https://api.mercadopago.com/v1/payments/${paymentId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`No se pudo consultar el pago: ${message}`);
  }

  return (await response.json()) as MercadoPagoPayment;
}

export async function createMercadoPagoPayment(
  order: OrderRecord,
  paymentData: MercadoPagoBrickPaymentData,
) {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error("Falta MERCADOPAGO_ACCESS_TOKEN.");
  }

  const siteUrl = getSiteUrl();
  const publicSiteUrl = isPublicHttpsUrl(siteUrl);
  const body = removeUndefinedValues({
    ...paymentData,
    transaction_amount: order.total,
    description: `Pedido ${order.id} Fresh Bloom`,
    external_reference: order.id,
    metadata: {
      order_id: order.id,
      customer_name: order.customer.name,
      customer_phone: order.customer.phone,
      customer_address: order.customer.address,
      customer_postal_code: order.customer.postalCode,
      customer_notes: order.customer.notes ?? "",
      customer_marketing_opt_in: order.customer.marketingOptIn
        ? "true"
        : "false",
      delivery_date: order.deliverySchedule.date,
      delivery_time_window: order.deliverySchedule.timeWindow ?? "",
      items: JSON.stringify(order.items),
    },
    ...(publicSiteUrl
      ? {
          notification_url: `${siteUrl}/api/mercadopago/webhook`,
        }
      : {}),
  });

  const response = await fetch("https://api.mercadopago.com/v1/payments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "X-Idempotency-Key": order.id,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(formatMercadoPagoError(message));
  }

  const payment = (await response.json()) as MercadoPagoPayment;

  logInfo("mercadopago.api.payment.response", {
    orderId: order.id,
    paymentId: String(payment.id),
    mercadoPagoStatus: payment.status ?? null,
    statusDetail: payment.status_detail ?? null,
  });

  return payment;
}

export function mapMercadoPagoStatus(status?: string): OrderStatus {
  if (status === "approved") {
    return "approved";
  }

  if (status === "rejected") {
    return "rejected";
  }

  if (status === "cancelled") {
    return "cancelled";
  }

  return "pending";
}

export function orderFromPayment(payment: MercadoPagoPayment): OrderRecord {
  const metadata = payment.metadata ?? {};
  const now = new Date().toISOString();
  const items = metadata.items ? safeParseItems(metadata.items) : [];
  const total = Array.isArray(items)
    ? items.reduce((sum, item) => sum + Number(item.total ?? 0), 0)
    : 0;

  return {
    id: payment.external_reference ?? metadata.order_id ?? String(payment.id),
    createdAt: now,
    updatedAt: now,
    customer: {
      name: metadata.customer_name ?? "Cliente",
      phone: metadata.customer_phone ?? "",
      address: metadata.customer_address ?? "",
      postalCode: metadata.customer_postal_code ?? "",
      notes: metadata.customer_notes || undefined,
      marketingOptIn: parseBoolean(metadata.customer_marketing_opt_in),
    },
    deliverySchedule: {
      date: metadata.delivery_date ?? new Date().toISOString().slice(0, 10),
      timeWindow: metadata.delivery_time_window ?? "",
    },
    items,
    subtotal: total,
    total,
    currency: "MXN",
    paymentMethod: "mercadopago",
    status: mapMercadoPagoStatus(payment.status),
    mercadoPagoPaymentId: String(payment.id),
    whatsappStatus: "pending",
  };
}

function safeParseItems(value: string) {
  try {
    const items = JSON.parse(value);
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

function parseBoolean(value: string | boolean | undefined) {
  return value === true || value === "true";
}

function removeUndefinedValues<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(removeUndefinedValues) as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entryValue]) => entryValue !== undefined)
        .map(([key, entryValue]) => [key, removeUndefinedValues(entryValue)]),
    ) as T;
  }

  return value;
}

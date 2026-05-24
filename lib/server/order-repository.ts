import { ensureDatabaseSchema, getPool, hasDatabase } from "@/lib/server/db";
import type { OrderRecord } from "@/types/order";

type OrderRow = {
  id: string;
  created_at: Date | string | null;
  updated_at: Date | string | null;
  customer: OrderRecord["customer"];
  delivery_schedule: OrderRecord["deliverySchedule"];
  items: OrderRecord["items"];
  subtotal: string | number;
  total: string | number;
  currency: OrderRecord["currency"];
  payment_method: OrderRecord["paymentMethod"];
  status: OrderRecord["status"];
  mercado_pago_preference_id: string | null;
  mercado_pago_payment_id: string | null;
  whatsapp_status: OrderRecord["whatsappStatus"] | null;
};

export type MarketingContact = {
  name: string;
  phone: string;
  marketingOptIn: true;
};

export async function saveOrder(order: OrderRecord) {
  if (!hasDatabase()) {
    return { ok: false, skipped: true };
  }

  await ensureDatabaseSchema();
  await getPool().query(
    `
      INSERT INTO orders (
        id,
        created_at,
        updated_at,
        customer,
        delivery_schedule,
        items,
        subtotal,
        total,
        currency,
        payment_method,
        status,
        mercado_pago_preference_id,
        mercado_pago_payment_id,
        whatsapp_status
      )
      VALUES (
        $1,
        $2,
        $3,
        $4::jsonb,
        $5::jsonb,
        $6::jsonb,
        $7,
        $8,
        $9,
        $10,
        $11,
        $12,
        $13,
        $14
      )
      ON CONFLICT (id) DO UPDATE SET
        updated_at = EXCLUDED.updated_at,
        customer = EXCLUDED.customer,
        delivery_schedule = EXCLUDED.delivery_schedule,
        items = EXCLUDED.items,
        subtotal = EXCLUDED.subtotal,
        total = EXCLUDED.total,
        currency = EXCLUDED.currency,
        payment_method = EXCLUDED.payment_method,
        status = EXCLUDED.status,
        mercado_pago_preference_id = COALESCE(
          EXCLUDED.mercado_pago_preference_id,
          orders.mercado_pago_preference_id
        ),
        mercado_pago_payment_id = COALESCE(
          EXCLUDED.mercado_pago_payment_id,
          orders.mercado_pago_payment_id
        ),
        whatsapp_status = COALESCE(
          EXCLUDED.whatsapp_status,
          orders.whatsapp_status
        )
    `,
    [
      order.id,
      order.createdAt,
      order.updatedAt,
      JSON.stringify(order.customer),
      JSON.stringify(order.deliverySchedule),
      JSON.stringify(order.items),
      order.subtotal,
      order.total,
      order.currency,
      order.paymentMethod,
      order.status,
      order.mercadoPagoPreferenceId ?? null,
      order.mercadoPagoPaymentId ?? null,
      order.whatsappStatus ?? null,
    ],
  );

  return { ok: true, skipped: false };
}

export async function getOrderById(orderId: string) {
  if (!hasDatabase()) {
    return null;
  }

  await ensureDatabaseSchema();
  const result = await getPool().query(
    `
      SELECT
        id,
        created_at,
        updated_at,
        customer,
        delivery_schedule,
        items,
        subtotal,
        total,
        currency,
        payment_method,
        status,
        mercado_pago_preference_id,
        mercado_pago_payment_id,
        whatsapp_status
      FROM orders
      WHERE id = $1
      LIMIT 1
    `,
    [orderId],
  );

  return result.rows[0] ? mapOrderRow(result.rows[0]) : null;
}

export async function listOrders(limit = 100) {
  if (!hasDatabase()) {
    return [];
  }

  await ensureDatabaseSchema();
  const result = await getPool().query(
    `
      SELECT
        id,
        created_at,
        updated_at,
        customer,
        delivery_schedule,
        items,
        subtotal,
        total,
        currency,
        payment_method,
        status,
        mercado_pago_preference_id,
        mercado_pago_payment_id,
        whatsapp_status
      FROM orders
      ORDER BY created_at DESC
      LIMIT $1
    `,
    [limit],
  );

  return result.rows.map(mapOrderRow);
}

export async function listMarketingContacts(limit = 500) {
  if (!hasDatabase()) {
    return [];
  }

  await ensureDatabaseSchema();
  const result = await getPool().query<{
    name: string | null;
    phone: string | null;
  }>(
    `
      SELECT DISTINCT ON (customer->>'phone')
        customer->>'name' AS name,
        customer->>'phone' AS phone
      FROM orders
      WHERE customer->>'marketingOptIn' = 'true'
        AND COALESCE(customer->>'phone', '') <> ''
      ORDER BY customer->>'phone', created_at DESC
      LIMIT $1
    `,
    [limit],
  );

  return result.rows
    .filter((row) => row.phone)
    .map((row) => ({
      name: row.name ?? "Cliente",
      phone: row.phone as string,
      marketingOptIn: true as const,
    }));
}

function mapOrderRow(row: OrderRow): OrderRecord {
  return {
    id: String(row.id),
    createdAt: toIsoString(row.created_at),
    updatedAt: toIsoString(row.updated_at),
    customer: row.customer ?? {
      name: "Cliente",
      phone: "",
      address: "",
      postalCode: "",
    },
    deliverySchedule: row.delivery_schedule ?? {
      date: "",
      timeWindow: "",
    },
    items: Array.isArray(row.items) ? row.items : [],
    subtotal: toNumber(row.subtotal),
    total: toNumber(row.total),
    currency: row.currency,
    paymentMethod: row.payment_method,
    status: row.status,
    mercadoPagoPreferenceId: row.mercado_pago_preference_id ?? undefined,
    mercadoPagoPaymentId: row.mercado_pago_payment_id ?? undefined,
    whatsappStatus: row.whatsapp_status ?? undefined,
  };
}

function toIsoString(value: Date | string | null | undefined) {
  const date = value ? new Date(value) : new Date();

  return Number.isNaN(date.getTime())
    ? new Date().toISOString()
    : date.toISOString();
}

function toNumber(value: string | number | null | undefined) {
  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : 0;
}

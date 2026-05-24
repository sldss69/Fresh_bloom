import { products } from "@/lib/mock-products";
import {
  sendWhatsappOrderConfirmation,
  sendWhatsappText as sendWhatsappTextMessage,
} from "@/lib/server/whatsapp";
import type {
  CheckoutCartItem,
  OrderCustomer,
  OrderDeliverySchedule,
  OrderItem,
  OrderRecord,
  OrderStatus,
  PaymentMethod,
} from "@/types/order";

type CreateOrderInput = {
  items: CheckoutCartItem[];
  customer: OrderCustomer;
  deliverySchedule: OrderDeliverySchedule;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
};

export function getSiteUrl() {
  const urls = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.RENDER_EXTERNAL_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "",
  ].filter(Boolean) as string[];
  const configuredUrl =
    urls.find((url) => isPublicHttpsUrl(url)) ??
    urls[0] ??
    "http://localhost:3000";

  return configuredUrl.replace(/\/$/, "");
}

export function isPublicHttpsUrl(url: string) {
  try {
    const parsedUrl = new URL(url);

    return (
      parsedUrl.protocol === "https:" &&
      parsedUrl.hostname !== "localhost" &&
      parsedUrl.hostname !== "127.0.0.1"
    );
  } catch {
    return false;
  }
}

export function createOrder(input: CreateOrderInput): OrderRecord {
  const now = new Date().toISOString();
  const orderItems = normalizeCartItems(input.items);
  const subtotal = orderItems.reduce((total, item) => total + item.total, 0);

  return {
    id: createOrderId(),
    createdAt: now,
    updatedAt: now,
    customer: {
      name: input.customer.name.trim(),
      phone: sanitizePhone(input.customer.phone),
      address: input.customer.address.trim(),
      postalCode: sanitizePostalCode(input.customer.postalCode),
      notes: input.customer.notes?.trim() || undefined,
      marketingOptIn: Boolean(input.customer.marketingOptIn),
    },
    deliverySchedule: validateDeliverySchedule(input.deliverySchedule),
    items: orderItems,
    subtotal,
    total: subtotal,
    currency: "MXN",
    paymentMethod: input.paymentMethod,
    status: input.status,
    whatsappStatus: "pending",
  };
}

export function validateCustomer(customer: OrderCustomer) {
  const name = customer.name?.trim();
  const phone = sanitizePhone(customer.phone);
  const address = customer.address?.trim();
  const postalCode = sanitizePostalCode(customer.postalCode);

  if (!name) {
    throw new Error("El nombre es obligatorio.");
  }

  if (phone.length < 10) {
    throw new Error("El teléfono debe tener al menos 10 dígitos.");
  }

  if (!address) {
    throw new Error("La dirección de entrega es obligatoria.");
  }

  if (postalCode.length !== 5) {
    throw new Error("El código postal debe tener 5 dígitos.");
  }

  return {
    name,
    phone,
    address,
    postalCode,
    notes: customer.notes?.trim() || undefined,
    marketingOptIn: Boolean(customer.marketingOptIn),
  };
}

export function validateDeliverySchedule(
  deliverySchedule: OrderDeliverySchedule,
) {
  const date = deliverySchedule?.date?.trim();
  const timeWindow = deliverySchedule?.timeWindow?.trim();

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("Elige una fecha de entrega válida.");
  }

  const deliveryDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(deliveryDate.getTime())) {
    throw new Error("Elige una fecha de entrega válida.");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (deliveryDate < today) {
    throw new Error("La fecha de entrega no puede ser pasada.");
  }

  if (!timeWindow) {
    throw new Error("Elige un horario de entrega.");
  }

  return {
    date,
    timeWindow,
  };
}

export function normalizeCartItems(cartItems: CheckoutCartItem[]): OrderItem[] {
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    throw new Error("El carrito está vacío.");
  }

  return cartItems.map((item) => {
    if (item.customRecipe) {
      const quantity = Number(item.quantity);
      const ingredients = item.customRecipe.ingredients
        .map((ingredient) => ingredient.trim())
        .filter(Boolean);
      const unitPrice = Number(item.unitPrice ?? 0);

      if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new Error("La cantidad de un producto no es válida.");
      }

      if (ingredients.length === 0) {
        throw new Error("El ramo personalizado no tiene selección.");
      }

      if (!Number.isFinite(unitPrice) || unitPrice < 0) {
        throw new Error("El precio de un producto no es valido.");
      }

      return {
        id: item.id,
        name: `${item.name?.trim() || "Ramo personalizado"}: ${ingredients.join(", ")}`,
        quantity,
        unitPrice,
        total: unitPrice * quantity,
      };
    }

    const product = products.find((current) => current.id === item.id);
    const quantity = Number(item.quantity);

    if (!product) {
      throw new Error("Uno de los productos no existe.");
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error("La cantidad de un producto no es válida.");
    }

    return {
      id: product.id,
      name: product.name,
      quantity,
      unitPrice: product.price,
      total: product.price * quantity,
    };
  });
}

export function buildBusinessWhatsappUrl(order: OrderRecord) {
  const message = encodeURIComponent(buildOrderMessage(order));
  const configuredUrl = process.env.BUSINESS_WHATSAPP_URL;
  const phone = process.env.BUSINESS_WHATSAPP_NUMBER;

  if (configuredUrl) {
    const separator = configuredUrl.includes("?") ? "&" : "?";
    return `${configuredUrl}${separator}text=${message}`;
  }

  return `https://wa.me/${phone ?? ""}?text=${message}`;
}

export function buildOrderMessage(order: OrderRecord) {
  const items = order.items
    .map((item) =>
      `- ${item.quantity} x ${item.name} (${
        item.total > 0 ? `$${item.total} MXN` : "precio por confirmar"
      })`,
    )
    .join("\n");

  return [
    `Hola Fresh Bloom, quiero confirmar mi pedido ${order.id}:`,
    items,
    `Total: ${order.total > 0 ? `$${order.total} MXN` : "por confirmar"}`,
    `Entrega programada: ${formatDeliverySchedule(order.deliverySchedule)}`,
    `Nombre: ${order.customer.name}`,
    `Teléfono: ${order.customer.phone}`,
    `Dirección: ${order.customer.address}`,
    `Código postal: ${order.customer.postalCode}`,
    order.customer.notes ? `Notas: ${order.customer.notes}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export async function sendWhatsappMessage(order: OrderRecord, text: string) {
  return sendWhatsappOrderConfirmation(order, text);
}

export async function sendBusinessWhatsappMessage(order: OrderRecord) {
  const businessPhone = sanitizePhone(process.env.BUSINESS_WHATSAPP_NUMBER ?? "");

  if (!businessPhone) {
    return { ok: false, skipped: true };
  }

  return sendWhatsappTextMessage(businessPhone, buildOrderMessage(order));
}

export function buildApprovedPaymentMessage(order: OrderRecord) {
  return [
    `Gracias por tu compra en Fresh Bloom, ${order.customer.name}.`,
    `Tu pago del pedido ${order.id} fue confirmado.`,
    `Entrega programada: ${formatDeliverySchedule(order.deliverySchedule)}.`,
    "Te iremos avisando por este medio el avance de tu pedido.",
  ].join("\n");
}

export function formatDeliverySchedule(schedule: OrderDeliverySchedule) {
  const formattedDate = new Intl.DateTimeFormat("es-MX", {
    dateStyle: "full",
  }).format(new Date(`${schedule.date}T00:00:00`));

  return schedule.timeWindow
    ? `${formattedDate}, ${schedule.timeWindow}`
    : formattedDate;
}

export function sanitizePhone(phone: string) {
  return String(phone ?? "").replace(/\D/g, "");
}

export function sanitizePostalCode(postalCode: string) {
  return String(postalCode ?? "").replace(/\D/g, "");
}

function createOrderId() {
  const date = new Date();
  const stamp = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
    String(date.getHours()).padStart(2, "0"),
    String(date.getMinutes()).padStart(2, "0"),
    String(date.getSeconds()).padStart(2, "0"),
  ].join("");
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();

  return `FB-${stamp}-${suffix}`;
}

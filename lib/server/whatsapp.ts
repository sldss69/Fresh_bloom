import { createHmac, timingSafeEqual } from "node:crypto";

import { logInfo, logWarn } from "@/lib/server/logger";
import type { OrderDeliverySchedule, OrderRecord } from "@/types/order";

export type WhatsappSendResult = {
  ok: boolean;
  skipped: boolean;
  messageId?: string;
};

export type WhatsappTemplateParameter =
  | {
      type: "text";
      text: string;
    }
  | {
      type: "currency";
      currency: {
        fallback_value: string;
        code: string;
        amount_1000: number;
      };
    }
  | {
      type: "date_time";
      date_time: {
        fallback_value: string;
      };
    };

export type WhatsappTemplateComponent = {
  type: "header" | "body" | "button";
  sub_type?: "quick_reply" | "url";
  index?: string;
  parameters?: WhatsappTemplateParameter[];
};

export type WhatsappPromotionRecipient = {
  name?: string;
  phone: string;
  marketingOptIn?: boolean;
  bodyParameters?: string[];
  components?: WhatsappTemplateComponent[];
};

type WhatsappMessageResponse = {
  messages?: Array<{
    id?: string;
  }>;
};

const DEFAULT_GRAPH_API_VERSION = "v25.0";
const DEFAULT_TEMPLATE_LANGUAGE = "es_MX";

export function getWhatsappConfig() {
  const graphApiVersion = normalizeGraphApiVersion(
    process.env.WHATSAPP_GRAPH_API_VERSION,
  );

  return {
    token: process.env.WHATSAPP_API_TOKEN,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
    graphApiVersion,
    configured: Boolean(
      process.env.WHATSAPP_API_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID,
    ),
  };
}

export function getWhatsappSetupStatus() {
  const config = getWhatsappConfig();

  return {
    configured: config.configured,
    graphApiVersion: config.graphApiVersion,
    hasToken: Boolean(config.token),
    hasPhoneNumberId: Boolean(config.phoneNumberId),
    hasWebhookVerifyToken: Boolean(process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN),
    hasAppSecret: Boolean(process.env.WHATSAPP_APP_SECRET),
    hasConfirmationTemplate: Boolean(
      process.env.WHATSAPP_CONFIRMATION_TEMPLATE_NAME,
    ),
    hasPromotionTemplate: Boolean(process.env.WHATSAPP_PROMOTION_TEMPLATE_NAME),
    hasPromotionSecret: Boolean(process.env.WHATSAPP_PROMOTION_API_SECRET),
  };
}

export async function sendWhatsappText(
  phone: string,
  text: string,
): Promise<WhatsappSendResult> {
  const to = normalizeWhatsappRecipient(phone);

  if (!to) {
    return { ok: false, skipped: true };
  }

  return sendWhatsappPayload({
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to,
    type: "text",
    text: {
      preview_url: false,
      body: text,
    },
  });
}

export async function sendWhatsappOrderConfirmation(
  order: OrderRecord,
  fallbackText: string,
): Promise<WhatsappSendResult> {
  const templateName = process.env.WHATSAPP_CONFIRMATION_TEMPLATE_NAME;

  if (!templateName) {
    return sendWhatsappText(order.customer.phone, fallbackText);
  }

  return sendWhatsappTemplate({
    to: order.customer.phone,
    templateName,
    languageCode:
      process.env.WHATSAPP_CONFIRMATION_TEMPLATE_LANGUAGE ??
      process.env.WHATSAPP_TEMPLATE_LANGUAGE ??
      DEFAULT_TEMPLATE_LANGUAGE,
    components: buildOrderConfirmationTemplateComponents(order),
  });
}

export async function sendWhatsappTemplate({
  to,
  templateName,
  languageCode = DEFAULT_TEMPLATE_LANGUAGE,
  components,
}: {
  to: string;
  templateName: string;
  languageCode?: string;
  components?: WhatsappTemplateComponent[];
}): Promise<WhatsappSendResult> {
  const recipient = normalizeWhatsappRecipient(to);

  if (!recipient || !templateName) {
    return { ok: false, skipped: true };
  }

  return sendWhatsappPayload({
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: recipient,
    type: "template",
    template: removeUndefinedValues({
      name: templateName,
      language: {
        code: languageCode,
      },
      components,
    }),
  });
}

export function buildPromotionTemplateComponents(
  recipient: WhatsappPromotionRecipient,
  defaultBodyParameters: string[] = [],
) {
  if (recipient.components) {
    return recipient.components;
  }

  const bodyParameters =
    recipient.bodyParameters ??
    defaultBodyParameters.map((parameter) =>
      parameter === "{{name}}" ? recipient.name ?? "cliente" : parameter,
    );

  if (bodyParameters.length === 0) {
    return undefined;
  }

  return [
    {
      type: "body" as const,
      parameters: bodyParameters.map((text) => ({
        type: "text" as const,
        text,
      })),
    },
  ];
}

export function normalizeWhatsappRecipient(phone: string) {
  const digits = sanitizePhone(phone);
  const defaultCountryCode = sanitizePhone(
    process.env.WHATSAPP_DEFAULT_COUNTRY_CODE ?? "52",
  );

  if (!digits) {
    return "";
  }

  if (digits.length === 10 && defaultCountryCode) {
    return `${defaultCountryCode}${digits}`;
  }

  return digits;
}

export function verifyWhatsappWebhookChallenge(url: URL) {
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");
  const expectedToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;

  if (mode === "subscribe" && token && token === expectedToken && challenge) {
    return challenge;
  }

  return null;
}

export function verifyWhatsappWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
) {
  const appSecret = process.env.WHATSAPP_APP_SECRET;

  if (!appSecret) {
    logWarn("whatsapp.webhook.signature.skipped");
    return true;
  }

  if (!signatureHeader?.startsWith("sha256=")) {
    return false;
  }

  const expectedSignature = signatureHeader.slice("sha256=".length);
  const calculatedSignature = createHmac("sha256", appSecret)
    .update(rawBody)
    .digest("hex");

  return safeCompare(calculatedSignature, expectedSignature);
}

export function sanitizePhone(phone: string) {
  return String(phone ?? "").replace(/\D/g, "");
}

async function sendWhatsappPayload(
  payload: Record<string, unknown>,
): Promise<WhatsappSendResult> {
  const config = getWhatsappConfig();

  if (!config.configured) {
    return { ok: false, skipped: true };
  }

  const response = await fetch(
    `https://graph.facebook.com/${config.graphApiVersion}/${config.phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`No se pudo enviar el mensaje de WhatsApp: ${message}`);
  }

  const data = (await response.json()) as WhatsappMessageResponse;
  const messageId = data.messages?.[0]?.id;

  logInfo("whatsapp.message.sent", {
    messageId: messageId ?? null,
    type: String(payload.type ?? "unknown"),
  });

  return { ok: true, skipped: false, messageId };
}

function buildOrderConfirmationTemplateComponents(order: OrderRecord) {
  return [
    {
      type: "body" as const,
      parameters: [
        {
          type: "text" as const,
          text: order.customer.name,
        },
        {
          type: "text" as const,
          text: order.id,
        },
        {
          type: "text" as const,
          text: formatDeliverySchedule(order.deliverySchedule),
        },
        {
          type: "text" as const,
          text:
            order.total > 0
              ? `$${order.total.toLocaleString("es-MX")} MXN`
              : "por confirmar",
        },
      ],
    },
  ];
}

function formatDeliverySchedule(schedule: OrderDeliverySchedule) {
  const formattedDate = new Intl.DateTimeFormat("es-MX", {
    dateStyle: "full",
  }).format(new Date(`${schedule.date}T00:00:00`));

  return schedule.timeWindow
    ? `${formattedDate}, ${schedule.timeWindow}`
    : formattedDate;
}

function normalizeGraphApiVersion(value?: string) {
  if (!value) {
    return DEFAULT_GRAPH_API_VERSION;
  }

  return value.startsWith("v") ? value : `v${value}`;
}

function safeCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
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

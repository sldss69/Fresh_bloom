import { timingSafeEqual } from "node:crypto";

import { NextResponse } from "next/server";

import { logError, logInfo, logWarn } from "@/lib/server/logger";
import { listMarketingContacts } from "@/lib/server/order-repository";
import {
  buildPromotionTemplateComponents,
  normalizeWhatsappRecipient,
  sendWhatsappTemplate,
  type WhatsappPromotionRecipient,
  type WhatsappTemplateComponent,
} from "@/lib/server/whatsapp";

type PromotionRequest = {
  recipients?: WhatsappPromotionRecipient[];
  templateName?: string;
  languageCode?: string;
  bodyParameters?: string[];
  components?: WhatsappTemplateComponent[];
  dryRun?: boolean;
  limit?: number;
};

export async function POST(request: Request) {
  try {
    if (!verifyPromotionSecret(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as PromotionRequest;
    const templateName =
      body.templateName ?? process.env.WHATSAPP_PROMOTION_TEMPLATE_NAME;
    const languageCode =
      body.languageCode ??
      process.env.WHATSAPP_PROMOTION_TEMPLATE_LANGUAGE ??
      process.env.WHATSAPP_TEMPLATE_LANGUAGE ??
      "es_MX";

    if (!templateName) {
      return NextResponse.json(
        { error: "Falta WHATSAPP_PROMOTION_TEMPLATE_NAME o templateName." },
        { status: 400 },
      );
    }

    const recipients = await getPromotionRecipients(body);

    if (body.dryRun) {
      return NextResponse.json({
        dryRun: true,
        templateName,
        languageCode,
        recipientCount: recipients.length,
        recipients: recipients.slice(0, 20).map((recipient) => ({
          name: recipient.name ?? null,
          phone: maskPhone(normalizeWhatsappRecipient(recipient.phone)),
        })),
      });
    }

    const results = [];

    for (const recipient of recipients) {
      try {
        const components =
          recipient.components ??
          body.components ??
          buildPromotionTemplateComponents(
            recipient,
            body.bodyParameters ?? [],
          );
        const result = await sendWhatsappTemplate({
          to: recipient.phone,
          templateName,
          languageCode,
          components,
        });

        results.push({
          phone: maskPhone(normalizeWhatsappRecipient(recipient.phone)),
          ok: result.ok,
          skipped: result.skipped,
          messageId: result.messageId ?? null,
        });
      } catch (error) {
        results.push({
          phone: maskPhone(normalizeWhatsappRecipient(recipient.phone)),
          ok: false,
          skipped: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    const sent = results.filter((result) => result.ok).length;
    const failed = results.filter(
      (result) => !result.ok && !result.skipped,
    ).length;
    const skipped = results.filter((result) => result.skipped).length;

    logInfo("whatsapp.promotions.finished", {
      templateName,
      recipientCount: recipients.length,
      sent,
      failed,
      skipped,
    });

    return NextResponse.json({
      templateName,
      languageCode,
      recipientCount: recipients.length,
      sent,
      failed,
      skipped,
      results,
    });
  } catch (error) {
    logError("whatsapp.promotions.failed", {
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json(
      { error: "No se pudo enviar la promoción por WhatsApp." },
      { status: 500 },
    );
  }
}

async function getPromotionRecipients(
  body: PromotionRequest,
): Promise<WhatsappPromotionRecipient[]> {
  if (body.recipients?.length) {
    return body.recipients
      .filter((recipient) => recipient.marketingOptIn === true)
      .filter((recipient) => normalizeWhatsappRecipient(recipient.phone));
  }

  const contacts = await listMarketingContacts(body.limit ?? 500);

  return contacts
    .filter((contact) => normalizeWhatsappRecipient(contact.phone))
    .map((contact) => ({
      name: contact.name,
      phone: contact.phone,
      marketingOptIn: true,
    }));
}

function verifyPromotionSecret(request: Request) {
  const configuredSecret = process.env.WHATSAPP_PROMOTION_API_SECRET;

  if (!configuredSecret) {
    logWarn("whatsapp.promotions.secret_missing");
    return false;
  }

  const authorization = request.headers.get("authorization");
  const bearerSecret = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : "";
  const providedSecret =
    request.headers.get("x-promotion-secret") ?? bearerSecret;

  return safeCompare(configuredSecret, providedSecret);
}

function safeCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

function maskPhone(phone: string) {
  if (phone.length <= 4) {
    return "****";
  }

  return `${"*".repeat(Math.max(phone.length - 4, 0))}${phone.slice(-4)}`;
}

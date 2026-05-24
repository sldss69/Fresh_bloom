import { NextResponse } from "next/server";

import { logError, logInfo, logWarn } from "@/lib/server/logger";
import {
  verifyWhatsappWebhookChallenge,
  verifyWhatsappWebhookSignature,
} from "@/lib/server/whatsapp";

type WhatsappWebhookBody = {
  object?: string;
  entry?: Array<{
    id?: string;
    changes?: Array<{
      field?: string;
      value?: {
        metadata?: {
          phone_number_id?: string;
          display_phone_number?: string;
        };
        messages?: Array<{
          id?: string;
          from?: string;
          type?: string;
          timestamp?: string;
        }>;
        statuses?: Array<{
          id?: string;
          recipient_id?: string;
          status?: string;
          timestamp?: string;
        }>;
      };
    }>;
  }>;
};

export async function GET(request: Request) {
  const challenge = verifyWhatsappWebhookChallenge(new URL(request.url));

  if (!challenge) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  return new Response(challenge, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signatureHeader = request.headers.get("x-hub-signature-256");

    if (!verifyWhatsappWebhookSignature(rawBody, signatureHeader)) {
      logWarn("whatsapp.webhook.invalid_signature");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = safeParseWebhookBody(rawBody);
    const summary = summarizeWebhook(body);

    logInfo("whatsapp.webhook.received", summary);

    return NextResponse.json({ received: true });
  } catch (error) {
    logError("whatsapp.webhook.failed", {
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json(
      { error: "No se pudo procesar el webhook de WhatsApp." },
      { status: 500 },
    );
  }
}

function safeParseWebhookBody(rawBody: string): WhatsappWebhookBody {
  if (!rawBody.trim()) {
    return {};
  }

  try {
    return JSON.parse(rawBody) as WhatsappWebhookBody;
  } catch {
    return {};
  }
}

function summarizeWebhook(body: WhatsappWebhookBody) {
  const entries = body.entry ?? [];
  let messageCount = 0;
  let statusCount = 0;
  let lastStatus: string | null = null;
  let phoneNumberId: string | null = null;

  for (const entry of entries) {
    for (const change of entry.changes ?? []) {
      messageCount += change.value?.messages?.length ?? 0;
      statusCount += change.value?.statuses?.length ?? 0;
      lastStatus = change.value?.statuses?.at(-1)?.status ?? lastStatus;
      phoneNumberId =
        change.value?.metadata?.phone_number_id ?? phoneNumberId;
    }
  }

  return {
    object: body.object ?? null,
    entries: entries.length,
    messageCount,
    statusCount,
    lastStatus,
    phoneNumberId,
  };
}

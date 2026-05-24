import { NextResponse } from "next/server";

import { getWhatsappSetupStatus } from "@/lib/server/whatsapp";

const enabled =
  process.env.NODE_ENV !== "production" ||
  process.env.ENABLE_ENV_DEBUG === "true";

export async function GET() {
  if (!enabled) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    mercadoPagoAccessToken: describeSecret(process.env.MERCADOPAGO_ACCESS_TOKEN),
    mercadoPagoPublicKey: describeSecret(
      process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY,
    ),
    mercadoPagoWebhookSecret: describeSecret(
      process.env.MERCADOPAGO_WEBHOOK_SECRET,
    ),
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? null,
    renderExternalUrl: process.env.RENDER_EXTERNAL_URL ?? null,
    whatsapp: getWhatsappSetupStatus(),
    nodeEnv: process.env.NODE_ENV ?? null,
  });
}

function describeSecret(value?: string) {
  if (!value) {
    return {
      present: false,
      prefix: null,
      length: 0,
    };
  }

  return {
    present: true,
    prefix: value.startsWith("TEST-")
      ? "TEST"
      : value.startsWith("APP_USR-")
        ? "APP_USR"
        : "OTHER",
    length: value.length,
  };
}

import { Pool } from "pg";

declare global {
  var freshBloomDbPool: Pool | undefined;
  var freshBloomDbSchemaPromise: Promise<void> | undefined;
}

export function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

export function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("Falta DATABASE_URL.");
  }

  if (!globalThis.freshBloomDbPool) {
    globalThis.freshBloomDbPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
      ssl: shouldUseDatabaseSsl(process.env.DATABASE_URL)
        ? { rejectUnauthorized: false }
        : undefined,
    });
  }

  return globalThis.freshBloomDbPool;
}

export async function ensureDatabaseSchema() {
  if (!hasDatabase()) {
    return;
  }

  if (!globalThis.freshBloomDbSchemaPromise) {
    globalThis.freshBloomDbSchemaPromise = getPool().query(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        created_at TIMESTAMPTZ NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL,
        customer JSONB NOT NULL,
        delivery_schedule JSONB NOT NULL DEFAULT '{}'::jsonb,
        items JSONB NOT NULL,
        subtotal NUMERIC(10, 2) NOT NULL,
        total NUMERIC(10, 2) NOT NULL,
        currency TEXT NOT NULL,
        payment_method TEXT NOT NULL,
        status TEXT NOT NULL,
        mercado_pago_preference_id TEXT,
        mercado_pago_payment_id TEXT,
        whatsapp_status TEXT,
        raw JSONB NOT NULL DEFAULT '{}'::jsonb
      );

      ALTER TABLE orders
        ADD COLUMN IF NOT EXISTS delivery_schedule JSONB NOT NULL DEFAULT '{}'::jsonb;

      CREATE INDEX IF NOT EXISTS orders_created_at_idx
        ON orders (created_at DESC);

      CREATE INDEX IF NOT EXISTS orders_status_idx
        ON orders (status);
    `).then(() => undefined);
  }

  await globalThis.freshBloomDbSchemaPromise;
}

function shouldUseDatabaseSsl(databaseUrl: string) {
  if (process.env.DATABASE_SSL === "true") {
    return true;
  }

  if (process.env.DATABASE_SSL === "false") {
    return false;
  }

  try {
    const url = new URL(databaseUrl);
    const sslMode = url.searchParams.get("sslmode");

    return (
      sslMode === "require" ||
      sslMode === "verify-ca" ||
      sslMode === "verify-full" ||
      url.hostname.endsWith(".render.com")
    );
  } catch {
    return false;
  }
}

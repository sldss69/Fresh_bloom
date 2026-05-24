import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowLeft, Database, Leaf, LogOut } from "lucide-react";

import { OrdersTable } from "@/components/admin/OrdersTable";
import { Button } from "@/components/ui/button";
import {
  ADMIN_SESSION_COOKIE,
  hasValidAdminSession,
} from "@/lib/admin-auth";
import { hasDatabase } from "@/lib/server/db";
import { listOrders } from "@/lib/server/order-repository";

type OrdersAdminPageProps = {
  nextPath: string;
};

export async function OrdersAdminPage({ nextPath }: OrdersAdminPageProps) {
  const cookieStore = await cookies();
  const isAuthenticated = await hasValidAdminSession(
    cookieStore.get(ADMIN_SESSION_COOKIE)?.value,
  );

  if (!isAuthenticated) {
    redirect(`/admin/login?next=${encodeURIComponent(nextPath)}`);
  }

  const orders = await listOrders();
  const databaseReady = hasDatabase();

  return (
    <main className="min-h-screen bg-brand-cream text-brand-ink">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-brand-wine/15 pb-6 md:flex-row md:items-center">
          <div className="flex items-start gap-4">
            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-wine/10">
              <Leaf className="h-5 w-5 text-brand-wine" />
            </div>
            <div>
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.28em] text-brand-wine">
                Fresh Bloom · Admin
              </p>
              <h1 className="font-heading mt-1.5 text-3xl font-bold leading-tight text-brand-ink md:text-4xl">
                Administración de pedidos
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-brand-ink/55">
                Mesa interna para revisar ventas, entregas, pagos y operación.
                Esta pantalla no se enlaza desde la tienda pública.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              asChild
              variant="outline"
              className="border-brand-wine/25 bg-white text-brand-ink hover:bg-brand-cream hover:border-brand-wine/40"
            >
              <Link href="/productos">
                <ArrowLeft className="h-4 w-4" />
                Volver a tienda
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-brand-wine/25 bg-white text-brand-ink hover:bg-brand-cream hover:border-brand-wine/40"
            >
              <Link href="/admin/logout">
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </Link>
            </Button>
          </div>
        </div>

        {!databaseReady ? (
          <div className="mt-8 flex items-start gap-3 rounded-xl border border-brand-mauve/40 bg-white p-6 text-sm leading-6 text-brand-ink/65 shadow-sm">
            <Database className="mt-0.5 h-5 w-5 text-brand-wine" />
            <div>
              <p className="font-bold text-brand-ink">Base de datos pendiente</p>
              <p className="mt-1">
                Configura DATABASE_URL para ver pedidos guardados, métricas y
                estados operativos.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 py-6">
            <OrdersTable orders={orders} />
          </div>
        )}
      </section>
    </main>
  );
}

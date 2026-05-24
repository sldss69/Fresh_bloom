import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowLeft, Database, LogOut } from "lucide-react";

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
    <main className="min-h-screen bg-brand-cream text-neutral-950">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 border-b border-neutral-200 pb-6 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-neutral-500">
              Fresh Bloom Admin
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-neutral-950 md:text-4xl">
              Administración de pedidos
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
              Mesa interna para revisar ventas, entregas, pagos y operación.
              Esta pantalla no se enlaza desde la tienda pública.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" className="border-neutral-300 bg-white">
              <Link href="/productos">
                <ArrowLeft className="h-4 w-4" />
                Volver a tienda
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-neutral-300 bg-white">
              <Link href="/admin/logout">
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </Link>
            </Button>
          </div>
        </div>

        {!databaseReady ? (
          <div className="mt-8 flex items-start gap-3 rounded-lg border border-amber-200 bg-white p-6 text-sm leading-6 text-neutral-600 shadow-sm">
            <Database className="mt-0.5 h-5 w-5 text-amber-700" />
            <div>
              <p className="font-black text-neutral-950">Base de datos pendiente</p>
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

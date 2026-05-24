import type { Metadata } from "next";

import { OrdersAdminPage } from "@/components/admin/OrdersAdminPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin de pedidos | Fresh Bloom",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPedidosRoute() {
  return <OrdersAdminPage nextPath="/admin/pedidos" />;
}

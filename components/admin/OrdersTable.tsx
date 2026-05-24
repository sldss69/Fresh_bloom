"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  ExternalLink,
  LayoutDashboard,
  MessageCircle,
  PackageCheck,
  Phone,
  Search,
  ShoppingBag,
  Timer,
  XCircle,
} from "lucide-react";

import type { OrderRecord, OrderStatus, PaymentMethod } from "@/types/order";

type OrdersTableProps = {
  orders: OrderRecord[];
};

type AdminModule = "admin" | "orders" | "revenue" | "pending" | "deliveries";
type StatusFilter = "all" | OrderStatus;
type PaymentFilter = "all" | PaymentMethod;

const moduleLabels: Record<AdminModule, string> = {
  admin: "Admin",
  orders: "Pedidos",
  revenue: "Ingresos",
  pending: "Pendientes",
  deliveries: "Entregas",
};

const statusLabels: Record<OrderRecord["status"], string> = {
  pending: "Pendiente",
  approved: "Aprobado",
  rejected: "Rechazado",
  cancelled: "Cancelado",
  cash_pending: "Efectivo pendiente",
};

const statusStyles: Record<OrderRecord["status"], string> = {
  pending: "bg-amber-50 text-amber-800 ring-amber-200",
  approved: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  rejected: "bg-red-50 text-red-800 ring-red-200",
  cancelled: "bg-brand-beige/40 text-brand-ink/60 ring-brand-wine/15",
  cash_pending: "bg-brand-wine/10 text-brand-wine ring-brand-wine/25",
};

const paymentMethodLabels: Record<OrderRecord["paymentMethod"], string> = {
  mercadopago: "Mercado Pago",
  cash_whatsapp: "Efectivo / WhatsApp",
};

export function OrdersTable({ orders }: OrdersTableProps) {
  const [activeModule, setActiveModule] = useState<AdminModule>("admin");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>("all");
  const [selectedOrderId, setSelectedOrderId] = useState(orders[0]?.id ?? "");

  const summary = useMemo(() => getSummary(orders), [orders]);
  const deliveryQueue = useMemo(() => getDeliveryQueue(orders), [orders]);
  const filteredOrders = useMemo(
    () => filterOrders(orders, query, statusFilter, paymentFilter),
    [orders, paymentFilter, query, statusFilter],
  );
  const selectedOrder =
    filteredOrders.find((order) => order.id === selectedOrderId) ??
    filteredOrders[0] ??
    orders[0];

  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-brand-wine/20 bg-white px-6 py-12 text-center shadow-sm">
        <ShoppingBag className="mx-auto h-9 w-9 text-brand-wine/30" />
        <p className="mt-4 font-heading text-base font-bold text-brand-ink">
          Todavía no hay pedidos guardados
        </p>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-brand-ink/50">
          Cuando entren compras o pedidos por WhatsApp, aparecerán aquí para
          darles seguimiento desde una sola pantalla.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <ModuleHeader activeModule={activeModule} onChange={setActiveModule} />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={<ShoppingBag className="h-5 w-5" />}
          label="Pedidos"
          value={String(summary.totalOrders)}
          detail={`${summary.approvedOrders} aprobados`}
          active={activeModule === "orders"}
          onClick={() => setActiveModule("orders")}
        />
        <MetricCard
          icon={<CreditCard className="h-5 w-5" />}
          label="Ingresos aprobados"
          value={formatMoney(summary.approvedRevenue)}
          detail={`${formatMoney(summary.totalRevenue)} en total`}
          active={activeModule === "revenue"}
          onClick={() => setActiveModule("revenue")}
        />
        <MetricCard
          icon={<Timer className="h-5 w-5" />}
          label="Pendientes"
          value={String(summary.pendingOrders)}
          detail={`${summary.cashPendingOrders} en efectivo`}
          active={activeModule === "pending"}
          onClick={() => setActiveModule("pending")}
        />
        <MetricCard
          icon={<CalendarClock className="h-5 w-5" />}
          label="Próximas entregas"
          value={String(deliveryQueue.length)}
          detail="Desde la base local"
          active={activeModule === "deliveries"}
          onClick={() => setActiveModule("deliveries")}
        />
      </section>

      {activeModule === "admin" ? (
        <AdminOverview
          orders={orders}
          summary={summary}
          deliveryQueue={deliveryQueue}
          onOpenModule={setActiveModule}
          onSelectOrder={setSelectedOrderId}
        />
      ) : null}

      {activeModule === "orders" ? (
        <OrdersModule
          filteredOrders={filteredOrders}
          query={query}
          statusFilter={statusFilter}
          paymentFilter={paymentFilter}
          selectedOrder={selectedOrder}
          onQueryChange={setQuery}
          onStatusChange={setStatusFilter}
          onPaymentChange={setPaymentFilter}
          onSelectOrder={setSelectedOrderId}
        />
      ) : null}

      {activeModule === "revenue" ? (
        <RevenueModule orders={orders} summary={summary} />
      ) : null}

      {activeModule === "pending" ? (
        <PendingModule
          orders={orders}
          onOpenOrder={(orderId) => {
            setSelectedOrderId(orderId);
            setActiveModule("orders");
          }}
        />
      ) : null}

      {activeModule === "deliveries" ? (
        <DeliveriesModule
          orders={deliveryQueue}
          onOpenOrder={(orderId) => {
            setSelectedOrderId(orderId);
            setActiveModule("orders");
          }}
        />
      ) : null}
    </div>
  );
}

function ModuleHeader({
  activeModule,
  onChange,
}: {
  activeModule: AdminModule;
  onChange: (module: AdminModule) => void;
}) {
  const modules: AdminModule[] = [
    "admin",
    "orders",
    "revenue",
    "pending",
    "deliveries",
  ];

  return (
    <div className="rounded-xl border border-brand-wine/15 bg-white p-2 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3 px-2 py-1">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-wine/10 text-brand-wine">
            <LayoutDashboard className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-brand-wine/60">
              Módulo actual
            </p>
            <p className="font-heading text-lg font-bold text-brand-ink">
              {moduleLabels[activeModule]}
            </p>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto rounded-lg bg-brand-cream p-1">
          {modules.map((module) => (
            <button
              key={module}
              type="button"
              onClick={() => onChange(module)}
              className={`h-9 shrink-0 rounded-md px-3 text-sm font-semibold transition ${
                activeModule === module
                  ? "bg-white text-brand-ink shadow-sm"
                  : "text-brand-ink/45 hover:bg-white/70 hover:text-brand-ink/70"
              }`}
            >
              {moduleLabels[module]}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  detail,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        active
          ? "border-brand-wine ring-2 ring-brand-wine/20"
          : "border-brand-wine/15 hover:border-brand-wine/30"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-brand-ink/45">
          {label}
        </p>
        <span className={`flex h-10 w-10 items-center justify-center rounded-lg transition ${
          active ? "bg-brand-wine/10 text-brand-wine" : "bg-brand-cream text-brand-wine/60"
        }`}>
          {icon}
        </span>
      </div>
      <p className="font-heading mt-8 text-3xl font-bold tracking-tight text-brand-ink">
        {value}
      </p>
      <div className="mt-2 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-brand-ink/45">{detail}</p>
        <ArrowRight className={`h-4 w-4 transition ${active ? "text-brand-wine" : "text-brand-ink/25"}`} />
      </div>
    </button>
  );
}

function AdminOverview({
  orders,
  summary,
  deliveryQueue,
  onOpenModule,
  onSelectOrder,
}: {
  orders: OrderRecord[];
  summary: ReturnType<typeof getSummary>;
  deliveryQueue: OrderRecord[];
  onOpenModule: (module: AdminModule) => void;
  onSelectOrder: (orderId: string) => void;
}) {
  const latestOrders = orders.slice(0, 4);
  const todayStr = new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="rounded-xl border border-brand-wine/15 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-brand-wine">
              Admin
            </p>
            <h2 className="font-heading mt-2 text-2xl font-bold text-brand-ink">
              Resumen operativo
            </h2>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="rounded-full bg-brand-beige/50 px-3 py-1 text-[0.62rem] font-semibold capitalize text-brand-ink/60">
              {todayStr}
            </span>
            <p className="text-sm font-medium text-brand-ink/45">
              {orders.length} pedidos en la base local
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <SummaryTile label="Ticket promedio" value={formatMoney(summary.averageTicket)} />
          <SummaryTile label="Tasa de aprobación" value={`${summary.approvalRate}%`} />
          <SummaryTile label="Efectivo pendiente" value={String(summary.cashPendingOrders)} />
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <ModuleShortcut
            title="Revisar pedidos"
            description="Buscar por cliente, teléfono, producto o folio."
            onClick={() => onOpenModule("orders")}
          />
          <ModuleShortcut
            title="Ver ingresos"
            description="Separar pagos aprobados de ventas por confirmar."
            onClick={() => onOpenModule("revenue")}
          />
          <ModuleShortcut
            title="Resolver pendientes"
            description="Contactar pedidos por confirmar o en efectivo."
            onClick={() => onOpenModule("pending")}
          />
          <ModuleShortcut
            title="Preparar entregas"
            description="Ordenar la siguiente cola por fecha y horario."
            onClick={() => onOpenModule("deliveries")}
          />
        </div>
      </div>

      <div className="rounded-xl border border-brand-wine/15 bg-white p-5 shadow-sm">
        <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-brand-wine">
          Actividad reciente
        </p>
        <div className="mt-4 space-y-3">
          {latestOrders.map((order) => (
            <button
              type="button"
              key={`latest-${order.id}`}
              onClick={() => {
                onSelectOrder(order.id);
                onOpenModule("orders");
              }}
              className="w-full rounded-lg border border-brand-wine/10 bg-brand-cream/30 p-3 text-left transition hover:border-brand-wine/25 hover:bg-white"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-brand-ink">{order.customer.name}</p>
                  <p className="mt-1 text-xs font-medium text-brand-ink/40">
                    {order.id}
                  </p>
                </div>
                <StatusBadge status={order.status} />
              </div>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => onOpenModule("deliveries")}
          className="mt-4 flex w-full items-center justify-between rounded-lg bg-brand-beige/30 px-4 py-3 text-left text-sm font-semibold text-brand-ink transition hover:bg-brand-beige/50"
        >
          {deliveryQueue.length} entregas próximas
          <ArrowRight className="h-4 w-4 text-brand-wine" />
        </button>
      </div>
    </section>
  );
}

function OrdersModule({
  filteredOrders,
  query,
  statusFilter,
  paymentFilter,
  selectedOrder,
  onQueryChange,
  onStatusChange,
  onPaymentChange,
  onSelectOrder,
}: {
  filteredOrders: OrderRecord[];
  query: string;
  statusFilter: StatusFilter;
  paymentFilter: PaymentFilter;
  selectedOrder?: OrderRecord;
  onQueryChange: (query: string) => void;
  onStatusChange: (status: StatusFilter) => void;
  onPaymentChange: (payment: PaymentFilter) => void;
  onSelectOrder: (orderId: string) => void;
}) {
  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="min-w-0 space-y-4">
        <ModuleTitle
          eyebrow="Pedidos"
          title="Búsqueda y seguimiento"
          description="Consulta solo lo necesario y abre el detalle del pedido cuando haga falta."
        />
        <OrderFilters
          query={query}
          statusFilter={statusFilter}
          paymentFilter={paymentFilter}
          onQueryChange={onQueryChange}
          onStatusChange={onStatusChange}
          onPaymentChange={onPaymentChange}
        />
        <OrdersList
          orders={filteredOrders}
          selectedOrderId={selectedOrder?.id}
          onSelectOrder={onSelectOrder}
        />
      </div>
      {selectedOrder ? <OrderDetail order={selectedOrder} /> : null}
    </section>
  );
}

function RevenueModule({
  orders,
  summary,
}: {
  orders: OrderRecord[];
  summary: ReturnType<typeof getSummary>;
}) {
  const approvedOrders = orders.filter((order) => order.status === "approved");
  const mercadoPagoRevenue = approvedOrders
    .filter((order) => order.paymentMethod === "mercadopago")
    .reduce((total, order) => total + order.total, 0);
  const cashRevenue = approvedOrders
    .filter((order) => order.paymentMethod === "cash_whatsapp")
    .reduce((total, order) => total + order.total, 0);

  return (
    <section className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
      <div className="rounded-xl border border-brand-wine/15 bg-white p-5 shadow-sm">
        <ModuleTitle
          eyebrow="Ingresos"
          title={formatMoney(summary.approvedRevenue)}
          description="Ventas con pago aprobado o confirmado."
        />
        <div className="mt-5 space-y-3">
          <SummaryTile label="Mercado Pago" value={formatMoney(mercadoPagoRevenue)} />
          <SummaryTile label="Efectivo confirmado" value={formatMoney(cashRevenue)} />
          <SummaryTile label="Ticket promedio" value={formatMoney(summary.averageTicket)} />
        </div>
      </div>
      <div className="rounded-xl border border-brand-wine/15 bg-white p-5 shadow-sm">
        <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-brand-wine">
          Pedidos aprobados
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {approvedOrders.length > 0 ? (
            approvedOrders.map((order) => (
              <OrderMiniCard key={`revenue-${order.id}`} order={order} />
            ))
          ) : (
            <EmptyModule message="Todavía no hay ingresos aprobados." />
          )}
        </div>
      </div>
    </section>
  );
}

function PendingModule({
  orders,
  onOpenOrder,
}: {
  orders: OrderRecord[];
  onOpenOrder: (orderId: string) => void;
}) {
  const pendingOrders = orders.filter(
    (order) => order.status === "pending" || order.status === "cash_pending",
  );

  return (
    <section className="space-y-4">
      <ModuleTitle
        eyebrow="Pendientes"
        title="Pedidos por confirmar"
        description="Prioriza pagos pendientes, efectivo por confirmar y contacto con cliente."
      />
      <div className="grid gap-3 lg:grid-cols-2">
        {pendingOrders.length > 0 ? (
          pendingOrders.map((order) => (
            <OperationalCard
              key={`pending-${order.id}`}
              order={order}
              onOpenOrder={onOpenOrder}
            />
          ))
        ) : (
          <EmptyModule message="No hay pedidos pendientes por resolver." />
        )}
      </div>
    </section>
  );
}

function DeliveriesModule({
  orders,
  onOpenOrder,
}: {
  orders: OrderRecord[];
  onOpenOrder: (orderId: string) => void;
}) {
  return (
    <section className="space-y-4">
      <ModuleTitle
        eyebrow="Entregas"
        title="Próximas entregas"
        description="Lista ordenada por fecha, con cliente, horario y acceso rápido al pedido."
      />
      <div className="grid gap-3 lg:grid-cols-2">
        {orders.length > 0 ? (
          orders.map((order) => (
            <OperationalCard
              key={`delivery-${order.id}`}
              order={order}
              onOpenOrder={onOpenOrder}
            />
          ))
        ) : (
          <EmptyModule message="No hay entregas próximas con fecha válida." />
        )}
      </div>
    </section>
  );
}

function OrderFilters({
  query,
  statusFilter,
  paymentFilter,
  onQueryChange,
  onStatusChange,
  onPaymentChange,
}: {
  query: string;
  statusFilter: StatusFilter;
  paymentFilter: PaymentFilter;
  onQueryChange: (query: string) => void;
  onStatusChange: (status: StatusFilter) => void;
  onPaymentChange: (payment: PaymentFilter) => void;
}) {
  return (
    <div className="rounded-xl border border-brand-wine/15 bg-white p-4 shadow-sm">
      <div className="grid gap-3 lg:grid-cols-[minmax(220px,1fr)_180px_180px]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-ink/30" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            className="h-10 w-full rounded-lg border border-brand-wine/15 bg-brand-cream/50 pl-9 pr-3 text-sm font-medium text-brand-ink outline-none transition focus:border-brand-wine/50 focus:bg-white placeholder:text-brand-ink/35"
            placeholder="Buscar pedido, cliente, teléfono o producto"
          />
        </label>
        <SelectFilter
          label="Estado"
          value={statusFilter}
          onChange={(value) => onStatusChange(value as StatusFilter)}
          options={[
            ["all", "Todos"],
            ["pending", "Pendiente"],
            ["approved", "Aprobado"],
            ["cash_pending", "Efectivo pendiente"],
            ["rejected", "Rechazado"],
            ["cancelled", "Cancelado"],
          ]}
        />
        <SelectFilter
          label="Pago"
          value={paymentFilter}
          onChange={(value) => onPaymentChange(value as PaymentFilter)}
          options={[
            ["all", "Todos"],
            ["mercadopago", "Mercado Pago"],
            ["cash_whatsapp", "Efectivo / WhatsApp"],
          ]}
        />
      </div>
    </div>
  );
}

function OrdersList({
  orders,
  selectedOrderId,
  onSelectOrder,
}: {
  orders: OrderRecord[];
  selectedOrderId?: string;
  onSelectOrder: (orderId: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-brand-wine/15 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-brand-wine/8 text-sm">
          <thead className="bg-brand-cream/60 text-left text-[0.6rem] font-bold uppercase tracking-[0.18em] text-brand-wine/70">
            <tr>
              <th className="px-4 py-3">Pedido</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Entrega</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Operación</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-wine/6">
            {orders.map((order) => (
              <tr
                key={order.id}
                className={`align-top transition hover:bg-brand-cream/40 ${
                  selectedOrderId === order.id ? "bg-brand-beige/25" : ""
                }`}
              >
                <td className="px-4 py-4">
                  <button
                    type="button"
                    onClick={() => onSelectOrder(order.id)}
                    className="text-left font-semibold text-brand-wine underline-offset-4 hover:underline"
                  >
                    {order.id}
                  </button>
                  <p className="mt-1 text-xs text-brand-ink/40">
                    {formatDateTime(order.createdAt)}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <p className="font-semibold text-brand-ink">
                    {order.customer.name}
                  </p>
                  <p className="mt-1 text-brand-ink/55">
                    {formatPhone(order.customer.phone)}
                  </p>
                  <p className="mt-1 max-w-[18rem] text-xs leading-5 text-brand-ink/40">
                    {order.customer.address}
                  </p>
                </td>
                <td className="px-4 py-4 text-brand-ink/65">
                  <p className="font-semibold">{formatDeliveryDate(order)}</p>
                  <p className="mt-1 text-xs text-brand-ink/40">
                    {order.deliverySchedule.timeWindow || "Sin horario"}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <p className="font-bold text-brand-ink">
                    {formatMoney(order.total)}
                  </p>
                  <p className="mt-1 text-xs text-brand-ink/40">
                    {paymentMethodLabels[order.paymentMethod]}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <ActionLink
                      href={getWhatsappUrl(order.customer.phone)}
                      label="WhatsApp"
                      icon={<MessageCircle className="h-3.5 w-3.5" />}
                    />
                    <ActionLink
                      href={`tel:${order.customer.phone}`}
                      label="Llamar"
                      icon={<Phone className="h-3.5 w-3.5" />}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {orders.length === 0 ? (
        <div className="border-t border-brand-wine/8 px-6 py-12 text-center text-sm text-brand-ink/50">
          No hay pedidos con esos filtros.
        </div>
      ) : null}
    </div>
  );
}

function OrderDetail({ order }: { order: OrderRecord }) {
  return (
    <div className="rounded-xl border border-brand-wine/15 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-brand-wine">
            Detalle activo
          </p>
          <h2 className="font-heading mt-2 text-xl font-bold text-brand-ink">{order.id}</h2>
        </div>
        <StatusIcon status={order.status} />
      </div>

      <div className="mt-4 grid gap-3 border-y border-brand-wine/10 py-4 text-sm">
        <InfoRow label="Cliente" value={order.customer.name} />
        <InfoRow label="Teléfono" value={formatPhone(order.customer.phone)} />
        <InfoRow
          label="Promos"
          value={order.customer.marketingOptIn ? "Aceptadas" : "No aceptadas"}
        />
        <InfoRow label="Entrega" value={formatDelivery(order)} />
        <InfoRow label="Pago" value={paymentMethodLabels[order.paymentMethod]} />
        <InfoRow label="Total" value={formatMoney(order.total)} strong />
      </div>

      <div className="mt-4">
        <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-brand-wine">
          Productos
        </p>
        <div className="mt-2 space-y-2">
          {order.items.map((item) => (
            <div
              key={`${order.id}-${item.id}-${item.name}`}
              className="rounded-lg bg-brand-cream/50 p-3 text-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold text-brand-ink">{item.name}</p>
                <p className="shrink-0 font-bold text-brand-ink">
                  {formatMoney(item.total)}
                </p>
              </div>
              <p className="mt-1 text-xs font-medium text-brand-ink/45">
                {item.quantity} x {formatMoney(item.unitPrice)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {order.customer.notes ? (
        <div className="mt-4 rounded-lg bg-brand-beige/30 p-3 text-sm leading-6 text-brand-ink/70">
          <p className="font-semibold text-brand-ink">Notas</p>
          <p className="mt-1">{order.customer.notes}</p>
        </div>
      ) : null}

      <div className="mt-4 grid gap-2 text-xs font-semibold text-brand-ink/50">
        <div className="flex items-center justify-between gap-3">
          <span>WhatsApp</span>
          <span>{order.whatsappStatus ?? "pending"}</span>
        </div>
        {order.mercadoPagoPaymentId ? (
          <div className="flex items-center justify-between gap-3">
            <span>ID de pago</span>
            <span className="max-w-[13rem] truncate">
              {order.mercadoPagoPaymentId}
            </span>
          </div>
        ) : null}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <ActionLink
          href={getWhatsappUrl(order.customer.phone)}
          label="WhatsApp"
          icon={<MessageCircle className="h-4 w-4" />}
          large
        />
        <ActionLink
          href={`tel:${order.customer.phone}`}
          label="Llamar"
          icon={<Phone className="h-4 w-4" />}
          large
        />
      </div>
    </div>
  );
}

function OperationalCard({
  order,
  onOpenOrder,
}: {
  order: OrderRecord;
  onOpenOrder: (orderId: string) => void;
}) {
  return (
    <div className="rounded-xl border border-brand-wine/15 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-brand-ink">{order.customer.name}</p>
          <p className="mt-1 text-xs font-medium text-brand-ink/40">
            {order.id}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>
      <div className="mt-4 grid gap-2 text-sm text-brand-ink/65">
        <InfoRow label="Entrega" value={formatDelivery(order)} />
        <InfoRow label="Total" value={formatMoney(order.total)} strong />
        <InfoRow label="Pago" value={paymentMethodLabels[order.paymentMethod]} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onOpenOrder(order.id)}
          className="inline-flex h-9 items-center justify-center rounded-lg border border-brand-wine/20 bg-white px-3 text-sm font-semibold text-brand-wine transition hover:border-brand-wine/40 hover:bg-brand-cream/50"
        >
          Ver pedido
        </button>
        <ActionLink
          href={getWhatsappUrl(order.customer.phone)}
          label="WhatsApp"
          icon={<MessageCircle className="h-3.5 w-3.5" />}
        />
      </div>
    </div>
  );
}

function OrderMiniCard({ order }: { order: OrderRecord }) {
  return (
    <div className="rounded-lg border border-brand-wine/10 bg-brand-cream/50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-brand-ink">{order.customer.name}</p>
          <p className="mt-1 text-xs font-medium text-brand-ink/40">
            {order.id}
          </p>
        </div>
        <p className="shrink-0 font-bold text-brand-ink">
          {formatMoney(order.total)}
        </p>
      </div>
      <p className="mt-3 text-sm font-medium text-brand-ink/45">
        {paymentMethodLabels[order.paymentMethod]}
      </p>
    </div>
  );
}

function ModuleTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-brand-wine">
        {eyebrow}
      </p>
      <h2 className="font-heading mt-2 text-2xl font-bold text-brand-ink">{title}</h2>
      <p className="mt-1 max-w-2xl text-sm leading-6 text-brand-ink/55">
        {description}
      </p>
    </div>
  );
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-brand-wine/12 bg-brand-cream/50 p-4">
      <p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-brand-wine/70">
        {label}
      </p>
      <p className="font-heading mt-2 text-xl font-bold text-brand-ink">{value}</p>
    </div>
  );
}

function ModuleShortcut({
  title,
  description,
  onClick,
}: {
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg border border-brand-wine/15 bg-white p-4 text-left transition hover:border-brand-wine/30 hover:bg-brand-cream/30"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-brand-ink">{title}</p>
          <p className="mt-1 text-sm leading-6 text-brand-ink/55">{description}</p>
        </div>
        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-brand-wine/40" />
      </div>
    </button>
  );
}

function EmptyModule({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-brand-wine/20 bg-white p-8 text-center text-sm font-medium text-brand-ink/50">
      {message}
    </div>
  );
}

function SelectFilter({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
}) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-lg border border-brand-wine/15 bg-brand-cream/50 px-3 text-sm font-medium text-brand-ink/75 outline-none transition focus:border-brand-wine/50 focus:bg-white"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {label}: {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}

function InfoRow({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-brand-ink/45">{label}</span>
      <span
        className={`max-w-[14rem] text-right ${
          strong ? "font-bold text-brand-ink" : "font-medium text-brand-ink/70"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function ActionLink({
  href,
  label,
  icon,
  large,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  large?: boolean;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg border border-brand-wine/20 bg-white font-semibold text-brand-ink/75 transition hover:border-brand-wine/40 hover:bg-brand-cream/40 ${
        large ? "h-10 px-3 text-sm" : "h-9 px-3 text-xs"
      }`}
    >
      {icon}
      {label}
      {href.startsWith("http") ? <ExternalLink className="h-3 w-3" /> : null}
    </a>
  );
}

function StatusBadge({ status }: { status: OrderRecord["status"] }) {
  return (
    <span
      className={`inline-flex rounded-md px-2 py-1 text-xs font-semibold ring-1 ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}

function StatusIcon({ status }: { status: OrderRecord["status"] }) {
  if (status === "approved") {
    return <CheckCircle2 className="h-7 w-7 text-emerald-600" />;
  }

  if (status === "rejected" || status === "cancelled") {
    return <XCircle className="h-7 w-7 text-red-500" />;
  }

  if (status === "cash_pending") {
    return <PackageCheck className="h-7 w-7 text-brand-wine" />;
  }

  return <ClipboardList className="h-7 w-7 text-amber-500" />;
}

function filterOrders(
  orders: OrderRecord[],
  query: string,
  statusFilter: StatusFilter,
  paymentFilter: PaymentFilter,
) {
  const normalizedQuery = normalize(query);

  return orders.filter((order) => {
    const searchableText = normalize(
      [
        order.id,
        order.customer.name,
        order.customer.phone,
        order.customer.address,
        order.customer.postalCode,
        order.status,
        order.paymentMethod,
        order.items.map((item) => item.name).join(" "),
      ].join(" "),
    );
    const matchesQuery =
      normalizedQuery.length === 0 || searchableText.includes(normalizedQuery);
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesPayment =
      paymentFilter === "all" || order.paymentMethod === paymentFilter;

    return matchesQuery && matchesStatus && matchesPayment;
  });
}

function getSummary(orders: OrderRecord[]) {
  const summary = orders.reduce(
    (currentSummary, order) => {
      currentSummary.totalOrders += 1;
      currentSummary.totalRevenue += order.total;

      if (order.status === "approved") {
        currentSummary.approvedOrders += 1;
        currentSummary.approvedRevenue += order.total;
      }

      if (order.status === "pending") {
        currentSummary.pendingOrders += 1;
      }

      if (order.status === "cash_pending") {
        currentSummary.cashPendingOrders += 1;
      }

      return currentSummary;
    },
    {
      totalOrders: 0,
      totalRevenue: 0,
      approvedOrders: 0,
      approvedRevenue: 0,
      pendingOrders: 0,
      cashPendingOrders: 0,
      averageTicket: 0,
      approvalRate: 0,
    },
  );

  summary.averageTicket =
    summary.totalOrders > 0 ? summary.totalRevenue / summary.totalOrders : 0;
  summary.approvalRate =
    summary.totalOrders > 0
      ? Math.round((summary.approvedOrders / summary.totalOrders) * 100)
      : 0;

  return summary;
}

function getDeliveryQueue(orders: OrderRecord[]) {
  return orders
    .filter(
      (order) =>
        order.deliverySchedule.date &&
        order.status !== "cancelled" &&
        order.status !== "rejected",
    )
    .sort(
      (first, second) =>
        new Date(`${first.deliverySchedule.date}T00:00:00`).getTime() -
        new Date(`${second.deliverySchedule.date}T00:00:00`).getTime(),
    )
    .slice(0, 8);
}

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Fecha no disponible";
  }

  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatDelivery(order: OrderRecord) {
  const date = formatDeliveryDate(order);

  return order.deliverySchedule.timeWindow
    ? `${date}, ${order.deliverySchedule.timeWindow}`
    : date;
}

function formatDeliveryDate(order: OrderRecord) {
  if (!order.deliverySchedule.date) {
    return "Sin fecha";
  }

  const deliveryDate = new Date(`${order.deliverySchedule.date}T00:00:00`);

  if (Number.isNaN(deliveryDate.getTime())) {
    return "Fecha inválida";
  }

  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
  }).format(deliveryDate);
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPhone(phone: string) {
  const digits = String(phone ?? "").replace(/\D/g, "");

  if (digits.length === 10) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }

  return phone || "Sin teléfono";
}

function getWhatsappUrl(phone: string) {
  const digits = String(phone ?? "").replace(/\D/g, "");
  const mexicoPhone = digits.length === 10 ? `52${digits}` : digits;

  return `https://wa.me/${mexicoPhone}`;
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

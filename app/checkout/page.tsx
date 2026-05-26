"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import {
  ArrowLeft,
  Loader2,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { DeliveryCalendar } from "@/components/checkout/DeliveryCalendar";
import { GiftOrderForm } from "@/components/gifts/GiftOrderForm";
import { MercadoPagoPaymentBrick } from "@/components/payments/MercadoPagoPaymentBrick";
import { PaymentStatusNotice } from "@/components/payments/PaymentStatusNotice";
import { getCartTotals, useCartStore } from "@/store/cart-store";
import type { PaymentStatusKind } from "@/components/payments/PaymentStatusNotice";
import type { OrderCustomer, OrderDeliverySchedule } from "@/types/order";

type CheckoutAction = "cash" | null;
type CustomerTextField = Exclude<keyof OrderCustomer, "marketingOptIn">;

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const giftDetails = useCartStore((state) => state.giftDetails);
  const clearGiftDetails = useCartStore((state) => state.clearGiftDetails);
  const { totalItems, subtotal } = getCartTotals(items);
  const hasCustomItems = items.some((item) => item.customRecipe);
  const [customer, setCustomer] = useState<OrderCustomer>({
    name: "",
    phone: "",
    address: "",
    postalCode: "",
    notes: "",
    marketingOptIn: false,
  });
  const [deliverySchedule, setDeliverySchedule] =
    useState<OrderDeliverySchedule>({
      date: "",
      timeWindow: "",
  });
  const [loadingAction, setLoadingAction] = useState<CheckoutAction>(null);
  const [error, setError] = useState("");

  const checkoutItems = useMemo(
    () =>
      items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        name: item.name,
        unitPrice: item.price,
        customRecipe: item.customRecipe,
      })),
    [items],
  );
  const paymentReady =
    subtotal > 0 &&
    !hasCustomItems &&
    canCreateOrder(customer, deliverySchedule);
  const giftNote = useMemo(() => {
    if (!giftDetails) {
      return "";
    }

    return [
      "Pedido para regalo",
      `Ocasión: ${giftDetails.otherOccasion || giftDetails.occasion}`,
      giftDetails.message ? `Dedicatoria: ${giftDetails.message}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }, [giftDetails]);
  const checkoutCustomer = useMemo<OrderCustomer>(
    () => ({
      ...customer,
      notes: [customer.notes, giftNote].filter(Boolean).join("\n\n"),
    }),
    [customer, giftNote],
  );

  const updateCustomer = (field: CustomerTextField, value: string) => {
    setCustomer((current) => ({
      ...current,
      [field]: field === "postalCode" ? value.replace(/\D/g, "") : value,
    }));
  };

  const updateMarketingOptIn = (value: boolean) => {
    setCustomer((current) => ({
      ...current,
      marketingOptIn: value,
    }));
  };

  const updateDeliverySchedule = (
    field: keyof OrderDeliverySchedule,
    value: string,
  ) => {
    setDeliverySchedule((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleMercadoPagoPaid = useCallback((status: PaymentStatusKind) => {
    if (status === "approved") {
      clearCart();
    }
  }, [clearCart]);

  const handleMercadoPagoError = useCallback((message: string) => {
    setError(message);
  }, []);

  const createCashOrder = async () => {
    setError("");

    if (!canCreateOrder(customer, deliverySchedule)) {
      setError(
        "Completa dirección, código postal, fecha y horario de entrega.",
      );
      return;
    }

    setLoadingAction("cash");

    try {
      const response = await fetch("/api/orders/cash", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: checkoutItems,
          customer: checkoutCustomer,
          deliverySchedule,
        }),
      });
      const data = (await response.json()) as {
        whatsappUrl?: string;
        error?: string;
      };

      if (!response.ok || !data.whatsappUrl) {
        throw new Error(data.error ?? "No se pudo crear el pedido.");
      }

      clearCart();
      window.location.href = data.whatsappUrl;
    } catch (currentError) {
      setError(
        currentError instanceof Error
          ? currentError.message
          : "No se pudo crear el pedido.",
      );
      setLoadingAction(null);
    }
  };

  return (
    <main className="bg-brand-cream">
      <section className="mx-auto min-h-[calc(100svh-105px)] max-w-5xl px-4 py-8 md:min-h-[calc(100vh-73px)] md:py-16">
        <Link
          href="/productos"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-neutral-950 md:mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a productos
        </Link>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="rounded-lg border bg-white p-4 shadow-sm md:p-7">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-red md:text-sm md:tracking-[0.24em]">
              Checkout
            </p>
            <h1 className="mt-3 text-3xl font-black leading-tight text-neutral-950 md:text-5xl">
              Revisa tu pedido
            </h1>
            <div className="mt-6 grid gap-4 rounded-lg border bg-brand-cream p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold text-neutral-700">
                  Nombre
                  <input
                    value={customer.name}
                    onChange={(event) =>
                      updateCustomer("name", event.target.value)
                    }
                    className="h-12 rounded-lg border bg-white px-3 text-base font-normal text-neutral-950 outline-none focus:border-neutral-950 md:h-11 md:text-sm"
                    autoComplete="name"
                    placeholder="Tu nombre"
                  />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-neutral-700">
                  WhatsApp
                  <input
                    value={customer.phone}
                    onChange={(event) =>
                      updateCustomer("phone", event.target.value)
                    }
                    className="h-12 rounded-lg border bg-white px-3 text-base font-normal text-neutral-950 outline-none focus:border-neutral-950 md:h-11 md:text-sm"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="9991234567"
                  />
                </label>
              </div>
              <div className="grid items-start gap-4 sm:grid-cols-[1fr_150px]">
                <label className="grid gap-2 text-sm font-semibold text-neutral-700">
                  Dirección
                  <textarea
                    value={customer.address}
                    onChange={(event) =>
                      updateCustomer("address", event.target.value)
                    }
                    className="min-h-28 resize-y rounded-lg border bg-white px-3 py-3 text-base font-normal text-neutral-950 outline-none focus:border-neutral-950 md:min-h-24 md:text-sm"
                    autoComplete="street-address"
                    placeholder="Calle, número, colonia y referencias"
                  />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-neutral-700">
                  Código postal
                  <input
                    value={customer.postalCode}
                    onChange={(event) =>
                      updateCustomer("postalCode", event.target.value)
                    }
                    className="h-12 w-full rounded-lg border bg-white px-3 text-base font-normal text-neutral-950 outline-none focus:border-neutral-950 md:h-11 md:text-sm"
                    type="text"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    maxLength={5}
                    placeholder="97000"
                  />
                </label>
              </div>
              <label className="grid gap-2 text-sm font-semibold text-neutral-700">
                Notas adicionales
                <textarea
                  value={customer.notes}
                  onChange={(event) =>
                    updateCustomer("notes", event.target.value)
                  }
                  className="min-h-28 resize-y rounded-lg border bg-white px-3 py-3 text-base font-normal text-neutral-950 outline-none focus:border-neutral-950 md:min-h-24 md:text-sm"
                  placeholder="Instrucciones especiales o detalles del pedido"
                />
              </label>
              <label className="flex items-start gap-3 rounded-lg border bg-white px-3 py-3 text-sm text-neutral-700">
                <input
                  type="checkbox"
                  checked={Boolean(customer.marketingOptIn)}
                  onChange={(event) =>
                    updateMarketingOptIn(event.target.checked)
                  }
                  className="mt-1 h-4 w-4 accent-brand-red"
                />
                <span>
                  <span className="font-black text-neutral-950">
                    Quiero recibir promociones por WhatsApp.
                  </span>{" "}
                  <span className="leading-6 text-neutral-600">
                    Usaremos tu número solo para novedades y ofertas de Fresh
                    Bloom.
                  </span>
                </span>
              </label>
              <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
                <div className="grid gap-2 text-sm font-semibold text-neutral-700">
                  <p>Fecha de entrega</p>
                  <DeliveryCalendar
                    value={deliverySchedule.date}
                    onChange={(date) => updateDeliverySchedule("date", date)}
                  />
                </div>
                <label className="grid gap-2 text-sm font-semibold text-neutral-700">
                  Horario de entrega
                  <select
                    value={deliverySchedule.timeWindow}
                    onChange={(event) =>
                      updateDeliverySchedule("timeWindow", event.target.value)
                    }
                    className="h-12 rounded-lg border bg-white px-3 text-base font-normal text-neutral-950 outline-none focus:border-neutral-950 md:h-11 md:text-sm"
                    required
                  >
                    <option value="" disabled>
                      Selecciona un horario
                    </option>
                    <option value="10:00 AM - 12:00 PM">
                      10:00 AM - 12:00 PM
                    </option>
                    <option value="12:00 PM - 2:00 PM">
                      12:00 PM - 2:00 PM
                    </option>
                    <option value="2:00 PM - 5:00 PM">
                      2:00 PM - 5:00 PM
                    </option>
                    <option value="5:00 PM - 8:00 PM">
                      5:00 PM - 8:00 PM
                    </option>
                  </select>
                </label>
              </div>
              {giftDetails ? (
                <div className="rounded-lg border border-brand-wine/15 bg-white px-4 py-3 text-sm text-neutral-700">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-black text-neutral-950">
                      Este pedido va como regalo
                    </p>
                    <button
                      type="button"
                      className="text-xs font-semibold text-neutral-500 hover:text-neutral-950"
                      onClick={clearGiftDetails}
                    >
                      Quitar regalo
                    </button>
                  </div>
                  <p className="mt-2">
                    Ocasión:{" "}
                    <span className="font-semibold">
                      {giftDetails.otherOccasion || giftDetails.occasion}
                    </span>
                  </p>
                  {giftDetails.message ? (
                    <p className="mt-2 leading-6">
                      Dedicatoria: “{giftDetails.message}”
                    </p>
                  ) : null}
                </div>
              ) : (
                <GiftOrderForm
                  buttonLabel="Hazlo regalo"
                  className="mt-0"
                  compact
                  scrollTargetId=""
                />
              )}
            </div>

            {items.length > 0 ? (
              <div className="mt-7 grid gap-3">
                {items.map((item) => (
                  <article
                    key={item.id}
                    className="grid gap-4 rounded-lg border p-4 sm:grid-cols-[1fr_auto] sm:items-center"
                  >
                    <div>
                      <h2 className="font-black text-neutral-950">
                        {item.name}
                      </h2>
                      <p className="mt-1 text-sm text-neutral-600">
                        {item.price > 0
                          ? `$${item.price.toLocaleString("es-MX")} MXN`
                          : "Precio por confirmar"}
                      </p>
                      {item.customRecipe ? (
                        <p className="mt-2 text-xs leading-5 text-neutral-500">
                          {item.customRecipe.ingredients.join(", ")}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div className="inline-flex items-center rounded-lg border bg-white">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="size-10 sm:size-7"
                          aria-label={`Restar ${item.name}`}
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-10 text-center text-sm font-bold">
                          {item.quantity}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="size-10 sm:size-7"
                          aria-label={`Sumar ${item.name}`}
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="min-w-20 text-right">
                        <p className="font-black text-neutral-950">
                          {item.price > 0
                            ? `$${(item.price * item.quantity).toLocaleString("es-MX")}`
                            : "Por confirmar"}
                        </p>
                        <button
                          type="button"
                          className="mt-1 text-xs font-semibold text-neutral-500 hover:text-neutral-950"
                          onClick={() => removeItem(item.id)}
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-lg border border-dashed bg-brand-cream px-6 py-12 text-center">
                <ShoppingBag className="mx-auto h-10 w-10 text-brand-red" />
                <h2 className="mt-4 text-2xl font-black text-neutral-950">
                  Todavía no hay flores
                </h2>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-neutral-600">
                  Ve al catálogo, agrega tus arreglos y aquí aparecerá el resumen
                  para confirmar.
                </p>
                <Button asChild className="mt-6 h-12 md:h-11">
                  <Link href="/productos">Ver catálogo</Link>
                </Button>
              </div>
            )}
          </section>

          <aside className="h-fit rounded-lg border bg-white p-4 shadow-sm md:p-6">
            <h2 className="text-xl font-black text-neutral-950">Resumen</h2>
            <div className="mt-5 grid gap-3 border-b pb-5 text-sm text-neutral-600">
              <div className="flex justify-between">
                <span>Piezas</span>
                <span>{totalItems}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>
                  {subtotal > 0
                    ? `$${subtotal.toLocaleString("es-MX")} MXN`
                    : "Por confirmar"}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Entrega</span>
                <span className="text-right">
                  {deliverySchedule.date
                    ? formatDeliveryDate(deliverySchedule)
                    : "Por agendar"}
                </span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between text-lg font-black text-neutral-950">
              <span>Total</span>
              <span>
                {subtotal > 0
                  ? `$${subtotal.toLocaleString("es-MX")} MXN`
                  : "Por confirmar"}
              </span>
            </div>

            <div className="mt-6 grid gap-3">
              {!hasCustomItems && subtotal > 0 ? (
                <MercadoPagoPaymentBrick
                  amount={subtotal}
                  items={checkoutItems}
                  customer={checkoutCustomer}
                  deliverySchedule={deliverySchedule}
                  disabled={!paymentReady || loadingAction !== null}
                  onPaid={handleMercadoPagoPaid}
                  onError={handleMercadoPagoError}
                />
              ) : (
                <PaymentStatusNotice
                  status="idle"
                  message="Los ramos personalizados se confirman por WhatsApp antes de pagar."
                />
              )}
              <Button
                type="button"
                variant="outline"
                className="h-12 md:h-11"
                disabled={
                  items.length === 0 ||
                  loadingAction !== null ||
                  !canCreateOrder(customer, deliverySchedule)
                }
                onClick={createCashOrder}
              >
                {loadingAction === "cash" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MessageCircle className="h-4 w-4" />
                )}
                Pagar en efectivo
              </Button>
              <Button asChild variant="outline" className="h-12 md:h-11">
                <Link href="/productos">Seguir viendo flores</Link>
              </Button>
              {items.length > 0 ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="h-10"
                  onClick={clearCart}
                >
                  Vaciar carrito
                </Button>
              ) : null}
              {error ? (
                <PaymentStatusNotice status="error" message={error} />
              ) : null}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function formatDeliveryDate(schedule: OrderDeliverySchedule) {
  const date = new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
  }).format(new Date(`${schedule.date}T00:00:00`));

  return schedule.timeWindow ? `${date}, ${schedule.timeWindow}` : date;
}

function canCreateOrder(
  customer: OrderCustomer,
  deliverySchedule: OrderDeliverySchedule,
) {
  return Boolean(
    customer.name.trim() &&
      customer.phone.trim() &&
      customer.address.trim() &&
      customer.postalCode.trim().length === 5 &&
      deliverySchedule.date &&
      deliverySchedule.timeWindow,
  );
}

"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { PaymentStatusDialog } from "@/components/payments/PaymentStatusDialog";
import {
  normalizePaymentStatus,
  PaymentStatusNotice,
  type PaymentStatusKind,
} from "@/components/payments/PaymentStatusNotice";
import type {
  CheckoutCartItem,
  OrderCustomer,
  OrderDeliverySchedule,
} from "@/types/order";

type MercadoPagoPaymentBrickProps = {
  amount: number;
  items: CheckoutCartItem[];
  customer: OrderCustomer;
  deliverySchedule: OrderDeliverySchedule;
  disabled?: boolean;
  onPaid?: (status: PaymentStatusKind) => void;
  onError?: (message: string) => void;
};

type MercadoPagoSubmitPayload = {
  selectedPaymentMethod?: string;
  formData?: Record<string, unknown>;
};

declare global {
  interface Window {
    MercadoPago?: new (
      publicKey: string,
      options?: { locale?: string },
    ) => {
      bricks: () => {
        create: (
          brick: "payment",
          containerId: string,
          settings: Record<string, unknown>,
        ) => Promise<{ unmount?: () => void }>;
      };
    };
  }
}

export function MercadoPagoPaymentBrick({
  amount,
  items,
  customer,
  deliverySchedule,
  disabled,
  onPaid,
  onError,
}: MercadoPagoPaymentBrickProps) {
  const reactId = useId();
  const containerId = `payment-brick-${reactId.replace(/:/g, "")}`;
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [paymentStatus, setPaymentStatus] =
    useState<PaymentStatusKind>("idle");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [orderId, setOrderId] = useState("");
  const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY;
  const serializedItems = useMemo(() => JSON.stringify(items), [items]);
  const serializedCustomer = useMemo(
    () => JSON.stringify(customer),
    [customer],
  );
  const serializedDeliverySchedule = useMemo(
    () => JSON.stringify(deliverySchedule),
    [deliverySchedule],
  );

  useEffect(() => {
    let cancelled = false;
    let controller: { unmount?: () => void } | undefined;

    const renderBrick = async () => {
      setMessage("");
      setPaymentStatus("idle");
      setDialogOpen(false);
      setOrderId("");

      if (disabled) {
        setLoading(false);
        return;
      }

      if (!publicKey) {
        setLoading(false);
        setMessage("Falta NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY.");
        setPaymentStatus("error");
        return;
      }

      setLoading(true);
      await loadMercadoPagoSdk();

      if (!window.MercadoPago || cancelled) {
        return;
      }

      const mp = new window.MercadoPago(publicKey, { locale: "es-MX" });
      const bricksBuilder = mp.bricks();

      controller = await bricksBuilder.create("payment", containerId, {
        initialization: {
          amount,
        },
        customization: {
          paymentMethods: {
            creditCard: "all",
            debitCard: "all",
            ticket: "all",
            bankTransfer: "all",
            maxInstallments: 12,
          },
          visual: {
            style: {
              theme: "default",
            },
          },
        },
        callbacks: {
          onReady: () => {
            if (!cancelled) {
              setLoading(false);
            }
          },
          onSubmit: (payload: MercadoPagoSubmitPayload) =>
            submitPayment(payload, {
              items,
              customer,
              deliverySchedule,
              onPaid,
              onError,
              setMessage,
              setPaymentStatus,
              setDialogOpen,
              setOrderId,
            }),
          onError: (error: unknown) => {
            const errorMessage =
              error instanceof Error
                ? error.message
                : "Mercado Pago no pudo cargar el formulario.";
            setMessage(errorMessage);
            setPaymentStatus("error");
            setDialogOpen(true);
            onError?.(errorMessage);
          },
        },
      });
    };

    renderBrick().catch((error) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "No se pudo cargar Mercado Pago.";
      setLoading(false);
      setMessage(errorMessage);
      setPaymentStatus("error");
      setDialogOpen(true);
      onError?.(errorMessage);
    });

    return () => {
      cancelled = true;
      controller?.unmount?.();
    };
  }, [
    amount,
    containerId,
    customer,
    deliverySchedule,
    disabled,
    items,
    onError,
    onPaid,
    publicKey,
    serializedCustomer,
    serializedDeliverySchedule,
    serializedItems,
  ]);

  return (
    <div className="rounded-lg border bg-white p-3">
      {disabled ? (
        <p className="text-sm leading-6 text-neutral-600">
          Completa tus datos, fecha y horario para activar Mercado Pago.
        </p>
      ) : null}
      {loading ? (
        <div className="flex items-center gap-2 py-3 text-sm font-semibold text-neutral-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          Cargando Mercado Pago
        </div>
      ) : null}
      <div
        id={containerId}
        className={cn(disabled ? "hidden" : "min-h-20")}
      />
      {paymentStatus !== "idle" ? (
        <PaymentStatusNotice
          status={paymentStatus}
          message={message || undefined}
          className="mt-3"
        />
      ) : null}
      <PaymentStatusDialog
        open={dialogOpen}
        status={paymentStatus}
        message={message || undefined}
        orderId={orderId || undefined}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}

function loadMercadoPagoSdk() {
  if (window.MercadoPago) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://sdk.mercadopago.com/js/v2"]',
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://sdk.mercadopago.com/js/v2";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("No se pudo cargar el SDK de Mercado Pago."));
    document.body.appendChild(script);
  });
}

async function submitPayment(
  payload: MercadoPagoSubmitPayload,
  options: {
    items: CheckoutCartItem[];
    customer: OrderCustomer;
    deliverySchedule: OrderDeliverySchedule;
    onPaid?: (status: PaymentStatusKind) => void;
    onError?: (message: string) => void;
    setMessage: (message: string) => void;
    setPaymentStatus: (status: PaymentStatusKind) => void;
    setDialogOpen: (open: boolean) => void;
    setOrderId: (orderId: string) => void;
  },
) {
  const paymentData = payload.formData ?? payload;
  const response = await fetch("/api/mercadopago/payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: options.items,
      customer: options.customer,
      deliverySchedule: options.deliverySchedule,
      paymentData,
    }),
  });
  const data = (await response.json()) as {
    orderId?: string;
    status?: string;
    statusDetail?: string;
    error?: string;
  };

  if (!response.ok) {
    const errorMessage = data.error ?? "No se pudo procesar el pago.";
    options.setMessage(errorMessage);
    options.setPaymentStatus("error");
    options.setDialogOpen(true);
    options.onError?.(errorMessage);
    throw new Error(errorMessage);
  }

  const normalizedStatus = normalizePaymentStatus(data.status);
  options.setPaymentStatus(normalizedStatus);
  options.setOrderId(normalizedStatus === "approved" ? data.orderId ?? "" : "");
  options.setDialogOpen(true);

  if (normalizedStatus === "approved") {
    options.setMessage("");
    options.onPaid?.(normalizedStatus);
    return data;
  }

  options.setMessage(
    normalizedStatus === "pending" || normalizedStatus === "in_process"
      ? "Tu pedido no queda confirmado hasta que Mercado Pago apruebe el cobro. Conserva tu carrito por si necesitas intentar de nuevo."
      : "",
  );
  return data;
}

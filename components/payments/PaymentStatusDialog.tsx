"use client";

import Link from "next/link";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  getPaymentStatusContent,
  type PaymentStatusKind,
} from "@/components/payments/PaymentStatusNotice";
import { cn } from "@/lib/utils";

type PaymentStatusDialogProps = {
  open: boolean;
  status: PaymentStatusKind;
  message?: string;
  orderId?: string;
  onOpenChange: (open: boolean) => void;
};

export function PaymentStatusDialog({
  open,
  status,
  message,
  orderId,
  onOpenChange,
}: PaymentStatusDialogProps) {
  if (!open || status === "idle") {
    return null;
  }

  const content = getPaymentStatusContent(status);
  const Icon = content.icon;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-status-title"
    >
      <button
        type="button"
        aria-label="Cerrar estado de pago"
        className="absolute inset-0 bg-neutral-950/45 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      <div className="relative w-full max-w-md rounded-lg border bg-white p-5 text-center shadow-2xl md:p-6">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Cerrar"
          className="absolute right-3 top-3"
          onClick={() => onOpenChange(false)}
        >
          <X className="h-4 w-4" />
        </Button>

        <div
          className={cn(
            "mx-auto flex h-14 w-14 items-center justify-center rounded-full border",
            content.className,
          )}
        >
          <Icon className={cn("h-7 w-7", content.iconClassName)} />
        </div>

        <h2
          id="payment-status-title"
          className="mt-5 text-2xl font-black text-neutral-950"
        >
          {content.title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-neutral-600">
          {message || content.message}
        </p>

        {orderId ? (
          <p className="mt-4 rounded-lg bg-brand-cream px-3 py-2 text-sm font-bold text-neutral-700">
            Pedido {orderId}
          </p>
        ) : null}

        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          <Button
            type="button"
            className="h-11"
            onClick={() => onOpenChange(false)}
          >
            Entendido
          </Button>
          <Button asChild variant="outline" className="h-11">
            <Link href="/productos">Ver catálogo</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

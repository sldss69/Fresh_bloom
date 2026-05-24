import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Info,
  XCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";

export type PaymentStatusKind =
  | "approved"
  | "pending"
  | "in_process"
  | "rejected"
  | "cancelled"
  | "error"
  | "idle";

type PaymentStatusNoticeProps = {
  status: PaymentStatusKind;
  title?: string;
  message?: string;
  className?: string;
};

export const paymentStatusContent: Record<
  PaymentStatusKind,
  {
    title: string;
    message: string;
    icon: typeof CheckCircle2;
    className: string;
    iconClassName: string;
  }
> = {
  approved: {
    title: "Pago aprobado",
    message:
      "Recibimos tu pago correctamente. Te enviaremos el seguimiento de tu pedido por WhatsApp.",
    icon: CheckCircle2,
    className: "border-emerald-200 bg-emerald-50 text-emerald-950",
    iconClassName: "text-emerald-700",
  },
  pending: {
    title: "Pago pendiente",
    message:
      "El pedido no queda confirmado hasta que Mercado Pago apruebe el cobro.",
    icon: Clock3,
    className: "border-amber-200 bg-amber-50 text-amber-950",
    iconClassName: "text-amber-700",
  },
  in_process: {
    title: "Pago en proceso",
    message:
      "Mercado Pago está procesando la operación. El pedido se confirma cuando el cobro quede aprobado.",
    icon: Clock3,
    className: "border-sky-200 bg-sky-50 text-sky-950",
    iconClassName: "text-sky-700",
  },
  rejected: {
    title: "Pago rechazado",
    message:
      "Mercado Pago no pudo aprobar el pago. Intenta con otro método o elige pago en efectivo por WhatsApp.",
    icon: XCircle,
    className: "border-red-200 bg-red-50 text-red-950",
    iconClassName: "text-red-700",
  },
  cancelled: {
    title: "Pago cancelado",
    message:
      "La operación fue cancelada. Puedes intentarlo de nuevo cuando quieras.",
    icon: AlertCircle,
    className: "border-neutral-200 bg-neutral-50 text-neutral-950",
    iconClassName: "text-neutral-700",
  },
  error: {
    title: "No pudimos procesar el pago",
    message:
      "Hubo un problema al conectar con Mercado Pago. Revisa los datos e intenta otra vez.",
    icon: AlertCircle,
    className: "border-red-200 bg-red-50 text-red-950",
    iconClassName: "text-red-700",
  },
  idle: {
    title: "Listo para pagar",
    message:
      "Completa tus datos y selecciona un método de pago para finalizar tu pedido.",
    icon: Info,
    className: "border-neutral-200 bg-white text-neutral-700",
    iconClassName: "text-neutral-500",
  },
};

export function PaymentStatusNotice({
  status,
  title,
  message,
  className,
}: PaymentStatusNoticeProps) {
  const content = paymentStatusContent[status];
  const Icon = content.icon;

  return (
    <div
      className={cn(
        "flex gap-3 rounded-lg border px-4 py-3 text-left shadow-sm",
        content.className,
        className,
      )}
    >
      <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", content.iconClassName)} />
      <div>
        <p className="text-sm font-black">{title ?? content.title}</p>
        <p className="mt-1 text-sm leading-6 opacity-80">
          {message ?? content.message}
        </p>
      </div>
    </div>
  );
}

export function normalizePaymentStatus(
  status?: string | string[] | null,
): PaymentStatusKind {
  const value = Array.isArray(status) ? status[0] : status;

  if (value === "approved") {
    return "approved";
  }

  if (value === "pending") {
    return "pending";
  }

  if (value === "in_process") {
    return "in_process";
  }

  if (value === "rejected") {
    return "rejected";
  }

  if (value === "cancelled" || value === "failure") {
    return "cancelled";
  }

  if (value === "error") {
    return "error";
  }

  if (value === "success") {
    return "approved";
  }

  return "idle";
}

export function getPaymentStatusContent(status: PaymentStatusKind) {
  return paymentStatusContent[status];
}

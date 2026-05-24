import Link from "next/link";
import { CheckCircle2, Clock3, XCircle } from "lucide-react";

import {
  normalizePaymentStatus,
  PaymentStatusNotice,
} from "@/components/payments/PaymentStatusNotice";
import { Button } from "@/components/ui/button";

type ConfirmationPageProps = {
  searchParams: Promise<{
    order?: string;
    status?: string;
    payment_id?: string;
    collection_status?: string;
  }>;
};

const confirmationCopy = {
  approved: {
    icon: CheckCircle2,
    iconClassName: "text-emerald-700",
    eyebrow: "Pago confirmado",
    title: "Pedido recibido",
    description:
      "Tu pago fue aprobado. Te enviaremos el seguimiento de tu pedido por WhatsApp.",
  },
  pending: {
    icon: Clock3,
    iconClassName: "text-amber-700",
    eyebrow: "Pago pendiente",
    title: "Estamos revisando tu pago",
    description:
      "Mercado Pago está confirmando la operación. Te avisaremos en cuanto el pago quede aprobado.",
  },
  in_process: {
    icon: Clock3,
    iconClassName: "text-sky-700",
    eyebrow: "Pago en proceso",
    title: "Tu pago se está procesando",
    description:
      "No necesitas repetir el pago. Te contactaremos cuando Mercado Pago confirme el resultado.",
  },
  rejected: {
    icon: XCircle,
    iconClassName: "text-red-700",
    eyebrow: "Pago rechazado",
    title: "No pudimos confirmar el pago",
    description:
      "Puedes intentar con otro método o volver al checkout para elegir pago en efectivo por WhatsApp.",
  },
  cancelled: {
    icon: XCircle,
    iconClassName: "text-neutral-700",
    eyebrow: "Pago cancelado",
    title: "Operación cancelada",
    description:
      "Tu pedido no se completó. Puedes volver al catálogo y retomarlo cuando quieras.",
  },
  error: {
    icon: XCircle,
    iconClassName: "text-red-700",
    eyebrow: "Error de pago",
    title: "Algo salió mal",
    description:
      "No pudimos confirmar la operación. Intenta nuevamente o escríbenos por WhatsApp.",
  },
  idle: {
    icon: CheckCircle2,
    iconClassName: "text-emerald-700",
    eyebrow: "Pedido",
    title: "Pedido recibido",
    description:
      "Recibimos la solicitud. Te enviaremos el seguimiento de tu pedido por WhatsApp.",
  },
};

export default async function ConfirmationPage({
  searchParams,
}: ConfirmationPageProps) {
  const params = await searchParams;
  const status = normalizePaymentStatus(
    params.collection_status ?? params.status,
  );
  const copy = confirmationCopy[status];
  const Icon = copy.icon;

  return (
    <main className="bg-brand-cream">
      <section className="mx-auto flex min-h-[calc(100vh-73px)] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center">
        <div className="rounded-lg border bg-white p-6 shadow-sm md:p-8">
          <Icon className={`mx-auto h-14 w-14 ${copy.iconClassName}`} />
          <p className="mt-5 text-sm font-bold uppercase tracking-[0.24em] text-brand-red">
            {copy.eyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-black text-neutral-950">
            {copy.title}
          </h1>
          <p className="mx-auto mt-4 max-w-md leading-7 text-neutral-600">
            {copy.description}
          </p>

          <PaymentStatusNotice status={status} className="mt-6" />

          {params.order ? (
            <p className="mt-4 text-sm font-semibold text-neutral-500">
              Pedido {params.order}
            </p>
          ) : null}

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Button asChild className="h-11">
              <Link href="/productos">Volver al catálogo</Link>
            </Button>
            <Button asChild variant="outline" className="h-11">
              <Link href="/checkout">Ir a checkout</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

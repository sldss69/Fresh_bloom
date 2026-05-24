"use client";

import Link from "next/link";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="mx-auto grid min-h-[80vh] max-w-6xl items-center gap-10 px-4 py-20 md:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <p className="mb-4 text-sm font-medium uppercase tracking-wide text-brand-red">
          Arreglos florales - pedidos en línea
        </p>
        <h1 className="mb-6 text-4xl font-bold tracking-tight text-brand-wine md:text-6xl">
          Flores con pago en línea y seguimiento por WhatsApp
        </h1>
        <p className="mb-8 text-lg text-brand-ink/70">
          Compra ramos, arreglos y regalos personalizados con confirmación de
          entrega.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/productos">Ver productos</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/checkout">Hacer pedido</Link>
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="rounded-lg border bg-white/75 p-8 shadow-sm"
      >
        <div className="rounded-lg bg-brand-cream p-6 shadow-sm">
          <p className="mb-2 text-sm text-brand-green">Pedido inteligente</p>
          <h2 className="mb-4 text-2xl font-semibold text-brand-wine">
            Pago + WhatsApp
          </h2>
          <p className="text-brand-ink/70">
            El flujo conserva carrito, pago, entrega y mensajes para que el
            cliente reciba seguimiento sin esperas.
          </p>
        </div>
      </motion.div>
    </section>
  );
}

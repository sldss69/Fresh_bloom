import type { Metadata } from "next";
import Image from "next/image";
import { ArrowDown, Sparkles } from "lucide-react";

import { FreshBloomLogo } from "@/components/brand/FreshBloomLogo";
import { CustomCookieBuilder } from "@/components/custom-cookie/CustomCookieBuilder";

export const metadata: Metadata = {
  title: "Arma tu ramo | Fresh Bloom",
  description:
    "Crea un ramo personalizado eligiendo flores, follaje y presentación.",
};

export default function CreateBouquetPage() {
  return (
    <main className="bg-brand-cream">
      <section className="relative overflow-hidden border-b border-brand-wine/15">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#EDE7DE_0%,#DCCBB3_48%,#8EA68A_120%)]" />
        <div className="absolute inset-0 opacity-45 [background-image:linear-gradient(90deg,rgba(142,166,138,0.18)_1px,transparent_1px)] [background-size:4rem_100%]" />

        <div className="relative mx-auto grid min-h-[calc(100svh-105px)] max-w-6xl items-center gap-8 px-4 py-10 md:min-h-[calc(100vh-73px)] md:py-16 xl:grid-cols-[1fr_0.62fr]">
          <div className="max-w-2xl">
            <FreshBloomLogo className="mb-7" />
            <p className="mb-4 inline-flex items-center gap-2 font-display text-xs uppercase tracking-[0.24em] text-brand-red md:text-sm">
              <Sparkles className="h-4 w-4" />
              Personaliza tu detalle
            </p>
            <h1 className="text-5xl font-semibold leading-none text-brand-wine sm:text-6xl md:text-8xl">
              Arma tu ramo
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-brand-ink/75 md:text-lg">
              Elige flor principal, complemento, follaje y presentación. Lo
              agregamos al pedido como ramo personalizado para confirmar por
              WhatsApp.
            </p>
            <a
              href="#constructor"
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-lg bg-brand-wine px-5 text-sm font-semibold text-brand-cream transition hover:bg-brand-red"
            >
              Empezar
              <ArrowDown className="h-4 w-4" />
            </a>
          </div>

          <div className="relative mx-auto hidden aspect-square w-full max-w-sm overflow-hidden rounded-lg border border-white/75 bg-white/75 p-3 shadow-2xl shadow-brand-wine/15 xl:block">
            <Image
              src="/images/products/aura-floral.jpg"
              alt="Ramo personalizado Fresh Bloom"
              width={620}
              height={620}
              priority
              className="h-full w-full rounded-md object-cover"
            />
          </div>
        </div>
      </section>

      <section id="constructor" className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <div className="mb-8 max-w-2xl">
          <p className="font-display text-sm uppercase tracking-[0.24em] text-brand-red">
            Personalización
          </p>
          <h2 className="mt-2 text-4xl font-semibold text-brand-wine md:text-5xl">
            Elige la combinación
          </h2>
          <p className="mt-4 text-sm leading-6 text-brand-ink/70">
            Escoge una opción de cada categoría para crear un arreglo con tu
            estilo.
          </p>
        </div>

        <CustomCookieBuilder />
      </section>
    </main>
  );
}

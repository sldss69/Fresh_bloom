import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Flower2,
  Heart,
  MapPin,
  MessageCircle,
  Plus,
  Scissors,
  SlidersHorizontal,
  Sparkles,
  Truck,
} from "lucide-react";

import { CustomCookieBuilder } from "@/components/custom-cookie/CustomCookieBuilder";

export const metadata: Metadata = {
  title: "Arma tu ramo | Fresh Bloom",
  description:
    "Crea un ramo personalizado eligiendo flores, colores, envoltura y detalles especiales. Hecho a mano en Mérida.",
};

// ─── Datos del hero / proceso ─────────────────────────────────────────────────

const heroBadges = [
  { icon: Truck,    label: "Entrega el mismo día" },
  { icon: Flower2,  label: "Flores frescas"       },
  { icon: MapPin,   label: "Hecho en Mérida"      },
  { icon: Sparkles, label: "Personalizable"       },
];

const steps = [
  { icon: Flower2,            title: "Elige tus flores",  desc: "Selecciona entre nuestras flores frescas."   },
  { icon: SlidersHorizontal,  title: "Personaliza",       desc: "Cuéntanos el estilo, colores y ocasión."    },
  { icon: Scissors,           title: "Creamos tu ramo",   desc: "Nuestro equipo lo arma con mucho cuidado."  },
  { icon: Truck,              title: "Entregamos",        desc: "Lo entregamos el mismo día en Mérida."      },
];

const features = [
  { icon: Flower2,        title: "Flores frescas cada día", desc: "Seleccionamos lo mejor del mercado local."   },
  { icon: Heart,          title: "Hecho a mano",            desc: "Cada ramo es único y especial."              },
  { icon: Truck,          title: "Entrega el mismo día",    desc: "En Mérida y zonas seleccionadas."            },
  { icon: MessageCircle,  title: "Atención personalizada",  desc: "Te acompañamos en todo el proceso."          },
];

// ─── Página ───────────────────────────────────────────────────────────────────

export default function CreateBouquetPage() {
  return (
    <main className="bg-brand-cream">

      {/* ════════════════════════════════════════════════════════════════════
          HERO — espejo visual de "Cada ramo tiene alma"
      ════════════════════════════════════════════════════════════════════ */}
      <section className="bg-brand-cream py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <div className="grid items-center gap-12 md:grid-cols-2">

            {/* ── Texto ───────────────────────────────────────────────── */}
            <div>
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.3em] text-brand-red">
                Crea tu ramo
              </p>
              <h1 className="font-heading mt-3 text-3xl font-bold leading-[1.08] text-brand-ink md:text-[2.6rem] lg:text-[2.9rem]">
                Arma el ramo que dice exactamente lo que sientes
              </h1>
              <p className="mt-6 max-w-md text-sm leading-[1.9] text-brand-ink/62 md:text-[0.92rem]">
                Elige flores, colores, envoltura y detalles especiales para crear un arreglo único.
                Nosotros lo preparamos a mano y lo entregamos con el cuidado Fresh Bloom.
              </p>

              {/* Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#constructor"
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-brand-wine px-6 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-white shadow-sm transition-all hover:gap-3 hover:bg-brand-red"
                >
                  <Plus className="h-3.5 w-3.5" strokeWidth={2.4} />
                  Empezar a crear
                </a>
                <Link
                  href="/productos"
                  className="inline-flex h-12 items-center gap-2 rounded-full border border-brand-wine/25 bg-white px-6 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-brand-wine transition-all hover:gap-3 hover:border-brand-wine/50 hover:bg-brand-wine/5"
                >
                  Ver inspiración
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Small pills */}
              <div className="mt-7 flex flex-wrap gap-2">
                {heroBadges.map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-brand-wine/12 bg-white/80 px-3 py-1.5 text-[0.65rem] font-semibold text-brand-wine/75 shadow-sm backdrop-blur-sm"
                  >
                    <Icon className="h-3 w-3" strokeWidth={2} />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* ── Visual editorial ────────────────────────────────────── */}
            <div className="relative">
              {/* Imagen principal */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-brand-wine/10 bg-brand-cream shadow-sm">
                <Image
                  src="/images/landing/arma-tu-ramo.jpg"
                  alt="Ramo personalizado Fresh Bloom — rosas pastel, eucalipto y lisianthus sobre mesa"
                  fill
                  sizes="(min-width: 768px) 480px, 90vw"
                  priority
                  className="object-cover object-center"
                />
                {/* Overlay interior decorativo */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-brand-beige/30 to-transparent" />
              </div>

              {/* Badge flotante — "Hecho en Mérida" */}
              <div className="absolute -bottom-4 -left-4 rounded-2xl bg-brand-wine px-5 py-3 shadow-lg">
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white/90">
                  Hecho en Mérida, Yucatán
                </p>
              </div>

              {/* Pill flotante superior */}
              <div className="absolute -right-3 top-6 rounded-full border border-brand-wine/15 bg-white px-4 py-2 shadow-md">
                <p className="text-[0.62rem] font-semibold text-brand-ink/65">
                  🌸 Flores frescas cada día
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          PROCESO — 4 pasos + features bar
      ════════════════════════════════════════════════════════════════════ */}
      <section className="border-t border-brand-wine/8 bg-brand-cream py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6 sm:px-10">

          {/* Encabezado centrado */}
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.3em] text-brand-red">
              Arma tu ramo
            </p>
            <h2 className="font-heading mt-3 text-3xl font-bold leading-tight text-brand-ink md:text-4xl">
              Crea algo único y especial
            </h2>
            <p className="mt-4 text-sm leading-[1.8] text-brand-ink/60">
              Elige tus flores favoritas y diseñamos un ramo a tu medida.
            </p>
          </div>

          {/* 4 pasos */}
          <div className="mt-12 grid gap-10 md:grid-cols-4 md:gap-6">
            {steps.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="relative flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-wine/8 text-brand-wine">
                    <Icon className="h-5 w-5" strokeWidth={1.6} />
                  </div>
                  <p className="font-heading text-[0.95rem] font-bold text-brand-ink">
                    {i + 1}. {title}
                  </p>
                </div>
                <p className="text-[0.82rem] leading-[1.65] text-brand-ink/60">
                  {desc}
                </p>

                {/* Conector punteado entre pasos (desktop) */}
                {i < steps.length - 1 && (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute right-0 top-6 hidden h-px w-8 translate-x-full border-t border-dashed border-brand-wine/25 md:block lg:w-12"
                  />
                )}
              </div>
            ))}
          </div>

          {/* CTA central */}
          <div className="mt-12 flex justify-center">
            <a
              href="#constructor"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-brand-wine px-7 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-white shadow-sm transition-all hover:gap-3 hover:bg-brand-red"
            >
              Comenzar a armar mi ramo
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Features bar */}
          <div className="mt-14 rounded-3xl border border-brand-wine/8 bg-brand-beige/30 px-6 py-7 md:px-10">
            <div className="grid gap-6 md:grid-cols-4 md:gap-5">
              {features.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-brand-wine shadow-sm">
                    <Icon className="h-4 w-4" strokeWidth={1.6} />
                  </div>
                  <div>
                    <p className="text-[0.82rem] font-bold text-brand-ink">
                      {title}
                    </p>
                    <p className="mt-0.5 text-[0.72rem] leading-[1.55] text-brand-ink/55">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          CONSTRUCTOR
      ════════════════════════════════════════════════════════════════════ */}
      <section id="constructor" className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <div className="mb-8 max-w-2xl">
          <p className="font-display text-sm uppercase tracking-[0.24em] text-brand-red">
            Personalización
          </p>
          <h2 className="mt-2 text-4xl font-semibold text-brand-wine md:text-5xl">
            Elige la combinación
          </h2>
          <p className="mt-4 text-sm leading-6 text-brand-ink/70">
            Escoge una opción de cada categoría para crear un arreglo con tu estilo.
          </p>
        </div>

        <CustomCookieBuilder />
      </section>
    </main>
  );
}

"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { TransparentImage } from "@/components/ui/TransparentImage";
import { ArrowRight, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { ProductCard } from "@/components/products/ProductCard";
import { products } from "@/lib/mock-products";
import type { ProductCategory } from "@/types/product";

// ─── Filtros ──────────────────────────────────────────────────────────────────

type SortKey = "default" | "price-asc" | "price-desc" | "name";

const CATEGORIES: { key: "all" | ProductCategory; label: string }[] = [
  { key: "all",     label: "Todos"      },
  { key: "ramos",   label: "Ramos"      },
  { key: "jarron",  label: "Con jarrón" },
  { key: "jarrones",label: "Jarrones"   },
  { key: "plantas", label: "Plantas"    },
  { key: "macetas", label: "Macetas"    },
  { key: "extras",  label: "Extras"     },
];

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "default",    label: "Destacados"     },
  { key: "price-asc",  label: "Menor precio"   },
  { key: "price-desc", label: "Mayor precio"   },
  { key: "name",       label: "A → Z"          },
];

// ─── Página ───────────────────────────────────────────────────────────────────

export default function CatalogoPage() {
  const [activeCategory, setActiveCategory] = useState<"all" | ProductCategory>("all");
  const [sort, setSort] = useState<SortKey>("default");

  const filtered = useMemo(() => {
    let list = activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

    if (sort === "price-asc")  list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "name")       list = [...list].sort((a, b) => a.name.localeCompare(b.name, "es"));

    return list;
  }, [activeCategory, sort]);

  return (
    <main className="min-h-screen bg-brand-cream">

      {/* ══════════════════════════════════════════════════════
          HERO HEADER
      ══════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden border-b border-brand-wine/10 bg-brand-cream">
        <div className="mx-auto max-w-6xl px-6 pt-10 pb-0 sm:px-10 md:pt-14">
          <div className="grid items-end gap-6 md:grid-cols-[1fr_460px] lg:grid-cols-[1fr_540px]">

            {/* ── Texto ─────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="pb-10 md:pb-14"
            >
              {/* Breadcrumb */}
              <div className="mb-6 flex items-center gap-2 text-[0.65rem] font-medium uppercase tracking-widest text-brand-ink/35">
                <Link href="/" className="transition hover:text-brand-wine">Inicio</Link>
                <span>/</span>
                <span className="text-brand-wine/70">Catálogo</span>
              </div>

              <p className="mb-3 text-[0.62rem] font-bold uppercase tracking-[0.32em] text-brand-red">
                Catálogo floral
              </p>
              <h1 className="font-heading text-5xl font-bold leading-[1.05] text-brand-ink md:text-6xl lg:text-[4rem]">
                Arreglos<br /> de la casa
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-brand-ink/50">
                Diseñados con amor en Mérida, Yucatán · entrega el mismo día con pedido antes de las 2 pm.
              </p>

              <div className="mt-8">
                <Link
                  href="/arma-tu-ramo"
                  className="inline-flex items-center gap-2 rounded-full bg-brand-wine px-6 py-3 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-white transition hover:bg-brand-red hover:gap-3"
                >
                  Arma tu ramo
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>

            {/* ── Imagen ────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: 32, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
              className="mx-auto w-full max-w-[480px] self-end md:max-w-none"
            >
              <TransparentImage
                src="/images/catalog-hero.png"
                alt="Canasta de flores frescas — Fresh Bloom"
                width={1397}
                height={1126}
                className="w-full h-auto translate-y-[1px]"
                tolerance={40}
              />
            </motion.div>

          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          FILTROS
      ══════════════════════════════════════════════════════ */}
      <div className="sticky top-16 z-30 border-b border-brand-wine/8 bg-brand-cream/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-3 overflow-x-auto px-6 py-3 sm:px-10 no-scrollbar">

          {/* Categorías */}
          <div className="flex items-center gap-2 shrink-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-[0.68rem] font-semibold transition-all ${
                  activeCategory === cat.key
                    ? "bg-brand-wine text-white shadow-sm"
                    : "border border-brand-wine/18 bg-white/50 text-brand-wine/65 hover:border-brand-wine/35 hover:bg-white hover:text-brand-wine"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Separador */}
          <div className="ml-auto flex shrink-0 items-center gap-3">
            <span className="hidden text-[0.65rem] text-brand-ink/35 sm:block">
              {filtered.length} {filtered.length === 1 ? "producto" : "productos"}
            </span>

            {/* Sort */}
            <div className="flex items-center gap-1.5">
              <SlidersHorizontal className="h-3.5 w-3.5 text-brand-wine/40" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-full border border-brand-wine/18 bg-white/70 py-1.5 pl-3 pr-7 text-[0.68rem] font-semibold text-brand-wine/75 outline-none transition hover:border-brand-wine/35 focus:border-brand-wine/50"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.key} value={o.key}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          GRID DE PRODUCTOS
      ══════════════════════════════════════════════════════ */}
      <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10 md:py-14">
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key={activeCategory + sort}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-4 py-24 text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-brand-wine/15 bg-white">
                <span className="text-2xl">🌸</span>
              </div>
              <p className="font-heading text-xl text-brand-ink/60">
                No hay productos en esta categoría todavía
              </p>
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className="rounded-full bg-brand-wine px-6 py-2.5 text-[0.68rem] font-bold uppercase tracking-wider text-white transition hover:bg-brand-red"
              >
                Ver todos
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ══════════════════════════════════════════════════════
          CTA INFERIOR — Arma tu ramo
      ══════════════════════════════════════════════════════ */}
      <div className="border-t border-brand-wine/10 bg-white/50">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-12 text-center sm:px-10">
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.3em] text-brand-red">
            ¿No encuentras lo que buscas?
          </p>
          <h2 className="font-heading text-2xl font-bold text-brand-ink md:text-3xl">
            Arma tu ramo personalizado
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-brand-ink/55">
            Elige flor principal, complemento, follaje y presentación. Te confirmamos por WhatsApp antes de armar.
          </p>
          <Link
            href="/arma-tu-ramo"
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-brand-wine px-7 py-3 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-brand-red hover:gap-3"
          >
            Comenzar
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </main>
  );
}

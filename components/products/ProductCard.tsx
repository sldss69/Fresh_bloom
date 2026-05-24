"use client";

import Image from "next/image";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { Leaf, Plus, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";

import { useCartStore } from "@/store/cart-store";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const hasImage = false;
  const cardRef = useRef<HTMLElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${y * -8}deg) scale3d(1.015,1.015,1.015)`;
  }

  function handleMouseEnter() {
    if (cardRef.current) cardRef.current.style.willChange = "transform";
  }

  function handleMouseLeave() {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = "";
    el.style.willChange = "auto";
  }

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: "transform 0.15s ease, box-shadow 0.15s ease" }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-brand-wine/10 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      {/* ── Imagen ─────────────────────────────────────────── */}
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-beige/20">
        {hasImage && product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className={`absolute inset-0 flex flex-col items-center justify-center gap-3 ${product.accentClass}`}>
            <Leaf className="h-10 w-10 opacity-25" />
            <span className="text-[0.6rem] font-semibold tracking-[0.3em] uppercase opacity-35">
              {product.tag}
            </span>
          </div>
        )}

        {/* Tag pill */}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-wine shadow-sm backdrop-blur-sm">
          {product.tag}
        </span>
      </div>

      {/* ── Info ───────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col gap-3 p-5">

        {/* Nombre + precio */}
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-heading text-[1.18rem] font-bold leading-tight text-brand-ink">
            {product.name}
          </h2>
          <span className="shrink-0 text-base font-black text-brand-wine">
            ${product.price.toLocaleString("es-MX")}
            <span className="ml-0.5 text-[10px] font-normal text-brand-ink/35"> MXN</span>
          </span>
        </div>

        {/* Descripción */}
        <p className="text-[0.82rem] leading-[1.65] text-brand-ink/60 line-clamp-2">
          {product.description}
        </p>

        {/* Ingredientes */}
        <div className="flex flex-wrap gap-1.5">
          {product.ingredients.map((ing) => (
            <span
              key={ing}
              className="rounded-full border border-brand-wine/12 bg-brand-beige/30 px-2.5 py-0.5 text-[10px] font-medium text-brand-wine/70"
            >
              {ing}
            </span>
          ))}
        </div>

        {/* Acciones */}
        <div className="mt-auto flex gap-2 pt-1">
          <button
            type="button"
            onClick={() => addItem(product)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-brand-wine py-2.5 text-[0.7rem] font-bold uppercase tracking-wider text-white transition hover:bg-brand-red"
          >
            <Plus className="h-3.5 w-3.5" />
            Agregar
          </button>
          <button
            type="button"
            onClick={() => { addItem(product); router.push("/checkout"); }}
            className="flex items-center justify-center gap-1.5 rounded-full border border-brand-wine/25 px-4 py-2.5 text-[0.7rem] font-bold uppercase tracking-wider text-brand-wine transition hover:border-brand-wine/50 hover:bg-brand-wine/5"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Pedir
          </button>
        </div>
      </div>
    </motion.article>
  );
}

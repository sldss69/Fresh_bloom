"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { FreshBloomLogo } from "@/components/brand/FreshBloomLogo";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { cn } from "@/lib/utils";
import { getCartTotals, useCartStore } from "@/store/cart-store";

const NAV_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Catálogo", href: "/productos" },
  { label: "Arma tu ramo", href: "/arma-tu-ramo" },
];

export function Navbar() {
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const items = useCartStore((s) => s.items);
  const { totalItems } = getCartTotals(items);

  // No mostrar en admin ni en sketches
  if (pathname.startsWith("/admin") || pathname.startsWith("/sketches")) return null;

  const isHome = pathname === "/";

  // Clases base según contexto
  const textActive = isHome ? "text-brand-ink" : "text-brand-wine";
  const textMuted = isHome ? "text-brand-ink/42 hover:text-brand-ink" : "text-brand-wine/42 hover:text-brand-wine";
  const borderColor = isHome ? "border-brand-ink/15" : "border-brand-wine/15";

  return (
    <>
      <header
        className={cn(
          "top-0 z-50 w-full transition-colors duration-300",
          isHome
            ? "fixed"
            : "sticky border-b border-brand-wine/10 bg-brand-cream/95 backdrop-blur-md",
        )}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 sm:px-10">

          {/* Logo */}
          <Link href="/" aria-label="Fresh Bloom" className="shrink-0">
            <FreshBloomLogo compact />
          </Link>

          {/* Links — desktop */}
          <nav className="hidden items-center gap-8 md:flex" aria-label="Navegación principal">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-[0.64rem] font-bold uppercase tracking-[0.2em] transition-colors duration-150",
                  pathname === link.href ? textActive : textMuted,
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Acciones — derecha */}
          <div className="flex items-center gap-2">

            {/* Carrito */}
            <button
              type="button"
              aria-label={`Ver pedido${totalItems > 0 ? ` (${totalItems} artículos)` : ""}`}
              onClick={() => setCartOpen(true)}
              className={cn(
                "relative flex h-9 items-center gap-2 rounded-full border px-4 text-[0.63rem] font-bold uppercase tracking-[0.14em] transition-all duration-150",
                isHome
                  ? "border-brand-ink/15 text-brand-ink/60 hover:border-brand-ink/30 hover:text-brand-ink"
                  : "border-brand-wine/15 bg-white/55 text-brand-wine/65 hover:bg-white hover:text-brand-wine",
              )}
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Pedido</span>
              {totalItems > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-red px-0.5 text-[9px] font-black text-white"
                >
                  {totalItems}
                </span>
              )}
            </button>

            {/* CTA — Pedir ahora */}
            <Link
              href="/productos"
              className={cn(
                "hidden h-9 items-center justify-center rounded-full px-5 text-[0.63rem] font-bold uppercase tracking-[0.16em] transition-all duration-150 md:flex",
                isHome
                  ? "bg-brand-ink text-brand-cream hover:bg-brand-ink/85"
                  : "bg-brand-wine text-white hover:bg-brand-red",
              )}
            >
              Pedir ahora
            </Link>

            {/* Hamburguesa — mobile */}
            <button
              type="button"
              aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-150 md:hidden",
                isHome
                  ? "border-brand-ink/15 text-brand-ink/55 hover:bg-brand-ink/6"
                  : "border-brand-wine/15 bg-white/50 text-brand-wine/60 hover:bg-white",
              )}
            >
              {mobileOpen
                ? <X className="h-4 w-4" />
                : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Menú mobile */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-t border-brand-wine/8 bg-brand-cream/98 backdrop-blur-md md:hidden"
            >
              <div className="flex flex-col gap-1 px-6 py-5">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "rounded-xl px-3 py-2.5 text-[0.68rem] font-bold uppercase tracking-[0.18em] transition-colors",
                      pathname === link.href
                        ? "bg-brand-wine/7 text-brand-wine"
                        : "text-brand-wine/48 hover:bg-brand-wine/5 hover:text-brand-wine",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/productos"
                  onClick={() => setMobileOpen(false)}
                  className="mt-3 flex h-10 items-center justify-center rounded-full bg-brand-wine text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-brand-red"
                >
                  Pedir ahora
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
}

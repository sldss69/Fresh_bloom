'use client';

import Link from "next/link";
import { useEffect } from "react";
import { ShoppingBag, X } from "lucide-react";

import { CartItem } from "@/components/cart/CartItem";
import { GiftOrderForm } from "@/components/gifts/GiftOrderForm";
import { Button } from "@/components/ui/button";
import { getCartTotals, useCartStore } from "@/store/cart-store";

type CartDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const { totalItems, subtotal } = getCartTotals(items);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onOpenChange]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[80]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-neutral-950/35"
        aria-label="Cerrar carrito"
        onClick={() => onOpenChange(false)}
      />

      <aside className="absolute right-0 top-0 flex h-[100dvh] w-full max-w-md flex-col bg-brand-cream shadow-2xl">
        <header className="flex items-center justify-between gap-4 border-b bg-white px-4 py-4 md:px-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-red">
              Tu pedido
            </p>
            <h2
              id="cart-drawer-title"
              className="mt-1 text-xl font-black text-neutral-950 md:text-2xl"
            >
              Carrito
            </h2>
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-10 md:size-8"
            aria-label="Cerrar carrito"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </header>

        {items.length > 0 ? (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="grid gap-3">
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onRemove={removeItem}
                    onUpdateQuantity={updateQuantity}
                  />
                ))}
              </div>
            </div>

            <footer className="border-t bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] md:p-5">
              <div className="flex items-center justify-between text-sm text-neutral-600">
                <span>{totalItems} piezas</span>
                <button
                  type="button"
                  className="font-semibold text-neutral-600 hover:text-neutral-950"
                  onClick={clearCart}
                >
                  Vaciar carrito
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between text-lg font-black text-neutral-950">
                <span>Subtotal</span>
                <span>
                  {subtotal > 0
                    ? `$${subtotal.toLocaleString("es-MX")} MXN`
                    : "Por confirmar"}
                </span>
              </div>
              <GiftOrderForm
                buttonLabel="Hazlo regalo"
                className="mt-4"
                compact
                scrollTargetId=""
              />
              <Button asChild className="mt-5 h-12 w-full md:h-11">
                <Link href="/checkout" onClick={() => onOpenChange(false)}>
                  Ir a checkout
                </Link>
              </Button>
            </footer>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
              <ShoppingBag className="h-7 w-7 text-brand-red" />
            </div>
            <h3 className="mt-5 text-2xl font-black text-neutral-950">
              Tu carrito está vacío
            </h3>
            <p className="mt-3 max-w-xs text-sm leading-6 text-neutral-600">
              Agrega tus arreglos favoritos y vuelve para cerrar tu pedido.
            </p>
            <Button asChild className="mt-6 h-12 md:h-11">
              <Link href="/productos" onClick={() => onOpenChange(false)}>
                Ver productos
              </Link>
            </Button>
          </div>
        )}
      </aside>
    </div>
  );
}

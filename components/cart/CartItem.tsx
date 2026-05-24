'use client';

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { CartItem as CartItemType } from "@/store/cart-store";

type CartItemProps = {
  item: CartItemType;
  onRemove: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
};

export function CartItem({
  item,
  onRemove,
  onUpdateQuantity,
}: CartItemProps) {
  const lineTotal = item.price * item.quantity;

  return (
    <article className="grid grid-cols-[64px_1fr] gap-3 rounded-lg border bg-white p-3 sm:grid-cols-[72px_1fr]">
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-md bg-brand-beige/35">
        <Image
          src={item.image}
          alt={`Arreglo ${item.name}`}
          width={120}
          height={120}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="truncate font-bold text-neutral-950">{item.name}</h3>
            <p className="mt-1 text-sm text-neutral-600">
              {item.price > 0
                ? `$${item.price.toLocaleString("es-MX")} MXN`
                : "Precio por confirmar"}
            </p>
            {item.customRecipe ? (
              <p className="mt-2 line-clamp-2 text-xs leading-5 text-neutral-500">
                {item.customRecipe.ingredients.join(", ")}
              </p>
            ) : null}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="size-10 sm:size-7"
            aria-label={`Quitar ${item.name}`}
            onClick={() => onRemove(item.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="inline-flex items-center rounded-lg border bg-white">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="size-10 sm:size-7"
              aria-label={`Restar ${item.name}`}
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-10 text-center text-sm font-bold">
              {item.quantity}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="size-10 sm:size-7"
              aria-label={`Sumar ${item.name}`}
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-sm font-black text-neutral-950">
            {item.price > 0
              ? `$${lineTotal.toLocaleString("es-MX")}`
              : "Por confirmar"}
          </p>
        </div>
      </div>
    </article>
  );
}

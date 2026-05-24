"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Flower2, Plus, RotateCcw, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GiftOrderForm } from "@/components/gifts/GiftOrderForm";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

const bouquetOptions = [
  { id: "flor-rosas-rojas", name: "Rosas rojas", group: "Flores principales" },
  { id: "flor-rosas-rosas", name: "Rosas rosas", group: "Flores principales" },
  { id: "flor-gerberas", name: "Gerberas", group: "Flores principales" },
  { id: "flor-girasol", name: "Girasol", group: "Flores principales" },
  { id: "flor-tulipanes", name: "Tulipanes blancos", group: "Flores principales" },
  { id: "flor-orquidea", name: "Orquídea", group: "Flores principales" },
  { id: "comp-gypsophila", name: "Gypsophila", group: "Complementos" },
  { id: "comp-lilis", name: "Lilis", group: "Complementos" },
  { id: "comp-astromelias", name: "Astromelias", group: "Complementos" },
  { id: "comp-hortensia", name: "Hortensia suave", group: "Complementos" },
  { id: "comp-mixtas", name: "Flores mixtas", group: "Complementos" },
  { id: "follaje-eucalipto", name: "Eucalipto", group: "Follaje" },
  { id: "follaje-ruscus", name: "Ruscus", group: "Follaje" },
  { id: "follaje-tropical", name: "Follaje tropical", group: "Follaje" },
  { id: "follaje-helecho", name: "Helecho", group: "Follaje" },
  { id: "pres-papel-rosa", name: "Papel rosa", group: "Presentación" },
  { id: "pres-papel-kraft", name: "Papel kraft", group: "Presentación" },
  { id: "pres-jarron", name: "Jarrón", group: "Presentación" },
  { id: "pres-base", name: "Base floral", group: "Presentación" },
  { id: "pres-mono", name: "Moño satinado", group: "Presentación" },
];

const groupedOptions = bouquetOptions.reduce<Record<string, typeof bouquetOptions>>(
  (groups, option) => {
    groups[option.group] = [...(groups[option.group] ?? []), option];
    return groups;
  },
  {},
);

export function CustomCookieBuilder() {
  const router = useRouter();
  const addCustomItem = useCartStore((state) => state.addCustomItem);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bouquetName, setBouquetName] = useState("");
  const [added, setAdded] = useState(false);

  const selectedOptions = useMemo(
    () => bouquetOptions.filter((option) => selectedIds.includes(option.id)),
    [selectedIds],
  );
  const recipeName = bouquetName.trim() || "Mi ramo personalizado";

  const toggleOption = (id: string) => {
    const option = bouquetOptions.find((current) => current.id === id);

    if (!option) {
      return;
    }

    setAdded(false);
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((optionId) => optionId !== id)
        : [
            ...current.filter((optionId) => {
              const currentOption = bouquetOptions.find(
                (item) => item.id === optionId,
              );

              return currentOption?.group !== option.group;
            }),
            id,
          ],
    );
  };

  const addRecipeToCart = () => {
    addCustomItem({
      name: recipeName,
      ingredients: selectedOptions.map((option) => option.name),
      image: "/images/products/aura-floral.jpg",
    });
    setAdded(true);
  };

  const goToCheckout = () => {
    addRecipeToCart();
    router.push("/checkout");
  };

  const resetRecipe = () => {
    setSelectedIds([]);
    setBouquetName("");
    setAdded(false);
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="grid gap-7">
        <label className="grid gap-2 text-sm font-semibold text-brand-wine">
          Nombre de tu ramo
          <input
            value={bouquetName}
            onChange={(event) => {
              setBouquetName(event.target.value);
              setAdded(false);
            }}
            className="h-12 rounded-lg border border-brand-wine/20 bg-white/80 px-3 text-base font-normal text-brand-ink outline-none transition focus:border-brand-red focus:ring-3 focus:ring-brand-red/20"
            placeholder="Ej. Rosas con eucalipto"
          />
        </label>

        <div className="grid gap-7">
          {Object.entries(groupedOptions).map(([group, groupOptions]) => (
            <section key={group} className="grid gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-brand-wine">{group}</h2>
                {group === "Flores principales" ? (
                  <p className="mt-1 text-sm text-brand-ink/65">
                    Elige la flor protagonista del arreglo.
                  </p>
                ) : null}
                {group === "Complementos" ? (
                  <p className="mt-1 text-sm text-brand-ink/65">
                    Suma textura, volumen o un tono extra.
                  </p>
                ) : null}
                {group === "Presentación" ? (
                  <p className="mt-1 text-sm text-brand-ink/65">
                    Define cómo quieres que se entregue.
                  </p>
                ) : null}
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {groupOptions.map((option) => {
                  const selected = selectedIds.includes(option.id);

                  return (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleOption(option.id)}
                      className={cn(
                        "flex min-h-14 items-center justify-between gap-3 rounded-lg border bg-white/80 px-4 py-3 text-left text-sm font-semibold text-brand-wine shadow-sm transition hover:-translate-y-0.5 hover:border-brand-red/50 hover:shadow-md",
                        selected &&
                          "border-brand-red bg-brand-red text-white shadow-brand-red/15 hover:border-brand-red",
                      )}
                    >
                      <span>{option.name}</span>
                      <span className="flex shrink-0 items-center gap-2">
                        {selected ? (
                          <span className="hidden text-xs font-bold sm:inline">
                            Seleccionado
                          </span>
                        ) : null}
                        <span
                          className={cn(
                            "flex size-6 items-center justify-center rounded-full border border-brand-wine/20 bg-white/70 text-brand-red",
                            selected && "border-white/50 bg-white text-brand-red",
                          )}
                        >
                          {selected ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>

      <aside className="h-fit rounded-lg border border-brand-wine/15 bg-white/85 p-5 shadow-xl shadow-brand-wine/10">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-beige/55 text-brand-red">
            <Flower2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
              Tu ramo
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-brand-wine">
              {recipeName}
            </h2>
          </div>
        </div>

        <div className="mt-5 rounded-lg bg-brand-cream/70 p-4">
          <p className="text-sm font-semibold text-brand-wine">Selección</p>
          {selectedOptions.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedOptions.map((option) => (
                <span
                  key={option.id}
                  className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-brand-wine shadow-sm"
                >
                  {option.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm leading-6 text-brand-ink/65">
              Elige de la lista para armar un ramo a tu gusto.
            </p>
          )}
        </div>

        <div className="mt-6 grid gap-3">
          <Button
            type="button"
            className="h-12"
            disabled={selectedOptions.length === 0}
            onClick={addRecipeToCart}
          >
            {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {added ? "Agregado al carrito" : "Agregar al carrito"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-12"
            disabled={selectedOptions.length === 0}
            onClick={goToCheckout}
          >
            <ShoppingBag className="h-4 w-4" />
            Ir directo a checkout
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-12"
            onClick={resetRecipe}
          >
            <RotateCcw className="h-4 w-4" />
            Reiniciar
          </Button>
          <GiftOrderForm
            buttonLabel="Hazlo regalo"
            className="mt-0"
            compact
            scrollTargetId=""
          />
        </div>
      </aside>
    </section>
  );
}

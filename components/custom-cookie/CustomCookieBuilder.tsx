"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, Flower2, Leaf, Minus, Plus, RotateCcw, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GiftOrderForm } from "@/components/gifts/GiftOrderForm";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FlowerOption {
  id: string;
  name: string;
  group: string;
  colors?: string[];
}

interface FlowerSelection {
  id: string;
  color?: string;
  quantity: number;
}

// ─── Color swatches ───────────────────────────────────────────────────────────

const COLOR_HEX: Record<string, string> = {
  Rojo: "#C0392B",
  Roja: "#C0392B",
  Rosa: "#E8779A",
  Naranja: "#E8832A",
  Amarillo: "#F5C518",
  Amarilla: "#F5C518",
  Blanco: "#F5F2ED",
  Blanca: "#F5F2ED",
  Morado: "#7B3FA0",
  Morada: "#7B3FA0",
  Fucsia: "#D81B7A",
  Azul: "#1E6BB8",
};

// ─── Flower catalog ───────────────────────────────────────────────────────────

const bouquetOptions: FlowerOption[] = [
  // ── Flores principales ──────────────────────────────────────────────────
  {
    id: "tulipanes",
    name: "Tulipanes",
    group: "Flores principales",
    colors: ["Rojo", "Rosa", "Amarillo", "Blanco", "Morado"],
  },
  {
    id: "ranunculos",
    name: "Ranúnculos",
    group: "Flores principales",
    colors: ["Naranja", "Rojo", "Blanco", "Amarillo"],
  },
  {
    id: "rosas",
    name: "Rosas",
    group: "Flores principales",
    colors: ["Roja", "Rosa", "Blanca", "Amarilla"],
  },
  {
    id: "mini-rosas",
    name: "Mini rosas",
    group: "Flores principales",
    colors: ["Roja", "Rosa", "Blanca", "Amarilla"],
  },
  {
    id: "gerberas",
    name: "Gerberas",
    group: "Flores principales",
    colors: ["Naranja", "Roja", "Fucsia", "Amarilla", "Blanca"],
  },
  {
    id: "orquideas",
    name: "Orquídeas",
    group: "Flores principales",
    colors: ["Blanca", "Morada"],
  },
  {
    id: "lilis",
    name: "Lilis",
    group: "Flores principales",
    colors: ["Rosa", "Blanca"],
  },
  {
    id: "lirio",
    name: "Lirio",
    group: "Flores principales",
    colors: ["Rosa", "Blanco"],
  },
  {
    id: "rosa-inglesa",
    name: "Rosa inglesa",
    group: "Flores principales",
    colors: ["Rosa", "Blanca", "Roja"],
  },
  {
    id: "claveles",
    name: "Claveles",
    group: "Flores principales",
    colors: ["Blanco", "Rosa", "Amarillo", "Rojo"],
  },
  {
    id: "hortensias",
    name: "Hortensias",
    group: "Flores principales",
    colors: ["Azul", "Rosa", "Blanca"],
  },
  {
    id: "astromelias",
    name: "Astromelias",
    group: "Flores principales",
    colors: ["Rosa", "Roja", "Amarilla"],
  },
  // ── Complementos ────────────────────────────────────────────────────────
  {
    id: "gypsophila",
    name: "Gypsophila",
    group: "Complementos",
  },
  {
    id: "veronicas",
    name: "Veronicas",
    group: "Complementos",
    colors: ["Morada", "Blanca"],
  },
  {
    id: "flores-mixtas",
    name: "Flores mixtas",
    group: "Complementos",
  },
  // ── Follaje ─────────────────────────────────────────────────────────────
  { id: "eucalipto", name: "Eucalipto", group: "Follaje" },
  { id: "ruscus", name: "Ruscus", group: "Follaje" },
  { id: "follaje-tropical", name: "Follaje tropical", group: "Follaje" },
  { id: "helecho", name: "Helecho", group: "Follaje" },
  // ── Presentación ────────────────────────────────────────────────────────
  { id: "papel-rosa", name: "Papel rosa", group: "Presentación" },
  { id: "papel-kraft", name: "Papel kraft", group: "Presentación" },
  { id: "jarron", name: "Jarrón", group: "Presentación" },
  { id: "base-floral", name: "Base floral", group: "Presentación" },
  { id: "mono-satinado", name: "Moño satinado", group: "Presentación" },
];

// Groups where multiple selections + qty/color are allowed
const MULTI_GROUPS = new Set(["Flores principales", "Complementos"]);

const GROUP_ORDER = ["Flores principales", "Complementos", "Follaje", "Presentación"];

const GROUP_DESC: Record<string, string> = {
  "Flores principales": "Elige las flores protagonistas. Puedes combinar varias y ajustar la cantidad de cada una.",
  Complementos: "Suma textura, volumen o un tono extra al arreglo.",
  Follaje: "Elige el follaje para enmarcar el ramo.",
  Presentación: "Define cómo quieres que se entregue.",
};

const grouped = bouquetOptions.reduce<Record<string, FlowerOption[]>>((acc, opt) => {
  acc[opt.group] = [...(acc[opt.group] ?? []), opt];
  return acc;
}, {});

// ─── FlowerCard (accordion-controlled) ───────────────────────────────────────

function FlowerCard({
  option,
  selection,
  isOpen,
  onToggle,
  onUpdate,
  onRemove,
}: {
  option: FlowerOption;
  selection?: FlowerSelection;
  isOpen: boolean;
  onToggle: () => void;
  onUpdate: (id: string, color: string | undefined, quantity: number) => void;
  onRemove: (id: string) => void;
}) {
  const [color, setColor] = useState<string>(
    selection?.color ?? option.colors?.[0] ?? "",
  );
  const [qty, setQty] = useState(selection?.quantity ?? 3);
  const isSelected = !!selection;

  // Sync local state when selection changes externally
  useEffect(() => {
    if (selection) {
      setColor(selection.color ?? option.colors?.[0] ?? "");
      setQty(selection.quantity);
    }
  }, [selection, option.colors]);

  const handleConfirm = () => {
    onUpdate(option.id, option.colors?.length ? color : undefined, qty);
    onToggle(); // close after confirm
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border transition-all duration-200",
        isSelected && !isOpen
          ? "border-l-[3px] border-l-brand-wine border-brand-wine/20 bg-white shadow-md shadow-brand-wine/8 -translate-y-0.5"
          : isOpen
          ? "border-brand-wine bg-white shadow-xl shadow-brand-wine/12"
          : "border-brand-wine/12 bg-white hover:border-brand-wine/25 hover:shadow-md hover:-translate-y-0.5 hover:bg-[#FDFAF7]",
      )}
    >
      {/* Decorative leaf — visible only when collapsed & unselected */}
      {!isOpen && !isSelected && (
        <Leaf className="pointer-events-none absolute right-10 top-1/2 h-8 w-8 -translate-y-1/2 text-brand-beige/70" />
      )}

      {/* ── Header ── */}
      <button
        type="button"
        onClick={onToggle}
        className="relative flex w-full items-center gap-3 px-4 py-4 text-left"
      >
        {/* Status indicator */}
        <span
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-200",
            isSelected
              ? "bg-brand-wine shadow-sm shadow-brand-wine/30"
              : "border-2 border-brand-wine/18 bg-brand-beige/25",
          )}
        >
          {isSelected ? (
            <Check className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
          ) : (
            <Plus className="h-3.5 w-3.5 text-brand-wine/45" strokeWidth={2} />
          )}
        </span>

        <div className="flex-1 min-w-0">
          <span className="block font-heading text-[0.95rem] font-semibold text-brand-ink leading-tight">
            {option.name}
          </span>
          {isSelected && !isOpen && (
            <span className="flex items-center gap-1.5 mt-1">
              {selection.color && (
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full ring-1 ring-black/8 shrink-0"
                  style={{ backgroundColor: COLOR_HEX[selection.color] ?? "#d4b8a0" }}
                />
              )}
              <span className="text-[10px] font-semibold text-brand-wine/65 tracking-wide">
                {selection.quantity} tallos
                {selection.color ? ` · ${selection.color}` : ""}
              </span>
            </span>
          )}
        </div>

        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-brand-wine/30 transition-transform duration-200",
            isOpen && "rotate-180 text-brand-wine/60",
          )}
        />
      </button>

      {/* ── Dropdown ── */}
      {isOpen && (
        <div className="border-t border-brand-wine/8 bg-[#FDFAF7] px-5 pb-5 pt-4 space-y-5">

          {/* Color swatches */}
          {option.colors && option.colors.length > 0 && (
            <div>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-brand-ink/35">
                Color
              </p>
              <div className="flex flex-wrap gap-3">
                {option.colors.map((c) => {
                  const isWhiteColor = ["Blanco", "Blanca"].includes(c);
                  const active = color === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className="flex flex-col items-center gap-1.5 group"
                    >
                      <span
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-full ring-2 ring-offset-2 transition-all duration-150",
                          active
                            ? "ring-brand-wine scale-110"
                            : "ring-transparent group-hover:ring-brand-wine/30 group-hover:scale-105",
                          isWhiteColor && "border border-brand-wine/15",
                        )}
                        style={{ backgroundColor: COLOR_HEX[c] ?? "#d4b8a0" }}
                      >
                        {active && (
                          <Check
                            className={cn(
                              "h-3.5 w-3.5",
                              isWhiteColor ? "text-brand-ink/60" : "text-white",
                            )}
                          />
                        )}
                      </span>
                      <span
                        className={cn(
                          "text-[9px] font-semibold transition-colors",
                          active ? "text-brand-wine" : "text-brand-ink/45",
                        )}
                      >
                        {c}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity stepper */}
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-brand-ink/35">
              Cantidad
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center rounded-full border border-brand-wine/15 bg-brand-cream/60 p-1">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-brand-wine transition hover:bg-white hover:shadow-sm"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-10 text-center text-sm font-bold text-brand-ink tabular-nums">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-brand-wine transition hover:bg-white hover:shadow-sm"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setQty((q) => q + 10)}
                className="rounded-full bg-brand-beige/60 px-3.5 py-2 text-[11px] font-bold text-brand-wine transition hover:bg-brand-beige"
              >
                +10
              </button>

              {qty > 10 && (
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 10))}
                  className="rounded-full bg-brand-beige/40 px-3.5 py-2 text-[11px] font-bold text-brand-ink/50 transition hover:bg-brand-beige/70"
                >
                  −10
                </button>
              )}

              <span className="text-xs text-brand-ink/35 ml-1">tallos</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 rounded-full bg-brand-wine py-2.5 text-xs font-bold text-white transition hover:bg-brand-red active:scale-[0.98]"
            >
              {isSelected ? "Actualizar" : "Agregar al ramo"}
            </button>
            {isSelected && (
              <button
                type="button"
                onClick={() => {
                  onRemove(option.id);
                  onToggle();
                }}
                className="rounded-full border border-brand-wine/20 px-4 py-2.5 text-xs font-semibold text-brand-wine/60 transition hover:border-brand-wine/35 hover:text-brand-wine"
              >
                Quitar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SimpleCard (Follaje / Presentación — single select, no qty) ──────────────

function SimpleCard({
  option,
  selected,
  onToggle,
}: {
  option: FlowerOption;
  selected: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onToggle(option.id)}
      className={cn(
        "relative flex min-h-[3.25rem] items-center justify-between gap-3 overflow-hidden rounded-2xl border px-4 py-3.5 text-left transition-all duration-200 hover:-translate-y-0.5",
        selected
          ? "border-l-[3px] border-l-brand-wine border-brand-wine/20 bg-brand-wine/5 shadow-md shadow-brand-wine/8 text-brand-ink"
          : "border-brand-wine/12 bg-white text-brand-ink hover:border-brand-wine/25 hover:shadow-md hover:bg-[#FDFAF7]",
      )}
    >
      {!selected && (
        <Leaf className="pointer-events-none absolute right-10 top-1/2 h-7 w-7 -translate-y-1/2 text-brand-beige/60" />
      )}
      <span className="font-heading text-[0.9rem] font-semibold relative z-10">{option.name}</span>
      <span
        className={cn(
          "relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all duration-200",
          selected
            ? "bg-brand-wine shadow-sm shadow-brand-wine/30"
            : "border-2 border-brand-wine/18 bg-brand-beige/25",
        )}
      >
        {selected ? (
          <Check className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
        ) : (
          <Plus className="h-3.5 w-3.5 text-brand-wine/45" strokeWidth={2} />
        )}
      </span>
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function CustomCookieBuilder() {
  const router = useRouter();
  const addCustomItem = useCartStore((s) => s.addCustomItem);

  // Multi-select with color + quantity (Flores principales & Complementos)
  const [flowerSelections, setFlowerSelections] = useState<FlowerSelection[]>([]);
  // Single-select (Follaje & Presentación): { [group]: id }
  const [simpleSelections, setSimpleSelections] = useState<Record<string, string>>({});

  const [bouquetName, setBouquetName] = useState("");
  const [added, setAdded] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id));

  const recipeName = bouquetName.trim() || "Mi ramo personalizado";

  const updateFlower = (
    id: string,
    color: string | undefined,
    quantity: number,
  ) => {
    setAdded(false);
    setFlowerSelections((prev) => {
      const exists = prev.find((s) => s.id === id);
      if (exists)
        return prev.map((s) => (s.id === id ? { id, color, quantity } : s));
      return [...prev, { id, color, quantity }];
    });
  };

  const removeFlower = (id: string) => {
    setAdded(false);
    setFlowerSelections((prev) => prev.filter((s) => s.id !== id));
  };

  const toggleSimple = (id: string) => {
    setAdded(false);
    const option = bouquetOptions.find((o) => o.id === id)!;
    setSimpleSelections((prev) => {
      if (prev[option.group] === id) {
        const next = { ...prev };
        delete next[option.group];
        return next;
      }
      return { ...prev, [option.group]: id };
    });
  };

  const totalFlowerCount = flowerSelections.reduce((sum, s) => sum + s.quantity, 0);
  const showJarron = totalFlowerCount < 75;

  // Auto-deselect jarrón when total stalks reach 75+
  useEffect(() => {
    if (!showJarron && simpleSelections["Presentación"] === "jarron") {
      setSimpleSelections((prev) => {
        const next = { ...prev };
        delete next["Presentación"];
        return next;
      });
    }
  }, [showJarron, simpleSelections]);

  const totalSelections =
    flowerSelections.length + Object.keys(simpleSelections).length;

  const buildIngredients = () => {
    const flowers = flowerSelections.map((sel) => {
      const opt = bouquetOptions.find((o) => o.id === sel.id)!;
      return `${sel.quantity}× ${opt.name}${sel.color ? ` ${sel.color}` : ""}`;
    });
    const simples = Object.values(simpleSelections).map((id) => {
      const opt = bouquetOptions.find((o) => o.id === id)!;
      return opt.name;
    });
    return [...flowers, ...simples];
  };

  const addToCart = () => {
    addCustomItem({
      name: recipeName,
      ingredients: buildIngredients(),
      image: "/images/products/aura-floral.jpg",
    });
    setAdded(true);
  };

  const goToCheckout = () => {
    addToCart();
    router.push("/checkout");
  };

  const reset = () => {
    setFlowerSelections([]);
    setSimpleSelections({});
    setBouquetName("");
    setAdded(false);
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
      {/* ── Left column ── */}
      <div className="grid gap-8">
        {/* Nombre */}
        <label className="grid gap-2 text-sm font-semibold text-brand-wine">
          Nombre de tu ramo
          <input
            value={bouquetName}
            onChange={(e) => {
              setBouquetName(e.target.value);
              setAdded(false);
            }}
            className="h-12 rounded-lg border border-brand-wine/20 bg-white/80 px-3 text-base font-normal text-brand-ink outline-none transition focus:border-brand-wine focus:ring-3 focus:ring-brand-wine/20"
            placeholder="Ej. Rosas con eucalipto"
          />
        </label>

        {/* Groups */}
        {GROUP_ORDER.map((group) => {
          const options = (grouped[group] ?? []).filter(
            (opt) => !(opt.id === "jarron" && !showJarron),
          );
          const isMulti = MULTI_GROUPS.has(group);

          return (
            <section key={group} className="grid gap-4">
              <div>
                <h2 className="font-heading text-2xl font-semibold text-brand-wine">
                  {group}
                </h2>
                <p className="mt-1 text-sm text-brand-ink/60">
                  {GROUP_DESC[group]}
                  {group === "Presentación" && !showJarron && (
                    <span className="ml-2 text-brand-wine/60 font-medium">
                      · Jarrón no disponible para ramos de 75+ tallos
                    </span>
                  )}
                </p>
              </div>

              <div className="grid gap-2.5 sm:grid-cols-2 items-start">
                {options.map((option) =>
                  isMulti ? (
                    <div
                      key={option.id}
                      className={cn(
                        "transition-all",
                        expandedId === option.id && "sm:col-span-2",
                      )}
                    >
                      <FlowerCard
                        option={option}
                        selection={flowerSelections.find((s) => s.id === option.id)}
                        isOpen={expandedId === option.id}
                        onToggle={() => toggleExpand(option.id)}
                        onUpdate={updateFlower}
                        onRemove={removeFlower}
                      />
                    </div>
                  ) : (
                    <SimpleCard
                      key={option.id}
                      option={option}
                      selected={simpleSelections[option.group] === option.id}
                      onToggle={toggleSimple}
                    />
                  ),
                )}
              </div>
            </section>
          );
        })}
      </div>

      {/* ── Sidebar summary ── */}
      <aside className="h-fit rounded-xl border border-brand-wine/15 bg-white/85 p-5 shadow-xl shadow-brand-wine/10 lg:sticky lg:top-24">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-beige/55 text-brand-wine">
            <Flower2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-wine/55">
              Tu ramo
            </p>
            <h2 className="mt-0.5 font-heading text-xl font-semibold text-brand-wine">
              {recipeName}
            </h2>
          </div>
        </div>

        {/* Selection list */}
        <div className="mt-5 rounded-lg bg-brand-cream/70 p-4">
          <p className="text-sm font-semibold text-brand-wine">Selección</p>

          {totalSelections > 0 ? (
            <div className="mt-3 flex flex-col gap-1.5">
              {flowerSelections.map((sel) => {
                const opt = bouquetOptions.find((o) => o.id === sel.id)!;
                return (
                  <div
                    key={sel.id}
                    className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-xs shadow-sm"
                  >
                    <span className="font-semibold text-brand-ink">
                      {opt.name}
                    </span>
                    <span className="flex items-center gap-1.5 text-brand-wine font-bold">
                      {sel.color && (
                        <span
                          className={cn(
                            "h-2.5 w-2.5 rounded-full ring-1",
                            ["Blanco", "Blanca"].includes(sel.color)
                              ? "ring-brand-wine/25"
                              : "ring-transparent",
                          )}
                          style={{
                            backgroundColor:
                              COLOR_HEX[sel.color] ?? "#d4b8a0",
                          }}
                        />
                      )}
                      {sel.quantity}×
                      {sel.color && (
                        <span className="font-normal text-brand-ink/55">
                          {sel.color}
                        </span>
                      )}
                    </span>
                  </div>
                );
              })}

              {Object.values(simpleSelections).map((id) => {
                const opt = bouquetOptions.find((o) => o.id === id)!;
                return (
                  <div
                    key={id}
                    className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs shadow-sm"
                  >
                    <Check className="h-3 w-3 text-brand-wine shrink-0" />
                    <span className="font-semibold text-brand-ink">
                      {opt.name}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="mt-3 text-sm leading-6 text-brand-ink/60">
              Elige flores y configura color y cantidad para armar tu ramo.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 grid gap-3">
          <Button
            type="button"
            className="h-12"
            disabled={totalSelections === 0}
            onClick={addToCart}
          >
            {added ? (
              <Check className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {added ? "Agregado al carrito" : "Agregar al carrito"}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="h-12"
            disabled={totalSelections === 0}
            onClick={goToCheckout}
          >
            <ShoppingBag className="h-4 w-4" />
            Ir directo a checkout
          </Button>

          <Button
            type="button"
            variant="outline"
            className="h-12"
            onClick={reset}
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

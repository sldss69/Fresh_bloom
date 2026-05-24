"use client";

import { FormEvent, useState } from "react";
import { Gift, Heart, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

const occasions = [
  "Cumpleaños",
  "Aniversario",
  "Gracias",
  "Felicitaciones",
  "Graduación",
  "San Valentín",
  "Día de las madres",
  "Día del padre",
  "Navidad",
  "Solo porque sí",
];

type GiftOrderFormProps = {
  buttonLabel?: string;
  className?: string;
  compact?: boolean;
  scrollTargetId?: string;
};

export function GiftOrderForm({
  buttonLabel = "Armar regalo",
  className,
  compact = false,
  scrollTargetId = "catalogo",
}: GiftOrderFormProps) {
  const savedGiftDetails = useCartStore((state) => state.giftDetails);
  const setGiftDetails = useCartStore((state) => state.setGiftDetails);
  const [open, setOpen] = useState(false);
  const [occasion, setOccasion] = useState(
    savedGiftDetails?.occasion ?? occasions[0],
  );
  const [otherOccasion, setOtherOccasion] = useState(
    savedGiftDetails?.otherOccasion ?? "",
  );
  const [message, setMessage] = useState(savedGiftDetails?.message ?? "");
  const [saved, setSaved] = useState(false);

  const saveGiftDetails = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setGiftDetails({
      occasion,
      otherOccasion: otherOccasion.trim() || undefined,
      message: message.trim(),
    });
    setSaved(true);
    if (scrollTargetId) {
      document.getElementById(scrollTargetId)?.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <div className={cn("mt-3", className)}>
      <Button
        type="button"
        variant="outline"
        className={cn("h-12 px-5 md:h-11", compact && "w-full")}
        onClick={() => {
          setOpen((current) => !current);
          setSaved(false);
        }}
      >
        <Gift className="h-4 w-4" />
        {buttonLabel}
      </Button>

      {open ? (
        <form
          onSubmit={saveGiftDetails}
          className={cn(
            "mt-4 grid max-w-xl gap-4 rounded-lg border border-brand-wine/15 bg-white/75 p-4 text-left shadow-xl shadow-brand-wine/10 backdrop-blur md:p-5",
            compact && "max-w-none bg-brand-cream/60 p-4 shadow-sm md:p-4",
          )}
        >
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-brand-red">
              <Sparkles className="h-4 w-4" />
              Detalles de regalo
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-brand-wine">
              Hagamos que llegue con intención
            </h2>
          </div>

          <label className="grid gap-2 text-sm font-semibold text-brand-wine">
            ¿Cuál es la ocasión?
            <select
              value={occasion}
              onChange={(event) => {
                setOccasion(event.target.value);
                setSaved(false);
              }}
              className="h-12 rounded-lg border border-brand-wine/20 bg-white px-3 text-base font-normal text-brand-ink outline-none transition focus:border-brand-red focus:ring-3 focus:ring-brand-red/20"
            >
              {occasions.map((currentOccasion) => (
                <option key={currentOccasion} value={currentOccasion}>
                  {currentOccasion}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-semibold text-brand-wine">
            Otra ocasión
            <input
              value={otherOccasion}
              onChange={(event) => {
                setOtherOccasion(event.target.value);
                setSaved(false);
              }}
              className="h-12 rounded-lg border border-brand-wine/20 bg-white px-3 text-base font-normal text-brand-ink outline-none transition focus:border-brand-red focus:ring-3 focus:ring-brand-red/20"
              placeholder="Ej. Primer día en un nuevo trabajo"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-brand-wine">
            Dedícale unas palabras
            <textarea
              value={message}
              onChange={(event) => {
                setMessage(event.target.value);
                setSaved(false);
              }}
              className="min-h-28 resize-y rounded-lg border border-brand-wine/20 bg-white px-3 py-3 text-base font-normal text-brand-ink outline-none transition focus:border-brand-red focus:ring-3 focus:ring-brand-red/20"
              placeholder="Algo breve, bonito y muy de ustedes."
            />
          </label>

          <Button type="submit" className="h-12">
            <Heart className="h-4 w-4" />
            {saved ? "Regalo guardado" : "Guardar y elegir flores"}
          </Button>
        </form>
      ) : null}
    </div>
  );
}

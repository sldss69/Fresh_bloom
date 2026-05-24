"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

function getRemaining(): { hours: number; minutes: number; seconds: number } | null {
  const now = new Date();
  const cutoff = new Date();
  cutoff.setHours(14, 0, 0, 0);
  if (now >= cutoff) return null;
  const diff = cutoff.getTime() - now.getTime();
  return {
    hours: Math.floor(diff / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  };
}

export function DeliveryCountdown() {
  const [remaining, setRemaining] = useState<ReturnType<typeof getRemaining>>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setRemaining(getRemaining());
    const id = setInterval(() => setRemaining(getRemaining()), 1_000);
    return () => clearInterval(id);
  }, []);

  if (!mounted) return null;

  if (!remaining) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-brand-wine/18 bg-white/60 px-4 py-1.5 text-[0.63rem] font-semibold text-brand-ink/55 backdrop-blur-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
        Entregas mañana desde las 9 am
      </span>
    );
  }

  const { hours, minutes, seconds } = remaining;

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/90 px-4 py-1.5 text-[0.63rem] font-semibold text-emerald-800 backdrop-blur-sm">
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      Entrega hoy
      <span className="flex items-center gap-1 text-emerald-700/70">
        <Clock className="h-3 w-3" />
        te quedan{" "}
        <strong className="font-black text-emerald-800">
          {hours > 0 ? `${hours}h ` : ""}
          {String(minutes).padStart(2, "0")}m{" "}
          {String(seconds).padStart(2, "0")}s
        </strong>
      </span>
    </span>
  );
}

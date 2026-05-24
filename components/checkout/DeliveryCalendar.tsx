"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DeliveryCalendarProps = {
  value: string;
  onChange: (value: string) => void;
};

const weekdays = ["L", "M", "M", "J", "V", "S", "D"];

export function DeliveryCalendar({ value, onChange }: DeliveryCalendarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const selectedDate = value ? parseInputDate(value) : null;
  const today = startOfDay(new Date());
  const [visibleDate, setVisibleDate] = useState(() =>
    startOfMonth(selectedDate ?? today),
  );
  const viewYear = visibleDate.getFullYear();
  const viewMonth = visibleDate.getMonth();
  const days = getCalendarDays(visibleDate);
  const monthLabel = formatMonthLabel(visibleDate);
  const previousMonth = new Date(viewYear, viewMonth - 1, 1);
  const nextMonth = new Date(viewYear, viewMonth + 1, 1);
  const previousMonthDisabled = isBeforeMonth(previousMonth, today);
  const selectedLabel = selectedDate
    ? formatSelectedDate(selectedDate)
    : "Elige una fecha";

  useEffect(() => {
    const closeCalendar = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", closeCalendar);
    document.addEventListener("keydown", closeWithEscape);

    return () => {
      document.removeEventListener("mousedown", closeCalendar);
      document.removeEventListener("keydown", closeWithEscape);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        className={cn(
          "flex h-12 w-full items-center justify-between rounded-lg border bg-white px-3 text-left text-base font-normal text-neutral-950 shadow-sm outline-none transition focus:border-brand-red focus:ring-3 focus:ring-brand-red/20 md:h-11 md:text-sm",
          open ? "border-brand-red ring-3 ring-brand-red/20" : "border-border",
          !value && "text-neutral-500",
        )}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="inline-flex min-w-0 items-center gap-2">
          <CalendarDays className="h-4 w-4 shrink-0 text-brand-red" />
          <span className="truncate">{selectedLabel}</span>
        </span>
        <ChevronRight
          className={cn(
            "h-4 w-4 shrink-0 text-brand-wine/55 transition",
            open && "rotate-90",
          )}
        />
      </button>

      {open ? (
        <div className="absolute left-0 top-[calc(100%+0.5rem)] z-40 w-full min-w-[18rem] rounded-lg border border-brand-wine/15 bg-white p-3 shadow-2xl shadow-brand-wine/15">
          <div className="flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="size-9 text-brand-wine hover:bg-brand-beige/45"
              aria-label="Mes anterior"
              disabled={previousMonthDisabled}
              onClick={() => setVisibleDate(previousMonth)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <p className="text-sm font-black text-brand-wine">{monthLabel}</p>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="size-9 text-brand-wine hover:bg-brand-beige/45"
              aria-label="Mes siguiente"
              onClick={() => setVisibleDate(nextMonth)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px] font-black uppercase text-brand-wine/60">
            {weekdays.map((weekday, index) => (
              <span key={`${weekday}-${index}`} className="py-1">
                {weekday}
              </span>
            ))}
          </div>

          <div className="mt-1 grid grid-cols-7 gap-1">
            {days.map((day) => {
              const dayValue = toInputDate(day);
              const isOutsideMonth = day.getMonth() !== viewMonth;
              const isPast = startOfDay(day) < today;
              const isSelected = value === dayValue;

              return (
                <button
                  key={dayValue}
                  type="button"
                  className={cn(
                    "aspect-square rounded-md border text-sm font-black transition focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-red/25",
                    isSelected
                      ? "border-brand-wine bg-brand-wine text-brand-cream shadow-sm"
                      : "border-transparent bg-brand-cream/45 text-brand-ink hover:border-brand-red/35 hover:bg-brand-beige/45",
                    isOutsideMonth && "text-brand-ink/30",
                    isPast &&
                      "cursor-not-allowed bg-neutral-100 text-neutral-300 hover:border-transparent hover:bg-neutral-100",
                  )}
                  disabled={isPast}
                  onClick={() => {
                    onChange(dayValue);
                    setOpen(false);
                  }}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function getCalendarDays(month: Date) {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const mondayBasedOffset = (firstDay.getDay() + 6) % 7;
  const startDate = new Date(firstDay);
  startDate.setDate(firstDay.getDate() - mondayBasedOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + index);
    return day;
  });
}

function parseInputDate(value: string) {
  return new Date(`${value}T00:00:00`);
}

function startOfDay(date: Date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function isBeforeMonth(month: Date, today: Date) {
  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  return month < currentMonth;
}

function toInputDate(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function formatMonthLabel(date: Date) {
  const label = new Intl.DateTimeFormat("es-MX", {
    month: "long",
    year: "numeric",
  }).format(date);

  return label.charAt(0).toUpperCase() + label.slice(1);
}

function formatSelectedDate(date: Date) {
  return new Intl.DateTimeFormat("es-MX", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(date);
}

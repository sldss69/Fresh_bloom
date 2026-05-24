import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Fresh Bloom — Layout Sketches",
  robots: "noindex",
};

// ─── Primitives ───────────────────────────────────────────────────────────────

function IMG({ className = "", label = "FOTO" }: { className?: string; label?: string }) {
  return (
    <div
      className={`relative overflow-hidden flex items-center justify-center ${className}`}
      style={{
        backgroundColor: "#cdc9bf",
        backgroundImage:
          "repeating-linear-gradient(-55deg, transparent, transparent 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 11px)",
      }}
    >
      <span className="text-[9px] font-mono tracking-widest z-10 text-neutral-500 select-none">
        {label}
      </span>
    </div>
  );
}

function Lines({ n = 3, lastW = 65, h = 6, gap = 6, className = "" }: { n?: number; lastW?: number; h?: number; gap?: number; className?: string }) {
  return (
    <div className={`flex flex-col ${className}`} style={{ gap }}>
      {Array.from({ length: n }).map((_, i) => (
        <div
          key={i}
          className="rounded-full bg-neutral-300"
          style={{ height: h, width: i === n - 1 ? `${lastW}%` : "100%" }}
        />
      ))}
    </div>
  );
}

function BtnFill({ label, sm, className = "" }: { label: string; sm?: boolean; className?: string }) {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-full font-semibold tracking-wide bg-[#4a5648] text-white select-none ${sm ? "px-3 py-1 text-[8px]" : "px-5 py-1.5 text-[10px]"} ${className}`}
    >
      {label}
    </div>
  );
}

function BtnLine({ label, sm, className = "" }: { label: string; sm?: boolean; className?: string }) {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-full font-semibold tracking-wide border border-[#4a5648]/50 text-[#4a5648] select-none ${sm ? "px-3 py-1 text-[8px]" : "px-5 py-1.5 text-[10px]"} ${className}`}
    >
      {label}
    </div>
  );
}

function Chip({ label, active }: { label: string; active?: boolean }) {
  return (
    <div
      className={`px-3 py-1 rounded-full text-[9px] font-semibold select-none whitespace-nowrap ${active ? "bg-[#4a5648] text-white" : "bg-white/60 text-[#4a5648]/70 border border-[#4a5648]/20"}`}
    >
      {label}
    </div>
  );
}

function Icon({ size = 32 }: { size?: number }) {
  return (
    <div
      className="rounded-full border border-[#4a5648]/20 bg-white/60 flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <div
        className="rounded-full bg-[#4a5648]/20"
        style={{ width: size * 0.45, height: size * 0.45 }}
      />
    </div>
  );
}

function BigH({ lines = 2, className = "" }: { lines?: number; className?: string }) {
  const ws = ["100%", "82%", "91%", "68%"];
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="rounded-sm bg-[#2c2116]/65"
          style={{ height: 26, width: ws[i % ws.length] }}
        />
      ))}
    </div>
  );
}

function ProductCard() {
  return (
    <div className="rounded-xl overflow-hidden bg-white/75 border border-[#4a5648]/10 shadow-sm">
      <IMG className="aspect-[4/3] w-full" />
      <div className="p-3 space-y-1.5">
        <div className="h-2 w-3/4 bg-[#4a5648]/35 rounded-full" />
        <div className="h-1.5 w-full bg-neutral-200 rounded-full" />
        <div className="h-1.5 w-2/3 bg-neutral-200 rounded-full" />
        <div className="flex items-center justify-between pt-1">
          <div className="h-2 w-1/3 bg-[#6a5f6c]/50 rounded-full" />
          <div className="px-2.5 py-1 rounded-full bg-[#4a5648] text-white text-[7px] font-semibold">
            + Pedir
          </div>
        </div>
      </div>
    </div>
  );
}

function Annotation({ children }: { children: ReactNode }) {
  return (
    <div className="absolute top-1.5 right-2 bg-black/8 text-black/35 text-[7px] font-mono px-2 py-0.5 rounded tracking-wider z-20 select-none pointer-events-none">
      {children}
    </div>
  );
}

// ─── Page frame wrapper ───────────────────────────────────────────────────────

function BrowserFrame({ url, children, className = "" }: { url: string; children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl overflow-hidden border border-neutral-200 shadow-md ${className}`}>
      <div className="flex items-center gap-3 px-4 py-2.5 bg-neutral-50 border-b border-neutral-200">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-neutral-300" />
          <div className="w-3 h-3 rounded-full bg-neutral-300" />
          <div className="w-3 h-3 rounded-full bg-neutral-300" />
        </div>
        <div className="flex-1 text-center text-[10px] font-mono text-neutral-400 bg-white/80 rounded px-3 py-0.5 border border-neutral-200">
          {url}
        </div>
      </div>
      {children}
    </div>
  );
}

function ModuleLabel({ n, name, desc }: { n: string; name: string; desc: string }) {
  return (
    <div className="flex items-start gap-4 py-5 border-b border-neutral-200 mb-4">
      <div className="text-[11px] font-mono font-bold text-neutral-300 w-6 shrink-0 pt-0.5">{n}</div>
      <div>
        <h2 className="text-base font-bold text-neutral-700">{name}</h2>
        <p className="text-xs text-neutral-400 mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

// ─── Sketch sections ──────────────────────────────────────────────────────────

function SkNavbar() {
  return (
    <div className="relative flex h-12 items-center justify-between px-6 border-b border-[#4a5648]/10" style={{ backgroundColor: "#ede7de" }}>
      <Annotation>NAVBAR — fixed transparente en home · sticky crema en interior</Annotation>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded bg-[#4a5648]/30" />
        <div className="h-3 w-24 bg-[#4a5648]/45 rounded-sm" />
      </div>
      <div className="hidden md:flex items-center gap-6">
        {["Inicio", "Catálogo", "Arma tu ramo"].map((l) => (
          <div key={l} className="text-[9px] font-bold uppercase tracking-widest text-[#4a5648]/60 select-none">{l}</div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 h-7 rounded-full border border-[#4a5648]/22 text-[8px] text-[#4a5648]/55 select-none">
          🛍 Pedido
        </div>
        <div className="px-3 h-7 rounded-full bg-[#4a5648] text-white text-[8px] flex items-center select-none">
          Pedir ahora
        </div>
      </div>
    </div>
  );
}

function SkHomeHero() {
  return (
    <div className="relative flex" style={{ backgroundColor: "#ede7de", minHeight: 300 }}>
      <Annotation>HERO — pantalla completa, fondo crema · imagen derecha con fade</Annotation>
      <div className="w-[44%] flex flex-col justify-center pl-8 pr-6 py-10 z-10">
        <div className="text-[7px] font-bold uppercase tracking-[0.32em] text-[#8b7090] mb-3">Flower shop · Mérida, Yucatán</div>
        <BigH lines={3} className="mb-4" />
        <Lines n={2} lastW={55} className="mb-6" />
        <div className="flex flex-wrap gap-2 mb-6">
          <BtnFill label="Ver colección →" />
          <BtnLine label="Arma tu ramo" />
        </div>
        <div className="flex gap-4 mt-2">
          {["📦 Mismo día", "💳 Pago seguro", "📱 WhatsApp"].map((b) => (
            <div key={b} className="text-[7px] text-[#4a5648]/45 select-none">{b}</div>
          ))}
        </div>
      </div>
      <div className="flex-1 relative">
        <IMG className="absolute inset-0 w-full h-full" label="FOTO HERO HQ" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #ede7de 0%, #ede7deaa 22%, transparent 50%)" }} />
        <div className="absolute inset-x-0 bottom-0 h-[30%]" style={{ background: "linear-gradient(to top, #ede7de 0%, transparent 100%)" }} />
        <div className="absolute bottom-5 right-5 w-28 bg-white/90 rounded-xl p-2 shadow-md">
          <IMG className="h-16 rounded-lg w-full" label="card" />
          <div className="mt-1.5 h-1.5 w-3/4 bg-neutral-300 rounded-full" />
          <div className="mt-1 flex justify-between items-center">
            <div className="h-1.5 w-1/2 bg-neutral-200 rounded-full" />
            <div className="text-[7px] text-[#4a5648]">→</div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 left-8 flex items-center gap-2">
        <div className="w-5 h-5 rounded-full border border-[#4a5648]/20 flex items-center justify-center">
          <div className="text-[8px] text-[#4a5648]/40">↓</div>
        </div>
        <div className="text-[7px] text-[#4a5648]/35 font-bold uppercase tracking-widest select-none">Desliza</div>
      </div>
    </div>
  );
}

function SkHomeCategories() {
  return (
    <div className="relative px-8 py-4 border-t border-[#4a5648]/8" style={{ backgroundColor: "#ede7de" }}>
      <Annotation>CATEGORÍAS — tira horizontal con scroll en mobile</Annotation>
      <div className="flex items-center gap-2 overflow-hidden">
        {["Todos", "Ramos", "Con jarrón", "Plantas", "Detalles"].map((c, i) => (
          <Chip key={c} label={c} active={i === 0} />
        ))}
        <div className="ml-auto text-[8px] text-[#4a5648]/40 whitespace-nowrap select-none">Ver todo →</div>
      </div>
    </div>
  );
}

function SkHomeFeatured() {
  return (
    <div className="relative px-8 py-8" style={{ backgroundColor: "#ede7de" }}>
      <Annotation>DESTACADOS — 3 best-sellers · grid 3 col</Annotation>
      <div className="flex items-end justify-between mb-5">
        <div>
          <div className="text-[7px] font-bold uppercase tracking-[0.3em] text-[#8b7090] mb-1.5">Lo más pedido</div>
          <div className="h-5 w-44 bg-[#2c2116]/55 rounded-sm" />
        </div>
        <BtnLine label="Ver catálogo" sm />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <ProductCard />
        <ProductCard />
        <ProductCard />
      </div>
    </div>
  );
}

function SkHomeProcess() {
  return (
    <div className="relative px-8 py-10" style={{ backgroundColor: "#dccbb3" }}>
      <Annotation>CÓMO FUNCIONA — 3 pasos · diferenciador WhatsApp</Annotation>
      <div className="text-center mb-7">
        <div className="text-[7px] font-bold uppercase tracking-[0.3em] text-[#8b7090] mb-1.5">Proceso de compra</div>
        <div className="h-5 w-52 bg-[#2c2116]/55 rounded-sm mx-auto" />
      </div>
      <div className="grid grid-cols-3 gap-6">
        {[
          { n: "01", label: "Elige tu arreglo", sub: "Catálogo o ramo personalizado" },
          { n: "02", label: "Dedicatoria + entrega", sub: "Fecha, hora y mensaje" },
          { n: "03", label: "Recibe + WhatsApp", sub: "Seguimiento en tiempo real" },
        ].map((s) => (
          <div key={s.n} className="flex flex-col items-center text-center">
            <div className="text-[28px] font-bold text-[#4a5648]/12 leading-none mb-1">{s.n}</div>
            <Icon size={44} />
            <div className="mt-2 h-2 w-2/3 bg-[#2c2116]/50 rounded-full" />
            <div className="text-[8px] text-[#4a5648]/50 mt-1 select-none">{s.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkHomeCtaBand() {
  return (
    <div className="relative flex overflow-hidden" style={{ backgroundColor: "#4a5648", minHeight: 150 }}>
      <Annotation>BANDA CTA — Arma tu ramo · fondo oscuro para contraste</Annotation>
      <div className="flex-1 flex flex-col justify-center pl-8 py-8">
        <div className="text-[7px] font-bold uppercase tracking-[0.3em] text-white/45 mb-2">Personalizado</div>
        <div className="h-5 w-44 bg-white/35 rounded-sm mb-2" />
        <Lines n={2} lastW={70} className="mb-5 max-w-xs" />
        <div className="inline-flex px-5 py-1.5 rounded-full bg-[#ede7de] text-[#4a5648] text-[9px] font-bold select-none w-fit">
          Armar mi ramo →
        </div>
      </div>
      <div className="w-[38%] relative shrink-0">
        <IMG className="absolute inset-0 w-full h-full" label="FOTO RAMO" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #4a5648 0%, transparent 40%)" }} />
      </div>
    </div>
  );
}

function SkHomeTrust() {
  return (
    <div className="relative px-8 py-7 border-t border-[#4a5648]/8" style={{ backgroundColor: "#ede7de" }}>
      <Annotation>CONFIANZA — 4 propuestas de valor</Annotation>
      <div className="grid grid-cols-4 gap-4">
        {["Flores frescas diariamente", "Entrega el mismo día", "Pago 100% seguro", "Mérida, Yucatán"].map((item) => (
          <div key={item} className="flex flex-col items-center text-center gap-2 py-2">
            <Icon size={36} />
            <div className="text-[8px] font-semibold text-[#4a5648]/65 select-none">{item}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkFooter() {
  return (
    <div className="relative px-8 py-7 border-t border-[#4a5648]/10" style={{ backgroundColor: "#dccbb3" }}>
      <Annotation>FOOTER — 4 columnas: marca / tienda / ayuda / contacto</Annotation>
      <div className="grid grid-cols-4 gap-7">
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-4 h-4 rounded bg-[#4a5648]/30" />
            <div className="h-2.5 w-20 bg-[#4a5648]/40 rounded-sm" />
          </div>
          <Lines n={3} lastW={70} className="mb-3" h={5} gap={4} />
          <div className="flex gap-1.5 mt-3">
            <Icon size={22} />
            <Icon size={22} />
          </div>
        </div>
        {["Tienda", "Ayuda", "Contacto"].map((col) => (
          <div key={col}>
            <div className="h-2 w-14 bg-[#4a5648]/40 rounded-full mb-3" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-1.5 w-20 bg-neutral-400/40 rounded-full mb-2" />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-5 pt-4 border-t border-[#4a5648]/10 flex justify-between">
        <div className="h-1.5 w-40 bg-neutral-400/30 rounded-full" />
        <div className="h-1.5 w-24 bg-neutral-400/20 rounded-full" />
      </div>
    </div>
  );
}

function SkCatalogoHeader() {
  return (
    <div className="relative px-8 py-6 border-b border-[#4a5648]/10" style={{ backgroundColor: "#ede7de" }}>
      <Annotation>CATÁLOGO — header compacto (NO pantalla completa) + filtros inline</Annotation>
      <div className="flex items-end justify-between mb-5">
        <div>
          <div className="text-[7px] font-bold uppercase tracking-[0.3em] text-[#8b7090] mb-1.5">Catálogo floral</div>
          <div className="h-6 w-44 bg-[#2c2116]/60 rounded-sm mb-2" />
          <div className="flex flex-col gap-1">
            <div className="h-1.5 w-72 bg-neutral-300 rounded-full" />
            <div className="h-1.5 w-52 bg-neutral-200 rounded-full" />
          </div>
        </div>
        <div className="text-right">
          <div className="text-[8px] text-[#4a5648]/50 select-none">13 arreglos</div>
          <div className="text-[7px] text-[#4a5648]/35 mt-0.5 select-none">Mérida, Yucatán</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Chip label="Todos" active />
        <Chip label="Ramos" />
        <Chip label="Con jarrón" />
        <Chip label="Plantas" />
        <Chip label="Detalles" />
        <div className="ml-auto flex items-center gap-1.5 text-[8px] text-[#4a5648]/50 border border-[#4a5648]/15 rounded-lg px-2.5 py-1.5 select-none bg-white/50">
          Ordenar ↕
        </div>
      </div>
    </div>
  );
}

function SkCatalogoGrid() {
  return (
    <div className="relative px-8 py-7" style={{ backgroundColor: "#ede7de" }}>
      <Annotation>GRID — 3 col desktop · 2 col tablet · 1 col mobile</Annotation>
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCard key={i} />
        ))}
      </div>
      <div className="mt-7 flex justify-center">
        <BtnLine label="Cargar más" />
      </div>
    </div>
  );
}

function SkArmatuRamo() {
  const steps = ["Flor principal", "Complemento", "Follaje", "Presentación"];
  return (
    <div className="relative flex" style={{ backgroundColor: "#ede7de", minHeight: 400 }}>
      <Annotation>ARMA TU RAMO — constructor paso a paso + preview en vivo</Annotation>
      <div className="w-[56%] px-8 py-8">
        <div className="flex gap-1.5 mb-6">
          {steps.map((s, i) => (
            <div key={s} className="flex-1 min-w-0">
              <div className={`h-1 rounded-full ${i === 0 ? "bg-[#4a5648]" : "bg-[#4a5648]/15"}`} />
              <div className={`text-[7px] mt-1 truncate ${i === 0 ? "text-[#4a5648] font-bold" : "text-[#4a5648]/40"} select-none`}>{s}</div>
            </div>
          ))}
        </div>
        <div className="h-4 w-36 bg-[#2c2116]/55 rounded-sm mb-5" />
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`rounded-xl overflow-hidden border-2 cursor-default ${i === 0 ? "border-[#4a5648]" : "border-transparent"}`}>
              <IMG className="aspect-square w-full" label={`op ${i + 1}`} />
              <div className="px-2 py-1.5 bg-white/60">
                <div className="h-1.5 w-3/4 bg-neutral-300 rounded-full" />
                <div className="h-1 w-1/2 bg-neutral-200 rounded-full mt-1" />
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-5">
          <BtnLine label="← Atrás" sm />
          <BtnFill label="Siguiente →" sm />
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center border-l border-[#4a5648]/8 bg-[#dccbb3]/40 py-8 px-6">
        <div className="text-[7px] font-bold uppercase tracking-widest text-[#4a5648]/40 mb-3 select-none">Vista previa</div>
        <div className="w-44 h-44 rounded-2xl overflow-hidden bg-white/60 border border-[#4a5648]/10 shadow-sm">
          <IMG className="w-full h-full" label="PREVIEW RAMO" />
        </div>
        <div className="mt-3 text-[8px] text-[#4a5648]/50 select-none">Ramo personalizado</div>
        <div className="mt-1 h-3 w-20 bg-[#4a5648]/25 rounded" />
        <div className="mt-4 text-[9px] font-bold text-[#4a5648]/60 select-none">$XXX MXN</div>
        <div className="mt-3 flex gap-2">
          <BtnLine label="Compartir" sm />
          <BtnFill label="Al pedido" sm />
        </div>
      </div>
    </div>
  );
}

function SkCheckout() {
  return (
    <div className="relative px-8 py-8" style={{ backgroundColor: "#ede7de", minHeight: 420 }}>
      <Annotation>CHECKOUT — formulario izquierda · resumen sticky derecha</Annotation>
      <div className="mb-5">
        <div className="text-[7px] font-bold uppercase tracking-[0.3em] text-[#8b7090] mb-1.5">Finalizar pedido</div>
        <div className="h-5 w-40 bg-[#2c2116]/55 rounded-sm" />
      </div>
      <div className="flex gap-5">
        <div className="flex-1 flex flex-col gap-4">
          {[
            { title: "Datos de contacto", fields: 4 },
            { title: "Fecha de entrega", special: "calendar" },
            { title: "Método de pago", special: "brick" },
          ].map((sec) => (
            <div key={sec.title} className="rounded-xl border border-[#4a5648]/12 bg-white/55 p-4">
              <div className="h-2.5 w-32 bg-[#4a5648]/40 rounded-full mb-3" />
              {sec.fields && (
                <div className="grid grid-cols-2 gap-3">
                  {Array.from({ length: sec.fields }).map((_, i) => (
                    <div key={i} className="space-y-1">
                      <div className="h-1.5 w-16 bg-neutral-300 rounded-full" />
                      <div className="h-8 rounded-lg border border-[#4a5648]/15 bg-white/80" />
                    </div>
                  ))}
                </div>
              )}
              {sec.special === "calendar" && (
                <div className="h-36 rounded-lg bg-white/60 border border-[#4a5648]/10 flex items-center justify-center">
                  <span className="text-[9px] text-[#4a5648]/35 font-mono select-none">CALENDARIO DE ENTREGA</span>
                </div>
              )}
              {sec.special === "brick" && (
                <div className="h-24 rounded-lg bg-white/60 border border-[#4a5648]/10 flex items-center justify-center">
                  <span className="text-[9px] text-[#4a5648]/35 font-mono select-none">MERCADO PAGO BRICK</span>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="w-64 shrink-0">
          <div className="rounded-xl border border-[#4a5648]/12 bg-white/55 p-4 sticky top-20">
            <div className="h-2.5 w-24 bg-[#4a5648]/40 rounded-full mb-4" />
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-2 mb-3">
                <IMG className="w-12 h-12 rounded-lg shrink-0" label="item" />
                <div className="flex-1 min-w-0">
                  <div className="h-1.5 w-full bg-neutral-300 rounded-full" />
                  <div className="h-1.5 w-2/3 bg-neutral-200 rounded-full mt-1.5" />
                  <div className="h-1.5 w-1/3 bg-neutral-200 rounded-full mt-1" />
                </div>
              </div>
            ))}
            <div className="border-t border-[#4a5648]/10 pt-3 mt-1 space-y-2">
              {["Subtotal", "Envío", "Total"].map((l, i) => (
                <div key={l} className="flex justify-between">
                  <div className={`h-1.5 rounded-full ${i === 2 ? "w-10 bg-neutral-400" : "w-12 bg-neutral-200"}`} />
                  <div className={`h-1.5 rounded-full ${i === 2 ? "w-12 bg-[#4a5648]/50" : "w-10 bg-neutral-200"}`} />
                </div>
              ))}
            </div>
            <BtnFill label="Confirmar y pagar" className="w-full mt-4 justify-center" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SkConfirmacion() {
  return (
    <div className="relative px-8 py-14 flex flex-col items-center text-center" style={{ backgroundColor: "#ede7de", minHeight: 340 }}>
      <Annotation>CONFIRMACIÓN — estado de éxito · nota WhatsApp</Annotation>
      <div className="w-16 h-16 rounded-full bg-[#4a5648]/10 flex items-center justify-center mb-5 border border-[#4a5648]/15">
        <div className="w-8 h-8 rounded-full bg-[#4a5648]/25 flex items-center justify-center">
          <div className="text-[14px] text-[#4a5648]/60">✓</div>
        </div>
      </div>
      <div className="h-5 w-52 bg-[#2c2116]/55 rounded-sm mb-3 mx-auto" />
      <Lines n={2} lastW={60} className="max-w-xs mx-auto" />
      <div className="mt-7 w-72 rounded-2xl bg-white/70 border border-[#4a5648]/12 p-4 text-left shadow-sm">
        <div className="h-2 w-20 bg-[#4a5648]/30 rounded-full mb-3" />
        {["Pedido #FB-0421", "Entrega: 22 mayo", "Total: $789 MXN"].map((l) => (
          <div key={l} className="flex justify-between mb-2">
            <div className="h-1.5 w-24 bg-neutral-300 rounded-full" />
            <div className="h-1.5 w-20 bg-neutral-200 rounded-full" />
          </div>
        ))}
      </div>
      <div className="mt-5 flex gap-3">
        <BtnFill label="Ver mis pedidos" />
        <BtnLine label="Seguir comprando" />
      </div>
      <div className="mt-5 flex items-center gap-2 text-[8px] text-[#4a5648]/50 select-none">
        <div className="w-4 h-4 rounded-full bg-green-400/40 flex items-center justify-center">
          <div className="text-[8px]">💬</div>
        </div>
        Recibirás confirmación y seguimiento por WhatsApp
      </div>
    </div>
  );
}

function SkAdmin() {
  const statuses = [
    { label: "Nuevo", color: "bg-amber-100 text-amber-700" },
    { label: "En proceso", color: "bg-blue-100 text-blue-600" },
    { label: "Entregado", color: "bg-green-100 text-green-700" },
    { label: "Cancelado", color: "bg-neutral-100 text-neutral-400" },
  ];
  return (
    <div className="relative flex" style={{ backgroundColor: "#f5f4f0", minHeight: 400 }}>
      <Annotation>ADMIN — sidebar + tabs de estado + tabla de pedidos</Annotation>
      <div className="w-44 shrink-0 bg-[#4a5648]/5 border-r border-[#4a5648]/10 px-3 py-5">
        <div className="h-5 w-24 bg-[#4a5648]/25 rounded-sm mb-6" />
        {[{ l: "Pedidos", active: true }, { l: "Productos", active: false }, { l: "Clientes", active: false }, { l: "Config", active: false }].map((item) => (
          <div key={item.l} className={`flex items-center gap-2 rounded-lg px-2 py-1.5 mb-1 ${item.active ? "bg-[#4a5648]/10" : ""}`}>
            <Icon size={20} />
            <div className={`text-[8px] select-none ${item.active ? "text-[#4a5648] font-bold" : "text-[#4a5648]/45"}`}>{item.l}</div>
          </div>
        ))}
      </div>
      <div className="flex-1 px-6 py-5 min-w-0">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 w-28 bg-[#2c2116]/45 rounded-sm" />
          <div className="flex gap-2">
            <div className="h-7 w-24 rounded-lg border border-[#4a5648]/15 bg-white/60" />
            <div className="h-7 w-24 rounded-lg bg-[#4a5648]/80 flex items-center justify-center text-[8px] text-white select-none">+ Nuevo pedido</div>
          </div>
        </div>
        <div className="flex gap-1.5 mb-4">
          {statuses.map((s, i) => (
            <div key={s.label} className={`px-2.5 py-1 rounded-full text-[7px] font-bold select-none ${i === 0 ? "bg-[#4a5648] text-white" : "bg-white/70 text-[#4a5648]/50 border border-[#4a5648]/12"}`}>
              {s.label}
            </div>
          ))}
        </div>
        <div className="rounded-xl overflow-hidden border border-[#4a5648]/10 bg-white/60">
          <div className="grid gap-2 px-4 py-2 bg-[#4a5648]/5 border-b border-[#4a5648]/8" style={{ gridTemplateColumns: "80px 1fr 1fr 70px 90px" }}>
            {["#", "Cliente", "Arreglo", "Total", "Estado"].map((h) => (
              <div key={h} className="text-[7px] font-bold uppercase tracking-wider text-[#4a5648]/45 select-none">{h}</div>
            ))}
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="grid gap-2 px-4 py-3 border-b border-[#4a5648]/5 items-center" style={{ gridTemplateColumns: "80px 1fr 1fr 70px 90px" }}>
              <div className="h-1.5 w-10 bg-neutral-300 rounded-full" />
              <div>
                <div className="h-1.5 w-24 bg-neutral-300 rounded-full" />
                <div className="h-1 w-16 bg-neutral-200 rounded-full mt-1.5" />
              </div>
              <div className="h-1.5 w-20 bg-neutral-200 rounded-full" />
              <div className="h-1.5 w-10 bg-[#4a5648]/25 rounded-full" />
              <div className={`px-2 py-0.5 rounded-full text-[6px] font-bold text-center select-none ${statuses[i % statuses.length].color}`}>
                {statuses[i % statuses.length].label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

const modules = [
  "navbar", "home", "catalogo", "arma-tu-ramo",
  "checkout", "confirmacion", "admin", "footer",
];

export default function SketchesPage() {
  return (
    <div style={{ backgroundColor: "#f0eeeb", minHeight: "100vh" }}>
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="text-[10px] font-mono text-neutral-400 mb-2 uppercase tracking-widest">
            Fresh Bloom · Layout Sketches · Mayo 2026
          </div>
          <h1 className="text-3xl font-bold text-neutral-700 mb-2" style={{ fontFamily: "system-ui, sans-serif" }}>
            Propuesta de layout — todos los módulos
          </h1>
          <p className="text-sm text-neutral-500 max-w-2xl">
            Wireframes de la estructura propuesta para cada página. Los colores son aproximaciones de la paleta de marca; tipografía y espacio final se ajustan en la implementación.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {modules.map((id) => (
              <a
                key={id}
                href={`#${id}`}
                className="text-[9px] font-bold uppercase tracking-widest text-neutral-500 border border-neutral-300 rounded-full px-3 py-1 bg-white/80 hover:bg-white transition-colors"
                style={{ fontFamily: "system-ui" }}
              >
                {id}
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-16">

          {/* 00 — NAVBAR */}
          <div id="navbar">
            <ModuleLabel n="00" name="Navbar" desc="Fija en home (transparente sobre la foto) · sticky crema con blur en páginas interiores · carrito con contador." />
            <BrowserFrame url="★ compartida en todas las páginas">
              <SkNavbar />
            </BrowserFrame>
          </div>

          {/* 01 — HOME */}
          <div id="home">
            <ModuleLabel n="01" name="Home" desc="Landing de conversión completa: hero → categorías → 3 destacados → cómo funciona → CTA ramo → confianza → footer." />
            <BrowserFrame url="fresh-bloom.mx">
              <SkNavbar />
              <SkHomeHero />
              <SkHomeCategories />
              <SkHomeFeatured />
              <SkHomeProcess />
              <SkHomeCtaBand />
              <SkHomeTrust />
              <SkFooter />
            </BrowserFrame>
          </div>

          {/* 02 — CATÁLOGO */}
          <div id="catalogo">
            <ModuleLabel n="02" name="Catálogo" desc="Header compacto (sin pantalla completa) → filtros de categoría inline → grid 3 columnas. Acceso inmediato a los productos." />
            <BrowserFrame url="fresh-bloom.mx/productos">
              <SkNavbar />
              <SkCatalogoHeader />
              <SkCatalogoGrid />
              <SkFooter />
            </BrowserFrame>
          </div>

          {/* 03 — ARMA TU RAMO */}
          <div id="arma-tu-ramo">
            <ModuleLabel n="03" name="Arma tu ramo" desc="Constructor paso a paso: flor principal → complemento → follaje → presentación. Preview del ramo en tiempo real a la derecha." />
            <BrowserFrame url="fresh-bloom.mx/arma-tu-ramo">
              <SkNavbar />
              <SkArmatuRamo />
              <SkFooter />
            </BrowserFrame>
          </div>

          {/* 04 — CHECKOUT */}
          <div id="checkout">
            <ModuleLabel n="04" name="Checkout" desc="Formulario en dos columnas: datos + entrega + Mercado Pago izquierda · resumen del pedido sticky derecha." />
            <BrowserFrame url="fresh-bloom.mx/checkout">
              <SkNavbar />
              <SkCheckout />
              <SkFooter />
            </BrowserFrame>
          </div>

          {/* 05 — CONFIRMACIÓN */}
          <div id="confirmacion">
            <ModuleLabel n="05" name="Confirmación" desc="Estado de éxito centrado con detalle del pedido + nota de seguimiento por WhatsApp." />
            <BrowserFrame url="fresh-bloom.mx/confirmation">
              <SkNavbar />
              <SkConfirmacion />
              <SkFooter />
            </BrowserFrame>
          </div>

          {/* 06 — ADMIN */}
          <div id="admin">
            <ModuleLabel n="06" name="Admin" desc="Panel interno: sidebar de navegación · tabs por estado del pedido · tabla con acciones rápidas." />
            <BrowserFrame url="fresh-bloom.mx/admin">
              <SkAdmin />
            </BrowserFrame>
          </div>

          {/* 07 — FOOTER */}
          <div id="footer">
            <ModuleLabel n="07" name="Footer" desc="4 columnas: marca + redes · tienda · ayuda · contacto y horario. Fondo arena para diferenciarlo del body crema." />
            <BrowserFrame url="★ compartido en todas las páginas">
              <SkFooter />
            </BrowserFrame>
          </div>

        </div>

        <div className="mt-14 pt-6 border-t border-neutral-200">
          <p className="text-[11px] text-neutral-400" style={{ fontFamily: "system-ui" }}>
            Fresh Bloom · Layout Sketches · Todos los módulos son propuestas sujetas a revisión.
          </p>
        </div>
      </div>
    </div>
  );
}

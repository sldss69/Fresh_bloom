"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CreditCard, Leaf, MapPin, MessageCircle, ShoppingBag, Star, Truck, CheckCircle } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { products } from "@/lib/mock-products";
import { TransparentImage } from "@/components/ui/TransparentImage";
import { DeliveryCountdown } from "@/components/ui/DeliveryCountdown";

// ─── Variantes reutilizables ──────────────────────────────────────────────────

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.62, delay, ease: EASE },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.55, delay, ease: EASE },
  }),
};

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type FeaturedProduct = {
  id: string;
  name: string;
  price: number;
  image?: string;
  category?: string;
  description?: string;
};

// ─── Datos ────────────────────────────────────────────────────────────────────

const FEATURED: FeaturedProduct[] = products
  .filter((p) => ["luna-roja", "dulce-elegancia", "aura-floral"].includes(p.id))
  .map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image,
    category: p.tag,
    description: p.description,
  }));

const TESTIMONIALS = [
  {
    name: "Karla M.",
    location: "Mérida Centro",
    stars: 5,
    quote: "Pedí a las 11am y llegaron antes de las 2pm. Mi mamá no podía creer lo hermosas que eran. El packaging es precioso y las flores venían completamente frescas.",
    date: "hace 3 días",
  },
  {
    name: "Andrea T.",
    location: "Altabrisa, Mérida",
    stars: 5,
    quote: "Usé el constructor de ramos y fue súper fácil elegir cada elemento. El resultado superó todas mis expectativas. La mejor florería en línea de Mérida.",
    date: "hace 1 semana",
  },
  {
    name: "Roberto E.",
    location: "Montejo, Mérida",
    stars: 5,
    quote: "La atención por WhatsApp es increíble — me ayudaron a elegir la combinación perfecta para el aniversario de mis papás. Todos preguntaron de dónde eran.",
    date: "hace 2 semanas",
  },
  {
    name: "Sofía C.",
    location: "Cholul, Mérida",
    stars: 5,
    quote: "El arreglo llegó con la dedicatoria escrita perfectamente. La caja tenía un detalle de papel kraft y listón que hizo todo mucho más especial.",
    date: "hace 3 semanas",
  },
];

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function ProductCard({ product, index }: { product: FeaturedProduct; index: number }) {
  const isEmpty = !product.name;
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${y * -10}deg) scale3d(1.02,1.02,1.02)`;
  }

  function handleMouseEnter() {
    if (ref.current) ref.current.style.willChange = "transform";
  }

  function handleMouseLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "";
    el.style.willChange = "auto";
  }

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      custom={index * 0.1}
      viewport={{ once: true, margin: "-40px" }}
      className="group rounded-2xl overflow-hidden bg-white/75 border border-brand-wine/8 shadow-sm transition-shadow hover:shadow-lg"
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: "transform 0.15s ease, box-shadow 0.15s ease" }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-beige/25">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 90vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-brand-beige/30 text-brand-wine">
            <Leaf className="h-9 w-9 opacity-20" />
            <span className="text-[0.58rem] font-semibold tracking-[0.3em] uppercase opacity-30">
              {product.category ?? "floral"}
            </span>
          </div>
        )}
        {product.category && (
          <span className="absolute left-3 top-3 rounded-full bg-white/88 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-brand-wine backdrop-blur-sm">
            {product.category}
          </span>
        )}
      </div>
      <div className="p-4">
        {isEmpty ? (
          <div className="space-y-2">
            <div className="h-3.5 w-3/4 rounded-full bg-brand-beige/60" />
            <div className="h-2.5 w-full rounded-full bg-brand-beige/40" />
            <div className="h-2.5 w-1/2 rounded-full bg-brand-beige/40" />
          </div>
        ) : (
          <>
            <h3 className="font-heading text-base font-semibold text-brand-ink">{product.name}</h3>
            {product.description && (
              <p className="mt-1 text-xs leading-5 text-brand-ink/55 line-clamp-2">{product.description}</p>
            )}
          </>
        )}
        <div className="mt-3 flex items-center justify-between">
          {product.price > 0 ? (
            <span className="text-sm font-bold text-brand-wine">
              ${product.price.toLocaleString("es-MX")}{" "}
              <span className="text-[10px] font-normal text-brand-ink/40">MXN</span>
            </span>
          ) : (
            <span className="text-[10px] italic text-brand-wine/35">precio por definir</span>
          )}
          <button
            type="button"
            className="rounded-full bg-brand-wine px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white transition hover:bg-brand-red"
          >
            + Pedir
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function TestimonialCard({ item, index }: { item: typeof TESTIMONIALS[0]; index: number }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      custom={index * 0.1}
      viewport={{ once: true, margin: "-40px" }}
      className="relative flex flex-col gap-4 rounded-2xl border border-brand-wine/10 bg-white p-6 shadow-sm"
    >
      {/* Decorative quote mark */}
      <span
        className="pointer-events-none absolute right-5 top-3 select-none font-heading text-7xl leading-none text-brand-wine/7"
        aria-hidden="true"
      >
        "
      </span>

      {/* Stars */}
      <div className="flex gap-0.5">
        {Array.from({ length: item.stars }).map((_, i) => (
          <Star key={i} className="h-3.5 w-3.5 fill-brand-wine text-brand-wine" />
        ))}
      </div>

      {/* Quote */}
      <p className="font-heading text-[0.95rem] font-medium italic leading-[1.78] text-brand-ink/78">
        "{item.quote}"
      </p>

      {/* Customer */}
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-brand-wine/8 pt-4">
        <div>
          <p className="text-sm font-semibold text-brand-ink">{item.name}</p>
          <p className="text-[0.65rem] text-brand-ink/42">{item.location}</p>
        </div>
        <p className="shrink-0 text-[0.62rem] text-brand-ink/32">{item.date}</p>
      </div>
    </motion.div>
  );
}

// ─── HomePage ─────────────────────────────────────────────────────────────────

export function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const bouquetY = useTransform(heroScroll, [0, 1], [0, -140]);

  return (
    <>
      {/* ════════════════════════════════════════════════════════════════════
          1 · HERO
      ════════════════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-[100svh] overflow-hidden bg-brand-cream">

        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.05, ease: EASE, delay: 0.2 }}
          className="pointer-events-none absolute inset-y-0 right-0 flex w-[58%] items-center justify-center overflow-hidden"
          style={{ backgroundColor: "#F7EFE8" }}
        >
          <motion.div style={{ y: bouquetY }} className="w-full flex items-center justify-center">
            <Image
              src="/images/landing/fresh-bloom-hero-bouquet-bg.png"
              alt="Arreglo floral Fresh Bloom"
              width={1396}
              height={1127}
              priority
              unoptimized
              className="w-full h-auto max-h-[110svh] object-contain brightness-[1.04]"
            />
          </motion.div>
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-[35%]"
            style={{ background: "linear-gradient(to right, #F7EFE8 0%, #F7EFE8cc 50%, transparent 100%)" }}
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[20%]"
            style={{ background: "linear-gradient(to top, #F7EFE8 0%, transparent 100%)" }}
          />
        </motion.div>

        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl items-center px-6 pb-20 pt-32 sm:px-10 md:pt-0">
          <div className="max-w-[42%]">

            <motion.p
              variants={fadeUp} initial="hidden" animate="visible" custom={0.05}
              className="mb-4 text-[0.62rem] font-bold uppercase tracking-[0.32em] text-brand-red"
            >
              Flower shop · Mérida, Yucatán
            </motion.p>

            <motion.h1
              variants={fadeUp} initial="hidden" animate="visible" custom={0.18}
              className="font-heading text-[clamp(3rem,5.2vw,5rem)] font-bold leading-[0.93] text-brand-ink"
            >
              Flores que<br />
              cuentan<br />
              historias
            </motion.h1>

            <motion.p
              variants={fadeUp} initial="hidden" animate="visible" custom={0.32}
              className="mt-6 max-w-[19rem] text-sm leading-[1.85] text-brand-ink/52"
            >
              Ramos únicos para momentos inolvidables.
              Hechos con amor, dedicación y los mejores detalles.
            </motion.p>

            <motion.div
              variants={fadeUp} initial="hidden" animate="visible" custom={0.44}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link
                href="/productos"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-wine px-7 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-white transition-all hover:bg-brand-red hover:gap-3"
              >
                Ver colección
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/arma-tu-ramo"
                className="inline-flex h-11 items-center rounded-full border border-brand-wine/28 px-6 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-brand-wine transition-all hover:border-brand-wine/55 hover:bg-brand-wine/6"
              >
                Arma tu ramo
              </Link>
            </motion.div>

            {/* Countdown de entrega */}
            <motion.div
              variants={fadeUp} initial="hidden" animate="visible" custom={0.52}
              className="mt-5"
            >
              <DeliveryCountdown />
            </motion.div>

            <motion.div
              variants={fadeUp} initial="hidden" animate="visible" custom={0.60}
              className="mt-5 flex flex-wrap gap-4"
            >
              {[
                { icon: CreditCard, label: "Pago seguro" },
                { icon: MessageCircle, label: "WhatsApp" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-[0.63rem] text-brand-ink/42">
                  <Icon className="h-3 w-3 text-brand-wine/45" />
                  {label}
                </div>
              ))}
            </motion.div>

          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.7 }}
          className="absolute bottom-7 left-6 z-10 flex items-center gap-2.5 sm:left-10"
          aria-hidden="true"
        >
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-brand-wine/18 bg-brand-cream/60"
          >
            <span className="text-[10px] text-brand-ink/40">↓</span>
          </motion.div>
          <span className="text-[0.58rem] font-bold uppercase tracking-[0.28em] text-brand-ink/35">Desliza</span>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          2 · CATEGORÍAS
      ════════════════════════════════════════════════════════════════════ */}
      <motion.section
        variants={fadeIn} initial="hidden" whileInView="visible" custom={0}
        viewport={{ once: true }}
        className="border-y border-brand-wine/8 bg-brand-cream"
      >
        <div className="no-scrollbar mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto px-6 py-3.5 sm:px-10">
          {[
            { label: "Todos", href: "/productos" },
            { label: "Ramos", href: "/productos?cat=ramos" },
            { label: "Con jarrón", href: "/productos?cat=jarron" },
            { label: "Plantas", href: "/productos?cat=plantas" },
            { label: "Detalles", href: "/productos?cat=detalles" },
          ].map((cat, i) => (
            <Link
              key={cat.label}
              href={cat.href}
              className={`shrink-0 rounded-full px-4 py-1.5 text-[0.68rem] font-semibold transition-all ${
                i === 0
                  ? "bg-brand-wine text-white"
                  : "border border-brand-wine/18 bg-white/50 text-brand-wine/65 hover:border-brand-wine/38 hover:bg-white/80 hover:text-brand-wine"
              }`}
            >
              {cat.label}
            </Link>
          ))}
          <Link
            href="/productos"
            className="ml-auto shrink-0 text-[0.63rem] text-brand-wine/48 transition hover:text-brand-wine"
          >
            Ver todo →
          </Link>
        </div>
      </motion.section>

      {/* ════════════════════════════════════════════════════════════════════
          3 · DESTACADOS
      ════════════════════════════════════════════════════════════════════ */}
      <section className="bg-brand-cream py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" custom={0}
            viewport={{ once: true, margin: "-50px" }}
            className="mb-8 flex items-end justify-between"
          >
            <div>
              <p className="mb-1.5 text-[0.62rem] font-bold uppercase tracking-[0.3em] text-brand-red">Lo más pedido</p>
              <h2 className="font-heading text-3xl font-bold text-brand-ink md:text-4xl">Arreglos de la casa</h2>
            </div>
            <Link
              href="/productos"
              className="text-[0.7rem] font-semibold text-brand-wine/62 underline-offset-4 transition hover:text-brand-wine hover:underline"
            >
              Ver catálogo
            </Link>
          </motion.div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          4 · TESTIMONIOS
      ════════════════════════════════════════════════════════════════════ */}
      <section className="bg-brand-cream py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" custom={0}
            viewport={{ once: true, margin: "-50px" }}
            className="mb-10 text-center"
          >
            <p className="mb-2 text-[0.62rem] font-bold uppercase tracking-[0.3em] text-brand-red">Reseñas</p>
            <h2 className="font-heading text-3xl font-bold text-brand-ink md:text-4xl">Lo que dicen nuestros clientes</h2>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-brand-ink/50">
              Cada arreglo cargado de intención — aquí van algunas historias.
            </p>
          </motion.div>
          <div className="grid gap-5 sm:grid-cols-2">
            {TESTIMONIALS.map((item, i) => (
              <TestimonialCard key={item.name} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          5 · CÓMO FUNCIONA
      ════════════════════════════════════════════════════════════════════ */}
      <section className="bg-brand-cream py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" custom={0}
            viewport={{ once: true, margin: "-50px" }}
            className="mb-14 text-center"
          >
            <p className="mb-2 text-[0.62rem] font-bold uppercase tracking-[0.3em] text-brand-red">Proceso de compra</p>
            <h2 className="font-heading text-3xl font-bold text-brand-ink md:text-4xl">Simple y a tu ritmo</h2>
          </motion.div>

          <div className="relative grid gap-5 md:grid-cols-3">
            <div
              className="absolute hidden md:block"
              style={{
                top: "2.75rem",
                left: "calc(100% / 6)",
                right: "calc(100% / 6)",
                height: "1px",
                background: "linear-gradient(to right, transparent, #C47A3D40, #C47A3D40, transparent)",
              }}
              aria-hidden="true"
            />
            {[
              {
                n: "01",
                Icon: ShoppingBag,
                title: "Elige tu arreglo",
                desc: "Explora el catálogo o arma tu ramo personalizado eligiendo cada elemento a tu gusto.",
              },
              {
                n: "02",
                Icon: MapPin,
                title: "Dedicatoria y entrega",
                desc: "Agrega un mensaje especial y elige fecha, hora y dirección de entrega en Mérida.",
              },
              {
                n: "03",
                Icon: CheckCircle,
                title: "Paga y recibe",
                desc: "Pago seguro en línea. Confirmación instantánea y seguimiento por WhatsApp.",
              },
            ].map((step, i) => (
              <motion.div
                key={step.n}
                variants={fadeUp} initial="hidden" whileInView="visible" custom={i * 0.13}
                viewport={{ once: true, margin: "-60px" }}
                className="flex flex-col items-center gap-5 rounded-2xl border border-brand-wine/10 bg-white px-6 py-8 text-center shadow-sm"
              >
                <div className="relative flex items-center justify-center">
                  <span
                    className="absolute font-heading text-[5.5rem] font-black leading-none select-none"
                    style={{ color: "#C47A3D0A" }}
                    aria-hidden="true"
                  >
                    {step.n}
                  </span>
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-brand-wine shadow-md">
                    <step.Icon className="h-5 w-5 text-white" strokeWidth={1.8} />
                  </div>
                </div>
                <span className="text-[0.6rem] font-black uppercase tracking-[0.28em] text-brand-wine/50">
                  Paso {step.n}
                </span>
                <div>
                  <h3 className="font-heading text-xl font-bold text-brand-ink">{step.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-brand-ink/65">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          6 · NUESTRA HISTORIA
      ════════════════════════════════════════════════════════════════════ */}
      <section className="bg-brand-cream py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <div className="grid items-center gap-12 md:grid-cols-2">

            {/* Texto */}
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" custom={0}
              viewport={{ once: true, margin: "-60px" }}
            >
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.3em] text-brand-red">Nuestra historia</p>
              <h2 className="font-heading mt-3 text-3xl font-bold leading-tight text-brand-ink md:text-4xl">
                Cada ramo<br />tiene alma
              </h2>
              <div className="mt-6 space-y-4 text-sm leading-[1.9] text-brand-ink/62">
                <p>
                  Fresh Bloom nació en Mérida con una idea simple: que las flores no fueran solo un regalo, sino una forma de decir exactamente lo que sientes.
                </p>
                <p>
                  Cada arreglo se hace a mano, seleccionando una por una las flores más frescas del mercado local. No hay dos ramos iguales — cada uno lleva la intención de quien lo pide.
                </p>
                <p>
                  Trabajamos con entrega el mismo día porque los momentos que importan no pueden esperar.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                {[
                  { stat: "500+", label: "arreglos entregados" },
                  { stat: "4.9★", label: "calificación promedio" },
                  { stat: "100%", label: "hecho a mano" },
                ].map(({ stat, label }) => (
                  <div key={label} className="rounded-xl border border-brand-wine/12 bg-white px-4 py-3 text-center shadow-sm">
                    <p className="font-heading text-xl font-bold text-brand-wine">{stat}</p>
                    <p className="mt-0.5 text-[0.62rem] font-medium text-brand-ink/50">{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Visual editorial */}
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" custom={0.15}
              viewport={{ once: true, margin: "-60px" }}
              className="relative"
            >
              {/* Imagen principal placeholder */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-brand-wine/10 bg-gradient-to-br from-brand-beige/60 via-brand-cream to-brand-mauve/20">
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-brand-wine/18">
                  <Leaf className="h-20 w-20" />
                </div>
                {/* Overlay interior decorativo */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-brand-beige/40 to-transparent" />
              </div>

              {/* Badge flotante — "Hecho en Mérida" */}
              <div className="absolute -bottom-4 -left-4 rounded-2xl bg-brand-wine px-5 py-3 shadow-lg">
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white/90">
                  Hecho en Mérida, Yucatán
                </p>
              </div>

              {/* Pill flotante superior */}
              <div className="absolute -right-3 top-6 rounded-full border border-brand-wine/15 bg-white px-4 py-2 shadow-md">
                <p className="text-[0.62rem] font-semibold text-brand-ink/65">
                  🌸 Flores frescas cada día
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          7 · CTA — ARMA TU RAMO
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-brand-wine">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-16 sm:px-10 md:grid-cols-2 md:items-center md:py-20">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" custom={0}
            viewport={{ once: true, margin: "-80px" }}
          >
            <p className="mb-3 text-[0.62rem] font-bold uppercase tracking-[0.3em] text-white/48">Personalizado</p>
            <h2 className="font-heading text-3xl font-bold leading-tight text-white md:text-4xl">
              Arma tu ramo<br />como tú lo imaginas
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-[1.8] text-white/62">
              Elige flor principal, complemento, follaje y presentación.
              Te lo confirmamos por WhatsApp antes de armar.
            </p>
            <Link
              href="/arma-tu-ramo"
              className="mt-7 inline-flex h-11 items-center gap-2 rounded-full bg-brand-cream px-7 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-brand-wine transition-all hover:bg-white hover:gap-3"
            >
              Armar mi ramo
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" custom={0.15}
            viewport={{ once: true, margin: "-80px" }}
            className="mx-auto w-full max-w-sm"
          >
            <TransparentImage
              src="/images/landing/fresh-bloom-hero-bouquet.png"
              alt="Ramo personalizado Fresh Bloom"
              width={700}
              height={700}
              className="w-full h-auto drop-shadow-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          8 · CONFIANZA
      ════════════════════════════════════════════════════════════════════ */}
      <section className="border-t border-brand-wine/8 bg-brand-cream py-12">
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { icon: Leaf, title: "Flores frescas", sub: "Seleccionadas cada día" },
              { icon: Truck, title: "Entrega el mismo día", sub: "Pedidos antes de las 2 pm" },
              { icon: CreditCard, title: "Pago seguro", sub: "Mercado Pago y efectivo" },
              { icon: MessageCircle, title: "Seguimiento", sub: "Confirmación por WhatsApp" },
            ].map(({ icon: Icon, title, sub }, i) => (
              <motion.div
                key={title}
                variants={fadeUp} initial="hidden" whileInView="visible" custom={i * 0.08}
                viewport={{ once: true, margin: "-30px" }}
                className="flex flex-col items-center gap-2 text-center"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-wine/16 bg-white/65">
                  <Icon className="h-4 w-4 text-brand-wine/65" />
                </div>
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-brand-wine">{title}</p>
                <p className="text-[0.66rem] text-brand-ink/48">{sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

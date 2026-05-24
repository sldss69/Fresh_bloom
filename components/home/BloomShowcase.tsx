"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { motion } from "motion/react";

const BG = "#ede7dd";

function TulipSVG() {
  return (
    <motion.svg
      width="100"
      height="480"
      viewBox="0 0 100 480"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <motion.path
        d="M 50 470 C 47 410 44 368 47 314 C 50 260 54 228 51 182 C 49 158 48 142 50 122"
        stroke="rgba(30,27,20,0.22)"
        strokeWidth="1.2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut", delay: 0.3 }}
      />
      <motion.path
        d="M 50 278 C 32 258 20 234 24 210 C 38 224 48 248 50 278 Z"
        stroke="rgba(30,27,20,0.18)"
        strokeWidth="1.1"
        fill="rgba(30,27,20,0.03)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 1.5 }}
      />
      <motion.path
        d="M 50 122 C 32 102 22 74 28 48 C 34 26 44 12 50 6 C 56 12 66 26 72 48 C 78 74 68 102 50 122 Z"
        stroke="rgba(30,27,20,0.22)"
        strokeWidth="1.2"
        fill="rgba(30,27,20,0.04)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.1, ease: "easeOut", delay: 2 }}
      />
      <motion.path
        d="M 50 122 C 50 90 50 52 50 6"
        stroke="rgba(30,27,20,0.1)"
        strokeWidth="0.9"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 2.9 }}
      />
    </motion.svg>
  );
}

export function BloomShowcase() {
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden" style={{ backgroundColor: BG }}>

      {/* ── Hero image — right column only ──────────────────── */}
      <div
        className="absolute bottom-0 right-0 top-0 w-full md:w-[62%]"
      >
        <Image
          src="/images/landing/fresh-bloom-hero-vase-hq.png"
          alt="Arreglo floral blanco en florero de cerámica"
          fill
          priority
          quality={100}
          sizes="(min-width: 768px) 62vw, 100vw"
          className="object-contain object-right-bottom opacity-15 md:opacity-100"
        />
        {/* Tint overlay — pulls photo colors toward page background */}
        <div className="pointer-events-none absolute inset-0" style={{ backgroundColor: `${BG}28` }} />
        {/* Bottom sweep — covers the darker surface/floor of the photo */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0"
          style={{ height: "38%", background: `linear-gradient(to top, ${BG} 0%, ${BG}dd 22%, ${BG}77 55%, transparent 100%)` }}
        />
        {/* Left sweep — blends photo into left text column */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-[32%]"
          style={{ background: `linear-gradient(to right, ${BG} 0%, ${BG}dd 45%, transparent 100%)` }}
        />
        {/* Top sweep */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-36"
          style={{ background: `linear-gradient(to bottom, ${BG} 0%, transparent 100%)` }}
        />
      </div>

      {/* Pure background block on the left — no photo bleeds here */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 hidden md:block"
        style={{ width: "40%", backgroundColor: BG }}
      />

      {/* ── Line art ──────────────────────────────────────────── */}
      <div
        className="pointer-events-none absolute bottom-0 top-0 hidden items-center md:flex"
        style={{ left: "42%" }}
      >
        <TulipSVG />
      </div>

      {/* ── Content ───────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl items-center px-6 pb-24 pt-36 sm:px-10 md:pt-0">
        <div className="max-w-[30rem]">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading text-[clamp(3rem,5.5vw,5rem)] font-bold uppercase leading-[0.95] text-[#1e1b14]"
          >
            Flores que
            <br />
            cuentan
            <br />
            historias
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32, ease: "easeOut" }}
            className="mt-7 max-w-[20rem] text-sm leading-[1.85] text-[#3d3526]/60"
          >
            Ramos únicos para momentos inolvidables.
            Hechos con amor, dedicación y los mejores detalles.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.46, ease: "easeOut" }}
            className="mt-9"
          >
            <Link
              href="/productos"
              className="inline-flex h-11 items-center justify-center rounded-full border border-[#1e1b14]/22 bg-transparent px-8 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#1e1b14] transition-all duration-200 hover:bg-[#1e1b14]/6"
            >
              Descubrir más
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ── Scroll indicator ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-6 z-10 flex items-center gap-3 sm:left-10"
        aria-hidden="true"
      >
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-[#1e1b14]/15"
          style={{ backgroundColor: `${BG}60` }}
        >
          <ArrowDown className="h-3 w-3 text-[#1e1b14]/50" />
        </motion.div>
        <span className="text-[0.6rem] font-bold uppercase tracking-[0.28em] text-[#1e1b14]/38">
          Desliza para descubrir
        </span>
      </motion.div>
    </section>
  );
}

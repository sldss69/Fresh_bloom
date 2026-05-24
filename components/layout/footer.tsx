import Link from "next/link";
import { MessageCircle } from "lucide-react";

import { FreshBloomLogo } from "@/components/brand/FreshBloomLogo";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-brand-wine/12 bg-brand-cream">
      <div className="mx-auto max-w-6xl px-5 py-12 md:py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr] md:gap-12">
          {/* Brand */}
          <div>
            <FreshBloomLogo className="mb-1" />
            <p className="mb-4 ml-0.5 text-xs tracking-[0.16em] text-brand-wine/45">
              Flower shop &amp; studio
            </p>
            <p className="max-w-xs text-sm leading-6 text-brand-ink/60">
              Arreglos florales hechos con amor para momentos que merecen ser
              recordados. Pedidos en línea con pago seguro y seguimiento por
              WhatsApp.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de Fresh Bloom"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-wine/18 bg-white/50 text-brand-wine/60 transition hover:bg-white hover:text-brand-wine"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://wa.me/52XXXXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp de Fresh Bloom"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-wine/18 bg-white/50 text-brand-wine/60 transition hover:bg-white hover:text-brand-wine"
              >
                <MessageCircle className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-4 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-brand-wine/70">
              Tienda
            </h3>
            <ul className="grid gap-2.5">
              {[
                { label: "Catálogo floral", href: "/productos" },
                { label: "Arma tu ramo", href: "/arma-tu-ramo" },
                { label: "Checkout", href: "/checkout" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-ink/60 transition hover:text-brand-wine"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-brand-wine/70">
              Contacto
            </h3>
            <ul className="grid gap-3 text-sm text-brand-ink/60">
              <li>Mérida, Yucatán</li>
              <li className="leading-5">
                Lunes a sábado
                <br />
                10:00 am – 8:00 pm
              </li>
              <li>
                <a
                  href="https://wa.me/52XXXXXXXXXX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-brand-wine"
                >
                  WhatsApp directo
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-brand-wine/10 pt-7 sm:flex-row">
          <p className="text-[0.72rem] text-brand-ink/40">
            © {new Date().getFullYear()} Fresh Bloom. Todos los derechos reservados.
          </p>
          <p className="text-[0.72rem] text-brand-ink/35">Mérida, Yucatán · México</p>
        </div>
      </div>
    </footer>
  );
}

import type { Metadata } from "next";
import { LockKeyhole } from "lucide-react";

import { loginAdmin } from "@/app/admin/login/actions";
import { FreshBloomLogo } from "@/components/brand/FreshBloomLogo";
import { Button } from "@/components/ui/button";
import { getSafeAdminRedirect } from "@/lib/admin-auth";

type AdminLoginPageProps = {
  searchParams: Promise<{
    error?: string;
    next?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Acceso admin | Fresh Bloom",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const params = await searchParams;
  const next = getSafeAdminRedirect(params.next ?? "/admin");
  const hasError = params.error === "1";

  return (
    <main className="min-h-screen bg-brand-cream px-4 py-10 text-neutral-950">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md flex-col justify-center">
        <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <FreshBloomLogo compact className="scale-90 origin-left" />
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700">
              <LockKeyhole className="h-5 w-5" />
            </span>
          </div>

          <div className="mt-8">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
              Acceso administrativo
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-neutral-950">
              Iniciar sesión
            </h1>
          </div>

          {hasError ? (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
              Usuario o contraseña incorrectos.
            </div>
          ) : null}

          <form action={loginAdmin} className="mt-6 space-y-4">
            <input type="hidden" name="next" value={next} />
            <label className="block">
              <span className="text-sm font-black text-neutral-700">Usuario</span>
              <input
                name="username"
                autoComplete="username"
                className="mt-2 h-11 w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 text-sm font-semibold text-neutral-950 outline-none transition focus:border-neutral-400 focus:bg-white"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-black text-neutral-700">
                Contraseña
              </span>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                className="mt-2 h-11 w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 text-sm font-semibold text-neutral-950 outline-none transition focus:border-neutral-400 focus:bg-white"
                required
              />
            </label>
            <Button type="submit" className="h-11 w-full">
              Entrar al admin
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}

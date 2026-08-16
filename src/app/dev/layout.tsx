import { notFound } from "next/navigation";

import { HtmlShell } from "@/components/layout";

import type { Metadata, Viewport } from "next";

import "../globals.css";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0b0a0f",
  colorScheme: "dark",
};

/**
 * Root layout de las rutas de desarrollo.
 *
 * `/dev` es un segmento hermano de `/[locale]`, no un hijo: cada uno define
 * su propio `<html>/<body>` ("multiple root layouts" de Next.js). Es lo que
 * permite que esta ruta exista SIN prefijo de idioma, y que el middleware de
 * next-intl la excluya sin conflicto (ver matcher en src/middleware.ts).
 *
 * En produccion devuelve 404: es herramienta interna, no parte del sitio.
 */
export default function DevLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <HtmlShell lang="es">{children}</HtmlShell>;
}

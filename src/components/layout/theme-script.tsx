"use client";

import { useLayoutEffect } from "react";

import { applyStoredTheme, themeInitScript } from "@/lib/theme";

/**
 * Script anti-parpadeo del tema, seguro para navegaciones del cliente.
 *
 * - Carga completa: el <script> llega en el HTML y corre antes del primer
 *   pintado, como siempre.
 * - Cambio de idioma: React vuelve a montar <html>. Un <script> creado por
 *   React en el cliente nunca se ejecuta (y React lo reporta como error en
 *   desarrollo), por eso en el cliente se renderiza como `text/plain` y el
 *   tema se re-aplica en un layout effect, antes de que el navegador pinte.
 *
 * Patron de la guia "Preventing flash before hydration" de Next.js.
 */
export function ThemeScript() {
  useLayoutEffect(() => {
    applyStoredTheme();
  }, []);

  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: themeInitScript }}
    />
  );
}

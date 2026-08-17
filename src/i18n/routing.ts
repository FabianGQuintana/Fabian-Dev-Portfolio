import { defineRouting } from "next-intl/routing";

/**
 * Fuente unica de verdad del enrutamiento por locale.
 *
 * `localePrefix: "always"` fuerza /es y /en explicitos, nunca una raiz sin
 * prefijo: asi el locale activo siempre es inequivoco a partir de la URL,
 * lo que simplifica hreflang, sitemap y OG por idioma (Fase 8).
 */
export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];

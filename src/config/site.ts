import type { Locale } from "@/i18n/routing";

/**
 * Configuracion global del sitio.
 *
 * Todo dato que se repita en mas de un lugar (nombre, URLs, redes) vive aqui.
 * Los textos traducibles NO: esos van en src/messages/, resueltos por
 * next-intl.
 */

export const siteConfig = {
  name: "Fabián Quintana",
  role: "Fullstack Developer",

  /**
   * Tagline del Hero (Opcion A del plan).
   * Se mantiene aqui y no en messages/ porque tambien alimenta la metadata
   * del sitio (description por locale), fuera del arbol de traducciones de UI.
   */
  tagline: {
    es: "Diseño la base de datos, construyo la API y pulo la interfaz. Sistemas completos, con arquitectura limpia.",
    en: "I design the database, build the API and refine the interface. Complete systems, clean architecture.",
  } satisfies Record<Locale, string>,

  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  github: {
    username: "FabianGQuintana",
    url: "https://github.com/FabianGQuintana",
  },

  links: {
    linkedin: "",
    email: "",
  },

  /**
   * CV.
   * `enabled: false` renderiza el boton en estado deshabilitado con tooltip.
   * El dia que exista el PDF: copiarlo a public/cv/, poner la ruta en `path`
   * y cambiar el flag. Ningun componente se toca.
   */
  resume: {
    enabled: false,
    path: "/cv/fabian-quintana-cv.pdf",
  },
} as const;

export type SiteConfig = typeof siteConfig;

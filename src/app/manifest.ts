import { siteConfig } from "@/config/site";

import type { MetadataRoute } from "next";

/**
 * Manifest de la PWA (estandar web, sin service worker por ahora).
 * El icono SVG generado en app/icon.svg se sirve como /icon.svg.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — ${siteConfig.role}`,
    short_name: siteConfig.name,
    description: siteConfig.tagline.es,
    start_url: "/es",
    display: "standalone",
    background_color: "#0b0a0f",
    theme_color: "#0b0a0f",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}

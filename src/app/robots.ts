import { siteConfig } from "@/config/site";

import type { MetadataRoute } from "next";

/**
 * robots.txt: permite el sitio publico, bloquea rutas de desarrollo
 * (/dev, usada como guia de estilos) y apunta al sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dev", "/api"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}

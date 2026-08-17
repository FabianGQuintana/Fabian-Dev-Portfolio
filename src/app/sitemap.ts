import { siteConfig } from "@/config/site";
import { routing } from "@/i18n/routing";

import type { MetadataRoute } from "next";

/**
 * Sitemap bilingue. Una entrada por locale, con alternates hreflang que
 * apuntan a la misma pagina en el otro idioma (SEO multiidioma).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  return routing.locales.map((locale) => {
    const url = `${baseUrl}/${locale}`;
    return {
      url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: locale === routing.defaultLocale ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [`${l}`, `${baseUrl}/${l}`]),
        ),
      },
    };
  });
}

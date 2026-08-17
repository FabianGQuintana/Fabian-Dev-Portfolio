import { aboutContent, techStack } from "@/config/about";
import { siteConfig } from "@/config/site";

/**
 * Datos estructurados `Person` (schema.org) para el SEO del portfolio.
 *
 * Solo se incluyen los enlaces `sameAs` realmente configurados en
 * siteConfig; los campos vacios se omiten para no publicar URLs falsas.
 */
export function buildPersonJsonLd() {
  const sameAs = [
    siteConfig.github.url,
    siteConfig.links.linkedin,
    siteConfig.links.email ? `mailto:${siteConfig.links.email}` : "",
  ].filter((value) => value.length > 0);

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    jobTitle: siteConfig.role,
    url: siteConfig.url,
    description: aboutContent.bio.es,
    sameAs,
    knowsAbout: techStack,
  };
}

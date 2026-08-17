import type { ProjectEntry } from "@/features/projects/types";

/**
 * CountrySecure — proyecto dividido en API + Frontend.
 *
 * Los stats de GitHub se leen del repositorio principal (la API, donde vive
 * el backend). El frontend se enlaza desde la tarjeta via `links.frontendRepo`,
 * sin hacer peticiones extra a la API de GitHub.
 *
 * La narrativa (title/tagline/problem/solution/architecture) es placeholder:
 * el autor la redactara en ES y EN. Los enlaces con GitHub (repo) ya son reales.
 */
export const countrySecure: ProjectEntry = {
  slug: "country-secure",
  repo: "FabianGQuintana/CountrySecure-API",
  featured: true,
  order: 1,
  status: "production",

  content: {
    es: {
      title: "CountrySecure", // TODO: narrativa real en ES
      tagline: "Placeholder — tagline del proyecto en español.", // TODO
      problem: "Placeholder — problema que resuelve el sistema (ES).", // TODO
      solution: "Placeholder — solución implementada (ES).", // TODO
      architecture: [
        "Placeholder — decisión de arquitectura 1 (ES).", // TODO
        "Placeholder — decisión de arquitectura 2 (ES).", // TODO
      ],
    },
    en: {
      title: "CountrySecure", // TODO: narrativa real en EN
      tagline: "Placeholder — project tagline in English.", // TODO
      problem: "Placeholder — problem the system solves (EN).", // TODO
      solution: "Placeholder — implemented solution (EN).", // TODO
      architecture: [
        "Placeholder — architecture decision 1 (EN).", // TODO
        "Placeholder — architecture decision 2 (EN).", // TODO
      ],
    },
  },

  highlightedTech: ["TypeScript"], // TODO: stack real
  links: {
    demo: undefined, // TODO: URL de la demo si existe
    frontendRepo: "FabianGQuintana/CountrySecure-Fronted",
  },
};

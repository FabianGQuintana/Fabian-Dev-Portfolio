import type { ProjectEntry } from "@/features/projects/types";

/**
 * Versori Torneos — Versori-Digital/versori-torneos-api (antes "PadelManager").
 *
 * El proyecto vive en la organizacion de la empresa y esta dividido. Los stats
 * de GitHub se leen del repositorio principal (la API); el frontend se enlaza
 * via `links.frontendRepo`.
 *
 * IMPORTANTE: si el token de GitHub no tiene permisos para leer la org
 * privada, la degradacion elegante deja la tarjeta SOLO con narrativa local.
 * Eso es un resultado aceptado, no un error.
 *
 * La narrativa (title/tagline/problem/solution/architecture) es placeholder:
 * el autor la redactara en ES y EN.
 */
export const versoriTorneos: ProjectEntry = {
  slug: "versori-torneos",
  repo: "Versori-Digital/versori-torneos-api",
  featured: false,
  order: 3,
  status: "wip",

  content: {
    es: {
      title: "Versori Torneos", // TODO: narrativa real en ES
      tagline: "Placeholder — tagline del proyecto en español.", // TODO
      problem: "Placeholder — problema que resuelve el sistema (ES).", // TODO
      solution: "Placeholder — solución implementada (ES).", // TODO
      architecture: [
        "Placeholder — decisión de arquitectura 1 (ES).", // TODO
        "Placeholder — decisión de arquitectura 2 (ES).", // TODO
      ],
    },
    en: {
      title: "Versori Torneos", // TODO: narrativa real en EN
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
    frontendRepo: "Versori-Digital/versori-torneos-client",
  },
};

import type { ProjectEntry } from "@/features/projects/types";

/**
 * YPORA — FabianGQuintana/Web-Corporativa-YPORA.
 *
 * La narrativa (title/tagline/problem/solution/architecture) es placeholder:
 * el autor la redactara en ES y EN. El enlace con GitHub (repo) ya es real.
 */
export const ypora: ProjectEntry = {
  slug: "ypora",
  repo: "FabianGQuintana/Web-Corporativa-YPORA",
  featured: true,
  order: 2,
  status: "active",

  content: {
    es: {
      title: "YPORA", // TODO: narrativa real en ES
      tagline: "Placeholder — tagline del proyecto en español.", // TODO
      problem: "Placeholder — problema que resuelve el sistema (ES).", // TODO
      solution: "Placeholder — solución implementada (ES).", // TODO
      architecture: [
        "Placeholder — decisión de arquitectura 1 (ES).", // TODO
        "Placeholder — decisión de arquitectura 2 (ES).", // TODO
      ],
    },
    en: {
      title: "YPORA", // TODO: narrativa real en EN
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
  },
};

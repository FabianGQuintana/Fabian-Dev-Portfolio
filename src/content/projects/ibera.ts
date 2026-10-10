import type { ProjectEntry } from "@/features/projects/types";

/**
 * IBERA — Gran Parque Iberá: frontend (IberAPP) y backend (reclamos).
 *
 * Ambos repos son privados (la organizacion del frontend es de un compañero),
 * asi que la tarjeta no tiene enlaces a GitHub ni consulta la API.
 *
 * La narrativa es placeholder: el autor la redactara en ES y EN.
 */
export const ibera: ProjectEntry = {
  slug: "ibera",
  repo: "FabianGQuintana/IBERA-Reclamos-Backend",
  private: true,
  featured: false,
  order: 3,
  status: "active",

  content: {
    es: {
      title: "IBERA",
      tagline:
        "Plataforma del Gran Parque Iberá: portales, estado de los caminos y reclamos.", // TODO: tagline final
      problem: "Placeholder — problema que resuelve el sistema (ES).", // TODO
      solution: "Placeholder — solución implementada (ES).", // TODO
      architecture: [
        "Backend en .NET 10 con Clean Architecture: capas API, Application, Domain e Infrastructure.", // TODO: decisiones reales
        "Frontend en Next.js 16 con React 19, Tailwind 4 y mapas con MapLibre GL.", // TODO
      ],
    },
    en: {
      title: "IBERA",
      tagline:
        "Platform for the Gran Parque Iberá: portals, road status and complaints.", // TODO: final tagline
      problem: "Placeholder — problem the system solves (EN).", // TODO
      solution: "Placeholder — implemented solution (EN).", // TODO
      architecture: [
        ".NET 10 backend with Clean Architecture: API, Application, Domain and Infrastructure layers.", // TODO
        "Next.js 16 frontend with React 19, Tailwind 4 and MapLibre GL maps.", // TODO
      ],
    },
  },

  highlightedTech: [
    ".NET",
    "C#",
    "TypeScript",
    "React",
    "Next.js",
    "Tailwind CSS",
    "MapLibre",
    "Zod",
  ],
  tools: ["Git", "GitHub", "Postman", "Swagger", "VS Code"],
  media: { gallery: [] },
};

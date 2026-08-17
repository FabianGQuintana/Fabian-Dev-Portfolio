import type { ProjectEntry } from "@/features/projects/types";

/**
 * PLANTILLA DE PROYECTO — copiar a un archivo nuevo y completar.
 *
 * Pasos:
 *   1. Copiar este archivo:  cp src/content/projects/_template.ts src/content/projects/mi-sistema.ts
 *   2. Completar TODOS los campos marcados con "TUX". El contenido es
 *      bilingue: `es` y `en` deben tener la misma estructura.
 *   3. Importar y agregar la entrada al array de src/content/projects/index.ts.
 *   4. Commit y push. Vercel despliega solo. Un archivo, un commit.
 *
 * Reglas:
 *   - `repo` debe ser "usuario/repositorio" EXACTO (el que existe en GitHub).
 *     Si el proyecto esta dividido, apunta al repo principal (el que extrae
 *     los stats). El frontend se enlaza con `links.frontendRepo`.
 *   - `order` define la posicion en el grid (ascendente).
 *   - `featured` marca el proyecto como destacado (si la UI lo usa).
 *   - `status`: "production" | "active" | "archived" | "wip".
 *   - `content.*.architecture` es la lista de decisiones tecnicas.
 *   - Los campos `media` y `links.demo` son opcionales.
 */
export const templateProject: ProjectEntry = {
  slug: "tu-slug", // TU: unico, en minusculas, con guiones. No cambia nunca.
  repo: "TU_USUARIO/TU_REPOSITORIO", // TU: owner/repo exacto en GitHub
  featured: false,
  order: 99,
  status: "wip",

  content: {
    es: {
      title: "Titulo del proyecto (ES)", // TU
      tagline: "Frase corta que resume el sistema (ES).", // TU
      problem: "El problema que motivaba el sistema (ES).", // TU
      solution: "La solucion construida (ES).", // TU
      architecture: [
        "Decision de arquitectura 1 (ES).", // TU
        "Decision de arquitectura 2 (ES).", // TU
      ],
    },
    en: {
      title: "Project title (EN)", // TU
      tagline: "Short phrase summarizing the system (EN).", // TU
      problem: "The problem that motivated the system (EN).", // TU
      solution: "The solution that was built (EN).", // TU
      architecture: [
        "Architecture decision 1 (EN).", // TU
        "Architecture decision 2 (EN).", // TU
      ],
    },
  },

  // --- Opcionales ---------------------------------------------------------
  highlightedTech: ["TypeScript"], // TU: 3-5 tecnologias principales
  media: {
    cover: "/projects/tu-slug/cover.webp", // TU
  },
  links: {
    demo: undefined, // TU: URL de la demo si existe
    frontendRepo: undefined, // TU: "usuario/repo-frontend" si el proyecto esta dividido
  },
};

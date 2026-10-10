import { type SimpleIconSlug, simpleIcons } from "./simple-icons.generated";

/**
 * Registro de tecnologias y herramientas.
 *
 * La clave es el nombre que se escribe en content/projects y config/toolbox
 * (p. ej. "PostgreSQL"). Cada entrada apunta a un icono de Simple Icons o,
 * si la marca no esta en Simple Icons (C#, Visual Studio, pgAdmin...), a un
 * monograma de texto. Un nombre que no esta aca se muestra igual, con su
 * inicial: nunca rompe la tarjeta.
 */

export interface TechInfo {
  readonly name: string;
  /** Path SVG 24x24, o undefined para usar monograma. */
  readonly path?: string;
  /**
   * Color de marca. undefined = currentColor: marcas negras (GitHub,
   * Next.js) se volverian invisibles en tema oscuro.
   */
  readonly color?: string;
  readonly monogram: string;
}

/** Marcas cuyo color oficial es (casi) negro: heredan el color del texto. */
const INHERIT_COLOR = new Set<SimpleIconSlug>([
  "nextdotjs",
  "github",
  "jsonwebtokens",
  "notion",
]);

const BY_NAME: Record<
  string,
  SimpleIconSlug | { monogram: string; color: string }
> = {
  ".NET": "dotnet",
  "ASP.NET Core": "dotnet",
  "EF Core": "dotnet",
  PostgreSQL: "postgresql",
  Docker: "docker",
  "Next.js": "nextdotjs",
  React: "react",
  TypeScript: "typescript",
  JavaScript: "javascript",
  "Tailwind CSS": "tailwindcss",
  Vite: "vite",
  Git: "git",
  GitHub: "github",
  Postman: "postman",
  Trello: "trello",
  Jira: "jira",
  ClickUp: "clickup",
  JWT: "jsonwebtokens",
  Leaflet: "leaflet",
  "Node.js": "nodedotjs",
  HTML: "html5",
  CSS: "css",
  Swagger: "swagger",
  "React Hook Form": "reacthookform",
  Zod: "zod",
  "Framer Motion": "framer",
  Figma: "figma",
  Notion: "notion",
  MySQL: "mysql",
  PHP: "php",
  "Spring Boot": "springboot",
  Hibernate: "hibernate",
  // Sin icono en Simple Icons: monograma con el color de la marca.
  "C#": { monogram: "C#", color: "#9b4f96" },
  Java: { monogram: "Jv", color: "#e76f00" },
  "Visual Studio": { monogram: "VS", color: "#8661c5" },
  "VS Code": { monogram: "VS", color: "#0078d4" },
  "pgAdmin 4": { monogram: "pg", color: "#326690" },
  // Herramientas de IA sin icono en Simple Icons.
  Antigravity: { monogram: "AG", color: "#4285f4" },
  Stitch: { monogram: "St", color: "#34a853" },
  Lovable: { monogram: "Lv", color: "#ff4f8b" },
  MapLibre: { monogram: "ML", color: "#396cb2" },
};

export function getTech(name: string): TechInfo {
  const entry = BY_NAME[name];
  const fallbackMonogram = name.replace(/[^A-Za-z0-9#]/g, "").slice(0, 2);

  if (entry === undefined) return { name, monogram: fallbackMonogram };

  if (typeof entry === "object") {
    return { name, monogram: entry.monogram, color: entry.color };
  }

  const icon = simpleIcons[entry];
  return {
    name,
    path: icon.path,
    color: INHERIT_COLOR.has(entry) ? undefined : icon.hex,
    monogram: fallbackMonogram,
  };
}

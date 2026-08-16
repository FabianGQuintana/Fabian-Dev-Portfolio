/**
 * Colores oficiales de lenguajes de GitHub (fuente: github/linguist).
 *
 * Subconjunto curado de los lenguajes mas comunes en proyectos web/fullstack.
 * Un lenguaje ausente cae a un gris neutro en el mapper, nunca a un error.
 */

export const languageColors: Readonly<Record<string, string>> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  "JavaScript (Browser)": "#f1e05a",
  Python: "#3572A5",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#178600",
  PHP: "#4F5D95",
  Ruby: "#701516",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  CSS: "#663399",
  SCSS: "#c6538c",
  Sass: "#a53b70",
  HTML: "#e34c26",
  SQL: "#e38c00",
  Shell: "#89e051",
  PowerShell: "#012456",
  Bash: "#89e051",
  Dockerfile: "#384d54",
  YAML: "#cb171e",
  JSON: "#292929",
  MDX: "#fcb32c",
  Markdown: "#083fa1",
  Vue: "#41b883",
  "Vue.js": "#41b883",
  Svelte: "#ff3e00",
  Prisma: "#2d3748",
  GraphQL: "#e10098",
  Nix: "#7e7eff",
  Zig: "#ec915c",
  Lua: "#000080",
  "Objective-C": "#438eff",
};

/** Color de respaldo cuando un lenguaje no esta en el mapa. */
export const LANGUAGE_COLOR_FALLBACK = "#6E6D7A";

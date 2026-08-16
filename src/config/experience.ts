import type { Locale } from "@/i18n/routing";

export interface ExperienceEntry {
  readonly id: string;
  readonly company: string;
  readonly role: Record<Locale, string>;
  readonly description: Record<Locale, string>;
  /** Formato "YYYY-MM". */
  readonly startDate: string;
  /** null = presente. */
  readonly endDate: string | null;
  readonly tech: readonly string[];
}

/**
 * Timeline laboral / académica.
 *
 * ───────────────────────────────────────────────────────────────────────────
 *  DATOS DE EJEMPLO (placeholders). Reemplazalos por tu trayectoria real:
 *  copiá cada bloque, completalo con tus fechas y roles exactos, y volvé a
 *  guardar. `id` debe ser único (se usa como key de React). El orden del
 *  array es el orden de visualización (más reciente primero, por convención).
 *
 *  Formato de fechas: "YYYY-MM" (ej. "2024-03"). `endDate: null` significa
 *  que el puesto sigue vigente ("Actualidad").
 * ───────────────────────────────────────────────────────────────────────────
 */
export const experience: readonly ExperienceEntry[] = [
  {
    id: "empresa-actual",
    company: "Nombre de la empresa actual",
    role: {
      es: "Fullstack Developer",
      en: "Fullstack Developer",
    },
    description: {
      es: "Descripción de ejemplo: qué construiste, con qué stack y qué impacto tuvo. Reemplazá este texto por tu descripción real.",
      en: "Placeholder description: what you built, with which stack, and what impact it had. Replace this with your real description.",
    },
    startDate: "2024-03",
    endDate: null,
    tech: ["Next.js", "PostgreSQL", "TypeScript"],
  },
  {
    id: "empresa-anterior",
    company: "Nombre de la empresa anterior",
    role: {
      es: "Desarrollador Web",
      en: "Web Developer",
    },
    description: {
      es: "Segundo bloque de ejemplo. Describí el sistema, las decisiones técnicas y el resultado para el negocio.",
      en: "Second placeholder block. Describe the system, the technical decisions and the outcome for the business.",
    },
    startDate: "2022-01",
    endDate: "2024-02",
    tech: ["React", "Node.js", "MySQL"],
  },
  {
    id: "formacion",
    company: "Institución educativa",
    role: {
      es: "Estudios",
      en: "Education",
    },
    description: {
      es: "Tercer bloque de ejemplo: formación académica o cursos relevantes. Eliminalo si no querés mostrarlo.",
      en: "Third placeholder block: education or relevant courses. Remove it if you don't want to show it.",
    },
    startDate: "2020-03",
    endDate: "2022-12",
    tech: [],
  },
];

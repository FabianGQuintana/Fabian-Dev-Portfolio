import type { Locale } from "@/i18n/routing";

/**
 * Entrada de un timeline. Se usa para trabajo (`experience`) y para estudios
 * (`education`): en estudios, `company` es la institucion y `role` el titulo.
 */
export interface ExperienceEntry {
  readonly id: string;
  /** Empresa o institucion. */
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
 * Experiencia laboral, de la mas reciente a la mas antigua.
 * Formato de fechas: "YYYY-MM". `endDate: null` = sigue vigente.
 * `tech` usa los nombres de src/lib/tech/registry.ts (con icono).
 */
export const experience: readonly ExperienceEntry[] = [
  {
    id: "versori",
    company: "Versori",
    role: {
      es: "Tech Lead · Full Stack Developer",
      en: "Tech Lead · Full Stack Developer",
    },
    description: {
      es: "Lideré el equipo de desarrollo de una startup: definí la arquitectura, guié y capacité a los integrantes y desarrollé backend y frontend junto a ellos, desde el inicio hasta el final del proyecto.",
      en: "Led the development team at a startup: defined the architecture, mentored the team and built backend and frontend alongside them, from the start of the project to its delivery.",
    },
    startDate: "2026-03",
    endDate: "2026-08",
    tech: [], // TODO: stack real de Versori (repos privados)
  },
];

/**
 * Formacion academica.
 *
 * PLACEHOLDER: completar con la carrera, la institucion y las fechas reales.
 */
export const education: readonly ExperienceEntry[] = [
  {
    id: "carrera",
    company: "Institución educativa", // TODO
    role: {
      es: "Título o carrera", // TODO
      en: "Degree or program", // TODO
    },
    description: {
      es: "Descripción breve de la formación: orientación, materias o proyectos relevantes.", // TODO
      en: "Short description of the studies: focus, relevant subjects or projects.", // TODO
    },
    startDate: "2022-03", // TODO
    endDate: null, // TODO
    tech: [],
  },
];

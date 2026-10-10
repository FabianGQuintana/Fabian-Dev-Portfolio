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
    tech: ["C#", ".NET", "React"], // TODO: stack real de Versori (repos privados)
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
    company: "Universidad Nacional del Nordeste (UNNE)",
    role: {
      es: "Licenciatura en Sistemas de Información",
      en: "Bachelor's in Information Systems",
    },
    description: {
      es: "Actualmente cursando el ciclo superior (4to/5to año). Formación integral con fuerte enfoque en bases de datos, arquitectura de software y diseño de sistemas. Título intermedio obtenido: Analista de Sistemas.",
      en: "Currently in the advanced cycle (4th/5th year). Comprehensive education with a strong focus on databases, software architecture, and systems design. Earned intermediate degree: Systems Analyst.",
    },
    startDate: "2023-03", // Si empezaste antes, podés ajustar este año
    endDate: null,
    tech: [],
  },
  {
    id: "bootcamp-devlights",
    company: "DevLights",
    role: {
      es: "Bootcamp Full Stack (C# & React)",
      en: "Full Stack Bootcamp (C# & React)",
    },
    description: {
      es: "Programa intensivo de formación técnica. Desarrollo de aplicaciones utilizando C# y .NET para el backend, junto con React para el frontend, aplicando buenas prácticas y trabajo en equipo. Aplicando como contenido extra Herramientas de Versionado, Tableros y Cloud",
      en: "Intensive technical training program. Application development using C# and .NET for the backend, along with React for the frontend, applying best practices and teamwork. Applying as extra content Versioning Tools, Boards and Cloud Computing.",
    },
    startDate: "2025-09",
    endDate: null,
    tech: ["React", "C#"],
  },
];

import type { Locale } from "@/i18n/routing";

/**
 * Contrato de la integracion con GitHub. Un solo archivo de tipos: si el
 * registro, la API y la UI comparten esto, no hay definiciones duplicadas que
 * puedan divergir.
 */

/** Lo que vos escribis a mano en content/projects/*.ts. */
export interface ProjectEntry {
  slug: string;
  repo: `${string}/${string}`;
  featured: boolean;
  order: number;
  status: "production" | "active" | "archived" | "wip";
  content: Record<Locale, ProjectContent>;
  highlightedTech?: string[];
  media?: ProjectMedia;
  links?: {
    demo?: string;
    docs?: string;
    /** Repo del frontend cuando el proyecto esta dividido. Solo para enlazar en la UI; los stats se leen del `repo` principal. */
    frontendRepo?: `${string}/${string}`;
  };
}

/** Narrativa bilingue. Lo que GitHub no puede contar. */
export interface ProjectContent {
  title: string;
  tagline: string;
  problem: string;
  solution: string;
  architecture: string[];
}

export interface ProjectMedia {
  cover?: string;
  gallery?: string[];
}

/** Lo que trae GitHub. Todo opcional: puede no estar disponible. */
export interface RepoStats {
  stars?: number;
  forks?: number;
  languages?: Array<{ name: string; percentage: number; color: string }>;
  lastCommitAt?: string;
  topics?: string[];
  isArchived?: boolean;
}

/** Lo que consume la UI. */
export type Project = ProjectEntry & {
  stats: RepoStats;
  statsStatus: ProjectStatsStatus;
};

/** Estado de degradacion de un proyecto frente a la API. */
export type ProjectStatsStatus =
  | "live" // stats en vivo disponibles
  | "unavailable" // la API no respondio: solo narrativa
  | "not_found"; // el repo no existe: solo narrativa + warning

export interface ProjectStatsResult {
  stats: RepoStats;
  status: ProjectStatsStatus;
}

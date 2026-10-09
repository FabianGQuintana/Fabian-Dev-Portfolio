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
  /** Stack del proyecto: lenguajes, frameworks y librerias. Se muestran como iconos. */
  highlightedTech?: string[];
  /** Herramientas usadas en este proyecto (Docker, Postman...). Ver config/toolbox.ts. */
  tools?: string[];
  media?: ProjectMedia;
  /**
   * Repo privado: no se consulta la API de GitHub ni se muestran enlaces a
   * el. El proyecto se presenta con narrativa, stack y capturas (media.gallery).
   */
  private?: boolean;
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

/**
 * Modelo de tarjeta/panel: Project + label calculado en el servidor.
 * `updatedLabel` es el texto completo ("Actualizado hace 3 días") porque el
 * tiempo relativo se resuelve una sola vez en el build, no en cada render.
 */
export type ProjectCardModel = Project & { updatedLabel?: string };

/** Etiquetas de UI que la seccion resuelve del lado servidor. */
export interface ProjectUiLabels {
  expand: string;
  collapse: string;
  close: string;
  viewRepo: string;
  viewApi: string;
  viewFrontend: string;
  viewDemo: string;
  architecture: string;
  problem: string;
  solution: string;
  languages: string;
  stack: string;
  tools: string;
  showMoreTools: string;
  showLessTools: string;
  showMore: string;
  showLess: string;
  carouselPrev: string;
  carouselNext: string;
  /** Plantilla con {n} y {total}: "Ir al grupo {n} de {total}". */
  carouselGoTo: string;
  carouselRegion: string;
  status: Record<ProjectEntry["status"], string>;
}

/** Estado de degradacion de un proyecto frente a la API. */
export type ProjectStatsStatus =
  | "live" // stats en vivo disponibles
  | "unavailable" // la API no respondio: solo narrativa
  | "not_found"; // el repo no existe: solo narrativa + warning

export interface ProjectStatsResult {
  stats: RepoStats;
  status: ProjectStatsStatus;
}

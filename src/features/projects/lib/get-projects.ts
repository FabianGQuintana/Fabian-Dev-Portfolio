import { projectEntries } from "@/content/projects";
import type {
  Project,
  ProjectEntry,
  ProjectStatsResult,
  ProjectStatsStatus,
} from "@/features/projects/types";
import { fetchRepoStats } from "@/lib/github";

/**
 * Compone el registro local (narrativa) con los stats en vivo de GitHub.
 *
 * Server-only. El navegador nunca llama a la API de GitHub: los stats se
 * resuelven aca y viajan como parte del HTML estatico (ISR, 1h).
 *
 * Cada repo se resuelve de forma independiente con `Promise.allSettled`: un
 * repo que falla no bloquea a los demas, y nunca se pierde la narrativa.
 */
export async function getProjects(): Promise<Project[]> {
  const results = await Promise.allSettled(
    projectEntries.map((entry) => fetchRepoStats(entry.repo)),
  );

  return projectEntries.map((entry, index) => {
    const result = results[index];

    // Nunca deberia pasar (fetchRepoStats no lanza), pero la red tiene la
    // ultima palabra. Degradar al peor caso no rompe la tarjeta.
    const fallback: ProjectStatsResult = {
      stats: {},
      status: "unavailable",
    };

    const { stats, status } =
      result && result.status === "fulfilled" ? result.value : fallback;

    return { ...entry, stats, statsStatus: status };
  });
}

export type { ProjectEntry, ProjectStatsStatus };

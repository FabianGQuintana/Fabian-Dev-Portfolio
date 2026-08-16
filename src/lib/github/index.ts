import type { RepoStats, ProjectStatsResult } from "@/features/projects/types";

import { mapLanguages, mapLastCommit, mapRepository } from "./mappers";
import { fetchLanguages, fetchLastCommit, fetchRepository } from "./queries";

/**
 * Superficie publica del modulo github.
 *
 * La composicion vive aca: las tres peticiones por repo se resuelven en
 * paralelo con `Promise.allSettled`, y cada fallo degrada a su propio campo,
 * nunca al proyecto entero. Un repo con rate limit no bloquea a los demas.
 */
export { githubRequest } from "./client";
export { repositorySchema, languagesSchema, lastCommitSchema } from "./schemas";
export { fetchRepository, fetchLanguages, fetchLastCommit } from "./queries";

/**
 * Resuelve los stats en vivo de un repo con degradacion elegante.
 *
 * Regla no negociable (seccion 4.3d del plan): la API puede fallar, tener
 * rate limit o estar caida, y el portafolio NUNCA se rompe por eso. La tarjeta
 * siempre se renderiza con la narrativa; lo que se degrada es el
 * enriquecimiento, no el contenido.
 *
 * - 404         → solo narrativa (kind "not_found")
 * - 403/límite  → solo narrativa (kind "unavailable")
 * - red/parse   → solo narrativa (kind "unavailable")
 * - exito       → narrativa + stats en vivo (kind "live")
 */
export async function fetchRepoStats(
  repo: string,
): Promise<ProjectStatsResult> {
  const [repoResult, languagesResult, commitsResult] = await Promise.allSettled(
    [fetchRepository(repo), fetchLanguages(repo), fetchLastCommit(repo)],
  );

  const stats: RepoStats = {};

  // El resultado "no encontrado" es informativo para el log, pero a efectos
  // de la UI todos los fallos se ven igual: narrativa sin stats.
  let status: ProjectStatsResult["status"] = "live";

  if (repoResult.status === "fulfilled" && repoResult.value.ok) {
    Object.assign(stats, mapRepository(repoResult.value.data));
  } else {
    status = "unavailable";
  }

  if (languagesResult.status === "fulfilled" && languagesResult.value.ok) {
    Object.assign(stats, mapLanguages(languagesResult.value.data));
  }

  if (commitsResult.status === "fulfilled" && commitsResult.value.ok) {
    Object.assign(stats, mapLastCommit(commitsResult.value.data));
  }

  // 404 es el unico caso con distincion propia: el repo no existe y conviene
  // que el log lo diga explicitamente (ya se warnieo en client.ts).
  const notFound =
    repoResult.status === "fulfilled" &&
    !repoResult.value.ok &&
    repoResult.value.kind === "not_found";
  if (notFound) status = "not_found";

  return { stats, status };
}

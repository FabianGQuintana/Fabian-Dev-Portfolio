import type { RepoStats } from "@/features/projects/types";

import { LANGUAGE_COLOR_FALLBACK, languageColors } from "./language-colors";

import type {
  LanguagesResponse,
  LastCommitResponse,
  RepositoryResponse,
} from "./schemas";

/**
 * Mappers: respuesta de GitHub → modelo de dominio propio (RepoStats).
 *
 * Aqui muere la API externa: nadie fuera de lib/github sabe que GitHub
 * devuelve `stargazers_count`. Si manana se cambia la API por GraphQL v4,
 * se toca solo esta capa.
 */

/** Conversiones "falsy → no mostrar". GitHub devuelve 0 para repos sin stars. */
const keepOnlyPositive = (value: number): number | undefined =>
  value > 0 ? value : undefined;

export function mapRepository(repo: RepositoryResponse): RepoStats {
  const stats: RepoStats = {};

  const stars = keepOnlyPositive(repo.stargazers_count);
  const forks = keepOnlyPositive(repo.forks_count);

  if (stars !== undefined) stats.stars = stars;
  if (forks !== undefined) stats.forks = forks;
  if (repo.archived) stats.isArchived = true;
  if (repo.topics.length > 0) stats.topics = repo.topics;

  return stats;
}

export function mapLanguages(languages: LanguagesResponse): RepoStats {
  const entries = Object.entries(languages);
  if (entries.length === 0) return {};

  const total = entries.reduce((sum, [, bytes]) => sum + bytes, 0);
  if (total === 0) return {};

  const mapped = entries
    .map(([name, bytes]) => ({
      name,
      percentage: Math.round((bytes / total) * 1000) / 10,
      color: languageColors[name] ?? LANGUAGE_COLOR_FALLBACK,
    }))
    .sort((a, b) => b.percentage - a.percentage);

  return { languages: mapped };
}

export function mapLastCommit(commits: LastCommitResponse): RepoStats {
  const committerDate = commits[0]?.commit.committer.date;
  if (!committerDate) return {};

  return { lastCommitAt: committerDate };
}

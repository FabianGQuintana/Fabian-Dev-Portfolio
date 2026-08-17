import { githubRequest, githubTag } from "./client";
import { languagesSchema, lastCommitSchema, repositorySchema } from "./schemas";

import type { GithubResult } from "./client";
import type {
  LanguagesResponse,
  LastCommitResponse,
  RepositoryResponse,
} from "./schemas";

/**
 * Queries por endpoint. Delgadas a proposito: cada una valida su respuesta
 * con su esquema y devuelve el resultado tipado. La composicion (paralelismo
 * y degradacion) vive en index.ts.
 */

export async function fetchRepository(
  repo: string,
): Promise<GithubResult<RepositoryResponse>> {
  return githubRequest(`/repos/${repo}`, repositorySchema, {
    tag: githubTag(repo),
  });
}

export async function fetchLanguages(
  repo: string,
): Promise<GithubResult<LanguagesResponse>> {
  return githubRequest(`/repos/${repo}/languages`, languagesSchema, {
    tag: githubTag(repo),
  });
}

export async function fetchLastCommit(
  repo: string,
): Promise<GithubResult<LastCommitResponse>> {
  return githubRequest(`/repos/${repo}/commits?per_page=1`, lastCommitSchema, {
    tag: githubTag(repo),
  });
}

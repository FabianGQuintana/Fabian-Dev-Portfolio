import { z } from "zod";

/**
 * Esquemas de la API de GitHub.
 *
 * La regla es una sola: la API externa NO se confia. Cada endpoint se valida
 * contra un esquema en el borde del sistema (lib/github/client.ts). Si GitHub
 * cambia un campo, el error aparece aqui con un mensaje claro, no como un
 * `undefined` propagandose hasta el JSX.
 */

/** GET /repos/{owner}/{repo} — metadatos, stars, forks, topics. */
export const repositorySchema = z.object({
  name: z.string(),
  full_name: z.string(),
  html_url: z.string().url(),
  description: z.string().nullable(),
  stargazers_count: z.number().int().nonnegative(),
  forks_count: z.number().int().nonnegative(),
  archived: z.boolean(),
  topics: z.array(z.string()),
  pushed_at: z.string().datetime({ offset: true }).nullable(),
});

export type RepositoryResponse = z.infer<typeof repositorySchema>;

/** GET /repos/{owner}/{repo}/languages — bytes por lenguaje. */
export const languagesSchema = z.record(z.string(), z.number().nonnegative());

export type LanguagesResponse = z.infer<typeof languagesSchema>;

/** GET /repos/{owner}/{repo}/commits?per_page=1 — el ultimo commit. */
export const lastCommitSchema = z.array(
  z.object({
    commit: z.object({
      committer: z.object({
        date: z.string().datetime({ offset: true }),
      }),
    }),
  }),
);

export type LastCommitResponse = z.infer<typeof lastCommitSchema>;

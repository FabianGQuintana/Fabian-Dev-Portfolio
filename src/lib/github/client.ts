import type { z } from "zod";

/**
 * Cliente HTTP de GitHub.
 *
 * Responsabilidad UNICA: hablar con la API con las cabeceras correctas y
 * traducir cualquier fallo a un resultado tipado. No sabe nada de proyectos,
 * narrativa ni UI.
 *
 * El token vive en GITHUB_TOKEN (servidor, nunca NEXT_PUBLIC_). Si no existe,
 * las peticiones siguen funcionando autenticadas como anonimas (60/hora en
 * vez de 5.000) — la degradacion de abajo no depende de el.
 */

const GITHUB_API_BASE = "https://api.github.com";
const GITHUB_API_VERSION = "2022-11-28";

/** Revalidacion por defecto de las peticiones (1h = ISR del grid). */
export const DEFAULT_REVALIDATE = 3600;

export type GithubErrorKind =
  "not_found" | "rate_limit" | "forbidden" | "invalid_response" | "network";

export interface GithubSuccess<T> {
  ok: true;
  data: T;
}

export interface GithubFailure {
  ok: false;
  /** null = fallo de red (nunca llego una respuesta). */
  status: number | null;
  kind: GithubErrorKind;
}

export type GithubResult<T> = GithubSuccess<T> | GithubFailure;

/** Cada intento se cachea con una tag por repo para poder purgarla via webhook. */
export function githubTag(repo: string): string {
  return `gh:${repo}`;
}

interface GithubRequestOptions {
  /** Segundos de revalidacion (ISR). */
  revalidate?: number;
  /** Tag de cache, por convencion `gh:<owner>/<repo>`. */
  tag?: string;
}

/**
 * Fetch tipado contra la API de GitHub.
 *
 * Devuelve SIEMPRE un `GithubResult`, nunca lanza. Los tres escenarios de
 * degradacion del plan se traducen aqui:
 *   - 404  → kind "not_found"   (el repo no existe)
 *   - 403  → kind "rate_limit"  (el limite de peticiones se agoto)
 *   - red  → kind "network"     (la API esta caida o sin conexion)
 */
export async function githubRequest<T>(
  path: string,
  schema: z.ZodType<T>,
  { revalidate = DEFAULT_REVALIDATE, tag }: GithubRequestOptions = {},
): Promise<GithubResult<T>> {
  const token = process.env.GITHUB_TOKEN;

  let response: Response;
  try {
    response = await fetch(`${GITHUB_API_BASE}${path}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": GITHUB_API_VERSION,
        "User-Agent": "fabian-quintana-portfolio",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      next: { revalidate, tags: tag ? [tag] : undefined },
    });
  } catch (error) {
    console.warn(`[github] fallo de red en ${path}:`, error);
    return { ok: false, status: null, kind: "network" };
  }

  if (!response.ok) {
    // 403 es el codigo de rate limit de GitHub (y tambien de permisos
    // insuficientes del token). Ambos significan "no tengo datos frescos".
    if (response.status === 403) {
      console.warn(`[github] rate limit (403) en ${path}`);
      return { ok: false, status: 403, kind: "rate_limit" };
    }

    if (response.status === 404) {
      console.warn(`[github] 404 en ${path} — repo inexistente`);
      return { ok: false, status: 404, kind: "not_found" };
    }

    console.warn(`[github] HTTP ${response.status} en ${path}`);
    return { ok: false, status: response.status, kind: "forbidden" };
  }

  // La respuesta de GitHub NO se confia: se valida contra el esquema antes
  // de entrar a la aplicacion. Si el error aparece, es aca, en el borde.
  const json: unknown = await response.json();
  const parsed = schema.safeParse(json);

  if (!parsed.success) {
    console.warn(
      `[github] respuesta invalida en ${path}: ${parsed.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ")}`,
    );
    return { ok: false, status: response.status, kind: "invalid_response" };
  }

  return { ok: true, data: parsed.data };
}

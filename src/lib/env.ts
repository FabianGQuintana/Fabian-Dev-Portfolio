import { z } from "zod";

/**
 * Variables de entorno validadas con Zod.
 *
 * Regla: el proceso arranca solo con variables validas. Los campos opcionales
 * (RESEND_*, GITHUB_TOKEN) se degradan con elegancia: el form de contacto
 * sigue renderizandose y devuelve un error controlado si el email no esta
 * configurado, igual que el grid de proyectos funciona sin token de GitHub.
 *
 * `.preprocess` convierte las cadenas vacias de .env.example en `undefined`
 * para que `.optional()` se comporte como se espera.
 */
const emptyToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),

  GITHUB_TOKEN: z.string().optional(),
  GITHUB_USERNAME: z.string().min(1).default("FabianGQuintana"),

  RESEND_API_KEY: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  CONTACT_EMAIL_TO: z.preprocess(
    emptyToUndefined,
    z.string().email().optional(),
  ),
  CONTACT_EMAIL_FROM: z.preprocess(
    emptyToUndefined,
    z.string().email().default("onboarding@resend.dev"),
  ),
});

function loadEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");

    console.error(`[env] variables de entorno invalidas: ${details}`);
    throw new Error(`Variables de entorno invalidas: ${details}`);
  }

  return result.data;
}

export const env = loadEnv();

export type Env = typeof env;

import { Resend } from "resend";

import { env } from "@/lib/env";

/**
 * Cliente de Resend.
 *
 * `renderAsync` es nativo de la SDK v6 y acepta un componente React (JSX con
 * estilos inline, el formato de React Email) sin necesidad de depender de
 * `@react-email/*`. El `reply-to` se resuelve en el Server Action, donde se
 * conoce el correo del remitente.
 *
 * El cliente se instancia de forma perezosa para no reservar recursos si
 * Resend no esta configurado (degradacion elegante del form de contacto).
 */

let client: Resend | null = null;

export function getResendClient(): Resend {
  if (!client) client = new Resend(env.RESEND_API_KEY);
  return client;
}

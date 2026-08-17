"use server";

import { render } from "@react-email/render";
import { headers } from "next/headers";
import { createElement } from "react";

import { getResendClient } from "@/lib/email/resend-client";
import { ContactNotification } from "@/lib/email/templates/contact-notification";
import { env } from "@/lib/env";
import { isRateLimited } from "@/lib/utils/rate-limit";

import { contactSchema } from "../schemas/contact-schema";

import type { ContactFormState } from "../types";

/**
 * Tiempo minimo de permanencia en el form antes de aceptar el envio.
 * Un bot que rellena el formulario en menos de 3 segundos se descarta.
 */
const MIN_FORM_TIME_MS = 3_000;

/** IP del visitante. En desarrollo cae en un valor fijo compartido. */
async function getClientIp(): Promise<string> {
  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() ?? "local";
}

/**
 * Envia el mensaje de contacto.
 *
 * Anti-spam en tres capas silenciosas (sin CAPTCHA):
 *   1. Honeypot: campo `website` oculto. Si viene con contenido, se descarta.
 *   2. Time-trap: envios en menos de 3 segundos desde el montaje se descartan.
 *   3. Rate limit: 5 envios por hora por IP.
 *
 * El email sale con `replyTo` apuntando al correo del remitente para poder
 * responder directo desde el cliente de correo.
 */
export async function sendMessage(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    subject: String(formData.get("subject") ?? ""),
    message: String(formData.get("message") ?? ""),
    website: String(formData.get("website") ?? ""),
    mountedAt: String(formData.get("mountedAt") ?? ""),
  };

  // 1. Honeypot: el campo oculto debe estar vacio. Un bot lo completo.
  if (raw.website !== "") {
    console.warn("[contact] honeypot detectado — envio descartado");
    return { status: "idle" };
  }

  // 2. Time-trap: demasiado rapido para ser humano.
  const mountedAt = Number(raw.mountedAt);
  if (mountedAt && Date.now() - mountedAt < MIN_FORM_TIME_MS) {
    console.warn("[contact] time-trap detectado — envio descartado");
    return { status: "idle" };
  }

  // 3. Rate limit por IP.
  const ip = await getClientIp();
  if (isRateLimited(ip)) {
    return { status: "error", messageKey: "error_rate_limited" };
  }

  // Re-validacion en servidor con el MISMO esquema Zod que corre en cliente.
  // Nunca se confia en lo que el navegador ya valido.
  const parsed = contactSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Partial<Record<string, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? "");
      if (field) fieldErrors[field] = issue.message;
    }
    return { status: "error", messageKey: "error", fieldErrors };
  }

  // Configuracion de Resend. Si falta, se degrada con un error controlado en
  // vez de romper el sitio: el form sigue funcionando visualmente.
  if (!env.RESEND_API_KEY || !env.CONTACT_EMAIL_TO) {
    console.warn("[contact] Resend no configurado — envio omitido");
    return { status: "error", messageKey: "error" };
  }

  const { name, email, subject, message } = parsed.data;

  // Render explícito de la plantilla con el motor de React Email. Se envia
  // como `html` (y no con la prop `react`) para que el renderizado no dependa
  // de la resolucion interna de la SDK de Resend.
  const html = await render(
    createElement(ContactNotification, { name, email, subject, message }),
    { pretty: true },
  );

  try {
    const { data, error } = await getResendClient().emails.send({
      from: env.CONTACT_EMAIL_FROM,
      to: env.CONTACT_EMAIL_TO,
      replyTo: email,
      subject: `[Portfolio] ${subject} — ${name}`,
      html,
    });

    if (error || !data) {
      console.error("[contact] error de Resend:", error);
      return { status: "error", messageKey: "error" };
    }

    return { status: "success" };
  } catch (error) {
    console.error("[contact] excepcion al enviar:", error);
    return { status: "error", messageKey: "error" };
  }
}

import { z } from "zod";

/**
 * Esquema compartido del formulario de contacto.
 *
 * Corre en cliente (validacion inmediata con feedback) y en servidor (el
 * Server Action nunca confia en el cliente). Los mensajes son claves de
 * i18n, no texto: el componente resuelve cada clave contra `contact.errors.*`.
 *
 * El campo `website` es el honeypot anti-spam: debe ir vacio.
 */

export const contactSchema = z.object({
  name: z.string().trim().min(2, "name_short").max(80, "name_short"),
  email: z.string().trim().email("email_invalid"),
  subject: z.string().trim().min(3, "subject_short").max(120, "subject_short"),
  message: z
    .string()
    .trim()
    .min(20, "message_short")
    .max(2000, "message_short"),
  // Honeypot: campo oculto que los bots completan y las personas no ven.
  website: z.string().max(0, "website"),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const contactFields = ["name", "email", "subject", "message"] as const;

export type ContactField = (typeof contactFields)[number];

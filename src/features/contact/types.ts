import type { ContactField } from "./schemas/contact-schema";

export type { ContactField } from "./schemas/contact-schema";

/**
 * Tipos del feature de contacto.
 *
 * `ContactFormState` es el contrato del Server Action ↔ `useActionState`.
 * Los `messageKey` y las claves de error de campo son claves de i18n que el
 * componente resuelve contra las labels pasadas por el Server Component.
 */

export type ContactMessageKey = "error" | "error_rate_limited";

export interface ContactFormState {
  status: "idle" | "success" | "error";
  /** Clave i18n del mensaje global (banner), solo en estado error. */
  messageKey?: ContactMessageKey;
  /** Claves i18n por campo, solo en estado error. */
  fieldErrors?: Partial<Record<ContactField, string>>;
}

export interface ContactUiLabels {
  name: string;
  email: string;
  subject: string;
  message: string;
  send: string;
  sending: string;
  success: string;
  error: string;
  errorRateLimited: string;
  errors: {
    name_short: string;
    email_invalid: string;
    subject_short: string;
    message_short: string;
    website: string;
  };
}

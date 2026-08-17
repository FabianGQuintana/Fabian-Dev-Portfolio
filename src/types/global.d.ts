import type { routing } from "@/i18n/routing";
import type messages from "@/messages/es.json";

/**
 * Tipado global de next-intl.
 *
 * Con esto, `useTranslations("nva")` (typo) o `t("nav.abuot")` (typo) son
 * errores de compilacion, no texto faltante descubierto en produccion.
 * `es.json` es la fuente de verdad de la FORMA del diccionario; la paridad
 * de contenido entre idiomas la valida scripts/check-messages.mjs.
 */
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}

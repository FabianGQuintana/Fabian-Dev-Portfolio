import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";

import { routing } from "./routing";

/**
 * Resuelve el diccionario de mensajes en el servidor para cada request.
 *
 * `hasLocale` valida el segmento de la URL contra `routing.locales`: un
 * locale invalido (por ejemplo /fr) cae al default en vez de romper la
 * carga de next-intl.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});

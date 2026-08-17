import createMiddleware from "next-intl/middleware";

import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Excluye api, internals de Next, archivos estaticos con extension y
  // /dev: las rutas de desarrollo viven fuera del arbol [locale] y no deben
  // recibir prefijo de idioma ni redireccion.
  matcher: ["/((?!api|_next|_vercel|dev|.*\\..*).*)"],
};

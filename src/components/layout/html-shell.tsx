import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { themeInitScript } from "@/lib/theme";
import { cn } from "@/lib/utils";

/**
 * `<html>`/`<body>` compartidos entre los DOS layouts raiz del sitio.
 *
 * app/[locale]/ y app/dev/ son segmentos hermanos de nivel superior, cada
 * uno con su propio root layout ("multiple root layouts" de Next.js): no
 * existe un app/layout.tsx unico por encima de ambos. Esto es lo que permite
 * que /dev exista SIN prefijo de idioma sin que next-intl intente
 * redirigirlo a /es/dev. Este componente evita duplicar el boilerplate de
 * fuentes y clases base en los dos layouts.
 */
export function HtmlShell({
  lang,
  children,
}: {
  lang: string;
  children: React.ReactNode;
}) {
  return (
    <html lang={lang} data-theme="dark" suppressHydrationWarning>
      {/* App Router: <head> en el root layout es valido; la regla es de pages/. */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        {/* Fija el tema antes del primer pintado (ver src/lib/theme.ts). */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={cn(
          GeistSans.variable,
          GeistMono.variable,
          "bg-bg-base font-sans text-text-primary antialiased",
        )}
      >
        {children}
      </body>
    </html>
  );
}

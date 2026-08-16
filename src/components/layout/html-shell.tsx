import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

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
    <html lang={lang} suppressHydrationWarning>
      <body
        className={cn(
          GeistSans.variable,
          GeistMono.variable,
          "bg-base font-sans text-fg antialiased",
        )}
      >
        {children}
      </body>
    </html>
  );
}

"use client";

import { useLocale } from "next-intl";

import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const LOCALE_LABEL: Record<string, string> = { es: "ES", en: "EN" };
const LOCALE_NAME: Record<string, string> = { es: "Español", en: "English" };

/**
 * Cambia de idioma conservando la ruta actual.
 *
 * `router.replace` con `{ locale }` es navegacion del lado del cliente sobre
 * la MISMA pagina, asi que no hay recarga completa y la posicion de scroll
 * se conserva — es el criterio de aceptacion de la Fase 3.
 */
export function LocaleSwitcher() {
  const currentLocale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      role="group"
      aria-label="Idioma"
      className="flex items-center gap-0.5 rounded-md border border-line-strong bg-surface p-1 font-mono text-xs"
    >
      {routing.locales.map((locale) => {
        const isActive = locale === currentLocale;

        return (
          <button
            key={locale}
            type="button"
            onClick={() => router.replace(pathname, { locale })}
            aria-pressed={isActive}
            aria-label={`Cambiar a ${LOCALE_NAME[locale]}`}
            className={cn(
              "rounded px-2 py-1 transition-colors duration-150",
              isActive
                ? "bg-accent-600 text-white"
                : "text-fg-muted hover:bg-raised hover:text-fg",
            )}
          >
            {LOCALE_LABEL[locale]}
          </button>
        );
      })}
    </div>
  );
}

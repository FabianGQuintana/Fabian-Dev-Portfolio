"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

import { getTheme, setTheme, type Theme } from "@/lib/theme";

interface ThemeToggleProps {
  toLightLabel: string;
  toDarkLabel: string;
}

/**
 * Suscripcion al atributo `data-theme` de <html>. useSyncExternalStore
 * evita el mismatch de hidratacion: en el servidor no hay tema conocido
 * (devuelve null y el boton se pinta neutro) y en el cliente lee el
 * atributo que el script anti-parpadeo ya fijo.
 */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

export function ThemeToggle({ toLightLabel, toDarkLabel }: ThemeToggleProps) {
  const theme = useSyncExternalStore<Theme | null>(
    subscribe,
    getTheme,
    () => null,
  );

  const isDark = theme !== "light";
  const label = isDark ? toLightLabel : toDarkLabel;

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={label}
      title={label}
      className="grid size-9 place-items-center rounded-md border border-border-default bg-bg-surface text-text-secondary transition-colors duration-150 hover:bg-bg-surface-raised hover:text-accent-400"
    >
      {/* Antes de hidratar no se sabe el tema: no se muestra icono. */}
      {theme === null ? null : isDark ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
    </button>
  );
}

"use client";

import { motion } from "motion/react";

import { useActiveSection } from "@/hooks";
import { cn } from "@/lib/utils";

export interface NavLinkItem {
  readonly id: string;
  readonly href: string;
  readonly label: string;
}

interface NavLinksProps {
  items: readonly NavLinkItem[];
  /** Cierra el menu movil al elegir una seccion. */
  onNavigate?: () => void;
  orientation?: "horizontal" | "vertical";
}

/**
 * Navegacion por anclas: cada link es una pastilla con contorno visible en
 * ambos temas, y la seccion activa se resalta con el acento.
 *
 * El indicador es un unico elemento compartido con `layoutId`: Motion lo
 * desliza entre items en vez de hacerlo desaparecer y reaparecer. Un solo
 * nodo en el DOM, no uno por link.
 */
export function NavLinks({
  items,
  onNavigate,
  orientation = "horizontal",
}: NavLinksProps) {
  // "home" (hero) se observa tambien: asi, al volver arriba, ningun link
  // queda marcado como activo.
  const sectionIds = ["home", ...items.map((item) => item.id)];
  const activeId = useActiveSection(sectionIds);

  return (
    <ul
      className={cn(
        "flex items-center gap-2",
        orientation === "vertical" && "flex-col items-stretch gap-3",
      )}
    >
      {items.map((item) => {
        const isActive = activeId === item.id;

        return (
          <li key={item.id} className="relative">
            <a
              href={item.href}
              onClick={onNavigate}
              // `aria-current` comunica la seccion activa a los lectores de
              // pantalla. El indicador visual solo no alcanza.
              aria-current={isActive ? "location" : undefined}
              className={cn(
                "relative z-10 block rounded-full border px-4 py-1.5 text-sm transition-colors duration-150",
                orientation === "vertical" && "px-6 py-3 text-lg",
                isActive
                  ? "border-transparent text-text-primary"
                  : "border-border-interactive/50 bg-bg-surface/60 text-text-secondary hover:border-accent-400 hover:text-accent-400",
              )}
            >
              {item.label}
            </a>

            {/* La pastilla activa se desliza entre items gracias a layoutId. */}
            {isActive ? (
              <motion.span
                layoutId={`nav-indicator-${orientation}`}
                aria-hidden="true"
                className="absolute inset-0 rounded-full border border-accent-500 bg-accent-500/15"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

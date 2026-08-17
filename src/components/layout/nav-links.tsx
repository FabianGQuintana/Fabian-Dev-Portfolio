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
 * Navegacion por anclas con indicador de seccion activa.
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
  const sectionIds = items.map((item) => item.id);
  const activeId = useActiveSection(sectionIds);

  return (
    <ul
      className={cn(
        "flex gap-1",
        orientation === "vertical" && "flex-col items-stretch gap-2",
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
                "relative block rounded-md px-3 py-2 text-sm transition-colors duration-150",
                orientation === "vertical" && "px-4 py-3 text-base",
                isActive ? "text-fg" : "text-fg-muted hover:text-fg",
              )}
            >
              {item.label}
            </a>

            {isActive ? (
              <motion.span
                layoutId={`nav-indicator-${orientation}`}
                aria-hidden="true"
                className={cn(
                  "absolute bg-accent-500",
                  orientation === "horizontal"
                    ? "inset-x-3 -bottom-px h-px"
                    : "inset-y-2 -left-px w-px",
                )}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

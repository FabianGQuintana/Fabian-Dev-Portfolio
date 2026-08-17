"use client";

import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { useFocusTrap, useScrollLock } from "@/hooks";
import { duration, ease } from "@/lib/motion-tokens";

import { NavLinks, type NavLinkItem } from "./nav-links";

interface MobileMenuProps {
  items: readonly NavLinkItem[];
  openLabel: string;
  closeLabel: string;
}

/**
 * Drawer de navegacion para viewports chicos.
 *
 * Tres piezas de accesibilidad que suelen faltar en este componente:
 *   1. El foco queda atrapado dentro mientras esta abierto (useFocusTrap).
 *   2. Escape cierra y el foco vuelve al boton que lo abrio.
 *   3. El scroll del body se bloquea compensando el ancho de la scrollbar,
 *      asi que el contenido de atras no salta al abrir.
 */
export function MobileMenu({ items, openLabel, closeLabel }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useScrollLock(isOpen);
  useFocusTrap(panelRef, isOpen);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={openLabel}
        aria-expanded={isOpen}
        aria-controls="mobile-menu-panel"
        className="grid size-11 place-items-center rounded-md text-fg-muted transition-colors duration-150 hover:bg-surface hover:text-fg md:hidden"
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            className="fixed inset-0 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.fast }}
          >
            {/* Telon. Click fuera cierra; aria-hidden porque el boton de
                cierre del panel ya cubre el caso accesible. */}
            <div
              aria-hidden="true"
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-base/80 backdrop-blur-sm"
            />

            <motion.div
              ref={panelRef}
              id="mobile-menu-panel"
              role="dialog"
              aria-modal="true"
              aria-label={closeLabel}
              initial={{
                x: shouldReduceMotion ? 0 : "100%",
                opacity: shouldReduceMotion ? 0 : 1,
              }}
              animate={{ x: 0, opacity: 1 }}
              exit={{
                x: shouldReduceMotion ? 0 : "100%",
                opacity: shouldReduceMotion ? 0 : 1,
              }}
              transition={{ duration: duration.base, ease: ease.out }}
              className="absolute inset-y-0 right-0 flex w-full max-w-xs flex-col border-l border-line-strong bg-surface p-6"
            >
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label={closeLabel}
                  className="grid size-11 place-items-center rounded-md text-fg-muted transition-colors duration-150 hover:bg-raised hover:text-fg"
                >
                  <X className="size-5" aria-hidden="true" />
                </button>
              </div>

              <nav aria-label={closeLabel} className="mt-8">
                <NavLinks
                  items={items}
                  orientation="vertical"
                  onNavigate={() => setIsOpen(false)}
                />
              </nav>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

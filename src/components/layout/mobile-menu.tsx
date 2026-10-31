"use client";

import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

import { useFocusTrap, useScrollLock } from "@/hooks";
import { duration, ease } from "@/lib/motion-tokens";

import { NavLinks, type NavLinkItem } from "./nav-links";

interface MobileMenuProps {
  items: readonly NavLinkItem[];
  openLabel: string;
  closeLabel: string;
}

const subscribeNoop = () => () => {};

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
  // false en el servidor y en la hidratacion, true despues: el portal solo
  // existe en el cliente, sin mismatch.
  const isClient = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );

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
        className="grid size-10 shrink-0 place-items-center rounded-full border border-border-interactive/50 bg-bg-surface text-text-secondary transition-colors duration-150 hover:border-accent-400 hover:text-accent-400 md:hidden"
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>

      {/* Portal a <body>: dentro del header, un `backdrop-filter` o un
          `transform` del ancestro vuelve al header el bloque contenedor del
          `fixed inset-0`, y el panel quedaba encajado en los 64px de la
          barra al hacer scroll. */}
      {isClient
        ? createPortal(
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
                    className="absolute inset-0 bg-bg-base/80 backdrop-blur-sm"
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
                    className="absolute inset-y-0 right-0 flex w-full max-w-xs flex-col border-l border-border-default bg-bg-surface p-6"
                  >
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        aria-label={closeLabel}
                        className="grid size-11 place-items-center rounded-md text-text-secondary transition-colors duration-150 hover:bg-bg-surface-raised hover:text-text-primary"
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
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  );
}

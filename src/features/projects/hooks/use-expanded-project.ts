"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const HASH_PREFIX = "proyecto/";

/** Lee el slug desde el hash de la URL: `#proyecto/mi-sistema`. */
function readSlugFromHash(): string | null {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash;
  if (!hash.startsWith(`#${HASH_PREFIX}`)) return null;
  return decodeURIComponent(hash.slice(HASH_PREFIX.length + 1));
}

/**
 * Estado expandido del grid de proyectos.
 *
 * Tres responsabilidades, todas atadas a un unico estado:
 *  1. Sincronizacion con el hash (#proyecto/{slug}): el panel abierto es
 *     compartible sin rutas dedicadas, y el boton "atras" lo cierra.
 *  2. Bloqueo de scroll del body con compensacion del ancho de la scrollbar:
 *     sin esto, ocultar el scroll hace saltar el layout.
 *  3. Retorno de foco: al cerrar, el foco vuelve exactamente a la tarjeta
 *     que abrio el panel.
 */
export function useExpandedProject() {
  const [expandedSlug, setExpandedSlug] = useState<string | null>(() =>
    readSlugFromHash(),
  );
  const triggerRef = useRef<HTMLElement | null>(null);

  const open = useCallback((slug: string) => {
    triggerRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setExpandedSlug(slug);
    history.pushState(null, "", `#${HASH_PREFIX}${slug}`);
  }, []);

  const close = useCallback(() => {
    setExpandedSlug(null);
    // Quitar SOLO el hash, conservando pathname y query del locale.
    history.pushState(
      null,
      "",
      window.location.pathname + window.location.search,
    );
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  // Sincronizar cuando el usuario navega con atras/adelante.
  useEffect(() => {
    const sync = () => setExpandedSlug(readSlugFromHash());
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  // Bloqueo de scroll con compensacion de scrollbar.
  useEffect(() => {
    if (!expandedSlug) return;

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
    };
  }, [expandedSlug]);

  return { expandedSlug, open, close };
}

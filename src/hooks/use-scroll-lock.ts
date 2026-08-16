"use client";

import { useEffect } from "react";

/**
 * Bloquea el scroll del documento mientras haya un overlay abierto.
 *
 * La compensacion del ancho de la scrollbar es lo que evita el salto lateral
 * de 15px al abrir: al ocultar el overflow, la barra desaparece y el contenido
 * se corre. Se reemplaza por padding equivalente.
 *
 * Se reutiliza en el panel de detalle de proyectos (Fase 6).
 */
export function useScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;

    const { body, documentElement } = document;
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;

    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;

    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
    };
  }, [locked]);
}

"use client";

import { useEffect, useState } from "react";

/**
 * Devuelve el id de la seccion visible en el viewport.
 *
 * `rootMargin` recorta la zona de deteccion a la banda central de la pantalla:
 * sin eso, la seccion se marcaria activa apenas asoma por abajo, y el
 * indicador iria siempre una seccion adelantado respecto de lo que el usuario
 * esta leyendo.
 */
export function useActiveSection(sectionIds: readonly string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  // Se depende de la cadena y no del array: un array literal en el componente
  // padre seria una referencia nueva en cada render y reinstalaria el
  // observer indefinidamente.
  const key = sectionIds.join(",");

  useEffect(() => {
    const ids = key.split(",").filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (mostVisible) {
          setActiveId(mostVisible.target.id);
        }
      },
      {
        rootMargin: "-35% 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [key]);

  return activeId;
}

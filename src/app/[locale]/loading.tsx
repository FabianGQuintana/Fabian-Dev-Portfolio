"use client";

import { motion } from "motion/react";

/**
 * Estado de carga de ruta (fallback del Suspense del segmento `[locale]`).
 *
 * Barra de progreso fina y NO opaca en la parte superior: informa al
 * usuario sin tapar el contenido. La carga pesada (fetch a GitHub) ya esta
 * aislada en un <Suspense> local en page.tsx, asi que este boundary solo
 * aparece en transiciones de ruta y nunca cubre el hero.
 */
export default function Loading() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 overflow-hidden"
    >
      <motion.div
        className="h-full w-1/3 bg-accent-500"
        initial={{ x: "-100%" }}
        animate={{ x: "300%" }}
        transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

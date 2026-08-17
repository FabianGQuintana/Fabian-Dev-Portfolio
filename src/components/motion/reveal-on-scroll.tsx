"use client";

import { motion, useReducedMotion } from "motion/react";

import {
  duration,
  ease,
  ENTER_OFFSET_Y,
  VIEWPORT_ONCE,
} from "@/lib/motion-tokens";

interface RevealOnScrollProps extends React.ComponentProps<typeof motion.div> {
  delay?: number;
  offsetY?: number;
}

/**
 * Entrada al llegar al viewport.
 *
 * `once: true` es deliberado: re-animar al volver a subir convierte el scroll
 * en un espectaculo y molesta a la segunda pasada. El margen negativo dispara
 * la animacion un poco antes del borde, para que el elemento ya este visible
 * cuando el ojo llega.
 */
export function RevealOnScroll({
  children,
  delay = 0,
  offsetY = ENTER_OFFSET_Y,
  ...props
}: RevealOnScrollProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : offsetY }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT_ONCE}
      transition={{ duration: duration.slow, ease: ease.out, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

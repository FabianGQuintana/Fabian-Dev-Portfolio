"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

/**
 * Barra de progreso de lectura, fija en el borde superior.
 *
 * `scaleX` sobre un elemento con `origin-left` corre en el compositor: no
 * dispara layout ni paint en cada frame de scroll, a diferencia de animar
 * `width`.
 */
export function ScrollProgress() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  // El spring suaviza el micro-temblor del scroll con rueda de mouse.
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });

  if (shouldReduceMotion) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-gradient-to-r from-accent-500 to-accent-300"
    />
  );
}

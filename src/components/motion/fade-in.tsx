"use client";

import { motion, useReducedMotion } from "motion/react";

import { duration, ease, ENTER_OFFSET_Y } from "@/lib/motion-tokens";

interface FadeInProps extends React.ComponentProps<typeof motion.div> {
  /** Retraso de entrada en segundos. */
  delay?: number;
  /** Desplazamiento vertical inicial en pixeles. */
  offsetY?: number;
}

/**
 * Entrada al montar: opacidad + desplazamiento vertical.
 *
 * Con movimiento reducido se conserva SOLO la opacidad. El fade no produce
 * malestar vestibular; la traslacion si. Eliminar la animacion por completo
 * seria peor: el usuario perderia la señal de que algo aparecio.
 */
export function FadeIn({
  children,
  delay = 0,
  offsetY = ENTER_OFFSET_Y,
  ...props
}: FadeInProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : offsetY }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.base, ease: ease.out, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

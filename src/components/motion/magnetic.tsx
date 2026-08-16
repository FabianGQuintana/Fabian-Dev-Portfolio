"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useCallback } from "react";

import { spring } from "@/lib/motion-tokens";

interface MagneticProps extends React.ComponentProps<typeof motion.div> {
  /** Desplazamiento maximo en pixeles. Mas de 8 se siente caricaturesco. */
  strength?: number;
}

/**
 * Atraccion sutil del elemento hacia el cursor.
 *
 * El limite de 6px es intencional: el efecto tiene que percibirse como
 * respuesta, no como truco. Se desactiva por completo con movimiento
 * reducido, ya que es puro desplazamiento.
 */
export function Magnetic({ children, strength = 6, ...props }: MagneticProps) {
  const shouldReduceMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const smoothX = useSpring(x, spring.snappy);
  const smoothY = useSpring(y, spring.snappy);

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const bounds = event.currentTarget.getBoundingClientRect();
      const offsetX = event.clientX - (bounds.left + bounds.width / 2);
      const offsetY = event.clientY - (bounds.top + bounds.height / 2);

      // Normalizado a [-1, 1] y escalado, para que el efecto sea igual de
      // sutil en un boton chico que en uno grande.
      x.set((offsetX / (bounds.width / 2)) * strength);
      y.set((offsetY / (bounds.height / 2)) * strength);
    },
    [x, y, strength],
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  // Un solo return, sin casts: con movimiento reducido se apagan el estilo y
  // los listeners, pero el elemento sigue siendo el mismo motion.div. La rama
  // alternativa con <div> obligaba a castear `children`, que en un motion
  // component puede ser un MotionValue.
  return (
    <motion.div
      style={shouldReduceMotion ? undefined : { x: smoothX, y: smoothY }}
      onMouseMove={shouldReduceMotion ? undefined : handleMouseMove}
      onMouseLeave={shouldReduceMotion ? undefined : handleMouseLeave}
      {...props}
    >
      {children}
    </motion.div>
  );
}

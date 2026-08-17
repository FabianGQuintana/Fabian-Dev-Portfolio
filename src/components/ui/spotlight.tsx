"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useCallback } from "react";

import { cn } from "@/lib/utils";

interface SpotlightProps extends React.ComponentProps<"div"> {
  /** Radio del resplandor en pixeles. */
  size?: number;
  /** Intensidad del resplandor, de 0 a 1. */
  intensity?: number;
}

/**
 * Contenedor con un resplandor violeta que sigue al cursor.
 *
 * Dos decisiones de rendimiento:
 * 1. Las coordenadas viven en MotionValues, no en estado de React: el
 *    movimiento del mouse no dispara re-renders.
 * 2. La capa de resplandor es un pseudo-hermano con `pointer-events-none`,
 *    asi que no interfiere con los clicks del contenido.
 *
 * Con `prefers-reduced-motion: reduce` el efecto se desactiva por completo.
 */
export function Spotlight({
  children,
  className,
  size = 400,
  intensity = 0.14,
  ...props
}: SpotlightProps) {
  const shouldReduceMotion = useReducedMotion();

  const mouseX = useMotionValue(-size);
  const mouseY = useMotionValue(-size);

  // El spring evita que el resplandor "salte" con movimientos bruscos.
  const smoothX = useSpring(mouseX, { stiffness: 300, damping: 40, mass: 0.5 });
  const smoothY = useSpring(mouseY, { stiffness: 300, damping: 40, mass: 0.5 });

  const background = useMotionTemplate`radial-gradient(${size}px circle at ${smoothX}px ${smoothY}px, rgb(139 92 246 / ${intensity}), transparent 80%)`;

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const bounds = event.currentTarget.getBoundingClientRect();
      mouseX.set(event.clientX - bounds.left);
      mouseY.set(event.clientY - bounds.top);
    },
    [mouseX, mouseY],
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(-size);
    mouseY.set(-size);
  }, [mouseX, mouseY, size]);

  if (shouldReduceMotion) {
    return (
      <div className={cn("relative", className)} {...props}>
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn("group relative isolate", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background }}
      />
      {children}
    </div>
  );
}

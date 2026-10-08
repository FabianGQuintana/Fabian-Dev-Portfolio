"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef } from "react";

interface ScrollParallaxProps {
  children: React.ReactNode;
  /** Desplazamiento vertical (px) al salir de pantalla. Negativo = sube mas rapido. */
  distance?: number;
  /** Escala final al salir de pantalla. */
  scaleTo?: number;
  /** Se desvanece mientras sale. */
  fade?: boolean;
  className?: string;
}

/**
 * Mueve su contenido a otra velocidad que el scroll mientras el bloque sale
 * de pantalla por arriba. Dos capas con `distance` distinto (texto y
 * teclado del hero) generan profundidad sin ningun listener manual.
 */
export function ScrollParallax({
  children,
  distance = -80,
  scaleTo = 1,
  fade = false,
  className,
}: ScrollParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, distance]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, scaleTo]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, fade ? 0 : 1]);

  return (
    <motion.div
      ref={ref}
      style={shouldReduceMotion ? undefined : { y, scale, opacity }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

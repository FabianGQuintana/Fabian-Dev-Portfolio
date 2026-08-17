"use client";

import { motion, useReducedMotion } from "motion/react";

import { duration, ease, VIEWPORT_ONCE } from "@/lib/motion-tokens";

interface StaggerContainerProps extends React.ComponentProps<
  typeof motion.div
> {
  /** Separacion entre la entrada de cada hijo, en segundos. */
  staggerDelay?: number;
}

/**
 * Escalona la entrada de sus hijos directos.
 * Los hijos deben ser `<StaggerItem>` (o cualquier motion component que
 * declare las variants `hidden` / `visible`).
 */
export function StaggerContainer({
  children,
  staggerDelay = 0.08,
  ...props
}: StaggerContainerProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: shouldReduceMotion ? 0 : staggerDelay,
            delayChildren: shouldReduceMotion ? 0 : 0.1,
          },
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** Hijo de `StaggerContainer`. Hereda el timing del padre. */
export function StaggerItem({
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: duration.base, ease: ease.out },
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

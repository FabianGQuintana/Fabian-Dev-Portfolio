import type { Transition, Variants } from "motion/react";

/**
 * Vocabulario de movimiento del sitio.
 *
 * Ninguna duracion ni curva se escribe a mano dentro de un componente: si el
 * ritmo del sitio se siente lento, se corrige aqui una vez y cambia en todos
 * lados. Los valores estan espejados con las variables CSS de globals.css.
 */

/** Duraciones en segundos (la unidad que espera Motion). */
export const duration = {
  fast: 0.15,
  base: 0.3,
  slow: 0.6,
} as const;

/** Curvas de aceleracion como tuplas de bezier. */
export const ease = {
  /** Todo lo que ENTRA: arranca rapido y frena suave. */
  out: [0.16, 1, 0.3, 1],
  outQuart: [0.25, 1, 0.5, 1],
  /** Cambios de estado de ida y vuelta. */
  inOut: [0.65, 0, 0.35, 1],
} as const;

/** Resortes. Para movimiento de layout y microinteracciones. */
export const spring = {
  /** Paneles, transiciones de layout compartido. */
  soft: { type: "spring", stiffness: 260, damping: 30 },
  /** Botones magneticos, hover. Responde mas rapido. */
  snappy: { type: "spring", stiffness: 400, damping: 25 },
} as const satisfies Record<string, Transition>;

/** Transicion por defecto para entradas. */
export const enterTransition: Transition = {
  duration: duration.base,
  ease: ease.out,
};

/** Desplazamiento vertical estandar de las entradas, en pixeles. */
export const ENTER_OFFSET_Y = 24;

/**
 * Variants reutilizables.
 * Se exportan como constantes en vez de definirse inline para que el mismo
 * gesto se vea identico en todo el sitio.
 */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: ENTER_OFFSET_Y },
  visible: { opacity: 1, y: 0, transition: enterTransition },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: enterTransition },
};

/** Contenedor que escalona la entrada de sus hijos. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

/** Margen de viewport para los reveals: dispara antes de llegar al borde. */
export const VIEWPORT_ONCE = { once: true, margin: "-100px" } as const;

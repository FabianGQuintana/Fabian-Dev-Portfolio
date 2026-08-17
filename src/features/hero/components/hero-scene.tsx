"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { useEffect } from "react";

import { spring } from "@/lib/motion-tokens";

/**
 * Capas del sistema apiladas en perspectiva isométrica: Frontend, API y
 * Base de Datos. Cada plano flota lentamente y todo el stack se inclina
 * con el puntero, sugiriendo la arquitectura de punta a punta.
 *
 * Rendimiento: las coordenadas viven en MotionValues; el movimiento del
 * mouse no dispara re-renders. Con `prefers-reduced-motion` el stack queda
 * estático en su posición de reposo (sin flotar ni inclinarse).
 */

const LAYERS = [
  { id: "frontend", label: "Frontend", hint: "React · Next.js", y: 0, z: 80 },
  { id: "api", label: "API", hint: "Node.js · REST", y: -58, z: 40 },
  { id: "db", label: "Base de Datos", hint: "PostgreSQL", y: -116, z: 0 },
] as const;

// Tilt base: el stack ya se lee como 3D en reposo, sin mouse.
const BASE_TILT_X = 12;
const BASE_TILT_Y = -24;

export function HeroScene() {
  const shouldReduceMotion = useReducedMotion();

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const rotateY = useSpring(
    useTransform(pointerX, [-0.5, 0.5], [BASE_TILT_Y + 10, BASE_TILT_Y - 10]),
    spring.soft,
  );
  const rotateX = useSpring(
    useTransform(pointerY, [-0.5, 0.5], [BASE_TILT_X - 8, BASE_TILT_X + 8]),
    spring.soft,
  );

  useEffect(() => {
    if (shouldReduceMotion) return;

    const handlePointer = (event: PointerEvent) => {
      pointerX.set(event.clientX / window.innerWidth - 0.5);
      pointerY.set(event.clientY / window.innerHeight - 0.5);
    };

    window.addEventListener("pointermove", handlePointer, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointer);
  }, [pointerX, pointerY, shouldReduceMotion]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden lg:block"
    >
      <div className="absolute top-1/2 right-[6%] h-[460px] w-[460px] -translate-y-1/2 [perspective:1200px]">
        <motion.div
          className="relative h-full w-full will-change-transform [transform-style:preserve-3d]"
          style={
            shouldReduceMotion
              ? { rotateX: BASE_TILT_X, rotateY: BASE_TILT_Y }
              : { rotateX, rotateY }
          }
        >
          {LAYERS.map((layer, i) => (
            <motion.div
              key={layer.id}
              className="absolute top-1/2 left-1/2 w-[300px]"
              style={{ x: "-50%", z: layer.z }}
              animate={
                shouldReduceMotion
                  ? { y: layer.y }
                  : { y: [layer.y, layer.y - 14, layer.y] }
              }
              transition={{
                duration: 5.5 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.45,
              }}
            >
              <LayerCard label={layer.label} hint={layer.hint} index={i} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function LayerCard({
  label,
  hint,
  index,
}: {
  label: string;
  hint: string;
  index: number;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-accent-500/60 bg-bg-surface/30 p-5 shadow-[0_0_40px_-12px_rgba(124,58,237,0.45)] backdrop-blur-md">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-400/80 to-transparent" />

      <div className="flex items-center gap-2">
        <span className="size-2 rounded-full bg-accent-400 shadow-[0_0_12px_2px_rgba(167,139,250,0.8)]" />
        <span className="font-mono text-sm tracking-wider text-text-primary uppercase">
          {label}
        </span>
      </div>

      <p className="mt-2 font-mono text-xs text-text-secondary">{hint}</p>

      {/* Filas tipo esquema: refuerzan la idea de "capa de datos". */}
      <div className="mt-4 space-y-1.5">
        {[0, 1, 2].map((row) => (
          <div
            key={row}
            className="h-1.5 rounded-full bg-accent-500/15"
            style={{ width: `${72 - (row + index) * 14}%` }}
          />
        ))}
      </div>
    </div>
  );
}

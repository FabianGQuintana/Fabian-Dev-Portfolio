"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";

import { cn } from "@/lib/utils";

interface AvatarPortraitProps {
  /** null = placeholder con iniciales. */
  photo: { src: string; alt: string } | null;
  initials: string;
  className?: string;
}

/**
 * Contorno del marco punteado, en el viewBox 300x400 (ratio 3:4, igual que
 * la foto). Rectangulo redondeado recorrido en sentido horario; los satelites
 * siguen este mismo path.
 */
const FRAME_PATH =
  "M45 1H255A44 44 0 0 1 299 45V355A44 44 0 0 1 255 399H45A44 44 0 0 1 1 355V45A44 44 0 0 1 45 1Z";

const ORBIT_SECONDS = 36;

/**
 * Retrato vertical (3:4) de la seccion Sobre mi.
 *
 * Capas: un resplandor de fondo, un borde de degradado que gira, un marco
 * punteado con dos "satelites" que recorren su contorno, y la foto. La foto
 * ocupa exactamente un 3:4, asi que una imagen con ese ratio entra completa
 * sin recortes. Con prefers-reduced-motion todo queda quieto.
 */
export function AvatarPortrait({
  photo,
  initials,
  className,
}: AvatarPortraitProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={cn(
        "relative mx-auto aspect-[3/4] w-full max-w-[18rem] sm:max-w-[20rem]",
        className,
      )}
      animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
      transition={{ duration: 7, ease: "easeInOut" as const, repeat: Infinity }}
    >
      {/* Resplandor de fondo. */}
      <div
        aria-hidden="true"
        className="absolute inset-[-10%] rounded-[3rem] bg-accent-500/25 blur-3xl"
      />

      {/* Borde de degradado: un cuadrado con conic-gradient, mas grande que
          la diagonal del marco, gira detras de la foto y solo asoma por el
          borde. */}
      <div
        aria-hidden="true"
        className="absolute inset-[-7px] flex items-center justify-center overflow-hidden rounded-[calc(2rem+7px)]"
      >
        <motion.div
          className="aspect-square w-[180%] shrink-0 bg-[conic-gradient(from_0deg,var(--color-accent-500),transparent_35%,var(--color-accent-300)_60%,transparent_85%,var(--color-accent-500))]"
          animate={reduceMotion ? undefined : { rotate: 360 }}
          transition={{
            duration: 14,
            ease: "linear" as const,
            repeat: Infinity,
          }}
        />
      </div>

      {/* Marco punteado con satelites que recorren el contorno. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 300 400"
        className="absolute inset-[-6%] size-[112%] overflow-visible"
      >
        <path
          d={FRAME_PATH}
          fill="none"
          strokeDasharray="4 6"
          vectorEffect="non-scaling-stroke"
          className="stroke-accent-500/50"
        >
          {!reduceMotion && (
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="-100"
              dur={`${ORBIT_SECONDS}s`}
              repeatCount="indefinite"
            />
          )}
        </path>
        <Satellite
          r={4.5}
          className="fill-accent-400 drop-shadow-[0_0_6px_var(--color-accent-500)]"
          begin={0}
          animated={!reduceMotion}
          staticPosition={{ cx: 1, cy: 120 }}
        />
        <Satellite
          r={3.5}
          className="fill-accent-300"
          begin={-ORBIT_SECONDS / 2}
          animated={!reduceMotion}
          staticPosition={{ cx: 299, cy: 280 }}
        />
      </svg>

      {/* Foto. El anillo del color de fondo separa la foto del degradado. */}
      <div className="absolute inset-0 overflow-hidden rounded-[2rem] bg-bg-surface shadow-[0_0_0_4px_var(--color-bg-base)]">
        {photo ? (
          // unoptimized: se sirve el archivo original tal cual, sin
          // recompresion ni cambio de formato.
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="grid size-full place-items-center bg-[radial-gradient(circle_at_30%_25%,var(--color-accent-700),var(--color-bg-surface)_70%)]"
          >
            <span className="font-[family-name:var(--font-display-family)] text-[clamp(4rem,12vw,7rem)] font-semibold tracking-tighter text-white/90">
              {initials}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface SatelliteProps {
  r: number;
  className: string;
  /** Desfase en segundos; negativo = arranca ya avanzado en el recorrido. */
  begin: number;
  animated: boolean;
  /** Posicion fija cuando no hay animacion. */
  staticPosition: { cx: number; cy: number };
}

/** Particula que recorre el contorno del marco en sentido antihorario. */
function Satellite({
  r,
  className,
  begin,
  animated,
  staticPosition,
}: SatelliteProps) {
  if (!animated) {
    return <circle r={r} className={className} {...staticPosition} />;
  }

  return (
    <circle r={r} className={className}>
      <animateMotion
        path={FRAME_PATH}
        dur={`${ORBIT_SECONDS}s`}
        begin={`${begin}s`}
        repeatCount="indefinite"
        keyPoints="1;0"
        keyTimes="0;1"
        calcMode="linear"
      />
    </circle>
  );
}

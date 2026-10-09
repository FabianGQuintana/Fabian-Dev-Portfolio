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
 * Avatar circular grande de la seccion Sobre mi.
 *
 * Tres capas: un aro de degradado que gira lento, un aro punteado que gira
 * al reves con dos "satelites", y el circulo con la foto (o el placeholder).
 * Con prefers-reduced-motion todo queda quieto.
 */
export function AvatarPortrait({
  photo,
  initials,
  className,
}: AvatarPortraitProps) {
  const reduceMotion = useReducedMotion();
  const spin = (seconds: number, reverse = false) =>
    reduceMotion
      ? undefined
      : {
          animate: { rotate: reverse ? -360 : 360 },
          transition: {
            duration: seconds,
            ease: "linear" as const,
            repeat: Infinity,
          },
        };

  return (
    <motion.div
      className={cn(
        "relative mx-auto aspect-square w-full max-w-[22rem] sm:max-w-[26rem]",
        className,
      )}
      animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
      transition={{ duration: 7, ease: "easeInOut" as const, repeat: Infinity }}
    >
      {/* Resplandor de fondo. */}
      <div
        aria-hidden="true"
        className="absolute inset-[-12%] rounded-full bg-accent-500/25 blur-3xl"
      />

      {/* Aro de degradado. */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,var(--color-accent-500),transparent_35%,var(--color-accent-300)_60%,transparent_85%,var(--color-accent-500))]"
        {...spin(14)}
      />

      {/* Aro punteado con satelites. */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-[-7%] rounded-full border border-dashed border-accent-500/40"
        {...spin(36, true)}
      >
        <span className="absolute top-[14%] left-[6%] size-2.5 rounded-full bg-accent-400 shadow-glow-sm" />
        <span className="absolute right-[10%] bottom-[18%] size-2 rounded-full bg-accent-300" />
      </motion.div>

      {/* Circulo con la foto. El borde grueso deja ver el aro de degradado. */}
      <div className="absolute inset-[3%] overflow-hidden rounded-full border-[6px] border-bg-base bg-bg-surface">
        {photo ? (
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(min-width: 1024px) 26rem, 80vw"
            className="object-cover"
            priority
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

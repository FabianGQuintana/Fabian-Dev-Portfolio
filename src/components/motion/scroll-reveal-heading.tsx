"use client";

import {
  motion,
  type MotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef } from "react";

import { cn } from "@/lib/utils";

interface ScrollRevealHeadingProps {
  id?: string;
  text: string;
  className?: string;
  /** Nivel del titulo. Por defecto h2 (titular de seccion). */
  as?: "h2" | "h3";
  /** Contenido previo al texto que no se anima (p. ej. un icono). */
  leading?: React.ReactNode;
}

/**
 * Titular de seccion que se "enciende" palabra por palabra al hacer scroll.
 *
 * El progreso esta atado a la posicion del titulo en pantalla (no a un
 * temporizador): al bajar se ilumina, al subir se apaga. Cada palabra es un
 * span aria-hidden; el h2 lleva el texto completo en aria-label para que el
 * lector de pantalla anuncie una frase limpia.
 *
 * Con `as="h3"` sirve tambien para subtitulos (las columnas de Trayectoria):
 * sin estilos por defecto, los pone quien lo usa.
 */
export function ScrollRevealHeading({
  id,
  text,
  className,
  as: Tag = "h2",
  leading,
}: ScrollRevealHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    // Empieza cuando el titulo asoma por abajo y termina a media pantalla.
    offset: ["start 0.95", "start 0.5"],
  });
  const words = text.split(" ");

  const content = words.map((word, index) =>
    shouldReduceMotion ? (
      <span key={index} aria-hidden="true">
        {word}{" "}
      </span>
    ) : (
      <Word
        key={index}
        progress={scrollYProgress}
        range={[index / words.length, (index + 1) / words.length]}
      >
        {word}
      </Word>
    ),
  );

  return (
    <Tag
      ref={ref}
      id={id}
      aria-label={text}
      className={cn(
        Tag === "h2" && "max-w-3xl text-h2 text-balance",
        className,
      )}
    >
      {leading ? (
        <>
          {leading}
          <span>{content}</span>
        </>
      ) : (
        content
      )}
    </Tag>
  );
}

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const y = useTransform(progress, range, [18, 0]);
  const blur = useTransform(progress, range, ["blur(6px)", "blur(0px)"]);

  return (
    <motion.span
      aria-hidden="true"
      style={{ opacity, y, filter: blur }}
      className="mr-[0.25em] inline-block"
    >
      {children}
    </motion.span>
  );
}

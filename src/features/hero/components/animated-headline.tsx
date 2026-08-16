"use client";

import { motion, useReducedMotion } from "motion/react";

import { duration, ease } from "@/lib/motion-tokens";

interface AnimatedHeadlineProps {
  text: string;
  id: string;
}

/**
 * Titular con entrada escalonada por palabras.
 *
 * Cada palabra es un <motion.span aria-hidden>: el h1 lleva aria-label con
 * el texto completo para que el lector de pantalla anuncie una sola frase
 * limpia, no fragmentos sueltos con pausas artificiales entre ellos.
 */
export function AnimatedHeadline({ text, id }: AnimatedHeadlineProps) {
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(" ");

  return (
    <h1
      id={id}
      aria-label={text}
      className="mt-6 max-w-4xl text-display text-balance"
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          aria-hidden="true"
          className="inline-block"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: duration.base,
            ease: ease.out,
            delay: shouldReduceMotion ? 0 : index * 0.08,
          }}
        >
          {word}
          {index < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </h1>
  );
}

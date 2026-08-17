"use client";

import { motion, useReducedMotion } from "motion/react";

import { duration, ease, VIEWPORT_ONCE } from "@/lib/motion-tokens";

interface LanguageSegment {
  name: string;
  percentage: number;
  color: string;
}

interface LanguageBarProps {
  languages: LanguageSegment[];
  /** Etiqueta accesible de la barra (p. ej. "Lenguajes"). */
  label: string;
}

/**
 * Barra segmentada de distribucion de lenguajes.
 *
 * Los segmentos crecen desde 0 al entrar en viewport, con un leve stagger.
 * Con movimiento reducido la barra aparece completa de una vez: no hay
 * translacion que cause malestar, solo un scaleX.
 */
export function LanguageBar({ languages, label }: LanguageBarProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div>
      <div
        role="img"
        aria-label={label}
        className="flex h-2 w-full overflow-hidden rounded-full bg-bg-surface-raised"
      >
        {languages.map((language, index) => (
          <motion.span
            key={language.name}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={VIEWPORT_ONCE}
            transition={{
              duration: shouldReduceMotion ? 0 : duration.slow,
              ease: ease.out,
              delay: shouldReduceMotion ? 0 : index * 0.05,
            }}
            className="origin-left"
            style={{ backgroundColor: language.color }}
            title={`${language.name} ${language.percentage}%`}
          />
        ))}
      </div>

      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {languages.map((language) => (
          <li key={language.name} className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="size-2 rounded-full"
              style={{ backgroundColor: language.color }}
            />
            <span className="font-mono text-xs text-text-muted">
              {language.name}
              <span className="text-text-secondary">
                {" "}
                · {language.percentage}%
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef } from "react";

import { StaggerContainer, StaggerItem } from "@/components/motion";
import type { ExperienceEntry } from "@/config/experience";
import type { Locale } from "@/i18n/routing";

import { TimelineItem } from "./timeline-item";

interface TimelineProps {
  items: readonly ExperienceEntry[];
  locale: Locale;
  presentLabel: string;
}

/**
 * Timeline vertical con reveal escalonado y linea que se dibuja con el scroll.
 *
 * La linea gris es la guia; encima, una linea violeta crece de arriba hacia
 * abajo segun cuanto del timeline ya paso por la pantalla. Con movimiento
 * reducido queda completa y fija.
 */
export function Timeline({ items, locale, presentLabel }: TimelineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.6"],
  });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={ref} className="relative pl-6 sm:pl-8">
      <div
        aria-hidden="true"
        className="absolute top-0 bottom-0 left-0 w-px bg-line-strong"
      />
      <motion.div
        aria-hidden="true"
        style={shouldReduceMotion ? undefined : { scaleY }}
        className="absolute top-0 bottom-0 left-0 w-px origin-top bg-accent-500"
      />

      <StaggerContainer>
        <ol className="space-y-10">
          {items.map((item) => (
            <StaggerItem key={item.id}>
              <TimelineItem
                entry={item}
                locale={locale}
                presentLabel={presentLabel}
              />
            </StaggerItem>
          ))}
        </ol>
      </StaggerContainer>
    </div>
  );
}

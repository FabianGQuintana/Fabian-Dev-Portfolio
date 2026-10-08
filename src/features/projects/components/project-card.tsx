"use client";

import { ArrowUpRight } from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef } from "react";

import { TechIcon } from "@/components/ui";
import type {
  ProjectCardModel,
  ProjectUiLabels,
} from "@/features/projects/types";
import type { Locale } from "@/i18n/routing";
import { spring } from "@/lib/motion-tokens";
import { cn } from "@/lib/utils";

import { ProjectCover } from "./project-cover";

interface ProjectCardProps {
  project: ProjectCardModel;
  labels: ProjectUiLabels;
  locale: Locale;
  /** La tarjeta grande del bento: mas texto y mas iconos. */
  featured: boolean;
  isExpanded: boolean;
  onOpen: () => void;
}

/** Iconos visibles en la tarjeta; el resto se ve en el detalle. */
const MAX_ICONS = { featured: 8, compact: 5 } as const;

/**
 * Tarjeta del bento.
 *
 * Es el ORIGEN de dos `layoutId` compartidos con el detalle: la tarjeta
 * entera (`project-*`) y su portada (`cover-*`). Al abrirla, Motion
 * interpola ambas hasta el detalle a pantalla completa: la sensacion es
 * entrar en la tarjeta, no abrir un modal encima.
 *
 * Hover: la portada hace zoom y los iconos del stack muestran su nombre.
 * Scroll: la portada se desplaza un poco mas lento que la tarjeta
 * (parallax), lo que da profundidad al bajar por la seccion.
 */
export function ProjectCard({
  project,
  labels,
  locale,
  featured,
  isExpanded,
  onOpen,
}: ProjectCardProps) {
  const ref = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const content = project.content[locale];
  const tech = project.highlightedTech ?? [];
  const visibleTech = tech.slice(
    0,
    featured ? MAX_ICONS.featured : MAX_ICONS.compact,
  );
  const hiddenCount = tech.length - visibleTech.length;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const coverY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <motion.article
      ref={ref}
      layoutId={`project-${project.slug}`}
      transition={spring.soft}
      className={cn(
        "group relative isolate h-full min-h-[20rem] overflow-hidden rounded-2xl border border-border-default bg-bg-surface",
        "transition-[border-color,box-shadow] duration-300 hover:border-accent-500/60 hover:shadow-glow",
        !featured && "lg:min-h-[17rem]",
        isExpanded && "pointer-events-none opacity-0",
      )}
      aria-hidden={isExpanded}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-expanded={isExpanded}
        aria-label={`${labels.expand}: ${content.title}`}
        className="absolute inset-0 flex flex-col justify-end text-left"
      >
        {/* Portada: parallax con el scroll + zoom en hover. */}
        <motion.div
          layoutId={`cover-${project.slug}`}
          transition={spring.soft}
          className="absolute inset-0 -z-10"
        >
          <motion.div
            style={shouldReduceMotion ? undefined : { y: coverY }}
            className="absolute -inset-[8%] transition-transform duration-700 ease-out-expo group-hover:scale-110"
          >
            <ProjectCover
              project={project}
              title={content.title}
              sizes={
                featured
                  ? "(min-width: 1024px) 66vw, 100vw"
                  : "(min-width: 1024px) 33vw, 100vw"
              }
              className="size-full"
            />
          </motion.div>
        </motion.div>

        {/* Degradado para que el texto se lea sobre cualquier portada. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/45 to-transparent"
        />

        <div className="p-6 sm:p-8">
          <span className="text-label text-white/70">
            {labels.status[project.status]}
          </span>
          <h3
            className={cn(
              "mt-1 text-white",
              featured
                ? "text-[clamp(1.75rem,3.5vw,2.75rem)] leading-tight font-semibold tracking-tight"
                : "text-h3",
            )}
          >
            {content.title}
          </h3>
          <p
            className={cn(
              "mt-2 max-w-[52ch] text-sm leading-relaxed text-white/75",
              !featured && "line-clamp-2",
            )}
          >
            {content.tagline}
          </p>

          {visibleTech.length > 0 ? (
            <ul
              aria-label={labels.stack}
              className="mt-5 flex flex-wrap items-center gap-2"
            >
              {visibleTech.map((name) => (
                <li key={name}>
                  <TechIcon
                    name={name}
                    className="border-white/15 bg-black/40 text-white"
                    revealLabel
                  />
                </li>
              ))}
              {hiddenCount > 0 ? (
                <li className="font-mono text-xs text-white/70">
                  +{hiddenCount}
                </li>
              ) : null}
            </ul>
          ) : null}

          <span className="mt-6 inline-flex items-center gap-1.5 text-label text-white/90 transition-colors group-hover:text-white">
            {labels.expand}
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </div>
      </button>
    </motion.article>
  );
}

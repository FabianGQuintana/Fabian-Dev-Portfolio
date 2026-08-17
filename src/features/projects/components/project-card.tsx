"use client";

import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { buttonVariants } from "@/components/ui";
import type {
  ProjectCardModel,
  ProjectUiLabels,
} from "@/features/projects/types";
import type { Locale } from "@/i18n/routing";
import { spring } from "@/lib/motion-tokens";
import { cn } from "@/lib/utils";

import { RepoStats } from "./repo-stats";
import { TechBadge } from "./tech-badge";

interface ProjectCardProps {
  project: ProjectCardModel;
  labels: ProjectUiLabels;
  locale: Locale;
  isExpanded: boolean;
  onOpen: () => void;
}

/**
 * Tarjeta del grid.
 *
 * Es el ORIGEN del `layoutId` compartido: cuando el panel de detalle se monta
 * con el mismo `layoutId`, Motion interpola posicion, tamaño y bordes — la
 * tarjeta se convierte en el panel, no desaparece y aparece otra.
 *
 * El area principal es un <button> (accesible, `aria-expanded`); los enlaces
 * viven en el footer, FUERA del boton, para no anidar interactivos.
 * Mientras esta expandida la tarjeta queda invisible: evita el duplicado
 * visual que se veria debajo del overlay.
 */
export function ProjectCard({
  project,
  labels,
  locale,
  isExpanded,
  onOpen,
}: ProjectCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const content = project.content[locale];
  const { links } = project;

  const mainRepoLabel = links?.frontendRepo ? labels.viewApi : labels.viewRepo;

  return (
    <motion.article
      layoutId={`project-${project.slug}`}
      transition={spring.soft}
      whileHover={shouldReduceMotion ? undefined : { y: -4 }}
      className={cn(
        "group relative flex h-full flex-col rounded-lg border border-border-default bg-bg-surface",
        "transition-colors duration-300 ease-out-quart hover:border-accent-500/50 hover:bg-bg-surface-raised",
        isExpanded && "pointer-events-none opacity-0",
      )}
      aria-hidden={isExpanded}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-expanded={isExpanded}
        className="flex w-full flex-1 flex-col p-6 text-left"
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-h3 text-text-primary">{content.title}</h3>
          <ArrowUpRight
            aria-hidden="true"
            className="mt-1 size-4 shrink-0 text-text-muted transition-colors group-hover:text-accent-400"
          />
        </div>

        <p className="mt-2 max-w-[48ch] text-sm leading-relaxed text-text-secondary">
          {content.tagline}
        </p>

        {project.highlightedTech && project.highlightedTech.length > 0 ? (
          <ul
            className="mt-4 flex flex-wrap gap-1.5"
            aria-label={content.title}
          >
            {project.highlightedTech.map((tech) => (
              <li key={tech}>
                <TechBadge tech={tech} highlighted />
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-auto pt-6">
          <RepoStats
            stats={project.stats}
            updatedLabel={project.updatedLabel}
            locale={locale}
          />
        </div>
      </button>

      <footer className="flex flex-wrap gap-2 border-t border-line px-6 py-4">
        <a
          href={`https://github.com/${project.repo}`}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: "secondary", size: "sm" }),
            "pointer-events-auto",
          )}
        >
          {mainRepoLabel}
          <ArrowUpRight aria-hidden="true" />
        </a>

        {links?.frontendRepo ? (
          <a
            href={`https://github.com/${links.frontendRepo}`}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "pointer-events-auto",
            )}
          >
            {labels.viewFrontend}
            <ArrowUpRight aria-hidden="true" />
          </a>
        ) : null}

        {links?.demo ? (
          <a
            href={links.demo}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "pointer-events-auto",
            )}
          >
            {labels.viewDemo}
            <ArrowUpRight aria-hidden="true" />
          </a>
        ) : null}
      </footer>
    </motion.article>
  );
}

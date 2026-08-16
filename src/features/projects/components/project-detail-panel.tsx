"use client";

import { ArrowUpRight, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

import { buttonVariants } from "@/components/ui";
import type {
  ProjectCardModel,
  ProjectUiLabels,
} from "@/features/projects/types";
import type { Locale } from "@/i18n/routing";
import { duration, spring } from "@/lib/motion-tokens";
import { cn } from "@/lib/utils";

import { LanguageBar } from "./language-bar";
import { RepoStats } from "./repo-stats";
import { TechBadge } from "./tech-badge";

interface ProjectDetailPanelProps {
  project: ProjectCardModel;
  labels: ProjectUiLabels;
  locale: Locale;
  onClose: () => void;
}

/** Selector de elementos enfocables dentro del panel. */
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/**
 * Panel expandido del proyecto.
 *
 * Comparte el `layoutId` con su tarjeta: Motion interpola la expansion.
 *
 * Accesibilidad no negociable (seccion 7.3 del plan):
 *  - `role="dialog"` + `aria-modal` + `aria-labelledby`.
 *  - Focus trap: el Tab circula dentro del panel.
 *  - Escape cierra; el foco vuelve a la tarjeta de origen (lo maneja el hook).
 *  - El scroll del body ya esta bloqueado por useExpandedProject.
 */
export function ProjectDetailPanel({
  project,
  labels,
  locale,
  onClose,
}: ProjectDetailPanelProps) {
  const shouldReduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const content = project.content[locale];
  const { links } = project;

  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap + cierre con Escape.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusables =
        panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusables.length === 0) return;

      // Ya verificamos que hay al menos uno: el indice 0 siempre existe.
      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const mainRepoLabel = links?.frontendRepo ? labels.viewApi : labels.viewRepo;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: duration.fast } },
      }}
    >
      {/* Backdrop: click fuera cierra. */}
      <motion.div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-base/85 backdrop-blur-sm"
      />

      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`project-title-${project.slug}`}
        layoutId={`project-${project.slug}`}
        transition={shouldReduceMotion ? { duration: 0 } : spring.soft}
        className="relative flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-line-strong bg-raised shadow-glow"
        tabIndex={-1}
      >
        <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-4 sm:px-8">
          <span
            id={`project-title-${project.slug}`}
            className="font-mono text-eyebrow text-fg-subtle"
          >
            {content.title}
          </span>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label={labels.close}
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "size-9",
            )}
          >
            <X aria-hidden="true" />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
          {project.highlightedTech && project.highlightedTech.length > 0 ? (
            <ul
              className="mt-3 flex flex-wrap gap-1.5"
              aria-label={content.title}
            >
              {project.highlightedTech.map((tech) => (
                <li key={tech}>
                  <TechBadge tech={tech} highlighted />
                </li>
              ))}
            </ul>
          ) : null}

          <p className="mt-4 max-w-[65ch] text-body-lg text-fg-muted">
            {content.tagline}
          </p>

          <div className="mt-6 space-y-6">
            <section>
              <h4 className="text-label font-medium text-accent-400">
                {labels.problem}
              </h4>
              <p className="mt-2 max-w-[65ch] text-fg-muted">
                {content.problem}
              </p>
            </section>

            <section>
              <h4 className="text-label font-medium text-accent-400">
                {labels.solution}
              </h4>
              <p className="mt-2 max-w-[65ch] text-fg-muted">
                {content.solution}
              </p>
            </section>

            {content.architecture.length > 0 ? (
              <section>
                <h4 className="text-label font-medium text-accent-400">
                  {labels.architecture}
                </h4>
                <ul className="mt-2 space-y-2">
                  {content.architecture.map((decision) => (
                    <li
                      key={decision}
                      className="flex max-w-[65ch] items-start gap-2 text-fg-muted"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent-500"
                      />
                      <span>{decision}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>

          {project.stats.languages && project.stats.languages.length > 0 ? (
            <div className="mt-8">
              <LanguageBar
                languages={project.stats.languages}
                label={labels.languages}
              />
            </div>
          ) : null}

          <div className="mt-8">
            <RepoStats
              stats={project.stats}
              updatedLabel={project.updatedLabel}
              locale={locale}
              showTopics
            />
          </div>
        </div>

        <footer className="flex flex-wrap gap-2 border-t border-line px-6 py-4 sm:px-8">
          <a
            href={`https://github.com/${project.repo}`}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "primary", size: "sm" }))}
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
                buttonVariants({ variant: "secondary", size: "sm" }),
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
                buttonVariants({ variant: "secondary", size: "sm" }),
              )}
            >
              {labels.viewDemo}
              <ArrowUpRight aria-hidden="true" />
            </a>
          ) : null}
        </footer>
      </motion.div>
    </motion.div>
  );
}

"use client";

import { ArrowUpRight, ChevronDown, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { buttonVariants, TechIcon } from "@/components/ui";
import type {
  ProjectCardModel,
  ProjectUiLabels,
} from "@/features/projects/types";
import type { Locale } from "@/i18n/routing";
import { duration, ease, spring } from "@/lib/motion-tokens";
import { cn } from "@/lib/utils";

import { ExpandableText } from "./expandable-text";
import { LanguageBar } from "./language-bar";
import { ProjectCover } from "./project-cover";
import { ProjectGallery } from "./project-gallery";
import { RepoStats } from "./repo-stats";

interface ProjectDetailProps {
  project: ProjectCardModel;
  labels: ProjectUiLabels;
  locale: Locale;
  /** Toolbox completo; el "Ver más" muestra lo que no use este proyecto. */
  tools: readonly string[];
  onClose: () => void;
}

/** Decisiones de arquitectura visibles antes de "Ver más". */
const DECISIONS_PREVIEW = 2;

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/** Bloques de contenido: entran escalonados cuando termina el "zoom". */
const contentVariants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: duration.slow,
      ease: ease.out,
      delay: 0.25 + index * 0.07,
    },
  }),
};

/**
 * Detalle del proyecto a pantalla completa.
 *
 * La "entrada" en la tarjeta son tres movimientos a la vez:
 *  1. El contenedor comparte `layoutId` con la tarjeta y crece hasta ocupar
 *     la pantalla.
 *  2. La portada (mismo `layoutId` que la de la tarjeta) se convierte en la
 *     cabecera y ademas hace un zoom hacia adentro que se asienta.
 *  3. El contenido aparece despues, escalonado y desenfocado -> nitido.
 *
 * Accesibilidad: role="dialog" + aria-modal, foco atrapado, Escape cierra
 * y el foco vuelve a la tarjeta (lo maneja useExpandedProject).
 */
export function ProjectDetail({
  project,
  labels,
  locale,
  tools,
  onClose,
}: ProjectDetailProps) {
  const shouldReduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [showAllTools, setShowAllTools] = useState(false);
  const [showAllDecisions, setShowAllDecisions] = useState(false);
  const content = project.content[locale];
  const { links } = project;
  const projectTools = project.tools ?? [];
  const extraTools = tools.filter((tool) => !projectTools.includes(tool));
  const titleId = `project-title-${project.slug}`;

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    closeButtonRef.current?.focus({ preventScroll: true });

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

  const layoutTransition = shouldReduceMotion ? { duration: 0 } : spring.soft;
  const reveal = shouldReduceMotion
    ? {}
    : { variants: contentVariants, initial: "hidden", animate: "visible" };
  const mainRepoLabel = links?.frontendRepo ? labels.viewApi : labels.viewRepo;
  const showRepoLinks = !project.private;

  // Portal a <body>: las secciones crean su propio contexto de apilamiento
  // (relative z-10) y el detalle quedaria debajo del header fijo.
  return createPortal(
    <div className="fixed inset-0 z-50">
      <motion.div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-base/80 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: duration.base }}
      />

      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        layoutId={`project-${project.slug}`}
        transition={layoutTransition}
        className="absolute inset-0 overflow-hidden border-border-default bg-bg-base sm:inset-4 sm:rounded-2xl sm:border lg:inset-6"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label={labels.close}
          className="absolute top-4 right-4 z-20 grid size-11 place-items-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition-colors hover:bg-black/70"
        >
          <X aria-hidden="true" className="size-5" />
        </button>

        <div className="h-full overflow-y-auto overscroll-contain">
          {/* Cabecera: la portada de la tarjeta, ahora a lo ancho. */}
          <header className="relative h-[42vh] min-h-72 overflow-hidden">
            <motion.div
              layoutId={`cover-${project.slug}`}
              transition={layoutTransition}
              className="absolute inset-0"
            >
              <motion.div
                className="absolute inset-0"
                initial={shouldReduceMotion ? false : { scale: 1.35 }}
                animate={{ scale: 1.05 }}
                transition={{ duration: 1.1, ease: ease.out }}
              >
                <ProjectCover
                  project={project}
                  title={content.title}
                  sizes="100vw"
                  priority
                  className="size-full"
                />
              </motion.div>
            </motion.div>
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-bg-base/35"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/75 to-bg-base/35"
            />
            <motion.div
              {...reveal}
              custom={0}
              className="absolute inset-x-0 bottom-0 mx-auto max-w-5xl px-6 pb-8 sm:px-10"
            >
              <span className="text-label text-accent-400">
                {labels.status[project.status]}
              </span>
              <h3
                id={titleId}
                className="mt-1 text-[clamp(2.25rem,6vw,4.5rem)] leading-[1.05] font-semibold tracking-tight text-text-primary"
              >
                {content.title}
              </h3>
            </motion.div>
          </header>

          <div className="mx-auto grid max-w-5xl gap-12 px-6 pt-4 pb-16 sm:px-10 lg:grid-cols-[1.4fr_1fr]">
            {/* Columna principal: el resumen que escribe el autor. */}
            <div className="space-y-8">
              <motion.p
                {...reveal}
                custom={1}
                className="text-body-lg text-text-secondary"
              >
                {content.tagline}
              </motion.p>

              <motion.section {...reveal} custom={2}>
                <h4 className="text-label text-accent-400">{labels.problem}</h4>
                <div className="mt-2">
                  <ExpandableText
                    text={content.problem}
                    moreLabel={labels.showMore}
                    lessLabel={labels.showLess}
                  />
                </div>
              </motion.section>

              <motion.section {...reveal} custom={3}>
                <h4 className="text-label text-accent-400">
                  {labels.solution}
                </h4>
                <div className="mt-2">
                  <ExpandableText
                    text={content.solution}
                    moreLabel={labels.showMore}
                    lessLabel={labels.showLess}
                  />
                </div>
              </motion.section>

              {content.architecture.length > 0 ? (
                <motion.section {...reveal} custom={4}>
                  <h4 className="text-label text-accent-400">
                    {labels.architecture}
                  </h4>
                  <ul className="mt-3 space-y-2">
                    {(showAllDecisions
                      ? content.architecture
                      : content.architecture.slice(0, DECISIONS_PREVIEW)
                    ).map((decision) => (
                      <li
                        key={decision}
                        className="flex items-start gap-3 text-text-secondary"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent-500"
                        />
                        <span>{decision}</span>
                      </li>
                    ))}
                  </ul>
                  {content.architecture.length > DECISIONS_PREVIEW ? (
                    <button
                      type="button"
                      onClick={() => setShowAllDecisions((value) => !value)}
                      aria-expanded={showAllDecisions}
                      className="mt-3 inline-flex items-center gap-1 text-label text-accent-400 hover:underline"
                    >
                      {showAllDecisions ? labels.showLess : labels.showMore}
                      <ChevronDown
                        aria-hidden="true"
                        className={cn(
                          "size-4 transition-transform duration-300",
                          showAllDecisions && "rotate-180",
                        )}
                      />
                    </button>
                  ) : null}
                </motion.section>
              ) : null}
            </div>

            {/* Columna lateral: stack, herramientas y datos del repo. */}
            <div className="space-y-8">
              {project.highlightedTech && project.highlightedTech.length > 0 ? (
                <motion.section {...reveal} custom={2}>
                  <h4 className="text-label text-text-muted">{labels.stack}</h4>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {project.highlightedTech.map((tech) => (
                      <li key={tech}>
                        <TechIcon name={tech} withLabel />
                      </li>
                    ))}
                  </ul>
                </motion.section>
              ) : null}

              {projectTools.length > 0 || extraTools.length > 0 ? (
                <motion.section {...reveal} custom={3}>
                  <h4 className="text-label text-text-muted">{labels.tools}</h4>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {projectTools.map((tool) => (
                      <li key={tool}>
                        <TechIcon name={tool} withLabel />
                      </li>
                    ))}
                  </ul>

                  <AnimatePresence initial={false}>
                    {showAllTools ? (
                      <motion.ul
                        id={`tools-more-${project.slug}`}
                        className="flex flex-wrap gap-2 overflow-hidden"
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: "auto", opacity: 1, marginTop: 8 }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        transition={{ duration: duration.base, ease: ease.out }}
                      >
                        {extraTools.map((tool) => (
                          <li key={tool}>
                            <TechIcon name={tool} withLabel />
                          </li>
                        ))}
                      </motion.ul>
                    ) : null}
                  </AnimatePresence>

                  {extraTools.length > 0 ? (
                    <button
                      type="button"
                      onClick={() => setShowAllTools((value) => !value)}
                      aria-expanded={showAllTools}
                      aria-controls={`tools-more-${project.slug}`}
                      className="mt-3 inline-flex items-center gap-1 text-label text-accent-400 hover:underline"
                    >
                      {showAllTools
                        ? labels.showLessTools
                        : labels.showMoreTools}
                      <ChevronDown
                        aria-hidden="true"
                        className={cn(
                          "size-4 transition-transform duration-300",
                          showAllTools && "rotate-180",
                        )}
                      />
                    </button>
                  ) : null}
                </motion.section>
              ) : null}

              {project.stats.languages && project.stats.languages.length > 0 ? (
                <motion.div {...reveal} custom={4}>
                  <LanguageBar
                    languages={project.stats.languages}
                    label={labels.languages}
                  />
                </motion.div>
              ) : null}

              <motion.div {...reveal} custom={5}>
                <RepoStats
                  stats={project.stats}
                  updatedLabel={project.updatedLabel}
                  locale={locale}
                  showTopics
                />
              </motion.div>

              <motion.div
                {...reveal}
                custom={6}
                className="flex flex-wrap gap-2"
              >
                {showRepoLinks ? (
                  <a
                    href={`https://github.com/${project.repo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      buttonVariants({ variant: "primary", size: "sm" }),
                    )}
                  >
                    {mainRepoLabel}
                    <ArrowUpRight aria-hidden="true" />
                  </a>
                ) : null}
                {showRepoLinks && links?.frontendRepo ? (
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
              </motion.div>
            </div>
          </div>

          {project.media?.gallery && project.media.gallery.length > 0 ? (
            <div className="mx-auto max-w-5xl px-6 pb-16 sm:px-10">
              <ProjectGallery
                images={project.media.gallery}
                title={labels.galleryTitle}
                prevLabel={labels.galleryPrev}
                nextLabel={labels.galleryNext}
                alt={content.title}
              />
            </div>
          ) : null}
        </div>
      </motion.div>
    </div>,
    document.body,
  );
}

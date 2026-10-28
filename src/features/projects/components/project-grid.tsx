"use client";

import { AnimatePresence } from "motion/react";
import dynamic from "next/dynamic";

import type {
  ProjectCardModel,
  ProjectUiLabels,
} from "@/features/projects/types";
import type { Locale } from "@/i18n/routing";

import { useExpandedProject } from "../hooks/use-expanded-project";

import { ProjectCarousel } from "./project-carousel";

/**
 * Detalle cargado de forma diferida: el chunk no se descarga hasta que se
 * abre la primera tarjeta.
 */
const ProjectDetail = dynamic(
  () => import("./project-detail").then((m) => m.ProjectDetail),
  { ssr: false },
);

interface ProjectGridProps {
  projects: ProjectCardModel[];
  labels: ProjectUiLabels;
  locale: Locale;
  tools: readonly string[];
}

/**
 * Bento de proyectos, paginado en un carrusel (ver ProjectCarousel).
 *
 * El estado (que tarjeta esta abierta) vive en useExpandedProject: hash de
 * la URL, bloqueo de scroll y retorno de foco.
 */
export function ProjectGrid({
  projects,
  labels,
  locale,
  tools,
}: ProjectGridProps) {
  const { expandedSlug, open, close } = useExpandedProject();
  const expandedProject = projects.find((p) => p.slug === expandedSlug) ?? null;

  return (
    <>
      <ProjectCarousel
        projects={projects}
        labels={labels}
        locale={locale}
        expandedSlug={expandedSlug}
        onOpen={open}
      />

      <AnimatePresence>
        {expandedProject ? (
          <ProjectDetail
            key={expandedProject.slug}
            project={expandedProject}
            labels={labels}
            locale={locale}
            tools={tools}
            onClose={close}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}

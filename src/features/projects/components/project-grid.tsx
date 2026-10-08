"use client";

import { AnimatePresence } from "motion/react";
import dynamic from "next/dynamic";

import { StaggerContainer, StaggerItem } from "@/components/motion";
import type {
  ProjectCardModel,
  ProjectUiLabels,
} from "@/features/projects/types";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

import { useExpandedProject } from "../hooks/use-expanded-project";

import { ProjectCard } from "./project-card";

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
 * Bento de proyectos.
 *
 * Desktop: el primer proyecto ocupa dos tercios del ancho y toda la altura;
 * los otros dos se apilan a la derecha. Tablet: el primero arriba a todo lo
 * ancho y los otros dos debajo. Movil: una columna.
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
      <StaggerContainer
        staggerDelay={0.12}
        className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2"
      >
        {projects.map((project, index) => (
          <StaggerItem
            key={project.slug}
            className={cn(index === 0 && "md:col-span-2 lg:row-span-2")}
          >
            <ProjectCard
              project={project}
              labels={labels}
              locale={locale}
              featured={index === 0}
              isExpanded={expandedSlug === project.slug}
              onOpen={() => open(project.slug)}
            />
          </StaggerItem>
        ))}
      </StaggerContainer>

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

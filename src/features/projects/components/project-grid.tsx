"use client";

import { AnimatePresence } from "motion/react";
import dynamic from "next/dynamic";

import { StaggerContainer, StaggerItem } from "@/components/motion";
import type {
  ProjectCardModel,
  ProjectUiLabels,
} from "@/features/projects/types";
import type { Locale } from "@/i18n/routing";

import { useExpandedProject } from "../hooks/use-expanded-project";

import { ProjectCard } from "./project-card";

/**
 * Panel cargado de forma diferida: el chunk no se descarga hasta que se abre
 * la primera tarjeta. `ssr: false` es deliberado — nunca se renderiza en el
 * servidor porque solo existe tras una interaccion del usuario.
 */
const ProjectDetailPanel = dynamic(
  () => import("./project-detail-panel").then((m) => m.ProjectDetailPanel),
  { ssr: false },
);

interface ProjectGridProps {
  projects: ProjectCardModel[];
  labels: ProjectUiLabels;
  locale: Locale;
}

/**
 * Grid de proyectos.
 *
 * Client Component con una sola responsabilidad de estado: que tarjeta esta
 * expandida. El estado vive en el hook (hash, scroll, foco); aqui solo se
 * orquesta la condicion de renderizado y el `AnimatePresence` que sostiene
 * la salida del panel mientras Motion interpola el layout de vuelta.
 */
export function ProjectGrid({ projects, labels, locale }: ProjectGridProps) {
  const { expandedSlug, open, close } = useExpandedProject();
  const expandedProject = projects.find((p) => p.slug === expandedSlug) ?? null;

  return (
    <>
      <StaggerContainer className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <StaggerItem key={project.slug}>
            <ProjectCard
              project={project}
              labels={labels}
              locale={locale}
              isExpanded={expandedSlug === project.slug}
              onOpen={() => open(project.slug)}
            />
          </StaggerItem>
        ))}
      </StaggerContainer>

      <AnimatePresence>
        {expandedProject ? (
          <ProjectDetailPanel
            project={expandedProject}
            labels={labels}
            locale={locale}
            onClose={close}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}

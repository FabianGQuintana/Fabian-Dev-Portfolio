import { getTranslations } from "next-intl/server";

import { RevealOnScroll } from "@/components/motion";
import { Eyebrow } from "@/components/ui";
import { getProjects } from "@/features/projects";
import type {
  ProjectCardModel,
  ProjectUiLabels,
} from "@/features/projects/types";
import type { Locale } from "@/i18n/routing";
import { formatRelativeTime } from "@/lib/utils";

import { ProjectGrid } from "./project-grid";

interface ProjectsSectionProps {
  locale: Locale;
}

/**
 * Seccion de proyectos.
 *
 * Server Component: resuelve los proyectos (registro local + stats de GitHub,
 * cacheados con ISR de 1h) y las traducciones. Al cliente solo le llegan datos
 * y etiquetas ya resueltas — no hay llamadas a la API desde el navegador.
 *
 * `updatedLabel` se calcula aca, en el build, para que el texto del tiempo
 * relativo sea determinista y no dependa del reloj de cada visitante.
 */
export async function ProjectsSection({ locale }: ProjectsSectionProps) {
  const t = await getTranslations("projects");
  const projects = await getProjects();

  const labels: ProjectUiLabels = {
    expand: t("expand"),
    collapse: t("collapse"),
    close: t("close"),
    viewRepo: t("view_repo"),
    viewApi: t("view_api"),
    viewFrontend: t("view_frontend"),
    viewDemo: t("view_demo"),
    architecture: t("architecture"),
    problem: t("problem"),
    solution: t("solution"),
    languages: t("languages"),
    status: {
      production: t("status_production"),
      active: t("status_active"),
      archived: t("status_archived"),
      wip: t("status_wip"),
    },
  };

  const models: ProjectCardModel[] = projects.map((project) => ({
    ...project,
    updatedLabel: project.stats.lastCommitAt
      ? t("updated", {
          time: formatRelativeTime(project.stats.lastCommitAt, locale),
        })
      : undefined,
  }));

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="relative z-10 container-section py-[clamp(80px,12vh,160px)]"
    >
      <RevealOnScroll>
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h2
          id="projects-heading"
          className="mt-3 max-w-2xl text-h2 text-balance"
        >
          {t("title")}
        </h2>
      </RevealOnScroll>

      <ProjectGrid projects={models} labels={labels} locale={locale} />
    </section>
  );
}

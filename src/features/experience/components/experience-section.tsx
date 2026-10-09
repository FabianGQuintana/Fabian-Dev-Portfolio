import { Briefcase, GraduationCap } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { ScrollRevealHeading } from "@/components/motion";
import {
  education,
  experience,
  type ExperienceEntry,
} from "@/config/experience";
import type { Locale } from "@/i18n/routing";

import { Timeline } from "./timeline";

interface ExperienceSectionProps {
  locale: Locale;
}

/**
 * Seccion de trayectoria: dos timelines lado a lado (trabajo y estudios) en
 * desktop, apilados en movil.
 *
 * Server Component: resuelve sus traducciones y recibe los datos de
 * config/experience.ts. Una columna sin entradas muestra `experience.empty`.
 */
export async function ExperienceSection({ locale }: ExperienceSectionProps) {
  const t = await getTranslations("experience");

  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="relative z-10 container-section py-[clamp(80px,12vh,160px)]"
    >
      <ScrollRevealHeading id="experience-heading" text={t("title")} />

      <div className="mt-12 grid gap-14 lg:grid-cols-2 lg:gap-16">
        <TimelineColumn
          icon={<Briefcase aria-hidden="true" className="size-5" />}
          title={t("work_title")}
          items={experience}
          locale={locale}
          presentLabel={t("present")}
          emptyLabel={t("empty")}
        />
        <TimelineColumn
          icon={<GraduationCap aria-hidden="true" className="size-5" />}
          title={t("education_title")}
          items={education}
          locale={locale}
          presentLabel={t("present")}
          emptyLabel={t("empty")}
        />
      </div>
    </section>
  );
}

interface TimelineColumnProps {
  icon: React.ReactNode;
  title: string;
  items: readonly ExperienceEntry[];
  locale: Locale;
  presentLabel: string;
  emptyLabel: string;
}

function TimelineColumn({
  icon,
  title,
  items,
  locale,
  presentLabel,
  emptyLabel,
}: TimelineColumnProps) {
  return (
    <div>
      <h3 className="flex items-center gap-3 text-h3 text-text-primary">
        <span className="grid size-10 place-items-center rounded-lg bg-accent-500/15 text-accent-400">
          {icon}
        </span>
        {title}
      </h3>
      <div className="mt-8">
        {items.length > 0 ? (
          <Timeline items={items} locale={locale} presentLabel={presentLabel} />
        ) : (
          <p className="text-text-secondary">{emptyLabel}</p>
        )}
      </div>
    </div>
  );
}

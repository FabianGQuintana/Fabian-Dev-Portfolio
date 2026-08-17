import { getTranslations } from "next-intl/server";

import { RevealOnScroll } from "@/components/motion";
import { Eyebrow } from "@/components/ui";
import { experience } from "@/config/experience";
import type { Locale } from "@/i18n/routing";

import { Timeline } from "./timeline";

interface ExperienceSectionProps {
  locale: Locale;
}

/**
 * Seccion de trayectoria.
 *
 * Server Component: resuelve sus traducciones y recibe los datos de
 * config/experience.ts. El estado vacio esta contemplado: si el array no
 * tiene entradas, se muestra la clave `experience.empty` en vez de romper.
 */
export async function ExperienceSection({ locale }: ExperienceSectionProps) {
  const t = await getTranslations("experience");

  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="relative z-10 container-section py-[clamp(80px,12vh,160px)]"
    >
      <RevealOnScroll>
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h2
          id="experience-heading"
          className="mt-3 max-w-2xl text-h2 text-balance"
        >
          {t("title")}
        </h2>
      </RevealOnScroll>

      {experience.length > 0 ? (
        <Timeline
          items={experience}
          locale={locale}
          presentLabel={t("present")}
        />
      ) : (
        <p className="mt-8 max-w-[65ch] text-body-lg text-text-secondary">
          {t("empty")}
        </p>
      )}
    </section>
  );
}

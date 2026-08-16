import { getTranslations, setRequestLocale } from "next-intl/server";

import { RevealOnScroll } from "@/components/motion";
import { Eyebrow } from "@/components/ui";
import { AboutSection } from "@/features/about";
import { ExperienceSection } from "@/features/experience";
import { HeroSection } from "@/features/hero";
import type { Locale } from "@/i18n/routing";

/**
 * Composicion de la pagina.
 *
 * One-page con anclas: Hero, About y Experience ya son features reales.
 * Projects (Fases 5-6) y Contact (Fase 7) mantienen su placeholder hasta que
 * su feature exista — esta estructura no cambia.
 */

function SectionPlaceholder({
  id,
  eyebrow,
  title,
  phase,
}: {
  id: string;
  eyebrow: string;
  title: string;
  phase: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="container-section py-[clamp(80px,12vh,160px)]"
    >
      <RevealOnScroll>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 id={`${id}-heading`} className="mt-3 text-h2 text-balance">
          {title}
        </h2>
        <p className="mt-4 font-mono text-sm text-fg-subtle">{phase}</p>
      </RevealOnScroll>
    </section>
  );
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [tProjects, tContact] = await Promise.all([
    getTranslations({ locale, namespace: "projects" }),
    getTranslations({ locale, namespace: "contact" }),
  ]);

  return (
    <main id="main">
      <HeroSection />

      <AboutSection locale={locale} />

      <ExperienceSection locale={locale} />

      <SectionPlaceholder
        id="projects"
        eyebrow={tProjects("eyebrow")}
        title={tProjects("title")}
        phase="Fases 5 y 6 — integración con GitHub y tarjetas expandibles"
      />

      <SectionPlaceholder
        id="contact"
        eyebrow={tContact("eyebrow")}
        title={tContact("title")}
        phase="Fase 7 — formulario funcional con Server Action"
      />
    </main>
  );
}

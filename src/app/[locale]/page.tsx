import { getTranslations, setRequestLocale } from "next-intl/server";

import { RevealOnScroll } from "@/components/motion";
import { Eyebrow } from "@/components/ui";
import { AboutSection } from "@/features/about";
import { ExperienceSection } from "@/features/experience";
import { HeroSection } from "@/features/hero";
import { ProjectsSection } from "@/features/projects";
import type { Locale } from "@/i18n/routing";

/**
 * Composicion de la pagina.
 *
 * One-page con anclas: Hero, About, Experience y Projects ya son features
 * reales. Contact (Fase 7) mantiene su placeholder hasta que su feature
 * exista — esta estructura no cambia.
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

  const [tContact] = await Promise.all([
    getTranslations({ locale, namespace: "contact" }),
  ]);

  return (
    <main id="main">
      <HeroSection />

      <AboutSection locale={locale} />

      <ExperienceSection locale={locale} />

      <ProjectsSection locale={locale} />

      <SectionPlaceholder
        id="contact"
        eyebrow={tContact("eyebrow")}
        title={tContact("title")}
        phase="Fase 7 — formulario funcional con Server Action"
      />
    </main>
  );
}

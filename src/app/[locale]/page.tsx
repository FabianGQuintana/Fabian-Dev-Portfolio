import { setRequestLocale } from "next-intl/server";

import { AboutSection } from "@/features/about";
import { ContactSection } from "@/features/contact";
import { ExperienceSection } from "@/features/experience";
import { HeroSection } from "@/features/hero";
import { ProjectsSection } from "@/features/projects";
import type { Locale } from "@/i18n/routing";

/**
 * Composicion de la pagina.
 *
 * One-page con anclas: Hero, About, Experience, Projects y Contact ya son
 * features reales.
 */

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main id="main">
      <HeroSection />

      <AboutSection locale={locale} />

      <ExperienceSection locale={locale} />

      <ProjectsSection locale={locale} />

      <ContactSection />
    </main>
  );
}

import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";

import { AboutSection } from "@/features/about";
import { ContactSection } from "@/features/contact";
import { ExperienceSection } from "@/features/experience";
import { HeroSection } from "@/features/hero";
import { ProjectsSection } from "@/features/projects";
import { ProjectsSkeleton } from "@/features/projects/components/projects-skeleton";
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
    <main id="main" className="relative flex min-h-screen flex-col">
      <HeroSection />

      <AboutSection locale={locale} />

      <ExperienceSection locale={locale} />

      {/* Suspense local: solo el fetch a GitHub (ProjectsSection) suspende.
          El hero, about, experience y contact cargan de inmediato, y la
          animacion 3D del hero nunca queda tapada por un estado de carga. */}
      <Suspense fallback={<ProjectsSkeleton />}>
        <ProjectsSection locale={locale} />
      </Suspense>

      <ContactSection />
    </main>
  );
}

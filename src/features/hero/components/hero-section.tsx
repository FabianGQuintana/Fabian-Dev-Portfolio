import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Magnetic } from "@/components/motion";
import { buttonVariants, Eyebrow, Spotlight } from "@/components/ui";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

import { AnimatedHeadline } from "./animated-headline";
import { HeroScene } from "./hero-scene";
import { ResumeButton } from "./resume-button";

/**
 * Primera pantalla del sitio.
 *
 * Server Component async: resuelve sus propias traducciones con
 * getTranslations, así que la composición en page.tsx no necesita pasarle
 * props de texto.
 */
export async function HeroSection() {
  const t = await getTranslations("hero");

  return (
    <div className="relative overflow-hidden">
      {/* Capa de fondo con el grid aislado: no enmascara el contenido */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-60"
      />

      <Spotlight>
        <HeroScene />

        <section
          aria-labelledby="hero-heading"
          className="relative z-10 container-section flex min-h-dvh flex-col justify-center py-32"
        >
          <Eyebrow>{t("role")}</Eyebrow>

          <AnimatedHeadline id="hero-heading" text={siteConfig.name} />

          <p className="mt-8 max-w-[62ch] text-body-lg text-balance text-text-secondary">
            {t("tagline")}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Magnetic>
              <a
                href="#projects"
                className={cn(
                  buttonVariants({ variant: "primary", size: "lg" }),
                )}
              >
                {t("cta_projects")}
                <ArrowRight />
              </a>
            </Magnetic>

            <ResumeButton
              label={t("cta_resume")}
              pendingLabel={t("resume_pending")}
            />
          </div>
        </section>
      </Spotlight>
    </div>
  );
}

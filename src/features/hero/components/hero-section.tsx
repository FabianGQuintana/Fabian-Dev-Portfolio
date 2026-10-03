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
 * Layout inmersivo: el Canvas 3D ocupa toda la pantalla como fondo,
 * y el bloque de texto flota por encima a la izquierda con `z-10`.
 * `pointer-events-none` en el texto permite arrastrar el 3D por debajo;
 * los botones recuperan `pointer-events-auto` individualmente.
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
        <section
          aria-labelledby="hero-heading"
          className="relative flex min-h-dvh items-center"
        >
          {/* --- Capa 3D: ocupa toda la pantalla como fondo --- */}
          <div className="absolute inset-0 z-0">
            <HeroScene />
          </div>

          {/* --- Capa de texto: flota por encima del 3D --- */}
          <div className="pointer-events-none relative z-10 container-section w-full py-24 lg:py-32">
            <div className="flex max-w-2xl flex-col items-start text-left">
              <Eyebrow>{t("role")}</Eyebrow>

              <AnimatedHeadline id="hero-heading" text={siteConfig.name} />

              <p className="mt-8 max-w-[62ch] text-body-lg text-balance text-text-secondary">
                {t("tagline")}
              </p>

              {/* pointer-events-auto: los botones deben ser clickeables */}
              <div className="pointer-events-auto mt-10 flex flex-wrap items-center gap-4">
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
            </div>
          </div>
        </section>
      </Spotlight>
    </div>
  );
}

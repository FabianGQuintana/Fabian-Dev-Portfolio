import { ArrowRight, Mail } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Magnetic } from "@/components/motion";
import {
  buttonVariants,
  Eyebrow,
  GithubIcon,
  LinkedinIcon,
  Spotlight,
} from "@/components/ui";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

import { AnimatedHeadline } from "./animated-headline";
import { HeroScene } from "./hero-scene";
import { ResumeButton } from "./resume-button";

/**
 * Primera pantalla del sitio.
 *
 * Dos columnas en desktop: presentacion a la izquierda y el teclado 3D a la
 * derecha. En movil el teclado va debajo del texto. Los enlaces sociales
 * existen tambien como HTML (debajo de los CTA): el 3D es una mejora, no el
 * unico camino a GitHub, LinkedIn o el contacto.
 *
 * Server Component async: resuelve sus propias traducciones con
 * getTranslations, asi que la composicion en page.tsx no necesita pasarle
 * props de texto.
 */
export async function HeroSection() {
  const t = await getTranslations("hero");

  const socials = [
    { label: "GitHub", href: siteConfig.github.url, icon: GithubIcon },
    { label: "LinkedIn", href: siteConfig.links.linkedin, icon: LinkedinIcon },
    { label: t("contact_label"), href: "#contact", icon: Mail },
  ];

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
          className="relative flex min-h-dvh items-center pt-(--header-height)"
        >
          <div className="container-section grid w-full items-center gap-6 py-12 lg:grid-cols-[1fr_1.1fr] lg:gap-4 lg:py-24">
            <div className="flex flex-col items-start text-left">
              <Eyebrow>{t("role")}</Eyebrow>

              <AnimatedHeadline id="hero-heading" text={siteConfig.name} />

              <p className="mt-8 max-w-[52ch] text-body-lg text-balance text-text-secondary">
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

              <ul className="mt-8 flex items-center gap-2">
                {socials.map(({ label, href, icon: Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target={href.startsWith("#") ? undefined : "_blank"}
                      rel={href.startsWith("#") ? undefined : "noreferrer"}
                      aria-label={label}
                      className="grid size-11 place-items-center rounded-md border border-border-subtle text-text-secondary transition-colors duration-150 hover:border-accent-500 hover:text-accent-400"
                    >
                      <Icon className="size-5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="h-[320px] sm:h-[400px] lg:h-[480px]">
              <HeroScene hint={t("keyboard_hint")} />
            </div>
          </div>
        </section>
      </Spotlight>
    </div>
  );
}

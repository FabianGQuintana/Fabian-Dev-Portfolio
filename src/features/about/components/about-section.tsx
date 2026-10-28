import { getTranslations } from "next-intl/server";

import { RevealOnScroll, ScrollRevealHeading } from "@/components/motion";
import { aboutContent, aboutPhoto } from "@/config/about";
import { siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/routing";

import { AvatarPortrait } from "./avatar-portrait";

interface AboutSectionProps {
  locale: Locale;
}

export async function AboutSection({ locale }: AboutSectionProps) {
  const t = await getTranslations("about");

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative z-10 container-section py-[clamp(80px,12vh,160px)]"
    >
      {/* Texto a la izquierda con todo el ancho libre; el retrato va en una
          columna de ancho fijo pegada al borde derecho, con un gap amplio
          para que el texto pueda crecer sin chocar con el marco. */}
      <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-20 xl:gap-28">
        <div>
          <ScrollRevealHeading id="about-heading" text={t("title")} />
          <RevealOnScroll>
            <p className="mt-6 max-w-[72ch] text-body-lg text-text-secondary">
              {aboutContent.bio[locale]}
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
            <h3 className="mt-10 font-mono text-eyebrow text-text-muted uppercase">
              {t("process_title")}
            </h3>
            <ol className="mt-5 grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {aboutContent.process.map((step, index) => (
                <li
                  key={step.title.en}
                  className="border-l border-border-subtle pl-4"
                >
                  <p className="flex items-baseline gap-3 font-semibold text-text-primary">
                    <span
                      aria-hidden="true"
                      className="font-mono text-label text-accent-400"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {step.title[locale]}
                  </p>
                  <p className="mt-2 text-text-secondary">
                    {step.description[locale]}
                  </p>
                </li>
              ))}
            </ol>
          </RevealOnScroll>
        </div>

        <RevealOnScroll delay={0.15}>
          <AvatarPortrait
            photo={
              aboutPhoto
                ? { src: aboutPhoto.src, alt: aboutPhoto.alt[locale] }
                : null
            }
            initials={siteConfig.monogram}
            className="lg:mr-0"
          />
        </RevealOnScroll>
      </div>
    </section>
  );
}

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
      {/* Texto a la izquierda con todo el ancho libre; el avatar va en una
          columna de ancho fijo pegada al borde derecho, con un gap amplio
          para que el texto pueda crecer sin chocar con el aro. */}
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-24 xl:gap-32">
        <div>
          <ScrollRevealHeading id="about-heading" text={t("title")} />
          <RevealOnScroll>
            <p className="mt-6 max-w-[72ch] text-body-lg text-text-secondary">
              {aboutContent.bio[locale]}
            </p>
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
            className="lg:mr-0 lg:max-w-[20rem]"
          />
        </RevealOnScroll>
      </div>
    </section>
  );
}

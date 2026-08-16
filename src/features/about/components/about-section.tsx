import { getTranslations } from "next-intl/server";

import {
  RevealOnScroll,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion";
import { Badge, Eyebrow } from "@/components/ui";
import { aboutContent, techStack } from "@/config/about";
import type { Locale } from "@/i18n/routing";

interface AboutSectionProps {
  locale: Locale;
}

export async function AboutSection({ locale }: AboutSectionProps) {
  const t = await getTranslations("about");

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="container-section py-[clamp(80px,12vh,160px)]"
    >
      <RevealOnScroll>
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h2 id="about-heading" className="mt-3 max-w-2xl text-h2 text-balance">
          {t("title")}
        </h2>
        <p className="mt-6 max-w-[65ch] text-body-lg text-fg-muted">
          {aboutContent.bio[locale]}
        </p>
      </RevealOnScroll>

      <StaggerContainer className="mt-8 flex flex-wrap gap-2">
        {techStack.map((tech) => (
          <StaggerItem key={tech}>
            <Badge>{tech}</Badge>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}

import { getTranslations } from "next-intl/server";

import {
  RevealOnScroll,
  ScrollRevealHeading,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion";
import { Badge } from "@/components/ui";
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
      className="relative z-10 container-section py-[clamp(80px,12vh,160px)]"
    >
      <ScrollRevealHeading id="about-heading" text={t("title")} />
      <RevealOnScroll>
        <p className="mt-6 max-w-[65ch] text-body-lg text-text-secondary">
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

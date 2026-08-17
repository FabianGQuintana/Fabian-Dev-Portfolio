import { StaggerContainer, StaggerItem } from "@/components/motion";
import type { ExperienceEntry } from "@/config/experience";
import type { Locale } from "@/i18n/routing";

import { TimelineItem } from "./timeline-item";

interface TimelineProps {
  items: readonly ExperienceEntry[];
  locale: Locale;
  presentLabel: string;
}

/**
 * Timeline vertical con reveal escalonado.
 *
 * La linea vertical es un borde del contenedor; cada punto se posiciona
 * contra ella con un desplazamiento negativo. `StaggerContainer` se encarga
 * de que cada item entre de a uno al llegar al viewport.
 */
export function Timeline({ items, locale, presentLabel }: TimelineProps) {
  return (
    <StaggerContainer className="mt-12 border-l border-line-strong pl-6 sm:pl-8">
      <ol className="space-y-12">
        {items.map((item) => (
          <StaggerItem key={item.id}>
            <TimelineItem
              entry={item}
              locale={locale}
              presentLabel={presentLabel}
            />
          </StaggerItem>
        ))}
      </ol>
    </StaggerContainer>
  );
}

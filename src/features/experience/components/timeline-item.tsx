import { TechIcon } from "@/components/ui";
import type { ExperienceEntry } from "@/config/experience";
import type { Locale } from "@/i18n/routing";
import { formatMonthYear } from "@/lib/utils";

interface TimelineItemProps {
  entry: ExperienceEntry;
  locale: Locale;
  presentLabel: string;
}

/**
 * Un punto de la trayectoria.
 *
 * El punto violeta se ancla contra la linea del timeline con un
 * desplazamiento negativo que compensa el padding del contenedor.
 */
export function TimelineItem({
  entry,
  locale,
  presentLabel,
}: TimelineItemProps) {
  const start = entry.startDate
    ? formatMonthYear(entry.startDate, locale)
    : null;
  const end = entry.endDate
    ? formatMonthYear(entry.endDate, locale)
    : presentLabel;

  return (
    <article className="relative">
      <span
        aria-hidden="true"
        className="absolute top-1.5 -left-[calc(1.5rem+3px)] size-2.5 rounded-full bg-accent-500 sm:-left-[calc(2rem+3px)]"
      />

      <h3 className="text-h3 text-text-primary">{entry.role[locale]}</h3>
      <p className="mt-1 font-mono text-sm font-medium text-accent-400">
        {entry.company}
      </p>

      {start ? (
        <p className="mt-1.5 font-mono text-xs tracking-wide text-text-muted">
          {start} — {end}
        </p>
      ) : null}

      <p className="mt-4 max-w-[68ch] text-text-secondary">
        {entry.description[locale]}
      </p>

      {entry.tech.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Stack">
          {entry.tech.map((tech) => (
            <li key={tech}>
              <TechIcon name={tech} withLabel className="h-9" />
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

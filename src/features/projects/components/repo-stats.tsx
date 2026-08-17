"use client";

import { Clock, GitFork, Star } from "lucide-react";

import { Badge } from "@/components/ui";
import type { RepoStats as RepoStatsData } from "@/features/projects/types";
import { cn, formatCompactNumber } from "@/lib/utils";

interface RepoStatsProps {
  stats: RepoStatsData;
  /** Label completo ya formateado ("Actualizado hace 3 días"). */
  updatedLabel?: string;
  locale: string;
  /** Muestra la lista de topics (solo en el panel, no en la tarjeta). */
  showTopics?: boolean;
  className?: string;
}

/**
 * Contadores discretos de GitHub.
 *
 * Degradacion elegante aplicada: un campo ausente simplemente no se renderiza.
 * Cero no es un dato interesante (un repo sin stars no merece un chip "0").
 * Si TODO esta ausente, el componente no renderiza nada: sin huecos, sin
 * mensajes de error.
 */
export function RepoStats({
  stats,
  updatedLabel,
  locale,
  showTopics = false,
  className,
}: RepoStatsProps) {
  const chips: Array<{ key: string; icon: React.ReactNode; label: string }> =
    [];

  if (stats.stars !== undefined && stats.stars > 0) {
    chips.push({
      key: "stars",
      icon: <Star className="size-3.5 text-accent-400" />,
      label: formatCompactNumber(stats.stars, locale),
    });
  }

  if (stats.forks !== undefined && stats.forks > 0) {
    chips.push({
      key: "forks",
      icon: <GitFork className="size-3.5 text-accent-400" />,
      label: formatCompactNumber(stats.forks, locale),
    });
  }

  if (updatedLabel) {
    chips.push({
      key: "updated",
      icon: <Clock className="size-3.5" />,
      label: updatedLabel,
    });
  }

  if (chips.length === 0) return null;

  return (
    <div
      className={cn("flex flex-wrap items-center gap-x-4 gap-y-1.5", className)}
    >
      {chips.map((chip) => (
        <span
          key={chip.key}
          className="flex items-center gap-1.5 font-mono text-xs text-text-secondary"
        >
          {chip.icon}
          {chip.label}
        </span>
      ))}

      {showTopics && stats.topics && stats.topics.length > 0 ? (
        <ul className="mt-1 flex w-full flex-wrap gap-1.5">
          {stats.topics.map((topic) => (
            <li key={topic}>
              <Badge>{topic}</Badge>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

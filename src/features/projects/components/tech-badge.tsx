import { Badge } from "@/components/ui";

interface TechBadgeProps {
  tech: string;
  /** Tecnologias destacadas se resaltan; el resto queda discreto. */
  highlighted?: boolean;
}

/**
 * Badge de una tecnologia del stack.
 *
 * `highlightedTech` es curaduria local (lo que el autor quiere que se vea);
 * los topics vienen de GitHub y son secundarios. La variante accent reserva
 * su escasez para lo destacado, no para todo el stack.
 */
export function TechBadge({ tech, highlighted = false }: TechBadgeProps) {
  return <Badge variant={highlighted ? "accent" : "default"}>{tech}</Badge>;
}

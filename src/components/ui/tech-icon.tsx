import { getTech } from "@/lib/tech/registry";
import { cn } from "@/lib/utils";

interface TechIconProps {
  name: string;
  /** Muestra siempre el nombre al lado del icono. */
  withLabel?: boolean;
  /**
   * El nombre aparece como tooltip flotante al hacer hover o foco sobre el
   * icono. Flota (absolute) para no mover el layout: si el nombre empujara a
   * los demas iconos, el bloque de texto de la tarjeta cambiaria de altura.
   * Ignorado si `withLabel`.
   */
  revealLabel?: boolean;
  className?: string;
}

/**
 * Icono de una tecnologia sobre una pastilla.
 *
 * Los iconos son SVG inline (sin peticiones de red) con el color de la
 * marca; las marcas negras heredan el color del texto para verse en ambos
 * temas. Sin icono disponible se dibuja un monograma.
 */
export function TechIcon({
  name,
  withLabel = false,
  revealLabel = false,
  className,
}: TechIconProps) {
  const tech = getTech(name);

  return (
    <span
      title={withLabel || revealLabel ? undefined : tech.name}
      className={cn(
        "group/tech relative inline-flex h-10 items-center rounded-lg border border-border-subtle bg-bg-surface/80 px-2.5 text-text-primary backdrop-blur-sm",
        className,
      )}
    >
      {tech.path ? (
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="size-5 shrink-0"
          fill={tech.color ?? "currentColor"}
        >
          <path d={tech.path} />
        </svg>
      ) : (
        <span
          aria-hidden="true"
          className="grid size-5 shrink-0 place-items-center rounded-[5px] font-mono text-[10px] leading-none font-bold text-white"
          style={{ backgroundColor: tech.color ?? "var(--color-accent-500)" }}
        >
          {tech.monogram}
        </span>
      )}

      {withLabel ? (
        <span className="ml-2 text-label whitespace-nowrap">{tech.name}</span>
      ) : revealLabel ? (
        <span className="pointer-events-none absolute bottom-full left-0 z-20 mb-2 rounded-md border border-white/15 bg-black/85 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 shadow-lg backdrop-blur-sm transition-opacity duration-200 group-hover/tech:opacity-100">
          {tech.name}
        </span>
      ) : (
        <span className="sr-only">{tech.name}</span>
      )}
    </span>
  );
}

import { getTech } from "@/lib/tech/registry";
import { cn } from "@/lib/utils";

interface TechIconProps {
  name: string;
  /** Muestra siempre el nombre al lado del icono. */
  withLabel?: boolean;
  /**
   * El nombre aparece al hacer hover sobre el ancestro con la clase
   * `group` (la tarjeta del proyecto). Ignorado si `withLabel`.
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
        "inline-flex h-10 items-center rounded-lg border border-border-subtle bg-bg-surface/80 px-2.5 text-text-primary backdrop-blur-sm",
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
        <span className="max-w-0 overflow-hidden text-label whitespace-nowrap opacity-0 transition-all duration-500 ease-out-expo group-hover:ml-2 group-hover:max-w-[12rem] group-hover:opacity-100 group-focus-visible:ml-2 group-focus-visible:max-w-[12rem] group-focus-visible:opacity-100">
          {tech.name}
        </span>
      ) : (
        <span className="sr-only">{tech.name}</span>
      )}
    </span>
  );
}

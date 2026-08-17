import { cn } from "@/lib/utils";

/**
 * Encabezado de seccion en monoespaciada: `// PROYECTOS`.
 * Aporta ritmo vertical y refuerza la identidad tecnica sin decoracion.
 *
 * El prefijo `//` es decorativo, asi que se marca aria-hidden para que el
 * lector de pantalla lea "PROYECTOS" y no "barra barra PROYECTOS".
 */
export function Eyebrow({
  children,
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "font-mono text-eyebrow text-fg-subtle uppercase",
        className,
      )}
      {...props}
    >
      <span aria-hidden="true">{"// "}</span>
      {children}
    </p>
  );
}

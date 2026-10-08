import { cn } from "@/lib/utils";

/**
 * Etiqueta corta en monoespaciada sobre un titular (p. ej. "404").
 */
export function Eyebrow({
  children,
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "font-mono text-eyebrow text-text-muted uppercase",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}

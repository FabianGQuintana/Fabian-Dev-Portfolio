import { cn } from "@/lib/utils";

/**
 * Superficie base. Sin logica de negocio: solo contenedor y ritmo interno.
 *
 * El borde de hover se resuelve cambiando el color del borde existente, no
 * agregando uno: cambiar el ancho provocaria un salto de layout de 1px.
 */
export function Card({
  className,
  interactive = false,
  ...props
}: React.ComponentProps<"div"> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border-default bg-bg-surface",
        interactive && [
          "transition-colors duration-300 ease-out-quart",
          "hover:border-accent-500/50 hover:bg-bg-surface-raised",
        ],
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-2 p-6", className)} {...props} />
  );
}

export function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3 className={cn("text-h3 text-text-primary", className)} {...props} />
  );
}

export function CardDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("text-sm leading-relaxed text-text-secondary", className)}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("px-6 pb-6", className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 border-t border-border-subtle px-6 py-4",
        className,
      )}
      {...props}
    />
  );
}

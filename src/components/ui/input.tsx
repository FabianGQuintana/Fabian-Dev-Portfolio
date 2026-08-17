import { cn } from "@/lib/utils";

/**
 * El borde usa `line-interactive` (3.84:1) y no `line-strong`.
 * WCAG 1.4.11 exige 3:1 para los limites de componentes interactivos: un
 * input con borde decorativo se ve elegante y es invisible para alguien con
 * baja vision.
 */
export function Input({
  className,
  "aria-invalid": ariaInvalid,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      aria-invalid={ariaInvalid}
      className={cn(
        "h-11 w-full rounded-md border border-line-interactive bg-surface px-3.5 text-sm text-fg",
        "placeholder:text-fg-subtle",
        "transition-colors duration-150",
        "hover:border-fg-subtle",
        "focus-visible:border-accent-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-300",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-[invalid=true]:border-error aria-[invalid=true]:focus-visible:outline-error",
        className,
      )}
      {...props}
    />
  );
}

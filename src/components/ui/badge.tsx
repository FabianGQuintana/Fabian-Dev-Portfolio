import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  [
    "inline-flex items-center gap-1.5",
    "rounded-full border px-2.5 py-0.5",
    "font-mono text-xs font-medium",
    "transition-colors duration-150",
    "[&_svg]:size-3 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        /** Tecnologias, topics. El caso por defecto. */
        default: "border-border-default bg-bg-surface text-text-secondary",
        /** Destacado. Uso escaso: si todo es acento, nada lo es. */
        accent: "border-accent-500/40 bg-accent-500/10 text-accent-400",
        /** Estados. Siempre acompañados de icono y texto, nunca solo color. */
        success: "border-success/40 bg-success/10 text-success",
        warning: "border-warning/40 bg-warning/10 text-warning",
        error: "border-error/40 bg-error/10 text-error",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.ComponentProps<"span">, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { badgeVariants };

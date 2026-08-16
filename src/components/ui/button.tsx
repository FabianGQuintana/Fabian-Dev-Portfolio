import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Las variantes son datos, no cadenas de condicionales dentro del componente.
 *
 * Nota de accesibilidad codificada aqui a proposito: la variante `primary`
 * usa accent-600 y NO accent-500. Blanco sobre accent-600 da 5.70:1 (AA);
 * sobre accent-500 solo 4.23:1 (insuficiente para texto normal). La regla no
 * queda a criterio de quien use el componente.
 */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "rounded-md font-medium",
    "transition-all duration-150 ease-out-quart",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-300",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-accent-600 text-white",
          "hover:bg-accent-500 hover:shadow-glow-sm",
          "active:bg-accent-700",
        ],
        secondary: [
          "border border-line-interactive bg-surface text-fg",
          "hover:border-accent-500 hover:bg-raised hover:text-accent-400",
          "active:bg-surface",
        ],
        ghost: [
          "bg-transparent text-fg-muted",
          "hover:bg-surface hover:text-fg",
        ],
        link: [
          "bg-transparent text-accent-400 underline-offset-4",
          "hover:text-accent-300 hover:underline",
        ],
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-12 px-7 text-base",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { buttonVariants };

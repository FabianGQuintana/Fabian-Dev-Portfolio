import { cn } from "@/lib/utils";

export function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      className={cn("font-mono text-label text-text-primary", className)}
      {...props}
    />
  );
}

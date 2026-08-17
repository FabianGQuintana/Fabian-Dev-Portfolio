import { cn } from "@/lib/utils";

export function Textarea({
  className,
  "aria-invalid": ariaInvalid,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      aria-invalid={ariaInvalid}
      className={cn(
        "min-h-32 w-full resize-y rounded-md border border-border-interactive bg-bg-surface px-3.5 py-3 text-sm text-text-primary",
        "placeholder:text-text-muted",
        "transition-colors duration-150",
        "hover:border-text-muted",
        "focus-visible:border-accent-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-300",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-[invalid=true]:border-error aria-[invalid=true]:focus-visible:outline-error",
        className,
      )}
      {...props}
    />
  );
}

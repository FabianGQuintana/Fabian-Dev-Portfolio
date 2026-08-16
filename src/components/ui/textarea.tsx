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
        "min-h-32 w-full resize-y rounded-md border border-line-interactive bg-surface px-3.5 py-3 text-sm text-fg",
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

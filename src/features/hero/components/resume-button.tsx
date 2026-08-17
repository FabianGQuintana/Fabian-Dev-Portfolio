import { Download } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface ResumeButtonProps {
  label: string;
  pendingLabel: string;
}

/**
 * Botón de descarga de CV.
 *
 * `siteConfig.resume.enabled` es el único punto de control: en false
 * renderiza un botón deshabilitado real (no un <span>, para que el estado
 * disabled sea nativo del navegador) con el motivo en texto para lectores de
 * pantalla. El día que exista el PDF, cambiar el flag alcanza — este
 * componente no se toca.
 */
export function ResumeButton({ label, pendingLabel }: ResumeButtonProps) {
  if (!siteConfig.resume.enabled) {
    return (
      <Button
        type="button"
        variant="secondary"
        size="lg"
        disabled
        aria-describedby="resume-pending-note"
      >
        <Download />
        {label}
        <span id="resume-pending-note" className="sr-only">
          {" — "}
          {pendingLabel}
        </span>
      </Button>
    );
  }

  return (
    <a
      href={siteConfig.resume.path}
      download
      className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}
    >
      <Download />
      {label}
    </a>
  );
}

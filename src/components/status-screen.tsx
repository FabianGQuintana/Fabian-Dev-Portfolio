import { Eyebrow } from "@/components/ui";
import { cn } from "@/lib/utils";

/**
 * Pantalla de contingencia compartida (error, 404 y loading).
 *
 * Respeta el sistema Dark-Tech y la accesibilidad: el contenido es
 * legible sin animaciones, y el estado se comunica con texto (no solo
 * color). `Eyebrow` aporta el `//` mono; `children` puede traer una
 * accion (boton de reintento o enlace al inicio) o un indicador de carga.
 */
export function StatusScreen({
  eyebrow,
  title,
  message,
  children,
}: {
  eyebrow: string;
  title: string;
  message: string;
  children?: React.ReactNode;
}) {
  return (
    <main
      className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-bg-base px-4"
      role="main"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 size-96 -translate-x-1/2 rounded-full bg-accent-600/20 blur-3xl"
      />

      <div
        className={cn(
          "relative z-10 w-full max-w-md rounded-xl border border-border-default",
          "bg-bg-surface/80 p-8 text-center backdrop-blur-sm",
        )}
      >
        <div className="flex justify-center">
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
        <h1 className="mt-4 text-h3 text-text-primary">{title}</h1>
        <p className="mt-3 text-body text-text-secondary">{message}</p>
        {children ? (
          <div className="mt-8 flex justify-center">{children}</div>
        ) : null}
      </div>
    </main>
  );
}

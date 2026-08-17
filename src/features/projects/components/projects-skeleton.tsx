import { Eyebrow } from "@/components/ui";

/**
 * Placeholder de la seccion de proyectos mientras se resuelve el fetch a
 * GitHub (cacheado con ISR). Vive dentro de un <Suspense> local en page.tsx,
 * asi que solo ocupa el espacio de esta seccion y NUNCA tapa el resto
 * (hero, about, contact) ni la animacion 3D.
 *
 * Es un Server Component con `animate-pulse`: sin JS extra, sin layout shift.
 */
export function ProjectsSkeleton() {
  return (
    <section
      aria-hidden="true"
      className="container-section py-[clamp(80px,12vh,160px)]"
    >
      <Eyebrow>Projects</Eyebrow>
      <div className="mt-3 h-9 w-72 max-w-full animate-pulse rounded-md bg-line-strong/60" />

      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-xl border border-line-strong bg-surface/60 p-5"
          >
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-md bg-line-strong/70" />
              <div className="h-4 w-32 rounded bg-line-strong/70" />
            </div>

            <div className="mt-4 space-y-2">
              <div className="h-3 w-full rounded bg-line-strong/50" />
              <div className="h-3 w-5/6 rounded bg-line-strong/50" />
            </div>

            <div className="mt-5 flex gap-2">
              <div className="h-5 w-16 rounded-full bg-line-strong/60" />
              <div className="h-5 w-20 rounded-full bg-line-strong/60" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

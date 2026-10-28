import Image from "next/image";

import type { ProjectCardModel } from "@/features/projects/types";
import { cn } from "@/lib/utils";

interface ProjectCoverProps {
  project: ProjectCardModel;
  title: string;
  /** Tamaños para next/image: la tarjeta grande y las chicas difieren. */
  sizes: string;
  priority?: boolean;
  className?: string;
}

/**
 * Portada del proyecto.
 *
 * Con captura (`media.cover`, archivo en public/projects/) se muestra la
 * imagen. Sin captura se genera una portada con la paleta del sitio: el
 * titulo como marca de agua sobre una grilla y un degradado morado. Asi la
 * grilla se ve completa hoy y mejora sola el dia que haya capturas.
 */
export function ProjectCover({
  project,
  title,
  sizes,
  priority = false,
  className,
}: ProjectCoverProps) {
  const cover = project.media?.cover;

  if (cover) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <Image
          src={cover}
          alt=""
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover object-top"
        />
      </div>
    );
  }

  // Variacion por proyecto para que las tres portadas no sean identicas.
  const angle = 120 + project.order * 47;

  return (
    <div
      aria-hidden="true"
      className={cn("relative overflow-hidden bg-accent-900", className)}
      style={{
        backgroundImage: `radial-gradient(120% 90% at ${20 + project.order * 25}% 0%, rgba(164, 99, 240, 0.55), transparent 60%), linear-gradient(${angle}deg, #46057a 0%, #1f0438 55%, #0a0710 100%)`,
      }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <span className="absolute -right-4 -bottom-6 font-[family-name:var(--font-display-family)] text-[clamp(4rem,12vw,9rem)] leading-none font-bold tracking-tighter text-white/10 select-none">
        {title}
      </span>
    </div>
  );
}

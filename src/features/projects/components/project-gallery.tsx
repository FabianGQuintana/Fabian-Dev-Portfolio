"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

interface ProjectGalleryProps {
  images: readonly string[];
  title: string;
  prevLabel: string;
  nextLabel: string;
  /** Texto alternativo por imagen; se usa el titulo si no hay uno especifico. */
  alt: string;
}

/**
 * Galeria de capturas del proyecto: una imagen a la vez, con flechas, puntos
 * y swipe tactil. Vive dentro del detalle, asi que el estado es local.
 *
 * Las rutas vienen de `media.gallery` (archivos en public/projects/). Sin
 * imagenes no se renderiza nada.
 */
export function ProjectGallery({
  images,
  title,
  prevLabel,
  nextLabel,
  alt,
}: ProjectGalleryProps) {
  const [index, setIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const count = images.length;

  if (count === 0) return null;

  const go = (next: number) => setIndex((next + count) % count);
  const multiple = count > 1;

  return (
    <section aria-label={title} className="space-y-4">
      <h4 className="text-label text-text-muted">{title}</h4>

      <div
        className="relative aspect-video overflow-hidden rounded-xl border border-border-default bg-bg-surface"
        onTouchStart={(event) =>
          setTouchStart(event.touches[0]?.clientX ?? null)
        }
        onTouchEnd={(event) => {
          if (touchStart === null || !multiple) return;
          const end = event.changedTouches[0]?.clientX ?? touchStart;
          const delta = end - touchStart;
          if (Math.abs(delta) > 40) go(index + (delta < 0 ? 1 : -1));
          setTouchStart(null);
        }}
      >
        {images.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={`${alt} ${i + 1}/${count}`}
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className={cn(
              "object-contain transition-opacity duration-500",
              i === index ? "opacity-100" : "opacity-0",
            )}
            // Solo la primera se carga de entrada; el resto, al verla.
            loading={i === 0 ? "eager" : "lazy"}
            aria-hidden={i !== index}
          />
        ))}

        {multiple ? (
          <>
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label={prevLabel}
              className="absolute top-1/2 left-3 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition-colors hover:bg-black/70"
            >
              <ChevronLeft aria-hidden="true" className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label={nextLabel}
              className="absolute top-1/2 right-3 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition-colors hover:bg-black/70"
            >
              <ChevronRight aria-hidden="true" className="size-5" />
            </button>
          </>
        ) : null}
      </div>

      {multiple ? (
        <div className="flex items-center justify-center gap-2">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => go(i)}
              aria-label={`${i + 1} / ${count}`}
              aria-current={i === index}
              className="grid h-5 place-items-center px-0.5"
            >
              <span
                className={cn(
                  "block h-1.5 rounded-full transition-all duration-300",
                  i === index
                    ? "w-6 bg-accent-500"
                    : "w-2 bg-border-interactive hover:bg-accent-400",
                )}
              />
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}

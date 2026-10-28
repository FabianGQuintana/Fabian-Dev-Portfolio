"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

interface ExpandableTextProps {
  text: string;
  /** Largo a partir del cual el texto se colapsa. */
  threshold?: number;
  moreLabel: string;
  lessLabel: string;
  className?: string;
}

/**
 * Parrafo que se recorta a 4 lineas y se expande con "Ver más".
 * Los textos cortos se muestran completos y sin boton.
 */
export function ExpandableText({
  text,
  threshold = 280,
  moreLabel,
  lessLabel,
  className,
}: ExpandableTextProps) {
  const [open, setOpen] = useState(false);
  const isLong = text.length > threshold;

  return (
    <div>
      <p
        className={cn(
          "max-w-[65ch] text-text-secondary",
          isLong && !open && "line-clamp-4",
          className,
        )}
      >
        {text}
      </p>
      {isLong ? (
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="mt-2 inline-flex items-center gap-1 text-label text-accent-400 hover:underline"
        >
          {open ? lessLabel : moreLabel}
        </button>
      ) : null}
    </div>
  );
}

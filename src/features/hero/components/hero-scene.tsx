"use client";

import { useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";

import { siteConfig } from "@/config/site";

import type { KeyboardSocial } from "../keyboard/keyboard-scene";

/**
 * Teclado 3D del hero.
 *
 * El canvas (three + R3F) se carga aparte con `ssr: false`: no pesa en el
 * HTML inicial ni bloquea el texto del hero. Es decorativo para lectores de
 * pantalla (aria-hidden): los mismos enlaces existen como HTML en el hero.
 */
const KeyboardScene = dynamic(() => import("../keyboard/keyboard-scene"), {
  ssr: false,
});

const SOCIALS = siteConfig.heroSocials as readonly KeyboardSocial[];

interface HeroSceneProps {
  hint: string;
}

export function HeroScene({ hint }: HeroSceneProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [typed, setTyped] = useState("");

  // Fuera de pantalla el render se pausa: cero GPU mientras se lee el resto.
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry) setIsVisible(entry.isIntersecting);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const handleTextChange = useCallback((text: string) => setTyped(text), []);

  return (
    <div ref={containerRef} className="relative h-full w-full">
      {/* Linea de "terminal" con lo que el teclado va escribiendo. */}
      <div
        aria-hidden="true"
        className="absolute top-2 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full border border-border-default bg-bg-surface/80 px-4 py-1.5 font-mono text-sm whitespace-nowrap backdrop-blur-md"
      >
        <span className="text-accent-400">~/fabian $</span>
        <span className="min-w-[9ch] text-text-primary">
          {reduceMotion ? "" : typed}
          <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-accent-400" />
        </span>
      </div>

      <div aria-hidden="true" className="absolute inset-0">
        <KeyboardScene
          socials={SOCIALS}
          animate={!reduceMotion}
          active={isVisible}
          onTextChange={handleTextChange}
        />
      </div>

      <p
        aria-hidden="true"
        className="absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-xs whitespace-nowrap text-text-muted"
      >
        {hint}
      </p>
    </div>
  );
}

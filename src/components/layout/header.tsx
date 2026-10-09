"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";

import { useActiveSection } from "@/hooks";
import { cn } from "@/lib/utils";

import { LocaleSwitcher } from "./locale-switcher";
import { MobileMenu } from "./mobile-menu";
import { NavLinks, type NavLinkItem } from "./nav-links";
import { ThemeToggle } from "./theme-toggle";

interface HeaderProps {
  items: readonly NavLinkItem[];
  /** Texto junto al monograma; lleva a la parte superior de la pagina. */
  homeLabel: string;
  /** Iniciales del monograma. */
  monogram: string;
  menuOpenLabel: string;
  menuCloseLabel: string;
  themeToLightLabel: string;
  themeToDarkLabel: string;
}

/** Desplazamiento en px a partir del cual el header pasa a estado "elevado". */
const SCROLL_THRESHOLD = 24;

export function Header({
  items,
  homeLabel,
  monogram,
  menuOpenLabel,
  menuCloseLabel,
  themeToLightLabel,
  themeToDarkLabel,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  // "home" es la seccion del hero: mientras esta a la vista el subrayado va en
  // Inicio y no en ningun link. Antes de que el observer responda (activeId
  // null) la pagina esta arriba, asi que tambien cuenta como inicio.
  const activeId = useActiveSection(["home", ...items.map((item) => item.id)]);
  const isHome = activeId === null || activeId === "home";
  const { scrollY } = useScroll();

  // useMotionValueEvent en vez de un listener de scroll: el estado de React
  // solo cambia al cruzar el umbral, no en cada pixel.
  useMotionValueEvent(scrollY, "change", (latest) => {
    const next = latest > SCROLL_THRESHOLD;
    setIsScrolled((current) => (current === next ? current : next));
  });

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 h-(--header-height)",
        "transition-colors duration-300",
        isScrolled
          ? "border-b border-border-subtle bg-bg-base/70 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="flex h-full w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <a
          href="#main"
          aria-current={isHome ? "location" : undefined}
          className="group flex items-center gap-2.5 font-mono text-sm font-medium text-text-primary transition-colors duration-150 hover:text-accent-400"
        >
          <span
            aria-hidden="true"
            className="grid size-8 place-items-center rounded-lg bg-accent-500 text-xs font-bold tracking-tight text-white transition-transform duration-300 group-hover:rotate-6"
          >
            {monogram}
          </span>
          <span className="relative">
            {homeLabel}
            <span
              aria-hidden="true"
              className={cn(
                "absolute inset-x-0 -bottom-1.5 h-px origin-left bg-accent-500 transition-transform duration-300",
                isHome ? "scale-x-100" : "scale-x-0",
              )}
            />
          </span>
        </a>

        <div className="flex items-center gap-2">
          <nav aria-label="Principal" className="hidden md:block">
            <NavLinks items={items} />
          </nav>

          <ThemeToggle
            toLightLabel={themeToLightLabel}
            toDarkLabel={themeToDarkLabel}
          />

          <LocaleSwitcher />

          <MobileMenu
            items={items}
            openLabel={menuOpenLabel}
            closeLabel={menuCloseLabel}
          />
        </div>
      </div>
    </header>
  );
}

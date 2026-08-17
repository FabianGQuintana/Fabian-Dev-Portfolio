"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { LocaleSwitcher } from "./locale-switcher";
import { MobileMenu } from "./mobile-menu";
import { NavLinks, type NavLinkItem } from "./nav-links";

interface HeaderProps {
  items: readonly NavLinkItem[];
  brand: string;
  menuOpenLabel: string;
  menuCloseLabel: string;
}

/** Desplazamiento en px a partir del cual el header pasa a estado "elevado". */
const SCROLL_THRESHOLD = 24;

export function Header({
  items,
  brand,
  menuOpenLabel,
  menuCloseLabel,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
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
      <div className="container-section flex h-full items-center justify-between">
        <a
          href="#main"
          className="font-mono text-sm font-medium text-text-primary transition-colors duration-150 hover:text-accent-400"
        >
          {brand}
        </a>

        <div className="flex items-center gap-2">
          <nav aria-label="Principal" className="hidden md:block">
            <NavLinks items={items} />
          </nav>

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

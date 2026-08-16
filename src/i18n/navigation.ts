import { createNavigation } from "next-intl/navigation";

import { routing } from "./routing";

/**
 * Envoltorios de next/navigation conscientes del locale.
 * Se usan estos en vez de los de next/navigation directamente: agregan y
 * quitan el prefijo de idioma solos.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

import type { Dictionary } from "@/lib/dictionary";

/**
 * Secciones de la navegacion.
 *
 * `labelKey` esta tipado contra el diccionario, no es un string suelto: si
 * alguien renombra una clave en messages/es.json, esto deja de compilar.
 * `id` debe coincidir con el id del <section> correspondiente para que el
 * indicador de seccion activa funcione.
 */
export interface NavItem {
  readonly id: string;
  readonly href: string;
  readonly labelKey: keyof Dictionary["nav"];
}

export const navItems = [
  { id: "about", href: "#about", labelKey: "about" },
  { id: "experience", href: "#experience", labelKey: "experience" },
  { id: "projects", href: "#projects", labelKey: "projects" },
  { id: "contact", href: "#contact", labelKey: "contact" },
] as const satisfies readonly NavItem[];

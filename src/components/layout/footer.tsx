import { Mail } from "lucide-react";

import { GithubIcon, LinkedinIcon } from "@/components/ui";
import { siteConfig } from "@/config/site";

interface FooterLink {
  readonly id: string;
  readonly href: string;
  readonly label: string;
}

interface FooterProps {
  /** Frase de valor bajo el nombre. */
  tagline: string;
  /** Titulo accesible de la navegacion rapida. */
  quickLinksLabel: string;
  /** Secciones de la pagina, en el mismo orden que el header. */
  links: readonly FooterLink[];
  rights: string;
}

interface SocialLink {
  readonly label: string;
  readonly href: string;
  readonly icon: React.ComponentType<{ className?: string }>;
}

/**
 * Server Component: no necesita interactividad, asi que no envia JS.
 *
 * Tres columnas en desktop: identidad y redes a la izquierda, enlaces rapidos
 * al centro y copyright a la derecha. En mobile se apilan centradas.
 *
 * Los enlaces sin URL configurada no se renderizan, en vez de renderizarse
 * rotos: `siteConfig.links` arranca vacio a proposito.
 */
export function Footer({
  tagline,
  quickLinksLabel,
  links,
  rights,
}: FooterProps) {
  const socials: readonly SocialLink[] = [
    { label: "GitHub", href: siteConfig.github.url, icon: GithubIcon },
    { label: "LinkedIn", href: siteConfig.links.linkedin, icon: LinkedinIcon },
    {
      label: "Email",
      href: siteConfig.links.email ? `mailto:${siteConfig.links.email}` : "",
      icon: Mail,
    },
  ].filter((link) => link.href !== "");

  return (
    <footer className="mt-32 border-t border-border-subtle">
      <div className="container-section grid gap-8 py-10 text-center md:grid-cols-[1fr_auto_1fr] md:items-center md:text-left">
        <div className="space-y-3">
          <p className="max-w-xs text-sm text-text-secondary max-md:mx-auto">
            {tagline}
          </p>

          <ul className="flex items-center gap-2 max-md:justify-center">
            {socials.map(({ label, href, icon: Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={href.startsWith("mailto:") ? undefined : "noreferrer"}
                  aria-label={label}
                  className="grid size-10 place-items-center rounded-full border border-border-interactive/50 text-text-secondary transition-colors duration-150 hover:border-accent-400 hover:text-accent-400"
                >
                  <Icon className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label={quickLinksLabel}>
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
            {links.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  className="text-text-secondary transition-colors duration-150 hover:text-accent-400"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <p className="text-sm text-text-muted md:text-right">
          © {new Date().getFullYear()} {siteConfig.name}. {rights}
        </p>
      </div>
    </footer>
  );
}

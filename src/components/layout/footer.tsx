import { Mail } from "lucide-react";

import { GithubIcon, LinkedinIcon } from "@/components/ui";
import { siteConfig } from "@/config/site";

interface FooterProps {
  builtWith: string;
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
 * Los enlaces sin URL configurada no se renderizan, en vez de renderizarse
 * rotos: `siteConfig.links` arranca vacio a proposito.
 */
export function Footer({ builtWith, rights }: FooterProps) {
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
    <footer className="mt-32 border-t border-line">
      <div className="container-section flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1 text-sm text-fg-subtle">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. {rights}
          </p>
          <p className="font-mono text-xs">{builtWith}</p>
        </div>

        <ul className="flex items-center gap-2">
          {socials.map(({ label, href, icon: Icon }) => (
            <li key={label}>
              <a
                href={href}
                target={href.startsWith("mailto:") ? undefined : "_blank"}
                rel={href.startsWith("mailto:") ? undefined : "noreferrer"}
                aria-label={label}
                className="grid size-11 place-items-center rounded-md text-fg-muted transition-colors duration-150 hover:bg-surface hover:text-accent-400"
              >
                <Icon className="size-5" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

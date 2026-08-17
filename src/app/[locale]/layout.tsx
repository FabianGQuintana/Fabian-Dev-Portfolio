import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";

import { Footer, Header, HtmlShell, ScrollProgress } from "@/components/layout";
import { navItems } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { routing, type Locale } from "@/i18n/routing";

import type { Metadata, Viewport } from "next";

import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#0b0a0f",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: `${siteConfig.name} — ${t("role")}`,
      template: `%s — ${siteConfig.name}`,
    },
    description: siteConfig.tagline[locale],
    authors: [{ name: siteConfig.name, url: siteConfig.github.url }],
    creator: siteConfig.name,
    robots: { index: true, follow: true },
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}`])),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Habilita el render estatico de este layout pese a leer traducciones,
  // que de otro modo Next trataria como dependientes de request dinamico.
  setRequestLocale(locale);

  const messages = await getMessages();
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tFooter = await getTranslations({ locale, namespace: "footer" });

  const navLinks = navItems.map((item) => ({
    id: item.id,
    href: item.href,
    label: tNav(item.labelKey),
  }));

  return (
    <HtmlShell lang={locale}>
      <NextIntlClientProvider messages={messages}>
        {/* Primer elemento enfocable del documento: requisito de a11y. */}
        <a
          href="#main"
          className="sr-only rounded-md bg-accent-600 px-4 py-2 text-white focus-visible:not-sr-only focus-visible:absolute focus-visible:top-4 focus-visible:left-4 focus-visible:z-[60] focus-visible:ring-2 focus-visible:ring-accent-300"
        >
          {tNav("skip_to_content")}
        </a>

        <ScrollProgress />

        <Header
          items={navLinks}
          brand={siteConfig.name}
          menuOpenLabel={tNav("menu_open")}
          menuCloseLabel={tNav("menu_close")}
        />

        {children}

        <Footer builtWith={tFooter("built_with")} rights={tFooter("rights")} />
      </NextIntlClientProvider>
    </HtmlShell>
  );
}

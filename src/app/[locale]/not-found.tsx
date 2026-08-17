"use client";

import { useTranslations } from "next-intl";

import { StatusScreen } from "@/components/status-screen";
import { Link } from "@/i18n/navigation";

/**
 * Pagina 404 dentro de un locale. Componente de cliente para poder leer
 * traducciones y usar el Link tipado de next-intl (mantiene el locale).
 */
export default function NotFound() {
  const t = useTranslations("status");

  return (
    <StatusScreen
      eyebrow={t("not_found_eyebrow")}
      title={t("not_found_title")}
      message={t("not_found_message")}
    >
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-md bg-accent-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-300"
      >
        {t("back_home")}
      </Link>
    </StatusScreen>
  );
}

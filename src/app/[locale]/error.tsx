"use client";

import { useTranslations } from "next-intl";

import { StatusScreen } from "@/components/status-screen";
import { Button } from "@/components/ui";

/**
 * Error boundary por ruta. Requisito de Next: componente de cliente y
 * prop `reset`. El layout de `[locale]` sigue montado, asi que el
 * `NextIntlClientProvider` y los estilos Dark-Tech estan disponibles.
 */
export default function ErrorPage({ reset }: { reset: () => void }) {
  const t = useTranslations("status");

  return (
    <StatusScreen
      eyebrow={t("error_eyebrow")}
      title={t("error_title")}
      message={t("error_message")}
    >
      <Button type="button" variant="primary" onClick={() => reset()}>
        {t("retry")}
      </Button>
    </StatusScreen>
  );
}

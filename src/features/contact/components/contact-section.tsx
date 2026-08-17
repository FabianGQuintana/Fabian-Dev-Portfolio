import { getTranslations } from "next-intl/server";

import { RevealOnScroll } from "@/components/motion";
import { Eyebrow } from "@/components/ui";

import { ContactForm } from "./contact-form";

import type { ContactUiLabels } from "../types";

/**
 * Seccion de contacto.
 *
 * Server Component: resuelve las traducciones y se las pasa al formulario
 * cliente. El form no llama a `getTranslations` porque es un Client
 * Component; las labels viajan como datos ya traducidos.
 */
export async function ContactSection() {
  const t = await getTranslations("contact");

  const labels: ContactUiLabels = {
    name: t("name"),
    email: t("email"),
    subject: t("subject"),
    message: t("message"),
    send: t("send"),
    sending: t("sending"),
    success: t("success"),
    error: t("error"),
    errorRateLimited: t("error_rate_limited"),
    errors: {
      name_short: t("errors.name_short"),
      email_invalid: t("errors.email_invalid"),
      subject_short: t("errors.subject_short"),
      message_short: t("errors.message_short"),
      website: t("errors.website"),
    },
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="container-section py-[clamp(80px,12vh,160px)]"
    >
      <RevealOnScroll>
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h2
          id="contact-heading"
          className="mt-3 max-w-2xl text-h2 text-balance"
        >
          {t("title")}
        </h2>
      </RevealOnScroll>

      <div className="mt-12 max-w-2xl">
        <ContactForm labels={labels} />
      </div>
    </section>
  );
}

"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useActionState, useEffect, useRef, useState } from "react";

import { Button, Input, Label, Textarea } from "@/components/ui";
import { duration, ease } from "@/lib/motion-tokens";
import { cn } from "@/lib/utils";

import { sendMessage } from "../actions/send-message";
import { contactSchema } from "../schemas/contact-schema";

import type { ContactField, ContactFormState, ContactUiLabels } from "../types";

/**
 * Formulario de contacto.
 *
 * `useActionState` da la mejora progresiva del plan: funciona sin JS (el
 * form postea al Server Action) y con JS anima los estados. El tiempo de
 * montaje (`mountedAt`) alimenta el time-trap del servidor, no se usa aca.
 */

interface ContactFormProps {
  labels: ContactUiLabels;
}

const bannerTransition = { duration: duration.base, ease: ease.out } as const;

/** Estado inicial de `useActionState` (contrato del Server Action). */
const initialState: ContactFormState = { status: "idle" };

export function ContactForm({ labels }: ContactFormProps) {
  const [state, formAction, isPending] = useActionState(
    sendMessage,
    initialState,
  );
  const reduceMotion = useReducedMotion();
  const formRef = useRef<HTMLFormElement>(null);
  const mountedAtRef = useRef<HTMLInputElement>(null);
  const [clientFieldErrors, setClientFieldErrors] = useState<
    Partial<Record<ContactField, string>>
  >({});

  // Time-trap del servidor. `Date.now()` en un initializer de useState o un
  // estado sincronizado provocaria mismatch de hidratacion (SSR != cliente):
  // se escribe directo en el input no controlado, solo en el navegador.
  useEffect(() => {
    if (mountedAtRef.current) {
      mountedAtRef.current.value = String(Date.now());
    }
  }, []);

  // Limpia el form cuando el envio se confirma.
  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state.status]);

  const isError = state.status === "error";
  const bannerMessage = isError
    ? state.messageKey === "error_rate_limited"
      ? labels.errorRateLimited
      : labels.error
    : state.status === "success"
      ? labels.success
      : null;

  /** Valida en el cliente con el MISMO schema del servidor (feedback inmediato). */
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const parsed = contactSchema.safeParse({
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      subject: String(formData.get("subject") ?? ""),
      message: String(formData.get("message") ?? ""),
      website: String(formData.get("website") ?? ""),
    });

    if (!parsed.success) {
      event.preventDefault();
      const errors: Partial<Record<ContactField, string>> = {};
      for (const issue of parsed.error.issues) {
        const field = String(issue.path[0] ?? "");
        if (field) errors[field as ContactField] = issue.message;
      }
      setClientFieldErrors(errors);
    } else {
      setClientFieldErrors({});
    }
  }

  function fieldError(field: ContactField): string | undefined {
    const clientKey = clientFieldErrors[field];
    if (clientKey)
      return labels.errors[clientKey as keyof ContactUiLabels["errors"]];
    if (!isError) return undefined;
    const serverKey = state.fieldErrors?.[field];
    return serverKey
      ? labels.errors[serverKey as keyof ContactUiLabels["errors"]]
      : undefined;
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={handleSubmit}
      noValidate
      className="grid gap-5 sm:grid-cols-2"
    >
      {/* Time-trap: timestamp del montaje del form, leido por el servidor. */}
      <input
        ref={mountedAtRef}
        type="hidden"
        name="mountedAt"
        defaultValue="0"
      />

      {/* Honeypot: oculto del DOM y de los lectores de pantalla. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-auto -left-[9999px] h-px w-px overflow-hidden"
      >
        <label htmlFor="website" tabIndex={-1}>
          Website
        </label>
        <input
          id="website"
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="contact-name">{labels.name}</Label>
        <Input
          id="contact-name"
          name="name"
          autoComplete="name"
          required
          aria-invalid={fieldError("name") ? true : undefined}
          aria-describedby={
            fieldError("name") ? "contact-name-error" : undefined
          }
          disabled={isPending}
        />
        {fieldError("name") ? (
          <p
            id="contact-name-error"
            role="alert"
            className="font-mono text-xs text-error"
          >
            {fieldError("name")}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="contact-email">{labels.email}</Label>
        <Input
          id="contact-email"
          type="email"
          name="email"
          autoComplete="email"
          required
          aria-invalid={fieldError("email") ? true : undefined}
          aria-describedby={
            fieldError("email") ? "contact-email-error" : undefined
          }
          disabled={isPending}
        />
        {fieldError("email") ? (
          <p
            id="contact-email-error"
            role="alert"
            className="font-mono text-xs text-error"
          >
            {fieldError("email")}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2 sm:col-span-2">
        <Label htmlFor="contact-subject">{labels.subject}</Label>
        <Input
          id="contact-subject"
          name="subject"
          required
          aria-invalid={fieldError("subject") ? true : undefined}
          aria-describedby={
            fieldError("subject") ? "contact-subject-error" : undefined
          }
          disabled={isPending}
        />
        {fieldError("subject") ? (
          <p
            id="contact-subject-error"
            role="alert"
            className="font-mono text-xs text-error"
          >
            {fieldError("subject")}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2 sm:col-span-2">
        <Label htmlFor="contact-message">{labels.message}</Label>
        <Textarea
          id="contact-message"
          name="message"
          rows={6}
          required
          aria-invalid={fieldError("message") ? true : undefined}
          aria-describedby={
            fieldError("message") ? "contact-message-error" : undefined
          }
          disabled={isPending}
        />
        {fieldError("message") ? (
          <p
            id="contact-message-error"
            role="alert"
            className="font-mono text-xs text-error"
          >
            {fieldError("message")}
          </p>
        ) : null}
      </div>

      <div className="sm:col-span-2">
        <Button type="submit" size="lg" disabled={isPending}>
          {isPending ? labels.sending : labels.send}
        </Button>
      </div>

      <AnimatePresence>
        {bannerMessage ? (
          <motion.p
            key={state.status}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={reduceMotion ? { duration: 0 } : bannerTransition}
            role={state.status === "error" ? "alert" : "status"}
            className={cn(
              "rounded-md border px-4 py-3 text-sm sm:col-span-2",
              isError
                ? "border-error/40 bg-error/10 text-error"
                : "border-accent-500/40 bg-accent-500/10 text-fg",
            )}
          >
            {bannerMessage}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </form>
  );
}

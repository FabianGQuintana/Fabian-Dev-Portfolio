import { siteConfig } from "@/config/site";

/**
 * Plantilla de la notificacion de contacto.
 *
 * JSX con estilos inline (el formato de React Email). La SDK de Resend v6
 * renderiza este componente a HTML/plain-text en el servidor; no se necesita
 * ningun paquete de React Email adicional.
 *
 * El `reply-to` NO se define aca: es una cabecera de la llamada a Resend
 * (payload.replyTo), donde se apunta al correo del remitente.
 */

interface ContactNotificationProps {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const style = {
  container: {
    backgroundColor: "#0b0a0f",
    color: "#f2f0ee",
    fontFamily:
      "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    padding: "32px",
    maxWidth: "560px",
    margin: "0 auto",
  },
  badge: {
    display: "inline-block",
    fontFamily: "ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace",
    fontSize: "12px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#6e6d7a",
    margin: "0 0 16px",
  },
  title: {
    fontSize: "24px",
    fontWeight: 700,
    margin: "0 0 24px",
  },
  field: {
    margin: "0 0 16px",
  },
  label: {
    fontSize: "12px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#6e6d7a",
    margin: "0 0 4px",
  },
  value: {
    fontSize: "15px",
    margin: "0",
  },
  messageBox: {
    backgroundColor: "#14121a",
    border: "1px solid #26242e",
    borderRadius: "8px",
    padding: "16px",
    margin: "24px 0 0",
  },
  message: {
    fontSize: "15px",
    lineHeight: "1.6",
    whiteSpace: "pre-wrap",
    margin: "0",
  },
  footer: {
    fontSize: "13px",
    color: "#6e6d7a",
    margin: "24px 0 0",
  },
} as const;

export function ContactNotification({
  name,
  email,
  subject,
  message,
}: ContactNotificationProps) {
  return (
    <div style={style.container}>
      <p style={style.badge}>{siteConfig.name} · contacto</p>
      <h1 style={style.title}>Nuevo mensaje del portafolio</h1>

      <div style={style.field}>
        <p style={style.label}>De</p>
        <p style={style.value}>
          {name} ·{" "}
          <a href={`mailto:${email}`} style={{ color: "#a5e8c9" }}>
            {email}
          </a>
        </p>
      </div>

      <div style={style.field}>
        <p style={style.label}>Asunto</p>
        <p style={style.value}>{subject}</p>
      </div>

      <div style={style.messageBox}>
        <p style={style.message}>{message}</p>
      </div>

      <p style={style.footer}>
        Respondé desde tu cliente de correo: el mensaje llega con reply-to del
        remitente.
      </p>
    </div>
  );
}

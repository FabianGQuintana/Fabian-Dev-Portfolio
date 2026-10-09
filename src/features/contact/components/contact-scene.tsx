"use client";

import { motion, useAnimationFrame, useReducedMotion } from "motion/react";
import { useRef } from "react";

import type { ContactMood } from "../types";

interface ContactSceneProps {
  mood: ContactMood;
  /** 0 a 1: cuanto del mensaje se ha escrito. Rellena las lineas de la carta. */
  progress: number;
  /** Cambia en cada envio exitoso: reinicia la explosion de confeti. */
  burstKey: number;
}

/* Centro del sobre y orbita del avion (viewBox 400x400). */
const CX = 200;
const CY = 218;
const ORBIT_RX = 168;
const ORBIT_RY = 62;
const ORBIT_TILT = (-16 * Math.PI) / 180;

/** Velocidad angular del avion (rad/s) segun el estado. */
const PLANE_SPEED: Record<ContactMood, number> = {
  idle: 0.45,
  typing: 0.9,
  sending: 3.4,
  sent: 1.1,
  error: 0.2,
};

const CONFETTI = Array.from({ length: 16 }, (_, index) => {
  const angle = (index / 16) * Math.PI * 2;
  return {
    angle,
    distance: 70 + (index % 4) * 22,
    size: 3 + (index % 3),
    tone: index % 3,
  };
});

/**
 * Escena animada del formulario de contacto.
 *
 * Un sobre con una carta, un avion de papel que orbita y ondas de señal. La
 * escena REACCIONA al formulario:
 *  - idle: el sobre respira y el avion da vueltas lento.
 *  - typing: el sobre se abre, la carta sube y sus lineas se llenan segun lo
 *    que se va escribiendo.
 *  - sending: el sobre vibra y el avion acelera.
 *  - sent: el sobre se cierra con un check y estalla un confeti.
 *  - error: el sobre se inclina y se tiñe de rojo un momento.
 *
 * El avion se anima con useAnimationFrame mutando el atributo `transform`
 * directamente: cero renders de React por frame.
 */
export function ContactScene({ mood, progress, burstKey }: ContactSceneProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const planeRef = useRef<SVGGElement>(null);
  const angle = useRef(0.8);
  const speed = useRef(PLANE_SPEED.idle);

  const isOpen = mood === "typing" || mood === "sending";

  useAnimationFrame((_time, delta) => {
    const plane = planeRef.current;
    if (!plane || reduceMotion) return;

    // Suaviza el cambio de velocidad para que el avion acelere, no salte.
    speed.current += (PLANE_SPEED[mood] - speed.current) * 0.06;
    angle.current += (delta / 1000) * speed.current;
    const t = angle.current;

    const ex = ORBIT_RX * Math.cos(t);
    const ey = ORBIT_RY * Math.sin(t);
    const x = CX + ex * Math.cos(ORBIT_TILT) - ey * Math.sin(ORBIT_TILT);
    const y = CY + ex * Math.sin(ORBIT_TILT) + ey * Math.cos(ORBIT_TILT);

    // Direccion = tangente de la elipse (misma rotacion).
    const dx = -ORBIT_RX * Math.sin(t);
    const dy = ORBIT_RY * Math.cos(t);
    const tx = dx * Math.cos(ORBIT_TILT) - dy * Math.sin(ORBIT_TILT);
    const ty = dx * Math.sin(ORBIT_TILT) + dy * Math.cos(ORBIT_TILT);
    const heading = (Math.atan2(ty, tx) * 180) / Math.PI;

    // Perspectiva: mas grande al pasar por delante del sobre.
    const depth = 0.72 + 0.28 * Math.sin(t);
    plane.setAttribute(
      "transform",
      `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${heading.toFixed(1)}) scale(${depth.toFixed(3)})`,
    );
    plane.style.opacity = String(0.55 + 0.45 * Math.sin(t) ** 2 + 0.2);
  });

  const lineWidths = [88, 96, 70];
  const filled = (index: number) => {
    const share = Math.min(Math.max(progress * 3 - index, 0), 1);
    return mood === "sent" ? 1 : share;
  };

  return (
    <svg
      viewBox="0 0 400 400"
      aria-hidden="true"
      className="mx-auto w-full max-w-md overflow-visible"
    >
      {/* Ondas de señal. */}
      {[0, 1, 2].map((ring) => (
        <motion.circle
          key={ring}
          cx={CX}
          cy={CY}
          r={70}
          fill="none"
          className="stroke-accent-500"
          strokeWidth={1.5}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={
            reduceMotion
              ? { scale: 1 + ring * 0.45, opacity: 0.2 }
              : { scale: [0.6, 2.4], opacity: [0.5, 0] }
          }
          transition={{
            duration: mood === "sending" ? 1.2 : 4.2,
            ease: "easeOut",
            repeat: Infinity,
            delay: ring * (mood === "sending" ? 0.4 : 1.4),
          }}
        />
      ))}

      {/* Orbita del avion. */}
      <ellipse
        cx={CX}
        cy={CY}
        rx={ORBIT_RX}
        ry={ORBIT_RY}
        transform={`rotate(-16 ${CX} ${CY})`}
        fill="none"
        className="stroke-accent-500/35"
        strokeWidth={1.5}
        strokeDasharray="3 9"
        strokeLinecap="round"
      />

      {/* Sobre: todo el grupo respira, vibra o se inclina segun el estado. */}
      <motion.g
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        animate={
          reduceMotion
            ? undefined
            : mood === "sending"
              ? { x: [0, -3, 3, -3, 3, 0], y: 0, rotate: 0 }
              : mood === "error"
                ? { x: 0, y: 0, rotate: [0, -7, 5, -3, 0] }
                : { x: 0, y: [0, -8, 0], rotate: 0 }
        }
        transition={
          mood === "sending"
            ? { duration: 0.35, repeat: Infinity }
            : mood === "error"
              ? { duration: 0.6 }
              : { duration: 5, ease: "easeInOut", repeat: Infinity }
        }
      >
        {/* Solapa abierta (detras de la carta). */}
        <motion.path
          d={`M ${CX - 72} ${CY - 44} L ${CX} ${CY - 98} L ${CX + 72} ${CY - 44} Z`}
          className="fill-accent-700 stroke-accent-500"
          strokeWidth={2}
          strokeLinejoin="round"
          animate={{ opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Cuerpo trasero. */}
        <rect
          x={CX - 72}
          y={CY - 44}
          width={144}
          height={100}
          rx={12}
          className={
            mood === "error"
              ? "fill-bg-surface-raised stroke-error"
              : "fill-bg-surface-raised stroke-accent-500"
          }
          strokeWidth={2}
        />

        {/* Carta. */}
        <motion.g
          animate={{ y: isOpen ? -46 : mood === "sent" ? 0 : 6 }}
          transition={{ type: "spring", stiffness: 160, damping: 16 }}
        >
          <rect
            x={CX - 56}
            y={CY - 38}
            width={112}
            height={84}
            rx={7}
            className="fill-bg-surface stroke-line-interactive"
            strokeWidth={1.5}
          />
          {lineWidths.map((width, index) => (
            <g key={index}>
              <rect
                x={CX - 42}
                y={CY - 22 + index * 17}
                width={width}
                height={5}
                rx={2.5}
                className="fill-line-strong"
              />
              <motion.rect
                x={CX - 42}
                y={CY - 22 + index * 17}
                height={5}
                rx={2.5}
                className="fill-accent-500"
                animate={{ width: width * filled(index) }}
                transition={{ duration: 0.25 }}
              />
            </g>
          ))}
        </motion.g>

        {/* Bolsillo frontal del sobre. */}
        <path
          d={`M ${CX - 72} ${CY - 44} L ${CX} ${CY + 18} L ${CX + 72} ${CY - 44} L ${CX + 72} ${CY + 44} Q ${CX + 72} ${CY + 56} ${CX + 60} ${CY + 56} L ${CX - 60} ${CY + 56} Q ${CX - 72} ${CY + 56} ${CX - 72} ${CY + 44} Z`}
          className={
            mood === "error"
              ? "fill-bg-surface stroke-error"
              : "fill-bg-surface stroke-accent-500"
          }
          strokeWidth={2}
          strokeLinejoin="round"
        />

        {/* Solapa cerrada (delante): se pliega hacia arriba al abrir. */}
        <motion.path
          d={`M ${CX - 72} ${CY - 44} L ${CX} ${CY + 14} L ${CX + 72} ${CY - 44} Z`}
          className="fill-accent-600 stroke-accent-500"
          strokeWidth={2}
          strokeLinejoin="round"
          style={{
            transformBox: "fill-box",
            transformOrigin: "50% 0%",
          }}
          animate={{ scaleY: isOpen ? 0 : 1, opacity: isOpen ? 0 : 1 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
        />

        {/* Sello de "enviado". */}
        <motion.g
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          initial={false}
          animate={{
            scale: mood === "sent" ? 1 : 0,
            opacity: mood === "sent" ? 1 : 0,
          }}
          transition={{ type: "spring", stiffness: 260, damping: 14 }}
        >
          <circle
            cx={CX + 72}
            cy={CY - 44}
            r={24}
            className="fill-success stroke-bg-base"
            strokeWidth={4}
          />
          <path
            d={`M ${CX + 62} ${CY - 44} l 7 8 l 14 -16`}
            fill="none"
            stroke="white"
            strokeWidth={4.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.g>
      </motion.g>

      {/* Avion de papel (se posiciona en useAnimationFrame). */}
      <g ref={planeRef} transform={`translate(${CX + ORBIT_RX - 20} ${CY})`}>
        <path
          d="M -14 -9 L 18 0 L -14 9 L -8 0 Z"
          className="fill-accent-300"
        />
        <path d="M -8 0 L 18 0 L -14 9 Z" className="fill-accent-500" />
      </g>

      {/* Confeti al enviar. */}
      {mood === "sent" && !reduceMotion
        ? CONFETTI.map((piece, index) => (
            <motion.circle
              key={`${burstKey}-${index}`}
              cx={CX}
              cy={CY - 20}
              r={piece.size}
              className={
                piece.tone === 0
                  ? "fill-accent-300"
                  : piece.tone === 1
                    ? "fill-accent-500"
                    : "fill-success"
              }
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: Math.cos(piece.angle) * piece.distance,
                y: Math.sin(piece.angle) * piece.distance - 20,
                opacity: 0,
                scale: 0.4,
              }}
              transition={{ duration: 1.1, ease: "easeOut" }}
            />
          ))
        : null}

      {/* Burbujas flotantes: "@" y mensaje. */}
      <motion.g
        animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
        transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
      >
        <circle
          cx={64}
          cy={92}
          r={26}
          className="fill-bg-surface stroke-accent-500/60"
          strokeWidth={1.5}
        />
        <text
          x={64}
          y={101}
          textAnchor="middle"
          className="fill-accent-400 font-mono"
          fontSize={26}
          fontWeight={700}
        >
          @
        </text>
      </motion.g>

      <motion.g
        animate={reduceMotion ? undefined : { y: [0, 9, 0] }}
        transition={{
          duration: 7,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 1,
        }}
      >
        <path
          d="M 308 306 h 58 a 12 12 0 0 1 12 12 v 22 a 12 12 0 0 1 -12 12 h -34 l -14 14 v -14 h -10 a 12 12 0 0 1 -12 -12 v -22 a 12 12 0 0 1 12 -12 z"
          className="fill-bg-surface stroke-accent-500/60"
          strokeWidth={1.5}
          strokeLinejoin="round"
          transform="translate(-14 -4)"
        />
        {[0, 1, 2].map((dot) => (
          <motion.circle
            key={dot}
            cx={308 + dot * 14}
            cy={332}
            r={3.5}
            className="fill-accent-400"
            animate={reduceMotion ? undefined : { opacity: [0.25, 1, 0.25] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: dot * 0.2 }}
          />
        ))}
      </motion.g>
    </svg>
  );
}

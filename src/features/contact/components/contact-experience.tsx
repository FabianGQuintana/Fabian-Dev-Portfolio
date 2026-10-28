"use client";

import { useCallback, useEffect, useState } from "react";

import { RevealOnScroll } from "@/components/motion";

import { ContactForm } from "./contact-form";
import { ContactScene } from "./contact-scene";

import type { ContactMood, ContactUiLabels } from "../types";

interface ContactExperienceProps {
  labels: ContactUiLabels;
}

/** Cuanto tarda la escena en volver a reposo tras cada estado. */
const SETTLE_MS: Record<ContactMood, number | null> = {
  idle: null,
  typing: 2800,
  sending: null,
  sent: 5500,
  error: 2500,
};

interface SceneState {
  mood: ContactMood;
  progress: number;
  /** Se incrementa en cada actividad: reinicia el temporizador de reposo. */
  tick: number;
}

/**
 * Formulario (izquierda) + escena animada (derecha).
 *
 * Es el dueño del estado compartido: el form avisa lo que pasa
 * (onActivity) y la escena lo dibuja. Tras unos segundos sin actividad la
 * escena vuelve sola a reposo.
 */
export function ContactExperience({ labels }: ContactExperienceProps) {
  const [scene, setScene] = useState<SceneState>({
    mood: "idle",
    progress: 0,
    tick: 0,
  });
  const [burstKey, setBurstKey] = useState(0);

  const handleActivity = useCallback((mood: ContactMood, progress?: number) => {
    setScene((current) => ({
      mood,
      progress: progress ?? current.progress,
      tick: current.tick + 1,
    }));
    if (mood === "sent") setBurstKey((key) => key + 1);
  }, []);

  useEffect(() => {
    const delay = SETTLE_MS[scene.mood];
    if (delay === null) return;
    const timer = window.setTimeout(
      () =>
        setScene((current) => ({
          mood: "idle",
          // Tras enviar la carta se vacia; si solo estaba escribiendo, no.
          progress: scene.mood === "sent" ? 0 : current.progress,
          tick: current.tick + 1,
        })),
      delay,
    );
    return () => window.clearTimeout(timer);
  }, [scene.mood, scene.tick]);

  return (
    <div className="mt-12 grid items-center gap-12 lg:grid-cols-[minmax(0,34rem)_minmax(0,1fr)] lg:gap-16">
      <div>
        <ContactForm labels={labels} onActivity={handleActivity} />
      </div>

      <RevealOnScroll
        delay={0.2}
        className="mx-auto w-full max-w-sm sm:max-w-md"
      >
        <ContactScene
          mood={scene.mood}
          progress={scene.progress}
          burstKey={burstKey}
        />
      </RevealOnScroll>
    </div>
  );
}

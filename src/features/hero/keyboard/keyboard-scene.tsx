"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  type RefObject,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AdditiveBlending,
  Color,
  type Group,
  type InstancedMesh,
  type MeshBasicMaterial,
  type MeshStandardMaterial,
  Object3D,
} from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

import { KEYBOARD_WIDTH_U, KEYS, type KeyDef } from "./layout";
import {
  createLegendTexture,
  createLogoTexture,
  type SocialIconId,
} from "./textures";
import { buildTimeline, eventAt, type TypingTimeline } from "./timeline";

/* ===========================================================================
   Teclado mecanico RGB que teclea solo.

   Todo se anima dentro de useFrame mutando refs: el tecleo, el RGB y los
   iconos no disparan renders de React. El unico estado de React es el
   texto que se muestra fuera del canvas, y solo cambia por tecla.
   =========================================================================== */

export interface KeyboardSocial {
  readonly id: SocialIconId;
  readonly word: string;
  readonly href: string;
}

interface KeyboardSceneProps {
  socials: readonly KeyboardSocial[];
  /** false = teclado estatico, iconos visibles (prefers-reduced-motion). */
  animate: boolean;
  /** false pausa el render (hero fuera de pantalla). */
  active: boolean;
  onTextChange: (text: string) => void;
}

/** Estado compartido por frame entre el driver y las teclas/iconos. */
interface SceneClock {
  /** Segundos de animacion acumulados (no avanzan con el render pausado). */
  elapsed: number;
  cycleTime: number;
  cycleIndex: number;
  /** Segundos desde la ultima pulsacion de cada tecla. */
  pressAge: Map<string, number>;
}

const KEY_GAP = 0.14;
const KEY_HEIGHT = 0.42;
const KEY_TRAVEL = 0.2;
const CAP_COLOR = "#120d19";
const CASE_COLOR = "#0c0913";

/* --------------------------------------------------------------------------
   Utilidades
   -------------------------------------------------------------------------- */

/** Tono RGB de una tecla: una onda que recorre el teclado de izquierda a derecha. */
function hueAt(x: number, time: number): number {
  const position = (x + KEYBOARD_WIDTH_U / 2) / KEYBOARD_WIDTH_U;
  return (((position * 0.75 - time * 0.12) % 1) + 1) % 1;
}

/** Recorrido de la tecla (0 arriba, 1 a fondo) segun el tiempo desde la pulsacion. */
function pressDepth(age: number): number {
  if (age < 0 || age > 0.28) return 0;
  if (age < 0.05) return age / 0.05;
  return 1 - (age - 0.05) / 0.23;
}

function easeOutBack(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

/** Una geometria por ancho de tecla, compartida entre todas las iguales. */
const capGeometries = new Map<number, RoundedBoxGeometry>();
function capGeometry(width: number) {
  let geometry = capGeometries.get(width);
  if (!geometry) {
    geometry = new RoundedBoxGeometry(
      width - KEY_GAP,
      KEY_HEIGHT,
      1 - KEY_GAP,
      3,
      0.09,
    );
    capGeometries.set(width, geometry);
  }
  return geometry;
}

/* --------------------------------------------------------------------------
   Tecla
   -------------------------------------------------------------------------- */

function Key({ def, clock }: { def: KeyDef; clock: RefObject<SceneClock> }) {
  const groupRef = useRef<Group>(null);
  const capRef = useRef<MeshStandardMaterial>(null);
  const legendRef = useRef<MeshBasicMaterial>(null);
  const legend = useMemo(
    () => createLegendTexture(def.label, def.width),
    [def.label, def.width],
  );
  const color = useMemo(() => new Color(), []);

  useFrame(() => {
    const depth = pressDepth(clock.current.pressAge.get(def.id) ?? Infinity);
    if (groupRef.current) groupRef.current.position.y = -depth * KEY_TRAVEL;

    color.setHSL(hueAt(def.x, clock.current.elapsed), 0.95, 0.72 + depth * 0.2);
    legendRef.current?.color.copy(color);
    capRef.current?.emissive.copy(color).multiplyScalar(0.06 + depth * 0.55);
  });

  return (
    <group ref={groupRef} position={[def.x, 0, def.z]}>
      <mesh geometry={capGeometry(def.width)} position-y={KEY_HEIGHT / 2}>
        <meshStandardMaterial
          ref={capRef}
          color={CAP_COLOR}
          roughness={0.5}
          metalness={0.15}
        />
      </mesh>
      {def.label ? (
        <mesh rotation-x={-Math.PI / 2} position-y={KEY_HEIGHT + 0.002}>
          <planeGeometry
            args={[def.width - KEY_GAP - 0.14, 1 - KEY_GAP - 0.14]}
          />
          <meshBasicMaterial
            ref={legendRef}
            map={legend}
            transparent
            toneMapped={false}
          />
        </mesh>
      ) : null}
    </group>
  );
}

/* --------------------------------------------------------------------------
   Retroiluminacion: un plano brillante bajo cada tecla, en una sola
   InstancedMesh (1 draw call). Solo se ve en los huecos entre teclas.
   -------------------------------------------------------------------------- */

function Backlight({ clock }: { clock: RefObject<SceneClock> }) {
  const meshRef = useRef<InstancedMesh>(null);
  const color = useMemo(() => new Color(), []);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const dummy = new Object3D();
    KEYS.forEach((key, index) => {
      dummy.position.set(key.x, 0.01, key.z);
      dummy.rotation.set(-Math.PI / 2, 0, 0);
      dummy.scale.set(key.width + 0.06, 1.06, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
      mesh.setColorAt(index, color.setHSL(hueAt(key.x, 0), 1, 0.5));
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [color]);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh?.instanceColor) return;
    KEYS.forEach((key, index) => {
      const depth = pressDepth(clock.current.pressAge.get(key.id) ?? Infinity);
      color.setHSL(hueAt(key.x, clock.current.elapsed), 1, 0.5 + depth * 0.3);
      mesh.setColorAt(index, color);
    });
    mesh.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, KEYS.length]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        toneMapped={false}
        transparent
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

/* --------------------------------------------------------------------------
   Carcasa + aro RGB inferior
   -------------------------------------------------------------------------- */

function Case({ clock }: { clock: RefObject<SceneClock> }) {
  const rimRef = useRef<MeshBasicMaterial>(null);
  const caseGeometry = useMemo(
    () => new RoundedBoxGeometry(KEYBOARD_WIDTH_U + 0.7, 0.55, 5.7, 4, 0.22),
    [],
  );
  const rimGeometry = useMemo(
    () => new RoundedBoxGeometry(KEYBOARD_WIDTH_U + 0.8, 0.06, 5.8, 2, 0.03),
    [],
  );

  useFrame(() => {
    rimRef.current?.color.setHSL(hueAt(0, clock.current.elapsed), 1, 0.55);
  });

  return (
    <group>
      <mesh geometry={caseGeometry} position-y={-0.26}>
        <meshStandardMaterial
          color={CASE_COLOR}
          roughness={0.3}
          metalness={0.75}
        />
      </mesh>
      <mesh geometry={rimGeometry} position-y={-0.52}>
        <meshBasicMaterial ref={rimRef} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* --------------------------------------------------------------------------
   Icono social que emerge al pulsar Enter
   -------------------------------------------------------------------------- */

const ICON_SPACING = 2.6;
const ICON_HEIGHT = 3.1;
const EMERGE_DURATION = 0.7;
const POP_DURATION = 0.55;

function SocialIcon({
  social,
  index,
  total,
  revealTime,
  clock,
  animate,
}: {
  social: KeyboardSocial;
  index: number;
  total: number;
  revealTime: number;
  clock: RefObject<SceneClock>;
  animate: boolean;
}) {
  const groupRef = useRef<Group>(null);
  const tileRef = useRef<MeshStandardMaterial>(null);
  const [hovered, setHovered] = useState(false);
  const logo = useMemo(() => createLogoTexture(social.id), [social.id]);
  const geometry = useMemo(
    () => new RoundedBoxGeometry(1.9, 1.9, 0.38, 4, 0.34),
    [],
  );
  const x = (index - (total - 1) / 2) * ICON_SPACING;

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;

    // Primer ciclo: el icono emerge al pulsar Enter. Despues queda fijo y
    // solo "late" cada vez que su palabra se vuelve a teclear.
    const sinceReveal = clock.current.cycleTime - revealTime;
    const emerge = !animate
      ? 1
      : clock.current.cycleIndex > 0
        ? 1
        : Math.min(Math.max(sinceReveal / EMERGE_DURATION, 0), 1);
    const pop =
      animate && sinceReveal >= 0 && sinceReveal < POP_DURATION
        ? Math.sin((Math.PI * sinceReveal) / POP_DURATION) * 0.22
        : 0;

    group.visible = emerge > 0;
    const float = animate
      ? Math.sin(clock.current.elapsed * 1.6 + index * 1.3) * 0.12
      : 0;
    group.position.y = 0.4 + (ICON_HEIGHT - 0.4) * easeOutBack(emerge) + float;
    const scale =
      Math.max(easeOutBack(emerge), 0) * (1 + pop) * (hovered ? 1.12 : 1);
    group.scale.setScalar(scale);
    group.rotation.y = animate
      ? Math.sin(clock.current.elapsed * 0.8 + index) * 0.22
      : 0;

    if (tileRef.current) {
      tileRef.current.emissiveIntensity = (hovered ? 1.4 : 0.55) + pop * 3;
    }
  });

  function handleClick() {
    if (social.href.startsWith("#")) {
      document
        .querySelector(social.href)
        ?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.open(social.href, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <group
      ref={groupRef}
      position={[x, ICON_HEIGHT, -1.4]}
      onClick={handleClick}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "var(--cursor-pointer)";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "";
      }}
    >
      <mesh geometry={geometry}>
        <meshStandardMaterial
          ref={tileRef}
          color="#6e1cc2"
          emissive="#46057a"
          emissiveIntensity={0.55}
          roughness={0.3}
          metalness={0.35}
        />
      </mesh>
      <mesh position-z={0.2}>
        <planeGeometry args={[1.5, 1.5]} />
        <meshBasicMaterial map={logo} transparent toneMapped={false} />
      </mesh>
    </group>
  );
}

/* --------------------------------------------------------------------------
   Escena
   -------------------------------------------------------------------------- */

/**
 * Avanza el reloj y decide que teclas estan pulsadas. Devuelve el texto en
 * pantalla en este instante.
 */
function advanceClock(
  clock: SceneClock,
  timeline: TypingTimeline,
  delta: number,
): string {
  // Tope al delta: al volver de una pestaña oculta no se "salta" medio ciclo.
  clock.elapsed += Math.min(delta, 0.1);
  clock.cycleIndex = Math.floor(clock.elapsed / timeline.duration);
  clock.cycleTime = clock.elapsed % timeline.duration;

  clock.pressAge.clear();
  for (const event of timeline.events) {
    if (event.time > clock.cycleTime) break;
    clock.pressAge.set(event.keyId, clock.cycleTime - event.time);
  }

  return eventAt(timeline, clock.cycleTime)?.text ?? "";
}

function Rig({
  socials,
  animate,
  onTextChange,
}: Omit<KeyboardSceneProps, "active">) {
  const rigRef = useRef<Group>(null);
  const { viewport, pointer } = useThree();
  const timeline = useMemo(
    () => buildTimeline(socials.map((social) => social.word)),
    [socials],
  );
  const clock = useRef<SceneClock>({
    elapsed: 0,
    cycleTime: 0,
    cycleIndex: 0,
    pressAge: new Map(),
  });

  const lastText = useRef<string | null>(null);

  useFrame((_state, delta) => {
    if (!animate) return;
    const text = advanceClock(clock.current, timeline, delta);
    // Solo se notifica al cambiar: un setState por tecla, no por frame.
    if (text !== lastText.current) {
      lastText.current = text;
      onTextChange(text);
    }
  });

  // Inclinacion suave hacia el cursor.
  useFrame(() => {
    const rig = rigRef.current;
    if (!rig || !animate) return;
    rig.rotation.y += (pointer.x * 0.16 - rig.rotation.y) * 0.05;
    rig.rotation.x += (-pointer.y * 0.06 - rig.rotation.x) * 0.05;
  });

  // El teclado ocupa el ancho disponible sin pasarse de un tamaño comodo.
  const scale = Math.min(viewport.width / (KEYBOARD_WIDTH_U + 2.2), 0.5);

  return (
    <group ref={rigRef} scale={scale} position={[0, -0.3, 0.3]}>
      <Case clock={clock} />
      <Backlight clock={clock} />
      {KEYS.map((key) => (
        <Key key={key.id} def={key} clock={clock} />
      ))}
      {socials.map((social, index) => (
        <SocialIcon
          key={social.id}
          social={social}
          index={index}
          total={socials.length}
          revealTime={timeline.revealTimes[index] ?? 0}
          clock={clock}
          animate={animate}
        />
      ))}
    </group>
  );
}

export default function KeyboardScene({
  socials,
  animate,
  active,
  onTextChange,
}: KeyboardSceneProps) {
  return (
    <Canvas
      frameloop={!animate ? "demand" : active ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ position: [0, 6.2, 5.2], fov: 32 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
      className="h-full w-full"
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 6, 4]} intensity={1.6} />
      <pointLight position={[-4, 2, 2]} color="#6e1cc2" intensity={18} />
      <pointLight position={[4, 1.5, -2]} color="#a463f0" intensity={10} />
      <Rig socials={socials} animate={animate} onTextChange={onTextChange} />
    </Canvas>
  );
}

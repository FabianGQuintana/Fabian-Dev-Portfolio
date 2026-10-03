"use client";

import {
  Float,
  Environment,
  ContactShadows,
  PresentationControls,
  Html,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import { useRef, useCallback, useMemo } from "react";

import type * as THREE from "three";

/* ---------------------------------------------------------------------------
   FLOATING LINK — Etiqueta delicada, pill-shaped, que flota en el espacio 3D.
   Diseño ultra-minimalista: fondo cristalino, tipografía diminuta y uppercase.
   --------------------------------------------------------------------------- */

interface FloatingLinkProps {
  position: [number, number, number];
  label: string;
  href: string;
}

function FloatingLink({ position, label, href }: FloatingLinkProps) {
  const handleClick = useCallback(() => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  }, [href]);

  return (
    <Html position={position} center transform>
      <button
        type="button"
        onClick={handleClick}
        className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] tracking-widest whitespace-nowrap text-text-secondary uppercase backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-accent-400/50 hover:bg-accent-500/20 hover:text-white sm:text-xs"
      >
        {label}
      </button>
    </Html>
  );
}

/* ---------------------------------------------------------------------------
   DESK SETUP — Laptop abierta + taza de café, construidos con primitivas
   geométricas. El grupo tiene rotación isométrica para dar profundidad.
   --------------------------------------------------------------------------- */

function DeskSetup() {
  const groupRef = useRef<THREE.Group>(null);

  // Rotación sutil y continua sobre Y para que el setup respire
  useFrame((_state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.06;
    }
  });

  return (
    <group ref={groupRef} rotation={[0.2, -0.4, 0]}>
      {/* ================================================================
          LAPTOP
          ================================================================ */}

      {/* --- Base / Teclado --- */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[2.4, 0.08, 1.6]} />
        <meshPhysicalMaterial
          color="#1a1a1f"
          roughness={0.35}
          metalness={0.7}
          clearcoat={0.6}
          clearcoatRoughness={0.2}
        />
      </mesh>

      {/* --- Detalle: trackpad (sutil relieve en la base) --- */}
      <mesh position={[0, 0.045, 0.3]}>
        <boxGeometry args={[0.7, 0.005, 0.5]} />
        <meshPhysicalMaterial
          color="#222228"
          roughness={0.2}
          metalness={0.8}
          clearcoat={1}
        />
      </mesh>

      {/* --- Bisagra (cilindro fino entre base y pantalla) --- */}
      <mesh position={[0, 0.1, -0.78]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 2.4, 16]} />
        <meshPhysicalMaterial color="#2a2a30" roughness={0.3} metalness={0.9} />
      </mesh>

      {/* --- Pantalla (carcasa trasera) --- */}
      <mesh
        castShadow
        receiveShadow
        position={[0, 0.95, -1.05]}
        rotation={[-0.25, 0, 0]}
      >
        <boxGeometry args={[2.4, 1.6, 0.06]} />
        <meshPhysicalMaterial
          color="#1a1a1f"
          roughness={0.35}
          metalness={0.7}
          clearcoat={0.6}
          clearcoatRoughness={0.2}
        />
      </mesh>

      {/* --- Pantalla (display brillante con emissive morado) --- */}
      <mesh position={[0, 0.95, -1.02]} rotation={[-0.25, 0, 0]}>
        <planeGeometry args={[2.1, 1.35]} />
        <meshStandardMaterial
          color="#0b0a0f"
          emissive="#6100A5"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>

      {/* --- Líneas de "código" en la pantalla (barras decorativas) --- */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          position={[-0.3 + i * 0.08, 0.95 + 0.35 - i * 0.15, -1.01]}
          rotation={[-0.25, 0, 0]}
        >
          <planeGeometry args={[0.6 - i * 0.08, 0.04]} />
          <meshStandardMaterial
            color="#9e46f8"
            emissive="#9e46f8"
            emissiveIntensity={1.2}
            transparent
            opacity={0.6 - i * 0.08}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* ================================================================
          TAZA DE CAFÉ
          ================================================================ */}
      <group position={[1.8, 0, 0.4]}>
        {/* --- Cuerpo de la taza --- */}
        <mesh castShadow receiveShadow position={[0, 0.28, 0]}>
          <cylinderGeometry args={[0.22, 0.18, 0.5, 24]} />
          <meshPhysicalMaterial
            color="#2a2a30"
            roughness={0.3}
            metalness={0.6}
            clearcoat={0.8}
          />
        </mesh>

        {/* --- Superficie del café (disco oscuro arriba) --- */}
        <mesh position={[0, 0.52, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.2, 24]} />
          <meshStandardMaterial
            color="#1a0e08"
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>

        {/* --- Asa de la taza --- */}
        <mesh position={[0.28, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.12, 0.025, 8, 16, Math.PI]} />
          <meshPhysicalMaterial
            color="#2a2a30"
            roughness={0.3}
            metalness={0.6}
            clearcoat={0.8}
          />
        </mesh>

        {/* --- Vapor sutil (pequeña esfera traslúcida) --- */}
        <mesh position={[0, 0.7, 0]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.12} />
        </mesh>
      </group>

      {/* --- Luces focalizadas sobre el setup --- */}
      <pointLight position={[0, 2, 1]} color="#6100A5" intensity={6} />
      <pointLight position={[-2, 1, 2]} color="#a1a0ae" intensity={3} />
      <pointLight position={[2, 0.5, 1]} color="#46057a" intensity={2} />
    </group>
  );
}

/* ---------------------------------------------------------------------------
   SCENE CONTENT — Vive DENTRO del <Canvas> para poder usar useThree().
   Lee viewport.width y ajusta la posición del grupo:
   - Móvil: centrado (x=0), bajado (y=-1.5) para no tapar el texto.
   - Desktop: desplazado a la derecha (x=3), centrado verticalmente.
   --------------------------------------------------------------------------- */

const MOBILE_THRESHOLD = 5;

function SceneContent() {
  const { viewport } = useThree();

  const isMobile = viewport.width < MOBILE_THRESHOLD;

  const groupPosition = useMemo<[number, number, number]>(
    () => (isMobile ? [0, -1.5, 0] : [3, 0, 0]),
    [isMobile],
  );

  return (
    <>
      <ambientLight intensity={0.5} />

      <PresentationControls
        global
        config={{ mass: 2, tension: 500 }}
        snap={{ mass: 4, tension: 1500 }}
        rotation={[0, 0.3, 0]}
        polar={[-0.1, 0.1]}
        azimuth={[-0.3, 0.3]}
      >
        <group position={groupPosition}>
          <Float floatIntensity={1.2} rotationIntensity={0.15} speed={2}>
            <DeskSetup />

            {/* --- Etiquetas delicadas --- */}
            <FloatingLink
              position={[-2.2, 2.0, 0.5]}
              label="Analista en Sistemas"
              href="#about"
            />
            <FloatingLink
              position={[-2.0, -1.0, 1.0]}
              label="Mañana Lic. en Sistemas"
              href="#education"
            />
            <FloatingLink
              position={[2.4, 1.8, 0.5]}
              label="Skills & Tecnologías"
              href="#about"
            />
            <FloatingLink
              position={[2.2, -1.0, 1.0]}
              label="Proyectos & Experiencia"
              href="#projects"
            />
          </Float>
        </group>
      </PresentationControls>

      <Environment preset="city" />
      <ContactShadows
        position={[isMobile ? 0 : 3, -2.2, 0]}
        opacity={0.3}
        scale={14}
        blur={2.5}
        color="#310F5A"
      />
    </>
  );
}

/* ---------------------------------------------------------------------------
   HERO SCENE — Export principal. El Canvas ocupa el 100% del contenedor
   padre (absolute inset-0 desde hero-section.tsx).
   --------------------------------------------------------------------------- */

export function HeroScene() {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className="absolute inset-0 bg-accent-500/10" />;
  }

  return (
    <div aria-hidden="true" className="pointer-events-auto absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        className="h-full w-full"
        style={{ touchAction: "none" }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
}

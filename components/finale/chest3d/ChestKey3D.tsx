"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import { KEYHOLE_POSITION, type OpeningFrame } from "./chestZoom";

const GOLD = "#e2b54f";
const GOLD_DARK = "#a8781f";
/** Ako ďaleko pred dierkou začína kľúč (keyDepth = 1). */
const KEY_START_DISTANCE = 0.9;

/** Tri zuby brady: [poloha na drieku, výška] – ako tri časti kľúča z kroku 7. */
const TEETH: [number, number][] = [
  [-0.2, 0.075],
  [-0.14, 0.05],
  [-0.08, 0.085],
];

/** Štvorlístok hlavy: krúžky hore, dole, vpredu a vzadu okolo stredu. */
const BOW_LOBES: [number, number][] = [
  [0.075, 0],
  [-0.075, 0],
  [0, 0.075],
  [0, -0.075],
];
const BOW_Z = 0.44;

function GoldMaterial({ color = GOLD }: { color?: string }) {
  return <meshStandardMaterial color={color} roughness={0.25} metalness={0.95} />;
}

/**
 * Zlatý prešporský kľúč (jednoduchý model bez sťahovania): ozdobná hlava,
 * driek s dvoma krúžkami a brada s tromi zubmi. Počiatok je vo vstupe
 * kľúčovej dierky, driek smeruje von (+z). Poloha a otočenie sú v snímke.
 */
export function ChestKey3D({ readOpening }: { readOpening: () => OpeningFrame }) {
  const keyRef = useRef<Group>(null);

  useFrame(() => {
    const frame = readOpening();
    const key = keyRef.current;

    if (!key) {
      return;
    }

    key.visible = frame.keyVisible;
    key.position.set(
      KEYHOLE_POSITION[0],
      KEYHOLE_POSITION[1],
      KEYHOLE_POSITION[2] + frame.keyDepth * KEY_START_DISTANCE
    );
    // Štvrť otáčky v smere hodinových ručičiek (pri pohľade spredu).
    key.rotation.set(0, 0, -frame.keyTurn * (Math.PI / 2));
  });

  return (
    <group ref={keyRef} visible={false}>
      {/* Driek a koniec */}
      <mesh position={[0, 0, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.022, 0.022, 0.56, 16]} />
        <GoldMaterial />
      </mesh>
      <mesh position={[0, 0, -0.24]}>
        <sphereGeometry args={[0.022, 12, 8]} />
        <GoldMaterial />
      </mesh>

      {/* Dva krúžky pri hlave */}
      {[0.24, 0.3].map((z) => (
        <mesh key={z} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.034, 0.034, 0.025, 16]} />
          <GoldMaterial />
        </mesh>
      ))}

      {/* Brada s tromi zubmi */}
      {TEETH.map(([z, height]) => (
        <mesh key={z} position={[0, -0.022 - height / 2, z]}>
          <boxGeometry args={[0.018, height, 0.045]} />
          <GoldMaterial />
        </mesh>
      ))}

      {/* Hlava: štvorlístok s otvormi a stredom s korunkou */}
      <group position={[0, 0, BOW_Z]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.06, 0.03, 24]} />
          <GoldMaterial />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.025, 0.025, 0.042, 16]} />
          <GoldMaterial color={GOLD_DARK} />
        </mesh>
        {BOW_LOBES.map(([y, z]) => (
          <mesh key={`${y}-${z}`} position={[0, y, z]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.04, 0.016, 10, 24]} />
            <GoldMaterial />
          </mesh>
        ))}
      </group>
    </group>
  );
}

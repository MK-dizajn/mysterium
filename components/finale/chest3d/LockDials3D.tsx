"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { CanvasTexture, type Group, SRGBColorSpace } from "three";
import {
  DIAL_AXIS_Z,
  DIAL_CENTER_Y,
  DIAL_RADIUS,
  DIAL_SPACING,
  DIAL_WIDTH,
  getDialStep,
  normalizeDigit,
  stepToward,
} from "./chestZoom";

/** Otočenie kolieska o jednu číslicu. */
const DIGIT_TURN = (Math.PI * 2) / 10;
/** Najdlhší krok jednej snímky – po prepnutí karty prehliadača koliesko neskočí. */
const MAX_FRAME_SECONDS = 0.05;
const CELL_PX = 64;
const TEXTURE_HEIGHT_PX = 96;

/**
 * Obvod kolieska: číslice 0 až 9 dokola, nakreslené systémovým písmom
 * (nič sa nesťahuje). Číslice sú otočené, lebo obvod valca ide zhora dole.
 */
function createDigitTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = CELL_PX * 10;
  canvas.height = TEXTURE_HEIGHT_PX;
  const context = canvas.getContext("2d");

  if (context) {
    context.fillStyle = "#1a120b";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#3d2b17";

    for (let digit = 0; digit <= 10; digit++) {
      context.fillRect(digit * CELL_PX - 1.5, 0, 3, canvas.height);
    }

    context.fillStyle = "#f4e2b8";
    context.font = 'bold 62px Georgia, "Times New Roman", serif';
    context.textAlign = "center";
    context.textBaseline = "middle";

    for (let digit = 0; digit < 10; digit++) {
      context.save();
      context.translate(digit * CELL_PX + CELL_PX / 2, TEXTURE_HEIGHT_PX / 2);
      context.rotate(-Math.PI / 2);
      context.fillText(String(digit), 0, 3);
      context.restore();
    }
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;

  return texture;
}

type LockDials3DProps = {
  digits: number[];
  reducedMotion: boolean;
};

/** Tri kolieska zámku; pri zmene číslice sa plynulo pretočia najkratšou cestou. */
export function LockDials3D({ digits, reducedMotion }: LockDials3DProps) {
  const invalidate = useThree((state) => state.invalidate);
  const texture = useMemo(() => createDigitTexture(), []);
  const wheelRefs = useRef<(Group | null)[]>([]);
  // Otočenie v čísliciach (môže ísť aj za 9 alebo pod 0, aby 9 → 0 išlo o krok).
  const shownRef = useRef<number[]>(digits.map(normalizeDigit));
  const targetRef = useRef<number[]>(digits.map(normalizeDigit));
  const digitsKey = digits.join(",");

  useEffect(() => () => texture.dispose(), [texture]);

  useEffect(() => {
    targetRef.current = digitsKey.split(",").map((digit, index) => {
      const current = targetRef.current[index] ?? 0;

      return current + getDialStep(normalizeDigit(current), Number(digit));
    });
    invalidate();
  }, [digitsKey, invalidate]);

  useFrame((_, delta) => {
    const dtSec = Math.min(delta, MAX_FRAME_SECONDS);
    let isMoving = false;

    shownRef.current = targetRef.current.map((target, index) => {
      const shown = stepToward(
        shownRef.current[index] ?? target,
        target,
        dtSec,
        reducedMotion
      );

      isMoving ||= shown !== target;
      wheelRefs.current[index]?.rotation.set(-shown * DIGIT_TURN, 0, 0);

      return shown;
    });

    if (isMoving) {
      invalidate();
    }
  });

  return (
    <group position={[0, DIAL_CENTER_Y, DIAL_AXIS_Z]}>
      {[-1, 0, 1].map((slot, index) => (
        <group
          key={slot}
          position={[slot * DIAL_SPACING, 0, 0]}
        >
          <group
            ref={(group) => {
              wheelRefs.current[index] = group;
            }}
          >
            {/* Obvod s číslicami (valec s osou do strany) */}
            <mesh rotation={[0, 0, -Math.PI / 2]}>
              <cylinderGeometry
                args={[DIAL_RADIUS, DIAL_RADIUS, DIAL_WIDTH, 40, 1, true, -Math.PI / 10]}
              />
              <meshStandardMaterial
                map={texture}
                emissive="#ffffff"
                emissiveMap={texture}
                emissiveIntensity={0.35}
                roughness={0.55}
                metalness={0.15}
              />
            </mesh>

            {/* Mosadzné boky kolieska */}
            <mesh rotation={[0, 0, -Math.PI / 2]}>
              <cylinderGeometry
                args={[DIAL_RADIUS * 0.97, DIAL_RADIUS * 0.97, DIAL_WIDTH * 1.04, 32]}
              />
              <meshStandardMaterial color="#a96f29" roughness={0.36} metalness={0.82} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
}

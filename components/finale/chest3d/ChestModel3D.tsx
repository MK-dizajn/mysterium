"use client";

import { ContactShadows } from "@react-three/drei";
import { type ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { type ReactNode, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  DoubleSide,
  type Group,
  type InstancedMesh,
  type MeshBasicMaterial,
  type MeshStandardMaterial,
  Object3D,
  type PointLight,
  type Points,
  type PointsMaterial,
  Shape,
  ShapeGeometry,
  type Texture,
} from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { Rivet } from "../../ui/chest-3d/ChestParts";
import { createChestTextures } from "./chestMaterials";
import type { ChestQuality } from "./chestQuality";
import { ChestKey3D } from "./ChestKey3D";
import {
  getLockUnlockFrame,
  getShakeOffset,
  LOCK_CLOSED_FRAME,
  LOCK_OPEN_FRAME,
  type OpeningFrame,
  SHAKE_SEC,
} from "./chestZoom";
import { LockDials3D } from "./LockDials3D";
import { PhotoFragment3D } from "./PhotoFragment3D";

export type ChestLockState = "closed" | "next" | "open";

/** Poloha a natočenie zámkov: I ľavý bok, II vpredu nad dierkou, III pravý bok. */
export const LOCK_PLACEMENTS: {
  position: [number, number, number];
  rotationY: number;
}[] = [
  { position: [-1.73, -0.28, 0], rotationY: -Math.PI / 2 },
  { position: [0, 0.02, 1.1], rotationY: 0 },
  { position: [1.73, -0.28, 0], rotationY: Math.PI / 2 },
];

/** Kde je štítok zámku (kúsok nad zámkom a pred ním, v súradniciach zámku). */
export const LOCK_LABEL_OFFSET: [number, number, number] = [0, 0.86, 0.12];

const BRASS_LIGHT = "#d6a451";

/** Pri ťahaní nemá ťuknutie na zámok vybrať zámok. */
const CLICK_SLOP_PX = 6;
/** Oblúk zámku: zasunutý a po odomknutí vysunutý hore. */
const SHACKLE_CLOSED_Y = 0.14;
const SHACKLE_OPEN_Y = 0.27;
/** Ramená oblúka: dlhé (os otáčania) vľavo, krátke vpravo. */
const SHACKLE_RADIUS = 0.15;
const LONG_LEG = 0.2;
const SHORT_LEG = 0.09;
/** Otočenie oblúka nabok (pol otáčky – na konci leží v rovine zámku, netrčí z truhlice) a naklonenie visiaceho zámku. */
const SHACKLE_SWING_RAD = -Math.PI;
const LOCK_TILT_RAD = 0.14;
/** Zámok visí z hornej hrany (os naklonenia). */
const LOCK_HANG_Y = 0.32;
/** Zlatý odlesk po tele odomknutého zámku (teplá farba, nie zelená). */
const LOCK_GLINT_COLOR = "#ffcf70";
const MAX_FRAME_SECONDS = 0.05;

function Lock3D({
  state,
  isSelected,
  onSelect,
  digits,
  shakeKey,
  reducedMotion,
  unlockStartedAt,
  brass,
}: {
  state: ChestLockState;
  isSelected: boolean;
  onSelect: () => void;
  digits: number[];
  /** Zvýšenie spustí krátke zatrasenie (pri vypnutých animáciách sa nemení). */
  shakeKey: number;
  reducedMotion: boolean;
  /** Kedy sa začalo otváranie zámku (performance.now); null = bez animácie. */
  unlockStartedAt: number | null;
  /** Lesk mosadze podľa verzie truhlice. */
  brass: { metalness: number; roughness: number };
}) {
  const invalidate = useThree((three) => three.invalidate);
  const shakeRef = useRef<Group>(null);
  const hangRef = useRef<Group>(null);
  const bodyGroupRef = useRef<Group>(null);
  const shackleRef = useRef<Group>(null);
  const bodyMaterialRef = useRef<MeshStandardMaterial>(null);
  const indicatorRef = useRef<MeshStandardMaterial>(null);
  const settleRef = useRef<readonly number[]>([0, 0, 0]);
  const shakeStartRef = useRef<number | null>(null);
  const body = useRoundedBox(0.5, 0.44, 0.17, 0.05);
  const plate = useRoundedBox(0.66, 0.76, 0.06, 0.03);
  const isAnimating = unlockStartedAt !== null && !reducedMotion;

  useEffect(() => {
    invalidate();
  }, [state, unlockStartedAt, invalidate]);

  useEffect(() => {
    if (shakeKey === 0) {
      return;
    }

    shakeStartRef.current = performance.now();
    invalidate();
  }, [shakeKey, invalidate]);

  useFrame(() => {
    // Stav zámku v snímke: zatvorený, práve sa otvára, alebo otvorený (aj po F5).
    const frame =
      state !== "open"
        ? LOCK_CLOSED_FRAME
        : isAnimating
          ? getLockUnlockFrame((performance.now() - (unlockStartedAt ?? 0)) / 1000)
          : LOCK_OPEN_FRAME;
    const isMoving = isAnimating && frame !== LOCK_OPEN_FRAME;

    settleRef.current = frame.dialSettle;
    hangRef.current?.rotation.set(0, 0, frame.tilt * LOCK_TILT_RAD);
    bodyGroupRef.current?.position.set(0, -LOCK_HANG_Y - frame.jolt * 0.018, 0);

    const lift = SHACKLE_CLOSED_Y + (SHACKLE_OPEN_Y - SHACKLE_CLOSED_Y) * frame.shackleLift;
    shackleRef.current?.position.set(-SHACKLE_RADIUS, lift, 0.09);
    shackleRef.current?.rotation.set(0, frame.shackleSwing * SHACKLE_SWING_RAD, 0);

    bodyMaterialRef.current?.setValues({ emissiveIntensity: frame.glint * 0.85 });
    indicatorRef.current?.setValues({ emissiveIntensity: 0.15 + frame.indicator * 1.1 });

    let shake = 0;

    if (shakeStartRef.current !== null) {
      const elapsedSec = Math.min(
        (performance.now() - shakeStartRef.current) / 1000,
        SHAKE_SEC + MAX_FRAME_SECONDS
      );
      shake = getShakeOffset(elapsedSec);

      if (elapsedSec >= SHAKE_SEC) {
        shakeStartRef.current = null;
      }
    }

    shakeRef.current?.position.set(shake, 0, 0);

    if (isMoving || shakeStartRef.current !== null) {
      invalidate();
    }
  });

  // Zámok na rade jemne svieti; inak bez svitu (zlatý odlesk iba pri otvorení).
  const highlight =
    state === "next"
      ? { emissive: "#ffb347", emissiveIntensity: 0.45 }
      : { emissive: LOCK_GLINT_COLOR, emissiveIntensity: 0 };

  function handleClick(event: ThreeEvent<MouseEvent>) {
    if (event.delta > CLICK_SLOP_PX) {
      return;
    }

    event.stopPropagation();
    onSelect();
  }

  // Kolieska: zatvorený zámok a počas otvárania; odomknutý ich už neukazuje (ani po F5).
  const showDials = state !== "open" || isAnimating;

  return (
    <group ref={shakeRef} onClick={handleClick}>
      {/* Platnička zámku na truhlici */}
      <mesh geometry={plate}>
        <meshStandardMaterial color="#6b4417" roughness={0.45} metalness={0.75} />
      </mesh>

      {/* Tenký zlatý rámik pri vybranom zámku (zámok ostane dobre vidieť). */}
      {isSelected &&
        (
          [
            [0, 0.415, 0.76, 0.03],
            [0, -0.415, 0.76, 0.03],
            [-0.365, 0, 0.03, 0.86],
            [0.365, 0, 0.03, 0.86],
          ] as const
        ).map(([x, y, width, height]) => (
          <mesh key={`${x}-${y}`} position={[x, y, 0.04]}>
            <boxGeometry args={[width, height, 0.03]} />
            <meshStandardMaterial
              color="#fff1c2"
              emissive="#ffd27a"
              emissiveIntensity={0.8}
              roughness={0.3}
              metalness={0.4}
            />
          </mesh>
        ))}

      {/* Visiaci zámok: nakloní sa okolo hornej hrany. */}
      <group ref={hangRef} position={[0, LOCK_HANG_Y, 0]}>
        <group ref={bodyGroupRef} position={[0, -LOCK_HANG_Y, 0]}>
          {/* Mosadzné telo so zaoblenými hranami (pri otvorení zlatý odlesk) */}
          <mesh geometry={body} position={[0, -0.08, 0.09]}>
            <meshStandardMaterial
              ref={bodyMaterialRef}
              color="#c8953f"
              {...brass}
              {...highlight}
            />
          </mesh>

          {/* Ryska vedľa koliesok: pri zapadnutí sa rozžiari zlatou. */}
          {[-1, 1].map((side) => (
            <mesh key={side} position={[side * 0.215, -0.06, 0.18]}>
              <boxGeometry args={[0.016, 0.07, 0.01]} />
              <meshStandardMaterial
                ref={side === 1 ? indicatorRef : undefined}
                color="#f3d27a"
                emissive={LOCK_GLINT_COLOR}
                emissiveIntensity={0.15}
                roughness={0.3}
                metalness={0.6}
              />
            </mesh>
          ))}

          {showDials && (
            <LockDials3D
              digits={digits}
              reducedMotion={reducedMotion}
              readSettle={() => settleRef.current}
            />
          )}

          {/* Oblúk: pružina ho vysunie, potom sa otočí nabok okolo dlhého ramena. */}
          <group ref={shackleRef} position={[-SHACKLE_RADIUS, SHACKLE_CLOSED_Y, 0.09]}>
            <group position={[SHACKLE_RADIUS, 0, 0]}>
              <mesh>
                <torusGeometry args={[SHACKLE_RADIUS, 0.035, 12, 24, Math.PI]} />
                <meshStandardMaterial color={BRASS_LIGHT} {...brass} />
              </mesh>
              <mesh position={[-SHACKLE_RADIUS, -LONG_LEG / 2, 0]}>
                <cylinderGeometry args={[0.035, 0.035, LONG_LEG, 12]} />
                <meshStandardMaterial color={BRASS_LIGHT} {...brass} />
              </mesh>
              <mesh position={[SHACKLE_RADIUS, -SHORT_LEG / 2, 0]}>
                <cylinderGeometry args={[0.035, 0.035, SHORT_LEG, 12]} />
                <meshStandardMaterial color={BRASS_LIGHT} {...brass} />
              </mesh>
            </group>
          </group>
        </group>
      </group>

      <Rivet position={[-0.25, 0.3, 0.04]} scale={0.6} />
      <Rivet position={[0.25, 0.3, 0.04]} scale={0.6} />
      <Rivet position={[-0.25, -0.3, 0.04]} scale={0.6} />
      <Rivet position={[0.25, -0.3, 0.04]} scale={0.6} />
    </group>
  );
}

/* ===== Vzhľad tela truhlice (úprava 4, krok T1) ===== */

type Vec3 = [number, number, number];

/** Rozmery tela (rovnaké ako pôvodný kváder, aby sedeli zámky a kľúč). */
const BODY = { width: 3.34, height: 1.52, depth: 1.96, y: -0.27 };
/** Viditeľná predná plocha medzi lištami (pre pásy a nity). */
const STRAP_BOTTOM = -0.795;
const STRAP_TOP = 0.32;
const STRAP_X = 0.95;
const SIDE_STRAP_Z = 0.62;

/** Mosadzné rohové kovanie: 8 rohov tela (hore pri lište a dole). */
const BRASS_CORNERS: Vec3[] = [-1.66, 1.66].flatMap((x) =>
  [-0.96, 0.96].flatMap((z) => [
    [x, 0.39, z] as Vec3,
    [x, -0.93, z] as Vec3,
  ])
);
/** Rohy veka (v súradniciach veka). */
const LID_CORNERS: Vec3[] = [-1.66, 1.66].flatMap((x) =>
  [0.08, 2.0].map((z) => [x, 0.22, z] as Vec3)
);

/** Nity na železných pásoch tela: vpredu, vzadu a po bokoch. */
const BODY_RIVETS: Vec3[] = (() => {
  const ys = [-0.7, -0.46, -0.22, 0.02, 0.26];
  const points: Vec3[] = [];

  for (const y of ys) {
    for (const x of [-STRAP_X, STRAP_X]) {
      points.push([x, y, 1.0], [x, y, -1.0]);
    }

    for (const z of [-SIDE_STRAP_Z, SIDE_STRAP_Z]) {
      points.push([1.69, y, z], [-1.69, y, z]);
    }
  }

  return points;
})();

/** Nity na pásoch veka (vrch a predná hrana). */
const LID_RIVETS: Vec3[] = (() => {
  const points: Vec3[] = [];

  for (const x of [-STRAP_X, STRAP_X]) {
    for (const z of [0.25, 0.6, 0.95, 1.3, 1.65]) {
      points.push([x, 0.44, z]);
    }

    points.push([x, 0.1, 2.1], [x, 0.3, 2.1]);
  }

  return points;
})();

/** Rovnaké diely naraz (jedno kreslenie pre všetky nity alebo rohy). */
function InstancedParts({
  positions,
  children,
}: {
  positions: Vec3[];
  children: ReactNode;
}) {
  const meshRef = useRef<InstancedMesh>(null);

  useLayoutEffect(() => {
    const mesh = meshRef.current;

    if (!mesh) {
      return;
    }

    const dummy = new Object3D();
    positions.forEach((position, index) => {
      dummy.position.set(...position);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [positions]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, positions.length]}>
      {children}
    </instancedMesh>
  );
}

type ChestLooks = {
  woodBody: Texture;
  woodRim: Texture;
  woodLid: Texture;
  woodBump: Texture;
  iron: Texture;
  emblem: Texture;
  engraving: Texture;
  engravingStrip: Texture;
  velvet: Texture;
  beam: Texture;
  dustSprite: Texture;
  /** Mosadz: s odleskami okolia lesklejšia, bez nich matnejšia (aby nebola čierna). */
  brass: { metalness: number; roughness: number };
};

function useChestLooks(quality: ChestQuality): ChestLooks {
  const textures = useMemo(() => createChestTextures(), []);

  useEffect(() => () => textures.dispose(), [textures]);

  return useMemo(
    () => ({
      woodBody: textures.woodVariant(1, 1),
      // Lišta je jedna doska: výrez z jednej dosky textúry.
      woodRim: textures.woodVariant(1, 0.18, 0.01),
      woodLid: textures.woodVariant(1, 1),
      woodBump: textures.woodBump,
      iron: textures.iron,
      emblem: textures.emblem,
      engraving: textures.engraving,
      engravingStrip: textures.engravingStrip,
      velvet: textures.velvet,
      beam: textures.beam,
      dustSprite: textures.dustSprite,
      brass:
        quality === "full"
          ? { metalness: 0.92, roughness: 0.3 }
          : { metalness: 0.55, roughness: 0.42 },
    }),
    [textures, quality]
  );
}

/** Zaoblený kváder (textúra na každej stene od kraja po kraj – ošúchané hrany sedia). */
function useRoundedBox(width: number, height: number, depth: number, radius: number) {
  const geometry = useMemo(
    () => new RoundedBoxGeometry(width, height, depth, 2, radius),
    [width, height, depth, radius]
  );

  useEffect(() => () => geometry.dispose(), [geometry]);

  return geometry;
}

const BUMP_SCALE = 1.4;

function WoodMaterial({ map, bump, tint = "#ffffff" }: { map: Texture; bump: Texture; tint?: string }) {
  return (
    <meshStandardMaterial
      map={map}
      bumpMap={bump}
      bumpScale={BUMP_SCALE}
      color={tint}
      roughness={0.82}
      metalness={0.04}
    />
  );
}

function BrassMaterial({ looks }: { looks: ChestLooks }) {
  return <meshStandardMaterial color="#c8953f" {...looks.brass} />;
}

/** Mosadzné rohy s rytinou (lem, lístok, hviezdička) – farba aj reliéf. */
function CornerMaterial({ looks }: { looks: ChestLooks }) {
  return (
    <meshStandardMaterial
      map={looks.engraving}
      bumpMap={looks.engraving}
      bumpScale={0.9}
      {...looks.brass}
    />
  );
}

/* ===== Duté telo (krok T3): zvonka rovnaké ako plný kváder, vnútri zamat ===== */

const WALL = 0.1;
/** Steny tela (zvonka presne obrys pôvodného kvádra). */
const CHEST_WALLS: { size: Vec3; position: Vec3 }[] = [
  { size: [BODY.width, BODY.height, WALL], position: [0, BODY.y, BODY.depth / 2 - WALL / 2] },
  { size: [BODY.width, BODY.height, WALL], position: [0, BODY.y, -(BODY.depth / 2 - WALL / 2)] },
  { size: [WALL, BODY.height, BODY.depth - 2 * WALL], position: [-(BODY.width / 2 - WALL / 2), BODY.y, 0] },
  { size: [WALL, BODY.height, BODY.depth - 2 * WALL], position: [BODY.width / 2 - WALL / 2, BODY.y, 0] },
];
/** Vnútro: dno (vrch plného spodku) a polovičné rozmery otvoru. */
const INTERIOR = {
  floorY: 0,
  halfX: BODY.width / 2 - WALL,
  halfZ: BODY.depth / 2 - WALL,
  /** Kde začína drevená lišta (zamat na stenách je pod ňou). */
  rimBottomY: 0.32,
};
/** Horná lišta po obvode (vnútro ostáva otvorené). */
const RIM_PIECES: { size: Vec3; position: Vec3 }[] = [
  { size: [3.48, 0.22, 0.2], position: [0, 0.43, 0.94] },
  { size: [3.48, 0.22, 0.2], position: [0, 0.43, -0.94] },
  { size: [0.2, 0.22, 1.68], position: [-1.64, 0.43, 0] },
  { size: [0.2, 0.22, 1.68], position: [1.64, 0.43, 0] },
];

function RoundedPart({ size, position, children }: { size: Vec3; position: Vec3; children: ReactNode }) {
  const geometry = useRoundedBox(size[0], size[1], size[2], Math.min(0.04, Math.min(...size) / 2.5));

  return (
    <mesh geometry={geometry} position={position}>
      {children}
    </mesh>
  );
}

/** Zaoblený obdĺžnik (lôžko útržku, rám zamatu vo veku) ako plochý tvar. */
function useRoundedRectShape(width: number, height: number, radius: number, hole?: { width: number; height: number }) {
  const geometry = useMemo(() => {
    const roundedRect = (w: number, h: number, r: number) => {
      const shape = new Shape();
      const x = -w / 2;
      const y = -h / 2;
      shape.moveTo(x + r, y);
      shape.lineTo(x + w - r, y);
      shape.quadraticCurveTo(x + w, y, x + w, y + r);
      shape.lineTo(x + w, y + h - r);
      shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      shape.lineTo(x + r, y + h);
      shape.quadraticCurveTo(x, y + h, x, y + h - r);
      shape.lineTo(x, y + r);
      shape.quadraticCurveTo(x, y, x + r, y);

      return shape;
    };
    const shape = roundedRect(width, height, radius);

    if (hole) {
      shape.holes.push(roundedRect(hole.width, hole.height, radius * 0.6));
    }

    return new ShapeGeometry(shape, 6);
  }, [width, height, radius, hole]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return geometry;
}

const FRAGMENT_BED = { width: 1.3, height: 0.95 };
const LID_FRAME_HOLE = { width: 3.2, height: 1.8 };

/** Zamatové vnútro: dno, steny pod lištou a lôžko, z ktorého vystúpi útržok. */
function VelvetInterior({ looks }: { looks: ChestLooks }) {
  const fragmentBed = useRoundedRectShape(FRAGMENT_BED.width, FRAGMENT_BED.height, 0.12);
  const wallHeight = INTERIOR.rimBottomY - INTERIOR.floorY;
  const wallY = INTERIOR.floorY + wallHeight / 2;
  const { halfX, halfZ } = INTERIOR;
  const walls: { size: [number, number]; position: Vec3; rotationY: number }[] = [
    { size: [halfX * 2, wallHeight], position: [0, wallY, halfZ - 0.001], rotationY: Math.PI },
    { size: [halfX * 2, wallHeight], position: [0, wallY, -halfZ + 0.001], rotationY: 0 },
    { size: [halfZ * 2, wallHeight], position: [-halfX + 0.001, wallY, 0], rotationY: Math.PI / 2 },
    { size: [halfZ * 2, wallHeight], position: [halfX - 0.001, wallY, 0], rotationY: -Math.PI / 2 },
  ];

  return (
    <group>
      <mesh position={[0, INTERIOR.floorY + 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[halfX * 2, halfZ * 2]} />
        <meshStandardMaterial map={looks.velvet} color="#a87a7e" roughness={1} metalness={0} />
      </mesh>
      {walls.map((wall) => (
        <mesh key={`${wall.position.join(",")}`} position={wall.position} rotation={[0, wall.rotationY, 0]}>
          <planeGeometry args={wall.size} />
          <meshStandardMaterial map={looks.velvet} color="#8a5c62" roughness={1} metalness={0} />
        </mesh>
      ))}
      {/* fragmentBed: vytlačené lôžko pre útržok (tmavší zamat). */}
      <mesh geometry={fragmentBed} position={[0, INTERIOR.floorY + 0.008, 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial map={looks.velvet} color="#5e3a40" roughness={1} metalness={0} />
      </mesh>
    </group>
  );
}

/** Očká na tele, v ktorých sú zachytené spony (HASP_STAPLES). */
const HASP_STAPLES: Vec3[] = [
  [-STRAP_X, 0.3, 1.02],
  [STRAP_X, 0.3, 1.02],
];

function HaspStaples() {
  return (
    <>
      {HASP_STAPLES.map((position) => (
        <mesh key={position.join(",")} position={position}>
          <torusGeometry args={[0.045, 0.012, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#3a3632" roughness={0.6} metalness={0.7} />
        </mesh>
      ))}
    </>
  );
}

/** Telo: duté drevo z dosiek, lišty, železné pásy, mosadzné rohy s rytinou a nity. */
function ChestBody3D({ looks }: { looks: ChestLooks }) {
  const bottomRim = useRoundedBox(3.48, 0.25, 2.08, 0.05);
  const corner = useRoundedBox(0.24, 0.28, 0.24, 0.035);
  const strapHeight = STRAP_TOP - STRAP_BOTTOM;
  const strapY = (STRAP_TOP + STRAP_BOTTOM) / 2;
  const floorHeight = INTERIOR.floorY - (BODY.y - BODY.height / 2);

  return (
    <group>
      {/* Steny (zvonka ako pôvodný kváder) a plný spodok pod dnom. */}
      {CHEST_WALLS.map((wall) => (
        <RoundedPart key={wall.position.join(",")} size={wall.size} position={wall.position}>
          <WoodMaterial map={looks.woodBody} bump={looks.woodBump} />
        </RoundedPart>
      ))}
      <mesh position={[0, INTERIOR.floorY - floorHeight / 2, 0]}>
        <boxGeometry args={[INTERIOR.halfX * 2, floorHeight, INTERIOR.halfZ * 2]} />
        <meshStandardMaterial color="#2a170b" roughness={0.9} />
      </mesh>
      {RIM_PIECES.map((rim) => (
        <RoundedPart key={rim.position.join(",")} size={rim.size} position={rim.position}>
          <WoodMaterial map={looks.woodRim} bump={looks.woodBump} tint="#c9a27e" />
        </RoundedPart>
      ))}
      <VelvetInterior looks={looks} />
      <HaspStaples />
      <mesh geometry={bottomRim} position={[0, -0.92, 0]}>
        <WoodMaterial map={looks.woodRim} bump={looks.woodBump} tint="#b48c69" />
      </mesh>

      {/* Železné pásy vpredu, vzadu a po bokoch. */}
      {[-STRAP_X, STRAP_X].flatMap((x) =>
        [-0.993, 0.993].map((z) => (
          <mesh key={`strap-${x}-${z}`} position={[x, strapY, z]}>
            <boxGeometry args={[0.16, strapHeight, 0.025]} />
            <meshStandardMaterial map={looks.iron} bumpMap={looks.iron} bumpScale={0.8} roughness={0.68} metalness={0.6} />
          </mesh>
        ))
      )}
      {[-SIDE_STRAP_Z, SIDE_STRAP_Z].flatMap((z) =>
        [-1.683, 1.683].map((x) => (
          <mesh key={`side-strap-${x}-${z}`} position={[x, strapY, z]}>
            <boxGeometry args={[0.025, strapHeight, 0.16]} />
            <meshStandardMaterial map={looks.iron} bumpMap={looks.iron} bumpScale={0.8} roughness={0.68} metalness={0.6} />
          </mesh>
        ))
      )}

      {/* Mosadzné rohy s rytinou (jedno kreslenie) a nity (jedno kreslenie). */}
      <InstancedParts positions={BRASS_CORNERS}>
        <primitive object={corner} attach="geometry" />
        <CornerMaterial looks={looks} />
      </InstancedParts>
      <InstancedParts positions={BODY_RIVETS}>
        <sphereGeometry args={[0.04, 10, 6]} />
        <BrassMaterial looks={looks} />
      </InstancedParts>
    </group>
  );
}

/** Veko sa otáča okolo zadnej hornej hrany; uhol podľa priebehu otvárania. */
const LID_OPEN_ANGLE = -1.25;

function ChestLid3D({
  readOpening,
  looks,
  readHasps,
}: {
  readOpening: () => OpeningFrame;
  looks: ChestLooks;
  readHasps: () => number;
}) {
  const lidRef = useRef<Group>(null);
  const haspRefs = useRef<(Group | null)[]>([]);
  const invalidate = useThree((state) => state.invalidate);
  const lid = useRoundedBox(3.48, 0.42, 2.08, 0.06);
  const corner = useRoundedBox(0.24, 0.36, 0.24, 0.04);

  useFrame(() => {
    lidRef.current?.rotation.set(readOpening().lid * LID_OPEN_ANGLE, 0, 0);

    // Spony sa po treťom zámku odklopia hore a do strany.
    const release = readHasps();
    HASPS.forEach((hasp, index) => {
      haspRefs.current[index]?.rotation.set(
        release * HASP_SWING_RAD,
        0,
        hasp.side * release * HASP_TWIST_RAD
      );
    });

    if (release > 0 && release < 1) {
      invalidate();
    }
  });

  return (
    <group ref={lidRef} position={[0, 0.54, -1.04]}>
      <mesh geometry={lid} position={[0, 0.21, 1.04]}>
        <WoodMaterial map={looks.woodLid} bump={looks.woodBump} tint="#d8b28c" />
      </mesh>

      {/* Železné pásy cez vrch veka a jeho prednú hranu. */}
      {[-STRAP_X, STRAP_X].map((x) => (
        <group key={`lid-strap-${x}`}>
          <mesh position={[x, 0.428, 1.04]}>
            <boxGeometry args={[0.16, 0.025, 2.1]} />
            <meshStandardMaterial map={looks.iron} bumpMap={looks.iron} bumpScale={0.8} roughness={0.68} metalness={0.6} />
          </mesh>
          <mesh position={[x, 0.21, 2.088]}>
            <boxGeometry args={[0.16, 0.42, 0.025]} />
            <meshStandardMaterial map={looks.iron} bumpMap={looks.iron} bumpScale={0.8} roughness={0.68} metalness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Mosadzná lišta pod vekom vpredu s opakovaným ornamentom, rohy s rytinou a nity veka. */}
      <mesh position={[0, 0.03, 2.1]}>
        <boxGeometry args={[3.5, 0.08, 0.06]} />
        <meshStandardMaterial
          map={looks.engravingStrip}
          bumpMap={looks.engravingStrip}
          bumpScale={0.8}
          {...looks.brass}
        />
      </mesh>
      <InstancedParts positions={LID_CORNERS}>
        <primitive object={corner} attach="geometry" />
        <CornerMaterial looks={looks} />
      </InstancedParts>
      <InstancedParts positions={LID_RIVETS}>
        <sphereGeometry args={[0.04, 10, 6]} />
        <BrassMaterial looks={looks} />
      </InstancedParts>

      {/* Železné spony: pokračujú z pásov veka a sú zachytené v očkách na tele. */}
      {HASPS.map((hasp, index) => (
        <group
          key={hasp.side}
          ref={(group) => {
            haspRefs.current[index] = group;
          }}
          position={[hasp.side * STRAP_X, 0.02, 2.115]}
        >
          <mesh position={[0, -0.15, 0]}>
            <boxGeometry args={[0.16, 0.3, 0.025]} />
            <meshStandardMaterial map={looks.iron} bumpMap={looks.iron} bumpScale={0.8} roughness={0.68} metalness={0.6} />
          </mesh>
          <mesh position={[0, -0.26, 0.012]}>
            <boxGeometry args={[0.06, 0.04, 0.01]} />
            <meshStandardMaterial color="#0d0b09" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Znak hry: veľký medailón na vrchu veka, malý vpredu. */}
      <ChestEmblem3D {...LID_TOP_EMBLEM} faceUp looks={looks} />
      <ChestEmblem3D {...LID_FRONT_EMBLEM} looks={looks} />

      {/* lidVelvet: vnútorná strana veka – zamat v mosadznom ráme (vidno po otvorení). */}
      <LidVelvet looks={looks} />
    </group>
  );
}

/** Železné spony (krok T4): na oboch pásoch veka; po treťom zámku sa odklopia. */
const HASPS = [{ side: -1 }, { side: 1 }] as const;
const HASP_SWING_RAD = -2.0;
const HASP_TWIST_RAD = 0.35;

/** Medailóny so znakom hry (v súradniciach veka). */
const LID_TOP_EMBLEM = { position: [0, 0.445, 1.04] as Vec3, radius: 0.34 };
const LID_FRONT_EMBLEM = { position: [0, 0.21, 2.1] as Vec3, radius: 0.17 };

/**
 * Mosadzný medailón so znakom hry (M v kruhu s kompasovou ružicou):
 * okraj (prstenec), bok kotúča a čelo s farbou aj reliéfom z textúry znaku.
 */
function ChestEmblem3D({
  position,
  radius,
  faceUp = false,
  looks,
}: {
  position: Vec3;
  radius: number;
  faceUp?: boolean;
  looks: ChestLooks;
}) {
  // Čelo kruhu je v rovine XY (pozerá dopredu); na veku sa sklopí nahor
  // tak, aby M stálo rovno pri pohľade spredu.
  const rotation: Vec3 = faceUp ? [-Math.PI / 2, 0, 0] : [0, 0, 0];

  return (
    <group position={position} rotation={rotation}>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.012]}>
        <cylinderGeometry args={[radius, radius, 0.03, 48, 1, true]} />
        <BrassMaterial looks={looks} />
      </mesh>
      <mesh position={[0, 0, 0.004]}>
        <circleGeometry args={[radius, 48]} />
        <meshStandardMaterial
          map={looks.emblem}
          bumpMap={looks.emblem}
          bumpScale={1.6}
          {...looks.brass}
        />
      </mesh>
      <mesh position={[0, 0, 0.006]}>
        <torusGeometry args={[radius, radius * 0.07, 10, 48]} />
        <BrassMaterial looks={looks} />
      </mesh>
    </group>
  );
}

/** Zamat na vnútornej strane veka v mosadznom ráme (ako truhlička v scéne 9). */
function LidVelvet({ looks }: { looks: ChestLooks }) {
  const frame = useRoundedRectShape(3.34, 1.94, 0.08, LID_FRAME_HOLE);

  return (
    <group position={[0, -0.004, 1.04]} rotation={[Math.PI / 2, 0, 0]}>
      <mesh>
        <planeGeometry args={[LID_FRAME_HOLE.width, LID_FRAME_HOLE.height]} />
        <meshStandardMaterial map={looks.velvet} color="#9a6a70" roughness={1} metalness={0} />
      </mesh>
      <mesh geometry={frame} position={[0, 0, 0.002]}>
        <BrassMaterial looks={looks} />
      </mesh>
    </group>
  );
}

/** Svetlo dna leží tesne nad zamatom, aby ho nezakrylo. */
const GLOW_FLOOR_Y = 0.02;
/**
 * Krok T4: teplé zlaté (jantárové) svetlo s polovičnou silou, nízko vo
 * vnútri – osvetľuje útržok a okraj truhlice, zamat nezružovie.
 */
const GLOW_LIGHT_COLOR = "#ffb347";
const GLOW_LIGHT_INTENSITY = 3;
/** Prach v lúči: zrnká (jedno kreslenie), iba v plnej verzii počas otvárania. */
const DUST_COUNT = 40;

/** Pevná náhoda pre polohy prachu. */
function seeded(index: number, salt: number) {
  const x = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;

  return x - Math.floor(x);
}

/** Prach, ktorý pomaly stúpa a víri v lúči; na konci otvárania dosadne a zmizne. */
function ChestDust({ readOpening, sprite }: { readOpening: () => OpeningFrame; sprite: Texture }) {
  const pointsRef = useRef<Points>(null);
  const materialRef = useRef<PointsMaterial>(null);
  const seeds = useMemo(
    () =>
      Array.from({ length: DUST_COUNT }, (_, index) => ({
        x: (seeded(index, 1) - 0.5) * 2.4,
        y: 0.1 + seeded(index, 2) * 0.5,
        z: (seeded(index, 3) - 0.5) * 1.2,
        speed: 0.6 + seeded(index, 4) * 0.8,
        phase: seeded(index, 5) * Math.PI * 2,
      })),
    []
  );
  const positions = useMemo(() => new Float32Array(DUST_COUNT * 3), []);

  useFrame(() => {
    const { dust } = readOpening();
    const points = pointsRef.current;

    if (!points) {
      return;
    }

    points.visible = dust > 0;

    if (dust <= 0) {
      return;
    }

    seeds.forEach((seed, index) => {
      positions[index * 3] = seed.x + Math.sin(dust * 6 + seed.phase) * 0.08;
      positions[index * 3 + 1] = seed.y + dust * 1.6 * seed.speed;
      positions[index * 3 + 2] = seed.z + Math.cos(dust * 5 + seed.phase) * 0.06;
    });
    points.geometry.attributes.position.needsUpdate = true;
    // Zjaví sa a na konci sa stratí.
    const envelope = Math.min(1, dust / 0.15) * Math.min(1, (1 - dust) / 0.25);
    materialRef.current?.setValues({ opacity: 0.85 * envelope });
  });

  return (
    <points ref={pointsRef} visible={false} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        map={sprite}
        color="#ffe2a0"
        size={0.06}
        sizeAttenuation
        transparent
        opacity={0}
        depthWrite={false}
        blending={AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}

/**
 * Svetlo z otvorenej truhlice: prúžok svetla zo škáry pri pootvorení veka,
 * teplé zlaté svetlo a prežiarené dno, kužeľový lúč, ktorý sa stráca,
 * a prach (iba plná verzia, nie pri vypnutých animáciách).
 */
function ChestGlow3D({
  readOpening,
  looks,
  quality,
  reducedMotion,
}: {
  readOpening: () => OpeningFrame;
  looks: ChestLooks;
  quality: ChestQuality;
  reducedMotion: boolean;
}) {
  const groupRef = useRef<Group>(null);
  const floorRef = useRef<MeshBasicMaterial>(null);
  const beamRef = useRef<MeshBasicMaterial>(null);
  const crackRef = useRef<MeshBasicMaterial>(null);
  const lightRef = useRef<PointLight>(null);

  useFrame(() => {
    const { light, beam, crack, lid } = readOpening();

    if (groupRef.current) {
      groupRef.current.visible = light > 0 || crack > 0;
    }

    // Prúžok zo škáry: iba kým je veko len pootvorené.
    const slit = crack > 0 ? Math.max(0, 1 - (lid - 0.08) / 0.25) * Math.min(1, crack * 3) : 0;
    crackRef.current?.setValues({ opacity: 0.9 * slit });
    // Zamat ostáva bordový: svetlo dno iba jemne prežiari.
    floorRef.current?.setValues({ opacity: 0.25 * light });
    beamRef.current?.setValues({ opacity: 0.3 * beam });

    if (lightRef.current) {
      lightRef.current.intensity = GLOW_LIGHT_INTENSITY * light;
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      <mesh position={[0, 0.56, 1.06]}>
        <planeGeometry args={[3.2, 0.05]} />
        <meshBasicMaterial
          ref={crackRef}
          color="#ffd28a"
          transparent
          opacity={0}
          blending={AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, GLOW_FLOOR_Y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[INTERIOR.halfX * 2, INTERIOR.halfZ * 2]} />
        <meshBasicMaterial
          ref={floorRef}
          color={GLOW_LIGHT_COLOR}
          transparent
          opacity={0}
          blending={AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      {/* beamTexture: kužeľ dole jasný, hore sa stráca, mäkké boky. */}
      <mesh position={[0, 1.65, 0]}>
        <cylinderGeometry args={[1.55, 1.05, 2.2, 32, 1, true]} />
        <meshBasicMaterial
          ref={beamRef}
          map={looks.beam}
          color="#ffd08a"
          transparent
          opacity={0}
          blending={AdditiveBlending}
          depthWrite={false}
          side={DoubleSide}
          toneMapped={false}
        />
      </mesh>
      <pointLight
        ref={lightRef}
        position={[0, 0.45, 0.25]}
        color={GLOW_LIGHT_COLOR}
        intensity={0}
        distance={3.5}
      />
      {quality === "full" && !reducedMotion && (
        <ChestDust readOpening={readOpening} sprite={looks.dustSprite} />
      )}
    </group>
  );
}

type ChestModel3DProps = {
  lockStates: ChestLockState[];
  /** Číslice na kolieskach každého zámku. */
  lockDigits: number[][];
  /** Počítadlo zatrasení každého zámku (zlý kód). */
  shakeKeys: number[];
  selectedIndex: number | null;
  onSelectLock: (index: number) => void;
  /** Priebeh vkladania kľúča a otvárania veka (číta sa v snímke). */
  readOpening: () => OpeningFrame;
  /** Historická fotografia z dát a ktorý útržok je v truhlici. */
  fragmentImageSrc: string | undefined;
  fragmentPieceIndex: number;
  reducedMotion: boolean;
  /** Plná alebo ľahká verzia (mosadz bez odleskov okolia je matnejšia). */
  quality: ChestQuality;
  /** Kedy sa začalo otváranie každého zámku (null = bez animácie). */
  lockUnlockStarts: (number | null)[];
  /** Povolenie železných spôn 0 (zachytené) až 1 (odklopené) – číta sa v snímke. */
  readHasps: () => number;
};

/**
 * Odľahčená truhlica vo finále (vzhľad z pôvodného modelu, bez tieňov):
 * zámok I na ľavom boku, II vpredu nad kľúčovou dierkou, III na pravom boku.
 */
export function ChestModel3D({
  lockStates,
  lockDigits,
  shakeKeys,
  selectedIndex,
  onSelectLock,
  readOpening,
  fragmentImageSrc,
  fragmentPieceIndex,
  reducedMotion,
  quality,
  lockUnlockStarts,
  readHasps,
}: ChestModel3DProps) {
  const looks = useChestLooks(quality);

  return (
    <group>
      {/* Telo: drevo z dosiek, lišty, železné pásy, mosadzné rohy a nity */}
      <ChestBody3D looks={looks} />

      {/* Mäkký tieň pod truhlicou – nakreslí sa raz, potom sa iba zobrazuje. */}
      <ContactShadows
        position={[0, -1.06, 0]}
        scale={[4.1, 2.7]}
        resolution={256}
        frames={1}
        blur={2.4}
        far={1.4}
        opacity={0.6}
        color="#120a04"
      />

      {/* Kľúčová dierka v strede prednej strany */}
      <group position={[0, -0.6, 1.08]}>
        <mesh>
          <boxGeometry args={[0.34, 0.44, 0.05]} />
          <meshStandardMaterial color={BRASS_LIGHT} roughness={0.3} metalness={0.88} />
        </mesh>
        <mesh position={[0, 0.05, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.02, 20]} />
          <meshStandardMaterial color="#050302" roughness={0.9} />
        </mesh>
        <mesh position={[0, -0.05, 0.03]}>
          <boxGeometry args={[0.04, 0.12, 0.02]} />
          <meshStandardMaterial color="#050302" roughness={0.9} />
        </mesh>
      </group>

      <ChestKey3D readOpening={readOpening} />

      {/* Tri zámky */}
      {LOCK_PLACEMENTS.map((placement, index) => (
        <group
          key={index}
          position={placement.position}
          rotation={[0, placement.rotationY, 0]}
        >
          <Lock3D
            state={lockStates[index] ?? "closed"}
            isSelected={selectedIndex === index}
            onSelect={() => onSelectLock(index)}
            digits={lockDigits[index] ?? [0, 0, 0]}
            shakeKey={shakeKeys[index] ?? 0}
            reducedMotion={reducedMotion}
            unlockStartedAt={lockUnlockStarts[index] ?? null}
            brass={looks.brass}
          />
        </group>
      ))}

      {/* Veko, svetlo z truhlice a štvrtý útržok */}
      <ChestLid3D readOpening={readOpening} looks={looks} readHasps={readHasps} />
      <ChestGlow3D readOpening={readOpening} looks={looks} quality={quality} reducedMotion={reducedMotion} />
      <PhotoFragment3D
        imageSrc={fragmentImageSrc}
        pieceIndex={fragmentPieceIndex}
        readOpening={readOpening}
      />
    </group>
  );
}

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
  type Texture,
} from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { MysteriumEmblem, Rivet } from "../../ui/chest-3d/ChestParts";
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

/** Telo: drevo z dosiek, lišty, železné pásy, mosadzné rohy a nity. */
function ChestBody3D({ looks }: { looks: ChestLooks }) {
  const core = useRoundedBox(BODY.width, BODY.height, BODY.depth, 0.04);
  const topRim = useRoundedBox(3.48, 0.22, 2.08, 0.05);
  const bottomRim = useRoundedBox(3.48, 0.25, 2.08, 0.05);
  const corner = useRoundedBox(0.24, 0.28, 0.24, 0.035);
  const strapHeight = STRAP_TOP - STRAP_BOTTOM;
  const strapY = (STRAP_TOP + STRAP_BOTTOM) / 2;

  return (
    <group>
      <mesh geometry={core} position={[0, BODY.y, 0]}>
        <WoodMaterial map={looks.woodBody} bump={looks.woodBump} />
      </mesh>
      <mesh geometry={topRim} position={[0, 0.43, 0]}>
        <WoodMaterial map={looks.woodRim} bump={looks.woodBump} tint="#c9a27e" />
      </mesh>
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

      {/* Mosadzné rohy (jedno kreslenie) a nity (jedno kreslenie). */}
      <InstancedParts positions={BRASS_CORNERS}>
        <primitive object={corner} attach="geometry" />
        <BrassMaterial looks={looks} />
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
}: {
  readOpening: () => OpeningFrame;
  looks: ChestLooks;
}) {
  const lidRef = useRef<Group>(null);
  const lid = useRoundedBox(3.48, 0.42, 2.08, 0.06);
  const corner = useRoundedBox(0.24, 0.36, 0.24, 0.04);

  useFrame(() => {
    lidRef.current?.rotation.set(readOpening().lid * LID_OPEN_ANGLE, 0, 0);
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

      {/* Mosadzná lišta pod vekom vpredu, rohy a nity veka. */}
      <mesh position={[0, 0.03, 2.1]}>
        <boxGeometry args={[3.5, 0.08, 0.06]} />
        <BrassMaterial looks={looks} />
      </mesh>
      <InstancedParts positions={LID_CORNERS}>
        <primitive object={corner} attach="geometry" />
        <BrassMaterial looks={looks} />
      </InstancedParts>
      <InstancedParts positions={LID_RIVETS}>
        <sphereGeometry args={[0.04, 10, 6]} />
        <BrassMaterial looks={looks} />
      </InstancedParts>
      <MysteriumEmblem position={[0, 0.21, 2.12]} />
    </group>
  );
}

/** Teplé svetlo z otvorenej truhlice: žiariace dno, lúč a svetlo vnútri. */
function ChestGlow3D({ readOpening }: { readOpening: () => OpeningFrame }) {
  const groupRef = useRef<Group>(null);
  const floorRef = useRef<MeshBasicMaterial>(null);
  const beamRef = useRef<MeshBasicMaterial>(null);
  const lightRef = useRef<PointLight>(null);

  useFrame(() => {
    const { light } = readOpening();

    if (groupRef.current) {
      groupRef.current.visible = light > 0;
    }

    floorRef.current?.setValues({ opacity: 0.9 * light });
    beamRef.current?.setValues({ opacity: 0.16 * light });

    if (lightRef.current) {
      lightRef.current.intensity = 6 * light;
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      <mesh position={[0, 0.56, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.2, 1.85]} />
        <meshBasicMaterial ref={floorRef} color="#ffd27a" transparent opacity={0} toneMapped={false} />
      </mesh>
      <mesh position={[0, 1.35, 0]}>
        <cylinderGeometry args={[1.5, 1.25, 1.6, 32, 1, true]} />
        <meshBasicMaterial
          ref={beamRef}
          color="#ffe6a8"
          transparent
          opacity={0}
          blending={AdditiveBlending}
          depthWrite={false}
          side={DoubleSide}
          toneMapped={false}
        />
      </mesh>
      <pointLight ref={lightRef} position={[0, 1.1, 0.6]} color="#ffcf70" intensity={0} distance={6} />
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
      <ChestLid3D readOpening={readOpening} looks={looks} />
      <ChestGlow3D readOpening={readOpening} />
      <PhotoFragment3D
        imageSrc={fragmentImageSrc}
        pieceIndex={fragmentPieceIndex}
        readOpening={readOpening}
      />
    </group>
  );
}

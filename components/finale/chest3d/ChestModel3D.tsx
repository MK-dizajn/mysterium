"use client";

import type { ThreeEvent } from "@react-three/fiber";
import { CornerPlate, MysteriumEmblem, Rivet } from "../../ui/chest-3d/ChestParts";

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

const WOOD = "#3b2112";
const WOOD_DARK = "#24130a";
const WOOD_RIM = "#4a2a14";
const BRASS = "#a96f29";
const BRASS_LIGHT = "#d6a451";

/** Pri ťahaní nemá ťuknutie na zámok vybrať zámok. */
const CLICK_SLOP_PX = 6;

function Lock3D({
  state,
  isSelected,
  onSelect,
}: {
  state: ChestLockState;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const glow =
    state === "next"
      ? { emissive: "#ffb347", emissiveIntensity: 0.45 }
      : state === "open"
        ? { emissive: "#3fa35a", emissiveIntensity: 0.4 }
        : { emissive: "#000000", emissiveIntensity: 0 };

  function handleClick(event: ThreeEvent<MouseEvent>) {
    if (event.delta > CLICK_SLOP_PX) {
      return;
    }

    event.stopPropagation();
    onSelect();
  }

  return (
    <group onClick={handleClick}>
      {/* Platnička zámku */}
      <mesh>
        <boxGeometry args={[0.66, 0.76, 0.06]} />
        <meshStandardMaterial color="#6b4417" roughness={0.45} metalness={0.75} />
      </mesh>

      {/* Rám pri vybranom zámku */}
      {isSelected && (
        <mesh position={[0, 0, 0.02]}>
          <boxGeometry args={[0.76, 0.86, 0.03]} />
          <meshStandardMaterial
            color="#fff1c2"
            emissive="#ffd27a"
            emissiveIntensity={0.7}
            roughness={0.3}
            metalness={0.4}
          />
        </mesh>
      )}

      {/* Telo zámku */}
      <mesh position={[0, -0.08, 0.09]}>
        <boxGeometry args={[0.48, 0.42, 0.14]} />
        <meshStandardMaterial
          color={state === "open" ? "#b9a24a" : "#b8812f"}
          roughness={0.3}
          metalness={0.85}
          {...glow}
        />
      </mesh>

      {/* Tri okienka číselníka */}
      {[-0.13, 0, 0.13].map((x) => (
        <mesh key={x} position={[x, -0.06, 0.165]}>
          <boxGeometry args={[0.09, 0.13, 0.02]} />
          <meshStandardMaterial color="#120a05" roughness={0.8} metalness={0.1} />
        </mesh>
      ))}

      {/* Oblúk zámku – po odomknutí vysunutý hore */}
      <mesh
        position={[0, state === "open" ? 0.25 : 0.14, 0.09]}
        rotation={[0, 0, 0]}
      >
        <torusGeometry args={[0.15, 0.035, 12, 24, Math.PI]} />
        <meshStandardMaterial color={BRASS_LIGHT} roughness={0.28} metalness={0.9} />
      </mesh>

      <Rivet position={[-0.25, 0.3, 0.04]} scale={0.6} />
      <Rivet position={[0.25, 0.3, 0.04]} scale={0.6} />
      <Rivet position={[-0.25, -0.3, 0.04]} scale={0.6} />
      <Rivet position={[0.25, -0.3, 0.04]} scale={0.6} />
    </group>
  );
}

/** Zlatý kľúč zasunutý do dierky (zobrazí sa po vložení). */
function InsertedKey() {
  return (
    <group position={[0, -0.6, 1.16]}>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.17]}>
        <cylinderGeometry args={[0.035, 0.035, 0.34, 16]} />
        <meshStandardMaterial color="#e2b54f" roughness={0.25} metalness={0.95} />
      </mesh>
      <mesh position={[0, 0, 0.42]}>
        <torusGeometry args={[0.12, 0.035, 12, 28]} />
        <meshStandardMaterial color="#e2b54f" roughness={0.25} metalness={0.95} />
      </mesh>
    </group>
  );
}

type ChestModel3DProps = {
  lockStates: ChestLockState[];
  selectedIndex: number | null;
  onSelectLock: (index: number) => void;
  isKeyInserted: boolean;
  isLidOpen: boolean;
};

/**
 * Odľahčená truhlica vo finále (vzhľad z pôvodného modelu, bez tieňov):
 * zámok I na ľavom boku, II vpredu nad kľúčovou dierkou, III na pravom boku.
 */
export function ChestModel3D({
  lockStates,
  selectedIndex,
  onSelectLock,
  isKeyInserted,
  isLidOpen,
}: ChestModel3DProps) {
  return (
    <group>
      {/* Telo truhlice */}
      <mesh position={[0, -0.27, 0]}>
        <boxGeometry args={[3.34, 1.52, 1.96]} />
        <meshStandardMaterial color={WOOD} roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Zvislé medzery medzi doskami vpredu a na bokoch */}
      {[-1.05, -0.7, 0.7, 1.05].map((x) => (
        <mesh key={`front-${x}`} position={[x, -0.27, 0.985]}>
          <boxGeometry args={[0.025, 1.3, 0.01]} />
          <meshStandardMaterial color={WOOD_DARK} roughness={0.9} />
        </mesh>
      ))}

      {/* Horná a spodná hrana s mosadznými pásmi */}
      <mesh position={[0, 0.43, 0]}>
        <boxGeometry args={[3.48, 0.22, 2.08]} />
        <meshStandardMaterial color={WOOD_RIM} roughness={0.8} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.43, 1.075]}>
        <boxGeometry args={[3.5, 0.2, 0.17]} />
        <meshStandardMaterial color={BRASS} roughness={0.36} metalness={0.82} />
      </mesh>
      <mesh position={[0, -0.92, 0]}>
        <boxGeometry args={[3.48, 0.25, 2.08]} />
        <meshStandardMaterial color={WOOD_RIM} roughness={0.8} metalness={0.05} />
      </mesh>
      <mesh position={[0, -0.91, 1.075]}>
        <boxGeometry args={[3.5, 0.22, 0.17]} />
        <meshStandardMaterial color={BRASS} roughness={0.36} metalness={0.82} />
      </mesh>

      <CornerPlate x={-1.5} />
      <CornerPlate x={1.5} />

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

      {isKeyInserted && <InsertedKey />}

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
          />
        </group>
      ))}

      {/* Veko: otáča sa okolo zadnej hornej hrany */}
      <group position={[0, 0.54, -1.04]} rotation={[isLidOpen ? -1.25 : 0, 0, 0]}>
        <mesh position={[0, 0.21, 1.04]}>
          <boxGeometry args={[3.48, 0.42, 2.08]} />
          <meshStandardMaterial color={WOOD_RIM} roughness={0.8} metalness={0.05} />
        </mesh>
        <mesh position={[0, 0.44, 1.04]}>
          <boxGeometry args={[3.3, 0.05, 1.9]} />
          <meshStandardMaterial color={WOOD} roughness={0.85} metalness={0.05} />
        </mesh>
        <mesh position={[0, 0.03, 2.1]}>
          <boxGeometry args={[3.5, 0.08, 0.06]} />
          <meshStandardMaterial color={BRASS} roughness={0.36} metalness={0.82} />
        </mesh>
        <MysteriumEmblem position={[0, 0.21, 2.12]} />
      </group>
    </group>
  );
}

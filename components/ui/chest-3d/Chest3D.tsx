"use client";

import { ContactShadows } from "@react-three/drei";
import {
  Canvas,
  type ThreeEvent,
  useFrame,
  useThree,
} from "@react-three/fiber";
import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  DoubleSide,
  Group,
  Vector3,
} from "three";

type Chest3DProps = {
  isFocused?: boolean;
  isUnlocked?: boolean;
  onSelect?: () => void;
  onRewardClick?: () => void;
};

type CameraRigProps = {
  isFocused: boolean;
};

type ChestPrototypeProps = {
  isFocused: boolean;
  isUnlocked: boolean;
  onSelect?: () => void;
  onRewardClick?: () => void;
};

type FragmentPieceProps = {
  index: number;
  x: number;
  y: number;
  rotationZ: number;
  delay: number;
  onClick?: () => void;
};

type UnlockSequenceState = {
  isLockReleased: boolean;
  isLightVisible: boolean;
  isLidOpen: boolean;
  areParticlesVisible: boolean;
  areFragmentsVisible: boolean;
};

const FRONT_SLATS = [
  -1.05,
  -0.7,
  -0.35,
  0,
  0.35,
  0.7,
  1.05,
];

const LID_SLATS = [
  -1.02,
  -0.68,
  -0.34,
  0,
  0.34,
  0.68,
  1.02,
];

const PARTICLES = [
  {
    x: -0.9,
    y: 0.85,
    z: 0.2,
    size: 0.035,
    speed: 0.48,
    phase: 0.2,
  },
  {
    x: -0.62,
    y: 1.15,
    z: 0.4,
    size: 0.025,
    speed: 0.7,
    phase: 1.4,
  },
  {
    x: -0.32,
    y: 0.95,
    z: 0.1,
    size: 0.04,
    speed: 0.55,
    phase: 2.2,
  },
  {
    x: 0,
    y: 1.25,
    z: 0.35,
    size: 0.03,
    speed: 0.62,
    phase: 0.8,
  },
  {
    x: 0.28,
    y: 0.88,
    z: 0.05,
    size: 0.025,
    speed: 0.75,
    phase: 3.1,
  },
  {
    x: 0.58,
    y: 1.1,
    z: 0.3,
    size: 0.038,
    speed: 0.5,
    phase: 1.9,
  },
  {
    x: 0.88,
    y: 0.92,
    z: 0.15,
    size: 0.028,
    speed: 0.68,
    phase: 2.7,
  },
  {
    x: -0.48,
    y: 1.48,
    z: 0.2,
    size: 0.022,
    speed: 0.8,
    phase: 4.2,
  },
  {
    x: 0.42,
    y: 1.52,
    z: 0.25,
    size: 0.026,
    speed: 0.72,
    phase: 3.8,
  },
];

function useChest3DUnlockSequence(
  isUnlocked: boolean
): UnlockSequenceState {
  const [
    sequence,
    setSequence,
  ] = useState<UnlockSequenceState>({
    isLockReleased: false,
    isLightVisible: false,
    isLidOpen: false,
    areParticlesVisible: false,
    areFragmentsVisible: false,
  });

  useEffect(() => {
    if (!isUnlocked) {
      setSequence({
        isLockReleased: false,
        isLightVisible: false,
        isLidOpen: false,
        areParticlesVisible: false,
        areFragmentsVisible: false,
      });

      return;
    }

    const lockTimer = window.setTimeout(() => {
      setSequence((current) => ({
        ...current,
        isLockReleased: true,
      }));
    }, 180);

    const lightTimer = window.setTimeout(() => {
      setSequence((current) => ({
        ...current,
        isLightVisible: true,
      }));
    }, 520);

    const lidTimer = window.setTimeout(() => {
      setSequence((current) => ({
        ...current,
        isLidOpen: true,
      }));
    }, 850);

    const particlesTimer =
      window.setTimeout(() => {
        setSequence((current) => ({
          ...current,
          areParticlesVisible: true,
        }));
      }, 1450);

    const fragmentsTimer =
      window.setTimeout(() => {
        setSequence((current) => ({
          ...current,
          areFragmentsVisible: true,
        }));
      }, 2300);

    return () => {
      window.clearTimeout(lockTimer);
      window.clearTimeout(lightTimer);
      window.clearTimeout(lidTimer);
      window.clearTimeout(particlesTimer);
      window.clearTimeout(fragmentsTimer);
    };
  }, [isUnlocked]);

  return sequence;
}

function CameraRig({
  isFocused,
}: CameraRigProps) {
  const { camera } = useThree();

  const explorePosition = useMemo(
    () => new Vector3(4.8, 3.15, 6.5),
    []
  );

  const focusedPosition = useMemo(
    () => new Vector3(0, 0.05, 4.15),
    []
  );

  const exploreLookTarget = useMemo(
    () => new Vector3(0, -0.05, 0),
    []
  );

  const focusedLookTarget = useMemo(
    () => new Vector3(0, -0.2, 0.8),
    []
  );

  const currentLookTarget = useRef(
    new Vector3(0, -0.05, 0)
  );

  useFrame((_, delta) => {
    const positionTarget = isFocused
      ? focusedPosition
      : explorePosition;

    const lookTarget = isFocused
      ? focusedLookTarget
      : exploreLookTarget;

    const smoothing =
      1 - Math.exp(-delta * 4.2);

    camera.position.lerp(
      positionTarget,
      smoothing
    );

    currentLookTarget.current.lerp(
      lookTarget,
      smoothing
    );

    camera.lookAt(currentLookTarget.current);
  });

  return null;
}

function Rivet({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <mesh
      position={position}
      scale={scale}
      rotation={[Math.PI / 2, 0, 0]}
      castShadow
    >
      <sphereGeometry
        args={[0.055, 16, 10]}
      />

      <meshStandardMaterial
        color="#d6a451"
        roughness={0.34}
        metalness={0.86}
      />
    </mesh>
  );
}

function CornerPlate({
  x,
}: {
  x: number;
}) {
  return (
    <group position={[x, -0.23, 1.04]}>
      <mesh castShadow>
        <boxGeometry
          args={[0.28, 1.18, 0.12]}
        />

        <meshStandardMaterial
          color="#a8732d"
          roughness={0.42}
          metalness={0.78}
        />
      </mesh>

      <mesh
        position={[
          x < 0 ? -0.08 : 0.08,
          0,
          0.075,
        ]}
        castShadow
      >
        <boxGeometry
          args={[0.07, 1.06, 0.06]}
        />

        <meshStandardMaterial
          color="#dfb05c"
          roughness={0.32}
          metalness={0.82}
        />
      </mesh>

      <Rivet
        position={[0, 0.42, 0.09]}
        scale={0.82}
      />

      <Rivet
        position={[0, 0, 0.09]}
        scale={0.82}
      />

      <Rivet
        position={[0, -0.42, 0.09]}
        scale={0.82}
      />
    </group>
  );
}

function SideHandle({ side }: { side: -1 | 1 }) {
  const x = side * 1.755;
  const rotationY = side === 1 ? Math.PI / 2 : -Math.PI / 2;

  return (
    <group
      position={[x, -0.22, 0]}
      rotation={[0, rotationY, 0]}
    >
      {/* Montážne platničky */}
      {[-0.34, 0.34].map((handleX) => (
        <group key={handleX} position={[handleX, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.18, 0.3, 0.1]} />
            <meshStandardMaterial
              color="#9b6829"
              roughness={0.34}
              metalness={0.84}
            />
          </mesh>

          <Rivet position={[0, 0.08, 0.065]} scale={0.7} />
          <Rivet position={[0, -0.08, 0.065]} scale={0.7} />
        </group>
      ))}

      {/* Dekoračná sklopná rukoväť */}
      <mesh
        position={[0, -0.08, 0.12]}
        rotation={[0, 0, Math.PI]}
        castShadow
      >
        <torusGeometry args={[0.34, 0.055, 14, 36, Math.PI]} />
        <meshStandardMaterial
          color="#c18a3b"
          roughness={0.3}
          metalness={0.88}
        />
      </mesh>
    </group>
  );
}

function MysteriumEmblem() {
  const darkMetal = "#3a210d";
  const brass = "#c58b3c";
  const brassHighlight = "#f0c66d";

  return (
    <group position={[0, -0.08, 1.965]}>
      {/* Hrubá zadná časť medailónu */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
      >
        <cylinderGeometry
          args={[0.285, 0.285, 0.085, 40]}
        />

        <meshStandardMaterial
          color={darkMetal}
          roughness={0.38}
          metalness={0.82}
        />
      </mesh>

      {/* Mosadzná predná plocha */}
      <mesh position={[0, 0, 0.052]} castShadow>
        <circleGeometry args={[0.252, 40]} />

        <meshStandardMaterial
          color={brass}
          roughness={0.28}
          metalness={0.9}
          emissive="#2f1905"
          emissiveIntensity={0.08}
        />
      </mesh>

      {/* Vystúpený kruhový rám */}
      <mesh position={[0, 0, 0.07]}>
        <torusGeometry
          args={[0.215, 0.027, 12, 40]}
        />

        <meshStandardMaterial
          color={brassHighlight}
          roughness={0.22}
          metalness={0.94}
          emissive="#382006"
          emissiveIntensity={0.08}
        />
      </mesh>

      {/* Plastický znak M */}
      <group position={[0, -0.005, 0.092]}>
        <mesh
          position={[-0.09, 0, 0]}
          rotation={[0, 0, -0.1]}
          castShadow
        >
          <boxGeometry args={[0.05, 0.27, 0.035]} />
          <meshStandardMaterial
            color="#2a1408"
            roughness={0.5}
            metalness={0.28}
          />
        </mesh>

        <mesh
          position={[0.09, 0, 0]}
          rotation={[0, 0, 0.1]}
          castShadow
        >
          <boxGeometry args={[0.05, 0.27, 0.035]} />
          <meshStandardMaterial
            color="#2a1408"
            roughness={0.5}
            metalness={0.28}
          />
        </mesh>

        <mesh
          position={[-0.043, 0.035, 0]}
          rotation={[0, 0, 0.58]}
          castShadow
        >
          <boxGeometry args={[0.045, 0.19, 0.035]} />
          <meshStandardMaterial
            color="#2a1408"
            roughness={0.5}
            metalness={0.28}
          />
        </mesh>

        <mesh
          position={[0.043, 0.035, 0]}
          rotation={[0, 0, -0.58]}
          castShadow
        >
          <boxGeometry args={[0.045, 0.19, 0.035]} />
          <meshStandardMaterial
            color="#2a1408"
            roughness={0.5}
            metalness={0.28}
          />
        </mesh>
      </group>
    </group>
  );
}

function LockMechanism({
  isReleased,
}: {
  isReleased: boolean;
}) {
  const lockRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!lockRef.current) {
      return;
    }

    const targetY = isReleased
      ? -0.28
      : -0.15;

    const targetRotation = isReleased
      ? 0.12
      : 0;

    const smoothing =
      1 - Math.exp(-delta * 6);

    lockRef.current.position.y +=
      (targetY -
        lockRef.current.position.y) *
      smoothing;

    lockRef.current.rotation.z +=
      (targetRotation -
        lockRef.current.rotation.z) *
      smoothing;
  });

  return (
    <group
      ref={lockRef}
      position={[0, -0.15, 1.24]}
    >
      <mesh castShadow>
        <boxGeometry
          args={[0.54, 0.54, 0.18]}
        />

        <meshStandardMaterial
          color="#b47c31"
          roughness={0.3}
          metalness={0.86}
        />
      </mesh>

      <mesh
        position={[0, 0, 0.11]}
        castShadow
      >
        <boxGeometry
          args={[0.38, 0.38, 0.06]}
        />

        <meshStandardMaterial
          color="#6c431b"
          roughness={0.42}
          metalness={0.72}
        />
      </mesh>

      <mesh
        position={[0, 0.015, 0.155]}
        rotation={[
          Math.PI / 2,
          0,
          0,
        ]}
      >
        <cylinderGeometry
          args={[
            0.065,
            0.065,
            0.04,
            20,
          ]}
        />

        <meshStandardMaterial
          color="#160c06"
          roughness={0.8}
          metalness={0.12}
        />
      </mesh>

      <mesh
        position={[0, -0.095, 0.155]}
      >
        <boxGeometry
          args={[0.06, 0.14, 0.035]}
        />

        <meshStandardMaterial
          color="#160c06"
          roughness={0.8}
          metalness={0.12}
        />
      </mesh>
    </group>
  );
}

function RisingParticle({
  x,
  y,
  z,
  size,
  speed,
  phase,
  isVisible,
}: {
  x: number;
  y: number;
  z: number;
  size: number;
  speed: number;
  phase: number;
  isVisible: boolean;
}) {
  const particleRef =
    useRef<Group>(null);

  useFrame((state, delta) => {
    if (!particleRef.current) {
      return;
    }

    const targetScale = isVisible
      ? 1
      : 0;

    const smoothing =
      1 - Math.exp(-delta * 3.2);

    particleRef.current.scale.lerp(
      new Vector3(
        targetScale,
        targetScale,
        targetScale
      ),
      smoothing
    );

    const time =
      state.clock.elapsedTime *
        speed +
      phase;

    particleRef.current.position.y =
      y + (time % 1.5);

    particleRef.current.position.x =
      x + Math.sin(time * 2.1) * 0.1;

    particleRef.current.position.z =
      z + Math.cos(time * 1.7) * 0.08;

    particleRef.current.visible =
      isVisible ||
      particleRef.current.scale.x >
        0.02;
  });

  return (
    <group
      ref={particleRef}
      position={[x, y, z]}
      scale={[0, 0, 0]}
      visible={false}
    >
      <mesh>
        <sphereGeometry
          args={[size, 10, 8]}
        />

        <meshBasicMaterial
          color="#ffd77b"
          transparent
          opacity={0.72}
        />
      </mesh>
    </group>
  );
}

function ChestParticles({
  isVisible,
}: {
  isVisible: boolean;
}) {
  return (
    <group>
      {PARTICLES.map(
        (particle, index) => (
          <RisingParticle
            key={index}
            {...particle}
            isVisible={isVisible}
          />
        )
      )}
    </group>
  );
}

function InnerLight({
  isVisible,
}: {
  isVisible: boolean;
}) {
  const lightGroupRef =
    useRef<Group>(null);

  useFrame((state, delta) => {
    if (!lightGroupRef.current) {
      return;
    }

    const pulse =
      1 +
      Math.sin(
        state.clock.elapsedTime * 2.4
      ) *
        0.05;

    const targetScale = isVisible
      ? pulse
      : 0;

    const smoothing =
      1 - Math.exp(-delta * 3.4);

    lightGroupRef.current.scale.lerp(
      new Vector3(
        targetScale,
        targetScale,
        targetScale
      ),
      smoothing
    );

    lightGroupRef.current.visible =
      isVisible ||
      lightGroupRef.current.scale.x >
        0.02;
  });

  return (
    <group
      ref={lightGroupRef}
      position={[0, 0.5, 0.1]}
      scale={[0, 0, 0]}
      visible={false}
    >
      <pointLight
        position={[0, 0.35, 0.25]}
        intensity={7}
        distance={7}
        decay={2}
        color="#ffad28"
      />

      <pointLight
        position={[0, 1.15, 0.35]}
        intensity={3.2}
        distance={5}
        decay={2}
        color="#ffe1a0"
      />

      <mesh
        position={[0, 0.35, 0.2]}
        rotation={[
          Math.PI / 2,
          0,
          0,
        ]}
      >
        <coneGeometry
          args={[
            1.35,
            3.2,
            32,
            1,
            true,
          ]}
        />

        <meshBasicMaterial
          color="#f3a62e"
          transparent
          opacity={0.075}
          depthWrite={false}
          side={DoubleSide}
        />
      </mesh>

      <mesh
        position={[0, 0.05, 0]}
      >
        <sphereGeometry
          args={[0.72, 24, 16]}
        />

        <meshBasicMaterial
          color="#ffb52e"
          transparent
          opacity={0.12}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function FragmentPiece({
  index,
  x,
  y,
  rotationZ,
  delay,
  onClick,
}: FragmentPieceProps) {
  const fragmentRef =
    useRef<Group>(null);

  useFrame((state) => {
    if (!fragmentRef.current) {
      return;
    }

    const time =
      state.clock.elapsedTime - delay;

    fragmentRef.current.position.y =
      y +
      Math.sin(
        time * 1.15 + index
      ) *
        0.08;

    fragmentRef.current.rotation.y =
      Math.sin(
        time * 0.55 + index
      ) * 0.18;

    fragmentRef.current.rotation.z =
      rotationZ +
      Math.sin(
        time * 0.72 + index
      ) *
        0.04;
  });

  return (
    <group
      ref={fragmentRef}
      position={[x, y, 0.35]}
      rotation={[0.08, 0, rotationZ]}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.();
      }}
      onPointerOver={() => {
        document.body.style.cursor =
          "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "";
      }}
    >
      <mesh castShadow>
        <boxGeometry
          args={[0.66, 0.48, 0.035]}
        />

        <meshStandardMaterial
          color={
            index === 1
              ? "#d7b878"
              : "#c69c5b"
          }
          roughness={0.82}
          metalness={0.02}
          emissive="#5b3515"
          emissiveIntensity={0.22}
        />
      </mesh>

      <mesh position={[0, 0, 0.021]}>
        <boxGeometry
          args={[0.5, 0.035, 0.008]}
        />

        <meshStandardMaterial
          color="#6f4622"
          roughness={0.9}
        />
      </mesh>

      <mesh
        position={[0, -0.1, 0.021]}
      >
        <boxGeometry
          args={[0.4, 0.025, 0.008]}
        />

        <meshStandardMaterial
          color="#78502a"
          roughness={0.9}
        />
      </mesh>
    </group>
  );
}

function FloatingFragments({
  isVisible,
  onRewardClick,
}: {
  isVisible: boolean;
  onRewardClick?: () => void;
}) {
  const groupRef =
    useRef<Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) {
      return;
    }

    const targetScale = isVisible
      ? 1
      : 0;

    const smoothing =
      1 - Math.exp(-delta * 3.5);

    groupRef.current.scale.lerp(
      new Vector3(
        targetScale,
        targetScale,
        targetScale
      ),
      smoothing
    );

    groupRef.current.visible =
      isVisible ||
      groupRef.current.scale.x >
        0.02;
  });

  return (
    <group
      ref={groupRef}
      scale={[0, 0, 0]}
      visible={false}
    >
      <FragmentPiece
        index={0}
        x={-0.78}
        y={1.75}
        rotationZ={-0.16}
        delay={0}
        onClick={onRewardClick}
      />

      <FragmentPiece
        index={1}
        x={0}
        y={2.08}
        rotationZ={0.08}
        delay={0.35}
        onClick={onRewardClick}
      />

      <FragmentPiece
        index={2}
        x={0.78}
        y={1.72}
        rotationZ={0.18}
        delay={0.7}
        onClick={onRewardClick}
      />
    </group>
  );
}

function CombinationLockPlate({
  isReleased,
}: {
  isReleased: boolean;
}) {
  const plateRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!plateRef.current) {
      return;
    }

    const targetY = isReleased
      ? -0.28
      : -0.16;

    const targetRotation = isReleased
      ? 0.08
      : 0;

    const targetScale = isReleased
      ? 0.92
      : 1;

    const smoothing =
      1 - Math.exp(-delta * 5.5);

    plateRef.current.position.y +=
      (targetY -
        plateRef.current.position.y) *
      smoothing;

    plateRef.current.rotation.z +=
      (targetRotation -
        plateRef.current.rotation.z) *
      smoothing;

    plateRef.current.scale.x +=
      (targetScale -
        plateRef.current.scale.x) *
      smoothing;

    plateRef.current.scale.y +=
      (targetScale -
        plateRef.current.scale.y) *
      smoothing;

    plateRef.current.scale.z +=
      (targetScale -
        plateRef.current.scale.z) *
      smoothing;
  });

  return (
    <group
      ref={plateRef}
      position={[0, -0.16, 1.22]}
    >
      {/* Hlavný mosadzný panel */}
      <mesh castShadow>
        <boxGeometry
          args={[1.38, 0.72, 0.14]}
        />

        <meshStandardMaterial
          color="#a96f29"
          roughness={0.36}
          metalness={0.82}
        />
      </mesh>

      {/* Vnútorný tmavý panel */}
      <mesh
        position={[0, 0, 0.085]}
        castShadow
      >
        <boxGeometry
          args={[1.22, 0.56, 0.045]}
        />

        <meshStandardMaterial
          color="#2d1509"
          roughness={0.78}
          metalness={0.16}
        />
      </mesh>

      {/* Horný názov panelu */}
      <mesh
        position={[0, 0.22, 0.115]}
      >
        <boxGeometry
          args={[0.68, 0.035, 0.018]}
        />

        <meshStandardMaterial
          color="#e0b35d"
          roughness={0.3}
          metalness={0.85}
        />
      </mesh>

      {/* Tri dvojice číselníkov */}
      {[-0.4, 0, 0.4].map(
        (pairX, pairIndex) => (
          <group
            key={pairX}
            position={[
              pairX,
              -0.015,
              0.12,
            ]}
          >
            {/* Rám dvojice */}
            <mesh>
              <boxGeometry
                args={[
                  0.32,
                  0.36,
                  0.035,
                ]}
              />

              <meshStandardMaterial
                color="#78501e"
                roughness={0.46}
                metalness={0.66}
              />
            </mesh>

            {[-0.075, 0.075].map(
              (digitX, digitIndex) => (
                <group
                  key={digitX}
                  position={[
                    digitX,
                    0,
                    0.035,
                  ]}
                >
                  {/* Čierne okno číslice */}
                  <mesh>
                    <boxGeometry
                      args={[
                        0.12,
                        0.24,
                        0.025,
                      ]}
                    />

                    <meshStandardMaterial
                      color="#060504"
                      roughness={0.92}
                      metalness={0}
                    />
                  </mesh>

                  {/* Svetlá číslica */}
                  <mesh
                    position={[
                      0,
                      0,
                      0.02,
                    ]}
                  >
                    <boxGeometry
                      args={[
                        0.045,
                        0.11,
                        0.012,
                      ]}
                    />

                    <meshStandardMaterial
                      color={
                        pairIndex === 1 &&
                        digitIndex === 1
                          ? "#f5dfad"
                          : "#e8d19b"
                      }
                      emissive="#8a5c20"
                      emissiveIntensity={
                        0.2
                      }
                      roughness={0.5}
                      metalness={0.1}
                    />
                  </mesh>
                </group>
              )
            )}

            {/* Označenie dvojice */}
            <mesh
              position={[
                0,
                -0.235,
                0.03,
              ]}
            >
              <boxGeometry
                args={[
                  0.08,
                  0.025,
                  0.014,
                ]}
              />

              <meshStandardMaterial
                color="#d7a84f"
                roughness={0.36}
                metalness={0.8}
              />
            </mesh>
          </group>
        )
      )}

      {/* Rohové nity */}
      {[
        [-0.59, 0.27],
        [0.59, 0.27],
        [-0.59, -0.27],
        [0.59, -0.27],
      ].map(([x, y]) => (
        <mesh
          key={`${x}-${y}`}
          position={[x, y, 0.1]}
          rotation={[
            Math.PI / 2,
            0,
            0,
          ]}
          castShadow
        >
          <sphereGeometry
            args={[0.045, 14, 8]}
          />

          <meshStandardMaterial
            color="#e1b15a"
            roughness={0.3}
            metalness={0.88}
          />
        </mesh>
      ))}

      {/* Spodné potvrdenie ako súčasť mechanizmu */}
      <mesh
        position={[0, -0.23, 0.1]}
        castShadow
      >
        <boxGeometry
          args={[0.72, 0.09, 0.045]}
        />

        <meshStandardMaterial
          color="#c38a35"
          roughness={0.34}
          metalness={0.82}
        />
      </mesh>
    </group>
  );
}

function ChestPrototype({
  isFocused,
  isUnlocked,
  onSelect,
  onRewardClick,
}: ChestPrototypeProps) {
  const chestRef = useRef<Group>(null);
  const lidRef = useRef<Group>(null);

  const pointerStart = useRef({
    x: 0,
    y: 0,
  });

  const pointerMoved =
    useRef(false);

  const [isHovered, setIsHovered] =
    useState(false);

  const {
    isLockReleased,
    isLightVisible,
    isLidOpen,
    areParticlesVisible,
    areFragmentsVisible,
  } = useChest3DUnlockSequence(
    isUnlocked
  );

  useEffect(() => {
    if (!isHovered || isFocused) {
      document.body.style.cursor = "";

      return;
    }

    document.body.style.cursor = "grab";

    return () => {
      document.body.style.cursor = "";
    };
  }, [isHovered, isFocused]);

  useEffect(() => {
    return () => {
      document.body.style.cursor = "";
    };
  }, []);

  useFrame((_, delta) => {
    if (
      chestRef.current &&
      (isFocused || isUnlocked)
    ) {
      const smoothing =
        1 - Math.exp(-delta * 4.6);

      chestRef.current.rotation.y +=
        (0 -
          chestRef.current.rotation.y) *
        smoothing;

      chestRef.current.rotation.x +=
        (0 -
          chestRef.current.rotation.x) *
        smoothing;
    }

    if (lidRef.current) {
      const closedRotation = 0;
      const openedRotation = -1.38;

      const targetRotation = isLidOpen
        ? openedRotation
        : closedRotation;

      const smoothing =
        1 -
        Math.exp(
          -delta *
            (isLidOpen ? 1.55 : 4)
        );

      lidRef.current.rotation.x +=
        (targetRotation -
          lidRef.current.rotation.x) *
        smoothing;
    }
  });

  function handlePointerDown(
    event: ThreeEvent<PointerEvent>
  ) {
    event.stopPropagation();

    pointerStart.current = {
      x: event.nativeEvent.clientX,
      y: event.nativeEvent.clientY,
    };

    pointerMoved.current = false;
  }

  function handlePointerMove(
    event: ThreeEvent<PointerEvent>
  ) {
    if (
      isFocused ||
      isUnlocked ||
      event.buttons !== 1 ||
      !chestRef.current
    ) {
      return;
    }

    const differenceX =
      event.nativeEvent.clientX -
      pointerStart.current.x;

    const differenceY =
      event.nativeEvent.clientY -
      pointerStart.current.y;

    if (
      Math.abs(differenceX) > 4 ||
      Math.abs(differenceY) > 4
    ) {
      pointerMoved.current = true;
    }

    chestRef.current.rotation.y +=
      differenceX * 0.006;

    chestRef.current.rotation.x -=
      differenceY * 0.0025;

    chestRef.current.rotation.y =
      Math.max(
        -0.9,
        Math.min(
          0.9,
          chestRef.current.rotation.y
        )
      );

    chestRef.current.rotation.x =
      Math.max(
        -0.12,
        Math.min(
          0.18,
          chestRef.current.rotation.x
        )
      );

    pointerStart.current = {
      x: event.nativeEvent.clientX,
      y: event.nativeEvent.clientY,
    };
  }

  function handlePointerUp(
    event: ThreeEvent<PointerEvent>
  ) {
    event.stopPropagation();

    if (
      !pointerMoved.current &&
      !isFocused &&
      !isUnlocked
    ) {
      onSelect?.();
    }
  }

  return (
    <>
      <group
        ref={chestRef}
        rotation={[0, -0.35, 0]}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerOver={(event) => {
          event.stopPropagation();
          setIsHovered(true);
        }}
        onPointerOut={() => {
          setIsHovered(false);
        }}
      >
        {/* =====================================================
            MASÍVNY KORPUS – VIZUÁL PODĽA PÔVODNEJ 2D TRUHLICE
        ===================================================== */}

        {/* Hlavný tmavý drevený korpus */}
        <mesh
          position={[0, -0.27, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry
            args={[3.34, 1.52, 1.96]}
          />

          <meshStandardMaterial
            color="#5a2d14"
            roughness={0.88}
            metalness={0.015}
          />
        </mesh>

        {/* Zadná tmavá vrstva korpusu */}
        <mesh
          position={[0, -0.24, -0.92]}
          castShadow
        >
          <boxGeometry
            args={[3.08, 1.28, 0.16]}
          />

          <meshStandardMaterial
            color="#321408"
            roughness={0.94}
            metalness={0}
          />
        </mesh>

        {/* Predný zapustený drevený panel */}
        <mesh
          position={[0, -0.24, 1.005]}
          castShadow
        >
          <boxGeometry
            args={[2.72, 1.02, 0.1]}
          />

          <meshStandardMaterial
            color="#5b2811"
            roughness={0.92}
            metalness={0}
          />
        </mesh>

        {/* Vnútorná plocha predného panelu */}
        <mesh
          position={[0, -0.24, 1.066]}
          castShadow
        >
          <boxGeometry
            args={[2.48, 0.82, 0.035]}
          />

          <meshStandardMaterial
            color="#6b3215"
            roughness={0.88}
            metalness={0.01}
          />
        </mesh>

        {/* Zvislé vrstvené drevené dosky */}
        {FRONT_SLATS.map(
          (xPosition, index) => (
            <mesh
              key={`body-slat-${xPosition}`}
              position={[
                xPosition,
                -0.24,
                1.09,
              ]}
              castShadow
            >
              <boxGeometry
                args={[0.29, 0.72, 0.035]}
              />

              <meshStandardMaterial
                color={
                  index % 3 === 0
                    ? "#81401d"
                    : index % 3 === 1
                      ? "#6b3215"
                      : "#5b2811"
                }
                roughness={0.9}
                metalness={0.005}
              />
            </mesh>
          )
        )}

        {/* Tmavé medzery medzi doskami */}
        {FRONT_SLATS.slice(
          0,
          -1
        ).map((xPosition) => (
          <mesh
            key={`body-gap-${xPosition}`}
            position={[
              xPosition + 0.175,
              -0.24,
              1.114,
            ]}
          >
            <boxGeometry
              args={[0.018, 0.72, 0.012]}
            />

            <meshBasicMaterial
              color="#170704"
            />
          </mesh>
        ))}

        {/* Horná masívna hrana korpusu */}
        <mesh
          position={[0, 0.43, 0]}
          castShadow
        >
          <boxGeometry
            args={[3.48, 0.22, 2.08]}
          />

          <meshStandardMaterial
            color="#633018"
            roughness={0.82}
            metalness={0.02}
          />
        </mesh>

        {/* Horný predný mosadzný pás */}
        <mesh
          position={[0, 0.43, 1.075]}
          castShadow
        >
          <boxGeometry
            args={[3.5, 0.2, 0.17]}
          />

          <meshStandardMaterial
            color="#a56e2c"
            roughness={0.48}
            metalness={0.74}
          />
        </mesh>

        {/* Svetlejšia hrana horného pásu */}
        <mesh
          position={[0, 0.49, 1.17]}
        >
          <boxGeometry
            args={[3.22, 0.035, 0.018]}
          />

          <meshStandardMaterial
            color="#ddb25d"
            roughness={0.32}
            metalness={0.82}
          />
        </mesh>

        {/* Spodný masívny rám */}
        <mesh
          position={[0, -0.92, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry
            args={[3.48, 0.25, 2.08]}
          />

          <meshStandardMaterial
            color="#3a180a"
            roughness={0.9}
            metalness={0.01}
          />
        </mesh>

        {/* Spodný predný kovový pás */}
        <mesh
          position={[0, -0.91, 1.075]}
          castShadow
        >
          <boxGeometry
            args={[3.5, 0.22, 0.17]}
          />

          <meshStandardMaterial
            color="#8d5a24"
            roughness={0.52}
            metalness={0.7}
          />
        </mesh>

        {/* Masívne predné bočné stĺpiky */}
        {[-1, 1].map((side) => (
          <group
            key={`front-column-${side}`}
            position={[
              side * 1.48,
              -0.24,
              1.08,
            ]}
          >
            <mesh castShadow>
              <boxGeometry
                args={[0.34, 1.16, 0.2]}
              />

              <meshStandardMaterial
                color="#704319"
                roughness={0.5}
                metalness={0.68}
              />
            </mesh>

            <mesh
              position={[
                side * 0.08,
                0,
                0.115,
              ]}
            >
              <boxGeometry
                args={[0.08, 1.02, 0.035]}
              />

              <meshStandardMaterial
                color="#c18a3c"
                roughness={0.38}
                metalness={0.8}
              />
            </mesh>

            <Rivet
              position={[0, 0.42, 0.14]}
              scale={0.82}
            />

            <Rivet
              position={[0, 0, 0.14]}
              scale={0.82}
            />

            <Rivet
              position={[0, -0.42, 0.14]}
              scale={0.82}
            />
          </group>
        ))}

        {/* Nity horného a spodného pásu.
            Stredný horný nit je vynechaný, aby neprechádzal cez znak M. */}
        {[
          -1.48,
          -0.74,
          0,
          0.74,
          1.48,
        ].map((xPosition) => (
          <group
            key={`frame-rivets-${xPosition}`}
          >
            {xPosition !== 0 && (
              <Rivet
                position={[
                  xPosition,
                  0.43,
                  1.18,
                ]}
                scale={0.86}
              />
            )}

            <Rivet
              position={[
                xPosition,
                -0.91,
                1.18,
              ]}
              scale={0.86}
            />
          </group>
        ))}

        {/* Spodné rohové kovania podľa 2D verzie */}
        {[-1, 1].map((side) => (
          <group
            key={`bottom-corner-${side}`}
            position={[
              side * 1.48,
              -0.79,
              1.17,
            ]}
          >
            <mesh castShadow>
              <boxGeometry
                args={[0.46, 0.44, 0.18]}
              />

              <meshStandardMaterial
                color="#7e4d1d"
                roughness={0.48}
                metalness={0.72}
              />
            </mesh>

            <mesh
              position={[
                side * 0.07,
                0.07,
                0.105,
              ]}
            >
              <boxGeometry
                args={[0.25, 0.18, 0.035]}
              />

              <meshStandardMaterial
                color="#bb8135"
                roughness={0.38}
                metalness={0.82}
              />
            </mesh>

            <Rivet
              position={[
                0,
                0.09,
                0.13,
              ]}
              scale={0.76}
            />

            <Rivet
              position={[
                0,
                -0.11,
                0.13,
              ]}
              scale={0.76}
            />
          </group>
        ))}

        {/* Číselný mechanizmus */}
        <CombinationLockPlate
          isReleased={isLockReleased}
        />

        {/* Bočné drevené steny */}
        {[-1, 1].map((side) => (
          <group
            key={`body-side-${side}`}
            position={[
              side * 1.69,
              -0.25,
              0,
            ]}
            rotation={[
              0,
              Math.PI / 2,
              0,
            ]}
          >
            <mesh castShadow>
              <boxGeometry
                args={[1.82, 1.25, 0.09]}
              />

              <meshStandardMaterial
                color="#42200e"
                roughness={0.92}
                metalness={0}
              />
            </mesh>

            <mesh
              position={[0, 0, 0.055]}
            >
              <boxGeometry
                args={[1.5, 0.93, 0.035]}
              />

              <meshStandardMaterial
                color="#713517"
                roughness={0.88}
                metalness={0.005}
              />
            </mesh>

            {[-0.5, 0, 0.5].map(
              (zPosition) => (
                <mesh
                  key={`side-board-${side}-${zPosition}`}
                  position={[
                    zPosition,
                    0,
                    0.08,
                  ]}
                >
                  <boxGeometry
                    args={[
                      0.025,
                      0.82,
                      0.012,
                    ]}
                  />

                  <meshBasicMaterial
                    color="#1d0905"
                  />
                </mesh>
              )
            )}
          </group>
        ))}

        {/* Dekoračné bočné úchytky */}
        <SideHandle side={-1} />
        <SideHandle side={1} />

        {/* =====================================================
            VNÚTORNÁ DUTINA
        ===================================================== */}

        <mesh
          position={[0, 0.37, 0]}
          castShadow
        >
          <boxGeometry
            args={[2.9, 0.25, 1.62]}
          />

          <meshStandardMaterial
            color="#130503"
            roughness={0.98}
            metalness={0}
          />
        </mesh>

        {/* Hlboká vnútorná zadná stena */}
        <mesh
          position={[0, 0.28, -0.45]}
        >
          <boxGeometry
            args={[2.72, 0.5, 0.1]}
          />

          <meshStandardMaterial
            color="#1d0905"
            roughness={0.98}
            metalness={0}
          />
        </mesh>

        {/* Kovová vnútorná obruba */}
        <mesh
          position={[0, 0.5, 0]}
          castShadow
        >
          <boxGeometry
            args={[3.04, 0.09, 1.76]}
          />

          <meshStandardMaterial
            color="#805020"
            roughness={0.52}
            metalness={0.67}
          />
        </mesh>

        {/* =====================================================
            VEKO – NOVÝ KOMPAKTNÝ OBLÚK
        ===================================================== */}

        <group
          ref={lidRef}
          position={[0, 0.55, -0.82]}
          rotation={[0, 0, 0]}
        >
          {/* Spodná pevná doska veka */}
          <mesh
            position={[0, 0.08, 0.82]}
            castShadow
            receiveShadow
          >
            <boxGeometry
              args={[3.34, 0.28, 1.9]}
            />

            <meshStandardMaterial
              color="#4c220f"
              roughness={0.86}
              metalness={0.01}
            />
          </mesh>

          {/* Hlavný oblúk veka */}
          <mesh
            position={[0, 0.25, 0.82]}
            rotation={[
              0,
              0,
              Math.PI / 2,
            ]}
            castShadow
            receiveShadow
          >
            <cylinderGeometry
              args={[
                0.95,
                0.95,
                3.34,
                64,
                1,
                false,
                0,
                Math.PI,
              ]}
            />

            <meshStandardMaterial
              color="#75401f"
              roughness={0.74}
              metalness={0}
              side={DoubleSide}
            />
          </mesh>

          {/* Druhá vnútorná vrstva oblúka */}
          <mesh
            position={[0, 0.245, 0.82]}
            rotation={[
              0,
              0,
              Math.PI / 2,
            ]}
          >
            <cylinderGeometry
              args={[
                0.9,
                0.9,
                3.12,
                64,
                1,
                false,
                0,
                Math.PI,
              ]}
            />

            <meshStandardMaterial
              color="#5f2f17"
              roughness={0.82}
              metalness={0}
              side={DoubleSide}
            />
          </mesh>

          {/* Predná samostatná polkruhová drevená doska bola odstránená.
              Oblúk teraz tvorí iba súvislý plášť veka, takže nad znakom M
              nezostáva žiadny vložený polkruh ani rovná nalepená plocha. */}

          {/* Čelo veka zostáva čisté bez centrálneho oblúka.
              Kovové pásy po bokoch naďalej kopírujú zakrivenie veka. */}

          {/* Znak M opticky prekrýva spoj veka a korpusu,
              ale zostáva súčasťou veka a otvorí sa spolu s ním */}
          <MysteriumEmblem />

          {/* Predná spodná hrana veka */}
          <mesh
            position={[
              0,
              0.07,
              1.84,
            ]}
            castShadow
          >
            <boxGeometry
              args={[3.48, 0.2, 0.17]}
            />

            <meshStandardMaterial
              color="#9d682b"
              roughness={0.48}
              metalness={0.72}
            />
          </mesh>

          {/* Svetlejšia línia spodnej hrany */}
          <mesh
            position={[
              0,
              0.12,
              1.94,
            ]}
          >
            <boxGeometry
              args={[3.2, 0.035, 0.018]}
            />

            <meshStandardMaterial
              color="#e3b967"
              roughness={0.32}
              metalness={0.84}
            />
          </mesh>

          {/* Dva kovové pásy presne kopírujúce oblúk */}
          {[-1.15, 1.15].map(
            (xPosition) => (
              <group
                key={`lid-band-${xPosition}`}
              >
                <mesh
                  position={[
                    xPosition,
                    0.25,
                    0.82,
                  ]}
                  rotation={[
                    0,
                    0,
                    Math.PI / 2,
                  ]}
                  castShadow
                >
                  <cylinderGeometry
                    args={[
                      0.985,
                      0.985,
                      0.17,
                      64,
                      1,
                      true,
                      0,
                      Math.PI,
                    ]}
                  />

                  <meshStandardMaterial
                    color="#c99742"
                    roughness={0.18}
                    metalness={0.95}
                    side={DoubleSide}
                  />
                </mesh>

              </group>
            )
          )}

          {/* Predný oblúk ostáva čistý.
              Samostatná valcová obruba bola odstránená, pretože
              vytvárala veľký odtrhnutý plášť mimo veka. */}

          {/* Bočné ukončenia veka vytvára priamo uzavretý polvalec.
              Samostatné bočné kruhy a obruby boli odstránené, pretože pri otočení
              vytvárali oddelené fragmenty mimo veka. */}

          {/* Zadné pánty */}
          {[-0.92, 0.92].map(
            (xPosition) => (
              <group
                key={`hinge-${xPosition}`}
                position={[
                  xPosition,
                  0.02,
                  -0.08,
                ]}
              >
                <mesh castShadow>
                  <boxGeometry
                    args={[
                      0.48,
                      0.16,
                      0.28,
                    ]}
                  />

                  <meshStandardMaterial
                    color="#765020"
                    roughness={0.5}
                    metalness={0.72}
                  />
                </mesh>

                <mesh
                  position={[0, 0, 0.17]}
                  rotation={[
                    Math.PI / 2,
                    0,
                    0,
                  ]}
                >
                  <cylinderGeometry
                    args={[
                      0.07,
                      0.07,
                      0.52,
                      20,
                    ]}
                  />

                  <meshStandardMaterial
                    color="#c18a3b"
                    roughness={0.4}
                    metalness={0.8}
                  />
                </mesh>
              </group>
            )
          )}
        </group>

        {/* =====================================================
            NOHY TRUHLICE
        ===================================================== */}

        {[
          [-1.3, -1.08, 0.66],
          [1.3, -1.08, 0.66],
          [-1.3, -1.08, -0.66],
          [1.3, -1.08, -0.66],
        ].map(([x, y, z], index) => (
          <group
            key={`chest-foot-${index}`}
            position={[x, y, z]}
          >
            <mesh
              castShadow
              receiveShadow
            >
              <boxGeometry
                args={[0.38, 0.34, 0.42]}
              />

              <meshStandardMaterial
                color="#321408"
                roughness={0.94}
                metalness={0}
              />
            </mesh>

            <mesh
              position={[0, -0.13, 0.04]}
            >
              <boxGeometry
                args={[0.3, 0.14, 0.34]}
              />

              <meshStandardMaterial
                color="#1d0905"
                roughness={0.98}
                metalness={0}
              />
            </mesh>
          </group>
        ))}

        {/* Existujúce filmové efekty */}
        <InnerLight
          isVisible={isLightVisible}
        />

        <ChestParticles
          isVisible={
            areParticlesVisible
          }
        />
      </group>

      <FloatingFragments
        isVisible={
          areFragmentsVisible
        }
        onRewardClick={
          onRewardClick
        }
      />
    </>
  );
}

export function Chest3D({
  isFocused = false,
  isUnlocked = false,
  onSelect,
  onRewardClick,
}: Chest3DProps) {
  return (
    <div className="relative mx-auto h-[440px] w-full max-w-md overflow-hidden rounded-[2rem] border border-amber-300/15 bg-gradient-to-b from-slate-950 via-[#07080d] to-black shadow-2xl shadow-black/60">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{
          position: [4.8, 3.15, 6.5],
          fov: 38,
          near: 0.1,
          far: 100,
        }}
      >
        <Suspense fallback={null}>
          <color
            attach="background"
            args={["#080a0f"]}
          />

          <fog
            attach="fog"
            args={["#080a0f", 9, 19]}
          />

          <CameraRig
            isFocused={isFocused}
          />

          <ambientLight
            intensity={0.72}
            color="#fff0d2"
          />

          <hemisphereLight
            args={["#f7d9a1", "#1a2438", 1.1]}
          />

          <directionalLight
            position={[4, 6, 5]}
            intensity={2.85}
            color="#ffe0a3"
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />

          <pointLight
            position={[-3, 2, 2]}
            intensity={1.5}
            color="#8fa8ff"
          />

          <spotLight
            position={[0, 5, 4]}
            angle={0.45}
            penumbra={0.82}
            intensity={3.35}
            color="#ffc96f"
            castShadow
          />

          <pointLight
            position={[0, 0.4, 5.2]}
            intensity={1.35}
            distance={9}
            color="#ffdca0"
          />

          <pointLight
            position={[3.6, 1.8, -2.5]}
            intensity={1.05}
            distance={8}
            color="#d58a3d"
          />

          <ChestPrototype
            isFocused={isFocused}
            isUnlocked={isUnlocked}
            onSelect={onSelect}
            onRewardClick={
              onRewardClick
            }
          />

          <ContactShadows
            position={[0, -1.22, 0]}
            opacity={0.6}
            scale={8}
            blur={2.7}
            far={5}
          />
        </Suspense>
      </Canvas>

      {!isFocused &&
        !isUnlocked && (
          <div className="pointer-events-none absolute inset-x-0 bottom-5 text-center">
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.28em] text-amber-400/70">
              Potiahni pre otočenie
            </p>

            <p className="mt-2 text-xs text-slate-400">
              Klikni na zámok a
              preskúmaj mechanizmus
            </p>
          </div>
        )}

      {isFocused &&
        !isUnlocked && (
          <div className="pointer-events-none absolute inset-x-0 bottom-5 text-center">
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.28em] text-amber-300">
              Detail zámku
            </p>
          </div>
        )}

      {isUnlocked && (
        <div className="pointer-events-none absolute inset-x-0 bottom-5 text-center">
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.28em] text-amber-300">
            Tajomstvo odhalené
          </p>

          <p className="mt-2 text-xs text-amber-100/70">
            Dotkni sa útržkov nad
            truhlicou
          </p>
        </div>
      )}
    </div>
  );
}
"use client";

/*
 * Časti vzhľadu truhlice (nity, rohové kovanie, rúčka, emblém), ktoré
 * používa pôvodný model (ChestModel.tsx) aj 3D truhlica vo finále.
 */

export function Rivet({
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

export function CornerPlate({
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

export function SideHandle({ side }: { side: -1 | 1 }) {
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

/** Mosadzný medailón so znakom M. Poloha sa dá zmeniť (pôvodne na veku). */
export function MysteriumEmblem({
  position = [0, -0.08, 1.965],
}: {
  position?: [number, number, number];
}) {
  const darkMetal = "#3a210d";
  const brass = "#c58b3c";
  const brassHighlight = "#f0c66d";

  return (
    <group position={position}>
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

"use client";

import { ContactShadows } from "@react-three/drei";
import { Canvas, type RootState } from "@react-three/fiber";
import { Suspense, useCallback } from "react";
import {
  ChestCameraRig,
  getChestCameraPreset,
} from "./ChestCameraRig";
import { ChestPrototype } from "./ChestModel";
import type {
  Chest3DProps,
  ChestPresentation,
} from "./chest3DTypes";

type ChestSceneProps = Required<
  Pick<Chest3DProps, "isFocused" | "isUnlocked">
> &
  Pick<Chest3DProps, "onSelect" | "onRewardClick"> & {
    presentation: ChestPresentation;
  };

export function ChestScene({
  isFocused,
  isUnlocked,
  onSelect,
  onRewardClick,
  presentation,
}: ChestSceneProps) {
  const initializeCamera = useCallback(
    ({ camera, size }: RootState) => {
      const preset = getChestCameraPreset(
        presentation,
        isFocused,
        {
          width: size.width,
          height: size.height,
        }
      );

      camera.position.set(...preset.position);
      camera.lookAt(...preset.target);

      if ("fov" in camera) {
        camera.fov = preset.fov;
        camera.aspect =
          size.width / Math.max(size.height, 1);
        camera.updateProjectionMatrix();
      }
    },
    [isFocused, presentation]
  );

  const fallbackPreset = getChestCameraPreset(
    presentation,
    isFocused
  );

  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      }}
      onCreated={initializeCamera}
      resize={{
        scroll: false,
        debounce: {
          scroll: 0,
          resize: 0,
        },
      }}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        background: "transparent",
      }}
      camera={{
        position: fallbackPreset.position,
        fov: fallbackPreset.fov,
        near: 0.1,
        far: 100,
      }}
    >
      <Suspense fallback={null}>
        {presentation === "default" && (
          <color attach="background" args={["#080a0f"]} />
        )}

        <fog attach="fog" args={["#080a0f", 9, 19]} />

        <ChestCameraRig
          isFocused={isFocused}
          presentation={presentation}
        />

        <ambientLight intensity={0.68} color="#fff0d2" />
        <hemisphereLight
          args={["#f7d9a1", "#1a2438", 0.95]}
        />

        <directionalLight
          position={[4, 6, 5]}
          intensity={2.45}
          color="#ffe0a3"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        <pointLight
          position={[-3, 2, 2]}
          intensity={1.15}
          color="#8fa8ff"
        />

        <pointLight
          position={[0, 0.4, 5.2]}
          intensity={0.85}
          distance={8}
          color="#ffdca0"
        />

        <pointLight
          position={[3.6, 1.8, -2.5]}
          intensity={0.8}
          distance={8}
          color="#d58a3d"
        />

        <ChestPrototype
          isFocused={isFocused}
          isUnlocked={isUnlocked}
          presentation={presentation}
          onSelect={onSelect}
          onRewardClick={onRewardClick}
        />

        <ContactShadows
          position={[0, -1.22, 0]}
          opacity={0.52}
          scale={8}
          blur={2.7}
          far={5}
        />
      </Suspense>
    </Canvas>
  );
}

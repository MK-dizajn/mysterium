"use client";

import { Canvas } from "@react-three/fiber";
import type { ReactNode } from "react";

type InspectStageProps = {
  children: ReactNode;
  /** 3D prestalo fungovať (napríklad sa stratil grafický kontext). */
  onFailure: () => void;
};

/**
 * Spoločný „stôl“ pre 3D predmety na obrazovke „Prezrieť“:
 * jedno plátno, svetlo a kamera. Kreslí iba vtedy, keď sa niečo hýbe.
 */
export function InspectStage({ children, onFailure }: InspectStageProps) {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 3.3], fov: 40, near: 0.1, far: 20 }}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", (event) => {
          event.preventDefault();
          onFailure();
        });
      }}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        background: "transparent",
        touchAction: "none",
      }}
    >
      <ambientLight intensity={0.9} color="#fff0d2" />
      <directionalLight
        position={[2.5, 3, 4]}
        intensity={2.4}
        color="#ffe0a3"
      />
      <pointLight
        position={[-3, -1, 3]}
        intensity={0.8}
        color="#8fa8ff"
      />

      {children}
    </Canvas>
  );
}

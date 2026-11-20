"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { type RefObject, useEffect, useRef } from "react";
import { HalfFloatType, type Material, type Mesh, type Scene, type Texture } from "three";
import { isProbeTooSlow, PROBE_FRAMES, PROBE_MAX_MS } from "./chestQuality";

/**
 * Odlesky okolia pre mosadz (iba plná verzia): malá „miestnosť“ so svetlami
 * vytvorená v kóde a nakreslená raz (nič sa nesťahuje).
 */
export function ChestEnvironment() {
  return (
    <Environment frames={1} resolution={64}>
      <Lightformer form="rect" intensity={2.4} color="#ffe2b0" position={[-3, 3, 3]} scale={[4, 2, 1]} />
      <Lightformer form="rect" intensity={1.2} color="#fff4e0" position={[3, 2, 2]} scale={[3, 2, 1]} />
      <Lightformer form="ring" intensity={0.8} color="#ffcf8a" position={[0, 4, -3]} scale={2} />
      <Lightformer form="rect" intensity={0.4} color="#6a7fb0" position={[0, -3, 0]} rotation-x={Math.PI / 2} scale={[6, 6, 1]} />
    </Environment>
  );
}

/** Snímky na zahriatie (prvé sa zdržia pri príprave tieňov a textúr) – nemerajú sa. */
const PROBE_WARMUP_FRAMES = 5;
/** Čas, ktorý sa na zahriatie toleruje navyše k najdlhšiemu meraniu. */
const PROBE_WARMUP_MS = 500;

/**
 * Meranie: po zahriatí 30 snímok za sebou. Ak sú v priemere pomalšie ako
 * 30 snímok za sekundu, truhlica prejde na ľahkú verziu.
 */
export function QualityProbe({ onDone }: { onDone: (isSlow: boolean) => void }) {
  const invalidate = useThree((state) => state.invalidate);
  const framesRef = useRef<number[]>([]);
  const countRef = useRef(0);
  const lastRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const isDoneRef = useRef(false);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  });

  useEffect(() => {
    invalidate();
  }, [invalidate]);

  useFrame(() => {
    if (isDoneRef.current) {
      return;
    }

    const now = performance.now();
    countRef.current += 1;

    startRef.current ??= now;

    if (lastRef.current !== null && countRef.current > PROBE_WARMUP_FRAMES) {
      framesRef.current.push(now - lastRef.current);
    }

    lastRef.current = now;

    // Príliš pomalé: meranie (aj so zahriatím) by trvalo dlhšie ako 2 s
    // plus pol sekundy na zahriatie → ľahká verzia hneď.
    if (now - startRef.current > PROBE_MAX_MS + PROBE_WARMUP_MS) {
      isDoneRef.current = true;
      onDoneRef.current(true);
      return;
    }

    if (framesRef.current.length >= PROBE_FRAMES) {
      isDoneRef.current = true;
      onDoneRef.current(isProbeTooSlow(framesRef.current));
      return;
    }

    invalidate();
  });

  return null;
}

const TEXTURE_KEYS = [
  "map",
  "bumpMap",
  "normalMap",
  "roughnessMap",
  "metalnessMap",
  "emissiveMap",
  "alphaMap",
  "aoMap",
] as const;

function textureBytes(texture: Texture) {
  const image = texture.image as { width?: number; height?: number } | undefined;

  if (!image?.width || !image.height) {
    return 0;
  }

  const bytesPerPixel = texture.type === HalfFloatType ? 8 : 4;
  // Zmenšené kópie (mipmapy) pridajú asi tretinu.
  const mipmaps = texture.generateMipmaps ? 4 / 3 : 1;

  return image.width * image.height * bytesPerPixel * mipmaps;
}

/** Odhad grafickej pamäte textúr v scéne (každý obrázok raz) v MB. */
export function estimateTextureMB(scene: Scene) {
  const seen = new Set<string>();
  let bytes = 0;

  const add = (texture: Texture | null | undefined) => {
    if (!texture) {
      return;
    }

    const key = texture.source?.uuid ?? texture.uuid;

    if (seen.has(key)) {
      return;
    }

    seen.add(key);
    bytes += textureBytes(texture);
  };

  scene.traverse((object) => {
    const materials = (object as Mesh).material;

    if (!materials) {
      return;
    }

    (Array.isArray(materials) ? materials : [materials]).forEach((material: Material) => {
      const record = material as unknown as Record<string, Texture | null | undefined>;
      TEXTURE_KEYS.forEach((key) => add(record[key]));
    });
  });

  add(scene.environment);

  return bytes / (1024 * 1024);
}

/**
 * Údaje pre testy a ladiaci text: počet kreslení, trojuholníkov a textúr
 * poslednej snímky a odhad pamäte textúr. Zapisuje sa priamo do atribútov
 * okna truhlice (bez prekresľovania Reactu).
 */
export function ChestStats({
  rootRef,
  debugRef,
  qualityLabel,
}: {
  rootRef: RefObject<HTMLDivElement | null>;
  debugRef: RefObject<HTMLParagraphElement | null>;
  qualityLabel: string;
}) {
  const lastRef = useRef("");

  useFrame(({ gl, scene }) => {
    const root = rootRef.current;
    const { calls, triangles } = gl.info.render;

    if (!root || calls === 0) {
      return;
    }

    const textures = gl.info.memory.textures;
    const signature = `${calls}/${triangles}/${textures}/${qualityLabel}`;

    if (signature === lastRef.current) {
      return;
    }

    lastRef.current = signature;
    const megabytes = estimateTextureMB(scene);
    root.dataset.chestCalls = String(calls);
    root.dataset.chestTriangles = String(triangles);
    root.dataset.chestTextures = String(textures);
    root.dataset.chestTextureMb = megabytes.toFixed(1);

    if (debugRef.current) {
      debugRef.current.textContent = `Truhlica: ${qualityLabel} · ${calls} kreslení · ${triangles.toLocaleString("sk-SK")} trojuholníkov · ${megabytes.toFixed(1).replace(".", ",")} MB`;
    }
  });

  return null;
}

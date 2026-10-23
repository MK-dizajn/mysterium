"use client";

import { useMemo } from "react";
import {
  getTokenDigitPlateSvg,
  getTokenFaceTextureSvg,
  getTokenGrooveTileSvg,
} from "../art/tokenArt";
import { useSvgTexture } from "./useSvgTexture";

export const TOKEN_RADIUS = 1;
const TOKEN_THICKNESS = 0.24;
const DIGIT_PLATE_WIDTH = 0.18;
const DIGIT_PLATE_HEIGHT = 0.28;

/** Miesto s vyrytou číslicou na hrane (lokálna os +X), tu je aj tlačidlo. */
export const DIGIT_HOTSPOT_POSITION: [number, number, number] = [
  TOKEN_RADIUS + 0.06,
  0,
  0,
];

const FACE_SVG = getTokenFaceTextureSvg();
const GROOVE_SVG = getTokenGrooveTileSvg();
const GROOVE_REPEAT: [number, number] = [80, 1];

type TokenModelProps = {
  digit: string;
  isDigitFound: boolean;
};

/**
 * 3D mosadzný žetón: valec s ryhovanou hranou, líce a rub z kresby
 * v tokenArt.ts a hladká plôška s vyrytou číslicou na hrane.
 * Os žetónu smeruje ku kamere, takže na začiatku hráč vidí líce.
 */
export function TokenModel({ digit, isDigitFound }: TokenModelProps) {
  const plateSvg = useMemo(
    () => getTokenDigitPlateSvg(digit, isDigitFound),
    [digit, isDigitFound]
  );

  const faceTexture = useSvgTexture(FACE_SVG, 1024, 1024);
  const grooveTexture = useSvgTexture(GROOVE_SVG, 32, 128, GROOVE_REPEAT);
  const plateTexture = useSvgTexture(plateSvg, 480, 720);

  // Textúry prichádzajú až po prvom vykreslení. three.js zostaví shader
  // materiálu iba raz, preto sa materiál po príchode textúry vytvorí
  // nanovo (key) – inak by sa textúra nikdy nezobrazila.
  return (
    <group>
      {/* Ryhovaná hrana – valec bez podstáv, otočený osou ku kamere */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry
          args={[TOKEN_RADIUS, TOKEN_RADIUS, TOKEN_THICKNESS, 128, 1, true]}
        />
        <meshStandardMaterial
          key={grooveTexture ? "grooves" : "plain"}
          color={grooveTexture ? "#ffffff" : "#c99b4b"}
          map={grooveTexture}
          bumpMap={grooveTexture}
          bumpScale={0.6}
          metalness={0.35}
          roughness={0.45}
        />
      </mesh>

      {/* Líce */}
      <mesh position={[0, 0, TOKEN_THICKNESS / 2]}>
        <circleGeometry args={[TOKEN_RADIUS, 128]} />
        <meshStandardMaterial
          key={faceTexture ? "face" : "plain"}
          color={faceTexture ? "#ffffff" : "#d1a14a"}
          map={faceTexture}
          metalness={0.25}
          roughness={0.5}
        />
      </mesh>

      {/* Rub */}
      <mesh
        position={[0, 0, -TOKEN_THICKNESS / 2]}
        rotation={[0, Math.PI, 0]}
      >
        <circleGeometry args={[TOKEN_RADIUS, 128]} />
        <meshStandardMaterial
          key={faceTexture ? "face" : "plain"}
          color={faceTexture ? "#ffffff" : "#d1a14a"}
          map={faceTexture}
          metalness={0.25}
          roughness={0.5}
        />
      </mesh>

      {/* Hladká plôška s vyrytou číslicou na hrane */}
      <mesh
        position={[TOKEN_RADIUS + 0.003, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <planeGeometry args={[DIGIT_PLATE_WIDTH, DIGIT_PLATE_HEIGHT]} />
        <meshStandardMaterial
          key={plateTexture ? "plate" : "plain"}
          color={plateTexture ? "#ffffff" : "#c99b4b"}
          map={plateTexture}
          metalness={0.2}
          roughness={0.5}
        />
      </mesh>
    </group>
  );
}

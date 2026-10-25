"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { CanvasTexture, DoubleSide, type Group, SRGBColorSpace } from "three";
import { PHOTO_PIECE_POINTS, type PhotoPoint } from "../photoPieces";
import type { OpeningFrame } from "./chestZoom";

const CANVAS_HEIGHT_PX = 384;
/** Výška útržku v súradniciach truhlice. */
const FRAGMENT_HEIGHT = 1.15;
/** Útržok vystúpi zo stredu truhlice sem (nad otvorené veko). */
const FRAGMENT_START_Y = 0.45;
const FRAGMENT_RISE = 1.3;
const PAPER = "#d8c39d";
const PAPER_EDGE = "#f1e4c3";

/** Útržok fotografie nakreslený do textúry (najprv papier, po načítaní aj obrázok). */
class FragmentPicture {
  readonly texture: CanvasTexture;
  readonly aspect: number;
  private readonly canvas: HTMLCanvasElement;
  private readonly points: PhotoPoint[];
  private readonly box: { left: number; top: number; width: number; height: number };

  constructor(points: PhotoPoint[]) {
    const xs = points.map(([x]) => x);
    const ys = points.map(([, y]) => y);
    const left = Math.min(...xs);
    const top = Math.min(...ys);

    this.points = points;
    this.box = { left, top, width: Math.max(...xs) - left, height: Math.max(...ys) - top };
    // Fotografia má pomer 4 : 3.
    this.aspect = (this.box.width * 4) / (this.box.height * 3);
    this.canvas = document.createElement("canvas");
    this.canvas.width = Math.round(CANVAS_HEIGHT_PX * this.aspect);
    this.canvas.height = CANVAS_HEIGHT_PX;
    this.texture = new CanvasTexture(this.canvas);
    this.texture.colorSpace = SRGBColorSpace;
    this.draw(null);
  }

  /** Nakreslí útržok; bez obrázka (alebo keď sa nenačíta) iba sépiový papier. */
  draw(image: HTMLImageElement | null) {
    const context = this.canvas.getContext("2d");

    if (!context) {
      return;
    }

    const { width, height } = this.canvas;
    const { left, top, width: boxWidth, height: boxHeight } = this.box;

    context.clearRect(0, 0, width, height);
    context.beginPath();
    this.points.forEach(([x, y], index) => {
      const px = ((x - left) / boxWidth) * width;
      const py = ((y - top) / boxHeight) * height;

      if (index === 0) {
        context.moveTo(px, py);
      } else {
        context.lineTo(px, py);
      }
    });
    context.closePath();

    context.save();
    context.clip();
    context.fillStyle = PAPER;
    context.fillRect(0, 0, width, height);

    if (image) {
      context.drawImage(
        image,
        (left / 100) * image.naturalWidth,
        (top / 100) * image.naturalHeight,
        (boxWidth / 100) * image.naturalWidth,
        (boxHeight / 100) * image.naturalHeight,
        0,
        0,
        width,
        height
      );
    }

    context.restore();
    // Svetlý roztrhnutý okraj papiera.
    context.strokeStyle = PAPER_EDGE;
    context.lineWidth = 5;
    context.stroke();
    this.texture.needsUpdate = true;
  }

  dispose() {
    this.texture.dispose();
  }
}

type PhotoFragment3DProps = {
  /** Obrázok historickej fotografie z dát (rovnaký ako pri skladaní). */
  imageSrc: string | undefined;
  /** Ktorý zo štyroch útržkov (0 až 3). */
  pieceIndex: number;
  readOpening: () => OpeningFrame;
};

/** Štvrtý útržok fotografie: vystúpi z otvorenej truhlice a ostane sa vznášať. */
export function PhotoFragment3D({ imageSrc, pieceIndex, readOpening }: PhotoFragment3DProps) {
  const invalidate = useThree((state) => state.invalidate);
  const groupRef = useRef<Group>(null);
  const picture = useMemo(
    () => new FragmentPicture(PHOTO_PIECE_POINTS[pieceIndex] ?? PHOTO_PIECE_POINTS[3]),
    [pieceIndex]
  );

  useEffect(() => () => picture.dispose(), [picture]);

  useEffect(() => {
    if (!imageSrc) {
      return;
    }

    let isActive = true;
    const image = new Image();
    image.onload = () => {
      if (isActive) {
        picture.draw(image);
        invalidate();
      }
    };
    image.src = imageSrc;

    return () => {
      isActive = false;
    };
  }, [imageSrc, picture, invalidate]);

  useFrame(() => {
    const { fragment } = readOpening();
    const group = groupRef.current;

    if (!group) {
      return;
    }

    group.visible = fragment > 0;
    group.position.set(0, FRAGMENT_START_Y + FRAGMENT_RISE * fragment, 0.05);
    group.scale.setScalar(0.3 + 0.7 * fragment);
  });

  return (
    <group ref={groupRef} visible={false}>
      {/* Natočený ku kamere (truhlica je naklonená) a trochu šikmo. */}
      <mesh rotation={[-0.32, 0, -0.07]}>
        <planeGeometry args={[FRAGMENT_HEIGHT * picture.aspect, FRAGMENT_HEIGHT]} />
        <meshStandardMaterial
          map={picture.texture}
          emissive="#ffffff"
          emissiveMap={picture.texture}
          emissiveIntensity={0.3}
          transparent
          alphaTest={0.5}
          side={DoubleSide}
          roughness={0.9}
          metalness={0}
        />
      </mesh>
    </group>
  );
}

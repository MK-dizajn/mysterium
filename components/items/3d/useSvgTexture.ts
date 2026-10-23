"use client";

import { useEffect, useState } from "react";
import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from "three";

/**
 * Nakreslí SVG (text) na plátno v danom rozlíšení a vráti z neho textúru.
 * Kým sa obrázok nenačíta, vráti null. Pri zmene alebo zániku textúru uvoľní.
 */
export function useSvgTexture(
  svg: string,
  width: number,
  height: number,
  repeat?: [number, number]
) {
  const [texture, setTexture] = useState<CanvasTexture | null>(null);
  const repeatX = repeat?.[0];
  const repeatY = repeat?.[1];

  useEffect(() => {
    let isCancelled = false;
    let createdTexture: CanvasTexture | null = null;
    const image = new Image();

    image.onload = () => {
      if (isCancelled) {
        return;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d")?.drawImage(image, 0, 0, width, height);

      createdTexture = new CanvasTexture(canvas);
      createdTexture.colorSpace = SRGBColorSpace;

      if (repeatX !== undefined && repeatY !== undefined) {
        createdTexture.wrapS = RepeatWrapping;
        createdTexture.wrapT = RepeatWrapping;
        createdTexture.repeat.set(repeatX, repeatY);
      }

      setTexture(createdTexture);
    };

    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

    return () => {
      isCancelled = true;
      createdTexture?.dispose();
    };
  }, [svg, width, height, repeatX, repeatY]);

  return texture;
}

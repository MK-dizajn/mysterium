"use client";

import { useEffect, useRef, useState } from "react";
import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from "three";

/**
 * Nakreslí SVG (text) na plátno v danom rozlíšení a vráti z neho textúru.
 * Kým sa obrázok nenačíta, vráti null. Pri výmene SVG sa stará textúra
 * uvoľní až po nasadení novej; pri zániku komponentu sa uvoľní posledná.
 */
export function useSvgTexture(
  svg: string,
  width: number,
  height: number,
  repeat?: [number, number]
) {
  const [texture, setTexture] = useState<CanvasTexture | null>(null);
  const latestTextureRef = useRef<CanvasTexture | null>(null);
  const repeatX = repeat?.[0];
  const repeatY = repeat?.[1];

  useEffect(() => {
    let isCancelled = false;
    const image = new Image();

    image.onload = () => {
      if (isCancelled) {
        return;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d")?.drawImage(image, 0, 0, width, height);

      const createdTexture = new CanvasTexture(canvas);
      createdTexture.colorSpace = SRGBColorSpace;

      if (repeatX !== undefined && repeatY !== undefined) {
        createdTexture.wrapS = RepeatWrapping;
        createdTexture.wrapT = RepeatWrapping;
        createdTexture.repeat.set(repeatX, repeatY);
      }

      const previousTexture = latestTextureRef.current;
      latestTextureRef.current = createdTexture;
      setTexture(createdTexture);

      // Starú textúru uvoľníme až po vykreslení s novou.
      if (previousTexture) {
        window.requestAnimationFrame(() => previousTexture.dispose());
      }
    };

    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

    return () => {
      isCancelled = true;
      image.onload = null;
    };
  }, [svg, width, height, repeatX, repeatY]);

  useEffect(() => {
    const textureRef = latestTextureRef;

    return () => {
      textureRef.current?.dispose();
      textureRef.current = null;
    };
  }, []);

  return texture;
}

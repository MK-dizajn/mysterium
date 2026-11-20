/**
 * Textúry 3D truhlice kreslené kódom (úprava 4, krok T1): nič sa nesťahuje.
 * Kreslia sa raz pri otvorení obrazovky truhlice a pri odchode sa uvoľnia.
 *
 * - drevo 512 × 512: päť dosiek so škárami (planks), letokruhy (grain),
 *   suky (knots), škrabance (scratches), ošúchané a otlčené hrany (worn);
 *   tá istá kresba slúži aj ako reliéf (tmavé = hlbšie),
 * - železo 256 × 256: tmavý kov s hrdzavými škvrnami.
 */

import {
  CanvasTexture,
  RepeatWrapping,
  SRGBColorSpace,
  type Texture,
} from "three";

export const WOOD_TEXTURE_SIZE = 512;
export const IRON_TEXTURE_SIZE = 256;
const PLANK_COUNT = 5;

/** Pevná náhoda – drevo vyzerá pri každom načítaní rovnako. */
function createRandom(seed: number) {
  let state = seed;

  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;

    return state / 4294967296;
  };
}

function createCanvas(size: number) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  return { canvas, context: canvas.getContext("2d") };
}

function drawWood() {
  const size = WOOD_TEXTURE_SIZE;
  const { canvas, context } = createCanvas(size);

  if (!context) {
    return canvas;
  }

  const random = createRandom(1886);
  const plankHeight = size / PLANK_COUNT;

  // planks: každá doska trochu iný odtieň
  for (let plank = 0; plank < PLANK_COUNT; plank += 1) {
    const top = plank * plankHeight;
    const shade = 0.85 + random() * 0.3;
    const gradient = context.createLinearGradient(0, top, 0, top + plankHeight);
    gradient.addColorStop(0, `rgb(${Math.round(92 * shade)}, ${Math.round(56 * shade)}, ${Math.round(30 * shade)})`);
    gradient.addColorStop(1, `rgb(${Math.round(70 * shade)}, ${Math.round(41 * shade)}, ${Math.round(21 * shade)})`);
    context.fillStyle = gradient;
    context.fillRect(0, top, size, plankHeight);

    // grain: vlnité letokruhy pozdĺž dosky
    for (let line = 0; line < 46; line += 1) {
      const baseY = top + random() * plankHeight;
      const amplitude = 1 + random() * 3.5;
      const wave = 0.004 + random() * 0.01;
      const phase = random() * Math.PI * 2;
      const isDark = random() < 0.7;

      context.strokeStyle = isDark
        ? `rgba(28, 14, 6, ${0.12 + random() * 0.28})`
        : `rgba(150, 102, 62, ${0.08 + random() * 0.16})`;
      context.lineWidth = 0.6 + random() * 1.6;
      context.beginPath();

      for (let x = 0; x <= size; x += 8) {
        const y = baseY + Math.sin(x * wave + phase) * amplitude;

        if (x === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      }

      context.stroke();
    }

    // knots: suk so sústrednými krúžkami
    if (random() < 0.75) {
      const knotX = 40 + random() * (size - 80);
      const knotY = top + plankHeight * (0.3 + random() * 0.4);

      for (let ring = 7; ring >= 1; ring -= 1) {
        context.strokeStyle = `rgba(30, 15, 6, ${0.12 + ring * 0.035})`;
        context.lineWidth = 1.2;
        context.beginPath();
        context.ellipse(knotX, knotY, ring * 3.4, ring * 1.6, 0, 0, Math.PI * 2);
        context.stroke();
      }

      context.fillStyle = "rgba(22, 10, 4, 0.75)";
      context.beginPath();
      context.ellipse(knotX, knotY, 3.5, 2, 0, 0, Math.PI * 2);
      context.fill();
    }

    // škára medzi doskami: tmavá ryha a svetlá hrana pod ňou
    context.fillStyle = "rgba(12, 6, 2, 0.95)";
    context.fillRect(0, top, size, 3);
    context.fillStyle = "rgba(160, 112, 70, 0.35)";
    context.fillRect(0, top + 3, size, 1);
  }

  // scratches: krátke svetlé škrabance
  for (let scratch = 0; scratch < 38; scratch += 1) {
    const x = random() * size;
    const y = random() * size;
    const angle = (random() - 0.5) * 0.9;
    const length = 8 + random() * 34;

    context.strokeStyle = `rgba(190, 140, 92, ${0.1 + random() * 0.2})`;
    context.lineWidth = 0.6 + random() * 0.8;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
    context.stroke();
  }

  // worn: ošúchané svetlejšie okraje a otlčené miesta na hranách plochy
  const edge = 26;
  const sides: [number, number, number, number][] = [
    [0, 0, size, edge],
    [0, size - edge, size, edge],
    [0, 0, edge, size],
    [size - edge, 0, edge, size],
  ];

  sides.forEach(([x, y, width, height], index) => {
    const gradient =
      index < 2
        ? context.createLinearGradient(0, index === 0 ? 0 : size, 0, index === 0 ? edge : size - edge)
        : context.createLinearGradient(index === 2 ? 0 : size, 0, index === 2 ? edge : size - edge, 0);
    gradient.addColorStop(0, "rgba(176, 128, 82, 0.32)");
    gradient.addColorStop(1, "rgba(176, 128, 82, 0)");
    context.fillStyle = gradient;
    context.fillRect(x, y, width, height);
  });

  for (let chip = 0; chip < 40; chip += 1) {
    const alongEdge = random() * size;
    const side = Math.floor(random() * 4);
    const depth = random() * 7;
    const x = side === 0 ? alongEdge : side === 1 ? alongEdge : side === 2 ? depth : size - depth;
    const y = side === 0 ? depth : side === 1 ? size - depth : alongEdge;

    context.fillStyle = `rgba(${random() < 0.5 ? "200, 150, 100" : "20, 10, 4"}, ${0.25 + random() * 0.3})`;
    context.beginPath();
    context.ellipse(x, y, 2 + random() * 5, 1 + random() * 3, random() * Math.PI, 0, Math.PI * 2);
    context.fill();
  }

  return canvas;
}

function drawIron() {
  const size = IRON_TEXTURE_SIZE;
  const { canvas, context } = createCanvas(size);

  if (!context) {
    return canvas;
  }

  const random = createRandom(1805);
  context.fillStyle = "#34312d";
  context.fillRect(0, 0, size, size);

  // jemná nerovnosť kovu
  for (let speck = 0; speck < 900; speck += 1) {
    const light = random() < 0.5;
    context.fillStyle = light
      ? `rgba(120, 116, 108, ${random() * 0.25})`
      : `rgba(10, 9, 8, ${random() * 0.35})`;
    context.fillRect(random() * size, random() * size, 1 + random() * 2, 1 + random() * 2);
  }

  // hrdzavé škvrny
  for (let rust = 0; rust < 14; rust += 1) {
    const x = random() * size;
    const y = random() * size;
    const radius = 6 + random() * 22;
    const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, `rgba(122, 64, 26, ${0.35 + random() * 0.3})`);
    gradient.addColorStop(1, "rgba(122, 64, 26, 0)");
    context.fillStyle = gradient;
    context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }

  return canvas;
}

function toTexture(canvas: HTMLCanvasElement) {
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.anisotropy = 4;

  return texture;
}

export type ChestTextures = {
  wood: Texture;
  /** Reliéf dreva (tá istá kresba bez farebného priestoru). */
  woodBump: Texture;
  iron: Texture;
  /** Kópia dreva s iným opakovaním (zdieľa obrázok, pamäť navyše netreba). */
  woodVariant: (repeatX: number, repeatY: number, offsetY?: number) => Texture;
  dispose: () => void;
};

/** Vytvorí textúry truhlice (iba v prehliadači). */
export function createChestTextures(): ChestTextures {
  const woodCanvas = drawWood();
  const wood = toTexture(woodCanvas);
  // Reliéf z tej istej textúry (bez druhej kópie v pamäti).
  const woodBump = wood;
  const iron = toTexture(drawIron());
  const variants: Texture[] = [];

  return {
    wood,
    woodBump,
    iron,
    woodVariant(repeatX, repeatY, offsetY = 0) {
      const variant = wood.clone();
      variant.repeat.set(repeatX, repeatY);
      variant.offset.set(0, offsetY);
      variants.push(variant);

      return variant;
    },
    dispose() {
      [wood, iron, ...variants].forEach((texture) => texture.dispose());
    },
  };
}

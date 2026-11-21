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
/** Krok T3: znak hry, rytina rohov a zamat vnútra. */
export const EMBLEM_TEXTURE_SIZE = 256;
export const ENGRAVING_TEXTURE_SIZE = 128;
export const VELVET_TEXTURE_SIZE = 256;
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

/**
 * Znak hry na medailóne (rovnaký ako pečať v scéne 9, iba v mosadzi):
 * kruh s čiarkami (ticks) ako na ciferníku kompasu, osemcípa kompasová
 * ružica (compass) a v strede písmeno M s pätkami. Svetlé = vystúpené.
 */
function drawEmblem() {
  const size = EMBLEM_TEXTURE_SIZE;
  const { canvas, context } = createCanvas(size);

  if (!context) {
    return canvas;
  }

  const center = size / 2;
  const brass = context.createRadialGradient(center * 0.8, center * 0.7, 10, center, center, center);
  brass.addColorStop(0, "#f1d48a");
  brass.addColorStop(0.7, "#c9973f");
  brass.addColorStop(1, "#8a6224");
  context.fillStyle = brass;
  context.fillRect(0, 0, size, size);

  // Vonkajší a vnútorný kruh (vyryté).
  context.strokeStyle = "#5c3d12";
  context.lineWidth = 5;
  context.beginPath();
  context.arc(center, center, 112, 0, Math.PI * 2);
  context.stroke();
  context.lineWidth = 3;
  context.beginPath();
  context.arc(center, center, 88, 0, Math.PI * 2);
  context.stroke();

  // ticks: 32 čiarok medzi kruhmi, každá štvrtá dlhšia.
  for (let tick = 0; tick < 32; tick += 1) {
    const angle = (tick / 32) * Math.PI * 2;
    const inner = tick % 4 === 0 ? 90 : 98;
    context.lineWidth = tick % 4 === 0 ? 3 : 2;
    context.beginPath();
    context.moveTo(center + Math.cos(angle) * inner, center + Math.sin(angle) * inner);
    context.lineTo(center + Math.cos(angle) * 110, center + Math.sin(angle) * 110);
    context.stroke();
  }

  // compass: osemcípa ružica (štyri dlhé cípy, štyri kratšie), svetlá = vystúpená.
  const drawPoints = (length: number, width: number, offset: number, color: string) => {
    context.fillStyle = color;

    for (let point = 0; point < 4; point += 1) {
      const angle = offset + (point * Math.PI) / 2;
      context.beginPath();
      context.moveTo(center + Math.cos(angle) * length, center + Math.sin(angle) * length);
      context.lineTo(center + Math.cos(angle + Math.PI / 2) * width, center + Math.sin(angle + Math.PI / 2) * width);
      context.lineTo(center + Math.cos(angle - Math.PI / 2) * width, center + Math.sin(angle - Math.PI / 2) * width);
      context.closePath();
      context.fill();
    }
  };
  drawPoints(66, 14, Math.PI / 4, "#d9ad55");
  drawPoints(86, 18, -Math.PI / 2, "#f6dc93");

  // Tmavý kruh pod písmenom a písmeno M s pätkami.
  context.fillStyle = "#6b4714";
  context.beginPath();
  context.arc(center, center, 38, 0, Math.PI * 2);
  context.fill();
  context.font = 'bold 60px Georgia, "Times New Roman", serif';
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = "#3b2508";
  context.fillText("M", center + 2, center + 6);
  context.fillStyle = "#fbe7a8";
  context.fillText("M", center, center + 4);

  return canvas;
}

/** Rytina rohového kovania: lem po okraji, vinutý lístok (leaf) a hviezdička (star). */
function drawEngraving() {
  const size = ENGRAVING_TEXTURE_SIZE;
  const { canvas, context } = createCanvas(size);

  if (!context) {
    return canvas;
  }

  const brass = context.createLinearGradient(0, 0, size, size);
  brass.addColorStop(0, "#e2b862");
  brass.addColorStop(1, "#a9792f");
  context.fillStyle = brass;
  context.fillRect(0, 0, size, size);
  context.strokeStyle = "#5c3d12";
  context.lineWidth = 3;
  context.strokeRect(9, 9, size - 18, size - 18);
  context.lineWidth = 1.5;
  context.strokeRect(15, 15, size - 30, size - 30);

  // leaf: vinutá línia s lístkami
  context.lineWidth = 2.5;
  context.beginPath();
  context.moveTo(26, 96);
  context.bezierCurveTo(40, 40, 88, 88, 102, 30);
  context.stroke();
  [[44, 62], [70, 70], [90, 48]].forEach(([x, y], index) => {
    context.beginPath();
    context.ellipse(x, y, 9, 4, index * 0.9 - 0.6, 0, Math.PI * 2);
    context.stroke();
  });

  // star: malá štvorcípa hviezdička v rohu
  context.fillStyle = "#5c3d12";
  context.beginPath();
  context.moveTo(98, 84);
  context.lineTo(101, 95);
  context.lineTo(112, 98);
  context.lineTo(101, 101);
  context.lineTo(98, 112);
  context.lineTo(95, 101);
  context.lineTo(84, 98);
  context.lineTo(95, 95);
  context.closePath();
  context.fill();

  return canvas;
}

/** Bordový zamat: vlas (pile), mäkké záhyby a zvislé prešívanie (stitch). */
function drawVelvet() {
  const size = VELVET_TEXTURE_SIZE;
  const { canvas, context } = createCanvas(size);

  if (!context) {
    return canvas;
  }

  const random = createRandom(1888);
  context.fillStyle = "#6e1424";
  context.fillRect(0, 0, size, size);

  // záhyby: mäkké svetlejšie a tmavšie pruhy
  for (let fold = 0; fold < 8; fold += 1) {
    const x = (fold + 0.5) * (size / 8);
    const gradient = context.createLinearGradient(x - 16, 0, x + 16, 0);
    gradient.addColorStop(0, "rgba(255, 140, 150, 0)");
    gradient.addColorStop(0.5, "rgba(255, 140, 150, 0.12)");
    gradient.addColorStop(1, "rgba(30, 0, 6, 0.2)");
    context.fillStyle = gradient;
    context.fillRect(x - 16, 0, 32, size);
  }

  // pile: jemný vlas zamatu
  for (let fiber = 0; fiber < 2400; fiber += 1) {
    context.fillStyle = random() < 0.5
      ? `rgba(255, 170, 180, ${random() * 0.08})`
      : `rgba(20, 0, 5, ${random() * 0.18})`;
    context.fillRect(random() * size, random() * size, 1, 1 + random() * 2);
  }

  // stitch: prešívanie medzi záhybmi (čiarkovaná tmavá čiara)
  context.strokeStyle = "rgba(30, 2, 8, 0.55)";
  context.lineWidth = 1.5;
  context.setLineDash([5, 4]);

  for (let stitch = 1; stitch < 8; stitch += 1) {
    const x = stitch * (size / 8);
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, size);
    context.stroke();
  }

  context.setLineDash([]);

  return canvas;
}

/**
 * Lúč svetla (krok T4): zvislý prechod – dole jasný, hore sa stráca – a mäkké
 * boky, aby kužeľ nemal ostré hrany (createBeamTexture).
 */
function createBeamTexture() {
  const { canvas, context } = createCanvas(64);
  canvas.height = 256;

  if (context) {
    const vertical = context.createLinearGradient(0, 0, 0, 256);
    vertical.addColorStop(0, "rgba(255, 255, 255, 0)");
    vertical.addColorStop(0.55, "rgba(255, 255, 255, 0.35)");
    vertical.addColorStop(1, "rgba(255, 255, 255, 1)");
    context.fillStyle = vertical;
    context.fillRect(0, 0, 64, 256);
    // Mäkké boky (okolo obvodu kužeľa sa jas mierne vlní).
    context.globalCompositeOperation = "destination-in";
    const sides = context.createLinearGradient(0, 0, 64, 0);
    sides.addColorStop(0, "rgba(0, 0, 0, 0.55)");
    sides.addColorStop(0.5, "rgba(0, 0, 0, 1)");
    sides.addColorStop(1, "rgba(0, 0, 0, 0.55)");
    context.fillStyle = sides;
    context.fillRect(0, 0, 64, 256);
  }

  return canvas;
}

/** Zrnko prachu: malý mäkký svetlý bod. */
function createDustSprite() {
  const { canvas, context } = createCanvas(32);

  if (context) {
    const glow = context.createRadialGradient(16, 16, 0, 16, 16, 16);
    glow.addColorStop(0, "rgba(255, 244, 214, 1)");
    glow.addColorStop(0.4, "rgba(255, 220, 150, 0.5)");
    glow.addColorStop(1, "rgba(255, 220, 150, 0)");
    context.fillStyle = glow;
    context.fillRect(0, 0, 32, 32);
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
  /** Znak hry na medailóne (farba aj reliéf). */
  emblem: Texture;
  /** Rytina rohového kovania. */
  engraving: Texture;
  /** Rytina ako opakovaný pás (lišta pod vekom) – zdieľa obrázok rytiny. */
  engravingStrip: Texture;
  /** Zamat vnútra (dno, steny, veko). */
  velvet: Texture;
  /** Lúč svetla z otvorenej truhlice (krok T4). */
  beam: Texture;
  /** Zrnko prachu v lúči (krok T4). */
  dustSprite: Texture;
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
  const emblem = toTexture(drawEmblem());
  const engraving = toTexture(drawEngraving());
  const engravingStrip = engraving.clone();
  engravingStrip.repeat.set(14, 1);
  const velvet = toTexture(drawVelvet());
  const beam = new CanvasTexture(createBeamTexture());
  const dustSprite = new CanvasTexture(createDustSprite());
  const variants: Texture[] = [engravingStrip, beam, dustSprite];

  return {
    wood,
    woodBump,
    iron,
    emblem,
    engraving,
    engravingStrip,
    velvet,
    beam,
    dustSprite,
    woodVariant(repeatX, repeatY, offsetY = 0) {
      const variant = wood.clone();
      variant.repeat.set(repeatX, repeatY);
      variant.offset.set(0, offsetY);
      variants.push(variant);

      return variant;
    },
    dispose() {
      [wood, iron, emblem, engraving, velvet, ...variants].forEach((texture) =>
        texture.dispose()
      );
    },
  };
}

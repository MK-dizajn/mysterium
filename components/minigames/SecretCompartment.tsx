"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { CompartmentLook, InspectCountPoint } from "../../types/game";
import { vibrate, HAPTIC } from "../../lib/haptics";
import { soundManager } from "../../lib/soundManager";
import { getKeyToothParts } from "../items/art/keyToothArt";
import { useReducedMotion } from "../items/useReducedMotion";

/** Zub kľúča, ktorý leží v schránke (zárezy a poradie časti z predmetu). */
export type CompartmentToothArt = {
  countPoints: InspectCountPoint[];
  artPart: number;
};

type SecretCompartmentProps = {
  digit: string;
  text: string;
  look?: CompartmentLook;
  tooth?: CompartmentToothArt;
  onDone: () => void;
};

/** Celé otvorenie: pečať, západka, veko, svetlo, zub a číslica. */
const OPEN_MS = 2600;
/** Kedy sa začne dvíhať veko (druhá, dlhšia vibrácia). */
const LID_MS = 800;
/** Vypnuté animácie: zatvorená schránka, prelínanie na otvorenú, koniec. */
const REDUCED_CLOSED_MS = 300;
const REDUCED_OPEN_MS = 900;
/** Po ťuknutí: koncový stav ešte chvíľu ostane viditeľný. */
const AFTER_SKIP_MS = 500;

type Palette = {
  woodTop: string;
  woodLight: string;
  woodDark: string;
  grain: string;
  metalLight: string;
  metal: string;
  metalDark: string;
  patina: string;
  band: string;
  bandDark: string;
  wax: string;
  waxDark: string;
  waxLight: string;
  lining: string;
  liningDark: string;
};

/** Drevo, kov, vosk a zamat. Ďalšie kapitoly môžu mať vlastné farby. */
const PALETTES: Record<NonNullable<CompartmentLook["palette"]>, Palette> = {
  oakBrass: {
    woodTop: "#8a5a32",
    woodLight: "#6e4524",
    woodDark: "#2f1a0a",
    grain: "#1a0d04",
    metalLight: "#f6dc8a",
    metal: "#c9962f",
    metalDark: "#6b4a14",
    patina: "#5d8a6a",
    band: "#4a4642",
    bandDark: "#1f1d1b",
    wax: "#8e1b1b",
    waxDark: "#4f0b0b",
    waxLight: "#d0544a",
    lining: "#7a1428",
    liningDark: "#24040b",
  },
  ironBlack: {
    woodTop: "#5c4a3c",
    woodLight: "#45372c",
    woodDark: "#1b140f",
    grain: "#0d0907",
    metalLight: "#d9dde0",
    metal: "#8a9095",
    metalDark: "#3a3e42",
    patina: "#7a5a3a",
    band: "#3a3a3e",
    bandDark: "#141416",
    wax: "#26262c",
    waxDark: "#0b0b0e",
    waxLight: "#6a6a76",
    lining: "#16463a",
    liningDark: "#031410",
  },
};

/** Obrys voskovej pečate: nepravidelný kruh (pevný, aby sa nemenil pri F5). */
function getSealPath(cx: number, cy: number) {
  const wobble = [2, -1, 3, 0, 2, -2, 1, 3, -1, 1, 2, 0];
  const points = wobble.map((delta, index) => {
    const angle = (index / wobble.length) * Math.PI * 2;
    const radius = 18 + delta;

    return [cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius];
  });

  return (
    points
      .map(([x, y], index) => `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
      .join(" ") + " Z"
  );
}

const SEAL = { cx: 160, cy: 172 };
const SEAL_PATH = getSealPath(SEAL.cx, SEAL.cy);
const GRAIN_BODY = [160, 172, 186, 199, 213, 226];
const DUST = [
  [118, 120, 1.6, 0],
  [138, 108, 1.2, 0.25],
  [152, 126, 1.8, 0.1],
  [171, 112, 1.3, 0.4],
  [186, 124, 1.6, 0.2],
  [201, 106, 1.1, 0.35],
  [129, 98, 1.2, 0.5],
] as const;

/** Vlastný znak hry: písmeno M v kruhu s kompasovou ružicou (nie znak mesta). */
function GameEmblem({ palette, isTagged }: { palette: Palette; isTagged: boolean }) {
  const { cx, cy } = SEAL;

  return (
    <g data-seal-emblem={isTagged ? "game" : undefined}>
      <circle cx={cx} cy={cy} r="12.5" fill="none" stroke={palette.waxDark} strokeWidth="1.6" />
      <path
        data-compass={isTagged ? "" : undefined}
        d={`M${cx},${cy - 11} L${cx + 2.4},${cy - 2.4} L${cx + 11},${cy} L${cx + 2.4},${cy + 2.4} L${cx},${cy + 11} L${cx - 2.4},${cy + 2.4} L${cx - 11},${cy} L${cx - 2.4},${cy - 2.4} Z`}
        fill={palette.waxDark}
        opacity="0.55"
      />
      <text x={cx - 0.5} y={cy + 4.4} textAnchor="middle" fontSize="12" fontWeight="900" fontFamily="Georgia, serif" fill={palette.waxLight} opacity="0.55">
        M
      </text>
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize="12" fontWeight="900" fontFamily="Georgia, serif" fill={palette.waxDark}>
        M
      </text>
    </g>
  );
}

type RivetProps = { x: number; y: number; fill: string; stroke: string };

function Rivet({ x, y, fill, stroke }: RivetProps) {
  return <circle data-rivet cx={x} cy={y} r="2.6" fill={fill} stroke={stroke} strokeWidth="0.8" />;
}

type CasketArtProps = {
  idPrefix: string;
  digit: string;
  look: CompartmentLook;
  tooth?: CompartmentToothArt;
  /** animated = celé otvorenie; closed a open = pokojné obrázky (vypnuté animácie). */
  frame: "animated" | "closed" | "open";
};

/** Kresba truhličky (SVG 320 × 270). Pohybujú sa iba posuny, otočenia a priehľadnosť. */
function CasketArt({ idPrefix, digit, look, tooth, frame }: CasketArtProps) {
  const palette = PALETTES[look.palette ?? "oakBrass"];
  const id = (name: string) => `${idPrefix}-${name}`;
  const url = (name: string) => `url(#${id(name)})`;
  const hasSeal = (look.seal ?? "wax") === "wax";
  const contents = look.contents ?? "keyTooth";
  const toothParts =
    contents === "keyTooth" && tooth
      ? getKeyToothParts(tooth.countPoints, tooth.artPart, id("tooth"))
      : null;
  const woodTexture = look.textures?.wood;
  const liningTexture = look.textures?.lining;
  const rivet = { fill: url("rivet"), stroke: palette.metalDark };

  // Otvor schránky (zhora mierne zošikma): zadná hrana pri pántoch, predná pri okraji.
  const lidTop = "M72,92 L248,92 L280,136 L40,136 Z";
  const opening = "M72,92 L248,92 L280,150 L40,150 Z";
  const lining = "M80,98 L240,98 L272,146 L48,146 Z";
  const lidInside = "M66,92 L254,92 L244,152 L76,152 Z";

  return (
    <svg
      viewBox="0 0 320 270"
      className={`casket casket--${frame} block h-auto w-full max-w-[300px]`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={id("wood")} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={palette.woodLight} />
          <stop offset="1" stopColor={palette.woodDark} />
        </linearGradient>
        <linearGradient id={id("wood-top")} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={palette.woodLight} />
          <stop offset="1" stopColor={palette.woodTop} />
        </linearGradient>
        <linearGradient id={id("metal")} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor={palette.metalLight} />
          <stop offset="0.5" stopColor={palette.metal} />
          <stop offset="1" stopColor={palette.metalDark} />
        </linearGradient>
        <radialGradient id={id("rivet")} cx="35%" cy="30%" r="70%">
          <stop offset="0" stopColor={palette.metalLight} />
          <stop offset="1" stopColor={palette.metalDark} />
        </radialGradient>
        <linearGradient id={id("band")} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={palette.bandDark} />
          <stop offset="0.45" stopColor={palette.band} />
          <stop offset="1" stopColor={palette.bandDark} />
        </linearGradient>
        <linearGradient id={id("lining")} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={palette.liningDark} />
          <stop offset="0.55" stopColor={palette.lining} />
          <stop offset="1" stopColor={palette.liningDark} />
        </linearGradient>
        <radialGradient id={id("wax")} cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor={palette.waxLight} />
          <stop offset="0.45" stopColor={palette.wax} />
          <stop offset="1" stopColor={palette.waxDark} />
        </radialGradient>
        <radialGradient id={id("glow")} cx="50%" cy="55%" r="50%">
          <stop offset="0" stopColor="#fff3c4" stopOpacity="0.9" />
          <stop offset="0.5" stopColor="#fbbf24" stopOpacity="0.32" />
          <stop offset="1" stopColor="#fbbf24" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id("ray")} x1="0" x2="0" y1="1" y2="0">
          <stop offset="0" stopColor="#fde68a" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fde68a" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={id("shadow")} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#000" stopOpacity="0.75" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id("digit-glow")} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#fff3c4" stopOpacity="0.95" />
          <stop offset="1" stopColor="#fbbf24" stopOpacity="0" />
        </radialGradient>
        <clipPath id={id("lid-top")}>
          <path d={lidTop} />
        </clipPath>
        <clipPath id={id("seal-left")}>
          <rect x="130" y="140" width="30" height="70" />
        </clipPath>
        <clipPath id={id("seal-right")}>
          <rect x="160" y="140" width="30" height="70" />
        </clipPath>
        {toothParts && (
          <clipPath id={id("tooth-bit")}>
            <path d={toothParts.bitPath} />
          </clipPath>
        )}
        {/* Voliteľné textúry (drevo, zamat): použijú sa, iba ak sú v dátach. */}
        {woodTexture && (
          <pattern id={id("wood-texture")} patternUnits="userSpaceOnUse" width="160" height="160">
            <image href={woodTexture} width="160" height="160" preserveAspectRatio="xMidYMid slice" />
          </pattern>
        )}
        {liningTexture && (
          <pattern id={id("lining-texture")} patternUnits="userSpaceOnUse" width="96" height="96">
            <image href={liningTexture} width="96" height="96" preserveAspectRatio="xMidYMid slice" />
          </pattern>
        )}
      </defs>

      {/* Tieň pod schránkou. */}
      <ellipse cx="160" cy="250" rx="140" ry="13" fill={url("shadow")} />

      <g className="casket-jolt">
        {/* Vnútorná strana veka: viditeľná až po odklopení, leží za zubom. */}
        <g data-compartment-lid className="casket-lid casket-lid-in">
          <path d={lidInside} fill={url("wood")} stroke={palette.grain} strokeWidth="1.2" />
          <path d="M74,98 L246,98 L238,146 L82,146 Z" fill={url("lining")} />
          {liningTexture && (
            <path d="M74,98 L246,98 L238,146 L82,146 Z" fill={url("lining-texture")} opacity="0.55" style={{ mixBlendMode: "multiply" }} />
          )}
          <path d="M74,98 L246,98 L238,146 L82,146 Z" fill="none" stroke={url("metal")} strokeWidth="2" />
        </g>

        {/* Otvor: drevený okraj a zamat. */}
        <path d={opening} fill={palette.woodTop} />
        <path data-compartment-lining d={lining} fill={url("lining")} />
        {liningTexture && (
          <path d={lining} fill={url("lining-texture")} opacity="0.55" style={{ mixBlendMode: "multiply" }} />
        )}
        {/* Záhyby zamatu a hlboký tieň pri zadnej stene. */}
        <path d="M70,128 C110,120 150,134 190,124 C215,118 240,126 262,132" fill="none" stroke="#fff" strokeOpacity="0.07" strokeWidth="3" />
        <path d="M80,98 L240,98 L246,108 L74,108 Z" fill={palette.liningDark} opacity="0.85" />
        <ellipse cx="160" cy="132" rx="62" ry="9" fill={palette.liningDark} opacity="0.7" />

        {/* Lúče svetla z otvorenej schránky: za zubom, aby ho neprežiarili. */}
        <g className="casket-rays">
          <path d="M128,128 L192,128 L232,8 L88,8 Z" fill={url("ray")} />
          <path d="M110,130 L130,130 L70,20 L48,32 Z" fill={url("ray")} opacity="0.6" />
          <path d="M190,130 L210,130 L272,32 L250,20 Z" fill={url("ray")} opacity="0.6" />
        </g>

        {/* Svetlo zvnútra: za zubom, aby ho neprežiarilo a číslica ostala čitateľná. */}
        <ellipse data-compartment-glow className="casket-glow" cx="160" cy="112" rx="140" ry="92" fill={url("glow")} />

        {/* Obsah: zub Zlatého kľúča s vyrytou číslicou (alebo iba číslica). */}
        <g data-compartment-contents={contents} className="casket-tooth">
          {toothParts ? (
            <svg x="84" y="58" width="152" height="114" viewBox="0 0 320 240" overflow="visible">
              <defs dangerouslySetInnerHTML={{ __html: toothParts.defs }} />
              <g dangerouslySetInnerHTML={{ __html: toothParts.body }} />
              <g clipPath={url("tooth-bit")}>
                <rect className="casket-glint" x="-60" y="40" width="34" height="220" fill="#fffbe6" opacity="0.7" transform="skewX(-20)" />
              </g>
              <ellipse className="casket-digit-glow" cx="160" cy="40" rx="34" ry="22" fill={url("digit-glow")} />
              {/* Vyrytá číslica: svetlý spodný okraj, tmavá ryha; na konci sa rozžiari (tmavý obrys ostane). */}
              <text x="160" y="58" textAnchor="middle" fontSize="44" fontWeight="900" fontFamily="Georgia, serif" fill="#fff3c4" opacity="0.5">
                {digit}
              </text>
              <text data-engraved-digit className="casket-digit" x="160" y="56" textAnchor="middle" fontSize="44" fontWeight="900" fontFamily="Georgia, serif" fill="#4a3008" stroke="#2a1a04" strokeWidth="3.5" paintOrder="stroke">
                {digit}
              </text>
            </svg>
          ) : (
            <>
              <circle className="casket-digit-glow" cx="160" cy="118" r="30" fill={url("digit-glow")} />
              <text data-engraved-digit className="casket-digit" x="160" y="132" textAnchor="middle" fontSize="40" fontWeight="900" fontFamily="Georgia, serif" fill="#fde68a">
                {digit}
              </text>
            </>
          )}
        </g>


        {/* Predná stena: drevo, letokruhy, železné pásy, mosadzné rohy, zámok. */}
        <rect x="40" y="150" width="240" height="90" rx="3" fill={url("wood")} />
        {woodTexture && (
          <rect x="40" y="150" width="240" height="90" rx="3" fill={url("wood-texture")} opacity="0.6" style={{ mixBlendMode: "multiply" }} />
        )}
        {GRAIN_BODY.map((y, index) => (
          <path key={y} d={`M44,${y} C100,${y - 3 + index % 2 * 4} 190,${y + 3} 276,${y - 1}`} fill="none" stroke={palette.grain} strokeOpacity="0.4" strokeWidth="1" />
        ))}
        <ellipse cx="112" cy="206" rx="7" ry="3" fill="none" stroke={palette.grain} strokeOpacity="0.45" />
        <line x1="42" y1="151.5" x2="278" y2="151.5" stroke={palette.woodTop} strokeWidth="1.5" opacity="0.8" />
        <rect x="78" y="150" width="12" height="90" fill={url("band")} />
        <rect x="230" y="150" width="12" height="90" fill={url("band")} />
        <circle cx="84" cy="222" r="3" fill={palette.patina} opacity="0.35" />
        <path d="M40,214 L46,214 L46,234 L66,234 L66,240 L40,240 Z" fill={url("metal")} stroke={palette.patina} strokeOpacity="0.6" strokeWidth="0.8" />
        <path d="M280,214 L274,214 L274,234 L254,234 L254,240 L280,240 Z" fill={url("metal")} stroke={palette.patina} strokeOpacity="0.6" strokeWidth="0.8" />
        <Rivet x={84} y={158} {...rivet} />
        <Rivet x={84} y={233} {...rivet} />
        <Rivet x={236} y={158} {...rivet} />
        <Rivet x={236} y={233} {...rivet} />
        <Rivet x={43} y={226} {...rivet} />
        <Rivet x={58} y={237} {...rivet} />
        <Rivet x={277} y={226} {...rivet} />
        <Rivet x={262} y={237} {...rivet} />
        <g data-compartment-lock>
          <path d="M146,160 H174 Q178,160 178,164 V196 Q178,206 160,212 Q142,206 142,196 V164 Q142,160 146,160 Z" fill={url("metal")} stroke={palette.metalDark} strokeWidth="1" />
          <path d="M146,160 H174 Q178,160 178,164 V196 Q178,206 160,212 Q142,206 142,196 V164 Q142,160 146,160 Z" fill="none" stroke={palette.patina} strokeOpacity="0.55" strokeWidth="2.5" strokeDasharray="6 9" />
          <g data-keyhole>
            <circle cx="160" cy="194" r="3.6" fill="#120a04" />
            <path d="M157.6,195 L156.4,203 H163.6 L162.4,195 Z" fill="#120a04" />
          </g>
          <Rivet x={147} y={165} {...rivet} />
          <Rivet x={173} y={165} {...rivet} />
        </g>

        {/* Veko zvonka: vrch, predná hrana, pásy, rohy a západka. */}
        <g data-compartment-lid className="casket-lid casket-lid-out">
          <path d={lidTop} fill={url("wood-top")} />
          {woodTexture && (
            <path d={lidTop} fill={url("wood-texture")} opacity="0.6" style={{ mixBlendMode: "multiply" }} />
          )}
          <g clipPath={url("lid-top")}>
            {[100, 110, 120, 129].map((y, index) => (
              <path key={y} d={`M30,${y} C100,${y - 2 - index} 200,${y + 3} 290,${y}`} fill="none" stroke={palette.grain} strokeOpacity="0.35" strokeWidth="1" />
            ))}
          </g>
          <path d="M78,136 L90,136 L108.7,92 L99.9,92 Z" fill={url("band")} />
          <path d="M230,136 L242,136 L220.1,92 L211.3,92 Z" fill={url("band")} />
          <rect x="40" y="136" width="240" height="16" fill={url("wood")} />
          <line x1="40" y1="136.5" x2="280" y2="136.5" stroke={palette.metalLight} strokeOpacity="0.35" strokeWidth="1" />
          <rect x="78" y="136" width="12" height="16" fill={url("band")} />
          <rect x="230" y="136" width="12" height="16" fill={url("band")} />
          <path d="M40,136 L66,136 L66,141 L46,141 L46,152 L40,152 Z" fill={url("metal")} />
          <path d="M280,136 L254,136 L254,141 L274,141 L274,152 L280,152 Z" fill={url("metal")} />
          <Rivet x={43} y={146} {...rivet} />
          <Rivet x={58} y={138.5} {...rivet} />
          <Rivet x={277} y={146} {...rivet} />
          <Rivet x={262} y={138.5} {...rivet} />
          <g data-compartment-latch className="casket-latch">
            <path d="M154,140 H166 V170 Q160,178 154,170 Z" fill={url("metal")} stroke={palette.metalDark} strokeWidth="1" />
            <circle cx="160" cy="143.5" r="2.4" fill={palette.metalDark} />
          </g>
        </g>

        {/* Pánty na zadnej hrane. */}
        <rect data-hinge x="96" y="86" width="22" height="7" rx="3.5" fill={url("metal")} stroke={palette.metalDark} strokeWidth="0.8" />
        <rect data-hinge x="202" y="86" width="22" height="7" rx="3.5" fill={url("metal")} stroke={palette.metalDark} strokeWidth="0.8" />

        {/* Vosková pečať cez západku: pri otvorení praskne a polovice odpadnú. */}
        {hasSeal && (
          <g data-compartment-seal>
            <g className="casket-seal-left" clipPath={url("seal-left")}>
              <path d={SEAL_PATH} fill={url("wax")} />
              <circle cx="152" cy="190" r="3" fill={palette.wax} />
              <GameEmblem palette={palette} isTagged />
            </g>
            <g className="casket-seal-right" clipPath={url("seal-right")}>
              <path d={SEAL_PATH} fill={url("wax")} />
              <circle cx="169" cy="188.5" r="2.4" fill={palette.wax} />
              <GameEmblem palette={palette} isTagged={false} />
            </g>
            <path className="casket-crack" d="M160,153 L157,160 L162,167 L158,175 L163,183 L160,192" fill="none" stroke={palette.waxDark} strokeWidth="1.4" pathLength={1} />
            <circle className="casket-crumb" cx="150" cy="186" r="1.6" fill={palette.wax} />
            <circle className="casket-crumb" cx="166" cy="190" r="1.3" fill={palette.wax} />
            <circle className="casket-crumb" cx="158" cy="192" r="1.1" fill={palette.waxLight} />
          </g>
        )}
      </g>

      {/* Prach v lúčoch svetla. */}
      {DUST.map(([x, y, r, delay]) => (
        <circle
          key={`${x}-${y}`}
          data-dust
          className="casket-dust"
          cx={x}
          cy={y}
          r={r}
          fill="#fff3c4"
          style={{ animationDelay: `${1.2 + delay}s` }}
        />
      ))}
    </svg>
  );
}

/**
 * Tajná schránka: pečať praskne, západka cvakne, veko sa odklopí, zvnútra
 * vyjde svetlo a zo zamatu sa nadvihne obsah (zub kľúča s číslicou).
 * Ťuknutie dokončí animáciu hneď. Pri vypnutých animáciách sa zatvorená
 * schránka iba prelínaním zmení na otvorenú. Potom onDone (zápis číslice).
 */
export function SecretCompartment({ digit, text, look = {}, tooth, onDone }: SecretCompartmentProps) {
  const reducedMotion = useReducedMotion();
  const idPrefix = `casket-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const rootRef = useRef<HTMLButtonElement>(null);
  const onDoneRef = useRef(onDone);
  const timersRef = useRef<number[]>([]);
  const isDoneRef = useRef(false);
  const [isReducedOpen, setIsReducedOpen] = useState(false);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  function clearTimers() {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }

  function done() {
    if (isDoneRef.current) {
      return;
    }

    isDoneRef.current = true;
    clearTimers();
    soundManager.play("digit-reveal");
    onDoneRef.current();
  }

  useEffect(() => {
    isDoneRef.current = false;
    soundManager.play("compartment-open");
    vibrate(HAPTIC.step);

    const schedule = (callback: () => void, ms: number) =>
      timersRef.current.push(window.setTimeout(callback, ms));

    if (reducedMotion) {
      schedule(() => {
        setIsReducedOpen(true);
        vibrate(HAPTIC.open);
      }, REDUCED_CLOSED_MS);
      schedule(done, REDUCED_OPEN_MS);
    } else {
      schedule(() => vibrate(HAPTIC.open), LID_MS);
      schedule(done, OPEN_MS);
    }

    return clearTimers;
    // done číta iba refy, preto stačí reagovať na zmenu režimu animácií.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  /** Ťuknutie: animácia skočí na koniec, koncový stav chvíľu ostane. */
  function finish() {
    if (isDoneRef.current) {
      return;
    }

    clearTimers();

    if (reducedMotion) {
      setIsReducedOpen(true);
    } else {
      rootRef.current
        ?.getAnimations({ subtree: true })
        .forEach((animation) => animation.finish());
    }

    timersRef.current.push(window.setTimeout(done, AFTER_SKIP_MS));
  }

  const art = (frame: CasketArtProps["frame"], prefix: string) => (
    <CasketArt idPrefix={prefix} digit={digit} look={look} tooth={tooth} frame={frame} />
  );

  return (
    <div data-secret-compartment className="mt-5 flex w-full flex-col items-center">
      <button
        ref={rootRef}
        type="button"
        onClick={finish}
        aria-label="Otvoriť schránku hneď"
        className="relative block w-full max-w-[300px] cursor-pointer rounded-2xl outline-none focus-visible:ring-4 focus-visible:ring-amber-300/60"
      >
        {reducedMotion ? (
          <>
            {art("closed", `${idPrefix}c`)}
            <div
              className={`absolute inset-0 transition-opacity duration-300 ${
                isReducedOpen ? "opacity-100" : "opacity-0"
              }`}
            >
              {art("open", `${idPrefix}o`)}
            </div>
          </>
        ) : (
          art("animated", idPrefix)
        )}
      </button>
      <p role="status" className="mt-3 text-sm leading-6 text-amber-100">
        {text}
      </p>
    </div>
  );
}

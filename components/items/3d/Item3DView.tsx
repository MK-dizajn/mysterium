"use client";

import { Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import {
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ExtrudeGeometry, type Group, Shape } from "three";
import type { InspectCountPoint, ItemInspectArt } from "../../../types/game";
import { ITEM_ARTS } from "../art/itemArtRegistry";
import { getKeyToothOutline } from "../art/keyToothArt";
import { GLOW_CLASSES } from "../inspectStyles";
import { isBackFacing, isFrontVisible, stepDwell } from "./facing";
import { InspectStage } from "./InspectStage";
import {
  applyFlatDrag,
  createFlatState,
  type FlatState,
  flipFlat,
  isFlatAtRest,
  KEYBOARD_TILT_STEP,
  KEYBOARD_YAW_STEP,
  nudgeFlat,
  releaseFlatDrag,
  stepFlat,
} from "./rotationPhysics";
import { useSvgTexture } from "./useSvgTexture";

const MAX_FRAME_SECONDS = 0.05;
/**
 * Výška predmetu v 3D. Kamera vidí asi 2,4 na výšku a plátno má rovnaký
 * pomer strán ako predmet, takže predmet vyplní asi 80 % plochy aj pri náklone.
 */
const WORLD_HEIGHT = 1.9;
const PAPER_DEPTH = 0.02;
const SEAL_THICKNESS = 0.16;
const TOOTH_DEPTH = 0.14;
const TOOTH_BEVEL = 0.02;
const MAX_TEXTURE_SIZE = 1024;
/** Značky a tlačidlá stoja kúsok pred povrchom, aby ich model nezakryl. */
const MARKER_OFFSET = 0.03;

/** Premenlivý stav nakláňania mimo Reactu (rovnako ako pri žetóne). */
class FlatController {
  state: FlatState = createFlatState();
  private dwellMs = 0;
  private isFacing = false;
  private drag: { pointerId: number; x: number; y: number } | null = null;
  private invalidate: (() => void) | null = null;

  setInvalidate(invalidate: (() => void) | null) {
    this.invalidate = invalidate;
  }

  update(change: (state: FlatState) => FlatState) {
    this.state = change(this.state);
    this.invalidate?.();
  }

  setFacing(isFacing: boolean) {
    const hasChanged = isFacing !== this.isFacing;
    this.isFacing = isFacing;

    return hasChanged;
  }

  advanceDwell(
    options: Omit<Parameters<typeof stepDwell>[1], "dtMs">,
    dtMs: number
  ) {
    const dwell = stepDwell(this.dwellMs, { ...options, dtMs });
    this.dwellMs = dwell.shouldRecord ? 0 : dwell.dwellMs;

    return dwell.shouldRecord;
  }

  startDrag(pointerId: number, x: number, y: number) {
    this.drag = { pointerId, x, y };
    this.update((state) => applyFlatDrag(state, 0, 0));
  }

  moveDrag(pointerId: number, x: number, y: number) {
    if (!this.drag || this.drag.pointerId !== pointerId) {
      return;
    }

    const dx = x - this.drag.x;
    const dy = y - this.drag.y;

    this.drag = { pointerId, x, y };
    this.update((state) => applyFlatDrag(state, dx, dy));
  }

  endDrag(pointerId: number, reducedMotion: boolean) {
    if (this.drag?.pointerId !== pointerId) {
      return;
    }

    this.drag = null;
    this.update((state) => releaseFlatDrag(state, reducedMotion));
  }
}

type ModelProps = {
  art: ItemInspectArt;
  digit: string;
  isFound: boolean;
  worldWidth: number;
  worldHeight: number;
  textureWidth: number;
  textureHeight: number;
  countPoints?: InspectCountPoint[];
};

/** Tenký list papiera: líce a rub z kresby v components/items/art/. */
function PaperModel({
  art,
  digit,
  isFound,
  worldWidth,
  worldHeight,
  textureWidth,
  textureHeight,
  countPoints,
}: ModelProps) {
  const definition = ITEM_ARTS[art];

  const frontSvg = useMemo(
    () => definition.getSvg("front", digit, false, `${art}-front`, countPoints),
    [definition, art, digit, countPoints]
  );
  const backSvg = useMemo(
    () => definition.getSvg("hidden", digit, isFound, `${art}-back`, countPoints),
    [definition, art, digit, isFound, countPoints]
  );

  const frontTexture = useSvgTexture(frontSvg, textureWidth, textureHeight);
  const backTexture = useSvgTexture(backSvg, textureWidth, textureHeight);

  // Materiál sa po príchode textúry vytvorí nanovo (key), inak by ju
  // three.js nepoužil – rovnako ako pri žetóne.
  return (
    <group>
      <mesh>
        <boxGeometry args={[worldWidth, worldHeight, PAPER_DEPTH]} />
        <meshStandardMaterial color="#d8c393" roughness={0.9} metalness={0} />
      </mesh>

      <mesh position={[0, 0, PAPER_DEPTH / 2 + 0.001]}>
        <planeGeometry args={[worldWidth, worldHeight]} />
        <meshStandardMaterial
          key={frontTexture ? "front" : "plain"}
          color={frontTexture ? "#ffffff" : "#e2cfa2"}
          map={frontTexture}
          roughness={0.9}
          metalness={0}
        />
      </mesh>

      <mesh
        position={[0, 0, -PAPER_DEPTH / 2 - 0.001]}
        rotation={[0, Math.PI, 0]}
      >
        <planeGeometry args={[worldWidth, worldHeight]} />
        <meshStandardMaterial
          key={backTexture ? "back" : "plain"}
          color={backTexture ? "#ffffff" : "#e2cfa2"}
          map={backTexture}
          roughness={0.9}
          metalness={0}
        />
      </mesh>
    </group>
  );
}

/** Bronzová pečať: nízky valec, líce s reliéfom z kresby, hladký rub. */
function SealModel({ art, worldHeight, countPoints }: ModelProps) {
  const definition = ITEM_ARTS[art];
  const radius = worldHeight / 2;

  const frontSvg = useMemo(
    () => definition.getSvg("front", "", false, "seal-front", countPoints),
    [definition, countPoints]
  );
  const backSvg = useMemo(
    () => definition.getSvg("hidden", "", false, "seal-back", countPoints),
    [definition, countPoints]
  );

  const frontTexture = useSvgTexture(frontSvg, MAX_TEXTURE_SIZE, MAX_TEXTURE_SIZE);
  const backTexture = useSvgTexture(backSvg, MAX_TEXTURE_SIZE, MAX_TEXTURE_SIZE);

  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry
          args={[radius, radius, SEAL_THICKNESS, 96, 1, true]}
        />
        <meshStandardMaterial color="#7a4e1c" metalness={0.35} roughness={0.5} />
      </mesh>

      <mesh position={[0, 0, SEAL_THICKNESS / 2]}>
        <circleGeometry args={[radius, 96]} />
        <meshStandardMaterial
          key={frontTexture ? "front" : "plain"}
          color={frontTexture ? "#ffffff" : "#b07a32"}
          map={frontTexture}
          bumpMap={frontTexture}
          bumpScale={1.2}
          metalness={0.3}
          roughness={0.5}
        />
      </mesh>

      <mesh position={[0, 0, -SEAL_THICKNESS / 2]} rotation={[0, Math.PI, 0]}>
        <circleGeometry args={[radius, 96]} />
        <meshStandardMaterial
          key={backTexture ? "back" : "plain"}
          color={backTexture ? "#ffffff" : "#b07a32"}
          map={backTexture}
          bumpMap={backTexture}
          bumpScale={1.2}
          metalness={0.3}
          roughness={0.5}
        />
      </mesh>
    </group>
  );
}

/** Zub kľúča: vytiahnutý tvar so zárezmi presne podľa zoznamu. */
function ToothModel({ worldWidth, worldHeight, countPoints = [] }: ModelProps) {
  const geometry = useMemo(() => {
    const shape = new Shape();

    getKeyToothOutline(countPoints).forEach((point, index) => {
      const x = (point.x - 0.5) * worldWidth;
      const y = (0.5 - point.y) * worldHeight;

      if (index === 0) {
        shape.moveTo(x, y);
      } else {
        shape.lineTo(x, y);
      }
    });

    shape.closePath();

    const extruded = new ExtrudeGeometry(shape, {
      depth: TOOTH_DEPTH,
      bevelEnabled: true,
      bevelThickness: TOOTH_BEVEL,
      bevelSize: TOOTH_BEVEL,
      bevelSegments: 2,
    });

    extruded.translate(0, 0, -TOOTH_DEPTH / 2);

    return extruded;
  }, [countPoints, worldWidth, worldHeight]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color="#d4a23c" metalness={0.35} roughness={0.35} />
    </mesh>
  );
}

/** Ako ďaleko pred stredom predmetu je jeho líce (pre značky). */
function getFrontSurfaceZ(model: "paper" | "seal" | "tooth") {
  if (model === "seal") {
    return SEAL_THICKNESS / 2 + MARKER_OFFSET;
  }

  if (model === "tooth") {
    return TOOTH_DEPTH / 2 + TOOTH_BEVEL + MARKER_OFFSET;
  }

  return PAPER_DEPTH / 2 + MARKER_OFFSET;
}

type ControllerViewProps = {
  controller: FlatController;
  reducedMotion: boolean;
  isFound: boolean;
  isCountMode: boolean;
  onFacingChange: (isFacing: boolean) => void;
  onAutoRecord: () => void;
  children: ReactNode;
};

function ControllerView({
  controller,
  reducedMotion,
  isFound,
  isCountMode,
  onFacingChange,
  onAutoRecord,
  children,
}: ControllerViewProps) {
  const groupRef = useRef<Group>(null);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    controller.setInvalidate(invalidate);
    invalidate();

    return () => controller.setInvalidate(null);
  }, [controller, invalidate]);

  useFrame((_, delta) => {
    const dtSec = Math.min(delta, MAX_FRAME_SECONDS);

    controller.update((state) => stepFlat(state, dtSec, reducedMotion));

    const { yaw, tilt } = controller.state;
    groupRef.current?.rotation.set(tilt, yaw, 0);

    // Pri počítaní je dôležité líce, inak rub so skrytou číslicou.
    const isFacing = isCountMode
      ? isFrontVisible(yaw, tilt)
      : isBackFacing(yaw, tilt);

    if (controller.setFacing(isFacing)) {
      onFacingChange(isFacing);
    }

    // Pri počítaní sa číslica sama nezapisuje.
    if (
      controller.advanceDwell(
        { isFacing: isFacing && !isCountMode, reducedMotion, isFound },
        dtSec * 1000
      )
    ) {
      onAutoRecord();
    }

    const isCountingDown =
      isFacing && !isCountMode && !isFound && !reducedMotion;

    if (isFlatAtRest(controller.state) && !isCountingDown) {
      return;
    }

    invalidate();
  });

  return <group ref={groupRef}>{children}</group>;
}

type Item3DViewProps = {
  art: ItemInspectArt;
  digit: string;
  isFound: boolean;
  hotspotLabel: string;
  isHotspotGlowing: boolean;
  reducedMotion: boolean;
  /** Každé zvýšenie čísla = „Obrátiť“. */
  turnRequestCount: number;
  focusOnMount: boolean;
  onFacingChange: (isFacing: boolean) => void;
  onFound: () => void;
  onFailure: () => void;
  /** Prvky na počítanie (inak sa hľadá skrytá číslica na rube). */
  countPoints?: InspectCountPoint[];
  countLabel?: string;
  markedIndexes?: number[];
  onMark?: (index: number) => void;
};

/** 3D predmet (list, mapa, pečať, zub kľúča) na obrazovke „Prezrieť“. */
export default function Item3DView({
  art,
  digit,
  isFound,
  hotspotLabel,
  isHotspotGlowing,
  reducedMotion,
  turnRequestCount,
  focusOnMount,
  onFacingChange,
  onFound,
  onFailure,
  countPoints,
  countLabel = "",
  markedIndexes = [],
  onMark,
}: Item3DViewProps) {
  const definition = ITEM_ARTS[art];
  const model = definition.model3D === "token" ? "paper" : definition.model3D;
  const isCountMode = Boolean(countPoints?.length);
  const [controller] = useState(() => new FlatController());
  const [isFacing, setIsFacing] = useState(false);
  const lastTurnRequestRef = useRef(turnRequestCount);
  const surfaceRef = useRef<HTMLDivElement>(null);

  const aspect = definition.width / definition.height;
  const worldHeight = WORLD_HEIGHT;
  const worldWidth = WORLD_HEIGHT * aspect;
  const textureWidth = Math.round(
    aspect >= 1 ? MAX_TEXTURE_SIZE : MAX_TEXTURE_SIZE * aspect
  );
  const textureHeight = Math.round(
    aspect >= 1 ? MAX_TEXTURE_SIZE / aspect : MAX_TEXTURE_SIZE
  );

  // Rub je otočený o 180°, preto je vodorovná poloha číslice zrkadlová.
  const hotspotPosition: [number, number, number] = [
    -(definition.hotspotCenter.x - 0.5) * worldWidth,
    (0.5 - definition.hotspotCenter.y) * worldHeight,
    -PAPER_DEPTH / 2 - MARKER_OFFSET,
  ];

  const frontZ = getFrontSurfaceZ(model);

  useEffect(() => {
    if (focusOnMount) {
      surfaceRef.current?.focus({ preventScroll: true });
    }
  }, [focusOnMount]);

  useEffect(() => {
    if (turnRequestCount === lastTurnRequestRef.current) {
      return;
    }

    lastTurnRequestRef.current = turnRequestCount;
    controller.update((state) => flipFlat(state, reducedMotion));
  }, [controller, turnRequestCount, reducedMotion]);

  function handleFacingChange(nextIsFacing: boolean) {
    setIsFacing(nextIsFacing);
    // Okno potrebuje vedieť, či je k hráčovi otočený rub.
    onFacingChange(isCountMode ? !nextIsFacing : nextIsFacing);
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("button")) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    controller.startDrag(event.pointerId, event.clientX, event.clientY);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) {
      return;
    }

    const nudge = (deltaYaw: number, deltaTilt: number) =>
      controller.update((state) => nudgeFlat(state, deltaYaw, deltaTilt));

    switch (event.key) {
      case "ArrowLeft":
        nudge(-KEYBOARD_YAW_STEP, 0);
        break;
      case "ArrowRight":
        nudge(KEYBOARD_YAW_STEP, 0);
        break;
      case "ArrowUp":
        nudge(0, -KEYBOARD_TILT_STEP);
        break;
      case "ArrowDown":
        nudge(0, KEYBOARD_TILT_STEP);
        break;
      default:
        return;
    }

    event.preventDefault();
  }

  const modelProps: ModelProps = {
    art,
    digit,
    isFound,
    worldWidth,
    worldHeight,
    textureWidth,
    textureHeight,
    countPoints,
  };

  return (
    <div
      ref={surfaceRef}
      role="group"
      tabIndex={0}
      aria-label="Predmet – nakláňaj ho ťahaním alebo šípkami, obráť ho tlačidlom Obrátiť"
      onPointerDown={handlePointerDown}
      onPointerMove={(event) =>
        controller.moveDrag(event.pointerId, event.clientX, event.clientY)
      }
      onPointerUp={(event) => controller.endDrag(event.pointerId, reducedMotion)}
      onPointerCancel={(event) =>
        controller.endDrag(event.pointerId, reducedMotion)
      }
      onKeyDown={handleKeyDown}
      className="relative h-full w-full cursor-grab touch-none select-none rounded-2xl outline-none focus-visible:ring-4 focus-visible:ring-amber-300/60 active:cursor-grabbing"
    >
      <InspectStage onFailure={onFailure}>
        <ControllerView
          controller={controller}
          reducedMotion={reducedMotion}
          isFound={isFound}
          isCountMode={isCountMode}
          onFacingChange={handleFacingChange}
          onAutoRecord={onFound}
        >
          {model === "seal" ? (
            <SealModel {...modelProps} />
          ) : model === "tooth" ? (
            <ToothModel {...modelProps} />
          ) : (
            <PaperModel {...modelProps} />
          )}

          {!isCountMode && isFacing && !isFound && (
            <Html position={hotspotPosition} center>
              <button
                type="button"
                onClick={onFound}
                aria-label={hotspotLabel}
                className={`block h-12 w-12 rounded-xl outline-none focus-visible:ring-4 focus-visible:ring-amber-300 ${
                  isHotspotGlowing ? GLOW_CLASSES : ""
                }`}
              />
            </Html>
          )}

          {isCountMode &&
            isFacing &&
            !isFound &&
            countPoints?.map((point, index) => {
              const isMarked = markedIndexes.includes(index);

              return (
                <Html
                  key={`${point.x}-${point.y}`}
                  position={[
                    (point.x - 0.5) * worldWidth,
                    (0.5 - point.y) * worldHeight,
                    frontZ,
                  ]}
                  center
                >
                  <button
                    type="button"
                    onClick={() => onMark?.(index)}
                    aria-label={countLabel}
                    aria-pressed={isMarked}
                    className={`block h-11 w-11 rounded-full outline-none focus-visible:ring-4 focus-visible:ring-amber-300 ${
                      isMarked
                        ? "border-2 border-amber-200 bg-amber-300/35 shadow-[0_0_12px_rgba(252,211,77,0.6)]"
                        : isHotspotGlowing
                          ? GLOW_CLASSES
                          : ""
                    }`}
                  />
                </Html>
              );
            })}
        </ControllerView>
      </InspectStage>
    </div>
  );
}

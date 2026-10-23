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
import type { Group } from "three";
import type { ItemInspectArt } from "../../../types/game";
import { ITEM_ARTS } from "../art/itemArtRegistry";
import { GLOW_CLASSES } from "../inspectStyles";
import { isBackFacing, stepDwell } from "./facing";
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
 * Výška listu v 3D. Kamera vidí asi 2,4 na výšku a plátno má rovnaký
 * pomer strán ako predmet, takže list vyplní asi 80 % plochy aj pri náklone.
 */
const WORLD_HEIGHT = 1.9;
const PAPER_DEPTH = 0.02;
const MAX_TEXTURE_SIZE = 1024;

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

type FlatModelProps = {
  art: ItemInspectArt;
  digit: string;
  isFound: boolean;
  worldWidth: number;
  worldHeight: number;
  textureWidth: number;
  textureHeight: number;
};

/** Tenký list papiera: líce a rub z kresby v components/items/art/. */
function FlatModel({
  art,
  digit,
  isFound,
  worldWidth,
  worldHeight,
  textureWidth,
  textureHeight,
}: FlatModelProps) {
  const definition = ITEM_ARTS[art];

  const frontSvg = useMemo(
    () => definition.getSvg("front", digit, false, `${art}-front`),
    [definition, art, digit]
  );
  const backSvg = useMemo(
    () => definition.getSvg("hidden", digit, isFound, `${art}-back`),
    [definition, art, digit, isFound]
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

type FlatControllerViewProps = {
  controller: FlatController;
  reducedMotion: boolean;
  isFound: boolean;
  onFacingChange: (isFacing: boolean) => void;
  onAutoRecord: () => void;
  children: ReactNode;
};

function FlatControllerView({
  controller,
  reducedMotion,
  isFound,
  onFacingChange,
  onAutoRecord,
  children,
}: FlatControllerViewProps) {
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

    const isFacing = isBackFacing(yaw, tilt);

    if (controller.setFacing(isFacing)) {
      onFacingChange(isFacing);
    }

    if (
      controller.advanceDwell(
        { isFacing, reducedMotion, isFound },
        dtSec * 1000
      )
    ) {
      onAutoRecord();
    }

    const isCountingDown = isFacing && !isFound && !reducedMotion;

    if (isFlatAtRest(controller.state) && !isCountingDown) {
      return;
    }

    invalidate();
  });

  return <group ref={groupRef}>{children}</group>;
}

type Flat3DViewProps = {
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
};

/** 3D plochý predmet (list, mapa) na obrazovke „Prezrieť“. */
export default function Flat3DView({
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
}: Flat3DViewProps) {
  const definition = ITEM_ARTS[art];
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
    -PAPER_DEPTH / 2 - 0.03,
  ];

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
    onFacingChange(nextIsFacing);
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
        <FlatControllerView
          controller={controller}
          reducedMotion={reducedMotion}
          isFound={isFound}
          onFacingChange={handleFacingChange}
          onAutoRecord={onFound}
        >
          <FlatModel
            art={art}
            digit={digit}
            isFound={isFound}
            worldWidth={worldWidth}
            worldHeight={worldHeight}
            textureWidth={textureWidth}
            textureHeight={textureHeight}
          />

          {isFacing && !isFound && (
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
        </FlatControllerView>
      </InspectStage>
    </div>
  );
}

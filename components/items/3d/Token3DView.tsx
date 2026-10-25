"use client";

import { Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import {
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import type { Group } from "three";
import { GLOW_CLASSES } from "../inspectStyles";
import { getNearestFacingYaw, isDigitFacing, stepDwell } from "./facing";
import { InspectStage } from "./InspectStage";
import {
  applyDrag,
  createRotationState,
  isRotationAtRest,
  KEYBOARD_TILT_STEP,
  KEYBOARD_YAW_STEP,
  type RotationState,
  releaseDrag,
  snapToYaw,
  stepRotation,
  tiltByStep,
} from "./rotationPhysics";
import { DIGIT_HOTSPOT_POSITION, TokenModel } from "./TokenModel";

/** Najdlhší krok jednej snímky – po prepnutí karty prehliadača neskočí žetón. */
const MAX_FRAME_SECONDS = 0.05;

/**
 * Premenlivý stav otáčania mimo Reactu. Ťahanie a šípky ho menia
 * a plátno si ho v každej snímke prečíta – bez zbytočného prekresľovania.
 */
class RotationController {
  state: RotationState = createRotationState();
  private dwellMs = 0;
  private isFacing = false;
  private drag: {
    pointerId: number;
    x: number;
    y: number;
    time: number;
  } | null = null;
  private invalidate: (() => void) | null = null;

  setInvalidate(invalidate: (() => void) | null) {
    this.invalidate = invalidate;
  }

  /** Zmena zvonku (ťahanie, šípky, natočenie) – vyžiada si novú snímku. */
  update(change: (state: RotationState) => RotationState) {
    this.state = change(this.state);
    this.invalidate?.();
  }

  /** Krok v snímke – ďalšiu snímku si nevyžiada (o nej rozhodne pokoj žetónu). */
  advance(change: (state: RotationState) => RotationState) {
    this.state = change(this.state);
  }

  requestFrame() {
    this.invalidate?.();
  }

  /** Zapamätá natočenie číslice; vráti true, ak sa zmenilo. */
  setFacing(isFacing: boolean) {
    const hasChanged = isFacing !== this.isFacing;
    this.isFacing = isFacing;

    return hasChanged;
  }

  /** Posunie odpočet automatického zápisu; vráti true, keď sa má zapísať. */
  advanceDwell(options: Omit<Parameters<typeof stepDwell>[1], "dtMs">, dtMs: number) {
    const dwell = stepDwell(this.dwellMs, { ...options, dtMs });
    this.dwellMs = dwell.shouldRecord ? 0 : dwell.dwellMs;

    return dwell.shouldRecord;
  }

  startDrag(pointerId: number, x: number, y: number) {
    this.drag = { pointerId, x, y, time: performance.now() };
    this.update((state) => applyDrag(state, 0, 0, 0));
  }

  moveDrag(pointerId: number, x: number, y: number) {
    if (!this.drag || this.drag.pointerId !== pointerId) {
      return;
    }

    const now = performance.now();
    const dx = x - this.drag.x;
    const dy = y - this.drag.y;
    const dtSec = (now - this.drag.time) / 1000;

    this.drag = { pointerId, x, y, time: now };
    this.update((state) => applyDrag(state, dx, dy, dtSec));
  }

  endDrag(pointerId: number, reducedMotion: boolean) {
    if (this.drag?.pointerId !== pointerId) {
      return;
    }

    this.drag = null;
    this.update((state) => releaseDrag(state, reducedMotion));
  }
}

type TokenControllerProps = {
  controller: RotationController;
  reducedMotion: boolean;
  isFound: boolean;
  onFacingChange: (isFacing: boolean) => void;
  onAutoRecord: () => void;
  children: ReactNode;
};

function TokenController({
  controller,
  reducedMotion,
  isFound,
  onFacingChange,
  onAutoRecord,
  children,
}: TokenControllerProps) {
  const groupRef = useRef<Group>(null);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    controller.setInvalidate(invalidate);
    controller.requestFrame();

    return () => controller.setInvalidate(null);
  }, [controller, invalidate]);

  useFrame((_, delta) => {
    const dtSec = Math.min(delta, MAX_FRAME_SECONDS);

    controller.advance((state) => stepRotation(state, dtSec, reducedMotion));

    const { yaw, tilt } = controller.state;
    groupRef.current?.rotation.set(tilt, yaw, 0);

    const isFacing = isDigitFacing(yaw, tilt);

    if (controller.setFacing(isFacing)) {
      onFacingChange(isFacing);
    }

    const shouldRecord = controller.advanceDwell(
      { isFacing, reducedMotion, isFound },
      dtSec * 1000
    );

    if (shouldRecord) {
      onAutoRecord();
    }

    // Ďalšiu snímku iba ak sa žetón hýbe alebo beží odpočet zápisu.
    const isCountingDown = isFacing && !isFound && !reducedMotion;

    if (isRotationAtRest(controller.state) && !isCountingDown) {
      return;
    }

    invalidate();
  });

  return <group ref={groupRef}>{children}</group>;
}

type Token3DViewProps = {
  digit: string;
  isFound: boolean;
  hotspotLabel: string;
  isHotspotGlowing: boolean;
  reducedMotion: boolean;
  /** Každé zvýšenie čísla = „Otočiť na hranu“. */
  snapRequestCount: number;
  focusOnMount: boolean;
  onFacingChange: (isFacing: boolean) => void;
  onFound: () => void;
  onFailure: () => void;
};

/** 3D žetón na obrazovke „Prezrieť“ (načítava sa až pri otvorení). */
export default function Token3DView({
  digit,
  isFound,
  hotspotLabel,
  isHotspotGlowing,
  reducedMotion,
  snapRequestCount,
  focusOnMount,
  onFacingChange,
  onFound,
  onFailure,
}: Token3DViewProps) {
  const [controller] = useState(() => new RotationController());
  const [isFacing, setIsFacing] = useState(false);
  const lastSnapRequestRef = useRef(snapRequestCount);
  const surfaceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (focusOnMount) {
      surfaceRef.current?.focus({ preventScroll: true });
    }
  }, [focusOnMount]);

  useEffect(() => {
    if (snapRequestCount === lastSnapRequestRef.current) {
      return;
    }

    lastSnapRequestRef.current = snapRequestCount;
    controller.update((state) =>
      snapToYaw(state, getNearestFacingYaw(state.yaw), reducedMotion)
    );
  }, [controller, snapRequestCount, reducedMotion]);

  function handleFacingChange(nextIsFacing: boolean) {
    setIsFacing(nextIsFacing);
    onFacingChange(nextIsFacing);
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    // Ťuknutie na tlačidlo pri číslici nemá spustiť otáčanie.
    if ((event.target as HTMLElement).closest("button")) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    controller.startDrag(event.pointerId, event.clientX, event.clientY);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    controller.moveDrag(event.pointerId, event.clientX, event.clientY);
  }

  function handlePointerEnd(event: PointerEvent<HTMLDivElement>) {
    controller.endDrag(event.pointerId, reducedMotion);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) {
      return;
    }

    const turnBy = (deltaYaw: number) =>
      controller.update((state) =>
        snapToYaw(state, (state.targetYaw ?? state.yaw) + deltaYaw, reducedMotion)
      );

    switch (event.key) {
      case "ArrowLeft":
        turnBy(-KEYBOARD_YAW_STEP);
        break;
      case "ArrowRight":
        turnBy(KEYBOARD_YAW_STEP);
        break;
      case "ArrowUp":
        controller.update((state) => tiltByStep(state, -KEYBOARD_TILT_STEP));
        break;
      case "ArrowDown":
        controller.update((state) => tiltByStep(state, KEYBOARD_TILT_STEP));
        break;
      case "Home":
        controller.update((state) => ({
          ...snapToYaw(state, 0, reducedMotion),
          tilt: 0,
          tiltHoldMs: 0,
        }));
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
      aria-label="Žetón – otáčaj ho ťahaním alebo šípkami doľava a doprava, nakláňaj šípkami hore a dole"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onKeyDown={handleKeyDown}
      className="relative h-full w-full cursor-grab touch-none select-none rounded-2xl outline-none focus-visible:ring-4 focus-visible:ring-amber-300/60 active:cursor-grabbing"
    >
      <InspectStage onFailure={onFailure}>
        <TokenController
          controller={controller}
          reducedMotion={reducedMotion}
          isFound={isFound}
          onFacingChange={handleFacingChange}
          onAutoRecord={onFound}
        >
          <TokenModel digit={digit} isDigitFound={isFound} />

          {isFacing && !isFound && (
            <Html position={DIGIT_HOTSPOT_POSITION} center>
              <button
                type="button"
                onClick={onFound}
                aria-label={hotspotLabel}
                className={`block h-16 w-12 rounded-xl outline-none focus-visible:ring-4 focus-visible:ring-amber-300 ${
                  isHotspotGlowing ? GLOW_CLASSES : ""
                }`}
              />
            </Html>
          )}
        </TokenController>
      </InspectStage>
    </div>
  );
}

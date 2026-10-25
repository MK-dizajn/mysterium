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
import { InspectStage } from "../../items/3d/InspectStage";
import {
  applyDrag,
  createRotationState,
  isRotationAtRest,
  KEYBOARD_TILT_STEP,
  KEYBOARD_YAW_STEP,
  releaseDrag,
  type RotationState,
  snapToYaw,
  stepRotation,
  tiltByStep,
} from "../../items/3d/rotationPhysics";
import {
  getFacingYawForLocks,
  getNearestYaw,
  isLockFacing,
} from "./chestFacing";
import {
  type ChestLockState,
  ChestModel3D,
  LOCK_LABEL_OFFSET,
  LOCK_PLACEMENTS,
} from "./ChestModel3D";

/** Najdlhší krok jednej snímky – po prepnutí karty prehliadača neskočí truhlica. */
const MAX_FRAME_SECONDS = 0.05;
/** Truhlica je mierne naklonená, aby bolo vidieť aj veko. */
const BASE_TILT = 0.32;
const CHEST_SCALE = 0.55;
/** Posun ukazovateľa, od ktorého ide o ťahanie (nie ťuknutie). */
const DRAG_SLOP_PX = 6;

type LockView = {
  lockLabel: string;
  isOpen: boolean;
  isNext: boolean;
};

/** Premenlivý stav otáčania mimo Reactu (ako pri 3D predmetoch). */
class ChestController {
  state: RotationState;
  private facing: boolean[] = [];
  private drag: {
    pointerId: number;
    startX: number;
    startY: number;
    x: number;
    y: number;
    time: number;
    isDragging: boolean;
  } | null = null;
  private invalidate: (() => void) | null = null;

  constructor(initialYaw: number) {
    this.state = { ...createRotationState(), yaw: initialYaw };
  }

  setInvalidate(invalidate: (() => void) | null) {
    this.invalidate = invalidate;
  }

  /** Zmena zvonku (ťahanie, šípky, natočenie) – vyžiada si novú snímku. */
  update(change: (state: RotationState) => RotationState) {
    this.state = change(this.state);
    this.invalidate?.();
  }

  /** Krok v snímke – ďalšiu snímku si nevyžiada (o nej rozhodne pokoj truhlice). */
  advance(change: (state: RotationState) => RotationState) {
    this.state = change(this.state);
  }

  /** Zapamätá, ktoré zámky sú natočené k hráčovi; vráti true pri zmene. */
  setFacing(facing: boolean[]) {
    const hasChanged = facing.some((value, index) => value !== this.facing[index]);
    this.facing = facing;

    return hasChanged;
  }

  startDrag(pointerId: number, x: number, y: number) {
    this.drag = { pointerId, startX: x, startY: y, x, y, time: performance.now(), isDragging: false };
  }

  /** Vráti true, keď sa ťuknutie práve zmenilo na ťahanie. */
  moveDrag(pointerId: number, x: number, y: number) {
    if (!this.drag || this.drag.pointerId !== pointerId) {
      return false;
    }

    const drag = this.drag;
    const becameDrag =
      !drag.isDragging &&
      Math.hypot(x - drag.startX, y - drag.startY) > DRAG_SLOP_PX;

    if (becameDrag) {
      drag.isDragging = true;
    }

    if (!drag.isDragging) {
      return false;
    }

    const now = performance.now();
    const dx = x - drag.x;
    const dy = y - drag.y;
    const dtSec = (now - drag.time) / 1000;

    this.drag = { ...drag, x, y, time: now };
    this.update((state) => applyDrag(state, dx, dy, dtSec));

    return becameDrag;
  }

  endDrag(pointerId: number, reducedMotion: boolean) {
    if (this.drag?.pointerId !== pointerId) {
      return;
    }

    const wasDragging = this.drag.isDragging;
    this.drag = null;

    if (wasDragging) {
      this.update((state) => releaseDrag(state, reducedMotion));
    }
  }
}

function ChestRotation({
  controller,
  reducedMotion,
  onFacingChange,
  children,
}: {
  controller: ChestController;
  reducedMotion: boolean;
  onFacingChange: (facing: boolean[]) => void;
  children: ReactNode;
}) {
  const groupRef = useRef<Group>(null);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    controller.setInvalidate(invalidate);
    invalidate();

    return () => controller.setInvalidate(null);
  }, [controller, invalidate]);

  useFrame((_, delta) => {
    const dtSec = Math.min(delta, MAX_FRAME_SECONDS);

    controller.advance((state) => stepRotation(state, dtSec, reducedMotion));

    const { yaw, tilt } = controller.state;
    groupRef.current?.rotation.set(BASE_TILT + tilt, yaw, 0);

    const facing = LOCK_PLACEMENTS.map((_placement, index) =>
      isLockFacing(yaw, tilt, index)
    );

    if (controller.setFacing(facing)) {
      onFacingChange(facing);
    }

    // Ďalšiu snímku iba vtedy, keď sa truhlica hýbe.
    if (!isRotationAtRest(controller.state)) {
      invalidate();
    }
  });

  return (
    <group position={[0, -0.12, 0]}>
      <group ref={groupRef} scale={CHEST_SCALE}>
        {children}
      </group>
    </group>
  );
}

type Chest3DViewProps = {
  locks: LockView[];
  stateLabels: { open: string; closed: string; next: string };
  selectedIndex: number | null;
  onSelectLock: (index: number) => void;
  isKeyInserted: boolean;
  isLidOpen: boolean;
  reducedMotion: boolean;
  onFailure: () => void;
};

/** Poloha štítku zámku v súradniciach truhlice. */
function getLabelPosition(index: number): [number, number, number] {
  const { position, rotationY } = LOCK_PLACEMENTS[index];
  const [ox, oy, oz] = LOCK_LABEL_OFFSET;

  return [
    position[0] + Math.sin(rotationY) * oz + Math.cos(rotationY) * ox,
    position[1] + oy,
    position[2] + Math.cos(rotationY) * oz - Math.sin(rotationY) * ox,
  ];
}

/** 3D truhlica vo finále (načítava sa až na obrazovke truhlice). */
export default function Chest3DView({
  locks,
  stateLabels,
  selectedIndex,
  onSelectLock,
  isKeyInserted,
  isLidOpen,
  reducedMotion,
  onFailure,
}: Chest3DViewProps) {
  // Pri vstupe je truhlica natočená k zámku na rade.
  const [controller] = useState(
    () => new ChestController(getFacingYawForLocks(locks))
  );
  const [facing, setFacing] = useState<boolean[]>([]);
  const facingYaw = getFacingYawForLocks(locks);
  const lastFacingYawRef = useRef(facingYaw);

  // Po odomknutí sa truhlica natočí k ďalšiemu zámku (pri vypnutých animáciách hneď).
  useEffect(() => {
    if (facingYaw === lastFacingYawRef.current) {
      return;
    }

    lastFacingYawRef.current = facingYaw;
    controller.update((state) =>
      snapToYaw(state, getNearestYaw(state.yaw, facingYaw), reducedMotion)
    );
  }, [controller, facingYaw, reducedMotion]);

  const lockStates: ChestLockState[] = locks.map((lock) =>
    lock.isOpen ? "open" : lock.isNext ? "next" : "closed"
  );

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("button")) {
      return;
    }

    controller.startDrag(event.pointerId, event.clientX, event.clientY);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    // Ťahanie si zachytí ukazovateľ až po posune – ťuknutie ostane zámku.
    if (controller.moveDrag(event.pointerId, event.clientX, event.clientY)) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
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
      default:
        return;
    }

    event.preventDefault();
  }

  return (
    <div
      role="group"
      tabIndex={0}
      aria-label="Truhlica – otáčaj ju ťahaním alebo šípkami doľava a doprava"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onKeyDown={handleKeyDown}
      className="relative h-full w-full cursor-grab touch-none select-none rounded-2xl outline-none focus-visible:ring-4 focus-visible:ring-amber-300/60 active:cursor-grabbing"
    >
      <InspectStage onFailure={onFailure}>
        {/* Drevo je tmavé – trochu viac svetla ako pri predmetoch. */}
        <ambientLight intensity={0.5} color="#ffe6c0" />

        <ChestRotation
          controller={controller}
          reducedMotion={reducedMotion}
          onFacingChange={setFacing}
        >
          <ChestModel3D
            lockStates={lockStates}
            selectedIndex={selectedIndex}
            onSelectLock={onSelectLock}
            isKeyInserted={isKeyInserted}
            isLidOpen={isLidOpen}
          />

          {locks.map((lock, index) =>
            facing[index] ? (
              <Html key={lock.lockLabel} position={getLabelPosition(index)} center>
                <button
                  type="button"
                  onClick={() => onSelectLock(index)}
                  aria-pressed={selectedIndex === index}
                  aria-label={`Zámok ${lock.lockLabel} – ${
                    lock.isOpen
                      ? stateLabels.open
                      : lock.isNext
                        ? stateLabels.next
                        : stateLabels.closed
                  }`}
                  className={`flex min-h-11 min-w-11 items-center gap-1.5 whitespace-nowrap rounded-full border-2 px-3 py-1.5 text-base font-black outline-none transition focus-visible:ring-4 focus-visible:ring-amber-300 motion-reduce:transition-none ${
                    lock.isOpen
                      ? "border-emerald-300/70 bg-emerald-950/85 text-emerald-100"
                      : lock.isNext
                        ? "border-amber-300 bg-amber-950/90 text-amber-100 shadow-[0_0_14px_rgba(252,211,77,0.55)] motion-safe:animate-pulse"
                        : "border-slate-500/60 bg-slate-950/85 text-slate-200"
                  } ${selectedIndex === index ? "ring-4 ring-amber-200" : ""}`}
                >
                  <span aria-hidden="true">{lock.isOpen ? "🔓" : "🔒"}</span>
                  {`Zámok ${lock.lockLabel}`}
                </button>
              </Html>
            ) : null
          )}
        </ChestRotation>
      </InspectStage>
    </div>
  );
}

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
import type { UnlockFinaleLockResult } from "../../../engine";
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
import { ActionButton } from "../../ui/ActionButton";
import {
  getFacingYawForLocks,
  getNearestYaw,
  isLockFacing,
  LOCK_FACE_YAWS,
} from "./chestFacing";
import {
  type ChestLockState,
  ChestModel3D,
  LOCK_LABEL_OFFSET,
  LOCK_PLACEMENTS,
} from "./ChestModel3D";
import {
  blendTransform,
  type ChestTransform,
  easeZoom,
  getDragSteps,
  getTapStep,
  getZoomTransform,
  OVERVIEW_TRANSFORM,
  stepZoom,
} from "./chestZoom";

/** Najdlhší krok jednej snímky – po prepnutí karty prehliadača neskočí truhlica. */
const MAX_FRAME_SECONDS = 0.05;
/** Posun ukazovateľa, od ktorého ide o ťahanie (nie ťuknutie). */
const DRAG_SLOP_PX = 6;
/** Po správnom kóde chvíľu ostane priblížené, aby bolo vidieť zelený zámok. */
const UNLOCK_ZOOM_OUT_DELAY_MS = 350;

const STILL_BUTTON = "motion-reduce:transition-none motion-reduce:active:scale-100";

type LockView = {
  lockLabel: string;
  isOpen: boolean;
  isNext: boolean;
};

/** Premenlivý stav otáčania a priblíženia mimo Reactu (ako pri 3D predmetoch). */
class ChestController {
  state: RotationState;
  /** Priebeh priblíženia 0 (celá truhlica) až 1 (zámok). */
  zoom = 0;
  zoomTarget = 0;
  zoomTransform: ChestTransform = OVERVIEW_TRANSFORM;
  /** Od priblíženia, kým sa pohľad celý nevráti späť. */
  isZoomActive = false;
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

  zoomIn(transform: ChestTransform) {
    this.zoomTransform = transform;
    this.zoomTarget = 1;
    this.isZoomActive = true;
    this.invalidate?.();
  }

  zoomOut() {
    this.zoomTarget = 0;
    this.invalidate?.();
  }

  /** Krok priblíženia v snímke; vráti, ako veľmi je priblížené (0 až 1). */
  advanceZoom(dtSec: number, reducedMotion: boolean) {
    this.zoom = stepZoom(this.zoom, this.zoomTarget, dtSec, reducedMotion);

    return easeZoom(this.zoom);
  }

  isZoomMoving() {
    return this.zoom !== this.zoomTarget;
  }

  /** Vráti true práve raz, keď sa pohľad po priblížení celý vrátil na truhlicu. */
  takeZoomedOut() {
    if (this.isZoomActive && this.zoomTarget === 0 && this.zoom === 0) {
      this.isZoomActive = false;
      return true;
    }

    return false;
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
  onZoomedOut,
  children,
}: {
  controller: ChestController;
  reducedMotion: boolean;
  onFacingChange: (facing: boolean[]) => void;
  /** Pohľad sa po priblížení celý vrátil na truhlicu. */
  onZoomedOut: () => void;
  children: ReactNode;
}) {
  const positionRef = useRef<Group>(null);
  const groupRef = useRef<Group>(null);
  const invalidate = useThree((state) => state.invalidate);
  const onZoomedOutRef = useRef(onZoomedOut);

  useEffect(() => {
    onZoomedOutRef.current = onZoomedOut;
  });

  useEffect(() => {
    controller.setInvalidate(invalidate);
    invalidate();

    return () => controller.setInvalidate(null);
  }, [controller, invalidate]);

  useFrame((_, delta) => {
    const dtSec = Math.min(delta, MAX_FRAME_SECONDS);

    controller.advance((state) => stepRotation(state, dtSec, reducedMotion));
    const zoomAmount = controller.advanceZoom(dtSec, reducedMotion);

    const { yaw, tilt } = controller.state;
    const view = blendTransform(OVERVIEW_TRANSFORM, controller.zoomTransform, zoomAmount);

    positionRef.current?.position.set(0, view.y, view.z);
    groupRef.current?.scale.setScalar(view.scale);
    groupRef.current?.rotation.set(view.tilt + tilt, yaw, 0);

    const facing = LOCK_PLACEMENTS.map((_placement, index) =>
      isLockFacing(yaw, tilt, index)
    );

    if (controller.setFacing(facing)) {
      onFacingChange(facing);
    }

    if (controller.takeZoomedOut()) {
      onZoomedOutRef.current();
    }

    // Ďalšiu snímku iba vtedy, keď sa truhlica hýbe.
    if (!isRotationAtRest(controller.state) || controller.isZoomMoving()) {
      invalidate();
    }
  });

  return (
    <group ref={positionRef}>
      <group ref={groupRef}>{children}</group>
    </group>
  );
}

/** Jedno koliesko nad scénou: ťuknutie hore/dole, ťahanie prstom, šípky. */
function DialWheelControl({
  value,
  label,
  onStep,
  wheelRef,
}: {
  value: number;
  label: string;
  onStep: (delta: number) => void;
  wheelRef?: (element: HTMLDivElement | null) => void;
}) {
  const dragRef = useRef<{
    pointerId: number;
    startY: number;
    appliedSteps: number;
    isDragging: boolean;
  } | null>(null);

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
      appliedSteps: 0,
      isDragging: false,
    };
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;

    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    const deltaY = event.clientY - drag.startY;
    drag.isDragging ||= Math.abs(deltaY) > DRAG_SLOP_PX;

    const steps = getDragSteps(deltaY);

    if (drag.isDragging && steps !== drag.appliedSteps) {
      onStep(steps - drag.appliedSteps);
      drag.appliedSteps = steps;
    }
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    dragRef.current = null;

    if (!drag || drag.pointerId !== event.pointerId || drag.isDragging) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    onStep(getTapStep(event.clientY - rect.top, rect.height));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowUp") {
      onStep(1);
    } else if (event.key === "ArrowDown") {
      onStep(-1);
    } else {
      return;
    }

    event.preventDefault();
  }

  return (
    <div
      ref={wheelRef}
      role="spinbutton"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={9}
      aria-valuenow={value}
      aria-valuetext={`číslica ${value}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        dragRef.current = null;
      }}
      onKeyDown={handleKeyDown}
      className="flex min-h-11 min-w-11 flex-1 cursor-ns-resize touch-none select-none flex-col items-center justify-between rounded-xl py-1 text-lg text-amber-100/80 outline-none [text-shadow:0_1px_3px_rgba(0,0,0,0.9)] focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-amber-300"
    >
      <span aria-hidden="true">▲</span>
      <span aria-hidden="true">▼</span>
    </div>
  );
}

type Chest3DViewProps = {
  locks: LockView[];
  /** Číslice na kolieskach každého zámku (spoločné s 2D ovládaním). */
  lockDigits: number[][];
  stateLabels: { open: string; closed: string; next: string };
  texts: { backLabel: string; unlockLabel: string; dialWheelLabel: string };
  selectedIndex: number | null;
  onSelectLock: (index: number) => void;
  /** Pootočí koliesko o delta (+1 hore, −1 dole). */
  onStepDigit: (lockIndex: number, digitIndex: number, delta: number) => void;
  /** Skúsi kód priblíženého zámku (kontrola je iba v engine). */
  onUnlockLock: (lockIndex: number) => UnlockFinaleLockResult;
  /** Po správnom kóde sa pohľad oddialil – čas na hlášku. */
  onUnlockSettled: (lockIndex: number) => void;
  onZoomChange: (isZoomed: boolean) => void;
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

/** „Koliesko {index} z {count}“ → „koliesko 1 z 3“ (pokračuje za názvom zámku). */
function formatWheelLabel(template: string, index: number, count: number) {
  const label = template
    .replace("{index}", String(index))
    .replace("{count}", String(count));

  return label.charAt(0).toLowerCase() + label.slice(1);
}

/** 3D truhlica vo finále (načítava sa až na obrazovke truhlice). */
export default function Chest3DView({
  locks,
  lockDigits,
  stateLabels,
  texts,
  selectedIndex,
  onSelectLock,
  onStepDigit,
  onUnlockLock,
  onUnlockSettled,
  onZoomChange,
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
  const [zoomedIndex, setZoomedIndex] = useState<number | null>(null);
  const [isZoomActive, setIsZoomActive] = useState(false);
  const [shakeKeys, setShakeKeys] = useState(() => locks.map(() => 0));
  const rootRef = useRef<HTMLDivElement>(null);
  const firstWheelRef = useRef<HTMLDivElement | null>(null);
  const pendingSettleRef = useRef<number | null>(null);
  const timersRef = useRef<number[]>([]);
  const facingYaw = getFacingYawForLocks(locks);
  const lastFacingYawRef = useRef(facingYaw);
  // Kolieska nad scénou iba pri zámku, ktorý je stále na rade.
  const overlayIndex =
    zoomedIndex !== null && locks[zoomedIndex]?.isNext && !isKeyInserted
      ? zoomedIndex
      : null;

  useEffect(
    () => () => timersRef.current.forEach((timer) => window.clearTimeout(timer)),
    []
  );

  // Po odomknutí sa truhlica natočí k ďalšiemu zámku – až keď sa pohľad oddiali
  // (pri vypnutých animáciách hneď).
  useEffect(() => {
    if (isZoomActive || facingYaw === lastFacingYawRef.current) {
      return;
    }

    lastFacingYawRef.current = facingYaw;
    controller.update((state) =>
      snapToYaw(state, getNearestYaw(state.yaw, facingYaw), reducedMotion)
    );
  }, [controller, facingYaw, isZoomActive, reducedMotion]);

  // Zámok sa odomkol inak (2D ovládaním) počas priblíženia – oddialiť.
  useEffect(() => {
    if (zoomedIndex !== null && overlayIndex === null && pendingSettleRef.current === null) {
      controller.zoomOut();
    }
  }, [controller, zoomedIndex, overlayIndex]);

  // Po priblížení dostane fokus prvé koliesko (čítačka ho hneď prečíta).
  useEffect(() => {
    if (overlayIndex !== null) {
      firstWheelRef.current?.focus({ preventScroll: true });
    }
  }, [overlayIndex]);

  const lockStates: ChestLockState[] = locks.map((lock) =>
    lock.isOpen ? "open" : lock.isNext ? "next" : "closed"
  );

  function zoomIn(index: number) {
    const [x, y, z] = LOCK_PLACEMENTS[index].position;

    controller.zoomIn(getZoomTransform(y, Math.hypot(x, z)));
    controller.update((state) =>
      snapToYaw(state, getNearestYaw(state.yaw, LOCK_FACE_YAWS[index] ?? 0), reducedMotion)
    );
    setZoomedIndex(index);
    setIsZoomActive(true);
    onZoomChange(true);
    rootRef.current?.scrollIntoView({
      block: "nearest",
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }

  function handleSelectLock(index: number) {
    onSelectLock(index);

    if (!isZoomActive && locks[index]?.isNext && !isKeyInserted) {
      zoomIn(index);
    }
  }

  /** Fokus z koliesok späť na truhlicu, kým kolieska zmiznú. */
  function keepFocusOnChest() {
    const root = rootRef.current;

    if (root && root !== document.activeElement && root.contains(document.activeElement)) {
      root.focus({ preventScroll: true });
    }
  }

  function zoomBack() {
    keepFocusOnChest();
    setZoomedIndex(null);
    controller.zoomOut();
  }

  function unlockZoomedLock() {
    if (overlayIndex === null) {
      return;
    }

    const index = overlayIndex;
    const result = onUnlockLock(index);

    if (result === "wrong") {
      if (!reducedMotion) {
        setShakeKeys((keys) => keys.map((key, i) => (i === index ? key + 1 : key)));
      }

      return;
    }

    if (result === "opened") {
      // Zámok zozelenie a vysunie oblúk, potom sa pohľad oddiali.
      // Kolieska a tlačidlá zmiznú – fokus prejde na truhlicu.
      keepFocusOnChest();
      pendingSettleRef.current = index;

      if (reducedMotion) {
        controller.zoomOut();
      } else {
        timersRef.current.push(
          window.setTimeout(() => controller.zoomOut(), UNLOCK_ZOOM_OUT_DELAY_MS)
        );
      }
    }
  }

  function handleZoomedOut() {
    setZoomedIndex(null);
    setIsZoomActive(false);
    onZoomChange(false);

    const settledIndex = pendingSettleRef.current;

    if (settledIndex !== null) {
      pendingSettleRef.current = null;
      onUnlockSettled(settledIndex);
    }
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (isZoomActive || (event.target as HTMLElement).closest("button")) {
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
    if (event.key === "Escape" && overlayIndex !== null) {
      event.preventDefault();
      zoomBack();
      return;
    }

    if (event.target !== event.currentTarget || isZoomActive) {
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

  const overlayLock = overlayIndex === null ? null : locks[overlayIndex];
  const overlayDigits = overlayIndex === null ? [] : (lockDigits[overlayIndex] ?? []);

  return (
    <div
      ref={rootRef}
      role="group"
      tabIndex={0}
      aria-label="Truhlica – otáčaj ju ťahaním alebo šípkami doľava a doprava"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onKeyDown={handleKeyDown}
      // scroll-mt: pri priblížení sa truhlica posunie celá pod pevnú hlavičku (161 px).
      className={`relative h-full w-full scroll-mt-44 scroll-mb-4 touch-none select-none rounded-2xl outline-none focus-visible:ring-4 focus-visible:ring-amber-300/60 ${
        isZoomActive ? "" : "cursor-grab active:cursor-grabbing"
      }`}
    >
      <InspectStage onFailure={onFailure}>
        {/* Drevo je tmavé – trochu viac svetla ako pri predmetoch. */}
        <ambientLight intensity={0.5} color="#ffe6c0" />

        <ChestRotation
          controller={controller}
          reducedMotion={reducedMotion}
          onFacingChange={setFacing}
          onZoomedOut={handleZoomedOut}
        >
          <ChestModel3D
            lockStates={lockStates}
            lockDigits={lockDigits}
            shakeKeys={shakeKeys}
            selectedIndex={selectedIndex}
            onSelectLock={handleSelectLock}
            isKeyInserted={isKeyInserted}
            isLidOpen={isLidOpen}
            reducedMotion={reducedMotion}
          />

          {locks.map((lock, index) =>
            facing[index] && !isZoomActive ? (
              <Html key={lock.lockLabel} position={getLabelPosition(index)} center>
                <button
                  type="button"
                  onClick={() => handleSelectLock(index)}
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

      {/* Priblížený zámok: kolieska v tretinách šírky, pod nimi tlačidlá. */}
      {overlayIndex !== null && overlayLock && (
        <div className="absolute inset-0 flex flex-col">
          <div className="flex min-h-0 flex-1">
            {overlayDigits.map((digit, digitIndex) => (
              <DialWheelControl
                key={digitIndex}
                value={digit}
                label={`Zámok ${overlayLock.lockLabel}, ${formatWheelLabel(
                  texts.dialWheelLabel,
                  digitIndex + 1,
                  overlayDigits.length
                )}`}
                onStep={(delta) => onStepDigit(overlayIndex, digitIndex, delta)}
                wheelRef={
                  digitIndex === 0
                    ? (element) => {
                        firstWheelRef.current = element;
                      }
                    : undefined
                }
              />
            ))}
          </div>

          <div className="flex gap-2 p-2">
            <ActionButton
              variant="secondary"
              fullWidth={false}
              onClick={zoomBack}
              className={`h-[54px] shrink-0 px-4 py-0 ${STILL_BUTTON}`}
            >
              {texts.backLabel}
            </ActionButton>
            <ActionButton
              onClick={unlockZoomedLock}
              // Užšie medzery medzi písmenami – nápis sa zmestí do riadku aj na 360 px.
              className={`h-[54px] flex-1 px-3 py-0 tracking-[0.06em]! ${STILL_BUTTON}`}
            >
              {texts.unlockLabel}
            </ActionButton>
          </div>
        </div>
      )}
    </div>
  );
}

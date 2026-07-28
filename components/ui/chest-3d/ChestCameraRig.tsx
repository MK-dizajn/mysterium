"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import { PerspectiveCamera, Vector3 } from "three";
import type {
  ChestCameraRigProps,
  ChestPresentation,
} from "./chest3DTypes";

export type ChestCameraPreset = {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
};

type ViewportInfo = {
  width: number;
  height: number;
};

export function getChestCameraPreset(
  presentation: ChestPresentation,
  isFocused: boolean,
  viewport?: ViewportInfo
): ChestCameraPreset {
  const width = viewport?.width ?? 1024;
  const height = viewport?.height ?? 768;
  const aspect = height > 0 ? width / height : 1;

  const isVeryNarrow = width <= 390 || aspect < 0.72;
  const isNarrow = width <= 480 || aspect < 0.9;

  if (isFocused) {
    if (isVeryNarrow) {
      return {
        position: [0, 0.05, 5.45],
        target: [0, -0.2, 0.72],
        fov: 39,
      };
    }

    if (isNarrow) {
      return {
        position: [0, 0.05, 4.95],
        target: [0, -0.2, 0.76],
        fov: 37,
      };
    }

    return {
      position: [0, 0.05, 4.15],
      target: [0, -0.2, 0.8],
      fov: 34,
    };
  }

  if (presentation === "cinematic") {
    if (isVeryNarrow) {
      return {
        position: [0, 1.65, 7.45],
        target: [0, -0.08, 0],
        fov: 40,
      };
    }

    if (isNarrow) {
      return {
        position: [0, 1.6, 6.95],
        target: [0, -0.08, 0],
        fov: 38,
      };
    }

    return {
      position: [0, 1.55, 6.35],
      target: [0, -0.08, 0],
      fov: 36,
    };
  }

  if (presentation === "explore") {
    if (isVeryNarrow) {
      return {
        position: [5.35, 3.35, 8.2],
        target: [0, -0.08, 0],
        fov: 41,
      };
    }

    if (isNarrow) {
      return {
        position: [4.85, 3.1, 7.35],
        target: [0, -0.07, 0],
        fov: 38,
      };
    }

    return {
      position: [4.25, 2.8, 5.75],
      target: [0, -0.05, 0],
      fov: 34,
    };
  }

  if (isVeryNarrow) {
    return {
      position: [5.6, 3.5, 8.35],
      target: [0, -0.06, 0],
      fov: 42,
    };
  }

  if (isNarrow) {
    return {
      position: [5.15, 3.3, 7.55],
      target: [0, -0.06, 0],
      fov: 40,
    };
  }

  return {
    position: [4.8, 3.15, 6.5],
    target: [0, -0.05, 0],
    fov: 38,
  };
}

export function ChestCameraRig({
  isFocused,
  presentation,
}: ChestCameraRigProps) {
  const { camera, size } = useThree();

  const preset = useMemo(
    () =>
      getChestCameraPreset(presentation, isFocused, {
        width: size.width,
        height: size.height,
      }),
    [presentation, isFocused, size.width, size.height]
  );

  const targetPosition = useMemo(
    () => new Vector3(...preset.position),
    [preset.position]
  );

  const targetLookAt = useMemo(
    () => new Vector3(...preset.target),
    [preset.target]
  );

  const currentLookAt = useRef(new Vector3(...preset.target));
  const initialized = useRef(false);
  const previousFocusedState = useRef(isFocused);
  const previousPresentation = useRef(presentation);
  const previousWidth = useRef(size.width);
  const previousHeight = useRef(size.height);

  useLayoutEffect(() => {
    const viewportChanged =
      previousWidth.current !== size.width ||
      previousHeight.current !== size.height;

    const focusChanged =
      previousFocusedState.current !== isFocused;

    const presentationChanged =
      previousPresentation.current !== presentation;

    const shouldSnap =
      !initialized.current ||
      (viewportChanged &&
        !focusChanged &&
        !presentationChanged);

    if (!shouldSnap) {
      return;
    }

    camera.position.copy(targetPosition);
    currentLookAt.current.copy(targetLookAt);
    camera.lookAt(currentLookAt.current);

    if (camera instanceof PerspectiveCamera) {
      camera.fov = preset.fov;
      camera.aspect = size.width / Math.max(size.height, 1);
      camera.updateProjectionMatrix();
    }

    initialized.current = true;
    previousFocusedState.current = isFocused;
    previousPresentation.current = presentation;
    previousWidth.current = size.width;
    previousHeight.current = size.height;
  }, [
    camera,
    isFocused,
    presentation,
    preset.fov,
    size.height,
    size.width,
    targetLookAt,
    targetPosition,
  ]);

  useFrame((_, delta) => {
    if (!initialized.current) {
      return;
    }

    const focusChanged =
      previousFocusedState.current !== isFocused;

    const presentationChanged =
      previousPresentation.current !== presentation;

    if (!focusChanged && !presentationChanged) {
      return;
    }

    const smoothing = 1 - Math.exp(-delta * 3.6);

    camera.position.lerp(targetPosition, smoothing);
    currentLookAt.current.lerp(targetLookAt, smoothing);
    camera.lookAt(currentLookAt.current);

    if (camera instanceof PerspectiveCamera) {
      camera.fov +=
        (preset.fov - camera.fov) * smoothing;
      camera.aspect = size.width / Math.max(size.height, 1);
      camera.updateProjectionMatrix();
    }

    const positionReady =
      camera.position.distanceTo(targetPosition) < 0.003;
    const lookReady =
      currentLookAt.current.distanceTo(targetLookAt) < 0.003;
    const fovReady =
      !(camera instanceof PerspectiveCamera) ||
      Math.abs(camera.fov - preset.fov) < 0.015;

    if (!positionReady || !lookReady || !fovReady) {
      return;
    }

    camera.position.copy(targetPosition);
    currentLookAt.current.copy(targetLookAt);
    camera.lookAt(currentLookAt.current);

    if (camera instanceof PerspectiveCamera) {
      camera.fov = preset.fov;
      camera.aspect = size.width / Math.max(size.height, 1);
      camera.updateProjectionMatrix();
    }

    previousFocusedState.current = isFocused;
    previousPresentation.current = presentation;
    previousWidth.current = size.width;
    previousHeight.current = size.height;
  });

  return null;
}

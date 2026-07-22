import { ChestInnerLight } from "./ChestInnerLight";
import { ChestLid } from "./ChestLid";
import { ChestLightEffects } from "./ChestLightEffects";
import { ChestMist } from "./ChestMist";
import { ChestParticles } from "./ChestParticles";
import { ChestPhotoFragments } from "./ChestPhotoFragments";

type ChestVisualProps = {
  isLidOpen: boolean;
  isLightVisible: boolean;
  areFragmentsVisible: boolean;
  fragmentClasses: string[];
  onRewardClick?: () => void;
};

export function ChestVisual({
  isLidOpen,
  isLightVisible,
  areFragmentsVisible,
  fragmentClasses,
  onRewardClick,
}: ChestVisualProps) {
  return (
    <>
      <ChestLid isLidOpen={isLidOpen} />

      <ChestMist isLightVisible={isLightVisible} />

      <ChestInnerLight isLightVisible={isLightVisible} />

      <ChestLightEffects isLightVisible={isLightVisible} />

      <ChestParticles isLightVisible={isLightVisible} />

      <ChestPhotoFragments
        areFragmentsVisible={areFragmentsVisible}
        fragmentClasses={fragmentClasses}
        onRewardClick={onRewardClick}
      />
    </>
  );
}
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
  fragmentClasses: readonly string[];
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
      {/* Konštrukcia a pohyb veka */}
      <ChestLid isLidOpen={isLidOpen} />

      {/* Atmosféra vystupujúca z otvorenej truhlice */}
      <ChestMist isLightVisible={isLightVisible} />

      {/* Hlavný zdroj svetla vo vnútri truhlice */}
      <ChestInnerLight isLightVisible={isLightVisible} />

      {/* Filmové lúče, odlesky a svetelné pulzy */}
      <ChestLightEffects isLightVisible={isLightVisible} />

      {/* Jemné prachové a žiarivé častice */}
      <ChestParticles isLightVisible={isLightVisible} />

      {/* Interaktívna odmena musí zostať ako najvyššia vrstva */}
      <ChestPhotoFragments
        areFragmentsVisible={areFragmentsVisible}
        fragmentClasses={[...fragmentClasses]}
        onRewardClick={onRewardClick}
      />
    </>
  );
}
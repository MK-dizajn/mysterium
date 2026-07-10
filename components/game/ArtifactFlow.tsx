import type { Artifact } from "../../types/game";
import { ArtifactScreen } from "../screens/ArtifactScreen";

type ArtifactFlowProps = {
  artifact: Artifact;
  onBack: () => void;
};

export function ArtifactFlow({
  artifact,
  onBack,
}: ArtifactFlowProps) {
  return (
    <ArtifactScreen
      artifact={artifact}
      onBack={onBack}
    />
  );
}
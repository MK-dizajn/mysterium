import type { GameState, Scene } from "../../types/game";
import { GameLayout } from "../layout/GameLayout";
import { PuzzleScreen } from "../screens/PuzzleScreen";

type PuzzleFlowProps = {
  gameState: GameState;
  scene: Scene;
  onOpenInventory: () => void;
  onOpenArtifacts: () => void;
  onOpenQuests: () => void;
  onOpenNpcDialogue: (npcId: string) => void;
  onSolved: (hintsUsed: number) => void;
};

export function PuzzleFlow({
  gameState,
  scene,
  onOpenInventory,
  onOpenArtifacts,
  onOpenQuests,
  onOpenNpcDialogue,
  onSolved,
}: PuzzleFlowProps) {
  const isMichalskaLocked =
    scene.id === "michalska-brana" &&
    !gameState.flags.talked_to_michalska_guardian;

  function openFirstSceneNpc() {
    const npc = scene.npcs?.[0];

    if (!npc) {
      return;
    }

    onOpenNpcDialogue(npc.id);
  }

  return (
    <GameLayout
      gameState={gameState}
      currentScreen={gameState.screen}
      onOpenInventory={onOpenInventory}
      onOpenArtifacts={onOpenArtifacts}
      onOpenQuests={onOpenQuests}
    >
      {isMichalskaLocked ? (
        <section className="mx-auto mt-12 max-w-2xl rounded-3xl border border-amber-300/30 bg-stone-950/80 p-6 text-stone-100 shadow-2xl">
          <p className="mb-2 text-sm uppercase tracking-[0.3em] text-amber-200/60">
            Stopa je zamknutá
          </p>

          <h1 className="text-2xl font-bold text-amber-100">
            Brána mlčí...
          </h1>

          <p className="mt-4 leading-relaxed text-stone-300">
            Pod klenbou Michalskej brány cítiš zvláštny nepokoj. Nultý bod je
            priamo pred tebou, no jeho význam ti zatiaľ uniká.
          </p>

          <p className="mt-4 leading-relaxed text-stone-300">
            V tieni brány stojí osamelá postava. Zdá sa, že čaká práve na
            teba. Možno pozná odpoveď, ktorú ešte nehľadáš správnym spôsobom.
          </p>

          <button
            type="button"
            onClick={openFirstSceneNpc}
            className="mt-6 w-full rounded-xl bg-amber-400 px-5 py-3 font-bold uppercase tracking-[0.15em] text-black transition hover:bg-amber-300"
          >
            Osloviť Strážcu
          </button>
        </section>
      ) : (
        <PuzzleScreen scene={scene} onSolved={onSolved} />
      )}
    </GameLayout>
  );
}
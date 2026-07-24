import type { GameState, Scene } from "../../types/game";
import { GameLayout } from "../layout/GameLayout";
import { PuzzleScreen } from "../screens/PuzzleScreen";
import { JournalReveal } from "../ui/JournalReveal";

type PuzzleFlowProps = {
  gameState: GameState;
  scene: Scene;
  onOpenInventory: () => void;
  onOpenArtifacts: () => void;
  onOpenQuests: () => void;
  onOpenNpcDialogue: (npcId: string) => void;
  onReadDetectiveNote: (flagId: string) => void;
  onSolved: (hintsUsed: number) => void;
};

export function PuzzleFlow({
  gameState,
  scene,
  onOpenInventory,
  onOpenArtifacts,
  onOpenQuests,
  onOpenNpcDialogue,
  onReadDetectiveNote,
  onSolved,
}: PuzzleFlowProps) {
  const npcGate = scene.npcGate;

  const isNpcGateLocked = Boolean(
    npcGate && !gameState.flags[npcGate.requiredFlagId]
  );

  const detectiveNote = scene.detectiveNote;

  const isDetectiveNoteUnlocked = Boolean(
    detectiveNote &&
      (!detectiveNote.unlockFlagId ||
        gameState.flags[detectiveNote.unlockFlagId])
  );

  const isDetectiveNoteUnread = Boolean(
    detectiveNote &&
      !gameState.flags[detectiveNote.readFlagId]
  );

  const shouldShowDetectiveNote =
    isDetectiveNoteUnlocked && isDetectiveNoteUnread;

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
      onOpenInventory={onOpenInventory}
      onOpenArtifacts={onOpenArtifacts}
      onOpenQuests={onOpenQuests}
    >
      {isNpcGateLocked && npcGate ? (
        <section className="mx-auto mt-12 max-w-2xl rounded-3xl border border-amber-300/30 bg-stone-950/80 p-6 text-stone-100 shadow-2xl">
          <p className="mb-2 text-sm uppercase tracking-[0.3em] text-amber-200/60">
            {npcGate.eyebrow}
          </p>

          <h1 className="text-2xl font-bold text-amber-100">
            {npcGate.title}
          </h1>

          <div className="mt-4 space-y-4 leading-relaxed text-stone-300">
            {npcGate.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <button
            type="button"
            onClick={openFirstSceneNpc}
            className="mt-6 w-full rounded-xl bg-amber-400 px-5 py-3 font-bold uppercase tracking-[0.15em] text-black transition hover:bg-amber-300"
          >
            {npcGate.buttonLabel}
          </button>
        </section>
      ) : shouldShowDetectiveNote && detectiveNote ? (
        <JournalReveal
          imageSrc={detectiveNote.imageSrc}
          imageAlt={
            detectiveNote.imageAlt ??
            `Pátračov zápis č. ${detectiveNote.number}: ${detectiveNote.title}`
          }
          introText={detectiveNote.introText}
          continueLabel={
            detectiveNote.continueLabel ??
            "Pokračovať vo vyšetrovaní"
          }
          onContinue={() =>
            onReadDetectiveNote(detectiveNote.readFlagId)
          }
        />
      ) : (
        <PuzzleScreen scene={scene} onSolved={onSolved} />
      )}
    </GameLayout>
  );
}

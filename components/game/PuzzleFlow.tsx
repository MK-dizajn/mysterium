import { useState } from "react";
import type {
  ChapterGuidance,
  GameAction,
  GameState,
  Scene,
} from "../../types/game";
import { getHintsUsed } from "../../engine";
import { GameLayout } from "../layout/GameLayout";
import { NoteHandoverScreen } from "../screens/NoteHandoverScreen";
import { PuzzleScreen } from "../screens/PuzzleScreen";
import { StoryVideoScreen } from "../screens/StoryVideoScreen";
import { JournalReveal } from "../ui/JournalReveal";

type PuzzleFlowProps = {
  gameState: GameState;
  scene: Scene;
  /** Cesta z predchádzajúcej scény pre „Ukáž cestu“. */
  arrivalRoute?: string;
  guidance: ChapterGuidance;
  totalArtifacts: number;
  onOpenInventory: () => void;
  onOpenArtifacts: () => void;
  onOpenQuests: () => void;
  onOpenNpcDialogue: (npcId: string) => void;
  /** Video Strážcu skončilo alebo bolo preskočené (tie isté akcie ako po rozhovore). */
  onCompleteGuardianVideo: (actions: GameAction[]) => void;
  onReadDetectiveNote: (flagId: string) => void;
  onRevealHint: () => void;
  onSolved: () => void;
};

export function PuzzleFlow({
  gameState,
  scene,
  arrivalRoute,
  guidance,
  totalArtifacts,
  onOpenInventory,
  onOpenArtifacts,
  onOpenQuests,
  onOpenNpcDialogue,
  onCompleteGuardianVideo,
  onReadDetectiveNote,
  onRevealHint,
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

  const guardianVideo = scene.guardianVideo;
  // Súbor videa Strážcu chýba: ostane písaný rozhovor.
  const [isGuardianVideoUnavailable, setIsGuardianVideoUnavailable] =
    useState(false);
  const shouldShowGuardianVideo = Boolean(
    isNpcGateLocked && guardianVideo && !isGuardianVideoUnavailable
  );
  const isGuardianVideoSeen = Boolean(
    guardianVideo && gameState.flags[guardianVideo.seenFlagId]
  );

  // Po videu Strážcu sa papier otvorí hneď; po písanom rozhovore
  // najprv odovzdanie textom a papier až na „Prezrieť zápis“.
  const noteHandover = isGuardianVideoSeen ? undefined : scene.noteHandover;
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const continueLabel =
    detectiveNote?.continueLabel ?? "Pokračovať vo vyšetrovaní";

  function openFirstSceneNpc() {
    const npc = scene.npcs?.[0];

    if (!npc) {
      return;
    }

    onOpenNpcDialogue(npc.id);
  }

  // Video Strážcu na celú obrazovku, bez lišty hry.
  if (shouldShowGuardianVideo && guardianVideo) {
    return (
      <StoryVideoScreen
        video={guardianVideo}
        onDone={() => onCompleteGuardianVideo(guardianVideo.completeActions)}
        onUnavailable={() => setIsGuardianVideoUnavailable(true)}
      />
    );
  }

  return (
    <GameLayout
      gameState={gameState}
      totalArtifacts={totalArtifacts}
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

          {/* Riadkovanie 1,5 a medzi odsekmi asi polovica riadku. */}
          <div className="mt-4 space-y-3 leading-normal text-stone-300">
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
      ) : shouldShowDetectiveNote && detectiveNote && noteHandover && !isNoteOpen ? (
        <NoteHandoverScreen
          handover={noteHandover}
          continueLabel={continueLabel}
          onViewNote={() => setIsNoteOpen(true)}
          onContinue={() => onReadDetectiveNote(detectiveNote.readFlagId)}
        />
      ) : shouldShowDetectiveNote && detectiveNote ? (
        <JournalReveal
          note={detectiveNote}
          continueLabel={continueLabel}
          onContinue={() =>
            onReadDetectiveNote(detectiveNote.readFlagId)
          }
          onClose={noteHandover ? () => setIsNoteOpen(false) : undefined}
          closeLabel={noteHandover?.closeNoteLabel}
        />
      ) : (
        <PuzzleScreen
          scene={scene}
          hintsUsed={getHintsUsed(gameState, scene)}
          arrivalRoute={arrivalRoute}
          guidance={guidance}
          onRevealHint={onRevealHint}
          onSolved={onSolved}
        />
      )}
    </GameLayout>
  );
}

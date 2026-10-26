"use client";

import { useState } from "react";
import type { Dialogue, DialogueChoice, Npc } from "../../types/game";
import { ActionButton } from "../ui/ActionButton";
import { BackBar } from "../ui/BackBar";
import { DetectiveIcon } from "../ui/MysteriumIcons";
import { ScreenContainer } from "../ui/ScreenContainer";
import { SectionCard } from "../ui/SectionCard";
import { StoryCard } from "../ui/StoryCard";
import { Typewriter } from "../ui/Typewriter";

type NpcScreenProps = {
  npc: Npc;
  dialogue: Dialogue;
  activeNodeId: string;
  visibleChoices: DialogueChoice[];
  onChooseNode: (nodeId: string) => void;
  onChooseChoice: (choiceId: string) => void;
  onClose: () => void;
};

export function NpcScreen({
  npc,
  dialogue,
  activeNodeId,
  visibleChoices,
  onChooseNode,
  onChooseChoice,
  onClose,
}: NpcScreenProps) {
  const [isTextComplete, setIsTextComplete] = useState(false);

  const activeNode =
    dialogue.nodes.find((node) => node.id === activeNodeId) ??
    dialogue.nodes[0];

  function handleTextComplete() {
    setIsTextComplete(true);
  }

  function handleChoice(choiceId: string) {
    setIsTextComplete(false);
    onChooseChoice(choiceId);
  }

  return (
    <ScreenContainer className="flex flex-col">
      <StoryCard label="Rozhovor" title={npc.name}>
        {npc.role && (
          <p className="text-sm uppercase tracking-[0.2em] text-amber-300/60">
            {npc.role}
          </p>
        )}

        <SectionCard
          icon={<DetectiveIcon className="h-9 w-9" />}
          title={activeNode.speaker}
          variant="gold"
        >
          <div className="min-h-24 text-[17px] leading-normal text-amber-50">
            <Typewriter
              key={activeNode.id}
              text={activeNode.text}
              onComplete={handleTextComplete}
            />
          </div>
        </SectionCard>

        {isTextComplete && (
          <div className="space-y-3">
            {visibleChoices.length > 0 ? (
              visibleChoices.map((choice) => (
                <ActionButton
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  variant="secondary"
                  textCase="sentence"
                  className="justify-start text-left"
                >
                  {choice.text}
                </ActionButton>
              ))
            ) : (
              <ActionButton onClick={onClose}>
                Ukončiť rozhovor
              </ActionButton>
            )}
          </div>
        )}
      </StoryCard>

      {/* Nevýrazná, aby nesúperila s voľbami rozhovoru. */}
      <BackBar label="Späť k pátraniu" onBack={onClose} variant="secondary" />
    </ScreenContainer>
  );
}
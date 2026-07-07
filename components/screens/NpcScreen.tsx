"use client";

import { useState } from "react";
import type { Dialogue, DialogueChoice, Npc } from "../../types/game";
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
    <main className="min-h-screen bg-stone-950 px-4 py-8 text-stone-100">
      <section className="mx-auto max-w-2xl rounded-3xl border border-amber-300/30 bg-black/40 p-6 shadow-2xl">
        <p className="mb-2 text-sm uppercase tracking-[0.3em] text-amber-200/60">
          Rozhovor
        </p>

        <h1 className="text-3xl font-bold text-amber-100">{npc.name}</h1>

        {npc.role && (
          <p className="mt-1 text-sm text-amber-100/60">{npc.role}</p>
        )}

        <div className="mt-8 rounded-2xl border border-stone-700 bg-stone-900/80 p-5">
          <p className="mb-3 text-sm font-semibold text-amber-200">
            {activeNode.speaker}
          </p>

          <div className="text-lg leading-relaxed text-stone-100">
            <Typewriter
              key={activeNode.id}
              text={activeNode.text}
              onComplete={handleTextComplete}
            />
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {isTextComplete &&
            (visibleChoices.length > 0 ? (
              visibleChoices.map((choice) => (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => handleChoice(choice.id)}
                  className="w-full rounded-xl border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-left text-amber-50 transition hover:bg-amber-300/20"
                >
                  {choice.text}
                </button>
              ))
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-xl border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-left text-amber-50 transition hover:bg-amber-300/20"
              >
                Ukončiť rozhovor
              </button>
            ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 text-sm text-stone-400 underline underline-offset-4 hover:text-stone-200"
        >
          Späť k pátraniu
        </button>
      </section>
    </main>
  );
}
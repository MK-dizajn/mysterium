"use client";

import { useMemo, useState } from "react";
import type {
  ActId,
  InventoryItem,
} from "../../types/game";
import { ActionButton } from "../ui/ActionButton";
import { Chest } from "../ui/chest/Chest";
import {
  ChestEvidencePanel,
  type ChestEvidence,
} from "../ui/chest/ChestEvidencePanel";
import { MessageBox } from "../ui/MessageBox";
import { RewardReveal } from "../ui/reward/RewardReveal";
import { ScreenContainer } from "../ui/ScreenContainer";

type ActChestScreenProps = {
  title: string;
  expectedCodes: string[];
  inventory: InventoryItem[];
  currentActId: ActId;
  onUnlocked: () => void;
};

export function ActChestScreen({
  title,
  expectedCodes,
  inventory,
  currentActId,
  onUnlocked,
}: ActChestScreenProps) {
  const [codes, setCodes] = useState(
    expectedCodes.map(() => "00")
  );

  const [error, setError] = useState("");
  const [isUnlocked, setIsUnlocked] =
    useState(false);
  const [isEvidenceOpen, setIsEvidenceOpen] =
    useState(false);
  const [isRewardOpen, setIsRewardOpen] =
    useState(false);

  const actEvidence = useMemo<ChestEvidence[]>(
    () =>
      inventory
        .filter(
          (item) =>
            item.actId === currentActId &&
            item.evidenceKind &&
            item.secretCode
        )
        .sort(
          (firstItem, secondItem) =>
            (firstItem.evidenceOrder ?? 0) -
            (secondItem.evidenceOrder ?? 0)
        )
        .map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          secretCode: item.secretCode,
          order: item.evidenceOrder,
        })),
    [inventory, currentActId]
  );

  function updateCode(
    index: number,
    value: string
  ) {
    if (isUnlocked) {
      return;
    }

    setCodes((currentCodes) =>
      currentCodes.map((code, codeIndex) =>
        codeIndex === index ? value : code
      )
    );

    setError("");
  }

  function checkCode() {
    const isCorrect =
      codes.length === expectedCodes.length &&
      expectedCodes.every(
        (expectedCode, index) =>
          codes[index] === expectedCode
      );

    if (!isCorrect) {
      setError(
        "Mechanizmus sa nepohol. Niektorá dvojica nesedí. Prezri si dôkazy aktu a skontroluj ich poradie."
      );

      return;
    }

    setError("");
    setIsUnlocked(true);
  }

  function openReward() {
    if (!isUnlocked) {
      return;
    }

    setIsRewardOpen(true);
  }

  function continueFromReward() {
    setIsRewardOpen(false);
    onUnlocked();
  }

  return (
    <>
      <ScreenContainer>
        <div className="mx-auto w-full max-w-md py-6">
          <header className="px-2 text-center">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.35em] text-amber-400">
              Zámok aktu
            </p>

            <h1 className="mt-3 text-3xl font-black text-white">
              {title}
            </h1>

            <div className="mx-auto mt-5 flex max-w-xs items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-400/40" />

              <span
                className="text-xs text-amber-400"
                aria-hidden="true"
              >
                ◇
              </span>

              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-400/40" />
            </div>

            <p className="mx-auto mt-5 max-w-sm text-sm leading-7 text-slate-300">
              Spoj tri dvojice ukryté v dôkazoch
              aktu a nastav správnu kombináciu.
            </p>
          </header>

          <button
            type="button"
            onClick={() => setIsEvidenceOpen(true)}
            className="mx-auto mt-6 flex w-[calc(100%-1rem)] max-w-sm items-center justify-between rounded-2xl border border-amber-300/25 bg-slate-950/70 px-4 py-3 text-left shadow-lg shadow-black/20 backdrop-blur transition hover:border-amber-300/45 hover:bg-amber-950/20 active:translate-y-0.5"
          >
            <span>
              <span className="block text-[0.65rem] font-bold uppercase tracking-[0.24em] text-amber-400/70">
                Denník vyšetrovania
              </span>

              <span className="mt-1 block text-sm font-bold text-amber-100">
                Prezrieť dôkazy aktu
              </span>
            </span>

            <span
              className="text-xl text-amber-300"
              aria-hidden="true"
            >
              📖
            </span>
          </button>

          <div className="mt-2">
            <Chest
              codes={codes}
              isUnlocked={isUnlocked}
              onCodeChange={updateCode}
              onRewardClick={openReward}
            />
          </div>

          <div className="mx-auto mt-5 w-[calc(100%-1rem)] max-w-sm">
            {error && (
              <MessageBox
                variant="danger"
                title="Nesprávna kombinácia"
              >
                {error}
              </MessageBox>
            )}

            {isUnlocked && (
              <MessageBox
                variant="success"
                title="Truhlica je otvorená"
              >
                Medzi prachom a starým drevom sa
                objavila roztrhaná fotografia. Dotkni
                sa jej a preskúmaj ďalšiu stopu.
              </MessageBox>
            )}

            {!isUnlocked && (
              <ActionButton onClick={checkCode}>
                Odomknúť truhlicu
              </ActionButton>
            )}
          </div>
        </div>
      </ScreenContainer>

      <ChestEvidencePanel
        evidence={actEvidence}
        isOpen={isEvidenceOpen}
        onClose={() => setIsEvidenceOpen(false)}
      />

      <RewardReveal
        isOpen={isRewardOpen}
        title="Roztrhaná fotografia"
        description="Na zadnej strane fotografie je rukou dopísaná ďalšia stopa. Obraz je poškodený a rozdelený na časti. Budeš ho musieť zložiť, aby si odhalil nasledujúce miesto."
        imageLabel="Fotografia"
        onContinue={continueFromReward}
      />
    </>
  );
}
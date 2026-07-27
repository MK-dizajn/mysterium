"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  ActId,
  InventoryItem,
} from "../../types/game";
import { ActionButton } from "../ui/ActionButton";
import { Chest3D } from "../ui/chest-3d/Chest3D";
import { ChestCodePanel } from "../ui/chest/ChestCodePanel";
import {
  CHEST_PAIR_LABELS,
  normalizeChestCode,
} from "../ui/chest/chestUtils";
import {
  ChestEvidencePanel,
  type ChestEvidence,
} from "../ui/chest/ChestEvidencePanel";
import { MessageBox } from "../ui/MessageBox";
import { RewardReveal } from "../ui/reward/RewardReveal";
import { ScreenContainer } from "../ui/ScreenContainer";
import { ChestIntroScreen } from "./ChestIntroScreen";

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
  const [codes, setCodes] = useState<string[]>(
    () => expectedCodes.map(() => "00")
  );
  const [error, setError] = useState("");
  const [isUnlocked, setIsUnlocked] =
    useState(false);
  const [isEvidenceOpen, setIsEvidenceOpen] =
    useState(false);
  const [isRewardOpen, setIsRewardOpen] =
    useState(false);
  const [isIntroVisible, setIsIntroVisible] =
    useState(true);
  const [isChestFocused, setIsChestFocused] =
    useState(false);
  const [isMechanismVisible, setIsMechanismVisible] =
    useState(false);

  useEffect(() => {
    setCodes(expectedCodes.map(() => "00"));
    setError("");
    setIsUnlocked(false);
    setIsEvidenceOpen(false);
    setIsRewardOpen(false);
    setIsIntroVisible(true);
    setIsChestFocused(false);
    setIsMechanismVisible(false);
  }, [currentActId, expectedCodes]);

  useEffect(() => {
    if (!isChestFocused || isUnlocked) {
      setIsMechanismVisible(false);
      return;
    }

    const mechanismTimer = window.setTimeout(() => {
      setIsMechanismVisible(true);
    }, 420);

    return () => {
      window.clearTimeout(mechanismTimer);
    };
  }, [isChestFocused, isUnlocked]);

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

  const rewardContent =
    currentActId === "act-1"
      ? {
          title: "Prvý útržok fotografie",
          description:
            "V truhlici leží prvá časť starej fotografie. Na zadnej strane je rukou dopísaná neúplná správa. Viditeľné slová naznačujú, že ďalšie stopy čakajú medzi miestami moci a poznania.",
          imageLabel: "Prvý útržok fotografie",
          successText:
            "Medzi prachom a starým drevom sa objavil prvý útržok fotografie. Dotkni sa ho a preskúmaj stopu, ktorá otvorí ďalší akt.",
          transitionTitle:
            "Stopa vedie hlbšie do mesta",
          transitionText:
            "Prvý útržok fotografie zapadol do vyšetrovania. Na jeho zadnej strane zostal odkaz, ktorý spája moc, poznanie a ďalšie miesto ukryté v uliciach Bratislavy.",
          continueLabel:
            "Pokračovať do druhého aktu",
        }
      : {
          title: "Druhý útržok fotografie",
          description:
            "Druhá časť fotografie dopĺňa prvý útržok. Obraz stále nie je úplný, no rukou napísaná poznámka už prezrádza, že všetky získané stopy smerujú k poslednému tajomstvu pátračovho denníka.",
          imageLabel: "Druhý útržok fotografie",
          successText:
            "Vo vnútri truhlice sa odhalil druhý útržok fotografie. Preskúmaj ho a pokračuj k poslednému aktu vyšetrovania.",
          transitionTitle:
            "Obraz sa začína skladať",
          transitionText:
            "Druhý útržok doplnil fotografiu o ďalší detail. Získané dôkazy už nesmerujú k ďalšej náhode, ale k poslednému tajomstvu pátračovho denníka.",
          continueLabel:
            "Pokračovať do posledného aktu",
        };

  function updateDigit(
    codeIndex: number,
    digitIndex: number,
    nextDigit: number
  ) {
    if (isUnlocked) {
      return;
    }

    setCodes((currentCodes) =>
      currentCodes.map(
        (currentCode, currentCodeIndex) => {
          if (currentCodeIndex !== codeIndex) {
            return currentCode;
          }

          const normalizedCode =
            normalizeChestCode(currentCode);
          const digits = normalizedCode.split("");

          digits[digitIndex] = String(nextDigit);

          return digits.join("");
        }
      )
    );

    setError("");
  }

  function focusMechanism() {
    if (isUnlocked) {
      return;
    }

    setError("");
    setIsChestFocused(true);
  }

  function leaveMechanism() {
    if (isUnlocked) {
      return;
    }

    setIsMechanismVisible(false);
    setIsChestFocused(false);
    setError("");
  }

  function checkCode() {
    const isCorrect =
      codes.length === expectedCodes.length &&
      expectedCodes.every(
        (expectedCode, index) =>
          normalizeChestCode(codes[index]) ===
          normalizeChestCode(expectedCode)
      );

    if (!isCorrect) {
      setError(
        "Mechanizmus sa nepohol. Niektorá dvojica nesedí. Prezri si dôkazy aktu a skontroluj ich poradie."
      );
      return;
    }

    setError("");
    setIsMechanismVisible(false);
    setIsUnlocked(true);
    setIsChestFocused(true);
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

  if (isIntroVisible) {
    return (
      <ChestIntroScreen
        title={title}
        onExplore={() => {
          setIsIntroVisible(false);
          setIsChestFocused(false);
          setIsMechanismVisible(false);
        }}
      />
    );
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
              Potiahnutím truhlicu otoč. Kliknutím na
              jej predný mechanizmus sa k nemu plynulo
              priblížiš.
            </p>
          </header>

          <div className="relative mt-6">
            <Chest3D
              isFocused={isChestFocused}
              isUnlocked={isUnlocked}
              onSelect={focusMechanism}
              onRewardClick={openReward}
            />

            {!isUnlocked && (
              <div
                className={`absolute left-1/2 top-[54%] z-20 w-[86%] max-w-[340px] -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out ${
                  isMechanismVisible
                    ? "pointer-events-auto scale-100 opacity-100 blur-0"
                    : "pointer-events-none scale-[0.74] opacity-0 blur-md"
                }`}
                aria-hidden={!isMechanismVisible}
              >
                <div className="rounded-[1.4rem] border border-amber-200/45 bg-[#170b05]/95 p-2.5 shadow-[0_0_35px_rgba(245,158,11,0.24),0_18px_45px_rgba(0,0,0,0.75)] backdrop-blur-sm">
                  <div className="rounded-[1rem] border border-amber-700/55 bg-gradient-to-b from-[#5d3515] via-[#2b1509] to-[#120805] p-2 shadow-[inset_0_1px_0_rgba(255,224,158,0.18)]">
                    <ChestCodePanel
                      codes={codes}
                      pairLabels={CHEST_PAIR_LABELS}
                      isUnlocked={isUnlocked}
                      isLockReleased={isUnlocked}
                      normalizeCode={normalizeChestCode}
                      updateDigit={updateDigit}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {!isUnlocked && (
            <div className="mx-auto mt-4 flex w-[calc(100%-1rem)] max-w-sm gap-3">
              {isChestFocused ? (
                <button
                  type="button"
                  onClick={leaveMechanism}
                  className="w-full rounded-2xl border border-amber-300/25 bg-slate-950/70 px-4 py-3 text-sm font-bold text-amber-100 transition hover:border-amber-300/45 hover:bg-amber-950/20 active:translate-y-0.5"
                >
                  Späť na otáčanie truhlice
                </button>
              ) : (
                <button
                  type="button"
                  onClick={focusMechanism}
                  className="w-full rounded-2xl border border-amber-300/35 bg-amber-950/30 px-4 py-3 text-sm font-bold text-amber-100 transition hover:border-amber-300/55 hover:bg-amber-900/30 active:translate-y-0.5"
                >
                  Preskúmať mechanizmus zámku
                </button>
              )}
            </div>
          )}

          {(isChestFocused || isUnlocked) && (
            <button
              type="button"
              onClick={() => setIsEvidenceOpen(true)}
              className="mx-auto mt-5 flex w-[calc(100%-1rem)] max-w-sm items-center justify-between rounded-2xl border border-amber-300/25 bg-slate-950/70 px-4 py-3 text-left shadow-lg shadow-black/20 backdrop-blur transition hover:border-amber-300/45 hover:bg-amber-950/20 active:translate-y-0.5"
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
          )}

          <div className="mx-auto mt-5 w-[calc(100%-1rem)] max-w-sm space-y-4">
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
                {rewardContent.successText}
              </MessageBox>
            )}

            {isMechanismVisible && !isUnlocked && (
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
        title={rewardContent.title}
        description={rewardContent.description}
        imageLabel={rewardContent.imageLabel}
        transitionTitle={rewardContent.transitionTitle}
        transitionText={rewardContent.transitionText}
        continueLabel={rewardContent.continueLabel}
        onContinue={continueFromReward}
      />
    </>
  );
}
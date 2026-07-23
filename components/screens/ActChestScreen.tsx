"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  ActId,
  InventoryItem,
} from "../../types/game";
import { ActionButton } from "../ui/ActionButton";
import {
  ChestEvidencePanel,
  type ChestEvidence,
} from "../ui/chest/ChestEvidencePanel";
import { Chest3D } from "../ui/chest-3d/Chest3D";
import { ChestCodeFocus } from "../ui/chest-3d/ChestCodeFocus";
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

const CODE_PANEL_DELAY = 900;
const UNLOCK_DELAY = 900;

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

  const [isCodeFocused, setIsCodeFocused] =
    useState(false);

  const [
    isCodePanelVisible,
    setIsCodePanelVisible,
  ] = useState(false);

  const [isEvidenceOpen, setIsEvidenceOpen] =
    useState(false);

  const [isRewardOpen, setIsRewardOpen] =
    useState(false);

  const codePanelTimerRef =
    useRef<number | null>(null);

  const unlockTimerRef =
    useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (
        codePanelTimerRef.current !== null
      ) {
        window.clearTimeout(
          codePanelTimerRef.current
        );
      }

      if (
        unlockTimerRef.current !== null
      ) {
        window.clearTimeout(
          unlockTimerRef.current
        );
      }
    };
  }, []);

  const actEvidence = useMemo<
    ChestEvidence[]
  >(
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
          title:
            "Prvý útržok fotografie",
          description:
            "V truhlici leží prvá časť starej fotografie. Na zadnej strane je rukou dopísaná neúplná správa. Viditeľné slová naznačujú, že ďalšie stopy čakajú medzi miestami moci a poznania.",
          imageLabel:
            "Prvý útržok fotografie",
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
          title:
            "Druhý útržok fotografie",
          description:
            "Druhá časť fotografie dopĺňa prvý útržok. Obraz stále nie je úplný, no rukou napísaná poznámka už prezrádza, že všetky získané stopy smerujú k poslednému tajomstvu pátračovho denníka.",
          imageLabel:
            "Druhý útržok fotografie",
          successText:
            "Vo vnútri truhlice sa odhalil druhý útržok fotografie. Preskúmaj ho a pokračuj k poslednému aktu vyšetrovania.",
          transitionTitle:
            "Obraz sa začína skladať",
          transitionText:
            "Druhý útržok doplnil fotografiu o ďalší detail. Získané dôkazy už nesmerujú k ďalšej náhode, ale k poslednému tajomstvu pátračovho denníka.",
          continueLabel:
            "Pokračovať do posledného aktu",
        };

  function updateCode(
    index: number,
    value: string
  ) {
    if (isUnlocked) {
      return;
    }

    setCodes((currentCodes) =>
      currentCodes.map(
        (code, codeIndex) =>
          codeIndex === index
            ? value
            : code
      )
    );

    setError("");
  }

  function openCodeFocus() {
    if (
      isUnlocked ||
      isCodeFocused ||
      codePanelTimerRef.current !== null
    ) {
      return;
    }

    setError("");
    setIsCodePanelVisible(false);
    setIsCodeFocused(true);

    codePanelTimerRef.current =
      window.setTimeout(() => {
        setIsCodePanelVisible(true);
        codePanelTimerRef.current = null;
      }, CODE_PANEL_DELAY);
  }

  function closeCodeFocus() {
    if (isUnlocked) {
      return;
    }

    if (
      codePanelTimerRef.current !== null
    ) {
      window.clearTimeout(
        codePanelTimerRef.current
      );

      codePanelTimerRef.current = null;
    }

    setError("");
    setIsCodePanelVisible(false);

    window.setTimeout(() => {
      setIsCodeFocused(false);
    }, 280);
  }

  function checkCode() {
    const isCorrect =
      codes.length ===
        expectedCodes.length &&
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
    setIsCodePanelVisible(false);

    window.setTimeout(() => {
      setIsCodeFocused(false);
    }, 280);

    unlockTimerRef.current =
      window.setTimeout(() => {
        setIsUnlocked(true);
        unlockTimerRef.current = null;
      }, UNLOCK_DELAY);
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
              Preskúmaj truhlicu, priblíž sa
              k mechanizmu a nastav kombináciu
              ukrytú v dôkazoch aktu.
            </p>
          </header>

          <button
            type="button"
            onClick={() =>
              setIsEvidenceOpen(true)
            }
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

          <div className="relative mt-6 h-[440px] overflow-hidden rounded-[1.75rem] border border-amber-400/20 bg-black/20">
            <div className="absolute inset-0">
              <Chest3D
                isFocused={isCodeFocused}
                isUnlocked={isUnlocked}
                onSelect={openCodeFocus}
                onRewardClick={openReward}
              />
            </div>

            {isCodeFocused && (
              <div
                className={`absolute inset-0 z-30 transition-all duration-500 ease-out ${
                  isCodePanelVisible
                    ? "pointer-events-auto translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-3 opacity-0"
                }`}
              >
                <ChestCodeFocus
                  codes={codes}
                  error={error}
                  onCodeChange={updateCode}
                  onConfirm={checkCode}
                />
              </div>
            )}
          </div>

          {isCodeFocused &&
            !isUnlocked && (
              <div
                className={`mx-auto mt-3 w-[calc(100%-1rem)] max-w-sm transition-all duration-400 ${
                  isCodePanelVisible
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-1 opacity-0"
                }`}
              >
                <button
                  type="button"
                  onClick={closeCodeFocus}
                  className="w-full rounded-2xl border border-slate-700/80 bg-slate-950/75 px-5 py-3 text-sm font-bold text-slate-300 shadow-lg shadow-black/25 transition hover:border-amber-300/35 hover:bg-amber-950/25 hover:text-amber-100 active:translate-y-0.5"
                >
                  Vzdialiť sa od truhlice
                </button>
              </div>
            )}

          {isUnlocked && (
            <div className="mx-auto mt-5 w-[calc(100%-1rem)] max-w-sm space-y-4">
              <MessageBox
                variant="success"
                title="Truhlica je otvorená"
              >
                {rewardContent.successText}
              </MessageBox>

              <ActionButton
                onClick={openReward}
              >
                Preskúmať útržok
              </ActionButton>
            </div>
          )}
        </div>
      </ScreenContainer>

      <ChestEvidencePanel
        evidence={actEvidence}
        isOpen={isEvidenceOpen}
        onClose={() =>
          setIsEvidenceOpen(false)
        }
      />

      <RewardReveal
        isOpen={isRewardOpen}
        title={rewardContent.title}
        description={
          rewardContent.description
        }
        imageLabel={
          rewardContent.imageLabel
        }
        transitionTitle={
          rewardContent.transitionTitle
        }
        transitionText={
          rewardContent.transitionText
        }
        continueLabel={
          rewardContent.continueLabel
        }
        onContinue={continueFromReward}
      />
    </>
  );
}
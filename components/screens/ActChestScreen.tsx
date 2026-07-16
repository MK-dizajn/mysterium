"use client";

import { useState } from "react";
import { ActionButton } from "../ui/ActionButton";
import { MessageBox } from "../ui/MessageBox";
import { ScreenContainer } from "../ui/ScreenContainer";
import { StoryCard } from "../ui/StoryCard";

type ActChestScreenProps = {
  title: string;
  expectedCodes: string[];
  onUnlocked: () => void;
};

export function ActChestScreen({
  title,
  expectedCodes,
  onUnlocked,
}: ActChestScreenProps) {
  const [codes, setCodes] = useState(
    expectedCodes.map(() => "00")
  );
  const [error, setError] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);

  function updateCode(index: number, value: string) {
    const normalizedValue = value
      .replace(/\D/g, "")
      .slice(0, 2);

    setCodes((currentCodes) =>
      currentCodes.map((code, codeIndex) =>
        codeIndex === index
          ? normalizedValue.padStart(2, "0")
          : code
      )
    );

    setError("");
  }

  function checkCode() {
    const isCorrect = expectedCodes.every(
      (expectedCode, index) =>
        codes[index] === expectedCode
    );

    if (!isCorrect) {
      setError(
        "Mechanizmus sa nepohol. Niektorá dvojica nesedí. Skontroluj dôkazy z aktuálnej etapy."
      );
      return;
    }

    setError("");
    setIsUnlocked(true);

    window.setTimeout(() => {
      onUnlocked();
    }, 1500);
  }

  return (
    <ScreenContainer>
      <StoryCard
        label="Zámok aktu"
        title={title}
      >
        <p className="text-sm leading-7 text-slate-300">
          Na veku truhlice sú tri mosadzné číselníky. Každý dôkaz z tejto
          etapy ukrýva jednu dvojicu číslic. Zadaj ich v poradí, v akom si
          dôkazy získal.
        </p>

        <div
          className={`mt-6 rounded-3xl border p-5 transition ${
            isUnlocked
              ? "border-emerald-300/30 bg-emerald-400/10"
              : "border-amber-300/20 bg-amber-950/20"
          }`}
        >
          <div className="mx-auto max-w-sm rounded-3xl border border-amber-300/20 bg-gradient-to-b from-amber-950 to-slate-950 p-5 shadow-2xl">
            <div className="rounded-2xl border border-amber-300/20 bg-black/25 px-4 py-3 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400/80">
                Mechanická truhlica
              </p>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {codes.map((code, index) => (
                <label
                  key={`chest-code-${index}`}
                  className="block"
                >
                  <span className="sr-only">
                    Číselník {index + 1}
                  </span>

                  <input
                    type="text"
                    inputMode="numeric"
                    value={code}
                    disabled={isUnlocked}
                    onChange={(event) =>
                      updateCode(index, event.target.value)
                    }
                    className="w-full rounded-2xl border border-amber-300/30 bg-slate-950 px-2 py-4 text-center font-mono text-3xl font-black tracking-[0.18em] text-amber-100 outline-none transition focus:border-amber-300 disabled:opacity-60"
                    aria-label={`Číselník ${index + 1}`}
                  />
                </label>
              ))}
            </div>

            <div
              className={`mx-auto mt-6 h-3 w-24 rounded-full transition ${
                isUnlocked
                  ? "bg-emerald-300 shadow-lg shadow-emerald-300/40"
                  : "bg-amber-950"
              }`}
            />

            <p className="mt-4 text-center text-xs uppercase tracking-[0.2em] text-slate-500">
              {isUnlocked
                ? "Západka uvoľnená"
                : "Zámok čaká na kombináciu"}
            </p>
          </div>
        </div>

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
            title="Truhlica sa otvára"
          >
            Západka odskočila. Pod vekom sa ukrýva roztrhaný obraz ďalšej
            lokality.
          </MessageBox>
        )}

        <ActionButton
          onClick={checkCode}
          disabled={isUnlocked}
        >
          {isUnlocked
            ? "Truhlica odomknutá"
            : "Odomknúť truhlicu"}
        </ActionButton>
      </StoryCard>
    </ScreenContainer>
  );
}
"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { ActionButton } from "../ui/ActionButton";

type FinaleDialogProps = {
  label: string;
  closeLabel: string;
  /** Prvok, na ktorý sa po zatvorení vráti zameranie (tlačidlo, ktoré okno otvorilo). */
  returnFocusId: string;
  onClose: () => void;
  children: ReactNode;
};

const CLOSE_BUTTON_ID = "finale-dialog-close";

/**
 * Okno nad obrazovkou finále (fotografia, karta „Ďalšie miesto“).
 * Zatvára sa tlačidlom, klávesom Escape alebo ťuknutím mimo okna.
 */
export function FinaleDialog({
  label,
  closeLabel,
  returnFocusId,
  onClose,
  children,
}: FinaleDialogProps) {
  // Najnovšia funkcia na zatvorenie bez opakovaného presúvania zamerania.
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    document.getElementById(CLOSE_BUTTON_ID)?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onCloseRef.current();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.getElementById(returnFocusId)?.focus();
    };
  }, [returnFocusId]);

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto bg-black/90 px-4 py-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className="mx-auto w-full max-w-md rounded-3xl border border-amber-300/25 bg-slate-950 p-5"
      >
        {children}

        <div className="mt-5">
          <ActionButton
            id={CLOSE_BUTTON_ID}
            onClick={onClose}
            className="motion-reduce:transition-none motion-reduce:active:scale-100"
          >
            {closeLabel}
          </ActionButton>
        </div>
      </div>
    </div>
  );
}

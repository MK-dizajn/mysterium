"use client";

import { useEffect } from "react";
import { ActionButton } from "./ActionButton";

type ConfirmDialogProps = {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  title,
  message,
  confirmLabel,
  cancelLabel = "Zrušiť",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onCancel();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-4 py-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
        className="max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-3xl border border-amber-300/25 bg-slate-950 p-6 text-center shadow-2xl shadow-black/70"
        onClick={(event) => event.stopPropagation()}
      >
        <h2
          id="confirm-dialog-title"
          className="text-xl font-black text-amber-200"
        >
          {title}
        </h2>

        <p
          id="confirm-dialog-message"
          className="mt-4 text-sm leading-7 text-slate-300"
        >
          {message}
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <ActionButton variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </ActionButton>

          {/* Predvolená je bezpečná voľba, aby sa postup nevymazal omylom. */}
          <ActionButton autoFocus onClick={onCancel}>
            {cancelLabel}
          </ActionButton>
        </div>
      </div>
    </div>
  );
}

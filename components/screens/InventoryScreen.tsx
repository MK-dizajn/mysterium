"use client";

import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import type { CodeNotebookLock } from "../../engine";
import type {
  ChapterGuidance,
  DetectiveNote as DetectiveNoteData,
  InventoryItem,
} from "../../types/game";
import { ActionButton } from "../ui/ActionButton";
import { BackBar } from "../ui/BackBar";
import { CodeNotebook } from "../ui/CodeNotebook";
import { DetectiveNote } from "../ui/DetectiveNote";
import { DetectiveIcon } from "../ui/MysteriumIcons";
import { ScreenContainer } from "../ui/ScreenContainer";
import { SectionCard } from "../ui/SectionCard";
import { StoryCard } from "../ui/StoryCard";
import { VoiceButton } from "../ui/VoiceButton";

type InventoryScreenProps = {
  inventory: InventoryItem[];
  codeNotebook: CodeNotebookLock[];
  guidance: ChapterGuidance;
  /** Vodidlo predmetu z dát kapitoly (aj pri starej uloženej kópii). */
  getClue: (itemId: string) => string | undefined;
  /** Predmet podľa dát kapitoly – aktuálny názov a popis aj pri starom uložení. */
  getItemData: (itemId: string) => InventoryItem | undefined;
  /** Zápis od pátrača k predmetu (karta dostane „Prečítať zápis“). */
  getDetectiveNote: (itemId: string) => DetectiveNoteData | undefined;
  onInspectItem: (itemId: string) => void;
  onBack: () => void;
};

/** Zápis od pátrača v okne nad Inventárom (ten istý papier ako v hre). */
function NoteDialog({ note, onClose }: { note: DetectiveNoteData; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dialogRef.current?.focus({ preventScroll: true });
  }, []);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    }
  }

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Pátračov zápis č. ${note.number}: ${note.title}`}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      className="fixed inset-0 z-[80] overflow-y-auto overscroll-contain bg-[#050403]/95 px-4 py-8 outline-none"
    >
      <div className="mx-auto w-full max-w-[470px] space-y-6">
        {/* Hlas pátrača nad papierom; hráč zápis otvoril ťuknutím, preto sa spustí sám. */}
        {note.audioSrc && (
          <div className="flex justify-end">
            <VoiceButton src={note.audioSrc} autoPlay />
          </div>
        )}
        <DetectiveNote
          number={note.number}
          title={note.title}
          paragraphs={note.paragraphs}
          signature={note.signature}
          imageSrc={note.paperImageSrc}
        />
        <ActionButton variant="secondary" onClick={onClose}>
          Zavrieť
        </ActionButton>
      </div>
    </div>
  );
}

function getEvidenceKindLabel(item: InventoryItem) {
  if (item.evidenceKind === "document") {
    return "Dokument";
  }

  if (item.evidenceKind === "symbol") {
    return "Symbol";
  }

  if (item.evidenceKind === "fragment") {
    return "Útržok";
  }

  return "Predmet";
}

const INVENTORY_INTRO =
  "Počas pátrania budeš nachádzať predmety. Prezri si ich pozorne, niektoré skrývajú viac, než sa zdá.";

/** Malé tlačidlo v riadku predmetu (aspoň 44 px na výšku). */
const ROW_BUTTON =
  "min-h-11 max-w-[5.5rem] shrink-0 rounded-xl border border-amber-300/30 bg-slate-900 px-2.5 text-xs font-bold leading-tight text-amber-100 transition hover:border-amber-300/60 motion-reduce:transition-none";

export function InventoryScreen({
  inventory,
  codeNotebook,
  guidance,
  getClue,
  getItemData,
  getDetectiveNote,
  onInspectItem,
  onBack,
}: InventoryScreenProps) {
  const [openNote, setOpenNote] = useState<DetectiveNoteData | null>(null);
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const notebookSlots = codeNotebook.flatMap((lock) => lock.slots);

  function toggleItem(itemId: string) {
    setExpandedIds((current) => ({ ...current, [itemId]: !current[itemId] }));
  }

  // Názov a popis z dát kapitoly (uložená kópia môže byť zo staršej verzie).
  const sortedInventory = inventory.map((item) => {
    const data = getItemData(item.id);

    return data
      ? { ...item, title: data.title, description: data.description }
      : item;
  }).sort((firstItem, secondItem) => {
    const firstOrder = firstItem.evidenceOrder ?? Number.MAX_SAFE_INTEGER;
    const secondOrder = secondItem.evidenceOrder ?? Number.MAX_SAFE_INTEGER;

    return firstOrder - secondOrder;
  });

  return (
    <ScreenContainer className="flex flex-col">
      <StoryCard label="Nájdené predmety" title="Inventár">
        <CodeNotebook locks={codeNotebook} />

        {sortedInventory.length === 0 ? (
          <SectionCard
            icon={<DetectiveIcon className="h-9 w-9" />}
            title="Zatiaľ nemáš žiadne predmety"
          >
            <p className="text-sm leading-normal text-slate-400">
              {INVENTORY_INTRO}
            </p>
          </SectionCard>
        ) : (
          <div className="space-y-3">
            <p className="text-sm leading-normal text-slate-300">
              {INVENTORY_INTRO}
            </p>

            {/* Kompaktný zoznam: podrobnosti až po ťuknutí na riadok. */}
            <ul className="space-y-1.5">
              {sortedInventory.map((item) => {
                const slot = notebookSlots.find(
                  (notebookSlot) => notebookSlot.itemId === item.id
                );
                // Číslica z dát kapitoly; pri predmete bez miesta v zápisníku zostáva uložená.
                const digit = slot ? slot.digit : item.secretCode ?? null;
                // Stav iba pri nájdenej číslici, aby hra neprezradila, že predmet niečo skrýva.
                const isDigitFound = Boolean(item.secretCode) && digit !== null;
                const note = getDetectiveNote(item.id);
                const clue = getClue(item.id);
                const isExpanded = Boolean(expandedIds[item.id]);
                const detailsId = `inventory-item-${item.id}`;

                return (
                  <li
                    key={item.id}
                    data-inventory-row={item.id}
                    className="rounded-2xl border border-slate-700/70 bg-slate-950/60"
                  >
                    <div className="flex items-center gap-1.5 p-1.5">
                      <button
                        type="button"
                        aria-expanded={isExpanded}
                        aria-controls={detailsId}
                        onClick={() => toggleItem(item.id)}
                        className="flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-xl px-1.5 py-1 text-left transition hover:bg-slate-900/80 motion-reduce:transition-none"
                      >
                        <span className="w-7 shrink-0 text-center text-xl" aria-hidden="true">
                          {item.icon}
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-bold leading-snug text-amber-100">
                            {item.title}
                          </span>

                          {isDigitFound && (
                            <span className="mt-1 inline-block whitespace-nowrap rounded-full border border-amber-300/30 bg-amber-400/10 px-2 py-0.5 text-xs font-semibold leading-4 text-amber-200">
                              Číslica nájdená
                            </span>
                          )}
                        </span>

                        <span
                          aria-hidden="true"
                          className={`shrink-0 text-xs text-slate-400 transition motion-reduce:transition-none ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        >
                          ▾
                        </span>
                      </button>

                      {slot?.isInspectable && (
                        <button
                          type="button"
                          onClick={() => onInspectItem(item.id)}
                          aria-label={`Prezrieť: ${item.title}`}
                          className={ROW_BUTTON}
                        >
                          Prezrieť
                        </button>
                      )}

                      {note && (
                        <button
                          type="button"
                          onClick={() => setOpenNote(note)}
                          className={ROW_BUTTON}
                        >
                          Prečítať zápis
                        </button>
                      )}
                    </div>

                    <div
                      id={detailsId}
                      hidden={!isExpanded}
                      className="space-y-3 border-t border-slate-700/60 px-4 pb-4 pt-3"
                    >
                      <span className="inline-block rounded-full border border-sky-300/20 bg-sky-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-sky-200">
                        {getEvidenceKindLabel(item)}
                      </span>

                      <p className="text-sm leading-normal text-slate-300">
                        {item.description}
                      </p>

                      {clue && (
                        <p className="border-l-2 border-amber-300/50 pl-4 text-sm leading-normal text-amber-100">
                          <span className="font-bold">
                            {guidance.inventoryClueLabel}:
                          </span>{" "}
                          <span className="font-serif italic">{clue}</span>
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </StoryCard>

      <BackBar label="Späť k pátraniu" onBack={onBack} />

      {openNote && <NoteDialog note={openNote} onClose={() => setOpenNote(null)} />}
    </ScreenContainer>
  );
}
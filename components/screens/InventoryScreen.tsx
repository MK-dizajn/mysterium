import type { CodeNotebookLock } from "../../engine";
import type { InventoryItem } from "../../types/game";
import { ActionButton } from "../ui/ActionButton";
import { CodeNotebook } from "../ui/CodeNotebook";
import { DetectiveIcon } from "../ui/MysteriumIcons";
import { ScreenContainer } from "../ui/ScreenContainer";
import { SectionCard } from "../ui/SectionCard";
import { StoryCard } from "../ui/StoryCard";

type InventoryScreenProps = {
  inventory: InventoryItem[];
  codeNotebook: CodeNotebookLock[];
  onInspectItem: (itemId: string) => void;
  onBack: () => void;
};

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

  if (item.evidenceKind === "object") {
    return "Predmet";
  }

  return "Dôkaz";
}

export function InventoryScreen({
  inventory,
  codeNotebook,
  onInspectItem,
  onBack,
}: InventoryScreenProps) {
  const notebookSlots = codeNotebook.flatMap((lock) => lock.slots);

  const sortedInventory = [...inventory].sort((firstItem, secondItem) => {
    const firstOrder = firstItem.evidenceOrder ?? Number.MAX_SAFE_INTEGER;
    const secondOrder = secondItem.evidenceOrder ?? Number.MAX_SAFE_INTEGER;

    return firstOrder - secondOrder;
  });

  return (
    <ScreenContainer>
      <StoryCard label="Zhromaždené stopy" title="Inventár">
        <CodeNotebook locks={codeNotebook} />

        {sortedInventory.length === 0 ? (
          <SectionCard
            icon={<DetectiveIcon className="h-9 w-9" />}
            title="Zatiaľ nemáš žiadne predmety"
          >
            <p className="text-sm leading-relaxed text-slate-400">
              Počas vyšetrovania budeš nachádzať predmety, dokumenty a
              fragmenty, ktoré ti pomôžu odhaliť súvislosti a odomknúť
              finálnu časť prípadu.
            </p>
          </SectionCard>
        ) : (
          <div className="space-y-4">
            {sortedInventory.map((item) => (
              <SectionCard
                key={item.id}
                icon={
                  <span className="text-3xl" aria-hidden="true">
                    {item.icon}
                  </span>
                }
                title={item.title}
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-sky-300/20 bg-sky-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-sky-200">
                      {getEvidenceKindLabel(item)}
                    </span>

                    {item.evidenceOrder !== undefined && (
                      <span className="rounded-full border border-slate-600/50 bg-slate-900/70 px-3 py-1 text-[11px] font-semibold text-slate-300">
                        Dôkaz {item.evidenceOrder}
                      </span>
                    )}
                  </div>

                  <p className="text-sm leading-6 text-slate-300">
                    {item.description}
                  </p>

                  {item.secretCode && (() => {
                    const slot = notebookSlots.find(
                      (notebookSlot) => notebookSlot.itemId === item.id
                    );
                    // Číslica z dát kapitoly; pri predmete bez miesta v zápisníku zostáva uložená.
                    const digit = slot ? slot.digit : item.secretCode;

                    return (
                      <div className="rounded-2xl border border-amber-300/20 bg-amber-400/10 p-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-amber-400/80">
                          Tajný údaj
                        </p>

                        {digit !== null ? (
                          <>
                            <p className="mt-2 font-mono text-3xl font-black tracking-[0.35em] text-amber-100">
                              {digit}
                            </p>

                            <p className="mt-3 text-xs leading-5 text-slate-400">
                              Tento údaj si zapamätaj. Vo finálnej časti prípadu
                              môže byť súčasťou kombinácie zámku.
                            </p>
                          </>
                        ) : (
                          <p className="mt-2 text-sm leading-6 text-slate-300">
                            Preskúmaj predmet zblízka.
                          </p>
                        )}

                        {slot?.isInspectable && (
                          <ActionButton
                            variant="secondary"
                            className="mt-4"
                            onClick={() => onInspectItem(item.id)}
                          >
                            Prezrieť
                          </ActionButton>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </SectionCard>
            ))}
          </div>
        )}

        <ActionButton onClick={onBack} variant="secondary">
          Späť k pátraniu
        </ActionButton>
      </StoryCard>
    </ScreenContainer>
  );
}
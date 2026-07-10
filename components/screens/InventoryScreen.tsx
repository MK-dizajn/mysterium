import type { InventoryItem } from "../../types/game";
import { ActionButton } from "../ui/ActionButton";
import { DetectiveIcon } from "../ui/MysteriumIcons";
import { ScreenContainer } from "../ui/ScreenContainer";
import { SectionCard } from "../ui/SectionCard";
import { StoryCard } from "../ui/StoryCard";

type InventoryScreenProps = {
  inventory: InventoryItem[];
  onBack: () => void;
};

export function InventoryScreen({
  inventory,
  onBack,
}: InventoryScreenProps) {
  return (
    <ScreenContainer>
      <StoryCard
        label="Výbava pátrača"
        title="Inventár"
      >
        {inventory.length === 0 ? (
          <SectionCard
            icon={<DetectiveIcon className="h-9 w-9" />}
            title="Inventár je prázdny"
          >
            <p className="text-sm leading-relaxed text-slate-400">
              Počas vyšetrovania budeš nachádzať predmety, ktoré môžu odhaliť
              nové stopy alebo pomôcť pri riešení ďalších záhad.
            </p>
          </SectionCard>
        ) : (
          <div className="space-y-3">
            {inventory.map((item) => (
              <SectionCard
                key={item.id}
                icon={
                  <span
                    className="text-3xl"
                    aria-hidden="true"
                  >
                    {item.icon}
                  </span>
                }
                title={item.title}
              >
                <p className="text-sm leading-6 text-slate-300">
                  {item.description}
                </p>
              </SectionCard>
            ))}
          </div>
        )}

        <ActionButton
          onClick={onBack}
          variant="secondary"
        >
          Späť k pátraniu
        </ActionButton>
      </StoryCard>
    </ScreenContainer>
  );
}
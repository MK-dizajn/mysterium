import { ActionButton } from "../ui/ActionButton";
import { DetectiveIcon } from "../ui/MysteriumIcons";
import { MessageBox } from "../ui/MessageBox";
import { ScreenContainer } from "../ui/ScreenContainer";
import { SectionCard } from "../ui/SectionCard";
import { StoryCard } from "../ui/StoryCard";

type FinishScreenProps = {
  onRestart: () => void;
};

export function FinishScreen({
  onRestart,
}: FinishScreenProps) {
  return (
    <ScreenContainer>
      <StoryCard
        label="Kapitola dokončená"
        title="Zlatý prešporský kľúč"
      >
        <MessageBox
          variant="success"
          title="Prípad uzavretý"
        >
          Posledná stopa zapadla na svoje miesto.
          Starý pátrač mal pravdu — Bratislava
          neukrývala len príbeh, ale mapu.
        </MessageBox>

        <SectionCard
          icon={<DetectiveIcon className="h-9 w-9" />}
          title="Záver vyšetrovania"
        >
          <div className="space-y-4 text-[15px] leading-8 text-slate-300">
            <p>
              Zlatý prešporský kľúč nebol predmetom,
              ktorý by otváral obyčajné dvere. Tvorili
              ho spomienky ukryté vo fasádach, nápisoch,
              erboch a ranách, ktoré na meste zanechali
              stáročia.
            </p>

            <p>
              V časti História zostáva zaznamenaná
              pamäť starého Prešporka. Do inventára si
              získal dokončený kľúč aj poškodený útržok
              mapy ďalšieho prípadu.
            </p>
          </div>
        </SectionCard>

        <MessageBox
          variant="info"
          title="Posledná strana denníka"
        >
          „Prešporok neukrýval jeden kľúč. Toto bol iba
          prvý.“
        </MessageBox>

        <SectionCard
          icon={
            <span
              className="text-3xl"
              aria-hidden="true"
            >
              🗺️
            </span>
          }
          title="Pátranie pokračuje"
        >
          <p className="text-[15px] leading-8 text-slate-300">
            Prvý prípad sa skončil, no útržok mapy
            odhaľuje začiatok väčšieho tajomstva.
            Príbeh bude pokračovať v druhej kapitole.
          </p>
        </SectionCard>

        <ActionButton onClick={onRestart}>
          Hrať kapitolu od začiatku
        </ActionButton>
      </StoryCard>
    </ScreenContainer>
  );
}
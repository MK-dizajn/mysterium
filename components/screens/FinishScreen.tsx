import { ActionButton } from "../ui/ActionButton";
import { DetectiveIcon } from "../ui/MysteriumIcons";
import { MessageBox } from "../ui/MessageBox";
import { ScreenContainer } from "../ui/ScreenContainer";
import { SectionCard } from "../ui/SectionCard";
import { StoryCard } from "../ui/StoryCard";

type FinishScreenProps = {
  onRestart: () => void;
};

export function FinishScreen({ onRestart }: FinishScreenProps) {
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
          Posledná stopa zapadla na svoje miesto. Starý pátrač mal pravdu —
          Bratislava neukrývala len príbeh, ale mapu.
        </MessageBox>

        <SectionCard
          icon={<DetectiveIcon className="h-9 w-9" />}
          title="Záver vyšetrovania"
        >
          <p className="text-[15px] leading-8 text-slate-300">
            V Codexe sa objavuje nový znak. Nie je to koniec. Je to iba prvá
            stránka väčšieho tajomstva.
          </p>
        </SectionCard>

        <MessageBox
          variant="info"
          title="Pátračov odkaz"
        >
          „Ak si sa dostal až sem, už vedia, že existuješ. Čierna vdova je o
          krok bližšie. A druhá kapitola sa začína pod tichými stenami
          Kapitulskej ulice...“
        </MessageBox>

        <ActionButton onClick={onRestart}>
          Hrať od začiatku
        </ActionButton>
      </StoryCard>
    </ScreenContainer>
  );
}
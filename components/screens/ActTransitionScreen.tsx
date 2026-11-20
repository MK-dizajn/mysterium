import type { ActEnding, FinalePhoto, InspectCountPoint } from "../../types/game";
import {
  getFragmentIndex,
  PhotoFragmentPreview,
  PhotoFragmentThumb,
} from "../finale/PhotoFragmentPreview";
import { formatItemCount } from "../../lib/itemCount";
import { getGoldenKeySvg } from "../items/art/keyToothArt";
import { useReducedMotion } from "../items/useReducedMotion";
import { ActionButton } from "../ui/ActionButton";
import { DetectiveIcon } from "../ui/MysteriumIcons";
import { MessageBox } from "../ui/MessageBox";
import { ScreenContainer } from "../ui/ScreenContainer";
import { SectionCard } from "../ui/SectionCard";
import { StoryCard } from "../ui/StoryCard";
import { VoiceButton } from "../ui/VoiceButton";

type ActTransitionScreenProps = {
  completedActTitle: string;
  nextActTitle: string;
  evidenceCount: number;
  ending?: ActEnding;
  /** Zárezy a okienka troch častí brady (pri zložení kľúča). */
  keyPieceNotches?: (InspectCountPoint[] | undefined)[];
  /** Historická fotografia kapitoly: útržok sa ukáže namiesto ikonky. */
  photo?: FinalePhoto;
  /** Útržky, ktoré hráč má (id z inventára). */
  ownedItemIds?: string[];
  onContinue: () => void;
};

const ENDING_ICONS: Record<ActEnding["kind"], string> = {
  guardianVoice: "🔊",
  seal: "🛡️",
  mysteryReveal: "🔍",
  keyAssembly: "🗝️",
};

/** Tri časti brady sa zosunú k sebe; pri vypnutých animáciách je hneď celý kľúč. */
const KEY_ASSEMBLY_STYLE = `
@keyframes key-piece-from-left { from { transform: translateX(-90px); opacity: 0; } to { transform: none; opacity: 1; } }
@keyframes key-piece-from-below { from { transform: translateY(70px); opacity: 0; } to { transform: none; opacity: 1; } }
@keyframes key-piece-from-right { from { transform: translateX(90px); opacity: 0; } to { transform: none; opacity: 1; } }
.key-assembly-animated [data-key-piece="1"] { animation: key-piece-from-left 1.1s ease-out 0.2s both; }
.key-assembly-animated [data-key-piece="2"] { animation: key-piece-from-below 1.1s ease-out 0.5s both; }
.key-assembly-animated [data-key-piece="3"] { animation: key-piece-from-right 1.1s ease-out 0.8s both; }
`;

function KeyAssembly({
  pieceNotches,
}: {
  pieceNotches: (InspectCountPoint[] | undefined)[];
}) {
  const reducedMotion = useReducedMotion();

  return (
    <div
      role="img"
      aria-label="Zlatý prešporský kľúč zložený z troch častí"
      className={`mx-auto w-full max-w-sm [&_svg]:h-auto [&_svg]:w-full ${
        reducedMotion ? "" : "key-assembly-animated"
      }`}
    >
      <style>{KEY_ASSEMBLY_STYLE}</style>
      <div
        dangerouslySetInnerHTML={{
          __html: getGoldenKeySvg({ idPrefix: "key-assembly", pieceNotches }),
        }}
      />
    </div>
  );
}

export function ActTransitionScreen({
  completedActTitle,
  nextActTitle,
  evidenceCount,
  ending,
  keyPieceNotches = [],
  photo,
  ownedItemIds = [],
  onContinue,
}: ActTransitionScreenProps) {
  const reward = ending?.reward;
  const fragmentIndex = reward ? getFragmentIndex(photo, reward.id) : -1;

  return (
    <ScreenContainer>
      <StoryCard
        label="Etapa vyšetrovania dokončená"
        title={completedActTitle}
      >
        <MessageBox
          variant="success"
          title="Predmety zhromaždené"
        >
          Dokončil si ďalšiu časť prípadu. Predmety, ktoré si našiel, začínajú
          vytvárať spoločný obraz.
        </MessageBox>

        {ending && (
          <SectionCard
            icon={
              <span className="text-3xl" aria-hidden="true">
                {ENDING_ICONS[ending.kind]}
              </span>
            }
            title={ending.label}
            variant="gold"
          >
            {ending.kind === "keyAssembly" && (
              <div className="mb-4">
                <KeyAssembly pieceNotches={keyPieceNotches} />
              </div>
            )}

            {/* Nahratý hlas (Strážca pri akte I) sa spustí sám iba pri prvom zobrazení. */}
            <div className="flex items-start gap-3">
              <p className="min-w-0 flex-1 italic leading-relaxed text-amber-100">
                „{ending.text}“
              </p>
              <VoiceButton src={ending.audioSrc} autoPlay="once" />
            </div>
          </SectionCard>
        )}

        {reward && (
          <SectionCard
            icon={
              photo && fragmentIndex >= 0 ? (
                <span className="block scale-125">
                  <PhotoFragmentThumb photo={photo} index={fragmentIndex} />
                </span>
              ) : (
                <span className="text-3xl" aria-hidden="true">
                  {reward.icon}
                </span>
              )
            }
            title={reward.title}
          >
            {/* Skutočný útržok fotografie a obrys: čo hráč už má. */}
            {photo && fragmentIndex >= 0 && (
              <div className="mb-3">
                <PhotoFragmentPreview
                  photo={photo}
                  index={fragmentIndex}
                  ownedFragmentIds={[...ownedItemIds, reward.id]}
                />
              </div>
            )}
            <p className="text-sm leading-relaxed text-slate-300">
              {reward.description}
            </p>
          </SectionCard>
        )}

        <SectionCard
          icon={<DetectiveIcon className="h-9 w-9" />}
          title="Vyhodnotenie prípadu"
        >
          <p className="text-[15px] leading-normal text-slate-300">
            V tejto etape si našiel {formatItemCount(evidenceCount)}.{" "}
            Každý z nich ukrýva jednu číslicu kódu.
          </p>
        </SectionCard>

        {nextActTitle && (
          <MessageBox
            variant="info"
            title="Nasleduje"
          >
            {nextActTitle}
          </MessageBox>
        )}

        <ActionButton onClick={onContinue}>
          {ending?.continueLabel ?? "Pokračovať"}
        </ActionButton>
      </StoryCard>
    </ScreenContainer>
  );
}

import type { Quest, QuestProgress } from "../../types/game";

type QuestScreenProps = {
  questProgress: QuestProgress[];
  availableQuests: Quest[];
  onBack: () => void;
};

function getQuestStatusLabel(status: QuestProgress["status"]) {
  if (status === "active") return "Aktívny";
  if (status === "completed") return "Uzavretý";
  return "Zamknutý";
}

function findQuestDefinition(
  questId: string,
  availableQuests: Quest[]
): Quest | undefined {
  return availableQuests.find((quest) => quest.id === questId);
}

export function QuestScreen({
  questProgress,
  availableQuests,
  onBack,
}: QuestScreenProps) {
  const activeQuests = questProgress.filter(
    (quest) => quest.status === "active"
  );

  const completedQuests = questProgress.filter(
    (quest) => quest.status === "completed"
  );

  function renderQuestCard(
    quest: QuestProgress,
    variant: "active" | "completed"
  ) {
    const questDefinition = findQuestDefinition(
      quest.questId,
      availableQuests
    );

    const title = questDefinition?.title ?? quest.questId;

    const description =
      variant === "completed" && questDefinition?.completedText
        ? questDefinition.completedText
        : questDefinition?.description ??
          "Neznámy prípad zo spisu starého pátrača.";

    const rewardScore = questDefinition?.reward?.score;

    const cardClass =
      variant === "completed"
        ? "rounded-3xl border border-emerald-300/20 bg-emerald-400/10 p-5 shadow-xl shadow-emerald-950/10"
        : "rounded-3xl border border-amber-300/20 bg-amber-400/10 p-5 shadow-xl shadow-amber-950/10";

    const titleClass =
      variant === "completed"
        ? "text-lg font-bold text-emerald-100"
        : "text-lg font-bold text-amber-100";

    const badgeClass =
      variant === "completed"
        ? "rounded-full border border-emerald-300/30 px-3 py-1 text-xs font-semibold text-emerald-200"
        : "rounded-full border border-amber-300/30 px-3 py-1 text-xs font-semibold text-amber-200";

    return (
      <article key={quest.questId} className={cardClass}>
        <div className="flex items-start justify-between gap-3">
          <h3 className={titleClass}>{title}</h3>

          <span className={badgeClass}>
            {getQuestStatusLabel(quest.status)}
          </span>
        </div>

        <p className="mt-3 text-sm leading-6 text-slate-300">
          {description}
        </p>

        {variant === "completed" && rewardScore ? (
          <p className="mt-4 rounded-2xl border border-emerald-300/15 bg-slate-950/40 px-4 py-3 text-sm text-emerald-100">
            ⭐ Odmena za uzavretie prípadu: +{rewardScore} bodov
          </p>
        ) : null}
      </article>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <div className="mx-auto max-w-md">
        <button
          type="button"
          onClick={onBack}
          className="mb-6 rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-emerald-300/50 hover:text-emerald-100"
        >
          ← Späť k pátraniu
        </button>

        <p className="text-xs font-bold uppercase tracking-[0.35em] text-emerald-400/80">
          Vyšetrovací spis
        </p>

        <h1 className="mt-2 text-3xl font-bold text-emerald-100">
          🕵️ Prípad
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          Tu nájdeš hlavný cieľ vyšetrovania a stav prípadu. Dôkazy zbieraš
          počas jednotlivých zastávok, no celý prípad sa uzavrie až po
          odhalení Zlatého prešporského kľúča.
        </p>

        {questProgress.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-slate-700/80 bg-slate-900/80 p-5">
            <p className="font-semibold text-slate-100">
              Prípad ešte nebol otvorený.
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Začni vyšetrovanie pri Michalskej bráne. Po rozhovore so
              strážcom sa tu zobrazí hlavný prípad kapitoly.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-8">
            {activeQuests.length > 0 && (
              <section>
                <h2 className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-amber-300/80">
                  Aktuálny prípad
                </h2>

                <div className="space-y-3">
                  {activeQuests.map((quest) =>
                    renderQuestCard(quest, "active")
                  )}
                </div>
              </section>
            )}

            {completedQuests.length > 0 && (
              <section>
                <h2 className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-emerald-300/80">
                  Uzavreté prípady
                </h2>

                <div className="space-y-3">
                  {completedQuests.map((quest) =>
                    renderQuestCard(quest, "completed")
                  )}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
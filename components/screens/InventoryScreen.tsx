import type { InventoryItem } from "../../types/game";

type InventoryScreenProps = {
  inventory: InventoryItem[];
  onBack: () => void;
};

export function InventoryScreen({
  inventory,
  onBack,
}: InventoryScreenProps) {
  return (
    <main className="min-h-screen bg-[#05070d] px-6 py-10 text-white">
      <div className="mx-auto max-w-md">
        <button
          onClick={onBack}
          className="mb-6 text-sm text-amber-300"
        >
          ← Späť
        </button>

        <h1 className="mb-6 text-3xl font-bold text-white">
          🎒 Inventár
        </h1>

        {inventory.length === 0 ? (
          <p className="text-slate-500">Inventár je zatiaľ prázdny.</p>
        ) : (
          <div className="space-y-3">
            {inventory.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-sky-300/20 bg-sky-400/10 p-4"
              >
                <div className="mb-2 flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <h2 className="font-bold text-sky-100">
                    {item.title}
                  </h2>
                </div>

                <p className="text-sm leading-6 text-slate-300">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
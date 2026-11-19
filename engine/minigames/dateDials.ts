import type { MiniGameSpec } from "../../types/game";

type DateDialsSpec = Extract<MiniGameSpec, { type: "dateDials" }>;

/** Začiatočné nastavenie číselníkov (index hodnoty pre každý číselník). */
export function createDateDialsState(spec: DateDialsSpec): number[] {
  return spec.dials.map((dial) =>
    Math.max(0, dial.start ? dial.values.indexOf(dial.start) : 0)
  );
}

/** Otočí jeden číselník o krok (dokola, z prvej hodnoty späť na poslednú). */
export function stepDateDial(
  spec: DateDialsSpec,
  state: number[],
  dialIndex: number,
  delta: 1 | -1
): number[] {
  const count = spec.dials[dialIndex]?.values.length ?? 0;

  if (!count) {
    return state;
  }

  return state.map((value, index) =>
    index === dialIndex ? (value + delta + count) % count : value
  );
}

/** Sú všetky číselníky nastavené na správny údaj z miesta? */
export function isDateDialsSolved(spec: DateDialsSpec, state: number[]) {
  return spec.dials.every(
    (dial, index) => dial.values[state[index]] === dial.answer
  );
}

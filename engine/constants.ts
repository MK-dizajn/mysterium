export const SAVE_KEY = "mysterium-progress-v2";

export const DEFAULT_PUZZLE_SCORE = 100;
/**
 * Cena nápovied k úlohe podľa poradia (21. 11. 2026): nápoveda 1 a 2 po
 * 5 bodov, 3. nápoveda „Ukázať odpoveď“ 10 bodov. Úloha dá najmenej 80 bodov.
 */
export const HINT_COSTS = [5, 5, 10] as const;
/** Pokuta za „Preskočiť“ pri hľadaní číslice alebo v mini hre. */
export const SKIP_PENALTY = 10;

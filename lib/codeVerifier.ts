import type { CodeVerification, UnlockCode } from "../types/game";
import { unlockCodes } from "../data/unlock-codes";
import { findUnlockCode } from "../engine";

/**
 * Jediné miesto, kde hra overuje kód (kapitoly aj aktu). Obrazovky volajú iba
 * túto funkciu a čakajú na výsledok, preto sa overenie dá neskôr presunúť
 * na server (napríklad fetch na /api/...) bez zmeny obrazoviek.
 * Dnes porovnáva odtlačky v telefóne (data/unlock-codes.ts).
 *
 * Výsledok: „ok“ s tým, čo kód odomyká; „unknown“ pri zlom alebo prázdnom
 * kóde; „unavailable“ je rezervované pre server (napríklad bez siete).
 */
export async function verifyUnlockCode(
  input: string,
  codes: UnlockCode[] = unlockCodes
): Promise<CodeVerification> {
  const code = findUnlockCode(input, codes);

  if (!code) {
    return { status: "unknown" };
  }

  return {
    status: "ok",
    code,
    grant: { chapterId: code.target.chapterId, actId: code.target.actId },
  };
}

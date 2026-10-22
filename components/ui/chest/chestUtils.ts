export const CHEST_PAIR_LABELS = ["I", "II", "III"];

export const CHEST_FRAGMENT_CLASSES = [
  "left-[10%] top-20 -rotate-6",
  "left-[34%] top-12 rotate-3",
  "right-[34%] top-24 -rotate-2",
  "right-[9%] top-16 rotate-6",
];

/** Počet číslic jedného miesta zámku (každý dôkaz nesie jednu číslicu). */
export const CHEST_CODE_LENGTH = 1;

export function createEmptyChestCode() {
  return "0".repeat(CHEST_CODE_LENGTH);
}

export function normalizeChestCode(value: string) {
  return value
    .replace(/\D/g, "")
    .padStart(CHEST_CODE_LENGTH, "0")
    .slice(-CHEST_CODE_LENGTH);
}

export function changeChestDigit(
  codes: string[],
  codeIndex: number,
  digitIndex: number,
  digit: number
) {
  const normalizedCode = normalizeChestCode(
    codes[codeIndex] ?? createEmptyChestCode()
  );

  const digits = normalizedCode.split("");
  digits[digitIndex] = String(digit);

  return digits.join("");
}

export type ChestCodeCheck = "correct" | "wrong" | "missingEvidence";

export function checkChestCode(
  codes: string[],
  expectedCodes: string[],
  requiredCodeCount: number
): ChestCodeCheck {
  if (expectedCodes.length !== requiredCodeCount) {
    return "missingEvidence";
  }

  const isCorrect =
    codes.length === expectedCodes.length &&
    expectedCodes.every(
      (expectedCode, index) =>
        normalizeChestCode(codes[index]) ===
        normalizeChestCode(expectedCode)
    );

  return isCorrect ? "correct" : "wrong";
}
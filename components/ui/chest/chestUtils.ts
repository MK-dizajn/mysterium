export const CHEST_PAIR_LABELS = ["I", "II", "III"];

export const CHEST_FRAGMENT_CLASSES = [
  "left-[10%] top-20 -rotate-6",
  "left-[34%] top-12 rotate-3",
  "right-[34%] top-24 -rotate-2",
  "right-[9%] top-16 rotate-6",
];

export function normalizeChestCode(value: string) {
  return value
    .replace(/\D/g, "")
    .padStart(2, "0")
    .slice(-2);
}

export function changeChestDigit(
  codes: string[],
  codeIndex: number,
  digitIndex: number,
  digit: number
) {
  const normalizedCode = normalizeChestCode(
    codes[codeIndex] ?? "00"
  );

  const digits = normalizedCode.split("");
  digits[digitIndex] = String(digit);

  return digits.join("");
}
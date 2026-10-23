/**
 * Porovnanie voľne napísanej odpovede so zoznamom prijatých odpovedí.
 * Odpustí diakritiku, veľké a malé písmená, interpunkciu a drobné preklepy.
 */

/** Malé písmená bez diakritiky a interpunkcie, medzery zlúčené do jednej. */
export function normalizeFreeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Koľko preklepov sa odpustí podľa dĺžky prijatej odpovede (počítajú sa
 * iba písmená a číslice): od 10 znakov 2, od 5 znakov 1, inak žiadny.
 */
export function getAllowedTypos(acceptedAnswer: string) {
  const length = normalizeFreeText(acceptedAnswer).replace(/ /g, "").length;

  if (length >= 10) {
    return 2;
  }

  return length >= 5 ? 1 : 0;
}

/**
 * Počet preklepov medzi dvoma textami: chýbajúci, nadbytočný alebo iný
 * znak a výmena dvoch susedných znakov sa počíta ako jeden preklep.
 */
export function countTypos(first: string, second: string) {
  const rows = first.length + 1;
  const columns = second.length + 1;
  const distances = Array.from({ length: rows }, (_, row) =>
    Array.from({ length: columns }, (_, column) =>
      row === 0 ? column : column === 0 ? row : 0
    )
  );

  for (let row = 1; row < rows; row++) {
    for (let column = 1; column < columns; column++) {
      const cost = first[row - 1] === second[column - 1] ? 0 : 1;

      distances[row][column] = Math.min(
        distances[row - 1][column] + 1,
        distances[row][column - 1] + 1,
        distances[row - 1][column - 1] + cost
      );

      const isSwap =
        row > 1 &&
        column > 1 &&
        first[row - 1] === second[column - 2] &&
        first[row - 2] === second[column - 1];

      if (isSwap) {
        distances[row][column] = Math.min(
          distances[row][column],
          distances[row - 2][column - 2] + 1
        );
      }
    }
  }

  return distances[first.length][second.length];
}

/** Je odpoveď niektorou z prijatých odpovedí (s odpustením preklepov)? */
export function isAnswerAccepted(answer: string, acceptedAnswers: string[]) {
  const normalizedAnswer = normalizeFreeText(answer);

  if (!normalizedAnswer) {
    return false;
  }

  return acceptedAnswers.some(
    (acceptedAnswer) =>
      countTypos(normalizedAnswer, normalizeFreeText(acceptedAnswer)) <=
      getAllowedTypos(acceptedAnswer)
  );
}

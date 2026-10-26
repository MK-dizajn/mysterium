/** Počet predmetov so správnym tvarom slova: 1 predmet, 3 predmety, 5 predmetov. */
export function formatItemCount(count: number) {
  if (count === 1) return "1 predmet";
  if (count > 1 && count < 5) return `${count} predmety`;
  return `${count} predmetov`;
}

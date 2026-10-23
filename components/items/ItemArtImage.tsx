import { useId } from "react";
import type { ItemInspectArt } from "../../types/game";
import { type ItemArtSide, ITEM_ARTS } from "./art/itemArtRegistry";

type ItemArtImageProps = {
  art: ItemInspectArt;
  side: ItemArtSide;
  digit: string;
  isDigitFound: boolean;
};

/**
 * Kreslený predmet v 2D (záloha bez 3D a obrázok počas načítania 3D).
 * Kresba je v jednom zdroji v components/items/art/, ten istý použije aj 3D.
 */
export function ItemArtImage({
  art,
  side,
  digit,
  isDigitFound,
}: ItemArtImageProps) {
  const idPrefix = `${art}-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  return (
    <div
      aria-hidden="true"
      className="h-full w-full drop-shadow-[0_18px_30px_rgba(0,0,0,0.6)] [&>svg]:h-full [&>svg]:w-full"
      // Kresbu generuje náš vlastný kód; texty sa v nej escapujú.
      dangerouslySetInnerHTML={{
        __html: ITEM_ARTS[art].getSvg(side, digit, isDigitFound, idPrefix),
      }}
    />
  );
}

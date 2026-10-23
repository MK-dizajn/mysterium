import { useId } from "react";
import { getTokenSvg, type TokenSide } from "./art/tokenArt";

type TokenArtProps = {
  side: TokenSide;
  digit: string;
  isDigitFound: boolean;
};

/**
 * Starý mosadzný žetón nultého kilometra (2D). Kresba je v jednom zdroji
 * components/items/art/tokenArt.ts, ktorý použije aj 3D žetón.
 */
export function TokenArt({ side, digit, isDigitFound }: TokenArtProps) {
  const idPrefix = `token-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  return (
    <div
      aria-hidden="true"
      className="h-full w-full drop-shadow-[0_18px_30px_rgba(0,0,0,0.6)] [&>svg]:h-full [&>svg]:w-full"
      // Kresbu generuje náš vlastný kód; číslica sa v nej escapuje.
      dangerouslySetInnerHTML={{
        __html: getTokenSvg({ side, digit, isDigitFound, idPrefix }),
      }}
    />
  );
}

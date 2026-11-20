"use client";

import type { FinalePhoto } from "../../types/game";
import { getPiecePath, PHOTO_VIEW, PhotoPieceArt } from "./PhotoPiece";

/** Poradie útržku vo fotografii (0 až 3), alebo −1, ak predmet nie je útržok. */
export function getFragmentIndex(photo: FinalePhoto | undefined, itemId: string) {
  return photo ? photo.fragmentIds.indexOf(itemId) : -1;
}

type PhotoFragmentPreviewProps = {
  photo: FinalePhoto;
  /** Útržok 0 až 3. */
  index: number;
  /** Útržky, ktoré hráč má (aj tento). */
  ownedFragmentIds: string[];
};

/**
 * Skutočný útržok fotografie (namiesto ikonky) a vedľa neho obrys celej
 * fotografie: čo hráč už má, čo chýba a ktorý útržok je tento.
 */
export function PhotoFragmentPreview({ photo, index, ownedFragmentIds }: PhotoFragmentPreviewProps) {
  const ownedCount = photo.fragmentIds.filter((id) =>
    ownedFragmentIds.includes(id)
  ).length;

  return (
    <div data-photo-fragment-preview={index + 1} className="flex items-center gap-4">
      <div className="min-w-0 flex-1">
        <PhotoPieceArt
          imageSrc={photo.imageSrc}
          index={index}
          view="crop"
          className="mx-auto block h-auto max-h-48 w-full max-w-[220px] -rotate-2"
        />
      </div>

      <div className="w-20 shrink-0 text-center">
        <svg
          data-photo-outline
          viewBox={`0 0 ${PHOTO_VIEW.width} ${PHOTO_VIEW.height}`}
          className="block h-auto w-full"
          role="img"
          aria-label={`Útržok ${index + 1} zo ${photo.fragmentIds.length}. Máš ${ownedCount} zo ${photo.fragmentIds.length}.`}
        >
          {photo.fragmentIds.map((id, pieceIndex) => {
            const isOwned = ownedFragmentIds.includes(id);
            const isCurrent = pieceIndex === index;

            return (
              <path
                key={id}
                data-outline-piece={pieceIndex + 1}
                data-owned={isOwned}
                data-current={isCurrent}
                d={getPiecePath(pieceIndex)}
                fill={isOwned ? (isCurrent ? "#e9c46a" : "#a8875a") : "none"}
                fillOpacity={isOwned ? 0.85 : 0}
                stroke={isCurrent ? "#fde68a" : "#94a3b8"}
                strokeWidth={isCurrent ? 8 : 4}
                strokeDasharray={isOwned ? undefined : "12 10"}
              />
            );
          })}
        </svg>
        <p className="mt-1 text-xs leading-4 text-slate-400">
          {ownedCount} zo {photo.fragmentIds.length}
        </p>
      </div>
    </div>
  );
}

/** Malý útržok v riadku Inventára (namiesto ikonky): malá verzia obrázka. */
export function PhotoFragmentThumb({ photo, index }: { photo: FinalePhoto; index: number }) {
  return (
    <span data-photo-fragment-thumb className="block h-7 w-7">
      <PhotoPieceArt imageSrc={photo.thumbnailSrc ?? photo.imageSrc} index={index} view="crop" className="block h-full w-full" />
    </span>
  );
}

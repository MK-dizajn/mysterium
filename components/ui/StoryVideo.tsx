"use client";

import { useEffect, useId, useState } from "react";

type StoryVideoProps = {
  src?: string;
  posterSrc?: string;
  captionsSrc?: string;
  /** Krátky popis deja videa pre čítačku obrazovky. */
  description?: string;
  /** Video sa nedá ukázať (chýba v dátach, súbor neexistuje alebo sa nenačíta). */
  onUnavailable?: () => void;
  onEnded?: () => void;
  className?: string;
};

/**
 * Video v príbehu: nikdy sa nespustí samo, nič sa nesťahuje vopred,
 * slovenské titulky sú zapnuté. Najprv overí, že súbor existuje;
 * ak nie, nič neukáže a dá vedieť cez onUnavailable (ostane text).
 */
export function StoryVideo({
  src,
  posterSrc,
  captionsSrc,
  description,
  onUnavailable,
  onEnded,
  className = "",
}: StoryVideoProps) {
  const descriptionId = useId();
  const [checkedSrc, setCheckedSrc] = useState<string | null>(null);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!src) {
      onUnavailable?.();
      return;
    }

    let isCancelled = false;

    // Iba hlavička, samotné video sa nesťahuje.
    fetch(src, { method: "HEAD" })
      .then((response) => {
        if (isCancelled) {
          return;
        }

        if (response.ok) {
          setCheckedSrc(src);
        } else {
          setFailedSrc(src);
          onUnavailable?.();
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setFailedSrc(src);
          onUnavailable?.();
        }
      });

    return () => {
      isCancelled = true;
    };
    // onUnavailable sa pri každom vykreslení mení; kontrola sa robí iba pre nový súbor.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  if (!src || checkedSrc !== src || failedSrc === src) {
    return null;
  }

  return (
    <>
      <video
        controls
        playsInline
        preload="none"
        poster={posterSrc}
        src={src}
        aria-describedby={description ? descriptionId : undefined}
        onError={() => {
          setFailedSrc(src);
          onUnavailable?.();
        }}
        onEnded={onEnded}
        className={`w-full rounded-2xl border border-amber-300/20 bg-black ${className}`}
      >
        {captionsSrc && (
          <track
            kind="captions"
            src={captionsSrc}
            srcLang="sk"
            label="Slovenčina"
            default
          />
        )}
      </video>

      {description && (
        <p id={descriptionId} className="sr-only">
          {description}
        </p>
      )}
    </>
  );
}

export type SoundId =
  | "puzzle-success"
  | "digit-found"
  | "button-click"
  | "npc-message"
  | "city-ambient"
  // Mini hry (docs/NAVRH-MINIHIER.md, „Zoznam zvukov“).
  | "dial-click"
  | "tile-slide"
  | "minigame-correct-step"
  | "minigame-wrong"
  | "compartment-open"
  | "digit-reveal"
  | "hint-open"
  // Útržok fotografie cvakne na miesto (úprava 3).
  | "photo-piece-snap"
  // Zámky truhlice (úprava 4, krok T2).
  | "chest-dial-click"
  | "chest-lock-open"
  | "chest-lock-wrong"
  | "chest-shine"
  // Otvorenie truhlice a spony (úprava 4, krok T4).
  | "chest-key-insert"
  | "chest-key-turn"
  | "chest-lid-creak"
  | "chest-hasp-release";

type SoundConfig = {
  src: string;
  volume?: number;
  loop?: boolean;
  /** false = súbor ešte neexistuje: zvuk sa nespúšťa (ticho), nič sa nesťahuje. */
  ready?: boolean;
};

type FadeState = {
  frameId: number;
};

const SOUND_STORAGE_KEY = "mysterium-sound-muted";

export const SOUND_SETTING_EVENT =
  "mysterium-sound-setting-change";

/*
 * Všetky zvuky hry a kedy zaznejú: docs/ZOZNAM-ZVUKOV.md.
 * Kým súbor chýba alebo je prázdny (0 B), má ready: false – zvuk sa
 * nespúšťa a nič sa nesťahuje (tiché miesto). Po dodaní súboru stačí
 * ready: false odstrániť.
 * Zvuky starej truhlice (artifact-unlock, chest-unlock) sú vyradené
 * (23. 11. 2026) – stará truhlica sa v hre nepoužíva.
 * Prvá dávka 19 zvukov je hotová (23. 11. 2026); tiché ostávajú iba
 * city-ambient (prázdny súbor) a button-click (voliteľný, nezapojený).
 */
const sounds: Record<SoundId, SoundConfig> = {
  "puzzle-success": { src: "/sounds/puzzle-success.mp3", volume: 0.65 },
  "digit-found": { src: "/sounds/digit-found.mp3", volume: 0.5 },
  // Voliteľný, nezapojený (rozhodnutie z 23. 11. 2026).
  "button-click": {
    src: "/sounds/button-click.mp3",
    volume: 0.35,
    ready: false,
  },
  "npc-message": { src: "/sounds/npc-message.mp3", volume: 0.45 },
  // Súbor je zatiaľ prázdny (0 B).
  "city-ambient": {
    src: "/sounds/city-ambient.mp3",
    volume: 0.3,
    loop: true,
    ready: false,
  },
  // Mini hry.
  "dial-click": { src: "/sounds/dial-click.mp3", volume: 0.5 },
  "tile-slide": { src: "/sounds/tile-slide.mp3", volume: 0.5 },
  "minigame-correct-step": { src: "/sounds/minigame-correct-step.mp3", volume: 0.5 },
  "minigame-wrong": { src: "/sounds/minigame-wrong.mp3", volume: 0.5 },
  "compartment-open": { src: "/sounds/compartment-open.mp3", volume: 0.7 },
  "digit-reveal": { src: "/sounds/digit-reveal.mp3", volume: 0.6 },
  "hint-open": { src: "/sounds/hint-open.mp3", volume: 0.4 },
  "photo-piece-snap": { src: "/sounds/photo-piece-snap.mp3", volume: 0.5 },
  // Truhlica vo finále (3D aj 2D).
  "chest-dial-click": { src: "/sounds/chest-dial-click.mp3", volume: 0.4 },
  "chest-lock-open": { src: "/sounds/chest-lock-open.mp3", volume: 0.7 },
  "chest-lock-wrong": { src: "/sounds/chest-lock-wrong.mp3", volume: 0.6 },
  "chest-shine": { src: "/sounds/chest-shine.mp3", volume: 0.5 },
  "chest-key-insert": { src: "/sounds/chest-key-insert.mp3", volume: 0.5 },
  "chest-key-turn": { src: "/sounds/chest-key-turn.mp3", volume: 0.6 },
  "chest-lid-creak": { src: "/sounds/chest-lid-creak.mp3", volume: 0.6 },
  "chest-hasp-release": { src: "/sounds/chest-hasp-release.mp3", volume: 0.6 },
};

/**
 * Hrá práve nahratý hlas (rozprávač, pátrač, Strážca)? Prehrávač hlasov
 * to zapisuje do dokumentu (lib/voicePlayer.ts), takže netreba vzájomný import.
 */
function isVoicePlaying() {
  return (
    typeof document !== "undefined" &&
    Boolean(document.documentElement.dataset.voicePlaying)
  );
}

function clampVolume(volume: number) {
  return Math.max(0, Math.min(1, volume));
}

class SoundManager {
  private activeSounds = new Map<SoundId, HTMLAudioElement>();
  private activeFades = new Map<SoundId, FadeState>();
  private muted = false;

  constructor() {
    if (typeof window !== "undefined") {
      this.muted =
        window.localStorage.getItem(SOUND_STORAGE_KEY) === "true";
    }
  }

  private cancelFade(soundId: SoundId) {
    const fade = this.activeFades.get(soundId);

    if (!fade || typeof window === "undefined") {
      return;
    }

    window.cancelAnimationFrame(fade.frameId);
    this.activeFades.delete(soundId);
  }

  private createAudio(soundId: SoundId) {
    const config = sounds[soundId];
    const audio = new Audio(config.src);

    audio.volume = clampVolume(config.volume ?? 1);
    audio.loop = config.loop ?? false;

    audio.addEventListener(
      "ended",
      () => {
        if (!audio.loop) {
          this.activeSounds.delete(soundId);
          this.cancelFade(soundId);
        }
      },
      { once: true }
    );

    this.activeSounds.set(soundId, audio);

    return audio;
  }

  /**
   * Zaznie zvuk? Iba keď je zapnutý prepínač zvuku v lište a súbor je
   * pripravený (nie tiché miesto).
   */
  canPlay(soundId: SoundId) {
    return (
      typeof window !== "undefined" &&
      !this.muted &&
      sounds[soundId].ready !== false
    );
  }

  play(soundId: SoundId) {
    // Krátky zvuk nikdy neznie súčasne s nahratým hlasom.
    if (!this.canPlay(soundId) || isVoicePlaying()) {
      return;
    }

    this.cancelFade(soundId);
    this.stop(soundId);

    const audio = this.createAudio(soundId);

    audio.play().catch(() => {
      this.activeSounds.delete(soundId);
    });
  }

  fadeIn(soundId: SoundId, duration = 1500) {
    if (!this.canPlay(soundId)) {
      return;
    }

    this.cancelFade(soundId);

    const config = sounds[soundId];
    const targetVolume = clampVolume(config.volume ?? 1);

    let audio = this.activeSounds.get(soundId);

    if (!audio) {
      audio = this.createAudio(soundId);
      audio.volume = 0;

      audio.play().catch(() => {
        this.activeSounds.delete(soundId);
      });
    } else if (audio.paused) {
      audio.play().catch(() => {
        this.activeSounds.delete(soundId);
      });
    }

    const startVolume = clampVolume(audio.volume);
    const startedAt = performance.now();

    const updateVolume = (currentTime: number) => {
      const progress = Math.min(
        Math.max((currentTime - startedAt) / duration, 0),
        1
      );

      const nextVolume =
        startVolume +
        (targetVolume - startVolume) * progress;

      audio.volume = clampVolume(nextVolume);

      if (progress < 1) {
        const frameId =
          window.requestAnimationFrame(updateVolume);

        this.activeFades.set(soundId, { frameId });
      } else {
        audio.volume = targetVolume;
        this.activeFades.delete(soundId);
      }
    };

    const frameId =
      window.requestAnimationFrame(updateVolume);

    this.activeFades.set(soundId, { frameId });
  }

  fadeOut(soundId: SoundId, duration = 1000) {
    if (typeof window === "undefined") {
      return;
    }

    const audio = this.activeSounds.get(soundId);

    if (!audio) {
      return;
    }

    this.cancelFade(soundId);

    const startVolume = clampVolume(audio.volume);
    const startedAt = performance.now();

    const updateVolume = (currentTime: number) => {
      const progress = Math.min(
        Math.max((currentTime - startedAt) / duration, 0),
        1
      );

      const nextVolume =
        startVolume * (1 - progress);

      audio.volume = clampVolume(nextVolume);

      if (progress < 1) {
        const frameId =
          window.requestAnimationFrame(updateVolume);

        this.activeFades.set(soundId, { frameId });
      } else {
        audio.pause();
        audio.currentTime = 0;
        audio.volume = clampVolume(
          sounds[soundId].volume ?? 1
        );

        this.activeSounds.delete(soundId);
        this.activeFades.delete(soundId);
      }
    };

    const frameId =
      window.requestAnimationFrame(updateVolume);

    this.activeFades.set(soundId, { frameId });
  }

  stop(soundId: SoundId) {
    const audio = this.activeSounds.get(soundId);

    this.cancelFade(soundId);

    if (!audio) {
      return;
    }

    audio.pause();
    audio.currentTime = 0;
    audio.volume = clampVolume(
      sounds[soundId].volume ?? 1
    );

    this.activeSounds.delete(soundId);
  }

  stopAll() {
    this.activeFades.forEach(({ frameId }) => {
      if (typeof window !== "undefined") {
        window.cancelAnimationFrame(frameId);
      }
    });

    this.activeFades.clear();

    this.activeSounds.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });

    this.activeSounds.clear();
  }

  setMuted(muted: boolean) {
    this.muted = muted;

    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        SOUND_STORAGE_KEY,
        String(muted)
      );

      window.dispatchEvent(
        new CustomEvent(SOUND_SETTING_EVENT, {
          detail: { muted },
        })
      );
    }

    if (muted) {
      this.stopAll();
    }
  }

  isMuted() {
    return this.muted;
  }
}

export const soundManager = new SoundManager();
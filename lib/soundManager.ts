export type SoundId =
  | "artifact-unlock"
  | "puzzle-success"
  | "button-click"
  | "npc-message"
  | "city-ambient";

type SoundConfig = {
  src: string;
  volume?: number;
  loop?: boolean;
};

const SOUND_STORAGE_KEY = "mysterium-sound-muted";

const sounds: Record<SoundId, SoundConfig> = {
  "artifact-unlock": {
    src: "/sounds/artifact-unlock.mp3",
    volume: 0.7,
  },
  "puzzle-success": {
    src: "/sounds/puzzle-success.mp3",
    volume: 0.65,
  },
  "button-click": {
    src: "/sounds/button-click.mp3",
    volume: 0.35,
  },
  "npc-message": {
    src: "/sounds/npc-message.mp3",
    volume: 0.45,
  },
  "city-ambient": {
    src: "/sounds/city-ambient.mp3",
    volume: 0.3,
    loop: true,
  },
};

class SoundManager {
  private activeSounds = new Map<SoundId, HTMLAudioElement>();
  private muted = false;

  constructor() {
    if (typeof window !== "undefined") {
      this.muted =
        window.localStorage.getItem(SOUND_STORAGE_KEY) === "true";
    }
  }

  play(soundId: SoundId) {
    if (typeof window === "undefined" || this.muted) {
      return;
    }

    const config = sounds[soundId];

    if (!config) {
      return;
    }

    this.stop(soundId);

    const audio = new Audio(config.src);

    audio.volume = config.volume ?? 1;
    audio.loop = config.loop ?? false;

    audio.addEventListener(
      "ended",
      () => {
        if (!audio.loop) {
          this.activeSounds.delete(soundId);
        }
      },
      { once: true }
    );

    audio.play().catch(() => {
      this.activeSounds.delete(soundId);
    });

    this.activeSounds.set(soundId, audio);
  }

  stop(soundId: SoundId) {
    const audio = this.activeSounds.get(soundId);

    if (!audio) {
      return;
    }

    audio.pause();
    audio.currentTime = 0;
    this.activeSounds.delete(soundId);
  }

  stopAll() {
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
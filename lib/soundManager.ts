export type SoundId =
  | "artifact-unlock"
  | "chest-unlock"
  | "puzzle-success"
  | "button-click"
  | "npc-message"
  | "city-ambient";

type SoundConfig = {
  src: string;
  volume?: number;
  loop?: boolean;
};

type FadeState = {
  frameId: number;
};

const SOUND_STORAGE_KEY = "mysterium-sound-muted";

export const SOUND_SETTING_EVENT =
  "mysterium-sound-setting-change";

const sounds: Record<SoundId, SoundConfig> = {
  "artifact-unlock": {
    src: "/sounds/artifact-unlock.mp3",
    volume: 0.7,
  },
  "chest-unlock": {
    src: "/sounds/chest-unlock.mp3",
    volume: 0.55,
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

  play(soundId: SoundId) {
    if (typeof window === "undefined" || this.muted) {
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
    if (typeof window === "undefined" || this.muted) {
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
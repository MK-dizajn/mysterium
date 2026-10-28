import { SOUND_SETTING_EVENT, soundManager } from "./soundManager";

/** Stav prehrávača hlasov (pre useSyncExternalStore). */
export type VoiceState = {
  /** Práve hrajúci hlas (cesta k súboru), inak null. */
  src: string | null;
  /** Priebeh 0 až 1. */
  progress: number;
  /** Hlasy, ktorých súbor chýba alebo sa nedá prehrať (tlačidlo sa skryje). */
  failed: ReadonlySet<string>;
};

/**
 * Spoločný prehrávač hlasov: vždy hrá najviac jeden hlas. Riadi sa prepínačom
 * zvuku v hornej lište (vypnutý zvuk = nič nehrá samo). Súbor sa sťahuje až
 * pri prehraní.
 */
class VoicePlayer {
  private audio: HTMLAudioElement | null = null;
  private state: VoiceState = { src: null, progress: 0, failed: new Set() };
  private listeners = new Set<() => void>();
  private isListeningToSound = false;

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    this.listenToSoundSetting();
    return () => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = () => this.state;

  /** Prehrá hlas na žiadosť hráča (ťuknutie); vypnutý zvuk pritom zapne. */
  play(src: string) {
    if (soundManager.isMuted()) {
      soundManager.setMuted(false);
    }

    this.start(src, false);
  }

  /** Samospustenie (napríklad zápis po ťuknutí): pri vypnutom zvuku nič. */
  autoPlay(src: string) {
    if (soundManager.isMuted() || this.state.failed.has(src)) {
      return;
    }

    this.start(src, true);
  }

  /** Zastaví hlas; so src iba vtedy, keď hrá práve tento. */
  stop(src?: string) {
    if (!this.audio || (src && this.state.src !== src)) {
      return;
    }

    const audio = this.audio;
    this.audio = null;
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
    this.update({ src: null, progress: 0 });
  }

  private start(src: string, isAutoPlay: boolean) {
    this.stop();

    const audio = new Audio(src);
    audio.preload = "auto";
    this.audio = audio;
    this.update({ src, progress: 0 });

    audio.addEventListener("timeupdate", () => {
      if (this.audio === audio && audio.duration) {
        this.update({ progress: audio.currentTime / audio.duration });
      }
    });
    audio.addEventListener("ended", () => {
      if (this.audio === audio) {
        this.audio = null;
        this.update({ src: null, progress: 0 });
      }
    });
    // Chyba zastaveného hlasu (po stop) sa nepočíta ako chýbajúci súbor.
    audio.addEventListener("error", () => {
      if (this.audio === audio) {
        this.fail(audio, src);
      }
    });

    audio.play().catch((error: unknown) => {
      if (this.audio !== audio) {
        return;
      }

      // Zablokované samospustenie: ostane tlačidlo; chýbajúci súbor: tlačidlo zmizne.
      const isBlocked =
        error instanceof DOMException && error.name === "NotAllowedError";

      if (isAutoPlay && isBlocked) {
        this.audio = null;
        this.update({ src: null, progress: 0 });
      } else if (!isBlocked) {
        this.fail(audio, src);
      }
    });
  }

  private fail(audio: HTMLAudioElement, src: string) {
    if (this.audio === audio) {
      this.audio = null;
    }

    const failed = new Set(this.state.failed);
    failed.add(src);
    this.update({
      failed,
      ...(this.state.src === src ? { src: null, progress: 0 } : {}),
    });
  }

  private update(change: Partial<VoiceState>) {
    this.state = { ...this.state, ...change };

    // Pre testy a ladenie: ktorý hlas práve hrá.
    if (typeof document !== "undefined") {
      document.documentElement.dataset.voicePlaying = this.state.src ?? "";
    }

    this.listeners.forEach((listener) => listener());
  }

  /** Vypnutie zvuku v hornej lište zastaví aj hlas. */
  private listenToSoundSetting() {
    if (this.isListeningToSound || typeof window === "undefined") {
      return;
    }

    this.isListeningToSound = true;
    window.addEventListener(SOUND_SETTING_EVENT, () => {
      if (soundManager.isMuted()) {
        this.stop();
      }
    });
  }
}

export const voicePlayer = new VoicePlayer();

const EMPTY_STATE: VoiceState = { src: null, progress: 0, failed: new Set() };

/** Stav na serveri (pri vykreslení stránky vopred nič nehrá). */
export function getServerVoiceState() {
  return EMPTY_STATE;
}

import type { LanguageId } from "./types";

/** BCP-47 locale preferences for each course language */
export const LANGUAGE_LOCALES: Record<LanguageId, string[]> = {
  spanish: ["es-ES", "es-MX", "es-AR", "es"],
  russian: ["ru-RU", "ru"],
  chinese: ["zh-CN", "zh-Hans", "zh-TW", "zh"],
  german: ["de-DE", "de-AT", "de"],
  japanese: ["ja-JP", "ja"],
  khmer: ["km-KH", "km"],
  italian: ["it-IT", "it"],
};

export type SpeechSupport = {
  available: boolean;
  voiceName: string | null;
  locale: string | null;
  warning?: string;
};

function getVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !window.speechSynthesis) return [];
  return window.speechSynthesis.getVoices();
}

/** Wait for voices to load (Chrome loads async) */
export function whenVoicesReady(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      resolve([]);
      return;
    }
    const existing = window.speechSynthesis.getVoices();
    if (existing.length > 0) {
      resolve(existing);
      return;
    }
    const handler = () => {
      window.speechSynthesis.removeEventListener("voiceschanged", handler);
      resolve(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.addEventListener("voiceschanged", handler);
    // Fallback timeout
    setTimeout(() => {
      window.speechSynthesis.removeEventListener("voiceschanged", handler);
      resolve(window.speechSynthesis.getVoices());
    }, 1500);
  });
}

export function pickVoice(
  language: LanguageId,
  voices: SpeechSynthesisVoice[] = getVoices(),
): SpeechSynthesisVoice | null {
  const locales = LANGUAGE_LOCALES[language];
  for (const loc of locales) {
    const exact = voices.find(
      (v) => v.lang === loc || v.lang.replace("_", "-") === loc,
    );
    if (exact) return exact;
  }
  for (const loc of locales) {
    const prefix = loc.split("-")[0]!.toLowerCase();
    const partial = voices.find((v) =>
      v.lang.toLowerCase().startsWith(prefix),
    );
    if (partial) return partial;
  }
  return null;
}

export function checkSpeechSupport(language: LanguageId): SpeechSupport {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    return {
      available: false,
      voiceName: null,
      locale: null,
      warning:
        "Speech is not available in this browser. Try Chrome, Edge, or Safari on a device with speakers.",
    };
  }
  const voice = pickVoice(language);
  if (!voice) {
    return {
      available: true,
      voiceName: null,
      locale: LANGUAGE_LOCALES[language][0] ?? null,
      warning:
        language === "khmer"
          ? "No Khmer system voice found on this device. You can still read phrases; install a Khmer voice in system settings if available, or use another browser/device."
          : `No dedicated ${language} voice found — playback may use a fallback accent. Check system language packs for better pronunciation.`,
    };
  }
  return {
    available: true,
    voiceName: voice.name,
    locale: voice.lang,
  };
}

export type SpeakOptions = {
  language: LanguageId;
  text: string;
  /** 0.6–1.1; slower helps learners */
  rate?: number;
  pitch?: number;
  onEnd?: () => void;
  onError?: (message: string) => void;
};

let currentUtterance: SpeechSynthesisUtterance | null = null;

export function stopSpeaking(): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  currentUtterance = null;
}

export function speak(opts: SpeakOptions): void {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    opts.onError?.("Speech not supported");
    return;
  }

  stopSpeaking();

  const utter = new SpeechSynthesisUtterance(opts.text);
  const voice = pickVoice(opts.language);
  if (voice) {
    utter.voice = voice;
    utter.lang = voice.lang;
  } else {
    utter.lang = LANGUAGE_LOCALES[opts.language][0] ?? "en-US";
  }
  utter.rate = opts.rate ?? 0.85;
  utter.pitch = opts.pitch ?? 1;
  utter.onend = () => {
    currentUtterance = null;
    opts.onEnd?.();
  };
  utter.onerror = () => {
    currentUtterance = null;
    opts.onError?.("Could not play audio");
  };

  currentUtterance = utter;
  // Some browsers need a tick after cancel
  window.setTimeout(() => {
    window.speechSynthesis.speak(utter);
  }, 40);
}

export function isSpeaking(): boolean {
  if (typeof window === "undefined" || !window.speechSynthesis) return false;
  return window.speechSynthesis.speaking;
}

/** Prefer a clear English (AU/GB/US) voice for the app teacher bot */
export function pickEnglishVoice(
  voices: SpeechSynthesisVoice[] = getVoices(),
): SpeechSynthesisVoice | null {
  const prefs = ["en-AU", "en-GB", "en-US", "en-NZ", "en-IE", "en"];
  for (const loc of prefs) {
    const exact = voices.find(
      (v) =>
        v.lang === loc ||
        v.lang.replace("_", "-") === loc ||
        v.lang.toLowerCase().startsWith(loc.toLowerCase()),
    );
    if (exact) return exact;
  }
  // Prefer names that sound like teachers / natural readers
  const named = voices.find((v) =>
    /samantha|karen|moira|daniel|oliver|serena|google|natural|premium/i.test(
      v.name,
    ),
  );
  if (named) return named;
  return voices.find((v) => v.lang.toLowerCase().startsWith("en")) ?? null;
}

export type SpeakEnglishOptions = {
  text: string;
  /** 0.75–1.05; slightly slow helps kids follow */
  rate?: number;
  pitch?: number;
  onEnd?: () => void;
  onError?: (message: string) => void;
  onBoundary?: (charIndex: number) => void;
};

/** Voice teacher / app narrator — English explain mode */
export function speakEnglish(opts: SpeakEnglishOptions): void {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    opts.onError?.("Speech not supported");
    return;
  }

  stopSpeaking();

  const cleaned = opts.text
    .replace(/\s+/g, " ")
    .replace(/[·•]/g, ". ")
    .trim();
  if (!cleaned) {
    opts.onEnd?.();
    return;
  }

  const utter = new SpeechSynthesisUtterance(cleaned);
  const voice = pickEnglishVoice();
  if (voice) {
    utter.voice = voice;
    utter.lang = voice.lang;
  } else {
    utter.lang = "en-AU";
  }
  // Warm, clear classroom pace
  utter.rate = opts.rate ?? 0.92;
  utter.pitch = opts.pitch ?? 1.02;
  utter.onend = () => {
    currentUtterance = null;
    opts.onEnd?.();
  };
  utter.onerror = () => {
    currentUtterance = null;
    opts.onError?.("Could not play audio");
  };
  if (opts.onBoundary) {
    utter.onboundary = (e) => {
      if (typeof e.charIndex === "number") opts.onBoundary?.(e.charIndex);
    };
  }

  currentUtterance = utter;
  window.setTimeout(() => {
    window.speechSynthesis.speak(utter);
  }, 40);
}

export function checkEnglishSpeechSupport(): SpeechSupport {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    return {
      available: false,
      voiceName: null,
      locale: null,
      warning:
        "Speech is not available in this browser. Try Chrome, Edge, or Safari with speakers on.",
    };
  }
  const voice = pickEnglishVoice();
  return {
    available: true,
    voiceName: voice?.name ?? null,
    locale: voice?.lang ?? "en-AU",
    warning: voice
      ? undefined
      : "Using default system voice. Enable an English voice pack for clearer speech.",
  };
}

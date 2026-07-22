"use client";

import { useEffect, useState } from "react";
import {
  checkSpeechSupport,
  speak,
  stopSpeaking,
  whenVoicesReady,
} from "@/lib/speech";
import type { LanguageId } from "@/lib/types";

type Props = {
  text: string;
  language: LanguageId;
  label?: string;
  rate?: number;
  size?: "sm" | "md";
  className?: string;
};

export function SpeakButton({
  text,
  language,
  label = "Play",
  rate = 0.85,
  size = "md",
  className = "",
}: Props) {
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [warning, setWarning] = useState<string | undefined>();

  useEffect(() => {
    let cancelled = false;
    whenVoicesReady().then(() => {
      if (cancelled) return;
      const support = checkSpeechSupport(language);
      setReady(support.available);
      setWarning(support.warning);
    });
    return () => {
      cancelled = true;
      stopSpeaking();
    };
  }, [language]);

  function play() {
    if (playing) {
      stopSpeaking();
      setPlaying(false);
      return;
    }
    setPlaying(true);
    speak({
      language,
      text,
      rate,
      onEnd: () => setPlaying(false),
      onError: () => setPlaying(false),
    });
  }

  const chip = size === "sm";

  return (
    <div className={className}>
      <button
        type="button"
        onClick={play}
        disabled={!ready && !warning}
        className={`btn ${playing ? "btn-sky" : "btn-primary"} ${chip ? "btn-chip" : ""}`}
        aria-label={playing ? "Stop audio" : `Play pronunciation: ${text}`}
      >
        <span aria-hidden>{playing ? "⏹" : "🔊"}</span>
        {playing ? "Stop" : label}
      </button>
      {warning && (
        <p className="mt-1.5 text-xs text-soft leading-snug">{warning}</p>
      )}
    </div>
  );
}

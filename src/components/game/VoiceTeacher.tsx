"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  checkEnglishSpeechSupport,
  isSpeaking,
  speakEnglish,
  stopSpeaking,
  whenVoicesReady,
} from "@/lib/speech";

type Props = {
  /** Teacher display name */
  name?: string;
  /** Short role line under the name */
  role?: string;
  /** Main lesson text on the board */
  boardText: string;
  /** What the bot reads (falls back to boardText) */
  voiceScript?: string;
  /** Extra explanation when student taps “Explain more” */
  explainMore?: string;
  /** Auto-start speaking when board text changes */
  autoPlay?: boolean;
  className?: string;
};

/**
 * App teacher bot — reads and explains lesson steps with device TTS.
 * No human teacher required; the app runs the class.
 */
export function VoiceTeacher({
  name = "Coach Ava",
  role = "App teacher · reads and explains every step",
  boardText,
  voiceScript,
  explainMore,
  autoPlay = true,
  className = "",
}: Props) {
  const [playing, setPlaying] = useState(false);
  const [mode, setMode] = useState<"main" | "more">("main");
  const [ready, setReady] = useState(false);
  const [warning, setWarning] = useState<string | undefined>();
  const [status, setStatus] = useState("Ready when you are");
  const lastKey = useRef("");

  const mainLine = (voiceScript || boardText).trim();
  const moreLine = (explainMore || "").trim();

  useEffect(() => {
    let cancelled = false;
    whenVoicesReady().then(() => {
      if (cancelled) return;
      const s = checkEnglishSpeechSupport();
      setReady(s.available);
      setWarning(s.warning);
      if (s.voiceName) setStatus(`Voice: ${s.voiceName}`);
    });
    return () => {
      cancelled = true;
      stopSpeaking();
    };
  }, []);

  const speakLine = useCallback(
    (text: string, label: string) => {
      if (!text) return;
      setPlaying(true);
      setStatus(label);
      speakEnglish({
        text,
        rate: 0.9,
        pitch: 1.02,
        onEnd: () => {
          setPlaying(false);
          setStatus("Tap listen to hear again");
        },
        onError: () => {
          setPlaying(false);
          setStatus("Could not play — try again");
        },
      });
    },
    [],
  );

  // Auto-play when step content changes
  useEffect(() => {
    if (!autoPlay || !ready || !mainLine) return;
    if (lastKey.current === mainLine) return;
    lastKey.current = mainLine;
    setMode("main");
    const t = window.setTimeout(() => {
      speakLine(mainLine, "Teaching this step…");
    }, 350);
    return () => clearTimeout(t);
  }, [mainLine, autoPlay, ready, speakLine]);

  function togglePlay() {
    if (playing || isSpeaking()) {
      stopSpeaking();
      setPlaying(false);
      setStatus("Paused");
      return;
    }
    const text = mode === "more" && moreLine ? moreLine : mainLine;
    speakLine(
      text,
      mode === "more" ? "Explaining in more detail…" : "Teaching this step…",
    );
  }

  function onExplainMore() {
    if (!moreLine) return;
    setMode("more");
    lastKey.current = ""; // allow re-speak
    speakLine(moreLine, "Explaining in more detail…");
  }

  function onReadBoard() {
    setMode("main");
    lastKey.current = "";
    speakLine(mainLine, "Reading the lesson board…");
  }

  return (
    <div
      className={`glass-strong rounded-[var(--radius-xl)] p-4 sm:p-5 ${className}`}
    >
      <div className="flex flex-wrap items-start gap-4">
        <div
          className={`relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-3xl shadow-lg ${
            playing
              ? "bg-gradient-to-br from-[var(--sky-soft)] to-[var(--accent-soft)] ring-2 ring-[var(--sky)] animate-pulse"
              : "bg-gradient-to-br from-[var(--accent-soft)] to-[var(--accent-deep)]"
          }`}
          aria-hidden
        >
          🎙️
          {playing && (
            <span className="absolute -bottom-1 -right-1 rounded-full bg-emerald-500 px-1.5 text-[10px] font-bold text-white">
              ON
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
            Voice teacher bot
          </p>
          <h3 className="heading-section text-lg sm:text-xl">{name}</h3>
          <p className="text-sm text-muted">{role}</p>
          <p className="mt-1 text-xs text-soft">{status}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className={`btn text-sm ${playing ? "btn-sky" : "btn-primary"}`}
          onClick={togglePlay}
          disabled={!ready && !warning}
        >
          {playing ? "⏹ Stop" : "🔊 Listen"}
        </button>
        <button
          type="button"
          className="btn btn-ghost text-sm"
          onClick={onReadBoard}
          disabled={!mainLine}
        >
          Read this step
        </button>
        {moreLine ? (
          <button
            type="button"
            className="btn btn-sky text-sm"
            onClick={onExplainMore}
          >
            Explain more
          </button>
        ) : null}
      </div>

      {warning && (
        <p className="mt-3 text-xs leading-snug text-soft">{warning}</p>
      )}

      <p className="mt-3 text-xs text-muted">
        Classes run inside the app. {name} is a teacher-style voice that reads
        and explains each part — no human teacher needed to start.
      </p>
    </div>
  );
}

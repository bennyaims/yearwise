"use client";

import { useState } from "react";
import { SpeakButton } from "@/components/SpeakButton";
import type { AudioPhrase, LanguageId } from "@/lib/types";

type Props = {
  phrases: AudioPhrase[];
  language: LanguageId;
};

export function AudioPhrases({ phrases, language }: Props) {
  const [rate, setRate] = useState(0.85);

  if (!phrases.length) return null;

  return (
    <section className="glass-strong rounded-[var(--radius-xl)] p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
            Pronunciation lab
          </p>
          <h2 className="heading-section mt-1 text-lg sm:text-xl">
            Listen & repeat
          </h2>
          <p className="mt-1 text-sm text-muted">
            Tap play for each phrase. Use slow speed while you learn, then
            normal. Audio uses your device’s speech voices.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={`btn btn-chip ${rate < 0.8 ? "btn-sky" : "btn-ghost"}`}
            onClick={() => setRate(0.7)}
          >
            Slow
          </button>
          <button
            type="button"
            className={`btn btn-chip ${rate >= 0.8 && rate < 0.95 ? "btn-sky" : "btn-ghost"}`}
            onClick={() => setRate(0.85)}
          >
            Clear
          </button>
          <button
            type="button"
            className={`btn btn-chip ${rate >= 0.95 ? "btn-sky" : "btn-ghost"}`}
            onClick={() => setRate(1)}
          >
            Natural
          </button>
        </div>
      </div>

      <ul className="mt-5 space-y-3">
        {phrases.map((p) => (
          <li
            key={p.id}
            className="glass flex flex-col gap-3 rounded-[var(--radius-md)] p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0 flex-1">
              <p className="text-lg font-semibold text-ink">{p.text}</p>
              {p.romanization && (
                <p className="mt-0.5 text-sm text-soft">{p.romanization}</p>
              )}
              <p className="mt-1 text-sm text-muted">{p.meaning}</p>
              {p.note && (
                <p className="mt-1 text-xs text-accent">{p.note}</p>
              )}
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <SpeakButton
                text={p.text}
                language={language}
                rate={rate}
                label="Play"
                size="sm"
              />
              <SpeakButton
                text={p.text}
                language={language}
                rate={0.65}
                label="Slow"
                size="sm"
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

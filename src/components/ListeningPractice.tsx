"use client";

import { useState } from "react";
import { SpeakButton } from "@/components/SpeakButton";
import type { LanguageId, ListeningItem } from "@/lib/types";

type Props = {
  items: ListeningItem[];
  language: LanguageId;
  onComplete?: (percent: number) => void;
};

export function ListeningPractice({ items, language, onComplete }: Props) {
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"idle" | "right" | "wrong">("idle");
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [revealed, setRevealed] = useState(false);

  if (!items.length) return null;

  const item = items[index]!;
  const total = items.length;

  function check() {
    if (chosen === null || feedback !== "idle") return;
    const ok = chosen === item.correctIndex;
    setFeedback(ok ? "right" : "wrong");
    if (ok) setCorrectCount((c) => c + 1);
  }

  function goNext() {
    if (feedback === "idle") return;
    if (index >= total - 1) {
      const finalCorrect =
        correctCount + (feedback === "right" ? 0 : 0);
      // correctCount already includes this item if right
      const percent = Math.round((correctCount / total) * 100);
      setFinished(true);
      onComplete?.(percent);
      void finalCorrect;
      return;
    }
    setIndex((i) => i + 1);
    setChosen(null);
    setFeedback("idle");
    setRevealed(false);
  }

  if (finished) {
    const percent = Math.round((correctCount / total) * 100);
    return (
      <section className="glass-strong rounded-[var(--radius-xl)] p-5 sm:p-6">
        <h2 className="heading-section text-xl">Listening complete</h2>
        <p className="mt-2 text-3xl font-bold text-accent">{percent}%</p>
        <p className="text-muted">
          {correctCount}/{total} correct — replay phrases you missed in the lab
          above.
        </p>
        <button
          type="button"
          className="btn btn-ghost mt-4"
          onClick={() => {
            setIndex(0);
            setChosen(null);
            setFeedback("idle");
            setCorrectCount(0);
            setFinished(false);
            setRevealed(false);
          }}
        >
          Try listening again
        </button>
      </section>
    );
  }

  return (
    <section className="glass-strong rounded-[var(--radius-xl)] p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
            Listening practice
          </p>
          <h2 className="heading-section mt-1 text-lg sm:text-xl">
            What did you hear?
          </h2>
        </div>
        <span className="badge badge-sky">
          {index + 1}/{total} · score {correctCount}
        </span>
      </div>
      <p className="mt-2 text-sm text-muted">
        Play the audio first without reading the script. Then choose the best
        meaning.
      </p>

      <div className="glass mt-5 rounded-[var(--radius-lg)] p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-3">
          <SpeakButton
            text={item.audioText}
            language={language}
            rate={0.85}
            label="Play audio"
          />
          <SpeakButton
            text={item.audioText}
            language={language}
            rate={0.65}
            label="Play slow"
            size="sm"
          />
          <button
            type="button"
            className="btn btn-ghost btn-chip"
            onClick={() => setRevealed((r) => !r)}
          >
            {revealed ? "Hide script" : "Show script"}
          </button>
        </div>
        {revealed && (
          <p className="mt-3 font-medium text-ink">{item.audioText}</p>
        )}
        <p className="mt-4 font-medium text-ink">{item.prompt}</p>
        <div className="mt-3 space-y-2">
          {item.options.map((opt, oi) => {
            let cls = "option";
            if (feedback === "idle" && chosen === oi) cls += " option-selected";
            if (feedback !== "idle") {
              if (oi === item.correctIndex) cls += " option-correct";
              else if (chosen === oi) cls += " option-wrong";
            }
            return (
              <button
                key={oi}
                type="button"
                disabled={feedback !== "idle"}
                onClick={() => setChosen(oi)}
                className={cls}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {feedback === "wrong" && (
          <p className="mt-3 text-sm" style={{ color: "var(--err)" }}>
            Not yet. {item.explanation}
          </p>
        )}
        {feedback === "right" && (
          <p className="mt-3 text-sm" style={{ color: "var(--ok)" }}>
            Correct. {item.explanation}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-3">
          {feedback === "idle" ? (
            <button
              type="button"
              className="btn btn-primary"
              disabled={chosen === null}
              onClick={check}
            >
              Check
            </button>
          ) : (
            <button type="button" className="btn btn-sky" onClick={goNext}>
              {index < total - 1
                ? "Next listening item →"
                : `Finish listening (${correctCount}/${total})`}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

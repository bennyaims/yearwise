"use client";

import { useMemo, useState } from "react";
import type { LearnBeat } from "@/lib/types";

type Props = {
  beats: LearnBeat[];
  lessonTitle: string;
  onPathComplete: () => void;
};

/**
 * Deep teach loop: one idea at a time, check before unlock.
 * Quiz must not appear until this reports complete.
 */
export function GuidedLearning({
  beats,
  lessonTitle,
  onPathComplete,
}: Props) {
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"idle" | "right" | "wrong">("idle");
  const [passed, setPassed] = useState<Set<string>>(() => new Set());
  const [finished, setFinished] = useState(false);

  const beat = beats[index];
  const total = beats.length;
  const progressPct = useMemo(
    () => Math.round((passed.size / Math.max(total, 1)) * 100),
    [passed.size, total],
  );

  if (!beat) return null;

  function check() {
    if (chosen === null || !beat) return;
    if (chosen === beat.check.correctIndex) {
      setFeedback("right");
      setPassed((prev) => new Set(prev).add(beat.id));
    } else {
      setFeedback("wrong");
    }
  }

  function next() {
    if (feedback !== "right") return;
    if (index >= total - 1) {
      setFinished(true);
      onPathComplete();
      return;
    }
    setIndex((i) => i + 1);
    setChosen(null);
    setFeedback("idle");
  }

  if (finished) {
    return (
      <section className="glass-strong rounded-[var(--radius-xl)] p-5 sm:p-7">
        <div
          className="icon-disc mx-auto flex h-14 w-14 items-center justify-center text-2xl"
          style={{ background: "var(--ok-soft)", color: "var(--ok)" }}
        >
          ✓
        </div>
        <h2 className="heading-section mt-4 text-center text-xl">
          Learning path complete
        </h2>
        <p className="mt-2 text-center text-muted">
          You proved each idea for <strong className="text-ink">{lessonTitle}</strong>.
          The quiz is now unlocked — same ideas, slightly different wording.
        </p>
        <p className="mt-3 text-center text-sm text-soft">
          {total}/{total} teaching checks passed
        </p>
      </section>
    );
  }

  return (
    <section className="glass-strong rounded-[var(--radius-xl)] p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
            Guided learning · not a text dump
          </p>
          <h2 className="heading-section mt-1 text-lg sm:text-xl">
            Step {index + 1} of {total}: {beat.title}
          </h2>
        </div>
        <span className="badge badge-sky">{progressPct}% taught</span>
      </div>

      <div className="progress-track mt-4">
        <div
          className="progress-fill"
          style={{ width: `${((index + (feedback === "right" ? 1 : 0)) / total) * 100}%` }}
        />
      </div>

      <div className="mt-5 space-y-4">
        <div className="callout callout-info whitespace-pre-wrap text-base leading-relaxed">
          {beat.teach}
        </div>

        {beat.bullets && beat.bullets.length > 0 && (
          <ul className="list-disc space-y-2 pl-5 text-muted">
            {beat.bullets.map((b) => (
              <li key={b} className="leading-relaxed">
                {b}
              </li>
            ))}
          </ul>
        )}

        {beat.remember && (
          <div className="callout callout-tip">
            <div className="text-xs font-bold uppercase tracking-wide opacity-75">
              Remember this
            </div>
            {beat.remember}
          </div>
        )}

        <div className="glass rounded-[var(--radius-lg)] p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-soft">
            Check before you continue
          </p>
          <p className="mt-2 font-medium text-ink">{beat.check.prompt}</p>
          <div className="mt-3 space-y-2">
            {beat.check.options.map((opt, oi) => {
              let cls = "option";
              if (feedback === "idle" && chosen === oi) cls += " option-selected";
              if (feedback !== "idle") {
                if (oi === beat.check.correctIndex) cls += " option-correct";
                else if (chosen === oi) cls += " option-wrong";
              }
              return (
                <button
                  key={oi}
                  type="button"
                  disabled={feedback === "right"}
                  onClick={() => {
                    setChosen(oi);
                    setFeedback("idle");
                  }}
                  className={cls}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {feedback === "wrong" && (
            <div className="callout callout-warning mt-3">
              <strong>Not yet — re-read then try again.</strong>
              <p className="mt-1">{beat.check.hint}</p>
            </div>
          )}
          {feedback === "right" && (
            <div className="callout callout-tip mt-3">
              <strong>Correct.</strong>
              <p className="mt-1">{beat.check.whyCorrect}</p>
            </div>
          )}

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            {feedback !== "right" ? (
              <button
                type="button"
                className="btn btn-primary"
                disabled={chosen === null}
                onClick={check}
              >
                Check my understanding
              </button>
            ) : (
              <button type="button" className="btn btn-sky" onClick={next}>
                {index < total - 1
                  ? "Got it — next idea →"
                  : "Finish learning path · unlock quiz"}
              </button>
            )}
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs text-soft">
        You cannot skip ahead. Each idea is checked so the final quiz is fair.
      </p>
    </section>
  );
}

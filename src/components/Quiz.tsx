"use client";

import { useMemo, useState } from "react";
import { HelpMeSolve } from "@/components/HelpMeSolve";
import type { QuizQuestion } from "@/lib/types";

type Props = {
  questions: QuizQuestion[];
  onComplete?: (scorePercent: number) => void;
};

function optionClass(
  selected: boolean,
  show: boolean,
  isCorrect: boolean,
): string {
  if (show) {
    if (isCorrect) return "option option-correct";
    if (selected) return "option option-wrong";
    return "option";
  }
  if (selected) return "option option-selected";
  return "option";
}

export function Quiz({ questions, onComplete }: Props) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [helpingId, setHelpingId] = useState<string | null>(null);
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());

  const helpingQuestion = useMemo(
    () => questions.find((q) => q.id === helpingId) ?? null,
    [helpingId, questions],
  );
  const helpingNumber = useMemo(() => {
    if (!helpingId) return undefined;
    const idx = questions.findIndex((q) => q.id === helpingId);
    return idx >= 0 ? idx + 1 : undefined;
  }, [helpingId, questions]);

  const score = useMemo(() => {
    if (!submitted) return null;
    const correct = questions.filter(
      (q) => answers[q.id] === q.correctIndex,
    ).length;
    return Math.round((correct / questions.length) * 100);
  }, [answers, questions, submitted]);

  function submit() {
    if (Object.keys(answers).length < questions.length) return;
    setSubmitted(true);
    const correct = questions.filter(
      (q) => answers[q.id] === q.correctIndex,
    ).length;
    const pct = Math.round((correct / questions.length) * 100);
    onComplete?.(pct);
  }

  function reset() {
    setAnswers({});
    setSubmitted(false);
  }

  function onMastered(questionId: string) {
    setMasteredIds((prev) => new Set(prev).add(questionId));
    const q = questions.find((item) => item.id === questionId);
    if (q) {
      setAnswers((a) => ({ ...a, [questionId]: q.correctIndex }));
    }
  }

  return (
    <>
      <section className="glass-strong rounded-[var(--radius-xl)] p-5 sm:p-7">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="heading-section text-lg sm:text-xl">
            Check your understanding
          </h2>
          {submitted && score !== null && (
            <span className={score >= 70 ? "badge badge-ok" : "badge badge-warn"}>
              {score}%
            </span>
          )}
        </div>

        <p className="mb-6 text-sm text-muted">
          Stuck? Use{" "}
          <strong className="font-semibold text-ink">Help me solve</strong> for
          a step-by-step coach. It will not return you here until you can solve
          the question yourself and complete 5 independent practice solves.
        </p>

        <div className="space-y-6">
          {questions.map((q, qi) => {
            const chosen = answers[q.id];
            const show = submitted;
            const mastered = masteredIds.has(q.id);
            return (
              <div
                key={q.id}
                className="glass-soft rounded-[var(--radius-lg)] p-4 sm:p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-ink">
                    {qi + 1}. {q.prompt}
                  </p>
                  {mastered && (
                    <span className="badge badge-ok shrink-0">
                      Mastered with coach
                    </span>
                  )}
                </div>
                <div className="mt-3 space-y-2">
                  {q.options.map((opt, oi) => (
                    <button
                      key={oi}
                      type="button"
                      disabled={submitted}
                      onClick={() =>
                        setAnswers((a) => ({ ...a, [q.id]: oi }))
                      }
                      className={`${optionClass(
                        chosen === oi,
                        show,
                        oi === q.correctIndex,
                      )} disabled:cursor-default`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {!submitted && (
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => setHelpingId(q.id)}
                      className="btn btn-sky btn-chip"
                    >
                      <span aria-hidden>🛟</span>
                      Help me solve
                    </button>
                  </div>
                )}

                {show && (
                  <p className="mt-3 text-sm text-muted">{q.explanation}</p>
                )}

                {show && chosen !== q.correctIndex && (
                  <button
                    type="button"
                    onClick={() => setHelpingId(q.id)}
                    className="btn btn-sky btn-chip mt-3"
                  >
                    <span aria-hidden>🛟</span>
                    Help me solve this one properly
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {!submitted ? (
            <button
              type="button"
              onClick={submit}
              disabled={Object.keys(answers).length < questions.length}
              className="btn btn-primary"
            >
              Submit answers
            </button>
          ) : (
            <button type="button" onClick={reset} className="btn btn-ghost">
              Try again
            </button>
          )}
        </div>
      </section>

      {helpingQuestion && (
        <HelpMeSolve
          question={helpingQuestion}
          questionNumber={helpingNumber}
          onExit={() => setHelpingId(null)}
          onMastered={() => onMastered(helpingQuestion.id)}
        />
      )}
    </>
  );
}

"use client";

import { useMemo, useState } from "react";
import {
  buildPracticePool,
  buildSolveSteps,
  isAnswerCorrect,
  type PracticeItem,
} from "@/lib/solve-helper";
import { MASTERY_TARGET, type QuizQuestion } from "@/lib/types";

type Phase =
  | "intro"
  | "teach"
  | "retry-original"
  | "independent"
  | "mastered";

type Props = {
  question: QuizQuestion;
  questionNumber?: number;
  onExit: () => void;
  onMastered?: () => void;
};

function optionClass(
  selected: boolean,
  feedback: "idle" | "wrong" | "right",
  isCorrect: boolean,
): string {
  if (feedback !== "idle") {
    if (isCorrect) return "option option-correct";
    if (selected) return "option option-wrong";
    return "option";
  }
  if (selected) return "option option-selected";
  return "option";
}

export function HelpMeSolve({
  question,
  questionNumber,
  onExit,
  onMastered,
}: Props) {
  const steps = useMemo(() => buildSolveSteps(question), [question]);
  const practicePool = useMemo(() => buildPracticePool(question), [question]);

  const [phase, setPhase] = useState<Phase>("intro");
  const [stepIndex, setStepIndex] = useState(0);
  const [stepAnswer, setStepAnswer] = useState<number | null>(null);
  const [stepFeedback, setStepFeedback] = useState<"idle" | "wrong" | "right">(
    "idle",
  );

  const [retryAnswer, setRetryAnswer] = useState<number | null>(null);
  const [retryFeedback, setRetryFeedback] = useState<
    "idle" | "wrong" | "right"
  >("idle");

  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceAnswer, setPracticeAnswer] = useState<number | null>(null);
  const [practiceFeedback, setPracticeFeedback] = useState<
    "idle" | "wrong" | "right"
  >("idle");
  const [independentSolves, setIndependentSolves] = useState(0);
  const [usedHelpOnCurrent, setUsedHelpOnCurrent] = useState(false);
  const [showPracticeHelp, setShowPracticeHelp] = useState(false);
  const [practiceHelpStep, setPracticeHelpStep] = useState(0);

  const currentStep = steps[stepIndex];
  const currentPractice: PracticeItem | undefined =
    practicePool[practiceIndex % practicePool.length];

  function resetStepCheck() {
    setStepAnswer(null);
    setStepFeedback("idle");
  }

  function startTeaching() {
    setPhase("teach");
    setStepIndex(0);
    resetStepCheck();
  }

  function checkStep() {
    if (!currentStep?.check || stepAnswer === null) return;
    setStepFeedback(
      isAnswerCorrect(currentStep.check, stepAnswer) ? "right" : "wrong",
    );
  }

  function nextStep() {
    if (currentStep?.check && stepFeedback !== "right") return;
    if (stepIndex < steps.length - 1) {
      setStepIndex((i) => i + 1);
      resetStepCheck();
      return;
    }
    setPhase("retry-original");
    setRetryAnswer(null);
    setRetryFeedback("idle");
  }

  function checkRetry() {
    if (retryAnswer === null) return;
    setRetryFeedback(
      isAnswerCorrect(question, retryAnswer) ? "right" : "wrong",
    );
  }

  function afterRetrySuccess() {
    setPhase("independent");
    setPracticeIndex(0);
    setPracticeAnswer(null);
    setPracticeFeedback("idle");
    setIndependentSolves(0);
    setUsedHelpOnCurrent(false);
    setShowPracticeHelp(false);
  }

  function reopenTeachingFromRetry() {
    setPhase("teach");
    setStepIndex(0);
    resetStepCheck();
    setRetryAnswer(null);
    setRetryFeedback("idle");
  }

  function checkPractice() {
    if (!currentPractice || practiceAnswer === null) return;
    setPracticeFeedback(
      isAnswerCorrect(currentPractice, practiceAnswer) ? "right" : "wrong",
    );
  }

  function advanceAfterPractice() {
    if (practiceFeedback !== "right" || !currentPractice) return;

    const nextSolves = usedHelpOnCurrent
      ? independentSolves
      : independentSolves + 1;

    if (!usedHelpOnCurrent) setIndependentSolves(nextSolves);

    if (nextSolves >= MASTERY_TARGET) {
      setPhase("mastered");
      return;
    }

    setPracticeIndex((i) => i + 1);
    setPracticeAnswer(null);
    setPracticeFeedback("idle");
    setUsedHelpOnCurrent(false);
    setShowPracticeHelp(false);
    setPracticeHelpStep(0);
  }

  function openPracticeHelp() {
    setUsedHelpOnCurrent(true);
    setShowPracticeHelp(true);
    setPracticeHelpStep(0);
    setPracticeAnswer(null);
    setPracticeFeedback("idle");
  }

  function finishAndReturn() {
    onMastered?.();
    onExit();
  }

  return (
    <div className="coach-shell" style={{ paddingTop: "var(--safe-top)" }}>
      <header className="glass-strong shrink-0">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-3 sm:px-5">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
              Help me solve
            </p>
            <p className="truncate text-sm text-muted">
              {questionNumber != null ? `Question ${questionNumber} · ` : ""}
              Text step-by-step coach
            </p>
          </div>
          {phase === "intro" && (
            <button type="button" onClick={onExit} className="btn btn-ghost btn-chip">
              Not now
            </button>
          )}
          {(phase === "teach" ||
            phase === "retry-original" ||
            phase === "independent") && (
            <div className="shrink-0 text-right">
              <p className="text-xs text-soft">
                {phase === "independent"
                  ? "Independent solves"
                  : "Stay until you can do it"}
              </p>
              <p className="text-lg font-bold tabular-nums text-accent">
                {phase === "independent"
                  ? `${independentSolves}/${MASTERY_TARGET}`
                  : "In progress"}
              </p>
            </div>
          )}
        </div>
        {phase === "independent" && (
          <div className="progress-track mx-0 rounded-none">
            <div
              className="progress-fill"
              style={{
                width: `${(independentSolves / MASTERY_TARGET) * 100}%`,
              }}
            />
          </div>
        )}
      </header>

      <div
        className="flex-1 overflow-y-auto"
        style={{ paddingBottom: "var(--safe-bottom)" }}
      >
        <div className="mx-auto max-w-2xl px-4 py-6 sm:px-5 sm:py-8">
          {phase === "intro" && (
            <section className="glass-strong space-y-5 rounded-[var(--radius-xl)] p-5 sm:p-7">
              <h1 className="heading-display text-2xl sm:text-3xl">
                We will not leave until you can do this yourself
              </h1>
              <p className="leading-relaxed text-muted">
                Stuck is normal. This coach walks you through the question in
                plain text steps. You must pass each step check, then solve the
                original question alone, then get{" "}
                <strong className="text-ink">
                  {MASTERY_TARGET} independent practice questions
                </strong>{" "}
                correct without help. After that you return to the lesson.
              </p>
              <div className="glass rounded-[var(--radius-md)] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-soft">
                  The question
                </p>
                <p className="mt-2 font-medium text-ink">{question.prompt}</p>
              </div>
              <ol className="list-decimal space-y-2 pl-5 text-sm text-muted">
                <li>Learn the method step by step (with checks)</li>
                <li>Solve this same question with no steps showing</li>
                <li>
                  Solve {MASTERY_TARGET} more on your own (help resets that
                  question&apos;s count)
                </li>
                <li>Return to the learning process</li>
              </ol>
              <button type="button" onClick={startTeaching} className="btn btn-sky w-full sm:w-auto">
                Start step-by-step help
              </button>
            </section>
          )}

          {phase === "teach" && currentStep && (
            <section className="space-y-4 sm:space-y-5">
              <div className="flex items-center gap-2">
                {steps.map((_, i) => (
                  <span
                    key={i}
                    className="h-1.5 flex-1 rounded-full transition-colors"
                    style={{
                      background:
                        i <= stepIndex
                          ? "var(--sky)"
                          : "color-mix(in srgb, var(--fg) 10%, transparent)",
                      opacity: i === stepIndex ? 1 : i < stepIndex ? 0.85 : 1,
                    }}
                  />
                ))}
              </div>
              <p className="text-sm text-muted">
                Step {stepIndex + 1} of {steps.length}
              </p>
              <h2 className="heading-section text-xl">{currentStep.title}</h2>
              <div className="callout callout-info whitespace-pre-wrap">
                {currentStep.teaching}
              </div>

              {currentStep.check && (
                <div className="glass rounded-[var(--radius-lg)] p-4 sm:p-5">
                  <p className="font-medium text-ink">Check before you continue</p>
                  <p className="mt-1 text-sm text-muted">
                    {currentStep.check.prompt}
                  </p>
                  <div className="mt-3 space-y-2">
                    {currentStep.check.options.map((opt, oi) => (
                      <button
                        key={oi}
                        type="button"
                        disabled={stepFeedback === "right"}
                        onClick={() => {
                          setStepAnswer(oi);
                          setStepFeedback("idle");
                        }}
                        className={optionClass(
                          stepAnswer === oi,
                          stepFeedback,
                          oi === currentStep.check!.correctIndex,
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  {stepFeedback === "wrong" && (
                    <p className="mt-3 text-sm" style={{ color: "var(--err)" }}>
                      Not yet. Hint: {currentStep.check.hint}
                    </p>
                  )}
                  {stepFeedback === "right" && (
                    <p className="mt-3 text-sm" style={{ color: "var(--ok)" }}>
                      Correct — you can move on.
                    </p>
                  )}
                  {stepFeedback !== "right" && (
                    <button
                      type="button"
                      onClick={checkStep}
                      disabled={stepAnswer === null}
                      className="btn btn-primary mt-4"
                    >
                      Check this step
                    </button>
                  )}
                </div>
              )}

              {(stepFeedback === "right" || !currentStep.check) && (
                <button type="button" onClick={nextStep} className="btn btn-sky w-full sm:w-auto">
                  {stepIndex < steps.length - 1
                    ? "Next step →"
                    : "I’ve read every step — try the question alone"}
                </button>
              )}
            </section>
          )}

          {phase === "retry-original" && (
            <section className="space-y-5">
              <div className="glass-strong rounded-[var(--radius-xl)] p-5 sm:p-6">
                <h2 className="heading-section text-xl">Now solve it yourself</h2>
                <p className="mt-2 text-sm text-muted">
                  No step list on this screen. Use what you just learned. If you
                  miss it, we go back through the steps — we do not skip ahead.
                </p>
                <div className="glass mt-4 rounded-[var(--radius-md)] p-4">
                  <p className="font-medium text-ink">{question.prompt}</p>
                  <div className="mt-3 space-y-2">
                    {question.options.map((opt, oi) => (
                      <button
                        key={oi}
                        type="button"
                        disabled={retryFeedback === "right"}
                        onClick={() => {
                          setRetryAnswer(oi);
                          setRetryFeedback("idle");
                        }}
                        className={optionClass(
                          retryAnswer === oi,
                          retryFeedback,
                          oi === question.correctIndex,
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  {retryFeedback === "wrong" && (
                    <p className="mt-3 text-sm" style={{ color: "var(--err)" }}>
                      Not quite. We will walk the steps again so it sticks.
                    </p>
                  )}
                  {retryFeedback === "right" && (
                    <p className="mt-3 text-sm" style={{ color: "var(--ok)" }}>
                      Yes! You solved the original question yourself. Next:{" "}
                      {MASTERY_TARGET} independent practice solves.
                    </p>
                  )}
                </div>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  {retryFeedback !== "right" && (
                    <button
                      type="button"
                      onClick={checkRetry}
                      disabled={retryAnswer === null}
                      className="btn btn-primary"
                    >
                      Check answer
                    </button>
                  )}
                  {retryFeedback === "wrong" && (
                    <button
                      type="button"
                      onClick={reopenTeachingFromRetry}
                      className="btn btn-sky"
                    >
                      Walk through the steps again
                    </button>
                  )}
                  {retryFeedback === "right" && (
                    <button
                      type="button"
                      onClick={afterRetrySuccess}
                      className="btn btn-ok"
                    >
                      Start independent practice ({MASTERY_TARGET} to go)
                    </button>
                  )}
                </div>
              </div>
            </section>
          )}

          {phase === "independent" && currentPractice && (
            <section className="space-y-4 sm:space-y-5">
              <div className="glass-strong rounded-[var(--radius-xl)] p-5 sm:p-6">
                <h2 className="heading-section text-xl">Independent practice</h2>
                <p className="mt-2 text-sm text-muted">
                  Get {MASTERY_TARGET} correct <strong className="text-ink">without</strong>{" "}
                  opening help. If you use help on a question, that solve does
                  not count.
                </p>

                <div className="callout callout-tip mt-4 flex flex-wrap items-center gap-2">
                  <span className="font-bold tabular-nums">
                    {independentSolves}/{MASTERY_TARGET}
                  </span>
                  <span>independent solves locked in</span>
                  {usedHelpOnCurrent && (
                    <span className="badge badge-warn ml-auto">
                      Help used — won’t count
                    </span>
                  )}
                </div>
              </div>

              {!showPracticeHelp ? (
                <div className="glass rounded-[var(--radius-lg)] p-4 sm:p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-soft">
                    Practice {independentSolves + 1} of {MASTERY_TARGET}
                    {usedHelpOnCurrent ? " (uncounted retry)" : ""}
                  </p>
                  <p className="mt-2 font-medium text-ink">
                    {currentPractice.prompt}
                  </p>
                  <div className="mt-3 space-y-2">
                    {currentPractice.options.map((opt, oi) => (
                      <button
                        key={oi}
                        type="button"
                        disabled={practiceFeedback === "right"}
                        onClick={() => {
                          setPracticeAnswer(oi);
                          setPracticeFeedback("idle");
                        }}
                        className={optionClass(
                          practiceAnswer === oi,
                          practiceFeedback,
                          oi === currentPractice.correctIndex,
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  {practiceFeedback === "wrong" && (
                    <p className="mt-3 text-sm" style={{ color: "var(--err)" }}>
                      Not yet. Try again, or open help (help means this question
                      will not count toward your {MASTERY_TARGET}).
                    </p>
                  )}
                  {practiceFeedback === "right" && (
                    <p className="mt-3 text-sm" style={{ color: "var(--ok)" }}>
                      {usedHelpOnCurrent
                        ? "Correct — but help was used, so it doesn’t add to your independent total. Next question."
                        : `Correct — independent total will be ${independentSolves + 1}/${MASTERY_TARGET}.`}
                    </p>
                  )}
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    {practiceFeedback !== "right" && (
                      <>
                        <button
                          type="button"
                          onClick={checkPractice}
                          disabled={practiceAnswer === null}
                          className="btn btn-primary"
                        >
                          Check answer
                        </button>
                        <button
                          type="button"
                          onClick={openPracticeHelp}
                          className="btn btn-ghost"
                        >
                          Help me solve this one
                        </button>
                      </>
                    )}
                    {practiceFeedback === "right" && (
                      <button
                        type="button"
                        onClick={advanceAfterPractice}
                        className="btn btn-ok"
                      >
                        {independentSolves + (usedHelpOnCurrent ? 0 : 1) >=
                        MASTERY_TARGET
                          ? "Finish — return to lesson"
                          : "Next practice question →"}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <PracticeHelpPanel
                  question={currentPractice}
                  stepIndex={practiceHelpStep}
                  onStepChange={setPracticeHelpStep}
                  onReadyToTry={() => {
                    setShowPracticeHelp(false);
                    setPracticeAnswer(null);
                    setPracticeFeedback("idle");
                  }}
                />
              )}
            </section>
          )}

          {phase === "mastered" && (
            <section className="glass-strong space-y-5 rounded-[var(--radius-xl)] p-6 text-center sm:p-8">
              <div
                className="icon-disc mx-auto h-16 w-16 text-3xl"
                style={{
                  background: "var(--ok-soft)",
                  color: "var(--ok)",
                }}
              >
                ✓
              </div>
              <h2 className="heading-display text-2xl sm:text-3xl">
                You can do this yourself
              </h2>
              <p className="text-muted">
                You solved the original question and completed {MASTERY_TARGET}{" "}
                independent practice questions. Time to return to the lesson.
              </p>
              <button
                type="button"
                onClick={finishAndReturn}
                className="btn btn-ok w-full sm:w-auto"
              >
                Return to learning process
              </button>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function PracticeHelpPanel({
  question,
  stepIndex,
  onStepChange,
  onReadyToTry,
}: {
  question: QuizQuestion;
  stepIndex: number;
  onStepChange: (n: number) => void;
  onReadyToTry: () => void;
}) {
  const steps = useMemo(() => buildSolveSteps(question), [question]);
  const step = steps[Math.min(stepIndex, steps.length - 1)];

  return (
    <div className="callout callout-warning space-y-4">
      <p className="text-xs font-bold uppercase tracking-wide opacity-80">
        Help open — this practice question will not count
      </p>
      <p className="text-sm font-medium text-ink">{question.prompt}</p>
      <p className="text-sm font-semibold text-ink">{step.title}</p>
      <div className="whitespace-pre-wrap text-sm leading-relaxed text-muted">
        {step.teaching}
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        {stepIndex < steps.length - 1 ? (
          <button
            type="button"
            onClick={() => onStepChange(stepIndex + 1)}
            className="btn btn-sky"
          >
            Next help step →
          </button>
        ) : (
          <button type="button" onClick={onReadyToTry} className="btn btn-primary">
            Try this question again (still uncounted)
          </button>
        )}
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Quiz } from "@/components/Quiz";
import {
  getThisWeekTest,
  grantWeeklyTestRewards,
  weekKey,
  type RewardEvent,
} from "@/lib/rewards";
import { buildWeeklyTestQuestions } from "@/lib/weekly-test";

export default function WeeklyTestPage() {
  const questions = useMemo(() => buildWeeklyTestQuestions(), []);
  const [existing] = useState(() =>
    typeof window !== "undefined" ? getThisWeekTest() : undefined,
  );
  const [result, setResult] = useState<
    | { percent: number; correct: number; reward: RewardEvent }
    | null
  >(null);
  const [retake, setRetake] = useState(false);

  const alreadyDone = existing && !retake;

  function onComplete(percent: number) {
    const correct = Math.round((percent / 100) * questions.length);
    const reward = grantWeeklyTestRewards(percent, questions.length, correct);
    setResult({ percent, correct, reward });
  }

  return (
    <div className="page-shell page-narrow">
      <Link href="/" className="link-back">
        ← Home
      </Link>

      <header className="glass mt-4 rounded-[var(--radius-xl)] p-5 sm:p-6">
        <p className="text-sm font-medium text-accent">
          Weekly checkpoint · {weekKey()}
        </p>
        <h1 className="heading-display mt-1 text-2xl sm:text-3xl">
          Weekly test
        </h1>
        <p className="mt-2 text-muted">
          12 questions drawn from Year 7 integers + randomised patterns. Score
          70%+ for a pass badge; 90%+ for high distinction. Stars are saved on
          this device.
        </p>
      </header>

      {alreadyDone && !result && (
        <div className="glass-strong mt-6 space-y-4 rounded-[var(--radius-xl)] p-6">
          <h2 className="heading-section text-xl">This week&apos;s result</h2>
          <p className="text-3xl font-bold text-accent">{existing.percent}%</p>
          <p className="text-muted">
            {existing.score}/{existing.total} correct · +{existing.starsEarned}{" "}
            stars
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/rewards" className="btn btn-primary">
              See rewards
            </Link>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setRetake(true)}
            >
              Practise again (score already locked for the week)
            </button>
            <Link href="/year/7/math" className="btn btn-sky">
              Keep learning
            </Link>
          </div>
        </div>
      )}

      {result && (
        <div className="glass-strong mt-6 space-y-4 rounded-[var(--radius-xl)] p-6">
          <h2 className="heading-section text-xl">Test submitted</h2>
          <p className="text-3xl font-bold text-accent">{result.percent}%</p>
          <p className="text-muted">
            {result.correct}/{questions.length} correct
          </p>
          <div className="callout callout-tip">{result.reward.message}</div>
          <div className="flex flex-wrap gap-3">
            <Link href="/rewards" className="btn btn-primary">
              Collect stars & badges
            </Link>
            <Link href="/schedule" className="btn btn-ghost">
              Back to schedule
            </Link>
            <Link href="/year/7/math" className="btn btn-sky">
              Next study block
            </Link>
          </div>
        </div>
      )}

      {(!alreadyDone || retake) && !result && (
        <div className="mt-6">
          <Quiz questions={questions} onComplete={onComplete} />
        </div>
      )}
    </div>
  );
}

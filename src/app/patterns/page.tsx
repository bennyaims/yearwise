"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Quiz } from "@/components/Quiz";
import {
  daySeed,
  generateTeachings,
  makeRng,
  generatePatternQuestions,
  toQuizQuestions,
} from "@/lib/integer-patterns";
import { grantLessonRewards } from "@/lib/rewards";
import { dateKey, getActiveBlock, saveSession } from "@/lib/schedule";

export default function PatternsPage() {
  const [seedBump, setSeedBump] = useState(0);
  const [done, setDone] = useState(false);

  const { teachings, questions } = useMemo(() => {
    const rng = makeRng(daySeed() * 4243 + seedBump * 17);
    return {
      teachings: generateTeachings(4, rng),
      questions: toQuizQuestions(generatePatternQuestions(12, rng)),
    };
  }, [seedBump]);

  function onComplete(score: number) {
    setDone(true);
    const active = getActiveBlock();
    saveSession({
      dateKey: dateKey(),
      blockId: active?.id ?? `patterns-${Date.now()}`,
      lessonKey: "patterns:daily",
      completedAt: new Date().toISOString(),
      minutes: 30,
    });
    grantLessonRewards({
      lessonsCompletedTotal: 5,
      isPatternLesson: true,
      blocksToday: 1,
      distinctStudyDays: 1,
      claimKey: `patterns:${dateKey()}:${seedBump}`,
      quizPercent: score,
      subject: "math",
    });
  }

  return (
    <div className="page-shell page-narrow">
      <Link href="/" className="link-back">
        ← Home
      </Link>
      <header className="glass mt-4 rounded-[var(--radius-xl)] p-5 sm:p-6">
        <p className="text-sm font-medium text-accent">
          30-min randomised drill · Year 7 integers
        </p>
        <h1 className="heading-display mt-1 text-2xl sm:text-3xl">
          Integer patterns
        </h1>
        <p className="mt-2 text-muted">
          Count by any step from negative to positive (and back). Teachings and
          questions reshuffle — today&apos;s set is seeded by the date; tap
          reshuffle for a fresh pack.
        </p>
        <button
          type="button"
          className="btn btn-ghost btn-chip mt-4"
          onClick={() => {
            setSeedBump((n) => n + 1);
            setDone(false);
          }}
        >
          Reshuffle patterns
        </button>
      </header>

      <div className="mt-6 space-y-4">
        {teachings.map((t) => (
          <article
            key={t.id}
            className="glass rounded-[var(--radius-lg)] p-4 sm:p-5"
          >
            <h2 className="font-semibold text-ink">{t.title}</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm text-muted">
              {t.body}
            </p>
            <div className="callout callout-formula mt-3">
              <div className="text-xs font-bold uppercase tracking-wide text-soft">
                Example sequence
              </div>
              <p className="mt-1 font-mono text-base font-semibold text-ink">
                {t.example}
              </p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8">
        {!done ? (
          <Quiz questions={questions} onComplete={onComplete} />
        ) : (
          <div className="glass-strong space-y-4 rounded-[var(--radius-xl)] p-6">
            <h2 className="heading-section text-xl">Patterns block done</h2>
            <p className="text-muted">
              Stars and game coins updated. Spend coins on food, animals and
              characters, or keep studying.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/game/shop" className="btn btn-primary">
                Coin shop
              </Link>
              <Link href="/year/7/math" className="btn btn-sky">
                Year 7 Maths pathway
              </Link>
              <Link href="/weekly-test" className="btn btn-sky">
                Weekly test
              </Link>
              <Link href="/rewards" className="btn btn-ghost">
                View rewards
              </Link>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setSeedBump((n) => n + 1);
                  setDone(false);
                }}
              >
                Another pattern set
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

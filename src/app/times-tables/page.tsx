"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Quiz } from "@/components/Quiz";
import {
  generateTimesTableQuestions,
  makeRng,
  TIMES_STRATEGIES,
  type TimesStrategy,
} from "@/lib/times-tables";
import { grantTestCoins } from "@/lib/game-economy";
import { dateKey, getActiveBlock, saveSession } from "@/lib/schedule";
import { grantLessonRewards } from "@/lib/rewards";

const FACTORS = [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

export default function TimesTablesPage() {
  const [focus, setFocus] = useState<number>(0); // 0 = mixed
  const [seedBump, setSeedBump] = useState(0);
  const [done, setDone] = useState(false);
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [openStrat, setOpenStrat] = useState<string | null>(
    TIMES_STRATEGIES[0]?.id ?? null,
  );

  const questions = useMemo(() => {
    const rng = makeRng(dateKey().split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 13 + seedBump * 97);
    return generateTimesTableQuestions(16, rng, {
      focusFactor: focus === 0 ? undefined : focus,
      maxFactor: 12,
      minFactor: 1,
      includeStrategyQs: true,
    });
  }, [focus, seedBump]);

  const byLevel = useMemo(() => {
    const g: Record<string, TimesStrategy[]> = {
      starter: [],
      builder: [],
      pro: [],
    };
    for (const s of TIMES_STRATEGIES) g[s.level]!.push(s);
    return g;
  }, []);

  function onComplete(percent: number) {
    setDone(true);
    setLastScore(percent);
    const active = getActiveBlock();
    saveSession({
      dateKey: dateKey(),
      blockId: active?.id ?? `times-${Date.now()}`,
      lessonKey: `times-tables:${focus || "mixed"}`,
      completedAt: new Date().toISOString(),
      minutes: 15,
    });
    grantLessonRewards({
      lessonsCompletedTotal: 3,
      isPatternLesson: true,
      blocksToday: 1,
      distinctStudyDays: 1,
      claimKey: `times-tables:${dateKey()}:${focus}:${seedBump}`,
      quizPercent: percent,
      subject: "math",
    });
    grantTestCoins({
      claimKey: `times-tables-coin:${dateKey()}:${focus}:${seedBump}`,
      percent,
      source: "guided",
      subject: "math",
    });
  }

  return (
    <div className="page-shell page-mid space-y-6">
      <Link href="/" className="link-back">
        ← Home
      </Link>

      <header className="glass-strong rounded-[var(--radius-xl)] p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
          Maths · times tables · mental speed
        </p>
        <h1 className="heading-display mt-2 text-3xl sm:text-4xl">
          Times tables gym
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          Get tested on 1–12 facts <strong className="text-ink">and</strong>{" "}
          learn pro ways to work them out in your head — doubles, nines tricks,
          break-ups, square anchors. Fast minds use strategy, not panic.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/patterns" className="btn btn-sky text-sm">
            Integer patterns
          </Link>
          <Link href="/game/geogebra" className="btn btn-ghost text-sm">
            GeoGebra designs
          </Link>
          <Link href="/year/7/math" className="btn btn-ghost text-sm">
            Maths pathway
          </Link>
        </div>
      </header>

      {/* Strategies */}
      <section className="space-y-3">
        <h2 className="heading-section text-xl">Speed strategies (use these)</h2>
        <p className="text-sm text-muted">
          Read a strategy, then drill. When you freeze on a fact, pick one move
          below instead of guessing.
        </p>
        {(["starter", "builder", "pro"] as const).map((level) => (
          <div key={level}>
            <p className="text-xs font-semibold uppercase text-soft mb-2">
              {level === "starter"
                ? "Starter moves"
                : level === "builder"
                  ? "Builder moves"
                  : "Pro moves"}
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {byLevel[level]!.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() =>
                    setOpenStrat((id) => (id === s.id ? null : s.id))
                  }
                  className={`glass rounded-[var(--radius-lg)] p-4 text-left ${
                    openStrat === s.id ? "ring-1 ring-sky-400" : ""
                  }`}
                >
                  <h3 className="font-semibold text-ink">{s.title}</h3>
                  <p className="mt-1 text-sm text-muted">{s.hook}</p>
                  {openStrat === s.id && (
                    <div className="mt-3 space-y-2 text-sm border-t border-[var(--glass-border)] pt-3">
                      <p className="text-muted">{s.body}</p>
                      <div className="callout callout-formula">
                        <div className="text-[10px] font-bold uppercase text-soft">
                          Example
                        </div>
                        <p className="font-mono text-ink mt-1">{s.example}</p>
                      </div>
                      <p className="text-xs text-soft">Helps: {s.helps}</p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Drill controls */}
      <section className="glass rounded-[var(--radius-lg)] p-5 space-y-3">
        <h2 className="heading-section text-lg">Test yourself</h2>
        <p className="text-sm text-muted">
          Mixed grid or focus one table. Includes strategy questions so you
          prove you can choose a fast method.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
              focus === 0
                ? "bg-[var(--sky-soft)] ring-1 ring-sky-400"
                : "bg-[var(--glass-soft)]"
            }`}
            onClick={() => {
              setFocus(0);
              setDone(false);
              setSeedBump((n) => n + 1);
            }}
          >
            Mixed 1–12
          </button>
          {FACTORS.filter((f) => f > 0).map((f) => (
            <button
              key={f}
              type="button"
              className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                focus === f
                  ? "bg-[var(--sky-soft)] ring-1 ring-sky-400"
                  : "bg-[var(--glass-soft)]"
              }`}
              onClick={() => {
                setFocus(f);
                setDone(false);
                setSeedBump((n) => n + 1);
              }}
            >
              {f}× table
            </button>
          ))}
        </div>
        <button
          type="button"
          className="btn btn-ghost text-xs"
          onClick={() => {
            setDone(false);
            setSeedBump((n) => n + 1);
          }}
        >
          New question set
        </button>
      </section>

      {!done ? (
        <Quiz questions={questions} onComplete={onComplete} />
      ) : (
        <div className="glass-strong rounded-[var(--radius-xl)] p-6 space-y-3">
          <h2 className="heading-section text-xl">Drill complete</h2>
          <p className="text-3xl font-bold text-accent">{lastScore}%</p>
          <p className="text-sm text-muted">
            {lastScore != null && lastScore >= 92
              ? "Sharp! Keep using strategies when a fact is not instant."
              : lastScore != null && lastScore >= 70
                ? "Solid. Re-read nines / break-up strategies, then run another set."
                : "Slow is fine while learning. Pick one strategy card, practise 5 facts with it, then retest."}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-primary text-sm"
              onClick={() => {
                setDone(false);
                setSeedBump((n) => n + 1);
              }}
            >
              Another drill
            </button>
            <Link href="/weekly-test" className="btn btn-sky text-sm">
              Weekly test
            </Link>
            <Link href="/year/7/exam" className="btn btn-ghost text-sm">
              Year exam (includes tables)
            </Link>
          </div>
        </div>
      )}

      <section className="callout callout-info text-sm">
        <strong className="text-ink">Curriculum note:</strong> Times tables
        also appear in weekly tests and year exams (including prior-year memory
        questions). Practice here lifts those scores — still finish every
        pathway lesson quiz in order for year progress.
      </section>
    </div>
  );
}

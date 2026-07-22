"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BADGES,
  loadRewards,
  type RewardsState,
} from "@/lib/rewards";

export default function RewardsPage() {
  const [state, setState] = useState<RewardsState | null>(null);

  useEffect(() => {
    setState(loadRewards());
  }, []);

  if (!state) {
    return (
      <div className="page-shell">
        <p className="text-muted">Loading rewards…</p>
      </div>
    );
  }

  return (
    <div className="page-shell page-mid">
      <Link href="/" className="link-back">
        ← Home
      </Link>

      <header className="glass-strong mt-4 rounded-[var(--radius-xl)] p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
          Device rewards
        </p>
        <h1 className="heading-display mt-2 text-3xl">Stars & badges</h1>
        <p className="mt-3 text-4xl font-bold text-accent">
          ⭐ {state.stars}
        </p>
        <p className="mt-2 text-sm text-muted">
          Earn stars by finishing 30-min blocks and weekly tests. Progress stays
          on this device.
        </p>
      </header>

      <section className="mt-8">
        <h2 className="heading-section text-xl">Badges</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {BADGES.map((b) => {
            const unlocked = state.badges.includes(b.id);
            return (
              <div
                key={b.id}
                className={`glass rounded-[var(--radius-lg)] p-4 ${
                  unlocked ? "" : "opacity-45"
                }`}
              >
                <div className="text-2xl">{b.icon}</div>
                <div className="mt-2 font-semibold text-ink">{b.name}</div>
                <p className="mt-1 text-sm text-muted">{b.description}</p>
                <span className={`badge mt-3 ${unlocked ? "badge-ok" : ""}`}>
                  {unlocked ? "Unlocked" : "Locked"}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="heading-section text-xl">Weekly tests</h2>
        {state.weeklyTests.length === 0 ? (
          <p className="mt-3 text-muted">
            No weekly tests yet.{" "}
            <Link href="/weekly-test" className="text-accent underline">
              Take this week&apos;s test
            </Link>
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {[...state.weeklyTests].reverse().map((t) => (
              <li
                key={t.weekKey}
                className="glass flex flex-wrap items-center justify-between gap-2 rounded-[var(--radius-md)] px-4 py-3"
              >
                <span className="font-medium text-ink">{t.weekKey}</span>
                <span className="text-muted">
                  {t.percent}% · {t.score}/{t.total} · +{t.starsEarned}⭐
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/weekly-test" className="btn btn-primary">
          Weekly test
        </Link>
        <Link href="/schedule" className="btn btn-ghost">
          Schedule
        </Link>
      </div>
    </div>
  );
}

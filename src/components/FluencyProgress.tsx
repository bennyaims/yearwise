"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  computeFluencyProgress,
  FLUENCY_PLEDGE,
  FLUENCY_STAGES,
  languagePathway,
  type FluencyProgress as FluencyProgressType,
} from "@/lib/fluency";
import { lessonHref } from "@/lib/pathway";
import { lessonKey, loadProgress } from "@/lib/progress";
import type { LanguageId } from "@/lib/types";

type Props = {
  language: LanguageId;
  languageName: string;
  flag: string;
};

export function FluencyProgressPanel({
  language,
  languageName,
  flag,
}: Props) {
  const [fp, setFp] = useState<FluencyProgressType | null>(null);
  const [nextHref, setNextHref] = useState<string | null>(null);

  useEffect(() => {
    const progress = computeFluencyProgress(language);
    setFp(progress);
    const map = loadProgress();
    const path = languagePathway(language);
    const firstOpen = path.find(
      (l) => !map[lessonKey(l.year, l.subject, l.id, l.language)]?.completed,
    );
    setNextHref(firstOpen ? lessonHref(firstOpen) : null);
  }, [language]);

  if (!fp) {
    return (
      <div className="glass rounded-[var(--radius-lg)] p-4 text-sm text-muted">
        Loading fluency track…
      </div>
    );
  }

  return (
    <section className="glass-strong rounded-[var(--radius-xl)] p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
            Fluency track · Y7 → Y12
          </p>
          <h2 className="heading-section mt-1 text-xl">
            {flag} {languageName}: {fp.fluent ? "Fluent ✓" : "Path to fluency"}
          </h2>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-accent">{fp.percent}%</p>
          <p className="text-xs text-muted">
            {fp.completed}/{fp.total} blocks
          </p>
        </div>
      </div>

      <p className="mt-3 text-sm text-muted">{FLUENCY_PLEDGE}</p>

      <div className="progress-track mt-4">
        <div className="progress-fill" style={{ width: `${fp.percent}%` }} />
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {FLUENCY_STAGES.map((s) => {
          const y = fp.byYear[s.year] ?? { completed: 0, total: 0 };
          const done = y.total > 0 && y.completed >= y.total;
          const current = fp.currentStage.year === s.year && !fp.fluent;
          return (
            <div
              key={s.year}
              className={`glass-soft rounded-[var(--radius-md)] p-3 ${
                done
                  ? "ring-1 ring-[color-mix(in_srgb,var(--ok)_40%,transparent)]"
                  : ""
              } ${
                current
                  ? "ring-1 ring-[color-mix(in_srgb,var(--sky)_50%,transparent)]"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-soft">Y{s.year}</span>
                <span
                  className={`badge ${done ? "badge-ok" : current ? "badge-sky" : ""}`}
                >
                  {done ? "Cleared" : current ? "Now" : s.cefr}
                </span>
              </div>
              <p className="mt-1 text-sm font-semibold text-ink">{s.label}</p>
              <p className="mt-0.5 text-xs text-muted">
                {y.completed}/{y.total} · speak {s.speakingMinutesPerWeek}m/wk
              </p>
            </div>
          );
        })}
      </div>

      {fp.fluent ? (
        <div className="callout callout-tip mt-5">
          <strong>Fluency certified on this device.</strong> You completed the
          pathway and Fluency Exit Gate for {languageName}. Keep using the
          language weekly so it stays automatic.
        </div>
      ) : (
        <div className="mt-5 flex flex-wrap gap-3">
          {nextHref && (
            <Link href={nextHref} className="btn btn-primary">
              Continue fluency pathway →
            </Link>
          )}
          <Link
            href={`/year/12/language/${language}`}
            className="btn btn-ghost"
          >
            Jump to Y12 exit year
          </Link>
        </div>
      )}

      <ul className="mt-4 list-disc space-y-1 pl-5 text-xs text-soft">
        {fp.currentStage.canDo.slice(0, 3).map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
    </section>
  );
}

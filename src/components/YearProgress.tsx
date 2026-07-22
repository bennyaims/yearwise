"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  isYearUnlocked,
  yearProgressReport,
  YEAR_PASS_OVERALL,
  type YearProgressReport,
} from "@/lib/progression";
import type { YearLevel } from "@/lib/types";

export function YearProgress({ year }: { year: YearLevel }) {
  const [report, setReport] = useState<YearProgressReport | null>(null);
  const [yearLock, setYearLock] = useState<{
    unlocked: boolean;
    reason?: string;
  }>({ unlocked: true });

  useEffect(() => {
    setReport(yearProgressReport(year));
    setYearLock(isYearUnlocked(year));
  }, [year]);

  if (!yearLock.unlocked) {
    return (
      <div className="callout callout-warning">
        <p className="font-semibold text-ink">Year {year} locked</p>
        <p className="mt-2 text-sm text-muted">
          {yearLock.reason}
        </p>
        {year > 7 && (
          <Link
            href={`/year/${year - 1}`}
            className="btn btn-primary mt-3 text-xs"
          >
            Open Year {year - 1}
          </Link>
        )}
      </div>
    );
  }

  if (!report) {
    return (
      <div className="glass rounded-[var(--radius-lg)] p-4 text-sm text-muted">
        Loading year progress…
      </div>
    );
  }

  const overall = report.overallPercent;

  return (
    <div className="glass rounded-[var(--radius-lg)] p-4 sm:p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="font-medium text-ink">Year {year} · progression</span>
        <span className="text-muted">
          Overall{" "}
          <strong className="text-ink">
            {overall != null ? `${overall}%` : "—"}
          </strong>{" "}
          · need {YEAR_PASS_OVERALL}%
        </span>
      </div>
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{
            width: `${Math.min(100, overall ?? 0)}%`,
            background:
              overall != null && overall >= YEAR_PASS_OVERALL
                ? "var(--ok)"
                : undefined,
          }}
        />
      </div>

      <ul className="grid gap-2 sm:grid-cols-2 text-xs">
        {report.subjects.map((s) => (
          <li
            key={s.subject}
            className="rounded-lg bg-[var(--glass-soft)] px-3 py-2"
          >
            <span className="font-medium text-ink">{s.name}</span>
            <span className="mt-0.5 block text-muted">
              {s.lessonsDone}/{s.lessonsTotal} quizzes
              {s.averagePercent != null ? ` · avg ${s.averagePercent}%` : ""}
              {s.complete ? " · done" : ""}
            </span>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-2 items-center">
        <Link href={`/year/${year}/exam`} className="btn btn-primary text-xs">
          {report.yearExam
            ? `Year exam: ${report.yearExam.percent}% (retake)`
            : "Sit Year exam (early OK)"}
        </Link>
        {report.canProgressToNextYear && report.nextYear && (
          <Link
            href={`/year/${report.nextYear}`}
            className="btn btn-ok text-xs"
          >
            Year {report.nextYear} unlocked →
          </Link>
        )}
      </div>

      {!report.canProgressToNextYear && report.blockers.length > 0 && (
        <div className="text-xs text-muted">
          <p className="font-semibold text-ink">To unlock the next year:</p>
          <ul className="mt-1 list-disc pl-4 space-y-0.5">
            {report.blockers.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

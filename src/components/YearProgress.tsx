"use client";

import { useEffect, useState } from "react";
import { allLessonKeysForYear } from "@/content/lessons";
import { loadProgress, progressStats } from "@/lib/progress";
import type { YearLevel } from "@/lib/types";

export function YearProgress({ year }: { year: YearLevel }) {
  const [pct, setPct] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const keys = allLessonKeysForYear(year);
    const stats = progressStats(loadProgress(), keys);
    setPct(stats.percent);
    setCompleted(stats.completed);
    setTotal(stats.total);
  }, [year]);

  return (
    <div className="glass rounded-[var(--radius-lg)] p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="font-medium text-ink">Year {year} progress</span>
        <span className="text-muted">
          {completed}/{total} lessons · {pct}%
        </span>
      </div>
      <div className="progress-track mt-3">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

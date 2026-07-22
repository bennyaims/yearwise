"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { isYearUnlocked, YEAR_PASS_OVERALL } from "@/lib/progression";
import type { YearLevel } from "@/lib/types";

/** Hides year curriculum until previous year is fully passed (92% rules). */
export function YearGate({
  year,
  children,
}: {
  year: YearLevel;
  children: React.ReactNode;
}) {
  const [state, setState] = useState<{
    unlocked: boolean;
    reason?: string;
  } | null>(null);

  useEffect(() => {
    setState(isYearUnlocked(year));
  }, [year]);

  if (state === null) {
    return (
      <p className="text-sm text-muted">Checking year access…</p>
    );
  }

  if (!state.unlocked) {
    return (
      <div className="callout callout-warning max-w-2xl">
        <p className="font-semibold text-ink">Year {year} is locked</p>
        <p className="mt-2 text-sm text-muted">{state.reason}</p>
        <p className="mt-2 text-sm text-muted">
          Complete every subject quiz, hold {YEAR_PASS_OVERALL}% overall, and
          pass the Year exam at {YEAR_PASS_OVERALL}%+. No skipping.
        </p>
        {year > 7 && (
          <Link href={`/year/${year - 1}`} className="btn btn-primary mt-4">
            Go to Year {year - 1}
          </Link>
        )}
      </div>
    );
  }

  return <>{children}</>;
}

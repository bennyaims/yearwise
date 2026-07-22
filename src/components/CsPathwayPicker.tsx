"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CS_PATHWAYS,
  getCsPathway,
  type CsPathwayId,
} from "@/content/cs-pathways";
import {
  getCsPathwayForYear,
  setCsPathwayForYear,
  clearCsPathwayForYear,
} from "@/lib/cs-pathway-choice";
import type { YearLevel } from "@/lib/types";

type Props = {
  year: YearLevel;
  /** Called after choice so parent can refresh lessons */
  onChosen?: (id: CsPathwayId) => void;
};

export function CsPathwayPicker({ year, onChosen }: Props) {
  const [chosen, setChosen] = useState<CsPathwayId | null>(null);
  const [confirmChange, setConfirmChange] = useState(false);

  useEffect(() => {
    setChosen(getCsPathwayForYear(year));
  }, [year]);

  function choose(id: CsPathwayId) {
    setCsPathwayForYear(year, id);
    setChosen(id);
    setConfirmChange(false);
    onChosen?.(id);
  }

  const meta = chosen ? getCsPathway(chosen) : null;

  if (chosen && meta && !confirmChange) {
    return (
      <div className="glass-strong rounded-[var(--radius-xl)] p-5 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
          Year {year} CS pathway
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-3xl">{meta.icon}</span>
          <div>
            <h2 className="heading-section text-xl">{meta.name}</h2>
            <p className="text-sm text-muted">{meta.yearlyFocus[year]}</p>
          </div>
        </div>
        <p className="text-sm text-muted">{meta.blurb}</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-ghost text-xs"
            onClick={() => setConfirmChange(true)}
          >
            Change pathway for Year {year}
          </button>
          <Link href="/game/code" className="btn btn-sky text-xs">
            Build Lab coding projects
          </Link>
          {meta.id === "creative" && (
            <Link href="/game/blender" className="btn btn-sky text-xs">
              Blender 3D track
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="glass rounded-[var(--radius-xl)] p-5">
        <h2 className="heading-section text-xl">
          {confirmChange
            ? `Change Year ${year} CS pathway`
            : `Choose your Year ${year} Computer Science pathway`}
        </h2>
        <p className="mt-2 text-sm text-muted">
          Pick one track for this year. You get shared core lessons plus pathway
          electives. You can change later, but you must still finish every quiz
          on the pathway you use — no skipping.
        </p>
        {confirmChange && (
          <button
            type="button"
            className="btn btn-ghost text-xs mt-3"
            onClick={() => setConfirmChange(false)}
          >
            Cancel
          </button>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {CS_PATHWAYS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => choose(p.id)}
            className="glass glass-interactive rounded-[var(--radius-lg)] p-5 text-left"
            style={{
              boxShadow:
                chosen === p.id
                  ? `0 0 0 2px ${p.color}`
                  : undefined,
            }}
          >
            <div className="text-3xl">{p.icon}</div>
            <h3 className="mt-2 font-semibold text-ink">{p.name}</h3>
            <p className="mt-1 text-sm text-muted">{p.blurb}</p>
            <p className="mt-3 text-xs font-medium text-accent">
              This year: {p.yearlyFocus[year]}
            </p>
            <p className="mt-2 text-[11px] text-soft">
              {p.careers.join(" · ")}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

/** Small banner for lesson pages */
export function CsPathwayBadge({ year }: { year: YearLevel }) {
  const [id, setId] = useState<CsPathwayId | null>(null);
  useEffect(() => {
    setId(getCsPathwayForYear(year));
  }, [year]);
  if (!id) return null;
  const meta = getCsPathway(id);
  if (!meta) return null;
  return (
    <p className="text-xs text-soft">
      CS pathway: {meta.icon} {meta.name} ·{" "}
      <Link
        href={`/year/${year}/computerscience`}
        className="text-accent underline"
      >
        change
      </Link>
    </p>
  );
}

export function resetCsPathway(year: YearLevel) {
  clearCsPathwayForYear(year);
}

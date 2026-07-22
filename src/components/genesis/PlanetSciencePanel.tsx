"use client";

import { useMemo } from "react";
import {
  applyOptimalOrbitPackage,
  buildHabitabilityLesson,
  STAR_PHYSICS,
} from "@/lib/genesis/orbital-habitability";
import type { WorldEnv } from "@/lib/genesis/world";

type Props = {
  env: WorldEnv;
  tick?: number;
  onApplyOptimal?: (env: WorldEnv) => void;
};

export function PlanetSciencePanel({ env, tick = 0, onApplyOptimal }: Props) {
  const lesson = useMemo(
    () => buildHabitabilityLesson(env, tick),
    [env, tick],
  );
  const phys = STAR_PHYSICS[env.star];

  const scoreColor =
    lesson.habitabilityScore >= 70
      ? "text-emerald-600 dark:text-emerald-300"
      : lesson.habitabilityScore >= 45
        ? "text-amber-600 dark:text-amber-300"
        : "text-rose-600 dark:text-rose-300";

  return (
    <div className="glass rounded-[var(--radius-lg)] p-4 space-y-3">
      <div>
        <h2 className="heading-section text-base">
          Star &amp; planet science lab
        </h2>
        <p className="mt-1 text-xs text-muted">
          When you pick a <strong className="text-ink">star</strong>, we teach
          how to work out the best{" "}
          <strong className="text-ink">distance</strong>,{" "}
          <strong className="text-ink">year length</strong>,{" "}
          <strong className="text-ink">tilt</strong>, and{" "}
          <strong className="text-ink">planet size</strong> from gravity. There
          is no single “right” home — only clearer reasoning.
        </p>
      </div>

      {/* Score strip */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Mini label="Star" value={phys.label.split("(")[0]!.trim()} />
        <Mini
          label="Habitability"
          value={`${lesson.habitabilityScore}/100`}
          className={scoreColor}
        />
        <Mini label="Band" value={lesson.habitabilityBand} />
        <Mini label="L★ / L☉" value={String(phys.luminosity)} />
      </div>

      <p className="rounded-lg bg-[var(--sky-soft)]/50 px-3 py-2 text-xs leading-relaxed text-ink">
        {lesson.summaryKid}
      </p>

      {/* Key calculated numbers */}
      <div className="rounded-lg bg-[var(--glass-soft)] p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-soft">
          Calculated for this star
        </p>
        <ul className="mt-2 space-y-1.5 text-xs text-muted">
          <li>
            <strong className="text-ink">Habitable zone:</strong>{" "}
            {lesson.hzInnerAu.toFixed(2)} – {lesson.hzOuterAu.toFixed(2)} AU
            (optimal ≈ <strong className="text-ink">{lesson.optimalAu.toFixed(2)} AU</strong>)
          </li>
          <li>
            <strong className="text-ink">Year at optimal orbit:</strong>{" "}
            {lesson.yearAtOptimalEarthYears.toFixed(2)} Earth years
            {lesson.yearAtOptimalEarthYears > 1.2
              ? " (long seasons)"
              : lesson.yearAtOptimalEarthYears < 0.7
                ? " (short year)"
                : " (Earth-like year)"}
          </li>
          <li>
            <strong className="text-ink">Suggested sim year length:</strong>{" "}
            {lesson.suggestedSimYearTicks} ticks (yours: {lesson.simYearTicks})
          </li>
          <li>
            <strong className="text-ink">Planet size from {lesson.gravityG.toFixed(2)} g:</strong>{" "}
            radius ≈ {lesson.planetRadiusEarths.toFixed(2)} R⊕ · mass ≈{" "}
            {lesson.planetMassEarths.toFixed(2)} M⊕ · escape ≈{" "}
            {lesson.escapeVelocityKms.toFixed(1)} km/s
          </li>
          <li>
            <strong className="text-ink">Suggested day length:</strong> ~{" "}
            {lesson.suggestedDayHours.toFixed(0)} hours
          </li>
          <li>
            <strong className="text-ink">Tilt {lesson.axialTiltDeg}°:</strong>{" "}
            {lesson.tiltLesson}
          </li>
          <li>
            <strong className="text-ink">Heat check:</strong> sim ~{" "}
            {lesson.tempSimC.toFixed(0)}°C vs ~{lesson.tempOptimalC.toFixed(0)}°C
            at optimal flux ({lesson.fluxAtOptimal.toFixed(2)}× Earth)
          </li>
        </ul>
      </div>

      {/* Step-by-step method */}
      <details open className="text-xs">
        <summary className="cursor-pointer font-semibold text-ink">
          How to work it out (step by step)
        </summary>
        <ol className="mt-2 space-y-2">
          {lesson.steps.map((s, i) => (
            <li key={s.title} className="rounded-lg bg-[var(--glass-soft)] px-3 py-2">
              <p className="font-semibold text-ink">
                {i + 1}. {s.title.replace(/^\d+ · /, "")}
              </p>
              <p className="mt-0.5 text-muted leading-relaxed">{s.body}</p>
            </li>
          ))}
        </ol>
      </details>

      {lesson.warnings.length > 0 && (
        <div className="rounded-lg border border-amber-400/30 bg-amber-500/10 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
            Science warnings
          </p>
          <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs text-muted">
            {lesson.warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-lg bg-[var(--glass-soft)] p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-soft">
          Essay prompts (use in final write-up)
        </p>
        <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs text-muted">
          {lesson.essayPrompts.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>

      <p className="text-[11px] text-soft">{phys.scienceBlurb}</p>

      {onApplyOptimal && (
        <button
          type="button"
          className="btn btn-sky w-full text-xs"
          onClick={() => onApplyOptimal(applyOptimalOrbitPackage(env))}
        >
          Apply “near-optimal” orbit package for this star
        </button>
      )}
      <p className="text-[10px] text-muted">
        Optimal package nudges year length, softens extreme eccentricity/tilt,
        and eases extreme gravity — it does not change your star choice.
      </p>
    </div>
  );
}

function Mini({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className="rounded-lg bg-[var(--glass-soft)] px-2 py-2 text-center">
      <div className="text-[9px] uppercase tracking-wide text-soft">{label}</div>
      <div className={`truncate text-sm font-bold text-ink ${className}`}>
        {value}
      </div>
    </div>
  );
}
